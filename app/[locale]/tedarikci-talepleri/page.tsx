import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Marketplace from "@/components/Marketplace";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return [{ locale: "tr" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "tr") return {};
  return {
    ...buildMetadata({
      title: "Alım Talepleri",
      description: "Tedarikçi hesabına özel alım talepleri.",
      path: "/tr/tedarikci-talepleri",
    }),
    robots: { index: false, follow: false },
  };
}

export default async function SupplierRequests({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "tr") notFound();
  // İlk HTML'de talep verisi bulunmaz; gerçek üyelik erişimi sunucuda doğrulanmalıdır.
  return <Marketplace category="tedarikci-talepleri" />;
}
