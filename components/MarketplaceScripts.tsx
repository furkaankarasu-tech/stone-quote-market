"use client";

import { useEffect } from "react";

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
      let initialUser = (window as Window & { MarbleAuthUser?: unknown }).MarbleAuthUser ?? null;
      if (auth?.getSession) {
        try {
          const { data, error } = await timed(auth.getSession(), 2200);
          if (!error && data?.session?.user?.email_confirmed_at) initialUser = data.session.user;
          // A missing cached session does not override an auth event that arrived first.
        } catch (error) {
          if (!cancelled) console.warn("Marble Borsa: cached session unavailable", error);
        }
      }
      if (cancelled) return;
      // Notify the UI promptly, even if the server-side user check is slow.
      window.dispatchEvent(new CustomEvent("marble-auth", { detail: { user: initialUser } }));
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
