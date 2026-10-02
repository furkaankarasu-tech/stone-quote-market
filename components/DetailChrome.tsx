import Link from 'next/link';
import type { ReactNode } from 'react';
import GuideLanguagePicker from './GuideLanguagePicker';
import { legalLinks } from '@/lib/legalDocuments';
import { guidePath, type GuideLocale } from '@/lib/translatedGuides';

const ui = {
  tr: {strap:'DOĞAL TAŞ TEDARİK PLATFORMU',stone:'Doğal Taş',companies:'Firmalar',machines:'Makine & Sarf',services:'Hizmetler',guides:'Mermer Rehberi',legal:'Yasal metinler',login:'Giriş Yap',signup:'Üye Ol'},
  en: {strap:'NATURAL STONE SOURCING PLATFORM',stone:'Natural Stone',companies:'Companies',machines:'Machinery & Supplies',services:'Services',guides:'Buyer Guides',legal:'Legal notices',login:'Sign in',signup:'Join'},
  zh: {strap:'天然石材采购平台',stone:'天然石材',companies:'企业',machines:'机械与耗材',services:'服务',guides:'石材选购指南',legal:'法律文件',login:'登录',signup:'注册'},
  ar: {strap:'منصة توريد الحجر الطبيعي',stone:'الحجر الطبيعي',companies:'الشركات',machines:'المعدات واللوازم',services:'الخدمات',guides:'دليل شراء الرخام',legal:'المستندات القانونية',login:'تسجيل الدخول',signup:'إنشاء حساب'}
} as const;
const marketplaceLink = (path:string, locale:GuideLocale) => `/tr/${path}${locale === 'tr'?'':`?lang=${locale}`}`;

export function DetailHeader({ language = 'tr', slug, languagePicker }: { language?: GuideLocale; slug?: string; languagePicker?: ReactNode }) {
  const t=ui[language];
  return <>
    <div className="brand-strip"><span>{t.strap}</span></div>
    <header className="site-header detail-header">
      <Link className="brand" href={language === 'tr' ? '/' : `/?lang=${language}`}>
        <span className="brand-symbol">M<span>◈</span></span>
        <span>Marble <span>Borsa</span><small>NATURAL STONE MARKETPLACE</small></span>
      </Link>
      <nav className="detail-nav" aria-label="Primary navigation">
        <Link href={marketplaceLink('dogal-tas',language)}>{t.stone}</Link>
        <Link href={marketplaceLink('firmalar',language)}>{t.companies}</Link>
        <Link href={marketplaceLink('makine-sarf',language)}>{t.machines}</Link>
        <Link href={marketplaceLink('hizmetler',language)}>{t.services}</Link>
        <Link href={guidePath(language)}>{t.guides}</Link>
      </nav>
      <div className="detail-header-actions">
        {languagePicker ?? <GuideLanguagePicker locale={language} slug={slug}/>}
        <a className="detail-auth-link" href={`/tr/profil?auth=login${language === 'tr'?'':`&lang=${language}`}`}>{t.login}</a>
        <a className="detail-auth-link detail-auth-primary" href={`/tr/profil?auth=signup${language === 'tr'?'':`&lang=${language}`}`}>{t.signup}</a>
      </div>
    </header>
  </>;
}

export function DetailFooter({ language = 'tr' }: {language?: GuideLocale}) {
  const t=ui[language];
  return <footer lang={language} dir={language === 'ar'?'rtl':'ltr'}>
    <div className="footer-brand">Marble <span>Borsa</span></div>
    <nav className="legal-links" aria-label="Guide navigation">
      <Link href={guidePath(language)}>{t.guides}</Link>
      <Link href={marketplaceLink('dogal-tas',language)}>{t.stone}</Link>
    </nav>
    <nav className="legal-links" aria-label={t.legal}>
      {legalLinks.map(link => <a key={link.href} href={link.href} data-legal={link.href.split('/').at(-1)}>{language==='tr'?link.label:`${language==='en'?'Legal notice':language==='zh'?'法律文件':'مستند قانوني'} (TR): ${link.label}`}</a>)}
    </nav>
    <span>© 2026 Marble Borsa</span>
  </footer>;
}
