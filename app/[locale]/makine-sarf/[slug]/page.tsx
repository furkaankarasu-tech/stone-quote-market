
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { machineCategories, machineProducts } from "@/lib/machineData";

export async function generateMetadata({params}:any):Promise<Metadata>{
  const {locale,slug}=await params;
  const c=machineCategories.find(x=>x.slug===slug); if(!c)return {};
  return {title:`${c.name} | Makine & Sarf`,description:c.desc,alternates:{canonical:`/${locale}/makine-sarf/${slug}`},
    openGraph:{title:`${c.name} | Marble Borsa`,description:c.desc,url:`https://marbleborsa.com/${locale}/makine-sarf/${slug}`,type:"website"}};
}
export default async function Page({params}:any){
  const {locale,slug}=await params; const c=machineCategories.find(x=>x.slug===slug); if(!c)notFound();
  const products=machineProducts.filter(p=>p.category===slug);
  return <div className="mbStandalone">
    <div className="mbTop">TÜRKİYE DOĞAL TAŞ SEKTÖRÜNÜ ALICILARLA BULUŞTURAN B2B TEKLİF PLATFORMU</div>
    <header className="mbHeader"><Link className="mbLogo" href={`/${locale}`}>Marble <i>Borsa</i><small>Natural Stone B2B</small></Link><nav><Link href={`/${locale}/dogal-tas`}>Doğal Taş</Link><Link href={`/${locale}/firmalar`}>Firma Rehberi</Link><Link href={`/${locale}/alim-talepleri`}>Alım Talepleri</Link><Link className="active" href={`/${locale}/makine-sarf`}>Makine & Sarf</Link><Link href={`/${locale}/hizmetler`}>Hizmetler</Link></nav></header>
    <main className="mbDetailWrap">
      <div className="mbCrumb"><Link href={`/${locale}`}>Ana Sayfa</Link> / <Link href={`/${locale}/makine-sarf`}>Makine & Sarf</Link> / {c.name}</div>
      <h1>{c.name}</h1><p className="mbLead">{c.desc}</p>
      <div className="mbDetailGrid">
        <section>
          <h2>Ürünler ve Tedarikçiler</h2>
          {products.length?products.map((p,i)=><div className="mbProduct" key={i}><div><b>{p.name}</b><small>{p.meta}</small></div><div className="mbSupplier">{p.supplier}</div><button>Teklif Al</button></div>)
          :<div className="mbEmpty">Bu kategoride tedarikçi kayıtları Supabase bağlantısından sonra burada listelenecek.</div>}
        </section>
        <aside className="mbRequest compact"><h2>Teklif Talebi</h2><label>Ürün / Ekipman<input placeholder={c.name}/></label><label>Marka / Model<input placeholder="Varsa"/></label><label>Teknik Ölçü / Çap<input placeholder="Örn. Ø1200 mm"/></label><label>Adet<input type="number" min="1"/></label><button>Teklif Talebi Oluştur</button></aside>
      </div>
    </main>
  </div>
}
