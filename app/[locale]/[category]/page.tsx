export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dataController } from "@/lib/dataController";
import Marketplace from "@/components/Marketplace";
import SourcingPage from "@/components/SourcingPage";
import { absoluteUrl, buildMetadata, pageSeo, internationalCategorySeo, safeJsonLd } from "@/lib/seo";
import { buyerLandingPages, buyerLandingKinds, buyerLandingPath, buyerLandingRoute, buyerLandingAlternates, getBuyerLandingCopy, sourcingLocales, sourcingTopics, sourcingPath, sourcingRoute, sourcingAlternates, getSourcingCopy } from "@/lib/sourcingContent";
import { marketRouteSegments, marketPath, marketAlternates, type MarketTab } from "@/lib/guideRoutes";
import type { GuideLocale } from "@/lib/guideRoutes";

type Route = { locale: string; category: string };
const locales = ["tr","en","zh","ar"];
const categoryKeys={stones:"dogal-tas",companies:"firmalar",machines:"makine-sarf",services:"hizmetler",requests:"alim-talepleri"} as const;
const information = {
  "firmalar-icin": {title:"Mermer Firmaları İçin B2B Üyelik | Marble Borsa", description:"Firma profilinizi, logonuzu ve ürün kataloğunuzu yayınlayın; işletmenize uygun alım taleplerini inceleyin."},
  "hakkimizda": {title:"Marble Borsa Hakkında | B2B Doğal Taş Platformu", description:"Doğal taş, makine, sarf ve sektör hizmetleri için doğrudan B2B keşif ve teklif platformu."},
  "iletisim": {title:"Marble Borsa İletişim", description:"Marble Borsa üyelik, firma görünürlüğü ve iş birliği konularında iletişim."}
} as const;
const informationAlternates = (category: string) => ({
  ...Object.fromEntries(locales.map(locale => [locale === "zh" ? "zh-CN" : locale, `/${locale}/${category}`])),
  "x-default": `/tr/${category}`,
});
const infoCopy={
 en:{titles:["For Companies","About Marble Borsa","Contact"],desc:["Publish your company profile, logo and catalogue; discover buying requests relevant to your business.","A B2B discovery and quote platform for natural stone, machinery, supplies and industry services.","Contact Marble Borsa about membership, catalogues, support and partnerships."],steps:["Apply as a producer, supplier or service provider.","Confirm your email. The administrator reviews your company application.","After approval and membership activation, enable directory visibility and upload your logo in Profile.","Publish your products or services in your catalogue to appear in the relevant categories."],model:"Suppliers respond to natural stone requests; service companies respond to service requests. Active suppliers can request services and machinery/supplies.",about:"Companies share catalogues and buyers describe their needs, receive quotes and contact companies directly. Marble Borsa does not sell marble on its own behalf. Stock, quality, delivery and payment terms are agreed by the trading parties.",support:"For membership, catalogues, technical support or partnerships, email us. Include the page address and a short description of your issue. Do not share passwords or verification codes.",profile:"Manage your company profile",requests:"View buying requests"},
 zh:{titles:["企业会员","关于Marble Borsa","联系我们"],desc:["发布企业资料、标志和目录，查看适合您企业的采购需求。","天然石材、机械、耗材和行业服务的企业间发现与询价平台。","联系Marble Borsa咨询会员、目录、支持与合作。"],steps:["以生产商、供应商或服务商身份申请。","验证邮箱，管理员审核企业申请。","审核通过且会员生效后，在个人资料中开启名录展示并上传标志。","在目录中发布产品或服务，在相应类别展示。"],model:"供应商回应石材需求，服务企业回应服务需求。有效会员供应商可以发布服务及机械耗材采购需求。",about:"企业分享目录，买家说明需求、接收报价并直接联系企业。Marble Borsa不以自身名义销售石材。库存、质量、交付和付款条件由交易双方约定。",support:"会员、目录、技术支持或合作问题请发送邮件，并附上页面地址和问题简述。请勿分享密码或验证码。",profile:"管理企业资料",requests:"查看采购需求"},
 ar:{titles:["للشركات","عن Marble Borsa","اتصل بنا"],desc:["انشر ملف شركتك وشعارها وكتالوجها واكتشف طلبات الشراء المناسبة لنشاطك.","منصة اكتشاف وطلبات أسعار بين الشركات للحجر الطبيعي والمعدات واللوازم والخدمات.","تواصل معنا بشأن العضوية والكتالوجات والدعم والشراكات."],steps:["قدّم طلبًا كمنتج أو مورد أو مقدم خدمات.","أكّد بريدك الإلكتروني؛ يراجع المسؤول طلب الشركة.","بعد الموافقة وتفعيل العضوية، فعّل الظهور في الدليل وارفع شعارك من الملف الشخصي.","انشر منتجاتك أو خدماتك في الكتالوج للظهور في الفئات المناسبة."],model:"يرد الموردون على طلبات الحجر الطبيعي، وشركات الخدمات على طلبات الخدمات. يمكن للموردين ذوي العضوية الفعالة طلب الخدمات والمعدات واللوازم.",about:"تشارك الشركات كتالوجاتها ويحدد المشترون احتياجاتهم ويتلقون العروض ويتواصلون مباشرة مع الشركات. لا تبيع Marble Borsa الرخام باسمها؛ يتفق طرفا التجارة على المخزون والجودة والتسليم والدفع.",support:"للعضوية والكتالوج والدعم والشراكات، راسلنا بعنوان الصفحة ووصف مختصر للمشكلة. لا تشارك كلمات المرور أو رموز التحقق.",profile:"إدارة ملف الشركة",requests:"عرض طلبات الشراء"}
} as const;
export function generateStaticParams(): Route[] {
  return [...sourcingLocales.flatMap(locale=>buyerLandingKinds.map(kind=>({locale,category:buyerLandingPath(locale,kind).split("/").at(-1)!}))), {locale:"tr",category:"firma-kayit-rehberi"}, ...locales.flatMap(locale=>Object.keys(information).map(category=>({locale,category}))), ...locales.flatMap((locale) => Object.entries(marketRouteSegments[locale as GuideLocale]).filter(([tab])=>!(locale==='tr'&&tab==='requests')).map(([, category]) => ({ locale, category }))), ...sourcingLocales.flatMap(locale => sourcingTopics.map(topic => ({locale, category: sourcingPath(topic,locale).split("/").at(-1)!})))];
}

