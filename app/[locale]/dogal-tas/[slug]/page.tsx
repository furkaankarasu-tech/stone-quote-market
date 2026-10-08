import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl, buildMetadata, safeJsonLd, stoneDescription } from "@/lib/seo";
import { publicCompanies, publicCatalog, publicAssetUrl } from "@/lib/publicDirectory";
import { stones } from "@/lib/stoneData";
import "./stone-detail.css";
import { marketPath, guidePath, type GuideLocale } from "@/lib/guideRoutes";
const translations={"Ana Sayfa": {"en": "Home", "zh": "首页", "ar": "الرئيسية"}, "Doğal Taş": {"en": "Natural Stone", "zh": "天然石材", "ar": "الحجر الطبيعي"}, "İçerik yolu": {"en": "Breadcrumb", "zh": "导航路径", "ar": "مسار التنقل"}, "Taş görselleri": {"en": "Stone images", "zh": "石材图片", "ar": "صور الحجر"}, "Plaka sunumu küçük görsel": {"en": "Slab preview thumbnail", "zh": "板材预览缩略图", "ar": "صورة مصغرة للبلاطة"}, "Yakın taş dokusu": {"en": "Stone texture close-up", "zh": "石材纹理特写", "ar": "تفاصيل نسيج الحجر"}, "doğal taş koleksiyonu": {"en": "natural stone collection", "zh": "天然石材系列", "ar": "مجموعة الحجر الطبيعي"}, "Doğal taş koleksiyonu": {"en": "Natural stone collection", "zh": "天然石材系列", "ar": "مجموعة الحجر الطبيعي"}, "DOĞAL TAŞ DİZİNİ": {"en": "NATURAL STONE DIRECTORY", "zh": "天然石材名录", "ar": "دليل الحجر الطبيعي"}, "Firma katalogları onaylandıkça rehberde görünür": {"en": "Company catalogues appear after approval", "zh": "企业目录获批后将显示在名录中", "ar": "تظهر كتالوجات الشركات بعد الموافقة"}, "Alıcı hesabıyla teklif iste →": {"en": "Request a quote with a buyer account →", "zh": "使用买家账户询价 →", "ar": "اطلب عرضاً بحساب مشتري →"}, "Taş bilgileri": {"en": "Stone specifications", "zh": "石材规格", "ar": "مواصفات الحجر"}, "Taş türü": {"en": "Stone type", "zh": "石材类型", "ar": "نوع الحجر"}, "Menşei": {"en": "Origin", "zh": "产地", "ar": "المنشأ"}, "Renk": {"en": "Colour", "zh": "颜色", "ar": "اللون"}, "Formatlar": {"en": "Formats", "zh": "规格形式", "ar": "الأشكال"}, "Kalınlık": {"en": "Thickness", "zh": "厚度", "ar": "السماكة"}, "Blok boyutu": {"en": "Block dimensions", "zh": "荒料尺寸", "ar": "أبعاد الكتلة"}, "Blok hacmi": {"en": "Block volume", "zh": "荒料体积", "ar": "حجم الكتلة"}, "Yüzey seçenekleri": {"en": "Surface finishes", "zh": "表面处理", "ar": "تشطيبات السطح"}, "Üreticilerin güncel parti fotoğrafları, stok bilgileri ve teknik belgeleri için firma kataloglarını inceleyin. Teklif ve teslim koşullarını doğrudan ilgili firmayla netleştirin.": {"en": "See company catalogues for current batch photos, stock and technical documents. Confirm quotation and delivery terms directly with the company.", "zh": "查看企业目录以获取最新批次照片、库存及技术文件。请直接与相关企业确认报价和交付条件。", "ar": "راجع كتالوجات الشركات لصور الدفعات والمخزون والوثائق الفنية. أكد شروط العرض والتسليم مباشرة مع الشركة."}, "Taş seçimi ve satın alma rehberi": {"en": "Stone selection and buying guides", "zh": "石材选择与采购指南", "ar": "أدلة اختيار وشراء الحجر"}, "Ölçü, parti fotoğrafı, yüzey seçimi ve teklif ayrıntıları hakkında bilgi edinin.": {"en": "Learn about dimensions, batch photos, finishes and quotation details.", "zh": "了解尺寸、批次照片、表面处理及报价细节。", "ar": "تعرف على الأبعاد وصور الدفعات والتشطيبات وتفاصيل العروض."}, "İlgili rehberler": {"en": "Related guides", "zh": "相关指南", "ar": "أدلة ذات صلة"}, "Afyon mermeri seçimi →": {"en": "Choosing Afyon marble →", "zh": "选择阿菲永大理石 →", "ar": "اختيار رخام أفيون →"}, "Türkiye doğal taş rehberi →": {"en": "Türkiye natural stone guide →", "zh": "土耳其天然石材指南 →", "ar": "دليل الحجر الطبيعي التركي →"}, "Blok ve plaka farkları →": {"en": "Blocks and slabs compared →", "zh": "荒料与板材的区别 →", "ar": "مقارنة الكتل والبلاطات →"}, "Bu taşı kataloglarında yayınlayan firmalar": {"en": "Companies listing this stone in their catalogues", "zh": "在目录中发布此石材的企业", "ar": "الشركات التي تعرض هذا الحجر في كتالوجاتها"}, "Firma ve katalog →": {"en": "Company and catalogue →", "zh": "企业与目录 →", "ar": "الشركة والكتالوج →"}, "Firma ve katalog verileri şu anda alınamıyor. Lütfen tekrar deneyin.": {"en": "Company and catalogue data is currently unavailable. Please retry.", "zh": "企业及目录信息暂时无法加载，请重试。", "ar": "بيانات الشركات والكتالوجات غير متاحة حالياً. حاول مجدداً."}, " adıyla yayınlanmış firma kataloğu henüz bulunmuyor.": {"en": " has no published company catalogue yet.", "zh": "暂无以此名称发布的企业目录。", "ar": " لا يوجد كتالوج شركة منشور بهذا الاسم بعد."}, "Gerçek firma kataloglarını ve ürün fotoğraflarını firma rehberinden inceleyin.": {"en": "Browse real company catalogues and product photos in the company directory.", "zh": "在企业名录中查看真实企业目录和产品照片。", "ar": "تصفح كتالوجات الشركات الحقيقية وصور المنتجات في دليل الشركات."}, "Firma rehberi": {"en": "Company directory", "zh": "企业名录", "ar": "دليل الشركات"}, "Firma rehberine git →": {"en": "Go to company directory →", "zh": "前往企业名录 →", "ar": "انتقل لدليل الشركات →"}, "Dizindeki diğer taşlar": {"en": "Other stones in the directory", "zh": "名录中的其他石材", "ar": "أحجار أخرى في الدليل"}, "Diğer doğal taşlar": {"en": "Other natural stones", "zh": "其他天然石材", "ar": "أحجار طبيعية أخرى"}, "logosu": {"en": "logo", "zh": "标志", "ar": "شعار"}, "Mermer": {"en": "Marble", "zh": "大理石", "ar": "رخام"}, "Traverten": {"en": "Travertine", "zh": "洞石", "ar": "ترافرتين"}, "Beyaz": {"en": "White", "zh": "白色", "ar": "أبيض"}, "Krem / Beyaz": {"en": "Cream / white", "zh": "米白色／白色", "ar": "كريمي / أبيض"}, "Beyaz / Mor damarlı": {"en": "White / violet veins", "zh": "白色／紫色纹理", "ar": "أبيض / عروق بنفسجية"}, "Gri": {"en": "Grey", "zh": "灰色", "ar": "رمادي"}, "Bej": {"en": "Beige", "zh": "米黄色", "ar": "بيج"}, "Beyaz / Gri çizgili": {"en": "White / grey stripes", "zh": "白色／灰色条纹", "ar": "أبيض / خطوط رمادية"}, "Krem": {"en": "Cream", "zh": "米白色", "ar": "كريمي"}, "Blok": {"en": "Block", "zh": "荒料", "ar": "كتلة"}, "Plaka": {"en": "Slab", "zh": "板材", "ar": "بلاطة"}, "Ebatlı": {"en": "Cut to size", "zh": "定尺加工", "ar": "مقطع حسب المقاس"}, "Cilalı": {"en": "Polished", "zh": "抛光", "ar": "مصقول"}, "Honlu": {"en": "Honed", "zh": "哑光", "ar": "مطفي"}, "Fırçalı": {"en": "Brushed", "zh": "刷面", "ar": "معالج بالفرشاة"}, "Dolgulu": {"en": "Filled", "zh": "填孔", "ar": "مملوء"}, "Eskitme": {"en": "Tumbled", "zh": "仿古", "ar": "معتق"}} as Record<string,Record<string,string>>;
const text=(locale:string,value:string)=>translations[value]?.[locale]||value;

