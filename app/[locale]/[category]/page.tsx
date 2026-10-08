export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dataController } from "@/lib/dataController";
import Marketplace from "@/components/Marketplace";
import SourcingPage from "@/components/SourcingPage";
import { absoluteUrl, buildMetadata, pageSeo, safeJsonLd } from "@/lib/seo";
import { sourcingLocales, sourcingTopics, sourcingPath, sourcingRoute, sourcingAlternates, getSourcingCopy } from "@/lib/sourcingContent";
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
const infoCopy={
 en:{titles:["For Companies","About Marble Borsa","Contact"],desc:["Publish your company profile, logo and catalogue; discover buying requests relevant to your business.","A B2B discovery and quote platform for natural stone, machinery, supplies and industry services.","Contact Marble Borsa about membership, catalogues, support and partnerships."],steps:["Apply as a producer, supplier or service provider.","Confirm your email. The administrator reviews your company application.","After approval and membership activation, enable directory visibility and upload your logo in Profile.","Publish your products or services in your catalogue to appear in the relevant categories."],model:"Suppliers respond to natural stone requests; service companies respond to service requests. Active suppliers can request services and machinery/supplies.",about:"Companies share catalogues and buyers describe their needs, receive quotes and contact companies directly. Marble Borsa does not sell marble on its own behalf. Stock, quality, delivery and payment terms are agreed by the trading parties.",support:"For membership, catalogues, technical support or partnerships, email us. Include the page address and a short description of your issue. Do not share passwords or verification codes.",profile:"Manage your company profile",requests:"View buying requests"},
 zh:{titles:["企业会员","关于Marble Borsa","联系我们"],desc:["发布企业资料、标志和目录，查看适合您企业的采购需求。","天然石材、机械、耗材和行业服务的企业间发现与询价平台。","联系Marble Borsa咨询会员、目录、支持与合作。"],steps:["以生产商、供应商或服务商身份申请。","验证邮箱，管理员审核企业申请。","审核通过且会员生效后，在个人资料中开启名录展示并上传标志。","在目录中发布产品或服务，在相应类别展示。"],model:"供应商回应石材需求，服务企业回应服务需求。有效会员供应商可以发布服务及机械耗材采购需求。",about:"企业分享目录，买家说明需求、接收报价并直接联系企业。Marble Borsa不以自身名义销售石材。库存、质量、交付和付款条件由交易双方约定。",support:"会员、目录、技术支持或合作问题请发送邮件，并附上页面地址和问题简述。请勿分享密码或验证码。",profile:"管理企业资料",requests:"查看采购需求"},
 ar:{titles:["للشركات","عن Marble Borsa","اتصل بنا"],desc:["انشر ملف شركتك وشعارها وكتالوجها واكتشف طلبات الشراء المناسبة لنشاطك.","منصة اكتشاف وطلبات أسعار بين الشركات للحجر الطبيعي والمعدات واللوازم والخدمات.","تواصل معنا بشأن العضوية والكتالوجات والدعم والشراكات."],steps:["قدّم طلبًا كمنتج أو مورد أو مقدم خدمات.","أكّد بريدك الإلكتروني؛ يراجع المسؤول طلب الشركة.","بعد الموافقة وتفعيل العضوية، فعّل الظهور في الدليل وارفع شعارك من الملف الشخصي.","انشر منتجاتك أو خدماتك في الكتالوج للظهور في الفئات المناسبة."],model:"يرد الموردون على طلبات الحجر الطبيعي، وشركات الخدمات على طلبات الخدمات. يمكن للموردين ذوي العضوية الفعالة طلب الخدمات والمعدات واللوازم.",about:"تشارك الشركات كتالوجاتها ويحدد المشترون احتياجاتهم ويتلقون العروض ويتواصلون مباشرة مع الشركات. لا تبيع Marble Borsa الرخام باسمها؛ يتفق طرفا التجارة على المخزون والجودة والتسليم والدفع.",support:"للعضوية والكتالوج والدعم والشراكات، راسلنا بعنوان الصفحة ووصف مختصر للمشكلة. لا تشارك كلمات المرور أو رموز التحقق.",profile:"إدارة ملف الشركة",requests:"عرض طلبات الشراء"}
} as const;
export function generateStaticParams(): Route[] {
  return [...locales.flatMap(locale=>Object.keys(information).map(category=>({locale,category}))), ...locales.flatMap((locale) => Object.entries(marketRouteSegments[locale as GuideLocale]).filter(([tab])=>!(locale==='tr'&&tab==='requests')).map(([, category]) => ({ locale, category }))), ...sourcingLocales.flatMap(locale => sourcingTopics.map(topic => ({locale, category: sourcingPath(topic,locale).split("/").at(-1)!})))];
}

