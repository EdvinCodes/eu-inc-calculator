// app/lib/calculations.ts

export interface ScenarioInputs {
  shares: number;
  strikePrice: number;
  companyValuation: number;
  totalShares: number;
}

export interface ScenarioResults {
  sharePrice: number;
  equityValue: number;
  costToExercise: number;
  profit: number;
  ownership: number;
}

export function calculateScenario(inputs: ScenarioInputs): ScenarioResults {
  const safeTotalShares = inputs.totalShares > 0 ? inputs.totalShares : 1;
  const sharePrice = inputs.companyValuation / safeTotalShares;

  const isPhantom = inputs.planType === "PHANTOM";

  const equityValue = inputs.shares * sharePrice;

  const costToExercise = isPhantom ? 0 : inputs.shares * inputs.strikePrice;

  const grossProfit = equityValue - costToExercise;

  return {
    sharePrice,
    equityValue,
    costToExercise,
    profit: grossProfit > 0 ? grossProfit : 0,
    ownership: (inputs.shares / safeTotalShares) * 100,
  };
}

export const formatCurrency = (val: number, compact = false) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(val);

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

export type EquityPlanType = "ESOP" | "PHANTOM";

export interface ScenarioInputs {
  shares: number;
  strikePrice: number;
  companyValuation: number;
  totalShares: number;
  // opcional: tipo de plan
  planType?: EquityPlanType;
}
