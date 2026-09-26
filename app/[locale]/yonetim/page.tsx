import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminScripts from "@/components/AdminScripts";
import { membershipPlans } from "@/lib/membershipPlans";

export const metadata: Metadata = {
  title: "Üyelik yönetimi | Marble Borsa",
  robots: { index: false, follow: false }
};

export default async function Management({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "tr") notFound();
  return <main className="mb-admin-shell">
    <link rel="stylesheet" href="/market/admin.css" />
    <p><a href="/tr">← Marble Borsa</a></p>
    <h1>Üyelik yönetimi</h1>
    <p>Firma belgelerini inceleyin, banka hesabına geçen ödemeyi kaydedin ve üyeliği açın.</p>
    <div id="mb-admin-root" role="status">Hesap doğrulanıyor…</div>
    <script id="mb-admin-plans" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(membershipPlans) }} />
    <AdminScripts />
  </main>;
}
