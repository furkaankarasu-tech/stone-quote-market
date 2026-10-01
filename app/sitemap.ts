import type { MetadataRoute } from 'next';
import { absoluteUrl, pageSeo } from '@/lib/seo';
import { stones } from '@/lib/stoneData';
import { getGuides, allGuideAlternates, guidePath, guideLocales } from '@/lib/translatedGuides';
const absoluteAlternates=(slug?:string)=>Object.fromEntries(
  Object.entries(allGuideAlternates(slug)).map(([locale,path])=>[locale,absoluteUrl(path)])
);
export default function sitemap():MetadataRoute.Sitemap {
  if(!absoluteUrl('/')) return [];
  return [
    {url:absoluteUrl('/'),changeFrequency:'weekly',priority:1},
    ...Object.keys(pageSeo).map(segment=>({url:absoluteUrl(`/tr/${segment}`),changeFrequency:'weekly' as const,priority:.8})),
    ...guideLocales.flatMap(locale=>[
      {url:absoluteUrl(guidePath(locale)),alternates:{languages:absoluteAlternates()},changeFrequency:'monthly' as const,priority:.8},
      ...getGuides(locale).map(guide=>({url:absoluteUrl(guidePath(locale,guide.slug)),
        alternates:{languages:absoluteAlternates(guide.slug)},changeFrequency:'monthly' as const,priority:.7}))
    ]),
    ...stones.map(stone=>({url:absoluteUrl(`/tr/dogal-tas/${stone.slug}`),changeFrequency:'monthly' as const,priority:.7}))
  ];
}
