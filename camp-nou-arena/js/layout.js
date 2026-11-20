// Stadium geometry maths and the seat layout.
//
// The bowl follows a superellipse around the pitch. Every point in the bowl
// is described by an angle t (atan2(z, x)) and an offset d outwards from the
// inner edge. The pitch runs along X.

import { STANDS, TAKEN_SHARE, COLORS } from './config.js';

export const A0 = 64, B0 = 46, NEXP = 4;
export const SECTORS = 32;
export const SECT_ANG = (Math.PI * 2) / SECTORS;
export const T_START = -Math.PI / 4; // sector 0 starts here, so stand 0 is centred on +X
export const SEGMENTS = 512; // ring resolution; a multiple of SECTORS so aisles line up

// Camp Nou: three tiers stacked steeply, a VIP ring between tier 1 and 2.
export const TIERS = [
  { id: 0, name: 'Lower tier', rows: 28, d0: 2.0, dd: 0.82, h0: 1.0, dh: 0.38, base: 100 },
  { id: 1, name: 'Middle tier', rows: 24, d0: 29.0, dd: 0.82, h0: 17.2, dh: 0.5, base: 200 },
  { id: 2, name: 'Upper tier', rows: 30, d0: 53.0, dd: 0.85, h0: 34.5, dh: 0.62, base: 300 },
];

export const RING = {
  floor: 11.6, ceil: 15.8, glassD: 26.5, backD: 33.0, // hospitality boxes
  facadeD: 80, roofOuterD: 80, roofOuterH: 57, roofInnerD: 6, roofInnerH: 60.5,
};

export function rAt(t) {
  const c = Math.abs(Math.cos(t)), s = Math.abs(Math.sin(t));
  return Math.pow(Math.pow(c / A0, NEXP) + Math.pow(s / B0, NEXP), -1 / NEXP);
}

export function point(t, d, out = { x: 0, z: 0 }) {
  const r = rAt(t) + d;
  out.x = r * Math.cos(t);
  out.z = r * Math.sin(t);
  return out;
}

// Unit vector pointing from the bowl towards the pitch at angle t.
export function inward(t, d, out = { x: 0, z: 0 }) {
  const e = 1e-4;
  const a = point(t - e, d, {}), b = point(t + e, d, {});
  let tx = b.x - a.x, tz = b.z - a.z;
  const l = Math.hypot(tx, tz) || 1;
  tx /= l; tz /= l;
  // left normal of the counter-clockwise tangent points inwards
  out.x = -tz; out.z = tx;
  const p = point(t, d, {});
  if (out.x * p.x + out.z * p.z > 0) { out.x = -out.x; out.z = -out.z; }
  return out;
}

export function wrapAngle(t) {
  const tau = Math.PI * 2;
  return ((t % tau) + tau) % tau;
}

export function sectorOf(t) {
  return Math.floor(wrapAngle(t - T_START) / SECT_ANG) % SECTORS;
}

export function standOfSector(k) { return Math.floor(k / 8); }

export function standCenterAngle(s) { return s * (Math.PI / 2); }

export function rowHeight(tier, i) { return tier.h0 + i * tier.dh; }
export function rowOffset(tier, i) { return tier.d0 + i * tier.dd; }

// Inverse of point(): world xz → (t, d).
export function locate(x, z) {
  const t = Math.atan2(z, x);
  return { t, d: Math.hypot(x, z) - rAt(t) };
}

export function tierAt(d) {
  for (const tier of TIERS) {
    const a = tier.d0 - tier.dd * 0.6, b = tier.d0 + (tier.rows - 0.4) * tier.dd;
    if (d >= a && d <= b) return tier;
  }
  return null;
}

