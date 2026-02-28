// app/lib/taxRates.ts

export interface TaxBracket {
  upTo: number | null; // null significa "en adelante" (infinito)
  rate: number;
}

export interface TaxJurisdiction {
  code: string;
  flag: string;
  name: string;
  capitalGainsTax?: number; // Para países con tasa plana
  brackets?: TaxBracket[]; // Para países con tramos progresivos
  esopDiscount: number; // Descuento porcentual (ej. 50%)
  taxFreeAllowance: number; // Cantidad exenta de impuestos (ej. 50000€)
  notes: string;
}

export const TAX_JURISDICTIONS: TaxJurisdiction[] = [
  {
    code: "ES",
    flag: "🇪🇸",
    name: "Spain (Startup Law)",
    taxFreeAllowance: 50000, // ¡Los primeros 50k están exentos!
    esopDiscount: 0,
    brackets: [
      { upTo: 6000, rate: 19 },
      { upTo: 50000, rate: 21 },
      { upTo: 200000, rate: 23 },
      { upTo: 300000, rate: 27 },
      { upTo: null, rate: 28 },
    ],
    notes:
      "Ley de Startups 2023: First €50K exempt. Progressive savings tax up to 28%.",
  },
  {
    code: "IE",
    flag: "🇮🇪",
    name: "Ireland",
    capitalGainsTax: 33,
    taxFreeAllowance: 1270, // Exención anual de CGT en Irlanda
    esopDiscount: 0,
    notes: "CGT flat rate at 33%. Annual exemption of €1,270 applied.",
  },
  {
    code: "DE",
    flag: "🇩🇪",
    name: "Germany",
    capitalGainsTax: 26.375, // 25% + 5.5% solidarity
    taxFreeAllowance: 1000, // Sparer-Pauschbetrag
    esopDiscount: 0,
    notes: "Abgeltungsteuer ~26.375%. First €1,000 exempt.",
  },
  {
    code: "FR",
    flag: "🇫🇷",
    name: "France",
    capitalGainsTax: 30,
    taxFreeAllowance: 0,
    esopDiscount: 0,
    notes: "PFU flat tax of 30% (12.8% income + 17.2% social charges).",
  },
  {
    code: "GB",
    flag: "🇬🇧",
    name: "United Kingdom",
    capitalGainsTax: 20, // Asumiendo Higher Rate band para CGT general, simplificado
    taxFreeAllowance: 3000,
    esopDiscount: 0,
    notes: "CGT allowance £3K. Assumes higher rate (20%) for non-EMI.",
  },
  {
    code: "OTHER",
    flag: "🌍",
    name: "Other / Custom",
    capitalGainsTax: 30,
    taxFreeAllowance: 0,
    esopDiscount: 0,
    notes: "Enter a custom flat tax rate for your jurisdiction.",
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
  // 1. Aplicamos la exención libre de impuestos (ej. los 50k de España)
  let taxableAmount = Math.max(0, grossProfit - jurisdiction.taxFreeAllowance);

  // 2. Aplicamos descuentos porcentuales si existen
  const discountMultiplier = 1 - jurisdiction.esopDiscount / 100;
  taxableAmount = taxableAmount * discountMultiplier;

  let taxPaid = 0;

  // 3. Calculamos el impuesto
  if (customRate !== undefined) {
    // Si el usuario pone un tipo manual, gana el manual
    taxPaid = (taxableAmount * customRate) / 100;
  } else if (jurisdiction.brackets) {
    // Cálculo por tramos progresivos (Magia negra fiscal)
    let remainingToTax = taxableAmount;
    let previousLimit = 0;

    for (const bracket of jurisdiction.brackets) {
      if (remainingToTax <= 0) break;

      const bracketSize = bracket.upTo
        ? bracket.upTo - previousLimit
        : Infinity;
      const amountInThisBracket = Math.min(remainingToTax, bracketSize);

      taxPaid += (amountInThisBracket * bracket.rate) / 100;
      remainingToTax -= amountInThisBracket;
      previousLimit = bracket.upTo || previousLimit;
    }
  } else {
    // Cálculo plano (Flat rate)
    taxPaid = (taxableAmount * (jurisdiction.capitalGainsTax || 0)) / 100;
  }

  const netAfterTax = grossProfit - taxPaid;

  return {
    grossProfit,
    taxableAmount,
    taxPaid,
    netAfterTax,
    effectiveRate: grossProfit > 0 ? (taxPaid / grossProfit) * 100 : 0,
  };
}
