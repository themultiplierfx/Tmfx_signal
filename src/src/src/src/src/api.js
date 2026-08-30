// src/api.js
// Connects to TwelveData API

const API_KEY = import.meta.env.VITE_TWELVE_API_KEY; // We’ll put this in .env later
const BASE_URL = "https://api.twelvedata.com";

export const fetchCandles = async (symbol, interval = "5min", outputsize = 100) => {
  try {
    const url = `${BASE_URL}/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === "error") {
      console.error("API Error:", data.message);
      return null;
    }

    // Flip so oldest is first
    const candles = data.values.reverse();
    
    return {
      symbol,
      opens: candles.map(c => parseFloat(c.open)),
      highs: candles.map(c => parseFloat(c.high)),
      lows: candles.map(c => parseFloat(c.low)),
      closes: candles.map(c => parseFloat(c.close)),
      times: candles.map(c => c.datetime)
    };
  } catch (err) {
    console.error("Fetch failed:", err);
    return null;
  }
};
