const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'public/market/password-reset.js'), 'utf8');
const signup = fs.readFileSync(path.join(__dirname, '..', 'public/market/registration.js'), 'utf8');
assert.match(signup, /resetPasswordForEmail\(email,\{redirectTo\}\)/);
assert.match(signup, /signupNext/);

async function run({ token = 'good-token', loggedInAs = 'user-1', error = false } = {}) {
  const status = { textContent: '' };
  const errorBox = { textContent: '' };
  const button = { disabled: false };
  let submit, updateCount = 0, signoutCount = 0, redirectPath = '';
  const form = {
    hidden: true,
    elements: { password: { value: 'verylongsecret', focus() {} }, confirm: { value: 'verylongsecret' } },
    querySelector() { return button; },
    addEventListener(event, handler) { if (event === 'submit') submit = handler; }
  };
  const auth = {
    async getUser(accessToken) {
      if (accessToken) return { data: { user: accessToken === 'good-token' ? { id: 'user-1' } : null }, error: accessToken !== 'good-token' };
      return { data: { user: { id: loggedInAs } }, error: null };
    },
    async updateUser({ password }) { updateCount++; assert.equal(password, 'verylongsecret'); return { error: null }; },
    async signOut() { signoutCount++; return { error: null }; }
  };
  const context = vm.createContext({
    window: { MarbleRecoveryHash: error ? '#error=access_denied' : `#type=recovery&access_token=${token}&refresh_token=some-token`, MarbleAuth: { client: { auth } } },
    document: { getElementById(id) { return ({'mb-reset-status': status, 'mb-reset-form': form, 'mb-reset-error': errorBox})[id]; } },
    location: { hash: '', search: '', pathname: '/tr/sifre-sifirla' },
    history: { replaceState(_a, _b, path) { redirectPath = path; } },
    URLSearchParams
  });
  vm.runInContext(source, context);
  await new Promise(resolve => setImmediate(resolve));
  return { status, errorBox, form, get submit() { return submit; }, get updateCount() { return updateCount; }, get signoutCount() { return signoutCount; }, get redirectPath() { return redirectPath; } };
}

(async () => {
  const success = await run();
  assert.equal(success.form.hidden, false);
  assert.equal(success.redirectPath, '/tr/sifre-sifirla');
  assert.match(success.status.textContent, /doğrulandı/);
  await success.submit({ preventDefault() {} });
  assert.equal(success.updateCount, 1);
  assert.equal(success.signoutCount, 1);
  assert.equal(success.form.hidden, true);

  const wrongUser = await run({loggedInAs: 'user-2'});
  assert.equal(wrongUser.form.hidden, true);
  assert.match(wrongUser.status.textContent, /geçersiz/);
  const badLink = await run({error: true});
  assert.equal(badLink.form.hidden, true);
  assert.match(badLink.status.textContent, /geçersiz/);
  console.log('Auth recovery smoke check passed: verified email link, reset, sign-out and invalid link guard.');
})().catch(error => { console.error(error); process.exitCode = 1; });
