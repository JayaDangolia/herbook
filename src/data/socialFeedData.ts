export interface SocialComment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface SocialPost {
  id: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  isCreatorVerified: boolean;
  category: "PCOS Awareness" | "Cycle Nutrition" | "Menstrual Health" | "Sisterhood" | "Fertility Science" | "Mindful Living";
  timestamp: string;
  mediaType: "image" | "carousel" | "infographic";
  mediaUrls: string[];
  caption: string;
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  hasLiked?: boolean;
  hasSaved?: boolean;
  feedCategory: "for_you" | "following" | "health";
  linkedAction?: {
    type: "track" | "consult" | "pcos" | "shop";
    label: string;
    targetId?: string;
  };
  comments: SocialComment[];
}

export const initialSocialPosts: SocialPost[] = [
  {
    id: "post-soc-1",
    creatorName: "Dr. Ananya Sharma",
    creatorHandle: "dr_ananya_obgyn",
    creatorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80",
    isCreatorVerified: true,
    category: "PCOS Awareness",
    timestamp: "2h ago",
    mediaType: "image",
    mediaUrls: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&auto=format&fit=crop&q=80",
    ],
    caption:
      "Understanding the 3 Rotterdam Criteria for PCOS! 🩺 Did you know you don't need cysts on your ultrasound to receive a PCOS diagnosis? In fact, 25% of healthy women have polycystic-appearing ovaries without having PCOS. Swipe to understand why checking your fasting insulin and androgen levels is far more clinically meaningful.",
    hashtags: ["PCOSCommunity", "RotterdamCriteria", "WomensHealthIndia", "HerBookHealth"],
    likesCount: 1842,
    commentsCount: 2,
    sharesCount: 312,
    savesCount: 654,
    hasLiked: false,
    hasSaved: false,
    feedCategory: "for_you",
    linkedAction: {
      type: "pcos",
      label: "Check Rotterdam Screener",
    },
    comments: [
      {
        id: "comm-s-1",
        username: "sneha_kapoor",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
        text: "My previous doctor never explained this. Thank you so much for demystifying it! ❤️",
        timestamp: "1h ago",
        likes: 24,
      },
      {
        id: "comm-s-2",
        username: "priya_blr",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        text: "Can insulin resistance happen even if my fasting glucose is completely normal?",
        timestamp: "45m ago",
        likes: 11,
      },
    ],
  },
  {
    id: "post-soc-2",
    creatorName: "Sneha Kapoor",
    creatorHandle: "sneha_pcos_journey",
    creatorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    isCreatorVerified: false,
    category: "Sisterhood",
    timestamp: "4h ago",
    mediaType: "carousel",
    mediaUrls: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&auto=format&fit=crop&q=80",
    ],
    caption:
      "4 years with PCOS and today I got my regular natural cycle on day 29! 🌸 It wasn't about extreme crash diets or cutting out all rotis. It was: 1) 25g protein breakfast within 90 mins of waking, 2) 20 mins post-dinner stroll, 3) 2 cups of pure spearmint tea daily. Celebrating small wins with my HerBook sisters today! ✨",
    hashtags: ["PCOSWarrior", "CycleSyncing", "IndianWomenHealth", "SisterCircle"],
    likesCount: 3410,
    commentsCount: 1,
    sharesCount: 520,
    savesCount: 1120,
    hasLiked: false,
    hasSaved: false,
    feedCategory: "following",
    linkedAction: {
      type: "track",
      label: "Log Cycle in HerCycle",
    },
    comments: [
      {
        id: "comm-s-3",
        username: "rhea_deshmukh",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        text: "So proud of you Sneha! Your consistency is so inspiring to all of us in the circle 💕",
        timestamp: "3h ago",
        likes: 42,
      },
    ],
  },
  {
    id: "post-soc-3",
    creatorName: "Dr. Vaidya Gayatri Nambiar",
    creatorHandle: "vaidya_gayatri",
    creatorAvatar: "https://images.unsplash.com/photo-1594824813583-9b6711728277?w=200&auto=format&fit=crop&q=80",
    isCreatorVerified: true,
    category: "Cycle Nutrition",
    timestamp: "6h ago",
    mediaType: "image",
    mediaUrls: [
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&auto=format&fit=crop&q=80",
    ],
    caption:
      "Ayurvedic Ritucharya for your Luteal Phase (Days 17–28) 🌿 As progesterone rises, digestive fire (Agni) can become sluggish, leading to water retention and premenstrual bloating. Focus on warm, easily digestible foods: ginger-cumin infusions, roasted makhana, and cooked greens. Avoid cold iced drinks and excessive raw salads during this week.",
    hashtags: ["AyurvedaForWomen", "LutealPhase", "HormonalHealth", "HerCare"],
    likesCount: 1980,
    commentsCount: 1,
    sharesCount: 388,
    savesCount: 890,
    hasLiked: false,
    hasSaved: false,
    feedCategory: "health",
    linkedAction: {
      type: "consult",
      label: "Consult Dr. Gayatri (₹550)",
      targetId: "doc-ayur-1",
    },
    comments: [
      {
        id: "comm-s-4",
        username: "ananya_blr",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        text: "Switching to warm ginger tea before bed reduced my morning puffiness so much!",
        timestamp: "4h ago",
        likes: 18,
      },
    ],
  },
  {
    id: "post-soc-4",
    creatorName: "Dr. Priyamvada Rao",
    creatorHandle: "dr_priyamvada_repro",
    creatorAvatar: "https://images.unsplash.com/photo-1594824813576-90516543b573?w=200&auto=format&fit=crop&q=80",
    isCreatorVerified: true,
    category: "Fertility Science",
    timestamp: "8h ago",
    mediaType: "image",
    mediaUrls: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900&auto=format&fit=crop&q=80",
    ],
    caption:
      "Cervical Mucus vs Ovulation Strips: What does the science say? 🔬 Estrogen peaks 24–36 hours before ovulation, turning cervical fluid clear, slippery, and stretchy ('egg-white'). While LH urine test strips detect the luteinizing hormone surge, tracking both gives you the clearest biological signal of your fertile window. (Reminder: fertile windows are educational approximations and not contraception).",
    hashtags: ["FertilityAwareness", "OvulationScience", "ReproductiveHealth", "HerBook"],
    likesCount: 2210,
    commentsCount: 0,
    sharesCount: 410,
    savesCount: 940,
    hasLiked: false,
    hasSaved: false,
    feedCategory: "health",
    linkedAction: {
      type: "pcos",
      label: "Log Fertility Biomarkers",
    },
    comments: [],
  },
  {
    id: "post-soc-5",
    creatorName: "Aditi Rao",
    creatorHandle: "aditi_movement",
    creatorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    isCreatorVerified: false,
    category: "Menstrual Health",
    timestamp: "12h ago",
    mediaType: "image",
    mediaUrls: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&auto=format&fit=crop&q=80",
    ],
    caption:
      "Why you shouldn't feel guilty about skipping HIIT during your period 🧘‍♀️ Day 1 & 2 are for restorative yoga, child's pose, and deep diaphragmatic breathing to release pelvic floor tension. Listen to your body's seasons!",
    hashtags: ["PeriodCare", "RestorativeMovement", "PelvicHealth", "SelfCareSunday"],
    likesCount: 2890,
    commentsCount: 0,
    sharesCount: 610,
    savesCount: 780,
    hasLiked: false,
    hasSaved: false,
    feedCategory: "for_you",
    linkedAction: {
      type: "track",
      label: "Log Cramp Severity",
    },
    comments: [],
  },
];
