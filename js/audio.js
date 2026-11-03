/** audio.js — Rugido de motor sintetizado con Web Audio (sin archivos). Desactivado por defecto. */
const PROFILES = {
  ferrari: { type: 'sawtooth', from: 85, to: 330, sub: 0.5, dur: 1.1 },     // V12 agudo
  lamborghini: { type: 'sawtooth', from: 60, to: 210, sub: 0.9, dur: 1.2 }, // V10/V12 rasposo
  porsche: { type: 'square', from: 52, to: 170, sub: 0.6, dur: 0.95 },      // bóxer
};

export const audio = {
  enabled: false,
  ctx: null,
  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      try {
        this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
        this.ctx.resume();
      } catch (e) { this.enabled = false; }
    }
    return this.enabled;
  },
  rev(brand = 'ferrari') {
    if (!this.enabled || !this.ctx) return;
    const p = PROFILES[brand] || PROFILES.ferrari;
    const c = this.ctx, now = c.currentTime;
    const out = c.createGain();
    out.gain.setValueAtTime(0, now);
    out.gain.linearRampToValueAtTime(0.16, now + 0.12);
    out.gain.exponentialRampToValueAtTime(0.0008, now + p.dur);
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(500, now); lp.frequency.exponentialRampToValueAtTime(2600, now + p.dur * 0.6);
    const shaper = c.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) { const x = (i / 128) - 1; curve[i] = Math.tanh(x * 3); }
    shaper.curve = curve;
    [[p.type, 1], ['sawtooth', 0.5], ['square', p.sub * 0.6]].forEach(([type, mult], i) => {
      const o = c.createOscillator();
      o.type = type;
      o.frequency.setValueAtTime(p.from * (i === 2 ? 0.5 : mult), now);
      o.frequency.exponentialRampToValueAtTime(p.to * (i === 2 ? 0.5 : mult), now + p.dur * 0.55);
      o.frequency.exponentialRampToValueAtTime(p.from * 1.4 * (i === 2 ? 0.5 : mult), now + p.dur);
      o.connect(shaper); o.start(now); o.stop(now + p.dur + 0.05);
    });
    shaper.connect(lp); lp.connect(out); out.connect(c.destination);
  },
};
