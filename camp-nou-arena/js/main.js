import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SITE, STANDS, MODEL } from './config.js';
import { detectDevice } from './device.js';
import { TIERS, SECTORS, locate, tierAt, sectorOf, standOfSector, standCenterAngle, standStats, buildSeats } from './layout.js';
import { installColourGrade, buildSky, buildEnvironment, buildSun, setShadowFocus, buildGround } from './world.js';
import { buildStadium, frameAt } from './stadium.js';
import { Seats } from './seats.js';
import { Screens } from './screens.js';

const $ = (s) => document.querySelector(s);
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
const UP = new THREE.Vector3(0, 1, 0);
const fmt = (n) => n.toLocaleString('en-US');
const eur = (n) => `${SITE.currency}${n}`;

const device = detectDevice();
const preset = device.preset;
document.body.classList.toggle('phone', device.phone);

// ---------------- preloader ----------------
const plBar = $('#pl-progress'), plStatus = $('#pl-status');
function progress(f, label) {
  plBar.style.transform = `scaleX(${f})`;
  if (label) plStatus.textContent = label;
}

$('#site-title').textContent = SITE.title;
$('#site-fixture').textContent = `${SITE.fixture} · ${SITE.meta}`;
document.querySelector('.pl-title').textContent = SITE.title;

// ---------------- renderer ----------------
installColourGrade();
const canvas = $('#gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
let pixelRatio = preset.pixelRatio;
renderer.setPixelRatio(pixelRatio);
renderer.setSize(innerWidth, innerHeight, false);
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.CustomToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = preset.softShadows ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
renderer.shadowMap.autoUpdate = false; // cached shadows: redrawn only when asked

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xc6d3e0, 1100, 3200);
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.5, 9000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.enabled = false;
controls.rotateSpeed = device.phone ? 0.6 : 0.5;

let needsRender = true;
const invalidate = () => { needsRender = true; };
controls.addEventListener('change', invalidate);

// ---------------- state ----------------
const state = { mode: 'loading', stand: -1, block: -1, seat: -1, skybox: -1, viewFrom: 'seat', hover: null, preview: null };
let seats, seatData, stadium, screens, sun;
let flight = null;
const look = { target: new THREE.Vector3(), yaw: 0, pitch: 0, eye: new THREE.Vector3() };
let lastMove = performance.now();
let touching = 0;

const app = { state, ready: false };
window.app = app;

// ---------------- build ----------------
async function build() {
  progress(0.05, 'Setting up the sky');
  await nextFrame();
  buildSky(scene);
  buildEnvironment(renderer, scene);
  sun = buildSun(scene, preset);

  progress(0.2, 'Laying out Barcelona');
  await nextFrame();
  const ground = buildGround(scene, renderer, preset);

  progress(0.4, 'Pouring the concrete');
  await nextFrame();
  stadium = buildStadium(scene, renderer);

  progress(0.55, 'Bolting in ~90,000 seats');
  await nextFrame();
  seatData = buildSeats();
  seats = new Seats(scene, seatData, preset);

  progress(0.7, 'Hanging the screens');
  await nextFrame();
  screens = new Screens(scene, $('#css-host'), preset, device);
  $('#live-count').textContent = screens.enabled ? `${screens.count} live screens` : `${screens.count} screens`;
  $('#live-sub').textContent = screens.enabled ? 'Football shorts' : 'Add videos in config.js';
  $('#live').classList.toggle('off', !screens.enabled);

  progress(0.78, 'Looking for a 3D model');
  await loadModel();

  progress(0.85, 'Warming up the GPU');
  await nextFrame();
  // compile every shader and upload every texture now, so nothing stalls mid-flight
  seats.detail.visible = seats.posts.visible = true;
  seats.detail.count = 1;
  for (const t of [...ground.textures, ...stadium.textures, screens.texture]) renderer.initTexture(t);
  setPose(introPose());
  setShadowFocus(sun, renderer, new THREE.Vector3(), 175);
  await renderer.compileAsync(scene, camera);
  renderer.render(scene, camera);
  seats.detail.visible = seats.posts.visible = false;

  progress(1, 'Kick-off');
  await nextFrame();
  resize(true);
  $('#preloader').classList.add('done');
  $('#ui').classList.remove('hidden-ui');
  setTimeout(() => $('#preloader').classList.add('hidden'), 800);
  goAerial(true);
  app.ready = true;
}

