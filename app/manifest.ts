import type { MetadataRoute } from "next";
import { defaultLocale, getDictionary, localeDir } from "@/lib/i18n";

/* The two brand values the manifest is built from. Both are the real tokens in
   tailwind.config.ts: navy is the theme, cream is the page background. */
const CREAM = "#FFF7EA";
const NAVY = "#0F2A47";

/* One manifest for the whole site, at the root, so the browser only ever sees
   one install target. The app is routed under /[locale], so start_url pins the
   default locale (middleware.ts redirects "/" to /{locale}, but an installed
   app should not depend on a cookie or on Accept-Language to find its start
   page) and lang/dir describe the locale that path actually renders. */
const dict = getDictionary(defaultLocale);

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: dict.meta.title,
    short_name: dict.brand.name,
    description: dict.meta.description,
    start_url: `/${defaultLocale}`,
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: defaultLocale,
    dir: localeDir[defaultLocale],
    background_color: CREAM,
    theme_color: NAVY,
    categories: ["business", "food"],
    icons: [
      { src: "/icons/icon-192.png?v=4", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png?v=4", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png?v=4", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
