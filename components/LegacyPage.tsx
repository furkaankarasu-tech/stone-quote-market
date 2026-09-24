import fs from "node:fs";
import path from "node:path";
import LegacySite from "./LegacySite";

type Panel="stones"|"firms"|"requests"|"supplies"|"services";
const IDS:Record<Panel,string>={
 stones:"panel-stones",firms:"panel-firms",requests:"panel-requests",
 supplies:"panel-supplies",services:"panel-services"
};

function byId(html:string,tag:string,id:string){
 const at=html.indexOf(`id="${id}"`); if(at<0)return "";
 const rx=new RegExp(`<\\/?${tag}\\b[^>]*>`,"gi"), stack:number[]=[];
 let m:RegExpExecArray|null;
 while((m=rx.exec(html))&&m.index<=at){
   if(m[0].startsWith("</"))stack.pop(); else stack.push(m.index);
 }
 const start=stack.at(-1); if(start===undefined)return "";
 rx.lastIndex=start; let depth=0;
 while((m=rx.exec(html))){
   depth+=m[0].startsWith("</")?-1:1;
   if(depth===0)return html.slice(start,rx.lastIndex);
 }
 return "";
}
function firstTag(html:string,tag:string){
 const open=new RegExp(`<${tag}\\b[^>]*>`,"i").exec(html); if(!open)return "";
 const rx=new RegExp(`<\\/?${tag}\\b[^>]*>`,"gi"); rx.lastIndex=open.index;
 let m:RegExpExecArray|null,depth=0;
 while((m=rx.exec(html))){
   depth+=m[0].startsWith("</")?-1:1;
   if(depth===0)return html.slice(open.index,rx.lastIndex);
 }
 return "";
}
function byClass(html:string,tag:string,cls:string){
 const rx=new RegExp(`<${tag}\\b[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>`,"i");
 const m=rx.exec(html); if(!m)return "";
 const tail=html.slice(m.index);
 const nested=new RegExp(`<\\/?${tag}\\b[^>]*>`,"gi");
 let x:RegExpExecArray|null,depth=0;
 while((x=nested.exec(tail))){
   depth+=x[0].startsWith("</")?-1:1;
   if(depth===0)return tail.slice(0,nested.lastIndex);
 }
 return "";
}

function routeDocument(full:string,panel:Panel){
 // Build a fresh VALID route document instead of deleting chunks from the old
 // homepage. This prevents the browser's HTML parser from re-parenting the
 // catalogue above the header when legacy markup has unmatched wrappers.
 const top=byClass(full,"div","top");
 const header=firstTag(full,"header");
 const sidebar=byClass(full,"aside","sqm-sidebar");
 const rightbar=byClass(full,"aside","sqm-rightbar");
 const toolbar=byClass(full,"div","sqm-toolbar");
 const selected=byId(full,"div",IDS[panel]);
 const footer=firstTag(full,"footer");
 const modalIds=[
   "authModal","catalogModal","productModal","profileModal","productDetailModal",
   "termsModal","privacyModal","kvkkModal","cookieModal","commercialModal","contactLeadModal"
 ];
 const modals=modalIds.map(id=>byId(full,"div",id)).filter(Boolean).join("\n");

 if(!header||!selected)throw new Error(`Route shell missing for ${panel}`);

 return [
   top,
   header,
   `<section class="sqm-market mb-route-market" id="marketArea">`,
   sidebar,
   `<div class="sqm-content">`,
   toolbar,
   selected,
   `</div>`,
   rightbar,
   `</section>`,
   footer,
   modals
 ].join("\n");
}

export default function LegacyPage({locale="tr",panel="stones"}:{locale?:string;panel?:Panel}){
 const full=fs.readFileSync(path.join(process.cwd(),"public","legacy","body.html"),"utf8");
 return <LegacySite html={routeDocument(full,panel)} locale={locale} initialPanel={panel}/>;
}
