"use client";

import type { ReactNode } from "react";

/* Opacity only, so the wrapper never becomes a containing block for the sticky
   header. Applied through app/[locale]/template.tsx, which remounts on every
   route change (the locale switch), so the CSS animation replays each time. */
export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="page-fade">{children}</div>;
}