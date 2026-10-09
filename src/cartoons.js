// Cartoons theme engine — a goofy bright world: smiling sun, drifting clouds
// with faces, rainbow, hills, balloons, bouncy rainbow letters, cartoon
// creatures and confetti.

import { TAU, rand, clamp, easeOutBack } from './utils.js';
import { drawCreature, randomCompanion, ALL_CREATURES, COMPANION_PACKS } from './creatures.js';

export const TOON_SKIES = [
  { id: 'day', name: 'Day', stops: ['#5fb8ff', '#aee3ff', '#d8f3ff'], sun: '#ffd94d', sunDeep: '#ff9f1c', sunFace: '#7a4a12', cloud: 'rgba(255,255,255,0.95)', cloudFace: '#5a7a99', hills: ['#69c24a', '#57ad3e'], stem: '#3e8f2f', rainbow: 0.65, night: false },
  { id: 'sunset', name: 'Sunset', stops: ['#7b5fc7', '#ff8f6b', '#ffd9a0'], sun: '#ff8a3d', sunDeep: '#e05a1e', sunFace: '#7a2a12', cloud: 'rgba(255,242,226,0.95)', cloudFace: '#a06a5a', hills: ['#5f9a4a', '#4a8a3e'], stem: '#3e7a2f', rainbow: 0.5, night: false },
  { id: 'night', name: 'Night', stops: ['#070b1d', '#16224a', '#2a3f66'], sun: '#f4f1de', sunDeep: '#d9d4b8', sunFace: '#5a5a6a', cloud: 'rgba(120,140,180,0.5)', cloudFace: '#3a4a6a', hills: ['#2f5a34', '#24452a'], stem: '#1f4a24', rainbow: 0, night: true },
];

export const TOON_LETTERS = [
  { id: 'rainbow', name: 'Rainbow', colors: ['#ff5d5d', '#ffb02e', '#2ec4b6', '#5a8ff5', '#b07fe8', '#ff8fb3', '#ff6b9d'] },
  { id: 'candy', name: 'Candy', colors: ['#ff8fb3', '#ffb3d9', '#ff6b9d', '#f9a8d4', '#f472b6'] },
  { id: 'ocean', name: 'Ocean', colors: ['#2ec4b6', '#5a8ff5', '#7dd3fc', '#38bdf8', '#22d3ee'] },
  { id: 'sunny', name: 'Sunny', colors: ['#ffb02e', '#ffd94d', '#ff9f1c', '#ffcf5c', '#ff8f3d'] },
];

export const TOON_PACKS = [{ id: 'all', label: 'All' }, ...COMPANION_PACKS];

