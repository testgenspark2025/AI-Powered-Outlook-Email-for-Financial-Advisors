export type EmailSeed = {
  id: string;
  clientId: string;
  threadId: string | null;
  folder: "inbox" | "junk" | "archive" | "deleted";
  subject: string;
  fromEmail: string;
  body: string;
  preview: string;
  receivedAt: string;
  isRead: boolean;
  isImportant: boolean;
  priority: "High" | "Medium" | "Low" | null;
  needsReply: boolean;
  sentiment: string | null;
  marketContext: string | null;
};

export const EMAIL_SEEDS: EmailSeed[] = [
  {
    id: "em_sterling_q4",
    clientId: "cl_sterling",
    threadId: "th_sterling_q4",
    folder: "inbox",
    subject: "Q4 Family Office Review & Tax Strategy Discussion",
    fromEmail: "Robert Sterling <rsterling@sterlingfamily.com>",
    body: `Dear Financial Team,

I hope this message finds you well. As we approach year-end, I'd like to schedule our quarterly family office review to discuss several important matters:

1. Foundation Performance Review
   - Q4 portfolio performance analysis
   - Impact investing outcomes
   - Philanthropic distribution strategy

2. Tax Optimization Strategies
   - Year-end tax loss harvesting opportunities
   - Charitable giving strategies for 2024
   - Estate planning updates given recent law changes

3. Next Generation Planning
   - Trust structure optimization
   - Family governance discussions
   - Education fund performance

Please coordinate with my assistant Sarah to find a suitable time next week. I'd prefer to meet in person at the family office.

Best regards,
Robert Sterling
Sterling Family Office`,
    preview:
      "I'd like to schedule our quarterly review to discuss the foundation's performance and upcoming tax strategies...",
    receivedAt: "2026-05-24T14:30:00.000Z",
    isRead: false,
    isImportant: true,
    priority: "High",
    needsReply: true,
    sentiment: "professional",
    marketContext: "Year-end tax planning season",
  },
  {
    id: "em_park_rsus",
    clientId: "cl_park",
    threadId: "th_park_rsus",
    folder: "inbox",
    subject: "RSU vesting next week — sell, hold, or diversify?",
    fromEmail: "David Park <david.park@parkfamily.example>",
    body: `Hi,

A large RSU tranche vests on the 31st (~$420K pre-tax). Linda and I want to be deliberate.

A few thoughts I'd like your input on:
- Concentration risk: roughly 38% of our liquid is already in Nimbus stock.
- Tax: we are squarely in the highest bracket; AMT exposure?
- Diversification: into the model portfolio, or wait given the recent rally?
- Cash flow: we are looking at private school deposit ($28K) in August.

Could you put together a quick framework before Friday? Happy to jump on a 30-minute call.

Thanks,
David`,
    preview:
      "A large RSU tranche vests on the 31st — Linda and I want to be deliberate about concentration risk and tax...",
    receivedAt: "2026-05-24T11:15:00.000Z",
    isRead: false,
    isImportant: true,
    priority: "High",
    needsReply: true,
    sentiment: "thoughtful",
    marketContext: "Tech sector volatility",
  },
  {
    id: "em_martinez_partnership",
    clientId: "cl_martinez",
    threadId: "th_martinez_partnership",
    folder: "inbox",
    subject: "Retirement Planning Update - Career Transition",
    fromEmail: "Dr. Sarah Martinez <smartinez@citymedical.com>",
    body: `Hi there,

I hope you're doing well! I wanted to update you on a significant career opportunity that's come up.

The medical practice has offered me a partnership position, which would involve:
- Initial investment of $500K
- Increased income potential (projected 40% increase)
- Equity stake in the practice
- Different retirement benefits structure

I need to understand:
1. How this affects our current retirement projections
2. Optimal way to fund the partnership investment
3. Tax implications of the transition
4. Updated insurance needs

Can we schedule a call this week? I need to give them an answer by month-end.

Thanks!
Dr. Sarah Martinez
City Medical Partners`,
    preview:
      "I'm considering a partnership opportunity and need to review how this affects my retirement timeline...",
    receivedAt: "2026-05-24T08:15:00.000Z",
    isRead: false,
    isImportant: false,
    priority: "Medium",
    needsReply: true,
    sentiment: "optimistic",
    marketContext: "Healthcare sector opportunities",
  },
  {
    id: "em_obrien_retirement",
    clientId: "cl_obrien",
    threadId: "th_obrien_retirement",
    folder: "inbox",
    subject: "Stepping down in June — income planning",
    fromEmail: "Margaret O'Brien <margaret.obrien@example.com>",
    body: `Hello,

It's official — my last day at the district will be June 27th. Thomas has been retired since February, and we'd like to walk through how our income will actually arrive each month from July onward.

Things on our mind:
- When to file for Social Security (I'm 62, Thomas just turned 65).
- Pension lump-sum vs. monthly annuity option. I have to elect by July 1.
- Healthcare bridge until I hit Medicare (we will be on Thomas's plan but want to confirm).
- Our spending target is roughly $7,500/mo; can the portfolio support that without depleting principal?

I know we talked through this in March, but seeing the actual dates makes it real. Could we sit down for an hour next week and look at the numbers together?

Warmly,
Margaret`,
    preview:
      "It's official — my last day at the district will be June 27th. We'd like to walk through how our income will actually arrive...",
    receivedAt: "2026-05-23T16:42:00.000Z",
    isRead: false,
    isImportant: true,
    priority: "High",
    needsReply: true,
    sentiment: "reflective",
    marketContext: "Rate environment for income portfolios",
  },
  {
    id: "em_chen_home",
    clientId: "cl_chen",
    threadId: "th_chen_home",
    folder: "inbox",
    subject: "First Home Purchase - Ready to Move Forward!",
    fromEmail: "Jennifer Chen <jchen.tech@gmail.com>",
    body: `Hey!

Hope your week is going great!

I'm so excited - I found the perfect condo in downtown! It's $425K, exactly what we discussed as my target range. The location is perfect for my commute to the tech campus.

Here's what I need help with:
- Down payment strategy (I have $95K saved)
- Mortgage pre-approval process
- How this affects my 401k contributions
- Should I use some funds from my emergency account?
- Timeline for everything

The seller wants a quick close, so I need to move fast. Can we talk tomorrow? I'm free after 6 PM.

Also, my student loans are down to $42K now - ahead of schedule!

Talk soon!
Jen`,
    preview:
      "Following our last meeting, I've found a condo I love and need to understand the financing options...",
    receivedAt: "2026-05-23T20:45:00.000Z",
    isRead: true,
    isImportant: false,
    priority: "Medium",
    needsReply: true,
    sentiment: "excited",
    marketContext: "Rising interest rates environment",
  },
];
