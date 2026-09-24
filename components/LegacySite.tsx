"use client";
import { useEffect } from "react";

type Panel = "stones"|"firms"|"requests"|"supplies"|"services";
const routeByPanel: Record<Panel,string> = {
  stones:"dogal-tas", firms:"firmalar", requests:"alim-talepleri", supplies:"makine-sarf", services:"hizmetler"
};
const panelByRoute: Record<string,Panel> = Object.fromEntries(Object.entries(routeByPanel).map(([k,v])=>[v,k])) as Record<string,Panel>;

export default function LegacySite({html, locale="tr", initialPanel="stones"}:{html:string;locale?:string;initialPanel?:Panel}){
 useEffect(()=>{
   let cancelled=false;
   const activate=(panel:Panel)=>{
     document.querySelectorAll<HTMLElement>("[data-market-tab]").forEach(btn=>{
       btn.classList.toggle("active",btn.getAttribute("data-market-tab")===`panel-${panel}`);
     });
     document.querySelectorAll<HTMLElement>(".sqm-panel").forEach(el=>{
       el.classList.toggle("active",el.id===`panel-${panel}`);
     });
   };
   const topMap:Record<string,Panel>={"#directory":"stones","#suppliers":"firms","#requests":"requests","#supplies":"supplies","#services":"services"};
   const clickHandler=(e:MouseEvent)=>{
     const target=e.target as HTMLElement;

     // Sidebar tabs are buttons in the legacy UI. They must perform a REAL
     // Next route navigation. pushState previously changed only the address
     // bar while leaving the old page DOM mounted, which looked like a cache
     // problem until Ctrl+Shift+R forced a document reload.
     const side=target.closest("[data-market-tab]") as HTMLElement|null;
     if(side){
       const raw=(side.getAttribute("data-market-tab")||"").replace("panel-","") as Panel;
       if(routeByPanel[raw]){
         e.preventDefault();
         window.location.assign(`/${locale}/${routeByPanel[raw]}`);
       }
       return;
     }

     const a=target.closest("a") as HTMLAnchorElement|null;
     if(a){
       const href=a.getAttribute("href")||"";
       if(!href || href.startsWith("#") || href.includes("?")) return;

       // Real hrefs such as /tr/dogal-tas/afyon-white and /tr/firmalar/...
       // are intentionally NOT intercepted. The browser/Next loads the new
       // route document, so route-specific server HTML is never stale.
       if(href.startsWith("/")) return;

       const explicit=a.getAttribute("data-mb-panel") as Panel|null;
       const panel=explicit || topMap[href] || panelByRoute[href.split("/").filter(Boolean).pop()||""];
       if(panel){
         e.preventDefault();
         window.location.assign(`/${locale}/${routeByPanel[panel]}`);
       }
     }
   };
   const popHandler=()=>window.location.reload();
   document.addEventListener("click",clickHandler,true);
   window.addEventListener("popstate",popHandler);
   (async()=>{
     const items=await fetch('/legacy/scripts.json?v=15.22.0',{cache:'no-store'}).then(r=>r.json());
     for(const it of items){
       if(cancelled)break;
       await new Promise<void>((resolve)=>{
         const s=document.createElement('script');
         if(it.src){s.src=it.src;s.onload=()=>resolve();s.onerror=()=>resolve();}
         else{s.text=it.code||'';}
         document.body.appendChild(s);
         if(!it.src) resolve();
       });
     }
     setTimeout(()=>activate(initialPanel),25);
   })();
   return()=>{cancelled=true;document.removeEventListener("click",clickHandler,true);window.removeEventListener("popstate",popHandler)};
 },[initialPanel,locale]);
 return <div dangerouslySetInnerHTML={{__html:html}}/>;
}
