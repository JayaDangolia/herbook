import { NextResponse } from "next/server";
import { getFeatureFlags } from "@/lib/featureFlags";
import { recordAuditLog } from "@/lib/auth";
import { DoctorApplication, doctorApplicationsQueue } from "@/lib/doctorStore";

export async function POST(request: Request) {
  try {
    const flags = getFeatureFlags();
    if (!flags.doctorSelfOnboarding) {
      return NextResponse.json(
        {
          error: "Doctor Onboarding Gate Active",
          message: "Doctor self-onboarding is currently disabled by administrative release gate.",
        },
        { status: 403 }
      );
    }

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

    const newApplication: DoctorApplication = {
      id: `app-doc-${Date.now()}`,
      legalName: legalName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || "",
      gender: gender || "female",
      medicalSystem: medicalSystem || "allopathy",
      registeringCouncil: registeringCouncil || "Delhi Medical Council",
      registrationNumber: registrationNumber.trim(),
      registrationYear: registrationYear || "2020",
      qualification: qualification.trim(),
      specialty: specialty || "Obstetrics & Gynecology",
      experienceYears: Number(experienceYears) || 5,
      clinicLocation: clinicLocation || "India",
      languages: languages || ["English", "Hindi"],
      certificateFileName: certificateFileName || "uploaded_cert.pdf",
      identityFileName: identityFileName || "uploaded_id.pdf",
      status: "Under Review",
      submittedAt: new Date().toISOString(),
    };

    doctorApplicationsQueue.unshift(newApplication);

    recordAuditLog({
      actorId: newApplication.id,
      actorRole: "doctor",
      action: "DOCTOR_APPLICATION_SUBMITTED",
      details: `New doctor verification application submitted by ${newApplication.legalName} (${newApplication.medicalSystem}) - Reg: ${newApplication.registrationNumber} (${newApplication.registeringCouncil})`,
    });

    return NextResponse.json({
      success: true,
      applicationId: newApplication.id,
      status: newApplication.status,
      message: "Credentials submitted into Clinical Verification Queue.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal Error", message: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    count: doctorApplicationsQueue.length,
    applications: doctorApplicationsQueue,
  });
}
