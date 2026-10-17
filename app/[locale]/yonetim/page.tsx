import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminScripts from "@/components/AdminScripts";
import { membershipPlans } from "@/lib/membershipPlans";

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;return {title:({tr:"Yönetim paneli",en:"Administration",zh:"管理面板",ar:"لوحة الإدارة"} as Record<string,string>)[locale]+" | Marble Borsa",robots:{index:false,follow:false}}}

export default async function Management({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!["tr","en","zh","ar"].includes(locale)) notFound();
  const ui={tr:["Yönetim paneli","Üyeleri, firma başvurularını, alım taleplerini ve reklamları yönetin.","Yönetim bölümleri","Firma başvuruları","Reklamlar","Hesap doğrulanıyor…"],en:["Administration","Manage members, company applications, purchase requests and advertisements.","Administration sections","Company applications","Advertisements","Checking account…"],zh:["管理面板","管理用户、企业申请、采购需求和广告。","管理栏目","企业申请","广告","正在验证账户…"],ar:["لوحة الإدارة","أدر الأعضاء وطلبات الشركات وطلبات الشراء والإعلانات.","أقسام الإدارة","طلبات الشركات","الإعلانات","جار فحص الحساب…"]}[locale as "tr"|"en"|"zh"|"ar"];
  return <main id="main-content" tabIndex={-1} className="mb-admin-shell">
    <link rel="stylesheet" href="/market/admin.css" />
    <p><a href={`/${locale}`}>← Marble Borsa</a></p>
    <h1>{ui[0]}</h1>
    <p>{ui[1]}</p>
    <div id="mb-admin-tabs" className="admin-tabs" hidden role="tablist" aria-label={ui[2]}>
      <button id="admin-members-tab" type="button" role="tab" aria-selected="true" aria-controls="mb-admin-members" data-admin-tab="members">{ui[3]}</button>
      <button id="admin-ads-tab" type="button" role="tab" aria-selected="false" aria-controls="mb-admin-ads" data-admin-tab="ads" tabIndex={-1}>{ui[4]}</button>
      <button id="admin-users-tab" type="button" role="tab" aria-selected="false" aria-controls="mb-admin-users" data-admin-tab="users" tabIndex={-1}>{({tr:"Tüm üyeler",en:"All members",zh:"所有用户",ar:"جميع الأعضاء"})[locale as "tr"|"en"|"zh"|"ar"]}</button>
      <button id="admin-requests-tab" type="button" role="tab" aria-selected="false" aria-controls="mb-admin-requests" data-admin-tab="requests" tabIndex={-1}>{({tr:"Alım talepleri",en:"Purchase requests",zh:"采购需求",ar:"طلبات الشراء"})[locale as "tr"|"en"|"zh"|"ar"]}</button>
    </div>
    <section id="mb-admin-members" role="tabpanel" aria-labelledby="admin-members-tab"><div id="mb-admin-root" role="status">{ui[5]}</div></section>
    <section id="mb-admin-ads" role="tabpanel" aria-labelledby="admin-ads-tab" hidden>
      <div id="mb-admin-ad-root" />
    </section>
    <section id="mb-admin-users" role="tabpanel" aria-labelledby="admin-users-tab" hidden><div id="mb-admin-users-root" /></section>
    <section id="mb-admin-requests" role="tabpanel" aria-labelledby="admin-requests-tab" hidden><div id="mb-admin-requests-root" /></section>
    <script id="mb-admin-plans" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(membershipPlans) }} />
    <AdminScripts />
  </main>;
}
