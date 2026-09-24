import type {Metadata} from "next";
import LegacyPage from "@/components/LegacyPage";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({params}:any):Promise<Metadata>{
 const {locale}=await params;
 const d="Doğal taş sektöründe lojistik, gümrük, ekspertiz, kalite kontrol, paketleme, sigorta ve diğer hizmet sağlayıcılarını keşfedin.";
 return {title:"Hizmetler",description:d,alternates:{canonical:`/${locale}/hizmetler`},
 openGraph:{title:"Hizmetler | Marble Borsa",description:d,url:`https://marbleborsa.com/${locale}/hizmetler`,type:"website"},
 twitter:{card:"summary_large_image",title:"Hizmetler | Marble Borsa",description:d}};
}
export default async function Page({params}:any){
 const {locale}=await params;
 return <LegacyPage locale={locale} panel="services"/>;
}
