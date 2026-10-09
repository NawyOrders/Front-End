import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Alexandria } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeDir, localeTag, locales, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { MotionRoot } from "@/components/landing/MotionRoot";
import { RegisterSW } from "@/components/landing/RegisterSW";
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

export const viewport: Viewport = { themeColor: "#0F2A47", width: "device-width", initialScale: 1 };

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
    applicationName: dict.brand.name,
    appleWebApp: {
      capable: true,
      title: dict.brand.name,
      statusBarStyle: "default",
    },
    icons: {
      // The maskable icon is deliberately absent: `purpose` is a manifest-only
      // concept that Next 14's IconDescriptor does not model, and it is already
      // declared in app/manifest.ts where installability actually reads it.
      icon: [
        { url: "/icon.svg?v=4", type: "image/svg+xml" },
        { url: "/icons/icon-192.png?v=4", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png?v=4", sizes: "512x512", type: "image/png" },
      ],
      apple: { url: "/icons/apple-touch-icon.png?v=4", sizes: "180x180", type: "image/png" },
    },
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
        <RegisterSW />
        <MotionRoot>{children}</MotionRoot>
      </body>
    </html>
  );
}
