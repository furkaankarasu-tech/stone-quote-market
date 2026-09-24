import type {Metadata} from "next";
import LegacyPage from "@/components/LegacyPage";
import {stones} from "@/lib/stoneData";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({params}:any):Promise<Metadata>{
 const {locale}=await params; const d="Türkiye doğal taşlarını tür, renk, şehir ve formata göre filtreleyin; aynı taşı sunan firmaları karşılaştırın ve teklif alın.";
 return {title:"Doğal Taş Dizini",description:d,alternates:{canonical:`/${locale}/dogal-tas`},
 openGraph:{title:"Doğal Taş Dizini | Marble Borsa",description:d,url:`https://marbleborsa.com/${locale}/dogal-tas`,type:"website"},
 twitter:{card:"summary_large_image",title:"Doğal Taş Dizini | Marble Borsa",description:d}};
}
export default async function Page({params}:any){
 const {locale}=await params;
 const jsonLd={"@context":"https://schema.org","@type":"ItemList",name:"Marble Borsa Doğal Taş Dizini",numberOfItems:stones.length,
 itemListElement:stones.map((s,i)=>({"@type":"ListItem",position:i+1,url:`https://marbleborsa.com/${locale}/dogal-tas/${s.slug}`,name:s.name}))};
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/><LegacyPage locale={locale} panel="stones"/></>;
}
