"use client";

/**
 * The React surface of the motion system. Every hook here does one thing and
 * returns either a ref or nothing: the animated value always ends up as a CSS
 * custom property on a DOM node, never as component state.
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject, type TransitionEvent } from "react";
import {
  acquireSpotlight,
  canPointFine,
  easeOutExpo,
  observeReveal,
  onFrame,
  prefersReducedMotion,
  startScroll,
  trackProgress,
  wake,
} from "./runtime";

/* --- style helpers ---------------------------------------------------------- */

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** `--i` drives `transition-delay: calc(var(--i) * 90ms)` in motion.css. */
export const stagger = (index: number): Vars => ({ "--i": index });

/**
 * The same step at half the size. A plan card reveals a dozen rows (name,
 * audience, price, saving, six feature lines, button) and inherits `--stagger`
 * into all of them, so at 90ms the last row would land a full second after the
 * card appeared. Overriding `--stagger` on the card tightens the whole
 * subtree without touching the page-level step.
 */
export const cardStagger = (index: number, step = "45ms"): Vars => ({ "--i": index, "--stagger": step });

/** Any set of custom properties, for the fan slots and the marquee. */
export const vars = (values: Record<string, string | number>): Vars => values as Vars;

/* --- reveal ----------------------------------------------------------------- */

/**
 * Attach a `.reveal` element to the shared observer. It gets `.is-in` once and
 * is then unobserved, so scrolling back never replays the animation.
 *
 *   const ref = useReveal<HTMLLIElement>();
 *   <li ref={ref} className="reveal rv-zoom" style={stagger(i)}>
 */
export function useReveal<T extends Element = HTMLDivElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return observeReveal(element, () => {});
  }, []);

  return ref;
}

/* --- count-up ---------------------------------------------------------------- */

/**
 * Count a number up from 0 to `target` the first time it is seen.
 *
 * The element is written through `textContent` inside a rAF loop, so 60 frames
 * of counting cost zero renders. SSR renders the final value, which is what a
 * no-JS visitor gets; reduced-motion users keep it too.
 */
export function useCountUp(target: number, duration = 1400): RefObject<HTMLSpanElement | null> {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    let frame = 0;
    const off = observeReveal(element, () => {
      const start = performance.now();
      const write = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        element.textContent = String(Math.round(target * easeOutExpo(t)));
        if (t < 1) frame = requestAnimationFrame(write);
      };
      element.textContent = "0";
      frame = requestAnimationFrame(write);
    });

    return () => {
      off();
      cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  return ref;
}

/* --- scroll ------------------------------------------------------------------ */

/**
 * Installs the one passive scroll listener that writes `--scroll` on <html>.
 * Mounted once, by MotionRoot.
 */
export function useScrollProgress(): void {
  useEffect(() => startScroll(), []);
}

/**
 * Write `--p` (this element's own progress through the viewport) so shapes can
 * parallax against it. See `.parallax` and `.fan-phone` in motion.css.
 */
export function useParallax<T extends HTMLElement = HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return trackProgress(element);
  }, []);

  return ref;
}

/* --- pointer ----------------------------------------------------------------- */

/**
 * The card spotlight. Mounted once, by MotionRoot: one passive window listener
 * that writes `--mx` / `--my` on whichever card is under the pointer.
 */
export function useCardSpotlight(): void {
  useEffect(() => (canPointFine() ? acquireSpotlight() : undefined), []);
}

/**
 * Tilt an element toward the cursor by writing `--rx` / `--ry`.
 *
 * `--rx` / `--ry` are inherited, so the phone fan reads one pair of numbers and
 * gives each phone its own parallax depth factor (`--d`) in its keyframes.
 * Eased toward the target on a shared rAF loop, so it settles and the loop
 * goes back to sleep. Desktop only.
 */
