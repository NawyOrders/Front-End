"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import { decodeHash, hashFor, isForeignHash, keyForHash } from "@/lib/i18n/anchors";

/**
 * Keeps the browser in sync with a localized in-page fragment.
 *
 * Three cases, all of them things a plain `<a href="#...">` gets wrong once the
 * fragment is Arabic:
 *
 *   1. **A foreign fragment.** `/ar#features` (an old link, or a share from the
 *      English page) is rewritten to `/ar#المميزات` with `replaceState`, so no
 *      extra history entry is left behind and Back still means Back. The same
 *      runs in reverse on `/en`.
 *
 *   2. **First load onto a fragment.** The browser's own fragment scroll runs
 *      before the page is laid out and while the reveal system is still filling
 *      sections in, so a deep link can land a section too low.
 *
 *   3. **`hashchange`**, from Back/Forward or a hand-edited fragment.
 *
 * Two rules keep this from fighting `MLink`, which also scrolls on click:
 *
 *   • **Measure before moving.** The scroll only runs when the target is
 *     actually misaligned. `MLink` has usually already put it exactly where it
 *     belongs, and a second scroll from here would land short by whatever height
 *     the mobile nav panel had not finished collapsing.
 *   • **Jump, never animate.** `behavior: "auto"` throughout. A smooth scroll
 *     started here would still be in flight when `MLink` starts its own, and
 *     the two would interleave. `html` has `scroll-behavior: smooth` for real
 *     user-initiated navigation, which this deliberately does not inherit.
 *
 * `scrollIntoView` is used rather than `window.scrollTo` because it applies the
 * section's `scroll-margin-top`, which is what keeps the sticky header from
 * covering the heading.
 */
export function HashScroll({ locale }: { locale: Locale }) {
  useEffect(() => {
    const HEADING_CLEARANCE = 4;
    // Immediate, then a few retries as fonts settle and the reveal fills in.
    const RETRY_MS = [0, 60, 180, 400];
    const timers: number[] = [];

    const align = (target: Element) => {
      const box = target.getBoundingClientRect();
      const styles = getComputedStyle(target);
      const margin = parseFloat(styles.scrollMarginTop) || 0;
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      // Where the browser would put it: the section's own scroll-margin plus the
      // document's scroll-padding, stacked exactly as a real navigation stacks them.
      const wanted = margin + padding;
      if (Math.abs(box.top - wanted) <= HEADING_CLEARANCE) return;
      target.scrollIntoView({ block: "start", behavior: "auto" });
    };

    const go = () => {
      const raw = window.location.hash;
      if (!raw) return;

      // 1. Canonicalise a fragment written in the other language. Assigning the
      // hash fires `hashchange`, which brings us straight back here with the
      // corrected slug.
      if (isForeignHash(raw, locale)) {
        const key = keyForHash(raw, locale);
        if (!key) return;
        const next = hashFor(key, locale);
        window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}${next}`);
        window.location.hash = next;
        return;
      }

      // 2./3. The id on the page is real Arabic text while `location.hash` is
      // percent-encoded, so the lookup is always on the decoded value.
      const target = document.getElementById(decodeHash(raw));
      if (target) align(target);
    };

    for (const ms of RETRY_MS) timers.push(window.setTimeout(go, ms));
    window.addEventListener("hashchange", go);

    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener("hashchange", go);
    };
  }, [locale]);

  return null;
}