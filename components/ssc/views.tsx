// Page builders shared by the English routes (/ssc-board-papers/…) and the Marathi routes (/ssc-board-papers/mr/…).
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { profile } from "@/data/profile";
import SscLibrary from "./SscLibrary";
import { BrowseHub, Faq, JsonLd, PaperIndex, PaperMatrix, RelatedLinks, YearSubjects } from "./Seo";
import {
  ALL,
  SSC_SITE_NAME,
  landingBySlug,
  landingDescription,
  landingTitle,
  langAlternates,
  langPath,
  papersInScope,
} from "./data";
import type { Lang } from "./i18n";

const boardCount = ALL.filter((p) => p.kind === "pyq").length;

const MAIN = {
  en: {
    title: "SSC Previous Year Question Papers PDF – Maharashtra Board 2019–2026",
    description: `Official Maharashtra SSC (Class 10) board question papers 2019–2026, free PDF with no ads and no login: ${boardCount} real papers in English, Semi-English and Marathi medium, plus prelims and SCERT question banks. Algebra, Geometry, Science, History, Geography, languages. दहावी बोर्ड प्रश्नपत्रिका.`,
    crumb: "SSC Board Papers",
    keywords: [
      "Maharashtra SSC board question papers",
      "SSC previous year question papers PDF",
      "SSC PYQ Maharashtra",
      "10th board paper Maharashtra 2026",
      "SSC board paper 2025 PDF",
      "Marathi medium SSC question papers",
      "Semi English SSC question papers",
      "SSC prelim question papers",
      "SSC question bank PDF",
    ],
  },
  mr: {
    title: "दहावी बोर्ड प्रश्नपत्रिका PDF 2019–2026 – महाराष्ट्र एसएससी अधिकृत मागील वर्षांच्या प्रश्नपत्रिका",
    description: `महाराष्ट्र एसएससी (इयत्ता १०वी) च्या २०१९ ते २०२६ मधील ${boardCount} अधिकृत बोर्ड प्रश्नपत्रिका PDF: इंग्रजी, सेमी इंग्रजी व मराठी माध्यम, सोबत सराव परीक्षा व SCERT प्रश्नपेढी. बीजगणित, भूमिती, विज्ञान, इतिहास, भूगोल, मराठी, हिंदी, इंग्रजी. पूर्णपणे मोफत, जाहिराती नाहीत, लॉगिन नाही.`,
    crumb: "दहावी बोर्ड प्रश्नपत्रिका",
    keywords: [
      "दहावी बोर्ड प्रश्नपत्रिका",
      "दहावी प्रश्नपत्रिका PDF",
      "एसएससी मागील वर्षांच्या प्रश्नपत्रिका",
      "दहावी बोर्ड पेपर 2025",
      "मराठी माध्यम दहावी प्रश्नपत्रिका",
      "सेमी इंग्रजी दहावी प्रश्नपत्रिका",
      "दहावी सराव प्रश्नपत्रिका",
      "दहावी प्रश्नपेढी",
    ],
  },
};

const ogLocale = (lang: Lang) => (lang === "mr" ? { locale: "mr_IN", alternateLocale: ["en_IN"] } : { locale: "en_IN", alternateLocale: ["mr_IN"] });

export function mainMetadata(lang: Lang): Metadata {
  const m = MAIN[lang];
  const path = langPath(undefined, lang);
  return {
    title: m.title,
    description: m.description,
    applicationName: SSC_SITE_NAME,
    keywords: m.keywords,
    alternates: { canonical: path, languages: langAlternates() },
    openGraph: { type: "website", siteName: SSC_SITE_NAME, url: path, title: m.title, description: m.description, ...ogLocale(lang) },
    twitter: { card: "summary_large_image", title: m.title, description: m.description },
  };
}

// Same order as the page shows: newest board papers first, then prelims, question banks, model papers.
const ORDERED = [
  ...ALL.filter((p) => p.kind === "pyq").sort((a, b) => (b.year ?? 0) - (a.year ?? 0)),
  ...ALL.filter((p) => p.kind === "prelim"),
  ...ALL.filter((p) => p.kind === "qbank"),
  ...ALL.filter((p) => p.kind === "model"),
];

export function MainView({ lang }: { lang: Lang }) {
  const m = MAIN[lang];
  const path = langPath(undefined, lang);
  return (
    <main lang={lang} className="relative min-h-screen pt-3">
      <JsonLd path={path} name={m.title} description={m.description} papers={ORDERED} crumbs={[{ name: m.crumb, path }]} withFaq lang={lang} />
      <SscLibrary email={profile.contact.email} lang={lang} altHref={langPath(undefined, lang === "mr" ? "en" : "mr")} />
      <PaperMatrix lang={lang} />
      <BrowseHub lang={lang} />
      <Faq />
      <PaperIndex papers={ORDERED} />
    </main>
  );
}

export function landingMetadata(slug: string, lang: Lang): Metadata {
  const l = landingBySlug(slug);
  if (!l) return {};
  const path = langPath(l.slug, lang);
  const title = landingTitle(l, lang);
  const description = landingDescription(l, lang);
  return {
    title,
    description,
    applicationName: SSC_SITE_NAME,
    alternates: { canonical: path, languages: langAlternates(l.slug) },
    openGraph: { type: "website", siteName: SSC_SITE_NAME, url: path, title, description, ...ogLocale(lang) },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function LandingView({ slug, lang }: { slug: string; lang: Lang }) {
  const l = landingBySlug(slug);
  if (!l) notFound();
  const path = langPath(l.slug, lang);
  const papers = papersInScope(l.scope).sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  const mr = lang === "mr";
  return (
    <main lang={lang} className="relative min-h-screen pt-3">
      <JsonLd
        path={path}
        name={landingTitle(l, lang)}
        description={landingDescription(l, lang)}
        papers={papers}
        crumbs={[
          { name: MAIN[lang].crumb, path: langPath(undefined, lang) },
          { name: l.h1[lang], path },
        ]}
        lang={lang}
      />
      <SscLibrary
        email={profile.contact.email}
        lang={lang}
        altHref={langPath(l.slug, mr ? "en" : "mr")}
        scope={l.scope}
        heading={{ kicker: { en: "Maharashtra SSC · Class 10", mr: "महाराष्ट्र एसएससी · इयत्ता १०वी" }, h1: l.h1, intro: l.intro }}
      />
      {l.group === "subjectYear" && l.scope.subject && l.scope.year && <RelatedLinks subject={l.scope.subject} year={l.scope.year} lang={lang} />}
      {l.group === "subject" && l.scope.subject && <PaperMatrix subject={l.scope.subject} lang={lang} />}
      {l.group === "year" && l.scope.year && <YearSubjects year={l.scope.year} lang={lang} />}
      <BrowseHub current={l.slug} lang={lang} />
      <PaperIndex papers={papers} />
    </main>
  );
}
