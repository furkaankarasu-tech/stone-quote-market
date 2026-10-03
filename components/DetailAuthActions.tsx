"use client";

import { useEffect, useState } from "react";

type AuthUser = { email_confirmed_at?: string | null } | null;
type MarbleAuthClient = {
  client?: { auth?: { getUser?: () => Promise<{ data: { user: AuthUser }, error: unknown }> } };
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
export default function DetailAuthActions({ language }: { language: Language }) {
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
      const getUser = runtime.MarbleAuth?.client?.auth?.getUser;
      if (!getUser) { if (!cancelled) setStatus("guest"); return; }
      try {
        const { data, error: authError } = await getUser.call(runtime.MarbleAuth?.client?.auth);
        if (cancelled) return;
        if (authError) throw authError;
        runtime.MarbleAuthUser = data.user?.email_confirmed_at ? data.user : null;
        setStatus(runtime.MarbleAuthUser ? "signed-in" : "guest");
      } catch {
        // A temporary network failure is not proof that an existing session ended.
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
      setStatus("guest");
    } catch {
      setError(t.failed);
    } finally {
      setWorking(false);
    }
  }

  if (status === "checking") return <span className="detail-account-checking" aria-live="polite">{t.checking}…</span>;
  return <>
    {status === "signed-in" ? <>
      <a className="detail-auth-link" href="/tr/profil">{t.profile}</a>
      <button type="button" className="detail-auth-link detail-signout" onClick={signOut} disabled={working}>{t.logout}</button>
    </> : <>
      <a className="detail-auth-link" href={`/tr/profil?auth=login${suffix}`}>{t.login}</a>
      <a className="detail-auth-link detail-auth-primary" href={`/tr/profil?auth=signup${suffix}`}>{t.signup}</a>
    </>}
    {error && <span role="alert" className="detail-auth-error">{error}</span>}
  </>;
}
