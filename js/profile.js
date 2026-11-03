/**
 * profile.js — Siluetas procedurales (lado del coche, X = largo, Y = alto, frente = +X).
 * Se usan tanto para el modelo 3D placeholder (scene.js) como para las siluetas SVG
 * (tarjetas, galería, comparador y fallback sin WebGL).
 *
 * Para añadir un coche nuevo basta con ajustar `params` en data.js
 *   sx: escala de largo · hy: escala de altura · rs: escala de ruedas · lift: altura libre al suelo · wing: alerón
 */

const SILL = 0.14; // altura de los bajos

/** Suavizado de esquinas (Chaikin). Mantiene extremos si la curva es abierta. */
export function chaikin(pts, iter = 2, closed = false) {
  let p = pts;
  for (let k = 0; k < iter; k++) {
    const out = [];
    const n = p.length;
    if (!closed) out.push(p[0]);
    const lim = closed ? n : n - 1;
    for (let i = 0; i < lim; i++) {
      const a = p[i];
      const b = p[(i + 1) % n];
      out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
      out.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    if (!closed) out.push(p[n - 1]);
    p = out;
  }
  return p;
}

const STYLES = {
  ferrari: {
    smooth: 2, wheelsX: [1.36, -1.3], r: 0.35, wing: null,
    upper: [[-2.2, 0.14], [-2.27, 0.42], [-2.2, 0.7], [-1.85, 0.86], [-1.2, 0.92], [-0.5, 0.94], [0.5, 0.94], [0.95, 0.9], [1.5, 0.8], [2.0, 0.62], [2.22, 0.48], [2.26, 0.3], [2.18, 0.14]],
    cabin: [[-1.15, 0.86], [-0.65, 1.12], [-0.1, 1.19], [0.4, 1.16], [0.92, 0.86]], roof: [1, 3],
  },
  lambo: {
    smooth: 1, wheelsX: [1.38, -1.3], r: 0.36, wing: { x: -2.05, y: 1.06, w: 1.7, c: 0.5 },
    upper: [[-2.2, 0.14], [-2.28, 0.46], [-2.24, 0.74], [-1.7, 0.86], [-0.9, 0.9], [-0.2, 0.92], [0.6, 0.9], [1.3, 0.82], [2.0, 0.58], [2.3, 0.42], [2.3, 0.26], [2.2, 0.14]],
    cabin: [[-1.0, 0.86], [-0.3, 1.08], [0.2, 1.12], [0.75, 0.86]], roof: [1, 2],
  },
  porsche: {
    smooth: 2, wheelsX: [1.34, -1.28], r: 0.35, wing: null,
    upper: [[-2.1, 0.14], [-2.2, 0.4], [-2.12, 0.74], [-1.7, 0.94], [-1.1, 0.98], [-0.2, 0.96], [0.7, 0.92], [1.4, 0.86], [2.0, 0.7], [2.15, 0.5], [2.17, 0.3], [2.08, 0.14]],
    cabin: [[-1.4, 0.9], [-0.75, 1.22], [-0.1, 1.28], [0.45, 1.2], [1.0, 0.9]], roof: [1, 3],
  },
};

function archPoints(cx, r, sill, gap = 0.06) {
  const R = r + gap;
  const a0 = Math.asin((sill - r) / R);
  const pts = [];
  const steps = 12;
  for (let i = 0; i <= steps; i++) {
    const a = a0 + ((Math.PI - 2 * a0) * i) / steps;
    pts.push([cx + R * Math.cos(a), r + R * Math.sin(a)]);
  }
  return pts;
}

/** Devuelve todas las piezas 2D ya transformadas por los parámetros del modelo. */
export function getCar(style = 'ferrari', params = {}) {
  const S = STYLES[style] || STYLES.ferrari;
  const { sx = 1, hy = 1, rs = 1, lift = 0, wing = undefined } = params;
  const T = ([x, y]) => [x * sx, lift + SILL + (y - SILL) * hy];
  const r = S.r * rs;
  const sill = SILL + lift;

  const upper = chaikin(S.upper.map(T), S.smooth, false);
  const wx = S.wheelsX.map((x) => x * sx);
  const outline = [...upper, ...archPoints(wx[0], r, sill), ...archPoints(wx[1], r, sill)];

  const cabinRaw = S.cabin.map(T);
  const cabin = chaikin(cabinRaw, Math.max(1, S.smooth - 1), true);
  const [a, b] = S.roof;
  const top = cabinRaw.slice(a, b + 1);
  const roof = chaikin([...top, ...top.slice().reverse().map(([x, y]) => [x, y - 0.075 * hy])], 1, true);

  const showWing = wing === undefined ? !!S.wing : wing;
  const w = showWing && S.wing ? { ...S.wing, x: S.wing.x * sx, y: lift + SILL + (S.wing.y - SILL) * hy } : null;

  return { outline, cabin, roof, wheels: wx.map((x) => ({ x, r })), wing: w, sill, length: 4.55 * sx };
}

const path = (pts) => 'M' + pts.map(([x, y]) => `${x.toFixed(3)} ${(-y).toFixed(3)}`).join('L') + 'Z';

/** Silueta SVG (string) para tarjetas, galería, comparador y fallback. */
export function silhouetteSVG(model, color = '#888', { detail = true, id = '' } = {}) {
  const car = getCar(model.style, model.params);
  const uid = `s${model.id}${id}`.replace(/\W/g, '');
  const wheels = car.wheels
    .map(
      (w) =>
        `<circle cx="${w.x.toFixed(3)}" cy="${(-w.r).toFixed(3)}" r="${w.r}" fill="#0b0b0b"/>` +
        `<circle cx="${w.x.toFixed(3)}" cy="${(-w.r).toFixed(3)}" r="${(w.r * 0.62).toFixed(3)}" fill="#2a2a2e" stroke="#9a9a9f" stroke-width="0.02"/>` +
        (detail ? `<circle cx="${w.x.toFixed(3)}" cy="${(-w.r).toFixed(3)}" r="${(w.r * 0.18).toFixed(3)}" fill="#9a9a9f"/>` : ''),
    )
    .join('');
  const wing = car.wing
    ? `<rect x="${(car.wing.x - car.wing.c / 2).toFixed(3)}" y="${(-car.wing.y - 0.05).toFixed(3)}" width="${car.wing.c}" height="0.07" rx="0.02" fill="${color}"/>` +
      `<rect x="${(car.wing.x - 0.02).toFixed(3)}" y="${(-car.wing.y).toFixed(3)}" width="0.05" height="${(car.wing.y - 0.7).toFixed(3)}" fill="#111"/>`
    : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2.55 -1.5 5.1 1.55" role="img" aria-label="${model.name}" focusable="false">` +
    `<defs><linearGradient id="g${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient></defs>` +
    `<ellipse cx="0" cy="0.02" rx="2.2" ry="0.07" fill="#000" opacity=".55"/>` +
    wing +
    `<path d="${path(car.outline)}" fill="${color}"/>` +
    `<path d="${path(car.cabin)}" fill="#0a0e14"/>` +
    `<path d="${path(car.roof)}" fill="${color}"/>` +
    `<path d="${path(car.outline)}" fill="url(#g${uid})"/>` +
    wheels +
    (detail ? `<path d="M${(car.outline[car.outline.length - 30]?.[0] ?? 0).toFixed(2)} ${-(car.sill + 0.28)}h0.9" stroke="#000" stroke-opacity=".25" stroke-width=".02"/>` : '') +
    `</svg>`
  );
}

/** Ruta de la foto de un modelo: photos/<id>.jpg (o la incrustada por tools/build.mjs en apex.html). */
export const photoSrc = (id) => (window.APEX_PHOTOS && window.APEX_PHOTOS[id]) || `photos/${id}.jpg`;

/** Silueta SVG + foto real encima. Si la foto no existe, se queda la silueta (el <img> se elimina solo). */
export function artHTML(model, color, opts) {
  return (
    silhouetteSVG(model, color, opts) +
    `<img class="photo" src="${photoSrc(model.id)}" alt="${model.name}" decoding="async" onload="this.parentNode.classList.add('has-photo')" onerror="this.remove()">`
  );
}
