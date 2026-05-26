export type HouseholdMemberSeed = {
  id: string;
  fullName: string;
  age: number | null;
  role: string;
  relation: string;
  occupation: string | null;
  assetsLabel: string | null;
};

export type HouseholdSeed = {
  id: string;
  name: string;
  totalMembers: number;
  householdAssetsLabel: string;
  members: HouseholdMemberSeed[];
};

export type ClientSeed = {
  id: string;
  householdId: string;
  segmentId: number;
  fullName: string;
  email: string;
  age: number;
  occupation: string;
  company: string;
  clientSince: string;
  riskProfile: "Conservative" | "Moderate" | "Aggressive";
};

export const HOUSEHOLD_SEEDS: HouseholdSeed[] = [
  {
    id: "hh_sterling",
    name: "Sterling Family",
    totalMembers: 4,
    householdAssetsLabel: "$72.3M",
    members: [
      {
        id: "hm_sterling_robert",
        fullName: "Robert Sterling",
        age: 58,
        role: "Primary Client",
        relation: "Self",
        occupation: "CEO & Founder",
        assetsLabel: "$67.5M",
      },
      {
        id: "hm_sterling_sarah",
        fullName: "Sarah Sterling",
        age: 54,
        role: "Spouse",
        relation: "Wife",
        occupation: "Philanthropist",
        assetsLabel: "$4.2M",
      },
      {
        id: "hm_sterling_michael",
        fullName: "Michael Sterling",
        age: 24,
        role: "Beneficiary",
        relation: "Son",
        occupation: "MBA Student",
        assetsLabel: "$350K",
      },
      {
        id: "hm_sterling_emma",
        fullName: "Emma Sterling",
        age: 21,
        role: "Beneficiary",
        relation: "Daughter",
        occupation: "College Student",
        assetsLabel: "$280K",
      },
    ],
  },
  {
    id: "hh_park",
    name: "Park Family",
    totalMembers: 3,
    householdAssetsLabel: "$8.7M",
    members: [
      {
        id: "hm_park_david",
        fullName: "David Park",
        age: 49,
        role: "Primary Client",
        relation: "Self",
        occupation: "VP Engineering",
        assetsLabel: "$5.8M",
      },
      {
        id: "hm_park_linda",
        fullName: "Linda Park",
        age: 47,
        role: "Spouse",
        relation: "Wife",
        occupation: "General Counsel",
        assetsLabel: "$2.7M",
      },
      {
        id: "hm_park_noah",
        fullName: "Noah Park",
        age: 12,
        role: "Dependent",
        relation: "Son",
        occupation: "Student",
        assetsLabel: "$200K",
      },
    ],
  },
  {
    id: "hh_martinez",
    name: "Martinez Family",
    totalMembers: 4,
    householdAssetsLabel: "$3.1M",
    members: [
      {
        id: "hm_martinez_sarah",
        fullName: "Dr. Sarah Martinez",
        age: 42,
        role: "Primary Client",
        relation: "Self",
        occupation: "Cardiologist",
        assetsLabel: "$2.3M",
      },
      {
        id: "hm_martinez_carlos",
        fullName: "Carlos Martinez",
        age: 45,
        role: "Spouse",
        relation: "Husband",
        occupation: "Engineering Manager",
        assetsLabel: "$520K",
      },
      {
        id: "hm_martinez_sofia",
        fullName: "Sofia Martinez",
        age: 8,
        role: "Dependent",
        relation: "Daughter",
        occupation: "Student",
        assetsLabel: "$140K",
      },
      {
        id: "hm_martinez_diego",
        fullName: "Diego Martinez",
        age: 6,
        role: "Dependent",
        relation: "Son",
        occupation: "Student",
        assetsLabel: "$140K",
      },
    ],
  },
  {
    id: "hh_obrien",
    name: "O'Brien Household",
    totalMembers: 2,
    householdAssetsLabel: "$1.4M",
    members: [
      {
        id: "hm_obrien_margaret",
        fullName: "Margaret O'Brien",
        age: 62,
        role: "Primary Client",
        relation: "Self",
        occupation: "Public School Principal (retiring)",
        assetsLabel: "$1.1M",
      },
      {
        id: "hm_obrien_thomas",
        fullName: "Thomas O'Brien",
        age: 65,
        role: "Spouse",
        relation: "Husband",
        occupation: "Recently Retired Electrician",
        assetsLabel: "$300K",
      },
    ],
  },
  {
    id: "hh_chen",
    name: "Chen (Single)",
    totalMembers: 1,
    householdAssetsLabel: "$185K",
    members: [
      {
        id: "hm_chen_jennifer",
        fullName: "Jennifer Chen",
        age: 28,
        role: "Primary Client",
        relation: "Self",
        occupation: "Senior Software Engineer",
        assetsLabel: "$185K",
      },
    ],
  },
];

export const CLIENT_SEEDS: ClientSeed[] = [
  {
    id: "cl_sterling",
    householdId: "hh_sterling",
    segmentId: 1,
    fullName: "Robert Sterling",
    email: "rsterling@sterlingfamily.com",
    age: 58,
    occupation: "CEO & Founder",
    company: "Sterling Family Office",
    clientSince: "March 2018",
    riskProfile: "Conservative",
  },
  {
    id: "cl_park",
    householdId: "hh_park",
    segmentId: 2,
    fullName: "David Park",
    email: "david.park@parkfamily.example",
    age: 49,
    occupation: "VP Engineering",
    company: "Nimbus Cloud",
    clientSince: "September 2020",
    riskProfile: "Moderate",
  },
  {
    id: "cl_martinez",
    householdId: "hh_martinez",
    segmentId: 3,
    fullName: "Dr. Sarah Martinez",
    email: "smartinez@citymedical.com",
    age: 42,
    occupation: "Cardiologist",
    company: "City Medical Partners",
    clientSince: "June 2021",
    riskProfile: "Moderate",
  },
  {
    id: "cl_obrien",
    householdId: "hh_obrien",
    segmentId: 5,
    fullName: "Margaret O'Brien",
    email: "margaret.obrien@example.com",
    age: 62,
    occupation: "Public School Principal (retiring)",
    company: "Oakdale School District",
    clientSince: "January 2017",
    riskProfile: "Conservative",
  },
  {
    id: "cl_chen",
    householdId: "hh_chen",
    segmentId: 6,
    fullName: "Jennifer Chen",
    email: "jchen.tech@gmail.com",
    age: 28,
    occupation: "Senior Software Engineer",
    company: "TechFlow Systems",
    clientSince: "January 2024",
    riskProfile: "Aggressive",
  },
];
