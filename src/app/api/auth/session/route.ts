import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/herbook_session=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const sessionUser = await verifySessionToken(token);
    if (!sessionUser) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    // Retrieve fresh user record from database
    const dbUser = await db.users.findById(sessionUser.id);
    if (!dbUser) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    if (dbUser.status === "suspended") {
      return NextResponse.json(
        { authenticated: false, user: null, message: "Account is suspended" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        username: dbUser.username,
        email: dbUser.email,
        role: dbUser.role,
        avatarUrl: dbUser.avatarUrl,
        bio: dbUser.bio,
        status: dbUser.status,
        isEmailVerified: dbUser.isEmailVerified,
        createdAt: dbUser.createdAt,
      },
    });
  } catch (err) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}
