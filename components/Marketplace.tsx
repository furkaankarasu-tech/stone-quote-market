import { localizedMarkup, requestDescriptions, type MarketplaceCategory } from "@/lib/marketMarkup";
import { allowIndexing, homeSeo, pageSeo, internationalHomeSeo, internationalCategorySeo, safeJsonLd, siteUrl, absoluteUrl } from "@/lib/seo";
import { stones, stoneDisplayName } from "@/lib/stoneData";
import { services } from "@/lib/serviceData";
import { equipmentCategories } from "@/lib/machineData";
import { publicCompanies, publicCatalog, publicAssetUrl, publicCompanyLogo } from "@/lib/publicDirectory";
import { marketPath, marketRouteSegments, type GuideLocale } from "@/lib/guideRoutes";
import { getSourcingCopy, sourcingPath, buyerJourney, buyerLandingPath, getBuyerLandingCopy } from '@/lib/sourcingContent';
import MarketplaceScripts, { CompanyVisits } from "./MarketplaceScripts";



function buildCollectionSchema(category?: MarketplaceCategory, locale:GuideLocale="tr") {
  if (!category || !(category in pageSeo) || category === "firmalar") return null;
  const url = absoluteUrl(marketPath(locale,category==='dogal-tas'?'stones':category==='hizmetler'?'services':'machines'));
  if (!url) return null;

  const translatedNames = {
    en: {services:['Logistics and transport','Customs broker','Quality inspection','Testing laboratory','Container loading','Packaging'],machines:['Diamond wire saw','Bridge saw','Diamond segments','Stone epoxy','CNC machining centre','Fibreglass mesh']},
    zh: {services:['物流运输','报关代理','质量检验','检测实验室','集装箱装载','包装'],machines:['金刚石绳锯','桥式切割机','金刚石刀头','石材环氧树脂','数控加工中心','玻璃纤维网']},
    ar: {services:['الخدمات اللوجستية والنقل','مخلص جمركي','فحص الجودة','مختبر الاختبارات','تحميل الحاويات','التغليف'],machines:['منشار سلك ماسي','منشار جسري','قطاعات ماسية','إيبوكسي الحجر','مركز تشغيل CNC','شبكة ألياف زجاجية']}
  };
  const items = category === "dogal-tas"
    ? stones.map((stone, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: stoneDisplayName(stone,locale),
        url: absoluteUrl(`/${locale}/dogal-tas/${stone.slug}`),
        description: `${stone.type} · ${stone.city}`
      }))
    : category === "hizmetler"
      ? services.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: locale==='tr'?service.title:translatedNames[locale].services[index],
          ...(locale==='tr'?{description:service.subtitle}:{})
        }))
      : equipmentCategories.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: locale==='tr'?item.title:translatedNames[locale].machines[index],
          ...(locale==='tr'?{description:item.detail}:{})
        }));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: (locale==='tr'?pageSeo:internationalCategorySeo[locale])[category as keyof typeof pageSeo].title,
    description: (locale==='tr'?pageSeo:internationalCategorySeo[locale])[category as keyof typeof pageSeo].description,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items
    }
  };
}

const homepageCategories = [
  { name: "Doğal Taş ve Mermer", path: "/tr/dogal-tas" },
  { name: "Üreticiler ve Tedarikçiler", path: "/tr/firmalar" },
  { name: "Mermer Makineleri ve Sarf Malzemeleri", path: "/tr/makine-sarf" },
  { name: "Doğal Taş Sektörel Hizmetleri", path: "/tr/hizmetler" },
];

function buildHomeSchema() {
  const url = absoluteUrl("/");
  if (!url) return null;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Marble Borsa - B2B Mermer Teklifi ve Doğal Taş Tedariki",
    description: homeSeo.description,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: homepageCategories.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}

