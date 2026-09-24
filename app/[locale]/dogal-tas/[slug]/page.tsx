
import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {stones} from "@/lib/stoneData";

const supplierMap:Record<string,{name:string;slug:string}[]> = {
 "afyon-white":[
  {name:"Artemis Marble Co.",slug:"artemis-marble-co"},
  {name:"Nexa Stone Industries",slug:"nexa-stone-industries"},
  {name:"Afyon Stone Works",slug:"afyon-stone-works"},
  {name:"Anka Marble",slug:"anka-marble"},
  {name:"Atlas Natural Stone",slug:"atlas-natural-stone"},
  {name:"İscehisar Marble",slug:"iscehisar-marble"}
 ],
 "afyon-sugar":[
  {name:"Artemis Marble Co.",slug:"artemis-marble-co"},
  {name:"Afyon Stone Works",slug:"afyon-stone-works"},
  {name:"Sultan Stone",slug:"sultan-stone"},
  {name:"Akropol Stone",slug:"akropol-stone"}
 ],
 "afyon-violet":[
  {name:"Averon Natural Stone",slug:"averon-natural-stone"},
  {name:"Anka Marble",slug:"anka-marble"},
  {name:"Eksen Marble",slug:"eksen-marble"}
 ],
 "afyon-grey":[
  {name:"Nexa Stone Industries",slug:"nexa-stone-industries"},
  {name:"Atlas Natural Stone",slug:"atlas-natural-stone"},
  {name:"Türkiye Stone Supply",slug:"turkiye-stone-supply"}
 ],
 "burdur-beige":[
  {name:"Burdur Beige Stone",slug:"burdur-beige-stone"},
  {name:"Doruk Natural Stone",slug:"doruk-natural-stone"},
  {name:"Anatolia Stone Export",slug:"anatolia-stone-export"},
  {name:"Mira Marble Export",slug:"mira-marble-export"},
  {name:"Türkiye Stone Supply",slug:"turkiye-stone-supply"}
 ],
 "bilecik-beige":[
  {name:"Anadolu Mermer",slug:"anadolu-mermer"},
  {name:"Bilecik Beige Co.",slug:"bilecik-beige-co"},
  {name:"Anatolia Stone Export",slug:"anatolia-stone-export"},
  {name:"Mira Marble Export",slug:"mira-marble-export"},
  {name:"Türkiye Stone Supply",slug:"turkiye-stone-supply"}
 ],
 "mugla-white":[
  {name:"Muğla White Marble",slug:"mugla-white-marble"},
  {name:"Aegean Stone Trade",slug:"aegean-stone-trade"},
  {name:"Mira Marble Export",slug:"mira-marble-export"},
  {name:"Türkiye Stone Supply",slug:"turkiye-stone-supply"}
 ],
 "marmara-white":[
  {name:"Marmara Natural Stone",slug:"marmara-natural-stone"},
  {name:"Marmara White Stone",slug:"marmara-white-stone"},
  {name:"Aegean Stone Trade",slug:"aegean-stone-trade"},
  {name:"Mira Marble Export",slug:"mira-marble-export"},
  {name:"Anatolia Stone Export",slug:"anatolia-stone-export"},
  {name:"Türkiye Stone Supply",slug:"turkiye-stone-supply"}
 ],
 "denizli-travertine":[
  {name:"Denizli Travertine Co.",slug:"denizli-travertine-co"},
  {name:"Pamukkale Travertine",slug:"pamukkale-travertine"},
  {name:"Aegean Stone Trade",slug:"aegean-stone-trade"},
  {name:"Mira Marble Export",slug:"mira-marble-export"},
  {name:"Türkiye Stone Supply",slug:"turkiye-stone-supply"}
 ]
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({params}:any):Promise<Metadata>{
 const {locale,slug}=await params; const s=stones.find(x=>x.slug===slug); if(!s)return {};
 return {title:s.name,description:`${s.name}: ${s.type}, ${s.city}. Format, kalınlık, yüzey seçenekleri ve bu taşı sunan firmaları Marble Borsa'da karşılaştırın.`,alternates:{canonical:`/${locale}/dogal-tas/${slug}`},
 openGraph:{title:`${s.name} | Marble Borsa`,description:s.description,url:`https://marbleborsa.com/${locale}/dogal-tas/${slug}`,type:"website"},
 twitter:{card:"summary_large_image",title:`${s.name} | Marble Borsa`,description:s.description}};
}
export default async function Page({params}:any){
 const {locale,slug}=await params; const s=stones.find(x=>x.slug===slug); if(!s)notFound();
 const suppliers=supplierMap[s.slug]||[];
 const jsonLd={"@context":"https://schema.org","@type":"Product","name":s.name,"description":s.description,"category":s.type,"material":s.type,"additionalProperty":[{"@type":"PropertyValue","name":"Menşei","value":s.city},{"@type":"PropertyValue","name":"Renk","value":s.color},{"@type":"PropertyValue","name":"Formatlar","value":s.forms.join(", ")}]};
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/><div className="mbStandalone">
  <div className="mbTop">TÜRKİYE DOĞAL TAŞ SEKTÖRÜNÜ ALICILARLA BULUŞTURAN B2B TEKLİF PLATFORMU</div>
  <header className="mbHeader"><Link className="mbLogo" href={`/${locale}`}>Marble <i>Borsa</i><small>Natural Stone B2B</small></Link><nav><Link className="active" href={`/${locale}/dogal-tas`}>Doğal Taş</Link><Link href={`/${locale}/firmalar`}>Firma Rehberi</Link><Link href={`/${locale}/alim-talepleri`}>Alım Talepleri</Link><Link href={`/${locale}/makine-sarf`}>Makine & Sarf</Link><Link href={`/${locale}/hizmetler`}>Hizmetler</Link></nav></header>
  <main className="mbDetailWrap">
   <div className="mbCrumb"><Link href={`/${locale}`}>Ana Sayfa</Link> / <Link href={`/${locale}/dogal-tas`}>Doğal Taş</Link> / {s.name}</div>
   <div className="stoneHero"><div className="stoneHeroImage"><span>{s.type}</span></div><div><small>{s.city.toUpperCase()}</small><h1>{s.name}</h1><p className="mbLead">{s.description}</p><div className="stoneHeroStats"><b>{suppliers.length}<small>firma sunuyor</small></b><b>{s.forms.length}<small>format</small></b><b>{s.surfaces.length}<small>yüzey</small></b></div><a className="stoneOfferBtn" href="#teklif">Teklif Al</a></div></div>
   <div className="mbDetailGrid stoneDetailGrid"><section>
    <h2>Teknik & Ticari Bilgiler</h2><div className="techTable"><div><b>Taş türü</b><span>{s.type}</span></div><div><b>Menşei</b><span>{s.city}</span></div><div><b>Renk</b><span>{s.color}</span></div><div><b>Formatlar</b><span>{s.forms.join(", ")}</span></div><div><b>Kalınlık</b><span>{s.thickness.join(", ")}</span></div><div><b>Yüzeyler</b><span>{s.surfaces.join(", ")}</span></div><div><b>Stok</b><span>{s.stock}</span></div></div>
    <h2>Fiziksel / Mekanik Test Değerleri</h2><div className="testNotice">Test raporu henüz yüklenmedi.</div>
    <h2>Bu taşı sunan firmalar</h2><div className="supplierRows">{suppliers.map(f=><div key={f.slug}><div><b>{f.name}</b><small>Demo firma · Doğrulama bekliyor</small></div><Link href={`/${locale}/firmalar/${f.slug}`}>Firma Profili</Link></div>)}</div>
   </section>
   <aside id="teklif" className="mbRequest compact"><h2>{s.name} için Teklif Al</h2><label>İstenen format<select><option>Blok</option><option>Plaka</option><option>Ebatlı</option></select></label><label>Miktar<input placeholder="Örn. 500 m² / 2 blok"/></label><label>Kalınlık<input placeholder="Örn. 2 cm"/></label><label>Yüzey<input placeholder="Örn. honlu"/></label><label>Teslim yeri<input placeholder="Şehir / liman / ülke"/></label><button>Teklif Talebi Oluştur</button></aside>
   </div>
  </main>
 </div></>
}
