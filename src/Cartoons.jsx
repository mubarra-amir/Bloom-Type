import { useEffect, useRef, useState } from 'react'
import { CartoonEngine, TOON_SKIES, TOON_LETTERS, TOON_PACKS } from './cartoons.js'

export default function Cartoons() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const inputRef = useRef(null)
  const [hasTyped, setHasTyped] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [skyId, setSkyId] = useState('day')
  const [packId, setPackId] = useState('all')
  const [letterId, setLetterId] = useState('rainbow')
  const [confettiOn, setConfettiOn] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    const engine = new CartoonEngine(canvas)
    engineRef.current = engine

    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const g = engineRef.current
      if (!g) return
      if (e.key === 'Backspace') { e.preventDefault(); g.backspace() }
      else if (e.key === 'Enter') { e.preventDefault(); g.clearAll() }
      else if (e.key.length === 1) {
        g.typeChar(e.key)
        setHasTyped((h) => (h ? h : g.hasTyped))
      }
    }
    window.addEventListener('keydown', onKey)

    const onResize = () => engine.resize()
    window.addEventListener('resize', onResize)

    if (document.fonts?.ready) document.fonts.ready.then(() => engine.layoutText())

    let raf, last
    const loop = (now) => {
      const dt = last == null ? 0.016 : (now - last) / 1000
      last = now
      engine.frame(dt)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const focusInput = () => inputRef.current?.focus({ preventScroll: true })
    focusInput()
    const tap = (e) => { if (!e.target.closest('.panel')) focusInput() }
    window.addEventListener('pointerdown', tap)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointerdown', tap)
    }
  }, [])

  const clear = () => engineRef.current?.clearAll()
  const selectSky = (id) => { engineRef.current?.setSky(id); setSkyId(id) }
  const selectPack = (id) => { engineRef.current?.setPack(id); setPackId(id) }
  const selectLetters = (id) => { engineRef.current?.setLetterSet(id); setLetterId(id) }
  const toggleConfetti = () => {
    const next = !confettiOn
    engineRef.current?.setConfetti(next)
    setConfettiOn(next)
  }

  return (
    <div className="stage cartoon-stage">
      <canvas ref={canvasRef} />
      <input
        ref={inputRef}
        className="ghost-input"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Type to play"
      />
      <div className="toolbar cartoon-toolbar">
        <button title="Customize" onClick={() => setPanelOpen((o) => !o)} aria-label="customize" className={panelOpen ? 'on' : ''}>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 8h10M18 8h2M4 16h4M12 16h8"/><circle cx="16" cy="8" r="2.2"/><circle cx="10" cy="16" r="2.2"/></svg>
        </button>
        <button onClick={clear} title="Clear (Enter)" aria-label="Clear">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7" />
          </svg>
        </button>
      </div>

      {panelOpen && (
        <div className="panel" onPointerDown={(e) => e.stopPropagation()}>
          <div className="panel-head">
            <span>Customize</span>
            <button className="x" onClick={() => setPanelOpen(false)} aria-label="close">×</button>
          </div>

          <div className="panel-sec">
            <p className="sec-label">Sky</p>
            <div className="pick-row">
              {TOON_SKIES.map((s) => (
                <button key={s.id} className={'pick' + (skyId === s.id ? ' active' : '')} onClick={() => selectSky(s.id)}>
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-sec">
            <p className="sec-label">Creatures</p>
            <div className="pick-row">
              {TOON_PACKS.map((p) => (
                <button key={p.id} className={'pick' + (packId === p.id ? ' active' : '')} onClick={() => selectPack(p.id)}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-sec">
            <p className="sec-label">Letter colors</p>
            <div className="pick-row">
              {TOON_LETTERS.map((s) => (
                <button key={s.id} className={'pick' + (letterId === s.id ? ' active' : '')} onClick={() => selectLetters(s.id)}>
                  <span className="dots">
                    {s.colors.slice(0, 4).map((c) => (
                      <span key={c} className="dot" style={{ background: c }} />
                    ))}
                  </span>
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-sec">
            <p className="sec-label">Confetti</p>
            <div className="pick-row">
              <button className={'pick' + (confettiOn ? ' active' : '')} onClick={() => { if (!confettiOn) toggleConfetti() }}>
                On
              </button>
              <button className={'pick' + (!confettiOn ? ' active' : '')} onClick={() => { if (confettiOn) toggleConfetti() }}>
                Off
              </button>
            </div>
          </div>
        </div>
      )}

      {!hasTyped && (
        <div className="prompt cartoon-prompt">
          <span className="prompt-word">start typing!</span>
        </div>
      )}
      <p className="hint cartoon-hint">type to play · space poofs · backspace pops · enter clears</p>
    </div>
  )
}
