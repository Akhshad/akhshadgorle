// The bowl, roof, pitch and hospitality boxes, all generated procedurally in
// the shape of Spotify Camp Nou: an oval three-tier bowl under a ring roof.

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { TIERS, RING, SEGMENTS, SECTORS, T_START, point, inward, rowHeight, rowOffset, standCenterAngle } from './layout.js';

const UP = new THREE.Vector3(0, 1, 0);

// Local frame at angle t / offset d: +Z faces the pitch.
export function frameAt(t, d, h) {
  const p = point(t, d, {});
  const n = inward(t, d, {});
  const yaw = Math.atan2(n.x, n.z);
  return {
    pos: new THREE.Vector3(p.x, h, p.z),
    n: new THREE.Vector3(n.x, 0, n.z),
    tan: new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw)), // local +X
    yaw,
    quat: new THREE.Quaternion().setFromAxisAngle(UP, yaw),
  };
}

// Sweeps a 2D (d, h) profile all the way round the bowl.
function sweep(profile, colorFn, { segs = SEGMENTS, t0 = T_START, t1 = T_START + Math.PI * 2 } = {}) {
  const P = profile.length;
  const pts = new Float32Array(P * (segs + 1) * 2);
  const tmp = {};
  for (let j = 0; j <= segs; j++) {
    const t = t0 + (t1 - t0) * (j / segs);
    for (let k = 0; k < P; k++) {
      point(t, profile[k][0], tmp);
      const o = (j * P + k) * 2;
      pts[o] = tmp.x; pts[o + 1] = tmp.z;
    }
  }
  const quads = segs * (P - 1);
  const pos = new Float32Array(quads * 18), col = new Float32Array(quads * 18), uv = new Float32Array(quads * 12);
  const c = new THREE.Color();
  let v = 0, u = 0;
  for (let j = 0; j < segs; j++) {
    for (let k = 0; k < P - 1; k++) {
      const a0 = (j * P + k) * 2, b0 = (j * P + k + 1) * 2, a1 = ((j + 1) * P + k) * 2, b1 = ((j + 1) * P + k + 1) * 2;
      const ha = profile[k][1], hb = profile[k + 1][1];
      const quad = [
        [pts[a0], ha, pts[a0 + 1], j / segs, k / (P - 1)],
        [pts[b0], hb, pts[b0 + 1], j / segs, (k + 1) / (P - 1)],
        [pts[b1], hb, pts[b1 + 1], (j + 1) / segs, (k + 1) / (P - 1)],
        [pts[a0], ha, pts[a0 + 1], j / segs, k / (P - 1)],
        [pts[b1], hb, pts[b1 + 1], (j + 1) / segs, (k + 1) / (P - 1)],
        [pts[a1], ha, pts[a1 + 1], (j + 1) / segs, k / (P - 1)],
      ];
      c.setHex(colorFn ? colorFn(j, k, profile[k], profile[k + 1]) : 0xffffff);
      for (const q of quad) {
        pos[v] = q[0]; pos[v + 1] = q[1]; pos[v + 2] = q[2];
        col[v] = c.r; col[v + 1] = c.g; col[v + 2] = c.b;
        uv[u] = q[3]; uv[u + 1] = q[4];
        v += 3; u += 2;
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
}

function tierSteps(tier) {
  const pts = [];
  for (let i = 0; i < tier.rows; i++) {
    const h = rowHeight(tier, i), back = rowOffset(tier, i) + tier.dd / 2;
    pts.push([back, h]);
    if (i < tier.rows - 1) pts.push([back, rowHeight(tier, i + 1)]);
  }
  return pts;
}

const CONCRETE = 0xc9c5bd, RISER = 0xa9a59e, AISLE = 0xe2ded6;
const aisleEvery = SEGMENTS / SECTORS;

function terraceColor(j, k, a, b) {
  const tread = a[1] === b[1];
  if (j % aisleEvery === 0) return tread ? AISLE : 0xc6c2ba;
  return tread ? CONCRETE : RISER;
}

function pitchTexture(anisotropy) {
  const PX = 16, Wm = 128, Hm = 92;
  const cv = document.createElement('canvas');
  cv.width = Wm * PX; cv.height = Hm * PX;
  const g = cv.getContext('2d');
  const X = (x) => (x + Wm / 2) * PX, Y = (z) => (z + Hm / 2) * PX;
  // mowing stripes
  const stripe = 105 / 18;
  for (let i = -12; i < 12; i++) {
    g.fillStyle = i % 2 ? '#2e7433' : '#37803a';
    g.fillRect(X(i * stripe), 0, stripe * PX + 1, cv.height);
  }
  // subtle noise
  const img = g.getImageData(0, 0, cv.width, cv.height);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 10;
    img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n * 0.6;
  }
  g.putImageData(img, 0, 0);
  g.strokeStyle = 'rgba(255,255,255,0.92)';
  g.lineWidth = 0.12 * PX;
  const L = 52.5, Wd = 34;
  g.strokeRect(X(-L), Y(-Wd), 2 * L * PX, 2 * Wd * PX);
  g.beginPath(); g.moveTo(X(0), Y(-Wd)); g.lineTo(X(0), Y(Wd)); g.stroke();
  g.beginPath(); g.arc(X(0), Y(0), 9.15 * PX, 0, Math.PI * 2); g.stroke();
  for (const s of [-1, 1]) {
    const gx = s * L;
    g.strokeRect(Math.min(X(gx), X(gx - s * 16.5)), Y(-20.16), 16.5 * PX, 40.32 * PX);
    g.strokeRect(Math.min(X(gx), X(gx - s * 5.5)), Y(-9.16), 5.5 * PX, 18.32 * PX);
    g.beginPath();
    const a = Math.acos(5.5 / 9.15);
    if (s > 0) g.arc(X(gx - 11), Y(0), 9.15 * PX, Math.PI - a, Math.PI + a);
    else g.arc(X(gx + 11), Y(0), 9.15 * PX, -a, a);
    g.stroke();
    g.fillStyle = '#fff';
    g.beginPath(); g.arc(X(gx - s * 11), Y(0), 0.2 * PX, 0, Math.PI * 2); g.fill();
    for (const t of [-1, 1]) {
      g.beginPath(); g.arc(X(gx), Y(t * Wd), 1 * PX, 0, Math.PI * 2); g.stroke();
    }
  }
  g.fillStyle = '#fff';
  g.beginPath(); g.arc(X(0), Y(0), 0.25 * PX, 0, Math.PI * 2); g.fill();
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  return tex;
}

function stripTexture(text, colors, w = 2048, h = 64) {
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const g = cv.getContext('2d');
  const n = colors.length, seg = w / n;
  colors.forEach((c, i) => { g.fillStyle = c; g.fillRect(i * seg, 0, seg + 1, h); });
  g.fillStyle = '#fff';
  g.font = `800 ${Math.round(h * 0.55)}px Inter, Arial, sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  for (let i = 0; i < n; i++) g.fillText(text, i * seg + seg / 2, h / 2 + 2);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

function netTexture() {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 64;
  const g = cv.getContext('2d');
  g.strokeStyle = 'rgba(255,255,255,0.9)';
  g.lineWidth = 3;
  g.strokeRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function buildGoals(group) {
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const net = new THREE.MeshBasicMaterial({ map: netTexture(), transparent: true, alphaTest: 0.3, side: THREE.DoubleSide, depthWrite: false });
  net.map.repeat.set(30, 10);
  for (const s of [-1, 1]) {
    const x = s * 52.5;
    const post = new THREE.CylinderGeometry(0.06, 0.06, 2.44, 8);
    for (const z of [-3.66, 3.66]) {
      const m = new THREE.Mesh(post, white); m.position.set(x, 1.22, z); m.castShadow = true; group.add(m);
    }
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 7.32, 8), white);
    bar.rotation.x = Math.PI / 2; bar.position.set(x, 2.44, 0); bar.castShadow = true; group.add(bar);
    const back = new THREE.Mesh(new THREE.PlaneGeometry(7.32, 2.44), net);
    back.rotation.y = Math.PI / 2; back.position.set(x + s * 2, 1.22, 0); group.add(back);
    const top = new THREE.Mesh(new THREE.PlaneGeometry(2, 7.32), net);
    top.rotation.x = -Math.PI / 2; top.position.set(x + s * 1, 2.44, 0); group.add(top);
    for (const z of [-3.66, 3.66]) {
      const side = new THREE.Mesh(new THREE.PlaneGeometry(2, 2.44), net);
      side.position.set(x + s * 1, 1.22, z); group.add(side);
    }
  }
}

function buildBoards(group) {
  const tex = stripTexture('FC BARCELONA', ['#a50044', '#004d98', '#a50044', '#004d98'], 1024, 64);
  const mat = new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.35, roughness: 0.5 });
  const L = 55, W = 37, h = 0.9;
  const sides = [
    [0, -W, 2 * L, 0], [0, W, 2 * L, Math.PI], [L, 0, 2 * W, -Math.PI / 2], [-L, 0, 2 * W, Math.PI / 2],
  ];
  for (const [x, z, len, rot] of sides) {
    const t = tex.clone(); t.repeat.set(len / 28, 1); t.needsUpdate = true;
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, h, 0.25), mat.clone());
    m.material.map = t; m.material.emissiveMap = t;
    m.position.set(x, h / 2, z); m.rotation.y = rot; m.castShadow = true; m.receiveShadow = true;
    group.add(m);
  }
}

function armchairGeometry() {
  const parts = [
    new RoundedBoxGeometry(0.72, 0.4, 0.72, 2, 0.06).translate(0, 0.24, 0.02),
    new RoundedBoxGeometry(0.72, 0.62, 0.2, 2, 0.06).translate(0, 0.66, -0.28),
    new RoundedBoxGeometry(0.16, 0.5, 0.72, 2, 0.05).translate(-0.36, 0.42, 0.02),
    new RoundedBoxGeometry(0.16, 0.5, 0.72, 2, 0.05).translate(0.36, 0.42, 0.02),
  ];
  return mergeGeometries(parts);
}

// Hospitality skyboxes, one per stand, in the VIP ring above the lower tier.
function buildSkyboxes(group) {
  const numbers = [6, 24, 12, 18];
  const boxes = [];
  const chairs = [];
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x2b2f38, roughness: 0.8 });
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x3a3330, roughness: 0.7 });
  for (let s = 0; s < 4; s++) {
    const tc = standCenterAngle(s);
    const f = frameAt(tc, (RING.glassD + RING.backD) / 2, RING.floor);
    const box = { stand: s, number: numbers[s], seats: [] };
    // side walls
    for (const side of [-1, 1]) {
      const w = new THREE.Mesh(new THREE.BoxGeometry(0.15, RING.ceil - RING.floor, RING.backD - RING.glassD), wallMat);
      w.position.copy(f.pos).addScaledVector(f.tan, side * 4.4).setY(RING.floor + (RING.ceil - RING.floor) / 2);
      w.quaternion.copy(f.quat);
      group.add(w);
    }
    // raised second row
    const riser = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.35, 2.6), floorMat);
    const fr = frameAt(tc, 31.1, RING.floor + 0.175);
    riser.position.copy(fr.pos); riser.quaternion.copy(f.quat); riser.receiveShadow = true;
    group.add(riser);
    for (let row = 0; row < 2; row++) {
      const d = row === 0 ? 28.0 : 30.9;
      const h = RING.floor + (row === 0 ? 0 : 0.35);
      const rf = frameAt(tc, d, h);
      for (let i = 0; i < 6; i++) {
        // seat 1 on the left as seen from the chair
        const off = (2.5 - i) * 1.15;
        const pos = rf.pos.clone().addScaledVector(rf.tan, -off);
        chairs.push({ pos, quat: rf.quat });
        box.seats.push({ row: row + 1, seat: i + 1, pos, yaw: rf.yaw, n: rf.n.clone() });
      }
    }
    boxes.push(box);
  }
  const geo = armchairGeometry();
  const mat = new THREE.MeshStandardMaterial({ color: 0x5b3322, roughness: 0.42, metalness: 0.0 });
  const mesh = new THREE.InstancedMesh(geo, mat, chairs.length);
  const m = new THREE.Matrix4(), one = new THREE.Vector3(1, 1, 1);
  chairs.forEach((c, i) => mesh.setMatrixAt(i, m.compose(c.pos, c.quat, one)));
  mesh.castShadow = true; mesh.receiveShadow = true;
  mesh.computeBoundingSphere();
  group.add(mesh);
  return boxes;
}

export function buildStadium(scene, renderer) {
  const group = new THREE.Group();
  const aniso = renderer.capabilities.getMaxAnisotropy();
  const textures = [];

  const [T1, T2, T3] = TIERS;
  const dF = (t) => t.d0 - t.dd / 2;
  const top = (t) => rowHeight(t, t.rows - 1);
  const back = (t) => rowOffset(t, t.rows - 1) + t.dd / 2;

  // ---- concrete structure: three terraced tiers and the rings between them
  const profT1 = [[dF(T1), 0], [dF(T1), T1.h0], ...tierSteps(T1), [back(T1), RING.floor], [RING.backD, RING.floor]];
  const profT2 = [[RING.glassD - 0.4, RING.ceil], [dF(T2), RING.ceil], [dF(T2), T2.h0], ...tierSteps(T2), [dF(T3), top(T2)]];
  const profT3 = [[dF(T3), top(T2)], [dF(T3), T3.h0], ...tierSteps(T3), [back(T3), top(T3) + 2], [RING.facadeD, top(T3) + 2]];
  const structGeo = mergeGeometries([
    sweep(profT1, terraceColor), sweep(profT2, terraceColor), sweep(profT3, terraceColor),
  ]);
  const structMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, side: THREE.DoubleSide });
  const structure = new THREE.Mesh(structGeo, structMat);
  structure.castShadow = true; structure.receiveShadow = true;
  group.add(structure);

  // hospitality interior: ceiling and back wall
  const interior = new THREE.Mesh(mergeGeometries([
    sweep([[RING.glassD - 0.4, RING.ceil - 0.02], [RING.backD, RING.ceil - 0.02]], () => 0xd8d6d0, { segs: 256 }),
    sweep([[RING.backD, RING.floor], [RING.backD, RING.ceil]], () => 0x3b3f47, { segs: 256 }),
  ]), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, side: THREE.DoubleSide }));
  interior.receiveShadow = true;
  group.add(interior);

  // glass front of the VIP ring
  const glass = new THREE.Mesh(
    sweep([[RING.glassD, RING.floor], [RING.glassD, RING.ceil]], null, { segs: 256 }),
    new THREE.MeshStandardMaterial({ color: 0x9fc4d6, roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide }),
  );
  glass.renderOrder = 2;
  group.add(glass);

  // mullions on the glass, and glass rails along each tier front
  const mullGeo = new THREE.BoxGeometry(0.12, RING.ceil - RING.floor, 0.12);
  const mullCount = 192;
  const mull = new THREE.InstancedMesh(mullGeo, new THREE.MeshStandardMaterial({ color: 0x8b9099, roughness: 0.5, metalness: 0.4 }), mullCount);
  const m4 = new THREE.Matrix4(), one = new THREE.Vector3(1, 1, 1);
  for (let i = 0; i < mullCount; i++) {
    const f = frameAt(T_START + (i / mullCount) * Math.PI * 2, RING.glassD, (RING.floor + RING.ceil) / 2);
    mull.setMatrixAt(i, m4.compose(f.pos, f.quat, one));
  }
  mull.computeBoundingSphere();
  group.add(mull);

  const railMat = new THREE.MeshStandardMaterial({ color: 0xbfd4de, transparent: true, opacity: 0.35, roughness: 0.1, depthWrite: false, side: THREE.DoubleSide });
  for (const t of [T2, T3]) {
    const rail = new THREE.Mesh(sweep([[dF(t) - 0.05, t.h0], [dF(t) - 0.05, t.h0 + 1.0]], null, { segs: 256 }), railMat);
    group.add(rail);
  }

  // 360° LED ribbon on the upper tier front
  const ledTex = stripTexture('SPOTIFY CAMP NOU · MÉS QUE UN CLUB', ['#0b1a3a', '#a50044', '#0b1a3a', '#004d98'], 4096, 96);
  ledTex.repeat.set(4, 1);
  textures.push(ledTex);
  const led = new THREE.Mesh(
    sweep([[dF(T3) - 0.08, top(T2) + 1.0], [dF(T3) - 0.08, T3.h0 - 0.4]], null, { segs: 512 }),
    new THREE.MeshStandardMaterial({ map: ledTex, emissive: 0xffffff, emissiveMap: ledTex, emissiveIntensity: 0.9, roughness: 0.4, side: THREE.DoubleSide }),
  );
  group.add(led);

  // ---- façade with Camp Nou's stacked exterior terraces
  const facadeProfiles = [sweep([[RING.facadeD, 0], [RING.facadeD, RING.roofOuterH]], () => 0xd9d6cf, { segs: 256 })];
  for (let h = 8; h < 56; h += 8.4) {
    facadeProfiles.push(sweep([[RING.facadeD, h], [RING.facadeD + 6, h], [RING.facadeD + 6, h + 0.7], [RING.facadeD, h + 0.7]], () => 0xf3f1ec, { segs: 256 }));
  }
  const facade = new THREE.Mesh(mergeGeometries(facadeProfiles), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, side: THREE.DoubleSide }));
  facade.castShadow = true; facade.receiveShadow = true;
  group.add(facade);

  // façade columns
  const colCount = 96;
  const colGeo = new THREE.BoxGeometry(0.7, RING.roofOuterH, 0.7).translate(0, RING.roofOuterH / 2, 0);
  const cols = new THREE.InstancedMesh(colGeo, new THREE.MeshStandardMaterial({ color: 0xeeeae2, roughness: 0.7 }), colCount);
  for (let i = 0; i < colCount; i++) {
    const f = frameAt(T_START + (i / colCount) * Math.PI * 2, RING.facadeD + 6, 0);
    cols.setMatrixAt(i, m4.compose(f.pos, f.quat, one));
  }
  cols.castShadow = true;
  cols.computeBoundingSphere();
  group.add(cols);

  // ---- ring roof: translucent membrane on radial trusses
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xf4f6f8, roughness: 0.6, transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide });
  const roof = new THREE.Mesh(sweep([[RING.roofOuterD, RING.roofOuterH], [RING.roofInnerD, RING.roofInnerH]], null, { segs: 256 }), roofMat);
  roof.renderOrder = 3;
  group.add(roof);
  const rim = new THREE.Mesh(mergeGeometries([
    sweep([[RING.roofInnerD, RING.roofInnerH], [RING.roofInnerD, RING.roofInnerH - 1.6]], () => 0xffffff, { segs: 256 }),
    sweep([[RING.roofOuterD, RING.roofOuterH], [RING.roofOuterD + 6.5, RING.roofOuterH], [RING.roofOuterD + 6.5, RING.roofOuterH - 1.2]], () => 0xffffff, { segs: 256 }),
  ]), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, side: THREE.DoubleSide }));
  rim.castShadow = true;
  group.add(rim);

  const trussCount = 128;
  const trussGeo = new THREE.BoxGeometry(0.5, 1.4, 1).translate(0, 0, 0.5);
  const truss = new THREE.InstancedMesh(trussGeo, new THREE.MeshStandardMaterial({ color: 0xe7e9ec, roughness: 0.45, metalness: 0.5 }), trussCount);
  const q = new THREE.Quaternion(), s = new THREE.Vector3(), lookM = new THREE.Matrix4();
  for (let i = 0; i < trussCount; i++) {
    const t = T_START + (i / trussCount) * Math.PI * 2;
    const a = point(t, RING.roofOuterD, {}), b = point(t, RING.roofInnerD, {});
    const A = new THREE.Vector3(a.x, RING.roofOuterH - 0.4, a.z), B = new THREE.Vector3(b.x, RING.roofInnerH - 0.4, b.z);
    lookM.lookAt(B, A, UP); // +Z from A towards B
    q.setFromRotationMatrix(lookM);
    s.set(1, 1, A.distanceTo(B));
    truss.setMatrixAt(i, m4.compose(A, q, s));
  }
  truss.castShadow = true;
  truss.computeBoundingSphere();
  group.add(truss);
  // ring beams across the trusses
  const beams = new THREE.Mesh(mergeGeometries([0.25, 0.5, 0.75].map((f) => {
    const d = RING.roofOuterD + (RING.roofInnerD - RING.roofOuterD) * f;
    const h = RING.roofOuterH + (RING.roofInnerH - RING.roofOuterH) * f - 0.9;
    return sweep([[d - 0.3, h], [d + 0.3, h]], () => 0xd9dce0, { segs: 256 });
  })), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, side: THREE.DoubleSide }));
  beams.castShadow = true;
  group.add(beams);

  // ---- pitch and surroundings
  const pitchTex = pitchTexture(aniso);
  textures.push(pitchTex);
  const pitch = new THREE.Mesh(new THREE.PlaneGeometry(128, 92), new THREE.MeshStandardMaterial({ map: pitchTex, roughness: 0.95 }));
  pitch.rotation.x = -Math.PI / 2;
  pitch.position.y = 0.02;
  pitch.receiveShadow = true;
  group.add(pitch);
  const shape = new THREE.Shape();
  for (let i = 0; i <= 128; i++) {
    const p = point((i / 128) * Math.PI * 2, 3, {});
    // shape is built in the XY plane, then rotated flat: y here becomes -z
    i ? shape.lineTo(p.x, -p.z) : shape.moveTo(p.x, -p.z);
  }
  const apron = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshStandardMaterial({ color: 0x2c6b33, roughness: 1 }));
  apron.rotation.x = -Math.PI / 2;
  apron.position.y = 0.005;
  apron.receiveShadow = true;
  group.add(apron);
  buildGoals(group);
  buildBoards(group);

  const skyboxes = buildSkyboxes(group);

  scene.add(group);
  const parts = { facade: [facade], roof: [roof, rim, truss, beams], columns: [cols] };
  return { group, structure, pickMeshes: [structure], roofMat, skyboxes, textures, parts };
}
