import type {Metadata} from "next";
import LegacyPage from "@/components/LegacyPage";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({params}:any):Promise<Metadata>{
 const {locale}=await params;
 const d="Doğal taş ocak ve fabrikaları için makine, ekipman, sarf malzemesi, yedek parça ve servis çözümleri.";
 return {title:"Makine & Sarf",description:d,alternates:{canonical:`/${locale}/makine-sarf`},
 openGraph:{title:"Makine & Sarf | Marble Borsa",description:d,url:`https://marbleborsa.com/${locale}/makine-sarf`,type:"website"}};
}
export default async function Page({params}:any){
 const {locale}=await params;
 return <LegacyPage locale={locale} panel="supplies"/>;
}
