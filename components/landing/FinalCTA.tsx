"use client";

import { m } from "motion/react";
import type { TargetAndTransition } from "motion/react";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";
import { cardMotion, cardText, iconHover, pressable, shadowPopHover, staggerContainer, viewport } from "@/lib/motion";
import { Icon } from "./Icon";
import { SectionTitle } from "./SectionTitle";

/* The QR card breathes very slightly while it is on screen. Reduced-motion
   users get the final keyframe (no movement) for free from MotionConfig. */
const breathe: TargetAndTransition = {
  scale: [1, 1.012, 1],
  transition: { duration: 6, ease: "easeInOut", repeat: Infinity },
};

export function FinalCTA({ dict }: { dict: Dictionary }) {
  return (
    <section id="contact" aria-labelledby="cta-title" className="section bg-navy text-center text-white">
      <m.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={viewport} className="container-x">
        <SectionTitle id="cta-title" center>{dict.cta.title}</SectionTitle>
        <m.p className="mx-auto mt-4 max-w-md text-white/75" variants={cardText}>{dict.cta.body}</m.p>

        <m.div
          variants={cardMotion(shadowPopHover)}
          initial="hidden"
          whileInView="show"
          whileHover="hover"
          whileTap="tap"
          viewport={viewport}
          className="mx-auto mt-10 w-fit"
        >
          <m.div
            animate={breathe}
            className="flex w-fit flex-col items-center gap-4 rounded-card bg-white p-5 shadow-cta"
          >
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
            <m.a
              href={site.leadFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              {...pressable}
              className="btn-primary w-full"
            >
              {dict.cta.qrButton}
              <m.span variants={iconHover} className="flex"><Icon name="external" className="size-4" /></m.span>
            </m.a>
            <p className="text-xs text-ink-muted">{dict.cta.qrNote}</p>
          </m.div>
        </m.div>
      </m.div>
    </section>
  );
}
