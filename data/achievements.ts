export type Place = "Winner" | "Runner-up" | "2nd Runner-up";

// From the résumé: 13 podium finishes, plus the Vega Hackathon win (Feb 2026) = 14 across national hackathons and case competitions in total.
// The list below is the ones written up so far.
export const podiumTotal = 14;

export const recognitions = ["Top 1,000 students worldwide on Unstop (Feb 2025)"];

export interface Achievement {
  title: string;
  place: Place;
  kind: "hackathon" | "case" | "data";
  host: string;
  year: number;
}

export const achievements: Achievement[] = [
  { title: "Vega Hackathon", place: "Winner", kind: "hackathon", host: "Pratishtha", year: 2026 },
  { title: "KOPai study app", place: "2nd Runner-up", kind: "hackathon", host: "GDG on Campus, IIIT Surat", year: 2026 },
  { title: "Analytrix '26 Datathon", place: "Winner", kind: "data", host: "Thakur College of Engineering, Mumbai", year: 2026 },
  { title: "Spotify case study", place: "Winner", kind: "case", host: "Datazen, KJ Somaiya College, Mumbai", year: 2026 },
  { title: "Consulting case competition", place: "Runner-up", kind: "case", host: "IES Business School, Mumbai", year: 2025 },
  { title: "Best data storytelling pitch", place: "Winner", kind: "data", host: "Avenir Analytics Club, IES Business School", year: 2025 },
  { title: "VizAthon, Power BI challenge", place: "2nd Runner-up", kind: "data", host: "Ei8 Office, Mumbai", year: 2025 },
  { title: "ML Quest hackathon", place: "Winner", kind: "hackathon", host: "G. H. Raisoni College of Engineering, Nagpur", year: 2024 },
];
