import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Alexandria } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeDir, localeTag, locales, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { MotionRoot } from "@/components/landing/MotionRoot";
import "../globals.css";
// Imported after globals.css so the motion layer wins on the few selectors it
// shares with it (.fan-stage, .card, .btn).
import "../../src/styles/motion.css";

const cairoArabic = localFont({
  src: [
    { path: "../fonts/cairo-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cairo-arabic-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/cairo-arabic-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/cairo-arabic-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-cairo-arabic",
  display: "swap",
});
const cairoLatin = localFont({
  src: [
    { path: "../fonts/cairo-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cairo-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/cairo-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/cairo-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-cairo-latin",
  display: "swap",
});
const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-alexandria",
});

export const viewport: Viewport = { themeColor: "#FFF7EA", width: "device-width", initialScale: 1 };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = (isLocale(params.locale) ? params.locale : "ar") as Locale;
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.title, template: dict.meta.titleTemplate },
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { "ar-EG": "/ar", "en-US": "/en", "x-default": "/ar" },
    },
    openGraph: {
      type: "website",
      locale: localeTag[locale],
      url: `/${locale}`,
      siteName: dict.brand.name,
      title: dict.meta.ogTitle,
      description: dict.meta.description,
    },
    twitter: { card: "summary_large_image", title: dict.brand.name, description: dict.meta.description },
  };
}

export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();

  return (
    <html lang={params.locale} dir={localeDir[params.locale]} className={`${cairoArabic.variable} ${cairoLatin.variable} ${alexandria.variable}`}>
      <body>
        <MotionRoot>{children}</MotionRoot>
      </body>
    </html>
  );
}
