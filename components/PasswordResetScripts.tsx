"use client";

import { useEffect } from "react";

export default function PasswordResetScripts() {
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
      if (status) status.textContent = "Şifre yenileme ekranı yüklenemedi. Lütfen tekrar deneyin.";
    });
    return () => {
      cancelled = true;
      scripts.forEach((script) => script.remove());
    };
  }, []);
  return null;
}
