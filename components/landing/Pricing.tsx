"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localeDir, localeNumber } from "@/lib/i18n/config";
import { cardStagger, stagger, useReveal, useSlidingIndicator, vars } from "@/lib/motion/hooks";
import { prefersReducedMotion } from "@/lib/motion/runtime";
import { Icon } from "./Icon";
import { MLink } from "./MLink";
import { SectionTitle } from "./SectionTitle";

type Plan = Dictionary["pricing"]["plans"][number];

/* Same three entrances as the features grid, in a different order, so the two
   card-heavy sections do not look like the same animation twice. */
const CARD_VARIANTS = ["rv-up", "rv-zoom", "rv-flip"] as const;

/* One card = one observer. Below lg the row is a swipe track, so a card that is
   off to the side has not been revealed yet and slides in as it is scrolled to
   — exactly what the carousel should do. */
const PlanCard = memo(function PlanCard({
  plan,
  i,
  yearly,
  fmt,
  dict,
}: {
  plan: Plan;
  i: number;
  yearly: boolean;
  fmt: Intl.NumberFormat;
  dict: Dictionary;
}) {
  const ref = useReveal<HTMLLIElement>();
  /* The button has to land after the last feature line, whatever this plan has. */
  const rows = 5 + plan.features.length + (plan.disabledFeatures?.length ?? 0);

  return (
    <li
      ref={ref}
      style={cardStagger(i)}
      className={`lift is-cascade reveal ${CARD_VARIANTS[i % CARD_VARIANTS.length]} relative flex w-[86%] max-w-sm shrink-0 snap-center flex-col rounded-card border bg-white p-6 lg:w-auto lg:max-w-none lg:shrink ${
        plan.featured ? "border-brand shadow-pop lg:-my-4 lg:py-10" : "border-line shadow-card"
      }`}
    >
      {plan.featured && (
        <span style={stagger(1)} className="reveal rv-pop absolute -top-3 start-6 rounded-full bg-brand px-3 py-1 text-xs font-bold leading-5 text-white">
          {dict.pricing.recommended}
        </span>
      )}
      <h3 style={stagger(1)} className="reveal rv-fade text-xl font-extrabold text-navy">
        {plan.name}
      </h3>
      <p style={stagger(2)} className="reveal rv-fade text-sm text-ink-muted">
        {plan.audience}
      </p>
      <p style={stagger(3)} className="reveal rv-fade mt-5 flex flex-wrap items-baseline gap-x-1.5">
        {/* The key remounts the span on every period change, so the CSS entry
            animation replays: the number swaps instead of blinking. */}
        <span
          key={yearly ? "yearly" : "monthly"}
          className="swap text-[2rem] font-extrabold tabular-nums leading-none text-navy min-[420px]:text-4xl"
        >
          {fmt.format(yearly ? plan.yearly : plan.monthly)}
        </span>
        <span className="text-sm text-ink-muted">{yearly ? dict.pricing.perYear : dict.pricing.perMonth}</span>
      </p>
      {yearly && (
        <p
          style={stagger(4)}
          className="pop mt-3 inline-flex w-fit items-center gap-1.5 self-start rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold leading-5 text-brand-dark"
        >
          <span className="flex shrink-0"><Icon name="tag" className="size-3.5 shrink-0" /></span>
          {dict.pricing.saveNote.replace("{amount}", fmt.format(Math.max(0, (plan.monthly - plan.yearly) * 12)))}
        </p>
      )}
      <ul className="mt-6 flex-1 space-y-3 text-sm">
        {plan.features.map((f, n) => (
          <li key={f} style={stagger(5 + n)} className="reveal rv-fade flex items-center gap-2 text-navy">
            <span className="flex shrink-0"><Icon name="check" className="icon-shift size-4 shrink-0 text-brand" /></span>{f}
          </li>
        ))}
        {plan.disabledFeatures?.map((f, n) => (
          <li key={f} style={stagger(5 + n)} className="reveal rv-fade flex items-center gap-2 text-ink-muted/60 line-through">
            <span className="size-4 shrink-0 text-center leading-4" aria-hidden="true">–</span>{f}
          </li>
        ))}
      </ul>
      <MLink href="#contact" style={stagger(rows)} className={`reveal rv-pop mt-8 w-full ${plan.featured ? "btn-primary" : "btn-ghost"}`}>
        {dict.pricing.cta}<span className="sr-only"> {plan.name}</span>
      </MLink>
    </li>
  );
});

