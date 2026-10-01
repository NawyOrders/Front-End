"use client";

import { memo, useId, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { stagger } from "@/lib/motion/hooks";
import { FoodDecor, SectionTitle, type DecorPiece } from "./SectionTitle";

type Item = Dictionary["faq"]["items"][number];

/* Background food, blurred down to shadows. The FAQ column is the narrowest on
   the page (max-w-3xl inside a max-w-6xl section), which leaves the widest
   margins of anything here â€” so these can sit further out than the rest. */
const decor: DecorPiece[] = [
  { src: "/image%206.png", w: 136, h: 91, side: "start", top: 8,  dx: -0.07 , size: 1.2, rot: -8, drift: 5, lift: -12, blur: 2, op: 0.3, dur: 8.9, delay: -3.4, par: -15 },
  { src: "/image%209.png", w: 184, h: 125, side: "end", top: 24,  dx: -0.07 , size: 1.1, rot: 7, drift: 6, lift: -10, blur: 5, op: 0.2, dur: 10.2, delay: -6.4, par: -11 },
  { src: "/image%201.png", w: 150, h: 103, side: "start", top: 72,  dx: 0.04 , size: 0.9, rot: -10, drift: 4, lift: -13, blur: 3, op: 0.26, dur: 7.8, delay: -2.6, par: -18, tier: "md" },
  { src: "/image%203.png", w: 213, h: 227, side: "end", top: 76,  dx: 0.04 , size: 1, rot: 9, drift: 5, lift: -9, blur: 1, op: 0.48, dur: 6.6, delay: -0.4, par: -13, tier: "lg" },
];

const FaqItem = memo(function FaqItem({ item, i, open, onToggle, ids }: { item: Item; i: number; open: boolean; onToggle: () => void; ids: { button: string; panel: string } }) {
  return (
    <li data-reveal data-open={open ? "true" : "false"} style={stagger(i)} className="card acc-item reveal rv-up overflow-hidden">
      <h3>
        <button id={ids.button} type="button" aria-expanded={open} aria-controls={ids.panel} onClick={onToggle}
          className="pressable flex min-h-14 w-full items-center justify-between gap-4 px-5 py-3 text-start text-sm font-bold leading-6 text-navy sm:text-base">
          {item.q}
          <span className="chev shrink-0 text-brand">
            <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
              <path d="m5 8 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </h3>
      {/* The region always stays mounted so aria-controls resolves whether the
          panel is open or not; the panel itself slides on grid-template-rows. */}
      <div id={ids.panel} role="region" aria-labelledby={ids.button} className="collapse" data-open={open ? "true" : "false"}>
        <div>
          <p className="px-5 pb-5 text-sm text-ink-muted">{item.a}</p>
        </div>
      </div>
    </li>
  );
});

export function FAQ({ dict }: { dict: Dictionary }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section id={dict.sections.faq} aria-labelledby="faq-title" className="section overflow-x-clip scroll-mt-20">
      <FoodDecor pieces={decor} />
      <div className="container-x relative max-w-3xl">
        <div data-reveal className="reveal is-cascade rv-up text-center">
          <span style={stagger(0)} className="tag reveal rv-pop">{dict.faq.badge}</span>
          <SectionTitle id="faq-title" center className="mt-4">{dict.faq.title}</SectionTitle>
          <p style={stagger(1)} className="reveal rv-mask-up mt-4 text-ink-muted">{dict.faq.body}</p>
        </div>
        <ul className="mt-12 space-y-3">
          {dict.faq.items.map((f, i) => (
            <FaqItem
              key={f.q}
              item={f}
              i={i}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
              ids={{ button: `${base}-h${i}`, panel: `${base}-b${i}` }}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}