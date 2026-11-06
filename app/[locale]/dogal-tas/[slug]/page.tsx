import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl, buildMetadata, safeJsonLd, stoneDescription } from "@/lib/seo";
import { publicCompanies, publicCatalog, publicAssetUrl } from "@/lib/publicDirectory";
import { stones, stoneDisplayName, stoneEditorial, stoneReviewDate, type Stone } from "@/lib/stoneData";
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
    title: locale==="tr"?`${stoneDisplayName(stone)} | Blok ve Plaka`:`${stone.name} | ${text(locale,"Formatlar")} · ${text(locale,"Taş bilgileri")}`,
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
  const displayName=stoneDisplayName(stone,locale);
  const category=marketPath(locale as GuideLocale,"stones");
  const directory=marketPath(locale as GuideLocale,"companies");
  const published=await Promise.allSettled([publicCompanies(),publicCatalog()]);
  const normalize=(value:string)=>value.toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/g,' ').trim();
  const matching=published[1].status==='fulfilled'?published[1].value.filter(item=>item.category==='stone'&&[stone.name,stone.turkishName||stone.name,...(stone.aliases||[])].some(name=>(` ${normalize(item.title)} `).includes(` ${normalize(name)} `))):[];
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
      { "@type": "ListItem", position: 3, name: displayName, item: absoluteUrl(`/${locale}/dogal-tas/${stone.slug}`) },
    ],
  };

  return (
    <>
      {origin && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumb) }} />}
      
      <main id="main-content" tabIndex={-1} className="detail-main" lang={locale} dir={locale==="ar"?"rtl":"ltr"}>
        <nav aria-label={t("İçerik yolu")} className="detail-crumb">
          <a href={`/${locale}`}>{t("Ana Sayfa")}</a><span>/</span><a href={category}>{t("Doğal Taş")}</a><span>/</span>{displayName}
        </nav>
        <article className="detail-card">
          <div className="detail-visual-group">
            <div className="detail-preview-rail" aria-label={t("Taş görselleri")}>
              <div className="detail-preview-thumb is-selected"><img src={`/market/images/marble/${stone.image}`} alt={t("Plaka sunumu küçük görsel")} loading="lazy" width="90" height="110" /></div>
              <div className="detail-preview-thumb is-texture" style={{ backgroundPosition: texturePosition }} role="img" aria-label={t("Yakın taş dokusu")} />
            </div>
            <figure className="detail-photo">
              <img src={`/market/images/marble/${stone.image}`} alt={`${displayName} ${t("doğal taş koleksiyonu")}`} width="1000" height="730" fetchPriority="high" />
              <figcaption>{({tr:"Temsili taş görünümü; satışa sunulan parti fotoğrafı değildir.",en:"Illustrative stone appearance; not a photograph of an offered batch.",zh:"示意石材外观，并非在售批次照片。",ar:"مظهر توضيحي للحجر وليس صورة لدفعة معروضة للبيع."})[locale as GuideLocale]}</figcaption>
            </figure>
          </div>
          <div className="detail-info">
            <span className="eyebrow dark">{t("DOĞAL TAŞ DİZİNİ")} · {stone.city.toLocaleUpperCase("tr-TR")}</span>
            <h1>{displayName}</h1>
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
        <StoneBuyerDetails stone={stone} locale={locale as GuideLocale} />
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
          {providers.length?<div className="stone-provider-list">{providers.map(company=><a className="stone-provider" href={`/${locale}/firmalar/${company.profile_slug||company.company_id}`} key={company.company_id}>{publicAssetUrl('mb-company-logos',company.logo_path)&&<img src={publicAssetUrl('mb-company-logos',company.logo_path)} width="64" height="64" alt={`${company.name} ${t("logosu")}`}/>}<span><strong>{company.name}</strong><small>{company.city}</small><b>{t("Firma ve katalog →")}</b></span></a>)}</div>:<p>{suppliersUnavailable?t("Firma ve katalog verileri şu anda alınamıyor. Lütfen tekrar deneyin."):`${stone.name}${t(" adıyla yayınlanmış firma kataloğu henüz bulunmuyor.")}`}</p>}
          <p>{t("Gerçek firma kataloglarını ve ürün fotoğraflarını firma rehberinden inceleyin.")}</p>
          <nav aria-label={t("Firma rehberi")}><a href={directory}>{t("Firma rehberine git →")}</a></nav>
        </section>
        <section className="detail-related">
          <h2>{t("Dizindeki diğer taşlar")}</h2>
          <nav aria-label={t("Diğer doğal taşlar")}>
            {stones.filter((entry) => entry.slug !== stone.slug).map((entry) => (
              <Link key={entry.slug} href={`/${locale}/dogal-tas/${entry.slug}`}>{stoneDisplayName(entry,locale)}</Link>
            ))}
          </nav>
        </section>
      </main>
      
    </>
  );
}


