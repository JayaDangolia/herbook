export interface CommunityComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  isAnonymous: boolean;
  content: string;
  createdAt: string;
  likesCount: number;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  isAnonymous: boolean;
  topic:
    | "Period Experiences"
    | "PCOS Support"
    | "Fertility Journeys"
    | "Women's Wellness"
    | "College & Hostel Life"
    | "Career Discussions"
    | "Women's Safety"
    | "Mental Well-being";
  title: string;
  content: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  createdAt: string;
  hasLiked?: boolean;
  hasSaved?: boolean;
  isReported?: boolean;
  comments: CommunityComment[];
}

export const COMMUNITY_TOPICS = [
  "All Topics",
  "Period Experiences",
  "PCOS Support",
  "Fertility Journeys",
  "Women's Wellness",
  "College & Hostel Life",
  "Career Discussions",
  "Women's Safety",
  "Mental Well-being",
] as const;

export const initialCommunityPosts: CommunityPost[] = [
  {
    id: "post-1",
    authorName: "Ananya M.",
    authorHandle: "@ananya_blr",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    isAnonymous: false,
    topic: "PCOS Support",
    title: "How do you handle insulin resistance cravings in the evening?",
    content:
      "Hi sisters! Around 5 PM, my sugar cravings get so intense, especially during the luteal phase of my cycle. What snacks have actually helped you without causing a blood sugar spike? Would love practical Indian kitchen suggestions!",
    tags: ["PCOS", "InsulinResistance", "HealthySnacks", "LutealPhase"],
    likesCount: 148,
    commentsCount: 24,
    savesCount: 52,
    createdAt: "3 hours ago",
    comments: [
      {
        id: "comm-1",
        authorName: "Pooja V.",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        isAnonymous: false,
        content:
          "Roasted makhana with a handful of walnuts and pumpkin seeds has been my lifesaver! Protein + healthy fats completely curbed my 5 PM sugar crashes.",
        createdAt: "2 hours ago",
        likesCount: 38,
      },
      {
        id: "comm-2",
        authorName: "Anonymous Sister",
        authorAvatar: "",
        isAnonymous: true,
        content:
          "A warm cup of cinnamon water with a pinch of nutmeg and a spoon of soaked chia seeds works wonders for sweet cravings.",
        createdAt: "1 hour ago",
        likesCount: 19,
      },
    ],
  },
  {
    id: "post-2",
    authorName: "Anonymous Sister",
    authorHandle: "@anonymous_user",
    authorAvatar: "",
    isAnonymous: true,
    topic: "Period Experiences",
    title: "Switching from pads to menstrual cups in college hostels - my honest review",
    content:
      "I was terrified to try menstrual cups for 2 years because of shared hostel washrooms. Last month, I finally made the switch. Sharing 3 things that helped: 1) Practicing folds in the shower first, 2) Carrying a compact silicone sterilizer cup with an electric kettle, 3) Wearing panty liners for peace of mind. Total gamechanger for long lecture days!",
    tags: ["MenstrualCup", "HostelLife", "SustainablePeriods", "PeriodHacks"],
    likesCount: 320,
    commentsCount: 47,
    savesCount: 189,
    createdAt: "1 day ago",
    comments: [
      {
        id: "comm-3",
        authorName: "Kavya S.",
        authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
        isAnonymous: false,
        content:
          "Thank you for sharing this! The sterilization issue in shared bathrooms was my exact fear. Ordering a sterilizer cup today.",
        createdAt: "18 hours ago",
        likesCount: 27,
      },
    ],
  },
  {
    id: "post-3",
    authorName: "Deepika R.",
    authorHandle: "@deepika_law",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    isAnonymous: false,
    topic: "Career Discussions",
    title: "Navigating Day 1 cramps in high-stress corporate jobs",
    content:
      "How open are you with your managers about taking period rest or remote work on high-pain days? Do you request sick leave, or just push through with painkillers? I feel we need to normalize menstrual health in Indian workplaces.",
    tags: ["CorporateLife", "MenstrualLeave", "WorkplaceWellness", "WomenInWork"],
    likesCount: 265,
    commentsCount: 39,
    savesCount: 61,
    createdAt: "2 days ago",
    comments: [
      {
        id: "comm-4",
        authorName: "Anonymous Sister",
        authorAvatar: "",
        isAnonymous: true,
        content:
          "My company recently introduced 1 day/month wellness leave with no questions asked. It reduced my anxiety significantly. Hope more firms adopt this!",
        createdAt: "1 day ago",
        likesCount: 42,
      },
    ],
  },
  {
    id: "post-4",
    authorName: "Anonymous Sister",
    authorHandle: "@anonymous_user",
    authorAvatar: "",
    isAnonymous: true,
    topic: "Fertility Journeys",
    title: "Dealing with family pressure when you're taking your time to conceive",
    content:
      "Married for 2 years, aged 27. Every family function revolves around 'When are you giving us good news?'. Both my partner and I are focusing on our physical health and financial stability first. How do you respond respectfully while protecting your peace?",
    tags: ["FertilityPressure", "MentalHealth", "Boundaries", "FamilyDynamics"],
    likesCount: 412,
    commentsCount: 88,
    savesCount: 142,
    createdAt: "3 days ago",
    comments: [
      {
        id: "comm-5",
        authorName: "Rani G.",
        authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
        isAnonymous: false,
        content:
          "I simply smile and say 'In God's timing, thank you for your blessings!' and change the topic immediately. Never offer medical details or timelines. Sending you big hugs sister!",
        createdAt: "2 days ago",
        likesCount: 79,
      },
    ],
  },
];
