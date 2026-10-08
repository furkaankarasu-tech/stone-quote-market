import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { publicAssetUrl, publicCatalog, publicCompanies, uuidPattern } from "@/lib/publicDirectory";
import { buildMetadata } from "@/lib/seo";
import "./company.css";
import { marketPath, type GuideLocale } from "@/lib/guideRoutes";
const translations={"Firma profili": {"en": "Company profile", "zh": "企业资料", "ar": "ملف الشركة"}, "Firma bilgileri şu anda yüklenemiyor": {"en": "Company information is currently unavailable", "zh": "暂时无法加载企业信息", "ar": "معلومات الشركة غير متاحة حالياً"}, "Firma rehberine bağlantı geçici olarak kurulamadı. Lütfen tekrar deneyin.": {"en": "Could not connect to the company directory. Please retry.", "zh": "暂时无法连接企业名录，请重试。", "ar": "تعذر الاتصال بدليل الشركات. حاول مجدداً."}, "Tekrar dene": {"en": "Retry", "zh": "重试", "ar": "إعادة المحاولة"}, "Firma rehberine dön": {"en": "Back to company directory", "zh": "返回企业名录", "ar": "العودة لدليل الشركات"}, "Ana Sayfa": {"en": "Home", "zh": "首页", "ar": "الرئيسية"}, "Firmalar": {"en": "Companies", "zh": "企业", "ar": "الشركات"}, "DOĞRULANMIŞ FİRMA": {"en": "VERIFIED COMPANY", "zh": "已验证企业", "ar": "شركة موثقة"}, "FİRMA KATALOĞU": {"en": "COMPANY CATALOGUE", "zh": "企业目录", "ar": "كتالوج الشركة"}, "Ürün ve hizmetler": {"en": "Products and services", "zh": "产品与服务", "ar": "المنتجات والخدمات"}, "kayıt": {"en": "entries", "zh": "条记录", "ar": "عناصر"}, "Kataloğu incele ↗": {"en": "View catalogue ↗", "zh": "查看目录 ↗", "ar": "عرض الكتالوج ↗"}, "Katalog şu anda yüklenemiyor. Lütfen sayfayı yeniden açın.": {"en": "The catalogue is currently unavailable. Please reload the page.", "zh": "目录暂时无法加载，请重新打开页面。", "ar": "الكتالوج غير متاح حالياً. أعد تحميل الصفحة."}, "Bu firma henüz herkese açık katalog kaydı yayınlamadı.": {"en": "This company has not published any public catalogue entries yet.", "zh": "此企业尚未发布公开目录条目。", "ar": "لم تنشر هذه الشركة عناصر كتالوج عامة بعد."}, "Profilim ↗": {"en": "My profile ↗", "zh": "个人资料 ↗", "ar": "ملفي الشخصي ↗"}, "Doğal taş": {"en": "Natural stone", "zh": "天然石材", "ar": "الحجر الطبيعي"}, "Makine": {"en": "Machinery", "zh": "机械", "ar": "الآلات"}, "Sarf malzemesi": {"en": "Supplies", "zh": "耗材", "ar": "المستلزمات"}, "Hizmet": {"en": "Service", "zh": "服务", "ar": "خدمة"}, "Katalog": {"en": "Catalogue", "zh": "目录", "ar": "كتالوج"}, "Ocak": {"en": "Quarry", "zh": "采石场", "ar": "محجر"}, "Fabrika": {"en": "Factory", "zh": "工厂", "ar": "مصنع"}, "Ocak + fabrika": {"en": "Quarry + factory", "zh": "采石场＋工厂", "ar": "محجر + مصنع"}, "Tedarikçi": {"en": "Supplier", "zh": "供应商", "ar": "مورد"}, "Makine üreticisi": {"en": "Machinery manufacturer", "zh": "机械制造商", "ar": "مصنع آلات"}, "Sarf tedarikçisi": {"en": "Supplies supplier", "zh": "耗材供应商", "ar": "مورد مستلزمات"}, "Lojistik": {"en": "Logistics", "zh": "物流", "ar": "خدمات لوجستية"}, "Gemi acentesi": {"en": "Shipping agency", "zh": "船务代理", "ar": "وكالة شحن"}, "Konteyner fumigasyonu": {"en": "Container fumigation", "zh": "集装箱熏蒸", "ar": "تبخير الحاويات"}, "Diğer hizmetler": {"en": "Other services", "zh": "其他服务", "ar": "خدمات أخرى"}, "Gümrük": {"en": "Customs", "zh": "报关", "ar": "جمارك"}, "Kalite kontrol": {"en": "Quality control", "zh": "质量控制", "ar": "مراقبة الجودة"}, "Sektör firması": {"en": "Industry company", "zh": "行业企业", "ar": "شركة في القطاع"}, "logo": {"en": "logo", "zh": "标志", "ar": "شعار"}} as Record<string,Record<string,string>>;
const text=(locale:string,value:string)=>translations[value]?.[locale]||value;

