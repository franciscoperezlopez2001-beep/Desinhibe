# APEX — Italian & German Icons

Showroom 3D de **Ferrari** (rojo), **Lamborghini** (amarillo) y **Porsche** (azul): Three.js + GSAP/ScrollTrigger + Lenis, bilingüe ES/EN, accesible y responsive.

## ▶️ Uso local (sin instalar nada)

**Abre `apex.html` con doble clic.** Es un único archivo con todo incrustado (CSS, JS, Three.js, GSAP, Lenis); funciona sin servidor y sin conexión
(las tipografías de Google Fonts se cargan si hay internet; si no, se usan fuentes del sistema).

Modos de prueba por URL: `apex.html?lite` (fallback estático sin WebGL) · `apex.html?force3d` (fuerza 3D).

## Desarrollo

```bash
npm install
npm run build     # regenera apex.html a partir de index.html + css/ + js/
npm run serve     # opcional: servidor local en http://localhost:8080 (usa index.html con módulos ES)
```

```
index.html        estructura y textos (ES, SEO)        css/styles.css   tema por marca (variables --c, --c2, --bg)
js/data.js        marcas, colores y modelos             js/i18n.js       diccionario ES / EN
js/scene.js       escena Three.js (slots, cámara, humo, partículas)
js/profile.js     siluetas procedurales (3D + SVG)      js/models.js     rutas .glb opcionales
js/brands.js      secciones de marca, fichas, colores   js/extras.js     comparador, galería, contacto
js/main.js        arranque, scroll, transiciones, menú  js/audio.js      motor sintetizado (Web Audio)
tools/build.mjs  empaquetado a un solo HTML
```

## Cómo cambiar cosas

- **Textos:** `js/i18n.js` (cada clave tiene ES y EN). Los textos ES por defecto también están en `index.html` para SEO.
- **Colores de marca:** variables CSS al inicio de `css/styles.css` y colores de carrocería en `js/data.js`.
- **Modelos / cifras:** `js/data.js` (potencia, 0-100, vel. máx., precio). **Son datos orientativos: verifícalos con las webs oficiales.**
- **Modelos 3D reales:** pon el `.glb` (comprimido con Draco) en `models/` y regístralo en `js/models.js`
  (`MODEL_URL['sf90'] = 'models/sf90.glb'`). Frente del coche hacia +X; los materiales llamados `body`/`paint`/`carpaint` cambian con el selector de color.
  Para cargar `.glb` hay que servir la web por HTTP (`npm run serve`), no con doble clic.
- **Dominio real:** sustituye `https://apex-showroom.example/` en `index.html`, `sitemap.xml` y `robots.txt`.

## Recursos externos recomendados (legales)

| Recurso | Dónde | Notas |
|---|---|---|
| Modelos 3D de coches | [Sketchfab](https://sketchfab.com/features/free-3d-models) (filtra por licencia CC), [Poly Pizza](https://poly.pizza/) | Revisa atribución. Para uso comercial con marca real, licencia propia/oficial. |
| HDRI de estudio | [Poly Haven](https://polyhaven.com/hdris) (CC0) | Hoy se usa un estudio procedural (`RoomEnvironment`). |
| Compresión Draco | [gltf-transform](https://gltf-transform.dev/) | `gltf-transform draco in.glb out.glb` |
| Tipografías | [Google Fonts](https://fonts.google.com/): Playfair Display, Oswald, Barlow, Inter | OFL. |

## Aviso legal

Ferrari, Lamborghini y Porsche son marcas registradas de sus propietarios. Este es un proyecto de demostración **sin vinculación oficial**.
Las siluetas y los coches 3D incluidos son representaciones genéricas generadas por código (placeholders). Para un sitio comercial se necesita licencia de marca.

## Fase 2 (ideas)

Configurador completo (llantas, interiores, extras) · backend de reservas con CRM/email · CMS headless (Sanity/Strapi) · modelos fotogramétricos con PBR · analítica y consentimiento de cookies real · tests E2E.

## Calidad

Accesibilidad: contraste AA en textos, foco visible, navegación por teclado (visor 3D con ← →, carrusel, radios de color), `aria-*`, enlace “Saltar al contenido”, `prefers-reduced-motion` respetado.
Rendimiento: un único canvas, sombras “blob” en lugar de shadow-maps, DPR limitado, render en pausa fuera de las secciones 3D y fallback estático en móviles de gama baja o sin WebGL.
