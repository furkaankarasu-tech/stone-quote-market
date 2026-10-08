import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Marketplace from "@/components/Marketplace";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() { return ["tr","en","zh","ar"].map(locale=>({locale})); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const {locale}=await params;
  if (!["tr","en","zh","ar"].includes(locale)) return {};
  return { ...buildMetadata({ title: ({tr:"Profil",en:"Profile",zh:"个人资料",ar:"الملف الشخصي"})[locale as "tr"|"en"|"zh"|"ar"], description: "Marble Borsa", path: `/${locale}/profil` }),
    robots: { index: false, follow: false } };
}

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const {locale}=await params;
  if (!["tr","en","zh","ar"].includes(locale)) notFound();
  return <Marketplace profile locale={locale as "tr"|"en"|"zh"|"ar"} />;
}
