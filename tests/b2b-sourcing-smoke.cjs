const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const src=read('lib/sourcingContent.ts');
const compiled=ts.transpileModule(src,{fileName:'sourcingContent.ts',compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const moduleObj={exports:{}};
vm.runInNewContext(`(function(module,exports){${compiled}\n})`,{console})(moduleObj,moduleObj.exports);
const {sourcingPath,sourcingRoute,sourcingAlternates,sourcingLocales,sourcingTopics,getSourcingCopy}=moduleObj.exports;
assert.equal(sourcingLocales.length,4);
assert.equal(sourcingTopics.length,2);
const paths=new Set();
for(const locale of sourcingLocales){
 for(const topic of sourcingTopics){
  const route=sourcingPath(topic,locale);
  assert(!paths.has(route),'duplicate route: '+route);
  paths.add(route);
  assert.equal(sourcingRoute(locale,route.split('/').at(-1)),topic,'route resolution mismatch');
  const copy=getSourcingCopy(locale,topic);
  for(const field of ['title','description','eyebrow','intro','firstCta','secondCta','sectionTitle','otherTopicLabel','notice'])
   assert(copy[field]?.length>4,locale+'/'+topic+' missing '+field);
  assert.equal(copy.steps.length,3);
  assert(copy.steps.every(x=>x.heading.length>3&&x.body.length>20));
  assert(copy.details.length>=2&&copy.details.every(x=>x.heading&&x.paragraphs.length));
  assert(copy.faqs.length>=2&&copy.faqs.every(x=>x.question&&x.answer));
  assert.equal(Object.keys(sourcingAlternates(topic)).length,4);
 }
}
assert(getSourcingCopy('tr','quote').intro.includes('mermer satmaz'));
assert(getSourcingCopy('tr','b2b').details.some(x=>x.paragraphs.some(s=>s.includes('komisyoncu değildir'))));
assert(read('app/sitemap.ts').includes('sourcingLocales.flatMap'));
assert(read('app/[locale]/[category]/page.tsx').includes('sourcingRoute(locale,category)'));
assert(read('app/[locale]/[category]/page.tsx').includes('languages:sourcingAlternates(topic)'));
assert(read('components/SourcingLanguagePicker.tsx').includes('sourcingPath(topic,next)'));
assert(read('lib/marketMarkup.ts').includes('id="sourcing-quote-link"'));
assert(read('lib/marketMarkup.ts').includes('id="sourcing-b2b-link"'));
assert(read('public/market/app.js').includes('sourcingUi[state.lang]'));
assert(read('components/GuideShell.tsx').includes("sourcingPath(topic,locale)"));
assert(!/mermer satışı yapıyoruz|stoklarımızdaki mermerleri satın alın/i.test(src),'platform must not claim to sell stock');
console.log('B2B sourcing smoke passed: 8 unique localized pages, translated content, honest business model, hreflang, sitemap, links and language switch.');
