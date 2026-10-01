"use client";

import type { Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";
import { stagger } from "@/lib/motion/hooks";
import { Icon } from "./Icon";
import { SectionTitle } from "./SectionTitle";

export function FinalCTA({ dict }: { dict: Dictionary }) {
  return (
    <section id={dict.sections.contact} aria-labelledby="cta-title" className="section overflow-x-clip scroll-mt-20 bg-navy text-center text-white">
      <div className="container-x">
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