// Background music. Plays your own audio file from MUSIC.url on a loop.
// Without a file it plays a generated crowd ambience (filtered noise with
// slow swells), so the button always does something.

import { MUSIC } from './config.js';

export class Music {
  constructor() {
    this.on = false;
    this.hasFile = false;
    this.audio = null;
    this.ctx = null;
    this.gain = null;
  }

  async init() {
    try {
      const head = await fetch(MUSIC.url, { method: 'HEAD' });
      const type = head.headers.get('content-type') || '';
      this.hasFile = head.ok && !type.includes('text/html');
    } catch (e) {
      this.hasFile = false;
    }
    return this.hasFile;
  }

  get label() { return this.hasFile ? MUSIC.title : 'Crowd'; }

  async setOn(on) {
    this.on = on;
    if (this.hasFile) {
      if (!this.audio) {
        this.audio = new Audio(MUSIC.url);
        this.audio.loop = true;
        this.audio.volume = MUSIC.volume;
        this.audio.preload = 'auto';
      }
      if (on) await this.audio.play().catch(() => { this.on = false; });
      else this.audio.pause();
      return this.on;
    }
    if (on) {
      this.startCrowd();
      await this.ctx.resume();
      this.gain.gain.setTargetAtTime(MUSIC.volume * 0.6, this.ctx.currentTime, 0.6);
    } else if (this.ctx) {
      this.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
    }
    return this.on;
  }

  // Pause while the tab is hidden, resume when it comes back.
  setHidden(hidden) {
    if (!this.on) return;
    if (this.audio) hidden ? this.audio.pause() : this.audio.play().catch(() => {});
    if (this.ctx) hidden ? this.ctx.suspend() : this.ctx.resume();
  }

  startCrowd() {
    if (this.ctx) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const len = ctx.sampleRate * 6;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let b = 0;
      for (let i = 0; i < len; i++) {
        b = 0.97 * b + 0.03 * (Math.random() * 2 - 1); // soft brown-ish noise
        d[i] = b * 6;
      }
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 650;
    band.Q.value = 0.5;
    const low = ctx.createBiquadFilter();
    low.type = 'lowpass';
    low.frequency.value = 2400;
    const swell = ctx.createGain();
    swell.gain.value = 0.7;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 0.3;
    lfo.connect(lfoDepth).connect(swell.gain);
    const out = ctx.createGain();
    out.gain.value = 0;
    src.connect(band).connect(low).connect(swell).connect(out).connect(ctx.destination);
    src.start();
    lfo.start();
    this.ctx = ctx;
    this.gain = out;
  }
}
