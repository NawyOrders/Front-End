"use client";

import { AnimatePresence, m } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localeNumber } from "@/lib/i18n/config";
import {
  cardMotion,
  cardText,
  EASE_OUT,
  iconHover,
  listRow,
  popIn,
  prefersReducedMotion,
  pressable,
  shadowCardHover,
  shadowPopHover,
  springSoft,
  staggerContainer,
  staggerList,
  viewport,
} from "@/lib/motion";
import { Icon } from "./Icon";
import { MLink } from "./MLink";
import { SectionTitle } from "./SectionTitle";

export function Pricing({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [yearly, setYearly] = useState(false);
  const trackRef = useRef<HTMLUListElement>(null);
  const frameRef = useRef(0);
  const [active, setActive] = useState(-1);

  const fmt = new Intl.NumberFormat(localeNumber[locale]);
  const plans = dict.pricing.plans;
  const featuredIndex = plans.findIndex((p) => p.featured);
  /* The track is a carousel below lg, so the neighbouring plans only ever peek
     ~10% into view. A quarter-visible threshold would leave those two cards
     invisible while their edges sit on screen. */
  const cardViewport = { once: true, amount: 0.05 };
  const periods = [
    { v: false, l: dict.pricing.monthly },
    { v: true, l: dict.pricing.yearly },
  ];

  const centerCard = useCallback((index: number, smooth = true) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;
    const delta =
      card.getBoundingClientRect().left -
      track.getBoundingClientRect().left -
      (track.clientWidth - card.clientWidth) / 2;
    track.scrollBy({ left: delta, behavior: smooth && !prefersReducedMotion() ? "smooth" : "auto" });
  }, []);

  // Open on the recommended plan, but only while the row is still a swipe track.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || featuredIndex < 0) return;
    if (track.scrollWidth > track.clientWidth) centerCard(featuredIndex, false);
  }, [centerCard, featuredIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const center = track.getBoundingClientRect().left + track.clientWidth / 2;
      let best = 0;
      let bestDistance = Infinity;
      for (let i = 0; i < track.children.length; i += 1) {
        const box = (track.children[i] as HTMLElement).getBoundingClientRect();
        const distance = Math.abs(box.left + box.width / 2 - center);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      }
      setActive(best);
    };
    const onScroll = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(update);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="section">
      <m.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={viewport} className="container-x">
        <m.div variants={staggerContainer} className="text-center">
          <m.span variants={popIn} className="tag">{dict.pricing.badge}</m.span>
          <SectionTitle id="pricing-title" center className="mt-4">{dict.pricing.title}</SectionTitle>
          <m.p className="mx-auto mt-4 max-w-md text-ink-muted" variants={cardText}>{dict.pricing.body}</m.p>
          {/* The active period keeps a navy pill that slides between the two
              buttons: one shared layoutId, no measuring, no re-render. */}
          <m.div role="group" aria-label={dict.pricing.periodLabel} variants={cardText} className="relative mx-auto mt-6 flex w-full max-w-sm rounded-full border border-line bg-white p-1 text-sm font-bold sm:w-auto">
            {periods.map((o) => {
              const on = yearly === o.v;
              return (
                <m.button key={o.l} type="button" {...pressable} aria-pressed={on} onClick={() => setYearly(o.v)}
                  className={`relative min-h-11 flex-1 rounded-full px-3 py-1 leading-5 transition sm:flex-none sm:px-4 ${on ? "text-white" : "text-navy"}`}>
                  {on && <m.span layoutId="period-pill" aria-hidden="true" className="absolute inset-0 rounded-full bg-navy" transition={springSoft} />}
                  <span className="relative">{o.l}</span>
                </m.button>
              );
            })}
          </m.div>
          <m.p className="mt-4 text-xs text-ink-muted/80 lg:hidden" variants={cardText}>{dict.pricing.scrollHint}</m.p>
        </m.div>
        <ul ref={trackRef} role="list" tabIndex={0} aria-labelledby="pricing-title"
          className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2 pt-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-x-visible lg:px-0 lg:pb-0 lg:pt-0">
          {plans.map((p, i) => (
            <m.li
              key={p.id}
              variants={cardMotion(p.featured ? shadowPopHover : shadowCardHover, 0.05, i * 0.1)}
              initial="hidden"
              whileInView="show"
              whileHover="hover"
              whileTap="tap"
              viewport={cardViewport}
              className={`relative flex w-[86%] max-w-sm shrink-0 snap-center flex-col rounded-card border bg-white p-6 lg:w-auto lg:max-w-none lg:shrink ${p.featured ? "border-brand shadow-pop lg:-my-4 lg:py-10" : "border-line shadow-card"}`}
            >
              {p.featured && (
                <m.span variants={popIn} className="absolute -top-3 start-6 rounded-full bg-brand px-3 py-1 text-xs font-bold leading-5 text-white">
                  {dict.pricing.recommended}
                </m.span>
              )}
              <m.h3 variants={cardText} className="text-xl font-extrabold text-navy">{p.name}</m.h3>
              <m.p variants={cardText} className="text-sm text-ink-muted">{p.audience}</m.p>
              <m.p variants={cardText} className="mt-5 flex flex-wrap items-baseline gap-x-1.5">
                <m.span
                  className="text-[2rem] font-extrabold tabular-nums leading-none text-navy min-[420px]:text-4xl"
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  key={yearly ? "yearly" : "monthly"}
                  initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                >
                  {fmt.format(yearly ? p.yearly : p.monthly)}
                </m.span>
                <span className="text-sm text-ink-muted">{yearly ? dict.pricing.perYear : dict.pricing.perMonth}</span>
              </m.p>
              <AnimatePresence>
                {yearly && (
                  <m.p
                    key="save"
                    initial={{ opacity: 0, scale: 0.85, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -4 }}
                    transition={{ duration: 0.24, ease: EASE_OUT }}
                    className="mt-3 inline-flex w-fit items-center gap-1.5 self-start rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold leading-5 text-brand-dark"
                  >
                    <m.span variants={iconHover} className="flex shrink-0"><Icon name="tag" className="size-3.5 shrink-0" /></m.span>
                    {dict.pricing.saveNote.replace("{amount}", fmt.format(Math.max(0, (p.monthly - p.yearly) * 12)))}
                  </m.p>
                )}
              </AnimatePresence>
              <m.ul variants={staggerList} className="mt-6 flex-1 space-y-3 text-sm">
                {p.features.map((f) => (
                  <m.li key={f} variants={listRow} className="flex items-center gap-2 text-navy">
                    <m.span variants={iconHover} className="flex shrink-0"><Icon name="check" className="size-4 shrink-0 text-brand" /></m.span>{f}
                  </m.li>
                ))}
                {p.disabledFeatures?.map((f) => (
                  <m.li key={f} variants={listRow} className="flex items-center gap-2 text-ink-muted/60 line-through">
                    <span className="size-4 shrink-0 text-center leading-4" aria-hidden="true">–</span>{f}
                  </m.li>
                ))}
              </m.ul>
              <MLink href="#contact" {...pressable} className={`mt-8 w-full ${p.featured ? "btn-primary" : "btn-ghost"}`}>
                {dict.pricing.cta}<span className="sr-only"> {p.name}</span>
              </MLink>
            </m.li>
          ))}
        </ul>
        <div role="group" aria-label={dict.pricing.dotsLabel} className="mt-6 flex items-center justify-center gap-1 lg:hidden">
          {plans.map((p, i) => (
            <button key={p.id} type="button" onClick={() => centerCard(i)} {...pressable}
              aria-label={dict.pricing.goToPlan.replace("{name}", p.name)} aria-current={active === i ? "true" : undefined}
              className="grid size-11 place-items-center">
              {active === i ? (
                <m.span layoutId="plan-dot" className="block h-2.5 w-7 rounded-full bg-brand" transition={springSoft} />
              ) : (
                <m.span className="block size-2.5 rounded-full bg-navy/25" />
              )}
            </button>
          ))}
        </div>
      </m.div>
    </section>
  );
}
