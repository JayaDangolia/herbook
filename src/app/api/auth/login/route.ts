import { NextResponse } from "next/server";
import { createSessionToken, recordAuditLog } from "@/lib/auth";
import { db, verifyPassword } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Validation Error", message: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await db.users.findByEmail(cleanEmail);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication Failed", message: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (user.status === "suspended") {
      return NextResponse.json(
        {
          error: "Account Suspended",
          message: "Your HerBook account has been suspended for safety or policy review. Please contact support@herbook.in.",
        },
        { status: 403 }
      );
    }

    const isMatch = verifyPassword(password, user.passwordHash, user.salt);
    if (!isMatch) {
      recordAuditLog({
        actorId: user.id,
        actorRole: user.role,
        action: "AUTH_LOGIN_FAILED",
        targetId: user.id,
        targetType: "user",
        details: `Failed password login attempt for ${user.email}.`,
      });

      return NextResponse.json(
        { error: "Authentication Failed", message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isMfaVerified: false,
    });

    recordAuditLog({
      actorId: user.id,
      actorRole: user.role,
      action: "AUTH_LOGIN_SUCCESS",
      targetId: user.id,
      targetType: "user",
      details: `User @${user.username} logged in successfully.`,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        status: user.status,
        isEmailVerified: user.isEmailVerified,
      },
    });

    response.cookies.set("herbook_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Login Error", message: "Could not process login. Please try again." },
      { status: 500 }
    );
  }
}
