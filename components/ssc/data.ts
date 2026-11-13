// Paper catalog + the landing pages built from it. Safe to import from server and client code.
import papers from "@/data/sscPapers.json";
import { SITE_URL } from "@/lib/site";
import { MEDIUMS, SUBJECTS } from "./i18n";

export type Paper = {
  kind: "pyq" | "prelim" | "qbank" | "model";
  year: number | null;
  exam: string | null;
  session: "main" | "supplementary" | null;
  set?: string;
  medium: string | null;
  subject: string;
  variant: string | null;
  code: string | null;
  title: string;
  path: string;
  pages: number;
  sizeKB: number;
  // Set for papers written by another publisher: we link to their page instead of hosting a copy.
  external?: string;
};
export type Kind = Paper["kind"];

export const ALL = papers as Paper[];
export const BASE_PATH = "/ssc-board-papers";
// The page presents itself as its own resource, not as part of the portfolio, so SSC searches land here.
export const SSC_SITE_NAME = "SSC Board Papers · Maharashtra";
// PDFs are served from our own domain; next.config.js rewrites this prefix to the papers repo on GitHub Pages.
export const PDF_PREFIX = `${BASE_PATH}/pdf/`;
export const PAPERS_REPO = "https://github.com/Meanwhile-omkar/ssc-board-papers";

export const fileHref = (p: Paper) => p.external ?? PDF_PREFIX + p.path.split("/").map(encodeURIComponent).join("/");
export const fileAbs = (p: Paper) => p.external ?? SITE_URL + fileHref(p);

const SUBJ = Object.fromEntries(SUBJECTS.map((s) => [s.key, s]));

// Plain English name of one paper, used in structured data and link titles.
export function paperName(p: Paper) {
  const s = SUBJ[p.subject]?.en.replace(" · ", " ") ?? p.subject;
  const who = p.medium ? `${p.medium} Medium` : p.variant ?? "";
  if (p.kind === "pyq")
    return `Maharashtra SSC ${s} ${who} Board Question Paper ${p.exam}${p.session === "supplementary" ? " (Supplementary)" : ""}${p.code ? ` – ${p.code}` : ""}`;
  return `Maharashtra SSC ${p.title}`;
}

export type Scope = { kind?: Kind; year?: number; subject?: string; medium?: string };
export type Landing = {
  slug: string;
  scope: Scope;
  title: string; // <title>
  description: string;
  h1: { en: string; mr: string };
  intro: { en: string; mr: string };
};

const pyqYears = [...new Set(ALL.filter((p) => p.kind === "pyq").map((p) => p.year as number))].sort((a, b) => b - a);
const count = (f: (p: Paper) => boolean) => ALL.filter(f).length;

const yearLandings: Landing[] = pyqYears.map((y) => {
  const n = count((p) => p.kind === "pyq" && p.year === y);
  const hasMr = ALL.some((p) => p.year === y && p.medium === "Marathi");
  return {
    slug: `ssc-board-paper-${y}`,
    scope: { kind: "pyq", year: y },
    title: `Maharashtra SSC Board Question Paper ${y} PDF – All Subjects${hasMr ? " (English & Marathi Medium)" : ""}`,
    description: `Download all ${n} Maharashtra SSC (Class 10) board question papers of ${y} as free PDFs: Algebra, Geometry, Science 1 & 2, History, Geography, Marathi, Hindi, English and more${hasMr ? ", in English and Marathi medium" : ""}. दहावी बोर्ड प्रश्नपत्रिका ${y}.`,
    h1: { en: `SSC Board Papers ${y}`, mr: `दहावी बोर्ड प्रश्नपत्रिका ${y}` },
    intro: {
      en: `All ${n} papers from the ${y} Maharashtra SSC board exam${y >= 2023 ? ", including the supplementary exam" : ""}. Real board papers with their paper codes, free to open.`,
      mr: `${y} च्या महाराष्ट्र एसएससी बोर्ड परीक्षेतील सर्व ${n} प्रश्नपत्रिका. पेपर कोडसह खऱ्या बोर्ड प्रश्नपत्रिका, मोफत.`,
    },
  };
});

