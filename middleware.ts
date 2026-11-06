import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const segment = request.nextUrl.pathname.split("/")[1];
  const locale = ["tr", "en", "zh", "ar"].includes(segment) ? segment : "tr";
  const headers = new Headers(request.headers);
  headers.set("x-marble-locale", locale);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next|market|.*\\..*).*)"],
};
