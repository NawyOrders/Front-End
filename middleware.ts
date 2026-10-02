import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";

function fromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .filter((e) => Number.isFinite(e.q))
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const alreadyLocalised = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (alreadyLocalised) {
    const response = NextResponse.next();
    const active = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))!;
    if (req.cookies.get(LOCALE_COOKIE)?.value !== active) {
      response.cookies.set(LOCALE_COOKIE, active, { path: "/", maxAge: 31536000, sameSite: "lax" });
    }
    return response;
  }

  const saved = req.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(saved) ? saved : fromAcceptLanguage(req.headers.get("accept-language")) ?? defaultLocale;

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)"],
};
