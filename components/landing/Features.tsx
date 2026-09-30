"use client";

import { memo } from "react";
import type { Dictionary } from "@/lib/i18n";
import { stagger } from "@/lib/motion/hooks";
import { Icon } from "./Icon";
import { SectionTitle } from "./SectionTitle";

type Item = Dictionary["features"]["items"][number];

/* A grid never repeats itself: the four cards cycle through three different
   entrances, so the block reads as four moments rather than one animation
   played four times. */
const GRID_VARIANTS = ["rv-flip", "rv-rotate", "rv-zoom"] as const;

const FeatureCard = memo(function FeatureCard({ item, i }: { item: Item; i: number }) {
  return (
    <li data-reveal style={stagger(i)} className={`card lift is-cascade reveal ${GRID_VARIANTS[i % GRID_VARIANTS.length]} p-5`}>
      <span style={stagger(1)} className="reveal rv-zoom icon-tilt grid size-11 place-items-center rounded-xl bg-navy text-brand">
        <Icon name={item.icon} className="icon-draw size-5" />
      </span>
      <h3 style={stagger(2)} className="reveal rv-fade mt-4 font-bold text-navy">
        {item.title}
      </h3>
      <p style={stagger(3)} className="reveal rv-mask-up mt-1 text-sm text-ink-muted">
        {item.text}
      </p>
    </li>
  );
});

export function Features({ dict }: { dict: Dictionary }) {
  return (
    <section id="features" aria-labelledby="features-title" className="section overflow-x-clip">
      <div className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2">
        <div
          data-reveal
          className="reveal is-cascade rv-start rounded-[2.5rem] rounded-ss-[6rem] bg-navy p-8 text-white shadow-pop sm:p-12 lg:order-1"
        >
          <span
            style={stagger(0)}
            className="reveal rv-pop inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold leading-5 text-white/80"
          >
            {dict.features.badge}
          </span>
          <SectionTitle id="features-title" className="mt-4">
            {dict.features.titleLead} <span className="text-brand">{dict.features.titleAccent}</span>
          </SectionTitle>
          <p style={stagger(1)} className="reveal rv-mask-up mt-4 text-white/75">
            {dict.features.body}
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {dict.features.items.map((f, i) => (
            <FeatureCard key={f.title} item={f} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}