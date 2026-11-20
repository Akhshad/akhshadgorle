// Sky, lighting, colour grade and the city around the stadium.

import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';

// Colour grade inside the tone-mapping shader: a neutral PBR curve, a gentle
// contrast S-curve and ~1.3 saturation. Costs nothing extra per pixel.
export function installColourGrade() {
  const chunk = THREE.ShaderChunk.tonemapping_pars_fragment;
  const needle = 'vec3 CustomToneMapping( vec3 color ) { return color; }';
  if (!chunk.includes(needle)) return false;
  THREE.ShaderChunk.tonemapping_pars_fragment = chunk.replace(needle, /* glsl */`
vec3 CustomToneMapping( vec3 color ) {
  color = NeutralToneMapping( color );
  vec3 c = pow( max( color, 0.0 ), vec3( 1.0 / 2.2 ) );
  c = mix( c, c * c * ( 3.0 - 2.0 * c ), 0.32 );
  color = pow( c, vec3( 2.2 ) );
  float l = dot( color, vec3( 0.2126, 0.7152, 0.0722 ) );
  color = mix( vec3( l ), color, 1.18 );
  return clamp( color, 0.0, 1.0 );
}`);
  return true;
}

export const SUN_ELEVATION = 40;
export const SUN_AZIMUTH = 215;

export function sunDirection() {
  const phi = THREE.MathUtils.degToRad(90 - SUN_ELEVATION);
  const theta = THREE.MathUtils.degToRad(SUN_AZIMUTH);
  return new THREE.Vector3().setFromSphericalCoords(1, phi, theta);
}

function makeSky() {
  const sky = new Sky();
  sky.scale.setScalar(4500);
  const u = sky.material.uniforms;
  u.turbidity.value = 5;
  u.rayleigh.value = 1.4;
  u.mieCoefficient.value = 0.004;
  u.mieDirectionalG.value = 0.8;
  u.sunPosition.value.copy(sunDirection());
  return sky;
}

export function buildSky(scene) {
  const sky = makeSky();
  sky.frustumCulled = false;
  scene.add(sky);
  return sky;
}

// Image-based lighting and reflections from the same sky, the sun lined up.
export function buildEnvironment(renderer, scene) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.add(makeSky());
  // a warm ground bounce so undersides are not blue
  const ground = new THREE.Mesh(new THREE.SphereGeometry(4000, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0x6f6a5c, side: THREE.BackSide }));
  envScene.add(ground);
  const rt = pmrem.fromScene(envScene, 0.02, 1, 5000);
  pmrem.dispose();
  if (scene.environment) scene.environment.dispose?.();
  scene.environment = rt.texture;
  scene.environmentIntensity = 0.55;
  return rt;
}

export function buildSun(scene, preset) {
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(preset.shadowSize, preset.shadowSize);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.04;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 1200;
  scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight(0xcfe3ff, 0x6b6250, 0.35);
  scene.add(hemi);
  return sun;
}

export function setShadowFocus(sun, renderer, center, radius) {
  const dir = sunDirection();
  sun.target.position.copy(center);
  sun.position.copy(center).addScaledVector(dir, 500);
  const c = sun.shadow.camera;
  c.left = -radius; c.right = radius; c.top = radius; c.bottom = -radius;
  c.near = 100; c.far = 900;
  c.updateProjectionMatrix();
  sun.target.updateMatrixWorld();
  sun.updateMatrixWorld();
  renderer.shadowMap.needsUpdate = true;
}

// ---------- ground: Barcelona around the stadium ----------

const EXTENT = 2600; // metres covered by the ground texture
const CELL = 133.6, BLOCKW = 113.3; // Eixample block grid
const DIAG_ANGLE = -0.42; // Av. Diagonal
const DIAG_OFFSET = 430;

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

function onDiagonal(x, z, half) {
  const nx = -Math.sin(DIAG_ANGLE), nz = Math.cos(DIAG_ANGLE);
  return Math.abs(x * nx + z * nz - DIAG_OFFSET) < half;
}

function cityCell(x, z) {
  const r = Math.hypot(x, z);
  if (r < 380) return false;
  if (onDiagonal(x, z, 45)) return false;
  return Math.abs(x) < EXTENT / 2 - 80 && Math.abs(z) < EXTENT / 2 - 80;
}

