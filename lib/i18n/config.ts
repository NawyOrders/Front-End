export const locales = ["ar", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export const localeDir: Record<Locale, "rtl" | "ltr"> = { ar: "rtl", en: "ltr" };

export const localeLabel: Record<Locale, string> = { ar: "العربية", en: "English" };

export const localeTag: Record<Locale, string> = { ar: "ar-EG", en: "en-US" };

export const localeNumber: Record<Locale, string> = { ar: "ar-EG", en: "en-US" };

export const LOCALE_COOKIE = "locale";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

/**
 * The locale of the current path, or null off a localized route.
 *
 * Anchor links are spread across components that only receive the dictionary,
 * not the locale. The path already carries the answer, so it is read from there
 * rather than threading a prop through every call site.
 */
export function localeFromPathname(pathname: string): Locale | null {
  const first = pathname.split("/")[1] ?? "";
  return isLocale(first) ? first : null;
}
