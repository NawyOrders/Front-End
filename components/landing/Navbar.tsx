"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { SectionKey } from "@/lib/i18n/dictionary";
import { site } from "@/lib/site";
import { stagger, usePresence, vars } from "@/lib/motion/hooks";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { MLink, resolveFragmentTarget, writeFragment } from "./MLink";
import { scrollToFragment } from "./scrollToFragment";

/* One list drives the desktop bar and the mobile panel. `key` is the section id
   suffix, `navKey` the label in `dict.nav` — they differ only for the first one,
   which is labelled "home" in both languages but anchors to the hero. */
const NAV_ITEMS = [
  { key: "top", navKey: "home" },
  { key: "features", navKey: "features" },
  { key: "how", navKey: "how" },
  { key: "pricing", navKey: "pricing" },
  { key: "showcase", navKey: "showcase" },
  { key: "faq", navKey: "faq" },
] as const satisfies readonly { key: SectionKey; navKey: keyof Dictionary["nav"] }[];

/* The href is built from the dictionary rather than written as a literal, so the
   fragment is localized like any other string. */
const links = (dict: Dictionary) =>
  NAV_ITEMS.map((item) => ({ key: item.key, href: `#${dict.sections[item.key]}`, label: dict.nav[item.navKey] }));

/* Three rules that morph into one X, in the same 24px box and the same navy as
   the static icon it replaces. The state lives on the button's aria-expanded,
   so the three lines are pure CSS. */
export function Navbar({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const { mounted, exiting, onExitEnd } = usePresence(open, 420);
  const items = links(dict);

  /* The mobile panel is a `height: 0 -> auto` collapse INSIDE the sticky
     header, so while it is open the whole page sits lower by its height. Two
     things follow from that.

     First, the click must NOT scroll immediately: MLink would measure the
     document while the panel is still 389px tall and land short by exactly that
     much once it collapses. So the click writes the URL and stores the target,
     and the scroll is deferred.

     Second, "deferred until the panel is closed" cannot be read off React
     state. `usePresence` unmounts on its own 420ms timer while the collapse
     transition is `--dur` (800ms), so `mounted === false` arrives while the
     panel still occupies most of its height, and waiting for it reproduces the
     same off-by-the-panel-height landing. The panel is therefore MEASURED: the
     observer fires on the transition's own frames and the scroll goes out on
     the first frame where the panel is actually flat. That is also the right
     moment under reduced motion, where the collapse is instant. */
  const [pendingFragment, setPendingFragment] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = panel.current;
    const fragment = pendingFragment;
    if (!node || !fragment || open) return;

    const finish = () => {
      if (node.getBoundingClientRect().height > 1) return;
      observer.disconnect();
      setPendingFragment(null);
      scrollToFragment(`#${fragment}`);
    };

    const observer = new ResizeObserver(finish);
    observer.observe(node);
    finish();
    return () => observer.disconnect();
  }, [open, pendingFragment]);

  /* `preventDefault` on a delegated handler still stops MLink's own handler,
     which runs the same event: it checks `defaultPrevented` before touching the
     URL or the scroll. So this one function owns the whole mobile behaviour. */
  const closeFor = (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.button !== 0) return;
    const target = resolveFragmentTarget(href, locale);
    if (!target) return;
    event.preventDefault();
    writeFragment(target.fragment, target.mode);
    setPendingFragment(target.fragment);
    setOpen(false);
  };

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
        data-reveal
        style={vars({ "--stagger": "40ms" })}
        className="reveal is-cascade rv-down sticky top-0 z-50 border-b border-line/70 bg-cream/90 backdrop-blur"
      >
        {/* Reading progress: a single rule whose scale tracks --scroll. */}
        <span aria-hidden="true" className="progress-bar bg-brand" />
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Logo dict={dict} locale={locale} />
          <nav aria-label={dict.nav.mainLabel} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {items.map((l, i) => (
                <li key={l.key} style={stagger(i + 1)} className="reveal rv-fade">
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
            <span style={stagger(7)} className="reveal rv-fade flex items-center gap-2">
              <LanguageSwitcher dict={dict} locale={locale} />
              <MLink href={site.appUrl} className="btn-ghost hidden !min-h-10 !px-4 sm:inline-flex">
                {dict.nav.login}
              </MLink>
            </span>
            <button
              type="button"
              style={stagger(8)}
              className="pressable reveal rv-fade grid size-11 place-items-center rounded-xl text-navy lg:hidden"
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
          ref={panel}
          data-open={mounted && !exiting ? "true" : "false"}
          onTransitionEnd={onExitEnd}
          {...(open ? {} : ({ inert: "" } as Record<string, string>))}
          className="collapse border-t border-line bg-cream lg:hidden"
        >          <div>
            <ul className="container-x flex flex-col py-3">
              {items.map((l, i) => (
                <li key={l.key} className="collapse-item" style={stagger(i)}>
                  <MLink
                    href={l.href}
                    onClick={closeFor(l.href)}
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
      {/* Tapping the backdrop dismisses without navigating, so nothing is
          pending and no re-scroll happens. */}
      <div aria-hidden="true" onClick={() => setOpen(false)} className="backdrop" data-open={open ? "true" : "false"} />
    </>
  );
}