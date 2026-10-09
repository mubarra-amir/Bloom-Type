// Shared cartoon-creature drawing — pure canvas functions used by both the
// Garden and Cartoons themes. A companion `cp` carries: kind, x, y, size,
// born, blinkT, phase, flip, alpha, coat, blobCol, fishCol.

import { TAU, hexLerp, easeOutBack, clamp } from './utils.js';

export const CAT_COATS = [
  { body: '#f0a35e', dark: '#d97f3c' },
  { body: '#9aa3b2', dark: '#7c8595' },
  { body: '#4a4f5a', dark: '#353a44' },
  { body: '#f5ead6', dark: '#ddc9a6' },
];
export const BLOB_BODIES = ['#b07fe8', '#5fc9c9', '#ff8fb3', '#8fd14f'];
export const FISH_BODIES = ['#ff9f5a', '#5ab0ff', '#ff6b8a'];
export const COMPANION_PACKS = [
  { id: 'off', label: 'Off' },
  { id: 'cats', label: 'Cats', creatures: ['cat'] },
  { id: 'goofy', label: 'Goofy', creatures: ['blob', 'frog', 'chick'] },
  { id: 'pond', label: 'Pond', creatures: ['frog', 'fish'] },
  { id: 'spooky', label: 'Spooky', creatures: ['ghost', 'bat'] },
  { id: 'sea', label: 'Sea', creatures: ['fish', 'jelly'] },
  { id: 'space', label: 'Space', creatures: ['alien', 'blob'] },
];
export const ALL_CREATURES = ['cat', 'blob', 'frog', 'chick', 'ghost', 'bat', 'fish', 'jelly', 'alien'];

function eyes(ctx, x1, x2, y, r, blink, pupilCol = '#20242e') {
  if (blink) {
    ctx.strokeStyle = pupilCol; ctx.lineWidth = Math.max(1.5, r * 0.35); ctx.lineCap = 'round';
    for (const x of [x1, x2]) { ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.stroke(); }
  } else {
    for (const x of [x1, x2]) {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      ctx.fillStyle = pupilCol;
      ctx.beginPath(); ctx.arc(x, y + r * 0.15, r * 0.5, 0, TAU); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(x - r * 0.2, y - r * 0.15, r * 0.18, 0, TAU); ctx.fill();
    }
  }
}

