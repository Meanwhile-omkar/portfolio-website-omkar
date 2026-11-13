// Server-rendered SEO pieces for the SSC papers pages: JSON-LD, the "browse by" link hub and the FAQ.
import { SITE_URL } from "@/lib/site";
import { profile } from "@/data/profile";
import { BASE_PATH, LANDINGS, SSC_SITE_NAME, fileAbs, fileHref, paperName, type Paper } from "./data";

export const FAQ: { q: string; a: string; qm: string; am: string }[] = [
  {
    q: "Are these the real Maharashtra SSC board papers?",
    a: "Yes. Every board paper here is a scan of the actual MSBSHSE exam paper. Each one shows the board's paper code (like N 919) and the exam date, and both were checked by hand against the file name.",
    qm: "या खऱ्या बोर्ड प्रश्नपत्रिका आहेत का?",
    am: "हो. येथील प्रत्येक बोर्ड प्रश्नपत्रिका MSBSHSE च्या खऱ्या परीक्षेतील आहे. प्रत्येकीवर बोर्डाचा पेपर कोड (उदा. N 919) आणि परीक्षेची तारीख आहे, आणि ते हाताने तपासले आहेत.",
  },
  {
    q: "Which years of SSC board papers are available?",
    a: "March board papers from 2019 to 2026, plus the supplementary (June-July and August) exams where they exist. There are no 2021 papers because the 2021 SSC exam was cancelled due to COVID, and the March 2020 Geography paper was also cancelled.",
    qm: "कोणत्या वर्षांच्या प्रश्नपत्रिका उपलब्ध आहेत?",
    am: "२०१९ ते २०२६ च्या मार्च बोर्ड परीक्षा, आणि जिथे उपलब्ध आहेत तिथे पुरवणी परीक्षा. २०२१ ची परीक्षा कोविडमुळे रद्द झाली, आणि मार्च २०२० चा भूगोलाचा पेपरही रद्द झाला होता.",
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
}: {
  path: string;
  name: string;
  description: string;
  papers: Paper[];
  crumbs: { name: string; path: string }[];
  withFaq?: boolean;
}) {
  const url = SITE_URL + path;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "CollectionPage",
      "@id": `${url}#page`,
      url,
      name,
      description,
      inLanguage: ["en-IN", "mr-IN"],
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
export function BrowseHub({ current }: { current?: string }) {
  const groups: [string, string, typeof LANDINGS][] = [
    ["By year", "वर्षानुसार", LANDINGS.filter((l) => l.scope.year)],
    ["By subject", "विषयानुसार", LANDINGS.filter((l) => l.scope.subject)],
    ["By medium & type", "माध्यम व प्रकारानुसार", LANDINGS.filter((l) => !l.scope.year && !l.scope.subject)],
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
                  <a href={BASE_PATH} className="text-[15px] text-blue underline-offset-4 hover:underline">
                    All SSC papers (2019–2026)
                  </a>
                </li>
              )}
              {ls.map((l) => (
                <li key={l.slug}>
                  <a
                    href={`${BASE_PATH}/${l.slug}`}
                    aria-current={current === l.slug ? "page" : undefined}
                    className={`text-[15px] underline-offset-4 hover:underline ${current === l.slug ? "font-semibold text-ink" : "text-blue"}`}
                  >
                    {l.title.split(" PDF")[0].replace("Maharashtra ", "")}
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
// even though the interactive library shows them inside folders.
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
