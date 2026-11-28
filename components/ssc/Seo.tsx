// Server-rendered SEO pieces for the SSC papers pages: JSON-LD, the "browse by" link hub and the FAQ.
import { SITE_URL } from "@/lib/site";
import { profile } from "@/data/profile";
import { BASE_PATH, LANDINGS, SSC_SITE_NAME, SUBJECT_YEARS, fileAbs, fileHref, landingTitle, langBase, paperName, subjectYearSlug, type Paper } from "./data";
import { SUBJECTS, type Lang } from "./i18n";

const MR_NAME: Record<string, string> = Object.fromEntries(SUBJECTS.map((s) => [s.key, s.mr]));

const SEMI_YEARS = LANDINGS.filter((l) => l.group === "mediumYear");

export const FAQ: { q: string; a: string; qm: string; am: string }[] = [
  {
    q: "Where can I download Maharashtra SSC Semi-English medium question papers?",
    a: "Here, free. The board does not print a separate Semi-English paper: Semi-English students write Maths and Science in English and History-Geography in Marathi. Pick 'Semi-English medium' in the filters, or open the Semi-English page for a year, to get exactly those official papers (English medium Algebra, Geometry, Science 1 and 2, Marathi medium History and Geography) plus the language papers.",
    qm: "सेमी इंग्रजी माध्यमाच्या दहावी प्रश्नपत्रिका कुठे मिळतील?",
    am: "येथेच, मोफत. बोर्ड सेमी इंग्रजीसाठी वेगळी प्रश्नपत्रिका छापत नाही: सेमी इंग्रजीचे विद्यार्थी गणित व विज्ञान इंग्रजीत आणि इतिहास-भूगोल मराठीत लिहितात. फिल्टरमध्ये 'सेमी इंग्रजी माध्यम' निवडा, म्हणजे इंग्रजी माध्यमाचे बीजगणित, भूमिती, विज्ञान १ व २, मराठी माध्यमाचे इतिहास व भूगोल आणि भाषा विषय मिळतील.",
  },
  {
    q: "Why use this site for SSC board papers?",
    a: "It is free with no ads, no pop-ups, no login and no sign-up. Every official paper is sorted by year, medium and subject, so any paper is about two taps away, and you can download a whole group of papers as one ZIP. If a paper is missing, you can request it from the form on the page.",
    qm: "एसएससी प्रश्नपत्रिकांसाठी हीच साइट का?",
    am: "पूर्णपणे मोफत: जाहिराती नाहीत, पॉप-अप नाहीत, लॉगिन नाही. सर्व अधिकृत प्रश्नपत्रिका वर्ष, माध्यम व विषयानुसार लावल्या आहेत, त्यामुळे कोणतीही प्रश्नपत्रिका दोन टॅपमध्ये मिळते. प्रश्नपत्रिकांचा संपूर्ण गट एका ZIP मध्ये डाउनलोड करता येतो. एखादी प्रश्नपत्रिका नसल्यास खालील फॉर्मवरून मागा.",
  },
  {
    q: "Are these the official Maharashtra SSC board papers?",
    a: "Yes. Every board paper here is the official MSBSHSE question paper from that exam: the real paper students wrote, scanned. Each one carries the board's paper code and exam date, checked by hand. The site itself is not run by the board; it is a free voluntary service by an SSC alumnus.",
    qm: "या खऱ्या बोर्ड प्रश्नपत्रिका आहेत का?",
    am: "हो. येथील प्रत्येक बोर्ड प्रश्नपत्रिका MSBSHSE च्या खऱ्या परीक्षेतील आहे. प्रत्येकीवर बोर्डाचा पेपर कोड (उदा. N 919) आणि परीक्षेची तारीख आहे, आणि ते हाताने तपासले आहेत.",
  },
  {
    q: "Which years of SSC board papers are available?",
    a: "March board papers from 2019 to 2026, plus the supplementary (June-July, August and September) exams where they exist. The March 2021 exam was cancelled due to COVID; the September 2021 exam papers for Algebra, Geometry, Science 1 and Science 2 are included. The March 2020 Geography paper was also cancelled.",
    qm: "कोणत्या वर्षांच्या प्रश्नपत्रिका उपलब्ध आहेत?",
    am: "२०१९ ते २०२६ च्या मार्च बोर्ड परीक्षा, आणि जिथे उपलब्ध आहेत तिथे पुरवणी परीक्षा. मार्च २०२१ ची परीक्षा कोविडमुळे रद्द झाली; सप्टेंबर २०२१ च्या बीजगणित, भूमिती, विज्ञान १ व २ च्या प्रश्नपत्रिका दिल्या आहेत. मार्च २०२० चा भूगोलाचा पेपरही रद्द झाला होता.",
  },
  {
    q: "Are Marathi medium SSC papers available?",
    a: "Yes. Algebra, Geometry, Science 1, Science 2, History and Geography are available in Marathi medium for 2022 to 2026, and in Hindi, Urdu and Kannada medium for some years. Language papers (Marathi, Hindi, English, Sanskrit, Urdu) are the same for every medium.",
    qm: "मराठी माध्यमाच्या प्रश्नपत्रिका आहेत का?",
    am: "हो. बीजगणित, भूमिती, विज्ञान १ व २, इतिहास आणि भूगोल यांच्या २०२२ ते २०२६ च्या मराठी माध्यमाच्या प्रश्नपत्रिका आहेत. भाषा विषयांच्या प्रश्नपत्रिका सर्व माध्यमांसाठी सारख्याच असतात.",
  },
  {
    q: "What is the difference between board papers, prelim papers, question banks and model papers?",
    a: "Board papers are the real exam papers from past years. Prelim papers are full mock exams set by schools before the board exam. Question banks (by SCERT Maharashtra) are chapter-wise practice questions. Model papers are practice papers written in the board pattern.",
    qm: "बोर्ड प्रश्नपत्रिका, सराव परीक्षा, प्रश्नपेढी आणि नमुना प्रश्नपत्रिका यात फरक काय?",
    am: "बोर्ड प्रश्नपत्रिका म्हणजे मागील वर्षांच्या खऱ्या परीक्षा. सराव / पूर्व परीक्षा शाळा बोर्डापूर्वी घेतात. प्रश्नपेढी (SCERT) मध्ये धडानिहाय प्रश्न असतात. नमुना प्रश्नपत्रिका बोर्डाच्या पद्धतीने तयार केलेल्या असतात.",
  },
  {
    q: "How long is each SSC paper and how many marks?",
    a: "Language papers are 3 hours for 80 marks (composite language papers are 2 hours for 40). Maths Part 1 and 2, Science Part 1 and 2, History and Political Science, and Geography are 2 hours for 40 marks each.",
    qm: "प्रत्येक पेपर किती वेळाचा आणि किती गुणांचा असतो?",
    am: "भाषा विषय: ३ तास, ८० गुण (संयुक्त भाषा: २ तास, ४० गुण). गणित भाग १ व २, विज्ञान भाग १ व २, इतिहास व राज्यशास्त्र आणि भूगोल: प्रत्येकी २ तास, ४० गुण.",
  },
  {
    q: "Do I need to sign up or pay to download?",
    a: "No. Every PDF opens directly, with no login and no payment. You can also download all papers at once as a ZIP.",
    qm: "डाउनलोडसाठी लॉगिन किंवा पैसे लागतात का?",
    am: "नाही. प्रत्येक PDF थेट उघडते, लॉगिन किंवा पैसे लागत नाहीत. सर्व प्रश्नपत्रिका एकाच ZIP मध्येही डाउनलोड करता येतात.",
  },
];

