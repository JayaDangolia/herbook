import { NextResponse } from "next/server";
import { recordAuditLog, verifySessionToken } from "@/lib/auth";
import { doctorApplicationsQueue } from "@/lib/doctorStore";

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/herbook_session=([^;]+)/);
    const token = match ? match[1] : null;

    let actor: { id: string; name: string; role: any } = {
      id: "admin-herbook-1",
      name: "Pooja Varma (Clinical Admin)",
      role: "admin",
    };
    if (token) {
      const session = await verifySessionToken(token);
      if (session) {
        actor = session;
      }
    }

    const body = await request.json();
    const { applicationId, status, verificationSource, reviewNotes } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: "Validation Error", message: "Application ID and target status are required." },
        { status: 400 }
      );
    }

    // Valid state transitions
    const validStatuses = [
      "Applied",
      "Documents Submitted",
      "Under Review",
      "Verified",
      "Rejected",
      "More Information Required",
      "Active",
      "Suspended",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid Status", message: `Status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // If verifying, require verificationSource
    if ((status === "Verified" || status === "Active") && !verificationSource) {
      return NextResponse.json(
        {
          error: "Verification Source Mandatory",
          message: "Statutory medical compliance requires recording the official verification source (e.g., NMC Register, NCISM Register, or State Council Record).",
        },
        { status: 400 }
      );
    }

    const application = doctorApplicationsQueue.find((app) => app.id === applicationId);
    if (!application) {
      return NextResponse.json(
        { error: "Not Found", message: `Application ${applicationId} not found in verification queue.` },
        { status: 404 }
      );
    }

    const previousStatus = application.status;
    application.status = status;
    application.reviewedBy = actor.name;
    application.reviewedAt = new Date().toISOString();
    application.verificationSource = verificationSource || application.verificationSource;
    application.reviewNotes = reviewNotes || application.reviewNotes;

    recordAuditLog({
      actorId: actor.id,
      actorRole: actor.role,
      action: "DOCTOR_VERIFICATION_STATE_CHANGE",
      targetId: application.id,
      targetType: "DoctorApplication",
      details: `Doctor ${application.legalName} (${application.registrationNumber}) status transitioned from '${previousStatus}' to '${status}' by reviewer ${actor.name}. Source: ${application.verificationSource || "N/A"}. Notes: ${application.reviewNotes || "None"}`,
    });

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      doctorName: application.legalName,
      status: application.status,
      reviewedBy: application.reviewedBy,
      reviewedAt: application.reviewedAt,
      verificationSource: application.verificationSource,
      message: `Doctor verification updated to '${status}'. Audit entry permanently logged.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal Error", message: err.message }, { status: 500 });
  }
}
