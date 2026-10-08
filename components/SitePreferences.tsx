"use client";

import { useEffect, useRef, useState } from "react";

const key = "mb-cookie-preference-v1";
type Preference = "necessary" | "analytics";
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export default function SitePreferences({ measurementId, enabled }: { measurementId: string; enabled: boolean }) {
  const id = /^G-[A-Z0-9]+$/.test(measurementId) && enabled ? measurementId : "";
  const [choice, setChoice] = useState<Preference | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState("tr");
  const focusBack = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const read = () => {
      try { const saved = localStorage.getItem(key); setChoice(saved === "analytics" || saved === "necessary" ? saved : null); } catch { setChoice(null); }
    };
    read(); setReady(true);
    const updateLanguage = () => {
      const locale=document.documentElement.lang.split("-")[0]; setLanguage(locale);
      const skip=document.querySelector(".skip-link");if(skip)skip.textContent=({tr:"İçeriğe geç",en:"Skip to content",zh:"跳转到内容",ar:"انتقل إلى المحتوى"} as Record<string,string>)[locale]||"Skip to content";
    };
    updateLanguage();
    const observer = new MutationObserver(updateLanguage);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    const storage = (event: StorageEvent) => { if (event.key === key || event.key === null) read(); };
    window.addEventListener("storage", storage);
    return () => { observer.disconnect(); window.removeEventListener("storage", storage); };
  }, []);

  useEffect(() => {
    if (!id || !ready) return;
    const runtime = window as AnalyticsWindow;
    const flag = `ga-disable-${id}`;
    const publicPage = () => !/\/(profil|yonetim|sifre-sifirla|alim-talepleri)(\/|$)|^\/api\//.test(location.pathname);
    const disable = () => {
      (window as unknown as Record<string, unknown>)[flag] = true;
      if (runtime.gtag) runtime.gtag("consent", "update", { analytics_storage: "denied" });
    };
    if (choice !== "analytics") {
      disable();
      // Delete only Google Analytics cookies, never Supabase session cookies.
      const domains = ["", location.hostname, `.${location.hostname}`, ".marbleborsa.com"];
      document.cookie.split(";").map(value => value.trim().split("=")[0]).filter(name => /^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)).forEach(name => {
        domains.forEach(domain => { document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ""} SameSite=Lax`; });
      });
      return;
    }
    if (!publicPage()) { disable(); return; }
    (window as unknown as Record<string, unknown>)[flag] = false;
    let lastPath = "";
    const track = () => {
      if (!publicPage()) { lastPath = ""; disable(); return; }
      (window as unknown as Record<string, unknown>)[flag] = false;
      runtime.gtag?.("consent", "update", { analytics_storage: "granted" });
      if (lastPath === location.pathname) return;
      lastPath = location.pathname;
      runtime.gtag?.("event", "page_view", {
        send_to: id, page_location: location.origin + location.pathname,
        page_title: document.title, page_referrer: "",
      });
    };
    if (!document.getElementById("mb-ga-script")) {
      runtime.dataLayer = runtime.dataLayer || [];
      runtime.gtag = function () { runtime.dataLayer!.push(arguments); };
      runtime.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      runtime.gtag("js", new Date());
      runtime.gtag("config", id, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: location.origin + location.pathname, page_referrer: "" });
      const script = document.createElement("script");
      script.id = "mb-ga-script"; script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(script);
    } else runtime.gtag?.("consent", "update", { analytics_storage: "granted" });
    track();
    window.addEventListener("marble-navigation", track);
    window.addEventListener("popstate", track);
    return () => { window.removeEventListener("marble-navigation", track); window.removeEventListener("popstate", track); disable(); };
  }, [choice, id, ready]);

  const text = ({
    tr: { title: "Çerez tercihleri", body: "Oturum, dil ve tercihlerinizi korumak için zorunlu tarayıcı depolaması kullanıyoruz.", analytics: "İzin verirseniz ziyaret edilen herkese açık sayfaları Google Analytics ile ölçebiliriz.", necessary: "Yalnızca zorunlu", allow: "Analitiğe izin ver", policy: "Çerez politikası", close: "Kapat" },
    en: { title: "Cookie preferences", body: "We use essential browser storage to keep your session, language and preferences.", analytics: "With your permission, we can measure visits to public pages using Google Analytics.", necessary: "Essential only", allow: "Allow analytics", policy: "Cookie policy", close: "Close" },
    zh: { title: "Cookie 偏好", body: "我们使用必要的浏览器存储来保存登录、语言及偏好。", analytics: "经您允许，可通过 Google Analytics 衡量公开页面的访问。", necessary: "仅必要存储", allow: "允许分析", policy: "Cookie 政策", close: "关闭" },
    ar: { title: "تفضيلات ملفات الارتباط", body: "نستخدم التخزين الضروري لحفظ الجلسة واللغة والتفضيلات.", analytics: "بموافقتك يمكن قياس زيارات الصفحات العامة عبر Google Analytics.", necessary: "الضروري فقط", allow: "السماح بالتحليلات", policy: "سياسة ملفات الارتباط", close: "إغلاق" },
  } as const)[language as "tr" | "en" | "zh" | "ar"] || { title: "Cookie preferences", body: "Essential browser storage keeps your session and preferences.", analytics: "Optional Google Analytics measurement requires permission.", necessary: "Essential only", allow: "Allow analytics", policy: "Cookie policy", close: "Close" };

  function save(value: Preference) {
    try { localStorage.setItem(key, value); } catch { /* Keep the choice in memory if storage is unavailable. */ }
    setChoice(value); setOpen(false); focusBack.current?.focus();
  }
  useEffect(() => { if (open) panel.current?.querySelector<HTMLButtonElement>("button")?.focus(); }, [open]);

  return <>
    <button className="cookie-settings" hidden={!ready || open || (!!id && choice === null)} type="button" onClick={event => { focusBack.current = event.currentTarget; setOpen(true); }}>{text.title}</button>
    {ready && ((!!id && choice === null) || open) && <section ref={panel} className="cookie-panel" role="region" aria-labelledby="cookie-title" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="cookie-copy"><span className="cookie-symbol" aria-hidden="true">◌</span><h2 id="cookie-title">{text.title}</h2><p>{text.body} {id && text.analytics}</p><a href={`/${language}/yasal/cerez`} data-legal="cerez">{text.policy}</a></div>
      <div className="cookie-actions"><button type="button" className="button outline" onClick={() => save("necessary")}>{id ? text.necessary : (({tr:"Anladım",en:"Got it",zh:"知道了",ar:"فهمت"} as Record<string,string>)[language] || "Got it")}</button>{id && <button type="button" className="button dark" onClick={() => save("analytics")}>{text.allow}</button>}{open && choice !== null && <button type="button" className="button outline" onClick={() => { setOpen(false); focusBack.current?.focus(); }}>{text.close}</button>}</div>
    </section>}
  </>;
}
