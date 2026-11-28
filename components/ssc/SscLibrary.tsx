"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { Tape } from "@/components/sketch/Paper";
import { ALL, PAPERS_REPO, SEMI, fileHref, inMedium, langBase, paperName, type Paper, type Scope } from "./data";
import { MEDIUMS, SUBJECTS, T, examLabel, variantLabel, type Lang } from "./i18n";
import TalkToMe from "./TalkToMe";
import { track } from "./track";

// Folder types, in listing order: board papers by year, supplementary, prelims, model papers, question banks.
type FKind = "board" | "supp" | "prelim" | "model" | "qbank";
const FKINDS: FKind[] = ["board", "supp", "prelim", "model", "qbank"];
const fkindOf = (p: Paper): FKind => (p.kind === "pyq" ? (p.session === "supplementary" ? "supp" : "board") : p.kind);

const SUBJ = Object.fromEntries(SUBJECTS.map((s) => [s.key, s]));
const SUBJ_ORDER = Object.fromEntries(SUBJECTS.map((s, i) => [s.key, i]));
const MED_ORDER = Object.fromEntries(MEDIUMS.map((m, i) => [m.key, i]));
// "Maths 1 & 2" / "Science 1 & 2" exist only as question-bank bundles, so they are not filter chips;
// they match when Algebra/Geometry or Science 1/2 is picked.
const FILTER_SUBJECTS = SUBJECTS.filter((s) => s.key !== "maths" && s.key !== "science");
const BUNDLE: Record<string, string> = { algebra: "maths", geometry: "maths", science1: "science", science2: "science" };
const COLOR: Record<FKind, string> = { board: "#ffc700", supp: "#ef5533", prelim: "#18a0fb", model: "#ee46d3", qbank: "#1bc47d" };

const bySubject = (a: Paper, b: Paper) =>
  (SUBJ_ORDER[a.subject] ?? 99) - (SUBJ_ORDER[b.subject] ?? 99) || (a.variant ?? "").localeCompare(b.variant ?? "") || a.title.localeCompare(b.title);

type Sub = { id: string; title: string; papers: Paper[] };
type Folder = { id: string; kind: FKind; title: string; subs: Sub[]; count: number };

function byMedium(list: Paper[], idp: string, lang: Lang, semiOnly: boolean): Sub[] {
  const subs: Sub[] = [];
  // Only Semi-English picked: one folder with its English maths/science and Marathi history/geography papers.
  if (semiOnly) {
    const ps = list.filter((p) => p.medium);
    if (ps.length) subs.push({ id: `${idp}-semi-english`, title: MEDIUMS.find((x) => x.key === SEMI)![lang], papers: ps.sort(bySubject) });
    const langs = list.filter((p) => !p.medium);
    if (langs.length) subs.push({ id: `${idp}-languages`, title: T[lang].languageH, papers: langs.sort(bySubject) });
    return subs;
  }
  const meds = [...new Set(list.filter((p) => p.medium).map((p) => p.medium as string))].sort((a, b) => MED_ORDER[a] - MED_ORDER[b]);
  for (const m of meds)
    subs.push({ id: `${idp}-${m.toLowerCase()}`, title: MEDIUMS.find((x) => x.key === m)![lang], papers: list.filter((p) => p.medium === m).sort(bySubject) });
  const langs = list.filter((p) => !p.medium);
  if (langs.length) subs.push({ id: `${idp}-languages`, title: T[lang].languageH, papers: langs.sort(bySubject) });
  return subs;
}

function buildFolders(list: Paper[], lang: Lang, semiOnly = false): Folder[] {
  const t = T[lang];
  const out: Folder[] = [];
  const yearsOf = (k: FKind) => [...new Set(list.filter((p) => fkindOf(p) === k).map((p) => p.year as number))].sort((a, b) => b - a);
  for (const y of yearsOf("board")) {
    const ps = list.filter((p) => fkindOf(p) === "board" && p.year === y);
    out.push({ id: `board-${y}`, kind: "board", title: t.boardFolder(y), subs: byMedium(ps, `board-${y}`, lang, semiOnly), count: ps.length });
  }
  for (const y of yearsOf("supp")) {
    const ps = list.filter((p) => fkindOf(p) === "supp" && p.year === y);
    out.push({ id: `supp-${y}`, kind: "supp", title: t.suppFolder(examLabel(ps[0].exam ?? String(y), lang)), subs: byMedium(ps, `supp-${y}`, lang, semiOnly), count: ps.length });
  }
  const pre = list.filter((p) => p.kind === "prelim");
  if (pre.length) {
    const sessions = [...new Set(pre.map((p) => p.exam as string))].sort((a, b) => b.localeCompare(a));
    out.push({
      id: "prelims",
      kind: "prelim",
      title: t.prelimTitle,
      count: pre.length,
      subs: sessions.map((s) => ({ id: `prelims-${s.replace(/\D+/g, "")}`, title: t.sessionH(s.replace(/^\D+/, "")), papers: pre.filter((p) => p.exam === s).sort(bySubject) })),
    });
  }
  const mo = list.filter((p) => p.kind === "model");
  if (mo.length) out.push({ id: "model-papers", kind: "model", title: t.modelTitle, count: mo.length, subs: [{ id: "model-2027", title: t.modelTitle, papers: mo.sort(bySubject) }] });
  const qb = list.filter((p) => p.kind === "qbank");
  if (qb.length)
    out.push({
      id: "question-banks",
      kind: "qbank",
      title: t.qbTitle,
      count: qb.length,
      subs: [...new Set(qb.map((p) => p.year as number))]
        .sort((a, b) => b - a)
        .map((y) => ({ id: `question-bank-${y}`, title: t.qbYear(y), papers: qb.filter((p) => p.year === y).sort(bySubject) })),
    });
  return out;
}

