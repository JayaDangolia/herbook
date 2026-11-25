# HerBook — Public Launch Security, Doctor Verification & Compliance Audit
**Date**: October 16, 2026  
**Auditor**: Autonomous Product, Security & Healthcare Engineering Team  
**Scope**: Complete HerBook Next.js 14 Codebase  
**Regulatory Frameworks Evaluated**:
- Digital Personal Data Protection Act, 2023 (DPDP Act)
- Information Technology Act, 2000 & IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (SPDI Rules)
- Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021
- Telemedicine Practice Guidelines, 2020 (National Medical Commission / Ministry of Health & Family Welfare)
- National Commission for Indian System of Medicine (NCISM) Act, 2020 & National Commission for Homoeopathy (NCH) Act, 2020

---

## 1. Executive Summary

HerBook has been successfully engineered as an Instagram-inspired, mobile-first women's health and social platform ("Option A Social First") containing 5 bottom-navigation destinations, a 6-service healthcare launcher, full-screen menstrual health tracking (HerCycle), doctor discovery (HerCare), short-form health videos (HerReels), anonymous peer forums (HerCircle), evidence-based education (HerWell), and emergency SOS.

However, before any controlled pilot or public launch in India, **critical security, clinical verification, and statutory compliance gaps** must be addressed. Prior to this upgrade, authentication and state management resided almost entirely on the client side (`localStorage` and React Context), mock doctors lacked tamper-evident human verification audit trails, payment processing was simulated without a statutory escrow/fee structure, and reproductive health records were vulnerable to client-side inspection.

This document classifies every vulnerability, affected route, and required remediation.

---

## 2. Vulnerability & Risk Matrix

| ID | Category | Vulnerability / Deficiency | Severity | Affected Routes / Files | Remediation Status |
|---|---|---|---|---|---|
| **SEC-01** | Authorization | Client-side only role checks (`switchRole` without server JWT/session validation) | **CRITICAL** | `src/context/AppContext.tsx`, `/admin`, `/doctor-portal` | Implement Next.js `middleware.ts`, signed session cookies, server authorization API |
| **SEC-02** | Data Privacy | Direct Object Reference / IDOR risk on medical records and cycle logs | **CRITICAL** | `src/context/CareContext.tsx`, `src/app/records/page.tsx` | Server-side ownership verification (`requireResourceOwnership`), client isolation |
| **CLIN-01** | Clinical Safety | Synthetic doctors marked `verified: true` without statutory verification audit trail | **CRITICAL** | `src/data/doctorsData.ts`, `src/app/consult/page.tsx` | Require human review workflow, NMC/NCISM/NCH source logging, visible demo badge |
| **CLIN-02** | Telemedicine | Booking without versioned, timestamped patient consent | **HIGH** | `src/components/care/BookingModal.tsx`, `/consult/[id]` | Telemedicine Practice Guidelines 2020 compliant consent modal with versioning |
| **CLIN-03** | Prescriptions | Unregulated electronic prescription notes without statutory practitioner details | **HIGH** | `src/app/doctor-portal/page.tsx`, `/consult/video/[id]` | Standardized digital advice format, registration council citation, Schedule X prohibition |
| **LEGAL-01** | Payments | Unapproved payment simulation with fixed ₹50 platform fee without legal clearance | **HIGH** | `src/context/CareContext.tsx`, `/consult` | Place live fee collection behind disabled feature flag (`realPayments: false`) |
| **SOC-01** | Content Safety | Community posts and comments lack abuse/harassment reporting and moderation queue | **HIGH** | `src/context/CommunityContext.tsx`, `/community` | Intermediary Rules 2021 complaint workflow, 6 specialized reporting categories, admin queue |
| **SEC-03** | Web Security | Missing HTTP security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy) | **MEDIUM** | `next.config.js`, `src/middleware.ts` | Enforce strict security headers in middleware |
| **SEC-04** | Rate Limiting | No rate limiting on authentication, booking, or messaging endpoints | **MEDIUM** | Global API endpoints | Sliding-window IP rate limiter in Next.js middleware |
| **PRIV-01** | Consent & DPDP | Lack of purpose-specific consent logging, data export, and deletion workflows | **HIGH** | `src/context/AppContext.tsx`, `/profile` | DPDP-aligned privacy notice, data export (JSON), and account erasure request API |

---

## 3. Deep-Dive Findings by Domain

### 3.1 Authentication & Authorization (SEC-01, SEC-02)
- **Current State**: `AppContext.tsx` maintained `user.role` in React state with arbitrary role switching for demonstration (`switchRole`). There were no backend API endpoints validating sessions.
- **Risk**: An attacker or curious user could escalate privileges to `admin` or `doctor` in the browser dev tools, accessing doctor patient lists or admin revenue dials.
- **Remediation**:
  1. Implement server-side session management (`src/lib/auth.ts`) utilizing cryptographically signed tokens.
  2. Implement `src/middleware.ts` intercepting `/admin`, `/doctor-portal`, and all sensitive API routes.
  3. Require Multi-Factor Authentication (MFA) simulation for administrators and practitioners before privileged dashboard access.

