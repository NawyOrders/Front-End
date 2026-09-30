"use client";

import { memo } from "react";
import type { Dictionary } from "@/lib/i18n";
import { stagger } from "@/lib/motion/hooks";
import { SectionTitle } from "./SectionTitle";

type Step = Dictionary["solution"]["steps"][number];

const StepRow = memo(function StepRow({ step, i, dict }: { step: Step; i: number; dict: Dictionary }) {
  return (
    <li data-reveal style={stagger(i)} className={`is-cascade reveal ${i % 2 === 0 ? "rv-start" : "rv-end"} relative`}>
      {/* Same tilt as the icon tiles, so the number reacts to the step. */}
      <span
        style={stagger(1)}
        className="reveal rv-pop icon-tilt absolute -start-[calc(2rem+17px)] top-0 grid size-8 place-items-center rounded-full bg-brand text-sm font-extrabold text-white shadow-cta"
        aria-hidden="true"
      >
        {i + 1}
      </span>
      <h3 style={stagger(1)} className="reveal rv-fade text-xl font-extrabold text-navy">
        <span className="sr-only">{dict.solution.stepPrefix.replace("{n}", String(i + 1))}</span>
        {step.title}
      </h3>
      <p style={stagger(2)} className="reveal rv-mask-up mt-1 max-w-sm text-sm text-ink-muted">
        {step.text}
      </p>
    </li>
  );
});

export function Solution({ dict }: { dict: Dictionary }) {
  return (
    <section id="how" aria-labelledby="solution-title" className="section overflow-x-clip">
      <div className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2">
        <div data-reveal className="reveal is-cascade rv-start">
          <span style={stagger(0)} className="tag reveal rv-pop">
            {dict.solution.badge}
          </span>
          <SectionTitle id="solution-title" className="mt-4">
            {dict.solution.titleLead} <span className="text-brand">{dict.solution.titleAccent}</span> {dict.solution.titleTail}
          </SectionTitle>
          <p style={stagger(1)} className="reveal rv-mask-up mt-4 max-w-md text-ink-muted">
            {dict.solution.body}
          </p>
        </div>
        <ol className="relative space-y-6 border-s-2 border-brand/30 ps-8">
          {dict.solution.steps.map((s, i) => (
            <StepRow key={s.title} step={s} i={i} dict={dict} />
          ))}
        </ol>
      </div>
    </section>
  );
}