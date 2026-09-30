const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const calls = [];
const events = [];
const logoPath = '123e4567-e89b-12d3-a456-426614174000/logo-1790800000000-123e4567-e89b-12d3-a456-426614174001.png';
const catalogueBase = '123e4567-e89b-12d3-a456-426614174000/123e4567-e89b-12d3-a456-426614174002';
const window = {
  MarbleAuth: {client: {storage: {from: bucket => {
    assert(['mb-company-logos', 'mb-catalog-assets'].includes(bucket));
    return {getPublicUrl: file => ({data: {publicUrl: `https://example.supabase.co/storage/v1/object/public/${bucket}/${file}`}})};
  }}, rpc: async name => {
    calls.push(name);
    if(name === 'mb_list_catalog_items')return {data:[{
      id:'123e4567-e89b-12d3-a456-426614174002',company_id:'123e4567-e89b-12d3-a456-426614174003',
      title:'Elmas Tel',category:'machine',description:'Ocak için kesim ekipmanı',
      image_paths:[1,2,3].map((_,i)=>`${catalogueBase}/photo-123e4567-e89b-12d3-a456-42661417400${i}.png`),
      tax_no:'private'
    }],error:null};
    return {data: [
      {company_id:'123e4567-e89b-12d3-a456-426614174003',name: 'Taş Satıcısı AŞ', city: 'Afyon', activity_type: 'quarry', section: 'companies', logo_path: logoPath, tax_no: 'private'},
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
  assert.deepEqual(calls, ['mb_list_directory_companies', 'mb_list_catalog_items']);
  assert.equal(window.MarbleDirectoryState.status, 'ready');
  assert.equal(window.MarbleDirectoryState.companies.length, 3);
  assert.equal(window.MarbleDirectoryState.companies[0].name, 'Taş Satıcısı AŞ');
  assert.equal(window.MarbleDirectoryState.companies[0].tax_no, undefined);
  assert.match(window.MarbleDirectoryState.companies[0].logo_url, /mb-company-logos\/123e4567/);
  assert.equal(window.MarbleDB.logoUrl('https://attacker.example/image.png'), '');
  assert.equal(window.MarbleCatalogState.items.length, 1);
  assert.match(window.MarbleCatalogState.items[0].image_urls[0], /mb-catalog-assets/);
  assert.equal(window.MarbleCatalogState.items[0].tax_no, undefined);
  assert.equal(window.MarbleDB.catalogAssetUrl('javascript:alert(1)'), '');
  assert.deepEqual(events, ['marble-db']);
  console.log('Directory data smoke check passed: RPC loading and public field selection.');
});
