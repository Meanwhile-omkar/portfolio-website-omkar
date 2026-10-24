import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// One public page. /lab is a dev specimen page with noindex, so it is left out.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
