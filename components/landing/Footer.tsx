"use client";

import type { Dictionary } from "@/lib/i18n";
import { stagger } from "@/lib/motion/hooks";
import { InstallPrompt } from "./InstallPrompt";
import { Logo } from "./Logo";
import { MLink } from "./MLink";
import { FoodDecor, type DecorPiece } from "./SectionTitle";

/* Background food, blurred down to shadows. The footer is the one place with no
   section wrapper, so `relative` is the only thing added to it; the pieces work
   the outer margins of the four-column grid. */
const decor: DecorPiece[] = [
  { src: "/image%206.png", w: 136, h: 91, side: "start", top: 10,  dx: -0.05 , size: 1.05, rot: -8, drift: 5, lift: -12, blur: 4, op: 0.24, dur: 8.8, delay: -3.8, par: -14 },
  { src: "/image%209.png", w: 184, h: 125, side: "end", top: 46,  dx: -0.05 , size: 0.95, rot: 6, drift: 6, lift: -10, blur: 5, op: 0.2, dur: 10, delay: -6.2, par: -9 },
  /* The last piece of the last section on the page. `top` has to stay high here:
     the shared reveal observer shrinks its root by 10% at the bottom, and no
     later content will ever scroll this piece back up into range, so anything
     below that line would sit at opacity 0 forever. The margin is sized against
     a tall viewport, which is the tightest case. */
  { src: "/image%204.png", w: 111, h: 77, side: "end", top: 52,  dx: 0.04 , size: 0.85, rot: -11, drift: 4, lift: -13, blur: 2, op: 0.3, dur: 7.5, delay: -2, par: -17, tier: "md" },
];

const socials: { key: keyof Dictionary["footer"]["social"]; d: string }[] = [
  { key: "linkedin", d: "M6 9h3v10H6V9Zm1.500-5a1.800 1.800 0 1 1 0 3.600 1.800 1.800 0 0 1 0-3.600ZM11 9h2.900v1.400c.5-.9 1.600-1.700 3.200-1.700 3 0 3.900 1.900 3.900 4.700V19h-3v-5c0-1.300-.3-2.300-1.700-2.300S14 12.700 14 14v5h-3V9Z" },
  { key: "twitter", d: "M20 7.500c-.6.3-1.200.4-1.800.5.700-.4 1.200-1 1.400-1.800-.6.400-1.300.6-2 .8a3.200 3.200 0 0 0-5.500 2.900A9 9 0 0 1 5.600 6.600a3.200 3.200 0 0 0 1 4.300c-.5 0-1-.2-1.400-.4 0 1.500 1.100 2.800 2.600 3.100-.5.100-.9.100-1.400.1.400 1.300 1.600 2.200 3 2.200A6.400 6.400 0 0 1 4 17.200 9 9 0 0 0 8.900 18.600c5.900 0 9.200-5 9-9.500.6-.4 1.600-1 2.100-1.600Z" },
  { key: "instagram", d: "M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Zm4 4.500a3.500 3.500 0 1 0 0 7 3.500 3.500 0 0 0 0-7Zm4.500-2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" },
  { key: "facebook", d: "M13.500 20v-7h2.300l.4-2.800h-2.700V8.500c0-.8.300-1.400 1.400-1.400h1.400V4.600c-.3 0-1.100-.1-2.100-.1-2.100 0-3.500 1.300-3.500 3.600v2.100H8.400V13h2.300v7h2.800Z" },
];

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer data-reveal className="reveal rv-fade relative border-t border-line bg-cream-100 pt-16">
      <FoodDecor pieces={decor} />
      <div data-reveal className="is-cascade container-x relative grid gap-12 pb-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo dict={dict} />
          <p style={stagger(1)} className="reveal rv-fade mt-4 max-w-xs text-sm text-ink-muted">{dict.footer.tagline}</p>
          {/* Renders null until the browser says the app is installable, so it
              only ever adds a row inside this column. */}
          <InstallPrompt dict={dict} />
        </div>
        {dict.footer.columns.map((c, n) => (
          <nav key={c.title} style={stagger(1 + n)} aria-label={c.title} className="reveal rv-fade">
            <h2 className="text-base font-extrabold text-navy">{c.title}</h2>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              {c.links.map((l, k) => (
                <li key={l} style={stagger(2 + k)} className="reveal rv-fade">
                    <MLink href={`#${dict.sections.top}`} className="hover:text-brand">{l}</MLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div data-reveal className="reveal is-cascade rv-fade relative border-t border-line py-6">
        <div className="container-x flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-ink-muted">{dict.footer.copyright.replace("{name}", dict.brand.name)}</p>
          <ul className="flex gap-2">
            {socials.map((s, i) => (
              <li key={s.key} style={stagger(i)} className="reveal rv-pop">
                <a
                    href={`#${dict.sections.top}`}
                    aria-label={dict.footer.social[s.key]}
                  className="pressable grid size-10 place-items-center rounded-full bg-navy text-white transition-colors hover:bg-brand"
                >
                  <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true"><path d={s.d} fill="currentColor" /></svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}