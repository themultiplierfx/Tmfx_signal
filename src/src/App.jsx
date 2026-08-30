import { useState } from 'react'

function App() {
  const [apiKey, setApiKey] = useState('')

  return (
    <div style={{maxWidth: '900px', margin: '0 auto'}}>
      <h1>TMFX Signal Box</h1>
      <p>Forex Signals with Magic Fibo + 5 Indicators</p>
      
      <div style={{background: '#1a1a1a', padding: '15px', borderRadius: '8px', marginTop: '20px'}}>
        <label><b>Enter Your TwelveData API Key:</b></label>
        <input 
          type="password" 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Paste your API key here"
          style={{width: '100%', padding: '10px', marginTop: '8px', background: '#0a0a0a', color: '#fff', border: '1px solid #333'}}
        />
        <p style={{fontSize: '12px', color: '#888'}}>Your key is only used in your browser. Not saved to Github.</p>
      </div>

      <div style={{marginTop: '20px'}}>
        <p>Status: Waiting for API key...</p>
      </div>
    </div>
  )
}

export default App
