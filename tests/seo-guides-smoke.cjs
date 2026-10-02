const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const exists = p => fs.existsSync(path.join(root,p));
for (const p of [
  'app/[locale]/rehber/page.tsx','app/[locale]/rehber/[slug]/page.tsx',
  'app/[locale]/guide/page.tsx','app/[locale]/guide/[slug]/page.tsx',
  'app/icon.png','app/apple-icon.png','app/favicon.ico','public/og-marbleborsa.png'
]) assert(exists(p), `SEO route/asset missing: ${p}`);
for (const key of ['afyon-mermeri','mermer-blok-plaka','turkiye-mermer-cesitleri']) {
  assert(read('lib/guideContent.ts').includes(`slug: '${key}'`), `missing ${key}`);
}
const sitemap=read('app/sitemap.ts');
assert.match(sitemap,/guideLocales\.flatMap/);
assert.match(sitemap,/guidePath\(locale,guide\.slug\)/);
const article=read('app/[locale]/rehber/[slug]/page.tsx');
assert.match(article,/languages/);
assert.match(read('lib/seo.ts'),/languageAlternates/);
assert.match(read('components/GuideShell.tsx'),/İLGİLİ REHBERLER/);
assert.match(read('lib/marketMarkup.ts'),/market-guide-preview/);
assert.match(read('public/market/app.js'),/guide-nav-link/);
assert.match(read('app/robots.ts'),/allowIndexing/);
assert(!sitemap.includes('/tr/profil'), 'private user page should not be indexed');
assert(!sitemap.includes('/tr/yonetim'), 'admin page should not be indexed');
console.log('SEO guide smoke check passed: new routes, metadata, links, assets and private-route exclusion.');
const market = read('public/market/app.js');
assert.match(market,/\$\("logoutButton"\)\.hidden=!window\.MarbleAuthUser/, 'top bar logout should be visible for signed-in users');
for (const key of ['mermer-satin-alma','mermer-fiyatlari','mermer-cesitleri-kullanim-alanlari']) {
  assert(read('lib/guideContent.ts').includes(`slug: '${key}'`), `missing buyer-intent guide ${key}`);
}
assert.doesNotMatch(read('components/GuideShell.tsx'), /katalog|KATALOG|Dizinde inceleyin|relatedStones/, 'guide must remain independent from catalogue');
assert.match(read('lib/seo.ts'), /VERCEL_ENV === "preview"/, 'Preview must remain noindex');
if (exists('.env.production')) assert.match(read('.env.production'), /https:\/\/www\.marbleborsa\.com/, 'production canonical host incorrect');
console.log('SEO v2 checks passed: preview safety, production domain, generic buyers guides, header logout.');
