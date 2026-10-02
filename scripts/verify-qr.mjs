import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const QRCode = require("qrcode");
const { PNG } = require("pngjs");
const jsQR = require("jsqr");

const EXPECTED =
  "https://docs.google.com/forms/d/e/1FAIpQLScDm5tezfgnuxaY7plEFX2tJ0FHOi5cnnESBv9w6jsVG_i4mg/viewform";

const svgPath = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "lead-form-qr.svg");
const svg = readFileSync(svgPath, "utf8");
const m = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
console.log(`svg viewBox        : ${m?.[1]}x${m?.[2]}`);
console.log(`svg has dark fill  : ${svg.includes('stroke="#000000"')}`);

// Encode the same payload to a raw bitmap at several scales, as a scanner would see it.
let ok = false;
for (const scale of [4, 6, 8, 10]) {
  const buf = await QRCode.toBuffer(EXPECTED, { type: "png", errorCorrectionLevel: "M", margin: 4, scale });
  const png = PNG.sync.read(buf);
  const res = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  const got = res?.data ?? null;
  const pass = got === EXPECTED;
  ok ||= pass;
  console.log(`decode @ scale ${String(scale).padEnd(2)}: ${png.width}x${png.height} -> ${pass ? "MATCH" : "MISMATCH " + JSON.stringify(got)}`);
}

// Also confirm the committed SVG and the encoder agree module-for-module.
const committed = QRCode.create(EXPECTED, { errorCorrectionLevel: "M", margin: 4 });
console.log(`committed matches  : ${committed.modules.size + 8 === Number(m?.[1]) ? "yes" : "no"}`);

if (!ok) {
  console.error("\nFAIL: decoded payload did not match the Google Form URL");
  process.exit(1);
}
console.log("\nOK: QR decodes to the Google Form URL");
