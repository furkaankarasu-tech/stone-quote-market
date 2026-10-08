import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminScripts from "@/components/AdminScripts";
import { membershipPlans } from "@/lib/membershipPlans";

export const metadata: Metadata = {
  title: "Yönetim paneli | Marble Borsa",
  robots: { index: false, follow: false }
};

export default async function Management({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "tr") notFound();
  return <main id="main-content" tabIndex={-1} className="mb-admin-shell">
    <link rel="stylesheet" href="/market/admin.css" />
    <p><a href="/tr">← Marble Borsa</a></p>
    <h1>Yönetim paneli</h1>
    <p>Yeni firma başvurularıyla iletişime geçin, belgeleri ve banka ödemesini doğrulayıp üyeliği açın.</p>
    <div id="mb-admin-tabs" className="admin-tabs" hidden role="tablist" aria-label="Yönetim bölümleri">
      <button id="admin-members-tab" type="button" role="tab" aria-selected="true" aria-controls="mb-admin-members" data-admin-tab="members">Firma başvuruları</button>
      <button id="admin-ads-tab" type="button" role="tab" aria-selected="false" aria-controls="mb-admin-ads" data-admin-tab="ads" tabIndex={-1}>Reklamlar</button>
    </div>
    <section id="mb-admin-members" role="tabpanel" aria-labelledby="admin-members-tab"><div id="mb-admin-root" role="status">Hesap doğrulanıyor…</div></section>
    <section id="mb-admin-ads" role="tabpanel" aria-labelledby="admin-ads-tab" hidden>
      <div id="mb-admin-ad-root" />
    </section>
    <script id="mb-admin-plans" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(membershipPlans) }} />
    <AdminScripts />
  </main>;
}
