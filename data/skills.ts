import {
  siClaude,
  siGithub,
  siGooglegemini,
  siHuggingface,
  siJavascript,
  siJira,
  siJupyter,
  siKaggle,
  siLangchain,
  siFigma,
  siNextdotjs,
  siNumpy,
  siPandas,
  siPython,
  siReact,
  siScikitlearn,
  siTypescript,
} from "simple-icons";

type Icon = { title: string; path: string; hex: string };
export type SkillItem = { icon: Icon } | { word: string; color?: string; ink?: string };

export interface SkillGroup {
  id: string;
  label: string;
  color: string;
  items: SkillItem[];
}

// Taken from the résumés (Oct 2026) and the projects. Edit freely.
export const skillGroups: SkillGroup[] = [
  {
    id: "ai",
    label: "AI & data",
    color: "#18a0fb",
    items: [
      { icon: siPython },
      { icon: siPandas },
      { icon: siNumpy },
      { icon: siScikitlearn },
      { icon: siJupyter },
      { icon: siKaggle },
      { icon: siHuggingface },
      { icon: siLangchain },
      { word: "RAG", color: "#d8efff" },
      { word: "Agentic workflows", color: "#d8efff" },
      { word: "Power BI", color: "#fff1b8" },
      { word: "Excel", color: "#d4f5e6" },
    ],
  },
  {
    id: "build",
    label: "building things",
    color: "#1bc47d",
    items: [
      { icon: siReact },
      { icon: siNextdotjs },
      { icon: siTypescript },
      { icon: siJavascript },
      { icon: siGithub },
      { icon: siClaude },
      { icon: siGooglegemini },
      { word: "ChatGPT", color: "#1d1d1f", ink: "#ffffff" },
      { word: "SQL", color: "#d4f5e6" },
      { word: "Prompt engineering", color: "#d4f5e6" },
      { word: "LLM APIs", color: "#d4f5e6" },
    ],
  },
  {
    id: "product",
    label: "product & strategy",
    color: "#ee46d3",
    items: [
      { icon: siJira },
      { icon: siFigma },
      { word: "PRDs", color: "#ffd9f6" },
      { word: "User stories", color: "#ffd9f6" },
      { word: "UX research", color: "#ffd9f6" },
      { word: "Competitor analysis", color: "#ffd9f6" },
      { word: "KPIs", color: "#ffd9f6" },
      { word: "Pitch decks", color: "#ffd9f6" },
    ],
  },
];
