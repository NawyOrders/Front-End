export const site = {
  name: "ناوي أوردر",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nawy-order.example",
  // Point this at the real customer app / login when it exists.
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "#contact",
  // Google Form that collects restaurant leads. Drives the "open the form" link.
  // Keep the default in sync with scripts/generate-qr.mjs, which encodes the same
  // URL into public/lead-form-qr.svg — re-run `npm run qr` if you change it.
  leadFormUrl:
    process.env.NEXT_PUBLIC_LEAD_FORM_URL ??
    "https://docs.google.com/forms/d/e/1FAIpQLScDm5tezfgnuxaY7plEFX2tJ0FHOi5cnnESBv9w6jsVG_i4mg/viewform",
  description:
    "أطلق تطبيق مطعمك بهويتك البصرية في 48 ساعة من غير كتابة سطر كود، واستقبل الأوردرات مباشرة من غير عمولات تطبيقات التوصيل.",
} as const;
