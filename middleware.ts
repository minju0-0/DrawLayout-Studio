import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow next internals and API calls
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Protect the app editor and vault/account pages
  if (pathname.startsWith("/app") || pathname.startsWith("/vault") || pathname.startsWith("/account")) {
    try {
      const res = await fetch(`${req.nextUrl.origin}/api/auth/get-session`);
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          return NextResponse.next();
        }
      }
    } catch {
      // ignore and redirect
    }

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
