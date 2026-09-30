"use client";

import { memo } from "react";
import type { Dictionary } from "@/lib/i18n";
import { stagger, useReveal } from "@/lib/motion/hooks";
import { SectionTitle } from "./SectionTitle";

type Item = Dictionary["testimonials"]["items"][number];

const CARD_VARIANTS = ["rv-flip", "rv-rotate", "rv-zoom"] as const;

/* The stars pop in one after another. role="img" + aria-label keeps the rating
   announced once, so the individual icons stay aria-hidden. */
const Stars = memo(function Stars({ n, label }: { n: number; label: string }) {
  const ref = useReveal<HTMLParagraphElement>();

  return (
    <p ref={ref} role="img" aria-label={label} className="is-cascade flex gap-0.5 text-brand">
      {Array.from({ length: n }, (_, i) => (
        <span key={i} style={stagger(i)} className="reveal rv-pop block">
          <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
            <path fill="currentColor" d="m10 1.500 2.600 5.400 5.900.8-4.300 4.100 1 5.800L10 14.800l-5.200 2.800 1-5.800L1.500 7.700l5.900-.8L10 1.500Z" />
          </svg>
        </span>
      ))}
    </p>
  );
});

const ReviewCard = memo(function ReviewCard({ item, i, dict }: { item: Item; i: number; dict: Dictionary }) {
  const ref = useReveal<HTMLLIElement>();

  return (
    <li ref={ref} style={stagger(i)} className={`lift reveal ${CARD_VARIANTS[i % CARD_VARIANTS.length]}`}>
      <article className="flex h-full flex-col rounded-card border border-line bg-cream-200/60 p-6">
        <Stars n={item.rating} label={dict.testimonials.starsLabel.replace("{n}", String(item.rating))} />
        <blockquote className="mt-3 flex-1 text-sm text-navy">{item.quote}</blockquote>
        <footer className="mt-5 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="icon-tilt grid size-11 shrink-0 place-items-center rounded-full bg-navy text-base font-extrabold text-white"
          >
            {item.name[0]}
          </span>
          <div>
            <p className="text-sm font-bold text-navy">{item.name}</p>
            <p className="text-xs text-ink-muted">{item.role}</p>
          </div>
        </footer>
      </article>
    </li>
  );
});

export function Testimonials({ dict }: { dict: Dictionary }) {
  const headRef = useReveal<HTMLDivElement>();

  return (
    <section aria-labelledby="reviews-title" className="section">
      <div className="container-x">
        <div ref={headRef} className="reveal is-cascade rv-up text-center">
          <span style={stagger(0)} className="tag reveal rv-pop">{dict.testimonials.badge}</span>
          <SectionTitle id="reviews-title" center className="mt-4">{dict.testimonials.title}</SectionTitle>
          <p style={stagger(1)} className="reveal rv-mask-up mt-4 text-ink-muted">{dict.testimonials.body}</p>
        </div>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {dict.testimonials.items.map((t, i) => (
            <ReviewCard key={t.name} item={t} i={i} dict={dict} />
          ))}
        </ul>
      </div>
    </section>
  );
}