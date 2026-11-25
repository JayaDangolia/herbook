export interface DoctorApplication {
  id: string;
  legalName: string;
  email: string;
  phone: string;
  gender: "female" | "male" | "other";
  medicalSystem: "allopathy" | "ayurveda" | "homeopathy";
  registeringCouncil: string;
  registrationNumber: string;
  registrationYear: string;
  qualification: string;
  specialty: string;
  experienceYears: number;
  clinicLocation: string;
  languages: string[];
  certificateFileName: string;
  identityFileName: string;
  status: "Applied" | "Documents Submitted" | "Under Review" | "Verified" | "Rejected" | "Active" | "Suspended";
  submittedAt: string;
  verificationSource?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

// In-memory queue of submitted doctor applications
export const doctorApplicationsQueue: DoctorApplication[] = [
  {
    id: "app-doc-101",
    legalName: "Dr. Radhika Sen",
    email: "dr.radhika.sen@hospital.org",
    phone: "+91 98112 34567",
    gender: "female",
    medicalSystem: "allopathy",
    registeringCouncil: "Maharashtra Medical Council",
    registrationNumber: "MMC-2015-09884",
    registrationYear: "2015",
    qualification: "MBBS, DGO, DNB (Obstetrics & Gynecology)",
    specialty: "High-Risk Pregnancy & PCOS",
    experienceYears: 11,
    clinicLocation: "Bandra West, Mumbai",
    languages: ["English", "Hindi", "Marathi"],
    certificateFileName: "mmc_registration_certificate_radhika.pdf",
    identityFileName: "council_identity_card_radhika.pdf",
    status: "Under Review",
    submittedAt: "2026-10-15T14:30:00.000Z",
  },
  {
    id: "app-doc-102",
    legalName: "Vaidya Meera Joshi",
    email: "vaidya.meera@ayurcare.org",
    phone: "+91 97223 45678",
    gender: "female",
    medicalSystem: "ayurveda",
    registeringCouncil: "Board of Ethics and Registration for Indian System of Medicine (NCISM)",
    registrationNumber: "NCISM-AYUR-2018-4421",
    registrationYear: "2018",
    qualification: "BAMS, MD (Ayurveda - Prasuti Tantra)",
    specialty: "Ayurvedic Women's Reproductive Wellness",
    experienceYears: 8,
    clinicLocation: "Shivaji Nagar, Pune",
    languages: ["English", "Hindi", "Marathi"],
    certificateFileName: "ncism_degree_bams_meera.pdf",
    identityFileName: "photo_id_evidence_meera.pdf",
    status: "Documents Submitted",
    submittedAt: "2026-10-15T16:00:00.000Z",
  },
];
