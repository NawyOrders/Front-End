"use client";

import NextLink from "next/link";
import { memo, type ComponentProps } from "react";

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

export const MLink = memo(function MLink({ className = "", ...props }: ComponentProps<typeof NextLink>) {
  const isButton = className.split(/\s+/u).some((name) => BUTTON_CLASSES.has(name));
  return <NextLink {...props} className={`${className} ${isButton ? "" : "pressable"}`.trim()} />;
});