export async function generateMetadata({ params }: { params: Promise<Route> }): Promise<Metadata> {
  const { locale, category: segment } = await params;
  const map=marketRouteSegments[locale as GuideLocale];
  const tab=map?Object.keys(map).find(key=>map[key as MarketTab]===segment) as MarketTab|undefined:undefined;
  const category=tab?categoryKeys[tab]:segment;
  if(locale!=="tr" && locale in infoCopy && category in information){const copy=infoCopy[locale as keyof typeof infoCopy],index=Object.keys(information).indexOf(category);return buildMetadata({title:copy.titles[index]+" | Marble Borsa",description:copy.desc[index],path:`/${locale}/${category}`})}
  if (locale === "tr" && category in information) return buildMetadata({...information[category as keyof typeof information], path:`/tr/${category}`});
  const topic = sourcingRoute(locale,category);
  if(topic) {
    const copy=getSourcingCopy(locale as GuideLocale,topic);
    return buildMetadata({title:copy.title,description:copy.description,path:sourcingPath(topic,locale as GuideLocale),
      locale:locale==='en'?'en_US':locale==='zh'?'zh_CN':locale==='ar'?'ar_AR':'tr_TR',languages:sourcingAlternates(topic)});
  }
  if(tab && locale!=="tr") {
    const titles={en:{stones:"Natural Stone and Marble Suppliers",companies:"Company Directory",machines:"Machinery and Supplies",services:"Industry Services",requests:"Buying Requests"},zh:{stones:"天然石材与大理石供应商",companies:"企业目录",machines:"机械与耗材",services:"行业服务",requests:"采购需求"},ar:{stones:"موردو الحجر الطبيعي والرخام",companies:"دليل الشركات",machines:"المعدات واللوازم",services:"خدمات القطاع",requests:"طلبات الشراء"}};
    return {...buildMetadata({title:titles[locale as 'en'|'zh'|'ar'][tab]+" | Marble Borsa",description:titles[locale as 'en'|'zh'|'ar'][tab],path:marketPath(locale as GuideLocale,tab),languages:marketAlternates(tab),locale:locale==='en'?'en_US':locale==='zh'?'zh_CN':'ar_AR'}),...(tab==='requests'?{robots:{index:false,follow:false}}:{})};
  }
  const seo = pageSeo[category as keyof typeof pageSeo];
  if (!locales.includes(locale) || !seo) return {};
  return buildMetadata({ ...seo, path: `/${locale}/${category}`, languages: tab?marketAlternates(tab):undefined });
}

