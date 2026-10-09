"use client";

import type { Dictionary, Locale } from "@/lib/i18n";
import { MLink } from "./MLink";

/* One single place that picks the file per locale: Arabic ships the RTL
   wordmark, every other locale (English) the Latin one. The version query keeps
   a flipped locale from serving a stale cached copy. The two fonts have different
   aspect ratios, so only the height is fixed — width follows via w-auto. */
const logoSrc = (locale: Locale) => (locale === "ar" ? "/LOGO1.png?v=2" : "/logo.png?v=2");
const logoSize = (locale: Locale) => (locale === "ar" ? { width: 364, height: 143 } : { width: 511, height: 135 });

export function Logo({ dict, locale }: { dict: Dictionary; locale: Locale }) {
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
        src={logoSrc(locale)}
        alt={dict.brand.name}
        width={logoSize(locale).width}
        height={logoSize(locale).height}
        decoding="async"
        className="reveal rv-fade h-9 w-auto object-contain"
      />
    </MLink>
  );
}