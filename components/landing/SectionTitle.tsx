"use client";

import { HeadlineWords } from "./HeadlineWords";

/* Every section title keeps the existing `.h-section` type and gains a small
   brand bar that draws itself in with scaleX (it used to animate `width`).
   The bar is absolutely positioned, so it adds no spacing, and it centres with
   `mx-auto` rather than a transform, which the reveal owns. */
export function SectionTitle({
  id,
  center = false,
  className = "",
  children,
}: {
  id: string;
  center?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  /* `data-reveal` sits on the h2 itself: one observer entry lets the words and
     the bar cascade out of it, and the heading stays a heading. */
  return (
    <h2 id={id} data-reveal className={`h-section is-cascade relative ${className}`}>
      <HeadlineWords>{children}</HeadlineWords>
      <span
        aria-hidden="true"
        data-center={center ? "true" : "false"}
        className={`accent-bar absolute h-[3px] rounded-full bg-brand ${center ? "inset-x-0 -bottom-2 mx-auto" : "-bottom-2 start-0"}`}
      />
    </h2>
  );
}