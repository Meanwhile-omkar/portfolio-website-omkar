import type { Metadata } from "next";
import SscLibrary from "@/components/ssc/SscLibrary";
import { BrowseHub, Faq, JsonLd } from "@/components/ssc/Seo";
import { ALL, BASE_PATH, SSC_SITE_NAME } from "@/components/ssc/data";
import { profile } from "@/data/profile";

const boardCount = ALL.filter((p) => p.kind === "pyq").length;
const TITLE = "Maharashtra SSC Board Question Papers 2019–2026 PDF (PYQ) – English & Marathi Medium";
const DESCRIPTION = `Free Maharashtra SSC (Class 10) previous year board question papers 2019–2026: ${boardCount} real papers in English and Marathi medium, plus prelim papers and SCERT question banks. Algebra, Geometry, Science 1 & 2, History, Geography, Marathi, Hindi, English. दहावी बोर्ड प्रश्नपत्रिका PDF.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  applicationName: SSC_SITE_NAME,
  alternates: { canonical: BASE_PATH },
  keywords: [
    "Maharashtra SSC board question papers",
    "SSC previous year question papers PDF",
    "SSC PYQ Maharashtra",
    "10th board paper Maharashtra 2026",
    "SSC board paper 2025 PDF",
    "Marathi medium SSC question papers",
    "SSC prelim question papers",
    "SSC question bank PDF",
    "दहावी बोर्ड प्रश्नपत्रिका",
    "दहावी प्रश्नपत्रिका PDF",
  ],
  openGraph: { type: "website", siteName: SSC_SITE_NAME, url: BASE_PATH, title: TITLE, description: DESCRIPTION, locale: "en_IN", alternateLocale: ["mr_IN"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};


// Same order as the page shows: newest board papers first, then prelims, question banks, model papers.
const ORDERED = [
  ...ALL.filter((p) => p.kind === "pyq").sort((a, b) => (b.year ?? 0) - (a.year ?? 0)),
  ...ALL.filter((p) => p.kind === "prelim"),
  ...ALL.filter((p) => p.kind === "qbank"),
  ...ALL.filter((p) => p.kind === "model"),
];

export default function SscBoardPapersPage() {
  return (
    <main className="relative min-h-screen pt-3">
      <JsonLd
        path={BASE_PATH}
        name={TITLE}
        description={DESCRIPTION}
        papers={ORDERED}
        crumbs={[
          { name: "SSC Board Papers", path: BASE_PATH },
        ]}
        withFaq
      />
      <SscLibrary email={profile.contact.email} />
      <BrowseHub />
      <Faq />
    </main>
  );
}
