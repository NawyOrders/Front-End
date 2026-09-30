"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localeLabel, otherLocale } from "@/lib/i18n/config";
import { Icon } from "./Icon";
import { MLink } from "./MLink";

export function LanguageSwitcher({ dict, locale, className = "" }: { dict: Dictionary; locale: Locale; className?: string }) {
  // The fragment only exists in the browser, so it is read after mount and
  // folded into the target href. Starting at "" keeps SSR and hydration equal.
  const [hash, setHash] = useState("");
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const target = otherLocale(locale);
  const pathname = usePathname() ?? "";
  const rest = pathname.replace(new RegExp(`^/${locale}`), "") || "/";
  const href = `/${target}${rest === "/" ? "" : rest}${hash}`;

  // Deliberately no onClick. middleware.ts persists the locale cookie on every
  // /[locale] request, so switching is a plain <Link> navigation and there is no
  // second, client-side path that can fail while the user is clicking.
  return (
    <MLink
      href={href}
      hrefLang={target}
      prefetch={false}
      aria-label={dict.nav.switchLabel}
      className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold leading-6 text-navy transition hover:bg-navy/5 hover:text-brand ${className}`}
    >
      {/* The globe turns once on hover. */}
      <span className="group/globe flex shrink-0">
        <Icon name="globe" className="size-4 motion-safe:transition-transform motion-safe:duration-700 group-hover/globe:rotate-[360deg]" />
      </span>
      <span>{localeLabel[target]}</span>
    </MLink>
  );
}