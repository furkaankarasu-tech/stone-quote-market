import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { legalDocuments, getLegalDocuments, legalUi, type LegalLocale, legalVersion } from "@/lib/legalDocuments";
import { buildMetadata } from "@/lib/seo";
import "@/app/[locale]/dogal-tas/[slug]/stone-detail.css";

type DocumentKey = keyof typeof legalDocuments;
type Params = { locale: string; document: string };

export function generateStaticParams(): Params[] {
  return ["tr","en","zh","ar"].flatMap(locale=>Object.keys(legalDocuments).map(document=>({locale,document})));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, document } = await params;
  const legal = ["tr","en","zh","ar"].includes(locale) ? getLegalDocuments(locale)[document as DocumentKey] : undefined;
  if (!legal) return {};
  return { ...buildMetadata({
    title: legal.title,
    description: `${legal.title} | Marble Borsa`,
    path: `/${locale}/yasal/${document}`,
  }), robots: { index: false, follow: false } };
}

export default async function LegalPage({ params }: { params: Promise<Params> }) {
  const { locale, document } = await params;
  const legal = ["tr","en","zh","ar"].includes(locale) ? getLegalDocuments(locale)[document as DocumentKey] : undefined;
  if (!legal) notFound();

  const ui=legalUi[locale as LegalLocale];
  return <>
    
    <main id="main-content" tabIndex={-1} className="detail-main">
      <nav aria-label={ui.breadcrumb} className="detail-crumb"><Link href={locale==="tr"?"/":`/${locale}`}>{ui.home}</Link><span>/</span>{legal.title}</nav>
      <article className="detail-legal" lang={locale} dir={locale==="ar"?"rtl":"ltr"}>
        <span className="eyebrow dark">MARBLE BORSA · {ui.heading}</span>
        <h1>{legal.title}</h1>
        <p><small>{ui.updated}: {legalVersion}</small></p>
        {legal.intro && <p>{legal.intro}</p>}
        {legal.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
      </article>
    </main>
    
  </>;
}
