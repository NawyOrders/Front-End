"use client";

import { m } from "motion/react";
import type { Dictionary } from "@/lib/i18n";
import { blurIn, cardMotion, cardText, iconHover, popIn, shadowCardHover, spring, staggerContainer, viewport } from "@/lib/motion";
import { Icon } from "./Icon";
import { SectionTitle } from "./SectionTitle";

export function Features({ dict }: { dict: Dictionary }) {
  return (
    <section id="features" aria-labelledby="features-title" className="section">
      <m.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2"
      >
        {/* Object whileHover on purpose: a label here would make the panel
            control its own variants, drop it out of the section's stagger and
            leave its children stuck at opacity 0. */}
        <m.div
          variants={staggerContainer}
          whileHover={{ y: -3, transition: spring }}
          className="rounded-[2.5rem] rounded-ss-[6rem] bg-navy p-8 text-white shadow-pop sm:p-12 lg:order-1"
        >
          <m.span variants={popIn} className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold leading-5 text-white/80">
            {dict.features.badge}
          </m.span>
          <SectionTitle id="features-title" className="mt-4">
            {dict.features.titleLead} <span className="text-brand">{dict.features.titleAccent}</span>
          </SectionTitle>
          <m.p className="mt-4 text-white/75" variants={blurIn}>{dict.features.body}</m.p>
        </m.div>
        <m.ul className="grid gap-4 sm:grid-cols-2">
          {dict.features.items.map((f, i) => (
            <m.li
              key={f.title}
              variants={cardMotion(shadowCardHover, 0.05, i * 0.08)}
              initial="hidden"
              whileInView="show"
              whileHover="hover"
              whileTap="tap"
              viewport={viewport}
              className="card p-5"
            >
              <m.span variants={iconHover} className="grid size-11 place-items-center rounded-xl bg-navy text-brand">
                <Icon name={f.icon} />
              </m.span>
              <m.h3 variants={cardText} className="mt-4 font-bold text-navy">{f.title}</m.h3>
              <m.p variants={cardText} className="mt-1 text-sm text-ink-muted">{f.text}</m.p>
            </m.li>
          ))}
        </m.ul>
      </m.div>
    </section>
  );
}
