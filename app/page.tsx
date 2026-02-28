// app/page.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import {
  cloneScenario,
  type LabeledScenario,
  calculateScenario,
  type EquityPlanType,
  type CurrencyType,
} from "@/app/lib/calculations";
import ScenarioForm from "@/app/components/ScenarioForm";
import ResultsPanel from "@/app/components/ResultsPanel";
import TaxEstimator from "@/app/components/TaxEstimator";
import ScenarioComparator from "@/app/components/ScenarioComparator";

const DEFAULTS = {
  shares: 1000,
  strikePrice: 0.5,
  companyValuation: 10_000_000,
  totalShares: 1_000_000,
  planType: "ESOP" as EquityPlanType,
  grantDate: "2024-01-01",
  vestingMonths: 48,
  cliffMonths: 12,
  expectedDilution: 0,
  currency: "EUR" as CurrencyType,
};

export default function Home() {
  const [inputs, setInputs] = useState(DEFAULTS);
  const [scenarios, setScenarios] = useState<LabeledScenario[]>(() => [
    {
      id: "seed",
      label: "Seed €10M",
      editable: true,
      inputs: cloneScenario(DEFAULTS, { companyValuation: 10_000_000 }),
    },
    {
      id: "series-a",
      label: "Series A €30M",
      editable: true,
      inputs: cloneScenario(DEFAULTS, { companyValuation: 30_000_000 }),
    },
    {
      id: "series-b",
      label: "Series B €100M",
      editable: true,
      inputs: cloneScenario(DEFAULTS, { companyValuation: 100_000_000 }),
    },
  ]);

  const handleChange = useCallback(
    (
      field:
        | "shares"
        | "strikePrice"
        | "companyValuation"
        | "totalShares"
        | "planType"
        | "grantDate"
        | "vestingMonths"
        | "cliffMonths"
        | "expectedDilution"
        | "currency",
      value: number | string,
    ) => {
      // 1. EFECTO SECUNDARIO FUERA DEL SETSTATE (Esto previene el crash del Router)
      const params = new URLSearchParams(window.location.search);
      params.set(field, value.toString());
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${params}`,
      );

      // 2. ACTUALIZACIÓN DEL ESTADO
      setInputs((prev) => {
        const newInputs = { ...prev, [field]: value as never };

        localStorage.setItem(
          "equity-simulator",
          JSON.stringify({ inputs: newInputs, timestamp: Date.now() }),
        );

        return newInputs;
      });

      // 3. SINCRONIZACIÓN CON LOS ESCENARIOS DE LA TABLA
      if (
        field === "shares" ||
        field === "strikePrice" ||
        field === "totalShares" ||
        field === "planType" ||
        field === "grantDate" ||
        field === "vestingMonths" ||
        field === "cliffMonths" ||
        field === "expectedDilution" ||
        field === "currency"
      ) {
        setScenarios((currentScenarios) =>
          currentScenarios.map((s) => ({
            ...s,
            inputs: {
              ...s.inputs,
              [field]: value as never,
            },
          })),
        );
      }
    },
    [],
  );

  const handleUpdateScenario = useCallback(
    (id: string, newValuation: number, newLabel?: string) => {
      setScenarios((prev) => {
        const updatedScenarios = prev.map((s) =>
          s.id === id
            ? {
                ...s,
                label: newLabel ?? s.label,
                inputs: {
                  ...inputs,
                  companyValuation: newValuation > 0 ? newValuation : 0,
                },
              }
            : s,
        );

        const newScenariosData = updatedScenarios.map((s) => ({
          id: s.id,
          label: s.label,
          valuation: s.inputs.companyValuation,
        }));

        localStorage.setItem(
          "equity-simulator-scenarios",
          JSON.stringify(newScenariosData),
        );

        return updatedScenarios;
      });
    },
    [inputs],
  );

  const results = calculateScenario(inputs);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loadedInputs: Partial<typeof DEFAULTS> = {};

    const paramMap: Record<string, keyof typeof DEFAULTS> = {
      shares: "shares",
      strike: "strikePrice",
      pool: "totalShares",
      val: "companyValuation",
      plan: "planType",
      dil: "expectedDilution",
      curr: "currency",
    };

    Object.entries(paramMap).forEach(([paramKey, fieldKey]) => {
      const value = params.get(paramKey);
      if (value !== null) {
        if (fieldKey === "strikePrice") {
          loadedInputs[fieldKey] = parseFloat(value) as never;
        } else if (
          fieldKey === "planType" ||
          fieldKey === "grantDate" ||
          fieldKey === "currency"
        ) {
          loadedInputs[fieldKey] = value as never;
        } else {
          loadedInputs[fieldKey] = Number(value) as never;
        }
      }
    });

    if (Object.keys(loadedInputs).length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputs({ ...DEFAULTS, ...loadedInputs });
    }

    const savedScenarios = localStorage.getItem("equity-simulator-scenarios");
    if (savedScenarios) {
      try {
        const parsed = JSON.parse(savedScenarios) as Array<{
          id: string;
          label: string;
          valuation: number;
        }>;

        setScenarios((current) =>
          current.map((s) => {
            const saved = parsed.find((p) => p.id === s.id);
            return saved
              ? {
                  ...s,
                  label: saved.label,
                  inputs: {
                    ...s.inputs,
                    companyValuation: saved.valuation,
                  },
                }
              : s;
          }),
        );
      } catch (e) {
        console.warn("Failed to load saved scenarios:", e);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 relative z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur border border-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm mb-6 cursor-default">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> EU Inc. Protocol
            Ready
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl mb-6">
            EU Inc.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Equity Simulator
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Forecast the true value of your Stock Options. Financial precision
            for the new era of European startups.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          <div className="lg:col-span-7">
            <ScenarioForm {...inputs} onChange={handleChange} />
          </div>
          <div className="lg:col-span-5 sticky top-8">
            <ResultsPanel
              results={results}
              planType={inputs.planType}
              inputs={inputs}
              currency={inputs.currency}
            />
          </div>
        </div>

        <ScenarioComparator
          scenarios={scenarios}
          onUpdateScenario={handleUpdateScenario}
          currency={inputs.currency}
        />

        <div className="mt-8 relative z-10">
          <TaxEstimator
            grossProfit={results.profit}
            vestedProfit={results.vestedProfit}
            currency={inputs.currency}
          />
        </div>
      </div>

      <footer className="mt-20 py-8 text-center text-slate-400 text-xs border-t border-slate-200/50">
        <div className="flex justify-center gap-6 mb-2">
          <a href="#" className="hover:text-slate-600 transition">
            Terms of Service
          </a>
          <a href="#" className="hover:text-slate-600 transition">
            Privacy Policy
          </a>
          <a
            href="mailto:edvintrabajo@gmail.com"
            className="hover:text-slate-600 transition"
          >
            Contact Support
          </a>
        </div>
        <p>© 2026 EU Inc. Calculator. Not financial advice.</p>
      </footer>
    </main>
  );
}