async function loadModel() {
  if (!MODEL || !MODEL.url) return;
  try {
    const head = await fetch(MODEL.url, { method: 'HEAD' });
    if (!head.ok || (head.headers.get('content-type') || '').includes('text/html')) return;
    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
    const gltf = await new GLTFLoader().loadAsync(MODEL.url, (e) => {
      if (e.total) progress(0.78 + 0.06 * (e.loaded / e.total), 'Loading the Camp Nou model');
    });
    const root = gltf.scene;
    root.rotation.y = MODEL.rotationY || 0;
    root.updateMatrixWorld(true);
    let box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    let s = MODEL.scale || 1;
    if (MODEL.autoFit) s *= 300 / Math.max(size.x, size.z); // procedural bowl is ~300 m long
    root.scale.setScalar(s);
    root.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(root);
    const c = box.getCenter(new THREE.Vector3());
    const [ox, oy, oz] = MODEL.offset || [0, 0, 0];
    root.position.set(-c.x + ox, -box.min.y + oy, -c.z + oz);
    root.traverse((o) => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } });
    scene.add(root);
    for (const k of MODEL.hide || []) for (const o of stadium.parts[k] || []) o.visible = false;
    app.model = root;
  } catch (e) {
    console.warn('Model not loaded:', e);
  }
}

// ---------------- camera poses & flights ----------------
function pose(pos, target, fov = 45) { return { pos: pos.clone(), target: target.clone(), fov }; }
function currentPose() { return pose(camera.position, look.target, camera.fov); }
function setPose(p) {
  camera.position.copy(p.pos);
  look.target.copy(p.target);
  camera.fov = p.fov;
  camera.lookAt(p.target);
  camera.updateProjectionMatrix();
}

let aerialAz = Math.PI - 0.35;
function aerialPose() {
  const t = new THREE.Vector3(0, 10, 0);
  const d = device.phone && innerHeight > innerWidth ? 560 : 400;
  return pose(t.clone().add(new THREE.Vector3().setFromSphericalCoords(d, 0.86, aerialAz)), t);
}
function introPose() {
  const t = new THREE.Vector3(0, 10, 0);
  return pose(t.clone().add(new THREE.Vector3().setFromSphericalCoords(1150, 0.55, aerialAz - 0.9)), t);
}
function standPose(s) {
  const f = frameAt(standCenterAngle(s), 40, 24);
  const back = device.phone && innerHeight > innerWidth ? 1.5 : 1;
  return pose(f.pos.clone().addScaledVector(f.n, 112 * back).addScaledVector(UP, 52 * back), f.pos);
}
function blockPose(id) {
  const b = seatData.blocks[id];
  const t = new THREE.Vector3(b.cx, b.cy, b.cz);
  const f = frameAt(standCenterAngle(b.stand) + (b.sector % 8 - 3.5) * (Math.PI * 2 / SECTORS), 0, 0);
  const n = new THREE.Vector3(-b.cx, 0, -b.cz).normalize().lerp(f.n, 0.5).normalize();
  const k = device.phone && innerHeight > innerWidth ? 1.5 : 1;
  return pose(t.clone().addScaledVector(n, 26 * k).addScaledVector(UP, 15 * k), t);
}
function seatNormal(k) { const y = seatData.yaw[k]; return new THREE.Vector3(Math.sin(y), 0, Math.cos(y)); }
function seatPos(k) { return new THREE.Vector3(seatData.x[k], seatData.y[k], seatData.z[k]); }
function seatPose(k) {
  const p = seatPos(k), n = seatNormal(k);
  const target = p.clone().addScaledVector(UP, 0.1).addScaledVector(n, 0.55);
  const k2 = device.phone ? 1.35 : 1;
  return pose(p.clone().addScaledVector(n, 1.9 * k2).addScaledVector(UP, 3.6 * k2), target, 50);
}
function eyeOf(pos, n) { return pos.clone().addScaledVector(UP, 1.18).addScaledVector(n, 0.05); }
function viewPose(eye) {
  const target = new THREE.Vector3(0, 0, 0);
  const dir = target.clone().sub(eye).normalize();
  return pose(eye, eye.clone().addScaledVector(dir, 30), device.phone ? 62 : 55);
}
function skyboxPose(s) {
  const f = frameAt(standCenterAngle(s), 32.4, 11.6);
  const eye = f.pos.clone().addScaledVector(UP, 2.4);
  return pose(eye, eye.clone().addScaledVector(f.n, 30).addScaledVector(UP, -6), device.phone ? 66 : 58);
}

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const roofOpacity = { aerial: 0.16, stand: 0.22, block: 0.45, seat: 0.45, skybox: 0.6, view: 0.6 };
const shadowFocus = { aerial: 175, stand: 110, block: 45, seat: 28, skybox: 165, view: 165 };

