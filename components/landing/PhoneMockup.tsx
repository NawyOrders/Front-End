import { memo } from "react";
import type { Dictionary } from "@/lib/i18n";

type Tone = "warm" | "cool";

function Burger({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <ellipse cx="32" cy="54" rx="26" ry="5" fill="#000" opacity=".12" />
      <path d="M8 28c0-11 11-18 24-18s24 7 24 18H8Z" fill="#E08A2E" />
      <circle cx="20" cy="20" r="1.500" fill="#FBE3B0" /><circle cx="32" cy="16" r="1.500" fill="#FBE3B0" /><circle cx="44" cy="21" r="1.500" fill="#FBE3B0" />
      <path d="M6 30h52c0 3-3 4-6 4-3 0-3 2-6 2s-3-2-6-2-3 2-6 2-3-2-6-2-3 2-6 2-3-2-6-2c-3 0-6-1-6-4Z" fill="#7BB84A" />
      <rect x="8" y="35" width="48" height="8" rx="4" fill="#6B3A1F" />
      <path d="M8 43h48l-4 5H12l-4-5Z" fill="#F5C34A" />
      <path d="M10 48h44c0 4-4 6-22 6S10 52 10 48Z" fill="#D9822B" />
    </svg>
  );
}

function DishCard({ dict, tone }: { dict: Dictionary; tone: Tone }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-white p-1.5 shadow-sm ring-1 ring-black/5">
      <Burger className="size-9 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[7px] font-bold text-navy">{dict.mockup.dishName}</p>
        <p className="text-[10px] text-ink-muted">{dict.mockup.dishDesc}</p>
        <div className="mt-0.5 flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-navy">{dict.mockup.dishPrice}</span>
          <span className={`grid size-3.5 place-items-center rounded-full text-[8px] font-bold text-white ${tone === "warm" ? "bg-brand" : "bg-sky-500"}`}>+</span>
        </div>
      </div>
    </div>
  );
}

export const PhoneMockup = memo(function PhoneMockup({ dict, alt, tone = "warm", className = "" }: { dict: Dictionary; alt: string; tone?: Tone; className?: string }) {
  const accent = tone === "warm" ? "from-brand to-[#E4684A]" : "from-sky-500 to-cyan-400";
  const screen = tone === "warm" ? "bg-[#FFF8EE]" : "bg-[#EAF7FB]";
  return (
    <div className={`relative aspect-[9/18.5] rounded-[2rem] bg-navy p-[6px] shadow-pop ${className}`} role="img" aria-label={alt}>
      <div className={`flex h-full flex-col overflow-hidden rounded-[1.6rem] ${screen}`}>
        <div className="mx-auto mt-1.5 h-1.5 w-12 rounded-full bg-navy" />
        <div className="flex items-center justify-between px-3 pt-2 text-[8px] font-extrabold text-navy">
          <span aria-hidden="true">≡</span><span>{dict.mockup.myRestaurant}</span><span className="size-3 rounded-full bg-brand" />
        </div>
        <div className="px-3 pt-2">
          <p className="text-[10px] text-ink-muted">{dict.mockup.welcome}</p>
          <p className="text-[10px] font-extrabold leading-tight text-navy">{dict.mockup.greeting}</p>
        </div>
        <div className={`mx-3 mt-2 rounded-xl bg-gradient-to-l ${accent} p-2 text-white`}>
          <p className="text-[10px] opacity-90">{dict.mockup.promoLabel}</p>
          <p className="text-[11px] font-extrabold leading-tight">{dict.mockup.promoValue}</p>
          <span className="mt-1 inline-block rounded-md bg-white/90 px-1.5 text-[10px] font-bold text-navy">{dict.mockup.cta}</span>
        </div>
        <div className="mx-3 mt-2 rounded-md bg-white px-2 py-1 text-[12px] text-ink-muted ring-1 ring-black/5">{dict.mockup.search}</div>
        {/* <div className="mt-2 flex gap-1 px-3 text-[6px] font-semibold text-navy" aria-hidden="true">
          <span className="rounded-full bg-navy px-1.5 py-0.5 text-white">{dict.mockup.filterAll}</span>
          <span className="rounded-full bg-white px-1.5 py-0.5">{dict.mockup.filterBurger}</span>
          <span className="rounded-full bg-white px-1.5 py-0.5">{dict.mockup.filterPizza}</span>
        </div> */}
        <p className="mt-2 px-3 text-[12px] font-extrabold text-navy">{dict.mockup.newDishes}</p>
        <div className="mt-1 space-y-1.5 px-3 pb-3">
          <DishCard dict={dict} tone={tone} />
          <DishCard dict={dict} tone={tone} />
        </div>
        <div className="mt-1 space-y-1.5 px-3 pb-3">
          <DishCard dict={dict} tone={tone} />
          <DishCard dict={dict} tone={tone} />
          <DishCard dict={dict} tone={tone} />
        </div>
      </div>
    </div>
  );
});
