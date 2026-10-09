// Bloomtype — garden engine.
// Type and vines grow around your words. Space cuts, backspace withers, enter clears.

import { TAU, rand, clamp, lerp, hexLerp, hexA, easeOutBack, easeOutCubic } from './utils.js';
import { drawCreature, randomCompanion, COMPANION_PACKS } from './creatures.js';
export { COMPANION_PACKS };

// Every drawable color lives in the theme so the whole garden re-skins live.
export const THEMES = [
  { name: 'Midnight', bg: '#060a16', glow: 'rgba(20,32,70,0.35)', vine: '#2f6bff', vineDeep: '#1e40c8', leaf: '#3f7dff', leafEdge: '#7aa5ff', rose: '#ff2e2e', roseDeep: '#b31217', roseLine: '#ffd7d7', text: '#f5f2ea', textGlow: 'rgba(245,242,234,0.25)', wither: '#6e4a2c', pollen: '#9db9ff', spark: '#bcd0ff' },
  { name: 'Forest', bg: '#07130c', glow: 'rgba(20,80,50,0.30)', vine: '#4ade80', vineDeep: '#16a34a', leaf: '#5eea8d', leafEdge: '#a7f3c7', rose: '#ff5d5d', roseDeep: '#b3122e', roseLine: '#ffd7d7', text: '#eef7ee', textGlow: 'rgba(238,247,238,0.22)', wither: '#6e4a2c', pollen: '#a7f3c7', spark: '#d1fae5' },
  { name: 'Ocean', bg: '#04202b', glow: 'rgba(14,80,110,0.35)', vine: '#22d3ee', vineDeep: '#0e7490', leaf: '#4be1f5', leafEdge: '#a5f3fc', rose: '#fb7185', roseDeep: '#be123c', roseLine: '#ffe4e6', text: '#eafcff', textGlow: 'rgba(234,252,255,0.22)', wither: '#6e5a2c', pollen: '#a5f3fc', spark: '#cffafe' },
  { name: 'Sunset', bg: '#1d0f1e', glow: 'rgba(120,40,60,0.35)', vine: '#fb923c', vineDeep: '#c2410c', leaf: '#fda95c', leafEdge: '#fed7aa', rose: '#ff2e63', roseDeep: '#a4133c', roseLine: '#ffd7e2', text: '#fff3e6', textGlow: 'rgba(255,243,230,0.22)', wither: '#6e4a2c', pollen: '#fed7aa', spark: '#ffedd5' },
  { name: 'Lavender', bg: '#141021', glow: 'rgba(80,50,140,0.35)', vine: '#a78bfa', vineDeep: '#7c3aed', leaf: '#bda9fb', leafEdge: '#ddd6fe', rose: '#f472b6', roseDeep: '#be185d', roseLine: '#fbcfe8', text: '#f3efff', textGlow: 'rgba(243,239,255,0.22)', wither: '#6e4a5c', pollen: '#ddd6fe', spark: '#ede9fe' },
  { name: 'Aurora', bg: '#04141a', glow: 'rgba(20,110,100,0.30)', vine: '#5eead4', vineDeep: '#0f766e', leaf: '#7ef0dd', leafEdge: '#99f6e4', rose: '#f9a8d4', roseDeep: '#be185d', roseLine: '#fbcfe8', text: '#ecfeff', textGlow: 'rgba(236,254,255,0.22)', wither: '#6e5a2c', pollen: '#99f6e4', spark: '#ccfbf1' },
  { name: 'Royal', bg: '#12081f', glow: 'rgba(90,40,140,0.35)', vine: '#c084fc', vineDeep: '#9333ea', leaf: '#cfa8fd', leafEdge: '#e9d5ff', rose: '#ff3d5e', roseDeep: '#b3123a', roseLine: '#ffd7de', text: '#f7f0ff', textGlow: 'rgba(247,240,255,0.22)', wither: '#6e4a5c', pollen: '#e9d5ff', spark: '#f3e8ff' },
  { name: 'Mono', bg: '#0a0a0a', glow: 'rgba(60,60,70,0.30)', vine: '#d4d4d4', vineDeep: '#737373', leaf: '#e0e0e0', leafEdge: '#f5f5f5', rose: '#e8e8e8', roseDeep: '#555555', roseLine: '#ffffff', text: '#ffffff', textGlow: 'rgba(255,255,255,0.20)', wither: '#57534e', pollen: '#d4d4d4', spark: '#f5f5f5' },
  { name: 'Candy', bg: '#200a26', glow: 'rgba(150,50,150,0.30)', vine: '#f0abfc', vineDeep: '#c026d3', leaf: '#f4bdfc', leafEdge: '#fae8ff', rose: '#ff7ac6', roseDeep: '#c2145e', roseLine: '#ffd7ec', text: '#fff0f9', textGlow: 'rgba(255,240,249,0.22)', wither: '#6e4a5c', pollen: '#fae8ff', spark: '#fce7f3' },
  { name: 'Dawn', bg: '#faf3e8', glow: 'rgba(255,220,170,0.50)', vine: '#3a7d44', vineDeep: '#1f5c2c', leaf: '#4c9a57', leafEdge: '#86c98f', rose: '#e23e57', roseDeep: '#9c1f36', roseLine: '#ffd9de', text: '#2b2118', textGlow: 'rgba(43,33,24,0.12)', wither: '#8a6a4a', pollen: '#c9b88f', spark: '#fff7d6' },
  { name: 'Desert', bg: '#f6ead6', glow: 'rgba(230,190,130,0.50)', vine: '#5b8c1f', vineDeep: '#3f6212', leaf: '#74a832', leafEdge: '#a5c97b', rose: '#dc2626', roseDeep: '#991b1b', roseLine: '#fecaca', text: '#3f2d1c', textGlow: 'rgba(63,45,28,0.12)', wither: '#8a6a4a', pollen: '#d6bd8a', spark: '#fef3c7' },
  { name: 'Rosewood', bg: '#170b10', glow: 'rgba(120,30,50,0.35)', vine: '#d98aa5', vineDeep: '#a34a68', leaf: '#e3a4b8', leafEdge: '#f5cbd8', rose: '#ff4d6d', roseDeep: '#a4133c', roseLine: '#ffd7de', text: '#fff0f3', textGlow: 'rgba(255,240,243,0.22)', wither: '#6e4a4a', pollen: '#f5cbd8', spark: '#ffe4e6' },
  { name: 'Spooky', bg: '#0e0817', glow: 'rgba(120,60,160,0.35)', vine: '#8b5cf6', vineDeep: '#5b21b6', leaf: '#a78bfa', leafEdge: '#c4b5fd', rose: '#ff7b1c', roseDeep: '#c2410c', roseLine: '#fed7aa', text: '#f5ead9', textGlow: 'rgba(255,180,100,0.28)', wither: '#6e4a5c', pollen: '#c4b5fd', spark: '#ede9fe' },
  { name: 'Pastel', bg: '#fdf0f5', glow: 'rgba(255,200,220,0.50)', vine: '#f9a8d4', vineDeep: '#db2777', leaf: '#f9a8d4', leafEdge: '#fbcfe8', rose: '#fb7185', roseDeep: '#be123c', roseLine: '#ffe4e6', text: '#4a2b3a', textGlow: 'rgba(74,43,58,0.15)', wither: '#a08a90', pollen: '#f0c8d8', spark: '#fff0f5' },
];