function focusFor(mode, p) {
  if (mode === 'aerial' || mode === 'view' || mode === 'skybox') return { c: new THREE.Vector3(), r: shadowFocus[mode] };
  return { c: p.target.clone().setY(0), r: shadowFocus[mode] };
}

function flyTo(to, mode, dur = 1.6, onEnd) {
  const from = currentPose();
  const dist = from.pos.distanceTo(to.pos);
  controls.enabled = false;
  // one shadow map that covers the whole route
  const a = focusFor(state.mode in shadowFocus ? state.mode : 'aerial', from), b = focusFor(mode, to);
  const mid = a.c.clone().add(b.c).multiplyScalar(0.5);
  setShadowFocus(sun, renderer, mid, Math.min(200, Math.max(a.r, b.r) + a.c.distanceTo(b.c) / 2));
  flight = {
    from, to, t0: performance.now(), dur: dur * 1000, arc: Math.min(35, dist * 0.12),
    roofFrom: stadium.roofMat.opacity, roofTo: roofOpacity[mode] ?? 0.4,
    onEnd: () => {
      setShadowFocus(sun, renderer, b.c, b.r);
      onEnd && onEnd();
    },
  };
}

const tmpV = new THREE.Vector3();
function stepFlight(now) {
  const f = flight;
  const raw = Math.min(1, (now - f.t0) / f.dur);
  const t = ease(raw);
  camera.position.lerpVectors(f.from.pos, f.to.pos, t);
  camera.position.y += Math.sin(Math.PI * t) * f.arc;
  look.target.lerpVectors(f.from.target, f.to.target, t);
  camera.fov = f.from.fov + (f.to.fov - f.from.fov) * t;
  camera.lookAt(look.target);
  camera.updateProjectionMatrix();
  stadium.roofMat.opacity = f.roofFrom + (f.roofTo - f.roofFrom) * t;
  if (raw >= 1) {
    flight = null;
    f.onEnd();
  }
}

// orbit controls for overview modes, free look for seat views
function useOrbit(target, opts) {
  controls.target.copy(target);
  Object.assign(controls, { minDistance: 1, maxDistance: Infinity, minPolarAngle: 0, maxPolarAngle: Math.PI, autoRotate: false }, opts);
  controls.enabled = true;
  controls.update();
}
function useLook(p) {
  controls.enabled = false;
  look.eye.copy(p.pos);
  const d = p.target.clone().sub(p.pos).normalize();
  look.yaw = Math.atan2(d.x, d.z);
  look.pitch = Math.asin(THREE.MathUtils.clamp(d.y, -1, 1));
  look.base = { yaw: look.yaw, pitch: look.pitch };
}
function applyLook() {
  const cp = Math.cos(look.pitch);
  look.target.set(look.eye.x + Math.sin(look.yaw) * cp * 30, look.eye.y + Math.sin(look.pitch) * 30, look.eye.z + Math.cos(look.yaw) * cp * 30);
  camera.position.copy(look.eye);
  camera.lookAt(look.target);
}

// ---------------- modes ----------------
function hideOverlays() {
  $('#ticket').classList.add('hidden');
  $('#viewcard').classList.add('hidden');
  $('#actions').classList.add('hidden');
  hideChip();
}

function setMode(mode) {
  state.mode = mode;
  state.preview = null;
  hideOverlays();
  updateCrumbs();
  updateHint();
  $('#back').classList.toggle('hidden', mode === 'aerial');
}

function goAerial(intro = false) {
  state.stand = state.block = state.seat = state.skybox = -1;
  setMode('aerial');
  seats.setHoverBlock(-1);
  seats.setDetailBlock(-1);
  seats.clearSelection();
  const p = aerialPose();
  flyTo(p, 'aerial', intro ? 3.2 : 1.8, () => {
    look.target.copy(p.target);
    useOrbit(p.target, { minDistance: 230, maxDistance: 900, maxPolarAngle: 1.3, autoRotate: !device.test, autoRotateSpeed: 0.35 });
  });
}

