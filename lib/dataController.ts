/** Supply the genuine legal operator information in Vercel's Production environment.
 * Do not put development placeholders or invented firm details on the public site.
 */
export const dataController = {
  unvan: process.env.NEXT_PUBLIC_LEGAL_OPERATOR_NAME?.trim() || "",
  adres: process.env.NEXT_PUBLIC_LEGAL_OPERATOR_ADDRESS?.trim() || "",
  telefon: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||'').replace(/[^0-9]/g,''),
  vergiDairesi:process.env.NEXT_PUBLIC_LEGAL_TAX_OFFICE?.trim()||'',
  vergiNo:process.env.NEXT_PUBLIC_LEGAL_TAX_NUMBER?.trim()||'',
  kvkkBasvuruEmail: "info@marbleborsa.com",
} as const;
