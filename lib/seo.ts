import type { Metadata } from "next";
import type { Stone } from "./stoneData";

const brand = "Marble Borsa";

export const homeSeo = {
  title: "Mermer Al ve Teklif İste | Türkiye Doğal Taş Tedariki | Marble Borsa",
  description: "Mermer, traverten, doğal taş, makine ve sektör hizmetlerini keşfedin. Marble Borsa ile üretici ve tedarikçilerden doğrudan teklif isteyin; firmalar arası ticaret taraflar arasında gerçekleşir.",
} as const;

export const pageSeo = {
  "dogal-tas": {
    title: "Mermer Çeşitleri ve Doğal Taş Tedariki | Blok ve Plaka",
    description: "Afyon, Burdur, Bilecik, Muğla, Balıkesir ve Denizli mermer ve traverten çeşitlerini tür, renk ve formatlarına göre inceleyin; B2B satın alma süreciniz için ön bilgi edinin.",
  },
  firmalar: {
    title: "Mermer Firmaları, Üreticiler ve Tedarikçi Rehberi",
    description: "Mermer ve doğal taş sektöründeki üretici ve tedarikçi profillerini keşfedin. Firma katalogları yayınlandıkça ürün bilgilerini inceleyin, işletmeleri karşılaştırın ve doğrudan teklif isteyin.",
  },
  "makine-sarf": {
    title: "Mermer Makineleri, Kesim Ekipmanları ve Sarf Malzemeleri",
    description: "Mermer kesim makineleri, CNC ekipmanları, elmas soket ve doğal taş sarf malzemelerini inceleyin. Sektördeki firmalara doğrudan ulaşın ve ihtiyacınız için teklif isteyin.",
  },
  hizmetler: {
    title: "Mermer İhracatı İçin Lojistik, Gümrük ve Sektörel Hizmetler",
    description: "Doğal taş sektörü için lojistik, gümrük, ekspertiz, kalite kontrol ve paketleme hizmetlerini inceleyin; mermer ticaretiniz için uygun hizmetleri bulun.",
  },
} as const;

export function allowIndexing(): boolean {
  // Vercel Preview deployments are intentionally never indexable. Their
  // x-robots-tag: noindex header is controlled by Vercel as well.
  if (process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "development") return false;
  return process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
}

export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
    || process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
    || process.env.VERCEL_URL?.trim();
  if (!raw) return process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";
  const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTP(S) URL.");
  }
  return url.origin;
}

export function absoluteUrl(path: string): string {
  const origin = siteUrl();
  return origin ? new URL(path, `${origin}/`).toString() : "";
}

