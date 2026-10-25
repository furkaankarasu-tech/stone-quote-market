"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { marketPath, type MarketTab } from "@/lib/guideRoutes";
import GuideLanguagePicker from "./GuideLanguagePicker";

type AuthUser = { email_confirmed_at?: string | null } | null;
type MarbleAuthClient = {
  client?: { auth?: {
    getUser?: () => Promise<{ data: { user: AuthUser }, error: unknown }>;
    getSession?: () => Promise<{ data: { session: { user: AuthUser } | null }, error: unknown }>;
  } };
  signOut?: () => Promise<{ error: unknown }>;
};
type MarbleAuthWindow = Window & { MarbleAuth?: MarbleAuthClient; MarbleAuthUser?: AuthUser };
type Language = "tr" | "en" | "zh" | "ar";

const words = {
  tr: { profile: "Profil", login: "Giriş Yap", signup: "Üye Ol", logout: "Çıkış Yap", checking: "Hesap kontrol ediliyor", failed: "Çıkış yapılamadı. Yeniden deneyin." },
  en: { profile: "Profile", login: "Sign in", signup: "Join", logout: "Sign out", checking: "Checking account", failed: "Could not sign out. Try again." },
  zh: { profile: "个人资料", login: "登录", signup: "注册", logout: "退出登录", checking: "正在验证账户", failed: "退出失败，请重试。" },
  ar: { profile: "الملف الشخصي", login: "تسجيل الدخول", signup: "إنشاء حساب", logout: "تسجيل الخروج", checking: "جار فحص الحساب", failed: "تعذر تسجيل الخروج. حاول مرة أخرى." }
} as const;

/** Match account actions on guide/detail pages with the marketplace header. */
function DetailAuthActions({ language }: { language: Language }) {
  const [status, setStatus] = useState<"checking" | "guest" | "signed-in">("checking");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const t = words[language];
  const suffix = language === "tr" ? "" : `&lang=${language}`;

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const runtime = window as MarbleAuthWindow;
    const onAuthEvent = (event: Event) => {
      if (cancelled) return;
      const detail = (event as CustomEvent<{ user?: AuthUser }>).detail;
      const user = detail?.user ?? null;
      runtime.MarbleAuthUser = user;
      setStatus(user?.email_confirmed_at ? "signed-in" : "guest");
    };
    window.addEventListener("marble-auth", onAuthEvent);

    async function checkSession() {
      const auth = runtime.MarbleAuth?.client?.auth;
      const getUser = auth?.getUser;
      if (!getUser) { if (!cancelled) setStatus("guest"); return; }
      // Show a confirmed local session immediately instead of leaving the
      // guide header in a checking state while Supabase responds.
      if (auth?.getSession) {
        try {
          let early: ReturnType<typeof setTimeout> | undefined;
          const quick = new Promise<never>((_, reject) => {
            early = globalThis.setTimeout(() => reject(new Error("Cached session delayed")), 2000);
          });
          let cached: Awaited<ReturnType<NonNullable<typeof auth.getSession>>>;
          try { cached = await Promise.race([auth.getSession(), quick]); }
          finally { if (early) clearTimeout(early); }
          const user = cached.data.session?.user;
          if (!cancelled && !cached.error && user?.email_confirmed_at) {
            runtime.MarbleAuthUser = user;
            setStatus("signed-in");
          }
        } catch { /* Continue with the authoritative online check below. */ }
      }
      try {
        const operation = getUser.call(auth);
        let limit: ReturnType<typeof setTimeout> | undefined;
        const timeoutPromise = new Promise<never>((_, reject) => {
          limit = globalThis.setTimeout(() => reject(new Error("Session check timeout")), 6500);
        });
        let response: Awaited<typeof operation>;
        try { response = await Promise.race([operation, timeoutPromise]); }
        finally { if (limit) clearTimeout(limit); }
        if (cancelled) return;
        if (response.error) throw response.error;
        runtime.MarbleAuthUser = response.data.user?.email_confirmed_at ? response.data.user : null;
        setStatus(runtime.MarbleAuthUser ? "signed-in" : "guest");
      } catch {
        if (!cancelled) setStatus(runtime.MarbleAuthUser?.email_confirmed_at ? "signed-in" : "guest");
      }
    }

    if (runtime.MarbleAuth) {
      void checkSession();
    } else {
      const existing = document.querySelector<HTMLScriptElement>('script[src="/market/auth.bundle.js"]');
      const script = existing ?? document.createElement("script");
      const onLoad = () => { if (!cancelled) void checkSession(); };
      const onFailure = () => { if (!cancelled) setStatus("guest"); };
      script.addEventListener("load", onLoad, { once: true });
      script.addEventListener("error", onFailure, { once: true });
      if (!existing) {
        script.src = "/market/auth.bundle.js";
        script.async = true;
        document.body.appendChild(script);
      }
      // A previous route may have completed the shared script while we attached.
      if (runtime.MarbleAuth) void checkSession();
      timeout = setTimeout(() => { if (!cancelled && !runtime.MarbleAuth) setStatus("guest"); }, 10000);
    }
    const recheck = () => { if (!document.hidden) void checkSession(); };
    document.addEventListener("visibilitychange", recheck);
    window.addEventListener("pageshow", recheck);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      window.removeEventListener("marble-auth", onAuthEvent);
      document.removeEventListener("visibilitychange", recheck);
      window.removeEventListener("pageshow", recheck);
    };
  }, []);

  async function signOut() {
    if (working) return;
    setWorking(true);
    setError("");
    try {
      const result = await (window as MarbleAuthWindow).MarbleAuth?.signOut?.();
      if (!result || result.error) throw result?.error ?? new Error("Auth module unavailable");
      (window as MarbleAuthWindow).MarbleAuthUser = null;
      window.dispatchEvent(new CustomEvent("marble-auth", { detail: { user: null } }));
      setStatus("guest");
    } catch {
      setError(t.failed);
    } finally {
      setWorking(false);
    }
  }

  if (status === "checking") return <span className="detail-account-checking" role="status" aria-label={t.checking} aria-busy="true"></span>;
  return <>
    {status === "signed-in" ? <>
      <a className="detail-auth-link" href={`/${language}/profil`}>{t.profile}</a>
      <button type="button" className="detail-auth-link detail-signout" onClick={signOut} disabled={working}>{t.logout}</button>
    </> : <>
      <a className="detail-auth-link" href={`/${language}/profil?auth=login${suffix}`}>{t.login}</a>
      <a className="detail-auth-link detail-auth-primary" href={`/${language}/profil?auth=signup${suffix}`}>{t.signup}</a>
    </>}
    {error && <span role="alert" className="detail-auth-error">{error}</span>}
  </>;
}

