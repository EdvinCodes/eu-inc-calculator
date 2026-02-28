// app/components/ResultsPanel.tsx
"use client";
import dynamic from "next/dynamic"; // 1. Añade esta importación
import { TrendingUp, Info, ArrowRight, Share2 } from "lucide-react";
import {
  ScenarioResults,
  formatCurrency,
  type EquityPlanType,
} from "@/app/lib/calculations";

// 2. Sustituye la importación normal de EquityPieChart por esta importación dinámica
const EquityPieChart = dynamic(() => import("./EquityPieChart"), {
  ssr: false,
  loading: () => (
    <div className="h-48 w-full mb-8 animate-pulse bg-slate-800/50 rounded-full" />
  ), // Skeleton loader bonito
});

interface Props {
  results: ScenarioResults;
  planType: EquityPlanType;
  inputs: {
    shares: number;
    strikePrice: number;
    companyValuation: number;
    totalShares: number;
    planType: EquityPlanType;
    grantDate: string;
    vestingMonths: number;
    cliffMonths: number;
  };
}

export default function ResultsPanel({ results, planType, inputs }: Props) {
  const handleShare = () => {
    const params = new URLSearchParams();
    params.set("shares", inputs.shares.toString());
    params.set("strike", inputs.strikePrice.toString());
    params.set("pool", inputs.totalShares.toString());
    params.set("val", inputs.companyValuation.toString());
    params.set("plan", planType);
    // --- NUEVOS PARÁMETROS ---
    if (inputs.grantDate) params.set("grantDate", inputs.grantDate);
    if (inputs.vestingMonths)
      params.set("vestingMonths", inputs.vestingMonths.toString());
    if (inputs.cliffMonths)
      params.set("cliffMonths", inputs.cliffMonths.toString());

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      // Toast visual
      const toast = document.createElement("div");
      toast.textContent = "📋 URL copied to clipboard!";
      toast.className =
        "fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 backdrop-blur-sm border border-emerald-600 font-medium animate-in slide-in-from-top-2 duration-300";
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, 3000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Dark Card */}
      <div className="bg-[#0f172a] text-white p-8 rounded-[2rem] shadow-2xl relative border border-slate-800 ring-1 ring-white/10">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

        <h2 className="text-xs font-bold text-indigo-300/80 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 relative z-10">
          <TrendingUp className="w-3 h-3" /> Estimated Net Profit
        </h2>

        <p className="text-[11px] text-slate-300 mb-4">
          {planType === "PHANTOM"
            ? "Phantom shares: cash-settled bonus linked to company value, no real ownership or dilution."
            : "ESOP: actual equity with exercise cost and potential capital gains upside."}
        </p>

        <div className="relative z-10">
          <div className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 mb-8 tracking-tight">
            {formatCurrency(results.profit)}
          </div>
        </div>

        {/* --- NUEVA BARRA DE VESTING --- */}
        <div className="mt-8 mb-6 relative z-10 bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Vested Status
              </p>
              <p className="font-mono text-sm text-emerald-400 font-bold">
                {results.vestedPercentage?.toFixed(0) || 0}% Vested
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Liquid Value Today
              </p>
              <p className="font-mono text-sm text-white font-bold">
                {formatCurrency(results.vestedProfit || 0)}
              </p>
            </div>
          </div>

          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 ease-out"
              style={{ width: `${results.vestedPercentage || 0}%` }}
            />
          </div>

          {(results.vestedPercentage || 0) < 100 && (
            <p className="text-[11px] text-slate-400 mt-3 text-right">
              If you leave today, you lose{" "}
              <span className="text-rose-400 font-bold">
                {formatCurrency(
                  (results.profit || 0) - (results.vestedProfit || 0),
                )}
              </span>
            </p>
          )}
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
            <p
              className={`font-mono text-lg font-medium ${
                results.costToExercise === 0
                  ? "text-slate-500"
                  : "text-rose-400"
              }`}
            >
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

      {/* Share Button */}
      <div className="mt-4 pt-4 border-t border-slate-200/50">
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 px-6 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <Share2 className="w-5 h-5" />
          <span>📋 Share this scenario</span>
        </button>
      </div>
    </div>
  );
}