const stoneBuyerCopy={
 tr:{selection:'Parti ve plaka seçimi',use:'Kullanım alanını nasıl değerlendirmeli?',order:'Sipariş kontrol listesi',technical:'Teknik raporda hangi bilgiler aranmalı?',technicalNote:'Bu sayfa bir ürün partisine ait laboratuvar sertifikası değildir. Yoğunluk, su emme ve dayanım için doğrulanmamış tek bir sayı vermiyoruz. Tedarikçiden seçtiğiniz ocak/parti ve uygulama koşullarını temsil eden raporu isteyin; standart sürümünü ve uygunluk sınırını proje uzmanıyla doğrulayın.',columns:['Kontrol','Yöntem / belge','İstenecek bilgi'],rows:[['Yoğunluk ve gözeneklilik','EN 1936','Numune kaynağı ve raporlanan değerler'],['Atmosfer basıncında su emme','EN 13755','Deney koşulları ve numune bilgisi'],['Eğilme dayanımı','EN 12372','Yükleme yönü, numune ve sonuçlar']],dimensions:'Ebat ve kalınlık nasıl belirlenir?',dimensionBody:'Talebinizde örneğin 60 × 60 cm ebat, 20 mm veya 30 mm kalınlık gibi hedef ölçüleri açıkça yazabilirsiniz. Bunlar sipariş tarifine örnektir; bu taşın standart stoku veya her uygulamaya uygun kalınlık iddiası değildir. Kesim toleransı, altlık, sabitleme sistemi ve kullanılabilir plaka ölçüsü proje ve tedarikçiyle birlikte belirlenir. Blok için net boyut, hacim veya ağırlık ayrıca teyit edilir.',faq:'Sık sorulan sorular',questions:['Bu taşın fiyatı neden sabit değil?','Fotoğraftaki taş doğrudan satın alınabilir mi?','Ocak ve test bilgisi nasıl doğrulanır?'],answers:['Fiyat; seçilen parti, kullanılabilir ölçü, yüzey işlemi, miktar, işçilik ve teslim kapsamına göre değişir. Aynı ölçü ve koşullarda güncel firma teklifi isteyin.','Bu sayfadaki görseller taş görünümünü anlatır. Sipariş için firmanın gerçek parti fotoğraflarını, numunesini ve yazılı teklifini onaylamalısınız.','Kaynak/ocak tanımını, parti numarasını ve rapordaki numune bilgisini karşılaştırın. Bir ticari ad, tek başına belirli bir ocağa veya performans değerine garanti değildir.'],sources:'Yöntem kaynakları',updated:'İçerik kontrol tarihi',care:'Bakım planı',careBody:'Kireç esaslı taşlarda asitli temizleyiciler yüzeyi matlaştırabilir. Taşa uygun bakım ürününü küçük bir alanda deneyin; uygulayıcı ve ürün üreticisinin bakım talimatını izleyin.'},
 en:{selection:'Selecting the production lot',use:'Assessing the intended application',order:'Order checklist',technical:'Technical reports to request',technicalNote:'This page is not a laboratory certificate for a particular batch. Ask the supplier for reports representing the selected source and material, including specimen identification and test conditions. Confirm the applicable edition and project requirements with your specialist.',columns:['Check','Method / document','Information to request'],rows:[['Density and porosity','EN 1936','Specimen source and reported results'],['Water absorption at atmospheric pressure','EN 13755','Test conditions and specimen identification'],['Flexural strength','EN 12372','Loading direction, specimens and results']],dimensions:'Dimensions and thickness',dimensionBody:'Describe target dimensions explicitly, for example 60 × 60 cm pieces and 20 mm or 30 mm thickness. These are specification examples, not available stock or a universal design recommendation. Confirm cutting tolerances, substrate, fixing system and usable slab dimensions with the project team and supplier. For blocks, agree net dimensions and weight or volume separately.',faq:'Frequently asked questions',questions:['Why is there no fixed price?','Can I buy the material shown in the image?','How do I verify quarry and test information?'],answers:['Lot, usable dimensions, finish, quantity, processing and delivery scope affect the offer. Compare current quotations on the same specification.','The image illustrates appearance. Approve the supplier’s actual lot photographs, sample and written offer before ordering.','Match source identification, lot numbers and test specimens. A trade name does not guarantee a particular quarry or fixed performance.'],sources:'Method references',updated:'Content reviewed',care:'Care planning',careBody:'Acidic cleaners can etch calcareous stone. Follow material-specific maintenance instructions and test a suitable product in a small area.'},
 zh:{selection:'选择实际生产批次',use:'评估应用场景',order:'订单核对清单',technical:'应索取哪些检测报告？',technicalNote:'本页并非某一批次的实验室证书。请向供应商索取与所选来源及材料对应的报告，并核对试样标识和检测条件。适用版本和项目要求须由专业人员确认。',columns:['检查项目','方法／文件','应索取的信息'],rows:[['密度与孔隙率','EN 1936','试样来源及报告结果'],['常压吸水率','EN 13755','检测条件和试样标识'],['抗弯强度','EN 12372','加载方向、试样及结果']],dimensions:'尺寸与厚度',dimensionBody:'请明确目标尺寸，例如60×60厘米、20或30毫米厚。这些仅是需求描述示例，并非库存或通用设计建议。切割公差、基层、固定系统和可用板面须由项目团队及供应商确认。荒料须另行确认净尺寸及重量或体积。',faq:'常见问题',questions:['为什么没有固定价格？','能直接购买图片中的石材吗？','如何核实矿源和检测信息？'],answers:['批次、可用尺寸、表面、数量、加工和交付范围会影响报价。请按相同规格比较当前供应商报价。','图片仅说明外观。下单前应确认供应商的实际批次照片、样品和书面报价。','请核对来源标识、批次编号和检测试样。商业名称不能保证特定矿山或固定性能。'],sources:'方法参考资料',updated:'内容核查日期',care:'养护计划',careBody:'酸性清洁剂可能腐蚀钙质石材。请遵循材料专用养护说明，并先在小范围测试合适产品。'},
 ar:{selection:'اختيار دفعة الإنتاج',use:'تقييم مجال الاستخدام',order:'قائمة مراجعة الطلب',technical:'التقارير الفنية المطلوبة',technicalNote:'هذه الصفحة ليست شهادة مختبر لدفعة محددة. اطلب تقارير تمثل المصدر والمادة المختارين، مع هوية العينة وظروف الاختبار. أكد الإصدار المطبق ومتطلبات المشروع مع المختص.',columns:['الفحص','الطريقة أو الوثيقة','المعلومات المطلوبة'],rows:[['الكثافة والمسامية','EN 1936','مصدر العينة والنتائج'],['امتصاص الماء عند الضغط الجوي','EN 13755','ظروف الاختبار وهوية العينة'],['مقاومة الانحناء','EN 12372','اتجاه التحميل والعينات والنتائج']],dimensions:'الأبعاد والسماكة',dimensionBody:'حدد الأبعاد المطلوبة بوضوح، مثل قطع 60 × 60 سم وسماكة 20 أو 30 مم. هذه أمثلة لوصف الطلب وليست مخزوناً متاحاً أو توصية تصميمية عامة. أكد تفاوتات القطع والقاعدة ونظام التثبيت وأبعاد اللوح القابلة للاستخدام مع فريق المشروع والمورد. وللكتل أكد الأبعاد الصافية والوزن أو الحجم بشكل منفصل.',faq:'أسئلة شائعة',questions:['لماذا لا يوجد سعر ثابت؟','هل يمكن شراء الحجر الظاهر في الصورة مباشرة؟','كيف أتحقق من المصدر والاختبارات؟'],answers:['تؤثر الدفعة والأبعاد والتشطيب والكمية والتجهيز ونطاق التسليم في العرض. قارن عروضاً حديثة بالمواصفات نفسها.','الصورة توضيحية للمظهر. وافق على صور الدفعة الحقيقية والعينة والعرض المكتوب قبل الطلب.','طابق تعريف المصدر ورقم الدفعة وهوية العينة. الاسم التجاري لا يضمن محجراً محدداً أو أداءً ثابتاً.'],sources:'مراجع طرق الفحص',updated:'تاريخ مراجعة المحتوى',care:'خطة العناية',careBody:'قد تؤثر المنظفات الحمضية في سطح الحجر الجيري التركيب. اتبع تعليمات العناية الخاصة بالمادة وجرب المنتج المناسب على مساحة صغيرة.'}
};
const stoneEnglishSelection:Record<string,string>={
 'afyon-white':'Compare the white background and grey vein distribution across full, numbered slabs. A small sample does not show how adjacent pieces will look across a large surface.',
 'afyon-sugar':'Assess the warm cream-to-white tone under the intended lighting. Compare dry, finished samples from the actual lot rather than relying on wet photographs.',
 'afyon-violet':'Agree the violet vein direction and slab sequence before cutting. If bookmatching is required, approve a full layout and the areas that must be preserved.',
 'afyon-grey':'Compare light-to-dark transitions across several slabs. Agree an acceptable colour range and reserve replacement material from the same lot where possible.',
 'burdur-beige':'Compare beige tone, veining and net usable area. Define calibration, edge treatment and piece labels when ordering cut-to-size material.',
 'bilecik-beige':'Choose blocks, slabs or cut-to-size pieces according to processing capacity. Agree block inspection, usable slab area or approved piece drawings accordingly.',
 'mugla-white':'Verify the source and lot instead of treating all white marble trade names as equivalent. Match the laboratory specimen with the material being offered.',
 'marmara-white':'Plan the direction and continuity of grey stripes across adjoining pieces and corners. Use matching numbers on the layout, pieces and packing list.',
 'denizli-travertine':'Specify cut direction, filling preference and finish together. Compare filled and unfilled samples, and confirm the permitted surface variation before ordering.'};
