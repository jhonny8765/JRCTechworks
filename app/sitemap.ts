import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, priority: 1 },
    {
      url: `${siteUrl}/work/sukisuite`,
      priority: 0.8,
      images: [`${siteUrl}/projects/sukisuite.png`],
    },
    {
      url: `${siteUrl}/work/better-yield`,
      priority: 0.8,
      images: [`${siteUrl}/projects/better-yield.png`],
    },
  ];
}
