# ناوي أوردر - Landing page

Next.js 14 (App Router) + TypeScript + Tailwind CSS 3. Arabic (RTL) and English (LTR).

    npm install
    npm run dev      # http://localhost:3000
    npm run build && npm start

Routes are locale-prefixed: `/ar` (default) and `/en`. `app/[locale]/layout.tsx` is the root layout so `<html lang dir>` is correct per locale. `middleware.ts` redirects bare paths using cookie `locale`, then `Accept-Language`, then `defaultLocale`; `/api/*` and static files are excluded.

All copy lives in `lib/i18n/`. `dictionary.ts` is the contract and `en.ts` is typed `Dictionary`, so **a missing English key fails `tsc`**. Components receive `dict` as a prop rather than a client context; `Pricing` also takes `locale` for number formatting. To add a language, extend `locales` / `localeDir` / `localeLabel` / `localeTag` / `localeNumber` in `lib/i18n/config.ts`, add the dictionary file, and register it in `lib/i18n/index.ts`.

Fonts:
- Cairo — the global body font, bundled locally in `app/fonts` (no external requests).
- Alexandria — section headings only, loaded via `next/font/google` (fetched at build time, then self-hosted; no runtime requests). Apply with the `font-alexandria` class; `globals.css` wires it into `.h-section` and `.h-display`.
- Heading scale — two classes only, `.h-display` (hero) and `.h-section` (every section title). Both use arbitrary `text-[…]` values on purpose: Tailwind's `text-3xl`…`text-5xl` utilities ship a paired `line-height: 1`, which collides Arabic ascenders and descenders. Keep the explicit `leading-[1.35]`.
- Heading letter spacing — `--heading-tracking` in `app/globals.css`, set to `0`. Arabic is cursive, so a non-zero value visibly breaks the joins between letters.
- Spacing scale — column gaps `gap-10`; heading to body copy `mt-4`; header block to first content block `mt-12`; action group after a paragraph `mt-8`; section padding `py-16 sm:py-24`. Prefer these over arbitrary values.
- Mobile plan scroller — the pricing `<ul>` is a horizontal snap scroller below `md` (`w-[85%]` cards, `snap-x snap-mandatory`, edge-to-edge via `-mx-5 sm:-mx-8`, scrollbar hidden by the `.no-scrollbar` component class) and falls back to `md:grid-cols-3` from `md` up. Two consequences: any `md:` reset added to a card must also clear `w`/`max-w`/`shrink`, and the scroller carries `pt-4` because `overflow-x-auto` also clips vertically — without it the featured card's `-top-3` badge is cut off. It is `tabIndex={0}` with `role="list"` so keyboard users can scroll it; `dict.pricing.scrollHint` labels the swipe on mobile only. `scroll-snap` and flex direction are logical, so RTL needs no extra handling.

Lead capture / QR code:
- The final CTA has no inline form. It shows a QR code plus an "Open the form" button, both pointing at the Google Form.
- `lib/site.ts` → `leadFormUrl` (`NEXT_PUBLIC_LEAD_FORM_URL`) is the link behind the button.
- `public/lead-form-qr.svg` is a **generated** file. It is a plain SVG, square, on white, with a 4-module quiet zone — all required for reliable scanning. Regenerate it whenever the form link changes:

      npm run qr            # rewrites public/lead-form-qr.svg
      npm run qr:verify     # re-encodes and decodes it with an independent decoder (jsQR)

- If you override `NEXT_PUBLIC_LEAD_FORM_URL`, pass the same value to `npm run qr` so the code and the button stay in sync.
- Keep the QR square and on a light background; do not add rounded corners or overlay a logo without raising the error-correction level.

Where to plug in the real product:
- `lib/site.ts`: `NEXT_PUBLIC_APP_URL` (login/app URL), `NEXT_PUBLIC_SITE_URL` (canonical/OG), `NEXT_PUBLIC_LEAD_FORM_URL` (QR + CTA button).
- `lib/i18n/ar.ts` + `lib/i18n/en.ts`: all copy, prices, FAQ, testimonials (placeholder text taken from the screenshot).

There is **no animation library**. Everything is CSS plus a little browser plumbing:

