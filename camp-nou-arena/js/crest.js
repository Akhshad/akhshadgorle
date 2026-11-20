// Club crest. Drawn in code by default; drop an image at assets/crest.png
// (transparent PNG works best) to use that instead.

let override = null;

export async function loadCrest(url = './assets/crest.png') {
  try {
    const head = await fetch(url, { method: 'HEAD' });
    if (!head.ok || (head.headers.get('content-type') || '').includes('text/html')) return null;
    const img = new Image();
    img.src = url;
    await img.decode();
    override = img;
    return img;
  } catch (e) {
    return null;
  }
}

function shieldPath(g) {
  g.beginPath();
  g.moveTo(50, 9);
  g.bezierCurveTo(66, 9, 82, 6, 95, 2);
  g.bezierCurveTo(97, 14, 95, 26, 90, 36);
  g.bezierCurveTo(92, 66, 82, 98, 50, 118);
  g.bezierCurveTo(18, 98, 8, 66, 10, 36);
  g.bezierCurveTo(5, 26, 3, 14, 5, 2);
  g.bezierCurveTo(18, 6, 34, 9, 50, 9);
  g.closePath();
}

// Draws the crest into a 100 × 120 box at (x, y) scaled to height h.
export function drawCrest(g, x, y, h) {
  const s = h / 120;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  if (override) {
    const ar = override.width / override.height;
    g.drawImage(override, 50 - 60 * ar, 0, 120 * ar, 120);
    g.restore();
    return;
  }
  // outline
  shieldPath(g);
  g.fillStyle = '#0b1e48';
  g.fill();
  g.save();
  g.translate(50, 60); g.scale(0.9, 0.9); g.translate(-50, -60);
  shieldPath(g);
  g.fillStyle = '#e8b931';
  g.fill();
  g.translate(50, 60); g.scale(0.94, 0.94); g.translate(-50, -60);
  shieldPath(g);
  g.clip();
  // top left: St George's cross
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, 50, 46);
  g.fillStyle = '#d81e2c';
  g.fillRect(22, 0, 9, 46);
  g.fillRect(0, 18, 50, 9);
  // top right: Catalan stripes
  g.fillStyle = '#f6c400';
  g.fillRect(50, 0, 50, 46);
  g.fillStyle = '#d81e2c';
  for (let i = 0; i < 4; i++) g.fillRect(55 + i * 11, 0, 5.5, 46);
  // band with letters
  g.fillStyle = '#ffffff';
  g.fillRect(0, 46, 100, 15);
  g.fillStyle = '#0b1e48';
  g.fillRect(0, 45, 100, 1.8);
  g.fillRect(0, 60, 100, 1.8);
  g.font = '900 13px Arial, Helvetica, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('F C B', 50, 54);
  // blaugrana stripes
  const stripes = ['#004d98', '#a50044', '#004d98', '#a50044', '#004d98', '#a50044', '#004d98'];
  stripes.forEach((c, i) => { g.fillStyle = c; g.fillRect(i * 15 - 2.5, 62, 15, 60); });
  // ball
  g.beginPath(); g.arc(50, 87, 11, 0, Math.PI * 2);
  g.fillStyle = '#e8b931'; g.fill();
  g.strokeStyle = '#7a4b12'; g.lineWidth = 1.4; g.stroke();
  g.beginPath();
  g.moveTo(39.5, 84); g.quadraticCurveTo(50, 80, 60.5, 84);
  g.moveTo(39.5, 90); g.quadraticCurveTo(50, 94, 60.5, 90);
  g.moveTo(50, 76); g.lineTo(50, 98);
  g.stroke();
  g.restore();
  // dividing line between top quarters
  g.restore();
}

export function crestCanvas(h = 240) {
  const cv = document.createElement('canvas');
  cv.width = Math.round(h * (100 / 120));
  cv.height = h;
  drawCrest(cv.getContext('2d'), 0, 0, h);
  return cv;
}
