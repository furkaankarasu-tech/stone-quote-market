export const guideLocales = ['tr', 'en', 'zh', 'ar'] as const;
export type GuideLocale = (typeof guideLocales)[number];
export function guidePath(locale: GuideLocale, slug?: string): string {
  const root = locale === 'tr' ? '/tr/rehber' : `/${locale}/guide`;
  return slug ? `${root}/${slug}` : root;
}
export function allGuideAlternates(slug?: string): Record<string,string> {
  return { 'tr-TR': guidePath('tr',slug), 'en-US': guidePath('en',slug), 'zh-CN': guidePath('zh',slug), 'ar': guidePath('ar',slug) };
}

export const marketRouteSegments = {
 tr:{stones:'dogal-tas',companies:'firmalar',machines:'makine-sarf',services:'hizmetler',requests:'alim-talepleri'},
 en:{stones:'natural-stone',companies:'companies',machines:'machinery-supplies',services:'services',requests:'buying-requests'},
 zh:{stones:'natural-stone',companies:'companies',machines:'machinery-supplies',services:'services',requests:'buying-requests'},
 ar:{stones:'natural-stone',companies:'companies',machines:'machinery-supplies',services:'services',requests:'buying-requests'}
} as const;
export type MarketTab = keyof typeof marketRouteSegments.tr;
export function marketPath(locale:GuideLocale,tab?:MarketTab):string {return tab?`/${locale}/${marketRouteSegments[locale][tab]}`:locale==='tr'?'/':`/${locale}`;}
export function marketAlternates(tab?:MarketTab){return Object.fromEntries(guideLocales.map(locale=>[locale==='zh'?'zh-CN':locale,marketPath(locale,tab)]));}
