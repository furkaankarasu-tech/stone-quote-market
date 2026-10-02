import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuideIndex } from '@/components/GuideShell';
import { allGuideAlternates, getGuides, guidePath, type GuideLocale } from '@/lib/translatedGuides';
import { absoluteUrl, buildMetadata, safeJsonLd } from '@/lib/seo';
const supported=['zh','ar'];
const title:Record<'en'|'zh'|'ar',string>={en:'Marble Buyer Guides: Types, Prices and Purchasing',zh:'大理石采购指南：种类、价格与选材',ar:'دليل شراء الرخام: الأنواع والأسعار والاختيار'};
const description:Record<'en'|'zh'|'ar',string>={
  en:'Independent buying guides covering marble prices, stone varieties, blocks, slabs, specifications and natural stone from Türkiye.',
  zh:'了解大理石价格、种类、荒料、板材、技术要求和土耳其天然石材的独立采购指南。',
  ar:'أدلة مستقلة عن أسعار الرخام وأنواعه والكتل والألواح والمواصفات الفنية والحجر الطبيعي التركي.'
};
export function generateStaticParams() {return supported.map(locale=>({locale}));}
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata> {
  const {locale}=await params;
  if(!supported.includes(locale)) return {};
  const lang=locale as 'en'|'zh'|'ar';
  return buildMetadata({title:title[lang],description:description[lang],path:guidePath(lang),
    locale:lang==='en'?'en_US':lang==='zh'?'zh_CN':'ar_AR',languages:allGuideAlternates()});
}
export default async function LocalizedGuides({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params; if(!supported.includes(locale)) notFound();
  const lang=locale as Exclude<GuideLocale,'tr'>;
  return <>{absoluteUrl('/')&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd({
    '@context':'https://schema.org','@type':'CollectionPage',name:title[lang],
    inLanguage:lang==='zh'?'zh-CN':lang,url:absoluteUrl(guidePath(lang)),
    hasPart:getGuides(lang).map(g=>({'@type':'WebPage',name:g.title,url:absoluteUrl(guidePath(lang,g.slug))}))
  })}}/>}<GuideIndex locale={lang}/></>;
}
