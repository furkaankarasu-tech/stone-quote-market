const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const app = {
  id: 'application-1', owner_id: 'seller-1', account_role: 'supplier',
  company_name: 'Afyon Mermer', submitted_at: '2026-09-28T07:00:00Z',
  contacted_at: null, contacted_by: null,
  company_details: {authorized_name: 'Ali', corporate_email: 'ali@example.com',
    country: 'Türkiye', phone: '0532 123 45 67'}
};
const foreignApp = {
  id: 'application-2', owner_id: 'seller-2', account_role: 'service',
  company_name: 'Other Service', submitted_at: '2026-09-28T06:00:00Z',
  contacted_at: '2026-09-28T06:30:00Z', contacted_by: 'admin-1',
  company_details: {authorized_name: 'Other', country: 'Germany', phone: '0170 1234567'}
};
const state = {apps: [foreignApp, app], profiles: [], verifications: [], payments: [], memberships: [], events: []};
const root = {innerHTML: '', textContent: ''};
const plans = {textContent: JSON.stringify({supplier: {annualAmountTRY: 25000}, service: {annualAmountTRY: 15000}})};
const listeners = {};
let adminReadCount = 0;
const document = {
  getElementById(id) {return id === 'mb-admin-root' ? root : id === 'mb-admin-plans' ? plans : null;},
  addEventListener(type, listener) {listeners[type] = listener;}
};
const window = {
  MarbleAuth: {client: {auth: {getUser: async () => ({data: {user: {id: 'admin-1'}}, error: null})},
    rpc: async () => ({data: true, error: null})}},
  MarbleDB: {
    async adminApplications() {adminReadCount++; return state;},
    async setApplicationContacted(id, contacted) {
      assert.equal(id, app.id);
      app.contacted_at = contacted ? '2026-09-28T08:00:00Z' : null;
      app.contacted_by = contacted ? 'admin-1' : null;
    }
  },
  alert(message) {throw Error(`Unexpected alert: ${message}`);},
  confirm() {throw Error('Unexpected payment confirmation');},
  open() {throw Error('Contact link must not open through admin JS');}
};
const script = fs.readFileSync(path.join(__dirname, '../public/market/admin.js'), 'utf8');
vm.runInNewContext(script, {document, window, Intl, Date, console}, {filename: 'admin.js'});

async function flush() {await new Promise(resolve => setImmediate(resolve));}
function buttonClick(dataset) {
  const button = {dataset, disabled: false, isConnected: true};
  const target = {closest(selector) {
    return selector === '[data-contact]' && Object.hasOwn(dataset, 'contact') ? button : null;
  }};
  return listeners.click({target});
}

(async () => {
  await flush();
  assert.equal(adminReadCount, 1);
  assert.match(root.innerHTML, /1 yeni firma başvurusu/);
  assert.ok(root.innerHTML.indexOf('Afyon Mermer') < root.innerHTML.indexOf('Other Service'));
  assert.match(root.innerHTML, /Yeni başvuru/);
  const link = root.innerHTML.match(/href="(https:\/\/wa\.me\/[^\"]+)"/);
  assert.ok(link, 'Turkish mobile number should create a WhatsApp link');
  const url = new URL(link[1].replaceAll('&amp;', '&'));
  assert.equal(url.pathname, '/905321234567');
  assert.match(url.searchParams.get('text'), /Ali.*Marble Borsa.*Afyon Mermer/);
  assert.equal((root.innerHTML.match(/href="https:\/\/wa\.me\//g) || []).length, 1,
    'A foreign local number without country code must not become a guessed link');
  assert.match(root.innerHTML, /siz Gönder'e basmadan iletilmez/);

  await buttonClick({contact: app.id, value: 'true'});
  assert.equal(adminReadCount, 2);
  assert.match(root.innerHTML, /0 yeni firma başvurusu/);
  assert.match(root.innerHTML, /Takibe geri al/);

  await buttonClick({contact: app.id, value: 'false'});
  assert.match(root.innerHTML, /1 yeni firma başvurusu/);
  console.log('Admin outreach smoke check passed: follow-up queue, WhatsApp link and reversible contact status.');
})().catch(error => {console.error(error); process.exitCode = 1;});
