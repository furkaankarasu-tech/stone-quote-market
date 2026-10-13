export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Marketplace from "@/components/Marketplace";
import { marketAlternates, marketPath, guideLocales, type GuideLocale } from "@/lib/guideRoutes";
import { buildMetadata, homeSeo, internationalHomeSeo } from "@/lib/seo";

export function generateStaticParams() {
  return guideLocales.map(locale=>({locale}));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!guideLocales.includes(locale as GuideLocale)) return {};
  // /tr renders the same home page as /, so both use one canonical URL.
  const copy=locale==='tr'?homeSeo:internationalHomeSeo[locale as keyof typeof internationalHomeSeo];
  return buildMetadata({...copy,locale:locale==='en'?'en_US':locale==='zh'?'zh_CN':locale==='ar'?'ar_AR':'tr_TR',path:marketPath(locale as GuideLocale),languages:marketAlternates() });
}

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!guideLocales.includes(locale as GuideLocale)) notFound();
  return <Marketplace locale={locale as GuideLocale} />;
}
