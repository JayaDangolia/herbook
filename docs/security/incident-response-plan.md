# DRAFT — REQUIRES INDIAN LEGAL & CYBERSECURITY REVIEW
# HerBook Security Incident Response & CERT-In Breach Notification Plan
**Document Version**: 1.0-DRAFT  
**Statutory Framework**: CERT-In Cyber Security Directions (April 28, 2022) & DPDP Act, 2023 (Section 8(6))  
**Last Updated**: October 16, 2026  
**Status**: DRAFT — INTERNAL SECURITY SOP

---

## 1. Objective & Scope
This SOP defines the technical and organizational protocol for detecting, containing, investigating, and reporting cybersecurity incidents, unauthorized database access, or personal data breaches affecting HerBook's infrastructure and health data vaults.

---

## 2. Mandatory Statutory Breach Reporting Deadlines

1. **CERT-In (Indian Computer Emergency Response Team)**:
   - Pursuant to CERT-In Direction No. 20(3)/2022-CERT-In dated 28.04.2022, cybersecurity incidents (including unauthorized access to IT systems, identity theft, data breaches, and ransomware) must be reported to CERT-In **within 6 hours of noticing or being brought to notice of such incident**.
   - **Reporting Channel**: `incident@cert-in.org.in` | Tel: `1800-11-4949` | Online portal: `cert-in.org.in`.
2. **Data Protection Board of India & Affected Data Principals (DPDP Act, 2023)**:
   - Under Section 8(6) of the DPDP Act, in the event of a personal data breach, the Data Fiduciary shall give notice to the Data Protection Board and to each affected Data Principal in such form and manner as prescribed.

---

## 3. Incident Severity Levels & Triage

| Severity | Incident Characteristics | Initial Response Time | Escalation Authority |
|---|---|---|---|
| **P1 - Critical** | Unauthorized exfiltration of reproductive health records, cycle history, or doctor credentials; active database ransomware. | **< 15 minutes** | CEO, CTO, Lead Medico-Legal Counsel, DPO |
| **P2 - High** | Unauthorized privilege escalation to `admin` or `doctor`; denial of service on video consultation rooms. | **< 30 minutes** | CTO, Security Architect |
| **P3 - Medium** | Single user account credential stuffing; spam bot activity in community forums. | **< 2 hours** | Security On-Call Engineer |
| **P4 - Low** | Minor suspicious login attempts mitigated by rate-limiting; client-side non-exploitable error logs. | **< 24 hours** | DevOps Engineer |

---

## 4. Phase-by-Phase Technical Incident Handling

### Phase 1: Detection & Identification
- Ingestion of audit log alerts from `src/lib/auth.ts` (`UNAUTHORIZED_RECORD_ACCESS_ATTEMPT`, repeated `AUTH_LOGIN_FAILED`).
- Detection of high request spikes via middleware rate limiter.

### Phase 2: Containment & Isolation
- Immediate revocation of compromised HMAC session tokens.
- IP-level firewall blocks on offending CIDR blocks.
- Temporary activation of emergency maintenance mode on compromised API endpoints if data leakage is ongoing.

### Phase 3: Investigation & Eradication
- Forensic analysis of server logs (retained for minimum 180 days in compliance with CERT-In rules).
- Identification of vulnerability root cause (e.g., IDOR, injection, session hijacking).
- Deployment of validated hotfix via CI/CD.

### Phase 4: Recovery & Restoration
- Verification of database integrity and rollback to clean snapshot if data tampering occurred.
- Re-verification of all active doctor verification queues and permissions.

### Phase 5: Notification & Post-Mortem
- Submission of initial incident report to CERT-In within 6 hours.
- Direct notification to affected patients with recommended protective measures (password resets, credential review).
- Comprehensive post-incident review completed within 7 business days.