function hash(a, b, c) {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

function blockPrice(tier, k) {
  const s = standOfSector(k);
  const tc = standCenterAngle(s);
  const tm = T_START + (k + 0.5) * SECT_ANG;
  let off = Math.abs(wrapAngle(tm - tc + Math.PI) - Math.PI); // 0 at stand centre
  const central = 1 - off / (Math.PI / 4);
  const base = [70, 55, 40][tier.id];
  const side = STANDS[s].side ? 30 : 5;
  return Math.round((base + side * central) / 5) * 5;
}

// Rasterise the "MÉS QUE UN CLUB" lettering that Camp Nou spells out in
// yellow seats across the middle and upper tiers of the Lateral stand.
function makeLettering() {
  const W = 600, H = 220;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  g.fillStyle = '#000';
  g.fillRect(0, 0, W, H);
  g.fillStyle = '#fff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = '900 96px "Arial Black", Arial, Helvetica, sans-serif';
  g.fillText('MÉS QUE', W / 2, H * 0.27, W - 10);
  g.fillText('UN CLUB', W / 2, H * 0.75, W - 10);
  const data = g.getImageData(0, 0, W, H).data;
  return {
    hit(u, v) {
      if (u < 0 || u > 1 || v < 0 || v > 1) return false;
      const x = Math.min(W - 1, Math.floor(u * W)), y = Math.min(H - 1, Math.floor(v * H));
      return data[(y * W + x) * 4] > 110;
    },
  };
}

// Builds every seat. Seats are stored block by block, so each block is a
// contiguous range — that is what lets every block be its own mesh.
export function buildSeats() {
  const xs = [], ys = [], zs = [], yaws = [], rows = [], nums = [], blockOf = [], taken = [], base = [];
  const blocks = [];
  const letters = makeLettering();
  const LT0 = 58 * Math.PI / 180, LT1 = 122 * Math.PI / 180; // Lateral lettering span
  const lettered = TIERS[1].rows;

  const tmpP = {}, tmpN = {};
  const SAMPLES = 96;
  const ts = new Float64Array(SAMPLES + 1), ss = new Float64Array(SAMPLES + 1);

  for (const tier of TIERS) {
    for (let k = 0; k < SECTORS; k++) {
      const stand = standOfSector(k);
      const ta = T_START + k * SECT_ANG, tb = ta + SECT_ANG;
      const block = {
        id: blocks.length, tier: tier.id, sector: k, stand,
        number: tier.base + k + 1, price: blockPrice(tier, k),
        start: xs.length, count: 0, free: 0,
        gate: `${STANDS[stand].short}${((k % 8) >> 1) + 1}`,
        cx: 0, cy: 0, cz: 0,
      };
      for (let i = 0; i < tier.rows; i++) {
        const d = rowOffset(tier, i) + 0.12;
        const h = rowHeight(tier, i);
        // arc length table for this row inside the sector
        let acc = 0, px = 0, pz = 0;
        for (let j = 0; j <= SAMPLES; j++) {
          const t = ta + (tb - ta) * (j / SAMPLES);
          point(t, d, tmpP);
          if (j > 0) acc += Math.hypot(tmpP.x - px, tmpP.z - pz);
          px = tmpP.x; pz = tmpP.z;
          ts[j] = t; ss[j] = acc;
        }
        const L = acc, aisle = 0.65, pitch = 0.5;
        const n = Math.max(0, Math.floor((L - 2 * aisle) / pitch) + 1);
        const startS = (L - (n - 1) * pitch) / 2;
        let j = 0;
        for (let m = 0; m < n; m++) {
          // seat numbers run left to right as seen from the seat, i.e. decreasing t
          const s = L - (startS + m * pitch);
          while (j < SAMPLES - 1 && ss[j + 1] < s) j++;
          const f = (s - ss[j]) / (ss[j + 1] - ss[j] || 1);
          const t = ts[j] + (ts[j + 1] - ts[j]) * f;
          point(t, d, tmpP);
          inward(t, d, tmpN);
          xs.push(tmpP.x); ys.push(h); zs.push(tmpP.z);
          yaws.push(Math.atan2(tmpN.x, tmpN.z));
          rows.push(i + 1); nums.push(m + 1); blockOf.push(block.id);

          // availability: clustered patches plus some scatter
          const patch = hash(block.id, i >> 2, m >> 3);
          const tk = patch < TAKEN_SHARE * 0.75 ? hash(block.id, i, m) < 0.8 : hash(i, m, block.id + 7) < TAKEN_SHARE * 0.25;
          taken.push(tk ? 1 : 0);
          if (!tk) block.free++;

          let col = tier.id === 0 ? COLORS.blue : COLORS.red;
          if (stand === 1 && tier.id === 1 && t > LT0 && t < LT1) {
            const gr = i;
            const u = (t - LT0) / (LT1 - LT0);
            const v = 1 - (gr + 0.5) / lettered;
            if (letters.hit(u, v)) col = COLORS.yellow;
          }
          if (col === COLORS.yellow && tk) { taken[taken.length - 1] = 0; block.free++; }
          base.push(col);
          block.cx += tmpP.x; block.cy += h; block.cz += tmpP.z;
          block.count++;
        }
      }
      block.cx /= block.count; block.cy /= block.count; block.cz /= block.count;
      blocks.push(block);
    }
  }

  return {
    count: xs.length,
    x: Float32Array.from(xs), y: Float32Array.from(ys), z: Float32Array.from(zs),
    yaw: Float32Array.from(yaws), row: Uint8Array.from(rows), num: Uint16Array.from(nums),
    block: Uint16Array.from(blockOf), taken: Uint8Array.from(taken), base: Uint32Array.from(base),
    blocks,
  };
}

export function standStats(seats, s) {
  let free = 0, from = Infinity;
  for (const b of seats.blocks) {
    if (b.stand !== s) continue;
    free += b.free;
    if (b.free > 0) from = Math.min(from, b.price);
  }
  return { free, from: from === Infinity ? 0 : from };
}