export const FONTS = [
  { family: 'Bodoni Moda', weight: 900, label: 'Bodoni' },
  { family: 'Playfair Display', weight: 800, label: 'Playfair' },
  { family: 'Abril Fatface', weight: 400, label: 'Abril' },
  { family: 'Cormorant Garamond', weight: 600, label: 'Cormorant' },
  { family: 'DM Serif Display', weight: 400, label: 'DM Serif' },
  { family: 'Italiana', weight: 400, label: 'Italiana' },
  { family: 'Cinzel', weight: 700, label: 'Cinzel' },
  { family: 'Marcellus', weight: 400, label: 'Marcellus' },
  { family: 'Great Vibes', weight: 400, label: 'Vibes' },
  { family: 'Pinyon Script', weight: 400, label: 'Pinyon' },
  { family: 'Dancing Script', weight: 600, label: 'Dancing' },
];

export const VINE_KINDS = [
  { id: 'mixed', label: 'Mixed' },
  { id: 'classic', label: 'Classic', curl: 2.4, upBias: 0.72, leafEvery: 26, leaf: [11, 24], width: [2.4, 3.6], speed: [55, 95], len: [120, 300], style: 'pointed' },
  { id: 'ivy', label: 'Ivy', curl: 3.6, upBias: 0.5, leafEvery: 15, leaf: [8, 14], width: [1.8, 2.6], speed: [50, 80], len: [100, 220], style: 'round' },
  { id: 'bramble', label: 'Bramble', curl: 1.1, upBias: 0.6, leafEvery: 34, leaf: [9, 16], width: [2.8, 4.2], speed: [60, 90], len: [140, 280], style: 'thorn' },
  { id: 'willow', label: 'Willow', curl: 1.4, upBias: 0.12, leafEvery: 20, leaf: [13, 20], width: [1.6, 2.4], speed: [55, 85], len: [150, 320], style: 'long' },
  { id: 'fern', label: 'Fern', curl: 2.0, upBias: 0.65, leafEvery: 11, leaf: [5, 9], width: [1.4, 2.0], speed: [50, 80], len: [90, 200], style: 'leaflet' },
];

export const FLOWER_KINDS = [
  { id: 'mixed', label: 'Mixed' },
  { id: 'rose', label: 'Rose' },
  { id: 'tulip', label: 'Tulip' },
  { id: 'daisy', label: 'Daisy' },
  { id: 'blossom', label: 'Blossom' },
  { id: 'lavender', label: 'Lavender' },
];

const FLOWER_IDS = ['rose', 'tulip', 'daisy', 'blossom', 'lavender'];
const VINE_IDS = ['classic', 'classic', 'ivy', 'bramble', 'willow', 'fern'];



