const projectUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://edndfgxkbfatmfemiayj.supabase.co").replace(/\/$/, "");
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_zGNc5MnphVF9OlUXkg9A";

export type PublicCompany = {
  company_id: string;
  name: string;
  city: string;
  activity_type: string;
  section: "companies" | "machines" | "services";
  logo_path: string | null;
};
export type PublicCatalogItem = {
  id: string;
  company_id: string;
  title: string;
  category: "stone" | "machine" | "supplies" | "service";
  description: string;
  image_paths: string[];
  pdf_path: string | null;
};
export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const logoPattern = /^[0-9a-f-]{36}\/logo-[0-9]{13}-[0-9a-f-]{36}\.(?:png|jpg|jpeg|webp)$/;
const catalogPattern = /^[0-9a-f-]{36}\/[0-9a-f-]{36}\/(?:photo-[0-9a-f-]{36}\.(?:png|jpg|jpeg|webp)|catalog-[0-9a-f-]{36}\.pdf)$/;

async function publicRpc<T>(name: string): Promise<T[]> {
  if (!projectUrl || !publishableKey || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(projectUrl)) return [];
  const response = await fetch(`${projectUrl}/rest/v1/rpc/${name}`, {
    method: "POST", headers: { apikey: publishableKey, "Content-Type": "application/json" },
    body: "{}", next: { revalidate: 300 },
  });
  if (!response.ok) throw new Error(`Public directory unavailable (${response.status})`);
  const rows: unknown = await response.json();
  return Array.isArray(rows) ? rows as T[] : [];
}
export const publicCompanies = () => publicRpc<PublicCompany>("mb_list_directory_companies");
export const publicCatalog = () => publicRpc<PublicCatalogItem>("mb_list_catalog_items");
export function publicAssetUrl(bucket: "mb-company-logos" | "mb-catalog-assets", path: string | null | undefined): string {
  if (!projectUrl || !path || !(bucket === "mb-company-logos" ? logoPattern : catalogPattern).test(path)) return "";
  return `${projectUrl}/storage/v1/object/public/${bucket}/${path}`;
}
