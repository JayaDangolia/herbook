import { NextResponse } from "next/server";
import { db, hashPassword } from "@/lib/db";
import { recordAuditLog } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "Invalid Request", message: "Email and a valid password (minimum 8 characters) are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await db.users.findByEmail(cleanEmail);

    if (!user) {
      return NextResponse.json(
        { error: "Account Not Found", message: "No account found with this email." },
        { status: 404 }
      );
    }

    const { hash, salt } = hashPassword(newPassword);
    await db.users.update(user.id, {
      passwordHash: hash,
      salt: salt,
    });

    recordAuditLog({
      actorId: user.id,
      actorRole: user.role,
      action: "PASSWORD_RESET_COMPLETED",
      details: `Password updated successfully for @${user.username}.`,
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
