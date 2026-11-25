import { NextResponse } from "next/server";
import { recordAuditLog, verifySessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/herbook_session=([^;]+)/);
  const token = match ? match[1] : null;

  if (token) {
    const session = await verifySessionToken(token);
    if (session) {
      recordAuditLog({
        actorId: session.id,
        actorRole: session.role,
        action: "AUTH_LOGOUT",
        targetId: session.id,
        targetType: "user",
        details: `User ${session.email} logged out cleanly.`,
      });
    }
  }

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  // Expire cookie
  response.cookies.set("herbook_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });

  return response;
}
