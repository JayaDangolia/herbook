import { NextResponse } from "next/server";
import { getFeatureFlags } from "@/lib/featureFlags";
import { createSessionToken, recordAuditLog } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const flags = getFeatureFlags();
    if (!flags.publicRegistration) {
      return NextResponse.json(
        {
          error: "Public Registration Gate Active",
          message: "HerBook is currently operating in controlled alpha pilot mode. Public registration is restricted to authorized invite-only cohorts.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Validation Error", message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid Email", message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Password complexity: minimum 8 characters, at least 1 digit, 1 special char
    if (password.length < 8 || !/\d/.test(password)) {
      return NextResponse.json(
        {
          error: "Weak Password",
          message: "Password must be at least 8 characters long and contain at least one numeric digit.",
        },
        { status: 400 }
      );
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: "user" as const,
      isMfaVerified: false,
    };

    const token = await createSessionToken(newUser);

    recordAuditLog({
      actorId: newUser.id,
      actorRole: newUser.role,
      action: "USER_REGISTER",
      details: `New account registered for ${newUser.email} with standard privacy defaults.`,
    });

    const response = NextResponse.json(
      { success: true, user: newUser },
      { status: 201 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set("herbook_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error", message: err.message },
      { status: 500 }
    );
  }
}