function goStand(s) {
  state.stand = s; state.block = state.seat = -1;
  setMode('stand');
  seats.setHoverStand(-1);
  seats.setDetailBlock(-1);
  seats.clearSelection();
  const p = standPose(s);
  flyTo(p, 'stand', 1.7, () => useOrbit(p.target, { minDistance: 50, maxDistance: 260, maxPolarAngle: 1.45 }));
}

function goBlock(id) {
  const b = seatData.blocks[id];
  state.block = id; state.stand = b.stand; state.seat = -1;
  setMode('block');
  seats.setHoverStand(-1);
  seats.setHoverBlock(-1);
  seats.clearSelection();
  seats.setDetailBlock(id);
  const p = blockPose(id);
  flyTo(p, 'block', 1.5, () => useOrbit(p.target, { minDistance: 7, maxDistance: 80, maxPolarAngle: 1.5 }));
}

function goSeat(k) {
  const b = seatData.blocks[seatData.block[k]];
  state.seat = k; state.block = b.id; state.stand = b.stand;
  setMode('seat');
  if (seats.detailBlock !== b.id) seats.setDetailBlock(b.id);
  seats.select(k);
  seats.setDim(true);
  const p = seatPose(k);
  flyTo(p, 'seat', 1.3, () => {
    useOrbit(p.target, { minDistance: 2, maxDistance: 16, maxPolarAngle: 1.5 });
    showTicket();
  });
}

function goSkybox() {
  const b = seatData.blocks[seatData.block[state.seat]];
  state.skybox = b.stand;
  setMode('skybox');
  seats.setDim(false);
  const p = skyboxPose(b.stand);
  flyTo(p, 'skybox', 1.9, () => { useLook(p); showSkyboxCard(); });
}

function goView(from) {
  state.viewFrom = from;
  let eye, info;
  if (from === 'skybox') {
    const box = stadium.skyboxes[state.skybox];
    const s = box.seats[5];
    eye = eyeOf(s.pos, s.n);
  } else {
    eye = eyeOf(seatPos(state.seat), seatNormal(state.seat));
  }
  setMode('view');
  seats.setDim(false);
  const p = viewPose(eye);
  flyTo(p, 'view', 1.6, () => { useLook(p); showViewCard(); });
}

function back() {
  if (!$('#modal').classList.contains('hidden')) { $('#modal').classList.add('hidden'); return; }
  if (flight) return;
  switch (state.mode) {
    case 'stand': goAerial(); break;
    case 'block': goStand(state.stand); break;
    case 'seat': goBlock(state.block); break;
    case 'skybox': goSeat(state.seat); break;
    case 'view': state.viewFrom === 'skybox' ? goSkybox() : goSeat(state.seat); break;
  }
}

// ---------------- UI ----------------
function updateCrumbs() {
  const el = $('#crumbs');
  el.innerHTML = '';
  const items = [{ label: 'Stadium', go: () => goAerial() }];
  if (state.stand >= 0 && state.mode !== 'aerial') items.push({ label: STANDS[state.stand].name, go: () => goStand(state.stand) });
  if (state.block >= 0 && ['block', 'seat', 'skybox', 'view'].includes(state.mode)) items.push({ label: `Block ${seatData.blocks[state.block].number}`, go: () => goBlock(state.block) });
  if (state.seat >= 0 && ['seat', 'skybox', 'view'].includes(state.mode)) items.push({ label: `Row ${seatData.row[state.seat]} · Seat ${seatData.num[state.seat]}`, go: () => goSeat(state.seat) });
  if (state.mode === 'skybox' || (state.mode === 'view' && state.viewFrom === 'skybox')) items.push({ label: `Skybox ${stadium.skyboxes[state.skybox].number}`, go: () => goSkybox() });
  items.forEach((it, i) => {
    if (i) { const s = document.createElement('span'); s.className = 'sep'; s.textContent = '›'; el.appendChild(s); }
    const last = i === items.length - 1;
    const b = document.createElement(last ? 'span' : 'button');
    b.textContent = it.label;
    if (last) b.className = 'current'; else b.onclick = () => { if (!flight) it.go(); };
    el.appendChild(b);
  });
  el.scrollLeft = el.scrollWidth;
}

