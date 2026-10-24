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
export function marketAlternates(tab?:MarketTab){return {...Object.fromEntries(guideLocales.map(locale=>[locale==='zh'?'zh-CN':locale,marketPath(locale,tab)])), 'x-default': marketPath('tr',tab)};}

export function companyNameSlug(name:string):string {
 return String(name).trim().replace(/[ıİ]/g,'i').replace(/[şŞ]/g,'s').replace(/[ğĞ]/g,'g').replace(/[üÜ]/g,'u').replace(/[öÖ]/g,'o').replace(/[çÇ]/g,'c').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-+|-+$/g,'').slice(0,100).replace(/-+$/,'')||'firma';
}
export function companyProfileSegments(rows:{id:string;name:string}[]):Record<string,string>{
 const fixed:Record<string,string>={'d26420b0-025d-4d92-8e58-7093895f925b':'kayman-mermer'};
 const bases=rows.map(row=>({id:row.id,base:fixed[row.id]||companyNameSlug(row.name)})).sort((a,b)=>a.id.localeCompare(b.id));
 const reserved=new Set(Object.values(fixed));const used=new Set<string>();const result:Record<string,string>={};
 for(const row of bases){
  let slug=row.base;
  if(!fixed[row.id]&&(reserved.has(slug)||bases.filter(x=>x.base===slug).length>1))slug=`${slug}-${row.id.replace(/-/g,'').slice(0,8)}`;
  let candidate=slug;let count=2;
  while(used.has(candidate)||(!fixed[row.id]&&reserved.has(candidate)))candidate=`${slug}-${count++}`;
  result[row.id]=candidate;used.add(candidate);
 }
 return result;
}
