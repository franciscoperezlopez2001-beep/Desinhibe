/** main.js — arranque: loader, scroll suave, escena, navegación, transiciones y UI global. */
import { BRANDS, BRAND_KEYS, MODELS } from './data.js';
import { applyI18n, setLang, getLang, t, L } from './i18n.js';
import { REDUCED, COARSE, clamp, split } from './util.js';
import { audio } from './audio.js';
import { initBrands } from './brands.js';
import { initCompare, initGallery, initContact } from './extras.js';

const gsap = window.gsap;
gsap.registerPlugin(window.ScrollTrigger);
const root = document.documentElement;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const SECTIONS = ['inicio', ...BRAND_KEYS, 'comparador', 'galeria', 'contacto'];
const THEME_COL = { hero: '#ffffff', ferrari: '#dc0000', lamborghini: '#ffd400', porsche: '#0057ff' };

if (REDUCED) root.classList.add('reduced');

/* ───── Detección de capacidad: ¿WebGL y dispositivo suficiente? ───── */
function canUse3D() {
  const q = location.search;
  if (/[?&]lite\b/.test(q)) return false;
  if (/[?&]force3d\b/.test(q)) return true;
  try {
    const c = document.createElement('canvas');
    if (!(c.getContext('webgl2') || c.getContext('webgl'))) return false;
  } catch (e) { return false; }
  const weak = (navigator.hardwareConcurrency || 8) <= 3 || (navigator.deviceMemory && navigator.deviceMemory <= 2);
  return !(COARSE && weak);
}
const use3D = canUse3D();
root.classList.toggle('lite', !use3D);

/* ───── Idioma ───── */
applyI18n();
$$('[data-split]').forEach((el) => { if (!el.querySelector('.word')) split(el); });
const syncLangButtons = () => $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === getLang())));
$$('.lang button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
document.addEventListener('langchange', () => { syncLangButtons(); syncSound(); });
syncLangButtons();

/* ───── Scroll suave ───── */
let lenis = null;
if (!REDUCED && window.Lenis) {
  lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
  lenis.on('scroll', window.ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}
const scrollToEl = (el, immediate = false) => {
  if (lenis) lenis.scrollTo(el, { duration: 1.5, easing: (x) => 1 - Math.pow(1 - x, 4), immediate });
  else el.scrollIntoView({ behavior: immediate || REDUCED ? 'auto' : 'smooth' });
};

/* ───── Escena 3D ───── */
let scene = null;
if (use3D) {
  try {
    const { Showroom } = await import('./scene.js');
    scene = new Showroom($('#gl'), { reduced: REDUCED, mobile: COARSE || innerWidth < 800 });
    gsap.ticker.add((_, dtMs) => scene.tick(dtMs / 1000));
  } catch (e) {
    console.warn('[APEX] WebGL no disponible, uso el modo estático.', e);
    root.classList.add('lite');
  }
}

/* ───── Wipe de color entre marcas ───── */
const wipe = $('.wipe');
function wipeTo(target, color) {
  if (REDUCED) { scrollToEl(target, true); return; }
  wipe.style.background = color;
  gsap.timeline()
    .set(wipe, { transformOrigin: '0 50%', scaleX: 0, display: 'block' })
    .to(wipe, { scaleX: 1, duration: 0.5, ease: 'expo.inOut' })
    .add(() => scrollToEl(target, true))
    .set(wipe, { transformOrigin: '100% 50%' })
    .to(wipe, { scaleX: 0, duration: 0.6, ease: 'expo.inOut', delay: 0.05 })
    .set(wipe, { display: 'none' });
}
function navigate(hash) {
  const target = document.getElementById(hash.replace('#', ''));
  if (!target) return;
  const isBrand = BRAND_KEYS.includes(target.id);
  closeMenu();
  if (isBrand) wipeTo(target, THEME_COL[target.id]); else scrollToEl(target);
  history.replaceState(null, '', `#${target.id}`);
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.getAttribute('href') === '#') return;
  e.preventDefault();
  navigate(a.getAttribute('href'));
});

/* ───── Menú overlay ───── */
const menu = $('#menu'), menuBtn = $('.menu-btn');
function openMenu() {
  menu.hidden = false; menuBtn.setAttribute('aria-expanded', 'true'); root.classList.add('menu-open');
  lenis?.stop();
  gsap.fromTo(menu.querySelectorAll('a'), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: REDUCED ? 0 : 0.8, ease: 'expo.out', stagger: 0.06 });
  menu.querySelector('a').focus();
}
function closeMenu() {
  if (menu.hidden) return;
  menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); root.classList.remove('menu-open'); lenis?.start();
}
menuBtn.addEventListener('click', () => (menu.hidden ? openMenu() : (closeMenu(), menuBtn.focus())));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { closeMenu(); menuBtn.focus(); } });

/* ───── Sonido (apagado por defecto) ───── */
const soundBtn = $('.sound');
function syncSound() {
  soundBtn.setAttribute('aria-pressed', String(audio.enabled));
  soundBtn.setAttribute('aria-label', t(audio.enabled ? 'sound.off' : 'sound.on'));
  soundBtn.classList.toggle('on', audio.enabled);
}
soundBtn.addEventListener('click', () => { audio.toggle(); syncSound(); audio.rev('ferrari'); });
syncSound();

