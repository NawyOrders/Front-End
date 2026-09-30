"use client";

import { memo } from "react";
import type { Dictionary } from "@/lib/i18n";
import { stagger, useMouseTilt, useParallax, useReveal, vars } from "@/lib/motion/hooks";
import { PhoneMockup } from "./PhoneMockup";
import { SectionTitle } from "./SectionTitle";

type Slot = {
  id: "front" | "mid" | "back";
  z: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  /** Tilt parallax depth: the back phone leans further than the front one. */
  depth: number;
  /** Idle float: one duration, delay, distance and wobble per phone. */
  float: { duration: string; delay: string; distance: string; wobble: string };
  tone: "warm" | "cool";
};

/* The fan lives here rather than in CSS custom properties because every phone
   starts stacked in the middle of the stage and spreads to these offsets. The
   stage is still scaled as a single unit by .fan-viewport, which is what keeps
   all three phones on screen down to 320px with no horizontal scroll, and the
   RTL mirror is a single `--dir` flip in the stylesheet, so both locales show
   the same picture. */
const slots: Slot[] = [
  { id: "front", z: "z-30", x: 0, y: 0, rotate: 0, scale: 1, depth: 0.35, float: { duration: "4.6s", delay: "0s", distance: "-10px", wobble: ".4deg" }, tone: "warm" },
  { id: "mid", z: "z-20", x: -120, y: 16, rotate: -8, scale: 0.94, depth: 0.8, float: { duration: "5.6s", delay: "-1.4s", distance: "-8px", wobble: "-.6deg" }, tone: "cool" },
  { id: "back", z: "z-10", x: 120, y: 16, rotate: 8, scale: 0.88, depth: 1.25, float: { duration: "6.4s", delay: "-2.8s", distance: "-12px", wobble: ".8deg" }, tone: "cool" },
];

const Phone = memo(function Phone({ slot, i, dict, alt }: { slot: Slot; i: number; dict: Dictionary; alt: string }) {
  return (
    /* data-reveal, not .reveal: the fan owns this element's transform and the
       entrance is expressed through :not(.is-in), so the two can never fight.
       The attribute is picked up by the document-wide watcher in
       lib/motion/runtime.ts, which is why a phone that mounts inside a tab or a
       lazy section is still revealed. */
    <div
      data-reveal
      className={`fan-phone ${slot.z}`}
      style={vars({
        "--i": i,
        "--x": slot.x,
        "--y": slot.y,
        "--r": slot.rotate,
        "--s": slot.scale,
        "--d": slot.depth,
        "--float-dur": slot.float.duration,
        "--fdelay": slot.float.delay,
        "--fy": slot.float.distance,
        "--fw": slot.float.wobble,
      })}
    >
      <div className="fan-float">
        <PhoneMockup dict={dict} alt={alt} tone={slot.tone} />
      </div>
    </div>
  );
});

export function Showcase({ dict }: { dict: Dictionary }) {
  const columnRef = useReveal<HTMLDivElement>();
  /* --rx / --ry (cursor tilt) are inherited by every phone; --p (the fan's own
     scroll progress) lives on the stage and opens the spread a little wider. */
  const tiltRef = useMouseTilt<HTMLDivElement>(9);
  const fanRef = useParallax<HTMLDivElement>();

  return (
    <section id="showcase" aria-labelledby="showcase-title" className="section overflow-x-clip">
      <div className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2">
        {/* Copy column = a plain fade (opacity only, no clip-path wipe and no
            slide). The fan keeps its own entrance below. */}
        <div ref={columnRef} className="reveal is-cascade rv-fade">
          <span style={stagger(0)} className="tag reveal rv-pop">
            {dict.showcase.badge}
          </span>
          <SectionTitle id="showcase-title" className="mt-4">
            {dict.showcase.titleLead} <span className="text-brand">{dict.showcase.titleAccent}</span>
          </SectionTitle>
          <p style={stagger(1)} className="reveal rv-fade mt-4 max-w-md text-ink-muted">
            {dict.showcase.body}
          </p>
        </div>
        <div ref={tiltRef} className="mt-4 w-full">
          <div ref={fanRef} className="fan-viewport relative">
            <div className="fan-stage">
              {slots.map((slot, i) => (
                <Phone key={slot.id} slot={slot} i={i} dict={dict} alt={dict.showcase.mockupAlt} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}