# PROMPT PROFESIONAL — Web de "Casa Francisco"

> Copia todo lo que hay debajo de la línea y pégalo en tu herramienta de desarrollo (Claude, v0, Lovable, Bolt, Cursor…). Adjunta también las 5 fotografías del restaurante.

---

## 1. ROL Y OBJETIVO

Actúa como un estudio web premium formado por un director creativo, un diseñador UI/UX senior, un desarrollador frontend experto en Next.js y un especialista en SEO local para hostelería.

Vas a diseñar y desarrollar la web oficial de **Casa Francisco**, un restaurante elegante de cocina española de autor con brasa. El resultado debe tener el nivel de una web de agencia valorada en unos 1.000 €: diseño a medida, nada de plantilla genérica, fotografía protagonista, tipografía editorial, animaciones sutiles y una reserva de mesa que funcione de verdad.

**Objetivo de negocio:** que el visitante reserve mesa (conversión principal), llame por teléfono o reserve un evento privado en La Bodega (conversiones secundarias).

---

## 2. EL NEGOCIO

- **Nombre:** Casa Francisco
- **Lema propuesto:** *"Fuego, bodega y tiempo."*
- **Concepto:** casa de comidas elegante donde la brasa de encina, el producto de temporada y una bodega bajo bóveda de ladrillo se encuentran. Lujo cálido, no frío: sobremesa, luz de vela y servicio cercano.
- **Público:** parejas en celebraciones, comidas de empresa, grupos de amigos de 30 a 65 años, turismo gastronómico.
- **Ticket medio orientativo:** 55–75 € por persona a la carta, 85 € menú degustación.
- **Espacios (según las fotografías aportadas):**
  1. **El Salón** — banquetas de piel, mesas de madera noble, lámparas esféricas de latón calado que proyectan sombras sobre el techo y paredes con mosaico de madera.
  2. **La Bodega** — sala bajo bóveda de ladrillo visto con lámpara de araña de cristal, velas y lamparitas de mesa. Ideal para cenas íntimas y eventos privados.

**Datos que NO debes inventar** (usa marcadores visibles `[PENDIENTE: …]` para que el cliente los rellene): dirección, ciudad, teléfono, email, horario, nombre del chef, redes sociales, coordenadas del mapa, reseñas, premios o guías, años de historia, número de cubiertos y textos legales.

---

## 3. DIRECCIÓN CREATIVA

**Estilo:** editorial cálido, entre lujo discreto y casa de toda la vida. Mucho aire, fotografía grande, detalles finos de latón. Inspiración en webs de restaurantes premiados de Awwwards, sin copiar ninguna.

**Paleta (sacada de las fotos):**

| Uso | Color | Hex |
|---|---|---|
| Fondo principal oscuro | Ébano tostado | `#14100D` |
| Fondo secundario | Nogal | `#241A14` |
| Fondo claro (secciones de respiro) | Lino | `#F3EDE4` |
| Acento principal | Latón | `#C29A5B` |
| Acento hover | Latón claro | `#D9B77E` |
| Acento de vino | Burdeos | `#6B1E24` |
| Texto sobre oscuro | Marfil | `#EDE6DA` |
| Texto secundario | Arena | `#A89B8A` |

Comprueba que todos los textos cumplen contraste WCAG AA.

**Tipografías (Google Fonts, con `next/font`):**
- Titulares: **Cormorant Garamond** (500/600, cursiva para acentos).
- Texto e interfaz: **Inter** o **Manrope** (400/500).
- Etiquetas pequeñas en versalitas con espaciado amplio (`letter-spacing: 0.2em`).

**Elementos de identidad:**
- Monograma "CF" en línea fina de latón (SVG) para el logotipo, favicon y separadores.
- Líneas finas de 1 px en latón como separadores, nunca sombras pesadas.
- Textura sutil de grano sobre los fondos oscuros (opacidad 3–4 %).
- Iconos de línea (Lucide o Phosphor). **Prohibido usar emojis.**
- Esquinas rectas o radio mínimo (2–4 px). Nada de glassmorphism ni degradados chillones.

**Movimiento:**
- Entrada del hero con fundido lento y un zoom muy leve sobre la foto (efecto Ken Burns).
- Revelado de textos y fotos al hacer scroll (Framer Motion), con desplazamientos cortos.
- Subrayado animado en latón al pasar el ratón por enlaces.
- Respeta `prefers-reduced-motion`: desactiva todas las animaciones si el usuario lo pide.

---

## 4. ARQUITECTURA DE LA WEB

Páginas (con URLs descriptivas):

