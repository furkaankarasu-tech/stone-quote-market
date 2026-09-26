import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailFooter, DetailHeader } from "@/components/DetailChrome";
import companies from "@/lib/companies.json";
import { buildMetadata } from "@/lib/seo";
import { stones } from "@/lib/stoneData";
import "@/app/[locale]/dogal-tas/[slug]/stone-detail.css";

type Params = { locale: string; slug: string };

export function generateStaticParams(): Params[] {
  return companies.map((company) => ({ locale: "tr", slug: company.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const company = companies.find((entry) => entry.slug === slug);
  if (locale !== "tr" || !company) return {};
  return buildMetadata({
    title: company.name,
    description: `${company.name}, ${company.city} konumundaki demo firma. Firma rehberindeki taş çeşitlerini inceleyin.`,
    path: `/tr/firmalar/${company.slug}`,
  });
}

export default async function CompanyPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const company = companies.find((entry) => entry.slug === slug);
  if (locale !== "tr" || !company) notFound();
  const suppliedStones = stones.filter((stone) => company.stoneSlugs.includes(stone.slug));

  return <>
    <DetailHeader />
    <main className="detail-main">
      <nav aria-label="İçerik yolu" className="detail-crumb"><Link href="/">Ana Sayfa</Link><span>/</span><Link href="/tr/firmalar">Firmalar</Link><span>/</span>{company.name}</nav>
      <article className="detail-card">
        <div className="detail-photo"><img src={`/market/images/marble/${company.texture}.webp`} alt={`${company.name} için temsili taş dokusu`} width="640" height="640" /></div>
        <div className="detail-info"><span className="eyebrow dark">FİRMA REHBERİ · DEMO FİRMA</span><h1>{company.name}</h1><p>{company.city} · Doğrulama bekliyor</p></div>
      </article>
      <section className="detail-related detail-suppliers"><h2>Firma dizinindeki taşlar</h2><nav aria-label="Firmanın taşları">{suppliedStones.map((stone) => <Link key={stone.slug} href={`/tr/dogal-tas/${stone.slug}`}>{stone.name}</Link>)}</nav><p>Firma ve taş kayıtları demodur; görsel temsili dokudur. Doğrulanmış iletişim ve stok bilgisi henüz bulunmuyor.</p></section>
    </main>
    <DetailFooter />
  </>;
}
