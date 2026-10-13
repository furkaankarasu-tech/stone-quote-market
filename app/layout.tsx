import type { Metadata } from "next";
import { buildMetadata, homeSeo, safeJsonLd, siteUrl } from "@/lib/seo";
import SitePreferences from "@/components/SitePreferences";
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
  icons: { apple: [{ url: "/icon.png?v=mb", sizes: "512x512", type: "image/png" }] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
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
