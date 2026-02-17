export interface CaseStudy {
  id: number;
  rank: string;
  title: string;
  meta: string;
  badge: string;
  badgeStyle: 'win' | 'runner-up' | 'finalist';
  problem: string;
  solution: string;
  impact: string;
  pptLink?: string;
  imageFolder: string; // Folder name in public/case-studies/
}

export const caseStudies: CaseStudy[] = [
  {
    id: 1,
    rank: '#1',
    title: 'Spotify India Market Strategy',
    meta: 'KJ Somaiya College · January 2026',
    badge: '🏆 Winner',
    badgeStyle: 'win',
    problem: 'Spotify India faced slowing user growth despite high engagement. Market saturation was evident.',
    solution: 'Shifted strategy from growth to monetization through premium tiers, regional content partnerships, and margin expansion.',
    impact: 'Identified ₹500Cr+ revenue opportunity through cultural segmentation and targeted upselling.',
    pptLink: 'https://example.com/spotify-ppt',
    imageFolder: 'spotify',
  },
  {
    id: 2,
    rank: '#2',
    title: 'Retail Analytics & Margin Optimization',
    meta: 'IES Business School · October 2025',
    badge: '🥈 Runner-Up',
    badgeStyle: 'runner-up',
    problem: 'Multi-region retailer with declining margins and inconsistent regional sales performance.',
    solution: 'Data-driven SKU rationalization, channel-specific campaigns, and inventory rebalancing across high-margin categories.',
    impact: 'Projected 18% margin improvement and 25% reduction in dead stock.',
    pptLink: 'https://example.com/retail-ppt',
    imageFolder: 'ies-retail',
  },
  {
    id: 3,
    rank: '#3',
    title: 'Workplace Inclusion Strategy (PwD)',
    meta: 'IIM Ahmedabad · September 2025',
    badge: '✨ Recognized',
    badgeStyle: 'finalist',
    problem: 'Tech firm facing 40% PwD attrition and zero promotions despite diversity hiring goals.',
    solution: '₹75L Universal Design plan with accessible infrastructure, mentorship programs, and cultural integration initiatives.',
    impact: 'Designed to reduce attrition by 60% and establish clear promotion pathways.',
    pptLink: 'https://example.com/iima-ppt',
    imageFolder: 'iim-ahmedabad',
  },
  {
    id: 4,
    rank: '#4',
    title: 'Post-Merger Workforce Restructuring',
    meta: 'IIT Bombay · 4th out of 400+ · February 2025',
    badge: '🏅 Top 5',
    badgeStyle: 'finalist',
    problem: 'Two merged firms with duplicate roles, cultural friction, and ballooning workforce costs.',
    solution: 'Strategic termination & retention plan based on output-to-cost ratio, cultural fit scoring, and succession planning.',
    impact: '22.4% increase in output-to-cost ratio, 25% workforce expense reduction, smooth cultural integration.',
    pptLink: 'https://example.com/iitb-ppt',
    imageFolder: 'iit-bombay',
  },
];

/**
 * TO ADD A NEW CASE STUDY:
 *
 * 1. Copy the template below
 * 2. Increment the id number
 * 3. Fill in your details
 * 4. Add images to public/case-studies/[your-folder-name]/
 *
 * TEMPLATE:
 *
  {
    id: 5,
    rank: '#1',  // or '#2', '#3', etc.
    title: 'Your Case Study Title',
    meta: 'College/Event Name · Month Year',
    badge: '🏆 Winner',  // or '🥈 Runner-Up', '✨ Recognized', etc.
    badgeStyle: 'win',  // or 'runner-up', 'finalist'
    problem: 'What was the problem statement or challenge?',
    solution: 'What approach or solution did you propose?',
    impact: 'What was the measurable impact or outcome?',
    pptLink: 'https://your-presentation-link.com',  // optional
    imageFolder: 'your-folder-name',  // create this in public/case-studies/
  },
 */
