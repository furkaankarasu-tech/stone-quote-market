import type {Metadata} from "next";
import LegacyPage from "@/components/LegacyPage";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({params}:any):Promise<Metadata>{
 const {locale}=await params;
 return {title:"Firma Rehberi",description:"Doğal taş ocakları, fabrikaları, ihracatçıları ve sektör firmalarını keşfedin.",alternates:{canonical:`/${locale}/firmalar`},
 openGraph:{title:"Firma Rehberi | Marble Borsa",description:"Doğal taş ocakları, fabrikaları, ihracatçıları ve sektör firmalarını keşfedin.",url:`https://marbleborsa.com/${locale}/firmalar`,type:"website"},
 twitter:{card:"summary_large_image",title:"Firma Rehberi | Marble Borsa",description:"Doğal taş ocakları, fabrikaları, ihracatçıları ve sektör firmalarını keşfedin."}};
}
export default async function Page({params}:any){const {locale}=await params;return <LegacyPage locale={locale} panel="firms"/>}
