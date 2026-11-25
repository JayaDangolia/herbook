import { NextResponse } from "next/server";
import { createSessionToken, recordAuditLog, UserRole } from "@/lib/auth";

// Known demonstration pilot accounts for testing
const DEMO_ACCOUNTS: Record<string, { id: string; name: string; role: UserRole; pass: string }> = {
  "rhea@example.com": {
    id: "usr-demo-101",
    name: "Rhea Deshmukh",
    role: "user",
    pass: "HerBook@2026",
  },
  "doctor@herbook.in": {
    id: "doc-allo-1",
    name: "Dr. Ananya Sharma",
    role: "doctor",
    pass: "DoctorCare@2026",
  },
  "admin@herbook.in": {
    id: "admin-herbook-1",
    name: "Pooja Varma (Clinical Admin)",
    role: "admin",
    pass: "AdminSecret#2026",
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, mfaCode } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Validation Error", message: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const account = DEMO_ACCOUNTS[cleanEmail];

    // Password validation
    if (!account || account.pass !== password) {
      recordAuditLog({
        actorId: "anonymous",
        actorRole: "user",
        action: "AUTH_LOGIN_FAILED",
        details: `Failed login attempt for email: ${cleanEmail}`,
      });

      return NextResponse.json(
        { error: "Invalid Credentials", message: "Incorrect email or password." },
        { status: 401 }
      );
    }

    // Role-based Multi-Factor Authentication requirement for Doctors and Admins
    const requiresMfa = account.role === "admin" || account.role === "doctor";
    const isMfaProvided = mfaCode === "123456" || !requiresMfa;

    if (requiresMfa && !isMfaProvided) {
      return NextResponse.json(
        {
          requiresMfa: true,
          message: "MFA challenge required. Please provide the 6-digit TOTP verification code.",
        },
        { status: 200 }
      );
    }

    const sessionUser = {
      id: account.id,
      name: account.name,
      email: cleanEmail,
      role: account.role,
      isMfaVerified: requiresMfa,
    };

    const token = await createSessionToken(sessionUser);

    recordAuditLog({
      actorId: account.id,
      actorRole: account.role,
      action: "AUTH_LOGIN_SUCCESS",
      details: `Successful authenticated login for ${account.name} (${account.role}). MFA Verified: ${requiresMfa}`,
    });

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
      message: "Authentication successful.",
    });

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
