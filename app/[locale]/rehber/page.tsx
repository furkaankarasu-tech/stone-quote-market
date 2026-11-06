import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuideIndex } from '@/components/GuideShell';
import { absoluteUrl, buildMetadata, safeJsonLd } from '@/lib/seo';
import { allGuideAlternates, getGuides } from '@/lib/translatedGuides';

export function generateStaticParams() {return [{locale:'tr'}];}
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata> {
  if((await params).locale!=='tr') return {};
  return buildMetadata({title:'Mermer Nasıl Alınır? Fiyat, Çeşit ve Satın Alma Rehberi',
    description:'Mermer satın alma, fiyat karşılaştırması, taş çeşitleri, blok ve plaka seçiminde dikkat edilecekleri öğrenin.',
    path:'/tr/rehber',languages:allGuideAlternates()});
}
export default async function GuideHome({params}:{params:Promise<{locale:string}>}) {
  if((await params).locale!=='tr') notFound();
  return <>{absoluteUrl('/')&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd({
    '@context':'https://schema.org','@type':'CollectionPage',name:'Marble Borsa Mermer Rehberi',
    inLanguage:'tr-TR',url:absoluteUrl('/tr/rehber'),hasPart:getGuides('tr').map(g=>({
      '@type':'WebPage',name:g.title,url:absoluteUrl(`/tr/rehber/${g.slug}`)
    }))
  })}}/>}<GuideIndex locale="tr"/></>;
}
