import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PasswordResetScripts from "@/components/PasswordResetScripts";

export const metadata: Metadata = {
  title: "Şifre yenileme | Marble Borsa",
  robots: { index: false, follow: false },
};

export default async function PasswordResetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "tr") notFound();
  return <main className="mb-reset-shell">
    <link rel="stylesheet" href="/market/password-reset.css" />
    <section className="mb-reset-card">
      <a className="mb-reset-brand" href="/tr">Marble Borsa</a>
      <span className="mb-reset-eyebrow">HESAP GÜVENLİĞİ</span>
      <h1>Şifrenizi yenileyin</h1>
      <p id="mb-reset-status" role="status">Bağlantı kontrol ediliyor…</p>
      <form id="mb-reset-form" hidden>
        <label>Yeni şifre<input name="password" type="password" autoComplete="new-password" minLength={10} maxLength={128} required /></label>
        <label>Yeni şifre tekrar<input name="confirm" type="password" autoComplete="new-password" minLength={10} maxLength={128} required /></label>
        <p id="mb-reset-error" role="alert" aria-live="polite" />
        <button type="submit">Şifremi güncelle</button>
      </form>
      <a className="mb-reset-return" href="/tr">Ana sayfaya dön →</a>
    </section>
    <PasswordResetScripts />
  </main>;
}
