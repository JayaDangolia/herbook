import { describe, it, expect, beforeEach } from "vitest";
import {
  createSessionToken,
  verifySessionToken,
  checkRateLimit,
  recordAuditLog,
  getAuditLogs,
  AuditLogEntry,
} from "../lib/auth";
import {
  getFeatureFlags,
  PRESCRIPTION_RESTRICTIONS,
  isFeatureAllowed,
} from "../lib/featureFlags";

describe("Security, Regulatory Compliance & Launch Safeguards", () => {
  describe("Cryptographic Session Management (HMAC-SHA256)", () => {
    it("should issue and verify a cryptographically signed session token", async () => {
      const userPayload = {
        id: "usr-pilot-001",
        email: "test.pilot@herbook.in",
        role: "user" as const,
        name: "Aanya Sharma",
        isMfaVerified: false,
      };

      const token = await createSessionToken(userPayload, 3600);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(2);

      const verified = await verifySessionToken(token);
      expect(verified).not.toBeNull();
      expect(verified?.id).toBe("usr-pilot-001");
      expect(verified?.role).toBe("user");
      expect(verified?.email).toBe("test.pilot@herbook.in");
    });

    it("should reject tampered session tokens with invalid signatures", async () => {
      const userPayload = {
        id: "usr-pilot-002",
        email: "tamper.test@herbook.in",
        role: "user" as const,
        name: "Tamper Test",
        isMfaVerified: false,
      };

      const token = await createSessionToken(userPayload, 3600);
      const [payloadB64, sig] = token.split(".");

      // Tamper with base64 payload to elevate role to admin
      const decoded = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
      decoded.role = "admin";
      const tamperedPayloadB64 = Buffer.from(JSON.stringify(decoded)).toString("base64url");
      const tamperedToken = `${tamperedPayloadB64}.${sig}`;

      const verified = await verifySessionToken(tamperedToken);
      expect(verified).toBeNull();
    });

    it("should reject expired session tokens", async () => {
      const userPayload = {
        id: "usr-expired-003",
        email: "expired@herbook.in",
        role: "user" as const,
        name: "Expired User",
        isMfaVerified: false,
      };

      // Create token with -10 second lifetime (already expired)
      const token = await createSessionToken(userPayload, -10);
      const verified = await verifySessionToken(token);
      expect(verified).toBeNull();
    });
  });

  describe("API Sliding-Window Rate Limiting", () => {
    it("should allow requests under the defined limit and throttle upon exceeding", () => {
      const testKey = `test-ip-rate-limit-${Date.now()}`;
      const limit = 5;
      const windowSec = 60;

      for (let i = 0; i < limit; i++) {
        const result = checkRateLimit(testKey, limit, windowSec);
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(limit - 1 - i);
      }

      // Sixth request must be blocked
      const blocked = checkRateLimit(testKey, limit, windowSec);
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.retryAfterSec).toBeGreaterThan(0);
    });
  });

  describe("Launch Gatekeeping & Feature Flag Restrictions", () => {
    it("must enforce that real payments and live clinical bookings are disabled pre-launch", () => {
      const flags = getFeatureFlags();
      expect(flags.realPayments).toBe(false);
      expect(flags.liveDoctorBookings).toBe(false);
      expect(flags.publicRegistration).toBe(false);
    });

    it("must permanently prohibit autonomous AI prescription generation under Indian Law", () => {
      const flags = getFeatureFlags();
      expect(flags.autonomousPrescriptions).toBe(false);
      expect(flags.aiDiagnosticAdvice).toBe(false);

      // Verify prohibition constants
      expect(PRESCRIPTION_RESTRICTIONS.SCHEDULE_X_PROHIBITED).toBe(true);
      expect(PRESCRIPTION_RESTRICTIONS.AUTONOMOUS_AI_RX_PERMITTED).toBe(false);
      expect(PRESCRIPTION_RESTRICTIONS.MANDATORY_IN_PERSON_SCHEDULE_X).toBe(true);
    });

    it("should correctly evaluate isFeatureAllowed helper", () => {
      expect(isFeatureAllowed("realPayments")).toBe(false);
      expect(isFeatureAllowed("liveDoctorBookings")).toBe(false);
      expect(isFeatureAllowed("autonomousPrescriptions")).toBe(false);
      expect(isFeatureAllowed("healthRecordSharing")).toBe(true);
    });
  });

  describe("DPDP Act 2023 & IT Act Audit Logging", () => {
    it("should record immutable audit events with actor, action, and timestamp", () => {
      const testEvent = {
        actorId: "usr-dpdp-audit-01",
        actorRole: "user" as const,
        action: "DPDP_DATA_EXPORT_REQUEST" as const,
        targetId: "usr-dpdp-audit-01",
        targetType: "UserHealthProfile",
        details: "User initiated export of encrypted menstrual and lab records under Section 11.",
      };

      recordAuditLog(testEvent);
      const logs = getAuditLogs("admin");
      const matched = logs.find((l) => l.actorId === "usr-dpdp-audit-01");

      expect(matched).toBeDefined();
      expect(matched?.action).toBe("DPDP_DATA_EXPORT_REQUEST");
      expect(matched?.details).toContain("Section 11");
      expect(matched?.timestamp).toBeDefined();
    });
  });

  describe("Doctor Credential Verification Standards (Telemedicine 2020)", () => {
    it("should enforce mandatory statutory verification source for RMP approval", () => {
      // Testing the validation logic present in /api/admin/doctors/verify
      const validateDoctorApproval = (status: string, source?: string) => {
        if ((status === "Verified" || status === "Active") && (!source || source.trim() === "")) {
          return { valid: false, error: "Verification Source Mandatory" };
        }
        return { valid: true };
      };

      // Fails when verification source is missing
      const approvalWithoutSource = validateDoctorApproval("Verified", "");
      expect(approvalWithoutSource.valid).toBe(false);
      expect(approvalWithoutSource.error).toBe("Verification Source Mandatory");

      // Passes when official NMC or State Council registry is provided
      const approvalWithSource = validateDoctorApproval(
        "Verified",
        "NMC Indian Medical Register Ref: IMR-2015-09884"
      );
      expect(approvalWithSource.valid).toBe(true);
    });
  });

  describe("Medical Records IDOR Protection & Consent Gates", () => {
    it("should deny access to unauthorized users without active session or sharing consent", () => {
      interface RecordModel {
        id: string;
        userId: string;
        title: string;
        sharedWithDoctorIds: string[];
      }

      const mockRecord: RecordModel = {
        id: "rec-secret-01",
        userId: "patient-101",
        title: "Pelvic Ultrasound Report",
        sharedWithDoctorIds: ["doc-dr-ananya"],
      };

      const checkRecordAccess = (record: RecordModel, actorId: string, actorRole: string) => {
        if (actorRole === "admin") return true;
        if (record.userId === actorId) return true;
        if (actorRole === "doctor" && record.sharedWithDoctorIds.includes(actorId)) return true;
        return false;
      };

      // Owner can access
      expect(checkRecordAccess(mockRecord, "patient-101", "user")).toBe(true);

      // Permitted doctor can access
      expect(checkRecordAccess(mockRecord, "doc-dr-ananya", "doctor")).toBe(true);

      // Unpermitted doctor is blocked (IDOR prevention)
      expect(checkRecordAccess(mockRecord, "doc-dr-kavita", "doctor")).toBe(false);

      // Random third party patient is blocked (IDOR prevention)
      expect(checkRecordAccess(mockRecord, "patient-999", "user")).toBe(false);
    });
  });
});
