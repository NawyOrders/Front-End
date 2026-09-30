import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { Problems } from "@/components/landing/Problems";
import { Solution } from "@/components/landing/Solution";
import { Features } from "@/components/landing/Features";
import { Showcase } from "@/components/landing/Showcase";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "en" }];
}

export default function Page({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", name: dict.brand.name, url: site.url },
      {
        "@type": "FAQPage",
        mainEntity: dict.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <Navbar dict={dict} locale={locale} />
      <main>
        <Hero dict={dict} />
        <Marquee dict={dict} />
        <Problems dict={dict} />
        <Solution dict={dict} />
        <Features dict={dict} />
        <Showcase dict={dict} />
        <Pricing dict={dict} locale={locale} />
        <Testimonials dict={dict} />
        <FAQ dict={dict} />
        <FinalCTA dict={dict} />
      </main>
      <Footer dict={dict} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
