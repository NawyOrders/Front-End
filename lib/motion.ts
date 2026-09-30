import type { TargetAndTransition, Transition, Variants } from "motion/react";

/* Shared motion vocabulary. Every section, card and control on the site pulls
   from here so timings stay consistent. Motion is driven through <MotionConfig
   reducedMotion="user"> in app/[locale]/layout.tsx, which turns every
   positional keyframe below into an instant jump for users who ask for less
   motion, and only leaves opacity tweens running. */

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_SMOOTH: [number, number, number, number] = [0.4, 0, 0.2, 1];

/** whileInView defaults: reveal once, once a quarter of the block is on screen. */
export const viewport = { once: true, amount: 0.25 };

export const spring: Transition = { type: "spring", stiffness: 400, damping: 25 };
export const springSoft: Transition = { type: "spring", stiffness: 260, damping: 22 };

/** Spread onto any button or link. */
export const pressable = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
  transition: spring,
};

export const cardLift = { y: -4 };
export const cardPress = { scale: 0.98 };
export const shadowCardHover = "0 18px 36px -16px rgba(15,42,71,.28)";
export const shadowPopHover = "0 32px 70px -26px rgba(15,42,71,.42)";

/** Softer shadow for blocks that already sit on a light surface. */
export const shadowSoftHover = "0 14px 30px -18px rgba(15,42,71,.24)";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

/** Deeper reveal: the copy is also defocused, so the text lands rather than slides. */
export const blurIn: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE_OUT } },
};

/** Small badge / icon: a hair of overshoot instead of a straight scale. */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.86 },
  show: { opacity: 1, scale: [0.86, 1.08, 1], transition: { duration: 0.5, ease: EASE_OUT } },
};

/** Rating stars: same overshoot, rotated in. */
export const starPop: Variants = {
  hidden: { opacity: 0, scale: 0.4, rotate: -30 },
  show: { opacity: 1, scale: [0.4, 1.2, 1], rotate: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

/** Parent variant: hands "hidden" -> "show" down to its motion children. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/** Same, without the entrance delay: for blocks that are already staggered. */
export const lineStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

/** Tunable parent variant, for lists that need their own cadence. */
export const stagger = (each = 0.08, delay = 0.1): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren: delay } },
});

/** Body copy inside a card, cascaded by that card's own staggerChildren. */
export const cardText: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
};

/** Feature rows: same cascade, one step tighter. Vertical only, so a list
    reveals identically in RTL and LTR. */
export const staggerList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

export const listRow: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } },
};

/**
 * A card that reveals itself on scroll, cascades its own motion children, then
 * lifts on hover and squashes on tap.
 *
 * Cards are deliberately self-contained — `initial` / `whileInView` /
 * `whileHover` / `whileTap` are all labels here, so use it exactly like this:
 *
 *   <m.li variants={cardMotion(shadow, 0.05, i * 0.08)} initial="hidden"
 *          whileInView="show" whileHover="hover" whileTap="tap" viewport={viewport}>
 *
 * A string label makes a node "controlling" (see is-controlling-variants), and
 * a controlling node is dropped from its parent's variant tree, so a card that
 * also wants a hover label cannot be revealed by the section container. The
 * per-index `delay` is what restores the cascade. Children then react to the
 * card's hover for free — see `iconHover` and `cardText`.
 */
export const cardMotion = (boxShadow: string, each = 0.05, delay = 0): Variants => ({
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT, delay, staggerChildren: each, delayChildren: delay + 0.12 },
  },
  hover: { y: -4, boxShadow, transition: spring },
  tap: { scale: 0.98, transition: spring },
});

/**
 * Rest/hover pair for a child of a `whileHover="hover"` card. The child has no
 * `initial` of its own, so it still inherits "hidden" from the card and keeps
 * its place in the card's cascade.
 */
export const iconHover: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.12, rotate: -8, transition: spring },
};

export const accentGrow: Variants = {
  hidden: { width: "0rem", opacity: 0 },
  show: { width: "4rem", opacity: 1, transition: { duration: 0.7, ease: EASE_OUT, delay: 0.15 } },
};

/**
 * Label version of `pressable` for links whose children should share the
 * gesture (a rule that draws itself in on hover). `rest` restates the resting
 * values on purpose: a variant key with no properties animates nothing, so the
 * element would stay scaled up after the pointer left.
 */
export const pressableVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: spring },
  tap: { scale: 0.97, transition: spring },
};

/** The rule itself: drawn from the inline-start edge on hover. */
export const ruleVariants: Variants = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1, transition: { duration: 0.25, ease: EASE_OUT } },
};

/** The brand mark inside the logo link: tilts with it. */
export const markVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.08, rotate: -5, transition: spring },
  tap: { scale: 0.94, transition: spring },
};

/** The globe in the language switcher turns once. */
export const globeSpin: Variants = {
  rest: { rotate: 0 },
  hover: { rotate: 360, transition: { duration: 0.7, ease: EASE_OUT } },
};

/** Idle hover for the phone mockups. Give each phone its own delay. */
export const floatLoop = (delay = 0): TargetAndTransition => ({
  y: [0, -8, 0],
  transition: { duration: 5, ease: "easeInOut", repeat: Infinity, delay },
});

/** Very slow drift for decorative shapes anchored to a clipped edge. Positive
    distance moves the shape further under that edge, so no gap can open. */
export const driftLoop = (distance = 24, duration = 14, delay = 0): TargetAndTransition => ({
  y: [0, distance, 0],
  transition: { duration, ease: "easeInOut", repeat: Infinity, delay },
});

/** The restaurant ticker: 40s per lap, paused on hover from Marquee.tsx. */
export const marqueeTrack = { x: ["0%", "-50%"] };
export const marqueeTransition: Transition = { duration: 40, ease: "linear", repeat: Infinity };

export const menuItem: Variants = {
  hidden: { opacity: 0, y: -8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE_OUT } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.16, ease: EASE_OUT } },
};

/**
 * Only for JavaScript-driven motion (smooth scrolling, the marquee pause, the
 * QR breathe): a hook would read `null` on the server and the browser value on
 * the first client render, which is a hydration mismatch.
 */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
