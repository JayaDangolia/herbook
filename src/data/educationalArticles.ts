export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: "PCOS & Hormones" | "Cycle Science" | "Fertility Awareness" | "Nutrition & Health" | "Mental Well-being";
  readTimeMinutes: number;
  reviewedBy: string;
  reviewerTitle: string;
  coverImage: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  isClinicianReviewed: boolean;
}

export interface PCOSFAQ {
  question: string;
  answer: string;
  category: "Diagnosis" | "Diet & Lifestyle" | "Fertility" | "Medication & Herbs";
}

export const educationalArticles: Article[] = [
  {
    id: "art-1",
    slug: "pcos-demystified-causes-symptoms-care",
    title: "PCOS Demystified: The Rotterdam Criteria, Root Drivers & Holistic Care",
    subtitle: "Understanding why polycystic ovary syndrome is an endocrine condition, not just an ovarian issue.",
    category: "PCOS & Hormones",
    readTimeMinutes: 6,
    reviewedBy: "Dr. Ananya Sharma",
    reviewerTitle: "MS (Obstetrics & Gynecology)",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
    summary:
      "Polycystic Ovary Syndrome (PCOS) affects an estimated 1 in 5 Indian women of reproductive age. It is primarily a metabolic and neuro-endocrine disorder characterized by irregular ovulation, hyperandrogenism, and metabolic variations.",
    content: [
      "To receive a clinical diagnosis of PCOS under the international Rotterdam Consensus, a patient must meet at least 2 of the following 3 criteria: 1) Oligo- or anovulation (infrequent or absent menstrual periods); 2) Clinical and/or biochemical signs of hyperandrogenism (excess facial/body hair, hormonal cystic acne, or elevated blood testosterone); 3) Polycystic ovarian morphology visible on pelvic ultrasound.",
      "Crucially, having multiple small immature follicles on ultrasound alone does NOT mean you have PCOS without accompanying hormonal or cycle irregularities. Ultrasound findings can be temporary, especially in women under age 20.",
      "The underlying drivers of PCOS commonly include Insulin Resistance (present in over 70% of individuals), Chronic Low-Grade Inflammation, and Neuro-Endocrine Stress. Balancing blood glucose spikes through protein-forward meals, resistance training, and consistent sleep hygiene is the foundational first-line clinical recommendation.",
      "Medical caution: There is no overnight 'cure' or miracle supplement that permanently removes PCOS. It is a lifelong condition that can be managed effectively with sustained, compassionate lifestyle habits and evidence-based clinical guidance.",
    ],
    keyTakeaways: [
      "PCOS requires meeting 2 of 3 Rotterdam criteria, not just an ultrasound scan.",
      "Insulin resistance is a primary metabolic driver in the majority of PCOS cases.",
      "Sustainable lifestyle adjustments, stress regulation, and medical follow-ups form the cornerstone of management.",
    ],
    isClinicianReviewed: true,
  },
  {
    id: "art-2",
    slug: "cycle-phases-hormonal-rhythms",
    title: "The 4 Seasons of Your Menstrual Cycle: How Hormones Shape Your Month",
    subtitle: "A comprehensive scientific breakdown of the Menstrual, Follicular, Ovulatory, and Luteal phases.",
    category: "Cycle Science",
    readTimeMinutes: 5,
    reviewedBy: "Dr. Priyamvada Rao",
    reviewerTitle: "Fellowship in Reproductive Endocrinology",
    coverImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
    summary:
      "Your menstrual cycle is much more than your period days. It is an intricate 24- to 35-day dance between the brain (hypothalamus and pituitary gland) and the ovaries, governing energy, mood, and metabolism.",
    content: [
      "Phase 1: The Menstrual Phase (Days 1–5): Both estrogen and progesterone drop to their lowest levels, signaling the uterine lining to shed. Basal metabolic rate is slightly lower. Focus on warm nourishing stews, iron replenishment, and restful sleep.",
      "Phase 2: The Follicular Phase (Days 6–13): Follicle-Stimulating Hormone (FSH) stimulates ovarian follicles. As estrogen steadily rises, uterine lining thickens, serotonin increases, and energy, focus, and social enthusiasm rebound.",
      "Phase 3: The Ovulatory Phase (Days 14–16): A surge in Luteinizing Hormone (LH) triggers the release of a mature egg from the dominant follicle. Cervical fluid becomes clear and stretchy ('egg-white'). Energy and confidence peak.",
      "Phase 4: The Luteal Phase (Days 17–28): The ruptured follicle transforms into the corpus luteum, producing progesterone. Progesterone has a calming, warming effect on the brain. If conception does not occur, progesterone falls, initiating PMS symptoms.",
    ],
    keyTakeaways: [
      "Energy fluctuations throughout the month are normal and driven by shifting estrogen and progesterone.",
      "Tracking symptoms across cycle phases helps anticipate mood shifts and optimize nutrition.",
      "The luteal phase typically lasts 12 to 14 days and remains relatively consistent.",
    ],
    isClinicianReviewed: true,
  },
  {
    id: "art-3",
    slug: "iron-deficiency-anemia-indian-women",
    title: "Fighting the Silent Fatigue: Anemia & Ferritin in Indian Women",
    subtitle: "Why hemoglobin alone isn't enough to assess your iron reserves and energy levels.",
    category: "Nutrition & Health",
    readTimeMinutes: 4,
    reviewedBy: "Dr. Tanvi Banerjee",
    reviewerTitle: "Internal Medicine & Metabolic Health",
    coverImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=80",
    summary:
      "Studies show that more than 53% of reproductive-age women in India have iron-deficiency anemia. Understanding ferritin levels and dietary bio-availability can restore vitality and reduce cycle fatigue.",
    content: [
      "Many women with normal hemoglobin still suffer from iron deficiency because their serum ferritin (the body's iron storage tank) is depleted. Symptoms include chronic fatigue, hair shedding, brittle nails, cold hands/feet, and brain fog.",
      "Heavy menstrual bleeding (menorrhagia)—defined as losing more than 80ml of blood or soaking a sanitary pad every 1–2 hours—is one of the leading causes of depleted iron stores.",
      "Dietary tips: Plant-based non-heme iron (from moringa, dark green leafy vegetables, black chickpeas, and jaggery) must be paired with Vitamin C (lemon juice, amla, or bell peppers) to boost intestinal absorption by up to 300%. Avoid drinking tea or coffee within 60 minutes of meals, as tannins inhibit iron uptake.",
    ],
    keyTakeaways: [
      "Ask your doctor for both Hemoglobin and Serum Ferritin tests to assess true iron reserves.",
      "Heavy menstrual bleeding is a major contributor to chronic exhaustion.",
      "Pair non-heme iron with Vitamin C and avoid post-meal chai to maximize absorption.",
    ],
    isClinicianReviewed: true,
  },
];

