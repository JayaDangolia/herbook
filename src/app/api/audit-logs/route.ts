import { NextResponse } from "next/server";
import { verifySessionToken, getAuditLogs } from "@/lib/auth";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/herbook_session=([^;]+)/);
  const token = match ? match[1] : null;

  // Verify session
  let actorRole: any = "user";
  if (token) {
    const session = await verifySessionToken(token);
    if (session) {
      actorRole = session.role;
    }
  }

  // Allow in development or for admin roles
  const logs = getAuditLogs(actorRole === "admin" || actorRole === "superadmin" ? actorRole : undefined);
  return NextResponse.json({ success: true, count: logs.length, logs });
}
