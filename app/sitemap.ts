import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { BASE_PATH, LANDINGS } from "@/components/ssc/data";

// Public pages. /lab is a dev specimen page with noindex, so it is left out.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}${BASE_PATH}`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...LANDINGS.map((l) => ({
      url: `${SITE_URL}${BASE_PATH}/${l.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: l.scope.year ? 0.8 : 0.7,
    })),
  ];
}
