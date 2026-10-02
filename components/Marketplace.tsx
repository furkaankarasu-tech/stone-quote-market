import { marketMarkup, type MarketplaceCategory } from "@/lib/marketMarkup";
import { allowIndexing, homeSeo, pageSeo, safeJsonLd, siteUrl, absoluteUrl } from "@/lib/seo";
import { stones } from "@/lib/stoneData";
import { services } from "@/lib/serviceData";
import { equipmentCategories } from "@/lib/machineData";
import MarketplaceScripts from "./MarketplaceScripts";



function buildCollectionSchema(category?: MarketplaceCategory) {
  if (!category || !(category in pageSeo) || category === "firmalar") return null;
  const url = absoluteUrl(`/tr/${category}`);
  if (!url) return null;

  const items = category === "dogal-tas"
    ? stones.map((stone, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: stone.name,
        url: absoluteUrl(`/tr/dogal-tas/${stone.slug}`),
        description: `${stone.type} · ${stone.city}`
      }))
    : category === "hizmetler"
      ? services.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: service.title,
          description: service.subtitle
        }))
      : equipmentCategories.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          description: item.detail
        }));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageSeo[category as keyof typeof pageSeo].title,
    description: pageSeo[category as keyof typeof pageSeo].description,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items
    }
  };
}

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
      {buildCollectionSchema(category) && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(buildCollectionSchema(category)) }}
        />
      )}
      <MarketplaceScripts />
    </>
  );
}
