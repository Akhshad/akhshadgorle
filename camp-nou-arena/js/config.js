// Everything you are likely to want to change lives in this file.

export const SITE = {
  title: 'Spotify Camp Nou',
  fixture: 'FC Barcelona vs Costa Brava FC',
  meta: 'Matchday 12 · Sat 23 May · 21:00',
  currency: '€',
};

// YouTube video IDs for the live screens. Paste the 11-character ID from a
// Shorts URL (youtube.com/shorts/<ID>). Broken or blocked IDs are skipped.
// With empty lists the screens show a branded placeholder instead of video.
export const PLAYLISTS = {
  // Two giant boards above the pitch, three portrait panels each.
  giant: [],
  // Eight portrait screens on the hospitality ring, two per stand.
  ring: [],
};

// Camp Nou's four stands. Index order matches the sector layout in layout.js:
// stand 0 sits on +X, 1 on +Z, 2 on -X, 3 on -Z.
export const STANDS = [
  { name: 'Gol Nord', short: 'N', side: false },
  { name: 'Lateral', short: 'L', side: true },
  { name: 'Gol Sud', short: 'S', side: false },
  { name: 'Tribuna', short: 'T', side: true },
];

export const TAKEN_SHARE = 0.3;

export const COLORS = {
  garnet: 0xa50044,
  blue: 0x1f56c8,
  red: 0xd9283b,
  yellow: 0xf6c400,
  taken: 0x3a3f4c,
  hover: 0xff9a2e,
  selected: 0xff6a1a,
  dimmed: 0xc9ced8,
};

// Optional real 3D model (for example the Sketchfab "New Camp Nou Stadium").
// Download it as glTF Binary (.glb), save it at the path below and reload.
// It is auto-scaled to the procedural bowl; nudge it with scale / rotationY /
// offset if it doesn't line up. If the file is missing, it is skipped.
export const MODEL = {
  url: './assets/camp-nou.glb',
  autoFit: true,        // scale so its footprint matches the procedural bowl
  scale: 1,             // extra multiplier on top of auto-fit
  rotationY: 0,         // radians; use Math.PI / 2 if the pitch runs the wrong way
  offset: [0, 0, 0],    // metres, x / y / z
  // Procedural parts to hide once the model is loaded. Seats, terraces and
  // pitch stay, because the seat picker needs them.
  hide: ['facade', 'roof', 'columns'],
};

// VIP suites in the glass ring above the lower tier.
export const VIP = {
  capacity: 12,          // armchairs per suite
  pricePerGuest: 250,    // euros
  prebooked: [2, 7, 10], // suite numbers already sold
};

// Background music. Save your own copy of the track at this path (MP3 or
// M4A). Without a file, a generated crowd ambience plays instead.
export const MUSIC = {
  url: './assets/anthem.mp3',
  title: 'Cant del Barça',
  volume: 0.5,
  autoplay: true, // starts on the first click or tap (browsers block sound before that)
};
