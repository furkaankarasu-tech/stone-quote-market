"use client";

import { useEffect } from "react";

function loadScript(src: string): Promise<HTMLScriptElement> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      resolve(existing);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Cannot load ${src}`));
    document.body.appendChild(script);
  });
}

export default function MarketplaceScripts() {
  useEffect(() => {
    let cancelled = false;
    const appended: HTMLScriptElement[] = [];

    const trackedLoad = async (src: string) => {
      const script = await loadScript(src);
      if (!document.body.contains(script)) return script;
      appended.push(script);
      return script;
    };

    const criticalScripts = ["/market/app.js", "/market/live-ui.js"];
    const deferredScripts = ["/market/auth.bundle.js", "/market/db.js", "/market/logo.js", "/market/catalog.js", "/market/registration.js"];

    const loadDeferred = async () => {
      for (const src of deferredScripts) {
        if (cancelled) return;
        await trackedLoad(src);
      }
      const runtime = window as Window & { MarbleAuth?: unknown; MarbleRegistration?: unknown; MarbleLogo?: unknown };
      if (!runtime.MarbleAuth || !runtime.MarbleRegistration || !runtime.MarbleLogo) {
        throw new Error("Account modules are unavailable after loading");
      }
      window.dispatchEvent(new Event("marble-account-ready"));
    };

    const scheduleDeferred = () => {
      const runner = () => { void loadDeferred().catch(handleError); };
      if ("requestIdleCallback" in window) {
        (window as Window & { requestIdleCallback?: (cb: IdleRequestCallback, options?: IdleRequestOptions) => number }).requestIdleCallback?.(() => runner(), { timeout: 450 });
      } else {
        window.setTimeout(runner, 320);
      }
    };

    const handleError = (error: unknown) => {
      console.error("Marble Borsa: account scripts failed to load", error);
      const toast = document.getElementById("toast");
      if (toast) {
        toast.textContent = "Hesap işlemleri yüklenemedi. Bağlantınızı kontrol edip sayfayı yenileyin.";
        toast.classList.add("show");
        toast.setAttribute("role", "alert");
      }
    };

    async function load() {
      for (const src of criticalScripts) {
        if (cancelled) return;
        await trackedLoad(src);
      }
      scheduleDeferred();
    }

    void load().catch(handleError);

    return () => {
      cancelled = true;
      appended.forEach((script) => script.remove());
    };
  }, []);

  return null;
}
