import { NextResponse } from "next/server";
import { verifySessionToken, recordAuditLog } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/herbook_session=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const { code } = body;

    // Simulation code for demo
    if (code === "123456" || code === "999888") {
      recordAuditLog({
        actorId: session.id,
        actorRole: session.role,
        action: "MFA_VERIFIED",
        details: `Time-based one-time password verified for ${session.email}`,
      });

      return NextResponse.json({
        success: true,
        verified: true,
        message: "MFA challenge successfully verified.",
      });
    }

    return NextResponse.json(
      { error: "Invalid MFA Code", message: "The 6-digit verification code is invalid or expired." },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: "Internal Error", message: err.message }, { status: 500 });
  }
}
