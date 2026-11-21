// Prepara las fotografías de /assets-src para la web.
// - Copia a /public/images en JPEG progresivo (next/image genera AVIF/WebP al vuelo).
// - Genera la imagen Open Graph (1200×630).
// Las fotos con marca de agua de terceros NO se publican (ver README).
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve("assets-src");
const OUT = path.resolve("public/images");
await mkdir(OUT, { recursive: true });

for (const file of await readdir(SRC)) {
  if (!/\.(jpe?g|png|webp)$/i.test(file)) continue;
  if (/MARCA-AGUA/i.test(file)) {
    console.log(`· omitida (marca de agua de terceros): ${file}`);
    continue;
  }
  const name = file.replace(/\.(jpe?g|png|webp)$/i, ".jpg");
  await sharp(path.join(SRC, file))
    .rotate()
    .jpeg({ quality: 88, progressive: true, mozjpeg: true })
    .toFile(path.join(OUT, name));
  console.log(`✓ ${name}`);
}

// Imagen Open Graph: foto de La Bodega + velo oscuro + rótulo.
const W = 1200;
const H = 630;
const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#14100D" stop-opacity="0.92"/>
      <stop offset="0.6" stop-color="#14100D" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#14100D" stop-opacity="0.25"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="#C29A5B" stroke-opacity="0.55"/>
  <text x="96" y="250" font-family="Georgia, serif" font-size="22" letter-spacing="6" fill="#C29A5B">COCINA DE BRASA · BODEGA</text>
  <text x="92" y="350" font-family="Georgia, serif" font-size="96" fill="#EDE6DA">Casa Francisco</text>
  <text x="96" y="420" font-family="Georgia, serif" font-style="italic" font-size="38" fill="#D9B77E">Fuego, bodega y tiempo.</text>
</svg>`);

await sharp(path.join(SRC, "bodega.jpg"))
  .resize(W, H, { fit: "cover", position: "right" })
  .modulate({ brightness: 0.9 })
  .composite([{ input: overlay }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.resolve("public/og-image.jpg"));
console.log("✓ og-image.jpg");
