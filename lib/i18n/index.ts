import { ar } from "./ar";
import { defaultLocale, isLocale, type Locale } from "./config";
import type { Dictionary } from "./dictionary";
import { en } from "./en";

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export { defaultLocale, isLocale, locales, localeDir, localeLabel, localeTag, localeNumber, otherLocale, LOCALE_COOKIE } from "./config";
export type { Dictionary, Plan, Card } from "./dictionary";
export type { Locale } from "./config";
