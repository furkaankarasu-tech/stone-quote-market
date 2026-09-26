import type { MetadataRoute } from "next";
import { absoluteUrl, allowIndexing } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing()) return { rules: { userAgent: "*", disallow: "/" } };
  const sitemap = absoluteUrl("/sitemap.xml");
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(sitemap ? { sitemap } : {}),
  };
}