export class CartoonEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.text = '';
    this.letters = [];
    this.fontSize = 150;
    this.creatures = [];
    this.confetti = [];
    this.poofs = [];
    this.clouds = [];
    this.balloons = [];
    this.hillFlowers = [];
    this.stars = [];
    this.sky = TOON_SKIES[0];
    this.pack = 'all';
    this.letterSet = TOON_LETTERS[0];
    this.confettiOn = true;
    this.time = 0;
    this.hasTyped = false;
    this.resize();
    this.seedSky();
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
    this.seedHills();
    this.seedStars();
  }

  seedStars() {
    this.stars = [];
    for (let i = 0; i < 70; i++) {
      this.stars.push({ x: rand(0, this.W), y: rand(0, this.H * 0.7), r: rand(1, 2.6), phase: rand(0, TAU) });
    }
  }

  font(size) { return `800 ${size}px "Baloo 2", "Comic Sans MS", sans-serif`; }

  seedSky() {
    this.clouds = [];
    for (let i = 0; i < 5; i++) {
      this.clouds.push({
        x: rand(0, this.W), y: rand(this.H * 0.06, this.H * 0.4),
        s: rand(0.6, 1.3), speed: rand(8, 26), face: Math.random() < 0.7, phase: rand(0, TAU),
      });
    }
    this.balloons = [];
    const cols = ['#ff5d5d', '#ffb02e', '#2ec4b6', '#b07fe8'];
    for (let i = 0; i < 4; i++) {
      this.balloons.push({
        x: rand(0, this.W), y: rand(this.H * 0.2, this.H),
        s: rand(22, 34), col: cols[i % cols.length],
        speed: rand(14, 30), phase: rand(0, TAU),
      });
    }
  }

  seedHills() {
    this.hillFlowers = [];
    const cols = ['#ff8fb3', '#ffd94d', '#ffffff', '#b07fe8'];
    for (let i = 0; i < 14; i++) {
      this.hillFlowers.push({
        x: rand(0, this.W), y: rand(this.H * 0.86, this.H * 0.99),
        s: rand(7, 13), col: cols[i % cols.length], phase: rand(0, TAU),
      });
    }
  }

  layoutText() {
    const ctx = this.ctx;
    const maxW = this.W * 0.88;
    let size = Math.min(170, this.H * 0.24);
    ctx.font = this.font(size);
    if (this.text.length && ctx.measureText(this.text).width > maxW) {
      size = Math.max(34, size * (maxW / ctx.measureText(this.text).width));
      ctx.font = this.font(size);
    }
    this.fontSize = size;
    const old = new Map(this.letters.map((l, i) => [i, l]));
    this.letters = [];
    const total = ctx.measureText(this.text).width;
    let x = (this.W - total) / 2;
    const cy = this.H * 0.48;
    for (let i = 0; i < this.text.length; i++) {
      const ch = this.text[i];
      const w = ctx.measureText(ch).width;
      const prev = old.get(i);
      this.letters.push({
        ch, cx: x + w / 2, cy, w, size,
        color: prev?.color ?? this.letterSet.colors[i % this.letterSet.colors.length],
        born: prev?.born ?? this.time,
        phase: prev?.phase ?? rand(0, TAU),
      });
      x += w;
    }
    for (const cp of this.creatures) {
      const now = this.letters[cp.anchorChar];
      const prev = old.get(cp.anchorChar);
      if (now && prev) { cp.x += now.cx - prev.cx; cp.y += now.cy - prev.cy; }
    }
  }

  // ---- input -------------------------------------------------------------
  typeChar(ch) {
    if (ch === '\n' || ch === '\r') return this.clearAll();
    if (this.text.length > 40) return;
    this.hasTyped = true;
    this.text += ch;
    this.layoutText();
    const i = this.text.length - 1;
    const L = this.letters[i];
    if (ch === ' ') {
      for (let k = 0; k < 6; k++) {
        this.poofs.push({ x: L.cx + rand(-20, 20), y: L.cy + rand(-30, 30), r: rand(8, 18), life: 0, max: rand(0.5, 0.9) });
      }
      return;
    }
    // confetti burst at the new letter
    if (this.confettiOn) {
      for (let k = 0; k < 10; k++) {
        this.confetti.push({
          x: L.cx + rand(-30, 30), y: L.cy + rand(-40, 40),
          vx: rand(-140, 140), vy: rand(-260, -60),
          rot: rand(0, TAU), vr: rand(-8, 8),
          col: this.letterSet.colors[Math.floor(Math.random() * this.letterSet.colors.length)],
          life: 0, max: rand(0.9, 1.5), w: rand(5, 9), h: rand(7, 13),
        });
      }
    }
    const list = this.pack === 'all'
      ? ALL_CREATURES
      : (TOON_PACKS.find((p) => p.id === this.pack)?.creatures || []);
    if (this.pack !== 'off' && list.length && Math.random() < 0.7) {
      const kind = list[Math.floor(Math.random() * list.length)];
      const alive = this.creatures.filter((c) => !c.withering);
      if (alive.length >= 16) { const o = alive[0]; o.withering = true; o.witherT = 0; }
      const cp = randomCompanion(kind, L.cx + rand(-130, 130), L.cy + rand(-110, 90), rand(36, 54), this.time);
      cp.anchorChar = i;
      this.creatures.push(cp);
    }
  }

  backspace() {
    if (!this.text.length) return;
    const i = this.text.length - 1;
    this.text = this.text.slice(0, -1);
    this.layoutText();
    for (const cp of this.creatures) {
      if (cp.anchorChar === i && !cp.withering) { cp.withering = true; cp.witherT = 0; }
    }
    for (const cp of this.creatures) if (cp.anchorChar > i) cp.anchorChar = Math.max(0, this.text.length - 1);
  }

  clearAll() {
    for (const cp of this.creatures) { if (!cp.withering) { cp.withering = true; cp.witherT = 0; } }
    for (let k = 0; k < 40; k++) {
      this.confetti.push({
        x: this.W / 2 + rand(-160, 160), y: this.H * 0.45 + rand(-60, 60),
        vx: rand(-220, 220), vy: rand(-380, -80),
        rot: rand(0, TAU), vr: rand(-10, 10),
        col: this.letterSet.colors[Math.floor(Math.random() * this.letterSet.colors.length)],
        life: 0, max: rand(1, 1.8), w: rand(5, 10), h: rand(7, 14),
      });
    }
    this.text = '';
    this.layoutText();
  }

  // ---- customization -----------------------------------------------------
  setSky(id) {
    const s = TOON_SKIES.find((x) => x.id === id);
    if (s) this.sky = s;
  }
  setPack(id) {
    this.pack = id;
    if (id === 'off') {
      for (const cp of this.creatures) { if (!cp.withering) { cp.withering = true; cp.witherT = 0; } }
    }
  }
  setLetterSet(id) {
    const s = TOON_LETTERS.find((x) => x.id === id);
    if (!s) return;
    this.letterSet = s;
    this.letters.forEach((L, i) => { L.color = s.colors[i % s.colors.length]; });
  }
  setConfetti(on) { this.confettiOn = on; }

  // ---- update ------------------------------------------------------------
  update(dt) {
    this.time += dt;
    const t = this.time;
    for (const c of this.clouds) {
      c.x -= c.speed * dt;
      if (c.x < -220) { c.x = this.W + 220; c.y = rand(this.H * 0.06, this.H * 0.4); }
    }
    for (const b of this.balloons) {
      b.y -= b.speed * dt;
      b.x += Math.sin(t * 0.8 + b.phase) * 12 * dt;
      if (b.y < -80) { b.y = this.H + 80; b.x = rand(0, this.W); }
    }
    for (let i = this.creatures.length - 1; i >= 0; i--) {
      const cp = this.creatures[i];
      cp.blinkT -= dt;
      if (cp.blinkT < -0.18) cp.blinkT = rand(2, 5);
      if (cp.withering) {
        cp.witherT += dt / 0.7;
        cp.alpha = Math.max(0, 1 - cp.witherT);
        if (cp.witherT >= 1) this.creatures.splice(i, 1);
      }
    }
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const p = this.confetti[i];
      p.life += dt;
      p.vy += 420 * dt;
      p.vx *= 1 - 0.6 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.rot += p.vr * dt;
      if (p.life >= p.max || p.y > this.H + 30) this.confetti.splice(i, 1);
    }
    for (let i = this.poofs.length - 1; i >= 0; i--) {
      const p = this.poofs[i];
      p.life += dt;
      if (p.life >= p.max) this.poofs.splice(i, 1);
    }
  }

  // ---- background --------------------------------------------------------
  drawBackground() {
    const ctx = this.ctx, t = this.time, S = this.sky;
    const grad = ctx.createLinearGradient(0, 0, 0, this.H);
    grad.addColorStop(0, S.stops[0]);
    grad.addColorStop(0.7, S.stops[1]);
    grad.addColorStop(1, S.stops[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.W, this.H);

    // stars (night only)
    if (S.night) {
      for (const st of this.stars) {
        ctx.globalAlpha = 0.35 + Math.abs(Math.sin(t * 1.5 + st.phase)) * 0.65;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // rainbow (behind everything else)
    if (S.rainbow > 0) {
      const rcx = this.W * 0.1, rcy = this.H * 1.08, rr = this.H * 0.8;
      ctx.save();
      ctx.globalAlpha = S.rainbow + Math.sin(t * 1.5) * 0.06;
      ctx.lineWidth = this.H * 0.032;
      const bands = ['#ff5d5d', '#ffb02e', '#ffe14d', '#2ec4b6', '#5a8ff5', '#b07fe8'];
      bands.forEach((col, i) => {
        ctx.strokeStyle = col;
        ctx.beginPath();
        ctx.arc(rcx, rcy, rr - i * this.H * 0.032, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
      });
      ctx.restore();
    }

    // sun — or a sleepy moon at night — with rotating rays
    const sunX = this.W * 0.86, sunY = this.H * 0.16, sunR = Math.min(this.W, this.H) * 0.085;
    ctx.save();
    ctx.translate(sunX, sunY);
    ctx.rotate(t * 0.15);
    ctx.fillStyle = S.sun;
    for (let k = 0; k < 12; k++) {
      ctx.rotate(TAU / 12);
      ctx.beginPath();
      ctx.moveTo(0, -sunR * 1.25);
      ctx.lineTo(sunR * 0.22, -sunR * 1.7);
      ctx.lineTo(-sunR * 0.22, -sunR * 1.7);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle = S.sun;
    ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, TAU); ctx.fill();
    if (S.night) {
      // craters
      ctx.fillStyle = S.sunDeep;
      for (const [dx, dy, r] of [[-0.3, -0.2, 0.18], [0.25, 0.1, 0.14], [-0.05, 0.4, 0.11]]) {
        ctx.beginPath(); ctx.arc(sunX + dx * sunR, sunY + dy * sunR, r * sunR, 0, TAU); ctx.fill();
      }
      // sleepy face
      ctx.strokeStyle = S.sunFace; ctx.lineWidth = sunR * 0.07; ctx.lineCap = 'round';
      for (const sd of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(sunX + sd * sunR * 0.42, sunY - sunR * 0.08); ctx.lineTo(sunX + sd * sunR * 0.18, sunY - sunR * 0.08); ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(sunX, sunY + sunR * 0.28, sunR * 0.14, 0.4, Math.PI - 0.4); ctx.stroke();
    } else {
      ctx.fillStyle = S.sunDeep;
      ctx.beginPath(); ctx.arc(sunX, sunY, sunR * 0.82, 0, TAU); ctx.fill();
      ctx.fillStyle = S.sun;
      ctx.beginPath(); ctx.arc(sunX, sunY, sunR * 0.78, 0, TAU); ctx.fill();
      // happy closed eyes + big smile
      ctx.strokeStyle = S.sunFace; ctx.lineWidth = sunR * 0.07; ctx.lineCap = 'round';
      for (const sd of [-1, 1]) {
        ctx.beginPath(); ctx.arc(sunX + sd * sunR * 0.32, sunY - sunR * 0.1, sunR * 0.16, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(sunX, sunY + sunR * 0.15, sunR * 0.34, 0.35, Math.PI - 0.35); ctx.stroke();
      ctx.fillStyle = 'rgba(255,120,120,0.6)';
      ctx.beginPath(); ctx.arc(sunX - sunR * 0.5, sunY + sunR * 0.18, sunR * 0.12, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(sunX + sunR * 0.5, sunY + sunR * 0.18, sunR * 0.12, 0, TAU); ctx.fill();
    }

    // clouds (some with sleepy faces)
    for (const c of this.clouds) {
      const bob = Math.sin(t * 0.9 + c.phase) * 6;
      ctx.save();
      ctx.translate(c.x, c.y + bob);
      ctx.scale(c.s, c.s);
      ctx.fillStyle = S.cloud;
      const puffs = [[-42, 6, 26], [-16, -8, 32], [14, -6, 28], [40, 8, 22]];
      for (const [px, py, pr] of puffs) { ctx.beginPath(); ctx.arc(px, py, pr, 0, TAU); ctx.fill(); }
      ctx.fillRect(-58, -2, 112, 26);
      if (c.face) {
        ctx.fillStyle = S.cloudFace;
        ctx.beginPath(); ctx.arc(-14, 2, 3.4, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(14, 2, 3.4, 0, TAU); ctx.fill();
        ctx.strokeStyle = S.cloudFace; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(0, 8, 9, 0.5, Math.PI - 0.5); ctx.stroke();
      }
      ctx.restore();
    }

    // hills
    ctx.fillStyle = S.hills[0];
    ctx.beginPath(); ctx.ellipse(this.W * 0.22, this.H * 1.12, this.W * 0.42, this.H * 0.3, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = S.hills[1];
    ctx.beginPath(); ctx.ellipse(this.W * 0.85, this.H * 1.16, this.W * 0.45, this.H * 0.32, 0, 0, TAU); ctx.fill();

    // tiny swaying flowers on the hills
    for (const f of this.hillFlowers) {
      const sway = Math.sin(t * 1.8 + f.phase) * 3;
      ctx.strokeStyle = S.stem; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.quadraticCurveTo(f.x + sway, f.y - 12, f.x + sway * 1.4, f.y - 20); ctx.stroke();
      const hx = f.x + sway * 1.4, hy = f.y - 22;
      ctx.fillStyle = f.col;
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * TAU + f.phase;
        ctx.beginPath(); ctx.arc(hx + Math.cos(a) * f.s * 0.55, hy + Math.sin(a) * f.s * 0.55, f.s * 0.5, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = '#ffdf3d';
      ctx.beginPath(); ctx.arc(hx, hy, f.s * 0.42, 0, TAU); ctx.fill();
    }

    // balloons
    for (const b of this.balloons) {
      const sway = Math.sin(t * 1.2 + b.phase) * 10;
      ctx.strokeStyle = 'rgba(90,90,120,0.7)'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y + b.s * 0.7);
      ctx.quadraticCurveTo(b.x + sway, b.y + b.s * 1.4, b.x + sway * 0.5, b.y + b.s * 2);
      ctx.stroke();
      ctx.fillStyle = b.col;
      ctx.beginPath(); ctx.ellipse(b.x, b.y, b.s * 0.52, b.s * 0.66, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.beginPath(); ctx.ellipse(b.x - b.s * 0.18, b.y - b.s * 0.22, b.s * 0.14, b.s * 0.24, -0.4, 0, TAU); ctx.fill();
      ctx.fillStyle = b.col;
      ctx.beginPath();
      ctx.moveTo(b.x - 5, b.y + b.s * 0.64); ctx.lineTo(b.x + 5, b.y + b.s * 0.64); ctx.lineTo(b.x, b.y + b.s * 0.78);
      ctx.closePath(); ctx.fill();
    }
  }

  drawText() {
    const ctx = this.ctx, t = this.time;
    ctx.save();
    ctx.font = this.font(this.fontSize);
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    this.letters.forEach((L, i) => {
      const age = clamp((t - L.born) / 0.4, 0, 1);
      const pop = easeOutBack(age);
      if (pop <= 0.01) return;
      const wob = Math.sin(t * 2.4 + L.phase) * 0.045 * age;
      const yOff = Math.sin(t * 2.8 + L.phase) * 5 * age - (1 - age) * 40;
      ctx.save();
      ctx.translate(L.cx, L.cy + yOff);
      ctx.rotate(wob);
      ctx.scale(pop, pop);
      // sticker outline
      ctx.lineWidth = L.size * 0.14;
      ctx.strokeStyle = '#ffffff';
      ctx.strokeText(L.ch, 0, 0);
      ctx.fillStyle = L.color;
      ctx.fillText(L.ch, 0, 0);
      ctx.restore();
    });
    ctx.restore();
  }

  drawConfetti() {
    const ctx = this.ctx;
    for (const p of this.confetti) {
      const k = 1 - p.life / p.max;
      ctx.save();
      ctx.globalAlpha = Math.max(0, k);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    for (const p of this.poofs) {
      const k = p.life / p.max;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - k) * 0.8;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (0.6 + k), 0, TAU); ctx.fill();
      ctx.restore();
    }
  }

  frame(dt) {
    dt = Math.min(dt, 0.05);
    this.update(dt);
    this.drawBackground();
    this.drawText();
    for (const cp of this.creatures) drawCreature(this.ctx, cp, this.time);
    this.drawConfetti();
  }
}
