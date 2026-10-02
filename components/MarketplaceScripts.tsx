"use client";

import { useEffect } from "react";

export default function MarketplaceScripts() {
  useEffect(() => {
    let cancelled = false;
    const scripts: HTMLScriptElement[] = [];
    async function load() {
      for (const src of ["/market/app.js", "/market/registration.js", "/market/live-ui.js", "/market/auth.bundle.js", "/market/db.js", "/market/logo.js", "/market/catalog.js"]) {
        if (cancelled) return;
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = false;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`Cannot load ${src}`));
          scripts.push(script);
          document.body.appendChild(script);
        });
      }
      // Registration and the Supabase client must both be present before deep-linked dialogs open.
      const runtime = window as Window & { MarbleAuth?: unknown; MarbleRegistration?: unknown; MarbleLogo?: unknown };
      if (!runtime.MarbleAuth || !runtime.MarbleRegistration || !runtime.MarbleLogo) {
        throw new Error("Account modules are unavailable after loading");
      }
      window.dispatchEvent(new Event("marble-account-ready"));
    }
    void load().catch((error) => {
      console.error("Marble Borsa: account scripts failed to load", error);
      const toast = document.getElementById("toast");
      if (toast) {
        toast.textContent = "Hesap işlemleri yüklenemedi. Bağlantınızı kontrol edip sayfayı yenileyin.";
        toast.classList.add("show");
        toast.setAttribute("role", "alert");
      }
    });
    return () => {
      cancelled = true;
      scripts.forEach((script) => script.remove());
    };
  }, []);
  return null;
}
