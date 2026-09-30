"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/motion";

/* Opacity only, so the wrapper never becomes a containing block for the
   sticky header. Applied through app/[locale]/template.tsx, which remounts on
   every route change (the locale switch). */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE_OUT }}>
      {children}
    </m.div>
  );
}