function groundTexture(anisotropy) {
  const N = 4096, s = N / EXTENT;
  const cv = document.createElement('canvas');
  cv.width = cv.height = N;
  const g = cv.getContext('2d');
  const W = (x) => (x + EXTENT / 2) * s;
  g.fillStyle = '#56595e'; // asphalt
  g.fillRect(0, 0, N, N);

  // city blocks: pavement squares with chamfered corners and green courtyards
  for (let gx = -12; gx <= 12; gx++) {
    for (let gz = -12; gz <= 12; gz++) {
      const cx = gx * CELL, cz = gz * CELL;
      if (!cityCell(cx, cz)) continue;
      const h = BLOCKW / 2, ch = 15;
      g.fillStyle = '#c9c1b2';
      g.beginPath();
      g.moveTo(W(cx - h + ch), W(cz - h)); g.lineTo(W(cx + h - ch), W(cz - h)); g.lineTo(W(cx + h), W(cz - h + ch));
      g.lineTo(W(cx + h), W(cz + h - ch)); g.lineTo(W(cx + h - ch), W(cz + h)); g.lineTo(W(cx - h + ch), W(cz + h));
      g.lineTo(W(cx - h), W(cz + h - ch)); g.lineTo(W(cx - h), W(cz - h + ch)); g.closePath(); g.fill();
      g.fillStyle = '#6f8f4e';
      g.fillRect(W(cx - h + 26), W(cz - h + 26), (BLOCKW - 52) * s, (BLOCKW - 52) * s);
    }
  }

  // Av. Diagonal: wide boulevard with a tree-lined central walk
  g.save();
  g.translate(W(0), W(0));
  g.rotate(DIAG_ANGLE);
  g.fillStyle = '#4d5055';
  g.fillRect(-EXTENT * s, (DIAG_OFFSET - 40) * s, EXTENT * 2 * s, 80 * s);
  g.fillStyle = '#b9b2a4';
  g.fillRect(-EXTENT * s, (DIAG_OFFSET - 7) * s, EXTENT * 2 * s, 14 * s);
  g.strokeStyle = 'rgba(255,255,255,0.7)';
  g.lineWidth = 0.25 * s * 2;
  g.setLineDash([3 * s, 6 * s]);
  for (const o of [-25, -15, 15, 25]) {
    g.beginPath(); g.moveTo(-EXTENT * s, (DIAG_OFFSET + o) * s); g.lineTo(EXTENT * s, (DIAG_OFFSET + o) * s); g.stroke();
  }
  g.restore();
  g.setLineDash([]);

  // park ring around the stadium
  g.fillStyle = '#4f7f37';
  g.beginPath(); g.arc(W(0), W(0), 360 * s, 0, Math.PI * 2); g.fill();
  const r = rng(7);
  for (let i = 0; i < 9000; i++) { // mottled grass
    const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * 360;
    g.fillStyle = r() < 0.5 ? 'rgba(40,80,25,0.18)' : 'rgba(150,190,90,0.14)';
    g.beginPath(); g.arc(W(Math.cos(a) * rr), W(Math.sin(a) * rr), (2 + r() * 7) * s, 0, Math.PI * 2); g.fill();
  }
  // winding paths
  g.strokeStyle = '#b8ad97';
  g.lineCap = 'round';
  g.lineWidth = 6 * s;
  for (let i = 0; i < 9; i++) {
    const a0 = (i / 9) * Math.PI * 2 + 0.2;
    g.beginPath();
    for (let j = 0; j <= 20; j++) {
      const f = j / 20, rr = 175 + f * 190;
      const a = a0 + Math.sin(f * 3 + i) * 0.18;
      const x = W(Math.cos(a) * rr), y = W(Math.sin(a) * rr);
      j ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();
  }
  g.beginPath(); g.ellipse(W(0), W(0), 262 * s, 250 * s, 0, 0, Math.PI * 2); g.stroke();
  // plaza and car park around the bowl
  g.fillStyle = '#c4bcad';
  g.beginPath(); g.ellipse(W(0), W(0), 178 * s, 160 * s, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = 'rgba(0,0,0,0.06)';
  g.lineWidth = 1;
  for (let i = -180; i <= 180; i += 6) { // paving joints
    g.beginPath(); g.moveTo(W(i), W(-180)); g.lineTo(W(i), W(180)); g.stroke();
    g.beginPath(); g.moveTo(W(-180), W(i)); g.lineTo(W(180), W(i)); g.stroke();
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  tex.generateMipmaps = true;
  return tex;
}

export function buildGround(scene, renderer, preset) {
  const tex = groundTexture(renderer.capabilities.getMaxAnisotropy());
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(EXTENT, EXTENT),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.06;
  ground.receiveShadow = true;
  scene.add(ground);

  // far ground beyond the texture so the horizon is not a cliff edge
  const far = new THREE.Mesh(new THREE.RingGeometry(EXTENT * 0.7, 6000, 64, 1),
    new THREE.MeshStandardMaterial({ color: 0x7d7a72, roughness: 1 }));
  far.rotation.x = -Math.PI / 2;
  far.position.y = -0.2;
  scene.add(far);

  buildTrees(scene, preset);
  if (preset.buildings) buildBuildings(scene);
  return { textures: [tex] };
}

function buildTrees(scene, preset) {
  const r = rng(42);
  const spots = [];
  const total = preset.trees;
  // park ring, avoiding the plaza
  while (spots.length < total * 0.6) {
    const a = r() * Math.PI * 2, rr = 190 + r() * 165;
    const x = Math.cos(a) * rr, z = Math.sin(a) * rr * 0.97;
    if (Math.abs(Math.hypot(x, z) - 256) < 6) continue; // ring path
    spots.push([x, z, 0.8 + r() * 0.7]);
  }
  // Av. Diagonal plane trees
  const tx = Math.cos(DIAG_ANGLE), tz = Math.sin(DIAG_ANGLE), nx = -tz, nz = tx;
  for (let s = -1250; s < 1250 && spots.length < total * 0.85; s += 11) {
    for (const o of [-11, 11, -33, 33]) {
      const x = tx * s + nx * (DIAG_OFFSET + o), z = tz * s + nz * (DIAG_OFFSET + o);
      if (Math.abs(x) < 1280 && Math.abs(z) < 1280) spots.push([x, z, 0.7 + r() * 0.3]);
    }
  }
  // courtyard trees
  for (let gx = -9; gx <= 9 && spots.length < total; gx++) {
    for (let gz = -9; gz <= 9 && spots.length < total; gz++) {
      const cx = gx * CELL, cz = gz * CELL;
      if (!cityCell(cx, cz)) continue;
      for (let i = 0; i < 3; i++) spots.push([cx + (r() - 0.5) * 50, cz + (r() - 0.5) * 50, 0.7 + r() * 0.4]);
    }
  }

  const crownGeo = new THREE.IcosahedronGeometry(1, 1);
  const trunkGeo = new THREE.CylinderGeometry(0.18, 0.28, 1, 5);
  trunkGeo.translate(0, 0.5, 0);
  const crowns = new THREE.InstancedMesh(crownGeo, new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true }), spots.length);
  const trunks = new THREE.InstancedMesh(trunkGeo, new THREE.MeshStandardMaterial({ color: 0x5a4632, roughness: 1 }), spots.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3(), col = new THREE.Color();
  spots.forEach(([x, z, k], i) => {
    const h = 9 * k;
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), r() * 6.28);
    p.set(x, h * 0.62, z); sc.set(3.6 * k, 3.2 * k, 3.6 * k);
    crowns.setMatrixAt(i, m.compose(p, q, sc));
    col.setHSL(0.24 + r() * 0.07, 0.45 + r() * 0.2, 0.2 + r() * 0.1);
    crowns.setColorAt(i, col);
    p.set(x, 0, z); sc.set(k, h * 0.5, k);
    trunks.setMatrixAt(i, m.compose(p, q, sc));
  });
  crowns.castShadow = true;
  crowns.receiveShadow = true;
  crowns.computeBoundingSphere();
  trunks.computeBoundingSphere();
  scene.add(crowns, trunks);
}