function draw_cat(ctx, cp, time, blink) {
  const S = cp.size, coat = cp.coat;
  ctx.strokeStyle = coat.dark; ctx.lineWidth = S * 0.16;
  ctx.beginPath();
  ctx.moveTo(S * 0.5, S * 0.45);
  ctx.quadraticCurveTo(S * 0.95, S * 0.5, S * 0.8, S * 0.05);
  ctx.stroke();
  ctx.fillStyle = coat.body;
  ctx.beginPath(); ctx.ellipse(0, S * 0.28, S * 0.5, S * 0.62, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.beginPath(); ctx.ellipse(0, S * 0.35, S * 0.28, S * 0.4, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = coat.body;
  ctx.beginPath(); ctx.arc(0, -S * 0.42, S * 0.4, 0, TAU); ctx.fill();
  for (const sd of [-1, 1]) {
    ctx.fillStyle = coat.body;
    ctx.beginPath();
    ctx.moveTo(sd * S * 0.32, -S * 0.62); ctx.lineTo(sd * S * 0.42, -S * 0.95); ctx.lineTo(sd * S * 0.1, -S * 0.72);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f4a7b9';
    ctx.beginPath();
    ctx.moveTo(sd * S * 0.3, -S * 0.68); ctx.lineTo(sd * S * 0.35, -S * 0.86); ctx.lineTo(sd * S * 0.16, -S * 0.72);
    ctx.closePath(); ctx.fill();
  }
  eyes(ctx, -S * 0.16, S * 0.16, -S * 0.42, S * 0.1, blink);
  ctx.fillStyle = '#e87f8f';
  ctx.beginPath();
  ctx.moveTo(-S * 0.05, -S * 0.3); ctx.lineTo(S * 0.05, -S * 0.3); ctx.lineTo(0, -S * 0.24);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#5a4a42'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, -S * 0.24); ctx.quadraticCurveTo(-S * 0.08, -S * 0.18, -S * 0.14, -S * 0.2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -S * 0.24); ctx.quadraticCurveTo(S * 0.08, -S * 0.18, S * 0.14, -S * 0.2); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1.2;
  for (const sd of [-1, 1]) for (let k = 0; k < 2; k++) {
    ctx.beginPath();
    ctx.moveTo(sd * S * 0.3, -S * 0.32 + k * S * 0.07);
    ctx.lineTo(sd * S * 0.62, -S * 0.36 + k * S * 0.09);
    ctx.stroke();
  }
  ctx.fillStyle = coat.dark;
  ctx.beginPath(); ctx.ellipse(-S * 0.25, S * 0.82, S * 0.18, S * 0.1, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(S * 0.25, S * 0.82, S * 0.18, S * 0.1, 0, 0, TAU); ctx.fill();
}

function draw_frog(ctx, cp, time, blink) {
  const S = cp.size;
  ctx.fillStyle = '#6fce62';
  ctx.beginPath(); ctx.arc(0, S * 0.1, S * 0.55, 0, TAU); ctx.fill();
  ctx.fillStyle = '#dcf5d2';
  ctx.beginPath(); ctx.ellipse(0, S * 0.32, S * 0.34, S * 0.28, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#6fce62';
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * S * 0.28, -S * 0.38, S * 0.2, 0, TAU); ctx.fill(); }
  eyes(ctx, -S * 0.28, S * 0.28, -S * 0.38, S * 0.13, blink);
  ctx.strokeStyle = '#2f6b2f'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, S * 0.05, S * 0.3, 0.35, Math.PI - 0.35); ctx.stroke();
  ctx.fillStyle = 'rgba(255,130,150,0.55)';
  ctx.beginPath(); ctx.arc(-S * 0.38, S * 0.12, S * 0.1, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(S * 0.38, S * 0.12, S * 0.1, 0, TAU); ctx.fill();
  ctx.fillStyle = '#5ab54e';
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * S * 0.42, S * 0.55, S * 0.16, S * 0.1, 0, 0, TAU); ctx.fill(); }
}