// The papers list: one short heading per group ("Board Papers 2026 · English medium"), papers right under it.
// No folders to open, so whatever the filters say is what students see straight away.
type Group = { id: string; kind: FKind; title: string; papers: Paper[] };
function buildGroups(list: Paper[], lang: Lang, semiOnly: boolean): Group[] {
  return buildFolders(list, lang, semiOnly).flatMap((f) =>
    f.subs.map((s) => ({
      id: s.id,
      kind: f.kind,
      title: f.kind === "board" || f.kind === "supp" || f.kind === "prelim" ? `${f.title} · ${s.title}` : s.title,
      papers: s.papers,
    })),
  );
}
const PAGE = 40; // papers drawn at first; "Show more" adds the rest
const ZIP_ALL_MB = 165; // size of the whole papers repo, shown on the "Download everything" button

// Old links opened a folder (?f=board-2026/board-2026-english); turn that into the matching filters.
function filtersFromFolder(f: string, v: View) {
  const [a, b] = f.split("/");
  const m = a?.match(/^(board|supp)-(\d{4})$/);
  if (m) {
    v.kinds = [m[1]];
    v.years = [m[2]];
  } else if (a === "prelims") v.kinds = ["prelim"];
  else if (a === "model-papers") v.kinds = ["model"];
  else if (a === "question-banks") v.kinds = ["qbank"];
  const med = b?.match(/-(english|semi-english|marathi|hindi|urdu|kannada)$/);
  if (med) {
    const key = MEDIUMS.find((x) => x.key.toLowerCase() === med[1].replace("-", ""))?.key;
    if (key) v.mediums = [key];
  }
  const qy = b?.match(/^question-bank-(\d{4})$/);
  if (qy) v.years = [qy[1]];
}

