"use client";

import { LazyMotion, MotionConfig, domMax } from "motion/react";

/* `domMax` is the bundle this site needs: everything in `domAnimation` (variants,
   whileInView, whileHover/whileTap, exit) plus the `layout` feature, which
   powers the shared-element transitions in Pricing (the period pill and the
   plan dots slide between positions instead of jumping). Components still use
   the `m` component, so nothing ships unexercised. */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
