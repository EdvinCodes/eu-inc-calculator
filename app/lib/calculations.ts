// app/lib/calculations.ts

export type EquityPlanType = "ESOP" | "PHANTOM";
export type CurrencyType = "EUR" | "USD" | "GBP";

export interface ScenarioInputs {
  shares: number;
  strikePrice: number;
  companyValuation: number;
  totalShares: number;
  planType: EquityPlanType;
  grantDate: string;
  vestingMonths: number;
  cliffMonths: number;
  expectedDilution: number;
  currency: CurrencyType;
}

export interface ScenarioResults {
  sharePrice: number;
  equityValue: number;
  costToExercise: number;
  profit: number;
  ownership: number;
  vestedPercentage: number;
  vestedShares: number;
  vestedProfit: number;
  originalOwnership: number;
}

export function calculateScenario(inputs: ScenarioInputs): ScenarioResults {
  const safeTotalShares = inputs.totalShares > 0 ? inputs.totalShares : 1;
  const isPhantom = inputs.planType === "PHANTOM";

  const dilutionFactor =
    Math.max(0, Math.min(inputs.expectedDilution || 0, 99)) / 100;
  const dilutedTotalShares = safeTotalShares / (1 - dilutionFactor);

  const originalOwnership = (inputs.shares / safeTotalShares) * 100;
  const finalOwnership = (inputs.shares / dilutedTotalShares) * 100;

  const sharePrice = inputs.companyValuation / dilutedTotalShares;

  const equityValue = inputs.shares * sharePrice;
  const costToExercise = isPhantom ? 0 : inputs.shares * inputs.strikePrice;
  const grossProfit = equityValue - costToExercise;

  let vestedPercentage = 100;

  if (inputs.grantDate && inputs.vestingMonths > 0) {
    const grant = new Date(inputs.grantDate);
    const now = new Date();

    const monthsPassed =
      (now.getFullYear() - grant.getFullYear()) * 12 +
      (now.getMonth() - grant.getMonth());

    if (monthsPassed < inputs.cliffMonths) {
      vestedPercentage = 0;
    } else if (monthsPassed >= inputs.vestingMonths) {
      vestedPercentage = 100;
    } else {
      vestedPercentage = (monthsPassed / inputs.vestingMonths) * 100;
    }
  }

  const vestedShares = (inputs.shares * vestedPercentage) / 100;
  const vestedEquityValue = vestedShares * sharePrice;
  const vestedCost = isPhantom ? 0 : vestedShares * inputs.strikePrice;
  const vestedProfit = Math.max(0, vestedEquityValue - vestedCost);

  return {
    sharePrice,
    equityValue,
    costToExercise,
    profit: grossProfit > 0 ? grossProfit : 0,
    ownership: finalOwnership,
    vestedPercentage,
    vestedShares,
    vestedProfit,
    originalOwnership,
  };
}

export const formatCurrency = (
  val: number,
  currency: CurrencyType = "EUR",
  compact = false,
) => {
  const locales = {
    EUR: "en-IE",
    USD: "en-US",
    GBP: "en-GB",
  };

  return new Intl.NumberFormat(locales[currency], {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(val);
};

export interface LabeledScenario {
  id: string;
  label: string;
  inputs: ScenarioInputs;
  editable?: boolean;
}

export function cloneScenario(
  base: ScenarioInputs,
  overrides?: Partial<ScenarioInputs>,
): ScenarioInputs {
  return { ...base, ...overrides };
}
