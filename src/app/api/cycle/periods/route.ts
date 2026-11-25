import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/herbook_session=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json({ error: "Authentication required to view private cycle records." }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    const periods = await db.periods.findByUserId(session.id);
    return NextResponse.json({ success: true, periods });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch cycle records" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/herbook_session=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    const body = await request.json();
    const { startDate, endDate, flow, symptoms, notes } = body;

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start and end dates are required." }, { status: 400 });
    }

    const newPeriod = await db.periods.create({
      userId: session.id,
      startDate,
      endDate,
      flow: flow || "medium",
      symptoms: symptoms || [],
      notes: notes || "",
    });

    return NextResponse.json({ success: true, period: newPeriod }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to log period" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/herbook_session=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const clearAll = url.searchParams.get("clearAll") === "true";

    if (clearAll) {
      const count = await db.periods.clearAllForUser(session.id);
      return NextResponse.json({ success: true, message: `Cleared ${count} period records.` });
    }

    if (!id) {
      return NextResponse.json({ error: "Period ID is required for deletion." }, { status: 400 });
    }

    const deleted = await db.periods.delete(id, session.id);
    if (!deleted) {
      return NextResponse.json({ error: "Period record not found or access denied." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Period record deleted." });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete period record" }, { status: 500 });
  }
}
