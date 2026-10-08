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
    querySelector(){return {focus(){}}}, scrollIntoView(){}, focus(){}
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
vm.runInContext("function liveCopy(){return {workspace:'',footer:''}}",context);
window.MarbleAuthSettled=true;window.MarbleAuthUser={id:'cached-user',email_confirmed_at:'2026-01-01'};
window.MarbleUIRefresh();
assert.equal(element('signupButton').hidden,true);
assert.equal(element('accountButton').textContent,'Profil');
window.MarbleAuthUser=null;window.MarbleUIRefresh();
assert.equal(element('signupButton').hidden,false);
vm.runInContext("setTab('companies')",context);
assert.match(element('cards').innerHTML,/href="\/tr\/firmalar\/123e4567-e89b-12d3-a456-426614174001"/);
vm.runInContext("setTab('stones')",context);
assert.match(element('cards').innerHTML,/Firma katalogları/);
assert.match(element('cards').innerHTML,/Tür rehberi/);
assert.match(element('cards').innerHTML,/FİRMA ÜRÜNÜ/);
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
  vm.runInNewContext(ts.transpile(source, {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}), {exports, process: {env: {}}, AbortSignal, fetch: async (_, init) => {options = init; return {ok: !fail, status: 401, json: async () => [{company_id: 'test'}]};}});
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
const {marketMarkup,localizedMarkup}=require('../lib/marketMarkup.ts');
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
  let response={data:[{name:'folder',id:null},{name:'latest.pdf',id:'file-id'}],error:null};
  let signed={data:{signedUrl:'https://example.com/private-document'},error:null};
  const calls=[];
  const storage={async list(prefix,options){calls.push({prefix,options});return response},async createSignedUrl(name,ttl){calls.push({name,ttl});return signed}};
  const context={client:()=>({storage:{from(bucket){assert.equal(bucket,'mb-company-documents-private');return storage}}}),checked:({data,error})=>{if(error)throw error;return data}};
  vm.createContext(context);const api=vm.runInContext('({' + body + '})',context);
  const owner='f35cdbc8-1f73-482e-86da-b125fbd61d24';
  assert.equal(await api.verificationDocument(owner),'https://example.com/private-document');
  assert.equal(calls[0].options.sortBy.column,'updated_at');assert.equal(calls[0].options.sortBy.order,'desc');
  assert.equal(calls[1].name,owner+'/company-document/latest.pdf');assert.equal(calls[1].ttl,120);
  await assert.rejects(api.verificationDocument('../other'),/geçersiz/);
  response={data:[],error:null};assert.equal(await api.verificationDocument(owner),null);
  response={data:null,error:new Error('Access denied')};await assert.rejects(api.verificationDocument(owner),/Access denied/);
  response={data:[{name:'latest.pdf',id:'file-id'}],error:null};signed={data:{},error:null};await assert.rejects(api.verificationDocument(owner),/geçici bağlantı/);
  signed={data:null,error:new Error('Signing denied')};await assert.rejects(api.verificationDocument(owner),/Signing denied/);
  console.log('Admin document resolver passed: latest file, folder exclusion, owner validation, empty list and storage/signing failures.');
})().catch(error=>{console.error(error);process.exitCode=1});

