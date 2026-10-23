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
  imageFolder: string;
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
    links: {},
    imageFolder: 'lawzyai',
  },
  {
    id: 2,
    type: 'Hackathon',
    typeColor: 'hack',
    name: 'ML Quest – Fake Job Classifier',
    subtitle: 'Winner · ML Quest Hackathon, GHRCE Nagpur',
    desc: 'Machine learning model to classify fake job postings with 94% accuracy using NLP and ensemble methods.',
    stack: ['Python', 'Scikit-learn', 'NLP', 'Feature Engineering'],
    fullDesc: 'Developed during a 24-hour hackathon, this classifier uses advanced NLP techniques and ensemble methods to detect fraudulent job postings. The model analyzes posting language, company verification signals, and structural patterns to flag suspicious listings.',
    impact: '94% accuracy, deployed by organizing college as a screening tool.',
    links: {},
    imageFolder: 'ml-quest',
  },
  {
    id: 3,
    type: 'Hackathon',
    typeColor: 'hack',
    name: 'Murph',
    subtitle: 'Built at TSEC Hacks',
    desc: 'On-demand course platform for job-switchers powered by conversational AI, pay-per-use access, and teacher analytics.',
    stack: ['React', 'Node.js', 'AI/LLM', 'Stripe'],
    fullDesc: 'Murph is an on-demand learning platform designed specifically for professionals switching careers. A conversational AI recommends courses through chat based on target role. Pay-per-use model with free preview of initial modules so learners find their ideal teacher before committing. Teachers get transparent pricing, fair pay per content consumed, and detailed analytics on what\'s working and where engagement drops. The software architecture is designed to be layered on top of existing platforms like Udemy or Coursera.',
    impact: 'Solves the "wrong teacher" problem for job-switchers by letting learners trial content before paying.',
    links: {},
    imageFolder: 'murph',
  },
  {
    id: 4,
    type: 'Hackathon',
    typeColor: 'hack',
    name: 'KOPai',
    subtitle: '2nd Runner Up · IIIT Surat Hackathon',
    desc: 'Multimodal study platform that merges YouTube lectures, PDFs, notes and books into one AI-powered workspace.',
    stack: ['Python', 'React', 'LLMs', 'Multimodal AI', 'NLP'],
    fullDesc: 'Students juggle 5+ tabs — YouTube lectures, book notes, PDFs, presentations. KOPai merges and summarizes all of them concept-priority-wise at one place. USP: inline helper chat for clearing doubts at the exact line you\'re reading without leaving context. Two modes — Quick Mode for last-minute learners (short summaries, cheatsheets, important questions) and Deep Mode for long-term learners (all-in-one book creation, focus mode, concept graph, progress tracker).',
    impact: '2nd Runner Up at IIIT Surat Hackathon. Addresses the core pain of fragmented study resources for students.',
    links: {},
    imageFolder: 'kopai',
  },
  {
    id: 5,
    type: 'Hackathon',
    typeColor: 'hack',
    name: 'Enterprise AI Intelligence Layer',
    subtitle: 'Built at Datathon · KJ Somaiya College of Engineering',
    desc: 'AI layer that translates engineering commits and project updates into role-specific intelligence for each designation.',
    stack: ['Python', 'LLMs', 'Slack API', 'GitHub API', 'Jira API'],
    fullDesc: 'Different designations need different interpretations of the same project updates. Engineers need technical context — every commit and code change. Project managers need timeline visibility — what\'s failing, what\'s the cause. CEOs need product-level status — deal pipeline, money flow, productivity signals. HR needs team health — who is overloaded, who needs support, performance signals. This system integrates Slack, Jira, and GitHub, takes updates from the lowest hierarchy and translates them upward through an AI intelligence layer tailored per role.',
    impact: 'Eliminates information overload and cross-team miscommunication by delivering role-relevant intelligence automatically.',
    links: {},
    imageFolder: 'enterprise-ai',
  },
  {
    id: 6,
    type: 'Technical',
    typeColor: 'tech',
    name: 'Cricket Tournament Manager',
    subtitle: 'Live scoring platform for corporate tournaments',
    desc: 'Dual-portal system — scorer app + live viewer — for running multiple concurrent cricket matches like a full ICC tournament.',
    stack: ['React', 'Node.js', 'WebSockets', 'PostgreSQL'],
    fullDesc: 'Built entirely from scratch for corporate cricket tournaments. Two portals: a Scorer interface where match admins input live ball-by-ball data, and a Viewer interface where anyone can watch live scores, player stats, and full tournament brackets in real time — just like watching the IPL. Admin-lock system ensures only one scorer can control one match session at a time, while multiple admins can run parallel matches simultaneously. The audience can seamlessly switch between any live match, view historical stats, and see the full tournament structure — from group stages to finals — personalised and fully custom-built.',
    impact: 'Handles simultaneous multi-match tournaments with zero conflicts, delivering a broadcast-quality experience for corporate events.',
    links: {},
    imageFolder: 'cricket-manager',
  },
  {
    id: 7,
    type: 'Technical',
    typeColor: 'tech',
    name: 'AI Feedback Analyzer',
    subtitle: 'Instant AI responses + smart admin intelligence dashboard',
    desc: 'Users get instant personalised AI responses on feedback submission. Admins get a full analytics suite with AI-normalised insights.',
    stack: ['React', 'Python', 'LLMs', 'PostgreSQL', 'Recharts'],
    fullDesc: 'As soon as a user submits feedback, they receive an instant AI-generated response personalised to their specific input — not a template. On the admin side: a full dashboard showing total responses, average rating, response timeline, and a Smart Table where AI normalises free-text feedback into structured business terms. A key recommendation block surfaces what action to take next. The Insights Board groups feedback by star rating — click on 5-star to see what\'s working best, click on 1-star to get the top 5 things that need immediate fixing. All AI-analysed, no manual reading required.',
    impact: 'Transforms passive feedback collection into an active intelligence loop — customers feel heard, businesses act faster.',
    links: {},
    imageFolder: 'feedback-analyzer',
  },
  {
    id: 8,
    type: 'Product',
    typeColor: 'strategy',
    name: 'Gambit',
    subtitle: 'Personal content workspace built for raw creative capture',
    desc: 'A Notion-alternative for content writers — voice-to-text, multi-device sync, and hybrid voice/type input for instant 20-second notes.',
    stack: ['React Native', 'Next.js', 'Speech-to-Text API', 'Sync Engine'],
    fullDesc: 'Gambit is a personal content writing workspace tailored for creators who think faster than they type. Mobile and web apps are seamlessly integrated — start a note on your phone, continue on desktop, everything synced across tabs and devices instantly. The special feature: voice-to-text that works in hybrid mode. Talk freely to capture raw thoughts, then type in between to correct words or add detail without breaking flow. No switching modes, no friction. Content is saved in your raw voice, searchable, filterable by topic or date, and always available. Getting a full idea captured in under 20 seconds is the entire design goal.',
    impact: 'Eliminates the gap between thinking and documenting — built for the way creative minds actually work.',
    links: {},
    imageFolder: 'gambit',
  },
];
