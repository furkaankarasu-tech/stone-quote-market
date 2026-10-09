import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuideArticlePage } from '@/components/GuideShell';
import { allGuideAlternates, getGuides } from '@/lib/translatedGuides';
import { absoluteUrl, buildMetadata, safeJsonLd } from '@/lib/seo';

type Params={locale:string;slug:string};
export function generateStaticParams():Params[] {return getGuides('tr').map(g=>({locale:'tr',slug:g.slug}));}
export async function generateMetadata({params}:{params:Promise<Params>}):Promise<Metadata> {
  const {locale,slug}=await params; const guide=getGuides('tr').find(g=>g.slug===slug);
  if(locale!=='tr'||!guide) return {};
  return buildMetadata({title:guide.title,description:guide.description,path:`/tr/rehber/${slug}`,
    languages:allGuideAlternates(slug)});
}
export default async function ArticlePage({params}:{params:Promise<Params>}) {
  const {locale,slug}=await params; const guide=getGuides('tr').find(g=>g.slug===slug);
  if(locale!=='tr'||!guide) notFound();
  const path=`/tr/rehber/${slug}`;
  return <>{absoluteUrl('/')&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd([
    {'@context':'https://schema.org','@type':'Article',headline:guide.title,description:guide.description,
      mainEntityOfPage:absoluteUrl(path),inLanguage:'tr-TR',author:{'@type':'Organization',name:'Marble Borsa'},
      publisher:{'@type':'Organization',name:'Marble Borsa',url:absoluteUrl('/')}},
    {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
      {'@type':'ListItem',position:1,name:'Ana sayfa',item:absoluteUrl('/')},
      {'@type':'ListItem',position:2,name:'Mermer Rehberi',item:absoluteUrl('/tr/rehber')},
      {'@type':'ListItem',position:3,name:guide.title,item:absoluteUrl(path)}]}
  ])}}/>}<GuideArticlePage locale="tr" article={guide}/></>;
}
