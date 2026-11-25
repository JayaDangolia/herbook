import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await db.users.findByEmail(cleanEmail);

    if (user) {
      recordAuditLog({
        actorId: user.id,
        actorRole: user.role,
        action: "PASSWORD_RECOVERY_REQUESTED",
        details: `Password reset link requested for ${user.email}.`,
      });
    }

    // Always return success for security (prevents user enumeration)
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, password recovery instructions have been sent.",
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