export function Pricing({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [yearly, setYearly] = useState(false);
  const [active, setActive] = useState(-1);
  const trackRef = useRef<HTMLUListElement>(null);
  const frameRef = useRef(0);
  const headRef = useReveal<HTMLDivElement>();
  const segRef = useSlidingIndicator<HTMLDivElement>();

  /* Memoised so the memoised cards are not handed a new formatter each render. */
  const fmt = useMemo(() => new Intl.NumberFormat(localeNumber[locale]), [locale]);
  const plans = dict.pricing.plans;
  const featuredIndex = plans.findIndex((p) => p.featured);
  const periods = [
    { v: false, l: dict.pricing.monthly },
    { v: true, l: dict.pricing.yearly },
  ];
  /* Dots are identical squares: one slot (2.75rem) plus one gap (.25rem). */
  const step = 48;
  const sign = localeDir[locale] === "rtl" ? -1 : 1;

  const centerCard = useCallback((index: number) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;
    const delta =
      card.getBoundingClientRect().left -
      track.getBoundingClientRect().left -
      (track.clientWidth - card.clientWidth) / 2;
    track.scrollBy({ left: delta, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, []);

  // Open on the recommended plan, but only while the row is still a swipe track.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || featuredIndex < 0) return;
    if (track.scrollWidth > track.clientWidth) centerCard(featuredIndex);
  }, [centerCard, featuredIndex]);

  /* Scroll position is a UI concern here (which dot is current), not an
     animation, so it is the one place a scroll handler may set state — and it
     only sets it when the nearest card actually changes. */
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
      setActive((current) => (current === best ? current : best));
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
      <div className="container-x">
        <div ref={headRef} className="reveal is-cascade rv-up text-center">
          <span style={stagger(0)} className="tag reveal rv-pop">{dict.pricing.badge}</span>
          <SectionTitle id="pricing-title" center className="mt-4">{dict.pricing.title}</SectionTitle>
          <p style={stagger(1)} className="reveal rv-mask-up mx-auto mt-4 max-w-md text-ink-muted">{dict.pricing.body}</p>
          {/* The active period keeps a navy pill that slides between the two
              buttons: measured once per resize, then moved with a variable. */}
          <div ref={segRef} role="group" aria-label={dict.pricing.periodLabel}
            style={stagger(2)}
            className="seg reveal rv-fade mx-auto mt-6 flex w-full max-w-sm rounded-full border border-line bg-white p-1 text-sm font-bold sm:w-auto">
            <span aria-hidden="true" className="seg-ind rounded-full bg-navy" />
            {periods.map((o) => {
              const on = yearly === o.v;
              return (
                <button key={o.l} type="button" aria-pressed={on} onClick={() => setYearly(o.v)}
                  className={`pressable relative min-h-11 flex-1 rounded-full px-3 py-1 leading-5 transition-colors sm:flex-none sm:px-4 ${on ? "text-white" : "text-navy"}`}>
                  <span className="relative">{o.l}</span>
                </button>
              );
            })}
          </div>
          <p style={stagger(3)} className="reveal rv-fade mt-4 text-xs text-ink-muted/80 lg:hidden">{dict.pricing.scrollHint}</p>
        </div>
        <ul ref={trackRef} role="list" tabIndex={0} aria-labelledby="pricing-title"
          className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2 pt-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-x-visible lg:px-0 lg:pb-0 lg:pt-0">
          {plans.map((p, i) => (
            <PlanCard key={p.id} plan={p} i={i} yearly={yearly} fmt={fmt} dict={dict} />
          ))}
        </ul>
        {/* One absolutely positioned pill, moved by index. No measuring needed
            because every dot is the same size. */}
        <div role="group" aria-label={dict.pricing.dotsLabel} className="relative mt-6 flex items-center justify-center gap-1 lg:hidden">
          <span
            aria-hidden="true"
            style={vars({ "--tx": `${sign * Math.max(active, 0) * step}px` })}
            className="dots-ind block h-2.5 w-7 rounded-full bg-brand"
          />
          {plans.map((p, i) => (
            <button key={p.id} type="button" onClick={() => centerCard(i)}
              aria-label={dict.pricing.goToPlan.replace("{name}", p.name)}
              aria-current={active === i ? "true" : undefined}
              className="pressable grid size-11 place-items-center">
              {active === i ? (
                <span className="sr-only">{p.name}</span>
              ) : (
                <span className="block size-2.5 rounded-full bg-navy/25" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}