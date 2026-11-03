/**
 * scene.js — Showroom 3D (Three.js).
 * Un único canvas fijo con tres "slots" (uno por marca). Cada slot contiene el coche activo de esa marca.
 * La cámara y la posición de los slots cambian según la sección (hero = alineados, marca = coche protagonista).
 */
import * as THREE from 'three';
import { GLTFLoader } from './vendor/GLTFLoader.js';
import { DRACOLoader } from './vendor/DRACOLoader.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';
import { getCar } from './profile.js';
import { BRANDS, BRAND_KEYS } from './data.js';
import { MODEL_URL, DRACO_PATH } from './models.js';

const gsap = window.gsap;
const { damp, clamp } = THREE.MathUtils;

const HERO_X = [-5.9, 0, 5.9];
const HERO_Z = [-0.6, 1.0, -0.6];
const HERO_YAW = [-0.75, -0.55, -0.35];
const BRAND_COL = { ferrari: '#ff2a1f', lamborghini: '#ffd400', porsche: '#00a8ff' };
const BG = { hero: '#07070a', ferrari: '#0a0a0a', lamborghini: '#0b0b0b', porsche: '#05070d' };

/** color hex → vec3 sRGB "crudo" (los ShaderMaterial propios no pasan por gestión de color). */
const rgb = (hex) => { const c = parseInt(hex.slice(1), 16); return new THREE.Vector3(((c >> 16) & 255) / 255, ((c >> 8) & 255) / 255, (c & 255) / 255); };

function radialTexture(stops) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  stops.forEach(([o, col]) => gr.addColorStop(o, col));
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function disposeObject(obj) {
  obj.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
  });
}

/* ───────────────────────── Coche procedural ───────────────────────── */
function extrude(pts, width, bevel = 0.07, taper = true) {
  const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  const depth = Math.max(0.01, width - bevel * 2);
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.45, bevelSegments: 3, curveSegments: 1 });
  geo.translate(0, 0, -depth / 2);
  if (taper) {
    // estrecha morro/cola y la parte alta → aspecto más aerodinámico que una losa
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      const k = Math.min(1, Math.abs(x) / 2.3);
      p.setZ(i, p.getZ(i) * (1 - 0.24 * k * k * k) * (1 - 0.1 * Math.max(0, y - 0.45)));
    }
    geo.computeVertexNormals();
  }
  return geo;
}

