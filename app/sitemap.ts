import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { LANDINGS, langPath, type Landing } from "@/components/ssc/data";

// Public pages. /lab is a dev specimen page with noindex, so it is left out.
// Every SSC page is listed in English and Marathi, each pointing at the other (hreflang).
const ssc = (slug: string | undefined, priority: number, changeFrequency: "weekly" | "monthly") => {
  const languages = {
    "en-IN": SITE_URL + langPath(slug, "en"),
    "mr-IN": SITE_URL + langPath(slug, "mr"),
    "x-default": SITE_URL + langPath(slug, "en"),
  };
  return (["en", "mr"] as const).map((lang) => ({
    url: SITE_URL + langPath(slug, lang),
    lastModified: new Date(),
    changeFrequency,
    priority: lang === "en" ? priority : Math.max(0.5, priority - 0.1),
    alternates: { languages },
  }));
};
const priorityOf = (l: Landing) =>
  l.group === "year" ? 0.8 : l.group === "subjectYear" || l.group === "subject" || l.group === "mediumYear" ? 0.7 : 0.6;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...ssc(undefined, 0.9, "weekly"),
    ...LANDINGS.flatMap((l) => ssc(l.slug, priorityOf(l), "monthly")),
  ];
}
