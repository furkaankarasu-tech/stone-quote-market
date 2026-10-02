import type { Metadata } from "next";
import type { Stone } from "./stoneData";

const brand = "Marble Borsa";

export const homeSeo = {
  title: "Mermer Teklifi Al | B2B Doğal Taş | Marble Borsa",
  description: "Mermer blok, plaka ve doğal taş tedariki için üretici ve tedarikçilerden doğrudan teklif alın. Marble Borsa alıcıları firmalarla buluşturan B2B platformudur.",
} as const;

export const pageSeo = {
  "dogal-tas": {
    title: "Mermer ve Doğal Taş Çeşitleri | Blok ve Plaka",
    description: "Afyon, Burdur, Bilecik, Muğla, Balıkesir ve Denizli mermer ve traverten çeşitlerini tür, renk ve formatlarına göre inceleyin.",
  },
  firmalar: {
    title: "Mermer Üreticileri ve Doğal Taş Firma Rehberi",
    description: "Mermer ve doğal taş sektöründeki üretici ve tedarikçi profillerini keşfedin. Firma katalogları yayınlandıkça ürün bilgilerini inceleyin ve doğrudan teklif isteyin.",
  },
  "makine-sarf": {
    title: "Mermer Makineleri ve Doğal Taş Sarf Malzemeleri",
    description: "Mermer kesim makineleri, CNC ekipmanları, elmas soket ve doğal taş sarf malzemelerini karşılaştırın. Sektördeki firmalara doğrudan ulaşın.",
  },
  hizmetler: {
    title: "Lojistik, Gümrük, Ekspertiz ve Diğer Sektör Hizmetleri",
    description: "Doğal taş sektörü için lojistik, gümrük, ekspertiz, kalite kontrol ve paketleme hizmetlerini inceleyin; ihtiyacınıza uygun hizmetleri bulun.",
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
