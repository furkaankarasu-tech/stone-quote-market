import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuideArticlePage } from '@/components/GuideShell';
import { allGuideAlternates, getGuides, guidePath, type GuideLocale } from '@/lib/translatedGuides';
import { absoluteUrl, buildMetadata, safeJsonLd } from '@/lib/seo';
type Params={locale:string;slug:string};
const supported=['en','zh','ar'];
export function generateStaticParams():Params[] {return supported.flatMap(locale=>getGuides(locale as Exclude<GuideLocale,'tr'>).map(g=>({locale,slug:g.slug})));}
export async function generateMetadata({params}:{params:Promise<Params>}):Promise<Metadata> {
  const {locale,slug}=await params;
  if(!supported.includes(locale)) return {};
  const lang=locale as Exclude<GuideLocale,'tr'>;
  const guide=getGuides(lang).find(g=>g.slug===slug);
  if(!guide) return {};
  return buildMetadata({title:guide.title,description:guide.description,path:guidePath(lang,slug),
    locale:lang==='en'?'en_US':lang==='zh'?'zh_CN':'ar_AR',languages:allGuideAlternates(slug)});
}
export default async function TranslatedArticle({params}:{params:Promise<Params>}) {
  const {locale,slug}=await params;
  if(!supported.includes(locale)) notFound();
  const lang=locale as Exclude<GuideLocale,'tr'>;
  const guide=getGuides(lang).find(g=>g.slug===slug);
  if(!guide) notFound();
  const path=guidePath(lang,slug);
  return <>{absoluteUrl('/')&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd({
    '@context':'https://schema.org','@type':'Article',headline:guide.title,description:guide.description,
    inLanguage:lang==='zh'?'zh-CN':lang,mainEntityOfPage:absoluteUrl(path),
    author:{'@type':'Organization',name:'Marble Borsa'},publisher:{'@type':'Organization',name:'Marble Borsa',url:absoluteUrl('/')}
  })}}/>}<GuideArticlePage locale={lang} article={guide}/></>;
}
