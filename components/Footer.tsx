"use client";
import { usePathname } from "next/navigation";
import { getLegalLinks, legalUi } from "@/lib/legalDocuments";
export default function Footer() {
 const path=usePathname()||'/';
 const lang=path.startsWith('/en')?'en':path.startsWith('/zh')?'zh':path.startsWith('/ar')?'ar':'tr';
 const legalLinks=getLegalLinks(lang);
 const labels={tr:['Mermer Rehberi','Firmalar için','Hakkımızda','İletişim'],en:['Buyer Guides','For Companies','About Us','Contact'],zh:['石材指南','企业会员','关于我们','联系我们'],ar:['دليل الرخام','للشركات','من نحن','اتصل بنا']}[lang];
 return <footer lang={lang} dir={lang==='ar'?'rtl':'ltr'}><div className="footer-brand"><img src="/icon.png?v=mb" width="32" height="32" alt=""/>Marble <span>Borsa</span></div><p id="footerText">{({tr:"Marble Borsa · Doğal taş B2B platformu",en:"Marble Borsa · B2B natural stone marketplace",zh:"Marble Borsa · 天然石材B2B平台",ar:"Marble Borsa · منصة الحجر الطبيعي للشركات"})[lang]}</p><nav className="legal-links" aria-label={({tr:"İçerik bağlantıları",en:"Site links",zh:"网站链接",ar:"روابط الموقع"})[lang]}><a id="footer-guide" href={lang==='tr'?'/tr/rehber':`/${lang}/guide`}>{labels[0]}</a><a href={`/${lang}/firmalar-icin`}>{labels[1]}</a><a href={`/${lang}/hakkimizda`}>{labels[2]}</a><a href={`/${lang}/iletisim`}>{labels[3]}</a></nav><nav className="legal-links" aria-label={legalUi[lang].heading}>{legalLinks.map(link=><a key={link.href} href={link.href} data-legal={link.href.split('/').at(-1)}>{link.label}</a>)}</nav><a href="mailto:info@marbleborsa.com">info@marbleborsa.com</a><span>© 2026 · Marble Borsa</span></footer>;
}