export function JsonLd({
  path,
  name,
  description,
  papers,
  crumbs,
  withFaq,
  lang = "en",
}: {
  path: string;
  name: string;
  description: string;
  papers: Paper[];
  crumbs: { name: string; path: string }[];
  withFaq?: boolean;
  lang?: Lang;
}) {
  const url = SITE_URL + path;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "CollectionPage",
      dateModified: new Date().toISOString().slice(0, 10),
      "@id": `${url}#page`,
      url,
      name,
      description,
      inLanguage: lang === "mr" ? "mr-IN" : "en-IN",
      isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}${BASE_PATH}#site`, url: SITE_URL + BASE_PATH, name: SSC_SITE_NAME },
      author: { "@type": "Person", name: profile.name, url: SITE_URL },
      about: { "@type": "Thing", name: "Maharashtra SSC (Class 10) board examination" },
      audience: { "@type": "EducationalAudience", educationalRole: "student" },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: papers.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: papers.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "DigitalDocument",
            name: paperName(p),
            url: fileAbs(p),
            encodingFormat: "application/pdf",
            numberOfPages: p.pages,
            educationalLevel: "Class 10 (SSC)",
            learningResourceType: p.kind === "pyq" ? "Previous year question paper" : p.kind === "qbank" ? "Question bank" : "Practice paper",
            inLanguage: p.medium === "Marathi" ? "mr" : p.medium === "Hindi" ? "hi" : p.medium === "Urdu" ? "ur" : "en",
            isAccessibleForFree: true,
            publisher: p.kind === "pyq" ? { "@type": "Organization", name: "Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)" } : undefined,
          },
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: SITE_URL + c.path })),
    },
  ];
  if (withFaq)
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: FAQ.flatMap((f) => [
        { "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } },
        { "@type": "Question", name: f.qm, inLanguage: "mr", acceptedAnswer: { "@type": "Answer", text: f.am } },
      ]),
    });
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