const HINTS = {
  aerial: ['Hover a stand to see availability · Click to fly in · Drag to orbit', 'Tap a stand to see availability · Tap again to fly in'],
  stand: ['Hover a block to see prices · Click to zoom in · Scroll to zoom', 'Tap a block to see prices · Tap again to zoom in'],
  block: ['Hover a seat · Click to choose it · Grey seats are taken', 'Tap a seat · Tap again to choose it · Grey seats are taken'],
  seat: ['Upgrade to a skybox, or keep your seat to see the view', 'Upgrade to a skybox, or keep your seat to see the view'],
  skybox: ['Drag to look around · See the view from your armchair', 'Drag to look around · See the view from your armchair'],
  view: ['Drag to look around · Scroll to zoom', 'Drag to look around · Pinch to zoom'],
};
function updateHint() {
  const h = HINTS[state.mode];
  $('#hint').textContent = h ? h[device.phone ? 1 : 0] : '';
}

const chip = $('#chip');
let chipX = 0, chipY = 0;
function showChip({ kicker, title, sub, price, taken = false }) {
  $('#chip-kicker').textContent = kicker;
  $('#chip-title').textContent = title;
  $('#chip-sub em').textContent = sub;
  $('#chip-price-wrap').classList.toggle('hidden', price == null);
  $('#chip-price').textContent = price ?? '';
  chip.classList.toggle('taken', taken);
  chip.classList.remove('hidden');
  placeChip();
}
function hideChip() { chip.classList.add('hidden'); }
function placeChip() {
  if (device.phone) return;
  const w = chip.offsetWidth, h = chip.offsetHeight;
  let x = chipX + 20, y = chipY - h - 16;
  if (x + w > innerWidth - 12) x = chipX - w - 20;
  if (y < 150) y = chipY + 24;
  chip.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

function tierName(id) { return TIERS[id].name; }

function showTicket() {
  const k = state.seat, b = seatData.blocks[seatData.block[k]];
  $('#t-kicker').textContent = `${STANDS[b.stand].name} · ${tierName(b.tier)}`;
  $('#t-title').textContent = `Block ${b.number}`;
  $('#t-l1').textContent = 'Row'; $('#t-l2').textContent = 'Seat';
  $('#t-row').textContent = seatData.row[k];
  $('#t-seat').textContent = seatData.num[k];
  $('#t-gate').textContent = b.gate;
  $('#t-price').textContent = b.price;
  const up = 250 - b.price;
  $('#t-primary').textContent = `Upgrade · +${eur(up)}`;
  $('#t-primary').onclick = () => !flight && goSkybox();
  $('#t-secondary').textContent = 'Keep my seat';
  $('#t-secondary').onclick = () => !flight && goView('seat');
  $('#ticket').classList.remove('hidden');
  // "your view" rendered from the seat, off the critical path
  requestAnimationFrame(() => renderPreview(eyeOf(seatPos(k), seatNormal(k))));
}

function showSkyboxCard() {
  const box = stadium.skyboxes[state.skybox];
  $('#t-kicker').textContent = `${STANDS[box.stand].name} · Hospitality`;
  $('#t-title').textContent = `Skybox ${box.number}`;
  $('#t-l1').textContent = 'Row'; $('#t-l2').textContent = 'Seat';
  $('#t-row').textContent = 'Front';
  $('#t-seat').textContent = '6';
  $('#t-gate').textContent = `${STANDS[box.stand].short}VIP`;
  $('#t-price').textContent = 250;
  $('#t-primary').textContent = 'See the view';
  $('#t-primary').onclick = () => !flight && goView('skybox');
  $('#t-secondary').textContent = 'Back to my seat';
  $('#t-secondary').onclick = () => !flight && goSeat(state.seat);
  $('#ticket').classList.remove('hidden');
  const s = box.seats[5];
  requestAnimationFrame(() => renderPreview(eyeOf(s.pos, s.n)));
}

function showViewCard() {
  if (state.viewFrom === 'skybox') {
    const box = stadium.skyboxes[state.skybox];
    $('#v-kicker').textContent = `From Skybox ${box.number} · Front row · Seat 6`;
    $('#v-sub em').textContent = `${STANDS[box.stand].name} · Hospitality`;
    $('#v-price').textContent = 250;
  } else {
    const k = state.seat, b = seatData.blocks[seatData.block[k]];
    $('#v-kicker').textContent = `From Block ${b.number} · Row ${seatData.row[k]} · Seat ${seatData.num[k]}`;
    $('#v-sub em').textContent = `${STANDS[b.stand].name} · ${tierName(b.tier)}`;
    $('#v-price').textContent = b.price;
  }
  $('#viewcard').classList.remove('hidden');
  $('#actions').classList.remove('hidden');
}

function drawQR(cv, seed) {
  const g = cv.getContext('2d'), N = 29, s = cv.width / (N + 4);
  g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height);
  g.fillStyle = '#12141a';
  let h = seed * 2654435761 >>> 0;
  const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; };
  const finder = (x, y) => (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let on;
    if (finder(x, y)) {
      const fx = x >= N - 7 ? x - (N - 7) : x, fy = y >= N - 7 ? y - (N - 7) : y;
      on = fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4);
    } else on = rnd() < 0.5;
    if (on) g.fillRect((x + 2) * s, (y + 2) * s, s + 0.5, s + 0.5);
  }
}

