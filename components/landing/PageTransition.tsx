"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The wrapper every route renders inside, through `app/[locale]/template.tsx`.
 *
 * Two jobs, both of them CSS plus one effect — no animation library:
 *
 *   1. `.page-fade` replays on every route change, because a template remounts
 *      whenever the route changes. Opacity plus a short rise, 320ms.
 *   2. Scroll to the top on the new route, unless the URL carries a hash — an
 *      in-page anchor and the locale switcher both rely on that hash.
 *
 * The wrapper must not create a containing block (no transform, no filter), or
 * the sticky header inside it would stop sticking to the viewport. That is why
 * the movement lives on an inner element and the wrapper only animates opacity.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="page-fade">
      <div ref={inner} className="page-rise">
        {children}
      </div>
    </div>
  );
}