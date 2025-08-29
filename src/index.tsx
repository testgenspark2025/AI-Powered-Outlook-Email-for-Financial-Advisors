import { Hono } from 'hono'
import { renderer } from './renderer'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for API endpoints
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

app.use(renderer)

// 10 Wealth Client Segments for Financial Advisors in Americas
const clientSegments = [
  {
    id: 1,
    name: "Ultra High Net Worth",
    range: "$50M+",
    icon: "fas fa-crown",
    color: "purple",
    characteristics: ["Family offices", "Private banking", "Complex tax strategies", "Legacy planning"],
    challenges: ["Multi-generational wealth transfer", "Tax optimization", "Philanthropy structuring", "Global asset protection"],
    communicationStyle: "Highly formal, detailed, exclusive access",
    emailTone: "sophisticated"
  },
  {
    id: 2,
    name: "High Net Worth",
    range: "$5M - $50M",
    icon: "fas fa-gem",
    color: "blue",
    characteristics: ["Business owners", "Executives", "Investment professionals", "Entrepreneurs"],
    challenges: ["Business succession planning", "Executive compensation", "Alternative investments", "Risk management"],
    communicationStyle: "Professional, strategic, value-focused",
    emailTone: "professional"
  },
  {
    id: 3,
    name: "Affluent Professionals",
    range: "$1M - $5M",
    icon: "fas fa-briefcase",
    color: "green",
    characteristics: ["Doctors", "Lawyers", "Tech executives", "Senior managers"],
    challenges: ["Career transition planning", "College funding", "Retirement acceleration", "Tax efficiency"],
    communicationStyle: "Expert-to-expert, time-efficient",
    emailTone: "consultative"
  },
  {
    id: 4,
    name: "Mass Affluent",
    range: "$250K - $1M",
    icon: "fas fa-chart-line",
    color: "teal",
    characteristics: ["Mid-career professionals", "Dual-income families", "Small business owners"],
    challenges: ["401k optimization", "Home ownership", "Insurance planning", "Investment diversification"],
    communicationStyle: "Educational, goal-oriented",
    emailTone: "educational"
  },
  {
    id: 5,
    name: "Pre-Retirees",
    range: "$500K - $2M",
    icon: "fas fa-clock",
    color: "orange",
    characteristics: ["Ages 55-65", "Peak earning years", "Nearing retirement"],
    challenges: ["Retirement income planning", "Healthcare costs", "Social Security optimization", "Legacy planning"],
    communicationStyle: "Security-focused, conservative approach",
    emailTone: "reassuring"
  },
  {
    id: 6,
    name: "Young Professionals",
    range: "$50K - $250K",
    icon: "fas fa-rocket",
    color: "indigo",
    characteristics: ["Ages 25-35", "Early career", "Tech-savvy", "Growth-oriented"],
    challenges: ["Student loan management", "First home purchase", "Emergency fund building", "Career development"],
    communicationStyle: "Modern, digital-first, aspirational",
    emailTone: "motivational"
  },
  {
    id: 7,
    name: "Recent Retirees",
    range: "$300K - $1.5M",
    icon: "fas fa-umbrella-beach",
    color: "cyan",
    characteristics: ["Ages 65-75", "Newly retired", "Income-focused"],
    challenges: ["Portfolio income generation", "Healthcare planning", "Inflation protection", "Activity funding"],
    communicationStyle: "Patient, detailed explanations",
    emailTone: "supportive"
  },
  {
    id: 8,
    name: "Divorced/Widowed",
    range: "$200K - $2M",
    icon: "fas fa-heart-broken",
    color: "pink",
    characteristics: ["Life transition", "Financial independence", "Emotional support needed"],
    challenges: ["Asset division", "Independent planning", "Confidence building", "New goal setting"],
    communicationStyle: "Compassionate, empowering, patient",
    emailTone: "empathetic"
  },
  {
    id: 9,
    name: "Business Owners",
    range: "$500K - $10M",
    icon: "fas fa-building",
    color: "amber",
    characteristics: ["Entrepreneurs", "Family businesses", "Growth-focused"],
    challenges: ["Business valuation", "Exit strategy", "Key person insurance", "Succession planning"],
    communicationStyle: "Results-driven, ROI-focused",
    emailTone: "strategic"
  },
  {
    id: 10,
    name: "Inherited Wealth",
    range: "$1M - $20M",
    icon: "fas fa-gift",
    color: "rose",
    characteristics: ["Next-gen inheritors", "Sudden wealth", "Learning curve"],
    challenges: ["Wealth responsibility", "Investment education", "Family dynamics", "Purpose alignment"],
    communicationStyle: "Educational, patient, values-based",
    emailTone: "nurturing"
  }
];

