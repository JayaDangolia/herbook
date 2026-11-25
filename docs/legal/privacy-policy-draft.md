# DRAFT — REQUIRES INDIAN LEGAL REVIEW
# HerBook Privacy Policy & Notice of Data Fiduciary Processing
**Document Version**: 1.0-DRAFT (Pilot Evaluation)  
**Applicable Legal Framework**: Digital Personal Data Protection Act, 2023 (DPDP Act) & Information Technology Act, 2000 (Section 43A and SPDI Rules 2011)  
**Last Updated**: October 16, 2026  
**Status**: INTERNAL DRAFT — NOT BINDING WITHOUT FORMAL INDIAN HEALTHCARE & PRIVACY COUNSEL APPROVAL

---

## 1. Identity of the Data Fiduciary
HerBook is operated by `[LEGAL ENTITY NAME: e.g., HerBook Technologies Private Limited]` ("HerBook", "we", "our", or "us"), a private limited company incorporated under the Companies Act, 2013, having its registered office at `[REGISTERED OFFICE ADDRESS: e.g., Level 4, Tech Park, Outer Ring Road, Bengaluru, Karnataka, 560103, India]`.

**Data Protection Officer (DPO) / Data Grievance Officer**:  
- **Name**: `[NAME OF GRIEVANCE OFFICER: e.g., Ms. Radhika Sen]`
- **Designation**: Grievance Officer & Data Protection Lead
- **Email**: `[GRIEVANCE EMAIL: e.g., grievance@herbook.in]`
- **Physical Address for Grievances**: `[GRIEVANCE ADDRESS]`
- **Statutory Grievance Redressal Timeline**: Acknowledgment within 24 hours; resolution within 15 calendar days under Rule 3(2) of the Information Technology (Intermediary Guidelines) Rules, 2021.

---

## 2. Categories of Personal and Sensitive Health Data Processed

HerBook processes personal data strictly on the basis of explicit, informed consent and for specified, lawful purposes:

1. **Identity & Account Data**: Full name, mobile phone number, email address, password hash, and account avatar.
2. **Reproductive Health & Menstrual Cycle Data (Sensitive Personal Data)**: Period start dates, cycle durations, flow intensities, physical sensations (cramps, headaches, fatigue, bloating), mood logs, and personal health notes.
3. **Teleconsultation & Clinical Records**: Chief medical complaints, uploaded diagnostic reports (ultrasound scans, lipid panels, pathology sheets), clinician notes, and electronic consultation summaries.
4. **Practitioner Credential Data**: Legal name, State/National Medical Council registration number (NMC, NCISM, NCH), degree qualifications, registration certificates, and practice jurisdiction.
5. **Community & Social Interaction Data**: Community discussion posts, comments, reactions, and abuse report flags. (Users posting via "Incognito" mode have their personal identifiers stripped from public view).

---

## 3. Lawful Purpose Specification & Processing Limitations

Under Section 4 and 6 of the DPDP Act, 2023, data is processed solely for:
- Calculating biological menstrual cycle estimates and personalized phase insights (HerCycle).
- Facilitating teleconsultation discovery and appointment scheduling with licensed Indian practitioners (HerCare).
- Providing anonymous, empathetic peer support spaces (HerCircle).
- Providing evidence-based, clinician-reviewed hormonal literacy articles (HerWell).
- Maintaining platform security, verifying doctor credentials, and preventing cyber-harassment.

**Explicit Processing Prohibitions**:
- Reproductive health records are **NEVER sold, rented, or shared with third-party advertising brokers or data brokers**.
- Cycle prediction metrics are strictly isolated and never surfaced on public user profiles.
- Automated algorithmic profiling for discrimination or commercial targeted ads based on menstrual or pregnancy states is prohibited.

---

## 4. Rights of the Data Principal (User Rights under DPDP Act, 2023)

As a Data Principal residing in India, you hold the following statutory rights:
1. **Right to Access Information**: You have the right to receive a summary of personal data processed, identities of medical practitioners with whom records were shared, and details of processing.
2. **Right to Correction & Erasure (Right to be Forgotten)**: You may modify, update, or permanently delete menstrual logs and uploaded medical documents directly in the application or submit a formal erasure request via `/api/user/privacy`.
3. **Right of Grievance Redressal**: You may file a complaint with our Grievance Officer regarding any processing concern. If unresolved within 15 days, you retain the statutory right to appeal to the Data Protection Board of India.
4. **Right to Nominate**: In the event of death or incapacity, you have the right to nominate an individual to exercise privacy rights on your behalf.
5. **Right to Withdraw Consent**: Consent for optional services (e.g., doctor sharing, analytics) can be revoked at any time through application settings.

---

## 5. Security Safeguards & Encryption Standards

In compliance with Rule 8 of the SPDI Rules, 2011 and Section 8(5) of the DPDP Act:
- **In-Transit**: All API traffic is encrypted using Transport Layer Security (TLS 1.3) with mandatory HSTS.
- **At-Rest**: Medical reports, doctor verification documents, and database records are stored in encrypted object vaults utilizing AES-256 encryption.
- **Access Control**: Role-based access control (RBAC) with cryptographic session signatures; administrators cannot view patient clinical files without an auditable, patient-authorized support ticket.
- **Incident Response**: Security incidents impacting data confidentiality are reported to the Indian Computer Emergency Response Team (CERT-In) within 6 hours of discovery pursuant to the CERT-In Directions of April 28, 2022.

---

## 6. Data Retention and Hard Deletion Schedule
- **Cycle & Symptom Logs**: Retained while your account remains active; permanently purged within 72 hours of receiving an account deletion request.
- **Teleconsultation Prescriptions & Doctor Notes**: Retained for a minimum statutory period of 3 years from the consultation date pursuant to Medical Council of India / NMC record-keeping directives.
- **Audit Logs**: Maintained for 180 days for security auditing in compliance with CERT-In cyber-incident requirements.

---

*DISCLAIMER: This draft document is prepared for platform architecture alignment and internal testing. It must undergo formal review and customization by a qualified Indian advocate specializing in health law and the DPDP Act prior to production deployment.*
