/** util.js — utilidades compartidas */

export const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const COARSE = window.matchMedia('(pointer: coarse)').matches;
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Divide un texto en palabras envueltas para el revelado línea a línea. */
export function split(el) {
  const txt = el.textContent.trim();
  el.setAttribute('aria-label', txt);
  el.innerHTML = txt
    .split(/\s+/)
    .map((w) => `<span class="word" aria-hidden="true"><span>${esc(w)}</span></span>`)
    .join(' ');
}

export const fmtNum = (n, d = 0, lang = 'es') =>
  new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);

export const fmtUSD = (n, lang = 'es') =>
  lang === 'es' ? `${new Intl.NumberFormat('es-ES').format(n)} USD` : `$${new Intl.NumberFormat('en-US').format(n)}`;
