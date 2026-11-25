import { NextResponse } from "next/server";
import { recordAuditLog, verifySessionToken } from "@/lib/auth";
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
      return NextResponse.json({ error: "Forbidden: Admin credentials required" }, { status: 403 });
    }

    const applications = await db.doctorApplications.findAll();
    return NextResponse.json({ success: true, applications });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      legalName,
      email,
      phone,
      gender,
      medicalSystem,
      registeringCouncil,
      registrationNumber,
      registrationYear,
      qualification,
      specialty,
      experienceYears,
      clinicLocation,
      languages,
      certificateFileName,
      identityFileName,
    } = body;

    if (!legalName || !email || !registrationNumber || !qualification) {
      return NextResponse.json(
        { error: "Validation Error", message: "Required registration credentials missing." },
        { status: 400 }
      );
    }

    // Check session if doctor is logged in
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/herbook_session=([^;]+)/);
    const token = match ? match[1] : null;
    let userId: string | undefined = undefined;
    if (token) {
      const session = await verifySessionToken(token);
      if (session) userId = session.id;
    }

    const newApplication = await db.doctorApplications.create({
      userId,
      legalName: legalName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || "",
      gender: gender || "female",
      medicalSystem: medicalSystem || "Allopathy",
      registeringCouncil: registeringCouncil || "State Medical Council",
      registrationNumber: registrationNumber.trim(),
      registrationYear: registrationYear || "2020",
      qualification: qualification.trim(),
      specialty: specialty || "Obstetrics & Gynecology",
      experienceYears: Number(experienceYears) || 5,
      clinicLocation: clinicLocation || "India",
      languages: languages || ["English", "Hindi"],
      certificateFileName: certificateFileName || "uploaded_cert.pdf",
      identityFileName: identityFileName || "uploaded_id.pdf",
    });

    recordAuditLog({
      actorId: userId || "unregistered-clinician",
      actorRole: "doctor",
      action: "DOCTOR_ONBOARDING_APPLICATION_SUBMITTED",
      targetId: newApplication.id,
      targetType: "DoctorApplication",
      details: `Dr. ${newApplication.legalName} (${newApplication.registrationNumber}, ${newApplication.registeringCouncil}) submitted registration for clinical verification.`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your clinician application has been securely submitted for administrative credential verification.",
        applicationId: newApplication.id,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Doctor registration error:", err);
    return NextResponse.json(
      { error: "Submission Error", message: "Could not submit doctor application. Please try again." },
      { status: 500 }
    );
  }
}
