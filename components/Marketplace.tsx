import { marketMarkup, type MarketplaceCategory } from "@/lib/marketMarkup";
import { allowIndexing, homeSeo, pageSeo, safeJsonLd, siteUrl } from "@/lib/seo";
import MarketplaceScripts from "./MarketplaceScripts";

export default function Marketplace({ category }: { category?: MarketplaceCategory }) {
  return (
    <>
      {(!category || category === "dogal-tas") && <link rel="preload" as="image" href="/market/images/marble/white.webp" fetchPriority="high" />}
      <div dangerouslySetInnerHTML={{ __html: marketMarkup(category) }} />
      <script
        type="application/json"
        id="mb-page-seo"
        dangerouslySetInnerHTML={{ __html: safeJsonLd({ home: homeSeo, pages: pageSeo, siteUrl: siteUrl(), allowIndexing: allowIndexing() }) }}
      />
      <MarketplaceScripts />
    </>
  );
}