### 3.2 Doctor Registration & Statutory Verification (CLIN-01)
- **Current State**: The platform featured 15 synthetic doctors covering Allopathy (NMC), Ayurveda (NCISM), and Homeopathy (NCH) marked as `verified: true`.
- **Risk**: Under Indian medical law, providing telemedicine consultations without valid registration under the NMC Act 2019, NCISM Act 2020, or NCH Act 2020 constitutes unauthorized practice. Demonstrating fake profiles as "Verified" without an explicit disclaimer creates legal liability.
- **Remediation**:
  1. Build a multi-step **Doctor Registration Portal** (`/doctor/register`) capturing council details, qualifications, and certificates.
  2. Establish a strict verification state machine: `Applied` → `Documents Submitted` → `Under Review` → `Verified` / `Rejected` / `More Information Required` → `Active` / `Suspended`.
  3. Restrict "Verified Practitioner" badges strictly to real practitioners audited against official council registers.
  4. Prominently tag synthetic demo profiles with a non-removable `SYNTHETIC DEMO` warning and disable real payment transactions on them.

### 3.3 Telemedicine Safety & Patient Consent (CLIN-02, CLIN-03)
- **Current State**: Teleconsultation booking allowed slot selection and instant confirmation without mandatory telemedicine consent.
- **Risk**: The Telemedicine Practice Guidelines, 2020 mandate that the patient's explicit consent be recorded prior to commencing teleconsultation, including acknowledgment of telemedicine's inherent limitations (e.g., inability to perform physical palpation).
- **Remediation**:
  1. Mandatory Consent Step: Capture timestamped versioned consent (`v1.2-IN-TELEMED`) prior to booking confirmation.
  2. Explicit prohibition on prescribing Schedule X drugs, psychiatric injectables, or issuing autonomous AI prescriptions.
  3. Provider ability to escalate to in-person care or emergency SOS if patient exhibits red flags (severe abdominal pain, acute hemorrhage).

### 3.4 Menstrual Health & Reproductive Privacy (HerCycle / PRIV-01)
- **Current State**: Menstrual cycle math and daily symptom logs were stored in `localStorage`.
- **Risk**: Under Section 4 & 6 of the DPDP Act 2023, health data constitutes sensitive personal data requiring purpose limitation, access restrictions, and the right to withdraw consent. Leakage of cycle phases or pregnancy/fertility planning data to social feeds or ad networks is a major privacy violation.
- **Remediation**:
  1. Absolute boundary isolation: Menstrual logs never flow into public feed serialization or community metadata.
  2. Consent-based, revocable doctor sharing: A user must explicitly grant temporary read-only access to a specific doctor for a consultation.
  3. Transparent prediction explainer emphasizing that ovulation estimates are mathematical approximations and **must not be relied upon as contraception**.

### 3.5 Social Intermediary Compliance (SOC-01)
- **Current State**: Community forums (`/community`) allowed creating and liking posts without abuse reporting or content moderation.
- **Risk**: Rule 3 of the IT (Intermediary Guidelines) Rules, 2021 requires platforms to offer grievance redressal mechanisms and act on reports of non-consensual sexual content or harassment within statutory timelines.
- **Remediation**:
  1. Report post/comment drawer with 6 designated categories: harassment, impersonation, intimate image abuse, medical misinformation, hate speech, and spam.
  2. Admin content moderation queue with approve, remove, and account warning capabilities.
  3. Anonymity preservation: When users select "Post Incognito", the client strips user ID, email, and avatar from publicly queryable payload data.

---

## 4. Features Kept Behind Disabled Release Gates
To protect patient safety and prevent premature legal liability, the following feature flags are maintained **disabled (`false`)** by default:

1. `featureFlags.realPayments = false`: Live INR payment gateway disabled until escrow and GST registration is formalized.
2. `featureFlags.liveDoctorBookings = false`: Controlled to synthetic demonstration doctors only until initial batch of credentialed doctors is onboarded.
3. `featureFlags.publicRegistration = false`: Public open registration disabled; access restricted to invite-only alpha testing.
4. `featureFlags.userGeneratedReels = false`: Video reel upload restricted to certified health creators to prevent unmoderated health misinformation.

---

## 5. Audit Conclusion
With the implementation of the Phase 2 through Phase 12 architecture outlined in this document, HerBook transitions from a prototype into a security-conscious, legally prudent health application ready for closed pilot evaluation in India.