function confirmTicket() {
  const sky = state.viewFrom === 'skybox';
  const k = state.seat, b = seatData.blocks[seatData.block[k]];
  const box = sky ? stadium.skyboxes[state.skybox] : null;
  $('#m-fixture').textContent = `${SITE.fixture} · ${SITE.meta}`;
  $('#m-stand').textContent = STANDS[sky ? box.stand : b.stand].name;
  $('#m-l1').textContent = sky ? 'Skybox' : 'Block';
  $('#m-block').textContent = sky ? box.number : b.number;
  $('#m-row').textContent = sky ? 'Front' : seatData.row[k];
  $('#m-seat').textContent = sky ? 6 : seatData.num[k];
  $('#m-gate').textContent = sky ? `${STANDS[box.stand].short}VIP` : b.gate;
  $('#m-price').textContent = eur(sky ? 250 : b.price);
  drawQR($('#m-qr'), k + 1);
  $('#modal').classList.remove('hidden');
  $('#m-done').onclick = () => {
    $('#modal').classList.add('hidden');
    if (!sky) seats.markTaken(k);
    goAerial();
  };
}

$('#back').onclick = back;
$('#confirm').onclick = () => !flight && confirmTicket();
$('#another').onclick = () => !flight && goBlock(state.block);
addEventListener('keydown', (e) => { if (e.key === 'Escape') back(); });

$('#sound').onclick = () => {
  const on = $('#sound').getAttribute('aria-pressed') !== 'true';
  $('#sound').setAttribute('aria-pressed', on);
  $('#sound span').textContent = on ? 'Sound on' : 'Sound off';
  screens.setSound(on, camera);
};
$('#refresh').onclick = () => {
  const pl = $('#preloader');
  pl.classList.remove('hidden', 'done');
  progress(0, 'Restarting');
  requestAnimationFrame(() => requestAnimationFrame(() => location.reload()));
};

// ---------------- "your view" picture ----------------
// Rendered into a corner of the main canvas and copied out in the same task,
// so it gets the same tone mapping and grade as the live view.
const previewCam = new THREE.PerspectiveCamera(60, 1.6, 0.05, 9000);
function renderPreview(eye) {
  const cv = $('#t-canvas'), g = cv.getContext('2d');
  const w = Math.min(480, Math.floor(innerWidth)), h = Math.floor(w / 1.6);
  previewCam.position.copy(eye);
  previewCam.lookAt(0, 2, 0);
  previewCam.aspect = w / h;
  previewCam.updateProjectionMatrix();
  const oldFocus = sun.shadow.camera.right;
  const oldTarget = sun.target.position.clone();
  setShadowFocus(sun, renderer, new THREE.Vector3(), 165);
  const op = stadium.roofMat.opacity;
  stadium.roofMat.opacity = 0.6;
  renderer.setScissorTest(true);
  renderer.setScissor(0, 0, w, h);
  renderer.setViewport(0, 0, w, h);
  renderer.render(scene, previewCam);
  const pr = renderer.getPixelRatio();
  g.fillStyle = '#10131a';
  g.fillRect(0, 0, cv.width, cv.height);
  g.drawImage(renderer.domElement, 0, renderer.domElement.height - h * pr, w * pr, h * pr, 0, 0, cv.width, cv.height);
  renderer.setScissorTest(false);
  renderer.setViewport(0, 0, innerWidth, innerHeight);
  stadium.roofMat.opacity = op;
  setShadowFocus(sun, renderer, oldTarget, oldFocus);
  render(performance.now());
}

// ---------------- picking ----------------
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
let pointerDirty = false;

