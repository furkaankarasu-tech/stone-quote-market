"use client";

import { useEffect } from "react";

export default function MarketplaceScripts() {
  useEffect(() => {
    let cancelled = false;
    const scripts: HTMLScriptElement[] = [];
    async function load() {
      for (const src of ["/market/app.js", "/market/registration.js", "/market/live-ui.js", "/market/auth.bundle.js", "/market/db.js"]) {
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
    }
    void load().catch((error) => console.error(error));
    return () => {
      cancelled = true;
      scripts.forEach((script) => script.remove());
    };
  }, []);
  return null;
}
