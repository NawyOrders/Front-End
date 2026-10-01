import { ar } from "./ar";
import { defaultLocale, isLocale, type Locale } from "./config";
import type { Dictionary } from "./dictionary";
import { en } from "./en";

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export { defaultLocale, isLocale, locales, localeDir, localeLabel, localeTag, localeNumber, otherLocale, localeFromPathname, LOCALE_COOKIE } from "./config";
export { SECTION_KEYS } from "./dictionary";
export type { Dictionary, Plan, Card, SectionKey } from "./dictionary";
export type { Locale } from "./config";
export { decodeHash, hashFor, keyForHash, keyForSlug, slugFor, translateHash, isForeignHash } from "./anchors";
