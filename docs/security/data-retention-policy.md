# DRAFT — REQUIRES INDIAN LEGAL REVIEW
# HerBook Data Retention & Secure Sanitization Policy
**Document Version**: 1.0-DRAFT  
**Legal Framework**: DPDP Act 2023, IT Act 2000, CERT-In Directions 2022 & Medical Council of India Regulations  
**Last Updated**: October 16, 2026  
**Status**: DRAFT — INTERNAL POLICY

---

## 1. Principle of Storage Limitation (DPDP Act, 2023)
Personal data shall be retained only for as long as necessary to satisfy the specific purpose for which it was collected, or to comply with statutory legal and clinical obligations under Indian law.

---

## 2. Retention Schedules by Data Category

| Category | Specific Data Elements | Retention Period | Legal & Operational Rationale |
|---|---|---|---|
| **Menstrual & Symptom Logs** | Period dates, cramps, flow, mood notes | Retained while user account is active. Hard purge within **72 hours** of deletion request. | DPDP Act Right to Erasure; personal health tracking utility. |
| **Teleconsultation Prescriptions & Clinical Advice** | Doctor notes, prescription PDFs, appointment records | **3 Years** from date of consultation | Mandatory record retention under Indian Medical Council Regulations & Telemedicine Guidelines. |
| **Doctor Credential & Verification Files** | Medical council certificates, degree proofs, photo IDs | **Duration of active platform affiliation + 5 Years** following disenrollment | Regulatory defense against unauthorized practice allegations. |
| **Server & Audit Logs** | IP addresses, login timestamps, access records, API requests | **180 Days** | Statutory compliance with CERT-In Cyber Security Directions (April 2022). |
| **Community Posts & Comments** | Discussion threads, peer advice | Retained until author deletion or moderation removal. | Intermediary content lifecycle. |
| **Informed Consent Records** | Telemedicine consent version, timestamp, user ID | **3 Years** | Evidentiary defense under Indian Contract Act & Telemedicine Guidelines. |

---

## 3. Cryptographic Erasure & Disposal Standards
1. **Soft Deletion vs. Hard Purge**: When a user triggers "Delete Account", the profile is placed into a 72-hour grace period to prevent accidental loss, after which an automated hard purge permanently overwrites database records.
2. **Backups Sanitization**: Database backups older than the retention threshold are automatically pruned via rolling snapshot expiry.
