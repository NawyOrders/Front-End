"use client";

import NextLink from "next/link";
import { memo, type ComponentProps } from "react";

/**
 * next/link with the site's link gesture already attached.
 *
 * `.btn` carries its own hover/press scale in motion.css, so a button link
 * only gets the class; anything else (nav item, footer link, logo) gets
 * `.pressable`. One `has` test, no per-call-site bookkeeping.
 */
export const MLink = memo(function MLink({ className = "", ...props }: ComponentProps<typeof NextLink>) {
  const isButton = className.split(/\s+/u).includes("btn");
  return <NextLink {...props} className={`${className} ${isButton ? "" : "pressable"}`.trim()} />;
});