// Sample client emails with realistic financial advisor communications
const sampleEmails = [
  {
    id: 1,
    clientId: "C001",
    clientName: "Robert Sterling",
    clientSegment: clientSegments[0], // Ultra High Net Worth
    from: "Robert Sterling <rsterling@sterlingfamily.com>",
    subject: "Q4 Family Office Review & Tax Strategy Discussion",
    clientProfile: {
      fullName: "Robert Sterling",
      age: 58,
      occupation: "CEO & Founder",
      company: "Sterling Family Office",
      clientSince: "March 2018",
      riskProfile: "Conservative"
    },
    householdProfile: {
      totalMembers: 4,
      householdAssets: "$72.3M",
      members: [
        {
          name: "Robert Sterling",
          age: 58,
          role: "Primary Client",
          relation: "Self",
          assets: "$67.5M",
          occupation: "CEO & Founder"
        },
        {
          name: "Sarah Sterling",
          age: 54,
          role: "Spouse",
          relation: "Wife",
          assets: "$4.2M",
          occupation: "Philanthropist"
        },
        {
          name: "Michael Sterling",
          age: 24,
          role: "Beneficiary",
          relation: "Son",
          assets: "$350K",
          occupation: "MBA Student"
        },
        {
          name: "Emma Sterling",
          age: 21,
          role: "Beneficiary",
          relation: "Daughter",
          assets: "$280K",
          occupation: "College Student"
        }
      ]
    },
    preview: "I'd like to schedule our quarterly review to discuss the foundation's performance and upcoming tax strategies...",
    time: "2:30 PM",
    date: "Today",
    isRead: false,
    isImportant: true,
    priority: "High",
    needsReply: true,
    sentiment: "professional",
    marketContext: "Year-end tax planning season",
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
    suggestedResponse: "Thank you for reaching out, Mr. Sterling. I've prepared a comprehensive Q4 review focusing on your foundation's 12% YTD performance and several year-end tax optimization opportunities. I'll coordinate with Sarah to schedule our meeting and will send the preliminary materials by end of week."
  },
  {
    id: 2,
    clientId: "C002", 
    clientName: "Dr. Sarah Martinez",
    clientSegment: clientSegments[2], // Affluent Professionals
    from: "Dr. Sarah Martinez <smartinez@citymedical.com>",
    subject: "Retirement Planning Update - Career Transition",
    clientProfile: {
      fullName: "Dr. Sarah Martinez",
      age: 42,
      occupation: "Cardiologist",
      company: "City Medical Partners",
      clientSince: "June 2021",
      riskProfile: "Moderate"
    },
    householdProfile: {
      totalMembers: 4,
      householdAssets: "$3.1M",
      members: [
        {
          name: "Dr. Sarah Martinez",
          age: 42,
          role: "Primary Client",
          relation: "Self",
          assets: "$2.3M",
          occupation: "Cardiologist"
        },
        {
          name: "Carlos Martinez",
          age: 45,
          role: "Spouse",
          relation: "Husband",
          assets: "$520K",
          occupation: "Engineering Manager"
        },
        {
          name: "Sofia Martinez",
          age: 8,
          role: "Dependent",
          relation: "Daughter",
          assets: "$140K",
          occupation: "Student"
        },
        {
          name: "Diego Martinez",
          age: 6,
          role: "Dependent",
          relation: "Son",
          assets: "$140K",
          occupation: "Student"
        }
      ]
    },
    preview: "I'm considering a partnership opportunity and need to review how this affects my retirement timeline...",
    time: "11:15 AM",
    date: "Today",
    isRead: false,
    isImportant: false,
    priority: "Medium",
    needsReply: true,
    sentiment: "optimistic",
    marketContext: "Healthcare sector opportunities",
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
    suggestedResponse: "Congratulations on this partnership opportunity, Dr. Martinez! This is exactly the kind of career advancement we've been planning for. Let me analyze the financial implications - the 40% income increase could accelerate your retirement timeline by 3-4 years. I'll prepare a comprehensive analysis covering funding options and tax strategies. Are you available Thursday afternoon for a detailed discussion?"
  },
  {
    id: 3,
    clientId: "C003",
    clientName: "Jennifer Chen",
    clientSegment: clientSegments[5], // Young Professionals
    from: "Jennifer Chen <jchen.tech@gmail.com>",
    subject: "First Home Purchase - Ready to Move Forward!",
    clientProfile: {
      fullName: "Jennifer Chen",
      age: 28,
      occupation: "Senior Software Engineer",
      company: "TechFlow Systems",
      clientSince: "January 2024",
      riskProfile: "Aggressive"
    },
    householdProfile: {
      totalMembers: 1,
      householdAssets: "$185K",
      members: [
        {
          name: "Jennifer Chen",
          age: 28,
          role: "Primary Client",
          relation: "Self",
          assets: "$185K",
          occupation: "Senior Software Engineer"
        }
      ]
    },
    preview: "Following our last meeting, I've found a condo I love and need to understand the financing options...",
    time: "4:45 PM",
    date: "Yesterday",
    isRead: true,
    isImportant: false,
    priority: "Medium", 
    needsReply: true,
    sentiment: "excited",
    marketContext: "Rising interest rates environment",
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

Also, my student loans are down to $42K now - ahead of schedule! 🎉

Talk soon!
Jen

P.S. Thanks for all your guidance - I couldn't have gotten here without your help!`,
    suggestedResponse: "Jen, this is fantastic news! You've been so disciplined with your savings plan. With your $95K saved, you're in a strong position for a 20% down payment, avoiding PMI. Let's discuss using your emergency fund strategically while maintaining adequate reserves. I'll prepare pre-approval guidance and connect you with our preferred mortgage specialist. Congratulations on this major milestone!"
  }
];