type Params = { locale: string; slug: string };
async function findCompany(id: string) {
  if (!uuidPattern.test(id)) return null;
  const companies = await publicCompanies();
  return companies.find((company) => company.company_id === id && ["companies", "machines", "services"].includes(company.section)) || null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!["tr","en","zh","ar"].includes(locale) || !uuidPattern.test(slug)) return {};
  try {
    const company = await findCompany(slug);
    if (!company) return {};
    return buildMetadata({ title: `${company.name} ${text(locale,"Firma profili")}`,
      description: `${company.name}${company.city ? `, ${company.city}` : ""} · ${text(locale,"Firma profili")} · ${text(locale,"FİRMA KATALOĞU")}`,
      path: `/${locale}/firmalar/${slug}`,
    locale: ({tr:"tr_TR",en:"en_US",zh:"zh_CN",ar:"ar"} as Record<string,string>)[locale],
    languages: Object.fromEntries(["tr","en","zh","ar"].map(lang=>[lang,`/${lang}/firmalar/${slug}`])) });
  } catch { return {}; }
}

export default async function CompanyPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!["tr","en","zh","ar"].includes(locale)) notFound();
  if (!uuidPattern.test(slug)) permanentRedirect(marketPath(locale as GuideLocale,"companies"));
  const t=(value:string)=>text(locale,value);
  const directory=marketPath(locale as GuideLocale,"companies");
  let company;
  try { company = await findCompany(slug); } catch {
    return <main id="main-content" tabIndex={-1} className="seo-not-found"><Link href={`/${locale}`} className="seo-brand"><img src="/icon.png?v=mb" width="43" height="43" alt="" />Marble Borsa</Link><h1>{t("Firma bilgileri şu anda yüklenemiyor")}</h1><p>{t("Firma rehberine bağlantı geçici olarak kurulamadı. Lütfen tekrar deneyin.")}</p><nav aria-label={t("Tekrar dene")}><a href={`/${locale}/firmalar/${slug}`}>{t("Tekrar dene")}</a><Link href={directory}>{t("Firma rehberine dön")}</Link></nav></main>;
  }
  if (!company) notFound();
  let items: Awaited<ReturnType<typeof publicCatalog>> = [];
  let catalogUnavailable = false;
  try { items = (await publicCatalog()).filter((item) => item.company_id === slug); } catch { catalogUnavailable = true; }
  const logo = publicAssetUrl("mb-company-logos", company.logo_path);
  const categoryPath = (category: string) => category === "stone" ? "dogal-tas" : category === "service" ? "hizmetler" : "makine-sarf";
  const categoryLabel = (category: string) => ({ stone: "Doğal taş", machine: "Makine", supplies: "Sarf malzemesi", service: "Hizmet" })[category as "stone" | "machine" | "supplies" | "service"] || "Katalog";
  const activity = ({ quarry: "Ocak", factory: "Fabrika", quarryFactory: "Ocak + fabrika", trader: "Tedarikçi", machine: "Makine üreticisi", supplies: "Sarf tedarikçisi", logistics: "Lojistik", shipping: "Gemi acentesi", fumigation: "Konteyner fumigasyonu", other: "Diğer hizmetler", customs: "Gümrük", quality: "Kalite kontrol" } as Record<string, string>)[company.activity_type] || "Sektör firması";
  return <main id="main-content" tabIndex={-1} className="company-page" lang={locale} dir={locale==="ar"?"rtl":"ltr"}>
    <div className="company-shell"><div className="company-breadcrumb"><Link href={`/${locale}`}>{t("Ana Sayfa")}</Link><span>›</span><Link href={directory}>{t("Firmalar")}</Link><span>›</span><span>{company.name}</span></div>
      <section className="company-hero"><div className="company-hero-logo">{logo ? <img src={logo} alt={`${company.name} ${t("logo")}`} /> : <span>{company.name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase()}</span>}</div><div><span className="company-eyebrow">{t("DOĞRULANMIŞ FİRMA")}</span><h1>{company.name}</h1><p>{[company.city, t(activity)].filter(Boolean).join(" · ")}</p></div></section>
      <section className="company-catalog"><div className="company-section-heading"><div><span className="company-eyebrow">{t("FİRMA KATALOĞU")}</span><h2>{t("Ürün ve hizmetler")}</h2></div><span>{items.length} {t("kayıt")}</span></div>
        {items.length ? <div className="company-products">{items.map((item) => {
          const image = publicAssetUrl("mb-catalog-assets", item.image_paths?.[0]);
          return <article className="company-product" key={item.id}>
            {image ? <img src={image} alt={item.title} loading="lazy" /> : <div className="company-product-placeholder" aria-hidden="true">M.</div>}
            <div><span className="company-eyebrow">{t(categoryLabel(item.category))}</span><h3>{item.title}</h3><p>{item.description}</p><Link href={`${marketPath(locale as GuideLocale,item.category==="stone"?"stones":item.category==="service"?"services":"machines")}?catalog=${encodeURIComponent(item.id)}`}>{t("Kataloğu incele ↗")}</Link></div>
          </article>;
        })}</div> : <p className="company-empty">{catalogUnavailable ? t("Katalog şu anda yüklenemiyor. Lütfen sayfayı yeniden açın.") : t("Bu firma henüz herkese açık katalog kaydı yayınlamadı.")}</p>}
      </section><div className="company-bottom"><Link href={directory}>← {t("Firma rehberine dön")}</Link><Link href={`/${locale}/profil`}>{t("Profilim ↗")}</Link></div>
    </div>
  </main>;
}
