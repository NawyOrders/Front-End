import type { Dictionary } from "@/lib/i18n";

const items = (dict: Dictionary) => [...dict.marquee.restaurants, ...dict.marquee.restaurants];

export function Marquee({ dict }: { dict: Dictionary }) {
  return (
    <section
      aria-label={dict.marquee.label}
      className="marquee overflow-hidden border-y border-line bg-cream-100 py-4"
    >
      {/* One duplicated list on a single CSS loop: the track moves, and
          :hover pauses it without unmounting anything. Reduced motion never
          starts it. */}
      <ul className="marquee-track flex w-max gap-10 whitespace-nowrap px-5 text-sm font-bold leading-snug text-navy sm:text-base">
        {items(dict).map((r, i) => (
          <li key={i} aria-hidden={i >= dict.marquee.restaurants.length} className="flex items-center gap-2">
            <span className="mq-dot size-1.5 rounded-full bg-brand" aria-hidden="true" />
            {r}
          </li>
        ))}
      </ul>
    </section>
  );
}