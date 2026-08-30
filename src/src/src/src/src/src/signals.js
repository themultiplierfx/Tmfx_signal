// src/signals.js
import pairs from './pairs.json';
import { fetchCandles } from './api.js';
import { getSignalScore } from './indicators.js';

// Scan all pairs and return signals
export const scanAllPairs = async (setProgress) => {
  const results = [];
  let completed = 0;

  for (const pair of pairs) {
    const data = await fetchCandles(pair, "5min", 100); // 5min candles, last 100
    
    if (data) {
      const analysis = getSignalScore(data);
      results.push({
        pair: data.symbol,
        price: data.closes[data.closes.length - 1],
        ...analysis
      });
    }

    completed++;
    if (setProgress) setProgress(Math.round((completed / pairs.length) * 100));
    
    // Rate limit: wait 1s every 8 calls for free TwelveData plan
    if (completed % 8 === 0) await new Promise(r => setTimeout(r, 60000));
  }

  // Sort: STRONG BUY/SELL first
  return results.sort((a, b) => Math.abs(b.score) - Math.abs(a.score));
};
