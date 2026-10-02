import { marketMarkup, type MarketplaceCategory } from "@/lib/marketMarkup";
import { allowIndexing, homeSeo, pageSeo, safeJsonLd, siteUrl, absoluteUrl } from "@/lib/seo";
import MarketplaceScripts from "./MarketplaceScripts";

export default function Marketplace({ category, profile = false }: { category?: MarketplaceCategory; profile?: boolean }) {
  return (
    <>
      {!profile && (!category || category === "dogal-tas") && <link rel="preload" as="image" href="/market/images/marble/white.webp" fetchPriority="high" />}
      <div dangerouslySetInnerHTML={{ __html: marketMarkup(category, profile) }} />
      <script
        type="application/json"
        id="mb-page-seo"
        dangerouslySetInnerHTML={{ __html: safeJsonLd({ home: homeSeo, pages: pageSeo, siteUrl: siteUrl(), allowIndexing: allowIndexing() }) }}
      />
      {category && category in pageSeo && siteUrl() && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
          "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana sayfa", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: pageSeo[category as keyof typeof pageSeo].title, item: absoluteUrl(`/tr/${category}`) }
          ]
        }) }} />
      )}
      <MarketplaceScripts />
    </>
  );
}
