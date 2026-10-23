export interface Achievement {
  trophy: string;
  title: string;
  org: string;
  year: string;
}

export const achievements: Achievement[] = [
  {
    trophy: '🥈',
    title: '2nd Runner Up – KOPai Multimodal Study App',
    org: 'GDG on Campus, IIIT Surat Hackathon',
    year: '2026',
  },
  {
    trophy: '🏆',
    title: "Winner – Analytrix '26 Datathon",
    org: 'Society for Data Science, Thakur College of Engineering, Mumbai',
    year: '2026',
  },
  {
    trophy: '🏆',
    title: 'Winner – Spotify Case Study Competition',
    org: 'Datazen, KJ Somaiya College of Engineering, Mumbai',
    year: '2026',
  },
  {
    trophy: '🥈',
    title: 'Runner Up – Consulting Case Competition, IES Business School, Mumbai.',
    org: 'IES Business School, Mumbai',
    year: '2025',
  },
  {
    trophy: '🏆',
    title: 'Winner– Best Data Storytelling Pitch',
    org: 'Avenir Analytics Club, IES Business School, Mumbai',
    year: '2025',
  },
  {
    trophy: '🥈',
    title: 'Second Runner Up– VizAthon: Power BI Visualization Challenge.',
    org: 'Ei8 Office, Mumbai',
    year: '2025',
  },
  {
    trophy: '🏆',
    title: 'Winner – ML Quest Hackathon',
    org: 'G. H. Raisoni College of Engineering, Nagpur',
    year: '2024',
  },
];

export interface Leadership {
  icon: string;
  role: string;
  org: string;
  duration: string;
  description: string;
}

export const leadership: Leadership[] = [
  {
    icon: '👑',
    role: 'Vice Chairperson',
    org: 'Trinity – Interdisciplinary Student Committee',
    duration: 'July 2025 – Present',
    description: 'Leading strategy, operations, and cross-functional coordination for college-wide events.',
  },
  {
    icon: '📢',
    role: 'Head of Marketing',
    org: 'DJS S4DS – Society for Data Science',
    duration: 'August 2025 – Present',
    description: 'Engaging with tech firms, startups, and business leaders to secure strategic collaborations.',
  },
];
