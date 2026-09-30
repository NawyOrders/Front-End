"use client";

import { memo } from "react";
import type { Dictionary } from "@/lib/i18n";
import { stagger, useReveal } from "@/lib/motion/hooks";
import { Icon } from "./Icon";
import { SectionTitle } from "./SectionTitle";

type Item = Dictionary["problems"]["items"][number];

/* Each card owns its reveal, so the list cascades as it is scrolled rather than
   all at once — and the card is memoised because nothing here ever re-renders
   after mount. */
const ProblemCard = memo(function ProblemCard({ item, i }: { item: Item; i: number }) {
  const ref = useReveal<HTMLLIElement>();

  return (
    <li
      ref={ref}
      style={stagger(i)}
      className={`card lift is-cascade reveal ${i % 2 === 0 ? "rv-start" : "rv-end"} ${
        i === 1 ? "lg:me-6" : i === 2 ? "lg:me-12" : ""
      } flex items-start gap-4 p-5`}
    >
      <span className="icon-tilt grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
        <Icon name={item.icon} />
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
  const columnRef = useReveal<HTMLDivElement>();

  return (
    <section aria-labelledby="problems-title" className="section overflow-x-clip">
      <div className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2">
        {/* Left column enters from the reading-start edge. */}
        <div ref={columnRef} className="reveal is-cascade rv-start">
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