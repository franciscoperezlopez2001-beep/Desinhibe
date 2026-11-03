/**
 * data.js — Catálogo de marcas y modelos.
 *
 * ⚠️ Datos ORIENTATIVOS recopilados de prensa del motor (2025-2026).
 * Cambian según mercado, año y fuente: verifica siempre con la web oficial de la marca antes de publicar.
 *
 * Campos de cada modelo:
 *   power  (CV/hp)  ·  zero100 (s)  ·  top (km/h)  ·  price: { from: USD } | { text: {es,en} }
 *   style  → silueta procedural ('ferrari' | 'lambo' | 'porsche')   ·   params → ajustes de la silueta (ver profile.js)
 */

export const BRANDS = {
  ferrari: {
    key: 'ferrari',
    name: 'Ferrari',
    star: 'sf90',
    caliper: '#ffcc00',
    colors: [
      { id: 'rosso', name: 'Rosso Corsa', hex: '#dc0000' },
      { id: 'giallo', name: 'Giallo Modena', hex: '#f6c900' },
      { id: 'blu', name: 'Blu Tour de France', hex: '#1f3f8f' },
      { id: 'bianco', name: 'Bianco Avus', hex: '#ececec' },
      { id: 'grigio', name: 'Grigio Titanio', hex: '#6e7176' },
    ],
  },
  lamborghini: {
    key: 'lamborghini',
    name: 'Lamborghini',
    star: 'revuelto',
    caliper: '#111111',
    colors: [
      { id: 'giallo', name: 'Giallo Orion', hex: '#ffd400' },
      { id: 'verde', name: 'Verde Mantis', hex: '#6fc400' },
      { id: 'arancio', name: 'Arancio Borealis', hex: '#ff6a00' },
      { id: 'bianco', name: 'Bianco Monocerus', hex: '#f2f2f2' },
      { id: 'blu', name: 'Blu Eleos', hex: '#1d4be0' },
    ],
  },
  porsche: {
    key: 'porsche',
    name: 'Porsche',
    star: '911turbos',
    caliper: '#e8e8e8',
    colors: [
      { id: 'blue', name: 'Gentian Blue', hex: '#0b53ff' },
      { id: 'miami', name: 'Miami Blue', hex: '#00a3e0' },
      { id: 'guards', name: 'Guards Red', hex: '#e00000' },
      { id: 'silver', name: 'GT Silver', hex: '#c5cad1' },
      { id: 'racing', name: 'Racing Yellow', hex: '#ffd000' },
    ],
  },
};

export const BRAND_KEYS = Object.keys(BRANDS);