// API Endpoints
app.get('/api/clients/segments', (c) => {
  return c.json(clientSegments)
})

app.get('/api/emails', (c) => {
  return c.json(sampleEmails)
})

app.get('/api/emails/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const email = sampleEmails.find(email => email.id === id)
  if (!email) {
    return c.json({ error: 'Email not found' }, 404)
  }
  return c.json(email)
})

app.post('/api/ai/personalize', (c) => {
  // Mock AI personalization based on client segment
  return c.json({
    personalizedContent: "I've tailored this message based on your client's wealth segment, communication preferences, and current market context.",
    toneAdjustment: "Adjusted for professional, strategic communication style",
    complianceCheck: "✅ Compliant with financial advisory regulations",
    marketInsights: "Included relevant market context for current economic environment"
  })
})

app.get('/api/analytics/fa-dashboard', (c) => {
  return c.json({
    totalClients: 47,
    totalEmails: 6,
    needsReply: 4,
    segmentDistribution: {
      "Ultra High Net Worth": 3,
      "High Net Worth": 8, 
      "Affluent Professionals": 12,
      "Mass Affluent": 15,
      "Pre-Retirees": 6,
      "Young Professionals": 3
    },
    communicationMetrics: {
      responseTime: "2.3 hours avg",
      clientSatisfaction: "4.8/5",
      complianceScore: "100%"
    }
  })
})

