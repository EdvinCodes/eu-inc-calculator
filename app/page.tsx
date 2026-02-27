// app/page.tsx
"use client";
import { useState, useCallback } from "react";
import { ShieldCheck } from "lucide-react";
import { calculateScenario, cloneScenario } from "@/app/lib/calculations";
import ScenarioForm from "@/app/components/ScenarioForm";
import ResultsPanel from "@/app/components/ResultsPanel";
import TaxEstimator from "@/app/components/TaxEstimator";
import ScenarioComparator from "@/app/components/ScenarioComparator";

const DEFAULTS = {
  shares: 1000,
  strikePrice: 0.5,
  companyValuation: 10_000_000,
  totalShares: 1_000_000,
};

export default function Home() {
  const [inputs, setInputs] = useState(DEFAULTS);

  const handleChange = useCallback((field: string, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const results = calculateScenario(inputs);

  const scenarios = [
    {
      id: "seed",
      label: "Seed €10M",
      inputs: cloneScenario(inputs, { companyValuation: 10_000_000 }),
    },
    {
      id: "series-a",
      label: "Series A €30M",
      inputs: cloneScenario(inputs, { companyValuation: 30_000_000 }),
    },
    {
      id: "series-b",
      label: "Series B €100M",
      inputs: cloneScenario(inputs, { companyValuation: 100_000_000 }),
    },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
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

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          <div className="lg:col-span-7">
            <ScenarioForm {...inputs} onChange={handleChange} />
          </div>
          <div className="lg:col-span-5 sticky top-8">
            <ResultsPanel results={results} />
          </div>
        </div>

        {/* SCENARIO COMPARATOR */}
        <ScenarioComparator scenarios={scenarios} />

        {/* TAX ESTIMATOR SECTION */}
        <div className="mt-8 relative z-10">
          <TaxEstimator grossProfit={results.profit} />
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
