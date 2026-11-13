"use client";

import { useEffect, useMemo, useState } from "react";
import { useLenis } from "lenis/react";
import { Tape } from "@/components/sketch/Paper";
import { ALL, BASE_PATH, PAPERS_REPO, fileHref, paperName, type Kind, type Paper, type Scope } from "./data";
import { MEDIUMS, SUBJECTS, T, examLabel, variantLabel, type Lang } from "./i18n";
import TalkToMe from "./TalkToMe";

const KINDS: Kind[] = ["pyq", "prelim", "qbank", "model"];
const SUBJ = Object.fromEntries(SUBJECTS.map((s) => [s.key, s]));
const SUBJ_ORDER = Object.fromEntries(SUBJECTS.map((s, i) => [s.key, i]));
const MED_ORDER = Object.fromEntries(MEDIUMS.map((m, i) => [m.key, i]));
const KIND_COLOR: Record<Kind | "all", string> = { all: "#ffffff", pyq: "#ffc700", prelim: "#18a0fb", qbank: "#1bc47d", model: "#ee46d3" };
const STORE = "ssc-papers-prefs";

const size = (kb: number) => (kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`);
const bySubject = (a: Paper, b: Paper) =>
  (SUBJ_ORDER[a.subject] ?? 99) - (SUBJ_ORDER[b.subject] ?? 99) || (a.variant ?? "").localeCompare(b.variant ?? "") || a.title.localeCompare(b.title);

type Group = { id: string; title: string; papers: Paper[] };
type Section = { id: string; kind: Kind; title: string; sub?: string; groups: Group[] };

// Newest board papers first (each year split by medium, then languages, then supplementary),
// then prelims, question banks and model papers.
function buildSections(list: Paper[], lang: Lang): Section[] {
  const t = T[lang];
  const out: Section[] = [];
  const pyq = list.filter((p) => p.kind === "pyq");
  for (const y of [...new Set(pyq.map((p) => p.year as number))].sort((a, b) => b - a)) {
    const ofYear = pyq.filter((p) => p.year === y);
    const main = ofYear.filter((p) => p.session === "main");
    const groups: Group[] = [];
    for (const m of [...new Set(main.filter((p) => p.medium).map((p) => p.medium as string))].sort((a, b) => MED_ORDER[a] - MED_ORDER[b]))
      groups.push({ id: `y${y}-${m.toLowerCase()}`, title: MEDIUMS.find((x) => x.key === m)![lang], papers: main.filter((p) => p.medium === m).sort(bySubject) });
    const langs = main.filter((p) => !p.medium);
    if (langs.length) groups.push({ id: `y${y}-languages`, title: t.languageH, papers: langs.sort(bySubject) });
    for (const ex of [...new Set(ofYear.filter((p) => p.session === "supplementary").map((p) => p.exam as string))])
      groups.push({
        id: `y${y}-supplementary-${ex.split(" ")[0].toLowerCase()}`,
        title: t.suppH(examLabel(ex, lang)),
        papers: ofYear.filter((p) => p.session === "supplementary" && p.exam === ex).sort((a, b) => (MED_ORDER[a.medium ?? ""] ?? 9) - (MED_ORDER[b.medium ?? ""] ?? 9) || bySubject(a, b)),
      });
    const mainExam = main[0]?.exam;
    out.push({ id: `y${y}`, kind: "pyq", title: t.yearTitle(y), sub: mainExam ? t.yearSub(examLabel(mainExam, lang)) : undefined, groups });
  }
  const pre = list.filter((p) => p.kind === "prelim");
  if (pre.length) {
    const sessions = [...new Set(pre.map((p) => p.exam as string))].sort((a, b) => b.localeCompare(a));
    out.push({
      id: "prelims",
      kind: "prelim",
      title: t.prelimTitle,
      groups: sessions.map((s) => ({
        id: `prelims-${s.replace(/\D+/g, "")}`,
        title: t.sessionH(s.replace(/^\D+/, "")),
        papers: pre.filter((p) => p.exam === s).sort(bySubject),
      })),
    });
  }
  const qb = list.filter((p) => p.kind === "qbank");
  if (qb.length)
    out.push({
      id: "question-banks",
      kind: "qbank",
      title: t.qbTitle,
      groups: [...new Set(qb.map((p) => p.year as number))]
        .sort((a, b) => b - a)
        .map((y) => ({ id: `question-bank-${y}`, title: t.qbYear(y), papers: qb.filter((p) => p.year === y).sort(bySubject) })),
    });
  const mo = list.filter((p) => p.kind === "model");
  if (mo.length) out.push({ id: "model-papers", kind: "model", title: t.modelTitle, groups: [{ id: "model-2027", title: "Model 2027", papers: mo.sort(bySubject) }] });
  return out;
}

export default function SscLibrary({
  email,
  scope = {},
  heading,
}: {
  email: string;
  scope?: Scope;
  heading?: { kicker?: { en: string; mr: string }; h1: { en: string; mr: string }; intro: { en: string; mr: string } };
}) {
  const [lang, setLang] = useState<Lang>("en");
  const [kind, setKind] = useState<Kind | "all">(scope.kind ?? "all");
  const [medium, setMedium] = useState<string>(scope.medium ?? "all");
  const [subject, setSubject] = useState<string>(scope.subject ?? "all");
  const [year, setYear] = useState<string>(scope.year ? String(scope.year) : "all");
  const [supp, setSupp] = useState(true);
  const [q, setQ] = useState("");
  const t = T[lang];
  const mr = lang === "mr";
  const scoped = Boolean(heading);

  // Remember the language (and, on the main page, the medium) for the next visit.
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORE) ?? "{}");
      if (s.lang === "mr" || s.lang === "en") setLang(s.lang);
      if (!scoped && typeof s.medium === "string") setMedium(s.medium);
    } catch {}
  }, [scoped]);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORE) ?? "{}");
      localStorage.setItem(STORE, JSON.stringify({ ...s, lang, ...(scoped ? {} : { medium }) }));
    } catch {}
    document.documentElement.lang = mr ? "mr" : "en";
  }, [lang, medium, scoped, mr]);

  const ofKind = useMemo(() => (kind === "all" ? ALL : ALL.filter((p) => p.kind === kind)), [kind]);
  const mediumsHere = useMemo(() => MEDIUMS.filter((m) => ofKind.some((p) => p.medium === m.key)), [ofKind]);
  const subjectsHere = useMemo(
    () => SUBJECTS.filter((s) => ofKind.some((p) => p.subject === s.key && (medium === "all" || !p.medium || p.medium === medium))),
    [ofKind, medium],
  );
  const yearsHere = useMemo(
    () => [...new Set(ofKind.filter((p) => p.kind === "pyq" || kind !== "all").map((p) => p.year).filter(Boolean) as number[])].sort((a, b) => b - a),
    [ofKind, kind],
  );

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ofKind.filter((p) => {
      if (medium !== "all" && p.medium && p.medium !== medium) return false;
      if (subject !== "all" && p.subject !== subject) return false;
      if (year !== "all" && String(p.year) !== year) return false;
      if (!supp && p.session === "supplementary") return false;
      if (!needle) return true;
      const s = SUBJ[p.subject];
      return [p.title, p.exam, p.code, p.medium, p.variant, s?.en, s?.mr, String(p.year)].join(" ").toLowerCase().includes(needle);
    });
  }, [ofKind, medium, subject, year, supp, q]);

  const sections = useMemo(() => buildSections(shown, lang), [shown, lang]);

  const counts = {
    board: ALL.filter((p) => p.kind === "pyq").length,
    years: new Set(ALL.filter((p) => p.kind === "pyq").map((p) => p.year)).size,
    practice: ALL.filter((p) => p.kind !== "pyq").length,
  };

  const switchKind = (k: Kind | "all") => {
    setKind(k);
    setYear("all");
    setSubject("all");
  };
  const reset = () => {
    setKind("all");
    setMedium("all");
    setSubject("all");
    setYear("all");
    setSupp(true);
    setQ("");
  };

  return (
    <div className={mr ? "ssc-mr" : ""}>
      {/* top bar */}
      <header className="sticky top-3 z-40 mx-auto flex max-w-6xl items-center justify-between gap-2 px-4">
        <a
          href={scoped ? BASE_PATH : "/"}
          className="rounded-full border border-ink/10 bg-white/85 px-4 py-1.5 font-marker text-[26px] leading-none text-ink shadow-paper backdrop-blur"
        >
          {scoped ? (mr ? "← सर्व प्रश्नपत्रिका" : "← all papers") : t.back}
        </a>
        <button
          type="button"
          onClick={() => setLang(mr ? "en" : "mr")}
          className="flex items-center gap-1 rounded-full border border-ink/10 bg-white/85 p-1 text-[14px] shadow-paper backdrop-blur"
          aria-label={mr ? "Switch to English" : "मराठीत पहा"}
        >
          <span className={`rounded-full px-3 py-1 ${!mr ? "bg-ink text-white" : "text-ink-soft"}`}>EN</span>
          <span className={`ssc-deva rounded-full px-3 py-1 ${mr ? "bg-ink text-white" : "text-ink-soft"}`}>मराठी</span>
        </button>
      </header>

      {/* hero */}
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

      {/* type tabs */}
      <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pt-4" aria-label={t.type}>
        {(["all", ...KINDS] as const).map((k) => {
          const on = k === kind;
          const n = k === "all" ? ALL.length : ALL.filter((p) => p.kind === k).length;
          return (
            <button
              key={k}
              type="button"
              onClick={() => switchKind(k)}
              aria-pressed={on}
              className={`relative shrink-0 rounded-t-2xl border-2 border-b-0 border-ink px-4 pb-2.5 pt-2 text-[15px] font-semibold transition-transform md:px-6 md:text-[16px] ${
                on ? "text-ink" : "translate-y-1.5 text-ink-soft hover:translate-y-0.5"
              }`}
              style={{ background: on ? (k === "all" ? "#1d1d1f" : KIND_COLOR[k]) : "#fff", color: on && k === "all" ? "#fff" : undefined }}
            >
              {k === "all" ? t.everything : t.tabs[k]}
              <span className="ml-2 rounded-full bg-white/80 px-1.5 text-[12px] font-medium text-ink">{n}</span>
            </button>
          );
        })}
      </nav>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="relative rounded-b-3xl rounded-tr-3xl border-2 border-ink bg-white p-4 shadow-[5px_5px_0_#1d1d1f] md:p-7">
          {kind !== "all" && <p className="font-note text-[16px] text-ink-soft">{t.tabHints[kind]}</p>}

          {/* filters */}
          <div className="mt-2 grid gap-5">
            {mediumsHere.length > 0 && (
              <Filter label={t.medium}>
                <Chip on={medium === "all"} onClick={() => setMedium("all")}>
                  {t.all}
                </Chip>
                {mediumsHere.map((m) => (
                  <Chip key={m.key} on={medium === m.key} onClick={() => setMedium(m.key)}>
                    {m[lang]}
                  </Chip>
                ))}
              </Filter>
            )}
            <Filter label={t.subject}>
              <Chip on={subject === "all"} onClick={() => setSubject("all")}>
                {t.allSubjects}
              </Chip>
              {subjectsHere.map((s) => (
                <Chip key={s.key} on={subject === s.key} onClick={() => setSubject(s.key)} dot={s.color}>
                  {s[lang]}
                </Chip>
              ))}
            </Filter>
            {yearsHere.length > 1 && (
              <Filter label={t.year}>
                <Chip on={year === "all"} onClick={() => setYear("all")}>
                  {t.allYears}
                </Chip>
                {yearsHere.map((y) => (
                  <Chip key={y} on={year === String(y)} onClick={() => setYear(String(y))}>
                    {y}
                  </Chip>
                ))}
              </Filter>
            )}
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.search}
                aria-label={t.search}
                className="w-full rounded-full border-2 border-ink/15 bg-mist px-5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-blue md:max-w-md"
              />
              {(kind === "pyq" || kind === "all") && (
                <label className="flex cursor-pointer select-none items-center gap-2 text-[15px] text-ink">
                  <input type="checkbox" checked={supp} onChange={(e) => setSupp(e.target.checked)} className="h-4 w-4 accent-[#0859d4]" />
                  {t.showSupp}
                </label>
              )}
              <span className="font-mono text-[13px] text-ink-faint md:ml-auto">{t.count(shown.length)}</span>
            </div>
            {medium !== "all" && <p className="-mt-2 text-[13px] text-ink-faint">{t.languageNote}</p>}
          </div>

          {/* contents */}
          {sections.length > 1 && <Contents sections={sections} lang={lang} />}

          {/* results */}
          <div className="mt-10 grid gap-14">
            {sections.length === 0 && (
              <div className="grid place-items-center gap-3 py-16 text-center">
                <p className="font-note text-[19px] text-ink">{t.empty}</p>
                <button type="button" onClick={reset} className="btn-ghost">
                  {t.reset}
                </button>
              </div>
            )}
            {sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-24">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-b-2 border-dashed border-ink/15 pb-3">
                  <div>
                    <span className="mb-1 inline-block rounded-md px-2 py-0.5 text-[12px] font-semibold text-ink" style={{ background: KIND_COLOR[s.kind] }}>
                      {t.tabs[s.kind]}
                    </span>
                    <h2 id={`${s.id}-h`} className="font-marker text-[46px] leading-[0.95] text-ink md:text-[56px]">
                      {s.title}
                    </h2>
                    {s.sub && <p className="mt-1 text-[14px] text-ink-soft">{s.sub}</p>}
                  </div>
                  <Jump to="contents" className="font-mono text-[12px] text-ink-faint hover:text-blue">
                    {t.toTop}
                  </Jump>
                </div>
                <div className="grid gap-8">
                  {s.groups.map((g) => (
                    <div key={g.id} id={g.id} className="scroll-mt-24">
                      {(s.groups.length > 1 || s.kind === "pyq") && (
                        <h3 className="mb-3 flex items-baseline gap-2 text-[19px] font-semibold text-ink">
                          {g.title}
                          <span className="font-mono text-[12px] font-normal text-ink-faint">{t.count(g.papers.length)}</span>
                        </h3>
                      )}
                      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {g.papers.map((p) => (
                          <Card key={p.path} p={p} lang={lang} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* tips + downloads */}
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
            <a href={PAPERS_REPO} target="_blank" rel="noopener" className="btn-ghost justify-center">
              {t.repo} ↗
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

// In-page link. The site's smooth scroller (Lenis) caches page height, which goes stale on this long,
// filterable page, so we scroll to the element ourselves and keep the URL hash in sync.
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
        history.replaceState(null, "", `#${to}`);
        if (lenis) {
          lenis.resize();
          lenis.scrollTo(el, { duration: 0.9 }); // the target's scroll-margin (scroll-mt-24) leaves room for the sticky bar
        } else {
          window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: "smooth" });
        }
      }}
    >
      {children}
    </a>
  );
}

