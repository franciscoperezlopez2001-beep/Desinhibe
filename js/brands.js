/** brands.js — secciones Ferrari / Lamborghini / Porsche: tarjetas, ficha técnica, colores, visor 3D. */
import { BRANDS, BRAND_KEYS, byBrand, byId } from './data.js';
import { silhouetteSVG, artHTML } from './profile.js';
import { t, L, getLang } from './i18n.js';
import { fmtNum, fmtUSD, REDUCED } from './util.js';

const gsap = window.gsap;

export function priceText(m) {
  return m.price.from ? `${t('brand.from')} ${fmtUSD(m.price.from, getLang())}` : L(m.price.text);
}

export function initBrands({ scene, audio, goContact }) {
  const state = {};

  BRAND_KEYS.forEach((key) => {
    const sec = document.getElementById(key);
    const brand = BRANDS[key];
    const models = byBrand(key);
    const st = (state[key] = { model: byId(brand.star), color: brand.colors[0], shown: { power: 0, zero100: 0, top: 0 } });
    const $ = (s) => sec.querySelector(s);
    const cards = $('.cards');

    /* tarjetas */
    cards.innerHTML = models
      .map(
        (m) => `<li><button class="card" type="button" data-id="${m.id}" aria-pressed="false">
          <span class="card-art" aria-hidden="true"></span>
          <span class="card-name">${m.name}</span>
          <span class="card-meta"><span class="card-engine"></span><b>${m.power}</b> <span data-i18n="unit.cv">${t('unit.cv')}</span></span>
          ${m.legacy ? `<span class="card-legacy">${t('brand.legacy')}</span>` : ''}
        </button></li>`,
      )
      .join('');

    /* colores */
    const colors = $('.colors');
    colors.innerHTML = brand.colors
      .map((c, i) => `<button type="button" role="radio" aria-checked="${i === 0}" data-i="${i}" style="--sw:${c.hex}" title="${c.name}"><span class="sr">${c.name}</span></button>`)
      .join('');

    const paintArt = () => {
      cards.querySelectorAll('.card').forEach((b) => {
        const m = byId(b.dataset.id);
        b.querySelector('.card-art').innerHTML = artHTML(m, m.id === st.model.id ? st.color.hex : brand.colors[0].hex, { detail: false, id: 'c' });
        b.querySelector('.card-engine').textContent = L(m.engine).split('·')[0].trim();
        b.querySelector('[data-i18n="unit.cv"]').textContent = t('unit.cv');
        const lg = b.querySelector('.card-legacy'); if (lg) lg.textContent = t('brand.legacy');
        b.setAttribute('aria-label', `${t('brand.select')} ${m.name}`);
      });
    };

    const count = (el, from, to, dec) => {
      if (REDUCED) { el.textContent = fmtNum(to, dec, getLang()); return; }
      const o = { v: from };
      gsap.to(o, { v: to, duration: 1.4, ease: 'power3.out', overwrite: 'auto', onUpdate: () => (el.textContent = fmtNum(o.v, dec, getLang())) });
    };

    const renderSpec = (animate = true) => {
      const m = st.model;
      $('.spec-name').textContent = m.name;
      $('.spec-tag').textContent = L(m.tag);
      $('.spec-engine').textContent = L(m.engine);
      $('.spec-price').textContent = priceText(m);
      $('.badge-legacy').hidden = !m.legacy;
      [['power', 0], ['zero100', 1], ['top', 0]].forEach(([k, d]) => {
        const el = $(`[data-stat="${k}"]`);
        if (animate) count(el, st.shown[k], m[k], d); else el.textContent = fmtNum(m[k], d, getLang());
        st.shown[k] = m[k];
      });
      $('.color-name').textContent = st.color.name;
      cards.querySelectorAll('.card').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === m.id)));
      sec.querySelector('.stage-fallback').innerHTML = silhouetteSVG(m, st.color.hex, { id: 'f' + key });
      paintArt();
    };

    const select = (id) => {
      if (st.model.id === id) return;
      st.model = byId(id);
      scene?.setModel(key, st.model);
      renderSpec();
    };

    cards.addEventListener('click', (e) => { const b = e.target.closest('.card'); if (b) { select(b.dataset.id); audio.rev(key); } });
    cards.addEventListener('pointerenter', () => {}, { passive: true });
    colors.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      st.color = brand.colors[+b.dataset.i];
      colors.querySelectorAll('button').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
      scene?.setColor(key, st.color.hex);
      $('.color-name').textContent = st.color.name;
      sec.querySelector('.stage-fallback').innerHTML = silhouetteSVG(st.model, st.color.hex, { id: 'f' + key });
      paintArt();
    });
    // flechas dentro de los radios
    colors.addEventListener('keydown', (e) => {
      if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
      const list = [...colors.querySelectorAll('button')];
      const i = list.findIndex((x) => x.getAttribute('aria-checked') === 'true');
      const n = list[(i + (e.key === 'ArrowRight' ? 1 : list.length - 1)) % list.length];
      n.focus(); n.click(); e.preventDefault();
    });

    sec.querySelectorAll('.car-nav button').forEach((b) =>
      b.addEventListener('click', () => {
        const step = cards.querySelector('li').getBoundingClientRect().width + 16;
        cards.scrollBy({ left: +b.dataset.dir * step * 1.5, behavior: REDUCED ? 'auto' : 'smooth' });
      }),
    );
    $('.btn-request').addEventListener('click', () => goContact(st.model));

    /* visor: arrastrar / teclado */
    const hit = $('.stage-hit');
    let last = null;
    hit.addEventListener('pointerdown', (e) => { last = { x: e.clientX, y: e.clientY }; hit.setPointerCapture(e.pointerId); hit.classList.add('grab'); });
    hit.addEventListener('pointermove', (e) => {
      if (!last) return;
      scene?.drag(e.clientX - last.x, e.clientY - last.y);
      last = { x: e.clientX, y: e.clientY };
      sec.classList.add('dragged');
    });
    const up = () => { last = null; hit.classList.remove('grab'); scene?.dragEnd(); };
    hit.addEventListener('pointerup', up); hit.addEventListener('pointercancel', up);
    hit.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') scene?.rotate(-0.2); else if (e.key === 'ArrowRight') scene?.rotate(0.2); else return;
      sec.classList.add('dragged'); e.preventDefault();
    });

    renderSpec(false);
    scene?.setModel(key, st.model, { instant: true });
    st.render = renderSpec;
    gsap.fromTo(cards.querySelectorAll('li'), { y: 40, opacity: 0 }, REDUCED ? { y: 0, opacity: 1 } : { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: cards, start: 'top 88%', once: true } });
  });

  document.addEventListener('langchange', () => BRAND_KEYS.forEach((k) => state[k].render(false)));
  return state;
}