const SUBJECT_SLUGS: Record<string, string> = {
  algebra: "algebra-maths-1-question-papers",
  geometry: "geometry-maths-2-question-papers",
  science1: "science-part-1-question-papers",
  science2: "science-part-2-question-papers",
  history: "history-political-science-question-papers",
  geography: "geography-question-papers",
  marathi: "marathi-question-papers",
  hindi: "hindi-question-papers",
  english: "english-question-papers",
  sanskrit: "sanskrit-question-papers",
  urdu: "urdu-question-papers",
};
const subjectLandings: Landing[] = Object.entries(SUBJECT_SLUGS).map(([key, slug]) => {
  const s = SUBJ[key];
  const ps = ALL.filter((p) => p.kind === "pyq" && p.subject === key);
  const ys = ps.map((p) => p.year as number);
  const lo = Math.min(...ys), hi = Math.max(...ys);
  const name = s.en.replace(" · ", " (") + (s.en.includes("·") ? ")" : "");
  const core = !["marathi", "hindi", "english", "sanskrit", "urdu"].includes(key);
  return {
    slug,
    scope: { kind: "pyq", subject: key },
    title: `SSC ${name} Board Question Papers ${lo}–${hi} PDF${core ? " – English & Marathi Medium" : ""}`,
    description: `Every Maharashtra SSC ${name} board paper from ${lo} to ${hi} (${ps.length} papers) as free PDFs${core ? " in English, Marathi and other mediums" : ""}, plus prelim papers. दहावी ${s.mr} बोर्ड प्रश्नपत्रिका.`,
    h1: { en: `SSC ${name} papers`, mr: `दहावी ${s.mr} प्रश्नपत्रिका` },
    intro: {
      en: `${ps.length} real board papers of ${name} from ${lo} to ${hi}, newest first${core ? ", in every medium the board printed" : ""}. Pick your medium below.`,
      mr: `${lo} ते ${hi} मधील ${s.mr} विषयाच्या ${ps.length} खऱ्या बोर्ड प्रश्नपत्रिका, नवीन आधी. खाली तुमचे माध्यम निवडा.`,
    },
  };
});

const mediumLandings: Landing[] = (["Marathi", "English"] as const).map((m) => {
  const mm = MEDIUMS.find((x) => x.key === m)!;
  const n = count((p) => p.kind === "pyq" && p.medium === m);
  return {
    slug: `${m.toLowerCase()}-medium-question-papers`,
    scope: { kind: "pyq", medium: m },
    title: `SSC ${m} Medium Board Question Papers PDF – Maths, Science, History, Geography`,
    description: `Maharashtra SSC ${m} medium board papers (${n} papers) for Algebra, Geometry, Science 1 & 2, History and Geography, plus all language papers. Free PDFs. ${mm.mr} दहावी प्रश्नपत्रिका.`,
    h1: { en: `SSC ${m} medium papers`, mr: `${mm.mr} दहावी प्रश्नपत्रिका` },
    intro: {
      en: `${n} ${m} medium board papers for Maths, Science and Social Science, newest first. Language papers are the same for every medium and are listed too.`,
      mr: `गणित, विज्ञान व सामाजिकशास्त्राच्या ${n} ${mm.mr} बोर्ड प्रश्नपत्रिका, नवीन आधी. भाषा विषयांच्या प्रश्नपत्रिका सर्व माध्यमांसाठी सारख्याच असतात, त्याही दिल्या आहेत.`,
    },
  };
});

const otherLandings: Landing[] = [
  {
    slug: "prelim-question-papers",
    scope: { kind: "prelim" },
    title: "SSC Prelim Question Papers 2025-26 PDF – Maharashtra Board Class 10 Practice Papers",
    description: `Free Maharashtra SSC prelim (preliminary) and practice exam papers for 2025-26 and 2024-25: Algebra, Geometry, Science, History, Geography, Marathi, Hindi, English. दहावी सराव परीक्षा प्रश्नपत्रिका.`,
    h1: { en: "SSC prelim & practice papers", mr: "दहावी सराव / पूर्व परीक्षा प्रश्नपत्रिका" },
    intro: {
      en: "Full prelim and practice exams set by schools, in the same pattern as the board paper. Good for a last full mock before the board exam.",
      mr: "शाळांनी घेतलेल्या पूर्ण सराव व पूर्व परीक्षा, बोर्डाच्याच पद्धतीने. बोर्ड परीक्षेपूर्वी शेवटच्या सरावासाठी उपयोगी.",
    },
  },
  {
    slug: "question-bank",
    scope: { kind: "qbank" },
    title: "SSC Question Bank PDF (SCERT Maharashtra) – English & Marathi Medium",
    description: "Official SCERT Maharashtra question banks for SSC (Class 10): Maths, Science, History, Geography, English and Marathi, in English and Marathi medium. Free PDFs. दहावी प्रश्नपेढी.",
    h1: { en: "SSC question banks", mr: "दहावी प्रश्नपेढी" },
    intro: {
      en: "Chapter-wise practice questions published by SCERT Maharashtra, in English and Marathi medium.",
      mr: "SCERT महाराष्ट्रने प्रकाशित केलेली धडानिहाय सराव प्रश्नपेढी, इंग्रजी व मराठी माध्यमात.",
    },
  },
];

export const LANDINGS: Landing[] = [...yearLandings, ...subjectLandings, ...mediumLandings, ...otherLandings];
export const landingBySlug = (slug: string) => LANDINGS.find((l) => l.slug === slug);
export const papersInScope = (s: Scope) =>
  ALL.filter(
    (p) =>
      (!s.kind || p.kind === s.kind) &&
      (!s.year || p.year === s.year) &&
      (!s.subject || p.subject === s.subject) &&
      (!s.medium || !p.medium || p.medium === s.medium),
  );