export default async function CategoryPage({ params }: { params: Promise<Route> }) {
  const { locale, category: segment } = await params;
  const map=marketRouteSegments[locale as GuideLocale];
  const tab=map?Object.keys(map).find(key=>map[key as MarketTab]===segment) as MarketTab|undefined:undefined;
  const category=tab?categoryKeys[tab]:segment;
  if(locale!=="tr" && locale in infoCopy && category in information){
    const copy=infoCopy[locale as keyof typeof infoCopy],index=Object.keys(information).indexOf(category);
    return <main id="main-content" className="guide-wrap guide-article-layout" lang={locale} dir={locale==="ar"?"rtl":"ltr"}><article className="guide-article"><span className="guide-kicker">MARBLE BORSA</span><h1>{copy.titles[index]}</h1><p>{copy.desc[index]}</p>{index===0?<><ol>{copy.steps.map(step=><li key={step}>{step}</li>)}</ol><p>{copy.model}</p><p><a href={`/${locale}/profil`}>{copy.profile} →</a></p><a href={marketPath(locale as GuideLocale,"requests")}>{copy.requests} →</a></>:index===1?<p>{copy.about}</p>:<><p>Afyonkarahisar · Türkiye</p><p>{copy.support}</p><a href="mailto:info@marbleborsa.com">info@marbleborsa.com</a>{dataController.unvan&&<p>{dataController.unvan}</p>}{dataController.adres&&<p>{dataController.adres}</p>}</>}</article></main>;
  }
  if (locale === "tr" && category in information) {
    const content = information[category as keyof typeof information];
    return <><main id="main-content" className="guide-wrap guide-article-layout"><article className="guide-article"><span className="guide-kicker">MARBLE BORSA</span><h1>{{"firmalar-icin":"Firmalar için Marble Borsa","hakkimizda":"Marble Borsa hakkında","iletisim":"İletişim"}[category as keyof typeof information]}</h1><p>{content.description}</p>
      {category === "firmalar-icin" ? <><h2>Firmanızı görünür hale getirin</h2><ol><li>Üretici, tedarikçi veya hizmet sağlayıcı olarak üyelik başvurunuzu tamamlayın.</li><li>E-postanızı doğrulayın. Firma başvurusu yönetim tarafından incelenir.</li><li>Onay ve aktif üyelik sonrasında Profil sayfasından rehber görünürlüğünü açın, logonuzu yükleyin.</li><li>Ürün ve hizmetlerinizi katalog alanında yayınlayın. Firma rehberi ve ilgili kategorilerde görünür olun.</li></ol><h2>İşletmenize uygun talepler</h2><p>Doğal taş alım taleplerini tedarikçiler, hizmet taleplerini hizmet firmaları yanıtlar. Aktif tedarikçiler hizmet alımı ve makine/sarf talebi açabilir.</p><p><a href="/tr/profil">Üyelik ve firma profilini yönet →</a></p><a href="/tr/alim-talepleri">Alım taleplerini incele →</a></> : category === "hakkimizda" ? <><h2>Doğrudan firma bağlantısı</h2><p>Marble Borsa, doğal taş sektöründeki alıcılarla üretici, tedarikçi ve hizmet sağlayıcıları buluşturmak için geliştirildi. Firmalar kataloglarını paylaşır, alıcılar ihtiyaçlarını belirtir ve teklifler üzerinden taraflarla doğrudan iletişim kurar.</p><p>Platform kendi adına mermer satmaz. Stok, kalite, teslimat ve ödeme koşulları ticaretin taraflarınca belirlenir.</p><a href="/tr/firmalar-icin">Firmalar için çalışma modeli →</a></> : <><h2>Bize ulaşın</h2><p>Afyonkarahisar · Türkiye</p><p>Üyelik, katalog yayınlama, teknik destek ve iş birliği için aşağıdaki adres üzerinden iletişim kurabilirsiniz.</p><p><a href="mailto:info@marbleborsa.com">info@marbleborsa.com</a></p><p>Firma görünürlüğü, üyelik veya teknik sorunlar için sayfa adresini ve sorunun kısa açıklamasını iletebilirsiniz. Şifrenizi veya doğrulama kodunuzu paylaşmayın.</p>{dataController.unvan && <p>{dataController.unvan}</p>}{dataController.adres && <p>{dataController.adres}</p>}</>}
    </article></main></>;
  }
  const topic=sourcingRoute(locale,category);
  if(topic) {
    const lang=locale as GuideLocale;
    const path=sourcingPath(topic,lang);
    const copy=getSourcingCopy(lang,topic);
    const breadcrumb={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[
      {"@type":"ListItem",position:1,name:copy.homeLabel,item:absoluteUrl("/")},
      {"@type":"ListItem",position:2,name:copy.title,item:absoluteUrl(path)}
    ]};
    return <>{absoluteUrl("/")&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:safeJsonLd(breadcrumb)}}/>}<SourcingPage topic={topic} locale={lang}/></>;
  }
  if (!locales.includes(locale) || (!(category in pageSeo) && category!=="alim-talepleri")) notFound();
  // Breadcrumb/collection JSON-LD are rendered once by Marketplace.
  // Duplicating them here caused two conflicting JSON-LD blocks per category.
  return <Marketplace category={category as keyof typeof pageSeo} locale={locale as GuideLocale} />;
}
