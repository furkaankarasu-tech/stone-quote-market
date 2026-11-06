"use client";

import { useEffect, useState } from "react";

type ScriptAsset = { script: HTMLScriptElement; owned: boolean };
const readyChecks: Record<string, () => boolean> = {
  "/market/auth.bundle.js": () => Boolean((window as Window & { MarbleAuth?: unknown }).MarbleAuth),
  "/market/db.js": () => Boolean((window as Window & { MarbleDB?: unknown }).MarbleDB),
  "/market/logo.js": () => Boolean((window as Window & { MarbleLogo?: unknown }).MarbleLogo),
  "/market/catalog.js": () => Boolean((window as Window & { MarbleCatalog?: unknown }).MarbleCatalog),
  "/market/registration.js": () => Boolean((window as Window & { MarbleRegistration?: unknown }).MarbleRegistration),
};

function loadScript(src: string): Promise<ScriptAsset> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing?.dataset.marbleLoaded === "true" || readyChecks[src]?.()) {
      resolve({ script: existing ?? document.createElement("script"), owned: false });
      return;
    }
    const script = existing ?? document.createElement("script");
    const owned = !existing;
    let finished = false;
    let timeout: ReturnType<typeof setTimeout>;
    const cleanup = () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
      clearTimeout(timeout);
    };
    const onLoad = () => {
      if (finished) return;
      finished = true;
      script.dataset.marbleLoaded = "true";
      cleanup();
      resolve({ script, owned });
    };
    const onError = () => {
      if (finished) return;
      finished = true;
      cleanup();
      if (owned) script.remove();
      reject(new Error(`Script could not load: ${src}`));
    };
    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
    timeout = globalThis.setTimeout(onError, 10000);
    if (owned) {
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

export default function MarketplaceScripts() {
  useEffect(() => {
    let cancelled = false;
    const ownedScripts: HTMLScriptElement[] = [];
    const loaded = async (src: string) => {
      const result = await loadScript(src);
      if (result.owned) ownedScripts.push(result.script);
    };
    const errorMessage = () => {
      const lang = document.documentElement.lang || "tr";
      return lang.startsWith("en") ? "Account services could not load. Refresh the page and try again."
        : lang.startsWith("zh") ? "账户服务加载失败，请刷新页面重试。"
        : lang.startsWith("ar") ? "تعذر تحميل خدمة الحساب. يرجى تحديث الصفحة والمحاولة مجددًا."
        : "Hesap hizmetleri yüklenemedi. Sayfayı yenileyip tekrar deneyin.";
    };
    const handleError = (error: unknown) => {
      if (cancelled) return;
      console.error("Marble Borsa: account scripts failed", error);
      const toast = document.getElementById("toast");
      if (toast) {
        toast.textContent = errorMessage();
        toast.classList.add("show");
        toast.setAttribute("role", "alert");
      }
      // Stop the infinite 'checking session' state, but do not destroy a
      // previously verified user when a temporary connection fails.
      window.dispatchEvent(new CustomEvent("marble-auth", {
        detail: { user: (window as Window & { MarbleAuthUser?: unknown }).MarbleAuthUser ?? null },
      }));
    };

    const confirmSession = async () => {
      const runtime = window as Window & {
        MarbleAuth?: { client?: { auth?: {
          getSession?: () => Promise<{ data: { session: { user?: { email_confirmed_at?: string | null } } | null }; error: unknown }>;
          getUser?: () => Promise<{ data: { user: { email_confirmed_at?: string | null } | null }; error: unknown }>;
        } } };
      };
      const auth = runtime.MarbleAuth?.client?.auth;
      const timed = async <T,>(promise: Promise<T>, delay: number): Promise<T> => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        const deadline = new Promise<never>((_, reject) => {
          timer = globalThis.setTimeout(() => reject(new Error("Session check timed out")), delay);
        });
        try { return await Promise.race([promise, deadline]); }
        finally { if (timer) clearTimeout(timer); }
      };
      let sessionResolved = false;
      let initialUser = (window as Window & { MarbleAuthUser?: unknown }).MarbleAuthUser ?? null;
      if (auth?.getSession) {
        try {
          const { data, error } = await timed(auth.getSession(), 2200);
          if (!error) { sessionResolved = true; initialUser = data?.session?.user?.email_confirmed_at ? data.session.user : null; }
          // A missing cached session does not override an auth event that arrived first.
        } catch (error) {
          if (!cancelled) console.warn("Marble Borsa: cached session unavailable", error);
        }
      }
      if (cancelled) return;
      // Notify the UI promptly, even if the server-side user check is slow.
      if (sessionResolved || initialUser) window.dispatchEvent(new CustomEvent("marble-auth", { detail: { user: initialUser } }));
      if (auth?.getUser) {
        // An online validation runs in the background. A failure must not
        // falsely sign out a user whose Supabase session is being refreshed.
        void timed(auth.getUser(), 6500).then(({ data, error }) => {
          if (cancelled || error) return;
          // Check the current cached session to reject stale responses after sign-out.
          if (auth.getSession) {
            return auth.getSession().then(({ data: fresh }) => {
              if (cancelled) return;
              const cachedId = (fresh.session?.user as { id?: string } | undefined)?.id;
              const verifiedId = (data.user as { id?: string } | null)?.id;
              if (cachedId !== verifiedId) return;
              window.dispatchEvent(new CustomEvent("marble-auth", { detail: { user: data.user?.email_confirmed_at ? data.user : null } }));
            });
          }
          window.dispatchEvent(new CustomEvent("marble-auth", { detail: { user: data.user?.email_confirmed_at ? data.user : null } }));
        }).catch((error: unknown) => {
          if (!cancelled) console.warn("Marble Borsa: session validation delayed", error);
        });
      }
    };

    const run = async () => {
      // Render the visible catalogue first. Start account loading right away
      // instead of waiting an arbitrary 320ms after the page becomes interactive.
      for (const src of ["/market/app.js", "/market/live-ui.js", "/market/auth.bundle.js", "/market/db.js", "/market/logo.js", "/market/catalog.js", "/market/registration.js"]) {
        if (cancelled) return;
        await loaded(src);
      }
      if (cancelled) return;
      await confirmSession();
      if (!cancelled) window.dispatchEvent(new Event("marble-account-ready"));
    };
    void run().catch(handleError);
    return () => {
      cancelled = true;
      ownedScripts.forEach((script) => script.remove());
    };
  }, []);
  return null;
}



