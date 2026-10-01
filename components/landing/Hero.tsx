"use client";

import type { Dictionary } from "@/lib/i18n";
import { stagger, useMouseTilt, useParallax, vars } from "@/lib/motion/hooks";
import { CountUp } from "./CountUp";
import { HeadlineWords } from "./HeadlineWords";
import { MLink } from "./MLink";

/* `fetchpriority` is spelled lowercase on purpose. React 18 has no
   `fetchPriority` in its attribute table (it arrived in React 19), so the
   camelCase prop logs "React does not recognize the fetchPriority prop" and
   @types/react 19 types only the camelCase name. React passes an unknown
   lowercase attribute straight through to the DOM, which is exactly what the
   browser needs — and it is the spelling the HTML is parsed with anyway. */
const HERO_FETCH_PRIORITY = { fetchpriority: "high" } as React.ImgHTMLAttributes<HTMLImageElement>;

/* The wide composite: every food piece arranged together on a transparent
   canvas, so it is what the hero column is built around. `%20` is the encoded
   spelling of the real file name in public/ — the same file, unambiguous to the
   browser and to the service worker's stale-while-revalidate. */
const COMPOSITE = { src: "/image%202.png", width: 1024, height: 789 };

/**
 * One single-piece image, parked behind the composite until the hero reveals.
 *
 *   x / y   final offset from the container's centre, in % of its inline and
 *           block size (read as cqw / cqh by .hero-piece, so the spread is
 *           fluid and never a fixed pixel distance);
 *   r       resting rotation (deg);
 *   s       resting scale;
 *   d       burst delay (ms), so the pieces arrive as a stagger;
 *   f       idle float duration (s), 4-7s;
 *   p       scroll parallax multiplier (px across the whole document);
 *   xSm/ySm/sSm   the same values under 768px: pulled inward and shrunk, so the
 *           spread stays inside a 320px viewport and clear of the headline.
 *
 * `wp` (piece width in cqw) and `w` / `h` (intrinsic size, for the img
 * attributes) are the only extras, and both are properties of the file rather
 * than of the composition.
 */
type Piece = {
  src: string;
  w: number;
  h: number;
  wp: number;
  x: number;
  y: number;
  r: number;
  s: number;
  d: number;
  f: number;
  p: number;
  xSm: number;
  ySm: number;
  sSm: number;
};

const pieces: Piece[] = [
  { src: "/image%203.png", w: 213, h: 227, wp: 26, x: -32, y: 24, r: -9, s: 1.05, d: 0, f: 5.2, p: 1, xSm: -28, ySm: 28, sSm: 0.9 },
  { src: "/image%205.png", w: 193, h: 109, wp: 28, x: 30, y: 22, r: 7, s: 1, d: 90, f: 6.1, p: 0.7, xSm: 26, ySm: 26, sSm: 0.88 },
  { src: "/image%209.png", w: 184, h: 125, wp: 22, x: -26, y: -26, r: 5, s: 0.95, d: 180, f: 4.6, p: 1.25, xSm: -22, ySm: -22, sSm: 0.85 },
  { src: "/image%201.png", w: 150, h: 103, wp: 24, x: 26, y: -22, r: -6, s: 1, d: 260, f: 6.8, p: 0.55, xSm: 22, ySm: -20, sSm: 0.88 },
  { src: "/image%206.png", w: 136, h: 91, wp: 24, x: 0, y: 38, r: -3, s: 0.82, d: 340, f: 5.7, p: 0.9, xSm: 0, ySm: 34, sSm: 0.8 },
  { src: "/image%207.png", w: 140, h: 119, wp: 20, x: -38, y: -2, r: 11, s: 0.85, d: 420, f: 4.9, p: 1.15, xSm: -32, ySm: -2, sSm: 0.8 },
  { src: "/image%204.png", w: 111, h: 77, wp: 18, x: 38, y: 4, r: -12, s: 0.9, d: 500, f: 6.4, p: 0.75, xSm: 32, ySm: 4, sSm: 0.82 },
];

/* Per-piece float wobble and the 12s pulse depth, derived from the index so the
   array above stays about composition and not about timing jitter. */
const WOBBLE = [1.2, 1.9, 1.4, 2.2, 1.6, 1.3, 2.1];

/** One piece's custom properties. `--h*` keeps them clear of the motion system's
    own `--p` (per-element progress), `--d` (fan depth) and `--f` (float). */
const pieceVars = (q: Piece, i: number) =>
  vars({
    "--hw": `${q.wp}cqw`,
    "--hx": q.x,
    "--hy": q.y,
    "--hr": q.r,
    "--hs": q.s,
    "--hd": `${q.d}ms`,
    "--hf": `${q.f}s`,
    "--hfd": `${-(0.6 + i * 0.45).toFixed(2)}s`,
    "--hp": q.p,
    "--hamp": 1.06 + (i % 3) * 0.01,
    "--hwob": WOBBLE[i % WOBBLE.length],
    "--hxs": q.xSm,
    "--hys": q.ySm,
    "--hss": q.sSm,
  });

