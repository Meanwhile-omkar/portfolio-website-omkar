export interface Internship {
  id: number;
  company: string;
  role: string;
  duration: string;
  period: string; // short label for timeline e.g. "Jun '24"
  location: string;
  type: 'remote' | 'on-site' | 'hybrid';
  description: string;
  responsibilities: string[];
  skills: string[];
  imageFolder: string;
}

export const internships: Internship[] = [
  {
    id: 1,
    company: 'Buzz Entertainment',
    role: 'Marketing Intern',
    duration: 'June 2024 – August 2024',
    period: "Jun '24",
    location: 'Mumbai, India',
    type: 'on-site',
    description: 'Event management company — standup comedy tours, concerts, and summit management.',
    responsibilities: [
      'Pitched sponsorships for a RAP battle concert to brands and media partners',
      'Assisted in standup comedy management with star comedian Zakir Khan',
      'Coordinated logistics and marketing collateral for live events',
    ],
    skills: ['Sponsorship Pitching', 'Event Marketing', 'Brand Partnerships', 'Client Management'],
    imageFolder: 'buzz',
  },
  {
    id: 2,
    company: 'IIT Bombay – KCDH Lab',
    role: 'ML Research Intern',
    duration: 'April 2025 – May 2025',
    period: "Apr '25",
    location: 'Mumbai, India',
    type: 'on-site',
    description: 'Koita Centre for Digital Health — research in non-invasive medical diagnostics using ML.',
    responsibilities: [
      'Explored non-invasive hemoglobin estimation by analysing scleral blood vessel images',
      'Applied image processing and ML techniques to study correlations between vessel features and blood data',
      'Evaluated feasibility of a low-cost diagnostic method using imaging and statistical analysis',
    ],
    skills: ['Python', 'Image Processing', 'Machine Learning', 'Medical AI', 'Research'],
    imageFolder: 'iitb-kcdh',
  },
  {
    id: 3,
    company: 'Sereno Volante Software Services',
    role: 'Machine Learning Engineer Intern',
    duration: 'June 2025 – August 2025',
    period: "Jun '25",
    location: 'Mumbai, India',
    type: 'remote',
    description: 'Industrial AI & automation solutions for large-scale manufacturing clients.',
    responsibilities: [
      'Partnered with JSW and Abhijeet on AI-driven automation projects including a sales analytics chatbot and a CAD tool for design validation',
      'Developed end-to-end ML systems from researching libraries to building data pipelines',
      'Gained hands-on experience with production workflows, virtual environments, and client-facing solutions',
    ],
    skills: ['Machine Learning', 'Python', 'Data Pipelines', 'Industrial Automation', 'Client Solutions'],
    imageFolder: 'sereno-volante',
  },
  {
    id: 4,
    company: 'Bigul',
    role: 'Product Management Intern',
    duration: 'November 2025 – December 2025',
    period: "Nov '25",
    location: 'Mumbai, India',
    type: 'remote',
    description: 'Algo trading platform — product strategy and UX research.',
    responsibilities: [
      'Benchmarked competitor apps to highlight feature gaps and guide product roadmap decisions',
      'Identified key UX issues across trading and algo features',
      'Recommended improvements to reduce user friction across core flows',
    ],
    skills: ['Product Management', 'Competitive Analysis', 'UX Research', 'Roadmapping'],
    imageFolder: 'bigul',
  },
  {
    id: 5,
    company: 'CypherSOL',
    role: 'Data Science Intern',
    duration: 'December 2025 – February 2026',
    period: "Dec '25",
    location: 'Mumbai, India',
    type: 'on-site',
    description: 'FinTech startup — AI-driven bank statement analysis and financial intelligence.',
    responsibilities: [
      'Created data automation scripts to clean, consolidate, and process multi-format bank statements',
      'Developing ML models for transaction category and entity recognition',
      'Replacing rule-based analytics with intelligent ML-driven classification systems',
    ],
    skills: ['Python', 'Pandas', 'Machine Learning', 'NLP', 'Data Processing'],
    imageFolder: 'cyphersol',
  },
];