export default async function Marketplace({ category, profile = false, locale = "tr" }: { category?: MarketplaceCategory; profile?: boolean; locale?: GuideLocale }) {
  const results = profile || category === "alim-talepleri" ? null : await Promise.allSettled([publicCompanies(), publicCatalog()]);
  const directory = {
    status: results?.[0].status === "fulfilled" ? "ready" : results ? "error" : "idle",
    companies: results?.[0].status === "fulfilled" ? results[0].value.map(row => ({id: row.company_id, profile_slug:row.profile_slug, name: row.name, city: row.city, activity_type: row.activity_type, section: row.section, logo_url: publicCompanyLogo(row)})) : [],
    catalogStatus: results?.[1].status === "fulfilled" ? "ready" : results ? "error" : "idle",
    items: results?.[1].status === "fulfilled" ? results[1].value.map(row => ({...row, image_urls: row.image_paths.map(path => publicAssetUrl("mb-catalog-assets", path)).filter(Boolean), pdf_url: publicAssetUrl("mb-catalog-assets", row.pdf_path)})).filter(row => row.image_urls.length >= 1) : []
  };
  const homeSchema = !profile && !category && locale === "tr" ? buildHomeSchema() : null;
  const collectionSchema = !profile && category ? buildCollectionSchema(category,locale) : null;
  const seoPages=locale==='tr'?pageSeo:internationalCategorySeo[locale];
  const seoHome=locale==='tr'?homeSeo:internationalHomeSeo[locale];
  const buying=getSourcingCopy(locale,'buy');
  return (
    <>
      {!profile && (!category || category === "dogal-tas") && <link rel="preload" as="image" href="/market/images/marble/white.webp" fetchPriority="high" />}
      <div dangerouslySetInnerHTML={{ __html: localizedMarkup(category, profile, directory, locale) }} />
      <script
        type="application/json"
        id="mb-page-seo"
        dangerouslySetInnerHTML={{ __html: safeJsonLd({ requestDescriptions, home: seoHome, homePath: marketPath(locale), routes: marketRouteSegments, pages: seoPages, siteUrl: siteUrl(), allowIndexing: allowIndexing() }) }}
      />
      {category && category in pageSeo && siteUrl() && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
          "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: buying.homeLabel, item: absoluteUrl(marketPath(locale)) },
            { "@type": "ListItem", position: 2, name: seoPages[category as keyof typeof seoPages].title, item: absoluteUrl(marketPath(locale, category === "dogal-tas" ? "stones" : category === "firmalar" ? "companies" : category === "makine-sarf" ? "machines" : "services")) }
          ]
        }) }} />
      )}
      {collectionSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionSchema) }} />
      )}
      {homeSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(homeSchema) }} />
      )}
      {!profile && category!=='alim-talepleri' && <section className="guide-wrap sourcing-entry" lang={locale} dir={locale==='ar'?'rtl':'ltr'}><span className="guide-kicker">{buying.eyebrow}</span><h2>{buying.title}</h2><p>{buying.intro}</p><a className="guide-hero-link" href={sourcingPath('buy',locale)}>{buyerJourney[locale].buy} ↗</a><a className="guide-other-link" href={sourcingPath('quote',locale)}>{getSourcingCopy(locale,'quote').title} ↗</a></section>}
      {locale==='en'&&!profile&&(!category||category==='dogal-tas'||category==='firmalar')&&<nav className="guide-wrap sourcing-entry" aria-label="Turkish marble slab sourcing"><h2>Turkish marble slabs: find suppliers and request quotes</h2><p>Prepare slab sizes, thickness, finish and quantity for a supplier enquiry.</p><a className="guide-hero-link" href={buyerLandingPath('en','slabs')}>{getBuyerLandingCopy('en','slabs').title} ↗</a></nav>}
      {!profile&&(category==='makine-sarf'||category==='hizmetler')&&<CategoryBuyerGuide category={category} locale={locale}/>}
      {category==='firmalar'&&directory.companies.length>0&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd({"@context":"https://schema.org","@type":"ItemList",itemListElement:directory.companies.map((company,i)=>({"@type":"ListItem",position:i+1,name:company.name,url:absoluteUrl(`/${locale}/firmalar/${company.profile_slug||company.id}`)}))})}}/>}
      {profile && <CompanyVisits locale={locale} />}
      <MarketplaceScripts />
    </>
  );
}


