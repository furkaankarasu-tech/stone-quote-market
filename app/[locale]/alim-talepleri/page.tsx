import type {Metadata} from "next";
import LegacyPage from "@/components/LegacyPage";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({params}:any):Promise<Metadata>{
 const {locale}=await params;
 return {title:"Alım Talepleri",description:"Doğal taş sektöründeki B2B alım taleplerini görüntüleyin ve uygun taleplere teklif verin.",alternates:{canonical:`/${locale}/alim-talepleri`},
 openGraph:{title:"Alım Talepleri | Marble Borsa",description:"Doğal taş sektöründeki B2B alım taleplerini görüntüleyin ve uygun taleplere teklif verin.",url:`https://marbleborsa.com/${locale}/alim-talepleri`,type:"website"},
 twitter:{card:"summary_large_image",title:"Alım Talepleri | Marble Borsa",description:"Doğal taş sektöründeki B2B alım taleplerini görüntüleyin ve uygun taleplere teklif verin."}};
}
export default async function Page({params}:any){const {locale}=await params;return <LegacyPage locale={locale} panel="requests"/>}
