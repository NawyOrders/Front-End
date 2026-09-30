"use client";

import { m } from "motion/react";
import type { Variants } from "motion/react";
import type { Dictionary } from "@/lib/i18n";
import { EASE_OUT, fadeUp, floatLoop, popIn, spring, staggerContainer, viewport } from "@/lib/motion";
import { PhoneMockup } from "./PhoneMockup";
import { SectionTitle } from "./SectionTitle";

type Slot = {
  id: "front" | "mid" | "back";
  z: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  delay: number;
  float: number;
  tone: "warm" | "cool";
};

/* The fan lives here rather than in CSS custom properties: every phone starts
   stacked at the centre of the stage and spreads to these offsets. `sign`
   mirrors x/rotate for RTL so both locales show the same picture. The stage
   itself is still scaled as a single unit by .fan-viewport, which is what keeps all
   three phones on screen down to 320px with no horizontal scroll. */
const slots: Slot[] = [
  { id: "front", z: "z-30", x: 0, y: 0, rotate: 0, scale: 1, delay: 0, float: 0, tone: "warm" },
  { id: "mid", z: "z-20", x: -120, y: 16, rotate: -8, scale: 0.94, delay: 0.1, float: 1.4, tone: "cool" },
  { id: "back", z: "z-10", x: 120, y: 16, rotate: 8, scale: 0.88, delay: 0.2, float: 2.8, tone: "cool" },
];

/* `hover` is a label, so the whole section (which is a variant child of
   nothing above it) hands it to all three phones when the pointer is over the
   stage: they straighten, lift and spread a little wider. */
const phone = (s: Slot, sign: number): Variants => ({
  hidden: { opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.92 },
  show: {
    opacity: 1,
    x: s.x * sign,
    y: s.y,
    rotate: s.rotate * sign,
    scale: s.scale,
    transition: { duration: 0.9, ease: EASE_OUT, delay: s.delay },
  },
  hover: {
    y: s.y - 8,
    rotate: 0,
    scale: s.scale * 1.04,
    transition: spring,
  },
});

export function Showcase({ dict, dir }: { dict: Dictionary; dir: "rtl" | "ltr" }) {
  const sign = dir === "rtl" ? -1 : 1;
  return (
    <section id="showcase" aria-labelledby="showcase-title" className="section overflow-x-clip">
      <m.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        whileHover="hover"
        viewport={viewport}
        className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2"
      >
        <m.div variants={staggerContainer}>
          <m.span className="tag" variants={popIn}>{dict.showcase.badge}</m.span>
          <SectionTitle id="showcase-title" className="mt-4">
            {dict.showcase.titleLead} <span className="text-brand">{dict.showcase.titleAccent}</span>
          </SectionTitle>
          <m.p className="mt-4 max-w-md text-ink-muted" variants={fadeUp}>{dict.showcase.body}</m.p>
        </m.div>
        <m.div variants={staggerContainer} className="fan-viewport relative mt-4 w-full">
          <div className="fan-stage">
            {slots.map((s) => (
              <m.div key={s.id} className={`fan-phone ${s.z}`} variants={phone(s, sign)}>
                <m.div animate={floatLoop(s.float)}>
                  <PhoneMockup dict={dict} alt={dict.showcase.mockupAlt} tone={s.tone} />
                </m.div>
              </m.div>
            ))}
          </div>
        </m.div>
      </m.div>
    </section>
  );
}