function CategoryBuyerGuide({category,locale}:{category:'makine-sarf'|'hizmetler';locale:GuideLocale}){
 const copy={
 tr:{machineTitle:'Makine ve sarf tekliflerini nasıl karşılaştırmalısınız?',serviceTitle:'Hizmet talebinde kapsamı netleştirin',intro:'Kategoriler ihtiyaç tanımlamak içindir. Gerçek model, stok, kapasite, uygunluk ve teslim koşulları ilgili firma tarafından teyit edilir.',machine:[['Elmas tel kesme makinesi','İşlenecek taş, çalışma ortamı, kesim planı, enerji altyapısı, kurulum ve servis kapsamını belirtin. Tel ve sarf uyumluluğunu üreticiyle doğrulayın.'],['Köprü kesim makinesi','Plaka ölçüsü, kesim hassasiyeti beklentisi, kontrol sistemi, yerleşim alanı ve devreye alma gereksinimini yazın. Montaj ve eğitim bedellerini ayırın.'],['Elmas soket ve kesici sarflar','Kesilecek malzeme, takım/bağlantı ölçüsü, makine modeli, çalışma koşulları ve istenen adedi paylaşın. Uyumluluğu yalnız ürün adına göre kabul etmeyin.'],['Taş epoksisi','Kullanım amacı, yüzey, renk beklentisi ve işlem koşullarını tanımlayın. Teknik föy, uygulama talimatı ve güvenlik bilgi formunu isteyin.'],['CNC işleme merkezi','Parça ölçüsü, eksen/işleme ihtiyacı, kullanılacak yazılım, takım altyapısı ve servis planını görüşün. Numune işleme veya kabul testini teklif aşamasında belirleyin.'],['Fiberglas file','Taş ve işlem türü, file ölçüsü, kullanılacak reçine sistemi ve miktarı belirtin. Birlikte kullanılacak ürünlerin uygunluğunu üreticilerinden teyit edin.']],service:[['Nakliye ve lojistik','Çıkış ve varış yeri, tarih, net/brüt ağırlık, kasa ölçüleri ve yükleme/boşaltma sorumluluğunu belirtin.'],['Gümrük müşaviri','Ürün ve işlenme düzeyi, işlem ülkeleri, teslim kapsamı ve belge ihtiyacını paylaşın. Sınıflandırma ve güncel yükümlülükleri müşavirle doğrulayın.'],['Kalite kontrol ve laboratuvar','Kontrol edilecek parti, numune sayısı, şartname ve rapor beklentisini yazın. Görsel inceleme ile laboratuvar deneyini aynı hizmet kabul etmeyin.'],['Yükleme ve paketleme','Kasa/parça listesi, etiketleme, fotoğraf kaydı, ekipman ve saha erişimi gereksinimlerini önceden tanımlayın.']],next:'İlgili alım taleplerini incele',guide:'Lojistik ve teslim rehberi'},
 en:{machineTitle:'Compare machinery and supplies quotations',serviceTitle:'Define the service scope',intro:'Categories help describe requirements. Confirm actual models, stock, capacity, suitability and delivery with the relevant company.',machine:[['Diamond wire equipment','State material, site, cutting plan, energy supply, installation and servicing. Confirm wire and consumable compatibility.'],['Bridge cutting machines','Specify slab sizes, accuracy expectations, controls, available space, commissioning and training scope.'],['Diamond tools and consumables','Provide material, connection dimensions, machine model, operating conditions and quantity. Confirm compatibility with the manufacturer.'],['Stone epoxy','Define application, surface, colour and process conditions. Obtain technical instructions and safety documentation.'],['CNC machinery','Agree piece sizes, processing requirements, software, tooling, support and acceptance testing.'],['Fibreglass mesh','Specify stone, process, mesh dimensions, resin system and quantity. Verify compatibility of the combined products.']],service:[['Logistics','State collection, destination, date, weights, crate dimensions and loading responsibilities.'],['Customs brokerage','Provide product processing, countries, delivery scope and document needs. Confirm classification and current requirements with the broker.'],['Inspection and testing','Identify the lot, specimens, specification and report. Visual inspection and laboratory testing are different services.'],['Loading and packing','Agree piece and crate lists, labelling, photographs, equipment and site access.']],next:'Explore buying requests',guide:'Logistics and delivery guide'},
 zh:{machineTitle:'比较机械与耗材报价',serviceTitle:'明确服务范围',intro:'类别用于描述需求。实际型号、库存、产能、适用性及交付须向相关企业确认。',machine:[['金刚石绳锯设备','说明石材、场地、切割计划、供电、安装及售后，确认绳锯和耗材兼容性。'],['桥式切割机','明确板材尺寸、精度、控制系统、场地及调试培训范围。'],['切割工具与耗材','提供材料、连接尺寸、机器型号、工况及数量，由厂家确认兼容性。'],['石材环氧材料','说明用途、表面、颜色及工艺条件，索取技术说明及安全资料。'],['CNC设备','约定部件尺寸、加工、软件、刀具、支持及验收测试。'],['玻璃纤维网','说明石材、工艺、网尺寸、树脂体系及数量，核实组合产品适用性。']],service:[['物流运输','说明起运地、目的地、日期、重量、箱尺寸和装卸责任。'],['报关服务','提供产品加工程度、国家、交付范围及文件需求，由专业人员确认分类和当前要求。'],['检验与检测','明确批次、试样、规格和报告。外观检验与实验室检测是不同服务。'],['装载及包装','确认部件和箱号清单、标识、照片、设备及场地条件。']],next:'查看采购需求',guide:'物流与交付指南'},
 ar:{machineTitle:'مقارنة عروض الآلات والمستلزمات',serviceTitle:'حدد نطاق الخدمة',intro:'تساعد الفئات في وصف الاحتياج. أكد الطراز والمخزون والسعة والملاءمة والتسليم مع الشركة.',machine:[['معدات السلك الماسي','حدد الحجر والموقع وخطة القطع والطاقة والتركيب والصيانة وتوافق المستلزمات.'],['ماكينات القطع الجسري','حدد أبعاد الألواح والدقة والتحكم والمساحة والتشغيل والتدريب.'],['أدوات القطع والمستلزمات','قدّم المادة وأبعاد الربط وطراز الماكينة وظروف التشغيل والكمية وأكد التوافق.'],['إيبوكسي الحجر','حدد الاستخدام والسطح واللون والظروف واطلب التعليمات الفنية وبيانات السلامة.'],['معدات CNC','اتفق على الأبعاد والمعالجة والبرمجيات والأدوات والدعم واختبار القبول.'],['شبك الألياف الزجاجية','حدد الحجر والعملية وأبعاد الشبك ونظام الراتنج والكمية وأكد توافق المنتجات.']],service:[['النقل واللوجستيات','حدد المصدر والوجهة والتاريخ والأوزان وأبعاد الصناديق ومسؤوليات التحميل.'],['التخليص الجمركي','قدّم المنتج والتجهيز والدول ونطاق التسليم والوثائق وأكد التصنيف والمتطلبات مع المختص.'],['الفحص والاختبارات','حدد الدفعة والعينات والمواصفات والتقرير؛ الفحص البصري يختلف عن اختبار المختبر.'],['التحميل والتعبئة','اتفق على قوائم القطع والصناديق والعلامات والصور والمعدات والوصول للموقع.']],next:'استعرض طلبات الشراء',guide:'دليل النقل والتسليم'}
 }[locale];
 const isMachine=category==='makine-sarf';
 return <section className="guide-wrap category-buyer-guide"><h2>{isMachine?copy.machineTitle:copy.serviceTitle}</h2><p>{copy.intro}</p><div className="category-guide-grid">{(isMachine?copy.machine:copy.service).map(([title,body])=><article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div><nav><a href={marketPath(locale,'requests')}>{copy.next} ↗</a><a href={locale==='tr'?'/tr/rehber/mermer-lojistik-paketleme':`/${locale}/guide/mermer-lojistik-paketleme`}>{copy.guide} ↗</a></nav></section>;
}
