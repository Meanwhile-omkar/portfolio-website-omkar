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
    return `Maharashtra SSC ${s} ${who} Board Question Paper ${p.exam}${p.session === "supplementary" ? " (Supplementary)" : ""}`;
  return `Maharashtra SSC ${p.title}`;
}

// Semi-English medium: the board prints no separate paper. Semi-English students write Maths and Science
// in English and History-Geography in Marathi, so they use those papers (language papers are common to all).
export const SEMI = "SemiEnglish";
const SEMI_EN = new Set(["algebra", "geometry", "science1", "science2", "maths", "science"]);
const SEMI_MR = new Set(["history", "geography"]);
export function inMedium(p: Paper, m: string) {
  if (!p.medium) return true; // language papers are the same for every medium
  if (m === SEMI) return SEMI_EN.has(p.subject) ? p.medium === "English" : SEMI_MR.has(p.subject) ? p.medium === "Marathi" : false;
  return p.medium === m;
}

export type Scope = { kind?: Kind; year?: number; subject?: string; medium?: string };
export type Landing = {
  slug: string;
  group: "year" | "subject" | "subjectYear" | "medium" | "mediumYear" | "other";
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
  // 2021: March exam cancelled (COVID); only a September exam in four subjects was held.
  if (!ALL.some((p) => p.kind === "pyq" && p.year === y && p.session === "main"))
    return {
      slug: `ssc-board-paper-${y}`,
      group: "year",
      scope: { kind: "pyq", year: y },
      title: `SSC Board Paper ${y} PDF – Maharashtra Board September ${y} Exam`,
      description: `The March ${y} SSC exam was cancelled due to COVID. Download the ${n} papers of the September ${y} Maharashtra SSC exam as free PDFs: Algebra, Geometry, Science 1 and Science 2. दहावी बोर्ड प्रश्नपत्रिका ${y}.`,
      h1: { en: `SSC Board Papers ${y}`, mr: `दहावी बोर्ड प्रश्नपत्रिका ${y}` },
      intro: {
        en: `The March ${y} exam was cancelled due to COVID. The board held one exam in September ${y}, for Algebra, Geometry, Science 1 and Science 2. Those ${n} papers are here.`,
        mr: `मार्च ${y} ची परीक्षा कोविडमुळे रद्द झाली. बोर्डाने सप्टेंबर ${y} मध्ये बीजगणित, भूमिती, विज्ञान १ व २ यांची परीक्षा घेतली. त्या ${n} प्रश्नपत्रिका येथे आहेत.`,
      },
    };
  return {
    slug: `ssc-board-paper-${y}`,
    group: "year",
    scope: { kind: "pyq", year: y },
    title: `SSC Board Paper ${y} PDF Download – Maharashtra Board (All Subjects)`,
    description: `All ${n} official Maharashtra SSC (Class 10) board question papers of ${y}, free PDF with no ads and no login: Algebra, Geometry, Science 1 & 2, History, Geography, Marathi, Hindi, English and more${hasMr ? ", in English, Semi-English and Marathi medium" : ""}. दहावी बोर्ड प्रश्नपत्रिका ${y}.`,
    h1: { en: `SSC Board Paper ${y}`, mr: `दहावी बोर्ड प्रश्नपत्रिका ${y}` },
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
    group: "subject",
    scope: { kind: "pyq", subject: key },
    title: `SSC ${name} Question Paper PDF ${lo}–${hi} – Maharashtra Board`,
    description: `Every official Maharashtra SSC ${name} board paper from ${lo} to ${hi} (${ps.length} papers), free PDF with no ads${core ? ", in English, Semi-English, Marathi and other mediums" : ""}, plus prelim papers. दहावी ${s.mr} बोर्ड प्रश्नपत्रिका.`,
    h1: { en: `SSC ${name} question papers`, mr: `दहावी ${s.mr} प्रश्नपत्रिका` },
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
    group: "medium",
    scope: { kind: "pyq", medium: m },
    title: `SSC ${m} Medium Question Papers PDF – Maharashtra Board Class 10`,
    description: `Maharashtra SSC ${m} medium board papers (${n} papers) for Algebra, Geometry, Science 1 & 2, History and Geography, plus all language papers. Free PDFs. ${mm.mr} दहावी प्रश्नपत्रिका.`,
    h1: { en: `SSC ${m} medium papers`, mr: `${mm.mr} दहावी प्रश्नपत्रिका` },
    intro: {
      en: `${n} ${m} medium board papers for Maths, Science and Social Science, newest first. Language papers are the same for every medium and are listed too.`,
      mr: `गणित, विज्ञान व सामाजिकशास्त्राच्या ${n} ${mm.mr} बोर्ड प्रश्नपत्रिका, नवीन आधी. भाषा विषयांच्या प्रश्नपत्रिका सर्व माध्यमांसाठी सारख्याच असतात, त्याही दिल्या आहेत.`,
    },
  };
});

