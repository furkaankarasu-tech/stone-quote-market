import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailFooter, DetailHeader } from "@/components/DetailChrome";
import companies from "@/lib/companies.json";
import { absoluteUrl, buildMetadata, safeJsonLd, stoneDescription } from "@/lib/seo";
import { stones } from "@/lib/stoneData";
import "./stone-detail.css";

type Params = { locale: string; slug: string };
export function generateStaticParams(): Params[] {
  return stones.map((stone) => ({ locale: "tr", slug: stone.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const stone = stones.find((entry) => entry.slug === slug);
  if (locale !== "tr" || !stone) return {};
  return buildMetadata({
    title: stone.name,
    description: stoneDescription(stone),
    path: `/tr/dogal-tas/${stone.slug}`,
  });
}

export default async function StonePage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const stone = stones.find((entry) => entry.slug === slug);
  if (locale !== "tr" || !stone) notFound();
  const suppliers = companies.filter((company) => company.stoneSlugs.includes(stone.slug));
  const origin = absoluteUrl("/");
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: origin },
      { "@type": "ListItem", position: 2, name: "Doğal Taş", item: absoluteUrl("/tr/dogal-tas") },
      { "@type": "ListItem", position: 3, name: stone.name, item: absoluteUrl(`/tr/dogal-tas/${stone.slug}`) },
    ],
  };

  return (
    <>
      {origin && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumb) }} />}
      <DetailHeader />
      <main className="detail-main">
        <nav aria-label="İçerik yolu" className="detail-crumb">
          <Link href="/">Ana Sayfa</Link><span>/</span><Link href="/tr/dogal-tas">Doğal Taş</Link><span>/</span>{stone.name}
        </nav>
        <article className="detail-card">
          <div className="detail-photo"><img src={`/market/images/marble/${stone.image}`} alt={`${stone.name} doku önizlemesi`} width="640" height="640" fetchPriority="high" /></div>
          <div className="detail-info">
            <span className="eyebrow dark">DOĞAL TAŞ DİZİNİ · {stone.city.toLocaleUpperCase("tr-TR")}</span>
            <h1>{stone.name}</h1>
            <p>{stone.description}</p>
            <span className="detail-supplier-count">{suppliers.length} tedarikçi</span>
            <Link className="button dark detail-quote" href={`/tr/dogal-tas?item=${encodeURIComponent(stone.name)}#market`}>Bu taş için teklif iste →</Link>
          </div>
        </article>
        <section className="detail-specs">
          <h2>Taş bilgileri</h2>
          <dl>
            <div><dt>Taş türü</dt><dd>{stone.type}</dd></div>
            <div><dt>Menşei</dt><dd>{stone.city}</dd></div>
            <div><dt>Renk</dt><dd>{stone.color}</dd></div>
            <div><dt>Formatlar</dt><dd>{stone.forms.join(", ")}</dd></div>
            {!stone.forms.includes("Blok") && stone.thickness && stone.thickness.length > 0 && <div><dt>Kalınlık</dt><dd>{stone.thickness.join(", ")}</dd></div>}
            {stone.forms.includes("Blok") && stone.blockDimensions && <div><dt>Blok boyutu</dt><dd>{stone.blockDimensions}</dd></div>}
            {stone.forms.includes("Blok") && stone.blockVolume && <div><dt>Blok hacmi</dt><dd>{stone.blockVolume}</dd></div>}
            <div><dt>Yüzey seçenekleri</dt><dd>{stone.surfaces.join(", ")}</dd></div>
          </dl>
          <p>Görseller doku önizlemesidir; ürüne ait fotoğraf, teknik ölçü ve stok bilgisini ilgili firmadan doğrulayın.</p>
        </section>
        <section className="detail-related detail-suppliers">
          <h2>Bu taşı sunan firmalar</h2>
          <nav aria-label="Bu taşı sunan firmalar">
            {suppliers.map((company) => <Link key={company.slug} href={`/tr/firmalar/${company.slug}`}>{company.name} →</Link>)}
          </nav>
          <p>Bu firmalar demo kayıtlarıdır; doğrulanmış tedarikçi ve stok bilgisi değildir.</p>
        </section>
        <section className="detail-related">
          <h2>Dizindeki diğer taşlar</h2>
          <nav aria-label="Diğer doğal taşlar">
            {stones.filter((entry) => entry.slug !== stone.slug).map((entry) => (
              <Link key={entry.slug} href={`/tr/dogal-tas/${entry.slug}`}>{entry.name}</Link>
            ))}
          </nav>
        </section>
      </main>
      <DetailFooter />
    </>
  );
}
