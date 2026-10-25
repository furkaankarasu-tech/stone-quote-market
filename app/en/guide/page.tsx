import type {Metadata} from 'next';
import {GuideIndex} from '@/components/GuideShell';
import {allGuideAlternates} from '@/lib/guideRoutes';
import {buildMetadata} from '@/lib/seo';
export const metadata:Metadata=buildMetadata({
  title:'Marble Buyer Guides: Types, Prices and Purchasing',
  description:'Independent buying guides covering marble prices, stone varieties, blocks, slabs, specifications and natural stone from Türkiye.',
  path:'/en/guide',locale:'en_US',languages:allGuideAlternates()
});
export default function EnglishGuideIndex(){return <GuideIndex locale="en"/>;}
