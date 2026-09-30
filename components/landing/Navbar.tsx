"use client";

import { AnimatePresence, m, useScroll } from "motion/react";
import { useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localeDir } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import { EASE_OUT, fadeDown, menuItem, pressable, pressableVariants, ruleVariants, springSoft, staggerContainer } from "@/lib/motion";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { MLink } from "./MLink";

const links = (nav: Dictionary["nav"]) => [
  { href: "#top", label: nav.home },
  { href: "#features", label: nav.features },
  { href: "#how", label: nav.how },
  { href: "#pricing", label: nav.pricing },
  { href: "#showcase", label: nav.showcase },
  { href: "#faq", label: nav.faq },
];

/* Three rules that morph into one X: the top and bottom rules travel to the
   middle and counter-rotate, the middle rule collapses. Same 24px box and the
   same navy as the static icon it replaces. */
const glyphLines = [
  { y: 6, rotate: 45, scaleX: 1, opacity: 1 },
  { y: 6, rotate: 0, scaleX: 0, opacity: 0 },
  { y: 6, rotate: -45, scaleX: 1, opacity: 1 },
];

export function Navbar({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const items = links(dict.nav);
  /* Both the progress rule and the hover rules grow from the inline-start edge,
     which is the right-hand side in Arabic. */
  const ruleOrigin = localeDir[locale] === "rtl" ? "right" : "left";
  return (
    <m.header
      variants={fadeDown}
      initial="hidden"
      animate="show"
      className="sticky top-0 z-50 border-b border-line/70 bg-cream/90 backdrop-blur"
    >
      {/* Reading progress: a single rule whose scale tracks document scroll, so
          it needs no scroll listener of its own. */}
      <m.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0.5 bg-brand"
        style={{ scaleX: scrollYProgress, transformOrigin: ruleOrigin }}
      />
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo dict={dict} />
        <nav aria-label={dict.nav.mainLabel} className="hidden lg:block">
          <ul className="flex  items-center gap-1">
            {items.map((l, i) => (
              <li key={l.href}>
                <MLink
                  href={l.href}
                  variants={pressableVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className={`relative rounded-lg px-3 py-2 text-lg font-sans leading-6 transition hover:text-brand ${i === 0 ? "bg-navy text-white hover:text-white" : "text-navy"}`}
                >
                  {l.label}
                  {i > 0 && (
                    <m.span
                      aria-hidden="true"
                      variants={ruleVariants}
                      className="absolute inset-x-3 bottom-1 h-px bg-current"
                      style={{ transformOrigin: ruleOrigin }}
                    />
                  )}
                </MLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher dict={dict} locale={locale} />
          <MLink href={site.appUrl} {...pressable} className="btn-ghost hidden !min-h-10 !px-4 sm:inline-flex">
            {dict.nav.login}
          </MLink>
          <m.button
            type="button"
            {...pressable}
            className="grid size-11 place-items-center rounded-xl text-navy lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <m.span className="relative block size-6" aria-hidden="true">
              {glyphLines.map((g, i) => (
                <m.span
                  key={i}
                  className="absolute inset-x-0 top-1/2 block h-0.5 rounded-full bg-navy"
                  initial={false}
                  animate={open ? g : { y: i * 6, rotate: 0, scaleX: 1, opacity: 1 }}
                  transition={springSoft}
                />
              ))}
            </m.span>
          </m.button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <m.nav
            id="mobile-nav"
            aria-label={dict.nav.mobileLabel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE_OUT }}
            className="overflow-hidden border-t border-line bg-cream lg:hidden"
          >
            <m.ul variants={staggerContainer} initial="hidden" animate="show" className="container-x flex flex-col py-3">
              {items.map((l) => (
                <m.li key={l.href} variants={menuItem}>
                  <MLink href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-3 text-base font-semibold leading-7 text-navy">
                    {l.label}
                  </MLink>
                </m.li>
              ))}
              <m.li variants={menuItem} className="pt-2">
                <MLink href={site.appUrl} {...pressable} className="btn-primary w-full">
                  {dict.nav.login}
                </MLink>
              </m.li>
            </m.ul>
          </m.nav>
        )}
      </AnimatePresence>
    </m.header>
  );
}
