export interface Project {
  id: number;
  type: 'Technical' | 'Hackathon' | 'Product' | 'Research';
  typeColor: 'tech' | 'hack' | 'strategy' | 'research';
  name: string;
  subtitle: string;
  desc: string;
  stack: string[];
  fullDesc: string;
  impact: string;
  links: {
    demo?: string;
    website?: string;
    github?: string;
  };
  imageFolder: string; // Folder in public/projects/
}

export const projects: Project[] = [
  {
    id: 1,
    type: 'Technical',
    typeColor: 'tech',
    name: 'LawzyAI',
    subtitle: 'Multilingual AI Legal Assistance Platform',
    desc: 'RAG-based system converting raw user narratives into IPC/BNS-mapped legal insights with document generation.',
    stack: ['Python', 'NLP', 'RAG', 'LLMs', 'Streamlit'],
    fullDesc: 'Built a sophisticated RAG-based system that empowers citizens to understand their legal rights. The platform converts raw user narratives into legally actionable insights mapped to IPC/BNS codes, generates case-specific documents, and includes an "Authority QnA" feature to reduce fear and friction in taking legal action.',
    impact: 'Reduces legal literacy barrier by 80% and provides free access to preliminary legal guidance.',
    links: {
      demo: 'https://example.com/lawzy-demo',
      website: 'https://example.com/lawzy',
      github: 'https://github.com/example/lawzy',
    },
    imageFolder: 'lawzyai',
  },
  {
    id: 2,
    type: 'Hackathon',
    typeColor: 'hack',
    name: 'ML Quest Fake Job Classifier',
    subtitle: 'Winner – ML Quest Hackathon, GHRCE Nagpur',
    desc: 'Machine learning model to classify fake job postings with 94% accuracy using NLP and ensemble methods.',
    stack: ['Python', 'Scikit-learn', 'NLP', 'Feature Engineering'],
    fullDesc: 'Developed during a 24-hour hackathon, this classifier uses advanced NLP techniques and ensemble methods to detect fraudulent job postings. The model analyzes posting language, company verification signals, and structural patterns to flag suspicious listings.',
    impact: '94% accuracy, deployed by organizing college as a screening tool.',
    links: {
      github: 'https://github.com/example/ml-quest',
    },
    imageFolder: 'ml-quest',
  },
];

/**
 * TO ADD A NEW PROJECT:
 *
 * 1. Copy the template below
 * 2. Increment the id number
 * 3. Fill in your details
 * 4. Add screenshots to public/projects/[project-folder]/
 *
 * TEMPLATE:
 *
  {
    id: 3,
    type: 'Technical',  // or 'Hackathon', 'Product', 'Research'
    typeColor: 'tech',  // or 'hack', 'strategy', 'research'
    name: 'Project Name',
    subtitle: 'Short tagline or achievement',
    desc: 'One-line description for the card view',
    stack: ['Tech1', 'Tech2', 'Tech3'],
    fullDesc: 'Detailed description of what you built, the problem it solves, and how it works. This shows in the modal.',
    impact: 'Quantifiable impact or outcome of the project',
    links: {
      demo: 'https://demo-link.com',  // optional
      website: 'https://website.com',  // optional
      github: 'https://github.com/your-repo',  // optional
    },
    imageFolder: 'project-name-lowercase',
  },
 */
