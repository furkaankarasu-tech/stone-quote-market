import { localizedMarkup, type MarketplaceCategory } from "@/lib/marketMarkup";
import { allowIndexing, homeSeo, pageSeo, safeJsonLd, siteUrl, absoluteUrl } from "@/lib/seo";
import { stones } from "@/lib/stoneData";
import { services } from "@/lib/serviceData";
import { equipmentCategories } from "@/lib/machineData";
import { publicCompanies, publicCatalog, publicAssetUrl } from "@/lib/publicDirectory";
import { marketPath, marketRouteSegments, type GuideLocale } from "@/lib/guideRoutes";
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

const homepageCategories = [
  { name: "Doğal Taş ve Mermer", path: "/tr/dogal-tas" },
  { name: "Üreticiler ve Tedarikçiler", path: "/tr/firmalar" },
  { name: "Mermer Makineleri ve Sarf Malzemeleri", path: "/tr/makine-sarf" },
  { name: "Doğal Taş Sektörel Hizmetleri", path: "/tr/hizmetler" },
];

function buildHomeSchema() {
  const url = absoluteUrl("/");
  if (!url) return null;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Marble Borsa - B2B Mermer Teklifi ve Doğal Taş Tedariki",
    description: homeSeo.description,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: homepageCategories.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}

export default async function Marketplace({ category, profile = false, locale = "tr" }: { category?: MarketplaceCategory; profile?: boolean; locale?: GuideLocale }) {
  const results = profile || category === "alim-talepleri" ? null : await Promise.allSettled([publicCompanies(), publicCatalog()]);
  const directory = {
    status: results?.[0].status === "fulfilled" ? "ready" : results ? "error" : "idle",
    companies: results?.[0].status === "fulfilled" ? results[0].value.map(row => ({id: row.company_id, name: row.name, city: row.city, activity_type: row.activity_type, section: row.section, logo_url: publicAssetUrl("mb-company-logos", row.logo_path)})) : [],
    catalogStatus: results?.[1].status === "fulfilled" ? "ready" : results ? "error" : "idle",
    items: results?.[1].status === "fulfilled" ? results[1].value.map(row => ({...row, image_urls: row.image_paths.map(path => publicAssetUrl("mb-catalog-assets", path)).filter(Boolean), pdf_url: publicAssetUrl("mb-catalog-assets", row.pdf_path)})).filter(row => row.image_urls.length >= 3) : []
  };
  const homeSchema = !profile && !category ? buildHomeSchema() : null;
  const collectionSchema = !profile && category ? buildCollectionSchema(category) : null;
  return (
    <>
      {!profile && (!category || category === "dogal-tas") && <link rel="preload" as="image" href="/market/images/marble/white.webp" fetchPriority="high" />}
      <div dangerouslySetInnerHTML={{ __html: localizedMarkup(category, profile, directory, locale) }} />
      <script
        type="application/json"
        id="mb-page-seo"
        dangerouslySetInnerHTML={{ __html: safeJsonLd({ home: homeSeo, homePath: marketPath(locale), routes: marketRouteSegments, pages: pageSeo, siteUrl: siteUrl(), allowIndexing: allowIndexing() }) }}
      />
      {category && category in pageSeo && siteUrl() && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
          "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana sayfa", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: pageSeo[category as keyof typeof pageSeo].title, item: absoluteUrl(`/tr/${category}`) }
          ]
        }) }} />
      )}
      {collectionSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionSchema) }} />
      )}
      {homeSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(homeSchema) }} />
      )}
      <MarketplaceScripts />
    </>
  );
}
