"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { accentGrow, fadeUp } from "@/lib/motion";

/* Every section title keeps the existing `.h-section` type and gains a small
   brand bar that grows from 0. The bar is absolutely positioned, so it adds
   no spacing, and it centres with `mx-auto` rather than a transform, which
   motion would overwrite. */
export function SectionTitle({
  id,
  center = false,
  className = "",
  children,
}: {
  id: string;
  center?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <m.h2 id={id} className={`h-section relative ${className}`} variants={fadeUp}>
      {children}
      <m.span
        aria-hidden="true"
        className={`absolute h-[3px] w-0 rounded-full bg-brand ${center ? "inset-x-0 -bottom-2 mx-auto" : "-bottom-2 start-0"}`}
        variants={accentGrow}
      />
    </m.h2>
  );
}
