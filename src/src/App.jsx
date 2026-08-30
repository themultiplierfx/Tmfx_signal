// src/App.jsx
import { useState } from 'react';
import { scanAllPairs } from './signals.js';
import './App.css';

function App() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleScan = async () => {
    setLoading(true);
    setSignals([]);
    setProgress(0);
    const results = await scanAllPairs(setProgress);
    setSignals(results);
    setLoading(false);
  };

  const getCardClass = (signal) => {
    if (signal === "STRONG BUY") return "card strong-buy";
    if (signal === "BUY") return "card buy";
    if (signal === "STRONG SELL") return "card strong-sell";
    if (signal === "SELL") return "card sell";
    return "card";
  };

  return (
    <div className="container">
      <h1>TMFX Signal Dashboard</h1>
      <button className="scan-btn" onClick={handleScan} disabled={loading}>
        {loading ? `Scanning... ${progress}%` : "Scan All 38 Pairs"}
      </button>
      
      {loading && <p className="progress">Scanning pairs... Please wait</p>}

      <div className="grid">
        {signals.map((s) => (
          <div key={s.pair} className={getCardClass(s.signal)}>
            <div className="pair">{s.pair}</div>
            <div className="signal">{s.signal}</div>
            <div className="price">${s.price.toFixed(5)}</div>
            <div className="score">Score: {s.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
