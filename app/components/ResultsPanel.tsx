// app/components/ResultsPanel.tsx
"use client";
import { TrendingUp, Info, ArrowRight } from "lucide-react";
import { ScenarioResults, formatCurrency } from "@/app/lib/calculations";
import EquityPieChart from "./EquityPieChart";

interface Props {
  results: ScenarioResults;
}

export default function ResultsPanel({ results }: Props) {
  return (
    <div className="space-y-6">
      {/* Dark Card */}
      <div className="bg-[#0f172a] text-white p-8 rounded-[2rem] shadow-2xl relative border border-slate-800 ring-1 ring-white/10">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

        <h2 className="text-xs font-bold text-indigo-300/80 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 relative z-10">
          <TrendingUp className="w-3 h-3" /> Estimated Net Profit
        </h2>

        <div className="relative z-10">
          <div className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 mb-8 tracking-tight">
            {formatCurrency(results.profit)}
          </div>
        </div>

        <EquityPieChart
          profit={results.profit}
          costToExercise={results.costToExercise}
          ownership={results.ownership}
        />

        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5 relative z-10">
          <div>
            <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">
              Gross Equity
            </p>
            <p className="font-mono text-lg text-white font-medium">
              {formatCurrency(results.equityValue, true)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">
              Exercise Cost
            </p>
            <p className="font-mono text-lg text-rose-400 font-medium">
              -{formatCurrency(results.costToExercise, true)}
            </p>
          </div>
        </div>
      </div>

      {/* CTA Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-[2px] rounded-[24px] shadow-lg shadow-blue-900/20 hover:shadow-blue-600/30 transition-shadow">
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[22px] text-white relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Info className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-lg leading-tight">
              Tax Reality Check 2026
            </h3>
          </div>
          <p className="text-blue-50 text-sm mb-6 leading-relaxed opacity-90">
            Did you know tax authorities can claim up to{" "}
            <strong className="text-white bg-blue-500/50 px-1 rounded">
              45%
            </strong>{" "}
            of this profit?
          </p>
          <a
            href="https://eu-inc-tools.lemonsqueezy.com/checkout/buy/a6857a23-cf9b-4c66-b3f9-91eeb8c30a13"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white text-blue-700 py-4 px-6 rounded-xl font-bold shadow-xl hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between group cursor-pointer"
          >
            <span className="flex items-center gap-2">
              Get the Playbook
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="bg-blue-100 text-blue-800 text-xs font-extrabold py-1 px-2.5 rounded-md border border-blue-200">
              €10
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