export function useMouseTilt<T extends HTMLElement = HTMLElement>(max = 8): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion() || !canPointFine()) return;

    let targetX = 0;
    let targetY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let queued = 0;
    let event: PointerEvent | null = null;

    const paint = () => {
      queued = 0;
      const source = event;
      event = null;
      if (!source) return;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = (source.clientX - rect.left) / rect.width - 0.5;
      const y = (source.clientY - rect.top) / rect.height - 0.5;
      targetY = x * max * 2;
      targetX = -y * max * 2;
      wake();
    };

    const onMove = (e: PointerEvent) => {
      event = e;
      if (!queued) queued = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      wake();
    };

    // The easing itself is a frame task, so it stops as soon as it converges.
    const offFrame = onFrame(() => {
      tiltX += (targetX - tiltX) * 0.12;
      tiltY += (targetY - tiltY) * 0.12;
      element.style.setProperty("--rx", `${tiltX.toFixed(2)}deg`);
      element.style.setProperty("--ry", `${tiltY.toFixed(2)}deg`);
      if (Math.abs(targetX - tiltX) > 0.01 || Math.abs(targetY - tiltY) > 0.01) wake();
    });

    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerleave", onLeave);

    return () => {
      offFrame();
      cancelAnimationFrame(queued);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      element.style.setProperty("--rx", "0deg");
      element.style.setProperty("--ry", "0deg");
    };
  }, [max]);

  return ref;
}

/* --- presence --------------------------------------------------------------- */

/**
 * Mount/unmount with an exit animation. Without a library there is no
 * AnimatePresence, so this is the small state machine behind it: `open` flips
 * `exiting` on, and the wrapper's `onTransitionEnd` (or a timer, for reduced
 * motion) flips `mounted` off.
 */
export function usePresence(
  open: boolean,
  exitMs = 420,
): { mounted: boolean; exiting: boolean; onExitEnd: (event: TransitionEvent<HTMLElement>) => void } {
  const [mounted, setMounted] = useState(open);
  const [exiting, setExiting] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    window.clearTimeout(timer.current);
    if (open) {
      setMounted(true);
      setExiting(false);
      return;
    }
    // Nothing is mounted, so there is nothing to animate out.
    if (!mounted) return;
    setExiting(true);
    timer.current = window.setTimeout(() => {
      setMounted(false);
      setExiting(false);
    }, exitMs);
    return () => window.clearTimeout(timer.current);
  }, [open, exitMs, mounted]);

  const onExitEnd = useCallback(
    (event: TransitionEvent<HTMLElement>) => {
      // Transitions on children bubble; only the wrapper's own counts, and only
      // while it is actually closing — otherwise opening would unmount it.
      if (event.target !== event.currentTarget) return;
      if (!exiting) return;
      setMounted(false);
      setExiting(false);
    },
    [exiting],
  );

  return { mounted, exiting, onExitEnd };
}

/* --- segmented control ------------------------------------------------------ */

/**
 * Measures the pressed option and writes `--px` / `--pw` onto the group so the
 * navy pill can slide there on a transform. Called on mount, on resize and
 * whenever the pressed option changes — no layout thrash in a rAF loop, and no
 * state, because the pill is moved entirely in CSS.
 */
export function useSlidingIndicator<T extends HTMLElement = HTMLDivElement>(): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const group = ref.current;
    if (!group) return;

    const paint = () => {
      const active = group.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!active) return;
      const box = group.getBoundingClientRect();
      const item = active.getBoundingClientRect();
      if (item.width === 0) return;
      const rtl = getComputedStyle(group).direction === "rtl";
      // Measured as a distance along the inline axis, so one rule works in both
      // directions: RTL offsets are negated because +X is physical.
      const offset = rtl ? box.right - item.right : item.left - box.left;
      group.style.setProperty("--px", `${(rtl ? -offset : offset).toFixed(2)}px`);
      group.style.setProperty("--pw", `${item.width.toFixed(2)}px`);
    };

    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(group);
    group.querySelectorAll("[aria-pressed]").forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* --- misc ------------------------------------------------------------------- */

/** `true` once the component has mounted in the browser. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}