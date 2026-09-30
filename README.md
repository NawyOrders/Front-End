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

Motion is the only animation library (`motion/react`, loaded through `LazyMotion` in `components/landing/MotionRoot.tsx`, which also sets `MotionConfig reducedMotion="user"` on top of the CSS reset in `globals.css`). The bundle is `domMax` rather than `domAnimation` because the pricing period pill and the mobile plan dot are `layoutId` elements, and layout projection does not ship in `domAnimation`. Always use `m.*`, never `motion.*`, and keep shared timings in `lib/motion.ts` instead of restating them per component.

The vocabulary in `lib/motion.ts` covers the whole page: entrances (`fadeUp`, `fadeIn`, `scaleIn`, `fadeDown`, `blurIn`, `popIn`, `starPop`), cascades (`staggerContainer`, `lineStagger`, the `stagger(each, delay)` factory, `staggerList`/`listRow` for feature rows, `cardText` for copy inside a card), the card pattern (`cardMotion`, `cardLift`, `cardPress`, the three hover shadows), controls (`pressable`, `pressableVariants`, `ruleVariants`, `markVariants`, `globeSpin`, `iconHover`), ambience (`floatLoop` for the phones, `driftLoop` for the hero shape, `marqueeTrack` + `marqueeTransition`) and the `prefersReducedMotion()` guard for JavaScript-driven motion only.

Sections follow one pattern: a `staggerContainer` element with `initial="hidden" whileInView="show" viewport={viewport}` and non-controlling children (`variants` only, no `initial`/`animate`/`whileInView` of their own). Two rules cause almost every bug here:

- A child that carries a variant *label* (`initial="hidden"`, `whileHover="hover"`, …) is "controlling": it is dropped from its parent's variant tree, so it never receives the parent's `"show"`. Cards therefore own their reveal — `cardMotion(boxShadow, each, delay)` + `initial="hidden" whileInView="show" whileHover="hover" whileTap="tap" viewport={viewport}` — and the per-index `delay` restores the cascade the section container used to provide. A container that only wants a hover label must use an object target (`whileHover={{ … }}`) instead of a string, or it will stop revealing its children.
- Children of that card react to its hover for free (`iconHover`, `cardText`), including grandchildren — the `"hover"` label is resolved through the whole variant tree, which is how the pricing check icons tilt when the plan card is hovered. Give such a child a `rest` value for every property it changes in `hover` (see `pressableVariants`); a variant key with no properties animates nothing and the element stays transformed after the pointer leaves.

Reveal thresholds are per component, not global: `viewport` is a quarter-visible default, but the mobile plan scroller only ever peeks its neighbouring cards ~10% into view, so `Pricing` passes `{ once: true, amount: 0.05 }` there or those two cards stay invisible while their edges sit on screen. The marquee is the one place that drives `animate()` imperatively (`useAnimate` + `useAnimation` controls are not enough: `LegacyAnimationControls` has no `play()`), so it pauses on pointer-enter and resumes on pointer-leave, and skips the animation entirely under reduced motion. Any rule that animates `scaleX` needs an inline `transformOrigin` — Tailwind's `origin-left` is physical, but these rules should grow from the inline-start edge, which is the right-hand side in Arabic.

Per-element delays belong in the variant's own `transition.delay`, which wins over the stagger delay the parent passes down.

Client components (only where interaction is needed): MotionRoot, MLink, SectionTitle, CountUp, PageTransition, Navbar, LanguageSwitcher, Logo, Hero, Showcase, Marquee, Problems, Solution, Features, Pricing, Testimonials, FAQ, FinalCTA, Footer. `app/[locale]/layout.tsx` and `app/[locale]/page.tsx` stay server components.
