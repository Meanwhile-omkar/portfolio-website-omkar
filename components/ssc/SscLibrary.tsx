"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

const toggle = (set: string[], v: string) => (set.includes(v) ? set.filter((x) => x !== v) : [...set, v]);

// ---- URL <-> view ----
// ?type=board,supp &medium=marathi &subject=algebra,geometry &year=2025,2024 &q=… &f=board-2025/board-2025-marathi
// Only values that differ from the page's starting view are written; an empty value (year=) means "all".
type View = { kinds: string[]; mediums: string[]; subjects: string[]; years: string[]; q: string; path: string[] };

function defaultView(scope: Scope): View {
  const y = scope.year;
  const hasMain = y ? ALL.some((p) => p.kind === "pyq" && p.year === y && p.session === "main") : false;
  return {
    kinds: scope.kind ? (scope.kind === "pyq" ? ["board", "supp"] : [scope.kind]) : [],
    mediums: scope.medium ? [scope.medium] : [],
    subjects: scope.subject ? [scope.subject] : [],
    years: y ? [String(y)] : [],
    q: "",
    path: y ? [hasMain ? `board-${y}` : `supp-${y}`] : [],
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
  if (v.path.join("/") !== d.path.join("/")) sp.set("f", v.path.join("/"));
  return sp.toString().replace(/%2C/g, ",").replace(/%2F/g, "/");
}

function viewFromUrl(search: string, hash: string, d: View): View {
  const sp = new URLSearchParams(search);
  const v: View = { ...d, kinds: [...d.kinds], mediums: [...d.mediums], subjects: [...d.subjects], years: [...d.years], path: [...d.path] };
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
  const legacy = decodeURIComponent(hash.replace(/^#/, "")); // older links used #f=…
  const f = sp.get("f") ?? (legacy.startsWith("f=") ? legacy.slice(2) : null);
  if (f !== null) v.path = f.split("/").filter(Boolean).slice(0, 2);
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
  // Open folder: [] = folder grid, [folder] = its sub-folders, [folder, sub] = the papers.
  const [path, setPath] = useState<string[]>(defaults.path);
  const [hydrated, setHydrated] = useState(false);
  const [shared, setShared] = useState(false);
  const [zip, setZip] = useState<{ d: number; n: number } | null>(null);
  const lenis = useLenis();
  const t = T[lang];
  const mr = lang === "mr";
  const scoped = Boolean(heading);

  useEffect(() => {
    document.documentElement.lang = mr ? "mr" : "en";
  }, [mr]);

  // Filters, search and the open folder all live in the URL (?type=…&medium=…&f=…), so any view can be
  // copied and shared, and the phone's back button closes a folder.
  useEffect(() => {
    const read = () => {
      const v = viewFromUrl(location.search, location.hash, defaults);
      setKinds(v.kinds);
      setMediums(v.mediums);
      setSubjects(v.subjects);
      setYears(v.years);
      setQ(v.q);
      setPath(v.path);
      setHydrated(true);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [defaults]);
  const urlFor = useCallback(
    (p: string[]) => {
      const qs = viewToQuery({ kinds, mediums, subjects, years, q, path: p }, defaults);
      return location.pathname + (qs ? `?${qs}` : "");
    },
    [kinds, mediums, subjects, years, q, defaults],
  );
  useEffect(() => {
    if (!hydrated) return;
    const next = urlFor(path);
    if (next !== location.pathname + location.search || location.hash) history.replaceState(null, "", next);
  }, [hydrated, urlFor, path]);
  const go = useCallback(
    (next: string[]) => {
      setPath(next);
      track(next.length ? "open_folder" : "back_to_all_folders", { folder: next.join("/") || undefined });
      history.pushState(null, "", urlFor(next));
      const el = document.getElementById("library");
      if (el) {
        if (lenis) lenis.scrollTo(el, { duration: 0.6 });
        else el.scrollIntoView({ behavior: "smooth" });
      }
    },
    [lenis, urlFor],
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
    const needle = q.trim().toLowerCase();
    return ALL.filter((p) => {
      if (kinds.length && !kinds.includes(fkindOf(p))) return false;
      if (mediums.length && !mediums.some((m) => inMedium(p, m))) return false;
      if (subjects.length && !subjects.includes(p.subject) && !subjects.some((s) => BUNDLE[s] === p.subject)) return false;
      if (years.length && !years.includes(String(p.year))) return false;
      if (!needle) return true;
      const s = SUBJ[p.subject];
      return [p.title, p.exam, p.code, p.medium, p.variant, s?.en, s?.mr, String(p.year)].join(" ").toLowerCase().includes(needle);
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
  const folders = useMemo(() => buildFolders(shown, lang, semiOnly), [shown, lang, semiOnly]);
  const folder = folders.find((f) => f.id === path[0]);
  const sub = folder && (folder.subs.length === 1 ? folder.subs[0] : folder.subs.find((s) => s.id === path[1]));
  const inView = sub ? sub.papers : folder ? folder.subs.flatMap((s) => s.papers) : shown;

  const yearOptions = useMemo(() => [...new Set(ALL.map((p) => p.year).filter(Boolean) as number[])].sort((a, b) => b - a), []);
  const filtered = kinds.length + mediums.length + subjects.length + years.length + (q ? 1 : 0) > 0;
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
    <div className={mr ? "ssc-mr" : ""}>
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

      <section className="relative mx-auto max-w-6xl px-4 pb-6 pt-10 md:pt-16" id="top">
        <p className="label">{heading?.kicker?.[lang] ?? t.kicker}</p>
        <h1 className="ssc-title mt-3 max-w-4xl text-[44px] font-semibold leading-[1.02] tracking-tight text-ink md:text-[76px]">
          {heading ? (
            <span className="hl">{heading.h1[lang]}</span>
          ) : (
            <>
              {t.title} <span className="hl">{t.titleHl}</span>
            </>
          )}
        </h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed md:text-[19px]">{heading ? heading.intro[lang] : t.intro}</p>
        {lead}
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[14px] font-medium text-ink" aria-label="Why this site">
          {t.trust.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        {!heading && (
          <div className="mt-6 flex flex-wrap gap-3">
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
        <div id="library" className="relative scroll-mt-20 rounded-3xl border-2 border-ink bg-white p-4 shadow-[5px_5px_0_#1d1d1f] md:p-7">
          {/* filters: every row allows picking several */}
          <div className="grid gap-4">
            <Filter label={t.type}>
              <Chip on={!kinds.length} onClick={() => setKinds([])}>
                {t.all}
              </Chip>
              {FKINDS.map((k) => (
                <Chip key={k} on={kinds.includes(k)} onClick={() => setKinds(toggle(kinds, k))} dot={COLOR[k]}>
                  {t.kinds[k]}
                </Chip>
              ))}
            </Filter>
            <Filter label={t.medium}>
              <Chip on={!mediums.length} onClick={() => setMediums([])}>
                {t.all}
              </Chip>
              {MEDIUMS.map((m) => (
                <Chip key={m.key} on={mediums.includes(m.key)} onClick={() => setMediums(toggle(mediums, m.key))}>
                  {m[lang]}
                </Chip>
              ))}
            </Filter>
            <Filter label={t.subject}>
              <Chip on={!subjects.length} onClick={() => setSubjects([])}>
                {t.allSubjects}
              </Chip>
              {FILTER_SUBJECTS.map((s) => (
                <Chip key={s.key} on={subjects.includes(s.key)} onClick={() => setSubjects(toggle(subjects, s.key))} dot={s.color}>
                  {s[lang]}
                </Chip>
              ))}
            </Filter>
            <Filter label={t.year}>
              <Chip on={!years.length} onClick={() => setYears([])}>
                {t.allYears}
              </Chip>
              {yearOptions.map((y) => (
                <Chip key={y} on={years.includes(String(y))} onClick={() => setYears(toggle(years, String(y)))}>
                  {y}
                </Chip>
              ))}
            </Filter>
            <p className="-mt-1 text-[13px] text-ink-faint md:pl-[146px]">
              {t.pickMany} {mediums.length > 0 && t.languageNote}
            </p>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.search}
                aria-label={t.search}
                className="w-full rounded-full border-2 border-ink/15 bg-mist px-5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-blue md:max-w-sm"
              />
              <span className="font-mono text-[13px] text-ink-faint">{t.match(shown.length)}</span>
              <div className="flex flex-wrap gap-2 md:ml-auto">
                {filtered && (
                  <button type="button" onClick={reset} className="btn-ghost !px-4 !py-2 !text-[14px]">
                    {t.reset}
                  </button>
                )}
                <button type="button" onClick={share} className="btn-ghost !px-4 !py-2 !text-[14px]" aria-live="polite">
                  {shared ? t.copied : t.copyLink}
                </button>
                <button
                  type="button"
                  onClick={() => downloadZip(inView)}
                  disabled={!inView.length || !!zip}
                  className="btn-blue !px-4 !py-2 !text-[14px] disabled:opacity-60"
                >
                  ⬇ {zip ? t.zipping(zip.d, zip.n) : t.zipSel(inView.length)}
                </button>
              </div>
            </div>
          </div>

          {/* breadcrumb */}
          <nav aria-label="Folders" className="mt-7 flex flex-wrap items-center gap-1.5 font-mono text-[13px]">
            <button type="button" onClick={() => go([])} className={path.length ? "text-blue hover:underline" : "font-semibold text-ink"}>
              📁 {t.folders}
            </button>
            {folder && (
              <>
                <span className="text-ink-faint">/</span>
                <button type="button" onClick={() => go([folder.id])} className={sub && folder.subs.length > 1 ? "text-blue hover:underline" : "font-semibold text-ink"}>
                  {folder.title}
                </button>
              </>
            )}
            {sub && folder && folder.subs.length > 1 && (
              <>
                <span className="text-ink-faint">/</span>
                <span className="font-semibold text-ink">{sub.title}</span>
              </>
            )}
          </nav>

          <div className="mt-4">
            {!folders.length ? (
              <div className="grid place-items-center gap-3 py-16 text-center">
                <p className="font-note text-[19px] text-ink">{t.empty}</p>
                <button type="button" onClick={reset} className="btn-ghost">
                  {t.reset}
                </button>
              </div>
            ) : sub && folder ? (
              <>
                <button type="button" onClick={() => go(folder.subs.length > 1 ? [folder.id] : [])} className="mb-4 text-[14px] font-medium text-blue hover:underline">
                  {folder.subs.length > 1 ? `← ${folder.title}` : t.back}
                </button>
                <ul className="grid grid-cols-2 gap-x-2.5 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
                  {sub.papers.map((p, i) => (
                    <Card key={p.path} p={p} lang={lang} n={i + 1} />
                  ))}
                </ul>
              </>
            ) : folder ? (
              <>
                <button type="button" onClick={() => go([])} className="mb-4 text-[14px] font-medium text-blue hover:underline">
                  {t.back}
                </button>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {folder.subs.map((s) => (
                    <FolderTile key={s.id} title={s.title} color={COLOR[folder.kind]} label={t.count(s.papers.length)} onOpen={() => go([folder.id, s.id])} small />
                  ))}
                </ul>
              </>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {folders.map((f) => (
                  <FolderTile key={f.id} title={f.title} color={COLOR[f.kind]} label={t.count(f.count)} tag={t.kinds[f.kind]} onOpen={() => go([f.id])} />
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-[1.3fr_1fr]">
          <div
            className="relative rounded-sm px-6 pb-7 pt-8 font-note text-[17px] leading-snug text-ink"
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
              ⬇ {t.zip}
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

function FolderTile({ title, color, label, tag, onOpen, small }: { title: string; color: string; label: string; tag?: string; onOpen: () => void; small?: boolean }) {
  return (
    <li>
      <button type="button" onClick={onOpen} className="group relative block w-full pt-3 text-left">
        <span aria-hidden className="absolute left-0 top-0 h-4 w-2/5 rounded-t-lg border-2 border-b-0 border-ink" style={{ background: color }} />
        <span
          className={`relative flex flex-col justify-between rounded-b-xl rounded-tr-xl border-2 border-ink p-3 transition-transform group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0_#1d1d1f] ${small ? "min-h-[86px]" : "min-h-[110px]"}`}
          style={{ background: `color-mix(in srgb, ${color} 22%, white)` }}
        >
          {tag && <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{tag}</span>}
          <span className={`font-semibold leading-tight text-ink ${small ? "text-[15px]" : "text-[16px] md:text-[18px]"}`}>{title}</span>
          <span className="mt-2 flex items-center justify-between font-mono text-[12px] text-ink-soft">
            {label}
            <span aria-hidden className="text-[16px] transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </span>
      </button>
    </li>
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

function Filter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 md:grid-cols-[130px_1fr] md:items-start">
      <span className="label pt-2">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ on, onClick, children, dot }: { on: boolean; onClick: () => void; children: React.ReactNode; dot?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-1 text-[13px] font-medium transition-all md:px-3.5 md:py-1.5 md:text-[14px] ${
        on ? "border-ink bg-ink text-white shadow-[2px_2px_0_#ffc700]" : "border-ink/15 bg-white text-ink hover:border-ink/50"
      }`}
    >
      {dot && <span className="h-2.5 w-2.5 rounded-full" style={{ background: dot }} />}
      {children}
    </button>
  );
}

function Card({ p, lang, n }: { p: Paper; lang: Lang; n: number }) {
  const t = T[lang];
  const s = SUBJ[p.subject];
  const sub = p.medium ? MEDIUMS.find((m) => m.key === p.medium)?.[lang] : p.variant ? variantLabel(p.variant, lang) : "";
  const when = p.kind === "pyq" ? `${p.session === "supplementary" ? "★ " : ""}${p.year}` : p.kind === "prelim" ? p.title.split(" - ")[0] : p.exam;
  const href = fileHref(p);
  return (
    <li className="relative flex flex-col rounded-xl border-2 border-ink/15 bg-white p-2.5 pt-3 transition-colors hover:border-ink">
      <span
        aria-hidden
        className="absolute -left-1.5 -top-2 grid h-6 min-w-6 place-items-center rounded-md border-2 border-ink px-1 font-mono text-[12px] font-semibold"
        style={{ background: s?.color ?? "#ffc700", color: "#fff", textShadow: "0 1px 0 rgba(0,0,0,.35)" }}
      >
        {n}
      </span>
      <span className="pl-4 text-[14px] font-semibold leading-tight text-ink md:text-[15px]" title={paperName(p)}>
        {s?.[lang] ?? p.subject}
      </span>
      {sub && <span className="pl-4 text-[12px] leading-tight text-ink-soft">{sub}</span>}
      <span className={`mt-1 pl-4 font-mono text-[11px] ${p.session === "supplementary" ? "text-orange" : "text-ink-faint"}`}>{when}</span>
      <span className="mt-2 flex gap-1.5">
        <a href={href} target="_blank" rel="noopener" className="flex-1 whitespace-nowrap rounded-lg bg-mist px-1 py-1.5 text-center text-[12px] font-semibold text-blue hover:bg-blue hover:text-white">
          {t.view}
        </a>
        <a href={href} download className="flex-[1.5] whitespace-nowrap rounded-lg bg-ink px-1 py-1.5 text-center text-[12px] font-semibold text-white hover:bg-blue" aria-label={`${t.download}: ${paperName(p)}`}>
          ⬇ {t.download}
        </a>
      </span>
    </li>
  );
}
