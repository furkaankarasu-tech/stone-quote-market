import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { publicAssetUrl, publicCatalog, publicCompanies, uuidPattern, publicCompanyLogo } from "@/lib/publicDirectory";
import { CompanyVisits } from "@/components/MarketplaceScripts";
import { buildMetadata, absoluteUrl, safeJsonLd } from "@/lib/seo";
import "./company.css";
import { marketPath, companyProfileSegments, type GuideLocale } from "@/lib/guideRoutes";
const translations={"Firma profili": {"en": "Company profile", "zh": "企业资料", "ar": "ملف الشركة"}, "Firma bilgileri şu anda yüklenemiyor": {"en": "Company information is currently unavailable", "zh": "暂时无法加载企业信息", "ar": "معلومات الشركة غير متاحة حالياً"}, "Firma rehberine bağlantı geçici olarak kurulamadı. Lütfen tekrar deneyin.": {"en": "Could not connect to the company directory. Please retry.", "zh": "暂时无法连接企业名录，请重试。", "ar": "تعذر الاتصال بدليل الشركات. حاول مجدداً."}, "Tekrar dene": {"en": "Retry", "zh": "重试", "ar": "إعادة المحاولة"}, "Firma rehberine dön": {"en": "Back to company directory", "zh": "返回企业名录", "ar": "العودة لدليل الشركات"}, "Ana Sayfa": {"en": "Home", "zh": "首页", "ar": "الرئيسية"}, "Firmalar": {"en": "Companies", "zh": "企业", "ar": "الشركات"}, "DOĞRULANMIŞ FİRMA": {"en": "VERIFIED COMPANY", "zh": "已验证企业", "ar": "شركة موثقة"}, "FİRMA KATALOĞU": {"en": "COMPANY CATALOGUE", "zh": "企业目录", "ar": "كتالوج الشركة"}, "Ürün ve hizmetler": {"en": "Products and services", "zh": "产品与服务", "ar": "المنتجات والخدمات"}, "kayıt": {"en": "entries", "zh": "条记录", "ar": "عناصر"}, "Kataloğu incele ↗": {"en": "View catalogue ↗", "zh": "查看目录 ↗", "ar": "عرض الكتالوج ↗"}, "Katalog şu anda yüklenemiyor. Lütfen sayfayı yeniden açın.": {"en": "The catalogue is currently unavailable. Please reload the page.", "zh": "目录暂时无法加载，请重新打开页面。", "ar": "الكتالوج غير متاح حالياً. أعد تحميل الصفحة."}, "Bu firma henüz herkese açık katalog kaydı yayınlamadı.": {"en": "This company has not published any public catalogue entries yet.", "zh": "此企业尚未发布公开目录条目。", "ar": "لم تنشر هذه الشركة عناصر كتالوج عامة بعد."}, "Profilim ↗": {"en": "My profile ↗", "zh": "个人资料 ↗", "ar": "ملفي الشخصي ↗"}, "Doğal taş": {"en": "Natural stone", "zh": "天然石材", "ar": "الحجر الطبيعي"}, "Makine": {"en": "Machinery", "zh": "机械", "ar": "الآلات"}, "Sarf malzemesi": {"en": "Supplies", "zh": "耗材", "ar": "المستلزمات"}, "Hizmet": {"en": "Service", "zh": "服务", "ar": "خدمة"}, "Katalog": {"en": "Catalogue", "zh": "目录", "ar": "كتالوج"}, "Ocak": {"en": "Quarry", "zh": "采石场", "ar": "محجر"}, "Fabrika": {"en": "Factory", "zh": "工厂", "ar": "مصنع"}, "Ocak + fabrika": {"en": "Quarry + factory", "zh": "采石场＋工厂", "ar": "محجر + مصنع"}, "Tedarikçi": {"en": "Supplier", "zh": "供应商", "ar": "مورد"}, "Makine üreticisi": {"en": "Machinery manufacturer", "zh": "机械制造商", "ar": "مصنع آلات"}, "Sarf tedarikçisi": {"en": "Supplies supplier", "zh": "耗材供应商", "ar": "مورد مستلزمات"}, "Lojistik": {"en": "Logistics", "zh": "物流", "ar": "خدمات لوجستية"}, "Gemi acentesi": {"en": "Shipping agency", "zh": "船务代理", "ar": "وكالة شحن"}, "Konteyner fumigasyonu": {"en": "Container fumigation", "zh": "集装箱熏蒸", "ar": "تبخير الحاويات"}, "Diğer hizmetler": {"en": "Other services", "zh": "其他服务", "ar": "خدمات أخرى"}, "Gümrük": {"en": "Customs", "zh": "报关", "ar": "جمارك"}, "Kalite kontrol": {"en": "Quality control", "zh": "质量控制", "ar": "مراقبة الجودة"}, "Sektör firması": {"en": "Industry company", "zh": "行业企业", "ar": "شركة في القطاع"}, "logo": {"en": "logo", "zh": "标志", "ar": "شعار"}} as Record<string,Record<string,string>>;
const text=(locale:string,value:string)=>translations[value]?.[locale]||value;

