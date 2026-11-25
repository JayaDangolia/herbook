import { NextResponse } from "next/server";
import { verifySessionToken, recordAuditLog } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

  const recordId = params.id;
  const userRecords = await db.healthRecords.findByUserId(session.id);
  const record = userRecords.find((r) => r.id === recordId);

  // IDOR Protection: reject unauthorized foreign users
  if (!record) {
    recordAuditLog({
      actorId: session.id,
      actorRole: session.role,
      action: "UNAUTHORIZED_RECORD_ACCESS_ATTEMPT",
      targetId: recordId,
      targetType: "MedicalRecord",
      details: `SECURITY ALERT: User ${session.id} attempted unauthorized access to record ${recordId}.`,
    });

    return NextResponse.json(
      { error: "Forbidden", message: "You do not have authorization to view this private medical record." },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    record,
  });
}
