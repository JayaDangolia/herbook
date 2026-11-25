/**
 * HerBook Release Gates & Feature Flag Controller
 * Enforces strict legal, clinical, and regulatory gating prior to public activation.
 */

export interface FeatureFlags {
  // Authentication & Onboarding
  publicRegistration: boolean;
  doctorSelfOnboarding: boolean;

  // Teleconsultation & Financials
  liveDoctorBookings: boolean;
  realPayments: boolean;
  configurablePlatformFee: boolean;

  // Social & Media Publishing
  userGeneratedReels: boolean;
  directMessaging: boolean;

  // Health Privacy & Record Sharing
  healthRecordSharing: boolean;
  biometricVaultLock: boolean;

  // Clinical & Safety AI
  autonomousPrescriptions: boolean; // MUST ALWAYS REMAIN FALSE
  aiDiagnosticAdvice: boolean;      // MUST ALWAYS REMAIN FALSE
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  // Public signups restricted to controlled invite-only testing
  publicRegistration: false,

  // Doctor self-onboarding portal is active in verification review mode
  doctorSelfOnboarding: true,

  // Live real-world clinical bookings disabled; synthetic simulation enabled
  liveDoctorBookings: false,

  // Real financial transactions disabled until legal escrow & GST clearance
  realPayments: false,

  // Fee configuration visible to administrators
  configurablePlatformFee: true,

  // Short video creation restricted to verified medical creators
  userGeneratedReels: false,

  // Secure doctor-patient telemedicine chat is active
  directMessaging: true,

  // Explicit, consent-based, patient-revocable health record sharing is active
  healthRecordSharing: true,

  // Biometric / PIN simulated privacy lock for sensitive records
  biometricVaultLock: true,

  // CLINICAL SAFETY RESTRICTIONS: Absolute prohibitions
  autonomousPrescriptions: false,
  aiDiagnosticAdvice: false,
};

let currentFlags: FeatureFlags = { ...DEFAULT_FEATURE_FLAGS };

export function getFeatureFlags(): FeatureFlags {
  return { ...currentFlags };
}

export function updateFeatureFlag<K extends keyof FeatureFlags>(
  key: K,
  value: FeatureFlags[K]
): FeatureFlags {
  // Prevent illegal activation of autonomous medical prescribing
  if (key === "autonomousPrescriptions" || key === "aiDiagnosticAdvice") {
    console.warn(`[SECURITY WARNING] Attempted unauthorized override of statutory safety gate: ${key}`);
    currentFlags[key] = false as FeatureFlags[K];
    return { ...currentFlags };
  }

  currentFlags[key] = value;
  return { ...currentFlags };
}

export const PRESCRIPTION_RESTRICTIONS = {
  SCHEDULE_X_PROHIBITED: true,
  AUTONOMOUS_AI_RX_PERMITTED: false,
  MANDATORY_IN_PERSON_SCHEDULE_X: true,
  TELEMEDICINE_CONSENT_REQUIRED: true,
  ALLOWED_DRUG_LISTS: ["List A (OTC)", "List B (Prescription refills via video consultation)"],
  DISALLOWED_DRUG_LISTS: ["Schedule X", "Habit-forming psychotropic substances"],
};

export function isFeatureAllowed(feature: keyof FeatureFlags): boolean {
  return !!currentFlags[feature];
}