function profileDescription(locale:string,name:string,city:string){
 const place=city?` (${city})`:'';
 return ({tr:`${name}${place} firma profili: ürün ve hizmet kataloğunu Marble Borsa üzerinde inceleyin. Firma bilgilerini ve yayınlanan katalog kayıtlarını keşfedin.`,en:`Explore ${name}${place} on Marble Borsa. View company information, published products and services, and the company catalogue.`,zh:`在 Marble Borsa 查看 ${name}${place} 的企业资料、已发布的产品、服务和企业目录。`,ar:`تعرّف على ${name}${place} في Marble Borsa. تصفح معلومات الشركة ومنتجاتها وخدماتها والكتالوج المنشور.`} as Record<string,string>)[locale]||'';
}

type Params = { locale: string; slug: string };
async function findCompany(segment: string) {
 if(!segment||segment.length>180)return null;
 const companies=await publicCompanies();
 const slugs=companyProfileSegments(companies.map(company=>({id:company.company_id,name:company.name})));
 const company=companies.find(company=>(company.company_id===segment||slugs[company.company_id]===segment)&&["companies","machines","services"].includes(company.section));
 return company?{...company,profile_slug:slugs[company.company_id]}:null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!["tr","en","zh","ar"].includes(locale)) return {};
  try {
    const company = await findCompany(slug);
    if (!company) return {};
    return buildMetadata({ title: `${company.name} ${text(locale,"Firma profili")}`,
      description: profileDescription(locale,company.name,company.city),
      path: `/${locale}/firmalar/${company.profile_slug}`,
    locale: ({tr:"tr_TR",en:"en_US",zh:"zh_CN",ar:"ar"} as Record<string,string>)[locale],
    languages: Object.fromEntries(["tr","en","zh","ar"].map(lang=>[lang,`/${lang}/firmalar/${company.profile_slug}`])) });
  } catch { return {}; }
}

