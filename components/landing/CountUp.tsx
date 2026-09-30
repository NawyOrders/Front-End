"use client";

import { useCountUp } from "@/lib/motion/hooks";

/* Stat values arrive as display strings ("+50", "0%", "3 أيام"). Split them so
   only the digits animate, and render the real value on the server: the first
   paint and the no-JS output both stay exactly what the dictionary says, then
   the number counts up once when the row scrolls into view. Digits are
   formatted without Intl so Arabic keeps the Latin numerals it ships with.
   The count writes textContent inside a rAF loop, so it never re-renders. */
const split = (value: string) => {
  const parts = /^(\D*?)([\d.]+)([\s\S]*)$/.exec(value);
  return parts
    ? { prefix: parts[1], value: Number(parts[2]), suffix: parts[3] }
    : { prefix: "", value: 0, suffix: value };
};

export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const { prefix, value: target, suffix } = split(value);
  const ref = useCountUp(target);

  return (
    <span className={className}>
      {prefix}
      <span ref={ref}>{target}</span>
      {suffix}
    </span>
  );
}