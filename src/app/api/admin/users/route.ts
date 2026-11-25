import { NextResponse } from "next/server";
import { verifySessionToken, recordAuditLog } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/herbook_session=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden: Admin credentials required." }, { status: 403 });
    }

    const url = new URL(request.url);
    const query = (url.searchParams.get("q") || "").toLowerCase().trim();
    const roleFilter = url.searchParams.get("role");
    const statusFilter = url.searchParams.get("status");

    const allUsers = await db.users.findMany();

    const filtered = allUsers
      .filter((u) => {
        if (query && !u.name.toLowerCase().includes(query) && !u.email.toLowerCase().includes(query) && !u.username.toLowerCase().includes(query)) {
          return false;
        }
        if (roleFilter && roleFilter !== "all" && u.role !== roleFilter) {
          return false;
        }
        if (statusFilter && statusFilter !== "all" && u.status !== statusFilter) {
          return false;
        }
        return true;
      })
      .map((u) => ({
        id: u.id,
        name: u.name,
        username: u.username,
        email: u.email,
        role: u.role,
        status: u.status,
        isEmailVerified: u.isEmailVerified,
        avatarUrl: u.avatarUrl,
        createdAt: u.createdAt,
      }));

    return NextResponse.json({
      success: true,
      totalCount: allUsers.length,
      users: filtered,
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/herbook_session=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden: Admin credentials required." }, { status: 403 });
    }

    const body = await request.json();
    const { userId, action, role, status } = body;

    if (!userId) {
      return NextResponse.json({ error: "Target userId is required." }, { status: 400 });
    }

    const targetUser = await db.users.findById(userId);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Prevent suspending the superadmin account
    if (targetUser.id === "usr-admin-001" && (status === "suspended" || action === "suspend")) {
      return NextResponse.json({ error: "Cannot suspend root administrator." }, { status: 400 });
    }

    const updates: any = {};
    if (action === "suspend") updates.status = "suspended";
    else if (action === "restore") updates.status = "active";
    else if (status) updates.status = status;

    if (role && ["user", "doctor", "creator", "moderator", "admin"].includes(role)) {
      updates.role = role;
    }

    const updated = await db.users.update(userId, updates);

    recordAuditLog({
      actorId: session.id,
      actorRole: session.role,
      action: `ADMIN_USER_UPDATE_${action ? action.toUpperCase() : "GENERAL"}`,
      targetId: userId,
      targetType: "user",
      details: `Administrator @${session.name} updated user @${targetUser.username} (${targetUser.email}): ${JSON.stringify(updates)}`,
    });

    return NextResponse.json({
      success: true,
      message: `User @${targetUser.username} successfully updated.`,
      user: updated,
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
