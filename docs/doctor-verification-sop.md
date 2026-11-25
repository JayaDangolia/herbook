# DRAFT — REQUIRES INDIAN CLINICAL & LEGAL REVIEW
# HerBook Clinician Verification Standard Operating Procedure (SOP)
**Document Version**: 1.0-DRAFT  
**Scope**: Operational Credentialing for Registered Medical Practitioners across Modern Medicine, Ayurveda, and Homeopathy  
**Last Updated**: October 16, 2026  
**Status**: INTERNAL AUDIT SOP

---

## 1. Statutory Mandate
The Telemedicine Practice Guidelines, 2020 explicitly restrict telemedicine consultations in India to **Registered Medical Practitioners (RMPs)** enrolled on state or national medical registers. Automated or unverified doctor onboarding is strictly prohibited on HerBook.

---

## 2. Five-Stage Human-Reviewed Verification Lifecycle

```
[Applied] ──► [Documents Submitted] ──► [Under Review] ──► [Verified & Active]
                                                │
                                                ├──► [More Info Required]
                                                │
                                                └──► [Rejected / Suspended]
```

### Stage 1: Application Ingestion (`Applied`)
- Doctor submits full legal name, council registration number, registering council, medical system, qualifications, and clinic location via `/doctor/register`.

### Stage 2: Verification Evidence Ingestion (`Documents Submitted`)
- Upload of council registration certificate and government/hospital photo ID.
- Storage in encrypted, private document vault (never exposed publicly).

### Stage 3: Human Verification Committee Audit (`Under Review`)
The HerBook Clinical Verification Committee performs the following external register lookups:

1. **Modern Medicine (Allopathy)**:
   - Verification against the **National Medical Commission (NMC) Indian Medical Register (IMR)** online portal (`nmc.org.in`) or State Medical Council register (e.g., Delhi Medical Council, Maharashtra Medical Council).
   - Validation that degrees (MBBS, MD, MS, DGO) are recognized under the First, Second, or Third Schedules of the Indian Medical Council Act / NMC Act.
2. **Ayurveda (AYUSH)**:
   - Verification against the **National Commission for Indian System of Medicine (NCISM)** central register or state Ayurvedic boards.
   - Confirmation of recognized BAMS / MD (Ayurveda) qualifications.
3. **Homeopathy (AYUSH)**:
   - Verification against the **National Commission for Homoeopathy (NCH)** national register.
   - Confirmation of recognized BHMS / MD (Homeopathy) qualifications.

### Stage 4: Review Decision & Audit Trail (`Verified` or `Rejected`)
- The reviewer enters:
  1. Verification Source (e.g. `NMC IMR Search verified against Reg #DMC-R-2018-88421 on 16-Oct-2026`).
  2. Reviewer Name & Designation (e.g. `Dr. Pooja Varma, Chief Medical Officer`).
  3. Decision Notes and timestamp.
- The action is permanently recorded in the platform's immutable audit log.

### Stage 5: Activation, Periodic Re-Audit & Suspension
- Only approved practitioners receive the green verified clinical checkmark.
- **Annual Re-Verification**: Practitioners must confirm active council standing every 12 months.
- **Suspension Protocol**: Immediate suspension occurs upon receipt of notice from any statutory council or consumer dispute commission.
