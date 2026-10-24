const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const events = new Map();
const elements = new Map();
function element(id) {
  if (!elements.has(id)) elements.set(id, {
    id, textContent: '', innerHTML: '', value: '', hidden: id === 'modal',
    style: {}, dataset: {}, classList: {add(){}, remove(){}, toggle(){}},
    setAttribute(){}, addEventListener(type, fn){events.set(`${id}:${type}`, fn)},
    querySelector(){return {focus(){},setAttribute(){}}}, scrollIntoView(){}, focus(){}
  });
  return elements.get(id);
}
const document = {
  body: {style: {}}, documentElement: {lang: 'tr', dir: 'ltr'}, head: {appendChild(node){return node}},
  getElementById(id) {
    if (id === "mb-ad-slot") return null;
    const result = element(id);
    if (id === 'mb-company-data') result.textContent = '[]';
    if (id === 'mb-membership-plans') result.textContent = JSON.stringify({plans:{supplier:{annualAmountTRY:25000},service:{annualAmountTRY:15000}},contactEmail:'example@example.com'});
    if (id === 'mb-page-seo') result.textContent = JSON.stringify({siteUrl:'https://www.marbleborsa.com'});
    return result;
  },
  addEventListener(type, fn) {const callbacks=events.get(type)||[];callbacks.push(fn);events.set(type, callbacks)},
  querySelector(){return null}, querySelectorAll(){return []}, createElement(){return element('created')}
};
const location = {pathname:'/', search:'', hash:''};
const history = {pushState(_a,_b,url){location.pathname=url.split('?')[0]},replaceState(_a,_b,url){location.pathname=url.split('?')[0]}};
const window = {addEventListener(){},dispatchEvent(){}};
const context = vm.createContext({document,window,location,history,URL,URLSearchParams,Intl,Event:class{constructor(type){this.type=type}},
  localStorage:{getItem(){return null},setItem(){}},setTimeout(){return 1},clearTimeout(){},console});
vm.runInContext(fs.readFileSync(path.join(root,'public/market/app.js'),'utf8'),context);
const companyId='123e4567-e89b-12d3-a456-426614174001';
window.MarbleDirectoryState={status:'ready',companies:[{id:companyId,name:'Afyon Gerçek Mermer',city:'Afyonkarahisar',activity_type:'quarry',section:'companies',logo_url:'https://example.com/logo.png'}]};
window.MarbleCatalogState={status:'ready',items:[{id:'catalog-1',company_id:companyId,title:'Afyon White Plaka',category:'stone',description:'Mermer',image_urls:['https://example.com/1.png'],pdf_url:'',video_url:''}]};
window.MarbleUIRefresh();
assert.equal(element('signupButton').hidden,true,'Catalogue refresh must not resolve authentication');
assert.equal(element('accountButton').disabled,true);
assert.equal(element('accountButton').textContent,'','Pending auth must not print a checking caption or flash sign in');
assert.equal(element('logoutButton').hidden,true);
assert.ok(fs.readFileSync(path.join(root,'components/Header.tsx'),'utf8').includes('disabled aria-busy="true" aria-label={words[language].checking}/>'));
vm.runInContext("function liveCopy(){return {workspace:'',footer:''}}",context);
window.MarbleAuthSettled=true;window.MarbleAuthUser={id:'cached-user',email_confirmed_at:'2026-01-01'};
window.MarbleUIRefresh();
assert.equal(element('signupButton').hidden,true);
assert.equal(element('accountButton').textContent,'Profil');
window.MarbleAuthUser=null;window.MarbleUIRefresh();
assert.equal(element('signupButton').hidden,false);
vm.runInContext("setTab('companies')",context);
assert.match(element('cards').innerHTML,/href="\/tr\/firmalar\/afyon-gercek-mermer"/);
vm.runInContext("setTab('stones')",context);
assert.match(element('categoryCompaniesList').innerHTML,/Firma kataloğu/);
assert.match(element('categoryCompaniesList').innerHTML,/Afyon White Plaka/);
assert.doesNotMatch(element('cards').innerHTML,/Afyon White Plaka/);
assert.match(element('cards').innerHTML,/Tür rehberi/);
assert.match(element('categoryCompaniesList').innerHTML,/data-card="catalog-catalog-1"/);
assert.match(element('cards').innerHTML,/TÜR REHBERİ/);
window.MarbleDirectoryState={status:'ready',companies:[]};
window.MarbleCatalogState={status:'ready',items:[]};
vm.runInContext("setTab('companies')",context);
assert.match(element('emptyState').textContent,/Henüz yayında onaylı firma yok/);
console.log('Market listing smoke check passed: real company links, category guide, empty directory.');

vm.runInContext("authResolved=true;function liveCopy(){return {workspace:'',footer:''}}",context);
window.MarbleAuthUser={id:'test-user'};
window.MarbleDBState={status:'ready',account:{profile:{account_role:'supplier'},activeSupplier:true}};
vm.runInContext("setTab('stones')",context);
assert.equal(element('newRequestButton').hidden,true);
vm.runInContext("setTab('machines')",context);
assert.equal(element('newRequestButton').hidden,false);
const savedGateUser=window.MarbleAuthUser;
window.MarbleCatalogState={status:'ready',items:[{id:'gate-test',company_id:companyId,title:'Tek Fotoğraf',category:'stone',description:'Firma adı açıklamada',image_urls:['https://example.com/one.jpg'],pdf_url:'https://example.com/company.pdf',video_url:'https://example.com/company-video'}]};
const publicItems=vm.runInContext('catalogueItems()',context);
assert.equal(publicItems.length,1);assert.equal(publicItems[0].company_id,companyId);assert.equal(publicItems[0].pdf_url,'https://example.com/company.pdf');assert.equal(publicItems[0].description,'Firma adı açıklamada');
window.MarbleAuthUser={email_confirmed_at:'2026-10-13'};
assert.equal(vm.runInContext('catalogueItems()[0].company_id',context),companyId);
window.MarbleAuthUser=null;
assert.equal(vm.runInContext('catalogueItems()[0].company_id',context),companyId);
vm.runInContext("showCatalogItem('gate-test')",context);
assert.match(element('modalBody').innerHTML,/https:\/\/example.com\/company.pdf/);
assert.match(element('modalBody').innerHTML,/Firma adı açıklamada/);
window.MarbleAuthUser=savedGateUser;
window.MarbleCatalogState={status:'ready',items:[]};
vm.runInContext("setTab('services')",context);
assert.equal(element('newRequestButton').hidden,false);
vm.runInContext("var opened='';equipmentRequestModal=()=>{opened='equipment'};serviceRequestModal=()=>{opened='service'};requestModal=()=>{opened='stone'}",context);
function heroClick(){for(const callback of events.get('click')||[])callback({target:{id:'newRequestButton',closest(){return null}}})}
heroClick();assert.equal(vm.runInContext('opened',context),'service');
vm.runInContext("setTab('machines')",context);heroClick();assert.equal(vm.runInContext('opened',context),'equipment');
window.MarbleDBState.account={profile:{account_role:'buyer'}};
vm.runInContext("setTab('stones')",context);heroClick();assert.equal(vm.runInContext('opened',context),'stone');
console.log('Category request routing and supplier role checks passed.');

// Exercise the actual request UI with owner, provider, closed and failed-save states.
vm.runInContext(fs.readFileSync(path.join(root,'public/market/live-ui.js'),'utf8'),context);
vm.runInContext('modal=(_eyebrow,_title,body)=>{document.getElementById("modalBody").innerHTML=body}',context);
const request={id:'request-1',buyer_id:'test-user',status:'open',item:'Test stone',format:'slab',quantity:1,unit:'m²',destination:'Test',notes:'',offers:[{id:'offer-1',supplier_id:'other',unit_price:1,currency:'TRY',notes:'Test'}]};
window.MarbleDBState.requests=[request];
vm.runInContext('realRequestDetail("request-1")',context);
assert.match(element('modalBody').innerHTML,/data-request-status=/);
assert.match(element('modalBody').innerHTML,/data-accept-live=/);
request.status='closed';
vm.runInContext('realRequestDetail("request-1")',context);
assert.match(element('modalBody').innerHTML,/Yeniden aç/);
assert.doesNotMatch(element('modalBody').innerHTML,/data-accept-live=|data-offer=/);
let saves=0;
window.MarbleDB={async setRequestStatus(_id,status){saves++;request.status=status},async refresh(){}};
const lifecycleChecks = (async()=>{
  const button={disabled:false,isConnected:true};
  await vm.runInContext('saveRequestStatus',context)(button,'request-1','open');
  assert.equal(request.status,'open');assert.equal(button.disabled,false);assert.equal(saves,1);
  window.MarbleAuthUser={id:'intruder'};
  await vm.runInContext('saveRequestStatus',context)(button,'request-1','closed');
  assert.equal(saves,1);assert.equal(request.status,'open');
  window.MarbleAuthUser={id:'test-user'};
  window.MarbleDB.setRequestStatus=async()=>{throw {code:'PGRST202'}};
  await vm.runInContext('saveRequestStatus',context)(button,'request-1','closed');
  assert.equal(request.status,'open');assert.equal(button.disabled,false);
  assert.match(element('toast').textContent,/henüz etkin değil/);
  console.log('Request lifecycle passed: closed acceptance blocked, owner saves, outsider blocked, missing RPC handled.');
})().catch(error=>{console.error(error);process.exitCode=1});

// Ad helpers use the actual shared client code; no live service or secrets are needed.
const adWindow={dispatchEvent(){},addEventListener(){}};
const adContext=vm.createContext({window:adWindow,document:{getElementById(){return null}},URL,Intl,console,Event:class{},setTimeout(){},clearTimeout(){}});
vm.runInContext(fs.readFileSync(path.join(root,'public/market/db.js'),'utf8'),adContext);
const ad=adWindow.MarbleAdsUtils;
for(const bad of ['javascript:alert(1)','http://example.com','https://user:password@example.com','https://example.com/path with space'])assert.equal(ad.url(bad),'');
assert.equal(ad.url('https://example.com'),'https://example.com/');
assert.equal(ad.isoDate('2026-10-06T12:30'),'2026-10-06T09:30:00.000Z');
assert.equal(ad.localDate('2026-10-06T09:30:00.000Z'),'2026-10-06T12:30');
assert.throws(()=>ad.isoDate('2026-02-30T12:30'));
assert.equal(ad.section('/tr/profil'),null);
assert.equal(ad.section('/tr/makine-sarf'),'machine');
assert.equal(ad.visible({starts_at:'2026-01-01',ends_at:'2026-01-02'},Date.parse('2026-01-03')),false);
const card=ad.card({company_name:'Test',title:'<script>alert(1)</script>',target_url:'https://example.com/?a=1&b=2'},'https://example.com/image.png');
assert.doesNotMatch(card,/<script>/);assert.match(card,/&lt;script&gt;/);assert.match(card,/noopener noreferrer sponsored/);
assert.equal(ad.card({target_url:'javascript:alert(1)'},'https://example.com/image.png'),'');
console.log('Advertising helpers passed: safe links/content, Turkish scheduling, calendar validation, category and expiry filters.');

