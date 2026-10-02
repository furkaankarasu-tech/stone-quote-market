const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const registration=read('public/market/registration.js');
const app=read('public/market/app.js');
const chrome=read('components/DetailChrome.tsx');
const legal=read('lib/legalDocuments.ts');
const membership=read('lib/membershipPlans.ts');
assert.match(registration,/name="kvkkNotice"/, 'retain KVKK notice');
assert.match(registration,/name="termsConsent"/, 'retain terms consent');
for(const text of [registration,app,chrome]) {
  assert.doesNotMatch(text,/\b(?:private\s+)?demo\b|özel\s+demo|演示账户|演示版|حساب العرض التجريبي|نسخة تجريبية/i,'no visitor demo claims');
}
assert.doesNotMatch(registration,/signup-role-price|membership-summary|publicMembershipLabels|priceLabel\(/,'remove role fees and contact banner');
assert.doesNotMatch(registration,/mailto:|membershipConfig\.contactEmail/,'remove public registration/profile membership contact links');
assert.doesNotMatch(chrome,/DEMO/i,'no guide demo banner/footer');
assert.doesNotMatch(legal,/Taslak metindir/,'remove KVKK draft claim');
assert.match(legal,/KVKK Aydınlatma Metni/,'preserve KVKK');
assert.match(legal,/ücretli üyelik uygulanır/,'preserve truthful paid-plan notice in legal terms');
assert.match(membership,/annualAmountTRY:\s*25000/,'keep supplier administrator plan');
assert.match(membership,/annualAmountTRY:\s*15000/,'keep service administrator plan');
assert.doesNotMatch(read('app/guide.css'),/\.demo-strip/,'remove old demo selector');
console.log('V5 launch copy checks passed: no public fee/contact/demo UI, KVKK kept, administrator plans unchanged.');
