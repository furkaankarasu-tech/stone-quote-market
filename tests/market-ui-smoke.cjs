const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const markup = fs.readFileSync(path.join(root, 'lib/marketBody.html'), 'utf8');
for (const id of ['modal', 'signupButton', 'accountButton', 'adLabel', 'partnersPanel', 'partnerFields', 'categoryCompanies']) {
  assert.match(markup, new RegExp(`id="${id}"`), `${id} missing from markup`);
}

const events = new Map();
const elements = new Map();
const makeElement = id => ({
  id, textContent: '', innerHTML: '', value: '', hidden: id === 'modal' || id === 'categoryCompanies',
  style: {}, dataset: {}, classList: {add(){}, remove(){}, toggle(){}},
  setAttribute(){}, addEventListener(type, callback){events.set(`${id}:${type}`, callback)},
  querySelector(){return {focus(){}}}, focus(){}, scrollIntoView(){}
});
const document = {
  body: {style: {}}, documentElement: {lang: 'tr', dir: 'ltr'}, head: {appendChild(){}},
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
const location = {pathname: '/', search: '', hash: ''};
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
for (const script of ['app.js', 'registration.js', 'live-ui.js']) {
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
assert.equal(el('partnersTitle').textContent, 'Reklam ve tanıtım alanları');
assert.match(el('partnerFields').innerHTML, /data-promo="featured"/);
assert.equal(el('adLabel').textContent, 'REKLAM ALANI');

click('signupButton');
assert.equal(el('modal').hidden, false);
assert.match(el('modalBody').innerHTML, /data-signup-role="buyer"/);
click('signupRole', {signupRole: 'buyer'});
assert.match(el('modalBody').innerHTML, /id="signupForm"/);
assert.doesNotMatch(el('modalBody').innerHTML, /name="directoryConsent"/);
click('signupRole', {signupRole: 'supplier'});
assert.match(el('modalBody').innerHTML, /name="directoryConsent" type="checkbox"/);
click('close', {close: ''});
assert.equal(el('modal').hidden, true);

click('accountButton');
assert.equal(el('modal').hidden, false);
assert.match(el('modalBody').innerHTML, /id="realLoginForm"/);
click('close', {close: ''});
click('newRequestButton');
assert.match(el('modalBody').innerHTML, /id="realLoginForm"/);
click('close', {close: ''});

click('promo', {promo: 'featured'});
assert.match(el('modalBody').innerHTML, /reklam alanının nasıl görüneceğini/);
click('close', {close: ''});

click('tab', {tab: 'companies'});
assert.equal(location.pathname, '/tr/firmalar');
assert.equal(el('panelTitle').textContent, 'Firma rehberi');

window.MarbleDirectoryState = {status: 'ready', companies: [
  {name: 'Makine Tedarik AŞ', city: 'Afyonkarahisar', activity_type: 'machine', section: 'machines'},
  {name: 'Sarf Ltd', city: 'Denizli', activity_type: 'supplies', section: 'machines'},
  {name: 'Lojistik Ltd', city: 'İzmir', activity_type: 'logistics', section: 'services'}
]};
click('tab', {tab: 'machines'});
assert.equal(el('categoryCompanies').hidden, false);
assert.match(el('cards').innerHTML, /Makine Tedarik AŞ/);
assert.match(el('cards').innerHTML, /Sarf Ltd/);
assert.match(el('categoryCompaniesList').innerHTML, /Makine Tedarik AŞ/);
click('tab', {tab: 'services'});
assert.match(el('cards').innerHTML, /Lojistik Ltd/);
assert.doesNotMatch(el('categoryCompaniesList').innerHTML, /Makine Tedarik AŞ/);

console.log('Market UI smoke check passed: signup, login, modal close, request, promotion, navigation, category companies.');
