const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync('lib/seo.ts','utf8');
const compiled = ts.transpileModule(source,{fileName:'lib/seo.ts', compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}});
for (const row of [
  {env:'preview',allow:'true',want:false},
  {env:'development',allow:'true',want:false},
  {env:'production',allow:'true',want:true},
  {env:'production',allow:'false',want:false}
]) {
  const module={exports:{}};
  const context=vm.createContext({module,exports:module.exports,process:{env:{VERCEL_ENV:row.env,NEXT_PUBLIC_ALLOW_INDEXING:row.allow,NEXT_PUBLIC_SITE_URL:'https://www.marbleborsa.com'}},URL});
  vm.runInContext(compiled.outputText,context,{filename:'lib/seo.ts'});
  assert.equal(module.exports.allowIndexing(),row.want, `${row.env} ${row.allow}`);
  if(row.env==='production' && row.allow==='true'){
    assert.match(module.exports.absoluteUrl('/'), /^https:\/\/www\.marbleborsa\.com\/$/);
    assert.equal(module.exports.buildMetadata({title:'Test',description:'Test',path:'/'}).robots.index,true);
  }
}
console.log('SEO indexing smoke passed: previews stay noindex; enabled production is indexable on custom domain.');
