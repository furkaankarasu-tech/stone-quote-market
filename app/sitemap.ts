import type { MetadataRoute } from 'next';
import { absoluteUrl, pageSeo } from '@/lib/seo';
import { stones } from '@/lib/stoneData';
import { getGuides, allGuideAlternates, guidePath, guideLocales } from '@/lib/translatedGuides';
import { sourcingLocales, sourcingTopics, sourcingPath, sourcingAlternates } from '@/lib/sourcingContent';
import { marketAlternates, marketPath, guideLocales as marketLocales, type MarketTab } from '@/lib/guideRoutes';
import { publicCompanies, uuidPattern } from '@/lib/publicDirectory';
const absoluteAlternates=(slug?:string)=>Object.fromEntries(
  Object.entries(allGuideAlternates(slug)).map(([locale,path])=>[locale,absoluteUrl(path)])
);
export default async function sitemap():Promise<MetadataRoute.Sitemap> {
  if(!absoluteUrl('/')) return [];
  let companies:Awaited<ReturnType<typeof publicCompanies>>=[];
  try{companies=await publicCompanies()}catch{/* Preserve the static sitemap during a data outage. */}
  return [
    {url:absoluteUrl('/'),changeFrequency:'weekly',priority:1},
    ...marketLocales.flatMap(locale=>['firmalar-icin','hakkimizda','iletisim'].map(segment=>({url:absoluteUrl(`/${locale}/${segment}`),changeFrequency:'monthly' as const,priority:.6}))),
    ...marketLocales.flatMap(locale=>[...(locale==='tr'?[]:[{url:absoluteUrl(marketPath(locale)),alternates:{languages:Object.fromEntries(Object.entries(marketAlternates()).map(([lang,path])=>[lang,absoluteUrl(path)]))},changeFrequency:'weekly' as const,priority:.8}]),...(['stones','companies','machines','services'] as MarketTab[]).map(tab=>({url:absoluteUrl(marketPath(locale,tab)),alternates:{languages:Object.fromEntries(Object.entries(marketAlternates(tab)).map(([lang,path])=>[lang,absoluteUrl(path)]))},changeFrequency:'weekly' as const,priority:.8}))]),
    ...guideLocales.flatMap(locale=>[
      {url:absoluteUrl(guidePath(locale)),alternates:{languages:absoluteAlternates()},changeFrequency:'monthly' as const,priority:.8},
      ...getGuides(locale).map(guide=>({url:absoluteUrl(guidePath(locale,guide.slug)),
        alternates:{languages:absoluteAlternates(guide.slug)},changeFrequency:'monthly' as const,priority:.7}))
    ]),
    ...sourcingLocales.flatMap(locale=>sourcingTopics.map(topic=>({url:absoluteUrl(sourcingPath(topic,locale)),
      alternates:{languages:Object.fromEntries(Object.entries(sourcingAlternates(topic)).map(([lang,path])=>[lang,absoluteUrl(path)]))},changeFrequency:'monthly' as const,priority:.85}))),
    ...marketLocales.flatMap(locale=>stones.map(stone=>({url:absoluteUrl(`/${locale}/dogal-tas/${stone.slug}`),alternates:{languages:Object.fromEntries(marketLocales.map(lang=>[lang,absoluteUrl(`/${lang}/dogal-tas/${stone.slug}`)]))},changeFrequency:'monthly' as const,priority:.7}))),
    ...marketLocales.flatMap(locale=>Array.from(new Set(companies.map(row=>row.company_id).filter(id=>uuidPattern.test(id)))).map(id=>({url:absoluteUrl(`/${locale}/firmalar/${id}`),alternates:{languages:Object.fromEntries(marketLocales.map(lang=>[lang,absoluteUrl(`/${lang}/firmalar/${id}`)]))},changeFrequency:'weekly' as const,priority:.6})))
  ];
}
