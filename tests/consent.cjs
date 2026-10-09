const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('node:assert/strict');
const source=ts.transpileModule(fs.readFileSync('components/SitePreferences.tsx','utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
function harness(id, saved, path='/'){
 let slots=[],cursor=0,effects=[],dirty=false,tree;const storage=new Map(saved?[['mb-cookie-preference-v1',saved]]:[]),scripts=[],listeners={};
 const window={addEventListener:(n,f)=>listeners[n]=f,removeEventListener:(n)=>delete listeners[n]};
 const document={documentElement:{lang:'tr'},querySelector:()=>null,cookie:'',title:'Marble Borsa',getElementById:id=>scripts.find(s=>s.id===id),head:{appendChild:s=>scripts.push(s)},createElement:()=>({})};
 const location={origin:'https://www.marbleborsa.com',hostname:'www.marbleborsa.com',pathname:path,search:'?token=SECRET',hash:'#private'};
 const react={useState:init=>{const i=cursor++;if(!(i in slots))slots[i]=init;return[slots[i],value=>{if(slots[i]!==value){slots[i]=value;dirty=true}}]},useRef:init=>{const i=cursor++;return slots[i]||(slots[i]={current:init})},useEffect:(fn,deps)=>{const i=cursor++,prev=slots[i];if(!prev||deps.some((d,j)=>d!==prev.deps[j])){effects.push(()=>{prev?.cleanup?.();slots[i]={deps,cleanup:fn()}})}}};
 const sandbox={exports:{},require:n=>n==='react'?react:{jsx:(t,p)=>({type:t,props:p}),jsxs:(t,p)=>({type:t,props:p}),Fragment:'fragment'},window,document,location,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},MutationObserver:class{observe(){}disconnect(){}}};vm.runInNewContext(source,sandbox);
 function render(){let i=0;do{dirty=false;cursor=0;effects=[];tree=sandbox.exports.default({measurementId:id,enabled:true});effects.forEach(f=>f());if(++i>12)throw Error('render loop')}while(dirty)}
 function nodes(n,out=[]){if(n&&typeof n==='object'){out.push(n);for(const c of [n.props?.children].flat(Infinity))nodes(c,out)}return out}
 function click(text){const button=nodes(tree).find(n=>n.type==='button'&&n.props.children===text);assert.ok(button,text);button.props.onClick({currentTarget:{focus(){}}});render()}
 render();return{scripts,storage,window,location,click,render,nodes:()=>nodes(tree)};
}
let h=harness('G-ABC123');assert.equal(h.scripts.length,0);h.click('Yalnızca zorunlu');assert.equal(h.scripts.length,0);assert.equal(h.storage.get('mb-cookie-preference-v1'),'necessary');h.click('Çerez tercihleri');h.click('Analitiğe izin ver');assert.equal(h.scripts.length,1);assert.equal(h.window['ga-disable-G-ABC123'],false);const events=h.window.dataLayer.filter(a=>a[0]==='event');assert.equal(events.length,1);assert.equal(events[0][2].page_location,'https://www.marbleborsa.com/');assert.ok(!JSON.stringify(h.window.dataLayer).includes('SECRET'));h.click('Çerez tercihleri');h.click('Yalnızca zorunlu');assert.equal(h.window['ga-disable-G-ABC123'],true);assert.equal(h.storage.get('mb-cookie-preference-v1'),'necessary');
h=harness('','analytics');assert.equal(h.scripts.length,0);h.click('Çerez tercihleri');assert.ok(!h.nodes().some(n=>n.props?.children==='Analitiğe izin ver'));
h=harness('G-ABC123','analytics','/tr/sifre-sifirla');assert.equal(h.scripts.length,0);assert.equal(h.window['ga-disable-G-ABC123'],true);
console.log('Consent checks passed: no tracking before consent, rejection, opt-in, revocation, missing ID and private route; query tokens excluded.');
