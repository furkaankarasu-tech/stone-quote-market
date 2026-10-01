const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
// Syntax-parse every TypeScript and JSX source, not just the newly added pages.
const sourceFiles=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 if(entry.isDirectory())walk(path.join(dir,entry.name));else if(/\.(tsx?|mjs)$/.test(entry.name))sourceFiles.push(path.join(dir,entry.name));
}}
for(const dir of ['app','components','lib'])walk(path.join(root,dir));
for(const file of sourceFiles.filter(f=>/\.tsx?$/.test(f))){
 const parsed=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,file.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 assert.equal(parsed.parseDiagnostics.length,0,`${file}: ${parsed.parseDiagnostics.map(d=>d.messageText).join('; ')}`);
}
const loaded={};
function localModule(rel){
 rel=path.normalize(rel);
 if(loaded[rel])return loaded[rel].exports;
 const filename=path.join(root,rel+'.ts');const src=fs.readFileSync(filename,'utf8');
 const js=ts.transpileModule(src,{fileName:filename,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}}; loaded[rel]=module;
 const requireLocal=target=>{assert(target.startsWith('.'));return localModule(path.normalize(path.join(path.dirname(rel),target)));};
 vm.runInNewContext('(function(module,exports,require){'+js+'\n})',{console})(module,module.exports,requireLocal);
 return module.exports;
}
const data=localModule('lib/translatedGuides');
const routes=localModule('lib/guideRoutes');
const expected=data.getGuides('tr').map(a=>a.slug);
assert.equal(expected.length,6,'six complete buyer guides');
for(const lang of routes.guideLocales){
 const guides=data.getGuides(lang);
 assert.deepEqual(Array.from(guides.map(g=>g.slug)),Array.from(expected),`same guide subjects for ${lang}`);
 for(const article of guides){
   assert(article.title&&article.description&&article.summary&&article.readingTime);
   assert(article.sections.length>=5,`article sections missing for ${lang}/${article.slug}`);
   for(const section of article.sections)assert(section.heading&&section.paragraphs.every(Boolean));
   assert(routes.guidePath(lang,article.slug).startsWith(lang==='tr'?'/tr/rehber/':`/${lang}/guide/`));
 }
}
assert.equal(Object.keys(routes.allGuideAlternates(expected[0])).length,4,'all hreflang alternatives');
assert(read('components/GuideLanguagePicker.tsx').includes('guidePath(next,slug)'), 'picker must retain article');
assert(read('lib/marketMarkup.ts').includes('durationMonths: plan.durationMonths'),'do not expose internal annual price to public page');
assert(!read('public/market/registration.js').includes('membershipConfig.plans[role].annualAmountTRY'),'no public price label');
assert(!read('lib/legalDocuments.ts').includes('annualAmountTRY'),'public legal terms contain no fixed amount');
assert(read('public/market/app.js').includes('renderGuideLocalized()'),'marketplace guide teaser must translate');
assert(read('public/market/app.js').includes('`/${state.lang}/guide`'),'all marketplace languages must lead to translated guide routes');
assert(read('app/sitemap.ts').includes('alternates:{languages:absoluteAlternates(guide.slug)}'),'localized guide sitemap alternatives');
assert(read('app/en/guide/page.tsx').includes('GuideIndex locale="en"'),'existing English landing route serves all translated guides');
assert(read('app/en/guide/turkish-marble-types/page.tsx').includes('permanentRedirect'),'old English article remains a redirect');
assert(read('next.config.mjs').includes('/en/guide/turkish-marble-types'),'legacy English link must redirect');
console.log('i18n + membership smoke passed: 4 languages × 6 complete guides, shared slugs, language switch, prices hidden, SEO links.');
console.log('TypeScript/TSX syntax parsed successfully:', sourceFiles.filter(f=>/\.tsx?$/.test(f)).length,'files.');
