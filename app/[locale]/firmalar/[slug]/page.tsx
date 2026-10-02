import { notFound, permanentRedirect } from "next/navigation";

// Historical sample-company URLs lead to the verified company directory.
export default async function CompanyLegacyPage({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== "tr") notFound();
  permanentRedirect("/tr/firmalar");
}
