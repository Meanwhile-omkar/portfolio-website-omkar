import type { Metadata } from "next";
import { LandingView, landingMetadata } from "@/components/ssc/views";
import { LANDINGS } from "@/components/ssc/data";

// Marathi version of every landing page, e.g. /ssc-board-papers/mr/ssc-board-paper-2025.
export const dynamicParams = false;
export function generateStaticParams() {
  return LANDINGS.map((l) => ({ slug: l.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return landingMetadata((await params).slug, "mr");
}

export default async function LandingPageMarathi({ params }: Props) {
  return <LandingView slug={(await params).slug} lang="mr" />;
}
