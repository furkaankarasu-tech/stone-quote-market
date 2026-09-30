import type { Metadata } from "next";
import { buildMetadata, homeSeo, safeJsonLd, siteUrl } from "@/lib/seo";
import LegalDialog from "@/components/LegalDialog";

const origin = siteUrl();
export const metadata: Metadata = {
  ...(origin ? { metadataBase: new URL(origin) } : {}),
  ...buildMetadata({ ...homeSeo, path: "/" }),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="stylesheet" href="/market/style.css" />
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
              }),
            }}
          />
        )}
        {children}
        <LegalDialog />
      </body>
    </html>
  );
}