export class Garden {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.text = '';
    this.chars = [];       // {ch, cx, cy, w, size}
    this.fontSize = 150;
    this.vines = [];
    this.leaves = [];
    this.flowers = [];
    this.butterflies = [];
    this.particles = [];
    this.time = 0;
    this.vineSeq = 0;
    this.sparkles = true;
    this.hasTyped = false;
    this.theme = { ...THEMES[0] };
    this.bgImage = null;
    this.bgDim = 0.45;
    this.fontFamily = 'Bodoni Moda';
    this.fontWeight = 900;
    this.vineKind = 'mixed';
    this.flowerKind = 'mixed';
    this.companions = [];
    this.companionPack = 'off';
    this.resize();
    this.seedAmbient();
  }

  setTheme(t) { this.theme = { ...t }; }
  setFont(family, weight) {
    this.fontFamily = family;
    this.fontWeight = weight;
    const spec = `${weight} 80px "${family}"`;
    const relayout = () => this.layoutText();
    if (document.fonts?.load) document.fonts.load(spec).then(relayout).catch(relayout);
    else relayout();
  }
  setBackground(img) { this.bgImage = img; }
  setVineKind(id) {
    this.vineKind = id;
    if (id === 'mixed') return;
    const K = VINE_KINDS.find((k) => k.id === id);
    // transform the whole living garden, not just future growth
    for (const v of this.vines) {
      v.kind = id;
      v.leafStyle = K.style;
      v.leafEvery = K.leafEvery;
      v.leafSize = K.leaf;
      v.curlMax = K.curl;
    }
    for (const l of this.leaves) {
      l.style = K.style;
      l.isThorn = K.style === 'thorn' && Math.random() < 0.35;
      if (!l.isThorn) l.size = rand(K.leaf[0], K.leaf[1]);
    }
  }
  setFlowerKind(id) {
    this.flowerKind = id;
    if (id === 'mixed') return;
    for (const f of this.flowers) f.kind = id;
  }
  setCompanionPack(id) {
    this.companionPack = id;
    if (id === 'off') {
      for (const cp of this.companions) { if (!cp.withering) { cp.withering = true; cp.witherT = 0; } }
    }
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.canvas.width = this.W * dpr;
    this.canvas.height = this.H * dpr;
    this.canvas.style.width = this.W + 'px';
    this.canvas.style.height = this.H + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.layoutText();
  }

  font(size) { return `${this.fontWeight} ${size}px "${this.fontFamily}", "Didot", serif`; }

  // ---- text layout -------------------------------------------------------
  layoutText() {
    const ctx = this.ctx;
    const maxW = this.W * 0.88;
    let size = Math.min(170, this.H * 0.24);
    ctx.font = this.font(size);
    const w = ctx.measureText(this.text).width;
    if (w > maxW && this.text.length) {
      size = Math.max(34, size * (maxW / w));
      ctx.font = this.font(size);
    }
    const old = new Map(this.chars.map((c, i) => [i, c]));
    this.fontSize = size;
    this.chars = [];
    const total = ctx.measureText(this.text).width;
    let x = (this.W - total) / 2;
    const cy = this.H * 0.47;
    for (let i = 0; i < this.text.length; i++) {
      const ch = this.text[i];
      const cw = ctx.measureText(ch).width;
      this.chars.push({ ch, cx: x + cw / 2, cy, w: cw, size });
      x += cw;
    }
    // translate vines anchored to chars that moved
    for (const v of this.vines) {
      const now = this.chars[v.anchorChar];
      const prev = old.get(v.anchorChar);
      if (now && prev) {
        const dx = now.cx - prev.cx, dy = now.cy - prev.cy;
        if (dx || dy) {
          for (const p of v.pts) { p.x += dx; p.y += dy; }
          v.anchorX += dx; v.anchorY += dy;
        }
      }
    }
    // companions follow their anchor char too
    for (const cp of this.companions) {
      const now = this.chars[cp.anchorChar];
      const prev = old.get(cp.anchorChar);
      if (now && prev) { cp.x += now.cx - prev.cx; cp.y += now.cy - prev.cy; }
    }
  }

  charCenter(i) {
    const c = this.chars[i];
    return c ? { x: c.cx, y: c.cy - c.size * 0.32 } : { x: this.W / 2, y: this.H * 0.4 };
  }

  // ---- input -------------------------------------------------------------
  typeChar(ch) {
    if (ch === ' ') return this.cut();
    if (ch === '\n' || ch === '\r') return this.clearAll();
    if (this.text.length > 60) return;
    this.hasTyped = true;
    this.text += ch;
    this.layoutText();
    const i = this.text.length - 1;
    const c = this.charCenter(i);
    const n = 2 + (Math.random() < 0.55 ? 1 : 0);
    for (let k = 0; k < n; k++) this.spawnVine(i, c);
    if (this.companionPack !== 'off' && Math.random() < 0.65) this.spawnCompanion(i);
    // a couple of sparkles at the glyph
    for (let k = 0; k < 3; k++) {
      this.particles.push({
        type: 'spark', x: c.x + rand(-40, 40), y: c.y + rand(-50, 50),
        vx: rand(-12, 12), vy: rand(-22, -6), life: 0, max: rand(0.6, 1.1), size: rand(1, 2.4),
      });
    }
  }

  cut() {
    // space: snip every growing vine, then add the space
    let cutAny = false;
    for (const v of this.vines) {
      if (v.growing && !v.withering) {
        v.growing = false;
        cutAny = true;
        const tip = v.pts[v.pts.length - 1];
        for (let k = 0; k < 4; k++) {
          this.particles.push({
            type: 'leafbit', x: tip.x, y: tip.y,
            vx: rand(-40, 40), vy: rand(-70, -10), life: 0, max: rand(0.7, 1.2),
            size: rand(3, 7), rot: rand(0, TAU), vr: rand(-6, 6),
          });
        }
      }
    }
    if (this.text.length > 60) return;
    this.hasTyped = true;
    this.text += ' ';
    this.layoutText();
    if (cutAny && this.text.length > 1) {
      const c = this.charCenter(this.text.length - 1);
      this.spawnVine(this.text.length - 1, { x: c.x, y: c.y + rand(-30, 30) });
    }
  }

  backspace() {
    if (!this.text.length) return;
    const i = this.text.length - 1;
    this.text = this.text.slice(0, -1);
    this.layoutText();
    for (const v of this.vines) {
      if (v.anchorChar === i && !v.withering) {
        v.withering = true; v.witherT = 0; v.growing = false;
      }
    }
    for (const l of this.leaves) {
      if (l.vine.anchorChar === i) l.withering = true;
    }
    for (const r of this.flowers) {
      if (r.vine.anchorChar === i) r.withering = true;
    }
    for (const cp of this.companions) {
      if (cp.anchorChar === i && !cp.withering) { cp.withering = true; cp.witherT = 0; }
    }
    const c = this.charCenter(Math.max(0, i - 1));
    for (let k = 0; k < 6; k++) {
      this.particles.push({
        type: 'wither', x: c.x + rand(-30, 30), y: c.y + rand(-40, 40),
        vx: rand(-14, 14), vy: rand(8, 30), life: 0, max: rand(0.8, 1.4), size: rand(2, 5),
      });
    }
    // re-anchor vines that pointed past the removed char
    for (const v of this.vines) if (v.anchorChar > i) v.anchorChar = Math.max(0, this.text.length - 1);
  }

  clearAll() {
    for (const v of this.vines) { if (!v.withering) { v.withering = true; v.witherT = 0; v.growing = false; } }
    for (const l of this.leaves) l.withering = true;
    for (const r of this.flowers) r.withering = true;
    for (const cp of this.companions) { if (!cp.withering) { cp.withering = true; cp.witherT = 0; } }
    this.text = '';
    this.layoutText();
    for (const b of this.butterflies) { b.scatter = 1.2; }
  }

  bloomBurst() {
    // toolbar: force roses on mature vines
    const mature = this.vines.filter((v) => !v.withering && v.pts.length > 24 && v.flowerCount < 2);
    for (const v of mature.slice(0, 8)) this.spawnFlower(v, v.pts.length - 1 - Math.floor(rand(2, 10)));
  }

  // ---- spawning ----------------------------------------------------------
  spawnVine(charIndex, at) {
    const c = this.chars[charIndex];
    const spread = c ? c.size * 0.5 : 60;
    const sx = at.x + rand(-spread * 0.5, spread * 0.5);
    const sy = at.y + rand(-spread * 0.4, spread * 0.4);
    const kindId = this.vineKind === 'mixed'
      ? VINE_IDS[Math.floor(Math.random() * VINE_IDS.length)]
      : this.vineKind;
    const K = VINE_KINDS.find((k) => k.id === kindId);
    const up = Math.random() < K.upBias;
    const ang = up ? -Math.PI / 2 + rand(-0.9, 0.9)
      : kindId === 'willow' ? Math.PI / 2 + rand(-0.7, 0.7)
      : rand(0, TAU);
    this.vines.push({
      id: this.vineSeq++,
      kind: kindId,
      pts: [{ x: sx, y: sy }],
      angle: ang,
      curl: rand(-1, 1) * K.curl,
      curlTarget: rand(-1, 1) * K.curl,
      curlMax: K.curl,
      speed: rand(K.speed[0], K.speed[1]),
      maxLen: rand(K.len[0], K.len[1]),
      traveled: 0,
      growing: true,
      withering: false, witherT: 0, alpha: 1,
      anchorChar: charIndex, anchorX: sx, anchorY: sy,
      phase: rand(0, TAU),
      leafDist: 0, leafSide: Math.random() < 0.5 ? 1 : -1,
      leafEvery: K.leafEvery, leafSize: K.leaf, leafStyle: K.style,
      flowerCount: 0,
      width: rand(K.width[0], K.width[1]),
    });
  }

  spawnLeaf(vine, idx) {
    vine.leafSide *= -1;
    this.leaves.push({
      vine, idx,
      side: vine.leafSide,
      size: rand(vine.leafSize[0], vine.leafSize[1]),
      style: vine.leafStyle,
      isThorn: vine.leafStyle === 'thorn' && Math.random() < 0.35,
      bend: rand(0.85, 1.25),
      born: this.time,
      withering: false,
    });
  }

  spawnFlower(vine, idx) {
    const p = vine.pts[clamp(idx, 0, vine.pts.length - 1)];
    const kind = this.flowerKind === 'mixed'
      ? FLOWER_IDS[Math.floor(Math.random() * FLOWER_IDS.length)]
      : this.flowerKind;
    vine.flowerCount++;
    this.flowers.push({
      vine, idx, kind,
      dx: rand(-4, 4), dy: rand(-4, 4),
      r: kind === 'lavender' ? rand(10, 16) : rand(13, 26),
      bloom: 0, withering: false, fade: 1,
      phase: rand(0, TAU),
      rot: rand(0, TAU),
    });
  }

  // ---- companions ----------------------------------------------------------
  spawnCompanion(charIndex) {
    const pack = COMPANION_PACKS.find((p) => p.id === this.companionPack);
    if (!pack || !pack.creatures) return;
    const alive = this.companions.filter((c) => !c.withering);
    if (alive.length >= 14) { const o = alive[0]; o.withering = true; o.witherT = 0; }
    const kind = pack.creatures[Math.floor(Math.random() * pack.creatures.length)];
    const c = this.charCenter(charIndex);
    const cp = randomCompanion(kind, c.x + rand(-110, 110), c.y + rand(-90, 70), rand(24, 38), this.time);
    cp.anchorChar = charIndex;
    this.companions.push(cp);
  }

  seedAmbient() {
    for (let i = 0; i < 6; i++) {
      this.butterflies.push({
        x: rand(0, 1600), y: rand(0, 900),
        vx: rand(-20, 20), vy: rand(-20, 20),
        flap: rand(0, TAU), size: rand(7, 12),
        scatter: 0, tx: rand(0, 1600), ty: rand(0, 900), retarget: rand(2, 5),
      });
    }
    for (let i = 0; i < 26; i++) {
      this.particles.push({
        type: 'pollen', x: rand(0, 2000), y: rand(0, 1200),
        vx: rand(-8, 8), vy: rand(-10, -3), life: rand(0, 6), max: 1e9,
        size: rand(0.8, 2), tw: rand(0, TAU),
      });
    }
  }

  // ---- update ------------------------------------------------------------
  update(dt) {
    this.time += dt;
    const t = this.time;

    // vines grow
    for (const v of this.vines) {
      if (v.withering) {
        v.witherT += dt / 1.5;
        if (v.witherT >= 1) v.alpha -= dt * 1.4;
        continue;
      }
      if (!v.growing) continue;
      v.curlTarget += rand(-1, 1) * 3 * dt;
      v.curlTarget = clamp(v.curlTarget, -v.curlMax, v.curlMax);
      v.curl = lerp(v.curl, v.curlTarget, 1 - Math.exp(-3 * dt));
      v.angle += v.curl * dt;
      const step = v.speed * dt;
      const tip = v.pts[v.pts.length - 1];
      const nx = tip.x + Math.cos(v.angle) * step;
      const ny = tip.y + Math.sin(v.angle) * step;
      v.pts.push({ x: nx, y: ny });
      v.traveled += step;
      v.leafDist += step;
      if (v.leafDist > v.leafEvery && v.pts.length > 6) {
        v.leafDist = 0;
        if (v.traveled > 70 && v.flowerCount < 2 && Math.random() < 0.14) {
          this.spawnFlower(v, v.pts.length - 1);
        } else {
          this.spawnLeaf(v, v.pts.length - 1);
        }
      }
      if (v.traveled >= v.maxLen || v.pts.length > 260) {
        v.growing = false;
        if (v.flowerCount === 0 && Math.random() < 0.75) this.spawnFlower(v, v.pts.length - 1);
      }
    }
    // cull dead vines
    for (let i = this.vines.length - 1; i >= 0; i--) {
      if (this.vines[i].alpha <= 0) {
        const v = this.vines[i];
        this.leaves = this.leaves.filter((l) => l.vine !== v);
        this.flowers = this.flowers.filter((r) => r.vine !== v);
        this.vines.splice(i, 1);
      }
    }

    // roses bloom / fade
    for (let i = this.flowers.length - 1; i >= 0; i--) {
      const r = this.flowers[i];
      if (r.withering) {
        r.fade -= dt * 1.2;
        if (r.fade <= 0) this.flowers.splice(i, 1);
      } else if (r.bloom < 1) {
        r.bloom = Math.min(1, r.bloom + dt / 1.3);
      }
    }

    // companions: blink, wither, cull
    for (let i = this.companions.length - 1; i >= 0; i--) {
      const cp = this.companions[i];
      cp.blinkT -= dt;
      if (cp.blinkT < -0.18) cp.blinkT = rand(2, 5);
      if (cp.withering) {
        cp.witherT += dt / 0.8;
        cp.alpha = Math.max(0, 1 - cp.witherT);
        if (cp.witherT >= 1) this.companions.splice(i, 1);
      }
    }

    // butterflies
    for (const b of this.butterflies) {
      b.flap += dt * 22;
      b.retarget -= dt;
      if (b.scatter > 0) {
        b.scatter -= dt;
        b.vy -= 60 * dt;
      } else if (b.retarget <= 0) {
        b.retarget = rand(2, 6);
        // drift toward a rose sometimes
        const live = this.flowers.filter((r) => !r.withering && r.bloom > 0.7);
        if (live.length && Math.random() < 0.6) {
          const r = live[Math.floor(Math.random() * live.length)];
          const p = r.vine.pts[clamp(r.idx, 0, r.vine.pts.length - 1)];
          b.tx = p.x + rand(-70, 70); b.ty = p.y + rand(-70, 70);
        } else {
          b.tx = rand(0, this.W); b.ty = rand(this.H * 0.15, this.H * 0.85);
        }
      }
      const dx = b.tx - b.x, dy = b.ty - b.y;
      const d = Math.hypot(dx, dy) || 1;
      b.vx = lerp(b.vx, (dx / d) * 46, 1 - Math.exp(-1.6 * dt));
      b.vy = lerp(b.vy, (dy / d) * 46, 1 - Math.exp(-1.6 * dt));
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.x < -40) b.x = this.W + 40; if (b.x > this.W + 40) b.x = -40;
      if (b.y < -40) b.y = this.H + 40; if (b.y > this.H + 40) b.y = -40;
    }

    // particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.type === 'pollen') {
        p.x += (p.vx + Math.sin(t * 0.6 + p.tw) * 6) * dt;
        p.y += p.vy * dt;
        if (p.y < -10) { p.y = this.H + 10; p.x = rand(0, this.W); }
        if (p.x < -10) p.x = this.W + 10; if (p.x > this.W + 10) p.x = -10;
        continue;
      }
      if (p.type === 'leafbit') p.vy += 160 * dt;
      if (p.type === 'wither') p.vy += 26 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.vr) p.rot += p.vr * dt;
      if (p.life >= p.max) this.particles.splice(i, 1);
    }
  }

  // ---- drawing -----------------------------------------------------------
  swayX(vine, i) {
    const n = vine.pts.length;
    if (n < 2) return 0;
    return Math.sin(this.time * 0.9 + vine.phase + i * 0.16) * (i / n) * 7;
  }

  drawVine(v) {
    const ctx = this.ctx;
    const n = v.pts.length;
    if (n < 2) return;
    const col = v.withering ? hexLerp(this.theme.vine, this.theme.wither, easeOutCubic(Math.min(1, v.witherT))) : this.theme.vine;
    const colDeep = v.withering ? hexLerp(this.theme.vineDeep, this.theme.wither, easeOutCubic(Math.min(1, v.witherT))) : this.theme.vineDeep;
    ctx.save();
    ctx.globalAlpha = Math.max(0, v.alpha);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const path = () => {
      ctx.beginPath();
      ctx.moveTo(v.pts[0].x, v.pts[0].y);
      for (let i = 1; i < n; i++) {
        const p = v.pts[i], q = v.pts[i - 1];
        const mx = (p.x + q.x) / 2 + this.swayX(v, i) * 0.5;
        const my = (p.y + q.y) / 2;
        ctx.quadraticCurveTo(q.x + this.swayX(v, i - 1), q.y, mx, my);
      }
    };
    // deep under-stroke then bright core
    path(); ctx.strokeStyle = colDeep; ctx.lineWidth = v.width + 1.6; ctx.stroke();
    path(); ctx.strokeStyle = col; ctx.lineWidth = v.width; ctx.stroke();
    // snipped tip
    if (!v.growing && !v.withering && n > 2) {
      const p = v.pts[n - 1];
      ctx.fillStyle = colDeep;
      ctx.beginPath();
      ctx.ellipse(p.x + this.swayX(v, n - 1), p.y, v.width * 0.9, v.width * 0.55, -0.6, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  drawLeaf(l) {
    const v = l.vine;
    const idx = clamp(l.idx, 0, v.pts.length - 1);
    const p = v.pts[idx];
    const q = v.pts[Math.max(0, idx - 4)];
    const dir = Math.atan2(p.y - q.y, p.x - q.x);
    const age = clamp((this.time - l.born) / 0.5, 0, 1);
    const grow = easeOutBack(age);
    let ang = dir + l.side * 1.15 * l.bend;
    let size = l.size * grow;
    let col = this.theme.leaf, edge = this.theme.leafEdge;
    if (l.withering || v.withering) {
      const wt = v.withering ? easeOutCubic(Math.min(1, v.witherT)) : 1;
      ang = lerp(ang, Math.PI / 2 + l.side * 0.3, wt * 0.8); // droop
      size *= (1 - wt * 0.45);
      col = hexLerp(this.theme.leaf, this.theme.wither, wt); edge = hexLerp(this.theme.leafEdge, this.theme.wither, wt);
    }
    const sx = p.x + this.swayX(v, idx), sy = p.y;
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = Math.max(0, v.alpha) * (0.65 + 0.35 * age);

    if (l.isThorn) {
      // bramble thorn: small triangle along the stem
      const tl = size * 0.9;
      const bx = sx + Math.cos(dir) * 2, by = sy + Math.sin(dir) * 2;
      const px = -Math.sin(dir), py = Math.cos(dir);
      ctx.fillStyle = hexLerp(this.theme.vineDeep, this.theme.wither, v.withering ? 0.5 : 0);
      ctx.beginPath();
      ctx.moveTo(bx + Math.cos(ang) * tl, by + Math.sin(ang) * tl);
      ctx.lineTo(bx + px * size * 0.28, by + py * size * 0.28);
      ctx.lineTo(bx - px * size * 0.28, by - py * size * 0.28);
      ctx.closePath(); ctx.fill();
      ctx.restore();
      return;
    }

    if (l.style === 'leaflet') {
      // fern: fan of tiny leaflets
      ctx.fillStyle = col;
      for (let k = -1; k <= 1; k++) {
        const a = dir + l.side * 1.05 + k * 0.4;
        const d = size * (0.75 - Math.abs(k) * 0.18);
        const ex = sx + Math.cos(a) * d, ey = sy + Math.sin(a) * d;
        ctx.beginPath();
        ctx.ellipse(ex, ey, size * 0.5, size * 0.2, a, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
      return;
    }

    let len = size, wid = size * 0.42;
    if (l.style === 'round') { len = size * 0.95; wid = size * 0.52; }
    if (l.style === 'long') { len = size * 1.7; wid = size * 0.26; ang = lerp(ang, Math.PI / 2 + l.side * 0.25, 0.5); }
    const tx = sx + Math.cos(ang) * len, ty = sy + Math.sin(ang) * len;
    const nx = -Math.sin(ang), ny = Math.cos(ang);
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(sx + Math.cos(ang) * len * 0.5 + nx * wid, sy + Math.sin(ang) * len * 0.5 + ny * wid, tx, ty);
    ctx.quadraticCurveTo(sx + Math.cos(ang) * len * 0.5 - nx * wid, sy + Math.sin(ang) * len * 0.5 - ny * wid, sx, sy);
    ctx.fill();
    // vein
    ctx.strokeStyle = edge; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.restore();
  }

  drawFlower(f) {
    const v = f.vine;
    const idx = clamp(f.idx, 0, v.pts.length - 1);
    const p = v.pts[idx];
    const sx = p.x + this.swayX(v, idx) + f.dx;
    const sy = p.y + f.dy + Math.sin(this.time * 1.1 + f.phase) * 2.5;
    const s = easeOutBack(clamp(f.bloom, 0, 1));
    if (s <= 0.01) return;
    const R = f.r * s;
    const th = this.theme;
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, f.fade)) * Math.max(0, v.alpha);
    ctx.translate(sx, sy);
    ctx.rotate(f.rot + Math.sin(this.time * 0.4 + f.phase) * 0.06);
    ctx.lineCap = 'round';

    if (f.kind === 'tulip') {
      ctx.shadowColor = hexA(th.rose, 0.5);
      ctx.shadowBlur = 18 * s;
      const petal = (ang, len, wid, col) => {
        ctx.save(); ctx.rotate(ang); ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(wid, -len * 0.55, 0, -len);
        ctx.quadraticCurveTo(-wid, -len * 0.55, 0, 0);
        ctx.fill(); ctx.restore();
      };
      petal(-0.55, R * 1.5, R * 0.5, th.roseDeep);
      petal(0.55, R * 1.5, R * 0.5, th.roseDeep);
      petal(-0.22, R * 1.35, R * 0.48, th.rose);
      petal(0.22, R * 1.35, R * 0.48, th.rose);
      petal(0, R * 1.45, R * 0.5, hexLerp(th.rose, '#ffffff', 0.15));
      ctx.shadowBlur = 0;
    } else if (f.kind === 'daisy') {
      ctx.shadowColor = hexA(th.text, 0.4);
      ctx.shadowBlur = 14 * s;
      const n = 12;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * TAU + f.phase;
        ctx.save(); ctx.rotate(a);
        ctx.fillStyle = hexA(th.text, 0.92);
        ctx.beginPath(); ctx.ellipse(R * 0.62, 0, R * 0.62, R * 0.26, 0, 0, TAU); ctx.fill();
        ctx.restore();
      }
      ctx.shadowBlur = 0;
      ctx.fillStyle = th.rose;
      ctx.beginPath(); ctx.arc(0, 0, R * 0.34, 0, TAU); ctx.fill();
      ctx.fillStyle = th.roseDeep;
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * TAU + f.phase * 2;
        ctx.beginPath(); ctx.arc(Math.cos(a) * R * 0.17, Math.sin(a) * R * 0.17, R * 0.05, 0, TAU); ctx.fill();
      }
    } else if (f.kind === 'blossom') {
      ctx.shadowColor = hexA(th.rose, 0.45);
      ctx.shadowBlur = 16 * s;
      const petalCol = hexLerp(th.rose, '#ffffff', 0.45);
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * TAU + f.phase;
        ctx.fillStyle = petalCol;
        ctx.beginPath(); ctx.arc(Math.cos(a) * R * 0.52, Math.sin(a) * R * 0.52, R * 0.5, 0, TAU); ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.strokeStyle = th.roseDeep; ctx.lineWidth = Math.max(1, R * 0.05);
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * TAU + f.phase + 0.6;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * R * 0.08, Math.sin(a) * R * 0.08);
        ctx.lineTo(Math.cos(a) * R * 0.3, Math.sin(a) * R * 0.3);
        ctx.stroke();
        ctx.fillStyle = th.roseDeep;
        ctx.beginPath(); ctx.arc(Math.cos(a) * R * 0.32, Math.sin(a) * R * 0.32, R * 0.055, 0, TAU); ctx.fill();
      }
    } else if (f.kind === 'lavender') {
      const hgt = R * 2.6;
      ctx.strokeStyle = th.vine; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(0, R * 0.4); ctx.lineTo(0, -hgt); ctx.stroke();
      const budCol = hexLerp(th.rose, th.leafEdge, 0.35);
      for (let k = 0; k < 7; k++) {
        const y = R * 0.1 - k * (hgt / 7.5);
        const side = k % 2 === 0 ? 1 : -1;
        ctx.save();
        ctx.translate(side * R * 0.2, y); ctx.rotate(side * 0.5);
        ctx.fillStyle = budCol;
        ctx.beginPath(); ctx.ellipse(0, 0, R * 0.24, R * 0.38, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = hexA('#ffffff', 0.25);
        ctx.beginPath(); ctx.ellipse(-R * 0.06, -R * 0.1, R * 0.1, R * 0.18, 0, 0, TAU); ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = budCol;
      ctx.beginPath(); ctx.ellipse(0, -hgt, R * 0.26, R * 0.4, 0, 0, TAU); ctx.fill();
    } else {
      // rose (default)
      ctx.shadowColor = hexA(th.rose, 0.55);
      ctx.shadowBlur = 22 * s;
      const grad = ctx.createRadialGradient(0, 0, R * 0.1, 0, 0, R);
      grad.addColorStop(0, th.rose);
      grad.addColorStop(0.75, th.rose);
      grad.addColorStop(1, th.roseDeep);
      ctx.fillStyle = grad;
      const blobs = 6;
      for (let k = 0; k < blobs; k++) {
        const a = (k / blobs) * TAU + f.phase;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * R * 0.34, Math.sin(a) * R * 0.34, R * 0.62, 0, TAU);
        ctx.fill();
      }
      ctx.beginPath(); ctx.arc(0, 0, R * 0.66, 0, TAU); ctx.fill();
      ctx.shadowBlur = 0;
      // spiral linework
      ctx.strokeStyle = th.roseLine;
      ctx.lineWidth = Math.max(1, R * 0.055);
      for (let ring = 0; ring < 3; ring++) {
        const rr = R * (0.62 - ring * 0.17);
        const start = f.phase + ring * 1.7;
        ctx.beginPath();
        ctx.arc(0, 0, rr, start, start + Math.PI * 1.35);
        ctx.stroke();
      }
      // dark petal separations
      ctx.strokeStyle = hexA(th.roseDeep, 0.7);
      ctx.lineWidth = Math.max(1, R * 0.045);
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * TAU + f.phase * 0.7;
        ctx.beginPath();
        ctx.arc(0, 0, R * 0.9, a, a + 0.5);
        ctx.stroke();
      }
      // center swirl
      ctx.strokeStyle = th.roseLine;
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.16, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawButterfly(b) {
    const ctx = this.ctx;
    const flap = Math.abs(Math.sin(b.flap)) * 0.95 + 0.08;
    const ang = Math.atan2(b.vy, b.vx);
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(ang);
    ctx.globalAlpha = 0.9;
    // wings
    for (const s of [-1, 1]) {
      ctx.save();
      ctx.scale(1, s * flap);
      const g = ctx.createLinearGradient(0, 0, b.size, 0);
      g.addColorStop(0, hexA(this.theme.text, 0.95));
      g.addColorStop(1, hexA(this.theme.vine, 0.7));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(b.size * 0.55, 0, b.size * 0.62, b.size * 0.42, 0.5, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
    // body
    ctx.strokeStyle = hexA(this.theme.text, 0.9); ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-b.size * 0.4, 0); ctx.lineTo(b.size * 0.5, 0); ctx.stroke();
    ctx.restore();
  }

  drawParticles() {
    const ctx = this.ctx;
    for (const p of this.particles) {
      if (p.type === 'pollen') {
        if (!this.sparkles) continue;
        ctx.globalAlpha = 0.14 + 0.1 * Math.sin(this.time * 2 + p.tw);
        ctx.fillStyle = this.theme.pollen;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, TAU); ctx.fill();
      } else if (p.type === 'spark') {
        const k = 1 - p.life / p.max;
        ctx.globalAlpha = k * 0.8;
        ctx.fillStyle = this.theme.spark;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * k + 0.4, 0, TAU); ctx.fill();
      } else if (p.type === 'leafbit') {
        const k = 1 - p.life / p.max;
        ctx.save();
        ctx.globalAlpha = k;
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = this.theme.leaf;
        ctx.beginPath(); ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, TAU); ctx.fill();
        ctx.restore();
      } else if (p.type === 'wither') {
        const k = 1 - p.life / p.max;
        ctx.globalAlpha = k * 0.7;
        ctx.fillStyle = this.theme.wither;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * k, 0, TAU); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  drawText() {
    if (!this.text.trim()) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.font = this.font(this.fontSize);
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = this.theme.text;
    const paint = () => {
      let x = (this.W - ctx.measureText(this.text).width) / 2;
      const y = this.H * 0.47;
      for (const ch of this.text) {
        ctx.fillText(ch, x, y);
        x += ctx.measureText(ch).width;
      }
    };
    // layered neon glow with a gentle pulse
    const pulse = 44 + Math.sin(this.time * 2) * 8;
    ctx.shadowColor = this.theme.textGlow;
    ctx.shadowBlur = pulse;
    paint();
    ctx.shadowBlur = pulse * 0.65;
    paint();
    // crisp top pass
    ctx.shadowBlur = 0;
    paint();
    ctx.restore();
  }

  drawBackground() {
    const ctx = this.ctx, th = this.theme;
    if (this.bgImage) {
      const img = this.bgImage;
      const s = Math.max(this.W / img.width, this.H / img.height);
      const w = img.width * s, h = img.height * s;
      ctx.drawImage(img, (this.W - w) / 2, (this.H - h) / 2, w, h);
      ctx.fillStyle = `rgba(3,5,12,${this.bgDim})`;
      ctx.fillRect(0, 0, this.W, this.H);
    } else {
      ctx.fillStyle = th.bg;
      ctx.fillRect(0, 0, this.W, this.H);
    }
    // vignette
    const g = ctx.createRadialGradient(this.W / 2, this.H * 0.45, Math.min(this.W, this.H) * 0.3, this.W / 2, this.H * 0.5, Math.max(this.W, this.H) * 0.75);
    g.addColorStop(0, th.glow);
    g.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.W, this.H);
  }

  frame(dt) {
    dt = Math.min(dt, 0.05);
    this.update(dt);
    const ctx = this.ctx;
    this.drawBackground();
    // text behind vines? in the reel vines weave OVER the text — draw text first
    this.drawText();
    for (const v of this.vines) this.drawVine(v);
    for (const l of this.leaves) this.drawLeaf(l);
    for (const r of this.flowers) this.drawFlower(r);
    for (const cp of this.companions) drawCreature(this.ctx, cp, this.time);
    for (const b of this.butterflies) this.drawButterfly(b);
    this.drawParticles();
  }
}