```
/                 Inicio
/carta            Carta completa
/menu-degustacion Menú degustación "Fuego Lento"
/bodega           Vinos y espacio La Bodega
/eventos          Eventos privados y grupos
/reservas         Reserva de mesa
/contacto         Ubicación, horario y contacto
/aviso-legal, /privacidad, /cookies  (plantillas marcadas como PENDIENTE de revisión legal)
```

**Header:** fijo y transparente sobre el hero; al hacer scroll pasa a fondo ébano. Logotipo a la izquierda, menú centrado (Carta · Degustación · Bodega · Eventos · Contacto), botón **"Reservar mesa"** en latón a la derecha. En móvil: menú hamburguesa a pantalla completa con animación, enlaces grandes y botón de reserva y de llamada.

**Barra fija en móvil:** abajo, dos botones: "Llamar" y "Reservar".

### Página de inicio (por orden)

1. **Hero a pantalla completa** con la foto del salón de lámparas de latón. Etiqueta pequeña "Cocina de brasa y bodega · [CIUDAD]". Titular: *"Fuego, bodega y tiempo."* Subtítulo: "Producto de temporada, brasa de encina y una bodega bajo bóveda para celebrar sin prisa." Botones "Reservar mesa" (principal) y "Ver la carta" (secundario). Indicador de scroll.
2. **Manifiesto** — dos columnas: texto corto sobre la filosofía de la casa y foto vertical del plato de solomillo con salsa de vino.
3. **Tres pilares** — La Brasa · La Temporada · La Bodega, cada uno con icono de línea, título y dos líneas de texto.
4. **Platos de la casa** — carrusel o rejilla editorial asimétrica con 4–6 platos destacados (foto, nombre, descripción breve y precio). Enlace a la carta completa.
5. **Menú degustación** — bloque oscuro a todo el ancho con el nombre "Fuego Lento", precio, número de pases y botón para reservar.
6. **La Bodega** — foto a todo el ancho de la sala abovedada con efecto parallax suave, texto sobre cenas privadas y botón "Reservar La Bodega".
7. **Galería** — rejilla tipo masonry con las 5 fotos y lightbox accesible (teclado, Escape para cerrar, flechas).
8. **Opiniones** — deja el bloque preparado pero **vacío con un aviso `[PENDIENTE: reseñas reales de Google]`**. No inventes reseñas.
9. **Reserva rápida** — formulario corto (fecha, hora, personas) que lleva a `/reservas` con los datos rellenos.
10. **Ubicación y horario** — mapa de Google embebido con carga diferida, dirección, horario y teléfono.
11. **Footer** — monograma, dirección, horario, teléfono, email, redes sociales, enlaces legales, suscripción a novedades y "© 2026 Casa Francisco".

---

## 5. CARTA (contenido inventado y calibrado)

Precios calibrados comparando con restaurantes de cocina de autor y asadores de gama media-alta en España en 2026. Por debajo de la alta cocina con estrella (300 € o más), al nivel de una casa elegante con ticket de 55–75 €. Marca los alérgenos con iconos (14 alérgenos de la UE) y una leyenda accesible.

### Para empezar
| Plato | Descripción | Precio |
|---|---|---|
| Croquetas de jamón ibérico (6 uds.) | Bechamel cremosa de leche fresca y jamón de bellota | 14 € |
| Jamón ibérico de bellota 100 % | Cortado a cuchillo, con pan de cristal y tomate | 28 € |
| Gilda de la casa | Anchoa del Cantábrico, piparra y aceituna gordal | 4,50 € / ud. |
| Tartar de tomate de temporada | Tomate rosa, encurtidos y helado de aceite de oliva | 16 € |
| Steak tartar de vaca vieja | Cortado a cuchillo, yema curada y patatas suflé | 24 € |
| Carpaccio de gamba roja | Vinagreta de cítricos y su propio coral | 26 € |
| Foie a la brasa | Compota de manzana asada y reducción de Pedro Ximénez | 22 € |

### Del huerto y la brasa
| Plato | Descripción | Precio |
|---|---|---|
| Verduras de temporada a la brasa | Romesco ahumado y aceite de cebollino | 18 € |
| Alcachofas confitadas | Terminadas en brasa, con jamón crujiente | 19 € |
| Puerros a la llama | Vinagreta de avellana y queso curado | 15 € |

### Del mar
| Plato | Descripción | Precio |
|---|---|---|
| Lubina salvaje a la brasa | Pil-pil de sus espinas y verduras de temporada | 32 € |
| Rodaballo al sarmiento | Para compartir (2 pax), con refrito de ajos | 72 € |
| Pulpo a la brasa | Parmentier de patata, pimentón de la Vera y aceite de oliva | 26 € |
| Arroz meloso de carabinero | Mínimo 2 pax, precio por persona | 34 € |

