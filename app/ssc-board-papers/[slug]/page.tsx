import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SscLibrary from "@/components/ssc/SscLibrary";
import { BrowseHub, JsonLd } from "@/components/ssc/Seo";
import { BASE_PATH, LANDINGS, SSC_SITE_NAME, landingBySlug, papersInScope } from "@/components/ssc/data";
import { profile } from "@/data/profile";

// One static page per year, subject, medium and paper type (e.g. /ssc-board-papers/ssc-board-paper-2025).
export const dynamicParams = false;
export function generateStaticParams() {
  return LANDINGS.map((l) => ({ slug: l.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = landingBySlug((await params).slug);
  if (!l) return {};
  const path = `${BASE_PATH}/${l.slug}`;
  return {
    title: l.title,
    description: l.description,
    applicationName: SSC_SITE_NAME,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SSC_SITE_NAME, url: path, title: l.title, description: l.description, locale: "en_IN", alternateLocale: ["mr_IN"] },
    twitter: { card: "summary_large_image", title: l.title, description: l.description },
  };
}


export default async function LandingPage({ params }: Props) {
  const { slug } = await params;
  const l = landingBySlug(slug);
  if (!l) notFound();
  const path = `${BASE_PATH}/${l.slug}`;
  const papers = papersInScope(l.scope).sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  return (
    <main className="relative min-h-screen pt-3">
      <JsonLd
        path={path}
        name={l.title}
        description={l.description}
        papers={papers}
        crumbs={[
          { name: "SSC Board Papers", path: BASE_PATH },
          { name: l.h1.en, path },
        ]}
      />
      <SscLibrary
        email={profile.contact.email}
        scope={l.scope}
        heading={{ kicker: { en: "Maharashtra SSC · Class 10", mr: "महाराष्ट्र एसएससी · इयत्ता १०वी" }, h1: l.h1, intro: l.intro }}
      />
      <BrowseHub current={l.slug} />
    </main>
  );
}
