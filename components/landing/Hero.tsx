"use client";

import type { Dictionary } from "@/lib/i18n";
import { stagger, useMouseTilt, useParallax, vars } from "@/lib/motion/hooks";
import { CountUp } from "./CountUp";
import { HeadlineWords } from "./HeadlineWords";
import { MLink } from "./MLink";
import { PhoneMockup } from "./PhoneMockup";

export function Hero({ dict }: { dict: Dictionary }) {
  /* Every block that reveals on its own carries `data-reveal`, which the single
     watcher in MotionRoot registers by itself — no per-element ref to forget and
     no way to ship a section that stays at its hidden start state. Only the two
     hooks that have to write something stay here: the arc's scroll progress and
     the cursor tilt. */
  const arcRef = useParallax<HTMLDivElement>();
  const tiltRef = useMouseTilt<HTMLDivElement>(7);

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-16">
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
            <MLink href="#contact" style={stagger(2)} className="btn-primary reveal rv-pop btn-pulse">
              {dict.hero.ctaPrimary}
            </MLink>
            <MLink href="#showcase" style={stagger(3)} className="btn-ghost reveal rv-pop">
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
          {/* Tilt: --rx / --ry are written on this element and read by the
              float keyframe below, so tilt and float never fight. */}
          <div ref={tiltRef}>
            <div data-reveal className="reveal rv-mask-side rounded-[2rem]">
              <div className="hero-float">
                <PhoneMockup dict={dict} alt={dict.showcase.mockupAlt} className="w-48 sm:w-56 lg:w-64" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}