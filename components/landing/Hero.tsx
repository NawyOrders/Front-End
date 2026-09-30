"use client";

import { m } from "motion/react";
import type { Dictionary } from "@/lib/i18n";
import {
  blurIn,
  cardMotion,
  cardText,
  driftLoop,
  fadeUp,
  floatLoop,
  lineStagger,
  popIn,
  pressable,
  scaleIn,
  shadowPopHover,
  shadowSoftHover,
  staggerContainer,
  viewport,
} from "@/lib/motion";
import { CountUp } from "./CountUp";
import { MLink } from "./MLink";
import { PhoneMockup } from "./PhoneMockup";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-16">
      <m.div
        aria-hidden="true"
        animate={driftLoop(26, 16)}
        className="absolute inset-x-0 bottom-0 h-2/3 rounded-t-[50%] bg-beige/60"
      />
      <m.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="container-x relative grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2"
      >
        <m.div variants={staggerContainer}>
          <m.span className="tag" variants={popIn}>{dict.hero.badge}</m.span>
          <m.h1 id="hero-title" variants={lineStagger} className="h-display mt-4">
            <m.span className="block" variants={fadeUp}>{dict.hero.titleLead}</m.span>
            <m.span className="block text-brand" variants={scaleIn}>{dict.hero.titleAccent}</m.span>
          </m.h1>
          <m.p className="mt-4 max-w-lg text-base text-ink-muted sm:text-lg" variants={blurIn}>{dict.hero.body}</m.p>
          <m.div className="mt-8 flex flex-wrap gap-3" variants={fadeUp}>
            <MLink href="#contact" {...pressable} className="btn-primary">{dict.hero.ctaPrimary}</MLink>
            <MLink href="#showcase" {...pressable} className="btn-ghost">{dict.hero.ctaSecondary}</MLink>
          </m.div>
          <m.dl className="mt-12 flex flex-wrap gap-x-8 gap-y-6" variants={staggerContainer}>
            {dict.stats.map((s, i) => (
              <m.div
                key={s.label}
                variants={cardMotion(shadowSoftHover, 0.05, i * 0.08)}
                initial="hidden"
                whileInView="show"
                whileHover="hover"
                whileTap="tap"
                viewport={viewport}
                className="rounded-xl leading-tight"
              >
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl font-extrabold text-navy"><CountUp value={s.value} /></dd>
                <m.dd variants={cardText} className="mt-1 text-xs leading-relaxed text-ink-muted">{s.label}</m.dd>
              </m.div>
            ))}
          </m.dl>
        </m.div>
        <m.div variants={fadeUp} className="flex justify-center lg:justify-start" style={{ perspective: 1200 }}>
          <m.div
            variants={cardMotion(shadowPopHover)}
            initial="hidden"
            whileInView="show"
            whileHover="hover"
            whileTap="tap"
            viewport={viewport}
            className="rounded-[2rem]"
          >
            <m.div
              animate={floatLoop(0.4)}
              whileHover={{ rotateY: 7, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <PhoneMockup dict={dict} alt={dict.showcase.mockupAlt} className="w-48 sm:w-56 lg:w-64" />
            </m.div>
          </m.div>
        </m.div>
      </m.div>
    </section>
  );
}