### De la brasa (carnes)
| Plato | Descripción | Precio |
|---|---|---|
| Solomillo de vaca con foie | Reducción de vino tinto y cereza, crujiente de parmesano y crema de espinaca | 36 € |
| Tournedó de ternera | Puré de patata trufado, espárrago verde y jugo de asado | 32 € |
| Presa ibérica de bellota | Mojo verde y patatas panaderas | 27 € |
| Chuletón de vaca madurada (45 días) | A la piedra, con pimientos de Padrón y patatas | 95 € / kg |
| Parrillada Casa Francisco | Tabla para compartir: entraña, chorizo criollo, pollo de corral, pimiento asado y mazorca a la brasa (2 pax) | 68 € |
| Paletilla de cordero lechal | Asada lentamente, con ensalada de lechugas | 34 € |

### Postres
| Plato | Descripción | Precio |
|---|---|---|
| Torrija caramelizada | Brioche, helado de leche merengada | 10 € |
| Tarta de queso a la brasa | Queso cremoso y frutos rojos | 9 € |
| Chocolate, aceite y sal | Ganache de chocolate 70 %, aceite de oliva y sal en escamas | 11 € |
| Selección de quesos artesanos | Membrillo y frutos secos | 16 € |

Pan de masa madre y aperitivo de bienvenida: 3,50 € por persona. IVA incluido.

---

## 6. MENÚ DEGUSTACIÓN "FUEGO LENTO"

**85 € por persona** · Maridaje de vinos: **+45 €** · Maridaje premium: **+70 €**
Se sirve a mesa completa. Disponible en comida y cena. Bajo reserva.

1. **Bienvenida** — Gilda de la casa y croqueta de jamón ibérico
2. **Huerta** — Tartar de tomate de temporada y helado de aceite
3. **Mar** — Carpaccio de gamba roja y cítricos
4. **Brasa vegetal** — Alcachofa confitada y jamón crujiente
5. **Pescado** — Lubina salvaje y pil-pil de sus espinas
6. **Carne** — Solomillo de vaca, foie y reducción de vino tinto y cereza
7. **Prepostre** — Sorbete de mandarina y hierbabuena
8. **Postre** — Torrija caramelizada y helado de leche merengada
9. **Final** — Petit fours y café o infusión

Muestra el menú en una página con mucho aire, un pase por línea, numeración romana en latón y la foto del solomillo.

---

## 7. LA BODEGA (vinos)

Presenta una selección corta y bien explicada, organizada por regiones, con un filtro (Tintos · Blancos · Espumosos · Generosos · Por copa):

- **Por copa (6–9 €):** Rioja crianza, Ribera del Duero roble, Albariño Rías Baixas, Verdejo Rueda, Cava Brut Nature, Fino de Jerez.
- **Tintos (28–120 €):** Rioja reserva, Ribera del Duero crianza, Priorat, Toro, Bierzo mencía.
- **Blancos (24–60 €):** Albariño, Godello de Valdeorras, Verdejo fermentado en barrica.
- **Espumosos (32–90 €):** Cava gran reserva, Champagne.
- **Generosos y dulces:** Pedro Ximénez, Oloroso, Amontillado.

Usa nombres genéricos de denominación de origen y no menciones bodegas comerciales concretas hasta que el cliente facilite su carta real.

---

## 8. EVENTOS PRIVADOS (/eventos)

- **La Bodega privada:** hasta `[PENDIENTE]` comensales sentados.
- **Menús de grupo:** "Menú Encina" (55 €/pax) y "Menú Bodega" (75 €/pax), con 2 entrantes para compartir, principal a elegir, postre y bebida.
- **Ideal para:** cumpleaños, pedidas, cenas de empresa y presentaciones.
- **Formulario de solicitud:** nombre, email, teléfono, fecha, número de personas, tipo de evento, presupuesto orientativo y mensaje.

---

## 9. FUNCIONALIDADES REALES (obligatorias)

**Nada de botones decorativos.** Todo debe funcionar.

1. **Reserva de mesa (/reservas):**
   - Selector de fecha (bloquea días pasados y días de cierre), hora en franjas de 15 minutos, personas (1–10; más de 10 lleva a eventos), sala preferida (Salón / La Bodega), nombre, email, teléfono, alergias o celebraciones y casilla de privacidad obligatoria.
   - Validación en cliente y servidor con **Zod**.
   - Envío mediante **API Route de Next.js** a dos sitios: un email al restaurante y un email de confirmación al cliente (**Resend**), y un registro en una base de datos (**Supabase**) con estado *pendiente / confirmada / cancelada*.
   - Protección anti-spam: honeypot, límite de peticiones por IP y **Cloudflare Turnstile**.
   - Estados visuales de carga, éxito y error con mensajes claros.
   - Alternativa opcional: dejar preparada la integración con CoverManager o TheFork mediante una variable de entorno.
