"use client";

import { memo } from "react";
import type { Dictionary } from "@/lib/i18n";
import { stagger } from "@/lib/motion/hooks";
import { Icon } from "./Icon";
import { FoodDecor, SectionTitle, type DecorPiece } from "./SectionTitle";

type Item = Dictionary["problems"]["items"][number];

/* Background food, blurred down to shadows. Two pieces on a phone at the very
   edges, one more from tablet, two more from desktop â€” the extra ones sit where
   the two-column split has already left room. */
const decor: DecorPiece[] = [
  { src: "/image%206.png", w: 136, h: 91, side: "start", top: 12,  dx: -0.03 , size: 0.95, rot: -8, drift: 5, lift: -12, blur: 0, op: 0.5, dur: 7.4, delay: -1.2, par: -14 },
  { src: "/image%209.png", w: 184, h: 125, side: "end", top: 30,  dx: -0.04 , size: 1.1, rot: 6, drift: 4, lift: -9, blur: 1, op: 0.45, dur: 9.2, delay: -3.4, par: -9 },
  { src: "/image%204.png", w: 111, h: 77, side: "end", top: 62,  dx: 0.03 , size: 0.8, rot: -5, drift: 6, lift: -14, blur: 3, op: 0.26, dur: 8.1, delay: -2, par: -18, tier: "md" },
  { src: "/image%201.png", w: 150, h: 103, side: "start", top: 58,  dx: 0.04 , size: 1.15, rot: 9, drift: 5, lift: -11, blur: 4, op: 0.22, dur: 10, delay: -5, par: -12, tier: "lg" },
];

/* Each card owns its reveal, so the list cascades as it is scrolled rather than
   all at once â€” and the card is memoised because nothing here ever re-renders
   after mount. */
const ProblemCard = memo(function ProblemCard({ item, i }: { item: Item; i: number }) {
  return (
    <li
      data-reveal
      style={stagger(i)}
      className={`card lift is-cascade reveal ${i % 2 === 0 ? "rv-start" : "rv-end"} ${
        i === 1 ? "lg:me-6" : i === 2 ? "lg:me-12" : ""
      } flex items-start gap-4 p-5`}
    >
      <span className="icon-tilt grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
        <Icon name={item.icon} className="icon-draw size-5" />
      </span>
      <div>
        <h3 style={stagger(1)} className="reveal rv-fade font-bold text-navy">
          {item.title}
        </h3>
        <p style={stagger(2)} className="reveal rv-mask-up mt-1 text-sm text-ink-muted">
          {item.text}
        </p>
      </div>
    </li>
  );
});

export function Problems({ dict }: { dict: Dictionary }) {
  return (
    <section aria-labelledby="problems-title" className="section overflow-x-clip">
      <FoodDecor pieces={decor} />
      <div className="container-x relative grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2">
        {/* Left column enters from the reading-start edge. */}
        <div data-reveal className="reveal is-cascade rv-start">
          <span style={stagger(0)} className="tag reveal rv-pop">
            {dict.problems.badge}
          </span>
          <SectionTitle id="problems-title" className="mt-4">
            {dict.problems.title}
          </SectionTitle>
          <p style={stagger(1)} className="reveal rv-mask-up mt-4 max-w-md text-ink-muted">
            {dict.problems.body}
          </p>
        </div>
        <ul className="space-y-4">
          {dict.problems.items.map((p, i) => (
            <ProblemCard key={p.title} item={p} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}