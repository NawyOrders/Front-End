import type { Locale } from "@/lib/i18n/config";
import { ar } from "@/lib/i18n/ar";
import { en } from "@/lib/i18n/en";
import { SECTION_KEYS, type SectionKey } from "@/lib/i18n/dictionary";

/**
 * Localized in-page anchors.
 *
 * A section's URL fragment is a translation like any other string: the Arabic
 * page uses `#المميزات` and the English page `#features`. Both dictionaries
 * expose the same `sections` keys, so a fragment can always be resolved back
 * to the KEY it stands for — which is what makes these two behaviours
 * possible without a hard-coded lookup table of slug pairs:
 *
 *   • switching language while on a section keeps the reader on that section,
 *     because the key survives the translation and only the text changes;
 *   • an old link (an English `#features` opened on the Arabic page, or the
 *     reverse) still lands in the right place, because the incoming fragment is
 *     matched against BOTH languages before giving up.
 *
 * Everything here is pure: no DOM, no window, safe to call during render.
 */

/** The dictionaries, keyed by locale, for the two supported languages. */
const SLUGS: Record<Locale, Record<SectionKey, string>> = {
  ar: ar.sections,
  en: en.sections,
};

/**
 * Read a fragment as plain text.
 *
 * Browsers percent-encode non-ASCII fragments, so `location.hash` for
 * `#المميزات` arrives as `#%D8%A7%D9%84%D9%85%D9%85%D9%8A%D8%B2%D8%A7%D8%AA`. A
 * malformed fragment (a lone `%`, a truncated paste) makes `decodeURIComponent`
 * throw, and a hash navigation must never be the thing that breaks the page —
 * so the raw value is returned unchanged and the lookup simply misses.
 */
export function decodeHash(hash: string): string {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/** The key a slug belongs to in one language, or null if it belongs to neither. */
export function keyForSlug(slug: string, locale: Locale): SectionKey | null {
  const table = SLUGS[locale];
  for (const key of SECTION_KEYS) {
    if (table[key] === slug) return key;
  }
  return null;
}

/**
 * The key a fragment stands for, in this language or the other one.
 *
 * Checking the current language first means a correctly-localized fragment
 * resolves without a rewrite; only a foreign fragment falls through to the
 * second lookup.
 */
export function keyForHash(hash: string, locale: Locale): SectionKey | null {
  const slug = decodeHash(hash);
  if (!slug) return null;
  return keyForSlug(slug, locale) ?? keyForSlug(slug, locale === "ar" ? "en" : "ar");
}

/** `#المميزات` in the given language, for a key. */
export function hashFor(key: SectionKey, locale: Locale): string {
  return `#${SLUGS[locale][key]}`;
}

/** The element id for a key: the slug itself, so `id` and `href` never drift. */
export function slugFor(key: SectionKey, locale: Locale): string {
  return SLUGS[locale][key];
}

/**
 * The same fragment in the other language, by key.
 *
 * `null` when the fragment is empty or names nothing the page knows, which is
 * the signal for the caller to leave the URL untouched.
 */
export function translateHash(hash: string, locale: Locale): string | null {
  const key = keyForHash(hash, locale);
  return key ? hashFor(key, locale === "ar" ? "en" : "ar") : null;
}

/**
 * `true` when a fragment is readable but belongs to the other language, so the
 * URL should be canonicalised with `replaceState` (no extra history entry).
 */
export function isForeignHash(hash: string, locale: Locale): boolean {
  const slug = decodeHash(hash);
  return !!slug && keyForSlug(slug, locale) === null && keyForSlug(slug, locale === "ar" ? "en" : "ar") !== null;
}
