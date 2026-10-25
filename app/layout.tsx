import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildMetadata, homeSeo, safeJsonLd, siteUrl } from "@/lib/seo";
import SitePreferences from "@/components/SitePreferences";
import { dataController } from "@/lib/dataController";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LegalDialog from "@/components/LegalDialog";
import "./market.css";
import "./guide.css";
import "./premium.css";

const origin = siteUrl();
export const metadata: Metadata = {
  ...(origin ? { metadataBase: new URL(origin) } : {}),
  ...buildMetadata({ ...homeSeo, path: "/" }),
  applicationName: "Marble Borsa",
  verification: { yandex: "d34c18a24d94b4ef" },
  icons: { apple: [{ url: "/icon.png?v=mb", sizes: "512x512", type: "image/png" }] },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const requestedLocale = (await headers()).get("x-marble-locale") || "tr";
  const locale = ["tr", "en", "zh", "ar"].includes(requestedLocale) ? requestedLocale : "tr";
  return (
    <html lang={locale === "zh" ? "zh-CN" : locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <meta name="theme-color" content="#213a33" />
      </head>
      <body>
        {origin && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: safeJsonLd({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Marble Borsa",
                ...(dataController.unvan?{legalName:dataController.unvan}:{}),
                ...(dataController.telefon?{telephone:dataController.telefon}:{}),
                ...(dataController.adres?{address:{"@type":"PostalAddress",streetAddress:dataController.adres}}:{}),
                email:dataController.kvkkBasvuruEmail,
                sameAs:["https://www.instagram.com/marbleborsa/",process.env.NEXT_PUBLIC_LINKEDIN_URL||"https://www.linkedin.com/in/marble-borsa/"],
                url: origin,
                logo: `${origin}/icon.png`,
              }),
            }}
          />
        )}
        {origin && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
            "@context": "https://schema.org", "@type": "WebSite", name: "Marble Borsa", url: origin,
            description: "Mermer ve doğal taş tedariki için doğrudan B2B teklif platformu"
          }) }} />
        )}
        <a className="skip-link" href="#main-content">İçeriğe geç</a>
        <Header/>
        {children}
        <Footer/>
        <LegalDialog />
        <SitePreferences measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""} enabled={process.env.VERCEL_ENV !== "preview" && process.env.VERCEL_ENV !== "development"} />
      </body>
    </html>
  );
}
