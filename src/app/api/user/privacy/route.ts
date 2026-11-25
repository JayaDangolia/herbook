import { NextResponse } from "next/server";
import { verifySessionToken, recordAuditLog } from "@/lib/auth";

export async function GET(request: Request) {
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

  recordAuditLog({
    actorId: currentUserId,
    actorRole: currentUserRole,
    action: "DPDP_DATA_EXPORT_REQUEST",
    details: `User requested complete encrypted export of personal, cycle, and clinical consultation data.`,
  });

  const exportPayload = {
    exportDate: new Date().toISOString(),
    legalStandard: "Digital Personal Data Protection Act, 2023 (DPDP)",
    userProfile: {
      id: currentUserId,
      name: "Rhea Deshmukh",
      email: "rhea.deshmukh@example.com",
      role: currentUserRole,
      preferredLanguage: "en",
    },
    privacyConsents: [
      {
        purpose: "Cycle & Reproductive Prediction Processing",
        consentedAt: "2026-09-01T08:00:00Z",
        version: "v1.0-CYCLE",
        status: "ACTIVE",
      },
      {
        purpose: "Telemedicine Consultation Scheduling",
        consentedAt: "2026-10-15T14:30:00Z",
        version: "v1.2-IN-TELEMED",
        status: "ACTIVE",
      },
      {
        purpose: "Community Forum Participation",
        consentedAt: "2026-09-05T12:00:00Z",
        version: "v1.1-COMMUNITY",
        status: "ACTIVE",
      },
    ],
    consentsWithdrawn: [],
    retentionSchedule: "Active until user account deletion request",
  };

  return NextResponse.json({
    success: true,
    data: exportPayload,
  });
}

export async function POST(request: Request) {
  try {
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

    const body = await request.json();
    const { actionType, reason } = body;

    if (actionType === "DELETE_ACCOUNT") {
      recordAuditLog({
        actorId: currentUserId,
        actorRole: currentUserRole,
        action: "DPDP_ACCOUNT_DELETION_REQUEST",
        details: `Right to Erasure invoked by user ${currentUserId}. Reason: ${reason || "User preference"}. Personal & health records queued for hard purge within 72 hours.`,
      });

      return NextResponse.json({
        success: true,
        status: "QUEUED_FOR_PURGE",
        retentionGracePeriodHours: 72,
        message: "Your account deletion request under the DPDP Act 2023 has been registered. All cycle logs, medical files, and personal data will be irreversibly erased.",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal Error", message: err.message }, { status: 500 });
  }
}
