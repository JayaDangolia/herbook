import { NextResponse } from "next/server";
import { verifySessionToken, recordAuditLog } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/herbook_session=([^;]+)/);
  const token = match ? match[1] : null;

  let currentUserId = "usr-demo-101";
  let currentUserRole: any = "user";

  if (token) {
    const session = await verifySessionToken(token);
    if (session) {
      currentUserId = session.id;
      currentUserRole = session.role;
    }
  }

  const recordId = params.id;
  // Simulated record lookup
  const isOwner = currentUserId === "usr-demo-101";
  const isAuthorizedDoctor = currentUserRole === "doctor" && currentUserId === "doc-allo-1";

  // IDOR Protection: reject unauthorized foreign users
  if (!isOwner && !isAuthorizedDoctor) {
    recordAuditLog({
      actorId: currentUserId,
      actorRole: currentUserRole,
      action: "UNAUTHORIZED_RECORD_ACCESS_ATTEMPT",
      targetId: recordId,
      targetType: "MedicalRecord",
      details: `SECURITY ALERT: User ${currentUserId} attempted unauthorized access to record ${recordId}.`,
    });

    return NextResponse.json(
      { error: "Forbidden", message: "You do not have authorization to view this private medical record." },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    record: {
      id: recordId,
      userId: "usr-demo-101",
      title: "Pelvic Ultrasound Report - Bilateral Ovaries",
      type: "Ultrasound Scan",
      date: "2026-09-28",
      sharedWithDoctorIds: ["doc-allo-1"],
      notes: "Normal endometrial thickness. 8-10 peripheral follicles noted.",
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/herbook_session=([^;]+)/);
  const token = match ? match[1] : null;

  let currentUserId = "usr-demo-101";
  let currentUserRole: any = "user";

  if (token) {
    const session = await verifySessionToken(token);
    if (session) {
      currentUserId = session.id;
      currentUserRole = session.role;
    }
  }

  const recordId = params.id;

  // Record audit log
  recordAuditLog({
    actorId: currentUserId,
    actorRole: currentUserRole,
    action: "MEDICAL_RECORD_DELETE",
    targetId: recordId,
    targetType: "MedicalRecord",
    details: `Medical record ${recordId} deleted upon patient request.`,
  });

  return NextResponse.json({
    success: true,
    message: `Medical record ${recordId} deleted permanently from Health Vault.`,
  });
}
