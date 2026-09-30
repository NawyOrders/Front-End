"use client";

import { m } from "motion/react";
import type { Dictionary } from "@/lib/i18n";
import { blurIn, cardMotion, cardText, iconHover, popIn, shadowSoftHover, staggerContainer, viewport } from "@/lib/motion";
import { SectionTitle } from "./SectionTitle";

export function Solution({ dict }: { dict: Dictionary }) {
  return (
    <section id="how" aria-labelledby="solution-title" className="section">
      <m.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2"
      >
        <m.div variants={staggerContainer}>
          <m.span className="tag" variants={popIn}>{dict.solution.badge}</m.span>
          <SectionTitle id="solution-title" className="mt-4">
            {dict.solution.titleLead} <span className="text-brand">{dict.solution.titleAccent}</span> {dict.solution.titleTail}
          </SectionTitle>
          <m.p className="mt-4 max-w-md text-ink-muted" variants={blurIn}>{dict.solution.body}</m.p>
        </m.div>
        <m.ol className="relative space-y-6 border-s-2 border-brand/30 ps-8">
          {dict.solution.steps.map((s, i) => (
            <m.li
              key={s.title}
              variants={cardMotion(shadowSoftHover, 0.07, i * 0.12)}
              initial="hidden"
              whileInView="show"
              whileHover="hover"
              whileTap="tap"
              viewport={viewport}
              className="relative"
            >
              {/* Same tilt as the icon tiles, so the number reacts to the step. */}
              <m.span
                variants={iconHover}
                className="absolute -start-[calc(2rem+17px)] top-0 grid size-8 place-items-center rounded-full bg-brand text-sm font-extrabold text-white shadow-cta"
                aria-hidden="true"
              >
                {i + 1}
              </m.span>
              <m.h3 variants={cardText} className="text-xl font-extrabold text-navy">
                <span className="sr-only">{dict.solution.stepPrefix.replace("{n}", String(i + 1))}</span>{s.title}
              </m.h3>
              <m.p variants={cardText} className="mt-1 max-w-sm text-sm text-ink-muted">{s.text}</m.p>
            </m.li>
          ))}
        </m.ol>
      </m.div>
    </section>
  );
}
