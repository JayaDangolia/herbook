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
        details: `User session terminated cleanly for ${session.email}`,
      });
    }
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.delete("herbook_session");
  return response;
}