const menuWords = {
 tr:["Ana Sayfa","Doğal Taş","Firmalar","Makine & Sarf","Hizmetler","Alım Talepleri","Mermer Rehberi"],
 en:["Home","Natural Stone","Companies","Machinery & Supplies","Services","Buying Requests","Buyer Guides"],
 zh:["首页","天然石材","企业","机械与耗材","服务","采购需求","石材指南"],
 ar:["الرئيسية","الحجر الطبيعي","الشركات","المعدات واللوازم","الخدمات","طلبات الشراء","دليل الرخام"]
};
export function SocialLinks(){
 return <div className="header-social" role="group" aria-label="Marble Borsa social media">
  <a href="https://www.instagram.com/marbleborsa/" target="_blank" rel="noopener noreferrer" aria-label="Instagram · Marble Borsa" title="Instagram · @marbleborsa"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
  <a href={/^https:\/\/(www\.)?linkedin\.com\/(?:company|in)\//.test(process.env.NEXT_PUBLIC_LINKEDIN_URL||'')?process.env.NEXT_PUBLIC_LINKEDIN_URL:'https://www.linkedin.com/in/marble-borsa/'} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn · Marble Borsa" title="LinkedIn · Marble Borsa"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.45 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.31h.04c.39-.74 1.36-1.53 2.79-1.53 2.98 0 3.58 1.96 3.58 4.51v5.26Z"/></svg></a>
 </div>;
}

export default function Header() {
 const pathname=usePathname()||"/";
 const language:Language = pathname.startsWith('/en')?'en':pathname.startsWith('/zh')?'zh':pathname.startsWith('/ar')?'ar':'tr';
 const marketplace = /^\/(?:tr|en|zh|ar)?(?:\/(?:dogal-tas|firmalar|makine-sarf|hizmetler|profil|alim-talepleri|natural-stone|companies|machinery-supplies|services|buying-requests))?\/?$/.test(pathname);
 const t=menuWords[language];
 const paths=[marketPath(language),...(['stones','companies','machines','services','requests'] as MarketTab[]).map(tab=>marketPath(language,tab)),language==='tr'?'/tr/rehber':`/${language}/guide`];
 const tabs=['home','stones','companies','machines','services','requests'];
 return <><div className="info-strip"><span id="stripText">{({tr:"Doğal taş tedarik platformu",en:"Natural stone sourcing platform",zh:"天然石材采购平台",ar:"منصة توريد الحجر الطبيعي"})[language]}</span></div>
 <header className="site-header">
  <a className="brand" href={marketPath(language)} aria-label="Marble Borsa"><span className="brand-symbol" aria-hidden="true"><img src="/icon.png?v=mb" width="43" height="43" alt=""/></span><span>Marble <span>Borsa</span><small>{({tr:"DOĞAL TAŞ PAZARI",en:"NATURAL STONE MARKETPLACE",zh:"天然石材交易平台",ar:"سوق الحجر الطبيعي"})[language]}</small></span></a>
  <nav id={marketplace?'topNav':undefined} aria-label={({tr:"Ana gezinme",en:"Main navigation",zh:"主导航",ar:"التنقل الرئيسي"})[language]} dangerouslySetInnerHTML={{__html:paths.map((path,i)=>`<a href="${path}"${marketplace&&i<6?` data-tab="${tabs[i]}"`:""}${pathname===path?' aria-current="page"':""}>${t[i]}</a>`).join("")}}/>
  <div className="header-actions"><SocialLinks/>
   {marketplace?<><label className="language"><span className="sr-only" id="langLabel">{({tr:"Dil seçimi",en:"Choose language",zh:"选择语言",ar:"اختيار اللغة"})[language]}</span><span aria-hidden="true">◎</span><select id="language" aria-labelledby="langLabel" defaultValue={language}><option value="tr">TR · Türkçe</option><option value="en">EN · English</option><option value="zh">中文 · 简体</option><option value="ar">العربية</option></select></label><button id="accountButton" className="button outline" type="button" disabled aria-busy="true" aria-label={words[language].checking}/><button id="signupButton" className="button dark" type="button" hidden/><button id="logoutButton" className="button outline header-logout" type="button" hidden/></>:<><GuideLanguagePicker locale={language}/><DetailAuthActions language={language}/></>}
  </div>
 </header></>;
}


const template = "Taş / ürün adı: [ad]\nÜrün formu: [blok / plaka / ebatlı]\nÖlçüler ve kalınlık: [bilgi]\nYüzey işlemi: [bilgi]\nMevcut parti / miktar: [bilgi]\nÜretim veya teslim süresi: [bilgi]\nFotoğraflar: [mevcut parti / temsili ürün]\nGüncel bulunurluk ve sevkiyat koşulları teklif aşamasında teyit edilir.";
const checks = ["Firma adı ve iletişim bilgileri doğru.", "E-posta, firma onayı ve üyelik durumunu kontrol ettim.", "Logo okunaklı; rehber görünürlüğü açık.", "Fotoğraflar net ve ürünü doğru temsil ediyor.", "Ölçü, kalınlık ve yüzey bilgilerini yazdım.", "Katalog kaydının yayın durumunu kontrol ettim."];

export function CompanyGuideTools() {
  const [selected, setSelected] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const reveal = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const node = document.getElementById(id);
      if (node instanceof HTMLDetailsElement) { node.open = true; node.scrollIntoView({ block: "start" }); }
    };
    reveal(); window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);
  async function copy() {
    try { await navigator.clipboard.writeText(template); setMessage("Şablon kopyalandı. Köşeli parantezleri kendi bilgilerinizle değiştirin."); }
    catch { setMessage("Otomatik kopyalama kullanılamadı. Şablon metnini seçip kopyalayabilirsiniz."); }
  }
  return <section className="cg-section cg-tools" aria-label="Katalog hazırlama araçları">
    <div className="cg-template"><span className="cg-eyebrow">HAZIR AÇIKLAMA ŞABLONU</span><h2>Doğru bilgilerle başlayın.</h2><p>Şablonu kopyalayın, yalnızca doğrulayabildiğiniz bilgileri ekleyin.</p><pre tabIndex={0}>{template}</pre><button type="button" className="cg-primary" onClick={copy}>Açıklama şablonunu kopyala</button><p role="status" aria-live="polite">{message}</p></div>
    <div className="cg-checklist"><span className="cg-eyebrow">YAYIN ÖNCESİ KONTROL</span><h2>Son bir göz atın.</h2><p>Bu liste size yardımcı olur; hesap onayı veya teknik yayın kontrolü yerine geçmez.</p><div className="cg-progress" role="progressbar" aria-label="Tamamlanan kontrol maddeleri" aria-valuenow={selected.length} aria-valuemin={0} aria-valuemax={checks.length}><span style={{width:`${selected.length / checks.length * 100}%`}}/></div><p aria-live="polite">{selected.length} / {checks.length} madde kontrol edildi</p>{checks.map((text,index)=><label key={text}><input type="checkbox" checked={selected.includes(index)} onChange={()=>setSelected(current=>current.includes(index)?current.filter(i=>i!==index):[...current,index])}/><span>{text}</span></label>)}<button className="cg-reset" type="button" onClick={()=>setSelected([])}>İşaretleri temizle</button></div>
  </section>;
}