export function PasswordResetScripts() {
  useEffect(() => {
    let cancelled = false;
    const scripts: HTMLScriptElement[] = [];
    // The Auth client consumes and clears the recovery fragment during startup.
    (window as Window & { MarbleRecoveryHash?: string }).MarbleRecoveryHash = window.location.hash;
    async function load() {
      for (const src of ["/market/auth.bundle.js", "/market/password-reset.js"]) {
        if (cancelled) return;
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`Cannot load ${src}`));
          scripts.push(script);
          document.body.appendChild(script);
        });
      }
    }
    void load().catch(() => {
      const status = document.getElementById("mb-reset-status");
      if (status) status.textContent = ({tr:"Şifre yenileme ekranı yüklenemedi. Lütfen tekrar deneyin.",en:"Could not load password reset. Please retry.",zh:"无法加载密码重置页面，请重试。",ar:"تعذر تحميل إعادة تعيين كلمة المرور. حاول مجدداً."} as Record<string,string>)[location.pathname.split("/")[1]] || "Could not load password reset. Please retry.";
    });
    return () => {
      cancelled = true;
      scripts.forEach((script) => script.remove());
    };
  }, []);
  return null;
}


type VisitRow={id:string;company_name:string;total:number;unique_visitors:number;today:number;week:number;month:number;can_edit?:boolean};
const visitWords={
 tr:{title:'Firma profil ziyaretleri',total:'Toplam ziyaret',unique:'Tekil ziyaretçi',today:'Bugün',week:'Son 7 gün',month:'Son 30 gün',loading:'Ziyaret sayısı yükleniyor…',failed:'Ziyaret istatistikleri şu anda yüklenemiyor.',retry:'Tekrar dene',note:'Günlük ve dönemsel ölçümde aynı tarayıcı veya hesap günde bir kez sayılır. Tekil ziyaretçi sayısı yaklaşık değerdir. Oturum açıkken kendi ziyaretleriniz sayılmaz.',profile:'Firma profilini aç'},
 en:{title:'Company profile visits',total:'Total visits',unique:'Unique visitors',today:'Today',week:'Last 7 days',month:'Last 30 days',loading:'Loading visits…',failed:'Visit statistics are currently unavailable.',retry:'Retry',note:'Daily and period measurements count each browser or account once a day. Unique visitors are approximate. Your own signed-in visits are excluded.',profile:'Open company profile'},
 zh:{title:'企业资料访问',total:'总访问量',unique:'独立访客',today:'今天',week:'最近7天',month:'最近30天',loading:'正在加载访问量…',failed:'暂时无法加载访问统计。',retry:'重试',note:'仅统计启用测量后同意分析的访问。每个浏览器或账户每天计数一次，独立访客为近似值，不包括已登录的本人访问。',profile:'打开企业资料'},
 ar:{title:'زيارات ملف الشركة',total:'إجمالي الزيارات',unique:'زوار فريدون',today:'اليوم',week:'آخر 7 أيام',month:'آخر 30 يوماً',loading:'جار تحميل الزيارات…',failed:'إحصاءات الزيارات غير متاحة حالياً.',retry:'إعادة المحاولة',note:'تبدأ الإحصاءات عند تفعيل القياس وتشمل من وافق على التحليلات. يحتسب كل متصفح أو حساب مرة يومياً. عدد الزوار الفريدين تقريبي وتستبعد زياراتك أثناء تسجيل الدخول.',profile:'فتح ملف الشركة'}
};
type VisitsWindow=Window & {MarbleAuth?:{client?:{auth?:{getSession?:()=>Promise<{data:{session:{access_token:string}|null}}>}}}};
async function visitToken(){return (await (window as VisitsWindow).MarbleAuth?.client?.auth?.getSession?.())?.data.session?.access_token;}
export function CompanyVisits({companyId,locale='tr'}:{companyId?:string;locale?:string}){
 const w=visitWords[locale as keyof typeof visitWords]||visitWords.tr;
 const [rows,setRows]=useState<VisitRow[]|null>(null);
 const [failed,setFailed]=useState(false);
 const [attempt,setAttempt]=useState(0);
 const [saving,setSaving]=useState<string|null>(null);
 const [editStatus,setEditStatus]=useState('');
 const edit=({tr:{save:'Toplamı kaydet',reset:'Otomatik sayıya dön',saved:'Kaydedildi.',failed:'Kaydedilemedi. Toplam, ölçülen ziyaret sayısından küçük olamaz.'},en:{save:'Save total',reset:'Restore automatic count',saved:'Saved.',failed:'Could not save. Total cannot be below measured visits.'},zh:{save:'保存总数',reset:'恢复自动计数',saved:'已保存。',failed:'无法保存。总数不能低于实际测量的访问量。'},ar:{save:'حفظ الإجمالي',reset:'استعادة العدد التلقائي',saved:'تم الحفظ.',failed:'تعذر الحفظ. لا يمكن أن يقل الإجمالي عن الزيارات المقاسة.'}} as Record<string,{save:string;reset:string;saved:string;failed:string}>)[locale]||{save:'Save total',reset:'Restore automatic count',saved:'Saved.',failed:'Could not save.'};
 const saveTotal=async(id:string,total:number|null)=>{
  if(saving)return;setSaving(id);setEditStatus('');
  try{const token=await visitToken();if(!token)throw new Error('session');const res=await fetch('/api/admin/members',{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({action:'set_visit_total',company:id,total})});if(!res.ok)throw new Error('save');setEditStatus(edit.saved);setAttempt(n=>n+1);}catch{setEditStatus(edit.failed);}finally{setSaving(null);}
 };
 useEffect(()=>{
  let alive=true;let generation=0;let timer:ReturnType<typeof setTimeout>;
  const endpoint='/api/admin/members';
  const load=async()=>{
   if(companyId)return;
   const current=++generation;
   try{
    const token=await visitToken();
    if(!companyId&&!token){if(alive)setRows(null);return;}
    const res=await fetch(companyId?`${endpoint}?company=${encodeURIComponent(companyId)}`:endpoint,{headers:token?{Authorization:`Bearer ${token}`}:{},cache:'no-store'});
    if(!res.ok)throw new Error('unavailable');const data=await res.json();
    if(alive&&current===generation){setFailed(false);setRows(Array.isArray(data)?data:[]);}
   }catch{if(alive&&current===generation)setFailed(true);}
  };
  const record=async()=>{
   if(!companyId||document.visibilityState!=='visible')return;
   try{
    if(localStorage.getItem('mb-cookie-preference-v1')!=='analytics')return;
    let visitor=localStorage.getItem('mb-profile-visitor-v1');
    if(!visitor){visitor=crypto.randomUUID();localStorage.setItem('mb-profile-visitor-v1',visitor);}
    const token=await visitToken();
    if(localStorage.getItem('mb-cookie-preference-v1')!=='analytics'||document.visibilityState!=='visible'||!alive)return;
    const res=await fetch(endpoint,{method:'PUT',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify({company:companyId,visitor,consent:true})});
    if(res.ok)await load();
   }catch{/* Measurement failure must never block a public profile. */}
  };
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(()=>{void record();},4000);};
  const account=()=>{if(!companyId)setRows(null);void load();schedule();};
  void load();
  if(companyId){void loadScript('/market/auth.bundle.js').then(account).catch(schedule);schedule();}
  window.addEventListener('marble-account-ready',account);
  window.addEventListener('marble-auth',account);
  window.addEventListener('mb-consent-change',schedule);
  document.addEventListener('visibilitychange',schedule);
  return()=>{alive=false;clearTimeout(timer);window.removeEventListener('marble-account-ready',account);window.removeEventListener('marble-auth',account);window.removeEventListener('mb-consent-change',schedule);document.removeEventListener('visibilitychange',schedule);};
 },[companyId,attempt]);
 if(companyId)return null;
 if(!rows?.length&&!failed)return null;
 return <section className="company-visit-dashboard" aria-label={w.title}><h2>{w.title}</h2>{failed?<p role="status">{w.failed} <button type="button" onClick={()=>setAttempt(n=>n+1)}>{w.retry}</button></p>:rows?.map(row=><article key={row.id}><h3>{row.company_name}</h3><dl>{(['today','week','month','total','unique'] as const).map(key=><div key={key}><dt>{w[key]}</dt><dd>{Number(key==='unique'?row.unique_visitors:row[key]).toLocaleString(locale)}</dd></div>)}</dl>{row.can_edit&&<form className="company-visit-editor" onSubmit={event=>{event.preventDefault();const value=Number(new FormData(event.currentTarget).get("total"));void saveTotal(row.id,value);}}><label>{w.total}<input key={row.total} name="total" type="number" min="0" max="1000000000" step="1" defaultValue={row.total} required disabled={saving!==null}/></label><button type="submit" disabled={saving!==null}>{edit.save}</button><button type="button" disabled={saving!==null} onClick={()=>void saveTotal(row.id,null)}>{edit.reset}</button></form>}<a href={`/${locale}/firmalar/${row.id}`}>{w.profile} ↗</a></article>)}<p role="status">{editStatus}</p><p className="company-visit-note">{w.note}</p></section>;
}