type Params = { locale: string; slug: string };
export function generateStaticParams(): Params[] {
  return ["tr","en","zh","ar"].flatMap(locale=>stones.map(stone=>({locale,slug:stone.slug})));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const stone = stones.find((entry) => entry.slug === slug);
  if (!["tr","en","zh","ar"].includes(locale) || !stone) return {};
  return buildMetadata({
    title: `${stone.name} | ${text(locale,"Taş bilgileri")}`,
    description: locale==="tr"?stoneDescription(stone):`${stone.name} · ${text(locale,stone.type)} · ${stone.city}. ${text(locale,"Firma ve katalog →")}`,
    path: `/${locale}/dogal-tas/${stone.slug}`,
    locale: ({tr:"tr_TR",en:"en_US",zh:"zh_CN",ar:"ar"} as Record<string,string>)[locale],
    languages: Object.fromEntries(["tr","en","zh","ar"].map(lang=>[lang,`/${lang}/dogal-tas/${slug}`])),
  });
}

export default async function StonePage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const stone = stones.find((entry) => entry.slug === slug);
  if (!["tr","en","zh","ar"].includes(locale) || !stone) notFound();
  const t=(value:string)=>text(locale,value);
  const category=marketPath(locale as GuideLocale,"stones");
  const directory=marketPath(locale as GuideLocale,"companies");
  const published=await Promise.allSettled([publicCompanies(),publicCatalog()]);
  const normalize=(value:string)=>value.toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const matching=published[1].status==='fulfilled'?published[1].value.filter(item=>item.category==='stone'&&(` ${normalize(item.title)} `).includes(` ${normalize(stone.name)} `)):[];
  const providers=published[0].status==='fulfilled'?published[0].value.filter(company=>matching.some(item=>item.company_id===company.company_id)):[];
  const suppliersUnavailable=published.some(result=>result.status==='rejected');
  const origin = absoluteUrl("/");
  const atlasIndex = Math.max(0, stones.findIndex((entry) => entry.slug === stone.slug));
  const texturePosition = `${(atlasIndex % 3) * 50}% ${Math.floor(atlasIndex / 3) * 50}%`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: text(locale,"Ana Sayfa"), item: origin },
      { "@type": "ListItem", position: 2, name: text(locale,"Doğal Taş"), item: absoluteUrl(marketPath(locale as GuideLocale,"stones")) },
      { "@type": "ListItem", position: 3, name: stone.name, item: absoluteUrl(`/${locale}/dogal-tas/${stone.slug}`) },
    ],
  };

  return (
    <>
      {origin && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumb) }} />}
      
      <main id="main-content" tabIndex={-1} className="detail-main" lang={locale} dir={locale==="ar"?"rtl":"ltr"}>
        <nav aria-label={t("İçerik yolu")} className="detail-crumb">
          <a href={`/${locale}`}>{t("Ana Sayfa")}</a><span>/</span><a href={category}>{t("Doğal Taş")}</a><span>/</span>{stone.name}
        </nav>
        <article className="detail-card">
          <div className="detail-visual-group">
            <div className="detail-preview-rail" aria-label={t("Taş görselleri")}>
              <div className="detail-preview-thumb is-selected"><img src={`/market/images/marble/${stone.image}`} alt={t("Plaka sunumu küçük görsel")} loading="lazy" width="90" height="110" /></div>
              <div className="detail-preview-thumb is-texture" style={{ backgroundPosition: texturePosition }} role="img" aria-label={t("Yakın taş dokusu")} />
            </div>
            <figure className="detail-photo">
              <img src={`/market/images/marble/${stone.image}`} alt={`${stone.name} ${t("doğal taş koleksiyonu")}`} width="1000" height="730" fetchPriority="high" />
              <figcaption>{t("Doğal taş koleksiyonu")}</figcaption>
            </figure>
          </div>
          <div className="detail-info">
            <span className="eyebrow dark">{t("DOĞAL TAŞ DİZİNİ")} · {stone.city.toLocaleUpperCase("tr-TR")}</span>
            <h1>{stone.name}</h1>
            <p>{locale==="tr"?stone.description:`${stone.name} · ${t(stone.type)} · ${stone.city}. ${t("Üreticilerin güncel parti fotoğrafları, stok bilgileri ve teknik belgeleri için firma kataloglarını inceleyin. Teklif ve teslim koşullarını doğrudan ilgili firmayla netleştirin.")}`}</p>
            <span className="detail-supplier-count">{t("Firma katalogları onaylandıkça rehberde görünür")}</span>
            <a className="button dark detail-quote" href={`${category}?item=${encodeURIComponent(stone.name)}#market`}>{t("Alıcı hesabıyla teklif iste →")}</a>
          </div>
        </article>
        <section className="detail-specs">
          <h2>{t("Taş bilgileri")}</h2>
          <dl>
            <div><dt>{t("Taş türü")}</dt><dd>{t(stone.type)}</dd></div>
            <div><dt>{t("Menşei")}</dt><dd>{stone.city}</dd></div>
            <div><dt>{t("Renk")}</dt><dd>{t(stone.color)}</dd></div>
            <div><dt>{t("Formatlar")}</dt><dd>{stone.forms.map(t).join(", ")}</dd></div>
            {!stone.forms.includes("Blok") && stone.thickness && stone.thickness.length > 0 && <div><dt>{t("Kalınlık")}</dt><dd>{stone.thickness.join(", ")}</dd></div>}
            {stone.forms.includes("Blok") && stone.blockDimensions && <div><dt>{t("Blok boyutu")}</dt><dd>{stone.blockDimensions}</dd></div>}
            {stone.forms.includes("Blok") && stone.blockVolume && <div><dt>{t("Blok hacmi")}</dt><dd>{stone.blockVolume}</dd></div>}
            <div><dt>{t("Yüzey seçenekleri")}</dt><dd>{stone.surfaces.map(t).join(", ")}</dd></div>
          </dl>
          <p>{t("Üreticilerin güncel parti fotoğrafları, stok bilgileri ve teknik belgeleri için firma kataloglarını inceleyin. Teklif ve teslim koşullarını doğrudan ilgili firmayla netleştirin.")}</p>
        </section>
        <section className="detail-related" aria-labelledby="stoneGuideTitle">
          <h2 id="stoneGuideTitle">{t("Taş seçimi ve satın alma rehberi")}</h2>
          <p>{t("Ölçü, parti fotoğrafı, yüzey seçimi ve teklif ayrıntıları hakkında bilgi edinin.")}</p>
          <nav aria-label={t("İlgili rehberler")}>
            {stone.city === "Afyonkarahisar" && <Link href={guidePath(locale as GuideLocale,"afyon-mermeri")}>{t("Afyon mermeri seçimi →")}</Link>}
            <Link href={guidePath(locale as GuideLocale,"turkiye-mermer-cesitleri")}>{t("Türkiye doğal taş rehberi →")}</Link>
            <Link href={guidePath(locale as GuideLocale,"mermer-blok-plaka")}>{t("Blok ve plaka farkları →")}</Link>
          </nav>
        </section>
        <section className="detail-related detail-suppliers">
          <h2>{t("Bu taşı kataloglarında yayınlayan firmalar")}</h2>
          {providers.length?<div className="stone-provider-list">{providers.map(company=><a className="stone-provider" href={`/${locale}/firmalar/${company.company_id}`} key={company.company_id}>{publicAssetUrl('mb-company-logos',company.logo_path)&&<img src={publicAssetUrl('mb-company-logos',company.logo_path)} width="64" height="64" alt={`${company.name} ${t("logosu")}`}/>}<span><strong>{company.name}</strong><small>{company.city}</small><b>{t("Firma ve katalog →")}</b></span></a>)}</div>:<p>{suppliersUnavailable?t("Firma ve katalog verileri şu anda alınamıyor. Lütfen tekrar deneyin."):`${stone.name}${t(" adıyla yayınlanmış firma kataloğu henüz bulunmuyor.")}`}</p>}
          <p>{t("Gerçek firma kataloglarını ve ürün fotoğraflarını firma rehberinden inceleyin.")}</p>
          <nav aria-label={t("Firma rehberi")}><a href={directory}>{t("Firma rehberine git →")}</a></nav>
        </section>
        <section className="detail-related">
          <h2>{t("Dizindeki diğer taşlar")}</h2>
          <nav aria-label={t("Diğer doğal taşlar")}>
            {stones.filter((entry) => entry.slug !== stone.slug).map((entry) => (
              <Link key={entry.slug} href={`/${locale}/dogal-tas/${entry.slug}`}>{entry.name}</Link>
            ))}
          </nav>
        </section>
      </main>
      
    </>
  );
}