const semiYears = pyqYears.filter((y) => ALL.some((p) => p.kind === "pyq" && p.year === y && p.medium && inMedium(p, SEMI)));
const semiLandings: Landing[] = [
  {
    slug: "semi-english-medium-question-papers",
    group: "medium",
    scope: { kind: "pyq", medium: SEMI },
    title: "SSC Semi-English Medium Question Papers PDF – Official Maharashtra Board Papers",
    description:
      "Official Maharashtra SSC board papers for Semi-English medium students, 2019–2026: Algebra, Geometry, Science 1 & 2 in English, History and Geography in Marathi, plus language papers. Free PDF, no ads, no login. सेमी इंग्रजी माध्यम दहावी प्रश्नपत्रिका.",
    h1: { en: "SSC Semi-English medium papers", mr: "सेमी इंग्रजी माध्यम दहावी प्रश्नपत्रिका" },
    intro: {
      en: "The board does not print a separate Semi-English paper. Semi-English students write Maths and Science in English and History-Geography in Marathi, so these are exactly the official papers you sit: English medium Algebra, Geometry, Science 1 and 2, Marathi medium History and Geography, and the language papers.",
      mr: "बोर्ड सेमी इंग्रजीसाठी वेगळी प्रश्नपत्रिका छापत नाही. सेमी इंग्रजीचे विद्यार्थी गणित व विज्ञान इंग्रजीत आणि इतिहास-भूगोल मराठीत लिहितात, म्हणून तुम्ही ज्या अधिकृत प्रश्नपत्रिका सोडवता त्याच येथे आहेत: इंग्रजी माध्यमाचे बीजगणित, भूमिती, विज्ञान १ व २, मराठी माध्यमाचे इतिहास व भूगोल, आणि भाषा विषय.",
    },
  },
  ...semiYears.map((y) => ({
    slug: `ssc-semi-english-question-paper-${y}`,
    group: "mediumYear" as const,
    scope: { kind: "pyq" as const, year: y, medium: SEMI },
    title: `SSC Semi-English Medium Question Paper ${y} PDF – Maharashtra Board`,
    description: `Official Maharashtra SSC ${y} board papers for Semi-English medium: Algebra, Geometry, Science 1 & 2 (English) and History, Geography (Marathi), plus language papers. Free PDF, no ads, no login. सेमी इंग्रजी दहावी प्रश्नपत्रिका ${y}.`,
    h1: { en: `SSC Semi-English papers ${y}`, mr: `सेमी इंग्रजी दहावी प्रश्नपत्रिका ${y}` },
    intro: {
      en: `The official ${y} board papers a Semi-English medium student sits: Maths and Science in English, History and Geography in Marathi, plus the language papers. The board prints no separate Semi-English paper.`,
      mr: `सेमी इंग्रजी माध्यमाचा विद्यार्थी ${y} मध्ये ज्या अधिकृत बोर्ड प्रश्नपत्रिका सोडवतो त्या: गणित व विज्ञान इंग्रजीत, इतिहास व भूगोल मराठीत, आणि भाषा विषय. बोर्ड सेमी इंग्रजीसाठी वेगळी प्रश्नपत्रिका छापत नाही.`,
    },
  })),
];

const otherLandings: Landing[] = [
  {
    slug: "prelim-question-papers",
    group: "other",
    scope: { kind: "prelim" },
    title: "SSC Prelim Question Papers 2025-26 PDF – Maharashtra Board Practice Papers",
    description: `Free Maharashtra SSC prelim (preliminary) and practice exam papers for 2025-26 and 2024-25: Algebra, Geometry, Science, History, Geography, Marathi, Hindi, English. दहावी सराव परीक्षा प्रश्नपत्रिका.`,
    h1: { en: "SSC prelim & practice papers", mr: "दहावी सराव / पूर्व परीक्षा प्रश्नपत्रिका" },
    intro: {
      en: "Full prelim and practice exams set by schools, in the same pattern as the board paper. Good for a last full mock before the board exam.",
      mr: "शाळांनी घेतलेल्या पूर्ण सराव व पूर्व परीक्षा, बोर्डाच्याच पद्धतीने. बोर्ड परीक्षेपूर्वी शेवटच्या सरावासाठी उपयोगी.",
    },
  },
  {
    slug: "question-bank",
    group: "other",
    scope: { kind: "qbank" },
    title: "SCERT Maharashtra Question Bank PDF – SSC Class 10 (English & Marathi Medium)",
    description: "Official SCERT Maharashtra question bank for SSC (Class 10), 2022 and 2023: Maths, Science, History, Geography, English and Marathi, in English and Marathi medium. Free PDF download. दहावी प्रश्नपेढी SCERT.",
    h1: { en: "SCERT Maharashtra question bank (SSC)", mr: "SCERT दहावी प्रश्नपेढी" },
    intro: {
      en: "Chapter-wise practice questions published by SCERT Maharashtra, in English and Marathi medium.",
      mr: "SCERT महाराष्ट्रने प्रकाशित केलेली धडानिहाय सराव प्रश्नपेढी, इंग्रजी व मराठी माध्यमात.",
    },
  },
];

