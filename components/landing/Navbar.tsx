"use client";

import { useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { stagger, usePresence, useReveal } from "@/lib/motion/hooks";
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

/* Three rules that morph into one X, in the same 24px box and the same navy as
   the static icon it replaces. The state lives on the button's aria-expanded,
   so the three lines are pure CSS. */
export function Navbar({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const { mounted, exiting, onExitEnd } = usePresence(open, 420);
  const headerRef = useReveal<HTMLElement>();
  const items = links(dict.nav);

  // Escape closes the mobile menu, as a dialog-like panel should.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        ref={headerRef}
        className="reveal rv-down sticky top-0 z-50 border-b border-line/70 bg-cream/90 backdrop-blur"
      >
        {/* Reading progress: a single rule whose scale tracks --scroll. */}
        <span aria-hidden="true" className="progress-bar bg-brand" />
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Logo dict={dict} />
          <nav aria-label={dict.nav.mainLabel} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {items.map((l, i) => (
                <li key={l.href}>
                  <MLink
                    href={l.href}
                    className={`nav-link rounded-lg px-3 py-2 text-lg font-sans leading-6 transition hover:text-brand ${
                      i === 0 ? "bg-navy text-white hover:text-white" : "text-navy"
                    }`}
                  >
                    {l.label}
                    {/* The rule grows from the inline-start edge. */}
                    {i > 0 && <span aria-hidden="true" className="nav-rule" />}
                  </MLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher dict={dict} locale={locale} />
            <MLink href={site.appUrl} className="btn-ghost hidden !min-h-10 !px-4 sm:inline-flex">
              {dict.nav.login}
            </MLink>
            <button
              type="button"
              className="pressable grid size-11 place-items-center rounded-xl text-navy lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="burger" aria-hidden="true">
                <span className="burger-line" />
                <span className="burger-line" />
                <span className="burger-line" />
              </span>
            </button>
          </div>
        </div>
        {/* Height is never animated: grid-template-rows 0fr -> 1fr is. The
            panel stays mounted through its exit, then onTransitionEnd (or the
            usePresence timer, under reduced motion) unmounts it. */}
        <div
          id="mobile-nav"
          data-open={mounted && !exiting ? "true" : "false"}
          onTransitionEnd={onExitEnd}
          {...(open ? {} : ({ inert: "" } as Record<string, string>))}
          className="collapse border-t border-line bg-cream lg:hidden"
        >          <div>
            <ul className="container-x flex flex-col py-3">
              {items.map((l, i) => (
                <li key={l.href} className="collapse-item" style={stagger(i)}>
                  <MLink
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="pressable block rounded-lg px-2 py-3 text-base font-semibold leading-7 text-navy"
                  >
                    {l.label}
                  </MLink>
                </li>
              ))}
              <li className="collapse-item pt-2" style={stagger(items.length)}>
                <MLink href={site.appUrl} className="btn-primary w-full">
                  {dict.nav.login}
                </MLink>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Backdrop lives outside the header: the header is a sticky element with
          its own containing block, so a fixed child inside it would be clipped. */}
      <div aria-hidden="true" onClick={() => setOpen(false)} className="backdrop" data-open={open ? "true" : "false"} />
    </>
  );
}