export function buildMetadata({
  title,
  description,
  path,
  locale = "tr_TR",
  languages,
}: {
  title: string;
  description: string;
  path: string;
  locale?: string;
  languages?: Record<string, string>;
}): Metadata {
  const fullTitle = title.toLocaleLowerCase("tr-TR").includes(brand.toLocaleLowerCase("tr-TR")) ? title : `${title} | ${brand}`;
  const url = absoluteUrl(path);
  const index = allowIndexing();
  const languageAlternates = languages ? Object.fromEntries(Object.entries(languages).map(([lang, langPath]) => [lang, absoluteUrl(langPath)]).filter(([, langUrl]) => Boolean(langUrl))) : undefined;
  const socialImage = absoluteUrl("/og-marbleborsa.png");

  return {
    title: fullTitle,
    description,
    ...(url ? { alternates: { canonical: url, ...(languageAlternates ? { languages: languageAlternates } : {}) } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      ...(url ? { url } : {}),
      siteName: brand,
      ...(socialImage ? { images: [{ url: socialImage, width: 1200, height: 630, alt: "Marble Borsa – B2B Mermer ve Doğal Taş Teklif Platformu" }] } : {}),
      locale,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, ...(socialImage ? { images: [socialImage] } : {}) },
    robots: { index, follow: index },
  };
}

export function stoneDescription(stone: Stone): string {
  const type = stone.type.toLocaleLowerCase("tr-TR");
  const color = stone.color.toLocaleLowerCase("tr-TR");
  const forms = stone.forms.map((form) => form.toLocaleLowerCase("tr-TR"));
  const formats = forms.length > 1
    ? `${forms.slice(0, -1).join(", ")} ve ${forms[forms.length - 1]}`
    : forms[0];
  const formatSentence = formats.charAt(0).toLocaleUpperCase("tr-TR") + formats.slice(1);
  return `${stone.name}, ${stone.city} menşeli ${type} çeşididir. Rengi ${color} olarak tanımlanır. ${formatSentence} formatlarını ve yüzeylerini inceleyin.`;
}

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const internationalHomeSeo = {
 en:{title:'Buy Turkish Marble & Request Supplier Quotes | Marble Borsa',description:'Source marble blocks, slabs and travertine from Turkey. Explore independent suppliers, stone machinery, consumables and services; request direct B2B quotes.'},
 zh:{title:'采购土耳其大理石与石材询价平台 | Marble Borsa',description:'浏览土耳其大理石荒料、板材与洞石，了解独立供应商、石材机械、耗材和行业服务，提交采购需求并直接询价。'},
 ar:{title:'شراء الرخام التركي وعروض الموردين | Marble Borsa',description:'استكشف الرخام التركي والكتل والألواح والترافرتين وموردي المعدات واللوازم والخدمات، واطلب عروض أسعار مباشرة من الشركات المستقلة.'}
} as const;
export const internationalCategorySeo = {
 en:{'dogal-tas':{title:'Turkish Marble, Travertine, Blocks and Slabs',description:'Explore Afyon marble, Turkish travertine and natural stone varieties. Compare formats and finishes and request quotes from independent suppliers.'},firmalar:{title:'Turkish Marble Companies and Natural Stone Suppliers',description:'Explore published profiles and catalogues of independent marble producers, stone suppliers and service companies. Contact firms for current stock and quotes.'},'makine-sarf':{title:'Marble Cutting Machines, Diamond Tools and Supplies',description:'Explore bridge saws, diamond wire saws, CNC stone machines, diamond segments, stone epoxy and reinforcement mesh. Request supplier quotes.'},hizmetler:{title:'Stone Logistics, Customs and Quality Inspection Services',description:'Explore marble transport, customs clearance, pre-shipment inspection, laboratory testing, packing and container loading services.'}},
 zh:{'dogal-tas':{title:'土耳其大理石、洞石、荒料与板材',description:'浏览阿菲永大理石、土耳其洞石和天然石材品种，了解尺寸与表面处理，并向独立供应商询价。'},firmalar:{title:'土耳其大理石企业与天然石材供应商',description:'查看独立石材生产商、供应商和服务企业已发布的资料与目录，直接咨询库存和报价。'},'makine-sarf':{title:'大理石切割机械、金刚石工具与耗材',description:'了解桥式切割机、金刚石绳锯、数控石材设备、刀头、石材环氧树脂和增强网，向供应商询价。'},hizmetler:{title:'石材物流、报关与质量检验服务',description:'了解大理石运输、报关、装运前检验、实验室检测、包装和集装箱装载服务。'}},
 ar:{'dogal-tas':{title:'الرخام التركي والترافرتين والكتل والألواح',description:'استكشف رخام أفيون والترافرتين التركي وأنواع الحجر الطبيعي وقارن الأشكال والتشطيبات واطلب عروض الموردين المستقلين.'},firmalar:{title:'شركات الرخام التركي وموردو الحجر الطبيعي',description:'راجع الملفات والكتالوجات المنشورة لمنتجي الرخام وموردي الحجر وشركات الخدمات وتواصل مباشرة للاستفسار عن المخزون والأسعار.'},'makine-sarf':{title:'ماكينات قطع الرخام وأدوات الماس واللوازم',description:'استكشف مناشير الجسر والقطع بالسلك الماسي وماكينات CNC وقطع الماس وإيبوكسي الحجر وشبكات التدعيم واطلب العروض.'},hizmetler:{title:'نقل الرخام والتخليص الجمركي وفحص الجودة',description:'استكشف خدمات نقل الرخام والجمارك وفحص ما قبل الشحن والاختبارات والتغليف وتحميل الحاويات.'}}
} as const;
