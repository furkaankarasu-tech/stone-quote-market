import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminScripts from "@/components/AdminScripts";
import { membershipPlans } from "@/lib/membershipPlans";

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;return {title:({tr:"Yönetim paneli",en:"Administration",zh:"管理面板",ar:"لوحة الإدارة"} as Record<string,string>)[locale]+" | Marble Borsa",robots:{index:false,follow:false}}}

export default async function Management({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!["tr","en","zh","ar"].includes(locale)) notFound();
  const ui={tr:["Yönetim paneli","Yeni firma başvurularıyla iletişime geçin, belgeleri ve banka ödemesini doğrulayıp üyeliği açın.","Yönetim bölümleri","Firma başvuruları","Reklamlar","Hesap doğrulanıyor…"],en:["Administration","Review company applications, verify documents and bank payments, and activate membership.","Administration sections","Company applications","Advertisements","Checking account…"],zh:["管理面板","审核企业申请、验证文件和银行付款并开通会员。","管理栏目","企业申请","广告","正在验证账户…"],ar:["لوحة الإدارة","راجع طلبات الشركات وتحقق من الوثائق والمدفوعات البنكية وفعّل العضوية.","أقسام الإدارة","طلبات الشركات","الإعلانات","جار فحص الحساب…"]}[locale as "tr"|"en"|"zh"|"ar"];
  return <main id="main-content" tabIndex={-1} className="mb-admin-shell">
    <link rel="stylesheet" href="/market/admin.css" />
    <p><a href={`/${locale}`}>← Marble Borsa</a></p>
    <h1>{ui[0]}</h1>
    <p>{ui[1]}</p>
    <div id="mb-admin-tabs" className="admin-tabs" hidden role="tablist" aria-label={ui[2]}>
      <button id="admin-members-tab" type="button" role="tab" aria-selected="true" aria-controls="mb-admin-members" data-admin-tab="members">{ui[3]}</button>
      <button id="admin-ads-tab" type="button" role="tab" aria-selected="false" aria-controls="mb-admin-ads" data-admin-tab="ads" tabIndex={-1}>{ui[4]}</button>
    </div>
    <section id="mb-admin-members" role="tabpanel" aria-labelledby="admin-members-tab"><div id="mb-admin-root" role="status">{ui[5]}</div></section>
    <section id="mb-admin-ads" role="tabpanel" aria-labelledby="admin-ads-tab" hidden>
      <div id="mb-admin-ad-root" />
    </section>
    <script id="mb-admin-plans" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(membershipPlans) }} />
    <AdminScripts />
  </main>;
}
