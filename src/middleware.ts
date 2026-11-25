import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, checkRateLimit } from "./lib/auth";

// Public routes that unauthenticated users can access
const PUBLIC_EXACT_ROUTES = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/privacy",
  "/terms",
  "/guidelines",
  "/help",
  "/safety",
  "/account-deletion",
  "/manifest.json",
  "/favicon.ico",
]);

const PUBLIC_PREFIXES = [
  "/_next",
  "/api/auth/",
  "/static",
  "/icons",
  "/images",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Enforce Strict Security HTTP Headers across all responses
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; media-src 'self' https: blob: data:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
  );
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(self), geolocation=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  response.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");

  // Bypass static files and Next.js internal bundles
  const isStaticFile = pathname.includes(".") && !pathname.endsWith(".html");
  if (isStaticFile || PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return response;
  }

  // 2. Sliding-Window Rate Limiting for API Endpoints
  if (pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimitKey = `api_${ip}_${pathname.split("/")[2] || "root"}`;

    const { allowed, remaining, resetTime } = checkRateLimit(rateLimitKey, 100, 60 * 1000);

    response.headers.set("X-RateLimit-Limit", "100");
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", resetTime.toString());

    if (!allowed) {
      return new NextResponse(
        JSON.stringify({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please wait a minute before retrying.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
          },
        }
      );
    }
  }

  // 3. Verify Server-Side Session Cookie
  const sessionCookie = request.cookies.get("herbook_session")?.value;
  const session = sessionCookie ? await verifySessionToken(sessionCookie) : null;
  const isAuthenticated = !!session;

  const isPublicRoute =
    PUBLIC_EXACT_ROUTES.has(pathname) ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // 4. Redirect Authenticated Users Away From Login/Signup to Home Feed
  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    const nextUrl = request.nextUrl.searchParams.get("next") || "/";
    const redirectUrl = new URL(nextUrl.startsWith("/") ? nextUrl : "/", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 5. Global Route Protection: Unauthenticated Users are Blocked & Redirected
  if (!isAuthenticated && !isPublicRoute) {
    // If request is an API call, return 401 Unauthorized
    if (pathname.startsWith("/api/")) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
          message: "Authentication required to access HerBook services.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        }
      );
    }

    // If request is a page navigation, redirect to /login
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("next", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 6. Role-Based Route Protection (Admin Console & API)
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin/")) {
    if (!isAuthenticated || (session.role !== "admin" && session.role !== "superadmin")) {
      if (pathname.startsWith("/api/")) {
        return new NextResponse(
          JSON.stringify({
            error: "Forbidden",
            message: "Privileged administrator role required.",
          }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, images, favicon
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