// Run the real destructive-action handlers: cancellation must never call the RPC.
(async()=>{
  const source=fs.readFileSync(path.join(root,'public/market/admin.js'),'utf8');
  const start=source.indexOf('    document.addEventListener("click", async (event) => {');
  const end=source.indexOf('\n    document.addEventListener("submit"',start);
  const handlerSource=source.slice(start,end);
  async function companyCase(name,confirm,payments=[],rpcError=null){
    let handler;const calls=[];const button={dataset:{companyDelete:'company-id'},disabled:false,isConnected:true};
    const context={adminText:x=>x,adminHtml:(parts,...values)=>parts.reduce((s,p,i)=>s+p+(values[i]??""),""),document:{addEventListener(type,fn){handler=fn}},current:{apps:[{id:'company-id',company_name:'TEST firma'}],payments},
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
    const context={adminText:x=>x,busy:false,authorized,editing:false,rows:[{id:'ad-id',title:'TEST reklam'}],window:{MarbleAdminUI:{async open(){return confirm?name:null}},MarbleDB:{async deleteAdvertisement(id,text){calls.push(['delete',id,text]);if(rpcError)throw rpcError}}},async load(){calls.push(['refresh'])},message:(text,error)=>calls.push(['message',text,error]),failure:error=>error.message};
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
 const code=ts.transpileModule(fs.readFileSync(path.join(root,'components/GuideLanguagePicker.tsx'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const jsx=(tag,props)=>({tag,props});let count=0;
 for(const from of ['tr','en','zh','ar'])for(const to of ['tr','en','zh','ar'])for(const page of ['yonetim','yasal/kvkk','yasal/gizlilik','yasal/cerez','yasal/kullanim-kosullari','firmalar-icin','hakkimizda','iletisim','profil','dogal-tas/afyon-white','firmalar/11111111-1111-4111-8111-111111111111','sifre-sifirla']){
  let target,pref;const c={exports:{},require:name=>name==='react'?{useEffect(){}}:name==='react/jsx-runtime'?{jsx,jsxs:jsx}:r.exports,window:{location:{pathname:`/${from}/${page}`,assign(value){target=value}}},localStorage:{setItem(key,value){pref=value}}};vm.createContext(c);vm.runInContext(code,c);
  const tree=c.exports.default({locale:from});const select=tree.props.children.find(child=>child.tag==='select');select.props.onChange({target:{value:to}});
  assert.equal(target,`/${to}/${page}`);assert.equal(pref,to);count++;
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
  vm.createContext(context);vm.runInContext(helpers+'\n'+functions.render,context);context.render();
  assert.ok(context.root.innerHTML.includes('Çağrı'),'Preserve contact name');
  const labels=context.root.innerHTML.replaceAll('Firmalar','').replaceAll('Çağrı','');
  if(lang!=='tr')assert.ok(!/[ıİşŞğĞüÜöÖçÇ]/.test(labels),'Company admin card '+lang+' '+role);
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
 const jsx=(tag,props)=>({tag,props}),directory={uuidPattern:/^[0-9a-f-]{36}$/i,publicCompanies:async()=>[company],publicCatalog:async()=>[item],publicAssetUrl:(bucket,path)=>path?`https://example.com/${bucket}/${path}`:''};
 for(const file of ['app/[locale]/firmalar/[slug]/page.tsx','app/[locale]/dogal-tas/[slug]/page.tsx']){
  const compiled=ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  const c={exports:{},require:name=>name==='react/jsx-runtime'?{jsx,jsxs:jsx,Fragment:'fragment'}:name==='next/link'?{default:'a'}:name==='next/navigation'?{notFound(){throw Error('Unexpected 404')},permanentRedirect(){throw Error('Unexpected redirect')}}:name==='@/lib/publicDirectory'?directory:name==='@/lib/guideRoutes'?routeContext.exports:name==='@/lib/stoneData'?stoneContext.exports:name==='@/lib/seo'?{buildMetadata:x=>x,absoluteUrl:path=>'https://www.marbleborsa.com'+path,safeJsonLd:JSON.stringify,stoneDescription:()=>''}:{}};
  vm.createContext(c);vm.runInContext(compiled,c);
  for(const locale of ['tr','en','zh','ar']){
   const params=Promise.resolve({locale,slug:file.includes('firmalar')?id:'afyon-white'}),tree=await c.exports.default({params}),links=[];
   function walk(n){if(!n||typeof n!=='object')return;if(n.props?.href)links.push(n.props.href);for(const child of [n.props?.children].flat(Infinity))walk(child)}walk(tree);
   assert.ok(links.length>3);assert.ok(links.every(link=>link.startsWith(`/${locale}`)),'Detail links preserve '+locale);
   const metadata=await c.exports.generateMetadata({params});assert.ok(metadata.path.startsWith(`/${locale}/`));assert.equal(Object.keys(metadata.languages).length,4);
   if(file.includes('firmalar')){assert.ok(JSON.stringify(tree).includes('Firmanın kendi Türkçe metni'));assert.ok(JSON.stringify(tree).includes('Çağrı Mermer'));}
  }
 }
 console.log('Company and stone server pages passed: four locale routes, metadata alternates, translated labels, retained company content and locale-safe links.');
})().catch(error=>{console.error(error);process.exitCode=1});
