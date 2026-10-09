"use client";

import type { Dictionary } from "@/lib/i18n";
import { MLink } from "./MLink";

export function Logo({ dict }: { dict: Dictionary }) {
  /* One `data-reveal` on the link: the logo image fades in with the cascade. The
     file already carries the brand name, so no separate wordmark is rendered. */
  return (
    <MLink
      href={`#${dict.sections.top}`}
      data-reveal
      className="is-cascade inline-flex items-center font-extrabold"
      aria-label={`${dict.brand.name} - ${dict.nav.home}`}
    >
      <img
        src="/logo.webp"
        alt={dict.brand.name}
        width={511}
        height={135}
        decoding="async"
        className="reveal rv-fade h-9 w-auto object-contain"
      />
    </MLink>
  );
}