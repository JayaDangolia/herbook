import { describe, it, expect } from "vitest";
import { middleware } from "../middleware";
import { NextRequest } from "next/server";
import { createSessionToken } from "../lib/auth";

function createMockRequest(path: string, options: { cookie?: string; method?: string; role?: string } = {}) {
  const url = `https://herbook-india.vercel.app${path}`;
  const req = new NextRequest(url, {
    method: options.method || "GET",
    headers: {
      host: "herbook-india.vercel.app",
      ...(options.cookie ? { cookie: `herbook_session=${options.cookie}` } : {}),
    },
  });
  return req;
}

describe("Global Authentication & Route Protection Suite", () => {
  describe("1. Unauthenticated Request Blocking & Redirection", () => {
    const protectedRoutes = [
      "/",
      "/profile",
      "/reels",
      "/community",
      "/track",
      "/consult",
      "/records",
      "/pcos",
      "/shop",
      "/learn",
      "/admin",
      "/post/post-soc-1",
    ];

    protectedRoutes.forEach((route) => {
      it(`redirects unauthenticated visitor from '${route}' to '/login'`, async () => {
        const req = createMockRequest(route);
        const res = await middleware(req);

        // Expect 307 or 308 redirect
        expect([307, 308]).toContain(res.status);
        const location = res.headers.get("location") || "";
        expect(location).toContain("/login");
        if (route !== "/") {
          expect(location).toContain(`next=${encodeURIComponent(route)}`);
        }
      });
    });
  });

  describe("2. Public Route Exceptions (Accessible Without Authentication)", () => {
    const publicRoutes = [
      "/login",
      "/register",
      "/forgot-password",
      "/privacy",
      "/terms",
      "/safety",
      "/guidelines",
      "/help",
      "/account-deletion",
    ];

    publicRoutes.forEach((route) => {
      it(`permits unauthenticated access to public page '${route}' without redirecting to login`, async () => {
        const req = createMockRequest(route);
        const res = await middleware(req);

        // Public page should not redirect to /login
        const location = res.headers.get("location");
        expect(location).toBeNull();
        expect(res.status).toBe(200);
      });
    });
  });

  describe("3. Authenticated Access & Home Feed Entry", () => {
    it("allows authenticated user with valid session cookie to access Home feed ('/')", async () => {
      const validToken = await createSessionToken({
        id: "usr-test-101",
        name: "Test User",
        email: "test@herbook.in",
        role: "user",
        isMfaVerified: false,
      });

      const req = createMockRequest("/", { cookie: validToken });
      const res = await middleware(req);

      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    });

    it("redirects authenticated user away from '/login' back to Home feed ('/')", async () => {
      const validToken = await createSessionToken({
        id: "usr-test-101",
        name: "Test User",
        email: "test@herbook.in",
        role: "user",
        isMfaVerified: false,
      });

      const req = createMockRequest("/login", { cookie: validToken });
      const res = await middleware(req);

      expect([307, 308]).toContain(res.status);
      const location = res.headers.get("location") || "";
      expect(location).toBe("https://herbook-india.vercel.app/");
    });
  });

  describe("4. API Security & Role-Based Authorization Gates", () => {
    it("rejects unauthenticated API requests to private endpoints with 401 Unauthorized", async () => {
      const privateApiEndpoints = [
        "/api/posts",
        "/api/cycle/periods",
        "/api/records",
        "/api/user/profile",
      ];

      for (const endpoint of privateApiEndpoints) {
        const req = createMockRequest(endpoint);
        const res = await middleware(req);

        expect(res.status).toBe(401);
        const body = await res.json();
        expect(body.error).toBe("Unauthorized");
      }
    });

    it("blocks ordinary user role from accessing '/admin' and '/api/admin/users'", async () => {
      const userToken = await createSessionToken({
        id: "usr-ordinary-user",
        name: "Ordinary User",
        email: "ordinary@herbook.in",
        role: "user",
        isMfaVerified: false,
      });

      // Try calling admin API
      const apiReq = createMockRequest("/api/admin/users", { cookie: userToken });
      const apiRes = await middleware(apiReq);
      expect(apiRes.status).toBe(403);
      const apiBody = await apiRes.json();
      expect(apiBody.error).toBe("Forbidden");

      // Try opening admin page
      const pageReq = createMockRequest("/admin", { cookie: userToken });
      const pageRes = await middleware(pageReq);
      expect([307, 308]).toContain(pageRes.status);
      expect(pageRes.headers.get("location")).toBe("https://herbook-india.vercel.app/");
    });

    it("allows verified administrator to access '/admin'", async () => {
      const adminToken = await createSessionToken({
        id: "usr-admin-001",
        name: "Admin User",
        email: "admin@herbook.in",
        role: "admin",
        isMfaVerified: false,
      });

      const req = createMockRequest("/admin", { cookie: adminToken });
      const res = await middleware(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    });
  });

  describe("5. HTTP Security Headers & Media CSP", () => {
    it("enforces strict security headers and media-src for video playback", async () => {
      const req = createMockRequest("/login");
      const res = await middleware(req);

      const csp = res.headers.get("Content-Security-Policy") || "";
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("media-src 'self' https: blob: data:");
      expect(res.headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
      expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(res.headers.get("Strict-Transport-Security")).toContain("max-age=31536000");
    });
  });
});