export const MODELS = [
  // ───────────────────────── FERRARI ─────────────────────────
  {
    id: '296gtb', brand: 'ferrari', name: '296 GTB', style: 'ferrari', params: {},
    engine: { es: 'V6 híbrido enchufable', en: 'Plug-in hybrid V6' },
    tag: { es: 'El V6 más potente de su historia', en: 'The most powerful V6 in its history' },
    power: 830, zero100: 2.9, top: 330, price: { from: 320000 },
  },
  {
    id: 'sf90', brand: 'ferrari', name: 'SF90 Stradale', style: 'ferrari', params: { sx: 1.02, hy: 0.97 },
    engine: { es: 'V8 biturbo + 3 motores eléctricos', en: 'Twin-turbo V8 + 3 electric motors' },
    tag: { es: 'Mil caballos con tracción total híbrida', en: 'A thousand horsepower, hybrid all-wheel drive' },
    power: 1000, zero100: 2.5, top: 340, price: { from: 530000 },
  },
  {
    id: '12cilindri', brand: 'ferrari', name: '12Cilindri', style: 'ferrari', params: { sx: 1.1, hy: 0.98 },
    engine: { es: 'V12 atmosférico de 6,5 L', en: '6.5 L naturally aspirated V12' },
    tag: { es: 'El canto del V12, sin turbos', en: 'The V12 symphony, no turbos' },
    power: 830, zero100: 2.9, top: 340, price: { from: 464000 },
  },
  {
    id: 'purosangue', brand: 'ferrari', name: 'Purosangue', style: 'ferrari', params: { sx: 1.06, hy: 1.28, rs: 1.16, lift: 0.07 },
    engine: { es: 'V12 atmosférico de 6,5 L', en: '6.5 L naturally aspirated V12' },
    tag: { es: 'Cuatro puertas, cuatro plazas, ADN Ferrari', en: 'Four doors, four seats, Ferrari DNA' },
    power: 725, zero100: 3.3, top: 310, price: { from: 400000 },
  },

  // ───────────────────────── LAMBORGHINI ─────────────────────────
  {
    id: 'revuelto', brand: 'lamborghini', name: 'Revuelto', style: 'lambo', params: { sx: 1.02 },
    engine: { es: 'V12 híbrido enchufable', en: 'Plug-in hybrid V12' },
    tag: { es: 'El primer HPEV V12 de Sant’Agata', en: 'Sant’Agata’s first V12 plug-in hybrid' },
    power: 1001, zero100: 2.5, top: 350, price: { from: 612000 },
  },
  {
    id: 'temerario', brand: 'lamborghini', name: 'Temerario', style: 'lambo', params: { hy: 0.96 },
    engine: { es: 'V8 biturbo híbrido', en: 'Hybrid twin-turbo V8' },
    tag: { es: 'Sucesor del Huracán, hasta 10.000 rpm', en: 'Huracán’s successor, revving to 10,000 rpm' },
    power: 920, zero100: 2.7, top: 340, price: { from: 361000 },
  },
  {
    id: 'urusse', brand: 'lamborghini', name: 'Urus SE', style: 'lambo', params: { sx: 1.05, hy: 1.3, rs: 1.2, lift: 0.09, wing: false },
    engine: { es: 'V8 biturbo híbrido enchufable', en: 'Plug-in hybrid twin-turbo V8' },
    tag: { es: 'El Super SUV, ahora electrificado', en: 'The Super SUV, now electrified' },
    power: 800, zero100: 3.4, top: 312, price: { from: 262000 },
  },
  {
    id: 'huracan', brand: 'lamborghini', name: 'Huracán', style: 'lambo', params: { hy: 0.94, sx: 0.98 }, legacy: true,
    engine: { es: 'V10 atmosférico de 5,2 L', en: '5.2 L naturally aspirated V10' },
    tag: { es: 'Edición final: el último V10 atmosférico', en: 'Final edition: the last naturally aspirated V10' },
    power: 631, zero100: 3.2, top: 325, price: { text: { es: 'Modelo de colección', en: 'Collector model' } },
  },

  // ───────────────────────── PORSCHE ─────────────────────────
  {
    id: '911turbos', brand: 'porsche', name: '911 Turbo S', style: 'porsche', params: {},
    engine: { es: 'Bóxer 3.6 T-Hybrid', en: '3.6 T-Hybrid flat-six' },
    tag: { es: 'El 911 más rápido de calle', en: 'The quickest road-going 911' },
    power: 711, zero100: 2.5, top: 322, price: { text: { es: 'Consultar concesionario', en: 'Ask your dealer' } },
  },
  {
    id: 'taycangt', brand: 'porsche', name: 'Taycan Turbo GT', style: 'porsche', params: { sx: 1.06, hy: 1.04, wing: false },
    engine: { es: 'Eléctrico · 777 hp (hasta 1.092 hp Weissach)', en: 'Electric · 777 hp (up to 1,092 hp Weissach)' },
    tag: { es: 'El Porsche eléctrico más radical', en: 'The most radical electric Porsche' },
    power: 777, zero100: 2.3, top: 305, price: { text: { es: 'Consultar concesionario', en: 'Ask your dealer' } },
  },
  {
    id: '918', brand: 'porsche', name: '918 Spyder', style: 'porsche', params: { hy: 0.9, wing: true }, legacy: true,
    engine: { es: 'V8 híbrido enchufable', en: 'Plug-in hybrid V8' },
    tag: { es: 'Hiperdeportivo híbrido de culto (2013-2015)', en: 'Cult hybrid hypercar (2013-2015)' },
    power: 887, zero100: 2.6, top: 345, price: { text: { es: 'Pieza de colección', en: 'Collector’s piece' } },
  },
];

export const byId = (id) => MODELS.find((m) => m.id === id);
export const byBrand = (b) => MODELS.filter((m) => m.brand === b);
