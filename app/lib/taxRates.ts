// app/lib/taxRates.ts

export interface TaxJurisdiction {
  code: string;
  flag: string;
  name: string;
  capitalGainsTax: number; // % sobre la ganancia
  esopDiscount: number; // % de descuento fiscal si hay régimen especial ESOP
  notes: string;
}

export const TAX_JURISDICTIONS: TaxJurisdiction[] = [
  {
    code: "IE",
    flag: "🇮🇪",
    name: "Ireland",
    capitalGainsTax: 33,
    esopDiscount: 0,
    notes:
      "CGT at 33%. KEEP scheme offers income tax relief on approved options.",
  },
  {
    code: "ES",
    flag: "🇪🇸",
    name: "Spain",
    capitalGainsTax: 28,
    esopDiscount: 50,
    notes:
      "Up to 28% on gains >€300K. Startups Law 2023 exempts first €50K on approved ESOPs.",
  },
  {
    code: "DE",
    flag: "🇩🇪",
    name: "Germany",
    capitalGainsTax: 26.375,
    esopDiscount: 0,
    notes:
      "Abgeltungsteuer 25% + 5.5% solidarity surcharge. Employee share schemes deferred since 2021.",
  },
  {
    code: "FR",
    flag: "🇫🇷",
    name: "France",
    capitalGainsTax: 30,
    esopDiscount: 0,
    notes:
      "PFU flat tax of 30% (12.8% income + 17.2% social charges) on capital gains.",
  },
  {
    code: "NL",
    flag: "🇳🇱",
    name: "Netherlands",
    capitalGainsTax: 31,
    esopDiscount: 0,
    notes:
      "Box 2 rate applies at 24.5% up to €67K, 31% above. Options taxed at exercise.",
  },
  {
    code: "PT",
    flag: "🇵🇹",
    name: "Portugal",
    capitalGainsTax: 28,
    esopDiscount: 50,
    notes:
      "NHR regime can reduce to 10%. Startup options have special 50% reduction regime.",
  },
  {
    code: "SE",
    flag: "🇸🇪",
    name: "Sweden",
    capitalGainsTax: 30,
    esopDiscount: 25,
    notes:
      "Qualified ESOP (Kvalificerade personaloptioner) taxed as capital at 30%, not income.",
  },
  {
    code: "EE",
    flag: "🇪🇪",
    name: "Estonia",
    capitalGainsTax: 20,
    esopDiscount: 0,
    notes:
      "20% flat income tax. No separate CGT — equity taxed as income at exercise.",
  },
  {
    code: "GB",
    flag: "🇬🇧",
    name: "United Kingdom",
    capitalGainsTax: 24,
    esopDiscount: 50,
    notes: "EMI options: 24% CGT vs 45% income tax. Annual CGT allowance £3K.",
  },
  {
    code: "OTHER",
    flag: "🌍",
    name: "Other / Custom",
    capitalGainsTax: 30,
    esopDiscount: 0,
    notes: "Enter a custom tax rate for your jurisdiction.",
  },
];

export interface TaxResult {
  grossProfit: number;
  taxableAmount: number;
  taxPaid: number;
  netAfterTax: number;
  effectiveRate: number;
}

export function calculateTax(
  grossProfit: number,
  jurisdiction: TaxJurisdiction,
  customRate?: number,
): TaxResult {
  const rate =
    customRate !== undefined ? customRate : jurisdiction.capitalGainsTax;
  const discountMultiplier = 1 - jurisdiction.esopDiscount / 100;
  const taxableAmount = grossProfit * discountMultiplier;
  const taxPaid = (taxableAmount * rate) / 100;
  const netAfterTax = grossProfit - taxPaid;

  return {
    grossProfit,
    taxableAmount,
    taxPaid,
    netAfterTax,
    effectiveRate: grossProfit > 0 ? (taxPaid / grossProfit) * 100 : 0,
  };
}
