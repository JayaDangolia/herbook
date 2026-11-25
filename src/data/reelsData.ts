export type ReelLabel =
  | "Clinician Reviewed"
  | "Personal Experience"
  | "General Wellness"
  | "Sponsored";

export interface ReelComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Reel {
  id: string;
  title: string;
  caption: string;
  videoUrl: string;
  posterUrl: string;
  category:
    | "Menstrual Health"
    | "PCOS Awareness"
    | "Fertility & Ovulation"
    | "Nutrition & Gut"
    | "Fitness & Movement"
    | "Mental Well-being"
    | "Women's Safety"
    | "Personal Journey";
  label: ReelLabel;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  isCreatorVerified: boolean;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  hasLiked?: boolean;
  hasSaved?: boolean;
  linkedAction?: {
    type: "consult" | "track" | "pcos";
    label: string;
    targetId?: string;
  };
  comments: ReelComment[];
}

export const initialReels: Reel[] = [
  {
    id: "reel-1",
    title: "Understanding Your 4 Menstrual Phases",
    caption:
      "Why your energy changes across your cycle! Estrogen vs Progesterone explained simply. Save this guide for your luteal phase! 🌸 #HerCycle #WomensHealth #HormoneHealth",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    posterUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80",
    category: "Menstrual Health",
    label: "Clinician Reviewed",
    creatorName: "Dr. Ananya Sharma",
    creatorHandle: "@dr_ananya_obgyn",
    creatorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80",
    isCreatorVerified: true,
    likesCount: 14200,
    commentsCount: 382,
    sharesCount: 1940,
    viewsCount: 89400,
    hasLiked: false,
    hasSaved: false,
    linkedAction: {
      type: "track",
      label: "Log Cycle in HerCycle",
    },
    comments: [
      {
        id: "c1",
        author: "Meera K.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        text: "This explains so much about why I feel exhausted on day 23! Thank you doctor 🙏",
        timestamp: "2 hours ago",
        likes: 45,
      },
      {
        id: "c2",
        author: "Pooja V.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
        text: "Sharing this with my hostel roommates right now!",
        timestamp: "4 hours ago",
        likes: 19,
      },
    ],
  },
  {
    id: "reel-2",
    title: "PCOS vs PCOD: What Is the Difference?",
    caption:
      "PCOD is more common and managed largely by lifestyle, while PCOS is a more complex endocrine disorder. Here are the 3 Rotterdam criteria! 🩺 #PCOSAwareness #PCOD #EndocrineHealth",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    posterUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
    category: "PCOS Awareness",
    label: "Clinician Reviewed",
    creatorName: "Dr. Tanvi Banerjee",
    creatorHandle: "@dr_tanvi_metabolic",
    creatorAvatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&auto=format&fit=crop&q=80",
    isCreatorVerified: true,
    likesCount: 22800,
    commentsCount: 641,
    sharesCount: 3100,
    viewsCount: 145000,
    hasLiked: false,
    hasSaved: false,
    linkedAction: {
      type: "pcos",
      label: "View PCOS Hub & Screener",
    },
    comments: [
      {
        id: "c3",
        author: "Aarti S.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        text: "Finally someone clarified Rotterdam criteria in simple words! My doctor never explained this.",
        timestamp: "1 day ago",
        likes: 78,
      },
    ],
  },
  {
    id: "reel-3",
    title: "Gentle Morning Routine for Period Cramps",
    caption:
      "Struggling with menstrual cramps? Try these 3 pelvic stretches + ginger turmeric infusion. Be kind to your body today 🧘‍♀️✨ #PeriodPain #CrampRelief #SelfCare",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    posterUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80",
    category: "Fitness & Movement",
    label: "General Wellness",
    creatorName: "Aditi Rao",
    creatorHandle: "@aditi_wellness_yoga",
    creatorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    isCreatorVerified: false,
    likesCount: 18400,
    commentsCount: 219,
    sharesCount: 1450,
    viewsCount: 92000,
    hasLiked: false,
    hasSaved: false,
    linkedAction: {
      type: "track",
      label: "Log Cramp Severity",
    },
    comments: [
      {
        id: "c4",
        author: "Ritu M.",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
        text: "The child's pose with bolster saved my workday today!",
        timestamp: "3 hours ago",
        likes: 31,
      },
    ],
  },
  {
    id: "reel-4",
    title: "My PCOS Journey: From Denial to Consistency",
    caption:
      "When I was diagnosed at 20, I was terrified. Over 4 years, small habit changes made a huge difference. You are not alone! 💪❤️ #PCOSJourney #PersonalStory #HerStory",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    posterUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    category: "Personal Journey",
    label: "Personal Experience",
    creatorName: "Sneha Kapoor",
    creatorHandle: "@sneha_stories",
    creatorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    isCreatorVerified: false,
    likesCount: 31200,
    commentsCount: 914,
    sharesCount: 2200,
    viewsCount: 210000,
    hasLiked: false,
    hasSaved: false,
    linkedAction: {
      type: "consult",
      label: "Book Gynecologist Consult",
      targetId: "doc-allo-1",
    },
    comments: [
      {
        id: "c5",
        author: "Simran T.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        text: "I needed to hear this today. Feeling less isolated.",
        timestamp: "5 hours ago",
        likes: 62,
      },
    ],
  },
  {
    id: "reel-5",
    title: "Nutrition for Iron Deficiency Anemia in Women",
    caption:
      "Over 50% of young Indian women experience low ferritin. Pairing iron-rich foods (spinach, jaggery, lentils) with Vitamin C (lemon, amla) boosts absorption! 🍋🥗 #IronDeficiency #AnemiaPrevention",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    posterUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop&q=80",
    category: "Nutrition & Gut",
    label: "Clinician Reviewed",
    creatorName: "Dr. Vaidya Gayatri Nambiar",
    creatorHandle: "@vaidya_gayatri",
    creatorAvatar: "https://images.unsplash.com/photo-1594824813583-9b6711728277?w=200&auto=format&fit=crop&q=80",
    isCreatorVerified: true,
    likesCount: 16900,
    commentsCount: 420,
    sharesCount: 1800,
    viewsCount: 104000,
    hasLiked: false,
    hasSaved: false,
    linkedAction: {
      type: "consult",
      label: "Consult Dr. Gayatri",
      targetId: "doc-ayur-1",
    },
    comments: [
      {
        id: "c6",
        author: "Divya N.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        text: "Never knew tea/coffee immediately after food blocks iron absorption! Such a good tip.",
        timestamp: "1 day ago",
        likes: 54,
      },
    ],
  },
];
