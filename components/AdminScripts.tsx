"use client";

import { useEffect } from "react";

export default function AdminScripts() {
  useEffect(() => {
    let cancelled = false;
    const scripts: HTMLScriptElement[] = [];
    async function load() {
      for (const src of ["/market/auth.bundle.js", "/market/db.js", "/market/admin.js"]) {
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
      const root = document.getElementById("mb-admin-root");
      if (root) root.textContent = "Yönetim ekranı yüklenemedi.";
    });
    return () => { cancelled = true; scripts.forEach(s => s.remove()); };
  }, []);
  return null;
}
