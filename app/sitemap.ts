import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { pageSeo } from "@/lib/seo";
import { stones } from "@/lib/stoneData";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!absoluteUrl("/")) return [];
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...Object.keys(pageSeo).map((segment) => ({
      url: absoluteUrl(`/tr/${segment}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...stones.map((stone) => ({
      url: absoluteUrl(`/tr/dogal-tas/${stone.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
