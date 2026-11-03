/**
 * build.mjs — genera apex.html: UN SOLO archivo con CSS, JS, Three.js, GSAP y Lenis incrustados.
 * Se abre con doble clic (file://), sin servidor. Uso:  npm install && npm run build
 */
import { build } from 'esbuild';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const r = (p) => readFileSync(resolve(root, p), 'utf8');
const safe = (s) => s.replace(/<\/(script|style)/gi, '<\\/$1');

const out = await build({
  entryPoints: [resolve(root, 'js/main.js')],
  bundle: true, write: false, format: 'esm', target: 'es2022', minify: true, legalComments: 'none',
  alias: { three: resolve(root, 'js/vendor/three.module.min.js') },
});
const app = out.outputFiles[0].text;

let html = r('index.html');
const css = r('css/styles.css');
// Fotos opcionales: photos/<id>.jpg|png|webp → se incrustan en apex.html como data URI
const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
const photos = {};
if (existsSync(resolve(root, 'photos'))) {
  for (const f of readdirSync(resolve(root, 'photos'))) {
    const m = f.match(/^(.+)\.(jpe?g|png|webp)$/i);
    if (m) photos[m[1]] = `data:${MIME[m[2].toLowerCase()]};base64,${readFileSync(resolve(root, 'photos', f)).toString('base64')}`;
  }
}
const credFile = resolve(root, 'photos/credits.json');
const allCredits = existsSync(credFile) ? JSON.parse(readFileSync(credFile, 'utf8')) : {};
const credits = Object.fromEntries(Object.entries(allCredits).filter(([id]) => photos[id]));
console.log(`Fotos incrustadas: ${Object.keys(photos).length}`);
const favicon = 'data:image/svg+xml,' + encodeURIComponent(r('assets/favicon.svg'));
html = html
  .replace(/<!--CSS-->[\s\S]*?<!--\/CSS-->/, `<style>${safe(css)}</style>`)
  .replace('href="assets/favicon.svg"', `href="${favicon}"`)
  .replace(/<!--JS-->[\s\S]*?<!--\/JS-->/,
    () => `<script>window.APEX_PHOTOS=${JSON.stringify(photos)};window.APEX_CREDITS=${JSON.stringify(credits)}</script>\n` + ['gsap.min.js', 'ScrollTrigger.min.js', 'lenis.min.js'].map((f) => `<script>${safe(r('js/vendor/' + f))}</script>`).join('\n') +
      `\n<script type="module">${safe(app)}</script>`);

writeFileSync(resolve(root, 'apex.html'), html);
console.log(`apex.html generado: ${(html.length / 1024).toFixed(0)} KB`);
