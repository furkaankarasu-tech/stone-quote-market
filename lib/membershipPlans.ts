// Internal annual plan amounts for administrative use only; do not expose on public signup pages.
export const membershipPlans = {
  buyer: { annualAmountTRY: 0, durationMonths: 0 },
  supplier: { annualAmountTRY: 25000, durationMonths: 12 },
  service: { annualAmountTRY: 15000, durationMonths: 12 },
} as const;

export const membershipContactEmail = "marbleborsa@marbleborsa.com";