// Main application route
app.get('/', (c) => {
  return c.render(
    <div>
      <head>
        <title>Financial Advisor Outlook - Personalized Client Communications</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" />
        <script dangerouslySetInnerHTML={{
          __html: `tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {
                colors: {
                  wealth: {
                    gold: '#D4AF37',
                    platinum: '#E5E4E2', 
                    emerald: '#50C878',
                    sapphire: '#0F52BA',
                    ruby: '#E0115F'
                  },
                  fa: {
                    blue: '#1E40AF',
                    green: '#059669',
                    gold: '#D97706'
                  }
                }
              }
            }
          }`
        }}></script>
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      
      <div class="h-screen flex flex-col bg-white dark:bg-gray-900">
        {/* Microsoft Outlook Title Bar */}
        <div class="bg-blue-600 text-white px-3 py-1 text-xs flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span>Financial Advisor Outlook</span>
          </div>
          <div class="flex items-center space-x-1">
            <button class="w-8 h-6 flex items-center justify-center hover:bg-blue-700" title="Minimize">
              <i class="fas fa-minus text-xs"></i>
            </button>
            <button class="w-8 h-6 flex items-center justify-center hover:bg-blue-700" title="Maximize">
              <i class="far fa-square text-xs"></i>
            </button>
            <button class="w-8 h-6 flex items-center justify-center hover:bg-red-600" title="Close">
              <i class="fas fa-times text-xs"></i>
            </button>
          </div>
        </div>

        {/* Outlook Ribbon Interface */}
        <div class="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
          {/* Ribbon Tabs */}
          <div class="bg-gray-50 dark:bg-gray-700 px-3 py-1 border-b border-gray-300 dark:border-gray-600">
            <div class="flex space-x-6 text-sm">
              <button class="px-3 py-1 text-blue-600 border-b-2 border-blue-600 font-medium">Home</button>
              <button class="px-3 py-1 text-gray-600 dark:text-gray-300 hover:text-blue-600">Send / Receive</button>
              <button class="px-3 py-1 text-gray-600 dark:text-gray-300 hover:text-blue-600">Folder</button>
              <button class="px-3 py-1 text-gray-600 dark:text-gray-300 hover:text-blue-600">View</button>
            </div>
          </div>
          
          {/* Ribbon Content */}
          <div class="px-3 py-2 bg-white dark:bg-gray-800">
            <div class="flex items-center space-x-4">
              {/* New Email Group */}
              <div class="flex flex-col items-center mr-6">
                <button onclick="newEmail()" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow-sm flex items-center space-x-2 mb-1">
                  <i class="fas fa-plus text-sm"></i>
                  <span class="text-sm font-medium">New Email</span>
                </button>
                <span class="text-xs text-gray-500 dark:text-gray-400">New</span>
              </div>

              <div class="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>

              {/* Reply Group */}
              <div class="flex space-x-2">
                <div class="flex flex-col items-center">
                  <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <i class="fas fa-reply text-gray-600 dark:text-gray-400"></i>
                  </button>
                  <span class="text-xs text-gray-500 dark:text-gray-400">Reply</span>
                </div>
                <div class="flex flex-col items-center">
                  <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <i class="fas fa-reply-all text-gray-600 dark:text-gray-400"></i>
                  </button>
                  <span class="text-xs text-gray-500 dark:text-gray-400">Reply All</span>
                </div>
                <div class="flex flex-col items-center">
                  <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <i class="fas fa-share text-gray-600 dark:text-gray-400"></i>
                  </button>
                  <span class="text-xs text-gray-500 dark:text-gray-400">Forward</span>
                </div>
              </div>

              <div class="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>

              {/* Delete Group */}
              <div class="flex flex-col items-center">
                <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <i class="fas fa-trash text-gray-600 dark:text-gray-400"></i>
                </button>
                <span class="text-xs text-gray-500 dark:text-gray-400">Delete</span>
              </div>

              <div class="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>

              {/* AI Features */}
              <div class="flex space-x-2">
                <div class="flex flex-col items-center">
                  <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <i class="fas fa-robot text-purple-600"></i>
                  </button>
                  <span class="text-xs text-gray-500 dark:text-gray-400">AI Assist</span>
                </div>
                <div class="flex flex-col items-center">
                  <button id="theme-toggle" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <i class="fas fa-moon text-gray-600 dark:text-gray-400"></i>
                  </button>
                  <span class="text-xs text-gray-500 dark:text-gray-400">Theme</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 flex overflow-hidden">
          {/* Outlook Navigation Pane */}
          <div class="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 flex flex-col">
            {/* Navigation Header */}
            <div class="px-3 py-3 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
              <div class="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Mail</div>
              <div class="relative">
                <input 
                  type="text" 
                  placeholder="Search" 
                  class="w-full pl-8 pr-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  id="search-input"
                />
                <i class="fas fa-search absolute left-2 top-2 text-gray-400 text-xs"></i>
              </div>
            </div>

            {/* Folder Tree */}
            <div class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
              {/* Favorites */}
              <div class="p-2">
                <div class="flex items-center px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <i class="fas fa-chevron-down mr-2 text-xs"></i>
                  <span>Favorites</span>
                </div>
                
                <div class="ml-4 mt-1">
                  <div class="flex items-center justify-between px-2 py-1 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded selected-folder">
                    <div class="flex items-center">
                      <i class="fas fa-inbox mr-2 text-blue-600"></i>
                      <span>Inbox</span>
                    </div>
                    <span class="bg-blue-600 text-white text-xs px-1 rounded" id="inbox-count-nav">3</span>
                  </div>
                  
                  <div class="flex items-center px-2 py-1 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <i class="fas fa-paper-plane mr-2 text-gray-500"></i>
                    <span>Sent Items</span>
                  </div>
                  
                  <div class="flex items-center px-2 py-1 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <i class="fas fa-file-alt mr-2 text-gray-500"></i>
                    <span>Drafts</span>
                  </div>
                </div>
              </div>

              {/* Main Folders */}
              <div class="p-2">
                <div class="flex items-center px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <i class="fas fa-chevron-down mr-2 text-xs"></i>
                  <span>outlook@financialadvisor.com</span>
                </div>
                
                <div class="ml-4 mt-1 space-y-1">
                  <div class="flex items-center justify-between px-2 py-1 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <div class="flex items-center">
                      <i class="fas fa-inbox mr-2 text-blue-600"></i>
                      <span>Inbox</span>
                    </div>
                    <span class="bg-blue-600 text-white text-xs px-1 rounded" id="inbox-count-main">3</span>
                  </div>
                  
                  <div class="flex items-center justify-between px-2 py-1 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <div class="flex items-center">
                      <i class="fas fa-exclamation-triangle mr-2 text-orange-500"></i>
                      <span>Junk Email</span>
                    </div>
                  </div>
                  
                  <div class="flex items-center px-2 py-1 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <i class="fas fa-file-alt mr-2 text-gray-500"></i>
                    <span>Drafts</span>
                  </div>
                  
                  <div class="flex items-center px-2 py-1 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <i class="fas fa-paper-plane mr-2 text-gray-500"></i>
                    <span>Sent Items</span>
                  </div>
                  
                  <div class="flex items-center px-2 py-1 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <i class="fas fa-trash mr-2 text-red-500"></i>
                    <span>Deleted Items</span>
                  </div>
                  
                  <div class="flex items-center px-2 py-1 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <i class="fas fa-archive mr-2 text-gray-500"></i>
                    <span>Archive</span>
                  </div>
                </div>
              </div>

              {/* Client Segments */}
              <div class="p-2">
                <div class="flex items-center px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <i class="fas fa-chevron-down mr-2 text-xs"></i>
                  <span>Client Segments</span>
                </div>
                
                <div class="ml-4 mt-1 space-y-1" id="wealth-segments">
                  {/* Populated by JavaScript */}
                </div>
              </div>
            </div>
          </div>

          {/* Outlook Message List */}
          <div class="w-1/3 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 flex flex-col">
            {/* Message List Header */}
            <div class="px-3 py-2 border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
              <div class="flex items-center justify-between mb-2">
                <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Inbox</h2>
                <div class="flex items-center space-x-1">
                  <button class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400" title="View settings">
                    <i class="fas fa-cog text-sm"></i>
                  </button>
                  <button class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400" title="Filter">
                    <i class="fas fa-filter text-sm"></i>
                  </button>
                </div>
              </div>
              
              {/* Filter Bar */}
              <div class="flex items-center space-x-2 text-sm">
                <button class="px-2 py-1 text-blue-600 border-b-2 border-blue-600 font-medium">All</button>
                <button class="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-blue-600">Unread</button>
                <button class="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-blue-600">Flagged</button>
                <div class="flex-1"></div>
                <span class="text-xs text-gray-500 dark:text-gray-400">Sort: Date</span>
              </div>
            </div>

            {/* Message List */}
            <div class="flex-1 overflow-y-auto bg-white dark:bg-gray-800" id="email-list">
              {/* Email list will be populated by JavaScript */}
            </div>
          </div>

          {/* Outlook Reading Pane */}
          <div class="flex-1 bg-white dark:bg-gray-800 flex flex-col border-l border-gray-300 dark:border-gray-600" id="email-preview">
            <div class="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
              <div class="text-center">
                <div class="mb-4">
                  <i class="fas fa-envelope-open text-4xl text-gray-300 dark:text-gray-600"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No item selected</h3>
                <p class="text-sm text-gray-500 dark:text-gray-500">Select an item to read</p>
              </div>
            </div>
          </div>

          {/* Client Insights Panel */}
          <div class="w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-300 dark:border-gray-600 flex flex-col hidden" id="client-insights-panel">
            <div class="px-4 py-3 border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200">Client Insights</h3>
                <button onclick="toggleClientInsights()" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400" title="Close insights">
                  <i class="fas fa-times text-xs"></i>
                </button>
              </div>
            </div>
            
            <div class="flex-1 overflow-y-auto p-4 space-y-4" id="client-insights-content">
              <div class="text-center text-gray-500 dark:text-gray-400">
                <i class="fas fa-user-chart text-3xl mb-2"></i>
                <p class="text-sm">Select an email to view client insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script src="/static/app.js"></script>
    </div>
  )
})

export default app