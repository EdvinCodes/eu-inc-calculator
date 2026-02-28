// app/components/ResultsPanel.tsx
"use client";
import dynamic from "next/dynamic";
import { TrendingUp, Share2, AlertTriangle } from "lucide-react";
import {
  ScenarioResults,
  formatCurrency,
  type EquityPlanType,
  type CurrencyType,
} from "@/app/lib/calculations";

const EquityPieChart = dynamic(() => import("./EquityPieChart"), {
  ssr: false,
  loading: () => (
    <div className="h-48 w-full mb-8 flex items-center justify-center">
      <div className="w-32 h-32 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  ),
});

interface Props {
  results: ScenarioResults;
  planType: EquityPlanType;
  currency: CurrencyType;
  inputs: {
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
  };
}

export default function ResultsPanel({
  results,
  planType,
  currency,
  inputs,
}: Props) {
  const handleShare = () => {
    const params = new URLSearchParams();
    params.set("shares", inputs.shares.toString());
    params.set("strike", inputs.strikePrice.toString());
    params.set("pool", inputs.totalShares.toString());
    params.set("val", inputs.companyValuation.toString());
    params.set("plan", planType);
    if (inputs.grantDate) params.set("grantDate", inputs.grantDate);
    if (inputs.vestingMonths)
      params.set("vestingMonths", inputs.vestingMonths.toString());
    if (inputs.cliffMonths)
      params.set("cliffMonths", inputs.cliffMonths.toString());
    if (inputs.expectedDilution > 0)
      params.set("dil", inputs.expectedDilution.toString());
    params.set("curr", currency);

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
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
      <div className="bg-[#0f172a] text-white p-8 rounded-[2rem] shadow-2xl relative border border-slate-800 ring-1 ring-white/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

        <h2 className="text-xs font-bold text-indigo-300/80 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 relative z-10">
          <TrendingUp className="w-3 h-3" /> Estimated Net Profit
        </h2>

        <p className="text-[11px] text-slate-400 mb-6">
          {planType === "PHANTOM"
            ? "Phantom shares: cash-settled bonus linked to company value, no real ownership or dilution."
            : "ESOP: actual equity with exercise cost and potential capital gains upside."}
        </p>

        <div className="relative z-10">
          <div className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 mb-2 tracking-tight">
            {formatCurrency(results.profit, currency)}
          </div>
        </div>

        <div className="mt-6 mb-8 relative z-10 bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50">
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
                {formatCurrency(results.vestedProfit || 0, currency)}
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
                  currency,
                )}
              </span>
            </p>
          )}
        </div>

        {inputs.expectedDilution > 0 && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl flex items-start gap-3 relative z-10">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-rose-300">
                Dilution Impact Applied
              </p>
              <p className="text-[11px] text-rose-200/70 mt-0.5">
                Your ownership dropped from{" "}
                <span className="font-mono font-bold text-white">
                  {results.originalOwnership.toFixed(3)}%
                </span>{" "}
                to{" "}
                <span className="font-mono font-bold text-white">
                  {results.ownership.toFixed(3)}%
                </span>{" "}
                due to the projected {inputs.expectedDilution}% VC dilution.
              </p>
            </div>
          </div>
        )}

        <EquityPieChart
          profit={results.profit}
          costToExercise={results.costToExercise}
          ownership={results.ownership}
          currency={currency}
        />

        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5 relative z-10">
          <div>
            <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">
              Gross Equity
            </p>
            <p className="font-mono text-lg text-white font-medium">
              {formatCurrency(results.equityValue, currency, true)}
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
              -{formatCurrency(results.costToExercise, currency, true)}
            </p>
          </div>
        </div>
      </div>

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
