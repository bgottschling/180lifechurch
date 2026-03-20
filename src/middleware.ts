import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "preview_auth";

export function middleware(request: NextRequest) {
  // Skip if password protection is disabled
  if (process.env.PREVIEW_PASSWORD_ENABLED !== "true") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Allow access to login page, API routes, static files, and Next.js internals
  if (
    pathname === "/login" ||
    pathname === "/checklist" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname === "/favicon.ico" ||
    pathname === "/apple-touch-icon.png" ||
    pathname === "/icon-192.png" ||
    pathname === "/icon-512.png"
  ) {
    return NextResponse.next();
  }

  // Check for valid auth cookie
  const authCookie = request.cookies.get(COOKIE_NAME);
  if (authCookie?.value === "authenticated") {
    return NextResponse.next();
  }

  // Redirect to login
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