2. **Formulario de eventos y contacto:** mismo sistema de validación, envío y anti-spam.
3. **Panel sencillo /admin** (protegido con Supabase Auth) para ver y cambiar el estado de las reservas.
4. **Botones `tel:` y `mailto:`**, enlace "Cómo llegar" a Google Maps.
5. **Banner de cookies** que bloquee la analítica hasta que el usuario acepte.
6. Todas las claves en `.env.local` y un `.env.example` documentado. Ninguna clave en el código.

---

## 10. STACK TÉCNICO

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS**
- Framer Motion (animaciones), Lucide (iconos), React Hook Form + Zod (formularios)
- Supabase (base de datos y autenticación), Resend (emails), Cloudflare Turnstile (anti-spam)
- `next/image` con formatos AVIF/WebP, `next/font`
- Contenido de la carta en un archivo `data/menu.ts` tipado, para poder editar platos y precios sin tocar componentes
- Componentes reutilizables: `Button`, `SectionHeading`, `MenuItem`, `AllergenIcon`, `Reveal`, `Lightbox`, `ReservationForm`
- Despliegue preparado para Vercel

---

## 11. SEO Y SEO LOCAL

- `title` y `meta description` únicos por página. Ejemplo para inicio: *"Casa Francisco | Restaurante de brasa y bodega en [CIUDAD]"*.
- Un solo `h1` por página y jerarquía correcta de encabezados.
- Datos estructurados JSON-LD: `Restaurant` (con `servesCuisine`, `priceRange: "€€€"`, `acceptsReservations`, horario y dirección), `Menu` / `MenuSection` / `MenuItem` y `BreadcrumbList`.
- Open Graph y Twitter Card con imagen de 1200 × 630 px.
- `sitemap.xml`, `robots.txt`, URL canónica y `lang="es"`.
- Textos `alt` descriptivos en todas las imágenes, por ejemplo: *"Comedor de Casa Francisco con lámparas de latón y banquetas de piel"*.
- Enlaces internos entre carta, degustación, reservas y eventos.

---

## 12. RENDIMIENTO, ACCESIBILIDAD Y RESPONSIVE

- Objetivo: Lighthouse por encima de 95 en las cuatro categorías; LCP por debajo de 2,5 s, CLS por debajo de 0,1 e INP por debajo de 200 ms.
- Imagen del hero con `priority`; el resto con carga diferida.
- Navegación completa con teclado, foco visible en latón, `aria-label` en los iconos y formularios con `label` asociados.
- Diseño mobile-first probado a 360, 390, 768, 1024, 1440 y 1920 px. Sin scroll horizontal y con botones de al menos 44 × 44 px.

---

## 13. TEXTOS (tono de voz)

Cálido, sobrio y evocador. Frases cortas. Nada de tópicos como "experiencia única" o "los mejores ingredientes". Habla de fuego, de tiempo, de temporada y de sobremesa. Segunda persona del plural para invitar ("Os esperamos en la mesa").

---

## 14. REVISIÓN ANTES DE ENTREGAR

Antes de dar el proyecto por terminado, comprueba y corrige:

- [ ] Todos los enlaces y botones funcionan, y el menú móvil abre y cierra.
- [ ] La reserva guarda en la base de datos y envía los dos emails.
- [ ] Los errores de validación se muestran correctamente.
- [ ] No hay errores en la consola ni en el build (`npm run build`).
- [ ] Se ve bien en todos los tamaños indicados.
- [ ] Las animaciones se desactivan con movimiento reducido.
- [ ] Todos los `[PENDIENTE: …]` aparecen listados en el README.

**Entrega:** código organizado, un `README.md` con instalación, variables de entorno, cómo editar la carta, cómo desplegar en Vercel y la lista de datos que faltan.

---

### Mapa de fotografías aportadas

| Foto | Uso recomendado |
|---|---|
| Salón con lámparas esféricas de latón | Hero de inicio y página de reservas |
| Plato de solomillo con puré y espárrago | Sección "Platos de la casa" (Tournedó de ternera) |
| Solomillo con foie y reducción de vino | Manifiesto y página del menú degustación |
| Parrillada sobre tabla de madera | Sección de carnes y página de eventos |
| Bodega con bóveda de ladrillo y lámpara de araña | Sección "La Bodega" y página de eventos |

> Nota: la tercera foto lleva la marca de agua "Directo al Paladar". Sustitúyela por una foto propia antes de publicar la web.