- `src/styles/motion.css` — the whole vocabulary. Imported once, after `globals.css`, from `app/[locale]/layout.tsx`.
- `lib/motion/runtime.ts` — three page-wide listeners, all outside React: **one** `IntersectionObserver` for every reveal on the site (`threshold: 0.2`, `rootMargin: 0px 0px -10% 0px`, once-only then `unobserve`), **one** passive scroll + `requestAnimationFrame` pass that writes `--scroll` and `--p`, and **one** passive `pointermove` pass that writes `--mx` / `--my` for the card spotlight.
- `lib/motion/hooks.ts` — the React surface: `useReveal`, `useCountUp`, `useParallax`, `useMouseTilt`, `usePresence`, `useSlidingIndicator`, `useScrollProgress`, `useCardSpotlight`, plus the `stagger(i)` and `vars({…})` style helpers. Each returns a ref and nothing else.

How a reveal works: a `.reveal` element plus one variant class describes the **hidden start state only** (`.rv-up` is just `translate3d(0,40px,0)`). `.reveal.is-in` is the single visible end state, so a variant never has to know about its siblings, and `.is-cascade.is-in .reveal` replays that end state for a container's own children — one observer entry reveals a whole headline, card or column, each child still staggered by its own `--i` (`transition-delay: calc(var(--i, 0) * 90ms)`).

The variants are `.rv-fade`, `.rv-up`, `.rv-down`, `.rv-start`, `.rv-end`, `.rv-zoom`, `.rv-zoom-out`, `.rv-blur`, `.rv-rotate`, `.rv-flip`, `.rv-mask-up`, `.rv-mask-side`, `.rv-pop`. Anything that repeats on a grid cycles three of them instead of one (`CARD_VARIANTS` in `Features`, `Pricing` and `Testimonials`), so a section never looks like one animation played four times.

Rules worth knowing before you touch it:

- Only `transform`, `opacity`, `filter`, `clip-path` and the standalone `translate` / `scale` / `rotate` properties are animated. Nothing animates `width`, `height`, `top`, `left`, margin or padding — the segmented pill and the nav underline used to animate width and now draw with `scaleX` instead.
- Card hover uses the standalone `translate` / `scale` so `transform` stays free for the reveal variant. Buttons use the same trick (`.btn`).
- Any rule that animates `scaleX` needs the inline-start origin, not Tailwind's physical `origin-left`: `[dir="rtl"]` flips `transform-origin` for `.rv-start`, `.rv-end`, `.rv-mask-side`, `.u-draw::after`, `.accent-bar`, `.nav-rule` and `.progress-bar`.
- The phone fan splits its transforms across two elements: `translate` on `.fan-phone` is the scroll-driven opening and is deliberately **not** transitioned (it would lag the scroll it reads), `transform` is the entrance and hover lift. The idle float and the cursor tilt share one keyframe track on the inner `.fan-float`, so `--rx` / `--ry` compose with the float instead of overwriting it, and each phone's `--d` gives it its own tilt parallax depth.
- Touch, coarse pointers and `<768px` get no tilt, spotlight or parallax: those are gated in CSS by `(hover: hover) and (pointer: fine) and (min-width: 768px)` and in JS by `canPointFine()`.
- Reduced motion keeps short fades and drops everything else — floats, parallax, tilt, masks, flips, the marquee, the pulse and the shimmer. `globals.css` has the global reset; `motion.css` overrides what must survive it so nothing is ever stranded at `opacity: 0`.
- The mobile menu and the FAQ panel stay mounted through their exit (`usePresence` + `onTransitionEnd`) instead of unmounting mid-animation, which is what `AnimatePresence` used to do.
- The mobile plan carousel gives each card its **own** observer, so a card that is still off to the side has not been revealed yet and slides in as it is scrolled to. The active period pill is measured once per resize by `useSlidingIndicator` (`--px` / `--pw`) instead of a `layoutId`; the plan dots need no measuring because every dot is the same size.
- Marquee: one duplicated list on a single CSS loop, with `animation-direction: reverse` in RTL.

Client components (only where interaction is needed): MotionRoot, MLink, SectionTitle, HeadlineWords, CountUp, PageTransition, Navbar, LanguageSwitcher, Logo, Hero, Showcase, Problems, Solution, Features, Pricing, Testimonials, FAQ, FinalCTA, Footer. `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`, `Marquee`, `PhoneMockup` and `Icon` stay plain modules — the first two are server components and the last three need no client boundary at all.
