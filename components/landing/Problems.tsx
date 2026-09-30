"use client";

import { m } from "motion/react";
import type { Dictionary } from "@/lib/i18n";
import { blurIn, cardMotion, cardText, iconHover, popIn, shadowCardHover, staggerContainer, viewport } from "@/lib/motion";
import { Icon } from "./Icon";
import { SectionTitle } from "./SectionTitle";

export function Problems({ dict }: { dict: Dictionary }) {
  return (
    <section aria-labelledby="problems-title" className="section">
      <m.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2"
      >
        <m.div variants={staggerContainer}>
          <m.span className="tag" variants={popIn}>{dict.problems.badge}</m.span>
          <SectionTitle id="problems-title" className="mt-4">{dict.problems.title}</SectionTitle>
          <m.p className="mt-4 max-w-md text-ink-muted" variants={blurIn}>{dict.problems.body}</m.p>
        </m.div>
        <m.ul className="space-y-4">
          {dict.problems.items.map((p, i) => (
            <m.li
              key={p.title}
              variants={cardMotion(shadowCardHover, 0.05, i * 0.09)}
              initial="hidden"
              whileInView="show"
              whileHover="hover"
              whileTap="tap"
              viewport={viewport}
              className={`card flex items-start gap-4 p-5 ${i === 1 ? "lg:me-6" : i === 2 ? "lg:me-12" : ""}`}
            >
              <m.span variants={iconHover} className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                <Icon name={p.icon} />
              </m.span>
              <div>
                <m.h3 variants={cardText} className="font-bold text-navy">{p.title}</m.h3>
                <m.p variants={cardText} className="mt-1 text-sm text-ink-muted">{p.text}</m.p>
              </div>
            </m.li>
          ))}
        </m.ul>
      </m.div>
    </section>
  );
}
