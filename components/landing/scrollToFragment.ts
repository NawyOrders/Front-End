"use client";

import { decodeHash } from "@/lib/i18n/anchors";

/**
 * Scroll to a same-page fragment, decoding it first.
 *
 * Split out of MLink because the mobile nav has to call it twice: once on the
 * click, and again once the menu panel has finished collapsing. The panel is
 * `height: 0 -> auto` inside the sticky header, so while it is open it pushes
 * the whole page down; scrolling to the section immediately and then removing
 * that height leaves the reader short of the section by the height of the panel
 * they just closed.
 *
 * `scrollIntoView` rather than `window.scrollTo` because it applies the
 * section's `scroll-margin-top`, which is what keeps the sticky header from
 * covering the heading.
 */
export function scrollToFragment(hash: string): boolean {
  const fragment = decodeHash(hash);
  if (!fragment) return false;
  const target = document.getElementById(fragment);
  if (!target) return false;
  target.scrollIntoView({ block: "start" });
  return true;
}