function pick() {
  raycaster.setFromCamera(ndc, camera);
  if (state.mode === 'aerial' || state.mode === 'stand') {
    const hit = raycaster.intersectObjects(stadium.pickMeshes, false)[0];
    if (!hit) return null;
    const { t, d } = locate(hit.point.x, hit.point.z);
    const tier = tierAt(d);
    if (!tier) return null;
    const k = sectorOf(t);
    if (state.mode === 'aerial') return { type: 'stand', id: standOfSector(k) };
    return { type: 'block', id: tier.id * SECTORS + k };
  }
  if (state.mode === 'block') {
    const k = seats.pickSeat(raycaster);
    return k >= 0 ? { type: 'seat', id: k } : null;
  }
  return null;
}

function applyHover(h) {
  state.hover = h;
  canvas.classList.toggle('pointer', !!h && !(h.type === 'seat' && seatData.taken[h.id]));
  let changed = false;
  if (state.mode === 'aerial') {
    changed = seats.setHoverStand(h ? h.id : -1);
    if (h) {
      const st = standStats(seatData, h.id);
      showChip({ kicker: 'Spotify Camp Nou', title: STANDS[h.id].name, sub: `${fmt(st.free)} left`, price: `from ${st.from}` });
    } else hideChip();
  } else if (state.mode === 'stand') {
    changed = seats.setHoverBlock(h ? h.id : -1);
    if (h) {
      const b = seatData.blocks[h.id];
      showChip({ kicker: `${STANDS[b.stand].name} · ${tierName(b.tier)}`, title: `Block ${b.number}`, sub: `${fmt(b.free)} left`, price: b.price });
    } else hideChip();
  } else if (state.mode === 'block') {
    if (h) {
      const k = h.id, tk = !!seatData.taken[k];
      const b = seatData.blocks[seatData.block[k]];
      showChip({ kicker: `Block ${b.number}`, title: `Row ${seatData.row[k]} · Seat ${seatData.num[k]}`, sub: tk ? 'Taken' : 'Available', price: tk ? null : b.price, taken: tk });
    } else hideChip();
  }
  if (changed) invalidate();
}

function choose(h) {
  if (!h || flight) return;
  if (h.type === 'stand') goStand(h.id);
  else if (h.type === 'block') goBlock(h.id);
  else if (h.type === 'seat' && !seatData.taken[h.id]) goSeat(h.id);
}

const same = (a, b) => a && b && a.type === b.type && a.id === b.id;

// pointer handling: hover + click on mouse, tap-to-preview / tap-again on touch
const pointers = new Map();
let down = null, pinch = null;
canvas.addEventListener('pointerdown', (e) => {
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  touching = [...pointers.keys()].length;
  down = { x: e.clientX, y: e.clientY, t: performance.now(), type: e.pointerType };
  lastMove = performance.now();
  if (controls.autoRotate) controls.autoRotate = false;
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), fov: camera.fov };
  }
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  const prev = pointers.get(e.pointerId);
  if (prev && (state.mode === 'view' || state.mode === 'skybox') && !flight) {
    if (pointers.size === 2 && pinch) {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      camera.fov = THREE.MathUtils.clamp(pinch.fov * (pinch.d / d), 20, 75);
      camera.updateProjectionMatrix();
    } else if (pointers.size === 1) {
      const k = 0.0042 * (camera.fov / 55);
      look.yaw -= (e.clientX - prev.x) * k;
      look.pitch = THREE.MathUtils.clamp(look.pitch + (e.clientY - prev.y) * k, -1.2, 0.7);
      applyLook();
    }
    invalidate();
  }
  if (prev) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (e.pointerType === 'mouse') {
    chipX = e.clientX; chipY = e.clientY;
    ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    if (!prev) pointerDirty = true;
    else placeChip();
  }
});
function endPointer(e) {
  pointers.delete(e.pointerId);
  touching = pointers.size;
  if (pointers.size < 2) pinch = null;
  if (!down || e.type === 'pointercancel') return;
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
  const quick = performance.now() - down.t < 600;
  const d = down; down = null;
  if (moved > 8 || !quick || flight) return;
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  chipX = e.clientX; chipY = e.clientY;
  const h = pick();
  if (d.type === 'mouse') { choose(h); return; }
  // touch: first tap previews, a second tap on the same thing chooses it
  if (h && same(h, state.preview)) { choose(h); return; }
  state.preview = h;
  applyHover(h);
}
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);
canvas.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse' && !pointers.size) { applyHover(null); } });
canvas.addEventListener('wheel', (e) => {
  lastMove = performance.now();
  if (state.mode === 'view' || state.mode === 'skybox') {
    e.preventDefault();
    camera.fov = THREE.MathUtils.clamp(camera.fov * (1 + e.deltaY * 0.001), 20, 75);
    camera.updateProjectionMatrix();
    invalidate();
  }
}, { passive: false });
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

