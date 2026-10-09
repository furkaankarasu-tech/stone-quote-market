export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Marketplace from "@/components/Marketplace";
import { marketAlternates, marketPath, guideLocales, type GuideLocale } from "@/lib/guideRoutes";
import { buildMetadata, homeSeo } from "@/lib/seo";

export function generateStaticParams() {
  return guideLocales.map(locale=>({locale}));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!guideLocales.includes(locale as GuideLocale)) return {};
  // /tr renders the same home page as /, so both use one canonical URL.
  return buildMetadata({ ...homeSeo, title:locale==='tr'?homeSeo.title:({en:"Marble Borsa | B2B Natural Stone Marketplace",zh:"Marble Borsa | 天然石材B2B平台",ar:"Marble Borsa | منصة الحجر الطبيعي للأعمال"} as Record<string,string>)[locale],description:locale==='tr'?homeSeo.description:({en:"Connect with natural stone producers, machinery suppliers and industry service companies. Browse catalogues and request direct B2B quotes.",zh:"联系天然石材生产商、机械供应商和行业服务企业。浏览目录并直接获取企业报价。",ar:"تواصل مع منتجي الحجر الطبيعي وموردي المعدات وشركات خدمات القطاع. تصفح الكتالوجات واطلب عروض أسعار مباشرة."} as Record<string,string>)[locale],locale:locale==='en'?'en_US':locale==='zh'?'zh_CN':locale==='ar'?'ar_AR':'tr_TR',path:marketPath(locale as GuideLocale),languages:marketAlternates() });
}

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!guideLocales.includes(locale as GuideLocale)) notFound();
  return <Marketplace locale={locale as GuideLocale} />;
}
