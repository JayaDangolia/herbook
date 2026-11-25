import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const posts = await db.posts.findAll();
    return NextResponse.json({ success: true, posts });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/herbook_session=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json({ error: "Authentication required to publish content." }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    const user = await db.users.findById(session.id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const body = await request.json();
    const { caption, category, mediaUrls, mediaType } = body;

    if (!caption) {
      return NextResponse.json({ error: "Post caption is required." }, { status: 400 });
    }

    const newPost = await db.posts.create({
      authorId: user.id,
      authorName: user.name,
      authorHandle: user.username,
      authorAvatar: user.avatarUrl,
      isVerified: user.role === "doctor" || user.role === "admin",
      caption: caption.trim(),
      category: category || "General Wellness",
      mediaType: mediaType || "image",
      mediaUrls: mediaUrls && mediaUrls.length > 0 ? mediaUrls : ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"],
    });

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
