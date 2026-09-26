import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Marketplace from "@/components/Marketplace";
import { absoluteUrl, buildMetadata, pageSeo, safeJsonLd } from "@/lib/seo";
import { stones } from "@/lib/stoneData";

type Route = { locale: string; category: string };
const locales = ["tr"];
export function generateStaticParams(): Route[] {
  return locales.flatMap((locale) => Object.keys(pageSeo).map((category) => ({ locale, category })));
}

export async function generateMetadata({ params }: { params: Promise<Route> }): Promise<Metadata> {
  const { locale, category } = await params;
  const seo = pageSeo[category as keyof typeof pageSeo];
  if (!locales.includes(locale) || !seo) return {};
  return buildMetadata({ ...seo, path: `/${locale}/${category}` });
}

export default async function CategoryPage({ params }: { params: Promise<Route> }) {
  const { locale, category } = await params;
  if (!locales.includes(locale) || !(category in pageSeo)) notFound();
  const path = `/${locale}/${category}`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: pageSeo[category as keyof typeof pageSeo].title, item: absoluteUrl(path) },
    ],
  };
  const stoneList = category === "dogal-tas" ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Doğal Taş Dizini",
    url: absoluteUrl(path),
    numberOfItems: stones.length,
    itemListElement: stones.map((stone, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: stone.name,
      url: absoluteUrl(`${path}/${stone.slug}`),
    })),
  } : null;
  return <>
    {absoluteUrl("/") && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumb) }} />}
    {stoneList && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(stoneList) }} />}
    <Marketplace category={category as keyof typeof pageSeo} />
  </>;
}
