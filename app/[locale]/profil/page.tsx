import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Marketplace from "@/components/Marketplace";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() { return [{ locale: "tr" }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "tr") return {};
  return { ...buildMetadata({ title: "Profil", description: "Marble Borsa üyelik, katalog, talep ve teklif yönetimi.", path: "/tr/profil" }),
    robots: { index: false, follow: false } };
}

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== "tr") notFound();
  return <Marketplace profile />;
}