// Server directory must use the same complete public key as the browser.
(async () => {
  const ts = require('typescript');
  const exports = {};
  let fail = false;
  let options;
  const source = fs.readFileSync(path.join(root, 'lib/publicDirectory.ts'), 'utf8');
  const guide={exports:{}};vm.runInNewContext(ts.transpile(fs.readFileSync(path.join(root,'lib/guideRoutes.ts'),'utf8'),{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}),guide);
  vm.runInNewContext(ts.transpile(source, {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}), {exports,require:()=>guide.exports, process: {env: {}}, AbortSignal, fetch: async (_, init) => {options = init; return {ok: !fail, status: 401, json: async () => [{company_id: 'test'}]};}});
  assert.equal((await exports.publicCompanies()).length, 1);
  const bundle = fs.readFileSync(path.join(root, 'public/market/auth.bundle.js'), 'utf8');
  assert.ok(bundle.includes('"' + options.headers.apikey + '"'));
  assert.equal(options.cache, 'no-store');
  fail = true;
  await assert.rejects(exports.publicCompanies());
  assert.equal(exports.publicAssetUrl('mb-company-logos', '../../secret'), '');
  console.log('Server directory checks passed: matching key, fresh data, fetch failure, asset validation.');
})().catch(error => {console.error(error); process.exitCode = 1;});

lifecycleChecks.then(() => {
// Public category visibility must include every approved section without
// exposing member-only data in the server-rendered HTML.
window.MarbleDirectoryState={status:'ready',companies:[
 {id:companyId,name:'Taş Üreticisi',city:'Afyon',activity_type:'quarry',section:'companies',logo_url:'https://example.com/stone.png'},
 {id:'123e4567-e89b-12d3-a456-426614174002',name:'Makine Firması',city:'İzmir',activity_type:'machine',section:'machines',logo_url:''},
 {id:'123e4567-e89b-12d3-a456-426614174003',name:'Hizmet Firması',city:'İstanbul',activity_type:'logistics',section:'services',logo_url:''}
]};
window.MarbleCatalogState={status:'ready',items:[]};
window.MarbleAuthUser=null;window.MarbleDBState={status:'signed_out',account:null,requests:[]};
vm.runInContext("setLanguage('tr');setTab('companies')",context);
assert.match(element('cards').innerHTML,/Taş Üreticisi/);
assert.match(element('cards').innerHTML,/Makine Firması/);
assert.match(element('cards').innerHTML,/Hizmet Firması/);
vm.runInContext("setTab('stones')",context);
assert.equal(element('categoryCompanies').hidden,false);
assert.match(element('categoryCompaniesList').innerHTML,/Taş Üreticisi/);
assert.doesNotMatch(element('categoryCompaniesList').innerHTML,/data-profile-login/);
window.MarbleAuthUser={email_confirmed_at:'2026-10-13'};
vm.runInContext("renderCategoryCompanies()",context);
assert.match(element('categoryCompaniesList').innerHTML,/Taş Üreticisi/);
window.MarbleAuthUser=null;
assert.doesNotMatch(element('categoryCompaniesList').innerHTML,/Hizmet Firması/);
vm.runInContext("setTab('services')",context);
assert.match(element('categoryCompaniesList').innerHTML,/Hizmet Firması/);
assert.doesNotMatch(element('categoryCompaniesList').innerHTML,/Taş Üreticisi/);
vm.runInContext("setTab('requests')",context);
assert.equal(location.pathname,'/tr/alim-talepleri','Guest access should explain authentication instead of redirecting to stones');
for(const language of ['en','zh','ar','tr']) {
 vm.runInContext(`setLanguage('${language}');setTab('home')`,context);
 assert.equal(document.documentElement.dir,language==='ar'?'rtl':'ltr');
 assert.match(element('cards').innerHTML,/beige\.webp/);
 assert.match(element('cards').innerHTML,/discovery-company-cover/);
}
const tsForMarkup = require('typescript');
const previousTsHook = require.extensions['.ts'];
require.extensions['.ts']=(module, filename)=>module._compile(tsForMarkup.transpile(fs.readFileSync(filename,'utf8'),{module:tsForMarkup.ModuleKind.CommonJS,target:tsForMarkup.ScriptTarget.ES2022}), filename);
const {marketMarkup,localizedMarkup,requestDescriptions}=require('../lib/marketMarkup.ts');
const serviceTypesSeed={status:'ready',companies:[{id:'logistics-check',name:'Reis Nakliyat Test',city:'Afyon',section:'services',activity_type:'logistics',logo_url:''},{id:'customs-check',name:'Customs Test',city:'Afyon',section:'services',activity_type:'customs',logo_url:''}],catalogStatus:'ready',items:[]};
const serviceTypeHtml=marketMarkup('hizmetler',false,serviceTypesSeed);
const serviceTypeCards=serviceTypeHtml.match(/<article class="card card-guide">[\s\S]*?<\/article>/g)||[];
assert.match(serviceTypeCards[0],/Reis Nakliyat Test/);assert.doesNotMatch(serviceTypeCards[0],/Customs Test/);
assert.match(serviceTypeCards[1],/Customs Test/);assert.doesNotMatch(serviceTypeCards[1],/Reis Nakliyat Test/);
const previousServiceDirectory=window.MarbleDirectoryState;window.MarbleDirectoryState=serviceTypesSeed;vm.runInContext("setTab('services')",context);
const dynamicServiceCards=element('cards').innerHTML.match(/<article class="card card-guide">[\s\S]*?<\/article>/g)||[];
assert.match(dynamicServiceCards[0],/Reis Nakliyat Test/);assert.doesNotMatch(dynamicServiceCards[1],/Reis Nakliyat Test/);
window.MarbleDirectoryState=previousServiceDirectory;
console.log('Service category company links passed: transport and customs firms appear only in matching guide cards, SSR and client.');

const groupedHtml=marketMarkup('dogal-tas',false,{status:'ready',companies:[{id:'owner-a',name:'Owner A',city:'Afyon',section:'companies',activity_type:'quarry'},{id:'owner-b',name:'Owner B',city:'Afyon',section:'companies',activity_type:'factory'}],catalogStatus:'ready',items:[{id:'owned-item',company_id:'owner-a',title:'Owned slab',category:'stone',description:'details',image_urls:['https://example.com/slab.jpg']}]});
const groupedCards=groupedHtml.match(/<article class="category-company">[\s\S]*?<\/article>/g)||[];
assert.equal(groupedCards.length,2);assert.match(groupedCards[0],/Owned slab/);assert.doesNotMatch(groupedCards[1],/Owned slab/);
assert.ok(groupedHtml.indexOf('Owned slab')<groupedHtml.indexOf('id="cards"'));assert.match(groupedCards[0],/\?catalog=owned-item/);
console.log('Catalogue grouping passed: correct owner card, crawlable detail link, no cross-company items.');

for(const route of [undefined,'dogal-tas','makine-sarf','hizmetler']) {
 const orderedHtml=marketMarkup(route,false,{status:'ready',companies:[],catalogStatus:'ready',items:[]});
 assert.ok(orderedHtml.indexOf('id="categoryCompanies"')<orderedHtml.indexOf('id="cards"'),'Companies must precede catalogue on home navigation and direct category routes');
}
console.log('Companies-first layout passed for home navigation and all three category routes.');

const {companySection}=require('../lib/publicDirectory.ts');
const {publicCompanyLogo}=require('../lib/publicDirectory.ts');
assert.ok(publicCompanyLogo({company_id:'d26420b0-025d-4d92-8e58-7093895f925b',logo_path:null}).startsWith('data:image/webp;base64,'),'Kayman supplied logo must render when no uploaded logo exists');
assert.equal(publicCompanyLogo({company_id:'unrelated-company',logo_path:null}),'','Provided artwork must not leak onto other firms');

for(const activity of ['logistics','shipping','fumigation','customs','quality','other'])assert.equal(companySection(activity,'companies'),'services');
assert.equal(companySection('machine','companies'),'machines');assert.equal(companySection('quarry','companies'),'companies');
const mixedDirectory={status:'ready',companies:[{id:'transport',name:'Transport Regression',activity_type:'logistics',section:'services',city:'Afyon'},{id:'stone',name:'Stone Regression',activity_type:'quarry',section:'companies',city:'Afyon'}],catalogStatus:'ready',items:[]};
const firmHtml=marketMarkup('firmalar',false,mixedDirectory);
assert.match(firmHtml,/Transport Regression/);
assert.match(firmHtml,/2 firma/);
const servicesHtml=marketMarkup('hizmetler',false,mixedDirectory);
assert.match(servicesHtml.match(/id="categoryCompaniesList">([\s\S]*?)<\/div>/)?.[1]||'',/Transport Regression/);
assert.doesNotMatch(servicesHtml.match(/id="categoryCompaniesList">([\s\S]*?)<\/div>/)?.[1]||'',/Stone Regression/);
const directoryBeforeServiceTest=window.MarbleDirectoryState;window.MarbleDirectoryState=mixedDirectory;vm.runInContext("setTab('companies')",context);
assert.match(element('cards').innerHTML,/Stone Regression/);assert.match(element('cards').innerHTML,/Transport Regression/);
vm.runInContext("state.companyCategory='logistics';renderCards()",context);assert.match(element('cards').innerHTML,/Transport Regression/);assert.doesNotMatch(element('cards').innerHTML,/Stone Regression/);vm.runInContext("state.companyCategory='all'",context);
vm.runInContext("setTab('services')",context);assert.match(element('categoryCompaniesList').innerHTML,/Transport Regression/);
window.MarbleDirectoryState=directoryBeforeServiceTest;
console.log('Service directory regression passed: categorized directory includes transport; logistics filter excludes stone firms; category lists retain correct firms.');

const visibleSupplierHtml=marketMarkup('dogal-tas',false,{status:'ready',companies:[{id:companyId,name:'SSR Supplier Check',city:'Afyon',section:'companies'}],catalogStatus:'ready',items:[]});
const supplierList=visibleSupplierHtml.match(/id="categoryCompaniesList">([\s\S]*?)<\/div>/)?.[1];
assert.match(supplierList||'',/SSR Supplier Check/,'Public stone supplier must be present inside the server-rendered company list');
assert.doesNotMatch(visibleSupplierHtml,/Tedarikçi firmaları görmek için giriş yapın/);
for(const locale of ['tr','en','zh','ar']) {
 const seed={status:'idle',companies:[],catalogStatus:'idle',items:[]};
 const html=localizedMarkup(undefined,true,seed,locale);
 const card=html.match(/<div class="profile-welcome">[\s\S]*?<\/div>/)?.[0];assert.ok(card);
 if(locale!=='tr')assert.doesNotMatch(card,/Profilinize|Taleplerinizi|Hesap Oluştur|Giriş Yap/);
 const expected={tr:'Profil',en:'Profile',zh:'个人资料',ar:'الملف الشخصي'}[locale];assert.ok(html.includes(`<h1 id="workspaceTitle">${expected}</h1>`));
 const requests=localizedMarkup('alim-talepleri',false,seed,locale);assert.ok(requests.includes(requestDescriptions[locale]));
}
console.log('First-render profile language and buying-request descriptions passed in four languages.');
const seed={...window.MarbleDirectoryState,catalogStatus:'ready',items:[{id:'catalog-test',company_id:companyId,title:'<script>unsafe</script>',description:'test',category:'stone',image_urls:['https://example.com/stone.png','https://example.com/2.png','https://example.com/3.png']}]};
for(const category of ['firmalar','dogal-tas','makine-sarf','hizmetler',undefined]) {
 const html=marketMarkup(category,false,seed);
 assert.match(html,/mb-public-directory/);
 const requestsHtml=marketMarkup('alim-talepleri',false,{status:'idle',companies:[],catalogStatus:'idle',items:[]});
 assert.doesNotMatch(requestsHtml,/listing-heading|9 sonuç/,'Private requests must not contain public catalogue headings or fake counts');
 for(const locale of ['en','zh','ar']){const homeHtml=localizedMarkup(undefined,false,{status:'ready',companies:[],catalogStatus:'ready',items:[]},locale);assert.doesNotMatch(homeHtml,/Companiesı|İhtiyaçtan teklife|Mermer ve traverten çeşitlerini keşfedin|Genel Bakış/,'Localized home must not contain mixed Turkish blocks');}

 assert.doesNotMatch(html,/Yükleniyor…/);
 assert.doesNotMatch(html,/<script>unsafe<\/script>/);
 if(category==='firmalar') assert.match(html,/Hizmet Firması/);
 if(category==='dogal-tas') {assert.match(html,/Taş Üreticisi/);assert.match(html,/&lt;script&gt;unsafe&lt;\/script&gt;/);}
}
require.extensions['.ts']=previousTsHook;
console.log('Server rendering and visibility passed: all directory sections, stone suppliers, escaped catalogue content, four UI languages and guest requests.');

}).catch(error=>{console.error(error);process.exitCode=1});

