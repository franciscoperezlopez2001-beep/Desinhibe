/** extras.js — Comparador, galería, formulario de contacto y newsletter. */
import { BRANDS, MODELS, byId } from './data.js';
import { silhouetteSVG, artHTML } from './profile.js';
import { t, L, getLang } from './i18n.js';
import { fmtNum, REDUCED, clamp } from './util.js';
import { priceText } from './brands.js';

const gsap = window.gsap;
const colorOf = (m) => BRANDS[m.brand].colors[0].hex;

/* ─────────────── Comparador ─────────────── */
export function initCompare() {
  const table = document.querySelector('.cmp-table');
  const sel = ['sf90', 'revuelto', '911turbos'];

  const rows = [
    { k: 'power', label: 'brand.power', unit: 'unit.cv', dec: 0, best: 'max' },
    { k: 'zero100', label: 'brand.accel', unit: 'unit.s', dec: 1, best: 'min' },
    { k: 'top', label: 'brand.top', unit: 'unit.kmh', dec: 0, best: 'max' },
  ];

  const render = () => {
    const ms = sel.map(byId);
    const opts = (cur) => MODELS.map((m) => `<option value="${m.id}" ${m.id === cur ? 'selected' : ''}>${BRANDS[m.brand].name} ${m.name}</option>`).join('');
    let h = `<thead><tr><th scope="col"><span class="sr">${t('cmp.model')}</span></th>${ms
      .map((m, i) => `<th scope="col" class="cmp-col" data-brand="${m.brand}">
        <div class="cmp-art">${artHTML(m, colorOf(m), { detail: false, id: 'k' + i })}</div>
        <label class="sr" for="cmp-s${i}">${t('cmp.model')} ${i + 1}</label>
        <select id="cmp-s${i}" data-i="${i}">${opts(m.id)}</select></th>`)
      .join('')}</tr></thead><tbody>`;
    rows.forEach((r) => {
      const vals = ms.map((m) => m[r.k]);
      const best = r.best === 'max' ? Math.max(...vals) : Math.min(...vals);
      h += `<tr><th scope="row">${t(r.label)}</th>${ms
        .map((m) => {
          const isBest = m[r.k] === best && new Set(vals).size > 1;
          const pct = r.best === 'max' ? (m[r.k] / best) * 100 : (best / m[r.k]) * 100;
          return `<td class="${isBest ? 'best' : ''}" data-brand="${m.brand}"><span class="v">${fmtNum(m[r.k], r.dec, getLang())}<small>${t(r.unit)}</small></span>${isBest ? `<span class="sr"> (${t('cmp.best')})</span>` : ''}<i class="bar" style="--w:${clamp(pct, 0, 100)}%"></i></td>`;
        })
        .join('')}</tr>`;
    });
    h += `<tr><th scope="row">${t('cmp.engine')}</th>${ms.map((m) => `<td class="txt">${L(m.engine)}</td>`).join('')}</tr>`;
    h += `<tr><th scope="row">${t('brand.from')}</th>${ms.map((m) => `<td class="txt">${priceText(m).replace(t('brand.from') + ' ', '')}</td>`).join('')}</tr></tbody>`;
    table.innerHTML = h;
    if (!REDUCED) gsap.fromTo(table.querySelectorAll('.bar'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power3.out', stagger: 0.05, transformOrigin: 'left' });
  };

  table.addEventListener('change', (e) => {
    const s = e.target.closest('select'); if (!s) return;
    sel[+s.dataset.i] = s.value;
    render();
    document.getElementById(`cmp-s${s.dataset.i}`)?.focus();
  });
  document.addEventListener('langchange', render);
  render();
}

/* ─────────────── Galería con parallax ─────────────── */
export function initGallery() {
  const track = document.querySelector('.gal-track');
  const view = document.querySelector('.gal-viewport');
  const count = document.querySelector('.gal-count');
  let idx = 0, x = 0, tx = 0, drag = null, vw = 0;

  const slides = MODELS.map((m, i) => {
    const b = BRANDS[m.brand];
    return `<article class="slide" data-brand="${m.brand}" aria-roledescription="slide" aria-label="${i + 1} / ${MODELS.length}">
      <div class="slide-bg"></div>
      <div class="slide-ghost" data-depth="-0.35" aria-hidden="true">${m.name.split(' ')[0]}</div>
      <div class="slide-car" data-depth="0.5">${artHTML(m, colorOf(m), { id: 'g' + i })}</div>
      <div class="slide-cap" data-depth="0.15"><span class="slide-brand">${b.name}</span><h3>${m.name}</h3><p>${L(m.tag)}</p></div>
    </article>`;
  });
  track.innerHTML = slides.join('');
  const els = [...track.children];

  const measure = () => { vw = view.clientWidth; };
  const go = (i) => { idx = clamp(i, 0, els.length - 1); tx = -idx * vw; count.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(els.length).padStart(2, '0')}`; };
  const frame = () => {
    x += (tx - x) * (REDUCED ? 1 : 0.1);
    track.style.transform = `translate3d(${x}px,0,0)`;
    els.forEach((el, i) => {
      const off = (i * vw + x) / vw; // 0 = centrada
      if (Math.abs(off) > 1.6) return;
      el.querySelectorAll('[data-depth]').forEach((l) => (l.style.transform = `translate3d(${off * -vw * parseFloat(l.dataset.depth)}px,0,0)`));
    });
  };
  gsap.ticker.add(frame);

  document.querySelectorAll('[data-gdir]').forEach((b) => b.addEventListener('click', () => go(idx + +b.dataset.gdir)));
  view.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { go(idx + 1); e.preventDefault(); } else if (e.key === 'ArrowLeft') { go(idx - 1); e.preventDefault(); } });
  view.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, base: tx, moved: 0 }; view.setPointerCapture(e.pointerId); });
  view.addEventListener('pointermove', (e) => { if (!drag) return; drag.moved = e.clientX - drag.x; tx = drag.base + drag.moved; });
  const end = () => { if (!drag) return; const d = drag.moved; drag = null; go(Math.abs(d) > vw * 0.12 ? idx + (d < 0 ? 1 : -1) : idx); };
  view.addEventListener('pointerup', end); view.addEventListener('pointercancel', end);
  window.addEventListener('resize', () => { measure(); go(idx); x = tx; });
  measure(); go(0); x = tx;
}

/* ─────────────── Contacto + newsletter ─────────────── */
const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export function initContact() {
  const form = document.getElementById('contact-form');
  const sel = form.querySelector('#f-model');
  const date = form.querySelector('#f-date');
  const fillModels = () => {
    const cur = sel.value;
    sel.innerHTML = `<option value="">—</option>` + MODELS.map((m) => `<option value="${m.id}">${BRANDS[m.brand].name} ${m.name}</option>`).join('');
    sel.value = cur;
  };
  fillModels();
  document.addEventListener('langchange', fillModels);
  const iso = (d) => d.toISOString().slice(0, 10);
  date.min = iso(new Date(Date.now() + 864e5));

  const setErr = (input, key) => {
    const f = input.closest('.field');
    f.classList.toggle('invalid', !!key);
    f.querySelector('.err').textContent = key ? t(key) : '';
    input.setAttribute('aria-invalid', key ? 'true' : 'false');
    return !key;
  };
  const checks = {
    name: (i) => setErr(i, i.value.trim().length < 3 ? 'e.name' : ''),
    email: (i) => setErr(i, validEmail(i.value.trim()) ? '' : 'e.email'),
    phone: (i) => setErr(i, !i.value || /^[+\d][\d\s().-]{6,}$/.test(i.value.trim()) ? '' : 'e.phone'),
    model: (i) => setErr(i, i.value ? '' : 'e.model'),
    date: (i) => setErr(i, i.value && i.value >= date.min ? '' : 'e.date'),
    consent: (i) => setErr(i, i.checked ? '' : 'e.consent'),
  };
  form.addEventListener('focusout', (e) => { const n = e.target.name; if (checks[n]) checks[n](e.target); });
  form.addEventListener('input', (e) => { const n = e.target.name; if (checks[n] && e.target.closest('.field').classList.contains('invalid')) checks[n](e.target); });

  const btn = form.querySelector('.btn-send');
  const lbl = btn.querySelector('.lbl');
  const ok = form.querySelector('.form-ok');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = Object.keys(checks).filter((n) => !checks[n](form.elements[n]));
    if (bad.length) { form.elements[bad[0]].focus(); return; }
    btn.classList.add('sending'); btn.disabled = true; lbl.textContent = t('f.sending');
    setTimeout(() => {
      btn.classList.remove('sending'); btn.classList.add('done'); lbl.textContent = '✓';
      ok.textContent = t('f.ok');
      setTimeout(() => { form.reset(); btn.disabled = false; btn.classList.remove('done'); lbl.textContent = t('f.send'); }, 3500);
    }, REDUCED ? 100 : 1500);
  });

  // Newsletter
  const nf = document.getElementById('news-form');
  const ni = nf.querySelector('input');
  const nm = nf.querySelector('.news-msg');
  nf.addEventListener('submit', (e) => {
    e.preventDefault();
    const good = validEmail(ni.value.trim());
    nm.textContent = t(good ? 'ft.ok' : 'ft.err');
    nm.classList.toggle('bad', !good);
    ni.setAttribute('aria-invalid', String(!good));
    if (good) nf.reset();
  });

  // Aviso legal
  const dlg = document.getElementById('legal');
  document.querySelectorAll('[data-legal]').forEach((b) => b.addEventListener('click', () => dlg.showModal?.()));
  // Créditos de fotos (obligatorios con CC BY / CC BY-SA). Los inyecta tools/build.mjs desde photos/credits.json
  const credBox = document.createElement('div');
  dlg.querySelector('p').after(credBox);
  const paintCredits = () => {
    const cr = window.APEX_CREDITS || {};
    const ids = MODELS.filter((m) => cr[m.id]);
    credBox.innerHTML = ids.length
      ? `<h3>${t('legal.photos')}</h3><ul class="credits">${ids.map((m) => { const c = cr[m.id]; return `<li><b>${BRANDS[m.brand].name} ${m.name}</b> — <a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.file}</a>, ${c.author}, ${c.license}</li>`; }).join('')}</ul>`
      : '';
  };
  paintCredits();
  document.addEventListener('langchange', paintCredits);
  dlg.querySelector('[data-close]').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

  return {
    prefill(model) {
      sel.value = model.id;
      form.elements.msg.value = t('prefill', { m: `${BRANDS[model.brand].name} ${model.name}` });
      form.elements.name.focus({ preventScroll: true });
    },
  };
}
