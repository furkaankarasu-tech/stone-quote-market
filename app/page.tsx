import Marketplace from "@/components/Marketplace";

import { buildMetadata, homeSeo } from "@/lib/seo";
import { marketAlternates } from "@/lib/guideRoutes";
export const metadata=buildMetadata({...homeSeo,path:"/",languages:marketAlternates()});

export default function Home() {
  return <Marketplace />;
}