lifecycleChecks.then(()=>{
  vm.runInContext("setLanguage('tr');authResolved=true",context);
  window.MarbleAuthUser=null;window.MarbleDBState={status:'signed_out',account:null};
  vm.runInContext("setTab('requests')",context);
  assert.match(element('cards').innerHTML,/firma hesabınızla giriş yapın/);
  assert.match(element('cards').innerHTML,/data-profile-login/);
  assert.match(element('cards').innerHTML,/Firma Hesabı Oluştur/);
  assert.doesNotMatch(element('cards').innerHTML,/Firma bilgisi alınamadı/);
  window.MarbleAuthUser={id:'supplier-test'};
  window.MarbleDBState={status:'ready',account:{profile:{account_role:'supplier'},verification:{verified:false},activeSupplier:false}};
  window.MarbleUIRefresh();
  assert.match(element('cards').innerHTML,/henüz onaylanmadı/);
  window.MarbleDBState.account.verification.verified=true;
  window.MarbleUIRefresh();
  assert.match(element('cards').innerHTML,/üyeliğinizin aktif olması/);
  window.MarbleDBState.account.profile.account_role='buyer';
  window.MarbleUIRefresh();
  assert.match(element('cards').innerHTML,/Profil sayfanızdan/);
  console.log('Access gates passed: guest, pending approval, inactive membership and buyer profile access.');
}).catch(error=>{console.error(error);process.exitCode=1});

// Auth server failures must not be presented as bad credentials or a network outage.
{
  const registration=fs.readFileSync(path.join(root,'public/market/registration.js'),'utf8');
  const source=registration.slice(registration.indexOf('function friendlyAuthError('),registration.indexOf('function validDocument('));
  const authContext={state:{lang:'tr'},rt:key=>key,at:key=>key};
  vm.createContext(authContext);vm.runInContext(source,authContext);
  for (const login of [false,true]) {
    authContext.login=login;
    assert.match(vm.runInContext('friendlyAuthError({status:500,code:"unexpected_failure",message:"Database error saving new user"},login)',authContext),/sunucuda tamamlanamadı/);
  }
  assert.equal(vm.runInContext('friendlyAuthError({status:400,message:"Invalid login credentials"},true)',authContext),'badLogin');
  assert.equal(vm.runInContext('friendlyAuthError({name:"AuthRetryableFetchError",message:"Failed to fetch"})',authContext),'network');
  console.log('Authentication error classification passed.');
}

// Exercise the actual private-document resolver, including provider failures.
(async()=>{
  const source=fs.readFileSync(path.join(root,'public/market/db.js'),'utf8');
  const body=source.slice(source.indexOf('    async verificationDocument(ownerId) {'),source.indexOf('    async verify(applicationId'));
  const owner='f35cdbc8-1f73-482e-86da-b125fbd61d24';
  let response={data:{path:owner+'/company-document/latest.pdf'},error:null};
  let signed={data:{signedUrl:'https://example.com/private-document'},error:null};
  const calls=[];
  const storage={async createSignedUrl(name,ttl){calls.push({name,ttl});return signed}};
  const context={client:()=>({async rpc(name,args){assert.equal(name,'mb_admin_company_document');assert.equal(args.p_owner_id,owner);return response},storage:{from(bucket){assert.equal(bucket,'mb-company-documents-private');return storage}}}),checked:({data,error})=>{if(error)throw error;return data}};
  vm.createContext(context);const api=vm.runInContext('({' + body + '})',context);
  assert.equal(await api.verificationDocument(owner),'https://example.com/private-document');
  assert.equal(calls[0].name,owner+'/company-document/latest.pdf');assert.equal(calls[0].ttl,600);
  await assert.rejects(api.verificationDocument('../other'),/geçersiz/);
  for(const path of ['another-user/company-document/file.pdf',owner+'/company-document/../secret.pdf',owner+'/company-document/file.exe']){
    response={data:{path},error:null};await assert.rejects(api.verificationDocument(owner),/yolu geçersiz/);
  }
  response={data:null,error:null};assert.equal(await api.verificationDocument(owner),null);
  response={data:null,error:{code:'42501',message:'Access denied'}};await assert.rejects(api.verificationDocument(owner),e=>e.code==='42501');
  response={data:null,error:{code:'PGRST202',message:'Missing RPC'}};await assert.rejects(api.verificationDocument(owner),e=>e.code==='PGRST202');
  response={data:{path:owner+'/company-document/latest.pdf'},error:null};signed={data:{},error:null};await assert.rejects(api.verificationDocument(owner),/geçici bağlantı/);
  signed={data:null,error:new Error('Signing denied')};await assert.rejects(api.verificationDocument(owner),/Signing denied/);
  console.log('Admin document resolver passed: authenticated lookup RPC, owner/path validation, empty result, missing RPC, denied access and signing failures. Live SQL execution remains untested.');
})().catch(error=>{console.error(error);process.exitCode=1});

// Run the real destructive-action handlers: cancellation must never call the RPC.
(async()=>{
  const source=fs.readFileSync(path.join(root,'public/market/admin.js'),'utf8');
  const start=source.indexOf('    document.addEventListener("click", async (event) => {');
  const end=source.indexOf('\n    document.addEventListener("submit"',start);
  const handlerSource=source.slice(start,end);
  async function companyCase(name,confirm,payments=[],rpcError=null){
    let handler;const calls=[];const button={dataset:{companyDelete:'company-id'},disabled:false,isConnected:true};
    const context={adminActionError:e=>e?.message||"Please retry",adminText:x=>x,adminHtml:(parts,...values)=>parts.reduce((s,p,i)=>s+p+(values[i]??""),""),document:{addEventListener(type,fn){handler=fn}},current:{apps:[{id:'company-id',company_name:'TEST firma'}],payments},
      window:{MarbleAdminUI:{async open(options){if(options.expected!==undefined)return confirm?name:null;calls.push(['alert',options.text]);return null},notify:text=>calls.push(['alert',text])},MarbleDB:{async deleteCompany(id,text){calls.push(['delete',id,text]);if(rpcError)throw rpcError}}},
      async load(){calls.push(['refresh'])}};
    vm.createContext(context);vm.runInContext(handlerSource,context);
    await handler({target:{closest(selector){return selector==='[data-company-delete]'?button:null}}});
    assert.equal(button.disabled,false);return calls;
  }
  for(const args of [[null,true],['wrong',true],['TEST firma',false]]){
    const calls=await companyCase(...args);assert.equal(calls.some(c=>c[0]==='delete'),false);
  }
  const paidSuccess=await companyCase('TEST firma',true,[{application_id:'company-id'}]);assert.equal(paidSuccess.filter(c=>c[0]==='delete').length,1);
  const success=await companyCase('TEST firma',true);assert.equal(success.filter(c=>c[0]==='delete').length,1);assert.equal(success.filter(c=>c[0]==='refresh').length,1);
  const failure=await companyCase('TEST firma',true,[],new Error('Denied'));assert.equal(failure.some(c=>c[0]==='refresh'),false);assert.equal(failure.at(-1)[1],'Denied');
  const changeSource=source.slice(source.indexOf('    async function change(id, action, button) {'),source.indexOf('    function showTab(name) {'));
  async function adCase(name,confirm,authorized=true,rpcError=null){
    const calls=[];const button={disabled:false,isConnected:true};
    const context={adminActionError:e=>e?.message||"Please retry",adminText:x=>x,busy:false,authorized,editing:false,rows:[{id:'ad-id',title:'TEST reklam'}],window:{MarbleAdminUI:{async open(){return confirm?name:null}},MarbleDB:{async deleteAdvertisement(id,text){calls.push(['delete',id,text]);if(rpcError)throw rpcError}}},async load(){calls.push(['refresh'])},message:(text,error)=>calls.push(['message',text,error]),failure:error=>error.message};
    vm.createContext(context);vm.runInContext(changeSource,context);await context.change('ad-id','delete',button);assert.equal(button.disabled,false);return calls;
  }
  for(const args of [[null,true],['wrong',true],['TEST reklam',false],['TEST reklam',true,false]])assert.equal((await adCase(...args)).some(c=>c[0]==='delete'),false);
  assert.equal((await adCase('TEST reklam',true)).filter(c=>c[0]==='delete').length,1);
  const adFailure=await adCase('TEST reklam',true,true,new Error('Denied'));assert.equal(adFailure.some(c=>c[0]==='refresh'),false);assert.equal(adFailure.at(-1)[2],true);
  console.log('Admin deletion UI passed: typed confirmation, cancellation, paid-company deletion, authorization gate, single RPC, failure handling. Database deletion execution remains untested.');
})().catch(error=>{console.error(error);process.exitCode=1});

(async()=>{
  const source=fs.readFileSync(path.join(root,'public/market/admin.js'),'utf8');
  const dialogs=[],authHandlers=[];let restored=0;
  function node(tag){return {tag,children:[],handlers:{},isConnected:true,value:'',append(...children){this.children.push(...children)},setAttribute(){},classList:{add(){}},addEventListener(type,fn){this.handlers[type]=fn},focus(){},showModal(){this.open=true;dialogs.push(this)},close(){this.open=false},remove(){this.isConnected=false},getBoundingClientRect(){return{left:0,right:500,top:0,bottom:500}}}}
  const context={document:{activeElement:{isConnected:true,focus(){restored++}},createElement:node,body:node('body')},window:{addEventListener(type,fn){authHandlers.push(fn)}}};
  vm.createContext(context);vm.runInContext(source.slice(0,source.indexOf('\n})();\n')+7),context);
  const ui=context.window.MarbleAdminUI;
  let pending=ui.open({title:'Sil',expected:'TEST',confirmLabel:'Kalıcı sil'}),dialog=dialogs.at(-1);
  const input=dialog.children.find(n=>n.tag==='label').children[0],ok=dialog.children.at(-1).children[1];
  assert.equal(ok.disabled,true);input.value='wrong';input.handlers.input();assert.equal(ok.disabled,true);
  input.value='TEST';input.handlers.input();assert.equal(ok.disabled,false);ok.handlers.click();assert.equal(await pending,'TEST');assert.equal(dialog.isConnected,false);
  pending=ui.open({title:'Sil',expected:'TEST'});dialog=dialogs.at(-1);dialog.handlers.cancel({preventDefault(){}});assert.equal(await pending,null);
  pending=ui.open({title:'Firma belgesi',url:'https://example.com/test.pdf'});dialog=dialogs.at(-1);assert.equal(dialog.children.find(n=>n.tag==='iframe').src,'https://example.com/test.pdf');authHandlers[0]({detail:{user:null}});assert.equal(await pending,null);
  assert.equal(restored,3);
  console.log('In-page admin dialogs passed: exact-name gate, Escape cancellation, embedded document, logout closure and restored focus.');
})().catch(error=>{console.error(error);process.exitCode=1});

