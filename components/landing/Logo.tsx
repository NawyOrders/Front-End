"use client";

import type { Dictionary } from "@/lib/i18n";
import { MLink } from "./MLink";

export function Logo({ dict, light = false }: { dict: Dictionary; light?: boolean }) {
  /* One `data-reveal` on the link: the mark draws its own stroke out of the same
     `.is-in`, and the wordmark fades in behind it. */
  return (
    <MLink
      href="#top"
      data-reveal
      className="is-cascade inline-flex items-center gap-2 font-extrabold"
      aria-label={`${dict.brand.name} - ${dict.nav.home}`}
    >
      {/* The brand mark draws its own stroke on the first pass. */}
      <span className="grid size-9 place-items-center rounded-xl bg-brand text-white shadow-cta">
        <svg viewBox="0 0 24 24" className="icon-draw size-5" aria-hidden="true">
          <path
            d="M7 3v8a2 2 0 0 0 4 0V3M9 3v18M16 3c-2 2-3 5-3 8h3v10"
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className={`reveal rv-fade text-lg ${light ? "text-white" : "text-navy"}`}>{dict.brand.name}</span>
    </MLink>
  );
}