function StoneBuyerDetails({stone,locale}:{stone:Stone;locale:GuideLocale}){
 const w=stoneBuyerCopy[locale],editorial=stoneEditorial[stone.slug];
 const localized=locale==='en'?stoneEnglishSelection[stone.slug]:locale==='zh'?`${stone.name} 的采购应围绕实际批次、颜色与纹理一致性展开。请索取完整板面及边缘照片，确认表面、切割方向和样品，避免仅凭一张示意图下单。`:`عند شراء ${stone.name} قارن الدفعة الفعلية وتجانس اللون والعروق. اطلب صور الألواح كاملة والحواف وأكد التشطيب واتجاه القطع والعينة قبل الطلب.`;
 return <section className="detail-related stone-buyer-guide">
 <h2>{stoneDisplayName(stone,locale)} · {w.selection}</h2><p>{locale==='tr'?editorial.selection:localized}</p>
 <h3>{w.use}</h3><p>{locale==='tr'?editorial.application:({en:'Assess floors, walls and fabricated pieces against the intended use, fixing system and project specification. Exterior and wet-area suitability requires separate evaluation; colour or finish alone does not establish suitability.',zh:'地面、墙面及加工件应结合实际用途、固定系统和项目要求评估。室外及湿区须单独核实适用性，颜色或表面本身不能证明适用。',ar:'قيّم الأرضيات والجدران والقطع المصنعة وفق الاستخدام ونظام التثبيت ومواصفات المشروع. تتطلب المناطق الخارجية والرطبة تقييماً منفصلاً؛ اللون والتشطيب وحدهما لا يثبتان الملاءمة.'})[locale]}</p>
 <h3>{w.order}</h3><p>{locale==='tr'?editorial.check:({en:'Record the source, lot numbers, actual photographs, tolerances, finish, repairs, packing list and delivery scope in the quotation. Confirm usable quantity and production timing before committing.',zh:'请在报价中记录来源、批次编号、实际照片、公差、表面、修补、装箱单及交付范围，并在下单前核实可用数量及生产周期。',ar:'سجّل المصدر وأرقام الدفعة والصور الفعلية والتفاوتات والتشطيب والإصلاحات وقائمة التعبئة ونطاق التسليم في العرض، وأكد الكمية القابلة للاستخدام ومدة الإنتاج قبل الالتزام.'})[locale]}</p>
 <h3>{w.dimensions}</h3><p>{w.dimensionBody}</p>
 <h3>{w.technical}</h3><p>{w.technicalNote}</p><div className="seo-table-scroll"><table><thead><tr>{w.columns.map(label=><th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{w.rows.map(row=><tr key={row[1]}>{row.map(cell=><td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
 <h3>{w.care}</h3><p>{w.careBody}</p>
 <h3>{w.faq}</h3>{w.questions.map((question,i)=><details key={question}><summary>{question}</summary><p>{w.answers[i]}</p></details>)}
 <p className="editorial-date">{w.updated}: <time dateTime={stoneReviewDate}>{stoneReviewDate}</time> · Marble Borsa</p>
 <nav aria-label={w.sources}><a href="https://knowledge.bsigroup.com/products/natural-stone-test-methods-determination-of-real-density-and-apparent-density-and-of-total-and-open-porosity" target="_blank" rel="noopener noreferrer">BSI · EN 1936 ↗</a><a href="https://knowledge.bsigroup.com/products/natural-stone-test-methods-determination-of-water-absorption-at-atmospheric-pressure" target="_blank" rel="noopener noreferrer">BSI · EN 13755 ↗</a><a href="https://knowledge.bsigroup.com/products/natural-stone-test-methods-determination-of-flexural-strength-under-concentrated-load-2" target="_blank" rel="noopener noreferrer">BSI · EN 12372 ↗</a><a href="https://www.naturalstoneinstitute.org/consumers/care/" target="_blank" rel="noopener noreferrer">Natural Stone Institute ↗</a></nav>
 </section>;
}
