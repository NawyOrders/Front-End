"use client";

import type { Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";
import { stagger } from "@/lib/motion/hooks";
import { Icon } from "./Icon";
import { FoodDecor, SectionTitle, type DecorPiece } from "./SectionTitle";

/* Background food, blurred down to shadows. The QR card is a small centred
   column on a full-bleed navy field, so this section has the most free space of
   any of them and carries the most pieces â€” five on desktop, of which the outer
   pair is dropped on a phone. The dark drop-shadow is doing almost nothing on
   navy, so the far pieces here lean on blur and opacity rather than on it. */
const decor: DecorPiece[] = [
  { src: "/image%205.png", w: 193, h: 109, side: "start", top: 12,  dx: -0.06 , size: 1.15, rot: -7, drift: 6, lift: -13, blur: 4, op: 0.28, dur: 9.4, delay: -3.1, par: -16 },
  { src: "/image%207.png", w: 140, h: 119, side: "end", top: 16,  dx: -0.06 , size: 1, rot: 11, drift: 5, lift: -11, blur: 5, op: 0.22, dur: 8.1, delay: -5.2, par: -12 },
  { src: "/image%204.png", w: 111, h: 77, side: "start", top: 74,  dx: 0.05 , size: 0.9, rot: -9, drift: 4, lift: -10, blur: 2, op: 0.34, dur: 7.2, delay: -1.4, par: -19, tier: "md" },
  { src: "/image%203.png", w: 213, h: 227, side: "end", top: 70,  dx: 0.04 , size: 1.2, rot: 8, drift: 6, lift: -12, blur: 3, op: 0.26, dur: 10.6, delay: -6.8, par: -10, tier: "lg" },
  { src: "/image%201.png", w: 150, h: 103, side: "start", top: 44,  dx: 0.06 , size: 0.85, rot: -12, drift: 5, lift: -9, blur: 1, op: 0.46, dur: 6.9, delay: -0.6, par: -14, tier: "lg" },
];

export function FinalCTA({ dict }: { dict: Dictionary }) {
  return (
    <section id={dict.sections.contact} aria-labelledby="cta-title" className="section overflow-x-clip scroll-mt-20 bg-navy text-center text-white">
      <FoodDecor pieces={decor} />
      <div className="container-x relative">
        <SectionTitle id="cta-title" center>{dict.cta.title}</SectionTitle>
        <p data-reveal style={stagger(1)} className="reveal rv-mask-up mx-auto mt-4 max-w-md text-white/75">{dict.cta.body}</p>

        {/* The card breathes very slightly while it is on screen; the shimmer
            rule below disables it under reduced motion. */}
        <div data-reveal style={stagger(2)} className="reveal rv-zoom mx-auto mt-10 w-fit">
          <div className="breathe flex w-fit flex-col items-center gap-4 rounded-card bg-white p-5 shadow-cta">
            {/* Square, unrounded, on white: a QR needs its quiet zone and a light
                background to stay scannable. Keep the generated file in sync via `npm run qr`. */}
            <img
              src="/lead-form-qr.svg"
              alt={dict.cta.qrAlt}
              width={160}
              height={160}
              className="size-40 sm:size-44"
              loading="lazy"
              decoding="async"
            />
            <a
              href={site.leadFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-pulse w-full"
            >
              {dict.cta.qrButton}
              <span className="flex"><Icon name="external" className="icon-shift size-4" /></span>
            </a>
            <p className="text-xs text-ink-muted">{dict.cta.qrNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}