function buildProcedural(model, bodyColor) {
  const car = getCar(model.style, model.params);
  const g = new THREE.Group();
  const mats = {
    body: new THREE.MeshPhysicalMaterial({ color: bodyColor, metalness: 0.55, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.06 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#06090e', metalness: 0.2, roughness: 0.04, clearcoat: 1 }),
    trim: new THREE.MeshStandardMaterial({ color: '#0b0b0d', roughness: 0.55, metalness: 0.3 }),
    tire: new THREE.MeshStandardMaterial({ color: '#0a0a0a', roughness: 0.9 }),
    rim: new THREE.MeshStandardMaterial({ color: '#b9bcc2', roughness: 0.25, metalness: 1 }),
    caliper: new THREE.MeshStandardMaterial({ color: BRANDS[model.brand].caliper, roughness: 0.4, metalness: 0.3 }),
    head: new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#dff1ff', emissiveIntensity: 0.4 }),
    tail: new THREE.MeshStandardMaterial({ color: '#330000', emissive: '#ff1010', emissiveIntensity: 0.8 }),
  };
  const W = 1.9;
  const add = (geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); g.add(m); return m; };

  add(extrude(car.outline, W), mats.body);
  add(extrude(car.cabin, W * 0.74, 0.05), mats.glass);
  add(extrude(car.roof, W * 0.66, 0.05), mats.body, 0, 0.002, 0);

  // Faros y pilotos
  const front = car.outline.reduce((a, p) => (p[0] > a[0] ? p : a), [-9, 0]);
  const rear = car.outline.reduce((a, p) => (p[0] < a[0] ? p : a), [9, 0]);
  [-1, 1].forEach((s) => add(new THREE.BoxGeometry(0.34, 0.06, 0.34), mats.head, front[0] - 0.22, front[1] + 0.07 + (car.sill - 0.14) * 0.3, s * 0.58));
  add(new THREE.BoxGeometry(0.05, 0.06, W * 0.7), mats.tail, rear[0] + 0.04, rear[1] + 0.18, 0);
  // Splitter, difusor y entradas laterales
  add(new THREE.BoxGeometry(0.5, 0.04, W * 0.9), mats.trim, front[0] - 0.15, car.sill + 0.02, 0);
  add(new THREE.BoxGeometry(0.6, 0.06, W * 0.7), mats.trim, rear[0] + 0.3, car.sill + 0.04, 0);
  [-1, 1].forEach((s) => add(new THREE.BoxGeometry(0.5, 0.1, 0.05), mats.trim, -0.6, car.sill + 0.34, s * (W / 2 - 0.02)));

  // Alerón
  if (car.wing) {
    const w = car.wing;
    add(new THREE.BoxGeometry(w.c, 0.05, w.w), mats.body, w.x, w.y, 0);
    [-1, 1].forEach((s) => add(new THREE.BoxGeometry(0.05, w.y - 0.7, 0.05), mats.trim, w.x, (w.y + 0.7) / 2, s * w.w * 0.3));
  }

  // Ruedas
  car.wheels.forEach((wh) => {
    [-1, 1].forEach((s) => {
      const grp = new THREE.Group();
      grp.position.set(wh.x, wh.r, s * 0.8);
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(wh.r, wh.r, 0.34, 28), mats.tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(wh.r * 0.66, wh.r * 0.66, 0.36, 24), mats.rim);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(wh.r * 0.16, wh.r * 0.16, 0.4, 12), mats.trim);
      const cal = new THREE.Mesh(new THREE.BoxGeometry(wh.r * 0.55, wh.r * 0.35, 0.1), mats.caliper);
      cal.position.set(wh.r * 0.2, wh.r * 0.2, s * 0.12);
      for (let i = 0; i < 5; i++) {
        const sp = new THREE.Mesh(new THREE.BoxGeometry(wh.r * 0.55, 0.05, 0.37), mats.trim);
        sp.rotation.z = (i / 5) * Math.PI * 2;
        sp.position.set(Math.cos(sp.rotation.z) * wh.r * 0.3, Math.sin(sp.rotation.z) * wh.r * 0.3, 0);
        grp.add(sp);
      }
      [tire, rim, hub].forEach((m) => { m.rotation.x = Math.PI / 2; grp.add(m); });
      grp.add(cal);
      g.add(grp);
    });
    // Pozo de rueda oscuro (evita ver "a través" del coche)
    const well = new THREE.Mesh(new THREE.CylinderGeometry(wh.r + 0.05, wh.r + 0.05, 1.5, 24), mats.trim);
    well.rotation.x = Math.PI / 2;
    well.position.set(wh.x, wh.r, 0);
    g.add(well);
  });

  return {
    group: g,
    bodyMats: [mats.body],
    lights: [mats.head],
    tails: [mats.tail],
    dispose: () => { disposeObject(g); },
  };
}

/* ───────────────────────── Showroom ───────────────────────── */
export class Showroom {
  constructor(canvas, { reduced = false, mobile = false } = {}) {
    this.canvas = canvas;
    this.reduced = reduced;
    this.mobile = mobile;
    this.mode = 'hero';
    this.running = true;
    this.heroP = 0;
    this.hover = null;
    this.ptr = { x: 0, y: 0, sx: 0, sy: 0 };
    this.time = 0;
    this.userYaw = 0; this.yawVel = 0; this.elev = 0; this.idle = 0; this.dragging = false;
    this.cp = new THREE.Vector3(0, 1.6, 16.5);
    this.cl = new THREE.Vector3(0, 0.5, 0);
    this.loaders = null;

    const r = (this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' }));
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75));
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;

