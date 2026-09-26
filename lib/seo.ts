import type { Metadata } from "next";
import type { Stone } from "./stoneData";

const brand = "Marble Borsa";

export const homeSeo = {
  title: "Doğal Taş ve Teklif Platformu",
  description: "Mermer ve traverten çeşitlerini, üretici firmaları, makineleri ve sektör hizmetlerini Marble Borsa üzerinden inceleyin; ürünler için teklif isteyin.",
} as const;

export const pageSeo = {
  "dogal-tas": {
    title: "Doğal Taş Dizini",
    description: "Afyon, Burdur, Bilecik, Muğla, Balıkesir ve Denizli mermer ve traverten çeşitlerini tür, renk ve formatlarına göre inceleyin.",
  },
  firmalar: {
    title: "Firma Rehberi",
    description: "Doğal taş sektöründeki üretici, ocak, fabrika ve tedarikçi firmaları inceleyin; faaliyet alanlarını ve sundukları taşları karşılaştırın.",
  },
  "makine-sarf": {
    title: "Makine ve Sarf Malzemeleri",
    description: "Doğal taş üretiminde kullanılan makineleri, kesici takımları ve sarf malzemelerini inceleyin; ihtiyaçlarınıza uygun seçenekleri bulun.",
  },
  hizmetler: {
    title: "Lojistik, Gümrük, Ekspertiz ve Diğer Sektör Hizmetleri",
    description: "Doğal taş sektörü için lojistik, gümrük, ekspertiz, kalite kontrol ve paketleme hizmetlerini inceleyin; ihtiyacınıza uygun hizmetleri bulun.",
  },
} as const;

export function allowIndexing(): boolean {
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
}: {
  title: string;
  description: string;
  path: string;
  locale?: string;
}): Metadata {
  const fullTitle = `${title} | ${brand}`;
  const url = absoluteUrl(path);
  const index = allowIndexing();

  return {
    title: fullTitle,
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      ...(url ? { url } : {}),
      siteName: brand,
      locale,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
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
