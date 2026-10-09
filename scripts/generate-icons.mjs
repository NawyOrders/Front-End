
/**
 * PWA icon generator — one-off, build-time only.
 *
 * Rasterises the existing brand mark (app/icon.svg: an #E43820 rounded square
 * with the white "N" stroke path) into the four files the web app manifest and
 * iOS need. The mark is never redrawn: it is the same 32-unit viewBox as the
 * shipped favicon, so scaling is strictly proportional and nothing is
 * distorted. Rendering happens through sharp's SVG rasteriser at a high
 * `density`, so the strokes stay crisp at 512.
 *
 *   npm run icons
 *
 * The outputs are committed; this script only has to run again if the mark in
 * app/icon.svg changes.
 */

import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

/* Kept byte-for-byte in step with app/icon.svg and the inline mark in
   components/landing/Logo.tsx. */
const ORANGE = "#E43820";
const NAVY = "#0F2A47";
const TILE = `<rect width="32" height="32" rx="8" fill="${ORANGE}"/>`;
const GLYPH = `<g transform="translate(7.1 7.1) scale(.74)">
    <path d="M7 3v8a2 2 0 0 0 4 0V3M9 3v18M16 3c-2 2-3 5-3 8h3v10" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;

const svg = (inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">${inner}</svg>`;

/** The mark on its own tile — what the shipped favicon already shows. */
const mark = svg(`${TILE}${GLYPH}`);

/**
 * The same mark on an opaque field, for platforms that never want alpha:
 * iOS masks the apple-touch-icon itself, and Android's maskable form crops to
 * a circle/squircle, so both get a full-bleed background and a mark inset to
 * the centre 80% (10% safe padding on every side).
 */
const plate = (background, scale) => {
  const inset = 16 * (1 - scale);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" fill="${background}"/>
  <g transform="translate(${inset} ${inset}) scale(${scale})">${TILE}${GLYPH}</g>
</svg>`;
};

/**
 * Renders the 32-unit art at 3x the target size and downsamples with Lanczos,
 * so every size is filtered from the same supersample instead of being
 * rasterised at its own (aliased) resolution. 32 units x 96dpi == the pixels.
 */
async function render(source, file, size) {
  const super_ = size * 3;
  const buffer = await sharp(Buffer.from(source), { density: (super_ / 32) * 72 })
    .resize(super_, super_, { fit: "fill" })
    .resize(size, size, { fit: "fill", kernel: "lanczos3" })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
  const path = join(outDir, file);
  writeFileSync(path, buffer);
  const meta = await sharp(buffer).metadata();
  console.log(`wrote ${path}  ${meta.width}x${meta.height}  ${meta.hasAlpha ? "rgba" : "opaque"}`);
}

/* 192 and 512: the favicon design verbatim, transparent outside the tile. */
await render(mark, "icon-192.png", 192);
await render(mark, "icon-512.png", 512);
/* Maskable: opaque navy field, mark inside the 80% safe zone. */
await render(plate(NAVY, 0.8), "maskable-512.png", 512);
/* apple-touch-icon: iOS applies its own mask, so no transparent corners. */
await render(plate(ORANGE, 0.62), "apple-touch-icon.png", 180);
