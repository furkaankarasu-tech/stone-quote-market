'use client';
import { sourcingPath, type SourcingTopic } from '@/lib/sourcingContent';
import type { GuideLocale } from '@/lib/guideRoutes';

const languageNames: Record<GuideLocale,string> = { tr:'TR · Türkçe', en:'EN · English', zh:'中文 · 简体', ar:'العربية' };
export default function SourcingLanguagePicker({ locale, topic }: {locale: GuideLocale; topic: SourcingTopic}) {
  return <label className="guide-lang-switch">
    <span className="sr-only">Language / Dil / 语言 / اللغة</span>
    <select aria-label="Language / Dil / 语言 / اللغة" value={locale} onChange={event => {
      const next=event.target.value as GuideLocale;
      try {localStorage.setItem('mb-lang',next);} catch { /* optional */ }
      window.location.assign(sourcingPath(topic,next));
    }}>{Object.entries(languageNames).map(([code,label]) => <option key={code} value={code}>{label}</option>)}</select>
  </label>;
}
