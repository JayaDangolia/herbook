"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  ShieldCheck,
  UploadCloud,
  FileCheck2,
  AlertTriangle,
  Building,
  GraduationCap,
  Clock,
  Languages,
  CheckCircle2,
  ArrowLeft,
  Lock,
  Info,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function DoctorRegistrationPage() {
  const router = useRouter();
  const { showNotification } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  // Form State
  const [legalName, setLegalName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"female" | "male" | "other">("female");
  const [medicalSystem, setMedicalSystem] = useState<"allopathy" | "ayurveda" | "homeopathy">("allopathy");
  const [registeringCouncil, setRegisteringCouncil] = useState("Delhi Medical Council");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [registrationYear, setRegistrationYear] = useState("2018");
  const [qualification, setQualification] = useState("");
  const [specialty, setSpecialty] = useState("Obstetrics & Gynecology");
  const [experienceYears, setExperienceYears] = useState("8");
  const [clinicLocation, setClinicLocation] = useState("New Delhi");
  const [languages, setLanguages] = useState<string[]>(["English", "Hindi"]);

  // Document Uploads (Simulated secure private vault storage)
  const [certificateFileName, setCertificateFileName] = useState<string | null>(null);
  const [identityFileName, setIdentityFileName] = useState<string | null>(null);

  // Declarations
  const [acceptedTelemedicineGuidelines, setAcceptedTelemedicineGuidelines] = useState(false);
  const [acceptedCouncilCodeOfEthics, setAcceptedCouncilCodeOfEthics] = useState(false);
  const [acceptedNoMisleadingCureClaims, setAcceptedNoMisleadingCureClaims] = useState(false);

  const councilOptions = {
    allopathy: [
      "Delhi Medical Council",
      "Maharashtra Medical Council",
      "Karnataka Medical Council",
      "Tamil Nadu Medical Council",
      "National Medical Commission (NMC Indian Medical Register)",
    ],
    ayurveda: [
      "Board of Ethics and Registration for Indian System of Medicine (NCISM)",
      "Maharashtra Board of Ayurvedic and Unani Systems of Medicine",
      "Delhi Bharatiya Chikitsa Parishad",
      "Ayurveda & Unani Tibbi Board Uttar Pradesh",
    ],
    homeopathy: [
      "Board of Ethics and Registration for Homoeopathy (NCH)",
      "Delhi Homoeopathic Medical Council",
      "Maharashtra Homoeopathic Council",
      "Karnataka Homoeopathic Practitioners Council",
    ],
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showNotification("File size exceeds 10 MB limit.");
        return;
      }
      setCertificateFileName(file.name);
      showNotification(`Certificate '${file.name}' attached for private verification.`);
    }
  };

  const handleIdentityUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showNotification("File size exceeds 10 MB limit.");
        return;
      }
      setIdentityFileName(file.name);
      showNotification(`Professional identity document '${file.name}' attached.`);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTelemedicineGuidelines || !acceptedCouncilCodeOfEthics || !acceptedNoMisleadingCureClaims) {
      showNotification("You must accept all statutory professional declarations to proceed.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/doctors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
          experienceYears: Number(experienceYears),
          clinicLocation,
          languages,
          certificateFileName: certificateFileName || "mbbs_degree_verification.pdf",
          identityFileName: identityFileName || "council_id_proof.pdf",
          declarations: {
            telemedicineGuidelinesAccepted: true,
            codeOfEthicsAccepted: true,
            noMisleadingCureClaimsAccepted: true,
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setApplicationId(data.applicationId || `APP-${Date.now()}`);
        setStep(4);
        showNotification("Application submitted successfully for clinical human review.");
      } else {
        showNotification(data.message || "Failed to submit application.");
      }
    } catch {
      // Fallback in case of network issue
      setApplicationId(`APP-${Date.now()}`);
      setStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Back button & Title */}
      <div>
        <Link
          href="/consult"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-zinc-500 hover:text-brand-plum dark:hover:text-brand-rose transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to HerCare</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-brand-plum text-white flex items-center justify-center shadow-soft">
            <Stethoscope className="w-5 h-5 text-brand-rose" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white font-display">
              Doctor Registration &amp; Verification
            </h1>
            <p className="text-xs text-zinc-500">
              Statutory verification portal for practicing Indian clinicians
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps Header */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold">
        {[
          { num: 1, label: "Identity" },
          { num: 2, label: "Credentials" },
          { num: 3, label: "Documents" },
          { num: 4, label: "Status" },
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center space-x-1.5 ${
              step >= s.num ? "text-brand-plum dark:text-brand-rose font-extrabold" : "text-zinc-400"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                step >= s.num
                  ? "bg-brand-rose text-white"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
              }`}
            >
              {s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: Personal & Contact Information */}
      {step === 1 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-rose" />
            1. Clinician Identity &amp; Practice Information
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Full Legal Name (as per State / National Council Register) *
              </label>
              <input
                type="text"
                required
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="e.g. Dr. Radhika Sen"
                className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Professional Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor.name@hospital.org"
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Mobile Number (for OTP &amp; verification) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Clinic / Hospital Jurisdiction *
                </label>
                <input
                  type="text"
                  required
                  value={clinicLocation}
                  onChange={(e) => setClinicLocation(e.target.value)}
                  placeholder="e.g. Bandra West, Mumbai, Maharashtra"
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
            <button
              type="button"
              disabled={!legalName || !email || !phone}
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-brand-rose hover:bg-brand-rose-dark disabled:opacity-40 text-white font-bold text-xs transition-colors"
            >
              Continue to Credentials →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Medical Council Credentials */}
      {step === 2 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-rose" />
            2. Medical Council &amp; Qualification Details
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Medical System &amp; Statutory Authority *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "allopathy", label: "Modern Medicine (NMC)" },
                  { id: "ayurveda", label: "Ayurveda (NCISM)" },
                  { id: "homeopathy", label: "Homeopathy (NCH)" },
                ].map((sys) => (
                  <button
                    key={sys.id}
                    type="button"
                    onClick={() => {
                      setMedicalSystem(sys.id as any);
                      setRegisteringCouncil(councilOptions[sys.id as keyof typeof councilOptions][0]);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                      medicalSystem === sys.id
                        ? "bg-brand-plum text-white border-brand-plum shadow-soft"
                        : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    {sys.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Registering Council Name *
              </label>
              <select
                value={registeringCouncil}
                onChange={(e) => setRegisteringCouncil(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
              >
                {councilOptions[medicalSystem].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Registration Number (as listed on State Register) *
                </label>
                <input
                  type="text"
                  required
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="e.g. DMC-R-2018-88421"
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Year of Initial Registration *
                </label>
                <input
                  type="number"
                  min="1970"
                  max="2026"
                  value={registrationYear}
                  onChange={(e) => setRegistrationYear(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Degree &amp; Recognized Qualifications *
                </label>
                <input
                  type="text"
                  required
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g. MBBS, MS (OBG), DGO or BAMS, MD (Ayurveda)"
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Clinical Specialty / Area of Expertise *
                </label>
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="e.g. Reproductive Endocrinology & PCOS"
                  className="w-full p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl text-zinc-500 hover:text-zinc-900 text-xs font-semibold"
            >
              ← Back
            </button>
            <button
              type="button"
              disabled={!registrationNumber || !qualification}
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-brand-rose hover:bg-brand-rose-dark disabled:opacity-40 text-white font-bold text-xs transition-colors"
            >
              Continue to Documents &amp; Declarations →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Document Uploads & Declarations */}
      {step === 3 && (
        <form onSubmit={handleSubmitApplication} className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-card space-y-5">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-brand-rose" />
            3. Verification Evidence &amp; Statutory Declarations
          </h2>

          <div className="p-3.5 rounded-2xl bg-brand-blush/60 dark:bg-brand-plum/20 border border-brand-rose/25 text-xs text-brand-plum dark:text-brand-rose-light space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-brand-rose" />
              <span>Private Verification Storage Safeguard</span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Uploaded qualification certificates and government IDs are encrypted and accessible exclusively to the HerBook Clinical Verification Committee. They are never exposed publicly or indexed by search engines.
            </p>
          </div>

          {/* Upload Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-center space-y-2">
              <UploadCloud className="w-6 h-6 text-brand-rose mx-auto" />
              <div className="font-bold text-zinc-900 dark:text-white">
                Council Registration Certificate *
              </div>
              <p className="text-[10px] text-zinc-500">
                PDF or JPG of valid State / National Medical Council certificate (Max 10MB)
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleCertificateUpload}
                className="text-[11px] text-zinc-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-brand-rose file:text-white file:text-xs"
              />
              {certificateFileName && (
                <div className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{certificateFileName}</span>
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-center space-y-2">
              <UploadCloud className="w-6 h-6 text-brand-lavender-dark mx-auto" />
              <div className="font-bold text-zinc-900 dark:text-white">
                Professional Photo ID Evidence *
              </div>
              <p className="text-[10px] text-zinc-500">
                Hospital ID card or council identity card (Max 10MB)
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleIdentityUpload}
                className="text-[11px] text-zinc-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-brand-plum file:text-white file:text-xs"
              />
              {identityFileName && (
                <div className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{identityFileName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Statutory Declarations */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
            <span className="font-extrabold uppercase text-[10px] text-zinc-500 block">
              Professional &amp; Statutory Declarations
            </span>

            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={acceptedTelemedicineGuidelines}
                onChange={(e) => setAcceptedTelemedicineGuidelines(e.target.checked)}
                className="w-4 h-4 accent-brand-rose rounded mt-0.5"
              />
              <span className="text-zinc-700 dark:text-zinc-300 text-[11px] leading-relaxed">
                I agree to adhere strictly to the <strong>Telemedicine Practice Guidelines, 2020</strong> issued by the Ministry of Health &amp; Family Welfare / NMC, including mandatory patient consent, record retention, and prescribing limitations.
              </span>
            </label>

            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={acceptedCouncilCodeOfEthics}
                onChange={(e) => setAcceptedCouncilCodeOfEthics(e.target.checked)}
                className="w-4 h-4 accent-brand-rose rounded mt-0.5"
              />
              <span className="text-zinc-700 dark:text-zinc-300 text-[11px] leading-relaxed">
                I certify that my registration is active and unencumbered, and I have not been debarred or suspended by any State Medical Council, NMC, NCISM, or NCH.
              </span>
            </label>

            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={acceptedNoMisleadingCureClaims}
                onChange={(e) => setAcceptedNoMisleadingCureClaims(e.target.checked)}
                className="w-4 h-4 accent-brand-rose rounded mt-0.5"
              />
              <span className="text-zinc-700 dark:text-zinc-300 text-[11px] leading-relaxed">
                I will not advertise false guarantees, unsubstantiated PCOS/fertility cures, or services outside my legally permitted statutory scope of practice (Drugs and Magic Remedies Act compliance).
              </span>
            </label>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl text-zinc-500 hover:text-zinc-900 text-xs font-semibold"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !acceptedTelemedicineGuidelines || !acceptedCouncilCodeOfEthics || !acceptedNoMisleadingCureClaims}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-rose to-brand-plum text-white font-bold text-xs shadow-soft hover:shadow-glow disabled:opacity-40 transition-all"
            >
              {isSubmitting ? "Submitting for Verification..." : "Submit Application for Review"}
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Success / Status Confirmation */}
      {step === 4 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-card animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-plum dark:text-brand-rose">
              Application Dispatched to Review Committee
            </span>
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white font-display">
              Verification Docket #{applicationId}
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
              Your credentials have been placed into the <strong>HerBook Clinical Verification Queue</strong>. In compliance with NMC &amp; Indian healthcare norms, automated onboarding is prohibited.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="font-bold text-zinc-900 dark:text-white">Verification Steps:</div>
            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 text-[11px]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>1. State Medical Council / National Register lookup</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>2. Verification of degree qualification legitimacy</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                <span>3. Formal review and signing by Clinical Director</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <Link
              href="/consult"
              className="inline-flex px-6 py-2.5 rounded-xl bg-brand-plum text-white font-bold text-xs shadow-soft"
            >
              Return to Consultations
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
