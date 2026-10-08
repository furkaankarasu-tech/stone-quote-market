/** Supply the genuine legal operator information in Vercel's Production environment.
 * Do not put development placeholders or invented firm details on the public site.
 */
export const dataController = {
  unvan: process.env.NEXT_PUBLIC_LEGAL_OPERATOR_NAME?.trim() || "",
  adres: process.env.NEXT_PUBLIC_LEGAL_OPERATOR_ADDRESS?.trim() || "",
  kvkkBasvuruEmail: "info@marbleborsa.com",
} as const;
