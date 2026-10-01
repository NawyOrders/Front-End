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
              .hero-visual__tilt the cursor tilt (--rx / --ry, written by
                                useMouseTilt) and the document parallax
                                (--scroll), both desktop-only;
              .hero-visual__img  the idle float and its drop-shadow. */}
          <div data-reveal style={stagger(2)} className="hero-visual reveal rv-zoom-out">
            <div ref={tiltRef} className="hero-visual__tilt">
              <img
                className="hero-visual__img"
                src="/content.webp"
                alt={dict.hero.visualAlt}
                width={1024}
                height={789}
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