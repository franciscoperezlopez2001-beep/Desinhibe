# Casa Francisco — web oficial

Web del restaurante **Casa Francisco** (cocina española de brasa y bodega).
Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Zod · Supabase · Resend · Cloudflare Turnstile.

## Páginas

| Ruta | Contenido |
|---|---|
| `/` | Hero, manifiesto, pilares, platos de la casa, menú degustación, La Bodega, galería, opiniones (pendiente), reserva rápida, mapa y horario |
| `/carta` | Carta completa con índice fijo, alérgenos y datos estructurados `Menu` |
| `/menu-degustacion` | Menú "Fuego Lento" (9 pases, 85 €, maridajes) |
| `/bodega` | Espacio La Bodega y carta de vinos filtrable |
| `/eventos` | Menús de grupo y formulario de solicitud de eventos |
| `/reservas` | Reserva de mesa (fecha, franjas de 15 min, personas, sala, datos) |
| `/contacto` | Dirección, mapa, horario y formulario de contacto |
| `/admin` | Panel privado para ver y confirmar/cancelar reservas y solicitudes |
| `/aviso-legal`, `/privacidad`, `/cookies` | Plantillas **pendientes de revisión legal** |

## Funcionalidades reales

- **Reservas**: validación en cliente y servidor (Zod), franjas calculadas según el horario, días de cierre y antelación mínima, zona horaria Europe/Madrid. Se guardan en base de datos y se envía un email al restaurante y otro al cliente, más un archivo `.ics` para añadir al calendario.
- **Panel `/admin`**: al **confirmar** o **cancelar** una reserva, el cliente recibe un email automático.
- **Eventos y contacto**: el mismo sistema de validación, guardado y emails.
- **Anti-spam**: campo trampa (honeypot), comprobación de origen, límite de peticiones por IP y Cloudflare Turnstile (opcional).
- **Cookies**: el mapa de Google y la analítica opcional solo se cargan con consentimiento.
- **SEO**: metadatos por página, Open Graph, `sitemap.xml`, `robots.txt`, canonical y JSON-LD (`Restaurant`, `Menu`, `BreadcrumbList`).
- **Accesibilidad**: navegación por teclado, foco visible, menú móvil con foco atrapado, lightbox accesible y `prefers-reduced-motion`.

## Puesta en marcha

```bash
cd casa-francisco
npm install
cp .env.example .env.local   # rellena las variables
npm run dev                  # http://localhost:3000
```

Sin variables configuradas la web funciona en **modo desarrollo**: las solicitudes se guardan en `.data/*.json` y los emails se muestran en la consola.
En producción, sin Supabase el formulario responde "no disponible, llámanos" en lugar de fingir que ha funcionado.

### 1. Base de datos (Supabase)
1. Crea un proyecto en supabase.com (región UE recomendada).
2. En **SQL Editor**, ejecuta `supabase/schema.sql`.
3. Copia `SUPABASE_URL` y la **service role key** (Settings → API) en las variables de entorno. Esa clave solo se usa en el servidor.

### 2. Emails (Resend)
1. Crea una cuenta en resend.com y verifica el dominio del restaurante.
2. Rellena `RESEND_API_KEY`, `EMAIL_FROM` (p. ej. `Casa Francisco <reservas@tudominio.es>`) y `RESTAURANT_EMAIL`.

### 3. Anti-spam (Cloudflare Turnstile, opcional y recomendado)
Crea un widget en Cloudflare → Turnstile y rellena `NEXT_PUBLIC_TURNSTILE_SITE_KEY` y `TURNSTILE_SECRET_KEY`.

### 4. Panel de administración
Define `ADMIN_PASSWORD` y `ADMIN_SESSION_SECRET` (mínimo 32 caracteres aleatorios: `openssl rand -hex 32`).

### 5. Publicar en Vercel
1. Importa el repositorio en Vercel y fija **Root Directory = `casa-francisco`**.
2. Añade las variables de `.env.example` y fija `NEXT_PUBLIC_SITE_URL` con el dominio definitivo.
3. Despliega.

## Cómo editar contenido

| Qué | Dónde |
|---|---|
| Nombre, dirección, teléfono, email, redes, horario, capacidad | `data/site.ts` (cambia `pending: true` a `false` al rellenar) |
| Platos, precios y alérgenos | `data/menu.ts` |
| Menú degustación y menús de grupo | `data/tasting.ts` |
| Vinos | `data/wines.ts` |
| Fotos | Coloca los originales en `assets-src/` y ejecuta `npm run images` |

## Datos pendientes del restaurante

En la web aparecen marcados con un recuadro discontinuo `[PENDIENTE]`. Hasta que no se rellenan, no se usan en el SEO ni en los datos estructurados.

- [ ] Dirección completa, ciudad y coordenadas del mapa
- [ ] Teléfono y email
- [ ] Horario real (el actual es orientativo y está marcado como tal)
- [ ] Redes sociales
- [ ] Nombre del chef (opcional)
- [ ] Capacidad de La Bodega para eventos privados
- [ ] Reseñas reales de Google y enlace a la ficha
- [ ] Referencias reales de la carta de vinos
- [ ] **Validación de alérgenos por cocina** (obligatorio por el Reglamento UE 1169/2011)
- [ ] Textos legales revisados por un profesional (aviso legal, privacidad y cookies)
- [ ] Dominio definitivo (`NEXT_PUBLIC_SITE_URL`)

## Fotografías

- Las 4 fotos usadas son las facilitadas por el cliente. Son de **baja resolución** (de 450 a 740 px de ancho): el diseño las presenta en marcos que respetan su tamaño, pero para un resultado óptimo conviene una sesión fotográfica profesional (mínimo 2400 px de ancho).
- La foto del solomillo con foie **no se publica**: lleva la marca de agua de un medio externo ("Directo al Paladar") y no es del restaurante. No se incluye en el repositorio.
- Confirmad que tenéis derechos de uso sobre todas las fotos antes de publicar.

## Decisiones técnicas

- **Next.js 16** en lugar de 15: la 15 dependía de una versión de PostCSS con vulnerabilidades publicadas. `npm audit` muestra 0 vulnerabilidades.
- **Animaciones con CSS e IntersectionObserver** en lugar de Framer Motion: el mismo resultado con 0 KB extra de JavaScript.
- **Supabase, Resend y Turnstile mediante su API HTTP**, sin SDKs: menos dependencias.
- **Panel `/admin` con contraseña y sesión firmada (HMAC)** en lugar de Supabase Auth: funciona aunque no haya base de datos y basta para un único gestor.
- **Límite de peticiones en memoria**: en Vercel cada instancia tiene su propia memoria, así que la protección principal contra bots es Turnstile.