/* ───── Puntos de progreso lateral ───── */
const dots = $('.dots');
const dotLabels = { inicio: () => t('nav.home'), comparador: () => t('nav.compare'), galeria: () => t('nav.gallery'), contacto: () => t('nav.contact') };
const dotName = (id) => (BRANDS[id] ? BRANDS[id].name : dotLabels[id]());
dots.innerHTML = SECTIONS.map((id) => `<li><a href="#${id}" data-dot="${id}"><span class="sr"></span></a></li>`).join('');
const paintDots = () => $$('.dots a').forEach((a) => (a.querySelector('.sr').textContent = dotName(a.dataset.dot)));
paintDots();
document.addEventListener('langchange', paintDots);

/* ───── Sección activa → tema + escena ───── */
let active = null;
function setActive(id) {
  if (id === active) return;
  active = id;
  const brand = BRAND_KEYS.includes(id) ? id : id === 'inicio' ? 'hero' : 'none';
  root.dataset.theme = brand;
  $$('.dots a').forEach((a) => a.toggleAttribute('aria-current', a.dataset.dot === id));
  $$('.nav-desktop a').forEach((a) => a.toggleAttribute('aria-current', a.dataset.nav === id));
  if (scene) {
    if (brand === 'hero') scene.setMode('hero'); else if (brand !== 'none') scene.setMode(brand);
    scene.setRunning(brand !== 'none');
    if (brand !== 'none') $('#gl').classList.add('on');
  }
}
const secEls = SECTIONS.map((id) => document.getElementById(id));
function onScroll() {
  const vh = innerHeight;
  const mid = vh * 0.5;
  for (const el of secEls) {
    const r = el.getBoundingClientRect();
    if (r.top <= mid && r.bottom > mid) { setActive(el.id); break; }
  }
  const hero = secEls[0];
  scene?.setHeroProgress(scrollY / Math.max(1, hero.offsetHeight - vh));
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);

/* ───── Hero: puertas de entrada ───── */
$$('.gate').forEach((g) => {
  const k = g.dataset.gate;
  const on = () => { scene?.setHover(k); audio.rev(k); g.closest('.gates').dataset.hover = k; };
  const off = () => { scene?.setHover(null); delete g.closest('.gates').dataset.hover; };
  g.addEventListener('pointerenter', on); g.addEventListener('pointerleave', off);
  g.addEventListener('focus', on); g.addEventListener('blur', off);
});

/* ───── Cursor personalizado ───── */
if (!COARSE && !REDUCED) {
  const cur = $('.cursor');
  root.classList.add('has-cursor');
  const xTo = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
  window.addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); cur.classList.add('vis'); }, { passive: true });
  document.addEventListener('pointerover', (e) => cur.classList.toggle('big', !!e.target.closest('a,button,select,input,textarea,label,.stage-hit,.gal-viewport')));
  document.addEventListener('pointerleave', () => cur.classList.remove('vis'));
}

/* ───── Módulos de contenido ───── */
const contact = initContact();
initBrands({
  scene, audio,
  goContact: (model) => { contact.prefill(model); navigate('#contacto'); },
});
initCompare();
initGallery();

/* ───── Revelados de texto ───── */
if (!REDUCED) {
  $$('[data-split]').forEach((el) => {
    if (el.closest('.hero')) return; // el hero se anima tras el loader
    gsap.fromTo(el.querySelectorAll('.word > span'), { yPercent: 115 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  $$('.eyebrow, .lede, .history, .section-sub, .spec, .models-head, .form, .cmp-wrap').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.from(el, { y: 36, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
  gsap.from('.gal-viewport', { clipPath: 'inset(0 100% 0 0)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.gal-viewport', start: 'top 85%', once: true } });
}

/* ───── Loader ───── */
const bar = $('#loader .loader-bar i'), pct = $('#loader .loader-pct');
const prog = { v: 0 };
function setProgress(v) { gsap.to(prog, { v, duration: REDUCED ? 0 : 0.6, ease: 'power2.out', overwrite: true, onUpdate: () => { bar.style.transform = `scaleX(${prog.v})`; pct.textContent = `${Math.round(prog.v * 100)}%`; } }); }
setProgress(0.6);
const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]);
const winLoad = document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => window.addEventListener('load', r, { once: true }));
await Promise.all([fontsReady, winLoad]);
setProgress(1);
await new Promise((r) => setTimeout(r, REDUCED ? 0 : 750));

const loader = $('#loader');
const intro = gsap.timeline();
intro.to(loader, { yPercent: -100, duration: REDUCED ? 0 : 0.9, ease: 'expo.inOut' })
  .add(() => { loader.remove(); root.classList.add('ready'); })
  .from('.site-header', { y: -40, opacity: 0, duration: REDUCED ? 0 : 0.8, ease: 'power3.out' }, '-=0.35')
  .from('.hero .eyebrow', { y: 20, opacity: 0, duration: REDUCED ? 0 : 0.7 }, '<')
  .fromTo('.hero h1 .word > span', { yPercent: 115 }, { yPercent: 0, duration: REDUCED ? 0 : 1.2, ease: 'expo.out', stagger: 0.09 }, '<0.1')
  .from('.hero-sub, .gates-label', { y: 24, opacity: 0, duration: REDUCED ? 0 : 0.9, stagger: 0.1 }, '-=0.8')
  .from('.gate', { y: 40, opacity: 0, duration: REDUCED ? 0 : 0.9, ease: 'power3.out', stagger: 0.1 }, '-=0.6')
  .from('.scroll-cue', { opacity: 0, duration: REDUCED ? 0 : 0.8 }, '-=0.3');

onScroll();
if (location.hash && document.getElementById(location.hash.slice(1))) setTimeout(() => scrollToEl(document.getElementById(location.hash.slice(1)), true), 50);
