"use client";

import { useCardSpotlight, useScrollProgress } from "@/lib/motion/hooks";

/**
 * Mounts the two page-wide listeners, once:
 *
 *   • the passive scroll listener behind `--scroll` (progress bar) and `--p`
 *     (parallax, phone fan);
 *   • the passive pointer listener behind `--mx` / `--my` (card spotlight).
 *
 * Both are gated to fine pointers inside lib/motion/runtime.ts, and both only
 * ever write CSS custom properties, so the tree around them never re-renders.
 * The animation rules themselves live in src/styles/motion.css.
 */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  useScrollProgress();
  useCardSpotlight();

  return <>{children}</>;
}