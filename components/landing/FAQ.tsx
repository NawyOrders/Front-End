"use client";

import { AnimatePresence, m } from "motion/react";
import { useId, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { cardMotion, cardText, EASE_OUT, popIn, pressable, shadowCardHover, staggerContainer, viewport } from "@/lib/motion";
import { SectionTitle } from "./SectionTitle";

export function FAQ({ dict }: { dict: Dictionary }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <section id="faq" aria-labelledby="faq-title" className="section">
      <m.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={viewport} className="container-x max-w-3xl">
        <m.div variants={staggerContainer} className="text-center">
          <m.span variants={popIn} className="tag">{dict.faq.badge}</m.span>
          <SectionTitle id="faq-title" center className="mt-4">{dict.faq.title}</SectionTitle>
          <m.p className="mt-4 text-ink-muted" variants={cardText}>{dict.faq.body}</m.p>
        </m.div>
        <m.ul className="mt-12 space-y-3">
          {dict.faq.items.map((f, i) => {
            const isOpen = open === i;
            const bid = `${base}-b${i}`;
            const hid = `${base}-h${i}`;
            return (
              <m.li
                key={f.q}
                variants={cardMotion(shadowCardHover, 0.04, i * 0.06)}
                initial="hidden"
                whileInView="show"
                whileHover="hover"
                whileTap="tap"
                viewport={viewport}
                className="card overflow-hidden"
              >
                <h3>
                  <m.button id={hid} type="button" {...pressable} aria-expanded={isOpen} aria-controls={bid} onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-3 text-start text-sm font-bold leading-6 text-navy sm:text-base">
                    {f.q}
                    <m.svg viewBox="0 0 20 20" className="size-4 shrink-0 text-brand" aria-hidden="true"
                      animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.15 : 1 }}
                      transition={{ duration: 0.28, ease: EASE_OUT }}>
                      <path d="m5 8 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </m.svg>
                  </m.button>
                </h3>
                {/* The region stays mounted so aria-controls always resolves;
                    only the measured panel inside it animates. */}
                <div id={bid} role="region" aria-labelledby={hid}>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div key="panel" className="overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: EASE_OUT }}>
                        <m.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.28, ease: EASE_OUT }}
                          className="px-5 pb-5 text-sm text-ink-muted"
                        >
                          {f.a}
                        </m.p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </m.li>
            );
          })}
        </m.ul>
      </m.div>
    </section>
  );
}