// ---------------- render loop (draws only when something changed) ----------------
let lastDraw = 0, lastFrame = 0;
const cadence = { samples: [], value: 16.7 };
const perf = { frames: 0, sum: 0, slow: 0 };

function updateNear() {
  const d = state.mode === 'view' || state.mode === 'skybox' || state.mode === 'seat' ? 2 : camera.position.distanceTo(look.target);
  const near = THREE.MathUtils.clamp(d / 300, 0.05, 1.2);
  if (Math.abs(near - camera.near) > 1e-3) { camera.near = near; camera.updateProjectionMatrix(); }
}

function render(now) {
  updateNear();
  renderer.render(scene, camera);
  screens.render(camera);
  lastDraw = now;
}

// Dynamic resolution: measure this device's natural frame cadence first so a
// 30 fps cap (iOS Low Power Mode) is not mistaken for a slow GPU.
function adaptQuality(dt, continuous) {
  if (!continuous) { perf.frames = perf.sum = 0; return; }
  if (cadence.samples.length < 90) {
    cadence.samples.push(dt);
    if (cadence.samples.length === 90) {
      const s = [...cadence.samples].sort((a, b) => a - b);
      cadence.value = s[Math.floor(s.length * 0.3)];
    }
    return;
  }
  perf.frames++; perf.sum += dt;
  if (perf.frames < 40) return;
  const avg = perf.sum / perf.frames;
  perf.frames = perf.sum = 0;
  const budget = Math.max(21, cadence.value * 1.35);
  if (avg > budget) {
    if (++perf.slow >= 2 && pixelRatio > preset.minPixelRatio) {
      pixelRatio = Math.max(preset.minPixelRatio, pixelRatio - 0.125);
      renderer.setPixelRatio(pixelRatio);
      resize(true);
      perf.slow = 0;
    }
  } else perf.slow = 0;
}

function frame(now) {
  requestAnimationFrame(frame);
  const dt = lastFrame ? now - lastFrame : 16.7;
  lastFrame = now;
  if (!app.ready && state.mode === 'loading') return;
  let dirty = needsRender;
  if (flight) { stepFlight(now); dirty = true; lastMove = now; }
  if (controls.enabled && controls.update(dt / 1000)) { dirty = true; lastMove = now; }
  if (pointerDirty && !flight && !pointers.size) { pointerDirty = false; applyHover(pick()); }
  screens.update(now, camera, now - lastMove, touching > 0, invalidate);
  if (now - lastDraw > 1000) dirty = true; // safety net
  const continuous = dirty && now - lastDraw < 50;
  if (!dirty) { adaptQuality(dt, false); return; }
  needsRender = false;
  render(now);
  adaptQuality(dt, continuous);
}

// ---------------- robustness ----------------
let lastSize = '';
function resize(force) {
  const key = `${innerWidth}x${innerHeight}@${renderer.getPixelRatio()}`;
  if (!force && key === lastSize) return;
  lastSize = key;
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  screens && screens.setSize(innerWidth, innerHeight);
  if (app.ready) render(performance.now()); // redraw in the same frame: no black flash
}
addEventListener('resize', () => resize(false));
document.addEventListener('visibilitychange', () => { if (!document.hidden) { invalidate(); lastMove = performance.now(); } });
addEventListener('pageshow', invalidate);
addEventListener('focus', invalidate);
canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); });
canvas.addEventListener('webglcontextrestored', () => {
  buildEnvironment(renderer, scene);
  renderer.shadowMap.needsUpdate = true;
  invalidate();
});

// test hooks for automated runs
Object.assign(app, {
  goAerial, goStand, goBlock, goSeat, goSkybox, goView, confirmTicket, back,
  get flying() { return !!flight; },
  get seats() { return seatData; },
  firstFreeSeat(blockId, row = 10) {
    const b = seatData.blocks[blockId];
    for (let i = 0; i < b.count; i++) { const k = b.start + i; if (!seatData.taken[k] && seatData.row[k] === row) return k; }
    return b.start;
  },
});

requestAnimationFrame(frame);
build().catch((e) => {
  console.error(e);
  progress(1, 'Something went wrong: ' + (e && e.message ? e.message : e));
});
