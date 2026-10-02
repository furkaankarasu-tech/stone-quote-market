'use client';
import { useEffect } from 'react';
import { guidePath, type GuideLocale } from '@/lib/guideRoutes';

const names: Record<GuideLocale, string> = {tr:'TR · Türkçe',en:'EN · English',zh:'中文 · 简体',ar:'العربية'};
export default function GuideLanguagePicker({locale, slug}: {locale: GuideLocale;slug?:string}) {
  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('mb-lang',locale); } catch { /* optional preference */ }
    return () => { document.documentElement.lang = 'tr'; document.documentElement.dir = 'ltr'; };
  },[locale]);
  return <label className="guide-lang-switch">
    <span className="sr-only">Language / Dil / 语言 / اللغة</span>
    <select aria-label="Language / Dil / 语言 / اللغة" value={locale} onChange={event => {
      const next = event.target.value as GuideLocale;
      try { localStorage.setItem('mb-lang', next); } catch { /* optional preference */ }
      window.location.assign(guidePath(next,slug));
    }}>
      {Object.entries(names).map(([code,label]) => <option key={code} value={code}>{label}</option>)}
    </select>
  </label>;
}
