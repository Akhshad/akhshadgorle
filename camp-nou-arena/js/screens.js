// 14 live screens: two centre-hung boards (3 portrait panels each) and eight
// portrait screens on the VIP ring. Each live screen is a real YouTube player
// placed in 3D with CSS3DRenderer, behind a transparent "hole" punched in the
// WebGL canvas, so the video moves in perspective and the stadium hides it.

import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { PLAYLISTS, SITE } from './config.js';
import { RING, point, standCenterAngle } from './layout.js';
import { frameAt } from './stadium.js';

const PX_W = 360, PX_H = 640;

function placeholderTexture() {
  const cv = document.createElement('canvas');
  cv.width = PX_W; cv.height = PX_H;
  const g = cv.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, PX_H);
  grad.addColorStop(0, '#a50044');
  grad.addColorStop(1, '#0c2c66');
  g.fillStyle = grad;
  g.fillRect(0, 0, PX_W, PX_H);
  g.globalAlpha = 0.12;
  g.fillStyle = '#fff';
  for (let i = -PX_H; i < PX_W; i += 46) { g.beginPath(); g.moveTo(i, PX_H); g.lineTo(i + PX_H, 0); g.lineTo(i + PX_H + 18, 0); g.lineTo(i + 18, PX_H); g.fill(); }
  g.globalAlpha = 1;
  g.beginPath(); g.arc(PX_W / 2, PX_H / 2 - 30, 62, 0, Math.PI * 2); g.fillStyle = 'rgba(255,255,255,0.95)'; g.fill();
  g.beginPath(); g.moveTo(PX_W / 2 - 18, PX_H / 2 - 62); g.lineTo(PX_W / 2 + 30, PX_H / 2 - 30); g.lineTo(PX_W / 2 - 18, PX_H / 2 + 2); g.fillStyle = '#a50044'; g.fill();
  g.fillStyle = '#fff';
  g.textAlign = 'center';
  g.font = '800 34px Inter, Arial, sans-serif';
  g.fillText('MATCHDAY', PX_W / 2, PX_H / 2 + 90);
  g.font = '600 22px Inter, Arial, sans-serif';
  g.globalAlpha = 0.8;
  g.fillText(SITE.title.toUpperCase(), PX_W / 2, PX_H / 2 + 124);
  g.globalAlpha = 1;
  g.fillStyle = '#ff3b3b';
  g.beginPath(); g.arc(40, 44, 9, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff';
  g.font = '800 22px Inter, Arial, sans-serif';
  g.textAlign = 'left';
  g.fillText('LIVE', 58, 52);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class Screens {
  constructor(scene, cssHost, preset, device) {
    this.scene = scene;
    this.preset = preset;
    this.device = device;
    this.list = [];
    this.soundOn = false;
    this.lastRank = 0;
    this.queue = [];
    this.lastSpawn = 0;
    this.texture = placeholderTexture();
    this.placeholderMat = new THREE.MeshBasicMaterial({ map: this.texture, toneMapped: false });
    // writes transparent black so the CSS layer behind the canvas shows through
    this.holeMat = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0, blending: THREE.NoBlending, side: THREE.FrontSide });

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x15171c, roughness: 0.5, metalness: 0.4 });
    const panelGeo = (w, h) => new THREE.PlaneGeometry(w, h);

    // centre-hung boards, back to back, facing Tribuna and Lateral
    const PW = 6.75, PH = 12, Y = 41;
    const board = new THREE.Mesh(new THREE.BoxGeometry(3 * PW + 1.8, PH + 1.2, 1.6), frameMat);
    board.position.set(0, Y, 0);
    board.castShadow = true;
    scene.add(board);
    for (const side of [1, -1]) {
      for (let i = 0; i < 3; i++) {
        const mesh = new THREE.Mesh(panelGeo(PW, PH), this.placeholderMat);
        mesh.position.set((i - 1) * (PW + 0.3) * side, Y, side * 0.82);
        mesh.rotation.y = side > 0 ? 0 : Math.PI;
        scene.add(mesh);
        this.list.push({ mesh, w: PW, h: PH, playlist: 'giant', offset: i + (side > 0 ? 0 : 3) });
      }
    }
    // cables up to the roof ring
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x9aa0a8, metalness: 0.6, roughness: 0.4 });
    for (const t of [Math.PI / 4, (3 * Math.PI) / 4, -Math.PI / 4, (-3 * Math.PI) / 4]) {
      const p = point(t, RING.roofInnerD, {});
      const top = new THREE.Vector3(p.x, RING.roofInnerH - 1.5, p.z);
      const a = new THREE.Vector3(Math.sign(p.x) * 10, Y + PH / 2 + 0.6, Math.sign(p.z) * 0.6);
      const len = a.distanceTo(top);
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, len, 5), cableMat);
      c.position.copy(a).add(top).multiplyScalar(0.5);
      c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), top.clone().sub(a).normalize());
      scene.add(c);
    }

    // portrait screens on the VIP ring, two per stand
    for (let s = 0; s < 4; s++) {
      for (const off of [-0.3, 0.3]) {
        const f = frameAt(standCenterAngle(s) + off, RING.glassD - 0.6, 13.7);
        const back = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.45, 0.18), frameMat);
        back.position.copy(f.pos).addScaledVector(f.n, -0.1);
        back.quaternion.copy(f.quat);
        scene.add(back);
        const mesh = new THREE.Mesh(panelGeo(1.8, 3.2), this.placeholderMat);
        mesh.position.copy(f.pos);
        mesh.quaternion.copy(f.quat);
        scene.add(mesh);
        this.list.push({ mesh, w: 1.8, h: 3.2, playlist: 'ring', offset: s * 2 + (off > 0 ? 1 : 0) });
      }
    }
    for (const sc of this.list) {
      sc.mesh.updateMatrixWorld();
      sc.normal = new THREE.Vector3(0, 0, 1).applyQuaternion(sc.mesh.getWorldQuaternion(new THREE.Quaternion()));
      sc.center = sc.mesh.getWorldPosition(new THREE.Vector3());
      sc.live = false;
      sc.index = 0;
    }

    this.enabled = (PLAYLISTS.giant.length + PLAYLISTS.ring.length) > 0 && !device.test;
    if (this.enabled) this.initCSS(cssHost);
  }

  get count() { return this.list.length; }

  initCSS(host) {
    this.css = new CSS3DRenderer();
    this.css.domElement.className = 'css3d';
    host.appendChild(this.css.domElement);
    this.cssScene = new THREE.Scene();
    this.apiReady = new Promise((resolve) => {
      if (window.YT && window.YT.Player) return resolve();
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev && prev(); resolve(); };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.onerror = () => { this.enabled = false; };
      document.head.appendChild(s);
    });
    this.apiReady.then(() => { this.ready = true; });
  }

  setSize(w, h) { if (this.css) this.css.setSize(w, h); }

  ids(sc) {
    const list = PLAYLISTS[sc.playlist].length ? PLAYLISTS[sc.playlist] : PLAYLISTS.giant.concat(PLAYLISTS.ring);
    return list;
  }

  // Called every frame. Only re-ranks while the camera is still and no finger is down.
  update(now, camera, stillFor, touching, onChange) {
    if (!this.enabled || !this.ready) return;
    const wait = this.device.phone ? 2000 : 1000;
    if (stillFor > wait && !touching && now - this.lastRank > 1500) {
      this.lastRank = now;
      this.rank(camera);
    }
    if (this.queue.length && now - this.lastSpawn > 1000 && stillFor > wait && !touching) {
      this.lastSpawn = now;
      this.spawn(this.queue.shift(), onChange);
    }
  }

  rank(camera) {
    const frustum = new THREE.Frustum().setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
    const scored = this.list.map((sc) => {
      const toCam = camera.position.clone().sub(sc.center);
      const facing = toCam.normalize().dot(sc.normal);
      const visible = facing > 0.15 && frustum.containsPoint(sc.center);
      let score = visible ? camera.position.distanceTo(sc.center) / Math.sqrt(sc.w * sc.h) : Infinity;
      if (sc.live) score *= 0.8; // hysteresis: keep what is already playing
      return { sc, score };
    }).sort((a, b) => a.score - b.score);
    const n = this.preset.liveScreens;
    const keep = new Set(scored.slice(0, n).filter((x) => x.score < Infinity).map((x) => x.sc));
    for (const sc of this.list) {
      if (sc.live && !keep.has(sc)) this.kill(sc);
    }
    this.queue = [...keep].filter((sc) => !sc.live && !this.queue.includes(sc));
  }

  spawn(sc, onChange) {
    const ids = this.ids(sc);
    if (!ids.length) return;
    const wrap = document.createElement('div');
    wrap.className = 'yt-wrap';
    wrap.style.width = PX_W + 'px';
    wrap.style.height = PX_H + 'px';
    const inner = document.createElement('div');
    wrap.appendChild(inner);
    const obj = new CSS3DObject(wrap);
    obj.position.copy(sc.center);
    obj.quaternion.copy(sc.mesh.getWorldQuaternion(new THREE.Quaternion()));
    obj.scale.setScalar(sc.w / PX_W);
    this.cssScene.add(obj);
    sc.obj = obj;
    sc.live = true;
    sc.index = sc.offset % ids.length;
    let fails = 0;
    const next = () => { sc.index = (sc.index + 1) % ids.length; sc.player.loadVideoById(ids[sc.index]); };
    sc.player = new window.YT.Player(inner, {
      width: PX_W, height: PX_H, videoId: ids[sc.index],
      playerVars: { autoplay: 1, mute: 1, controls: 0, playsinline: 1, rel: 0, modestbranding: 1, iv_load_policy: 3, disablekb: 1 },
      events: {
        onReady: (e) => { e.target.mute(); e.target.playVideo(); },
        onStateChange: (e) => {
          const S = window.YT.PlayerState;
          if (e.data === S.PLAYING) {
            fails = 0;
            if (sc.mesh.material !== this.holeMat) { sc.mesh.material = this.holeMat; onChange(); }
            this.applySound();
          } else if (e.data === S.ENDED) next();
          else if (e.data === S.PAUSED) e.target.playVideo(); // never stay paused
        },
        onError: () => { if (++fails < ids.length) next(); else this.kill(sc); },
      },
    });
  }

  kill(sc) {
    sc.live = false;
    try { sc.player && sc.player.destroy(); } catch (e) { /* already gone */ }
    sc.player = null;
    if (sc.obj) { this.cssScene.remove(sc.obj); sc.obj = null; }
    sc.mesh.material = this.placeholderMat;
  }

  setSound(on, camera) {
    this.soundOn = on;
    this.camera = camera;
    this.applySound();
  }

  applySound() {
    let best = null, bd = Infinity;
    for (const sc of this.list) {
      if (!sc.player || !sc.player.isMuted) continue;
      const d = this.camera ? this.camera.position.distanceTo(sc.center) : 0;
      if (d < bd) { bd = d; best = sc; }
    }
    for (const sc of this.list) {
      if (!sc.player || !sc.player.mute) continue;
      if (this.soundOn && sc === best) { sc.player.unMute(); sc.player.setVolume(80); } else sc.player.mute();
    }
  }

  render(camera) {
    if (this.css) this.css.render(this.cssScene, camera);
  }
}
