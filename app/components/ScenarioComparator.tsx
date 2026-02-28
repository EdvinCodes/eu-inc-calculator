// app/components/ScenarioComparator.tsx
"use client";

import { useMemo } from "react";
import { BarChart3, Sparkles, Edit3 } from "lucide-react";
import {
  calculateScenario,
  type LabeledScenario,
  formatCurrency,
  type CurrencyType,
} from "@/app/lib/calculations";

interface Props {
  scenarios: LabeledScenario[];
  currency: CurrencyType;
  onUpdateScenario: (
    id: string,
    newValuation: number,
    newLabel?: string,
  ) => void;
}

export default function ScenarioComparator({
  scenarios,
  currency,
  onUpdateScenario,
}: Props) {
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
                <Sparkles className="w-3 h-3" /> Editable
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Model your own Seed / Series A / Secondary scenarios.
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
                  {s.editable ? (
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-3 h-3 text-slate-400" />
                      <input
                        type="text"
                        defaultValue={s.label}
                        onBlur={(e) =>
                          onUpdateScenario(
                            s.id,
                            s.inputs.companyValuation,
                            e.target.value,
                          )
                        }
                        className="bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 outline-none text-xs px-0.5 py-0.5"
                      />
                    </div>
                  ) : (
                    s.label
                  )}
                </td>

                <td className="px-4 py-3 font-mono text-xs text-slate-700">
                  {s.editable ? (
                    <input
                      type="number"
                      min={0}
                      step={1_000_000}
                      defaultValue={s.inputs.companyValuation}
                      onBlur={(e) =>
                        onUpdateScenario(
                          s.id,
                          Number(e.target.value) || 0,
                          s.label,
                        )
                      }
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  ) : (
                    formatCurrency(s.inputs.companyValuation, currency, true)
                  )}
                </td>

                <td className="px-4 py-3 font-mono text-xs text-slate-700">
                  {s.results.ownership.toFixed(2)}%
                </td>
                <td className="px-4 py-3 font-mono text-xs text-emerald-700">
                  {formatCurrency(s.results.equityValue, currency, true)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-rose-600">
                  {formatCurrency(s.results.costToExercise, currency, true)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-900 font-bold">
                  {formatCurrency(s.results.profit, currency, true)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
