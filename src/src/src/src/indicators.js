// src/indicators.js
// TMFX Magic Indicators Engine

// Helper: SMA
const sma = (arr, period) => {
  if (arr.length < period) return null;
  const slice = arr.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
};

// Helper: EMA
const ema = (arr, period) => {
  if (arr.length < period) return null;
  let k = 2 / (period + 1);
  let emaVal = sma(arr.slice(0, period), period);
  for (let i = period; i < arr.length; i++) {
    emaVal = arr[i] * k + emaVal * (1 - k);
  }
  return emaVal;
};

// 1. RSI - 14
export const calculateRSI = (closes, period = 14) => {
  if (closes.length < period + 1) return 50;
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    let change = closes[i] - closes[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  let rs = gains / (losses || 1);
  return 100 - (100 / (1 + rs));
};

// 2. MACD - 12,26,9
export const calculateMACD = (closes) => {
  const ema12 = ema(closes, 12);
  const ema26 = ema(closes, 26);
  if (!ema12 ||!ema26) return { macd: 0, signal: 0 };
  const macd = ema12 - ema26;
  return { macd, signal: ema([macd], 9) || 0 };
};

// 3. Stochastic - 14,3
export const calculateStoch = (highs, lows, closes, period = 14) => {
  if (closes.length < period) return 50;
  const recentHigh = Math.max(...highs.slice(-period));
  const recentLow = Math.min(...lows.slice(-period));
  const currentClose = closes[closes.length - 1];
  return ((currentClose - recentLow) / (recentHigh - recentLow || 1)) * 100;
};

// 4. Bollinger Bands - 20,2
export const calculateBB = (closes, period = 20, stdDev = 2) => {
  if (closes.length < period) return { upper: 0, middle: 0, lower: 0 };
  const middle = sma(closes, period);
  const slice = closes.slice(-period);
  const variance = slice.reduce((sum, val) => sum + (val - middle) ** 2, 0) / period;
  const std = Math.sqrt(variance);
  return {
    upper: middle + stdDev * std,
    middle,
    lower: middle - stdDev * std
  };
};

// 5. MAGIC FIBO - Uses last 100 candles to find swing high/low
export const calculateMagicFibo = (highs, lows) => {
  if (highs.length < 50) return null;
  const swingHigh = Math.max(...highs.slice(-100));
  const swingLow = Math.min(...lows.slice(-100));
  const diff = swingHigh - swingLow;

  return {
    level_0618: swingHigh - diff * 0.618,
    level_0500: swingHigh - diff * 0.5,
    level_0382: swingHigh - diff * 0.382,
    high: swingHigh,
    low: swingLow
  };
};

// FINAL: Score all indicators
export const getSignalScore = (data) => {
  const { opens, highs, lows, closes } = data;
  let score = 0;

  const rsi = calculateRSI(closes);
  const macd = calculateMACD(closes);
  const stoch = calculateStoch(highs, lows, closes);
  const bb = calculateBB(closes);
  const fibo = calculateMagicFibo(highs, lows);
  const lastPrice = closes[closes.length - 1];

  // RSI Logic
  if (rsi < 30) score += 1; // Oversold = Buy
  if (rsi > 70) score -= 1; // Overbought = Sell

  // MACD Logic
  if (macd.macd > macd.signal) score += 1;
  if (macd.macd < macd.signal) score -= 1;

  // Stoch Logic
  if (stoch < 20) score += 1;
  if (stoch > 80) score -= 1;

  // BB Logic
  if (lastPrice < bb.lower) score += 1;
  if (lastPrice > bb.upper) score -= 1;

  // MAGIC FIBO Logic
  if (fibo) {
    if (lastPrice <= fibo.level_0618) score += 2; // Strong Buy Zone
    if (lastPrice >= fibo.level_0382) score -= 2; // Strong Sell Zone
  }

  let signal = "WAIT";
  if (score >= 3) signal = "STRONG BUY";
  else if (score >= 1) signal = "BUY";
  else if (score <= -3) signal = "STRONG SELL";
  else if (score <= -1) signal = "SELL";

  return { signal, score, rsi, macd, stoch, bb, fibo };
};