    this.scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(r);
    this.scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.85;
    pm.dispose();

    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 140);
    this._initBackground();
    this._initSlots();
    this._initParticles();

    this.cursorLight = new THREE.PointLight('#ffffff', 0, 16, 2);
    this.scene.add(this.cursorLight);

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('pointermove', (e) => { this.ptr.x = (e.clientX / innerWidth) * 2 - 1; this.ptr.y = -((e.clientY / innerHeight) * 2 - 1); }, { passive: true });
    document.addEventListener('visibilitychange', () => { this.hidden = document.hidden; });
  }

  /* — fondo: humo/estela con shader ligero — */
  _initBackground() {
    this.bgU = {
      uTime: { value: 0 }, uAspect: { value: 1 }, uBase: { value: rgb(BG.hero) }, uTint: { value: rgb('#888888') },
      uGlow: { value: new THREE.Vector2(0.5, 0.45) }, uShift: { value: 0 }, uAmt: { value: this.mobile ? 0.7 : 1 },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.bgU, depthTest: false, depthWrite: false,
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.9999,1.0); }',
      fragmentShader: `
        varying vec2 vUv; uniform float uTime,uAspect,uShift,uAmt; uniform vec3 uBase,uTint; uniform vec2 uGlow;
        float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
        float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.02+vec2(3.1,1.7);a*=.5;}return v;}
        void main(){
          vec2 p=(vUv-.5)*vec2(uAspect,1.);
          float t=uTime*.05;
          vec2 q=vec2(p.x*1.1-t*2.2+uShift, p.y*3.4);
          float s=fbm(q*1.4+vec2(fbm(q+t),0.));
          float low=smoothstep(.2,-.55,p.y);
          vec3 col=uBase+uTint*(s*s*1.5*(.25+low*.9))*uAmt*.55;
          float g=exp(-length((vUv-uGlow)*vec2(uAspect,1.6))*2.6);
          col+=uTint*g*.42;
          col*=1.-dot(p,p)*.5;
          gl_FragColor=vec4(col,1.);
        }`,
    });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    m.frustumCulled = false; m.renderOrder = -10;
    this.scene.add(m);
    this.bgTint = new THREE.Vector3(0.5, 0.5, 0.5);
    this.bgBase = rgb(BG.hero);
  }

  /* — 3 slots (uno por marca) — */
  _initSlots() {
    this.slots = {};
    const shadowTex = radialTexture([[0, 'rgba(0,0,0,.85)'], [0.55, 'rgba(0,0,0,.35)'], [1, 'rgba(0,0,0,0)']]);
    const glowTex = radialTexture([[0, 'rgba(255,255,255,1)'], [0.4, 'rgba(255,255,255,.35)'], [1, 'rgba(255,255,255,0)']]);
    BRAND_KEYS.forEach((k, i) => {
      const root = new THREE.Group();
      this.scene.add(root);
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(7.4, 3.6), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.9 }));
      shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.01; root.add(shadow);
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(11, 6), new THREE.MeshBasicMaterial({ map: glowTex, color: BRAND_COL[k], transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.2 }));
      glow.rotation.x = -Math.PI / 2; glow.position.y = 0.02; root.add(glow);
      const light = new THREE.PointLight(BRAND_COL[k], 0, 14, 2);
      light.position.set(1.5, 3.4, 2.4);
      root.add(light);
      const spot = new THREE.PointLight('#ffffff', 0, 12, 2);
      spot.position.set(-2.5, 2.6, -2.5);
      root.add(spot);
      root.position.set(HERO_X[i], 0, HERO_Z[i]);
      this.slots[k] = { key: k, idx: i, root, shadow, glow, light, spot, car: null, lit: 0.5, token: 0, color: BRANDS[k].colors[0].hex, yaw: HERO_YAW[i], x: HERO_X[i], z: HERO_Z[i] };
    });
  }

  /* — partículas por marca: chispas (Ferrari), líneas (Lamborghini), destellos (Porsche) — */
  _initParticles() {
    const N = this.mobile ? 160 : 420;
    const pos = new Float32Array(N * 3), seed = new Float32Array(N * 3), brand = new Float32Array(N), size = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      pos.set([(Math.random() - 0.5) * 26, Math.random() * 6 - 0.5, (Math.random() - 0.5) * 12 - 1], i * 3);
      seed.set([Math.random(), Math.random(), Math.random()], i * 3);
      brand[i] = i % 3;
      size[i] = 0.6 + Math.random() * 1.4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 3));
    geo.setAttribute('aBrand', new THREE.BufferAttribute(brand, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    this.pU = {
      uTime: { value: 0 }, uPR: { value: this.renderer.getPixelRatio() }, uW: { value: new THREE.Vector3(0.8, 0.8, 0.8) },
      uC0: { value: rgb('#ff4a2a') }, uC1: { value: rgb('#ffd400') }, uC2: { value: rgb('#38c8ff') },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.pU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute vec3 aSeed; attribute float aBrand; attribute float aSize;
        uniform float uTime,uPR; uniform vec3 uW,uC0,uC1,uC2;
        varying vec3 vC; varying float vA; varying float vB;
        void main(){
          vec3 p=position; float t=uTime*(.25+aSeed.z*.7);
          float w=uW.x; vC=uC0; vB=0.;
          if(aBrand>.5&&aBrand<1.5){ w=uW.y; vC=uC1; vB=1.;
            p.x=mod(p.x+14.+t*7.,28.)-14.; p.y=mod(p.y+.5,5.5)-.2; vA=.55; }
          else if(aBrand>1.5){ w=uW.z; vC=uC2; vB=2.;
            p.y+=sin(t*1.3+aSeed.x*6.28)*.5; p.x+=cos(t+aSeed.y*6.28)*.5;
            vA=.35+.65*abs(sin(t*2.+aSeed.x*20.)); }
          else { p.y=mod(p.y+t*1.6+.5,6.)-.5; p.x+=sin(t*3.+aSeed.x*6.28)*.25; vA=.9*(1.-p.y/6.); }
          vA*=w;
          vec4 mv=modelViewMatrix*vec4(p,1.);
          gl_Position=projectionMatrix*mv;
          gl_PointSize=aSize*uPR*(vB>.5&&vB<1.5?46.:30.)/-mv.z;
        }`,
      fragmentShader: `
        varying vec3 vC; varying float vA; varying float vB;
        void main(){
          vec2 c=gl_PointCoord-.5; float d;
          if(vB>.5&&vB<1.5){ d=length(vec2(c.x*.28,c.y*3.2)); } else d=length(c)*2.;
          float a=smoothstep(1.,0.,d); a*=a;
          if(a<.01) discard;
          gl_FragColor=vec4(vC,a*vA);
        }`,
    });
    this.particles = new THREE.Points(geo, mat);
    this.particles.frustumCulled = false;
    this.scene.add(this.particles);
  }

  /* — carga del coche (GLB opcional → procedural) — */
  async _make(model, color) {
    const url = MODEL_URL[model.id];
    if (url) {
      try {
        if (!this.loaders) {
          const draco = new DRACOLoader().setDecoderPath(DRACO_PATH);
          this.loaders = new GLTFLoader().setDRACOLoader(draco);
        }
        const gltf = await this.loaders.loadAsync(url);
        const root = gltf.scene;
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const s = 4.5 / (size.x || 1);
        root.scale.setScalar(s);
        box.setFromObject(root);
        root.position.set(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2);
        const g = new THREE.Group(); g.add(root);
        const bodyMats = [];
        root.traverse((o) => { if (o.material && /body|paint|carpaint/i.test(o.material.name)) bodyMats.push(o.material); });
        bodyMats.forEach((m) => m.color.set(color));
        return { group: g, bodyMats, lights: [], tails: [], dispose: () => disposeObject(g) };
      } catch (e) {
        console.warn('[APEX] No se pudo cargar', url, '→ uso el modelo procedural.', e);
      }
    }
    return buildProcedural(model, color);
  }

  async setModel(brand, model, { instant = false } = {}) {
    const slot = this.slots[brand];
    const token = ++slot.token;
    const car = await this._make(model, slot.color);
    if (token !== slot.token) { car.dispose(); return; }
    const old = slot.car;
    slot.car = car;
    slot.root.add(car.group);
    if (!old || instant || this.reduced) {
      if (old) { slot.root.remove(old.group); old.dispose(); }
      return;
    }
    car.group.position.x = 8; car.group.scale.setScalar(0.75);
    gsap.to(car.group.position, { x: 0, duration: 1.0, ease: 'power3.out' });
    gsap.to(car.group.scale, { x: 1, y: 1, z: 1, duration: 1.0, ease: 'power3.out' });
    gsap.to(old.group.position, { x: -8, duration: 0.7, ease: 'power2.in', onComplete: () => { slot.root.remove(old.group); old.dispose(); } });
    gsap.to(old.group.scale, { x: 0.7, y: 0.7, z: 0.7, duration: 0.7, ease: 'power2.in' });
  }

  setColor(brand, hex) {
    const slot = this.slots[brand];
    slot.color = hex;
    const c = new THREE.Color(hex);
    (slot.car?.bodyMats || []).forEach((m) => {
      if (this.reduced) m.color.copy(c);
      else gsap.to(m.color, { r: c.r, g: c.g, b: c.b, duration: 0.6, ease: 'power2.out', overwrite: true });
    });
  }

  /* — API de control — */
  setMode(mode) {
    if (this.mode === mode) return;
    this.mode = mode;
    this.userYaw = 0; this.yawVel = 0; this.elev = 0; this.idle = 0;
    const key = mode === 'hero' ? null : mode;
    // Pesos de partículas
    const w = key ? BRAND_KEYS.map((k) => (k === key ? 1 : 0)) : [0.8, 0.8, 0.8];
    if (this.reduced) this.pU.uW.value.set(...w);
    else gsap.to(this.pU.uW.value, { x: w[0], y: w[1], z: w[2], duration: 0.8 });
    // Colores del fondo
    this._tintTarget = key ? rgb(BRAND_COL[key]).multiplyScalar(0.8) : new THREE.Vector3(0.35, 0.35, 0.4);
    this._baseTarget = rgb(BG[key || 'hero']);
  }
  setHover(brand) { this.hover = brand; }
  setHeroProgress(p) { this.heroP = clamp(p, 0, 1); }
  setRunning(v) { this.running = v; }
  drag(dx, dy) {
    this.dragging = true; this.idle = 0;
    this.userYaw += dx * 0.009; this.yawVel = dx * 0.009 * 60;
    this.elev = clamp(this.elev - dy * 0.004, -0.1, 0.4);
  }
  dragEnd() { this.dragging = false; }
  rotate(delta) { this.userYaw += delta; this.idle = 0; }

  resize() {
    const w = innerWidth, h = innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.bgU.uAspect.value = w / h;
  }

  /* — bucle — */
  tick(dt) {
    if (!this.running || this.hidden) return;
    dt = Math.min(dt, 0.05);
    this.time += this.reduced ? 0 : dt;
    const { mode, ptr, camera } = this;
    const asp = camera.aspect;
    const key = mode === 'hero' ? null : mode;
    const activeIdx = key ? BRAND_KEYS.indexOf(key) : -1;
    ptr.sx = damp(ptr.sx, ptr.x, 4, dt); ptr.sy = damp(ptr.sy, ptr.y, 4, dt);

    // interacción: inercia + auto-rotación
    this.idle += dt;
    if (!this.dragging) {
      this.userYaw += this.yawVel * dt;
      this.yawVel = damp(this.yawVel, 0, 3, dt);
      if (key && this.idle > 2.5 && !this.reduced) this.userYaw += dt * 0.22;
    }

    // slots
    BRAND_KEYS.forEach((k, i) => {
      const s = this.slots[k];
      let tx, tz, tyaw, lit;
      if (!key) {
        tx = HERO_X[i]; tz = HERO_Z[i];
        tyaw = HERO_YAW[i] + ptr.sx * 0.28 + (this.reduced ? 0 : Math.sin(this.time * 0.5 + i) * 0.06);
        lit = this.hover ? (this.hover === k ? 1 : 0.1) : 0.5;
      } else {
        const d = i - activeIdx;
        tx = d === 0 ? 0 : d * 18; tz = d === 0 ? 0 : -6;
        tyaw = d === 0 ? -0.5 + this.userYaw + ptr.sx * 0.12 : HERO_YAW[i];
        lit = d === 0 ? 1 : 0;
      }
      s.x = damp(s.x, tx, 3.2, dt); s.z = damp(s.z, tz, 3.2, dt);
      s.yaw = key && i === activeIdx ? tyaw : damp(s.yaw, tyaw, 3.2, dt);
      s.lit = damp(s.lit, lit, 4, dt);
      s.root.position.set(s.x, 0, s.z);
      s.root.rotation.y = s.yaw + (s.x - tx) * 0.04;
      s.root.visible = Math.abs(s.x) < 22;
      s.light.intensity = 4 + 70 * s.lit;
      s.spot.intensity = 3 + 18 * s.lit;
      s.glow.material.opacity = 0.08 + 0.55 * s.lit;
      if (s.car) {
        s.car.lights.forEach((m) => (m.emissiveIntensity = 0.4 + 3.2 * s.lit));
        s.car.tails.forEach((m) => (m.emissiveIntensity = 0.5 + 1.8 * s.lit));
        s.car.bodyMats.forEach((m) => (m.envMapIntensity = 0.45 + 0.85 * s.lit));
      }
    });

    // cámara
    let pos, look;
    if (!key) {
      const p = this.heroP;
      if (asp >= 1.05) {
        const hx = this.hover ? HERO_X[BRAND_KEYS.indexOf(this.hover)] * 0.3 : 0;
        look = new THREE.Vector3(hx, 2.0 + p * 0.4, 0);
        pos = new THREE.Vector3(hx + ptr.sx * 1.2, 1.5 + p * 2.4 + ptr.sy * 0.4, 16.5 - p * 5.5);
      } else {
        const px = Math.sin(this.time * 0.22) * 5.9;
        look = new THREE.Vector3(px, 0.9, 0);
        pos = new THREE.Vector3(px + ptr.sx, 1.6 + p * 1.5, 15.5 - p * 2);
      }
    } else {
      const k = clamp((asp - 0.9) / 0.5, 0, 1);
      const dist = Math.max(12.6 - 1.2 * k, 3.1 / (0.2867 * asp));
      look = new THREE.Vector3(-2.1 * k, 0.55 - (1 - k) * 0.4 * dist * 0.2867, 0);
      const el = clamp(0.13 + this.elev, 0.02, 0.55);
      pos = new THREE.Vector3(look.x + ptr.sx * 0.35, look.y + dist * Math.sin(el), dist * Math.cos(el));
    }
    this.cp.x = damp(this.cp.x, pos.x, 3, dt); this.cp.y = damp(this.cp.y, pos.y, 3, dt); this.cp.z = damp(this.cp.z, pos.z, 3, dt);
    this.cl.x = damp(this.cl.x, look.x, 3, dt); this.cl.y = damp(this.cl.y, look.y, 3, dt); this.cl.z = damp(this.cl.z, look.z, 3, dt);
    camera.position.copy(this.cp);
    camera.lookAt(this.cl);

    // luz que sigue al cursor
    const tgtX = (key ? 0 : this.cl.x) + ptr.sx * 6;
    this.cursorLight.position.set(tgtX, 2.2 + ptr.sy * 2, 4);
    this.cursorLight.color.set(key ? BRAND_COL[key] : '#ffffff');
    this.cursorLight.intensity = this.reduced ? 10 : 24;

    // fondo
    this._tintTarget && this.bgTint.lerp(this._tintTarget, 1 - Math.exp(-3 * dt));
    this._baseTarget && this.bgBase.lerp(this._baseTarget, 1 - Math.exp(-3 * dt));
    this.bgU.uTint.value.copy(this.bgTint);
    this.bgU.uBase.value.copy(this.bgBase);
    this.bgU.uTime.value = this.time;
    this.pU.uTime.value = this.time;
    const focus = (key ? this.slots[key] : this.slots[this.hover || 'lamborghini']).root.position.clone();
    focus.y = 0.6;
    focus.project(camera);
    this.bgU.uGlow.value.set(focus.x * 0.5 + 0.5, focus.y * 0.5 + 0.5);

    this.renderer.render(this.scene, camera);
  }
}