export default async function CompanyPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!["tr","en","zh","ar"].includes(locale)) notFound();
  const t=(value:string)=>text(locale,value);
  let directory=marketPath(locale as GuideLocale,"companies");
  let company;
  try { company = await findCompany(slug); } catch {
    return <main id="main-content" tabIndex={-1} className="seo-not-found"><Link href={`/${locale}`} className="seo-brand"><img src="/icon.png?v=mb" width="43" height="43" alt="" />Marble Borsa</Link><h1>{t("Firma bilgileri şu anda yüklenemiyor")}</h1><p>{t("Firma rehberine bağlantı geçici olarak kurulamadı. Lütfen tekrar deneyin.")}</p><nav aria-label={t("Tekrar dene")}><a href={`/${locale}/firmalar/${slug}`}>{t("Tekrar dene")}</a><Link href={directory}>{t("Firma rehberine dön")}</Link></nav></main>;
  }
  if (!company) notFound();
  if(slug!==company.profile_slug)permanentRedirect(`/${locale}/firmalar/${company.profile_slug}`);
  let items: Awaited<ReturnType<typeof publicCatalog>> = [];
  directory=marketPath(locale as GuideLocale,company.section==="services"?"services":company.section==="machines"?"machines":"companies");
  let catalogUnavailable = false;
  try { items = (await publicCatalog()).filter((item) => item.company_id === company.company_id); } catch { catalogUnavailable = true; }
  const logo = publicCompanyLogo(company);
  const categoryPath = (category: string) => category === "stone" ? "dogal-tas" : category === "service" ? "hizmetler" : "makine-sarf";
  const categoryLabel = (category: string) => ({ stone: "Doğal taş", machine: "Makine", supplies: "Sarf malzemesi", service: "Hizmet" })[category as "stone" | "machine" | "supplies" | "service"] || "Katalog";
  const activity = ({ quarry: "Ocak", factory: "Fabrika", quarryFactory: "Ocak + fabrika", trader: "Tedarikçi", machine: "Makine üreticisi", supplies: "Sarf tedarikçisi", logistics: "Lojistik", shipping: "Gemi acentesi", fumigation: "Konteyner fumigasyonu", other: "Diğer hizmetler", customs: "Gümrük müşaviri", quality: "Kalite kontrol" } as Record<string, string>)[company.activity_type] || "Sektör firması";
  return <main id="main-content" tabIndex={-1} className="company-page" lang={locale} dir={locale==="ar"?"rtl":"ltr"}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd({"@context":"https://schema.org","@type":"ProfilePage","@id":`${absoluteUrl(`/${locale}/firmalar/${slug}`)}#profile`,url:absoluteUrl(`/${locale}/firmalar/${slug}`),name:company.name,description:profileDescription(locale,company.name,company.city),mainEntity:{"@type":"Organization","@id":`${absoluteUrl(`/tr/firmalar/${company.profile_slug}`)}#company`,name:company.name,url:absoluteUrl(`/${locale}/firmalar/${slug}`),...(company.city?{address:{"@type":"PostalAddress",addressLocality:company.city}}:{}),...(logo.startsWith("https://")?{logo}:{})}})}} />
    <div className="company-shell"><div className="company-breadcrumb"><Link href={`/${locale}`}>{t("Ana Sayfa")}</Link><span>›</span><Link href={directory}>{t("Firmalar")}</Link><span>›</span><span>{company.name}</span></div>
      <section className="company-hero"><div className="company-hero-logo">{logo ? <img src={logo} alt={`${company.name} ${t("logo")}`} /> : <span>{company.name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase()}</span>}</div><div><span className="company-eyebrow">{t("DOĞRULANMIŞ FİRMA")}</span><h1>{company.name}</h1><p>{[company.city, t(activity)].filter(Boolean).join(" · ")}</p><CompanyVisits companyId={company.company_id} locale={locale} /></div></section>
      <p className="company-introduction">{profileDescription(locale,company.name,company.city)}</p>
      <section className="company-catalog"><div className="company-section-heading"><div><span className="company-eyebrow">{company.section==="services"?({tr:"FİRMA HİZMETLERİ",en:"COMPANY SERVICES",zh:"企业服务",ar:"خدمات الشركة"})[locale]:t("FİRMA KATALOĞU")}</span><h2>{company.section==="services"?({tr:"Sunulan hizmetler",en:"Services offered",zh:"提供的服务",ar:"الخدمات المقدمة"})[locale]:t("Ürün ve hizmetler")}</h2></div><span>{items.length} {t("kayıt")}</span></div>
        {items.length ? <div className="company-products">{items.map((item) => {
          const image = publicAssetUrl("mb-catalog-assets", item.image_paths?.[0]);
          return <article className="company-product" key={item.id}>
            {image ? <img src={image} alt={item.title} loading="lazy" /> : <div className="company-product-placeholder" aria-hidden="true">M.</div>}
            <div><span className="company-eyebrow">{t(categoryLabel(item.category))}</span><h3>{item.title}</h3><p>{item.description}</p><Link href={`${marketPath(locale as GuideLocale,item.category==="stone"?"stones":item.category==="service"?"services":"machines")}?catalog=${encodeURIComponent(item.id)}`}>{item.category==="service"?({tr:"Hizmeti incele ↗",en:"View service ↗",zh:"查看服务 ↗",ar:"عرض الخدمة ↗"})[locale]:t("Kataloğu incele ↗")}</Link></div>
          </article>;
        })}</div> : <p className="company-empty">{catalogUnavailable ? t("Katalog şu anda yüklenemiyor. Lütfen sayfayı yeniden açın.") : t("Bu firma henüz herkese açık katalog kaydı yayınlamadı.")}</p>}

      </section><div className="company-bottom"><Link href={directory}>← {t("Firma rehberine dön")}</Link><Link href={`/${locale}/profil`}>{t("Profilim ↗")}</Link></div>
    </div>
  </main>;
}
