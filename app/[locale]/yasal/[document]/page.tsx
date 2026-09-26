import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailFooter, DetailHeader } from "@/components/DetailChrome";
import { legalDocuments, legalVersion } from "@/lib/legalDocuments";
import { buildMetadata } from "@/lib/seo";
import "@/app/[locale]/dogal-tas/[slug]/stone-detail.css";

type DocumentKey = keyof typeof legalDocuments;
type Params = { locale: string; document: string };

export function generateStaticParams(): Params[] {
  return Object.keys(legalDocuments).map((document) => ({ locale: "tr", document }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, document } = await params;
  const legal = locale === "tr" ? legalDocuments[document as DocumentKey] : undefined;
  if (!legal) return {};
  return buildMetadata({
    title: legal.title,
    description: `${legal.title} – Marble Borsa demo platformunun yasal bilgilendirme metni.`,
    path: `/tr/yasal/${document}`,
  });
}

export default async function LegalPage({ params }: { params: Promise<Params> }) {
  const { locale, document } = await params;
  const legal = locale === "tr" ? legalDocuments[document as DocumentKey] : undefined;
  if (!legal) notFound();

  return <>
    <DetailHeader />
    <main className="detail-main">
      <nav aria-label="İçerik yolu" className="detail-crumb"><Link href="/">Ana Sayfa</Link><span>/</span>{legal.title}</nav>
      <article className="detail-legal">
        <span className="eyebrow dark">MARBLE BORSA · HUKUKİ METİNLER</span>
        <h1>{legal.title}</h1>
        <p><small>Son güncelleme: {legalVersion}</small></p>
        {legal.intro && <p>{legal.intro}</p>}
        {legal.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
      </article>
    </main>
    <DetailFooter />
  </>;
}
