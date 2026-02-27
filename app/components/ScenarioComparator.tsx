"use client";

import { useMemo } from "react";
import { BarChart3, Sparkles } from "lucide-react";
import {
  calculateScenario,
  type LabeledScenario,
  formatCurrency,
} from "@/app/lib/calculations";

interface Props {
  scenarios: LabeledScenario[];
}

export default function ScenarioComparator({ scenarios }: Props) {
  const computed = useMemo(
    () =>
      scenarios.map((s) => ({
        ...s,
        results: calculateScenario(s.inputs),
      })),
    [scenarios],
  );

  return (
    <section className="mt-10 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-xl shadow-slate-200/40 p-6 lg:p-8">
      <header className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-100">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Scenario Comparator
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" /> Multi-Round
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare ownership and profit across different exit valuations or
              rounds.
            </p>
          </div>
        </div>
      </header>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <table className="min-w-full text-left text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="text-xs text-slate-500 uppercase tracking-wide">
              <th className="px-4 py-2">Scenario</th>
              <th className="px-4 py-2">Exit Valuation</th>
              <th className="px-4 py-2">Ownership</th>
              <th className="px-4 py-2">Gross Equity</th>
              <th className="px-4 py-2">Exercise Cost</th>
              <th className="px-4 py-2">Net Profit</th>
            </tr>
          </thead>
          <tbody>
            {computed.map((s) => (
              <tr
                key={s.id}
                className="bg-slate-50/80 hover:bg-slate-100/80 transition-colors rounded-2xl"
              >
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {s.label}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700">
                  {formatCurrency(s.inputs.companyValuation, true)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700">
                  {s.results.ownership.toFixed(2)}%
                </td>
                <td className="px-4 py-3 font-mono text-xs text-emerald-700">
                  {formatCurrency(s.results.equityValue, true)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-rose-600">
                  {formatCurrency(s.results.costToExercise, true)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-900 font-bold">
                  {formatCurrency(s.results.profit, true)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
