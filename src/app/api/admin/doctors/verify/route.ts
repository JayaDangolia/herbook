import { NextResponse } from "next/server";
import { recordAuditLog, verifySessionToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/herbook_session=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Admin authentication required" },
        { status: 401 }
      );
    }

    const session = await verifySessionToken(token);
    if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
      return NextResponse.json(
        { error: "Forbidden", message: "Only authorized administrators may review doctor credentials." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { applicationId, status, verificationSource, reviewNotes } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: "Validation Error", message: "Application ID and target status are required." },
        { status: 400 }
      );
    }

    // If verifying, require statutory verificationSource
    if (status === "Verified" && !verificationSource) {
      return NextResponse.json(
        {
          error: "Verification Source Mandatory",
          message: "Statutory medical compliance requires recording the official verification source (e.g., NMC Register, NCISM Register, or State Council Record).",
        },
        { status: 400 }
      );
    }

    const updatedApp = await db.doctorApplications.updateStatus(
      applicationId,
      status,
      verificationSource,
      session.name || "Administrator",
      reviewNotes
    );

    if (!updatedApp) {
      return NextResponse.json(
        { error: "Not Found", message: `Application ${applicationId} not found in database.` },
        { status: 404 }
      );
    }

    recordAuditLog({
      actorId: session.id,
      actorRole: session.role,
      action: `DOCTOR_VERIFICATION_${status.toUpperCase().replace(/\s+/g, "_")}`,
      targetId: applicationId,
      targetType: "DoctorApplication",
      details: `RMP status transitioned to '${status}' by ${session.name}. Source: ${verificationSource || "N/A"}. Notes: ${reviewNotes || "None"}`,
    });

    return NextResponse.json({
      success: true,
      message: `Doctor application ${applicationId} successfully updated to '${status}'.`,
      application: updatedApp,
    });
  } catch (err: any) {
    console.error("Doctor verification API error:", err);
    return NextResponse.json(
      { error: "Verification Error", message: "Could not process verification decision." },
      { status: 500 }
    );
  }
}
