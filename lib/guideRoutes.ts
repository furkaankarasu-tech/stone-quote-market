export const guideLocales = ['tr', 'en', 'zh', 'ar'] as const;
export type GuideLocale = (typeof guideLocales)[number];
export function guidePath(locale: GuideLocale, slug?: string): string {
  const root = locale === 'tr' ? '/tr/rehber' : `/${locale}/guide`;
  return slug ? `${root}/${slug}` : root;
}
export function allGuideAlternates(slug?: string): Record<string,string> {
  return { 'tr-TR': guidePath('tr',slug), 'en-US': guidePath('en',slug), 'zh-CN': guidePath('zh',slug), 'ar': guidePath('ar',slug) };
}
