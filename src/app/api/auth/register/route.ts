import { NextResponse } from "next/server";
import { createSessionToken, recordAuditLog } from "@/lib/auth";
import { db, hashPassword } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, username, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Validation Error", message: "Full name, email address, and password are required." },
        { status: 400 }
      );
    }

    // Format and validate email
    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Invalid Email", message: "Please provide a valid email format (e.g., name@domain.com)." },
        { status: 400 }
      );
    }

    // Format or generate unique username
    let cleanUsername = (username || name.split(" ")[0] || "user")
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .trim();
    if (cleanUsername.length < 3) cleanUsername = `user_${Date.now().toString().slice(-4)}`;

    // Password complexity: minimum 8 characters, at least 1 digit
    if (password.length < 8 || !/\d/.test(password)) {
      return NextResponse.json(
        {
          error: "Weak Password",
          message: "Password must be at least 8 characters long and contain at least one numeric digit for regulatory security.",
        },
        { status: 400 }
      );
    }

    // Check if email already registered in database
    const existingUser = await db.users.findByEmail(cleanEmail);
    if (existingUser) {
      return NextResponse.json(
        { error: "Account Exists", message: "An account with this email address is already registered. Please log in." },
        { status: 409 }
      );
    }

    // Check if username taken; append random suffix if needed
    const existingUsername = await db.users.findByUsername(cleanUsername);
    if (existingUsername) {
      cleanUsername = `${cleanUsername}_${Math.floor(100 + Math.random() * 900)}`;
    }

    // Hash password with cryptographically secure PBKDF2
    const { hash, salt } = hashPassword(password);

    // Create persistent user record in database
    const newUser = await db.users.create({
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      passwordHash: hash,
      salt: salt,
      role: "user",
      status: "active",
      isEmailVerified: true, // Auto-verified in pilot launch
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanUsername)}`,
      bio: "Member of HerBook Women's Health & Wellness Community 🌸",
    });

    // Create cryptographically signed session token
    const token = await createSessionToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isMfaVerified: false,
    });

    recordAuditLog({
      actorId: newUser.id,
      actorRole: newUser.role,
      action: "USER_REGISTER",
      targetId: newUser.id,
      targetType: "user",
      details: `New user account created: @${newUser.username} (${newUser.email}).`,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Registration successful. Welcome to HerBook!",
        user: {
          id: newUser.id,
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          avatarUrl: newUser.avatarUrl,
          bio: newUser.bio,
          isEmailVerified: newUser.isEmailVerified,
        },
      },
      { status: 201 }
    );

    // Set secure, HTTP-only cookie with SameSite protection
    response.cookies.set("herbook_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Registration Failed", message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
