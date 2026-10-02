"use client";

import { memo } from "react";
import type { Dictionary } from "@/lib/i18n";
import { Icon } from "./Icon";
import { SectionTitle } from "./SectionTitle";

type Item = Dictionary["features"]["items"][number];

const FeatureCard = memo(function FeatureCard({ item }: { item: Item }) {
  return (
    <li className="card lift p-5">
      <span className="grid size-11 place-items-center rounded-xl bg-navy text-brand">
        <Icon name={item.icon} className="icon-draw size-5" />
      </span>
      <h3 className="mt-4 font-bold text-navy">{item.title}</h3>
      <p className="mt-1 text-sm text-ink-muted">{item.text}</p>
    </li>
  );
});

export function Features({ dict }: { dict: Dictionary }) {
  return (
    <section id={dict.sections.features} aria-labelledby="features-title" data-reveal className="section reveal rv-fade scroll-mt-20">
      {/* One gap token for the whole section: `gap-6` is both the panel-to-grid
          gutter and the card-to-card gutter, so the two read identically and the
          block is one aligned grid. Tighter than the `gap-10` the other
          two-column sections use, because here that gutter separates two dense
          text blocks rather than a heading from its body.

          No `overflow-x-clip`: it was the workaround for the old translateX
          entrances and it only cropped real overflow. Nothing slides out now, so
          there is nothing to clip. The section itself is the only reveal, and it
          is opacity-only. */}
      <div className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-6 lg:grid-cols-2">
        <div className="rounded-[2.5rem] rounded-ss-[6rem] bg-navy p-8 text-white shadow-pop sm:p-12 lg:order-1">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold leading-5 text-white/80">
            {dict.features.badge}
          </span>
          <SectionTitle id="features-title" className="mt-4">
            {dict.features.titleLead} <span className="text-brand">{dict.features.titleAccent}</span>
          </SectionTitle>
          {/* mt-6, not the mt-4 used elsewhere: SectionTitle's brand bar sits
              -bottom-2, i.e. 0.5rem below the h2 box, so 1rem of clearance left
              it crowded against this line. */}
          <p className="mt-6 text-white/75">{dict.features.body}</p>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2">
          {dict.features.items.map((f) => (
            <FeatureCard key={f.title} item={f} />
          ))}
        </ul>
      </div>
    </section>
  );
}