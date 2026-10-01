"use client";

import { memo } from "react";
import type { Dictionary } from "@/lib/i18n";
import { SectionTitle } from "./SectionTitle";

type Step = Dictionary["solution"]["steps"][number];

const StepRow = memo(function StepRow({ step, i, dict }: { step: Step; i: number; dict: Dictionary }) {
  return (
    /* The line is the <ol>'s own border, so it sits at the list's inline-start
       edge no matter what the steps do. Each step carries the padding that
       clears it — the two are never coupled through a transform, which is what
       used to slide alternate rows across the line. */
    <li className="relative ps-8">
      <span
        className="absolute -start-[17px] top-0 grid size-8 place-items-center rounded-full bg-brand text-sm font-extrabold text-white shadow-cta"
        aria-hidden="true"
      >
        {i + 1}
      </span>
      <h3 className="text-xl font-extrabold text-navy">
        <span className="sr-only">{dict.solution.stepPrefix.replace("{n}", String(i + 1))}</span>
        {step.title}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">{step.text}</p>
    </li>
  );
});

export function Solution({ dict }: { dict: Dictionary }) {
  return (
    <section
      id={dict.sections.how}
      aria-labelledby="solution-title"
      data-reveal
      className="section reveal rv-fade scroll-mt-20"
    >
      {/* gap-10 is the two-column gutter every other section on the page uses
          (Problems, Showcase), so the split reads identically down the page. */}
      <div className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="tag">{dict.solution.badge}</span>
          <SectionTitle id="solution-title" className="mt-4">
            {dict.solution.titleLead} <span className="text-brand">{dict.solution.titleAccent}</span> {dict.solution.titleTail}
          </SectionTitle>
          <p className="mt-4 max-w-md text-ink-muted">{dict.solution.body}</p>
        </div>
        <ol className="relative space-y-6 border-s-2 border-brand/30">
          {dict.solution.steps.map((s, i) => (
            <StepRow key={s.title} step={s} i={i} dict={dict} />
          ))}
        </ol>
      </div>
    </section>
  );
}