// ---- Search ----
// Students type things like "2026 all subject paper", "maths 1 , 2026", "marathi, english" or
// "history question paper 25/26/27". Words can come in any order, filler words are ignored, years can be
// short (25 = 2025), and commas mean "or": "marathi, english" finds both.
const STOP = new Set(
  "all subject subjects sub paper papers question questions que ques board exam exams ssc pdf the and or of for in to with 10th 10 class std standard maharashtra state year yr previous pyq download free sab सर्व विषय सब्जेक्ट प्रश्नपत्रिका प्रश्नपत्रिकांची पेपर बोर्ड परीक्षा दहावी".split(" "),
);
const PHRASES: [RegExp, string][] = [
  [/\bmaths?\s*[-.]?\s*(1|i|one)\b|\bm1\b|गणित\s*(भाग)?\s*(१|1)/g, " algebra "],
  [/\bmaths?\s*[-.]?\s*(2|ii|two)\b|\bm2\b|गणित\s*(भाग)?\s*(२|2)/g, " geometry "],
  [/\bsci(ence)?\s*[-.]?\s*(1|i|one)\b|विज्ञान\s*(भाग)?\s*(१|1)/g, " science1 "],
  [/\bsci(ence)?\s*[-.]?\s*(2|ii|two)\b|विज्ञान\s*(भाग)?\s*(२|2)/g, " science2 "],
  [/\bsemi\s*[- ]?\s*english\b/g, " semienglish "],
];
type Query = { years: Set<number>; groups: string[][] };
function parseQuery(raw: string): Query | null {
  let s = raw.toLowerCase().replace(/[|/\;.]+/g, " ");
  for (const [re, to] of PHRASES) s = s.replace(re, to);
  const years = new Set<number>();
  const groups = s
    .split(",")
    .map((part) =>
      part
        .split(/[\s'"()\-–:]+/)
        .map((w) => w.trim())
        .filter(Boolean)
        .filter((w) => {
          if (/^(19|20)\d{2}$/.test(w)) return !years.add(Number(w)) && false;
          if (/^\d{2}$/.test(w) && Number(w) >= 19 && Number(w) <= 27) return !years.add(2000 + Number(w)) && false;
          if (/^\d+$/.test(w)) return false; // marks like "80" or stray numbers
          return !STOP.has(w) && w.length > 1;
        }),
    )
    .filter((g) => g.length);
  return years.size || groups.length ? { years, groups } : null;
}
function haystack(p: Paper) {
  const s = SUBJ[p.subject];
  const med = p.medium ? MEDIUMS.find((m) => m.key === p.medium) : undefined;
  const extra = p.subject === "history" ? "politics political civics" : p.subject === "algebra" || p.subject === "geometry" ? "maths math ganit" : "";
  return [p.title, p.exam, p.code, p.subject, p.medium, med?.en, med?.mr, p.variant, s?.en, s?.mr, extra, p.kind === "qbank" ? "question bank prashnapedhi" : "", p.kind === "prelim" ? "prelim practice sarav" : "", p.kind === "model" ? "model sample namuna" : ""]
    .join(" ")
    .toLowerCase();
}
function matchesQuery(p: Paper, q: Query) {
  if (q.years.size && !q.years.has(p.year ?? 0)) return false;
  if (!q.groups.length) return true;
  const h = haystack(p);
  // Semi-English is not a printed medium: match it the same way the medium filter does.
  return q.groups.some((g) => g.every((w) => (w === "semienglish" ? inMedium(p, SEMI) : h.includes(w))));
}

// Heading for the current filters, e.g. "SSC Maths 1 · Algebra Board Papers 2025 · Marathi medium".
const KIND_TITLE: Record<Lang, Record<string, string>> = {
  en: { board: "Board Papers", supp: "Supplementary Papers", prelim: "Prelim Papers", model: "Model Papers", qbank: "Question Bank" },
  mr: { board: "बोर्ड प्रश्नपत्रिका", supp: "पुरवणी परीक्षा प्रश्नपत्रिका", prelim: "सराव प्रश्नपत्रिका", model: "नमुना प्रश्नपत्रिका", qbank: "प्रश्नपेढी" },
};
function viewTitle(v: { kinds: string[]; mediums: string[]; subjects: string[]; years: string[]; q: string }, lang: Lang) {
  const mr = lang === "mr";
  const list = (xs: string[]) => (xs.length > 3 ? `${xs.slice(0, 3).join(", ")} +${xs.length - 3}` : xs.join(mr ? " व " : " & "));
  const subj = list(v.subjects.map((s) => SUBJ[s]?.[lang] ?? s));
  const pyqOnly = v.kinds.length && v.kinds.every((k) => k === "board" || k === "supp");
  const kind = !v.kinds.length
    ? mr ? "प्रश्नपत्रिका" : "Question Papers"
    : pyqOnly && v.kinds.length === 2
      ? KIND_TITLE[lang].board
      : list(v.kinds.map((k) => KIND_TITLE[lang][k] ?? k));
  const ys = [...v.years].map(Number).sort((a, b) => b - a);
  const yrs = ys.length > 3 ? `${ys[ys.length - 1]}–${ys[0]}` : ys.join(", ");
  const med = list(v.mediums.map((m) => MEDIUMS.find((x) => x.key === m)?.[lang] ?? m));
  const base = `${mr ? "दहावी" : "SSC"} ${subj ? `${subj} ` : ""}${kind}${yrs ? ` ${yrs}` : ""}`;
  return [base, med, v.q.trim() ? `“${v.q.trim()}”` : ""].filter(Boolean).join(" · ");
}

const toggle = (set: string[], v: string) => (set.includes(v) ? set.filter((x) => x !== v) : [...set, v]);
// Students expect a chip to pick that one thing, so by default a tap selects only it (tap it again for "All").
// With "Pick several" switched on, taps add and remove instead (handy for a combined ZIP).
const pick = (set: string[], v: string, several: boolean) => (several ? toggle(set, v) : set.length === 1 && set[0] === v ? [] : [v]);

// ---- URL <-> view ----
// ?type=board,supp &medium=marathi &subject=algebra,geometry &year=2025,2024 &q=…
// Only values that differ from the page's starting view are written; an empty value (year=) means "all".
type View = { kinds: string[]; mediums: string[]; subjects: string[]; years: string[]; q: string };

function defaultView(scope: Scope): View {
  return {
    kinds: scope.kind ? (scope.kind === "pyq" ? ["board", "supp"] : [scope.kind]) : [],
    mediums: scope.medium ? [scope.medium] : [],
    subjects: scope.subject ? [scope.subject] : [],
    years: scope.year ? [String(scope.year)] : [],
    q: "",
  };
}

const URL_KEYS = { kinds: "type", mediums: "medium", subjects: "subject", years: "year" } as const;
const ALLOWED: Record<keyof typeof URL_KEYS, string[]> = {
  kinds: FKINDS,
  mediums: MEDIUMS.map((m) => m.key),
  subjects: FILTER_SUBJECTS.map((s) => s.key),
  years: [...new Set(ALL.map((p) => String(p.year)))],
};
const same = (a: string[], b: string[]) => a.length === b.length && [...a].sort().join() === [...b].sort().join();

function viewToQuery(v: View, d: View) {
  const sp = new URLSearchParams();
  for (const k of Object.keys(URL_KEYS) as (keyof typeof URL_KEYS)[])
    if (!same(v[k], d[k])) sp.set(URL_KEYS[k], v[k].map((x) => (k === "mediums" ? x.toLowerCase() : x)).join(","));
  if (v.q.trim()) sp.set("q", v.q);
  return sp.toString().replace(/%2C/g, ",").replace(/%2F/g, "/");
}

function viewFromUrl(search: string, hash: string, d: View): View {
  const sp = new URLSearchParams(search);
  const v: View = { ...d, kinds: [...d.kinds], mediums: [...d.mediums], subjects: [...d.subjects], years: [...d.years] };
  // Older shared links: ?f=board-2026/board-2026-english (or #f=…) opened a folder; the filters say the same now.
  const legacy = decodeURIComponent(hash.replace(/^#/, ""));
  const f = sp.get("f") ?? (legacy.startsWith("f=") ? legacy.slice(2) : null);
  if (f) filtersFromFolder(f, v);
  for (const k of Object.keys(URL_KEYS) as (keyof typeof URL_KEYS)[]) {
    const raw = sp.get(URL_KEYS[k]);
    if (raw === null) continue;
    const ok = ALLOWED[k];
    v[k] = raw
      .split(",")
      .map((x) => x.trim())
      .map((x) => ok.find((a) => a.toLowerCase() === x.toLowerCase()))
      .filter((x): x is string => Boolean(x));
  }
  v.q = sp.get("q") ?? "";
  return v;
}

export default function SscLibrary({
  email,
  scope = {},
  heading,
  lead,
  lang,
  altHref,
}: {
  email: string;
  scope?: Scope;
  lead?: React.ReactNode;
  /** Page language; English and Marathi are separate URLs (/ssc-board-papers/… and /ssc-board-papers/mr/…). */
  lang: Lang;
  /** The same page in the other language. */
  altHref: string;
  heading?: { kicker?: { en: string; mr: string }; h1: { en: string; mr: string }; intro: { en: string; mr: string } };
}) {
  // What this page starts with (landing pages are pre-filtered). The URL only stores differences from it.
  const scopeKey = JSON.stringify(scope);
  const defaults = useMemo(() => defaultView(JSON.parse(scopeKey) as Scope), [scopeKey]);
  const [kinds, setKinds] = useState<string[]>(defaults.kinds);
  const [mediums, setMediums] = useState<string[]>(defaults.mediums);
  const [subjects, setSubjects] = useState<string[]>(defaults.subjects);
  const [years, setYears] = useState<string[]>(defaults.years);
  const [q, setQ] = useState("");
  const [several, setSeveral] = useState(false);
  const [limit, setLimit] = useState(PAGE);
  const [hydrated, setHydrated] = useState(false);
  const [shared, setShared] = useState(false);
  const [zip, setZip] = useState<{ d: number; n: number } | null>(null);
  // Downloads give no sign on Android, so students tapped again and again: show a note and mark the paper ✓.
  const [got, setGot] = useState<Set<string>>(() => new Set());
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // "Show papers ↓": students pick all their filters first (the screen does not move while they tap), then this
  // button takes them down to the papers. It shows only after a filter changed while the papers are below the screen.
  const [pending, setPending] = useState(false);
  const [listBelow, setListBelow] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const t = T[lang];
  const mr = lang === "mr";
  const scoped = Boolean(heading);

  useEffect(() => {
    document.documentElement.lang = mr ? "mr" : "en";
  }, [mr]);

  // Filters and search live in the URL (?type=…&medium=…), so any view can be copied and shared.
  useEffect(() => {
    const read = () => {
      const v = viewFromUrl(location.search, location.hash, defaults);
      setKinds(v.kinds);
      setMediums(v.mediums);
      setSubjects(v.subjects);
      setYears(v.years);
      setQ(v.q);
      // A shared link with several values in a row keeps "Pick several" on.
      const multi = (["kinds", "mediums", "subjects", "years"] as const).some((k) => v[k].length > 1 && !same(v[k], defaults[k]));
      if (multi) setSeveral(true);
      setHydrated(true);
    };
    read();
    // Most visits come from shared links that already carry filters (?medium=…&year=…): take them straight to the papers.
    const fromOurLinks = Boolean(heading) && /\/ssc-board-papers/.test(document.referrer) && document.referrer.includes(location.host);
    if (/[?&](type|medium|subject|year|q|f)=/.test(location.search) || location.hash.startsWith("#f=") || fromOurLinks) {
      setTimeout(() => {
        const el = document.getElementById("papers");
        if (!el || el.getBoundingClientRect().top < innerHeight * 0.6) return;
        window.dispatchEvent(new CustomEvent("ssc-show-papers"));
      }, 350);
    }
    try {
      setGot(new Set(JSON.parse(localStorage.getItem("ssc-got") ?? "[]") as string[]));
    } catch {}
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [defaults]);
  useEffect(() => {
    if (!hydrated) return;
    const qs = viewToQuery({ kinds, mediums, subjects, years, q }, defaults);
    const next = location.pathname + (qs ? `?${qs}` : "");
    if (next !== location.pathname + location.search || location.hash) history.replaceState(null, "", next);
  }, [hydrated, kinds, mediums, subjects, years, q, defaults]);

  const onDownload = useCallback(
    (p: Paper) => {
      setGot((prev) => {
        const next = new Set(prev).add(p.path);
        try {
          localStorage.setItem("ssc-got", JSON.stringify([...next].slice(-300)));
        } catch {}
        return next;
      });
      const s = SUBJ[p.subject];
      setToast(t.downloading(`${s?.[lang] ?? p.subject}${p.year ? ` ${p.year}` : ""}`));
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 4500);
    },
    [t, lang],
  );
  // Share this exact view: the phone's share sheet when there is one, otherwise copy the link.
  async function share() {
    const url = location.href;
    track("share_view");
    try {
      if (navigator.share && matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: document.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2200);
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") window.prompt(t.copyLink, url);
    }
  }

  const shown = useMemo(() => {
    const query = parseQuery(q);
    return ALL.filter((p) => {
      if (kinds.length && !kinds.includes(fkindOf(p))) return false;
      if (mediums.length && !mediums.some((m) => inMedium(p, m))) return false;
      if (subjects.length && !subjects.includes(p.subject) && !subjects.some((s) => BUNDLE[s] === p.subject)) return false;
      if (years.length && !years.includes(String(p.year))) return false;
      if (!query) return true;
      const s = SUBJ[p.subject];
      return matchesQuery(p, query);
    });
  }, [kinds, mediums, subjects, years, q]);

  const semiOnly = mediums.length === 1 && mediums[0] === SEMI;

  // Behaviour signals for Clarity: what students filter by, what they search, and when they hit a dead end.
  const filterKey = [kinds, mediums, subjects, years].map((x) => x.join(",")).join("|");
  const [lastFilters, setLastFilters] = useState<string | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (lastFilters !== null && lastFilters !== filterKey) {
      // One event per filter row that changed (filter_medium, filter_subject…), handy as funnel steps.
      const before = lastFilters.split("|"), after = filterKey.split("|");
      ["filter_type", "filter_medium", "filter_subject", "filter_year"].forEach((ev, i) => before[i] !== after[i] && track(ev));
      track("filters_changed", { f_type: kinds.join(","), f_medium: mediums.join(","), f_subject: subjects.join(","), f_year: years.join(",") });
      if (mediums.includes(SEMI)) track("used_semi_english");
      setPending(true);
    }
    setLastFilters(filterKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, filterKey]);
  useEffect(() => {
    if (!hydrated || !q.trim()) return;
    const id = setTimeout(() => track("search", { search_text: q.trim().slice(0, 60) }), 1500);
    return () => clearTimeout(id);
  }, [q, hydrated]);
  const noResults = hydrated && shown.length === 0;
  useEffect(() => {
    if (noResults) track("no_results", { search_text: q.trim().slice(0, 60) || undefined, f_medium: mediums.join(","), f_subject: subjects.join(","), f_year: years.join(",") });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noResults]);
  const groups = useMemo(() => buildGroups(shown, lang, semiOnly), [shown, lang, semiOnly]);
  const inView = useMemo(() => groups.flatMap((g) => g.papers), [groups]);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setListBelow(!e.isIntersecting && e.boundingClientRect.top > 0);
        if (e.isIntersecting) setPending(false); // the papers are on screen already
      },
      { rootMargin: "0px 0px -30% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const on = () => showPapersRef.current?.(true);
    window.addEventListener("ssc-show-papers", on);
    return () => window.removeEventListener("ssc-show-papers", on);
  }, []);
  const showPapersRef = useRef<((auto?: boolean) => void) | null>(null);
  const showPapers = (auto?: boolean) => {
    setPending(false);
    track(auto ? "auto_scroll_to_papers" : "show_papers", { count: shown.length });
    const el = listRef.current;
    if (!el) return;
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(el, { offset: -76, duration: 0.8 });
    } else el.scrollIntoView({ behavior: "smooth" });
  };
  showPapersRef.current = showPapers;
  // New filters start from the top of the list again.
  useEffect(() => setLimit(PAGE), [filterKey, q]);

  // 2027 has only model papers (they have their own type), so it is not a year chip: students tapped it first expecting the latest board paper.
  const yearOptions = useMemo(() => [...new Set(ALL.filter((p) => p.kind !== "model").map((p) => p.year).filter(Boolean) as number[])].sort((a, b) => b - a), []);
  const filtered = kinds.length + mediums.length + subjects.length + years.length + (q ? 1 : 0) > 0;
  // Does the view still match what this page is about? If not, the heading follows the filters instead.
  const atDefaults =
    same(kinds, defaults.kinds) && same(mediums, defaults.mediums) && same(subjects, defaults.subjects) && same(years, defaults.years) && !q.trim();
  const custom = !atDefaults && (filtered || scoped);
  const customTitle = custom ? viewTitle({ kinds, mediums, subjects, years, q }, lang) : "";
  const baseTitle = useRef<string | null>(null);
  useEffect(() => {
    if (baseTitle.current === null) baseTitle.current = document.title; // the page's own title, from its metadata
    const next = custom ? `${customTitle} – ${mr ? "दहावी बोर्ड प्रश्नपत्रिका" : "SSC Board Papers"}` : baseTitle.current;
    document.title = next;
    // Next.js re-applies the metadata <title> right after load; set ours again once that has happened.
    const id = setTimeout(() => (document.title = next), 400);
    return () => clearTimeout(id);
  }, [custom, customTitle, mr]);
  const reset = () => {
    setKinds([]);
    setMediums([]);
    setSubjects([]);
    setYears([]);
    setQ("");
  };

  // ZIP of whatever is in view (open folder, or everything matching the filters), keeping the folder layout.
  async function downloadZip(list: Paper[]) {
    if (!list.length || zip) return;
    track("zip_download", { zip_count: list.length });
    if (list.length > 40 && !confirm(t.zipBig(list.length))) {
      track("zip_cancelled", { zip_count: list.length });
      return;
    }
    const { default: JSZip } = await import("jszip");
    const z = new JSZip();
    let done = 0;
    setZip({ d: 0, n: list.length });
    const queue = [...list];
    const worker = async () => {
      for (let p = queue.shift(); p; p = queue.shift()) {
        try {
          const r = await fetch(fileHref(p));
          if (r.ok) z.file(p.path, await r.arrayBuffer());
        } catch {}
        setZip({ d: ++done, n: list.length });
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
    const blob = await z.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `SSC-papers-${list.length}.zip`;
    track("zip_finished", { zip_count: list.length });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 30000);
    setZip(null);
  }

  const counts = {
    board: ALL.filter((p) => p.kind === "pyq").length,
    years: new Set(ALL.filter((p) => p.kind === "pyq").map((p) => p.year)).size,
    practice: ALL.filter((p) => p.kind !== "pyq").length,
  };

  return (
    // data-clarity-unmask: Clarity hides digits by default, which turned "Science 1" and "2026" into "Science ▫" and
    // "▫▫▫▫" in recordings. Nothing here is private except the contact form, which stays masked (data-clarity-mask).
    <div className={mr ? "ssc-mr" : ""} data-clarity-unmask="true">
      <header className="sticky top-3 z-40 mx-auto flex max-w-6xl items-center justify-between gap-2 px-4">
        <a
          href={scoped ? langBase(lang) : "/"}
          className="rounded-full border border-ink/10 bg-white/85 px-4 py-1.5 font-marker text-[26px] leading-none text-ink shadow-paper backdrop-blur"
        >
          {scoped ? (mr ? "← सर्व प्रश्नपत्रिका" : "← all papers") : "← omkar."}
        </a>
        {/* A real link to the other-language page (Google follows it); filters and open folder carry over. */}
        <a
          href={altHref}
          hrefLang={mr ? "en-IN" : "mr-IN"}
          onClick={(e) => {
            e.preventDefault();
            track("language_switch", { lang: mr ? "en" : "mr" });
            location.href = altHref + location.search + location.hash;
          }}
          className="flex items-center gap-1 rounded-full border border-ink/10 bg-white/85 p-1 text-[14px] shadow-paper backdrop-blur"
          aria-label={mr ? "Switch to English" : "मराठीत पहा"}
        >
          <span className={`rounded-full px-3 py-1 ${!mr ? "bg-ink text-white" : "text-ink-soft"}`}>EN</span>
          <span className={`ssc-deva rounded-full px-3 py-1 ${mr ? "bg-ink text-white" : "text-ink-soft"}`}>मराठी</span>
        </a>
      </header>

      {/* On phones (94% of visitors) the top is kept short so the papers show up on the first screen. */}
      <section className="relative mx-auto max-w-6xl px-4 pb-4 pt-5 md:pb-6 md:pt-16" id="top">
        <p className="label hidden md:block">{heading?.kicker?.[lang] ?? t.kicker}</p>
        <h1 className="ssc-title max-w-4xl text-[30px] font-semibold leading-[1.08] tracking-tight text-ink md:mt-3 md:text-[76px] md:leading-[1.02]">
          {custom ? (
            <span className="hl">{customTitle}</span>
          ) : heading ? (
            <span className="hl">{heading.h1[lang]}</span>
          ) : (
            <>
              {t.title} <span className="hl">{t.titleHl}</span>
            </>
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-snug md:mt-5 md:text-[19px] md:leading-relaxed" aria-live="polite">
          {custom ? (
            t.showing(shown.length)
          ) : (
            <>
              <span className="md:hidden">{heading ? "" : t.introShort}</span>
              <span className="hidden md:inline">{heading ? heading.intro[lang] : t.intro}</span>
            </>
          )}
        </p>
        {!custom && lead}
        <p className="mt-2 text-[13px] font-medium text-ink md:hidden">{t.trustShort}</p>
        <ul className="mt-4 hidden flex-wrap gap-x-4 gap-y-1 text-[14px] font-medium text-ink md:flex" aria-label="Why this site">
          {t.trust.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        {!heading && (
          <div className="mt-6 hidden flex-wrap gap-3 md:flex">
            {t.stats(counts.board, counts.years, counts.practice).map((s, i) => (
              <span
                key={s}
                className="rounded-xl border-2 border-ink px-3.5 py-1.5 font-note text-[16px] text-ink shadow-[3px_3px_0_#1d1d1f]"
                style={{ transform: `rotate(${[-2, 1.5, -1][i]}deg)`, background: ["#fff4c2", "#dff1ff", "#e2f8ec"][i] }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div id="library" className="relative scroll-mt-20 rounded-3xl border-2 border-ink bg-white p-3 shadow-[5px_5px_0_#1d1d1f] md:p-7">
          {/* Filters. On phones each row scrolls sideways so all four rows fit on one screen. */}
          <div className="grid grid-cols-[minmax(0,1fr)] gap-3 md:gap-4">
            <Filter label={t.type}>
              <Chip on={!kinds.length} onClick={() => setKinds([])}>
                {t.all}
              </Chip>
              {FKINDS.map((k) => (
                <Chip key={k} on={kinds.includes(k)} onClick={() => setKinds(pick(kinds, k, several))} dot={COLOR[k]}>
                  {t.kinds[k]}
                </Chip>
              ))}
            </Filter>
            <Filter label={t.medium}>
              <Chip on={!mediums.length} onClick={() => setMediums([])}>
                {t.all}
              </Chip>
              {MEDIUMS.map((m) => (
                <Chip key={m.key} on={mediums.includes(m.key)} onClick={() => setMediums(pick(mediums, m.key, several))}>
                  {m[lang]}
                </Chip>
              ))}
            </Filter>
            <Filter label={t.subject}>
              <Chip on={!subjects.length} onClick={() => setSubjects([])}>
                {t.allSubjects}
              </Chip>
              {FILTER_SUBJECTS.map((s) => (
                <Chip key={s.key} on={subjects.includes(s.key)} onClick={() => setSubjects(pick(subjects, s.key, several))} dot={s.color}>
                  {s[lang]}
                </Chip>
              ))}
            </Filter>
            <Filter label={t.year}>
              <Chip on={!years.length} onClick={() => setYears([])}>
                {t.allYears}
              </Chip>
              {yearOptions.map((y) => (
                <Chip key={y} on={years.includes(String(y))} onClick={() => setYears(pick(years, String(y), several))}>
                  {y}
                </Chip>
              ))}
            </Filter>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-soft md:pl-[146px]">
              <label className="inline-flex cursor-pointer items-center gap-2 py-1 font-medium text-ink">
                <input
                  type="checkbox"
                  checked={several}
                  onChange={(e) => {
                    setSeveral(e.target.checked);
                    track("pick_several", { on: e.target.checked ? "yes" : "no" });
                  }}
                  className="h-4 w-4 accent-[#1d1d1f]"
                />
                {t.pickSeveral}
              </label>
              <Jump to="how" className="font-medium text-blue underline-offset-4 hover:underline">
                ❓ {t.tipTitle}
              </Jump>
              {mediums.length > 0 && <span className="w-full text-ink-faint">{t.languageNote}</span>}
            </div>
            <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:gap-3">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.search}
                aria-label={t.search}
                className="w-full rounded-full border-2 border-ink/15 bg-mist px-5 py-2 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-blue md:max-w-sm md:py-2.5"
              />
              <div className="flex flex-wrap items-center gap-2 md:ml-auto">
                <span className="mr-auto font-mono text-[13px] font-semibold text-ink md:mr-2" aria-live="polite">
                  {t.match(shown.length)}
                </span>
                {filtered && (
                  <button type="button" onClick={reset} className="btn-ghost !px-3.5 !py-1.5 !text-[13px] md:!px-4 md:!py-2 md:!text-[14px]">
                    {t.reset}
                  </button>
                )}
                <button type="button" onClick={share} className="btn-ghost !px-3.5 !py-1.5 !text-[13px] md:!px-4 md:!py-2 md:!text-[14px]" aria-live="polite">
                  {shared ? t.copied : (
                    <>
                      <span className="md:hidden">{t.shareShort}</span>
                      <span className="hidden md:inline">{t.copyLink}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => downloadZip(inView)}
                  disabled={!inView.length || !!zip}
                  className="btn-blue !px-3.5 !py-1.5 !text-[13px] disabled:opacity-60 md:!px-4 md:!py-2 md:!text-[14px]"
                >
                  ⬇ {zip ? t.zipping(zip.d, zip.n) : (
                    <>
                      <span className="md:hidden">{t.zipShortN(inView.length)}</span>
                      <span className="hidden md:inline">{t.zipSel(inView.length)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* The papers themselves, straight under the filters: no folders to open or back out of. */}
          <div ref={listRef} id="papers" className="mt-5 scroll-mt-20 border-t-2 border-dashed border-ink/15 pt-4 md:mt-7 md:pt-6">
            {!groups.length ? (
              <div className="grid place-items-center gap-3 py-12 text-center">
                <p className="font-note text-[19px] text-ink">{t.empty}</p>
                <button type="button" onClick={reset} className="btn-ghost">
                  {t.reset}
                </button>
              </div>
            ) : (
              <>
                {(() => {
                  let left = limit;
                  return groups.map((g) => {
                    if (left <= 0) return null;
                    const ps = g.papers.slice(0, left);
                    left -= ps.length;
                    const mixed = new Set(g.papers.map((p) => p.medium ?? "")).size > 1;
                    return (
                      <div key={g.id} className="mb-6 last:mb-0">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <h2 className="flex items-center gap-2 text-[15px] font-semibold leading-tight text-ink md:text-[17px]">
                            <span aria-hidden className="h-3 w-3 shrink-0 rounded-sm border-2 border-ink" style={{ background: COLOR[g.kind] }} />
                            {g.title}
                            <span className="font-mono text-[12px] font-normal text-ink-faint">{g.papers.length}</span>
                          </h2>
                          {g.papers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => downloadZip(g.papers)}
                              disabled={!!zip}
                              className="shrink-0 rounded-full border-2 border-ink/15 px-2.5 py-0.5 text-[12px] font-semibold text-blue hover:border-blue disabled:opacity-50"
                              aria-label={`${t.zipSel(g.papers.length)}: ${g.title}`}
                            >
                              ⬇ {t.zipShort}
                            </button>
                          )}
                        </div>
                        <ul className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                          {ps.map((p, i) => (
                            <Row key={p.path} p={p} lang={lang} n={i + 1} showMedium={mixed} saved={got.has(p.path)} onDownload={onDownload} />
                          ))}
                        </ul>
                      </div>
                    );
                  });
                })()}
                {inView.length > limit && (
                  <button
                    type="button"
                    onClick={() => {
                      setLimit((l) => l + PAGE * 2);
                      track("show_more", { shown: limit });
                    }}
                    className="btn-ghost mt-5 w-full justify-center"
                  >
                    {t.showMore(inView.length - limit)}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {pending && listBelow && shown.length > 0 && !toast && (
          <button
            type="button"
            onClick={() => showPapers()}
            className="fixed inset-x-3 bottom-4 z-50 mx-auto block max-w-sm rounded-full border-2 border-ink bg-[#ffc700] px-5 py-3 text-center text-[16px] font-semibold text-ink shadow-[4px_4px_0_#1d1d1f]"
          >
            {t.showPapers(shown.length)}
          </button>
        )}
        {toast && (
          <div
            role="status"
            className="fixed inset-x-3 bottom-4 z-50 mx-auto max-w-md rounded-2xl border-2 border-ink bg-ink px-4 py-3 text-[14px] leading-snug text-white shadow-[4px_4px_0_#ffc700]"
          >
            ⬇ {toast}
          </div>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-[1.3fr_1fr]">
          <div
            id="how"
            className="relative scroll-mt-24 rounded-sm px-6 pb-7 pt-8 font-note text-[17px] leading-snug text-ink"
            style={{ background: "#ffe27a", transform: "rotate(-1deg)", boxShadow: "0 14px 22px -14px rgba(29,29,31,0.45)" }}
          >
            <Tape className="-top-3 left-8" color="#18a0fb" />
            <p className="mb-3 font-marker text-[32px] leading-none">{t.tipTitle}</p>
            <ol className="grid list-decimal gap-2 pl-5">
              {t.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col justify-center gap-3">
            <a href={`${PAPERS_REPO}/archive/refs/heads/main.zip`} className="btn-blue justify-center">
              ⬇ {t.zipAll(ZIP_ALL_MB)}
            </a>
            <Jump to="talk" className="text-center text-[14px] text-blue underline-offset-4 hover:underline">
              {t.wrong}
            </Jump>
          </div>
        </div>

        <TalkToMe lang={lang} email={email} />
        <p className="mt-10 max-w-3xl text-[13px] leading-relaxed text-ink-faint">{t.credits}</p>
      </section>
    </div>
  );
}

// In-page link that scrolls through Lenis (its cached page height goes stale on this long page).
function Jump({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) {
  const lenis = useLenis();
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        const el = document.getElementById(to);
        if (!el) return;
        e.preventDefault();
        e.stopPropagation();
        if (lenis) {
          lenis.resize();
          lenis.scrollTo(el, { duration: 0.9 });
        } else el.scrollIntoView({ behavior: "smooth" });
      }}
    >
      {children}
    </a>
  );
}

// One filter row. Phones: the label sits above a single line of chips that scrolls sideways, so the four rows
// take a quarter of the screen instead of a full screen. Wider screens: chips wrap next to the label.
function Filter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1 md:grid-cols-[130px_minmax(0,1fr)] md:items-start md:gap-2">
      <span className="label md:pt-2">{label}</span>
      <div className="relative -mx-3 md:mx-0">
        <div className="ssc-chips flex gap-2 overflow-x-auto px-3 pb-1 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">{children}</div>
        {/* fade on the right edge hints that the row scrolls */}
        <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white md:hidden" />
      </div>
    </div>
  );
}

function Chip({ on, onClick, children, dot }: { on: boolean; onClick: () => void; children: React.ReactNode; dot?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border-2 px-3 py-1.5 text-[13px] font-medium transition-all md:px-3.5 md:text-[14px] ${
        on ? "border-ink bg-ink text-white shadow-[2px_2px_0_#ffc700]" : "border-ink/15 bg-white text-ink hover:border-ink/50"
      }`}
    >
      {dot && <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: dot }} />}
      {children}
    </button>
  );
}

// One paper. The whole row opens it; the Download button saves it and says so.
function Row({
  p,
  lang,
  n,
  showMedium,
  saved,
  onDownload,
}: {
  p: Paper;
  lang: Lang;
  n: number;
  showMedium: boolean;
  saved: boolean;
  onDownload: (p: Paper) => void;
}) {
  const t = T[lang];
  const s = SUBJ[p.subject];
  const href = fileHref(p);
  const when =
    p.kind === "pyq" ? examLabel(p.exam ?? String(p.year), lang) : p.kind === "prelim" ? p.title.split(" - ")[0] : p.exam ? examLabel(p.exam, lang) : "";
  const meta = [
    showMedium && p.medium ? MEDIUMS.find((m) => m.key === p.medium)?.[lang] : "",
    p.variant ? variantLabel(p.variant, lang) : "",
    when,
  ].filter(Boolean);
  return (
    <li className="relative flex items-center gap-2 rounded-xl border-2 border-ink/10 bg-white py-2 pl-2 pr-1.5 transition-colors hover:border-ink md:gap-2.5 md:pl-2.5 md:pr-2">
      <span
        aria-hidden
        className="grid h-6 min-w-6 shrink-0 place-items-center rounded-md border-2 border-ink px-1 font-mono text-[12px] font-semibold"
        style={{ background: s?.color ?? "#ffc700", color: "#fff", textShadow: "0 1px 0 rgba(0,0,0,.35)" }}
      >
        {n}
      </span>
      <a href={href} target="_blank" rel="noopener" className="min-w-0 flex-1 after:absolute after:inset-0 after:rounded-xl" title={paperName(p)}>
        <span className="block text-[14px] font-semibold leading-tight text-ink md:text-[15px]">{s?.[lang] ?? p.subject}</span>
        {meta.length > 0 && (
          <span className={`mt-0.5 block text-[12px] leading-tight ${p.session === "supplementary" ? "text-orange" : "text-ink-soft"}`}>{meta.join(" · ")}</span>
        )}
      </a>
      <span aria-hidden className="shrink-0 rounded-lg bg-mist px-2 py-2 text-[12px] font-semibold text-blue md:text-[13px]">
        {t.view}
      </span>
      <a
        href={href}
        download
        onClick={() => onDownload(p)}
        className={`relative z-10 shrink-0 whitespace-nowrap rounded-lg px-2 py-2 text-[12px] font-semibold md:px-2.5 md:text-[13px] hover:bg-blue hover:text-white ${saved ? "bg-green text-ink" : "bg-ink text-white"}`}
        aria-label={`${t.download}: ${paperName(p)}`}
      >
        {saved ? `✓ ${t.saved}` : `⬇ ${t.download}`}
      </a>
    </li>
  );
}
