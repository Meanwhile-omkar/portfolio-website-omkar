import type { Metadata } from "next";
import { LandingView, landingMetadata } from "@/components/ssc/views";
import { LANDINGS } from "@/components/ssc/data";

// One static page per year, subject, medium and paper type (e.g. /ssc-board-papers/ssc-board-paper-2025).
// Marathi versions live under /ssc-board-papers/mr/….
export const dynamicParams = false;
export function generateStaticParams() {
  return LANDINGS.map((l) => ({ slug: l.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return landingMetadata((await params).slug, "en");
}

export default async function LandingPage({ params }: Props) {
  return <LandingView slug={(await params).slug} lang="en" />;
}