{
 const ts=require('typescript');
 const source=fs.readFileSync(path.join(root,'lib/legalDocuments.ts'),'utf8');
 const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const legalContext={exports:{},require:()=>({dataController:{unvan:'',adres:'',kvkkBasvuruEmail:'info@marbleborsa.com'}})};
 vm.createContext(legalContext);vm.runInContext(compiled,legalContext);
 const api=legalContext.exports;
 for(const lang of ['en','zh','ar']){
  const translated=api.getLegalDocuments(lang),original=api.getLegalDocuments('tr');
  for(const key of Object.keys(original)){
   assert.equal(translated[key].sections.length,original[key].sections.length);
   assert.notEqual(translated[key].title,original[key].title);
   translated[key].sections.forEach((section,index)=>{assert.ok(section.body.trim().length>0);assert.notEqual(section.body,original[key].sections[index].body)});
  }
  assert.ok(api.getLegalLinks(lang).every(link=>link.href.startsWith('/'+lang+'/yasal/')));
 }
 const app=fs.readFileSync(path.join(root,'public/market/app.js'),'utf8');
 assert.doesNotMatch(app,/href="\/tr\/profil"|assign\?\.\("\/tr\/profil"\)/);
 const profileCheck=app.slice(0,app.indexOf('\n'));
 for(const lang of ['tr','en','zh','ar']){const c={location:{pathname:`/${lang}/profil`}};vm.createContext(c);vm.runInContext(profileCheck,c);assert.equal(c.isProfilePage(),true)}
 console.log('Locale regression passed: all four legal documents and section parity in EN/ZH/AR, localized links and four profile routes.');
}

{
 const source=fs.readFileSync(path.join(root,'public/market/registration.js'),'utf8');
 const pickerSource=source.slice(source.indexOf('// Browser-native file button labels'));
 const observers=[];
 function node(){return {className:'',children:[],handlers:{},textContent:'',classList:{contains(name){return this.owner.className===name},owner:null},setAttribute(){},append(...nodes){for(const n of nodes){this.children.push(n);n.parentElement=this}},querySelector(selector){return this.children.find(n=>'.'+n.className===selector)},addEventListener(type,fn){this.handlers[type]=fn}}}
 const input=node(),parent=node();input.classList.owner=input;parent.classList.owner=parent;parent.insertBefore=()=>{};input.parentElement=parent;input.files=[];
 const document={documentElement:{lang:'en'},body:{},createElement(){const n=node();n.classList.owner=n;return n},querySelectorAll(){return[input]}};
 const context={document,MutationObserver:class{constructor(fn){observers.push(fn)}observe(){}}};vm.createContext(context);vm.runInContext(pickerSource,context);
 assert.equal(input.parentElement.querySelector('.mb-file-action').textContent,'Choose file');assert.equal(input.parentElement.querySelector('.mb-file-name').textContent,'No file selected');
 input.files=[{name:'<img onerror=bad>.pdf'}];input.handlers.change();assert.equal(input.parentElement.querySelector('.mb-file-name').textContent,'<img onerror=bad>.pdf');
 input.files=[{name:'1.png'},{name:'2.png'}];input.handlers.change();assert.equal(input.parentElement.querySelector('.mb-file-name').textContent,'2 files selected');
 document.documentElement.lang='ar';observers[0]([{type:'attributes'}]);assert.equal(input.parentElement.querySelector('.mb-file-action').textContent,'اختر ملفًا');
 console.log('Localized file picker passed: English labels, literal filename display, multiple files and language change.');
}

