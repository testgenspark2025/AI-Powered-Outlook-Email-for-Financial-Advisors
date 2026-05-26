export type SegmentSeed = {
  id: number;
  name: string;
  range: string;
  icon: string;
  color: string;
  emailTone: string;
  characteristics: string[];
  challenges: string[];
};

export const SEGMENT_SEEDS: SegmentSeed[] = [
  {
    id: 1,
    name: "Ultra High Net Worth",
    range: "$50M+",
    icon: "crown",
    color: "purple",
    emailTone: "sophisticated",
    characteristics: [
      "Family offices",
      "Private banking",
      "Complex tax strategies",
      "Legacy planning",
    ],
    challenges: [
      "Multi-generational wealth transfer",
      "Tax optimization",
      "Philanthropy structuring",
      "Global asset protection",
    ],
  },
  {
    id: 2,
    name: "High Net Worth",
    range: "$5M - $50M",
    icon: "gem",
    color: "blue",
    emailTone: "professional",
    characteristics: ["Business owners", "Executives", "Investment professionals", "Entrepreneurs"],
    challenges: [
      "Business succession planning",
      "Executive compensation",
      "Alternative investments",
      "Risk management",
    ],
  },
  {
    id: 3,
    name: "Affluent Professionals",
    range: "$1M - $5M",
    icon: "briefcase",
    color: "green",
    emailTone: "consultative",
    characteristics: ["Doctors", "Lawyers", "Tech executives", "Senior managers"],
    challenges: [
      "Career transition planning",
      "College funding",
      "Retirement acceleration",
      "Tax efficiency",
    ],
  },
  {
    id: 4,
    name: "Mass Affluent",
    range: "$250K - $1M",
    icon: "chart-line",
    color: "teal",
    emailTone: "educational",
    characteristics: ["Mid-career professionals", "Dual-income families", "Small business owners"],
    challenges: [
      "401k optimization",
      "Home ownership",
      "Insurance planning",
      "Investment diversification",
    ],
  },
  {
    id: 5,
    name: "Pre-Retirees",
    range: "$500K - $2M",
    icon: "clock",
    color: "orange",
    emailTone: "reassuring",
    characteristics: ["Ages 55-65", "Peak earning years", "Nearing retirement"],
    challenges: [
      "Retirement income planning",
      "Healthcare costs",
      "Social Security optimization",
      "Legacy planning",
    ],
  },
  {
    id: 6,
    name: "Young Professionals",
    range: "$50K - $250K",
    icon: "rocket",
    color: "indigo",
    emailTone: "motivational",
    characteristics: ["Ages 25-35", "Early career", "Tech-savvy", "Growth-oriented"],
    challenges: [
      "Student loan management",
      "First home purchase",
      "Emergency fund building",
      "Career development",
    ],
  },
  {
    id: 7,
    name: "Recent Retirees",
    range: "$300K - $1.5M",
    icon: "umbrella",
    color: "cyan",
    emailTone: "supportive",
    characteristics: ["Ages 65-75", "Newly retired", "Income-focused"],
    challenges: [
      "Portfolio income generation",
      "Healthcare planning",
      "Inflation protection",
      "Activity funding",
    ],
  },
  {
    id: 8,
    name: "Divorced/Widowed",
    range: "$200K - $2M",
    icon: "heart-crack",
    color: "pink",
    emailTone: "empathetic",
    characteristics: ["Life transition", "Financial independence", "Emotional support needed"],
    challenges: [
      "Asset division",
      "Independent planning",
      "Confidence building",
      "New goal setting",
    ],
  },
  {
    id: 9,
    name: "Business Owners",
    range: "$500K - $10M",
    icon: "building",
    color: "amber",
    emailTone: "strategic",
    characteristics: ["Entrepreneurs", "Family businesses", "Growth-focused"],
    challenges: [
      "Business valuation",
      "Exit strategy",
      "Key person insurance",
      "Succession planning",
    ],
  },
  {
    id: 10,
    name: "Inherited Wealth",
    range: "$1M - $20M",
    icon: "gift",
    color: "rose",
    emailTone: "nurturing",
    characteristics: ["Next-gen inheritors", "Sudden wealth", "Learning curve"],
    challenges: [
      "Wealth responsibility",
      "Investment education",
      "Family dynamics",
      "Purpose alignment",
    ],
  },
];
