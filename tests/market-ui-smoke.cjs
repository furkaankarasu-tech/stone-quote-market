const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const markup = fs.readFileSync(path.join(root, 'lib/marketBody.html'), 'utf8');
for (const id of ['modal', 'signupButton', 'accountButton', 'adLabel', 'partnersPanel', 'partnerFields', 'categoryCompanies', 'serviceRequestAction']) {
  assert.match(markup, new RegExp(`id="${id}"`), `${id} missing from markup`);
}
const workspaceAt = markup.indexOf('id="workspace"');
const marketAt = markup.indexOf('id="market"');
const partnersAt = markup.indexOf('id="partnersPanel"');
assert(workspaceAt > markup.indexOf('class="hero"') && workspaceAt < marketAt,
  'Account workspace should appear below the hero and above the catalogue');
assert(partnersAt > marketAt, 'Promotions should follow the catalogue');
assert.match(markup, /id="workspace"[^>]* hidden>/, 'Workspace should start hidden for visitors');
assert.doesNotMatch(markup, /id="workspaceAction"/, 'Workspace should not duplicate the header login button');

const events = new Map();
const elements = new Map();
const makeElement = id => ({
  id, textContent: '', innerHTML: '', value: '', hidden: id === 'modal' || id === 'categoryCompanies',
  style: {}, dataset: {}, elements: {email: {value: ''}}, classList: {add(){}, remove(){}, toggle(){}},
  setAttribute(){}, addEventListener(type, callback){events.set(`${id}:${type}`, callback)},
  querySelector(){return {focus(){}}}, focus(){}, scrollIntoView(){}
});
const document = {
  body: {style: {}}, documentElement: {lang: 'tr', dir: 'ltr'}, head: {appendChild(element){return element}},
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, makeElement(id));
    if (id === 'mb-company-data') elements.get(id).textContent = '[]';
    if (id === 'mb-membership-plans') elements.get(id).textContent = JSON.stringify({
      plans: {supplier: {annualAmountTRY: 1000}, service: {annualAmountTRY: 1000}},
      contactEmail: 'example@example.com'
    });
    return elements.get(id);
  },
  addEventListener(type, callback) {
    if (!events.has(type)) events.set(type, []);
    events.get(type).push(callback);
  },
  querySelector(){return null}, createElement(){return makeElement('meta')}
};
const location = {pathname: '/', search: '?item=Afyon%20White', hash: ''};
const history = {
  pushState(_a, _b, url){location.pathname = url.split('?')[0]},
  replaceState(_a, _b, url){location.pathname = url.split('?')[0]}
};
const window = {addEventListener(){}};
const context = vm.createContext({
  document, window, location, history, URL, URLSearchParams, Intl,
  localStorage: {getItem(){return null}, setItem(){}},
  setTimeout(){return 1}, clearTimeout(){}, console
});
for (const script of ['app.js', 'registration.js', 'live-ui.js', 'logo.js', 'catalog.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'public/market', script), 'utf8'), context, {filename: script});
}

const el = id => document.getElementById(id);
function click(id, dataset = {}) {
  const target = {
    id, dataset,
    closest(selector) {
      const requested = selector.split(',').map(item => item.trim());
      return requested.some(item => item === `#${id}` || Object.keys(dataset).some(key =>
        item === `[data-${key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}]`
      )) ? target : null;
    }
  };
  for (const listener of events.get('click') || []) listener({target, preventDefault(){}});
}

assert.equal(el('signupButton').textContent, 'Üye Ol');
assert.equal(el('workspace').hidden, true, 'Visitors should see the catalogue without a login panel');
assert.equal(el('workspaceContent').innerHTML, '');
assert.equal(el('logoutButton').hidden, true, 'Public header must not show sign-out');
assert.equal(el('partnersTitle').textContent, 'Sektörde görünür olun');
assert.match(el('partnerFields').innerHTML, /data-promo="featured"/);
assert.equal(el('adLabel').textContent, 'REKLAM ALANI');

click('signupButton');
assert.equal(el('modal').hidden, false);
assert.match(el('modalBody').innerHTML, /data-signup-role="buyer"/);
click('signupRole', {signupRole: 'buyer'});
assert.match(el('modalBody').innerHTML, /id="signupForm"/);
assert.doesNotMatch(el('modalBody').innerHTML, /name="companyLogo"/);
assert.doesNotMatch(el('modalBody').innerHTML, /name="directoryConsent"/);
click('signupRole', {signupRole: 'supplier'});
assert.match(el('modalBody').innerHTML, /name="directoryConsent" type="checkbox"/);
assert.match(el('modalBody').innerHTML, /name="companyLogo" type="file"[^>]*required/);
click('signupRole', {signupRole: 'service'});
assert.match(el('modalBody').innerHTML, /name="companyLogo" type="file"[^>]*required/);
click('close', {close: ''});
assert.equal(el('modal').hidden, true);

click('accountButton');
assert.equal(el('modal').hidden, false);
assert.match(el('modalBody').innerHTML, /id="realLoginForm"/);
assert.match(el('modalBody').innerHTML, /data-forgot-password/);
assert.match(el('modalBody').innerHTML, /class="auth-login-aux"/);
assert.match(el('modalBody').innerHTML, /class="auth-login-footer"/);
click('forgotPassword', {forgotPassword: ''});
assert.match(el('modalBody').innerHTML, /id="forgotPasswordForm"/);
assert.match(el('modalBody').innerHTML, /Şifre yenileme bağlantısı gönder/);
click('realLogin', {realLogin: ''});
assert.match(el('modalBody').innerHTML, /id="realLoginForm"/);
click('close', {close: ''});
click('newRequestButton');
assert.match(el('modalBody').innerHTML, /id="realLoginForm"/);
click('close', {close: ''});

click('promo', {promo: 'featured'});
assert.match(el('modalBody').innerHTML, /marbleborsa@marbleborsa.com/);
click('close', {close: ''});

click('tab', {tab: 'companies'});
assert.equal(location.pathname, '/tr/firmalar');
assert.equal(el('panelTitle').textContent, 'Firma rehberi');

window.MarbleDirectoryState = {status: 'ready', companies: [
  {id:'app-1',name: 'Afyon Mermer Gerçek', city: 'Afyonkarahisar', activity_type: 'quarry', section: 'companies', logo_url: 'https://example.com/company.png'},
  {name: 'Makine Tedarik AŞ', city: 'Afyonkarahisar', activity_type: 'machine', section: 'machines'},
  {name: 'Sarf Ltd', city: 'Denizli', activity_type: 'supplies', section: 'machines'},
  {name: 'Lojistik Ltd', city: 'İzmir', activity_type: 'logistics', section: 'services'}
]};
window.MarbleCatalogState = {status:'ready',items:[{id:'catalog-1',company_id:'app-1',title:'Afyon White Plaka',category:'stone',description:'Afyon doğal taşı, cilalı ve honlu yüzey',image_urls:['https://example.com/1.png','https://example.com/2.png','https://example.com/3.png'],pdf_url:'',video_url:''}]};
window.MarbleUIRefresh();
assert.match(el('cards').innerHTML, /Afyon Mermer Gerçek/);
assert.match(el('cards').innerHTML, /src="https:\/\/example.com\/company.png"/);
click('card', {card: 'live-0'});
assert.match(el('modalBody').innerHTML, /Afyonkarahisar/);
assert.match(el('modalBody').innerHTML, /company-detail-logo/);
assert.match(el('modalBody').innerHTML, /Afyon White Plaka/);
assert.doesNotMatch(el('modalBody').innerHTML, /href="\/tr\/firmalar\//);
click('close', {close: ''});
click('tab', {tab: 'machines'});
assert.equal(el('categoryCompanies').hidden, false);
assert.doesNotMatch(el('cards').innerHTML, /Makine Tedarik AŞ/, 'Category examples must not claim a supplier');
assert.match(el('categoryCompaniesList').innerHTML, /Makine Tedarik AŞ/);
assert.match(el('categoryCompaniesList').innerHTML, /Sarf Ltd/);
click('tab', {tab: 'services'});
assert.match(el('categoryCompaniesList').innerHTML, /Lojistik Ltd/);
assert.doesNotMatch(el('categoryCompaniesList').innerHTML, /Makine Tedarik AŞ/);

click('tab', {tab: 'stones'});
assert.match(el('cards').innerHTML, /Afyon White Plaka/);
click('card', {card: 'catalog-catalog-1'});
assert.match(el('modalBody').innerHTML, /catalog-gallery/);
click('close', {close: ''});
const signedInUser = {id: 'user-1', email: 'member@example.com', user_metadata: {}};
function signInAs(role) {
  window.MarbleAuthUser = signedInUser;
  window.MarbleDBState = {
    status: 'ready', userId: signedInUser.id, requests: [], error: null,
    account: {profile: {account_role: role, full_name: 'Test User'}, application: {id: 'app-1'},
      verification: null, membership: null, admin: false, activeSupplier: role === 'supplier',
      activeService: role === 'service'}
  };
  window.MarbleUIRefresh();
}

for (const role of ['supplier', 'service']) {
  signInAs(role);
  location.pathname = '/tr/profil';
  window.MarbleUIRefresh();
  assert.match(el('workspaceContent').innerHTML, /id="companyLogoForm"/, `${role}: logo upload form`);
  assert.match(el('workspaceContent').innerHTML, /Firma kataloğum/);
  assert.match(el('workspaceContent').innerHTML, /class="profile-overview"/);
  assert.match(el('workspaceContent').innerHTML, /id="profile-settings"/);
  location.pathname = '/tr/dogal-tas';
  window.MarbleUIRefresh();
  assert.equal(el('modal').hidden, true, `${role}: deep link must not open the buyer form`);
  assert.equal(el('newRequestButton').hidden, true, `${role}: hero request hidden`);
  click('tab', {tab: 'machines'});
  assert.equal(el('panelAction').hidden, false, `${role}: equipment request available`);
  click('panelAction');
  assert.match(el('modalBody').innerHTML, /data-request-kind="equipment"/);
  click('close', {close: ''});
  click('card', {card: '0'});
  assert.doesNotMatch(el('modalBody').innerHTML, /id="detailQuote"/);
  click('close', {close: ''});
  click('newRequestButton'); // A synthetic click must not bypass the role guard.
  assert.equal(el('modal').hidden, true);
  assert.match(el('toast').textContent, role === 'service' ? /Hizmet sağlayıcı taş/ : /yalnızca alıcı hesabı açabilir/);
  const fakeForm = {id: 'requestForm', dataset: {}, item: {value: 'Mermer'}, quantity: {value: '1'},
    destination: {value: 'Afyon'}};
  for (const listener of events.get('submit') || []) listener({target: fakeForm, preventDefault(){}});
  assert.match(el('formError').textContent, role === 'service' ? /Hizmet sağlayıcı taş/ : /yalnızca alıcı hesabı açabilir/);
}

signInAs('supplier');
click('tab', {tab: 'services'});
assert.equal(el('serviceRequestAction').hidden, false);
assert.equal(el('panelAction').hidden, false);
assert.match(el('cards').innerHTML, /Hizmet iste/);
click('panelAction');
assert.match(el('modalBody').innerHTML, /data-request-kind="service"/);
click('close', {close: ''});
click('serviceRequestAction');
assert.match(el('modalBody').innerHTML, /data-request-kind="service"/);
click('close', {close: ''});

signInAs('service');
window.MarbleDBState.requests = [
  {id: 'service-request-1', item: 'Lojistik', format: 'service', status: 'open',
    buyer_id: 'supplier-2', quantity: 1, unit: 'adet', destination: 'Afyon', notes: '', offers: []},
  {id: 'product-request-1', item: 'Mermer', format: 'slab', status: 'open',
    buyer_id: 'buyer-2', quantity: 2, unit: 'm²', destination: 'Afyon', notes: '', offers: []}
];
window.MarbleUIRefresh();
click('tab', {tab: 'requests'});
assert.equal(el('panelTitle').textContent, 'Hizmet Talepleri');
assert.match(el('cards').innerHTML, /Lojistik/);
assert.doesNotMatch(el('cards').innerHTML, /Mermer/);
click('card', {card: 'service-request-1'});
assert.match(el('modalBody').innerHTML, /data-offer="service-request-1"/);
click('offer', {offer: 'service-request-1'});
assert.match(el('modalBody').innerHTML, /id="offerForm"/);
click('close', {close: ''});

signInAs('buyer');
assert.equal(el('workspace').hidden, true, 'The account panel should not occupy the catalogue');
window.MarbleDBState.requests=[{id:'buyer-own-request',item:'Afyon White',format:'slab',status:'open',
  buyer_id:signedInUser.id,quantity:4,unit:'m²',destination:'Afyon',notes:'',offers:[
    {id:'buyer-offer-1',supplier_id:'seller-2',unit_price:400,currency:'TRY',notes:''}
  ]}];
location.pathname = '/tr/profil';
window.MarbleUIRefresh();
assert.equal(el('workspace').hidden, false, 'Profile route should show the account panel');
assert.match(el('workspaceContent').innerHTML, /id="realRequests"/);
assert.match(el('workspaceContent').innerHTML, /class="profile-stats"/);
assert.match(el('workspaceContent').innerHTML, /id="profile-requests"/);
assert.match(el('workspaceContent').innerHTML, /Açtığım talepler<\/span><b>1<\/b>/);
assert.match(el('workspaceContent').innerHTML, /Gelen teklifler<\/span><b>1<\/b>/);
location.pathname = '/tr/dogal-tas';
window.MarbleUIRefresh();
assert.equal(el('newRequestButton').hidden, false);
click('tab', {tab: 'services'});
assert.equal(el('panelAction').hidden, true, 'Buyers cannot open a service request');
click('tab', {tab: 'machines'});
assert.equal(el('panelAction').hidden, false);
assert.match(el('cards').innerHTML, /Teklif iste/);
click('card', {card: '0'});
assert.match(el('modalBody').innerHTML, /data-equipment-kind="machine"/);
click('close', {close: ''});
click('newRequestButton');
assert.match(el('modalBody').innerHTML, /id="requestForm"/);
window.MarbleAuthUser = null;
window.MarbleUIRefresh();
assert.equal(el('workspace').hidden, true, 'The account panel should disappear after logout');
assert.equal(el('workspaceContent').innerHTML, '');
assert.equal(el('logoutButton').hidden, true, 'Public header must not show sign-out');

async function checkServiceFlow() {
  const requestPayloads = [], offerPayloads = [];
  window.MarbleDB = {
    async createRequest(payload) { requestPayloads.push(payload); return {id: 'new-service-request'}; },
    async createOffer(payload) { offerPayloads.push(payload); return {id: 'new-service-offer'}; },
    async refresh() {}
  };
  signInAs('supplier');
  click('tab', {tab: 'services'});
  click('serviceRequestAction');
  const serviceForm = {id: 'requestForm', dataset: {requestKind: 'service'},
    item: {value: 'Nakliye'}, quantity: {value: '1'}, destination: {value: 'Afyon'},
    notes: {value: 'Ocaktan limana'}, querySelector() {return {disabled: false, isConnected: true}}};
  for (const listener of events.get('submit') || []) listener({target: serviceForm, preventDefault(){}});
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(requestPayloads.length, 1);
  assert.equal(requestPayloads[0].format, 'service');
  assert.equal(requestPayloads[0].request_kind, 'service');
  assert.equal(requestPayloads[0].unit, 'adet');

  click('tab', {tab: 'machines'});
  click('panelAction');
  const equipmentForm = {id:'requestForm', dataset:{requestKind:'equipment'},
    item:{value:'Köprü Kesim'},quantity:{value:'1'},destination:{value:'Afyon'},
    format:{value:'machine'},unit:{value:'adet'},notes:{value:''},
    querySelector(){return {disabled:false,isConnected:true}}};
  for(const listener of events.get('submit')||[])listener({target:equipmentForm,preventDefault(){}});
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(requestPayloads[1].format,'machine');
  assert.equal(requestPayloads[1].request_kind,'product');
  assert.equal(requestPayloads[1].unit,'adet');

  signInAs('service');
  click('tab', {tab: 'machines'});
  const suppliesForm={...equipmentForm,format:{value:'supplies'},item:{value:'Elmas Soket'}};
  for(const listener of events.get('submit')||[])listener({target:suppliesForm,preventDefault(){}});
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(requestPayloads[2].format,'supplies');
  assert.equal(requestPayloads[2].request_kind,'product');
  window.MarbleDBState.requests = [{id: 'service-request-2', item: 'Nakliye', format: 'service',
    status: 'open', buyer_id: 'supplier-2', quantity: 1, unit: 'adet', destination: 'Afyon', notes: '', offers: []}];
  window.MarbleUIRefresh();
  click('tab', {tab: 'requests'});
  click('card', {card: 'service-request-2'});
  click('offer', {offer: 'service-request-2'});
  const offerForm = {id: 'offerForm', dataset: {id: 'service-request-2'}, price: {value: '100'},
    currency: {value: 'TRY'}, contactEmail: {value: 'service@example.com'}, notes: {value: 'Teslim dahil'},
    querySelector() {return {disabled: false, isConnected: true}}};
  for (const listener of events.get('submit') || []) listener({target: offerForm, preventDefault(){}});
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(offerPayloads.length, 1);
  assert.equal(offerPayloads[0].request_id, 'service-request-2');
  assert.equal(offerPayloads[0].application_id, 'app-1');
}

async function checkCatalogueCreateFlow(){
  const ownerId='123e4567-e89b-12d3-a456-426614174000',uploads=[],created=[];
  window.MarbleAuthUser={id:ownerId,email:'firm@example.com',user_metadata:{directory_consent:true}};
  window.MarbleDBState={status:'ready',userId:ownerId,requests:[],account:{
    profile:{account_role:'supplier',full_name:'Firma sahibi'},
    application:{id:'123e4567-e89b-12d3-a456-426614174002',company_name:'Firma',company_details:{activity_type:'machine'}},
    activeSupplier:true,activeService:false,verification:{verified:true},membership:{started_at:'2026-01-01',ends_at:'2027-01-01'}
  }};
  window.MarbleDB={
    async myCatalogue(){return created.map(row=>({...row,is_published:true}));},
    async createCatalogItem(row){created.push(row);return {id:row.id}},
    async refreshDirectory(){},
    logoUrl(){return ''}
  };
  window.MarbleAuth={client:{storage:{from(bucket){assert.equal(bucket,'mb-catalog-assets');return {
    async upload(filePath,file){uploads.push({filePath,file});return {error:null}},
    async remove(){return {error:null}}
  }}}}};
  context.FormData=class{constructor(form){this.values=form.values}get(name){return this.values[name]??null}};
  let catalogUuidCounter=4;
  context.crypto={randomUUID:()=> `123e4567-e89b-12d3-a456-${String(426614174000+catalogUuidCounter++).padStart(12,'0')}`};
  location.pathname='/tr/profil';
  await window.MarbleCatalog.loadMine(true);
  assert.match(el('workspaceContent').innerHTML,/Firma kataloğum/);
  click('catalogNew',{catalogNew:''});
  assert.match(el('modalBody').innerHTML,/id="catalogForm"/);
  const photos=[1,2,3].map(n=>({name:`photo${n}.jpg`,type:'image/jpeg',size:2048}));
  const button={disabled:false,isConnected:true,textContent:''};
  const form={id:'catalogForm',values:{title:'Elmas Tel Makinesi',category:'machine',description:'Ocak kesimi için üretim makinesi.',videoUrl:''},
    elements:{photos:{files:photos},brochure:{files:[]}},querySelector:()=>button};
  const tooFew={...form,elements:{...form.elements,photos:{files:photos.slice(0,2)}}};
  for(const listener of events.get('submit')||[])listener({target:tooFew,preventDefault(){}});
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(uploads.length,0,'Incomplete listings must not upload assets');
  assert.match(el('catalogError').textContent,/3–10/);
  for(const listener of events.get('submit')||[])listener({target:form,preventDefault(){}});
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(uploads.length,3);
  assert.equal(created.length,1);
  assert.equal(created[0].category,'machine');
  assert.equal(created[0].image_paths.length,3);
  assert.equal(new Set(created[0].image_paths).size,3);
  assert.match(el('workspaceContent').innerHTML,/Elmas Tel Makinesi/);
}

async function checkCompanyLogoFlow() {
  const ownerId = '123e4567-e89b-12d3-a456-426614174000';
  const user = {id: ownerId, email: 'company@example.com'};
  const objects = [];
  const uploads = [];
  let directoryRefreshes = 0;
  context.crypto = {randomUUID: () => '123e4567-e89b-12d3-a456-426614174001'};
  context.FormData = class {constructor(form) {this.values = form.values;} get(name) {return this.values[name] ?? null;}};
  window.MarbleAuth = {client: {storage: {from(bucket) {
    assert.equal(bucket, 'mb-company-logos');
    return {
      async list(folder) {assert.equal(folder, ownerId); return {data: objects.map(name => ({name})), error: null};},
      async upload(filePath, file) {uploads.push({filePath, file}); objects.unshift(filePath.split('/')[1]); return {error: null};},
      async remove(paths) {for (const path of paths) objects.splice(objects.indexOf(path.split('/')[1]), 1); return {error: null};}
    };
  }}}};
  window.MarbleDB = {
    logoUrl: filePath => `https://example.com/logos/${filePath}`,
    async refreshDirectory() {directoryRefreshes++;}
  };
  window.MarbleAuthUser = user;
  location.pathname = '/tr/profil';
  window.MarbleDBState = {status: 'ready', userId: ownerId, account: {
    profile: {account_role: 'supplier', full_name: 'Company Owner'},
    application: {company_name: 'Yeni Mermer Ltd'}, membership: null
  }, requests: []};
  window.MarbleUIRefresh();
  assert.match(el('workspaceContent').innerHTML, /id="companyLogoForm"/);
  const validFile = {name: 'logo.png', size: 1024, type: 'image/png'};
  assert.equal(window.MarbleLogo.valid(validFile), true);
  assert.equal(window.MarbleLogo.valid({name: 'bad.svg', size: 1024, type: 'image/svg+xml'}), false);
  const button = {disabled: false, isConnected: true};
  const form = {id: 'companyLogoForm', values: {companyLogo: validFile}, querySelector: () => button};
  await Promise.all((events.get('submit') || []).map(listener => listener({target: form, preventDefault(){}})));
  assert.equal(uploads.length, 1);
  assert.match(uploads[0].filePath, new RegExp(`^${ownerId}/logo-[0-9]{13}-`));
  assert.equal(directoryRefreshes, 1);
  assert.match(el('workspaceContent').innerHTML, /src="https:\/\/example.com\/logos\//);
  assert.equal(button.disabled, false);
}

async function checkEmailFlows() {
  location.pathname = '/tr/dogal-tas';
  window.MarbleAuthUser = null;
  window.MarbleUIRefresh();
  context.FormData = class { constructor(form) { this.values = form.values; } get(name) { return this.values[name] ?? null; } };
  let signupCount = 0, resetEmail = '', redirectTo = '';
  window.MarbleAuth = {
    async signUp() { signupCount++; return {data: {user: {id: 'fake-or-new'}, session: null}, error: null}; },
    client: {auth: {async resetPasswordForEmail(email, options) { resetEmail = email; redirectTo = options.redirectTo; return {error: null}; }}}
  };
  el('mb-page-seo').textContent = JSON.stringify({siteUrl: 'https://stone-quote-market.vercel.app'});
  click('signupButton');
  click('signupRole', {signupRole: 'buyer'});
  const button = {disabled: false, textContent: '', isConnected: true};
  const buyerForm = {
    id: 'signupForm', dataset: {role: 'buyer'}, querySelector() { return button; },
    values: {email: 'member@example.com', password: 'verylongpassword', confirm: 'verylongpassword',
      fullName: 'Member', termsConsent: 'on', privacyConsent: 'on', kvkkNotice: 'on'}
  };
  for (const listener of events.get('submit') || []) listener({target: buyerForm, preventDefault(){}});
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(signupCount, 1);
  assert.match(el('modalBody').innerHTML, /ikinci hesap açılmaz/);
  click('realLogin', {realLogin: ''});
  el('realLoginForm').elements.email.value = 'member@example.com';
  click('forgotPassword', {forgotPassword: ''});
  const resetButton = {disabled: false, isConnected: true};
  const form = {id: 'forgotPasswordForm', elements: {email: {value: 'member@example.com', checkValidity(){return true}}},
    querySelector() {return resetButton;}};
  for (const listener of events.get('submit') || []) listener({target: form, preventDefault(){}});
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(resetEmail, 'member@example.com');
  assert.equal(redirectTo, 'https://stone-quote-market.vercel.app/tr/sifre-sifirla');
  assert.match(el('modalBody').innerHTML, /bir hesap varsa/);
  let navigatedTo='';
  location.assign=target=>{navigatedTo=target};
  window.MarbleAuth.signIn=async()=>({error:null});
  click('realLogin',{realLogin:''});
  const loginForm={id:'realLoginForm',values:{email:'member@example.com',password:'verylongpassword'},
    querySelector:()=>({disabled:false})};
  for(const listener of events.get('submit')||[])listener({target:loginForm,preventDefault(){}});
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(navigatedTo,'','Successful sign-in should stay on the current page');
  assert.equal(location.pathname,'/tr/dogal-tas');
  assert.equal(el('modal').hidden,true);
  window.MarbleAuthUser={id:'member-1',email:'member@example.com'};
  window.MarbleUIRefresh();
  assert.equal(el('accountButton').textContent,'Profil');
  assert.equal(el('logoutButton').hidden,false, 'Signed-in header must expose sign-out');
  window.MarbleAuth.signOut=async()=>({error:null});
  click('logoutButton');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(window.MarbleAuthUser,null,'Header sign-out should clear user');
  assert.equal(el('logoutButton').hidden,true,'Header sign-out must disappear after logout');
  assert.equal(el('workspace').hidden,true);
  console.log('Market UI smoke check passed: roles, catalogue upload, account recovery and login stays in place.');
}
void checkServiceFlow().then(checkCompanyLogoFlow).then(checkCatalogueCreateFlow).then(checkEmailFlows).catch(error => { console.error(error); process.exitCode = 1; });
