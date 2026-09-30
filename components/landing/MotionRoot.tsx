"use client";

import { useAutoReveal, useCardSpotlight, useScrollProgress } from "@/lib/motion/hooks";

/**
 * Mounts the page-wide motion plumbing, once:
 *
 *   • the `data-reveal` watcher, so anything mounted after the first paint
 *     (a tab, a toggle, a lazy section, the next route) is still revealed;
 *   • the passive scroll listener behind `--scroll` (progress bar) and `--p`
 *     (parallax, phone fan);
 *   • the passive pointer listener behind `--mx` / `--my` (card spotlight).
 *
 * Pointer work is gated to fine pointers inside lib/motion/runtime.ts, and
 * everything only ever writes CSS custom properties, so the tree around them
 * never re-renders. The animation rules themselves live in
 * src/styles/motion.css.
 */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  useAutoReveal();
  useScrollProgress();
  useCardSpotlight();

  return <>{children}</>;
}