function draw_chick(ctx, cp, time, blink) {
  const S = cp.size;
  ctx.fillStyle = '#ffd94a';
  ctx.beginPath(); ctx.arc(0, S * 0.05, S * 0.55, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(-S * 0.08, -S * 0.52, S * 0.12, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(S * 0.08, -S * 0.52, S * 0.12, 0, TAU); ctx.fill();
  ctx.fillStyle = '#f5c53d';
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * S * 0.52, S * 0.15, S * 0.14, S * 0.26, sd * 0.3, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#ff9f1c';
  ctx.beginPath();
  ctx.moveTo(-S * 0.09, -S * 0.05); ctx.lineTo(S * 0.09, -S * 0.05); ctx.lineTo(0, S * 0.08);
  ctx.closePath(); ctx.fill();
  eyes(ctx, -S * 0.2, S * 0.2, -S * 0.2, S * 0.1, blink);
  ctx.fillStyle = 'rgba(255,150,120,0.6)';
  ctx.beginPath(); ctx.arc(-S * 0.34, S * 0.02, S * 0.09, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(S * 0.34, S * 0.02, S * 0.09, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#ff9f1c'; ctx.lineWidth = 2.5;
  for (const sd of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(sd * S * 0.12, S * 0.58); ctx.lineTo(sd * S * 0.12, S * 0.7); ctx.stroke();
  }
}

function draw_blob(ctx, cp, time, blink) {
  const S = cp.size, col = cp.blobCol;
  const wob = Math.sin(time * 3 + cp.phase) * 0.06;
  ctx.save(); ctx.scale(1 + wob, 1 - wob);
  ctx.fillStyle = hexLerp(col, '#ffffff', 0.2);
  for (const sd of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(sd * S * 0.3, -S * 0.5); ctx.lineTo(sd * S * 0.42, -S * 0.85); ctx.lineTo(sd * S * 0.12, -S * 0.6);
    ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(0, S * 0.1, S * 0.55, S * 0.6, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.beginPath(); ctx.ellipse(0, S * 0.3, S * 0.3, S * 0.35, 0, 0, TAU); ctx.fill();
  ctx.restore();
  if (cp.flip > 0) {
    eyes(ctx, -S * 0.2, S * 0.2, -S * 0.15, S * 0.13, blink);
  } else if (blink) {
    ctx.strokeStyle = '#20242e'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-S * 0.18, -S * 0.15); ctx.lineTo(S * 0.18, -S * 0.15); ctx.stroke();
  } else {
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, -S * 0.15, S * 0.24, 0, TAU); ctx.fill();
    ctx.fillStyle = '#20242e'; ctx.beginPath(); ctx.arc(0, -S * 0.12, S * 0.12, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-S * 0.05, -S * 0.2, S * 0.05, 0, TAU); ctx.fill();
  }
  ctx.fillStyle = '#5b2333';
  ctx.beginPath(); ctx.ellipse(0, S * 0.32, S * 0.16, S * 0.2, 0, 0, Math.PI); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillRect(-S * 0.05, S * 0.32, S * 0.1, S * 0.08);
  ctx.fillStyle = hexLerp(col, '#000000', 0.15);
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * S * 0.28, S * 0.62, S * 0.16, S * 0.1, 0, 0, TAU); ctx.fill(); }
}

function draw_ghost(ctx, cp, time, blink) {
  const S = cp.size;
  ctx.fillStyle = 'rgba(244,241,250,0.95)';
  ctx.beginPath();
  ctx.moveTo(-S * 0.45, S * 0.5);
  ctx.lineTo(-S * 0.45, -S * 0.1);
  ctx.arc(0, -S * 0.1, S * 0.45, Math.PI, 0);
  ctx.lineTo(S * 0.45, S * 0.5);
  for (let k = 0; k < 3; k++) {
    const x1 = S * 0.45 - ((k + 0.5) * S * 0.9) / 3;
    const x2 = S * 0.45 - ((k + 1) * S * 0.9) / 3;
    ctx.quadraticCurveTo(x1, S * 0.72, x2, S * 0.5);
  }
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(244,241,250,0.95)'; ctx.lineWidth = S * 0.14;
  const wave = Math.sin(time * 2.5 + cp.phase) * S * 0.08;
  ctx.beginPath(); ctx.moveTo(-S * 0.42, S * 0.05); ctx.quadraticCurveTo(-S * 0.7, S * 0.1, -S * 0.72, S * 0.3 + wave); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(S * 0.42, S * 0.05); ctx.quadraticCurveTo(S * 0.7, S * 0.1, S * 0.72, S * 0.3 - wave); ctx.stroke();
  eyes(ctx, -S * 0.16, S * 0.16, -S * 0.12, S * 0.09, blink);
  ctx.fillStyle = '#3a3f4a';
  ctx.beginPath(); ctx.ellipse(0, S * 0.12, S * 0.07, S * 0.1, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(180,150,220,0.5)';
  ctx.beginPath(); ctx.arc(-S * 0.3, S * 0.02, S * 0.08, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(S * 0.3, S * 0.02, S * 0.08, 0, TAU); ctx.fill();
}

function draw_bat(ctx, cp, time, blink) {
  const S = cp.size;
  const flap = Math.sin(time * 10 + cp.phase) * 0.5;
  ctx.fillStyle = '#5a4a6e';
  for (const sd of [-1, 1]) {
    ctx.save();
    ctx.translate(sd * S * 0.3, 0);
    ctx.rotate(sd * (0.5 + flap * 0.5));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(sd * S * 0.5, -S * 0.4, sd * S * 0.9, -S * 0.1);
    ctx.quadraticCurveTo(sd * S * 0.65, -S * 0.05, sd * S * 0.55, S * 0.15);
    ctx.quadraticCurveTo(sd * S * 0.35, S * 0.1, sd * S * 0.3, S * 0.3);
    ctx.quadraticCurveTo(sd * S * 0.15, S * 0.2, 0, S * 0.25);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = '#6e5c85';
  ctx.beginPath(); ctx.ellipse(0, S * 0.05, S * 0.28, S * 0.36, 0, 0, TAU); ctx.fill();
  for (const sd of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(sd * S * 0.18, -S * 0.22); ctx.lineTo(sd * S * 0.24, -S * 0.44); ctx.lineTo(sd * S * 0.06, -S * 0.3);
    ctx.closePath(); ctx.fill();
  }
  eyes(ctx, -S * 0.11, S * 0.11, -S * 0.05, S * 0.075, blink, '#f5ead9');
  ctx.fillStyle = '#fff';
  for (const sd of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(sd * S * 0.08, S * 0.18); ctx.lineTo(sd * S * 0.12, S * 0.28); ctx.lineTo(sd * S * 0.02, S * 0.2);
    ctx.closePath(); ctx.fill();
  }
}

function draw_fish(ctx, cp, time, blink) {
  const S = cp.size, col = cp.fishCol;
  const wag = Math.sin(time * 6 + cp.phase) * 0.35;
  ctx.save(); ctx.translate(-S * 0.5, S * 0.05); ctx.rotate(wag);
  ctx.fillStyle = hexLerp(col, '#000000', 0.1);
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(-S * 0.45, -S * 0.28); ctx.lineTo(-S * 0.45, S * 0.28);
  ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(0, S * 0.05, S * 0.55, S * 0.34, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  for (const dx of [-0.15, 0.1]) {
    ctx.beginPath(); ctx.ellipse(dx * S, S * 0.05, S * 0.07, S * 0.3, 0.2, 0, TAU); ctx.fill();
  }
  ctx.fillStyle = hexLerp(col, '#000000', 0.12);
  ctx.beginPath();
  ctx.moveTo(-S * 0.05, S * 0.3); ctx.quadraticCurveTo(S * 0.1, S * 0.55, S * 0.25, S * 0.35);
  ctx.closePath(); ctx.fill();
  const ex = S * 0.32;
  if (blink) {
    ctx.strokeStyle = '#20242e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ex - S * 0.08, -S * 0.05); ctx.lineTo(ex + S * 0.08, -S * 0.05); ctx.stroke();
  } else {
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex, -S * 0.05, S * 0.1, 0, TAU); ctx.fill();
    ctx.fillStyle = '#20242e'; ctx.beginPath(); ctx.arc(ex + S * 0.03, -S * 0.04, S * 0.05, 0, TAU); ctx.fill();
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(S * 0.42, S * 0.12, S * 0.12, -0.4, 1.1); ctx.stroke();
}

function draw_jelly(ctx, cp, time, blink) {
  const S = cp.size;
  ctx.strokeStyle = 'rgba(247,168,216,0.85)'; ctx.lineWidth = S * 0.07;
  for (let k = -2; k <= 2; k++) {
    const sway = Math.sin(time * 3 + cp.phase + k) * S * 0.12;
    ctx.beginPath();
    ctx.moveTo(k * S * 0.16, S * 0.25);
    ctx.quadraticCurveTo(k * S * 0.16 + sway, S * 0.55, k * S * 0.16 - sway * 0.5, S * 0.85);
    ctx.stroke();
  }
  const grad = ctx.createRadialGradient(0, -S * 0.1, S * 0.1, 0, 0, S * 0.55);
  grad.addColorStop(0, '#fbc4e4'); grad.addColorStop(1, '#f7a8d8');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, S * 0.2, S * 0.5, Math.PI, 0);
  ctx.quadraticCurveTo(S * 0.5, S * 0.32, S * 0.38, S * 0.3);
  ctx.lineTo(-S * 0.38, S * 0.3);
  ctx.quadraticCurveTo(-S * 0.5, S * 0.32, -S * 0.5, S * 0.2);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  for (const [dx, dy, r] of [[-0.2, -0.05, 0.07], [0.15, -0.12, 0.09], [0.02, 0.05, 0.06]]) {
    ctx.beginPath(); ctx.arc(dx * S, dy * S, r * S, 0, TAU); ctx.fill();
  }
  eyes(ctx, -S * 0.16, S * 0.16, S * 0.02, S * 0.075, blink);
  ctx.strokeStyle = '#a34a78'; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.arc(0, S * 0.08, S * 0.12, 0.5, Math.PI - 0.5); ctx.stroke();
}

function draw_alien(ctx, cp, time, blink) {
  const S = cp.size;
  ctx.strokeStyle = '#5cb85c'; ctx.lineWidth = S * 0.06;
  for (const sd of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(sd * S * 0.18, -S * 0.62);
    ctx.quadraticCurveTo(sd * S * 0.3, -S * 0.85, sd * S * 0.38, -S * 0.9);
    ctx.stroke();
    ctx.fillStyle = '#d94f70';
    ctx.beginPath(); ctx.arc(sd * S * 0.38, -S * 0.9, S * 0.07, 0, TAU); ctx.fill();
  }
  ctx.fillStyle = '#8ee081';
  ctx.beginPath(); ctx.ellipse(0, -S * 0.25, S * 0.48, S * 0.5, 0, 0, TAU); ctx.fill();
  for (const sd of [-1, 1]) {
    ctx.save();
    ctx.translate(sd * S * 0.22, -S * 0.28); ctx.rotate(sd * 0.35);
    if (blink) {
      ctx.strokeStyle = '#20242e'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-S * 0.12, 0); ctx.lineTo(S * 0.12, 0); ctx.stroke();
    } else {
      ctx.fillStyle = '#20242e';
      ctx.beginPath(); ctx.ellipse(0, 0, S * 0.15, S * 0.2, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath(); ctx.arc(-S * 0.04, -S * 0.06, S * 0.045, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  ctx.fillStyle = '#6fbf6f';
  ctx.beginPath(); ctx.ellipse(0, S * 0.42, S * 0.26, S * 0.3, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#6fbf6f'; ctx.lineWidth = S * 0.09;
  const wave = Math.sin(time * 3 + cp.phase) * S * 0.06;
  ctx.beginPath(); ctx.moveTo(-S * 0.24, S * 0.35); ctx.lineTo(-S * 0.4, S * 0.5 + wave); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(S * 0.24, S * 0.35); ctx.lineTo(S * 0.4, S * 0.5 - wave); ctx.stroke();
}

const DRAW = {
  cat: draw_cat, frog: draw_frog, chick: draw_chick, blob: draw_blob,
  ghost: draw_ghost, bat: draw_bat, fish: draw_fish, jelly: draw_jelly, alien: draw_alien,
};

// Pop-in, bob and blink wrapper. cp: {kind,x,y,size,born,blinkT,phase,flip,alpha,...}
export function drawCreature(ctx, cp, time) {
  const s = easeOutBack(clamp((time - cp.born) / 0.45, 0, 1));
  if (s <= 0.01) return;
  const floaty = cp.kind === 'ghost' || cp.kind === 'jelly' ? 2.4 : 1;
  const bob = Math.sin(time * 2.2 + cp.phase) * 3 * floaty;
  ctx.save();
  ctx.globalAlpha = Math.max(0, cp.alpha);
  ctx.translate(cp.x, cp.y + bob);
  ctx.scale(s * cp.flip, s);
  ctx.lineCap = 'round';
  const blink = cp.blinkT < 0.15;
  DRAW[cp.kind]?.(ctx, cp, time, blink);
  ctx.restore();
}

export function randomCompanion(kind, x, y, size, time) {
  return {
    kind, x, y, size,
    born: time,
    blinkT: 1.5 + Math.random() * 2.5,
    phase: Math.random() * TAU,
    flip: Math.random() < 0.5 ? -1 : 1,
    coat: kind === 'cat' ? CAT_COATS[Math.floor(Math.random() * CAT_COATS.length)] : null,
    blobCol: kind === 'blob' ? BLOB_BODIES[Math.floor(Math.random() * BLOB_BODIES.length)] : null,
    fishCol: kind === 'fish' ? FISH_BODIES[Math.floor(Math.random() * FISH_BODIES.length)] : null,
    withering: false, witherT: 0, alpha: 1,
  };
}
