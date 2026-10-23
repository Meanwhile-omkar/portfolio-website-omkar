export interface CaseStudy {
  id: number;
  title: string;
  meta: string;
  badge: string;
  badgeStyle: 'win' | 'runner-up' | 'finalist';
  problem: string;
  solution: string;
  impact: string;
  imageFolder: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: 'Spotify India Market Strategy',
    meta: 'Datazen · KJ Somaiya College · January 2026',
    badge: 'Winner',
    badgeStyle: 'win',
    problem: 'Spotify India faced slowing user growth despite high engagement. Market saturation in metros was evident while monetization lagged.',
    solution: 'Shifted strategy from growth to monetization through premium tiers, regional content partnerships, and cultural segmentation across tier-2 cities.',
    impact: 'Identified ₹500Cr+ revenue opportunity through targeted upselling and regional content strategy.',
    imageFolder: 'spotify',
  },
  {
    id: 2,
    title: 'Customer Segmentation for AI Study Companion',
    meta: "Analytrix Datathon · Thakur College of Engineering · 2026",
    badge: 'Winner',
    badgeStyle: 'win',
    problem: 'An AI study companion company needed deeper understanding of their Indian student user base across diverse demographics.',
    solution: 'Performed customer segmentation and behavioural analysis on the dataset — extracted insights about study patterns, engagement triggers, and churn signals by demographic cluster. Delivered actionable recommendations for product positioning.',
    impact: 'Won the datathon. Recommendations directly applicable to product roadmap and go-to-market strategy.',
    imageFolder: 'analytrix',
  },
  {
    id: 3,
    title: 'Retail Analytics & Margin Optimization',
    meta: 'IES Business School · October 2025',
    badge: 'Runner-Up',
    badgeStyle: 'runner-up',
    problem: 'Multi-region retailer with declining margins and inconsistent regional sales performance across categories.',
    solution: 'Data-driven SKU rationalization, channel-specific campaigns, and inventory rebalancing across high-margin categories.',
    impact: 'Projected 18% margin improvement and 25% reduction in dead stock.',
    imageFolder: 'ies-retail',
  },
  {
    id: 4,
    title: 'Ride-Hailing Driver Allocation Optimization',
    meta: 'Technalytics · IIT BHU, Varanasi · Top 10 of 340+ Participants',
    badge: 'Top 10',
    badgeStyle: 'finalist',
    problem: 'Ride-hailing platform facing high missed requests and poor operational efficiency due to misaligned driver allocation and shift planning.',
    solution: 'Recommended targeted driver deployment based on demand heatmaps and shift redesign to match peak patterns. Proposed incentive structures to fill supply gaps.',
    impact: 'Top 10 out of 340+ participants. Framework projected significant reduction in missed requests and improved driver utilization.',
    imageFolder: 'iit-bhu',
  },
  {
    id: 5,
    title: 'Annual Revenue of Uber — Live Guesstimate',
    meta: 'Guesstimate · IIM Sambalpur · Top 10 of 600+ Participants',
    badge: 'Top 10',
    badgeStyle: 'finalist',
    problem: 'Final round live guesstimate — "Estimate the Annual Revenue of Uber" — solved in 5 minutes on the spot.',
    solution: 'Structured bottom-up estimation: rides per day per city × average fare × take rate × global city count, adjusted for regional pricing and non-ride verticals (Uber Eats, Freight).',
    impact: 'Top 10 out of 600+ participants. First guesstimate experience — demonstrated structured thinking under pressure.',
    imageFolder: 'iim-sambalpur',
  },
  {
    id: 6,
    title: 'Virgin Galactic Financial Restructuring',
    meta: 'SPIT Finance Case Competition · 2025',
    badge: 'Finalist',
    badgeStyle: 'finalist',
    problem: 'Virgin Galactic facing high cash burn, expenses exceeding revenue, no stable profit, and increasing cost of capital. Needed new funding strategies and revenue streams urgently.',
    solution: 'Analysed competitive landscape and VC funding patterns. Identified that space defence payloads are attracting significant institutional capital. Recommended pivoting premium passenger spaceship operations toward defence payload delivery — financially stable in near term — while maintaining long-term passenger flight development in parallel.',
    impact: 'Proposed pivot aligned with observed market momentum in space-defence. Dual-track strategy preserves brand while stabilising cash flow.',
    imageFolder: 'virgin-galactic',
  },
  {
    id: 7,
    title: 'AgeTech Product — 0 to 1000 Customers Strategy',
    meta: 'Product Management Case · IIM Raichur · 2025',
    badge: 'Finalist',
    badgeStyle: 'finalist',
    problem: 'Product launching to bridge the gap between elderly parents and their NRI children who are away. Needed a 0-to-1000 customer strategy, problem analysis, and roadmap.',
    solution: 'Analysed loneliness patterns in elderly demographics, mapped against existing solutions (family apps, health monitors), and identified differentiated positioning. Proposed experiments across community, companionship, and safety verticals with phased rollout and channel strategy targeting NRI communities.',
    impact: 'Comprehensive go-to-market roadmap with prioritised feature bets and acquisition channels for the first 1000 users.',
    imageFolder: 'iim-raichur',
  },
  {
    id: 8,
    title: 'Post-Merger Workforce Restructuring',
    meta: 'Ace The Case · IIT Bombay · February 2025',
    badge: 'Top 5',
    badgeStyle: 'finalist',
    problem: 'Two merged firms with duplicate roles, cultural friction, and ballooning workforce costs needing strategic restructuring.',
    solution: 'Strategic retention plan based on output-to-cost ratio, cultural fit scoring, and succession planning to reduce redundancy while preserving key talent.',
    impact: '22.4% increase in output-to-cost ratio, 25% workforce expense reduction projected.',
    imageFolder: 'iit-bombay',
  },
  {
    id: 9,
    title: 'Workplace Inclusion Strategy (PwD)',
    meta: 'IIM Ahmedabad · September 2025',
    badge: 'Recognized',
    badgeStyle: 'finalist',
    problem: 'Tech firm facing 40% PwD attrition and zero promotions despite diversity hiring goals.',
    solution: '₹75L Universal Design plan with accessible infrastructure, mentorship programs, and cultural integration initiatives.',
    impact: 'Designed to reduce attrition by 60% and establish clear promotion pathways.',
    imageFolder: 'iim-ahmedabad',
  },
];
