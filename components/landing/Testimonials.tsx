"use client";

import { m } from "motion/react";
import type { Dictionary } from "@/lib/i18n";
import { cardMotion, cardText, iconHover, popIn, shadowCardHover, stagger, staggerContainer, starPop, viewport } from "@/lib/motion";
import { SectionTitle } from "./SectionTitle";

function Stars({ n, label }: { n: number; label: string }) {
  return (
    <m.p variants={stagger(0.05, 0)} role="img" aria-label={label} className="flex gap-0.5 text-brand">
      {Array.from({ length: n }, (_, i) => (
        <m.svg key={i} viewBox="0 0 20 20" variants={starPop} className="size-4" aria-hidden="true">
          <path fill="currentColor" d="m10 1.500 2.600 5.400 5.900.8-4.300 4.100 1 5.800L10 14.800l-5.200 2.800 1-5.800L1.500 7.700l5.900-.8L10 1.500Z" />
        </m.svg>
      ))}
    </m.p>
  );
}

export function Testimonials({ dict }: { dict: Dictionary }) {
  return (
    <section aria-labelledby="reviews-title" className="section">
      <m.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={viewport} className="container-x">
        <m.div variants={staggerContainer} className="text-center">
          <m.span variants={popIn} className="tag">{dict.testimonials.badge}</m.span>
          <SectionTitle id="reviews-title" center className="mt-4">{dict.testimonials.title}</SectionTitle>
          <m.p className="mt-4 text-ink-muted" variants={cardText}>{dict.testimonials.body}</m.p>
        </m.div>
        <m.ul className="mt-12 grid gap-5 md:grid-cols-3">
          {dict.testimonials.items.map((t, i) => (
            <m.li
              key={t.name}
              variants={cardMotion(shadowCardHover, 0.07, i * 0.1)}
              initial="hidden"
              whileInView="show"
              whileHover="hover"
              whileTap="tap"
              viewport={viewport}
            >
              <article className="flex h-full flex-col rounded-card border border-line bg-cream-200/60 p-6">
                <Stars n={t.rating} label={dict.testimonials.starsLabel.replace("{n}", String(t.rating))} />
                <m.blockquote variants={cardText} className="mt-3 flex-1 text-sm text-navy">{t.quote}</m.blockquote>
                <m.footer variants={cardText} className="mt-5 flex items-center gap-3">
                  <m.span
                    variants={iconHover}
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-navy text-base font-extrabold text-white"
                    aria-hidden="true"
                  >
                    {t.name[0]}
                  </m.span>
                  <div>
                    <p className="text-sm font-bold text-navy">{t.name}</p>
                    <p className="text-xs text-ink-muted">{t.role}</p>
                  </div>
                </m.footer>
              </article>
            </m.li>
          ))}
        </m.ul>
      </m.div>
    </section>
  );
}