function buildBuildings(scene) {
  const r = rng(99);
  const parts = [];
  for (let gx = -9; gx <= 9; gx++) {
    for (let gz = -9; gz <= 9; gz++) {
      const cx = gx * CELL, cz = gz * CELL;
      if (!cityCell(cx, cz)) continue;
      const h = BLOCKW / 2 - 2, depth = 20;
      const hgt = () => 16 + Math.floor(r() * 5) * 3.2;
      parts.push([cx, cz - h + depth / 2, BLOCKW - 34, depth, hgt()]);
      parts.push([cx, cz + h - depth / 2, BLOCKW - 34, depth, hgt()]);
      parts.push([cx - h + depth / 2, cz, depth, BLOCKW - 34, hgt()]);
      parts.push([cx + h - depth / 2, cz, depth, BLOCKW - 34, hgt()]);
      // chamfered corner buildings
      for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        parts.push([cx + sx * (h - 13), cz + sz * (h - 13), 22, 22, hgt(), Math.PI / 4]);
      }
    }
  }
  const geo = new THREE.BoxGeometry(1, 1, 1);
  geo.translate(0, 0.5, 0);
  const mesh = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: 0.85 }), parts.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3(), c = new THREE.Color();
  const up = new THREE.Vector3(0, 1, 0);
  const palette = [0xe8dcc6, 0xd9c8aa, 0xefe6d6, 0xcdb99a, 0xe2d2bd, 0xc9b8a6];
  parts.forEach(([x, z, w, d, h, rot = 0], i) => {
    q.setFromAxisAngle(up, rot);
    mesh.setMatrixAt(i, m.compose(p.set(x, 0, z), q, s.set(w, h, d)));
    mesh.setColorAt(i, c.setHex(palette[Math.floor(r() * palette.length)]));
  });
  mesh.receiveShadow = true;
  mesh.computeBoundingSphere();
  scene.add(mesh);
}
