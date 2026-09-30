"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE_OUT } from "@/lib/motion";

/* Stat values arrive as display strings ("+50", "0%", "3 أيام"). Split them so
   only the digits animate, and render the real value on the server: the first
   paint and the no-JS output both stay exactly what the dictionary says, then
   the number counts up once when the row scrolls into view. Digits are
   formatted without Intl so Arabic keeps the Latin numerals it ships with. */
const split = (value: string) => {
  const parts = /^(\D*?)([\d.]+)([\s\S]*)$/.exec(value);
  return parts
    ? { prefix: parts[1], value: Number(parts[2]), suffix: parts[3] }
    : { prefix: "", value: 0, suffix: value };
};

export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const { prefix, value: target, suffix } = split(value);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [shown, setShown] = useState(target);

  useEffect(() => {
    if (!inView) return;
    setShown(0);
    const controls = animate(0, target, {
      duration: 1.4,
      ease: EASE_OUT,
      onUpdate: (n) => setShown(Math.round(n)),
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}