// A notebook "contents" page: every section with its sub-groups and counts, all jump links.
function Contents({ sections, lang }: { sections: Section[]; lang: Lang }) {
  const t = T[lang];
  return (
    <nav id="contents" aria-label={t.contents} className="mt-8 scroll-mt-24 rounded-2xl border-2 border-dashed border-ink/20 bg-mist/60 p-4 md:p-6">
      <p className="font-marker text-[36px] leading-none text-ink">{t.contents}</p>
      <p className="mt-1 text-[14px] text-ink-soft">{t.contentsHint}</p>
      <ol className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => {
          const n = s.groups.reduce((a, g) => a + g.papers.length, 0);
          return (
            <li key={s.id}>
              <Jump to={s.id} className="group flex items-baseline gap-2 text-[16px] font-semibold text-ink">
                <span className="h-2.5 w-2.5 shrink-0 translate-y-[-1px] rounded-full border border-ink" style={{ background: KIND_COLOR[s.kind] }} />
                <span className="group-hover:text-blue group-hover:underline">{s.title}</span>
                <span className="flex-1 border-b border-dotted border-ink/30" />
                <span className="font-mono text-[12px] font-normal text-ink-faint">{n}</span>
              </Jump>
              {s.groups.length > 1 && (
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 pl-[18px]">
                  {s.groups.map((g) => (
                    <Jump key={g.id} to={g.id} className="text-[13px] text-ink-soft hover:text-blue hover:underline">
                      {g.title}
                    </Jump>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
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
      className={`inline-flex items-center gap-2 rounded-full border-2 px-3.5 py-1.5 text-[14px] font-medium transition-all ${
        on ? "border-ink bg-ink text-white shadow-[2px_2px_0_#ffc700]" : "border-ink/15 bg-white text-ink hover:border-ink/50"
      }`}
    >
      {dot && <span className="h-2.5 w-2.5 rounded-full" style={{ background: dot }} />}
      {children}
    </button>
  );
}

function Card({ p, lang }: { p: Paper; lang: Lang }) {
  const t = T[lang];
  const s = SUBJ[p.subject];
  const sub = p.medium ? MEDIUMS.find((m) => m.key === p.medium)?.[lang] : p.variant ? variantLabel(p.variant, lang) : "";
  const when =
    p.kind === "pyq"
      ? `${p.session === "supplementary" ? `${t.supplementary} · ` : ""}${examLabel(p.exam ?? "", lang)}`
      : p.kind === "prelim"
        ? p.title.split(" - ")[0]
        : p.exam;
  return (
    <li>
      <a
        href={fileHref(p)}
        target="_blank"
        rel="noopener"
        title={paperName(p)}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-ink/15 bg-white p-4 pl-5 transition-all hover:-translate-y-0.5 hover:border-ink hover:shadow-[4px_4px_0_#1d1d1f]"
      >
        <span aria-hidden className="absolute inset-y-0 left-0 w-1.5" style={{ background: s?.color ?? "#ffc700" }} />
        <span className="text-[17px] font-semibold leading-snug text-ink">{s?.[lang] ?? p.subject}</span>
        {sub && <span className="mt-0.5 text-[14px] text-ink-soft">{sub}</span>}
        <span className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[12px] text-ink-faint">
          {when && <span className={p.session === "supplementary" ? "text-orange" : ""}>{when}</span>}
          {p.code && <span>· {p.code}</span>}
          <span>
            · {p.pages} {t.pages}
          </span>
          <span>· {size(p.sizeKB)}</span>
        </span>
        <span className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full bg-mist px-3 py-1 text-[13px] font-medium text-blue transition-colors group-hover:bg-blue group-hover:text-white">
          {t.open} ↗
        </span>
        <span className="sr-only">{paperName(p)}</span>
      </a>
    </li>
  );
}
