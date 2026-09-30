
import QRCode from "qrcode";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DEFAULT_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScDm5tezfgnuxaY7plEFX2tJ0FHOi5cnnESBv9w6jsVG_i4mg/viewform";

const url = process.env.NEXT_PUBLIC_LEAD_FORM_URL ?? DEFAULT_URL;
const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const out = join(dir, "lead-form-qr.svg");

mkdirSync(dir, { recursive: true });

const svg = await QRCode.toString(url, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 4,
});

writeFileSync(out, svg, "utf8");
console.log(`wrote ${out}`);
console.log(`encodes ${url}`);
