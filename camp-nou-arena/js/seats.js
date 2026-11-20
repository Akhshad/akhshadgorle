// ~93,000 individual seats, one instanced mesh per block (96 blocks), plus a
// rounded high-detail mesh for whichever block you are zoomed into.

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { COLORS } from './config.js';

const UP = new THREE.Vector3(0, 1, 0);

// Far seat: 5 quads, 10 triangles. Front of the seat faces +Z.
function lowSeatGeometry() {
  const quads = [
    // pan top
    [[-0.22, 0.45, -0.17], [0.22, 0.45, -0.17], [0.22, 0.45, 0.23], [-0.22, 0.45, 0.23]],
    // pan front
    [[-0.22, 0.38, 0.23], [-0.22, 0.45, 0.23], [0.22, 0.45, 0.23], [0.22, 0.38, 0.23]],
    // back front
    [[-0.22, 0.45, -0.17], [-0.22, 0.86, -0.2], [0.22, 0.86, -0.2], [0.22, 0.45, -0.17]],
    // back top
    [[-0.22, 0.86, -0.2], [-0.22, 0.86, -0.25], [0.22, 0.86, -0.25], [0.22, 0.86, -0.2]],
    // back rear
    [[0.22, 0.42, -0.23], [0.22, 0.86, -0.25], [-0.22, 0.86, -0.25], [-0.22, 0.42, -0.23]],
  ];
  const pos = [];
  for (const [a, b, c, d] of quads) pos.push(...a, ...b, ...c, ...a, ...c, ...d);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

function detailSeatGeometry() {
  const pan = new RoundedBoxGeometry(0.46, 0.075, 0.42, 3, 0.03);
  pan.translate(0, 0.44, 0.02);
  const backG = new RoundedBoxGeometry(0.46, 0.44, 0.065, 3, 0.03);
  backG.rotateX(-0.1);
  backG.translate(0, 0.7, -0.2);
  return mergeGeometries([pan, backG]);
}

function postGeometry() {
  const post = new THREE.BoxGeometry(0.06, 0.42, 0.06);
  post.translate(0, 0.21, -0.05);
  return post;
}

export class Seats {
  constructor(scene, data, preset) {
    this.data = data;
    this.scene = scene;
    this.group = new THREE.Group();
    scene.add(this.group);
    this.meshes = [];
    this.selected = -1;
    this.hoverBlock = -1;
    this.dimBlock = -1;
    this.color = new THREE.Color();

    const geo = lowSeatGeometry();
    this.baseMat = new THREE.MeshStandardMaterial({ roughness: 0.55, side: THREE.DoubleSide });
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
    for (const b of data.blocks) {
      const mat = this.baseMat.clone(); // own material so a block or stand can glow on hover
      const mesh = new THREE.InstancedMesh(geo, mat, b.count);
      for (let i = 0; i < b.count; i++) {
        const k = b.start + i;
        q.setFromAxisAngle(UP, data.yaw[k]);
        mesh.setMatrixAt(i, m.compose(p.set(data.x[k], data.y[k], data.z[k]), q, one));
      }
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
      mesh.computeBoundingBox();
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.block = b.id;
      this.meshes.push(mesh);
      this.group.add(mesh);
      this.paintBlock(b.id, mesh);
    }

    // high-detail mesh, sized for the largest block
    const maxCount = Math.max(...data.blocks.map((b) => b.count));
    const detailMat = preset.clearcoat
      ? new THREE.MeshPhysicalMaterial({ roughness: 0.38, clearcoat: 0.7, clearcoatRoughness: 0.25 })
      : new THREE.MeshStandardMaterial({ roughness: 0.42 });
    this.detail = new THREE.InstancedMesh(detailSeatGeometry(), detailMat, maxCount);
    this.detail.castShadow = true;
    this.detail.receiveShadow = true;
    this.detail.visible = false;
    this.posts = new THREE.InstancedMesh(postGeometry(), new THREE.MeshStandardMaterial({ color: 0x2a2526, roughness: 0.6 }), maxCount);
    this.posts.castShadow = true;
    this.posts.visible = false;
    this.group.add(this.detail, this.posts);
    this.detailBlock = -1;
  }

  seatColor(k) {
    const d = this.data;
    const b = d.block[k];
    if (k === this.selected) return COLORS.selected;
    if (b === this.dimBlock) return COLORS.dimmed;
    if (d.taken[k]) return COLORS.taken;
    if (b === this.hoverBlock) return COLORS.hover;
    return d.base[k];
  }

  paintBlock(id, mesh = this.meshes[id]) {
    const b = this.data.blocks[id];
    for (let i = 0; i < b.count; i++) mesh.setColorAt(i, this.color.setHex(this.seatColor(b.start + i)));
    mesh.instanceColor.needsUpdate = true;
    if (this.detailBlock === id) this.paintDetail();
  }

  paintDetail() {
    const b = this.data.blocks[this.detailBlock];
    for (let i = 0; i < b.count; i++) this.detail.setColorAt(i, this.color.setHex(this.seatColor(b.start + i)));
    this.detail.instanceColor.needsUpdate = true;
  }

  setHoverBlock(id) {
    if (id === this.hoverBlock) return false;
    const prev = this.hoverBlock;
    this.hoverBlock = id;
    if (prev >= 0) this.paintBlock(prev);
    if (id >= 0) this.paintBlock(id);
    return true;
  }

  // Lift a whole stand with emissive glow (cheap: no recolouring).
  setHoverStand(s) {
    if (s === this.hoverStand) return false;
    this.hoverStand = s;
    for (const mesh of this.meshes) {
      const b = this.data.blocks[mesh.userData.block];
      mesh.material.emissive.setHex(b.stand === s ? 0x553322 : 0x000000);
    }
    return true;
  }

  // Swap a block between far (low-poly) and near (rounded) seats.
  setDetailBlock(id) {
    if (id === this.detailBlock) return;
    if (this.detailBlock >= 0) this.meshes[this.detailBlock].visible = true;
    this.detailBlock = id;
    if (id < 0) { this.detail.visible = this.posts.visible = false; return; }
    const b = this.data.blocks[id], d = this.data;
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < b.count; i++) {
      const k = b.start + i;
      q.setFromAxisAngle(UP, d.yaw[k]);
      m.compose(p.set(d.x[k], d.y[k], d.z[k]), q, one);
      this.detail.setMatrixAt(i, m);
      this.posts.setMatrixAt(i, m);
    }
    this.detail.count = this.posts.count = b.count;
    this.detail.instanceMatrix.needsUpdate = this.posts.instanceMatrix.needsUpdate = true;
    this.detail.computeBoundingSphere();
    this.posts.computeBoundingSphere();
    this.meshes[id].visible = false;
    this.detail.visible = this.posts.visible = true;
    this.paintDetail();
  }

  select(k) {
    const prev = this.selected;
    this.selected = k;
    const prevBlock = prev >= 0 ? this.data.block[prev] : -1;
    const nb = k >= 0 ? this.data.block[k] : -1;
    this.dimBlock = nb;
    if (prevBlock >= 0) this.paintBlock(prevBlock);
    if (nb >= 0 && nb !== prevBlock) this.paintBlock(nb);
  }

  setDim(on) {
    const b = on && this.selected >= 0 ? this.data.block[this.selected] : -1;
    if (b === this.dimBlock) return;
    const prev = this.dimBlock;
    this.dimBlock = b;
    if (prev >= 0) this.paintBlock(prev);
    if (b >= 0) this.paintBlock(b);
  }

  clearSelection() {
    const b = this.dimBlock;
    this.selected = -1;
    this.dimBlock = -1;
    if (b >= 0) this.paintBlock(b);
  }

  markTaken(k) {
    const d = this.data;
    if (d.taken[k]) return;
    d.taken[k] = 1;
    d.blocks[d.block[k]].free--;
    this.paintBlock(d.block[k]);
  }

  // Picks the seat under the pointer inside the detail block.
  pickSeat(raycaster) {
    if (this.detailBlock < 0) return -1;
    const hit = raycaster.intersectObject(this.detail, false)[0];
    if (!hit || hit.instanceId == null) return -1;
    return this.data.blocks[this.detailBlock].start + hit.instanceId;
  }
}
