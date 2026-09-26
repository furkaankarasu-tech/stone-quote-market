import Link from "next/link";
import { legalLinks } from "@/lib/legalDocuments";

export function DetailHeader() {
  return <>
    <div className="demo-strip"><span>DOĞAL TAŞ TEDARİK PLATFORMU</span><strong>ÖZEL DEMO</strong></div>
    <header className="site-header detail-header">
      <Link className="brand" href="/tr/dogal-tas">
        <span className="brand-symbol">M<span>◈</span></span>
        <span>Marble <span>Borsa</span><small>NATURAL STONE MARKETPLACE</small></span>
      </Link>
      <nav className="detail-nav" aria-label="Ana gezinme">
        <Link href="/tr/dogal-tas">Doğal Taş</Link>
        <Link href="/tr/firmalar">Firmalar</Link>
        <Link href="/tr/makine-sarf">Makine &amp; Sarf</Link>
        <Link href="/tr/hizmetler">Hizmetler</Link>
      </nav>
    </header>
  </>;
}

export function DetailFooter() {
  return <footer>
    <div className="footer-brand">Marble <span>Borsa</span></div>
    <nav className="legal-links" aria-label="Yasal metinler">
      {legalLinks.map((link) => <a key={link.href} href={link.href} data-legal={link.href.split("/").at(-1)}>{link.label}</a>)}
    </nav>
    <span>© 2026 · DEMO</span>
  </footer>;
}
