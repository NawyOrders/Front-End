"use client";

import { vars } from "@/lib/motion/hooks";
import { HeadlineWords } from "./HeadlineWords";

/**
 * One blurred food image sitting behind a section's copy.
 *
 * `top` is a percentage down the section, `dx` how far in from the reading edge
 * it sits (logical, so the arrangement mirrors in RTL), `size` a multiplier on
 * the fluid clamp() the stylesheet applies, and `blur` / `op` the pair that
 * decides whether a piece reads as a far shadow or a near one. `tier` withholds
 * a piece from the screens that are too narrow to hold it without landing on
 * the text: "md" from 768px, "lg" from 1024px, absent everywhere.
 */
export type DecorPiece = {
  src: string;
  w: number;
  h: number;
  side: "start" | "end";
  top: number;
  /** How much of the piece hangs off the reading edge, as a fraction of the
      piece's own fluid width — negative bleeds it off, positive tucks it in.
      Expressed against the piece rather than the section so a piece that is
      half cut off looks the same at 320px as it does at 1440px. */
  dx: number;
  size: number;
  rot: number;
  drift: number;
  lift: number;
  blur: number;
  op: number;
  dur: number;
  delay: number;
  par: number;
  tier?: "md" | "lg";
};

/**
 * Renders a section's decor. It lives here, next to SectionTitle, because this
 * is already the one small presentational file every one of those sections
 * imports — so the markup stays written once without a new component file.
 *
 * Three layers, because three different things animate and `transform` is a
 * single property: the wrapper owns the reveal and the position, the middle span
 * owns the endless float and the scroll parallax, and the img owns the art.
 */
export function FoodDecor({ pieces }: { pieces: DecorPiece[] }) {
  return (
    <>
      {pieces.map((q, i) => (
        <span
          key={`${q.src}-${i}`}
          data-pause
          data-reveal
          aria-hidden="true"
          style={vars({
            "--i": i,
            "--dw": `clamp(56px, calc(${q.size} * 12vw), 180px)`,
            "--top": `${q.top}%`,
            "--dx": q.dx,
            "--rz": `${q.rot}deg`,
            "--dr": `${q.drift}deg`,
            "--dfy": `${q.lift}px`,
            "--blur": `${q.blur}px`,
            "--op": q.op,
            "--f": `${q.dur}s`,
            "--fd": `${q.delay}s`,
            "--p": q.par,
          })}
          className={`decor reveal rv-fade decor--${q.side}${q.tier ? ` decor--${q.tier}` : ""}`}
        >
          <span className="decor__float">
            <img className="decor__img" src={q.src} alt="" width={q.w} height={q.h} loading="lazy" decoding="async" />
          </span>
        </span>
      ))}
    </>
  );
}

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