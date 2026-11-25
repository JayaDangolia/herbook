import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, checkRateLimit } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Enforce Strict Security HTTP Headers across all responses
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
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

  // 2. Sliding-Window Rate Limiting for API Endpoints
  if (pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimitKey = `api_${ip}_${pathname.split("/")[2] || "root"}`;

    const { allowed, remaining, resetTime } = checkRateLimit(rateLimitKey, 60, 60 * 1000);

    response.headers.set("X-RateLimit-Limit", "60");
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

  // 3. Server-Side Protection for Sensitive Admin & Doctor Endpoints
  const sessionCookie = request.cookies.get("herbook_session")?.value;

  if (pathname.startsWith("/api/admin/")) {
    if (!sessionCookie) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized", message: "Admin authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const session = await verifySessionToken(sessionCookie);
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return new NextResponse(
        JSON.stringify({ error: "Forbidden", message: "Privileged administrator role required" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
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
