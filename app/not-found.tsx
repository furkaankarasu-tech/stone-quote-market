import Link from "next/link";
export default function NotFound() {
  return <main id="main-content" tabIndex={-1} className="seo-not-found"><Link href="/" className="seo-brand"><img src="/icon.png?v=mb" width="43" height="43" alt="" />Marble Borsa</Link><span className="guide-kicker">404 · SAYFA BULUNAMADI</span><h1>Aradığınız sayfaya ulaşamadık</h1><p>Bağlantı değişmiş veya sayfa kaldırılmış olabilir. İhtiyacınız olan bölüme aşağıdan devam edebilirsiniz.</p><nav aria-label="Alternatif sayfalar"><Link href="/">Ana Sayfa</Link><Link href="/tr/dogal-tas">Doğal Taş</Link><Link href="/tr/firmalar">Firmalar</Link><Link href="/tr/rehber">Mermer Rehberi</Link></nav></main>;
}
