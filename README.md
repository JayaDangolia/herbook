# HerBook — Women's Health, Wellness & Community Platform

> **Brand Tagline:** *Her Body. Her Health. Her World.*  
> **Initial Market:** India (Currency: INR ₹, Timezone: Asia/Kolkata, Languages: English & Hindi)  
> **Platforms:** Responsive Web, Installable Progressive Web App (PWA), and Mobile-First Architecture.

---

## 🌸 Executive Overview

**HerBook** is a production-ready, holistic women's digital health ecosystem crafted specifically for adult women aged 18–45 in India. It unites five foundational experiences within a single cohesive, privacy-centric application:

1. **HerCycle:** Intelligent menstrual cycle, flow intensity, and multi-symptom tracking paired with an explainable prediction engine, cycle variability analytics, and discreet lock-screen reminders.
2. **HerCare:** Verified doctor consultation marketplace featuring an initial network of 15 synthetic practitioners across **Modern Medicine (Allopathy)**, **Ayurveda**, and **Homeopathy**, with transparent pricing (₹500 doctor fee + ₹50 platform fee = ₹550 total), anti-double booking slot management, and an encrypted video consultation interface.
3. **HerReels:** Vertical short-form health video platform with clinician-reviewed badges, personal experience tags, comments drawer, and direct links to doctor booking or cycle tracking.
4. **HerCircle:** Safe, moderated peer support groups with an **Anonymous Sister** mode that ensures sensitive cycle and medical records are never exposed to public forums.
5. **HerWell:** Personalized health learning library, a dedicated **PCOS, PCOD & Fertility Support Hub** with Rotterdam criteria self-assessment, and **HerBot AI Health Assistant** equipped with strict clinical guardrails (no diagnosing, no prescribing, no unproven cure claims).

---

## 🎨 Brand Identity & UI Design

- **Primary Rose:** `#E98CA8` (warmth, feminine vitality)
- **Lavender:** `#B69ADD` (calming, hormonal harmony)
- **Deep Plum:** `#60436E` (premium typography, trustworthiness)
- **Soft Blush:** `#FFF1F5` (background surfaces, comfortable contrast)
- **Background:** `#FFFAFC` (light mode canvas) & `#09080B` (dark mode canvas)
- **Clinical Success:** `#27866C`
- **Clinical Warning:** `#D99232`
- **Clinical Error / SOS:** `#C94A58`

### Mobile-First Navigation
- **Mobile Bottom Bar:** Home (`/`), Track (`/track`), Reels (`/reels`), Consult (`/consult`), Community (`/community`)
- **Desktop Header:** Full navigation, quick language switcher (English / हिन्दी), dark/light mode toggle, role switcher (Regular User, Verified Doctor, Admin), and the prominent **SOS Emergency Red-Flag Escalation** modal.

---

## 🔬 Core Experiences & Technical Architecture

### 1. HerCycle — Explainable Menstrual Tracking
- **Mathematical Engine (`src/lib/cycleMath.ts`):** Computes cycle length, luteal phase interval (14 days), period duration, and standard deviation variability.
- **Explainable Prediction:** Clear confidence meter (High / Medium / Low) with explicit explanation of mathematical rationale.
- **Cycle Irregularity Warning:** Automatically flags cycles fluctuating by &gt; 6 days or falling outside 21–35 days.
- **Non-Contraceptive Disclaimer:** Prominently clarifies that fertile window approximations must never be used as contraception.
- **Recharts Analytics:** Visualizes 4-month bleeding duration trends and top reported symptom frequency.
- **Discreet Notifications:** Customizable reminders with neutral phrasing for lock screens.

### 2. HerCare — Doctor Marketplace & Telehealth
- **Initial Network (15 Practitioners):**
  - 5 Modern Medicine / Allopathy (Obstetrics & Gynecology, Reproductive Endocrinology, Metabolic Health)
  - 5 Ayurveda (Stree Roga & Prasuti Tantra, Panchakarma, Herbal Pharmacology)
  - 5 Homeopathy (Classical Constitutional Care, Stress & Mind-Body Support)