{
 const source=fs.readFileSync(path.join(root,'public/market/app.js'),'utf8');
 const loadSource=source.split('\n').find(line=>line.startsWith('function load(){'));
 const changeSource=source.split('\n').find(line=>line.startsWith('$("language").addEventListener("change"'));
 const ts=require('typescript'),routeContext={exports:{}};vm.createContext(routeContext);
 vm.runInContext(ts.transpileModule(fs.readFileSync(path.join(root,'lib/guideRoutes.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,routeContext);
 const routes=routeContext.exports.marketRouteSegments,langs=['tr','en','zh','ar'];let transitions=0;
 for(const from of langs)for(const to of langs)for(const tab of ['home','stones','companies','machines','services','requests','profile']){
  let handler,assigned,pref=from;
  const path=tab==='home'?`/${from}`:tab==='profile'?`/${from}/profil`:`/${from}/${routes[from][tab]}`;
  const c={URLSearchParams,location:{pathname:path,search:'',assign(url){assigned=url}},state:{lang:from,tab},copy:Object.fromEntries(langs.map(x=>[x,{}])),seoConfig:{routes},marketplacePaths:routes[from],localStorage:{setItem(key,value){pref=value},getItem(){return pref}},isProfilePage:()=>tab==='profile',$:()=>({addEventListener(type,fn){handler=fn}}),setLanguage(){throw new Error('Known locale must use canonical navigation')}};
  vm.createContext(c);vm.runInContext(changeSource,c);handler({target:{value:to}});
  const expected=tab==='home'?`/${to}`:tab==='profile'?`/${to}/profil`:`/${to}/${routes[to][tab]}`;
  assert.equal(assigned,expected);assert.equal(pref,to);
  c.location.pathname=assigned;c.state.lang=from;vm.runInContext(loadSource,c);c.load();assert.equal(c.state.lang,to);
  transitions++;
 }
 for(const [path,query,expected] of [['/','', 'tr'],['/tr','?lang=en','tr'],['/en','?lang=tr','en']]){
  const c={URLSearchParams,location:{pathname:path,search:query},state:{},copy:Object.fromEntries(langs.map(x=>[x,{}])),seoConfig:{routes},marketplacePaths:routes.tr,localStorage:{getItem(){return'en'}}};vm.createContext(c);vm.runInContext(loadSource,c);c.load();assert.equal(c.state.lang,expected);
 }
 console.log(`Language navigation passed: ${transitions} transitions across home, categories and profile; stale preference and conflicting query cannot override explicit route.`);
}

{
 const ts=require('typescript');const r={exports:{}};vm.createContext(r);
 vm.runInContext(ts.transpileModule(fs.readFileSync(path.join(root,'lib/guideRoutes.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,r);
 const sourcing={exports:{}};vm.createContext(sourcing);vm.runInContext(ts.transpileModule(fs.readFileSync(path.join(root,'lib/sourcingContent.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,sourcing);
 const code=ts.transpileModule(fs.readFileSync(path.join(root,'components/GuideLanguagePicker.tsx'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const jsx=(tag,props)=>({tag,props});let count=0;
 for(const from of ['tr','en','zh','ar'])for(const to of ['tr','en','zh','ar'])for(const page of ['yonetim','yasal/kvkk','yasal/gizlilik','yasal/cerez','yasal/kullanim-kosullari','firmalar-icin','hakkimizda','iletisim','profil','dogal-tas/afyon-white','firmalar/11111111-1111-4111-8111-111111111111','sifre-sifirla']){
  let target,pref;const c={exports:{},require:name=>name==='react'?{useEffect(){}}:name==='react/jsx-runtime'?{jsx,jsxs:jsx}:name.includes('sourcingContent')?sourcing.exports:r.exports,window:{location:{pathname:`/${from}/${page}`,assign(value){target=value}}},localStorage:{setItem(key,value){pref=value}}};vm.createContext(c);vm.runInContext(code,c);
  const tree=c.exports.default({locale:from});const select=tree.props.children.find(child=>child.tag==='select');select.props.onChange({target:{value:to}});
  assert.equal(target,`/${to}/${page}`);assert.equal(pref,to);count++;
 }
 for(const from of ['tr','en','zh','ar'])for(const to of ['tr','en','zh','ar'])for(const topic of sourcing.exports.sourcingTopics){
  let target;const c={exports:{},require:name=>name==='react'?{useEffect(){}}:name==='react/jsx-runtime'?{jsx,jsxs:jsx}:name.includes('sourcingContent')?sourcing.exports:r.exports,window:{location:{pathname:sourcing.exports.sourcingPath(topic,from),assign(value){target=value}}},localStorage:{setItem(){}}};vm.createContext(c);vm.runInContext(code,c);
  const tree=c.exports.default({locale:from});tree.props.children.find(child=>child.tag==='select').props.onChange({target:{value:to}});assert.equal(target,sourcing.exports.sourcingPath(topic,to));
 }
 console.log(`Page language picker passed: ${count} transitions across admin, legal and corporate pages using the actual component handler.`);
}

// Execute the actual admin renderer and preview code in every supported language.
{
 const ts=require('typescript'),source=fs.readFileSync(path.join(root,'public/market/admin.js'),'utf8');
 const parsed=ts.createSourceFile('admin.js',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS),functions={};
 function collect(node){if(ts.isFunctionDeclaration(node)&&node.name&&!functions[node.name.text])functions[node.name.text]=node.getText(parsed);ts.forEachChild(node,collect)}collect(parsed);
 const helpers=source.slice(0,source.indexOf('// In-page dialogs'));
 for(const lang of ['tr','en','zh','ar']){
  const elements={},input={focus(){}};
  for(const id of ['mb-admin-ad-root','mb-ad-editor','mb-ad-list','mb-ad-preview-card'])elements[id]={innerHTML:'',hidden:true,scrollIntoView(){},querySelector(){return input}};
  const form={elements:{image:{files:[]},placement:{value:'top'},company_name:{value:'Firmalar'},title:{value:'Reklam başlığı'},description:{value:'Müşterinin Türkçe açıklaması'},target_url:{value:'https://example.com'}}};elements['mb-ad-form']=form;
  let cardCall;
  const context={document:{documentElement:{lang},getElementById:id=>elements[id]},root:elements['mb-admin-ad-root'],sections:{home:'Home'},authorized:true,busy:false,rows:[],editId:null,editing:false,previewUrl:null,releasePreview(){},safe:x=>String(x??''),u:()=>({localDate:()=>'',url:x=>x,card:(values,image,locale)=>{cardCall={values,image,locale};return 'PREVIEW'}}),window:{MarbleDB:{adImageUrl:path=>path||''}},Date,URL};
  vm.createContext(context);vm.runInContext(helpers+'\n'+['status','shell','list','editor','updatePreview'].map(n=>functions[n]).join('\n'),context);
  context.shell();context.list();context.editor();
  if(lang!=='tr'){for(const id of ['mb-admin-ad-root','mb-ad-list','mb-ad-editor'])assert.ok(!/[ıİşŞğĞüÜöÖçÇ]/.test(elements[id].innerHTML.replaceAll("Türkiye","Turkey")),lang+' '+id)}
  assert.ok(elements['mb-ad-preview-card'].innerHTML.length>0,'Empty preview should show an image hint');
  context.rows=[{id:'test',image_path:'https://example.com/image.png'}];context.editId='test';context.updatePreview();
  assert.equal(cardCall.locale,lang);assert.equal(cardCall.values.placement,'top');assert.equal(cardCall.values.company_name,'Firmalar');assert.equal(cardCall.values.title,'Reklam başlığı');assert.equal(cardCall.values.description,'Müşterinin Türkçe açıklaması');
  const mixed=vm.runInContext('adminHtml`<h3>Reklam başlığı</h3><p>${"Reklam başlığı"}</p>`',context);assert.ok(mixed.endsWith('<p>Reklam başlığı</p>'),'Never translate user values');
 }
 for(const lang of ['tr','en','zh','ar'])for(const role of ['supplier','service']){
  const context={document:{documentElement:{lang}},root:{innerHTML:''},current:{apps:[{id:'test',owner_id:'owner',company_name:'Firmalar',account_role:role,company_details:{city:'Afyonkarahisar',authorized_name:'Çağrı'}}],profiles:[],verifications:[],payments:[],memberships:[],events:[]},plans:{supplier:{annualAmountTRY:100},service:{annualAmountTRY:100}},whatsappLink:()=>null,safe:x=>String(x??'—'),date:()=>'',money:()=>''};
  vm.createContext(context);vm.runInContext(helpers+'\n'+source.match(/const listState=.+;/)[0]+'\n'+source.match(/const openApplications=.+;/)[0]+'\n'+source.match(/const stageWords=.+;/)[0]+'\n'+source.match(/const editWords=.+;/)[0]+'\n'+functions.companyEditForm+'\n'+functions.applicationStage+'\n'+functions.render,context);context.render();
  assert.ok(context.root.innerHTML.includes('Çağrı'),'Preserve contact name');
  const labels=context.root.innerHTML.replaceAll('Firmalar','').replaceAll('Çağrı','');
  if(lang!=='tr')assert.ok(!/[ıİşŞğĞüÜöÖçÇ]/.test(labels),'Company admin card '+lang+' '+role);
  assert.match(context.root.innerHTML,/data-application-detail="test"/);assert.doesNotMatch(context.root.innerHTML,/data-application-detail="test" open/);
  context.current.apps=Array.from({length:21},(_,i)=>({id:'row-'+i,company_name:'Company '+i,owner_id:'owner',account_role:i===20?'service':'supplier',company_details:{city:i===20?'UniqueCity':'Afyon'},submitted_at:'2026-10-20',contacted_at:'2026-10-21'}));
  context.render();assert.equal((context.root.innerHTML.match(/class="admin-card admin-application-card"/g)||[]).length,15);
  vm.runInContext('listState.page=2',context);context.render();assert.equal((context.root.innerHTML.match(/class="admin-card admin-application-card"/g)||[]).length,6);
  vm.runInContext("listState.query='UniqueCity';listState.page=1",context);context.render();assert.equal((context.root.innerHTML.match(/class="admin-card admin-application-card"/g)||[]).length,1);assert.match(context.root.innerHTML,/data-application="row-20"/);
  vm.runInContext("listState.query='';listState.role='service'",context);context.render();assert.equal((context.root.innerHTML.match(/class="admin-card admin-application-card"/g)||[]).length,1);
  context.current.verifications=[{application_id:'row-20',verified:true}];context.current.payments=[{id:'unused-payment',application_id:'row-20'}];
  assert.equal(context.applicationStage(context.current.apps[20]),'activation');
  vm.runInContext("listState.stage='activation';openApplications.add('row-20')",context);context.render();assert.match(context.root.innerHTML,/data-application-detail="row-20" open/);
  context.current.memberships=[{application_id:'row-20',payment_id:'unused-payment',ends_at:'2099-01-01'}];assert.equal(context.applicationStage(context.current.apps[20]),'active');
  context.current.memberships[0].ends_at='2000-01-01';assert.equal(context.applicationStage(context.current.apps[20]),'expired');

 }
 console.log('Admin localization and preview passed: four languages, source-only translation, retained user content, placement and empty/image preview.');
}
{
 const source=fs.readFileSync(path.join(root,'public/market/password-reset.js'),'utf8');
 for(const lang of ['tr','en','zh','ar']){
  const status={textContent:''},context={document:{getElementById:()=>status},location:{pathname:`/${lang}/sifre-sifirla`,hash:'',search:''},window:{},URLSearchParams};
  vm.runInNewContext(source,context);assert.ok(status.textContent.length);if(lang!=='tr')assert.ok(!/[ıİşŞğĞüÜöÖçÇ]/.test(status.textContent));
 }
 console.log('Password reset localization passed: invalid-link flow in all four languages.');
}

// Render actual company and stone server components with an approved public fixture.
(async()=>{
 const ts=require('typescript'),routeContext={exports:{}},stoneContext={exports:{}};
 vm.createContext(routeContext);vm.runInContext(ts.transpileModule(fs.readFileSync(path.join(root,'lib/guideRoutes.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,routeContext);
 vm.createContext(stoneContext);vm.runInContext(ts.transpileModule(fs.readFileSync(path.join(root,'lib/stoneData.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,stoneContext);
 const id='11111111-1111-4111-8111-111111111111',company={company_id:id,name:'Çağrı Mermer',city:'Afyonkarahisar',section:'companies',activity_type:'quarry',logo_path:'logo.png'},item={id:'entry',company_id:id,title:'Afyon White',description:'Firmanın kendi Türkçe metni',category:'stone',image_paths:['image.png']};
 const jsx=(tag,props)=>({tag,props}),directory={uuidPattern:/^[0-9a-f-]{36}$/i,publicCompanies:async()=>[company],publicCatalog:async()=>[item],publicCompanyLogo:company=>company.logo_path?`https://example.com/mb-company-logos/${company.logo_path}`:'',publicAssetUrl:(bucket,path)=>path?`https://example.com/${bucket}/${path}`:''};
 for(const file of ['app/[locale]/firmalar/[slug]/page.tsx','app/[locale]/dogal-tas/[slug]/page.tsx']){
  const compiled=ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  const c={exports:{},require:name=>name==='react/jsx-runtime'?{jsx,jsxs:jsx,Fragment:'fragment'}:name==='next/link'?{default:'a'}:name==='next/navigation'?{notFound(){throw Error('Unexpected 404')},permanentRedirect(url){throw Object.assign(Error('PROFILE_REDIRECT'),{url})}}:name==='@/lib/publicDirectory'?directory:name==='@/lib/guideRoutes'?routeContext.exports:name==='@/lib/stoneData'?stoneContext.exports:name==='@/lib/seo'?{buildMetadata:x=>x,absoluteUrl:path=>'https://www.marbleborsa.com'+path,safeJsonLd:JSON.stringify,stoneDescription:()=>''}:{}};
  vm.createContext(c);vm.runInContext(compiled,c);
  for(const locale of ['tr','en','zh','ar']){
   const params=Promise.resolve({locale,slug:file.includes('firmalar')?'cagri-mermer':'afyon-white'}),tree=await c.exports.default({params}),links=[];
   function walk(n){if(!n||typeof n!=='object')return;if(n.props?.href)links.push(n.props.href);for(const child of [n.props?.children].flat(Infinity))walk(child)}walk(tree);
   assert.ok(links.length>3);assert.ok(links.every(link=>link.startsWith(`/${locale}`)),'Detail links preserve '+locale);
   if(file.includes('firmalar')){await assert.rejects(c.exports.default({params:Promise.resolve({locale,slug:id})}),error=>error.message==='PROFILE_REDIRECT'&&error.url===`/${locale}/firmalar/cagri-mermer`);}
   const metadata=await c.exports.generateMetadata({params});assert.ok(metadata.path.startsWith(`/${locale}/`));assert.equal(Object.keys(metadata.languages).length,4);
   if(file.includes('firmalar')){assert.ok(JSON.stringify(tree).includes('Firmanın kendi Türkçe metni'));assert.ok(JSON.stringify(tree).includes('Çağrı Mermer'));assert.ok(metadata.description.includes(company.name));assert.ok(metadata.description.includes(company.city));const schemas=[];function schemasWalk(n){if(!n||typeof n!=='object')return;if(n.tag==='script'&&n.props?.type==='application/ld+json')schemas.push(JSON.parse(n.props.dangerouslySetInnerHTML.__html));for(const child of [n.props?.children].flat(Infinity))schemasWalk(child)}schemasWalk(tree);assert.equal(schemas[0]['@type'],'ProfilePage');assert.equal(schemas[0].mainEntity.name,company.name);}
  }
 }
 console.log('Company and stone server pages passed: four locale routes, metadata alternates, translated labels, retained company content and locale-safe links.');
})().catch(error=>{console.error(error);process.exitCode=1});

(async function adminDirectorySecurityChecks(){
 const source='/* Admin-only directory:'+fs.readFileSync(path.join(root,'public/market/admin.js'),'utf8').split('/* Admin-only directory:')[1];
 const tick=()=>new Promise(r=>setImmediate(r));
 for(const lang of ['tr','en','zh','ar']){
  const nodes={},get=id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',handlers:{},addEventListener(k,f){this.handlers[k]=f;}});let resolveRpc;
  const c={adminLocale:()=>lang,document:{getElementById:get},Date,window:{MarbleAuth:{client:{rpc:async()=>({data:{total:1,rows:[{full_name:'<img src=x>',email:'a<&@b',account_role:'buyer'}]}})}},MarbleAdminUI:{open:async()=>true}}};
  vm.createContext(c);vm.runInContext(source,c);c.window.MarbleAdminDirectory.show('users');await tick();assert(get('mb-admin-users-root').innerHTML.includes('&lt;img'));assert(!get('mb-admin-users-root').innerHTML.includes('<img src=x>'));
  c.window.MarbleAuth.client.rpc=()=>new Promise(r=>resolveRpc=r);c.window.MarbleAdminDirectory.stop();c.window.MarbleAdminDirectory.show('users');c.window.MarbleAdminDirectory.stop();resolveRpc({data:{total:1,rows:[{full_name:'Private'}]}});await tick();assert(!get('mb-admin-users-root').innerHTML.includes('Private'));
 }
 const nodes={},get=id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',handlers:{},addEventListener(k,f){this.handlers[k]=f;}});let resolveConfirm,count=0;
 const c={adminLocale:()=> 'tr',document:{getElementById:get},Date,window:{MarbleAuth:{client:{rpc:async(n,a)=>{if(n==='mb_admin_close_requests'){count++;assert.equal(a.p_expected_count,3);assert.equal(a.p_snapshot_at,'2026-10-12T10:00:00Z');return {data:3};}return {data:{total:0,rows:[],open_count:3,snapshot_at:'2026-10-12T10:00:00Z'}};}}},MarbleAdminUI:{open:()=>new Promise(r=>resolveConfirm=r)}}};
 vm.createContext(c);vm.runInContext(source,c);c.window.MarbleAdminDirectory.show('requests');await tick();const b={disabled:false,isConnected:true,hasAttribute:k=>k==='data-close-all',dataset:{}};const e={target:{closest:()=>b}};
 const pending=get('mb-admin-requests-root').handlers.click(e);c.window.MarbleAdminDirectory.stop();resolveConfirm(true);await pending;assert.equal(count,0);
 c.window.MarbleAdminDirectory.show('requests');await tick();b.disabled=false;const done=get('mb-admin-requests-root').handlers.click(e);resolveConfirm(true);await done;assert.equal(count,1);assert(get('mb-admin-requests-root').innerHTML.includes('İptal edilen talep sayısı: 3'));
 console.log('Admin directory: four languages, HTML escaping, stale response isolation, logout cancellation and confirmed snapshot RPC passed. SQL execution remains untested.');
})().catch(e=>{console.error(e);process.exitCode=1;});

(async function adminRowActionChecks(){
 const source='/* Admin-only directory:'+fs.readFileSync(path.join(root,'public/market/admin.js'),'utf8').split('/* Admin-only directory:')[1];const tick=()=>new Promise(r=>setImmediate(r));
 const nodes={},get=id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',handlers:{},addEventListener(k,f){this.handlers[k]=f;}});
 const calls=[];let confirmed=false,lastDialog;const c={adminLocale:()=> 'en',document:{getElementById:get},Date,window:{MarbleAuth:{client:{rpc:async(n,args)=>{calls.push({n,args});return n==='mb_admin_list_users'?{data:{total:2,viewer_id:'self',rows:[{user_id:'self',email:'admin@example.com',is_admin:true,email_confirmed_at:'2026-01-01'},{user_id:'member',email:'member@example.com',email_confirmed_at:'2026-01-01'}]}}:n==='mb_admin_list_requests'?{data:{total:1,open_count:1,rows:[{id:'req',status:'open'}]}}:{data:null};}}},MarbleAdminUI:{open:async args=>{lastDialog=args;return confirmed;}}}};
 c.window.MarbleAuth.client.auth={getSession:async()=>({data:{session:{access_token:'test-token'}}})};c.fetch=async(url,options)=>{calls.push({n:'delete-api',url,args:JSON.parse(options.body)});return {ok:true,status:200,json:async()=>({done:true})}};
 vm.createContext(c);vm.runInContext(source,c);c.window.MarbleAdminDirectory.show('users');await tick();
 const html=get('mb-admin-users-root').innerHTML;assert(html.includes('data-user-admin="self" disabled'));assert(html.includes('data-user-delete="self" disabled'));
 const b={disabled:false,isConnected:true,hasAttribute:()=>false,dataset:{userAdmin:'member'}};const e={target:{closest:()=>b}};
 await get('mb-admin-users-root').handlers.click(e);assert.equal(calls.filter(x=>x.n==='mb_admin_set_user_admin').length,0);assert.equal(lastDialog.expected,'member@example.com');
 confirmed=true;await get('mb-admin-users-root').handlers.click(e);const grant=calls.find(x=>x.n==='mb_admin_set_user_admin');assert.equal(grant.args.p_user_id,'member');assert.equal(grant.args.p_enabled,true);assert.equal(grant.args.p_confirmation,'member@example.com');
 b.dataset={userDelete:'member'};await get('mb-admin-users-root').handlers.click(e);const del=calls.find(x=>x.n==='delete-api');assert.equal(del.url,'/api/admin/members');assert.equal(del.args.confirmation,'member@example.com');
 c.window.MarbleAdminDirectory.show('requests');await tick();b.dataset={requestClose:'req'};await get('mb-admin-requests-root').handlers.click(e);assert.equal(calls.find(x=>x.n==='mb_admin_close_request').args.p_request_id,'req');
 console.log('Admin row actions passed: own-account controls disabled, exact-email confirmation, cancelled grant, successful grant/delete RPC and single request closure.');
})().catch(e=>{console.error(e);process.exitCode=1;});

(async function profilePasswordChecks(){
 const reg=fs.readFileSync(path.join(root,'public/market/registration.js'),'utf8');const source=reg.slice(reg.indexOf('/* Signed-in account password settings.'),reg.indexOf('// Browser-native file button labels'));
 function setup(lang='tr'){
  const handlers={},calls=[],msg={textContent:'',setAttribute(){}},fieldset={},submitButton={};
  const form={elements:{current:{value:'old-password'},next:{value:'new-password-123'},confirm:{value:'new-password-123'}},reset(){Object.values(this.elements).forEach(e=>e.value='');},querySelector(q){return q==='fieldset'?fieldset:q==='button[type="submit"]'?submitButton:msg;},querySelectorAll(){return [];}};
  const user={id:'u',email:'member@example.com'};let response={data:{user}};
  const c={state:{lang},safe:x=>String(x||'').replaceAll('<','&lt;'),document:{getElementById:()=>form,addEventListener(){}},window:{addEventListener(k,f){handlers[k]=f;},MarbleAuth:{client:{auth:{getUser:async()=>response,signInWithPassword:async args=>{calls.push(['signin',args]);return {data:{user}};},updateUser:async args=>{calls.push(['update',args]);return {data:{user}};}}}}}};
  vm.createContext(c);vm.runInContext(source,c);c.window.MarblePasswordSettings.card(user);return {c,form,msg,handlers,calls,user,auth:c.window.MarbleAuth.client.auth};
 }
 for(const lang of ['tr','en','zh','ar']){
  const t=setup(lang);const html=t.c.window.MarblePasswordSettings.card(t.user);assert(html.includes('autocomplete="current-password"'));assert(html.includes('autocomplete="new-password"'));assert(html.includes('data-forgot-password'));
  t.form.elements.confirm.value='different';await t.c.window.MarblePasswordSettings.submit(t.form);assert.equal(t.calls.length,0);assert(t.msg.textContent);
  t.form.elements.confirm.value=t.form.elements.next.value='short';await t.c.window.MarblePasswordSettings.submit(t.form);assert.equal(t.calls.length,0);
 }
 const bad=setup();bad.auth.signInWithPassword=async()=>({error:{code:'invalid_credentials',status:400}});await bad.c.window.MarblePasswordSettings.submit(bad.form);assert(!bad.calls.some(x=>x[0]==='update'));assert(bad.msg.textContent.includes('Mevcut şifre hatalı'));
 const ok=setup();await ok.c.window.MarblePasswordSettings.submit(ok.form);const update=ok.calls.find(x=>x[0]==='update');assert.equal(update[1].password,'new-password-123');assert.equal(update[1].current_password,'old-password');assert.equal(ok.form.elements.next.value,'');assert(ok.msg.textContent.includes('Şifreniz güncellendi'));
 const stale=setup();let release;stale.auth.signInWithPassword=()=>new Promise(r=>release=r);const pending=stale.c.window.MarblePasswordSettings.submit(stale.form);await new Promise(r=>setImmediate(r));stale.handlers['marble-auth']({detail:{user:null}});release({data:{user:stale.user}});await pending;assert(!stale.calls.some(x=>x[0]==='update'));
 const changed=setup();let reads=0;changed.auth.getUser=async()=>({data:{user:++reads===1?changed.user:{id:'other',email:'other@example.com'}}});await changed.c.window.MarblePasswordSettings.submit(changed.form);assert(!changed.calls.some(x=>x[0]==='update'));
 console.log('Profile password checks passed: four locales, mismatch/length guard, wrong current password, same-user verification, successful Auth update, cleared fields and logout cancellation. No live password was changed.');
})().catch(e=>{console.error(e);process.exitCode=1;});

{
 const ts=require('typescript');let state=[],refs=[],cursor=0,effects=[],listener,focused=false;
 class FakeElement {closest(){return link}}
 const link={dataset:{legal:'kvkk'},getAttribute(){return '/ar/yasal/kvkk'},focus(){focused=true}};
 const jsx=(tag,props)=>({tag,props});
 const legalContext={exports:{},require:()=>({dataController:{}})};vm.createContext(legalContext);
 vm.runInContext(ts.transpileModule(fs.readFileSync(path.join(root,'lib/legalDocuments.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,legalContext);
 const c={exports:{},Element:FakeElement,MutationObserver:class{observe(){}disconnect(){}},document:{documentElement:{lang:'en'},addEventListener(type,fn){listener=fn},removeEventListener(){},getElementById(){return{focus(){}}}},require:name=>name==='react'?{useState(initial){const i=cursor++;if(!(i in state))state[i]=initial;return[state[i],value=>{state[i]=value}]},useRef(initial){const i=cursor++;if(!(i in refs))refs[i]={current:initial};return refs[i]},useEffect(fn){effects.push(fn)}}:name==='react/jsx-runtime'?{jsx,jsxs:jsx}:legalContext.exports};vm.createContext(c);
 vm.runInContext(ts.transpileModule(fs.readFileSync(path.join(root,'components/LegalDialog.tsx'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,c);
 const render=()=>{cursor=0;effects=[];return c.exports.default()};
 let tree=render();assert.equal(tree.props.children,false,'Closed dialog must contain no document text');
 effects.forEach(fn=>fn());
 const dialog={open:false,showModal(){this.open=true},close(){this.open=false},querySelector(){return{scrollTo(){}}}};refs[1].current=dialog;
 listener({button:0,target:new FakeElement(),preventDefault(){}});
 tree=render();assert.equal(tree.props.lang,'ar','Clicked route must determine language even before html lang updates');assert.notEqual(tree.props.children,false);effects.forEach(fn=>fn());assert.equal(dialog.open,true);
 tree.props.onClose();tree=render();assert.equal(tree.props.children,false);assert.equal(focused,true);
 console.log('Legal dialog passed: no closed-document HTML, link-derived locale, translated content mounted before showModal, and close/focus restoration.');
}

// Missing RPCs and forbidden documents must be actionable in every admin language.
{
 const source=fs.readFileSync(path.join(root,'public/market/admin.js'),'utf8');
 const prefix=source.slice(0,source.indexOf('function adminCopy'));
 for(const locale of ['tr','en','zh','ar']){
  const ctx={document:{documentElement:{lang:locale}},window:{},console};
  vm.createContext(ctx);vm.runInContext(prefix,ctx);
  const missing=vm.runInContext("adminActionError({code:'PGRST202'})",ctx);
  const forbidden=vm.runInContext("adminActionError({code:'42501'})",ctx);
  assert.ok(missing.length>20&&forbidden.length>20);
  assert.doesNotMatch(missing,/schema cache/);
  if(locale!=='tr'){assert.doesNotMatch(missing,/güncellemesi eksik/);assert.doesNotMatch(forbidden,/erişim izni/);}
 }
 console.log('Admin document/contact errors localized in all four languages.');
}

// Exercise contact tracking through the real admin button handler.
(async()=>{
 const source=fs.readFileSync(path.join(root,'public/market/admin.js'),'utf8');
 const start=source.indexOf('    document.addEventListener("click", async (event) => {');
 const end=source.indexOf('\n    document.addEventListener("submit"',start);
 for(const value of ['true','false']){
  const calls=[];let handler;
  const button={dataset:{contact:'application-id',value},disabled:false,isConnected:true};
  const ctx={adminText:x=>x,adminActionError:e=>e.message,document:{addEventListener(_,fn){handler=fn}},load:async()=>calls.push(['refresh']),window:{MarbleDB:{async setApplicationContacted(id,contacted){calls.push([id,contacted])}},MarbleAdminUI:{async open(options){calls.push(['dialog',options.text])}}}};
  vm.createContext(ctx);vm.runInContext(source.slice(start,end),ctx);
  await handler({target:{closest:s=>s==='[data-contact]'?button:null}});
  assert.equal(calls[0][0],'application-id');assert.equal(calls[0][1],value==='true');assert.equal(calls[1][0],'refresh');assert.equal(button.disabled,false);
 }
 console.log('Admin contact buttons passed: mark contacted, reset, single RPC, refresh and restored button.');
})().catch(error=>{console.error(error);process.exitCode=1});

// Run the actual server endpoint with mocked Auth, RPC and Storage transports.
(async function memberRemovalApiChecks(){
 const ts=require('typescript');
 const compiled=ts.transpileModule(fs.readFileSync(path.join(root,'app/api/admin/members/route.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const actor='11111111-1111-4111-8111-111111111111',target='22222222-2222-4222-8222-222222222222';
 async function run(mode='success',options={}){
  const calls=[];let listed=0;
  const c={exports:{},URL,Response,AbortSignal,Date,process:{env:mode==='setup'?{}:{SUPABASE_URL:'https://exampleproject.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'sb_secret_server_only',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test'}},fetch:async(url,init)=>{
   const path=new URL(url).pathname;calls.push({path,...init});
   const json=(body,status=200)=>Response.json(body,{status});
   if(path==='/auth/v1/user')return json({id:actor,email_confirmed_at:mode==='unverified'?null:'2026-10-15'});
   if(path.endsWith('/mb_is_admin'))return json(mode!=='ordinary');
   if(path.endsWith('/mb_admin_prepare_user_deletion')){
    if(mode==='missing')return json({code:'PGRST202'},404);
    if(mode==='confirmation')return json({code:'22023'},400);
    if(mode==='audit')return json({code:'23503',message:'This account has administration audit records'},409);
    return json({done:mode==='already'});
   }
   if(path.endsWith('/mb_admin_user_deletion_files'))return json(++listed===1||mode==='many'?[{bucket_id:'mb-company-documents-private',name:target+'/company-document/doc.pdf'},{bucket_id:'mb-company-logos',name:target+'/logo.png'}]:[]);
   if(path.startsWith('/storage/v1/object/')){
    assert.equal(init.method,'DELETE');assert.equal(init.headers.apikey,'sb_secret_server_only');
    assert.ok(JSON.parse(init.body).prefixes.every(p=>p.startsWith(target+'/')));
    return mode==='storage-failure'?json({code:'FAILED'},500):json([]);
   }
   if(path.endsWith('/mb_admin_finish_user_deletion')){if(mode==='linked-record')return json({code:'23503',message:'related record blocks deletion'},409);if(mode==='db-failure')return json({code:'P0001',message:'private detail must not leak'},400);if(mode==='db-timeout')return json({code:'57014'},500);return json(null);}
   throw Error('Unexpected transport: '+path);
  }};
  vm.createContext(c);vm.runInContext(compiled,c);
  const headers={'content-type':'application/json',origin:options.origin||'https://www.marbleborsa.com',...(options.anonymous?{}:{authorization:'Bearer user-access-token'})};
  const req=new Request('https://www.marbleborsa.com/api/admin/members',{method:'POST',headers,body:JSON.stringify({user_id:options.self?actor:target,confirmation:'member@example.com'})});
  const response=await c.exports.POST(req);return{response,result:await response.json(),calls};
 }
 const ok=await run();assert.equal(ok.response.status,200);assert.equal(ok.result.done,true);assert.equal(ok.calls.filter(x=>x.path.startsWith('/storage/')).length,2);assert(ok.calls.at(-1).path.endsWith('/mb_admin_finish_user_deletion'));
 for(const [mode,status,code] of [['setup',503,'SERVER_SETUP_REQUIRED'],['ordinary',403,'FORBIDDEN'],['unverified',401,'SIGN_IN_REQUIRED'],['confirmation',409,'CONFIRMATION_MISMATCH'],['audit',409,'AUDIT_ACCOUNT'],['missing',503,'SQL_SETUP_REQUIRED'],['storage-failure',503,'STORAGE_DELETE_FAILED']]){
  const t=await run(mode);assert.equal(t.response.status,status,mode);assert.equal(t.result.code,code,mode);assert(!t.calls.some(x=>x.path.endsWith('/mb_admin_finish_user_deletion')),mode);
  if(mode!=='storage-failure')assert(!t.calls.some(x=>x.path.startsWith('/storage/')),mode);
 }
 for(const options of [{anonymous:true},{origin:'https://attacker.example'},{self:true}]){const t=await run('success',options);assert.equal(t.response.status,options.anonymous?401:403);assert(!t.calls.some(x=>x.path.startsWith('/storage/')));}
 for(const [mode,expected] of [['linked-record','RELATED_RECORDS_BLOCKED'],['db-failure','DATABASE_DELETE_FAILED'],['db-timeout','DELETION_RETRY']]){const t=await run(mode);assert.equal(t.result.code,expected);assert.equal(t.result.stage,'finish');assert.ok(t.result.upstreamCode);assert.ok(!JSON.stringify(t.result).includes('private detail'));}
 const resumed=await run('already');assert.equal(resumed.result.done,true);assert(!resumed.calls.some(x=>x.path.startsWith('/storage/')));
 const many=await run('many');assert.equal(many.response.status,202);assert.equal(many.result.done,false);assert(!many.calls.some(x=>x.path.endsWith('/mb_admin_finish_user_deletion')));
 const sql=fs.readFileSync(path.join(root,'supabase/migrations/20261006_request_lifecycle.sql'),'utf8').split('-- RESUMABLE USER AND STORAGE REMOVAL')[1];
 assert.ok(sql.includes('as restrictive for insert'));assert.ok(sql.includes('as restrictive for update'));assert.ok(sql.includes('mb_validate_user_deletion'));assert.doesNotMatch(sql,/delete\s+from\s+storage\.objects/i);
 console.log('Member removal API passed: admin/email confirmation, CSRF, self/ordinary/anonymous denial, server-only Storage API cleanup, continuation, retry, audit protection and missing setup. No live user was deleted.');
})().catch(e=>{console.error(e);process.exitCode=1;});

// A missing optional document must not block signup or company publishing progress.
{
 const source=fs.readFileSync(path.join(root,'public/market/registration.js'),'utf8');
 const validation={ct:k=>k};vm.createContext(validation);
 vm.runInContext(source.slice(source.indexOf('function validDocument('),source.indexOf('async function uploadCompanyDocuments(')),validation);
 const empty={get:()=>null};assert.equal(validation.validateDocuments(empty,false),'');assert.equal(validation.validateDocuments(empty),'fileRequired');
 const file={name:'document.pdf',type:'application/pdf',size:100};
 assert.equal(validation.validateDocuments({get:k=>k==='companyDocument'?file:null},false),'');
 assert.equal(validation.validateDocuments({get:k=>k==='companyDocument'?{...file,size:10485761}:null},false),'fileInvalid');
 for(const lang of ['tr','en','zh','ar']){
  const user={id:'optional-document-user',email:'user@example.com',email_confirmed_at:'2026-10-17',user_metadata:{}};
  const c={document,state:{lang},window:{MarbleDBState:{userId:user.id,status:'ready',requests:[],account:{profile:{account_role:'supplier',full_name:'Example'},application:{company_name:'Example'},verification:{verified:false}}}},safe:String,tr:k=>k==='nav'?['Stone','Companies','Machines']:k,marketplacePaths:{stones:'dogal-tas',machines:'makine-sarf'},categoryDirectoryCopy:{[lang]:{}},Date};
  vm.createContext(c);vm.runInContext(source.slice(0,source.indexOf('function roleCards(')),c);
  vm.runInContext("verificationState={userId:'optional-document-user',status:'ready',main:false}",c);
  const html=c.window.MarbleRegistration.accountCard(user);
  assert(html.includes('name="companyDocument"'),'Document upload stays available');
  const progress=html.match(/<section class="workspace-card profile-progress"[\s\S]*?<\/section>/)[0];
  assert.equal((progress.match(/<li /g)||[]).length,4);assert(progress.includes('✓'));
  assert.doesNotMatch(progress,/Doğrulama belgesi|Verification document|认证材料|مستند التحقق/);
  assert(progress.includes(vm.runInContext('progressCopy[state.lang].review',c)));
 }
 const signup=source.slice(source.indexOf('function signupFields('),source.indexOf('function renderSignupContent('));
 assert(!signup.match(/<input name="companyDocument"[^>]*\brequired\b/));
 assert(signup.includes('name="companyDocument"'));assert(signup.includes('name="companyLogo"'));
 console.log('Optional company documents passed: retained upload fields, no signup file requirement, invalid-file validation and four-language admin-review progress without a document.');
}

(async()=>{
 const ts=require('typescript');const compiled=ts.transpileModule(fs.readFileSync(path.join(root,'app/api/admin/members/route.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const id='22222222-2222-4222-8222-222222222222',owner='33333333-3333-4333-8333-333333333333';
 async function run(mode='success',fields={company_name:'New Company',city:'Afyon',authorized_name:'New Person'},options={}){
  const calls=[],c={exports:{},URL,Response,Blob,Uint8Array,DataView,crypto:require('node:crypto').webcrypto,AbortSignal,Date,process:{env:mode==='setup'?{}:{SUPABASE_URL:'https://exampleproject.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'sb_secret_private',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test'}},fetch:async(url,init)=>{
   const path=new URL(url).pathname;calls.push({path,...init});const json=(value,status=200)=>Response.json(value,{status});
   if(path==='/auth/v1/user')return json({id:'11111111-1111-4111-8111-111111111111',email_confirmed_at:mode==='unverified'?null:'2026-01-01'});
   if(path.endsWith('/mb_is_admin'))return json(mode!=='ordinary');
   if(path==='/rest/v1/mb_company_applications'&&init.method==='GET')return json(mode==='missing'?[]:[{id,owner_id:owner,company_name:'Old Company',account_role:'service',company_details:{activity_type:'logistics',untouched:'keep'}}]);
   if(path==='/rest/v1/mb_company_applications'&&init.method==='PATCH')return json(null);
   if(path.startsWith('/storage/v1/object/')){assert.equal(init.headers.apikey,'sb_secret_private');assert.ok(path.includes(owner+'/logo-'));return json({Key:'saved'});}
   throw Error(path);
  }};vm.createContext(c);vm.runInContext(compiled,c);
  const body=new FormData();body.set('application_id',id);for(const [key,value] of Object.entries(fields))body.set(key,value);
  const request=new Request('https://www.marbleborsa.com/api/admin/members',{method:'PATCH',headers:{origin:options.origin||'https://www.marbleborsa.com',...(options.anonymous?{}:{authorization:'Bearer user-token'})},body});
  const response=await c.exports.PATCH(request);return {status:response.status,result:await response.json(),calls};
 }
 const ok=await run();assert.equal(ok.status,200);const patch=JSON.parse(ok.calls.find(call=>call.method==='PATCH').body);assert.equal(patch.company_name,'New Company');assert.equal(patch.company_details.untouched,'keep');assert.equal(patch.company_details.city,'Afyon');
 for(const [mode,status] of [['ordinary',403],['unverified',401],['setup',503],['missing',404]]){const r=await run(mode);assert.equal(r.status,status,mode);assert.ok(!r.calls.some(call=>call.method==='PATCH'||call.path.startsWith('/storage/')));}
 for(const options of [{anonymous:true},{origin:'https://attacker.example'}]){const r=await run('success',{},options);assert.ok([401,403].includes(r.status));assert.equal(r.calls.length,0);}
 for(const fields of [{company_name:'x'},{corporate_email:'bad email'},{website:'javascript:alert(1)'},{activity_type:'quarry'}]){const r=await run('success',fields);assert.equal(r.status,400);assert.ok(!r.calls.some(call=>call.method==='PATCH'));}
 const noPrivilege=await run('success',{company_name:'Safe',account_role:'admin',verified:'true'});const allowed=JSON.parse(noPrivilege.calls.find(call=>call.method==='PATCH').body);assert.equal(allowed.account_role,undefined);assert.equal(allowed.verified,undefined);assert.deepEqual(Object.keys(allowed).sort(),['company_details','company_name']);
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAA6ElEQVR4nO3QwQ3AIBDAsNL9dz5WIC+EZE8QZc3Mx5n/dsBLzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCjbP8QPFyqa8aAAAAABJRU5ErkJggg==','base64');
 const imageSaved=await run('success',{logo:new Blob([png],{type:'image/png'})});assert.equal(imageSaved.status,200);assert.equal(imageSaved.calls.filter(call=>call.path.startsWith('/storage/')).length,1);
 const invalidFile=await run('success',{logo:new Blob(['<svg/>'],{type:'image/png'})});assert.equal(invalidFile.result.code,'INVALID_LOGO');assert.ok(!invalidFile.calls.some(call=>call.method==='PATCH'||call.path.startsWith('/storage/')));
 console.log('Company editor API passed: admin/email/CSRF checks, field allowlist, validation, metadata preservation and invalid logo rejection. No live company was edited.');
})().catch(error=>{console.error(error);process.exitCode=1;});


// Profile analytics: public totals, protected owner summaries and server-only writes.
(async function companyVisitApiTests(){
 const ts=require('typescript');
 const source=fs.readFileSync(path.join(root,'app/api/admin/members/route.ts'),'utf8');
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const id='d26420b0-025d-4d92-8e58-7093895f925b';
 const visitor='11111111-2222-4333-8444-555555555555';
 const calls=[];let authOK=true;let editAllowed=false;
 const env={SUPABASE_URL:'https://test.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'sb_secret_unit_test_only',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test'};
 const sandbox={exports:{},require,Request,Response,Blob,FormData,URL,AbortSignal,crypto:require('node:crypto').webcrypto,process:{env},fetch:async(url,init)=>{
  calls.push({url,init});
  if(url.endsWith('/auth/v1/user'))return Response.json(authOK?{id:visitor}:{},{status:authOK?200:401});
  if(url.endsWith('mb_company_visit_total'))return Response.json({total:9});
  if(url.endsWith('mb_my_company_visits'))return Response.json([{id,company_name:'Mersan',total:9}]);
  if(url.endsWith('mb_record_company_visit'))return Response.json({counted:true});
  if(url.endsWith('mb_admin_set_visit_total'))return editAllowed?Response.json({saved:true}):Response.json({code:'42501'},{status:403});
  throw new Error('Unexpected request');
 }};vm.createContext(sandbox);vm.runInContext(js,sandbox);const api=sandbox.exports;
 const req=(body,headers={})=>new Request('https://www.marbleborsa.com/api/admin/members',{method:'PUT',headers:{origin:'https://www.marbleborsa.com','Content-Type':'application/json',...headers},body:JSON.stringify(body)});
 assert.equal((await api.GET(new Request('https://www.marbleborsa.com/api/admin/members'))).status,401);
 assert.equal((await api.GET(new Request('https://www.marbleborsa.com/api/admin/members?company=bad',{headers:{authorization:'Bearer owner-token'}}))).status,400);
 assert.equal((await api.GET(new Request('https://www.marbleborsa.com/api/admin/members?company='+id))).status,401);
 assert.equal((await (await api.GET(new Request('https://www.marbleborsa.com/api/admin/members?company='+id,{headers:{authorization:'Bearer owner-token'}}))).json()).total,9);
 assert.equal((await api.GET(new Request('https://www.marbleborsa.com/api/admin/members?company='+visitor,{headers:{authorization:'Bearer outsider-token'}}))).status,403);
 assert.equal((await api.PUT(req({company:id,visitor,consent:false}))).status,400);
 assert.equal((await api.PUT(req({company:id,visitor,consent:true},{origin:'https://other.example'}))).status,403);
 const before=calls.length;
 assert.equal((await (await api.PUT(req({company:id,visitor,consent:true},{'user-agent':'Googlebot'}))).json()).counted,false);
 assert.equal(calls.length,before);
 assert.equal((await api.PUT(req({company:id,visitor,consent:true}))).status,200);
 const write=calls.at(-1);const body=JSON.parse(write.init.body);
 assert.match(body.p_visitor,/^[a-f0-9]{64}$/);assert.notEqual(body.p_visitor,visitor);assert.equal(body.p_actor,null);
 assert.equal(write.init.headers.apikey,env.SUPABASE_SERVICE_ROLE_KEY);assert.equal(write.init.headers.Authorization,undefined);
 await api.PUT(req({company:id,visitor,consent:true},{authorization:'Bearer user-token'}));
 assert.equal(JSON.parse(calls.at(-1).init.body).p_actor,visitor);
 authOK=false;const count=calls.filter(c=>c.url.endsWith('mb_record_company_visit')).length;
 assert.equal((await api.PUT(req({company:id,visitor,consent:true},{authorization:'Bearer bad-token'}))).status,401);
 assert.equal(calls.filter(c=>c.url.endsWith('mb_record_company_visit')).length,count);
 const owner=await api.GET(new Request('https://www.marbleborsa.com/api/admin/members',{headers:{authorization:'Bearer owner-token'}}));
 assert.equal(owner.status,200);assert.equal(calls.at(-1).init.headers.Authorization,'Bearer owner-token');
 const editBody={action:'set_visit_total',company:id,total:250};
 assert.equal((await api.PUT(req(editBody))).status,401);
 assert.equal((await api.PUT(req(editBody,{authorization:'Bearer ordinary-token'}))).status,403);
 for(const total of [-1,1.5,1000000001,'250'])assert.equal((await api.PUT(req({...editBody,total},{authorization:'Bearer admin-token'}))).status,400);
 editAllowed=true;assert.equal((await api.PUT(req(editBody,{authorization:'Bearer admin-token'}))).status,200);
 assert.equal(calls.at(-1).init.headers.Authorization,'Bearer admin-token');assert.equal(JSON.parse(calls.at(-1).init.body).p_total,250);
 assert.equal((await api.PUT(req({...editBody,total:null},{authorization:'Bearer admin-token'}))).status,200);
 assert.equal(JSON.parse(calls.at(-1).init.body).p_total,null);
 assert.equal((await api.PUT(req(editBody,{authorization:'Bearer admin-token',origin:'https://attacker.example'}))).status,403);
 env.VERCEL_ENV='preview';assert.equal((await api.PUT(req({company:id,visitor,consent:true}))).status,503);
 console.log('Company analytics API guards passed');
})().catch(error=>{console.error(error);process.exitCode=1;});

(async function sharedConfigurationChecks(){
 const ts=require('typescript');
 const js=ts.transpileModule(fs.readFileSync(path.join(root,'app/api/admin/members/route.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const base={SUPABASE_URL:'https://exampleproject.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'sb_secret_server_only'};
 const cases=[
  [{...base,SUPABASE_URL:''},'URL_MISSING'],
  [{...base,SUPABASE_URL:'https://attacker.example'},'URL_INVALID'],
  [{...base,SUPABASE_URL:'https://exampleproject.supabase.co/path'},'URL_INVALID'],
  [{...base,SUPABASE_SERVICE_ROLE_KEY:''},'SERVICE_KEY_MISSING'],
  [{...base,SUPABASE_SERVICE_ROLE_KEY:'sb_publishable_wrong'},'PUBLISHABLE_KEY_USED'],
  [{...base,SUPABASE_SERVICE_ROLE_KEY:'sb_secret_two\nlines'},'SERVICE_KEY_WHITESPACE']
 ];
 for(const [env,reason] of cases){
  const c={exports:{},URL,Response,AbortSignal,Date,process:{env},fetch:()=>{throw new Error('Setup failure must not reach database')}};vm.createContext(c);vm.runInContext(js,c);
  for(const method of ['POST','PATCH']){
   const req=new Request('https://www.marbleborsa.com/api/admin/members',{method,headers:{origin:'https://www.marbleborsa.com',authorization:'Bearer test-user','Content-Type':'application/json'},body:'{}'});
   const res=await c.exports[method](req),body=await res.json();assert.equal(res.status,503);assert.equal(body.upstreamCode,reason,method);assert.equal(body.stage,'config');assert.equal(body.revision,'members-shared-config-20261024');assert.equal(res.headers.get('X-Marble-Api-Revision'),body.revision);assert.ok(!JSON.stringify(body).includes('sb_secret'));
  }
 }
 const env={...base,SUPABASE_URL:'   ',NEXT_PUBLIC_SUPABASE_URL:'https://exampleproject.supabase.co/'};
 const c={exports:{},URL,Response,AbortSignal,Date,process:{env}};vm.createContext(c);vm.runInContext(js,c);
 // A valid URL fallback reaches request validation rather than falsely reporting setup.
 const res=await c.exports.POST(new Request('https://www.marbleborsa.com/api/admin/members',{method:'POST',headers:{origin:'https://www.marbleborsa.com',authorization:'Bearer test-user','Content-Type':'application/json'},body:'{}'}));
 assert.equal(res.status,400);assert.equal((await res.json()).code,'INVALID_REQUEST');
 console.log('Shared configuration passed: matching PATCH/POST setup diagnostics, revision, secret redaction and blank private URL fallback.');
})().catch(error=>{console.error(error);process.exitCode=1;});

// Human-readable profile URLs: server/client parity, Turkish names and collisions.
{
 const ts=require('typescript'),c={exports:{}};vm.createContext(c);
 vm.runInContext(ts.transpileModule(fs.readFileSync(path.join(root,'lib/guideRoutes.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,c);
 const rows=[{id:'d26420b0-025d-4d92-8e58-7093895f925b',name:'Kayman Mermer'},{id:'11111111-2222-4333-8444-555555555555',name:'Kayman Mermer'},{id:'22222222-2222-4333-8444-555555555555',name:'İscehisar Taş A.Ş.'},{id:'33333333-2222-4333-8444-555555555555',name:'Reis Nakliyat'},{id:'44444444-2222-4333-8444-555555555555',name:'Reis Nakliyat'}];
 const slugs=c.exports.companyProfileSegments(rows);
 assert.equal(slugs[rows[0].id],'kayman-mermer');assert.equal(slugs[rows[2].id],'iscehisar-tas-a-s');assert.equal(new Set(Object.values(slugs)).size,rows.length);
 assert.equal(c.exports.companyProfileSegments([{...rows[0],name:'Kayman New Name'}])[rows[0].id],'kayman-mermer');
 assert.equal(JSON.stringify(c.exports.companyProfileSegments([...rows].reverse())),JSON.stringify(slugs));
 const client=vm.runInContext('JSON.stringify(companyProfileSegments('+JSON.stringify(rows)+'))',context);
 assert.equal(client,JSON.stringify(slugs));
 console.log('Company name slugs passed: exact Kayman URL, Turkish normalization, duplicate names, order independence and server/client parity.');
}

// Category-specific request forms and visible service entry point in four languages.
{
 const src=fs.readFileSync(path.join(root,'public/market/app.js'),'utf8');
 const forms=src.slice(src.indexOf('function serviceRequestModal('),src.indexOf('function dbErrorMessage('));
 const previousState=vm.runInContext('({lang:state.lang,tab:state.tab,resolved:authResolved})',context);
 const words=vm.runInContext('categoryRequestCopy',context),services=vm.runInContext('serviceFlowCopy',context),equipment=vm.runInContext('equipmentCopy',context);
 for(const lang of ['tr','en','zh','ar']){
  let role='supplier',opened='',login=0,message='';
  const userWindow={MarbleAuthUser:{id:'user'}};
  const c={window:userWindow,state:{lang},requestFormCopy:()=>words[lang],serviceCopy:()=>services[lang],equipmentCopy:equipment,tr:key=>key,f:key=>key,safe:String,auth:()=>login++,isActiveSupplier:()=>role==='supplier',canRequestEquipment:()=>['buyer','supplier','service'].includes(role),toast:text=>message=text,modal:(_a,_b,html)=>opened=html};
  vm.createContext(c);vm.runInContext(forms,c);
  c.serviceRequestModal('Transport');assert.ok(opened.includes('data-request-kind="service"'));assert.ok(opened.includes(words[lang].serviceName));assert.ok(opened.includes(words[lang].serviceHint));assert.ok(!opened.includes('value="slab"'));
  opened='';role='buyer';c.serviceRequestModal();assert.equal(opened,'');assert.equal(message,services[lang].only);
  c.equipmentRequestModal('Diamond blade','supplies');assert.ok(opened.includes('data-request-kind="equipment"'));assert.ok(opened.includes('value="supplies" selected'));assert.ok(opened.includes(words[lang].machineHint));assert.ok(opened.includes(words[lang].delivery));
  opened='';userWindow.MarbleAuthUser=null;c.serviceRequestModal();assert.equal(login,1);assert.equal(opened,'');
 }
 assert.ok(vm.runInContext("authResolved=true;state.tab='services';canShowPanelAction()",context));
 for(const lang of ['tr','en','zh','ar']){
  const value=vm.runInContext("state.lang='"+lang+"';state.tab='services';categoryActionLabel()",context);assert.equal(value,words[lang].serviceAction);
  assert.equal(vm.runInContext("state.tab='machines';categoryActionLabel()",context),words[lang].machineAction);
 }
 vm.runInContext(`state.lang=${JSON.stringify(previousState.lang)};state.tab=${JSON.stringify(previousState.tab)};authResolved=${JSON.stringify(previousState.resolved)}`,context);
 console.log('Category request forms passed: four-language labels, service entry visibility, guest sign-in, role guards and machine/supplies selection.');
}
