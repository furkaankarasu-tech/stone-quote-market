import type { Metadata } from "next";
import "./legacy.css";
export const metadata: Metadata={metadataBase:new URL("https://marbleborsa.com"),title:{default:"Marble Borsa | Doğal Taş B2B Teklif Platformu",template:"%s | Marble Borsa"},description:"Mermer, traverten ve doğal taş sektöründe firmaları, taşları, alım taleplerini ve hizmet sağlayıcıları buluşturan B2B platform.",alternates:{canonical:"/tr"},openGraph:{type:"website",siteName:"Marble Borsa",title:"Marble Borsa | Doğal Taş B2B Teklif Platformu",description:"Doğal taş sektöründe firma, ürün ve alım talebi keşfi.",url:"https://marbleborsa.com/tr"},robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="tr"><body>{children}</body></html>}