// Internal links to every landing page. Helps students and search engines find the year/subject pages.
export function BrowseHub({ current, lang = "en" }: { current?: string; lang?: Lang }) {
  const groups: [string, string, typeof LANDINGS][] = [
    ["By year", "वर्षानुसार", LANDINGS.filter((l) => l.group === "year")],
    ["By subject", "विषयानुसार", LANDINGS.filter((l) => l.group === "subject")],
    ["By medium & type", "माध्यम व प्रकारानुसार", LANDINGS.filter((l) => l.group === "medium" || l.group === "other")],
  ];
  return (
    <section aria-labelledby="browse-h" className="mx-auto max-w-6xl px-4 pb-16">
      <h2 id="browse-h" className="font-marker text-[44px] leading-none text-ink">
        Browse SSC papers <span className="ssc-deva text-[0.6em] text-ink-soft">· प्रश्नपत्रिका शोधा</span>
      </h2>
      <div className="mt-6 grid gap-8 md:grid-cols-3">
        {groups.map(([en, mr, ls]) => (
          <div key={en}>
            <p className="label">
              {en} <span className="ssc-deva normal-case tracking-normal">· {mr}</span>
            </p>
            <ul className="mt-3 grid gap-1.5">
              {current && (
                <li>
                  <a href={langBase(lang)} className="text-[15px] text-blue underline-offset-4 hover:underline">
                    All SSC papers (2019–2026)
                  </a>
                </li>
              )}
              {ls.map((l) => (
                <li key={l.slug}>
                  <a
                    href={`${langBase(lang)}/${l.slug}`}
                    aria-current={current === l.slug ? "page" : undefined}
                    className={`text-[15px] underline-offset-4 hover:underline ${current === l.slug ? "font-semibold text-ink" : "text-blue"}`}
                  >
                    {landingTitle(l, lang).split(" PDF")[0].replace("Maharashtra ", "")}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// FAQ shown in both languages at once, so Marathi searches can find the page too.
export function Faq() {
  return (
    <section aria-labelledby="faq-h" className="mx-auto max-w-4xl px-4 pb-24">
      <h2 id="faq-h" className="font-marker text-[44px] leading-none text-ink">
        Questions students ask <span className="ssc-deva text-[0.6em] text-ink-soft">· नेहमीचे प्रश्न</span>
      </h2>
      <div className="mt-6 grid gap-3">
        {FAQ.map((f) => (
          <details key={f.q} className="group rounded-2xl border-2 border-ink/15 bg-white p-4 open:border-ink open:shadow-[4px_4px_0_#1d1d1f] md:p-5">
            <summary className="cursor-pointer list-none text-[17px] font-semibold text-ink">
              <span className="mr-2 inline-block transition-transform group-open:rotate-45">+</span>
              {f.q}
              <span className="ssc-deva mt-0.5 block pl-5 text-[15px] font-medium text-ink-soft">{f.qm}</span>
            </summary>
            <p className="mt-3 pl-5 text-[15px] leading-relaxed">{f.a}</p>
            <p className="ssc-deva mt-2 pl-5 text-[15px] leading-relaxed text-ink-soft">{f.am}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// Plain, always-rendered list of every paper link, grouped by year/type. Keeps all PDFs crawlable
// even though the interactive library shows only the first ones until "Show more".
export function PaperIndex({ papers }: { papers: Paper[] }) {
  const groups = new Map<string, Paper[]>();
  for (const p of papers) {
    const k = p.kind === "pyq" ? `SSC board papers ${p.year}${p.session === "supplementary" ? " (supplementary)" : ""}` : p.kind === "prelim" ? "Prelim & practice papers" : p.kind === "qbank" ? "Question banks" : "Model papers";
    groups.set(k, [...(groups.get(k) ?? []), p]);
  }
  return (
    <section aria-labelledby="index-h" className="mx-auto max-w-6xl px-4 pb-16">
      <details className="rounded-2xl border-2 border-dashed border-ink/20 p-4 md:p-5">
        <summary id="index-h" className="cursor-pointer text-[16px] font-semibold text-ink">
          Full list of papers <span className="ssc-deva font-medium text-ink-soft">· सर्व प्रश्नपत्रिकांची यादी</span>
        </summary>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {[...groups.entries()].map(([g, ps]) => (
            <div key={g}>
              <h3 className="text-[14px] font-semibold text-ink">{g}</h3>
              <ul className="mt-1 grid gap-0.5">
                {ps.map((p) => (
                  <li key={p.path}>
                    <a href={fileHref(p)} className="text-[13px] text-blue underline-offset-2 hover:underline">
                      {paperName(p).replace("Maharashtra SSC ", "")}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}

// "SSC English question paper 2025" style quick links: every subject with a chip per year.
// Useful for students who know exactly what they want, and gives search engines a clear map of the pages.
export function PaperMatrix({ subject, lang = "en" }: { subject?: string; lang?: Lang }) {
  const rows = subject ? SUBJECT_YEARS.filter((r) => r.key === subject) : SUBJECT_YEARS;
  const color = Object.fromEntries(SUBJECTS.map((s) => [s.key, s.color]));
  const mr = Object.fromEntries(SUBJECTS.map((s) => [s.key, s.mr]));
  return (
    <section aria-labelledby="matrix-h" className="mx-auto max-w-6xl px-4 pb-14">
      <h2 id="matrix-h" className="font-marker text-[40px] leading-none text-ink">
        {subject ? "Pick a year" : "SSC question paper by subject and year"}{" "}
        <span className="ssc-deva text-[0.6em] text-ink-soft">· {subject ? "वर्ष निवडा" : "विषय व वर्षानुसार प्रश्नपत्रिका"}</span>
      </h2>
      <ul className="mt-5 grid gap-3 md:grid-cols-2">
        {!subject && (
          <li className="flex flex-wrap items-center gap-2 rounded-2xl border-2 border-ink/10 bg-[#fff4c2] p-3 md:col-span-2">
            <span className="mr-1 flex min-w-[150px] items-center gap-2 text-[15px] font-semibold text-ink">
              Semi-English medium <span className="ssc-deva text-[13px] font-medium text-ink-soft">सेमी इंग्रजी</span>
            </span>
            {SEMI_YEARS.map((l) => (
              <a key={l.slug} href={`${langBase(lang)}/${l.slug}`} title={l.h1.en} className="rounded-full border-2 border-ink/15 bg-white px-2.5 py-0.5 font-mono text-[13px] text-ink hover:border-ink hover:bg-ink hover:text-white">
                {l.scope.year}
              </a>
            ))}
          </li>
        )}
        {rows.map((r) => (
          <li key={r.key} className="flex flex-wrap items-center gap-2 rounded-2xl border-2 border-ink/10 bg-white p-3">
            <span className="mr-1 flex min-w-[150px] items-center gap-2 text-[15px] font-semibold text-ink">
              <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: color[r.key] }} />
              {r.name}
              <span className="ssc-deva text-[13px] font-medium text-ink-soft">{mr[r.key]}</span>
            </span>
            {r.years.map((y) => (
              <a
                key={y}
                href={`${langBase(lang)}/${subjectYearSlug(r.key, y)}`}
                title={`SSC ${r.name} question paper ${y}`}
                className="rounded-full border-2 border-ink/15 px-2.5 py-0.5 font-mono text-[13px] text-ink hover:border-ink hover:bg-ink hover:text-white"
              >
                {y}
              </a>
            ))}
          </li>
        ))}
      </ul>
    </section>
  );
}

// Plain facts table for a subject-and-year page: every paper with code, marks, time and direct links.
// Shown above the library so a student who searched for one paper gets it immediately.
export function QuickPapers({ papers, heading, lang = "en" }: { papers: Paper[]; heading: string; lang?: Lang }) {
  const mr = lang === "mr";
  const rows = [...papers].sort((a, b) => (a.session === "supplementary" ? 1 : 0) - (b.session === "supplementary" ? 1 : 0) || (a.medium ?? a.variant ?? "").localeCompare(b.medium ?? b.variant ?? ""));
  return (
    <div className="mt-7 overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-[4px_4px_0_#1d1d1f]">
      <p className="border-b-2 border-ink bg-[#fff4c2] px-4 py-2 text-[14px] font-semibold text-ink">{heading}</p>
      <table className="w-full text-left text-[14px]">
        <thead className="text-[11px] uppercase tracking-wide text-ink-faint">
          <tr>
            <th className="px-3 py-2 font-medium md:px-4">{mr ? "प्रश्नपत्रिका · परीक्षा" : "Paper · exam"}</th>
            <th className="px-3 py-2 text-right font-medium md:px-4">PDF</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            return (
              <tr key={p.path} className="border-t border-ink/10 align-top">
                <td className="px-3 py-2.5 md:px-4">
                  <span className="block font-semibold leading-tight text-ink">{p.medium ? `${p.medium} medium` : p.variant}</span>
                  <span className={`mt-0.5 block text-[12px] ${p.session === "supplementary" ? "text-orange" : "text-ink-soft"}`}>
                    {p.exam}
                    {p.session === "supplementary" ? " (supplementary)" : ""}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right md:px-4">
                  <a href={fileHref(p)} target="_blank" rel="noopener" title={paperName(p)} className="block font-semibold text-blue hover:underline">
                    {mr ? "पहा" : "View"}
                  </a>
                  <a href={fileHref(p)} download className="mt-0.5 block font-semibold text-blue hover:underline">
                    {mr ? "डाउनलोड" : "Download"}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Subject chips for a year page.
export function YearSubjects({ year, lang = "en" }: { year: number; lang?: Lang }) {
  const rows = SUBJECT_YEARS.filter((r) => r.years.includes(year));
  return (
    <section aria-label={`Subjects in ${year}`} className="mx-auto max-w-6xl px-4 pb-12">
      <p className="label mb-2">{lang === "mr" ? `${year} च्या प्रश्नपत्रिका विषयानुसार` : `SSC ${year} papers by subject`}</p>
      <div className="flex flex-wrap gap-2">
        {SEMI_YEARS.some((l) => l.scope.year === year) && (
          <a href={`${langBase(lang)}/ssc-semi-english-question-paper-${year}`} className="rounded-full border-2 border-ink bg-[#fff4c2] px-2.5 py-0.5 text-[13px] font-semibold text-ink hover:bg-ink hover:text-white">
            {lang === "mr" ? "सेमी इंग्रजी माध्यम" : "Semi-English medium"} {year}
          </a>
        )}
        {rows.map((r) => (
          <a
            key={r.key}
            href={`${langBase(lang)}/${subjectYearSlug(r.key, year)}`}
            className="rounded-full border-2 border-ink/15 px-2.5 py-0.5 text-[13px] text-ink hover:border-ink hover:bg-ink hover:text-white"
          >
            {lang === "mr" ? MR_NAME[r.key] : r.name} {year}
          </a>
        ))}
      </div>
    </section>
  );
}

// Sideways links on a subject-and-year page: same subject in other years, other subjects in the same year.
export function RelatedLinks({ subject, year, lang = "en" }: { subject: string; year: number; lang?: Lang }) {
  const nm = (k: string, en: string) => (lang === "mr" ? MR_NAME[k] ?? en : en);
  const same = SUBJECT_YEARS.find((r) => r.key === subject);
  const others = SUBJECT_YEARS.filter((r) => r.key !== subject && r.years.includes(year));
  const chip = "rounded-full border-2 border-ink/15 px-2.5 py-0.5 text-[13px] text-ink hover:border-ink hover:bg-ink hover:text-white";
  return (
    <section aria-label="Related papers" className="mx-auto grid max-w-6xl gap-4 px-4 pb-12 md:grid-cols-2">
      <div>
        <p className="label mb-2">{nm(subject, same?.name ?? "")} · {lang === "mr" ? "इतर वर्षे" : "other years"}</p>
        <div className="flex flex-wrap gap-2">
          {same?.years
            .filter((y) => y !== year)
            .map((y) => (
              <a key={y} href={`${langBase(lang)}/${subjectYearSlug(subject, y)}`} className={chip}>
                {nm(subject, same.name)} {y}
              </a>
            ))}
        </div>
      </div>
      <div>
        <p className="label mb-2">{lang === "mr" ? "इतर विषय" : "Other subjects"} · {year}</p>
        <div className="flex flex-wrap gap-2">
          {others.map((r) => (
            <a key={r.key} href={`${langBase(lang)}/${subjectYearSlug(r.key, year)}`} className={chip}>
              {nm(r.key, r.name)} {year}
            </a>
          ))}
          <a href={`${langBase(lang)}/ssc-board-paper-${year}`} className={chip}>
            {lang === "mr" ? `सर्व ${year} प्रश्नपत्रिका` : `All ${year} papers`}
          </a>
          {SEMI_YEARS.some((l) => l.scope.year === year) && (
            <a href={`${langBase(lang)}/ssc-semi-english-question-paper-${year}`} className={chip}>
              {lang === "mr" ? "सेमी इंग्रजी" : "Semi-English"} {year}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
