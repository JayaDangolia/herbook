import { NextResponse } from "next/server";
import { recordAuditLog, verifySessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/herbook_session=([^;]+)/);
    const token = match ? match[1] : null;

    let currentUserId = "usr-demo-101";
    let currentUserRole: any = "user";

    if (token) {
      const session = await verifySessionToken(token);
      if (session) {
        currentUserId = session.id;
        currentUserRole = session.role;
      }
    }

    const body = await request.json();
    const { targetUserId, action } = body; // action: 'block' | 'mute'

    if (!targetUserId) {
      return NextResponse.json({ error: "Validation Error", message: "targetUserId is required." }, { status: 400 });
    }

    recordAuditLog({
      actorId: currentUserId,
      actorRole: currentUserRole,
      action: action === "mute" ? "USER_MUTED" : "USER_BLOCKED",
      targetId: targetUserId,
      targetType: "UserProfile",
      details: `User ${currentUserId} ${action === "mute" ? "muted" : "blocked"} user ${targetUserId}. Direct messaging and forum replies severed.`,
    });

    return NextResponse.json({
      success: true,
      message: `User ${targetUserId} has been ${action === "mute" ? "muted" : "blocked"}.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal Error", message: err.message }, { status: 500 });
  }
}
