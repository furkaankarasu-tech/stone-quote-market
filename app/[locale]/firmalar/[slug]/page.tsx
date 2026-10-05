import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { publicAssetUrl, publicCatalog, publicCompanies, uuidPattern } from "@/lib/publicDirectory";
import { buildMetadata } from "@/lib/seo";
import "./company.css";

type Params = { locale: string; slug: string };
async function findCompany(id: string) {
  if (!uuidPattern.test(id)) return null;
  const companies = await publicCompanies();
  return companies.find((company) => company.company_id === id && ["companies", "machines", "services"].includes(company.section)) || null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "tr" || !uuidPattern.test(slug)) return {};
  try {
    const company = await findCompany(slug);
    if (!company) return {};
    return buildMetadata({ title: `${company.name} Firma Profili`,
      description: `${company.name}${company.city ? `, ${company.city}` : ""} firma profili ve yayınlanan ürün kataloğu.`,
      path: `/tr/firmalar/${slug}` });
  } catch { return {}; }
}

export default async function CompanyPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (locale !== "tr") notFound();
  if (!uuidPattern.test(slug)) permanentRedirect("/tr/firmalar");
  let company;
  try { company = await findCompany(slug); } catch { company = null; }
  if (!company) notFound();
  let items: Awaited<ReturnType<typeof publicCatalog>> = [];
  try { items = (await publicCatalog()).filter((item) => item.company_id === slug); } catch { /* Directory remains usable. */ }
  const logo = publicAssetUrl("mb-company-logos", company.logo_path);
  const categoryPath = (category: string) => category === "stone" ? "dogal-tas" : category === "service" ? "hizmetler" : "makine-sarf";
  const categoryLabel = (category: string) => ({ stone: "Doğal taş", machine: "Makine", supplies: "Sarf malzemesi", service: "Hizmet" })[category as "stone" | "machine" | "supplies" | "service"] || "Katalog";
  const activity = ({ quarry: "Ocak", factory: "Fabrika", trader: "Tedarikçi", machine: "Makine üreticisi", supplies: "Sarf tedarikçisi", logistics: "Lojistik", customs: "Gümrük", quality: "Kalite kontrol" } as Record<string, string>)[company.activity_type] || "Sektör firması";
  return <main className="company-page">
    <header className="company-header"><Link href="/" className="company-brand">M. <span>Marble Borsa</span></Link><nav aria-label="Ana gezinme"><Link href="/tr/dogal-tas">Doğal Taş</Link><Link href="/tr/firmalar">Firmalar</Link><Link href="/tr/makine-sarf">Makine &amp; Sarf</Link><Link href="/tr/hizmetler">Hizmetler</Link></nav></header>
    <div className="company-shell"><div className="company-breadcrumb"><Link href="/">Ana Sayfa</Link><span>›</span><Link href="/tr/firmalar">Firmalar</Link><span>›</span><span>{company.name}</span></div>
      <section className="company-hero"><div className="company-hero-logo">{logo ? <img src={logo} alt={`${company.name} logosu`} /> : <span>{company.name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase()}</span>}</div><div><span className="company-eyebrow">DOĞRULANMIŞ FİRMA</span><h1>{company.name}</h1><p>{[company.city, activity].filter(Boolean).join(" · ")}</p></div></section>
      <section className="company-catalog"><div className="company-section-heading"><div><span className="company-eyebrow">FİRMA KATALOĞU</span><h2>Ürün ve hizmetler</h2></div><span>{items.length} kayıt</span></div>
        {items.length ? <div className="company-products">{items.map((item) => {
          const image = publicAssetUrl("mb-catalog-assets", item.image_paths?.[0]);
          return <article className="company-product" key={item.id}>
            {image ? <img src={image} alt={item.title} loading="lazy" /> : <div className="company-product-placeholder" aria-hidden="true">M.</div>}
            <div><span className="company-eyebrow">{categoryLabel(item.category)}</span><h3>{item.title}</h3><p>{item.description}</p><Link href={`/tr/${categoryPath(item.category)}?catalog=${encodeURIComponent(item.id)}`}>Kataloğu incele ↗</Link></div>
          </article>;
        })}</div> : <p className="company-empty">Bu firma henüz herkese açık katalog kaydı yayınlamadı.</p>}
      </section><div className="company-bottom"><Link href="/tr/firmalar">← Firma rehberine dön</Link><Link href="/tr/profil">Profilim ↗</Link></div>
    </div>
  </main>;
}
