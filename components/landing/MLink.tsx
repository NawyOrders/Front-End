"use client";

import { m } from "motion/react";
import NextLink from "next/link";

/** next/link as a motion component, so links can take hover/tap/whileInView. */
export const MLink = m.create(NextLink);
