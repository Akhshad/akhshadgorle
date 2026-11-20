// Detects the device once at start-up and picks a quality preset.
// Force a preset with ?mobile, ?desktop or ?hq in the URL.

export function detectDevice() {
  const q = new URLSearchParams(location.search);
  const ua = navigator.userAgent;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const touch = coarse || navigator.maxTouchPoints > 1;
  const small = Math.min(screen.width, screen.height) < 820;
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);

  let phone = touch && small;
  if (q.has('mobile')) phone = true;
  if (q.has('desktop')) phone = false;

  // iPhones hide their RAM, so they are never treated as low-end.
  const mem = navigator.deviceMemory || 8;
  const cores = navigator.hardwareConcurrency || 8;
  const lowEnd = !isIOS && isAndroid && (mem <= 3 || cores <= 4);
  const hq = q.has('hq') && !phone;

  const dpr = window.devicePixelRatio || 1;
  let preset;
  if (hq) {
    preset = { name: 'hq', pixelRatio: Math.min(dpr, 2), minPixelRatio: 1.25, shadowSize: 4096, softShadows: true, liveScreens: 14, trees: 2600, buildings: true, clearcoat: true };
  } else if (phone && lowEnd) {
    preset = { name: 'phone-low', pixelRatio: Math.min(dpr, 1.5), minPixelRatio: 1.0, shadowSize: 1024, softShadows: false, liveScreens: 2, trees: 700, buildings: true, clearcoat: false };
  } else if (phone) {
    preset = { name: 'phone', pixelRatio: Math.min(dpr, 2), minPixelRatio: Math.min(dpr, 1.5), shadowSize: 2048, softShadows: false, liveScreens: 3, trees: 1200, buildings: true, clearcoat: false };
  } else {
    preset = { name: 'desktop', pixelRatio: Math.min(dpr, 1.5), minPixelRatio: 1.0, shadowSize: 2048, softShadows: false, liveScreens: 6, trees: 2000, buildings: true, clearcoat: false };
  }

  return { phone, touch, isIOS, isAndroid, lowEnd, hq, preset, test: q.has('test') };
}
