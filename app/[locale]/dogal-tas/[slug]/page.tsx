import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailFooter, DetailHeader } from "@/components/DetailChrome";
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
    title: `${stone.name} ${stone.type} | ${stone.forms.slice(0, 2).join(" ve ")} Bilgileri`,
    description: stoneDescription(stone),
    path: `/tr/dogal-tas/${stone.slug}`,
  });
}

export default async function StonePage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const stone = stones.find((entry) => entry.slug === slug);
  if (locale !== "tr" || !stone) notFound();
  const origin = absoluteUrl("/");
  const atlasIndex = Math.max(0, stones.findIndex((entry) => entry.slug === stone.slug));
  const texturePosition = `${(atlasIndex % 3) * 50}% ${Math.floor(atlasIndex / 3) * 50}%`;
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
          <a href="/">Ana Sayfa</a><span>/</span><a href="/tr/dogal-tas">Doğal Taş</a><span>/</span>{stone.name}
        </nav>
        <article className="detail-card">
          <div className="detail-visual-group">
            <div className="detail-preview-rail" aria-label="Taş görselleri">
              <div className="detail-preview-thumb is-selected"><img src={`/market/images/marble/${stone.image}`} alt="Plaka sunumu küçük görsel" loading="lazy" width="90" height="110" /></div>
              <div className="detail-preview-thumb is-texture" style={{ backgroundPosition: texturePosition }} role="img" aria-label="Yakın taş dokusu" />
            </div>
            <figure className="detail-photo">
              <img src={`/market/images/marble/${stone.image}`} alt={`${stone.name} doğal taş koleksiyonu`} width="1000" height="730" fetchPriority="high" />
              <figcaption>Doğal taş koleksiyonu</figcaption>
            </figure>
          </div>
          <div className="detail-info">
            <span className="eyebrow dark">DOĞAL TAŞ DİZİNİ · {stone.city.toLocaleUpperCase("tr-TR")}</span>
            <h1>{stone.name}</h1>
            <p>{stone.description}</p>
            <span className="detail-supplier-count">Firma katalogları onaylandıkça rehberde görünür</span>
            <a className="button dark detail-quote" href={`/tr/dogal-tas?item=${encodeURIComponent(stone.name)}#market`}>Alıcı hesabıyla teklif iste →</a>
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
          <p>Üreticilerin güncel parti fotoğrafları, stok bilgileri ve teknik belgeleri için firma kataloglarını inceleyin. Teklif ve teslim koşullarını doğrudan ilgili firmayla netleştirin.</p>
        </section>
        <section className="detail-related" aria-labelledby="stoneGuideTitle">
          <h2 id="stoneGuideTitle">Taş seçimi ve satın alma rehberi</h2>
          <p>Ölçü, parti fotoğrafı, yüzey seçimi ve teklif ayrıntıları hakkında bilgi edinin.</p>
          <nav aria-label="İlgili rehberler">
            {stone.city === "Afyonkarahisar" && <Link href="/tr/rehber/afyon-mermeri">Afyon mermeri seçimi →</Link>}
            <Link href="/tr/rehber/turkiye-mermer-cesitleri">Türkiye doğal taş rehberi →</Link>
            <Link href="/tr/rehber/mermer-blok-plaka">Blok ve plaka farkları →</Link>
          </nav>
        </section>
        <section className="detail-related detail-suppliers">
          <h2>Üreticileri ve tedarikçileri keşfedin</h2>
          <p>Gerçek firma kataloglarını ve ürün fotoğraflarını firma rehberinden inceleyin.</p>
          <nav aria-label="Firma rehberi"><a href="/tr/firmalar">Firma rehberine git →</a></nav>
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
