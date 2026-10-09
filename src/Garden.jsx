import { useEffect, useRef, useState } from 'react'
import { Garden as GardenEngine, THEMES, FONTS, VINE_KINDS, FLOWER_KINDS, COMPANION_PACKS } from './garden.js'

const COLOR_KEYS = [
  { key: 'vine', label: 'Vines' },
  { key: 'rose', label: 'Flowers' },
  { key: 'text', label: 'Text' },
]

export default function Garden() {
  const canvasRef = useRef(null)
  const inputRef = useRef(null)
  const fileRef = useRef(null)
  const gardenRef = useRef(null)
  const bgUrlRef = useRef(null)
  const [started, setStarted] = useState(false)
  const [sparkles, setSparkles] = useState(true)
  const [panelOpen, setPanelOpen] = useState(false)
  const [themeName, setThemeName] = useState(THEMES[0].name)
  const [fontLabel, setFontLabel] = useState(FONTS[0].label)
  const [bgPreview, setBgPreview] = useState(null)
  const [colors, setColors] = useState({ vine: THEMES[0].vine, rose: THEMES[0].rose, text: THEMES[0].text })
  const [vineKindId, setVineKindId] = useState('mixed')
  const [flowerKindId, setFlowerKindId] = useState('mixed')
  const [packId, setPackId] = useState('off')

  useEffect(() => {
    const garden = new GardenEngine(canvasRef.current)
    gardenRef.current = garden
    window.__garden = garden
    let raf, last = performance.now()
    const loop = (now) => {
      garden.frame((now - last) / 1000)
      last = now
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onResize = () => garden.resize()
    window.addEventListener('resize', onResize)
    if (document.fonts?.ready) document.fonts.ready.then(() => garden.layoutText())

    const focusInput = () => inputRef.current?.focus({ preventScroll: true })

    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const g = gardenRef.current
      if (e.key === 'Backspace') { e.preventDefault(); g.backspace(); setStarted(true); }
      else if (e.key === 'Enter') { e.preventDefault(); g.clearAll(); }
      else if (e.key === ' ') { e.preventDefault(); g.typeChar(' '); setStarted(true); }
      else if (e.key.length === 1) { g.typeChar(e.key); setStarted(true); }
    }
    window.addEventListener('keydown', onKeyDown)
    const input = inputRef.current
    const onInput = (e) => {
      const g = gardenRef.current
      const v = e.target.value
      e.target.value = ''
      for (const ch of v) {
        if (ch === '\n') g.clearAll()
        else { g.typeChar(ch); setStarted(true) }
      }
    }
    const onBeforeInput = (e) => {
      if (e.inputType === 'deleteContentBackward') { gardenRef.current.backspace(); setStarted(true) }
    }
    input.addEventListener('input', onInput)
    input.addEventListener('beforeinput', onBeforeInput)
    const tap = (e) => { if (!e.target.closest('.panel')) focusInput() }
    window.addEventListener('pointerdown', tap)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', tap)
      input.removeEventListener('input', onInput)
      input.removeEventListener('beforeinput', onBeforeInput)
    }
  }, [])

  const toggleSparkles = () => {
    const g = gardenRef.current
    g.sparkles = !g.sparkles
    setSparkles(g.sparkles)
  }

  const selectTheme = (t) => {
    gardenRef.current.setTheme(t)
    setThemeName(t.name)
    setColors({ vine: t.vine, rose: t.rose, text: t.text })
  }

  const onColor = (key, val) => {
    const g = gardenRef.current
    g.setTheme({ ...g.theme, [key]: val })
    setThemeName('Custom')
    setColors((c) => ({ ...c, [key]: val }))
  }

  const selectFont = (f) => {
    gardenRef.current.setFont(f.family, f.weight)
    setFontLabel(f.label)
  }

  const selectVineKind = (id) => {
    gardenRef.current.setVineKind(id)
    setVineKindId(id)
  }

  const selectFlowerKind = (id) => {
    gardenRef.current.setFlowerKind(id)
    setFlowerKindId(id)
  }

  const selectPack = (id) => {
    gardenRef.current.setCompanionPack(id)
    setPackId(id)
  }

  const onBgFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (bgUrlRef.current) URL.revokeObjectURL(bgUrlRef.current)
    const url = URL.createObjectURL(file)
    bgUrlRef.current = url
    const img = new Image()
    img.onload = () => {
      gardenRef.current.setBackground(img)
      setBgPreview(url)
    }
    img.src = url
  }

  const removeBg = () => {
    gardenRef.current.setBackground(null)
    if (bgUrlRef.current) URL.revokeObjectURL(bgUrlRef.current)
    bgUrlRef.current = null
    setBgPreview(null)
  }

  return (
    <div className="stage">
      <canvas ref={canvasRef} />
      <input ref={inputRef} className="ghost-input" autoCapitalize="off" autoCorrect="off" spellCheck={false} aria-label="type to grow" />

      <div className="toolbar">
        <button title="Customize" onClick={() => setPanelOpen((o) => !o)} aria-label="customize" className={panelOpen ? 'on' : ''}>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 8h10M18 8h2M4 16h4M12 16h8"/><circle cx="16" cy="8" r="2.2"/><circle cx="10" cy="16" r="2.2"/></svg>
        </button>
        <button title="Bloom roses" onClick={() => gardenRef.current?.bloomBurst()} aria-label="bloom">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1"/></svg>
        </button>
        <button title="Toggle sparkles" onClick={toggleSparkles} aria-label="sparkles" className={sparkles ? 'on' : ''}>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/><path d="M18.5 15.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z"/></svg>
        </button>
        <button title="Clear garden" onClick={() => gardenRef.current?.clearAll()} aria-label="clear">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M9 7V5h6v2M6.5 7l1 13h9l1-13"/></svg>
        </button>
      </div>

      {panelOpen && (
        <div className="panel" onPointerDown={(e) => e.stopPropagation()}>
          <div className="panel-head">
            <span>Customize</span>
            <button className="x" onClick={() => setPanelOpen(false)} aria-label="close">×</button>
          </div>

          <div className="panel-sec">
            <p className="sec-label">Theme · {themeName}</p>
            <div className="swatches">
              {THEMES.map((t) => (
                <button
                  key={t.name}
                  className={'sw' + (themeName === t.name ? ' active' : '')}
                  title={t.name}
                  onClick={() => selectTheme(t)}
                  style={{ background: t.bg, borderColor: t.vine }}
                >
                  <i style={{ background: t.vine }} />
                  <i style={{ background: t.rose }} />
                </button>
              ))}
            </div>
          </div>

          <div className="panel-sec">
            <p className="sec-label">Background photo</p>
            <div className="bg-row">
              <button className="btn" onClick={() => fileRef.current.click()}>Upload photo</button>
              {bgPreview && (
                <>
                  <img src={bgPreview} className="bg-thumb" alt="background preview" />
                  <button className="btn ghost" onClick={removeBg}>Remove</button>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onBgFile} />
          </div>

          <div className="panel-sec">
            <p className="sec-label">Colors</p>
            {COLOR_KEYS.map(({ key, label }) => (
              <label className="color-row" key={key}>
                <span>{label}</span>
                <input type="color" value={colors[key]} onChange={(e) => onColor(key, e.target.value)} />
              </label>
            ))}
          </div>

          <div className="panel-sec">
            <p className="sec-label">Vines</p>
            <div className="pick-row">
              {VINE_KINDS.map((k) => (
                <button key={k.id} className={'pick' + (vineKindId === k.id ? ' active' : '')} onClick={() => selectVineKind(k.id)}>
                  {k.label}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-sec">
            <p className="sec-label">Flowers</p>
            <div className="pick-row">
              {FLOWER_KINDS.map((k) => (
                <button key={k.id} className={'pick' + (flowerKindId === k.id ? ' active' : '')} onClick={() => selectFlowerKind(k.id)}>
                  {k.label}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-sec">
            <p className="sec-label">Companions</p>
            <div className="pick-row">
              {COMPANION_PACKS.map((p) => (
                <button key={p.id} className={'pick' + (packId === p.id ? ' active' : '')} onClick={() => selectPack(p.id)}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-sec">
            <p className="sec-label">Typeface · {fontLabel}</p>
            <div className="fonts">
              {FONTS.map((f) => (
                <button
                  key={f.label}
                  className={'font-btn' + (fontLabel === f.label ? ' active' : '')}
                  style={{ fontFamily: `"${f.family}", serif` }}
                  onClick={() => selectFont(f)}
                  title={f.family}
                >
                  Ag
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!started && (
        <div className="prompt">
          <span className="caret" />
          start typing
        </div>
      )}

      <div className="hint" style={{ color: colors.text }}>type to grow&ensp;·&ensp;space cuts&ensp;·&ensp;backspace withers&ensp;·&ensp;enter clears</div>
    </div>
  )
}
