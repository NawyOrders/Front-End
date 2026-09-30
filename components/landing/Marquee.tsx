"use client";

import { useAnimate } from "motion/react";
import { useEffect, useRef } from "react";
import type { AnimationPlaybackControls } from "motion/react";
import type { Dictionary } from "@/lib/i18n";
import { marqueeTrack, marqueeTransition, prefersReducedMotion } from "@/lib/motion";

export function Marquee({ dict }: { dict: Dictionary }) {
  const items = [...dict.marquee.restaurants, ...dict.marquee.restaurants];
  const [scope, animate] = useAnimate<HTMLUListElement>();
  const controls = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !scope.current) return;
    controls.current = animate(scope.current, marqueeTrack, marqueeTransition);
    return () => controls.current?.stop();
  }, [animate, scope]);

  return (
    <section
      aria-label={dict.marquee.label}
      className="overflow-hidden border-y border-line bg-cream-100 py-4"
      onPointerEnter={() => controls.current?.pause()}
      onPointerLeave={() => controls.current?.play()}
    >
      {/* The track owns the animation so hover can pause and resume it without
          unmounting; reduced-motion users never start it at all. */}
      <ul ref={scope} className="flex w-max gap-10 whitespace-nowrap px-5 text-sm font-bold leading-snug text-navy sm:text-base">
        {items.map((r, i) => (
          <li key={i} aria-hidden={i >= dict.marquee.restaurants.length} className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
            {r}
          </li>
        ))}
      </ul>
    </section>
  );
}
