export interface Achievement {
  trophy: string;
  title: string;
  org: string;
  year: string;
}

export const achievements: Achievement[] = [
  {
    trophy: '🏆',
    title: "Winner – Analytrix'26 Datathon",
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
    title: 'Runner-Up – Consulting Case Competition',
    org: 'IES Business School, Mumbai',
    year: '2025',
  },
  {
    trophy: '🏆',
    title: 'Winner – ML Quest Hackathon',
    org: 'GHRCE, Nagpur',
    year: '2025',
  },
  {
    trophy: '🏅',
    title: '4th out of 400+ – Ace The Case',
    org: 'IIT Bombay',
    year: '2025',
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

/**
 * TO ADD A NEW ACHIEVEMENT:
 *
 * Add to the achievements array:
 *
  {
    trophy: '🏆',  // or '🥈', '🥉', '🏅', '✨'
    title: 'Achievement Title',
    org: 'Organization/Event Name',
    year: '2026',
  },
 *
 * TO ADD A NEW LEADERSHIP POSITION:
 *
 * Add to the leadership array:
 *
  {
    icon: '👑',  // or any emoji
    role: 'Your Role',
    org: 'Organization Name',
    duration: 'Month Year – Present',
    description: 'What you do in this role',
  },
 */