- **Synthetic Demonstration Notice:** Prominently marked as demonstration data with simulated registration numbers (e.g. `DEMO-NMC-2016-09123`).
- **Evidence-Based Scope Disclosures:** Explicitly details the diagnostic scope of Allopathy for ultrasound and blood tests versus complementary wellness roles of AYUSH modalities.
- **Transparent Fee Structure:** Clearly breaks down ₹500 practitioner fee + ₹50 HerBook platform booking fee = ₹550 total payable before checkout.
- **Encrypted Video Consultation (`/consult/video/[id]`):** Waiting room, 20-minute countdown timer, camera/mic controls, and a patient-shared medical records vault drawer.
- **Health Records Vault (`/records`):** Secure upload for ultrasound scans and lab reports with granular, doctor-specific consent toggling.

### 3. Doctor Portal (`/doctor-portal`)
- Separate practitioner interface to view upcoming patient schedules, review patient-shared ultrasound/lab records, document consultation assessments, issue electronic advice under Indian Telemedicine Practice Guidelines, and monitor payouts (₹500 per completed consult).

### 4. HerReels — Short-Form Video Platform
- Full vertical short-video feed (`/reels`) supporting swipe/scroll, mute/unmute, likes, bookmarking, and comments.
- Configurable content labels: *Clinician Reviewed*, *Personal Experience*, *General Wellness*, *Sponsored Content*.
- Creator Upload Flow (`UploadReelModal`) with medical misinformation disclaimer consent.

### 5. HerCircle — Moderated Community
- Safe peer support topics: Period Experiences, PCOS Support, Fertility Journeys, College Life, Career Discussions, Women's Safety, and Mental Well-being.
- **Anonymous Sister Mode:** Allows users to share intimate questions without displaying their name or avatar, while guaranteeing reproductive data is strictly isolated.

### 6. HerWell & PCOS/Fertility Hub
- Comprehensive educational guides on PCOS vs PCOD, Rotterdam criteria, iron-deficiency anemia, and the 4 cycle phases.
- **Rotterdam Consensus Checklist:** Interactive 3-part educational screener (irregular cycles, hyperandrogenism, polycystic ultrasound findings).
- **HerBot AI Health Assistant:** Responds to women's reproductive health questions, helps prepare doctor visit queries, and adheres to strict safety boundaries (does not diagnose, prescribe, or promise cures).
- **Clinical Red-Flag Escalation:** Immediate guidance and national emergency numbers (112, 108, 1091) for acute severe pain or hemorrhage.

### 7. Monetization & Commercial Architecture
- **Consultation Platform Fees:** ₹50 fee per booking with Razorpay sandbox simulation.
- **HerBook PLUS Subscriptions:** ₹99/month or ₹799/year with PDF clinical exports, extended 12-month analytics, and workshop discounts.
- **Curated Wellness Marketplace (`/shop`):** Medical-grade silicone menstrual cups, graphene heat belts, spearmint tea, and biodegradable bamboo pads.
- **Expert Workshops & Corporate Wellness:** Live webinar ticket bookings and organizational employee wellness modules.

### 8. Admin Governance Hub (`/admin`)
- Executive KPI dashboard (Total users, MAU, DAU, Telehealth volume, Platform fee revenue).
- Doctor verification queue with document audits.
- Community and video moderation queue with flag review.
- Platform fee and doctor remuneration configuration controls.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 App Router
- **Language:** TypeScript 5.7 (strict typing)
- **Styling:** Tailwind CSS with custom HerBook brand palette
- **Icons:** Lucide React
- **Data Visualizations:** Recharts (responsive SVG charts)
- **Testing:** Vitest unit test suite
- **Internationalization:** English (`en`) & Hindi (`hi`) dual-dictionary
- **State Management:** React Context API with localStorage persistence

---

## 🚀 Getting Started

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Run Automated Tests
\`\`\`bash
npm test
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

---

## ⚖️ Legal & Medical Safety Disclaimers

1. **Not Emergency Care:** HerBook provides educational, symptom tracking, and outpatient telemedicine marketplace tools. It is not an emergency hospital service. In the event of acute severe pain, hemorrhaging, or syncope, immediately dial **112** or **108** in India.
2. **Fertility Approximations:** Cycle and ovulation projections are mathematical estimations and must **NEVER** be used as contraception.
3. **Synthetic Demonstration Data:** All practitioner listings, qualifications, and registration numbers in this demonstration build are synthetic representations for product evaluation.
