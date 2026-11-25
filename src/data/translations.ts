export type Language = "en" | "hi";

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  nav: {
    home: string;
    track: string;
    reels: string;
    consult: string;
    community: string;
    learn: string;
    pcos: string;
    records: string;
    doctorPortal: string;
    admin: string;
    premium: string;
    shop: string;
    profile: string;
  };
  home: {
    welcome: string;
    cycleQuickStatus: string;
    dayOfCycle: string;
    daysUntilPeriod: string;
    periodStartsIn: string;
    logSymptoms: string;
    quickActions: string;
    consultDoctor: string;
    communityStories: string;
    trendingReels: string;
    dailyTip: string;
    disclaimerNotice: string;
  };
  cycle: {
    title: string;
    subtitle: string;
    logPeriod: string;
    editPeriod: string;
    periodStart: string;
    periodEnd: string;
    flowIntensity: string;
    spotting: string;
    light: string;
    medium: string;
    heavy: string;
    symptoms: string;
    cramps: string;
    headache: string;
    bloating: string;
    moodSwings: string;
    fatigue: string;
    acne: string;
    breastTenderness: string;
    backPain: string;
    digestive: string;
    sleepIssues: string;
    saveEntry: string;
    cancel: string;
    predictionTitle: string;
    confidence: string;
    irregularCycleNotice: string;
    historyTitle: string;
    averageCycle: string;
    days: string;
    fertileWindow: string;
    contraceptiveDisclaimer: string;
  };
  care: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allSystems: string;
    allopathy: string;
    ayurveda: string;
    homeopathy: string;
    filterBySpecialty: string;
    filterByLanguage: string;
    filterByFee: string;
    doctorFee: string;
    platformFee: string;
    totalFee: string;
    bookConsultation: string;
    syntheticNotice: string;
    verifiedDoctor: string;
    experience: string;
    years: string;
    languages: string;
    availableToday: string;
    videoConsult: string;
    clinicConsult: string;
    selectSlot: string;
    confirmBooking: string;
    waitingRoomTitle: string;
    startCall: string;
    endCall: string;
  };
  reels: {
    title: string;
    subtitle: string;
    allTopics: string;
    clinicianReviewed: string;
    personalExperience: string;
    generalWellness: string;
    uploadReel: string;
    like: string;
    comment: string;
    share: string;
    save: string;
    follow: string;
    commentsHeader: string;
    addCommentPlaceholder: string;
  };
  community: {
    title: string;
    subtitle: string;
    allTopics: string;
    createPost: string;
    postAsAnonymous: string;
    anonymousBadge: string;
    postPlaceholder: string;
    selectTopic: string;
    submitPost: string;
    report: string;
    guidelines: string;
    safetyNotice: string;
  };
  pcos: {
    title: string;
    subtitle: string;
    symptomTracker: string;
    faqs: string;
    emergencyAlert: string;
    emergencyText: string;
    findSpecialist: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "HerBook",
    tagline: "Her Body. Her Health. Her World.",
    nav: {
      home: "Home",
      track: "HerCycle",
      reels: "HerReels",
      consult: "HerCare",
      community: "HerCircle",
      learn: "HerWell",
      pcos: "PCOS & Fertility",
      records: "Health Records",
      doctorPortal: "Doctor Portal",
      admin: "Admin Hub",
      premium: "HerBook Premium",
      shop: "Wellness Shop",
      profile: "Profile & Privacy",
    },
    home: {
      welcome: "Welcome back",
      cycleQuickStatus: "Cycle Overview",
      dayOfCycle: "Day of cycle",
      daysUntilPeriod: "Days until next period",
      periodStartsIn: "Expected in",
      logSymptoms: "Log Today's Symptoms",
      quickActions: "Quick Actions",
      consultDoctor: "Consult Doctor",
      communityStories: "Sister Circle",
      trendingReels: "Trending Health Reels",
      dailyTip: "Today's Clinical Insight",
      disclaimerNotice:
        "Medical Disclaimer: HerBook provides educational and tracking resources. It is not a substitute for formal diagnosis or emergency medical care.",
    },
    cycle: {
      title: "HerCycle Tracker",
      subtitle: "Smart, explainable menstrual cycle predictions & symptom insights",
      logPeriod: "Log Period",
      editPeriod: "Edit Period Record",
      periodStart: "Period Started",
      periodEnd: "Period Ended",
      flowIntensity: "Flow Intensity",
      spotting: "Spotting",
      light: "Light",
      medium: "Medium",
      heavy: "Heavy",
      symptoms: "Symptoms & Sensations",
      cramps: "Menstrual Cramps",
      headache: "Headache / Migraine",
      bloating: "Abdominal Bloating",
      moodSwings: "Mood Shifts / Irritability",
      fatigue: "Low Energy / Fatigue",
      acne: "Hormonal Breakouts",
      breastTenderness: "Breast Tenderness",
      backPain: "Lower Back Pain",
      digestive: "Digestive Discomfort",
      sleepIssues: "Sleep Quality Changes",
      saveEntry: "Save Cycle Record",
      cancel: "Cancel",
      predictionTitle: "Explainable Cycle Forecast",
      confidence: "Prediction Confidence",
      irregularCycleNotice: "Cycle Variability Detected",
      historyTitle: "Cycle History & Trends",
      averageCycle: "Average Cycle Length",
      days: "days",
      fertileWindow: "Estimated Fertile Window",
      contraceptiveDisclaimer:
        "Important: Fertile window estimates are educational approximations and must NEVER be used as a method of contraception.",
    },
    care: {
      title: "HerCare Doctors",
      subtitle: "Verified practitioners across Modern Medicine, Ayurveda, and Homeopathy",
      searchPlaceholder: "Search by doctor name, specialty, or condition...",
      allSystems: "All Systems",
      allopathy: "Modern Medicine (Allopathy)",
      ayurveda: "Ayurveda",
      homeopathy: "Homeopathy",
      filterBySpecialty: "Specialty",
      filterByLanguage: "Language",
      filterByFee: "Max Consultation Fee",
      doctorFee: "Doctor Consultation Fee",
      platformFee: "Platform Booking Fee",
      totalFee: "Total Payable",
      bookConsultation: "Book Consultation",
      syntheticNotice:
        "Demonstration Notice: These practitioner profiles are synthetic representations for product evaluation. Actual practitioner registrations are verified prior to public launch.",
      verifiedDoctor: "Verified Practitioner",
      experience: "Experience",
      years: "years",
      languages: "Languages",
      availableToday: "Available Slots",
      videoConsult: "Encrypted Video Call",
      clinicConsult: "In-Clinic Visit",
      selectSlot: "Select Consultation Time",
      confirmBooking: "Confirm & Pay (Sandbox)",
      waitingRoomTitle: "HerCare Private Video Room",
      startCall: "Join Consultation",
      endCall: "End Consultation",
    },
    reels: {
      title: "HerReels",
      subtitle: "Bite-sized, expert-reviewed women's health and wellness videos",
      allTopics: "All Categories",
      clinicianReviewed: "Clinician Reviewed",
      personalExperience: "Personal Experience",
      generalWellness: "General Wellness",
      uploadReel: "Create Reel",
      like: "Like",
      comment: "Comment",
      share: "Share",
      save: "Bookmark",
      follow: "Follow Creator",
      commentsHeader: "Community Discussions",
      addCommentPlaceholder: "Write a respectful, supportive comment...",
    },
    community: {
      title: "HerCircle Community",
      subtitle: "Safe, moderated peer support groups for women across India",
      allTopics: "All Topics",
      createPost: "Share with Circle",
      postAsAnonymous: "Post anonymously (conceals your name and photo)",
      anonymousBadge: "Anonymous Sister",
      postPlaceholder: "Share your experience, ask a question, or offer encouragement...",
      selectTopic: "Choose a Community Topic",
      submitPost: "Publish Post",
      report: "Report Violation",
      guidelines: "Community Guidelines",
      safetyNotice:
        "Privacy Safeguard: Your menstrual cycle and health records are strictly confidential and will NEVER be shared in community posts.",
    },
    pcos: {
      title: "PCOS, PCOD & Fertility Hub",
      subtitle: "Evidence-based management, symptom monitoring, and specialist care",
      symptomTracker: "PCOS Symptom Monitor",
      faqs: "Clinician-Reviewed Answers",
      emergencyAlert: "Clinical Red Flag Escalation",
      emergencyText:
        "If you experience sudden severe pelvic pain, soaking through 2+ pads per hour for consecutive hours, fainting, or severe fever, seek immediate in-person emergency hospital care.",
      findSpecialist: "Find a PCOS Gynecologist",
    },
  },
  hi: {
    appName: "हरबुक (HerBook)",
    tagline: "उसका शरीर। उसका स्वास्थ्य। उसकी दुनिया।",
    nav: {
      home: "होम",
      track: "मासिक धर्म (HerCycle)",
      reels: "रील्स (HerReels)",
      consult: "डॉक्टर (HerCare)",
      community: "समुदाय (HerCircle)",
      learn: "स्वास्थ्य ज्ञान (HerWell)",
      pcos: "पीसीओएस और फर्टिलिटी",
      records: "मेडिकल रिकॉर्ड्स",
      doctorPortal: "डॉक्टर पोर्टल",
      admin: "एडमिन हब",
      premium: "प्रीमियम सदस्यता",
      shop: "वेलनेस शॉप",
      profile: "प्रोफ़ाइल और गोपनीयता",
    },
    home: {
      welcome: "वापसी पर स्वागत है",
      cycleQuickStatus: "मासिक धर्म स्थिति",
      dayOfCycle: "चक्र का दिन",
      daysUntilPeriod: "अगले पीरियड के दिन",
      periodStartsIn: "संभावित आगमन",
      logSymptoms: "आज के लक्षण दर्ज करें",
      quickActions: "त्वरित सेवाएं",
      consultDoctor: "डॉक्टर से परामर्श लें",
      communityStories: "सहेली सर्कल",
      trendingReels: "ट्रेंडिंग स्वास्थ्य रील्स",
      dailyTip: "आज की स्वास्थ्य सलाह",
      disclaimerNotice:
        "चिकित्सा अस्वीकरण: हरबुक शैक्षिक और ट्रैकिंग साधन प्रदान करता है। यह औपचारिक निदान या आपातकालीन देखभाल का विकल्प नहीं है।",
    },
    cycle: {
      title: "हर-साइकिल ट्रैकर",
      subtitle: "पारदर्शी और सटीक मासिक धर्म चक्र अनुमान और लक्षण विश्लेषण",
      logPeriod: "पीरियड दर्ज करें",
      editPeriod: "रिकॉर्ड सुधारें",
      periodStart: "पीरियड शुरू हुआ",
      periodEnd: "पीरियड समाप्त हुआ",
      flowIntensity: "बहाव की तीव्रता",
      spotting: "हल्की बूंदें (Spotting)",
      light: "हल्का (Light)",
      medium: "मध्यम (Medium)",
      heavy: "अधिक (Heavy)",
      symptoms: "शारीरिक लक्षण",
      cramps: "पेट में ऐंठन (Cramps)",
      headache: "सिरदर्द / माइग्रेन",
      bloating: "पेट फूलना (Bloating)",
      moodSwings: "मूड में बदलाव",
      fatigue: "थकान व सुस्ती",
      acne: "मुंहासे (Acne)",
      breastTenderness: "स्तनों में संवेदनशीलता",
      backPain: "कमर दर्द",
      digestive: "पाचन संबंधी परेशानी",
      sleepIssues: "नींद में बदलाव",
      saveEntry: "रिकॉर्ड सहेजें",
      cancel: "रद्द करें",
      predictionTitle: "चक्र अनुमान और विश्लेषण",
      confidence: "अनुमान विश्वसनीयता",
      irregularCycleNotice: "अनियमित चक्र चेतावनी",
      historyTitle: "इतिहास और रुझान",
      averageCycle: "औसत चक्र लंबाई",
      days: "दिन",
      fertileWindow: "संभावित फर्टाइल विंडो",
      contraceptiveDisclaimer:
        "महत्वपूर्ण: फर्टाइल विंडो केवल अनुमानित जानकारी है और इसे कभी भी गर्भनिरोधक विकल्प के रूप में उपयोग न करें।",
    },
    care: {
      title: "हर-केयर डॉक्टर परामर्श",
      subtitle: "एलोपैथी, आयुर्वेद और होम्योपैथी के प्रमाणित डॉक्टरों से संपर्क करें",
      searchPlaceholder: "डॉक्टर का नाम, विशेषता या लक्षण खोजें...",
      allSystems: "सभी चिकित्सा प्रणालियाँ",
      allopathy: "आधुनिक चिकित्सा (एलोपैथी)",
      ayurveda: "आयुर्वेद",
      homeopathy: "होम्योपैथी",
      filterBySpecialty: "विशेषज्ञता",
      filterByLanguage: "भाषा",
      filterByFee: "अधिकतम परामर्श शुल्क",
      doctorFee: "डॉक्टर परामर्श शुल्क",
      platformFee: "प्लेटफ़ॉर्म शुल्क",
      totalFee: "कुल देय राशि",
      bookConsultation: "परामर्श बुक करें",
      syntheticNotice:
        "डेमो सूचना: ये डॉक्टर प्रोफाइल केवल प्रदर्शन और परीक्षण हेतु काल्पनिक हैं।",
      verifiedDoctor: "प्रमाणित डॉक्टर",
      experience: "अनुभव",
      years: "वर्ष",
      languages: "भाषाएं",
      availableToday: "उपलब्ध समय",
      videoConsult: "सुरक्षित वीडियो परामर्श",
      clinicConsult: "क्लिनिक विज़िट",
      selectSlot: "समय चुनें",
      confirmBooking: "पुष्टि करें और भुगतान करें (सैंडबॉक्स)",
      waitingRoomTitle: "हर-केयर वीडियो कंसल्टेशन कक्ष",
      startCall: "परामर्श शुरू करें",
      endCall: "कॉल समाप्त करें",
    },
    reels: {
      title: "हर-रील्स",
      subtitle: "महिलाओं के स्वास्थ्य और कल्याण पर विशेषज्ञ वीडियो",
      allTopics: "सभी विषय",
      clinicianReviewed: "चिकित्सक द्वारा सत्यापित",
      personalExperience: "व्यक्तिगत अनुभव",
      generalWellness: "सामान्य स्वास्थ्य",
      uploadReel: "रील बनाएं",
      like: "पसंद",
      comment: "टिप्पणी",
      share: "साझा करें",
      save: "सहेजें",
      follow: "फॉलो करें",
      commentsHeader: "सामुदायिक चर्चा",
      addCommentPlaceholder: "सम्मानजनक टिप्पणी लिखें...",
    },
    community: {
      title: "हर-सर्कल समुदाय",
      subtitle: "भारतीय महिलाओं के लिए सुरक्षित, संयमित और सहायक मंच",
      allTopics: "सभी विषय",
      createPost: "पोस्ट साझा करें",
      postAsAnonymous: "गुमनाम रूप से पोस्ट करें",
      anonymousBadge: "गुमनाम सखी",
      postPlaceholder: "अपना अनुभव साझा करें या सलाह मांगें...",
      selectTopic: "विषय चुनें",
      submitPost: "पोस्ट करें",
      report: "शिकायत दर्ज करें",
      guidelines: "समुदाय नियम",
      safetyNotice:
        "गोपनीयता सुरक्षा: आपका मासिक धर्म रिकॉर्ड समुदाय में कभी साझा नहीं किया जाता।",
    },
    pcos: {
      title: "पीसीओएस, पीसीओडी और फर्टिलिटी",
      subtitle: "तथ्य-आधारित प्रबंधन, लक्षण निगरानी और विशेषज्ञ परामर्श",
      symptomTracker: "पीसीओएस लक्षण ट्रैकर",
      faqs: "चिकित्सकीय प्रश्नोत्तर",
      emergencyAlert: "आपातकालीन चेतावनी",
      emergencyText:
        "यदि अचानक तीव्र पैल्विक दर्द, अत्यधिक रक्तस्राव या चक्कर आए, तो तुरंत अस्पताल की आपातकालीन सेवा से संपर्क करें।",
      findSpecialist: "पीसीओएस विशेषज्ञ खोजें",
    },
  },
};
