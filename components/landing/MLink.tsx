"use client";

import NextLink from "next/link";
import { memo, useCallback, type ComponentProps } from "react";
import type { Locale } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n";
import { decodeHash, hashFor, isForeignHash, keyForHash } from "@/lib/i18n/anchors";
import { scrollToFragment } from "./scrollToFragment";

/**
 * next/link with the site's link gesture already attached.
 *
 * `.btn` carries its own hover/press scale in motion.css, so a button link
 * only gets the class; anything else (nav item, footer link, logo) gets
 * `.pressable`. The test has to match what that stylesheet matches — it does
 * declare `.btn-primary` / `.btn-ghost` explicitly, because `@apply btn`
 * inlines the declarations but not the class name — otherwise a `btn-primary`
 * link would pick up `.pressable` as well and the two `scale` rules would
 * fight, with `.pressable` winning for being later in the file.
 */
const BUTTON_CLASSES = new Set(["btn", "btn-primary", "btn-ghost"]);

/**
 * Work out where a same-page fragment link should actually go.
 *
 * `location.hash` is percent-encoded while the ids on the page are plain text,
 * so the browser's own fragment lookup misses `#المميزات` and the click silently
 * does nothing. Everything here is about resolving the href to a real element id
 * and writing it back to the URL in a form the reader can copy and share.
 *
 * Returns `null` for anything that is not a same-page fragment.
 *
 * `mode` is `replace` for a fragment that belonged to the OTHER language: the
 * link was stale or shared from elsewhere, and correcting it must not leave a
 * history entry, or Back would step through the same section twice.
 */
export function resolveFragmentTarget(
  href: string,
  locale: Locale,
): { fragment: string; mode: "push" | "replace" } | null {
  if (typeof href !== "string" || !href.startsWith("#") || href.length < 2) return null;

  if (isForeignHash(href, locale)) {
    const key = keyForHash(href, locale);
    if (!key) return null;
    return { fragment: decodeHash(hashFor(key, locale)), mode: "replace" };
  }
  return { fragment: decodeHash(href), mode: "push" };
}

/** Put the fragment in the address bar without navigating. */
export function writeFragment(fragment: string, mode: "push" | "replace"): void {
  const url = `${window.location.pathname}${window.location.search}#${fragment}`;
  if (mode === "replace") window.history.replaceState(window.history.state, "", url);
  else window.history.pushState(null, "", url);
}

/**
 * A link, with same-page fragments handled by hand.
 *
 * A click on `#المميزات` takes over the two jobs the browser cannot do here:
 * resolving the DECODED id, and writing the localized fragment to the URL.
 * Modified clicks are left to the browser, which is what makes "open in new
 * tab" and "copy link address" behave the way the reader expects.
 *
 * The mobile nav cancels this with `preventDefault` and re-issues the scroll
 * itself once its panel has finished collapsing — see Navbar.
 */
export const MLink = memo(function MLink({
  className = "",
  href,
  onClick,
  ...props
}: ComponentProps<typeof NextLink>) {
  const isButton = className.split(/\s+/u).some((name) => BUTTON_CLASSES.has(name));

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.button !== 0) return;

      const locale = localeFromPathname(window.location.pathname);
      if (!locale || typeof href !== "string") return;

      const target = resolveFragmentTarget(href, locale);
      if (!target) return;

      const landed = scrollToFragment(`#${target.fragment}`);
      if (!landed) return;

      event.preventDefault();
      writeFragment(target.fragment, target.mode);
    },
    [href, onClick],
  );

  return (
    <NextLink {...props} href={href} onClick={handleClick} className={`${className} ${isButton ? "" : "pressable"}`.trim()} />
  );
});