// Marks and time of a paper, from the board's pattern (revised course, 2019 onwards).
export function patternOf(p: Paper) {
  const lang = ["marathi", "hindi", "english", "sanskrit", "urdu", "arabic", "german"].includes(p.subject);
  return lang && p.variant !== "Composite" && !p.variant?.startsWith("Composite") ? { marks: 80, hours: 3 } : { marks: 40, hours: 2 };
}

// One page per subject per year, e.g. /ssc-board-papers/ssc-english-question-paper-2025. These match how
// students actually search ("ssc english question paper 2025 maharashtra board") and carry citable facts.
const SY_SLUG: Record<string, string> = {
  algebra: "algebra", geometry: "geometry", science1: "science-1", science2: "science-2", history: "history", geography: "geography",
  marathi: "marathi", hindi: "hindi", english: "english", sanskrit: "sanskrit", urdu: "urdu", arabic: "arabic", german: "german",
};
const SY_NAME: Record<string, string> = {
  algebra: "Algebra (Maths 1)", geometry: "Geometry (Maths 2)", science1: "Science 1", science2: "Science 2", history: "History",
  geography: "Geography", marathi: "Marathi", hindi: "Hindi", english: "English", sanskrit: "Sanskrit", urdu: "Urdu", arabic: "Arabic", german: "German",
};
export const subjectYearSlug = (key: string, y: number) => `ssc-${SY_SLUG[key]}-question-paper-${y}`;
export const SUBJECT_YEARS: { key: string; name: string; years: number[] }[] = Object.keys(SY_SLUG).map((key) => ({
  key,
  name: SY_NAME[key],
  years: [...new Set(ALL.filter((p) => p.kind === "pyq" && p.subject === key).map((p) => p.year as number))].sort((a, b) => b - a),
}));

const describe = (p: Paper) => (p.medium ? `${p.medium} medium` : p.variant ?? "");
const subjectYearLandings: Landing[] = SUBJECT_YEARS.flatMap(({ key, name, years }) =>
  years.map((y) => {
    const s = SUBJ[key];
    const ps = ALL.filter((p) => p.kind === "pyq" && p.subject === key && p.year === y);
    const main = ps.filter((p) => p.session === "main");
    const supp = ps.filter((p) => p.session === "supplementary");
    const exam = (main[0] ?? supp[0]).exam as string;
    const pat = patternOf(main[0] ?? supp[0]);
    const list = (main.length ? main : supp).map(describe).join(", ");
    const semiNote = SEMI_EN.has(key) ? " Semi-English students use the English medium paper." : SEMI_MR.has(key) ? " Semi-English students use the Marathi medium paper." : "";
    const suppNote = main.length && supp.length ? ` The ${supp[0].exam} supplementary paper is included too.` : "";
    return {
      slug: subjectYearSlug(key, y),
      group: "subjectYear" as const,
      scope: { kind: "pyq" as const, year: y, subject: key },
      title: `SSC ${name} Question Paper ${y} PDF – Maharashtra Board`,
      description: `Official Maharashtra SSC ${name} board question paper, ${exam}: ${list}. ${pat.marks} marks, ${pat.hours} hours. Free PDF, no ads, no login.${semiNote}${suppNote} दहावी ${s.mr} प्रश्नपत्रिका ${y}.`,
      h1: { en: `SSC ${name} Question Paper ${y}`, mr: `दहावी ${s.mr} प्रश्नपत्रिका ${y}` },
      intro: {
        en: `The ${exam} Maharashtra SSC ${name} board paper${main.length + supp.length > 1 ? "s" : ""}: ${list}.${suppNote} Open or download below.`,
        mr: `${exam} च्या महाराष्ट्र एसएससी ${s.mr} बोर्ड प्रश्नपत्रिका: ${list}. खाली उघडा किंवा डाउनलोड करा.`,
      },
    };
  }),
);

export const LANDINGS: Landing[] = [...yearLandings, ...subjectLandings, ...mediumLandings, ...semiLandings, ...otherLandings, ...subjectYearLandings];
export const landingBySlug = (slug: string) => LANDINGS.find((l) => l.slug === slug);
export const papersInScope = (s: Scope) =>
  ALL.filter(
    (p) =>
      (!s.kind || p.kind === s.kind) &&
      (!s.year || p.year === s.year) &&
      (!s.subject || p.subject === s.subject) &&
      (!s.medium || inMedium(p, s.medium)),
  );
