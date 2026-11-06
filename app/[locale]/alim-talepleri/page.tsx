import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Marketplace from "@/components/Marketplace";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return ["tr","en","zh","ar"].map(locale=>({locale}));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!["tr","en","zh","ar"].includes(locale)) return {};
  return {
    ...buildMetadata({
      title: ({tr:"Alım Talepleri",en:"Buying Requests",zh:"采购需求",ar:"طلبات الشراء"})[locale as "tr"|"en"|"zh"|"ar"],
      description: "Marble Borsa",
      path: `/${locale}/alim-talepleri`,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function SupplierRequests({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!["tr","en","zh","ar"].includes(locale)) notFound();
  // İlk HTML'de talep verisi bulunmaz; gerçek üyelik erişimi sunucuda doğrulanmalıdır.
  return <Marketplace category="alim-talepleri" locale={locale as "tr"|"en"|"zh"|"ar"} />;
}
