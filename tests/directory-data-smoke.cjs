const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const calls = [];
const events = [];
const window = {
  MarbleAuth: {client: {rpc: async name => {
    calls.push(name);
    return {data: [
      {name: 'Makine AŞ', city: 'Afyon', activity_type: 'machine', section: 'machines', tax_no: 'private'},
      {name: 'Lojistik Ltd', city: 'İzmir', activity_type: 'logistics', section: 'services'},
      {name: 'Yanlış kayıt', section: 'other'}
    ], error: null};
  }}},
  dispatchEvent: event => events.push(event.type)
};
const document = {getElementById: id => id === 'categoryCompanies' ? {} : null};
const context = vm.createContext({window, document, Event: class {constructor(type){this.type=type}},
  console, clearTimeout, setTimeout, Date});
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'public/market/db.js'), 'utf8'), context);

setImmediate(() => {
  assert.deepEqual(calls, ['mb_list_directory_companies']);
  assert.equal(window.MarbleDirectoryState.status, 'ready');
  assert.equal(window.MarbleDirectoryState.companies.length, 2);
  assert.equal(window.MarbleDirectoryState.companies[0].name, 'Makine AŞ');
  assert.equal(window.MarbleDirectoryState.companies[0].tax_no, undefined);
  assert.deepEqual(events, ['marble-db']);
  console.log('Directory data smoke check passed: RPC loading and public field selection.');
});