export async function generateMetadata({ params }: { params: Promise<Route> }): Promise<Metadata> {
  const { locale, category: segment } = await params;
  const landingKind=buyerLandingRoute(locale,segment);
  if (landingKind) {const lang=locale as GuideLocale;const copy=getBuyerLandingCopy(lang,landingKind);return buildMetadata({...copy,title:copy.seoTitle||copy.title,path:buyerLandingPath(lang,landingKind),languages:buyerLandingAlternates(landingKind),locale:lang==='en'?'en_US':lang==='zh'?'zh_CN':lang==='ar'?'ar_AR':'tr_TR'});}
  if (locale === "tr" && segment === "firma-kayit-rehberi") return companyGuideMetadata;
  const map=marketRouteSegments[locale as GuideLocale];
  const tab=map?Object.keys(map).find(key=>map[key as MarketTab]===segment) as MarketTab|undefined:undefined;
  const category=tab?categoryKeys[tab]:segment;
  if(locale!=="tr" && locale in infoCopy && category in information){const copy=infoCopy[locale as keyof typeof infoCopy],index=Object.keys(information).indexOf(category);return buildMetadata({title:copy.titles[index]+" | Marble Borsa",description:copy.desc[index],path:`/${locale}/${category}`,languages:informationAlternates(category),locale:locale==='en'?'en_US':locale==='zh'?'zh_CN':'ar_AR'})}
  if (locale === "tr" && category in information) return buildMetadata({...information[category as keyof typeof information], path:`/tr/${category}`,languages:informationAlternates(category)});
  const topic = sourcingRoute(locale,category);
  if(topic) {
    const copy=getSourcingCopy(locale as GuideLocale,topic);
    return buildMetadata({title:copy.title,description:copy.description,path:sourcingPath(topic,locale as GuideLocale),
      locale:locale==='en'?'en_US':locale==='zh'?'zh_CN':locale==='ar'?'ar_AR':'tr_TR',languages:sourcingAlternates(topic)});
  }
  if(tab && locale!=="tr") {
    const localized=internationalCategorySeo[locale as 'en'|'zh'|'ar'];
    const seo=tab==='requests'?{title:({en:'Buying Requests',zh:'采购需求',ar:'طلبات الشراء'})[locale as 'en'|'zh'|'ar'],description:({en:'Sign in with an eligible company account to view buying requests.',zh:'使用符合条件的企业账户登录以查看采购需求。',ar:'سجل الدخول بحساب شركة مؤهل لعرض طلبات الشراء.'})[locale as 'en'|'zh'|'ar']}:localized[categoryKeys[tab] as keyof typeof localized];
    return {...buildMetadata({...seo,path:marketPath(locale as GuideLocale,tab),languages:marketAlternates(tab),locale:locale==='en'?'en_US':locale==='zh'?'zh_CN':'ar_AR'}),...(tab==='requests'?{robots:{index:false,follow:false}}:{})};
  }
  const seo = pageSeo[category as keyof typeof pageSeo];
  if (!locales.includes(locale) || !seo) return {};
  return buildMetadata({ ...seo, path: `/${locale}/${category}`, languages: tab?marketAlternates(tab):undefined });
}

