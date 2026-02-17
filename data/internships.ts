export interface Internship {
  id: number;
  company: string;
  role: string;
  duration: string;
  location: string;
  type: 'remote' | 'on-site' | 'hybrid';
  description: string;
  responsibilities: string[];
  impact: string;
  skills: string[];
  imageFolder: string; // Folder in public/internships/
}

export const internships: Internship[] = [
  {
    id: 1,
    company: 'CypherSOL',
    role: 'Data Science Intern',
    duration: 'December 2025 – February 2026',
    location: 'Mumbai, India',
    type: 'on-site',
    description: 'FinTech Startup for Bank Statement Analysis',
    responsibilities: [
      'Created data automation scripts to clean, consolidate, and process multi-format bank statements for model training',
      'Developing ML models for category and entity recognition',
      'Replacing existing rule-based analytics with intelligent ML-driven systems',
    ],
    impact: 'Reduced manual processing time by 75%, enabling scalable analysis of financial documents',
    skills: ['Python', 'Pandas', 'Machine Learning', 'Data Processing', 'NLP'],
    imageFolder: 'cyphersol',
  },
  {
    id: 2,
    company: 'Bigul',
    role: 'Product Management Intern',
    duration: 'November 2025 – December 2025',
    location: 'Mumbai, India',
    type: 'remote',
    description: 'Algo Trading Platform',
    responsibilities: [
      'Benchmarked competitor apps to highlight feature gaps and guide product roadmap decisions',
      'Identified key UX issues across trading and algo features',
      'Recommended improvements to reduce user friction',
    ],
    impact: 'Influenced 3 major feature additions and 12 UX improvements for Q1 2026 roadmap',
    skills: ['Product Management', 'Competitive Analysis', 'UX Research', 'Roadmapping'],
    imageFolder: 'bigul',
  },
  {
    id: 3,
    company: 'Sereno Volante Software Services',
    role: 'ML Developer Intern',
    duration: 'June 2025 – August 2025',
    location: 'Mumbai, India',
    type: 'remote',
    description: 'Industrial AI & Automation Solutions',
    responsibilities: [
      'Improved efficiency and reduced engineering effort in manufacturing workflows',
      'Delivered AI and automation solutions to industrial clients (JSW Steel, Abhijeet Plastics)',
      'Worked in a consulting capacity on production-level implementations',
    ],
    impact: 'Delivered solutions that improved manufacturing efficiency by 35% for client operations',
    skills: ['Machine Learning', 'Python', 'Industrial Automation', 'Consulting'],
    imageFolder: 'sereno-volante',
  },
];

/**
 * TO ADD A NEW INTERNSHIP:
 *
 * 1. Copy the template below
 * 2. Increment the id number
 * 3. Fill in your details
 * 4. Add images to public/internships/[company-folder]/
 *
 * TEMPLATE:
 *
  {
    id: 4,
    company: 'Company Name',
    role: 'Your Role/Title',
    duration: 'Month Year – Month Year',
    location: 'City, Country',
    type: 'remote',  // or 'on-site', 'hybrid'
    description: 'Short company/product description',
    responsibilities: [
      'Responsibility 1',
      'Responsibility 2',
      'Responsibility 3',
    ],
    impact: 'Quantifiable impact you made',
    skills: ['Skill1', 'Skill2', 'Skill3'],
    imageFolder: 'company-name-lowercase',
  },
 */
