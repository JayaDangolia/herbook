import { NextResponse } from "next/server";
import { verifySessionToken, recordAuditLog } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/herbook_session=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required to access Health Records Vault.", records: [] },
        { status: 401 }
      );
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session", records: [] }, { status: 401 });
    }

    // Filter records strictly by authenticated userId (IDOR Prevention)
    const records = await db.healthRecords.findByUserId(session.id);
    return NextResponse.json({ success: true, records });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load health records", records: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/herbook_session=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, type, date, notes } = body;

    if (!title || !type) {
      return NextResponse.json({ error: "Title and document type are required" }, { status: 400 });
    }

    const newRecord = await db.healthRecords.create({
      userId: session.id,
      title: title.trim(),
      type: type,
      date: date || new Date().toISOString().split("T")[0],
      fileUrl: `/api/records/vault-${Date.now()}/file`,
      fileSize: "1.8 MB (PDF)",
      sharedWithDoctorIds: [],
      notes: notes || "",
    });

    recordAuditLog({
      actorId: session.id,
      actorRole: session.role,
      action: "HEALTH_RECORD_UPLOADED",
      targetId: newRecord.id,
      targetType: "health_record",
      details: `Medical document '${newRecord.title}' (${newRecord.type}) uploaded to encrypted vault.`,
    });

    return NextResponse.json({ success: true, record: newRecord }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/herbook_session=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const recordId = url.searchParams.get("id");

    if (!recordId) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }

    const deleted = await db.healthRecords.delete(recordId, session.id);
    if (!deleted) {
      return NextResponse.json({ error: "Record not found or access denied" }, { status: 404 });
    }

    recordAuditLog({
      actorId: session.id,
      actorRole: session.role,
      action: "HEALTH_RECORD_DELETED",
      targetId: recordId,
      targetType: "health_record",
      details: `Document deleted under DPDP Right to Erasure.`,
    });

    return NextResponse.json({ success: true, message: "Record deleted permanently." });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}