export function Hero({ dict }: { dict: Dictionary }) {
  /* Every block that reveals on its own carries `data-reveal`, which the single
     watcher in MotionRoot registers by itself — no per-element ref to forget and
     no way to ship a section that stays at its hidden start state. Only the two
     hooks that have to write something stay here: the arc's scroll progress and
     the cursor tilt. */
  const arcRef = useParallax<HTMLDivElement>();
  const tiltRef = useMouseTilt<HTMLDivElement>(7);

  return (
    <section id={dict.sections.top} aria-labelledby="hero-title" className="relative overflow-hidden pb-16 pt-12 scroll-mt-20 sm:pb-24 sm:pt-16">
      {/* The one decorative shape on the site, drifting against the page. */}
      <div
        ref={arcRef}
        aria-hidden="true"
        style={vars({ "--sp": 70 })}
        className="parallax absolute inset-x-0 bottom-0 h-2/3 rounded-t-[50%] bg-beige/60"
      />
      <div className="container-x relative grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2">
        <div>
          <span data-reveal className="tag reveal rv-pop">{dict.hero.badge}</span>
          <h1 id="hero-title" className="h-display mt-4">
            {/* Words enter blurred; the orange line zooms back out of focus and
                gets the sweep underline. */}
            <HeadlineWords>
              <span className="block">{dict.hero.titleLead}</span>
              <span className="block text-brand">{dict.hero.titleAccent}</span>
            </HeadlineWords>
          </h1>
          <p
            data-reveal
            style={stagger(1)}
            className="reveal rv-mask-up mt-4 max-w-lg text-base text-ink-muted sm:text-lg"
          >
            {dict.hero.body}
          </p>
          <div data-reveal className="is-cascade mt-8 flex flex-wrap gap-3">
            <MLink href={`#${dict.sections.contact}`} style={stagger(2)} className="btn-primary reveal rv-pop btn-pulse">
              {dict.hero.ctaPrimary}
            </MLink>
            <MLink href={`#${dict.sections.showcase}`} style={stagger(3)} className="btn-ghost reveal rv-pop">
              {dict.hero.ctaSecondary}
            </MLink>
          </div>
          <dl data-reveal className="is-cascade mt-12 flex flex-wrap gap-x-8 gap-y-6">
            {dict.stats.map((s, i) => (
              <div key={s.label} style={stagger(4 + i)} className="reveal rv-pop rounded-xl leading-tight">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl font-extrabold text-navy">
                  <CountUp value={s.value} />
                </dd>
                <dd className="mt-1 text-xs leading-relaxed text-ink-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex justify-center lg:justify-start" style={{ perspective: 1200 }}>
          {/* Three nested layers, one job each, so no two transforms ever fight:
              .hero-visual       the site's reveal (.reveal + .rv-zoom-out, --i
                                stagger) — triggered by data-reveal, the one
                                watcher in MotionRoot, plus its 1.5s safety net;
                                it also hosts .hero-burst, which is what makes
                                the pieces fly out on exactly that reveal;
              .hero-visual__tilt the cursor tilt (--rx / --ry, written by
                                useMouseTilt) or the touch sway, plus the
                                document parallax (--scroll) on every screen;
              .hero-visual__img  the idle float and its drop-shadow.

              The pieces are a fourth layer, and it is a sibling of the tilt
              wrapper rather than a child of it, so they inherit the reveal but
              never its 3D context. */}
          <div data-reveal style={stagger(2)} className="hero-visual reveal rv-zoom-out">
            {/* Burst layer: absolute, inert to the pointer, aria-hidden, and
                below the composite (z 0 against the tilt layer's z 1), so every
                piece starts stacked and invisible behind the artwork and only
                becomes visible as it travels out. */}
            <div aria-hidden="true" className="hero-burst">
              {pieces.map((q, i) => (
                <span key={q.src} data-pause className="hero-piece" style={pieceVars(q, i)}>
                  <span className="hero-piece__float">
                    <span className="hero-piece__shadow" />
                    <img
                      className="hero-piece__img"
                      src={q.src}
                      alt=""
                      width={q.w}
                      height={q.h}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                </span>
              ))}
            </div>
            <div ref={tiltRef} className="hero-visual__tilt">
              <img
                className="hero-visual__img"
                src={COMPOSITE.src}
                alt={dict.hero.visualAlt}
                width={COMPOSITE.width}
                height={COMPOSITE.height}
                loading="eager"
                decoding="async"
                {...HERO_FETCH_PRIORITY}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}