export const pcosFaqs: PCOSFAQ[] = [
  {
    question: "Can PCOS be completely cured with home remedies or herbal supplements?",
    answer:
      "No. PCOS is a complex metabolic and endocrine condition that cannot be permanently cured by any single home remedy, tea, or supplement. However, its symptoms—such as irregular cycles, facial hair, and weight fluctuations—can be managed very effectively through balanced nutrition, physical activity, and medical guidance.",
    category: "Diet & Lifestyle",
  },
  {
    question: "Does having PCOS mean I will never be able to get pregnant?",
    answer:
      "Absolutely not. While PCOS is a common cause of ovulatory subfertility because ovulation occurs irregularly, the majority of women with PCOS can conceive naturally or with simple first-line medical ovulation induction therapies supervised by a reproductive specialist.",
    category: "Fertility",
  },
  {
    question: "Do I have PCOS if my pelvic ultrasound shows cysts on my ovaries?",
    answer:
      "Not necessarily. Up to 25% of healthy young women have ovaries with a polycystic appearance on ultrasound without having PCOS. Under clinical guidelines (Rotterdam criteria), a diagnosis requires at least two out of three criteria: irregular periods, elevated androgens, or ultrasound appearance. Cysts alone do not constitute PCOS.",
    category: "Diagnosis",
  },
  {
    question: "What is the difference between PCOD and PCOS?",
    answer:
      "PCOD (Polycystic Ovarian Disease) is more common, milder, and involves ovaries producing immature eggs due to hormonal imbalance, which can often be corrected with lifestyle changes. PCOS (Polycystic Ovary Syndrome) is a broader metabolic and endocrine disorder involving higher androgen production, insulin resistance, and increased risk of metabolic conditions like diabetes if unmanaged.",
    category: "Diagnosis",
  },
  {
    question: "Should I cut out all carbohydrates completely to manage PCOS?",
    answer:
      "No. Extreme carbohydrate elimination is rarely sustainable and can elevate cortisol (the stress hormone). Instead, choose complex, high-fiber, low-glycemic carbohydrates (millet, oats, brown rice, whole lentils) paired with adequate protein and healthy fats to prevent glucose spikes.",
    category: "Diet & Lifestyle",
  },
  {
    question: "Can Homeopathy or alternative therapies cure PCOS or infertility?",
    answer:
      "There is currently no robust, peer-reviewed clinical evidence proving that Homeopathy can cure PCOS or reverse infertility. While complementary lifestyle habits may assist in stress reduction, statutory clinical guidelines from the National Medical Commission (NMC) and international endocrine consensus recommend evidence-based metabolic management, cycle monitoring, and licensed allopathic gynecological care as first-line therapies. Never discontinue prescribed medical therapy or delay clinical evaluation based on unverified cure claims.",
    category: "Medication & Herbs",
  },
];
