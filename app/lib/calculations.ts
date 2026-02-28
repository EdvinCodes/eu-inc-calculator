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
  // --- NUEVO: Resultados de Vesting ---
  vestedPercentage: number;
  vestedShares: number;
  vestedProfit: number;
}

export function calculateScenario(inputs: ScenarioInputs): ScenarioResults {
  const safeTotalShares = inputs.totalShares > 0 ? inputs.totalShares : 1;
  const sharePrice = inputs.companyValuation / safeTotalShares;
  const isPhantom = inputs.planType === "PHANTOM";

  // Cálculos brutos (100% de las acciones)
  const equityValue = inputs.shares * sharePrice;
  const costToExercise = isPhantom ? 0 : inputs.shares * inputs.strikePrice;
  const grossProfit = equityValue - costToExercise;

  // --- LÓGICA DE VESTING ---
  let vestedPercentage = 100;

  if (inputs.grantDate && inputs.vestingMonths > 0) {
    const grant = new Date(inputs.grantDate);
    const now = new Date(); // Usará la fecha actual (Febrero 2026)

    // Calculamos cuántos meses han pasado
    const monthsPassed =
      (now.getFullYear() - grant.getFullYear()) * 12 +
      (now.getMonth() - grant.getMonth());

    if (monthsPassed < inputs.cliffMonths) {
      // Si te vas antes del año, te llevas 0
      vestedPercentage = 0;
    } else if (monthsPassed >= inputs.vestingMonths) {
      // Si ya pasó todo el periodo, tienes el 100%
      vestedPercentage = 100;
    } else {
      // Cálculo proporcional (ej. 18 meses de 48 = 37.5%)
      vestedPercentage = (monthsPassed / inputs.vestingMonths) * 100;
    }
  }

  // Calculamos el valor real de lo que ya es tuyo
  const vestedShares = (inputs.shares * vestedPercentage) / 100;
  const vestedEquityValue = vestedShares * sharePrice;
  const vestedCost = isPhantom ? 0 : vestedShares * inputs.strikePrice;
  const vestedProfit = Math.max(0, vestedEquityValue - vestedCost);

  return {
    sharePrice,
    equityValue,
    costToExercise,
    profit: grossProfit > 0 ? grossProfit : 0,
    ownership: (inputs.shares / safeTotalShares) * 100,
    vestedPercentage,
    vestedShares,
    vestedProfit,
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
  planType?: EquityPlanType;
  // --- NUEVO: Parámetros de Vesting ---
  grantDate: string; // Formato "YYYY-MM-DD"
  vestingMonths: number; // Típicamente 48 (4 años)
  cliffMonths: number; // Típicamente 12 (1 año)
}