/** Guest preparation never submits a marketplace request or sends email automatically. */
export function QuotePreparationTools({locale='tr',mode='quote'}:{locale?:string;mode?:'quote'|'compare'}){
 const labels={
 tr:{title:'Üye olmadan talep taslağı hazırlayın',intro:'İhtiyacınızı düzenleyip e-posta taslağı açabilirsiniz. Bu işlem platformda alım talebi oluşturmaz; firmalardan panel üzerinden teklif almak için alıcı hesabı gerekir.',material:'Taş / ürün ve format',quantity:'Miktar',unit:'Birim',destination:'Teslim yeri',notes:'Ölçü, kalınlık, yüzey ve hedef tarih',prepare:'Taslağı hazırla',email:'E-posta taslağını aç',account:'Alıcı hesabıyla talep oluştur',compare:'Teklif karşılaştırma hesabı',compareIntro:'Firmalardan aldığınız değerleri girin. Bu araç piyasa fiyatı veya platform teklifi üretmez; vergi, uygulama ve ek işçilik dahil değilse ayrıca değerlendirin.',price:'Birim fiyat',extra:'Nakliye + paketleme',offer:'Teklif',total:'Hesaplanan toplam',currency:'Para birimi',missing:'Birim fiyat girin',subject:'Marble Borsa · Tedarik ihtiyacı'},
 en:{title:'Prepare an enquiry without an account',intro:'Organise your requirements and open an email draft. This does not create a marketplace buying request; a buyer account is required for supplier quotes in your workspace.',material:'Stone / product and format',quantity:'Quantity',unit:'Unit',destination:'Delivery location',notes:'Dimensions, thickness, finish and target date',prepare:'Prepare draft',email:'Open email draft',account:'Create a request with a buyer account',compare:'Compare quotation totals',compareIntro:'Enter figures from your supplier quotations. This tool does not generate market prices or platform offers. Check taxes, installation and other work separately where excluded.',price:'Unit price',extra:'Freight + packing',offer:'Offer',total:'Calculated total',currency:'Currency',missing:'Enter a unit price',subject:'Marble Borsa · Sourcing enquiry'},
 zh:{title:'无需账户准备询价草稿',intro:'整理需求后可打开邮件草稿。这不会创建平台采购需求；如需在个人资料中接收供应商报价，须使用买家账户。',material:'石材／产品及形式',quantity:'数量',unit:'单位',destination:'交货地点',notes:'尺寸、厚度、表面和目标日期',prepare:'准备草稿',email:'打开邮件草稿',account:'通过买家账户创建需求',compare:'比较报价总额',compareIntro:'请输入供应商实际报价。此工具不生成市场价格或平台报价；未含税费、安装及其他加工应另行核算。',price:'单价',extra:'运费及包装',offer:'报价',total:'计算总额',currency:'币种',missing:'请输入单价',subject:'Marble Borsa · 采购咨询'},
 ar:{title:'جهّز مسودة استفسار دون حساب',intro:'نظّم احتياجاتك وافتح مسودة بريد. لا ينشئ ذلك طلب شراء على المنصة؛ يلزم حساب مشتري لاستلام عروض الموردين في ملفك.',material:'الحجر أو المنتج والشكل',quantity:'الكمية',unit:'الوحدة',destination:'مكان التسليم',notes:'المقاسات والسماكة والتشطيب والتاريخ',prepare:'جهّز المسودة',email:'افتح مسودة البريد',account:'أنشئ طلباً بحساب مشتري',compare:'قارن إجمالي العروض',compareIntro:'أدخل أرقام عروض الموردين الفعلية. لا تنتج الأداة أسعار سوق أو عروض منصة. راجع الضرائب والتركيب والأعمال الإضافية بصورة منفصلة عند استبعادها.',price:'سعر الوحدة',extra:'النقل والتعبئة',offer:'العرض',total:'الإجمالي المحسوب',currency:'العملة',missing:'أدخل سعر الوحدة',subject:'Marble Borsa · استفسار توريد'}
 };
 const lang=(['tr','en','zh','ar'].includes(locale)?locale:'tr') as keyof typeof labels;
 const t=labels[lang];const [draft,setDraft]=useState('');
 const [result,setResult]=useState<{a:number|null;b:number|null;currency:string}>({a:null,b:null,currency:'TRY'});
 if(mode==='compare')return <section className="quote-preparation quote-comparison" aria-label={t.compare}>
  <h2>{t.compare}</h2><p>{t.compareIntro}</p><form className="quote-tool-fields" onSubmit={event=>event.preventDefault()} onInput={event=>{const data=new FormData(event.currentTarget),quantity=Number(data.get('quantity'));const total=(key:string)=>{const price=String(data.get('price'+key)||'');return price.trim()&&quantity>0&&Number(price)>=0?quantity*Number(price)+Number(data.get('extra'+key)||0):null;};setResult({a:total('a'),b:total('b'),currency:String(data.get('currency')||'TRY')});}}>
  <label>{t.quantity}<input name="quantity" type="number" min="0.01" max="999999" step="any" defaultValue="100"/></label><label>{t.currency}<select name="currency" defaultValue="TRY"><option>TRY</option><option>USD</option><option>EUR</option></select></label>
  {['a','b'].map((key,i)=><fieldset key={key}><legend>{t.offer} {i+1}</legend><label>{t.price}<input name={'price'+key} type="number" min="0" max="1000000000" step="any"/></label><label>{t.extra}<input name={'extra'+key} type="number" min="0" max="1000000000" step="any" defaultValue="0"/></label></fieldset>)}</form>
  <div className="quote-comparison-results" aria-live="polite">{(['a','b'] as const).map((key,i)=><p key={key}><strong>{t.offer} {i+1} · {t.total}: </strong>{result[key]===null?t.missing:new Intl.NumberFormat(lang,{style:'currency',currency:result.currency}).format(result[key]!)}</p>)}</div>
 </section>;
 return <section id="hizli-talep" className="quote-preparation" aria-label={t.title}><h2>{t.title}</h2><p>{t.intro}</p>
 <form className="quote-tool-fields" onSubmit={event=>{event.preventDefault();const data=new FormData(event.currentTarget);setDraft([t.subject,...['material','quantity','unit','destination','notes'].map(key=>`${t[key as 'material'|'quantity'|'unit'|'destination'|'notes']}: ${String(data.get(key)||'').trim()}`)].join('\n'));}}>
 <label className="quote-tool-wide">{t.material}<input name="material" required minLength={2} maxLength={100}/></label><label>{t.quantity}<input name="quantity" type="number" min="0.01" max="999999" step="any" required/></label><label>{t.unit}<select name="unit"><option>m²</option><option>ton</option><option>adet / pieces</option><option>m³</option></select></label><label className="quote-tool-wide">{t.destination}<input name="destination" required minLength={2} maxLength={100}/></label><label className="quote-tool-wide">{t.notes}<textarea name="notes" maxLength={500}/></label><button className="button dark" type="submit">{t.prepare}</button>
 </form>{draft&&<div className="quote-draft" aria-live="polite"><pre>{draft}</pre><a className="button dark" href={`mailto:info@marbleborsa.com?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(draft)}`}>{t.email} ↗</a></div>}<p><a href={`/${lang}/profil?auth=signup`}>{t.account} ↗</a></p>
 </section>;
}
