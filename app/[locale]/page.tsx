import type {Metadata} from "next";
import LegacyPage from "@/components/LegacyPage";
export async function generateMetadata({params}:any):Promise<Metadata>{
 const {locale}=await params;
 return {title:"Doğal Taş B2B Teklif Platformu",description:"Türkiye doğal taş sektöründe taşları, firmaları, alım taleplerini, makine ve hizmet sağlayıcılarını buluşturan B2B teklif platformu.",alternates:{canonical:`/${locale}`},
 openGraph:{title:"Marble Borsa | Doğal Taş B2B Teklif Platformu",description:"Türkiye doğal taş sektörü için B2B keşif ve teklif platformu.",url:`https://marbleborsa.com/${locale}`,type:"website"},
 twitter:{card:"summary_large_image",title:"Marble Borsa | Doğal Taş B2B Teklif Platformu",description:"Türkiye doğal taş sektörü için B2B keşif ve teklif platformu."}};
}
export default async function Page({params}:any){const {locale}=await params;return <LegacyPage locale={locale} panel="stones"/>}