export default async function CategoryPage({ params }: { params: Promise<Route> }) {
  const { locale, category: segment } = await params;
  const landingKind=buyerLandingRoute(locale,segment);
  if (landingKind) return <SourcingPage locale={locale as GuideLocale} topic="buy" copy={getBuyerLandingCopy(locale as GuideLocale,landingKind)} />;
  if (locale === "tr" && segment === "firma-kayit-rehberi") return <CompanyGuide />;
  const map=marketRouteSegments[locale as GuideLocale];
  const tab=map?Object.keys(map).find(key=>map[key as MarketTab]===segment) as MarketTab|undefined:undefined;
  const category=tab?categoryKeys[tab]:segment;
  if(locale!=="tr" && locale in infoCopy && category in information){
    const copy=infoCopy[locale as keyof typeof infoCopy],index=Object.keys(information).indexOf(category);
    return <main id="main-content" className="guide-wrap guide-article-layout" lang={locale} dir={locale==="ar"?"rtl":"ltr"}><article className="guide-article"><span className="guide-kicker">MARBLE BORSA</span><h1>{copy.titles[index]}</h1><p>{copy.desc[index]}</p>{index===0?<><ol>{copy.steps.map(step=><li key={step}>{step}</li>)}</ol><p>{copy.model}</p><p><a href={`/${locale}/profil`}>{copy.profile} →</a></p><a href={marketPath(locale as GuideLocale,"requests")}>{copy.requests} →</a></>:index===1?<p>{copy.about}</p>:<><p>Afyonkarahisar · Türkiye</p><p>{copy.support}</p><a href="mailto:info@marbleborsa.com">info@marbleborsa.com</a><nav className="contact-social-links" aria-label="Social media"><a href="https://www.instagram.com/marbleborsa/" target="_blank" rel="noopener noreferrer">Instagram · @marbleborsa ↗</a><a href={/^https:\/\/(www\.)?linkedin\.com\/(?:company|in)\//.test(process.env.NEXT_PUBLIC_LINKEDIN_URL||'')?process.env.NEXT_PUBLIC_LINKEDIN_URL:'https://www.linkedin.com/in/marble-borsa/'} target="_blank" rel="noopener noreferrer">LinkedIn · Marble Borsa ↗</a></nav></>}{(category==='iletisim'||category==='hakkimizda')&&<VerifiedContactDetails locale={locale as GuideLocale}/>}
    {category==='hakkimizda'&&<AboutEditorial locale={locale as GuideLocale}/>}
    </article></main>;
  }
  if (locale === "tr" && category in information) {
    const content = information[category as keyof typeof information];
    return <><main id="main-content" className="guide-wrap guide-article-layout"><article className="guide-article"><span className="guide-kicker">MARBLE BORSA</span><h1>{{"firmalar-icin":"Firmalar için Marble Borsa","hakkimizda":"Marble Borsa hakkında","iletisim":"İletişim"}[category as keyof typeof information]}</h1><p>{content.description}</p>
      {category === "firmalar-icin" ? <><h2>Firmanızı görünür hale getirin</h2><ol><li>Üretici, tedarikçi veya hizmet sağlayıcı olarak üyelik başvurunuzu tamamlayın.</li><li>E-postanızı doğrulayın. Firma başvurusu yönetim tarafından incelenir.</li><li>Onay ve aktif üyelik sonrasında Profil sayfasından rehber görünürlüğünü açın. İsterseniz logonuzu yükleyin; hizmet firmalarında logo zorunlu değildir.</li><li>Ürün ve hizmetlerinizi katalog alanında yayınlayın. Firma rehberi ve ilgili kategorilerde görünür olun.</li></ol><h2>İşletmenize uygun talepler</h2><p>Doğal taş alım taleplerini tedarikçiler, hizmet taleplerini hizmet firmaları yanıtlar. Aktif tedarikçiler hizmet alımı ve makine/sarf talebi açabilir.</p><p><a href="/tr/profil">Üyelik ve firma profilini yönet →</a></p><a href="/tr/alim-talepleri">Alım taleplerini incele →</a></> : category === "hakkimizda" ? <><h2>Doğrudan firma bağlantısı</h2><p>Marble Borsa, doğal taş sektöründeki alıcılarla üretici, tedarikçi ve hizmet sağlayıcıları buluşturmak için geliştirildi. Firmalar kataloglarını paylaşır, alıcılar ihtiyaçlarını belirtir ve teklifler üzerinden taraflarla doğrudan iletişim kurar.</p><p>Platform kendi adına mermer satmaz. Stok, kalite, teslimat ve ödeme koşulları ticaretin taraflarınca belirlenir.</p><a href="/tr/firmalar-icin">Firmalar için çalışma modeli →</a></> : <><h2>Bize ulaşın</h2><p>Afyonkarahisar · Türkiye</p><p>Üyelik, katalog yayınlama, teknik destek ve iş birliği için aşağıdaki adres üzerinden iletişim kurabilirsiniz.</p><p><a href="mailto:info@marbleborsa.com">info@marbleborsa.com</a></p><nav className="contact-social-links" aria-label="Social media"><a href="https://www.instagram.com/marbleborsa/" target="_blank" rel="noopener noreferrer">Instagram · @marbleborsa ↗</a><a href={/^https:\/\/(www\.)?linkedin\.com\/(?:company|in)\//.test(process.env.NEXT_PUBLIC_LINKEDIN_URL||'')?process.env.NEXT_PUBLIC_LINKEDIN_URL:'https://www.linkedin.com/in/marble-borsa/'} target="_blank" rel="noopener noreferrer">LinkedIn · Marble Borsa ↗</a></nav><p>Firma görünürlüğü, üyelik veya teknik sorunlar için sayfa adresini ve sorunun kısa açıklamasını iletebilirsiniz. Şifrenizi veya doğrulama kodunuzu paylaşmayın.</p></>}
    {(category==='iletisim'||category==='hakkimizda')&&<VerifiedContactDetails locale={locale as GuideLocale}/>}
    {category==='hakkimizda'&&<AboutEditorial locale={locale as GuideLocale}/>}
    </article></main></>;
  }
  const topic=sourcingRoute(locale,category);
  if(topic) {
    const lang=locale as GuideLocale;
    const path=sourcingPath(topic,lang);
    const copy=getSourcingCopy(lang,topic);
    const breadcrumb={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[
      {"@type":"ListItem",position:1,name:copy.homeLabel,item:absoluteUrl(marketPath(lang))},
      {"@type":"ListItem",position:2,name:copy.title,item:absoluteUrl(path)}
    ]};
    return <>{absoluteUrl("/")&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(breadcrumb)}}/>}<SourcingPage topic={topic} locale={lang}/></>;
  }
  if (!locales.includes(locale) || (!(category in pageSeo) && category!=="alim-talepleri")) notFound();
  // Breadcrumb/collection JSON-LD are rendered once by Marketplace.
  // Duplicating them here caused two conflicting JSON-LD blocks per category.
  return <Marketplace category={category as keyof typeof pageSeo} locale={locale as GuideLocale} />;
}

import { CompanyGuideTools } from "@/components/Header";

const companyGuideMetadata = buildMetadata({
  title: "Firma Kaydı ve Ürün Fotoğrafı Yükleme Rehberi | Marble Borsa",
  description: "Marble Borsa firma başvurusu, profil ve katalog hazırlama adımları. Mermer, plaka ve blok fotoğrafları için çekim açısı, ışık ve dosya önerileri.",
  path: "/tr/firma-kayit-rehberi",
});

const sections = [
  { id: "kayit", title: "1. Firma hesabınızı oluşturun", items: [
    "Üye Ol alanında önce faaliyetiniz için uygun hesap türünü seçin. Taş, makine veya sarf satıyorsanız Üretici / Tedarikçi; lojistik, gümrükleme ve benzeri hizmetler sunuyorsanız Hizmet Sağlayıcı hesabıyla başvurun. Alıcı hesabı satın alma ihtiyaçları içindir.",
    "Formdaki firma ve iletişim bilgilerini eksiksiz girin. Firma unvanınızı resmi kayıtlardaki biçimiyle yazın; erişebildiğiniz bir e-posta adresi kullanın.",
    "İlgili metinleri inceleyip formdaki gerekli onayları tamamlayın. Gelen doğrulama e-postasındaki bağlantıyı açın; mesaj görünmüyorsa spam klasörünü kontrol edin.",
  ] },
  { id: "onay", title: "2. Başvuru ve üyelik durumunu takip edin", items: [
    "E-posta doğrulaması, firma onayı ve üyelik aktivasyonu ayrı adımlardır. Başvurunuzun durumunu Profil ekranından takip edin; ödeme ve üyelik işlemleri için size iletilen bilgileri kullanın.",
    "Profilinizde istenen firma belgelerini ilgili alandan iletin. Belge talebiyle ilgili sorularınızı info@marbleborsa.com adresine yazabilirsiniz. Belgelerinizin içine parola veya doğrulama kodu eklemeyin.",
    "Firma kaydının oluşturulması, rehberde hemen yayınlandığı anlamına gelmez. Yönetici onayı, aktif üyelik ve rehber görünürlüğü ayarını kontrol edin.",
  ] },
  { id: "profil", title: "3. Firma profilinizi hazırlayın", items: [
    "Profil alanındaki firma adı, şehir, faaliyet alanı ve iletişim bilgilerini kontrol edin. Kısa ve somut bir tanıtım yazın: hangi taşları, ürünleri veya hizmetleri sunduğunuz anlaşılsın.",
    "Logonuzu net, çevresinde küçük bir boşluk kalacak şekilde hazırlayın. Kare bir tuval kullanmak, yuvarlak veya küçük kartlarda logonun kesilmesini azaltır. Yazıların küçük ekranda okunabildiğini kontrol edin.",
    "Yayınlanmasını istediğiniz firma için rehber görünürlüğünü açın. Katalog kayıtlarını ayrıca yayınlayın; gizli katalog kayıtları ziyaretçilere gösterilmez.",
  ] },
  { id: "cekim", title: "4. Mermeri hangi açıdan çekmelisiniz?", items: [
    "Ana fotoğraf: Plakanın karşısında durup kamerayı yüzeye paralel tutun. Tüm kenarlar kadraja girsin; taşın çevresinde kırpma için biraz boşluk bırakın. Aşırı geniş açı yerine telefonun normal 1× kamerasını kullanın.",
    "Doku fotoğrafı: Damar ve yüzey ayrıntısını göstermek için yakından, net bir kare çekin. Dijital yakınlaştırma yerine güvenli biçimde yaklaşın. Genel görüntüyü de ekleyin; tek bir detay fotoğrafı bütün plakayı temsil etmez.",
    "Kalınlık ve yüzey: Kenarı göstermek için yaklaşık 30–45 derecelik ek bir açı kullanabilirsiniz. Bu kare, yüzeyin tam karşıdan çekilen ana fotoğrafını tamamlasın.",
    "Blok mermer: Ön ve yan yüzü birlikte gösterecek köşegen bir açı seçin; mümkünse diğer yüzleri de ayrı çekin. Boyut bilgisini açıklamaya yazın. Ölçek için ölçü cetveli kullanılabilir; yalnızca fotoğraftan ölçü çıkarılmasına güvenmeyin.",
    "Makine veya hizmet: Makineyi bütünüyle gösteren bir kare ve önemli parçalara ait yakın çekimler ekleyin. Hizmetlerde kendi işinizi anlatan, paylaşma hakkına sahip olduğunuz gerçek operasyon fotoğrafları kullanın.",
  ] },
  { id: "isik", title: "5. Doğru ışık ve doğru renk", items: [
    "Yumuşak gün ışığında çekim yapın. Sert güneş, flaş ve doğrudan lamba yansımaları damarları veya cilalı yüzeyi gizleyebilir. Kameranın ve kendi gölgenizin taşa düşmediğini kontrol edin.",
    "Lensi temizleyin, telefonu sabit tutun ve netliği taşa dokunarak ayarlayın. Düz ve sade bir arka plan seçin; ekran görüntüsü yerine orijinal fotoğrafı kullanın.",
    "Rengi değiştiren filtre, yoğun doygunluk veya yapay doku kullanmayın. Islak yüzey rengi daha koyu gösterebilir; fotoğraf ıslak çekildiyse açıklamada belirtin. Ekran ve ışık farkları nedeniyle kritik renk seçimlerinde numune üzerinden teyit alın.",
    "Önerilen çekim sırası: genel görünüm, damar detayı, kenar/kalınlık ve varsa aynı partiye ait diğer plakalar. Güvenli çekim yapın; sabitlenmemiş plakalara yaslanmayın ve kaldırılmış yüklerin altına girmeyin.",
  ] },
  { id: "yukleme", title: "6. Fotoğraf ve katalog yükleme", items: [
    "Profilde katalog bölümünden ürün veya hizmet ekleyin. Başlık 3–100, açıklama 20–1500 karakter olmalıdır. Ürüne uygun kategoriyi seçin.",
    "Bir katalog kaydına 1–10 fotoğraf ekleyebilirsiniz. Kabul edilen biçimler JPG, PNG ve WebP; her fotoğraf en fazla 5 MB olmalıdır. Bunlar katalog fotoğrafı sınırlarıdır; logo alanındaki uyarıları ayrıca kontrol edin.",
    "Fotoğrafları tutarlı bir yatay kadrajla hazırlamak kartlarda düzenli görünüm sağlar; örneğin 1600 × 1200 piksel kullanılabilir. Bu bir öneridir, zorunlu yükleme ölçüsü değildir. Ana konuyu ortada tutun; kart görünümünde kenarlar kırpılabilir.",
    "İsteğe bağlı PDF broşür en fazla 10 MB olabilir. Video dosyası yerine https:// ile başlayan video bağlantısı eklenir. Fotoğraf ve PDF dosyaları herkese açık olabileceği için özel belge veya kişisel veri yüklemeyin.",
    "Kaydettikten sonra yayın durumunu ve ziyaretçiye görünen katalog sayfasını kontrol edin. Mevcut düzenleme alanı metin ve bağlantı içindir; fotoğraf değiştirmek için yeni bir katalog kaydı oluşturmanız gerekebilir.",
  ] },
  { id: "aciklama", title: "7. İyi bir ürün açıklaması yazın", items: [
    "Taş adı, ürün formu (blok/plaka/ebatlı), ölçüler, kalınlık, yüzey işlemi ve mevcut parti bilgilerini yazın. Stok, teslim ve üretim kapasitesi bilgilerini güncel tutun; bilmediğiniz teknik değerleri tahmin etmeyin.",
    "Örnek şablon: [Taş adı] · [Plaka / blok / ebatlı] · [Ölçüler] · [Kalınlık] · [Yüzey işlemi]. Mevcut parti: [bilgi]. Teslim/üretim: [bilgi]. Güncel bulunurluk ve sevkiyat koşulları teklif aşamasında teyit edilir.",
    "Katalogda fiyat yayınlanmaz; alıcı ihtiyacına göre firmadan doğrudan teklif ister. Fotoğrafların hangi ürün veya partiye ait olduğunu açıkça belirtin.",
  ] },
];

const shots = [
  { image: "white", kind: "overall", number: "01", label: "GENEL GÖRÜNÜM", title: "Önce bütünü gösterin.", text: "Plakanın karşısına geçin. Kamerayı yüzeye paralel tutun; tüm kenarlar kadrajda kalsın.", tip: "Ana fotoğraf · Normal 1× kamera", alt: "Plakanın tamamını gösteren örnek mermer görseli" },
  { image: "white", kind: "detail", number: "02", label: "DAMAR VE DOKU", title: "Sonra ayrıntıya yaklaşın.", text: "Damarları ve yüzeyi net gösteren bir yakın çekim ekleyin. Dijital yakınlaştırma yerine güvenli biçimde yaklaşın.", tip: "Detay fotoğrafı · Netlik yüzeyde", alt: "Mermer damarlarını gösteren aynı örnek görselin yakın kadrajı" },
  { image: "beige", kind: "surface", number: "03", label: "TAMAMLAYICI ÇEKİM", title: "Yüzeyi ışıkla anlatın.", text: "Yumuşak gün ışığı kullanın. Kenar ve kalınlık için ayrıca 30–45° açıdan çekin; parlama dokuyu kapatmasın.", tip: "Ek fotoğraf · Kenar ve kalınlık", alt: "Mermer yüzey ve kenar görünümüne örnek görsel" },
];

function CompanyGuide() {
  return <main id="main-content" className="company-guide" lang="tr">
    <section className="cg-hero">
      <div className="cg-hero-copy"><span className="cg-eyebrow">MARBLE BORSA / FİRMA REHBERİ</span><h1>Firma kaydı ve<br/><em>katalog rehberi.</em></h1><p>Firma hesabınızdan ilk katalog kaydınıza: ürününüzü doğru anlatan, güven veren bir profil hazırlayın.</p><div className="cg-actions"><a href="#baslangic" className="cg-primary">Adım adım başlayın ↗</a><a href="#fotograf">Fotoğraf rehberi ↓</a></div><div className="cg-hero-foot"><span>01 / Hesap oluşturun</span><span>02 / Profilinizi hazırlayın</span><span>03 / Kataloğunuzu yayınlayın</span></div></div>
      <div className="cg-hero-image"><img src="/market/images/marble/white.webp" width="1000" height="730" alt="Doğal ışıkta mermer plaka örneği" fetchPriority="high"/><div className="cg-image-caption"><span>ÜRÜNÜNÜZ ÖN PLANDA</span><strong>Net fotoğraf.<br/>Doğru bilgi.</strong></div></div>
    </section>
    <nav className="cg-jump" aria-label="Rehber bölümleri"><span>BU REHBERDE</span><a href="#baslangic">Firma kaydı ↗</a><a href="#fotograf">Fotoğraf çekimi ↗</a><a href="#dosyalar">Yükleme ölçüleri ↗</a><a href="#ayrintilar">Ayrıntılı rehber ↗</a></nav>
    <section id="baslangic" className="cg-section"><div className="cg-section-heading"><div><span className="cg-eyebrow">HESAPTAN KATALOĞA</span><h2>Üç adımda hazırlanın.</h2></div><p>Her adımı tamamlayın; başvuru ve yayın durumunu Profil ekranından takip edin.</p></div><div className="cg-steps">{[
      ["01", "Hesabınızı oluşturun", "Üye Ol alanında Üretici / Tedarikçi veya Hizmet Sağlayıcı hesabını seçin. Bilgilerinizi girin ve e-postanızı doğrulayın.", "kayit"],
      ["02", "Firmanızı tanıtın", "Firma bilgilerinizi, logonuzu ve istenen belgeleri profilinize ekleyin. Yönetici onayı ve üyelik aktivasyonu durumunu kontrol edin.", "onay"],
      ["03", "Kataloğunuzu hazırlayın", "Ürün fotoğraflarını ve teknik bilgileri ekleyin. Aktif üyelik sonrasında rehber görünürlüğünü ve katalog yayın durumunu kontrol edin.", "yukleme"],
    ].map(([n,title,text,id])=><a className="cg-step" href={`#${id}`} key={n}><span className="cg-step-number">{n}</span><h3>{title}</h3><p>{text}</p><span className="cg-step-link">Ayrıntıları inceleyin ↗</span></a>)}</div></section>
    <section id="fotograf" className="cg-section cg-photo-section"><div className="cg-section-heading"><div><span className="cg-eyebrow">DAHA İYİ ÜRÜN FOTOĞRAFLARI</span><h2>Bir ürün. Birkaç doğru bakış.</h2></div><p>Genel görünümü, damar detayını ve kenarı ayrı karelerle gösterin. Görseller temsili çekim örnekleridir.</p></div><div className="cg-shots">{shots.map(s=><article className="cg-shot" key={s.number}><div className={`cg-shot-image cg-${s.kind}`}><img src={`/market/images/marble/${s.image}.webp`} alt={s.alt} width="1000" height="730" loading="lazy"/><span className="cg-shot-number">{s.number}</span><span className="cg-frame" aria-hidden="true"/></div><div className="cg-shot-copy"><span className="cg-eyebrow">{s.label}</span><h3>{s.title}</h3><p>{s.text}</p><span className="cg-shot-tip">{s.tip}</span></div></article>)}</div><div className="cg-light"><strong>Küçük değişiklikler, daha net bir sunum.</strong><div><span>✓ Yumuşak gün ışığı</span><span>✓ Temiz lens, sabit kamera</span><span>✓ Gerçek renkler</span><span>✓ Sade arka plan</span></div><p>Filtre kullanmayın. Islak çekim yaptıysanız belirtin; renk için gerektiğinde numune üzerinden teyit alın.</p></div></section>
    <section className="cg-section"><div className="cg-section-heading"><div><span className="cg-eyebrow">ÇEKİM AÇISI / ÜSTTEN ŞEMA</span><h2>Kameranızı doğru konumlandırın.</h2></div><p>Şemalar kamera ile yüzey arasındaki yönü anlatır; güvenli mesafeyi çalışma alanınıza göre belirleyin.</p></div><div className="cg-angle-grid">{[false,true].map(angled=><article key={String(angled)}><svg viewBox="0 0 340 160" role="img" aria-label={angled?"Kenar çekimi için yüzeye yaklaşık 45 dereceden bakan kamera":"Ana çekim için yüzeye dik bakan kamera"}><path d="M65 32 H275" stroke="#75846e" strokeWidth="12"/><text x="170" y="20" textAnchor="middle" fill="#50634e" fontSize="11">PLAKA YÜZEYİ</text><path d={angled?"M240 120 L170 38":"M170 125 L170 38"} stroke="#879782" strokeWidth="2" strokeDasharray="5 5"/><g transform={angled?"translate(240 120) rotate(-40)":"translate(170 125)"}><rect x="-22" y="-12" width="44" height="25" rx="5" fill="#213a33"/><circle r="7" fill="#eef1e8"/><path d="M-12 -12 V-17 H0 V-12" fill="#213a33"/></g></svg><h3>{angled?"Kenar için 30–45°":"Ana fotoğraf için tam karşıdan"}</h3><p>{angled?"Kalınlığı ve yüzey işlemini ek bir kareyle gösterin.":"Telefonunuzu yüzeye paralel tutun; tüm kenarları kadraja alın."}</p></article>)}</div></section>
    <section id="dosyalar" className="cg-file-panel"><div><span className="cg-eyebrow">YÜKLEMEDEN ÖNCE</span><h2>Dosyalarınız hazır mı?</h2><p>Bu sınırlar katalog fotoğrafları içindir. Logo alanındaki uyarıları ayrıca kontrol edin.</p></div><div className="cg-file-stats"><div><strong>1–10</strong><span>fotoğraf / katalog kaydı</span></div><div><strong>5 MB</strong><span>fotoğraf başına üst sınır</span></div><div><strong>10 MB</strong><span>isteğe bağlı PDF broşür</span></div><p>JPG · PNG · WebP <span>Video için https:// bağlantısı</span></p></div></section>
    <section id="ayrintilar" className="cg-section"><div className="cg-section-heading"><div><span className="cg-eyebrow">İHTİYACINIZ OLAN AYRINTILAR</span><h2>Adım adım uygulama rehberi.</h2></div><p>İlgili başlığı açın, bilgileri kendi profilinize uygulayın.</p></div><div className="cg-details">{sections.map(s=><details id={s.id} key={s.id} open={s.id==='kayit'}><summary><span>{s.title}</span><span aria-hidden="true">+</span></summary><div>{s.items.map(item=><p key={item}>{item}</p>)}</div></details>)}</div></section>
    <CompanyGuideTools />
    <section className="cg-section cg-troubleshoot"><span className="cg-eyebrow">SIK KARŞILAŞILAN DURUMLAR</span><h2>Bir adımda takıldıysanız.</h2><div className="cg-steps"><article className="cg-step"><h3>Firma görünmüyor</h3><p>E-posta, yönetici onayı, aktif üyelik ve rehber görünürlüğünü Profil ekranından kontrol edin.</p></article><article className="cg-step"><h3>Fotoğraf yüklenmiyor</h3><p>JPG, PNG veya WebP kullanın; dosya başına 5 MB sınırını ve bağlantınızı kontrol edin. HEIC dosyalarını önce dönüştürün.</p></article><article className="cg-step"><h3>Katalog görünmüyor</h3><p>Firma görünürlüğünün yanında katalog kaydının yayın durumunu da kontrol edin. Gizli kayıt ziyaretçilere gösterilmez.</p></article></div></section>
    <section className="cg-end"><div><span className="cg-eyebrow">SON KONTROL</span><h2>Yayınlamadan önce kontrol edin.</h2><p>Bilgileriniz doğru, fotoğraflarınız net ve yayın ayarlarınız açık mı? Profilinize geçerek kontrol edin.</p></div><a className="cg-primary" href="/tr/profil">Profil ve katalog alanına git ↗</a><p className="cg-support">Yardıma mı ihtiyacınız var? <a href="mailto:info@marbleborsa.com">info@marbleborsa.com</a><nav className="contact-social-links" aria-label="Social media"><a href="https://www.instagram.com/marbleborsa/" target="_blank" rel="noopener noreferrer">Instagram · @marbleborsa ↗</a><a href={/^https:\/\/(www\.)?linkedin\.com\/(?:company|in)\//.test(process.env.NEXT_PUBLIC_LINKEDIN_URL||'')?process.env.NEXT_PUBLIC_LINKEDIN_URL:'https://www.linkedin.com/in/marble-borsa/'} target="_blank" rel="noopener noreferrer">LinkedIn · Marble Borsa ↗</a></nav></p></section>
  </main>;
}


function VerifiedContactDetails({locale}:{locale:GuideLocale}){
 const t=({tr:{title:'Kurumsal iletişim',phone:'Telefon',tax:'Vergi bilgileri'},en:{title:'Business contact',phone:'Telephone',tax:'Tax details'},zh:{title:'企业联系方式',phone:'电话',tax:'税务信息'},ar:{title:'التواصل التجاري',phone:'الهاتف',tax:'البيانات الضريبية'}} as const)[locale];
 const digits=dataController.telefon.replace(/[^0-9+]/g,'');
 if(!dataController.unvan&&!dataController.adres&&!digits&&!dataController.whatsapp)return null;
 return <section className="verified-contact"><h2>{t.title}</h2>{digits&&<p><a href={`tel:${digits}`}>{t.phone}: {dataController.telefon}</a></p>}{/^[0-9]{8,15}$/.test(dataController.whatsapp)&&<p><a href={`https://wa.me/${dataController.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a></p>}{(dataController.vergiDairesi||dataController.vergiNo)&&<p>{t.tax}: {[dataController.vergiDairesi,dataController.vergiNo].filter(Boolean).join(' · ')}</p>}</section>;
}
function AboutEditorial({locale}:{locale:GuideLocale}){
 const content={
 tr:{title:'Alıcı, firma ve platformun sorumlulukları',paragraphs:['Marble Borsa’nın odağı, doğal taş araştırması ile ticari teklif hazırlığını aynı yerde buluşturmaktır. Alıcılar taş türlerini ve rehberleri inceleyebilir; üretici, tedarikçi ve hizmet firmaları kendi bilgilerini ve kataloglarını yayınlar.','Firma başvurusu incelemesi ve üyelik durumu, ürünün her parti için teknik uygunluk belgesi değildir. Kaynak, numune, stok, test sonucu, fiyat ve teslim taahhüdü ilgili firma tarafından yazılı olarak doğrulanmalıdır.','Alıcı hesabındaki talepler ve firma teklifleri hesap alanında yönetilir. Satış sözleşmesi, ödeme, kalite kabulü ve sevkiyat koşulları taraflar arasında belirlenir. Görünür firma profillerindeki bilgiler ve kataloglar işletmeler tarafından güncellenir.']},
 en:{title:'Buyer, company and platform responsibilities',paragraphs:['Marble Borsa brings natural stone research and commercial enquiry preparation together. Buyers can browse materials and guides; producers, suppliers and service providers publish their own profiles and catalogues.','Application review and membership status are not technical approval of every product lot. Source, samples, stock, laboratory results, price and delivery commitments must be confirmed by the relevant supplier.','Requests and quotations are managed in account workspaces. Sales contracts, payment, acceptance and shipping terms are agreed directly between the trading parties.']},
 zh:{title:'买家、企业及平台的责任',paragraphs:['Marble Borsa 将石材研究与商业询价准备结合。买家可浏览材料和指南，生产商、供应商及服务企业发布自己的资料和目录。','申请审核及会员状态并非每批产品的技术认证。来源、样品、库存、检测、价格和交付承诺须由相关供应商确认。','需求与报价在账户中管理。销售合同、付款、质量验收和运输条件由交易双方直接商定。']},
 ar:{title:'مسؤوليات المشتري والشركة والمنصة',paragraphs:['تجمع Marble Borsa بين بحث الحجر وتجهيز الاستفسارات التجارية. يتصفح المشترون المواد والأدلة وتنشر الشركات ملفاتها وكتالوجاتها.','مراجعة الطلب والعضوية ليست اعتماداً فنياً لكل دفعة. يجب أن يؤكد المورد المصدر والعينة والمخزون والاختبارات والسعر والتسليم.','تدار الطلبات والعروض في الحسابات، ويتفق الطرفان مباشرة على العقد والدفع والقبول والشحن.']}
 }[locale];
 return <section><h2>{content.title}</h2>{content.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</section>;
}
