import { useState } from 'react'
import Garden from './Garden.jsx'
import Cartoons from './Cartoons.jsx'

export default function App() {
  const [mode, setMode] = useState('garden')

  return (
    <div className="app-shell">
      <div className="theme-switch" role="tablist" aria-label="Theme">
        <button
          role="tab"
          aria-selected={mode === 'garden'}
          className={mode === 'garden' ? 'active' : ''}
          onClick={() => setMode('garden')}
        >
          <span className="sw-emoji">🌿</span> Garden
        </button>
        <button
          role="tab"
          aria-selected={mode === 'cartoons'}
          className={mode === 'cartoons' ? 'active' : ''}
          onClick={() => setMode('cartoons')}
        >
          <span className="sw-emoji">🎨</span> Toons
        </button>
      </div>
      {mode === 'garden' ? <Garden /> : <Cartoons />}
    </div>
  )
}
