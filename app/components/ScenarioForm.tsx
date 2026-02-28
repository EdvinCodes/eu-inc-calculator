// app/components/ScenarioForm.tsx
"use client";
import {
  Calculator,
  PieChart as PieChartIcon,
  Users,
  Sparkles,
  Calendar,
  Hourglass,
} from "lucide-react";
import { formatCurrency, type EquityPlanType } from "@/app/lib/calculations";

interface Props {
  shares: number;
  strikePrice: number;
  companyValuation: number;
  totalShares: number;
  planType: EquityPlanType;
  grantDate: string;
  vestingMonths: number;
  cliffMonths: number;
  expectedDilution: number;
  onChange: (
    field:
      | "shares"
      | "strikePrice"
      | "companyValuation"
      | "totalShares"
      | "planType"
      | "grantDate"
      | "vestingMonths"
      | "cliffMonths"
      | "expectedDilution",
    value: number | string,
  ) => void;
}

const MIN_VAL = 1_000_000;
const MAX_VAL = 100_000_000;

export default function ScenarioForm({
  shares,
  strikePrice,
  companyValuation,
  totalShares,
  planType,
  grantDate,
  vestingMonths,
  cliffMonths,
  expectedDilution,
  onChange,
}: Props) {
  const rawPercentage =
    ((companyValuation - MIN_VAL) / (MAX_VAL - MIN_VAL)) * 100;
  const sliderPercentage = Math.max(0, Math.min(rawPercentage, 100));

  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white/60 relative overflow-hidden group">
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

      <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-slate-800">
        <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
          <Calculator className="w-5 h-5 text-blue-600" />
        </div>
        Scenario Configuration
      </h2>

      <div className="flex items-center justify-between mb-6">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Equity Plan Type
        </div>
        <div className="inline-flex items-center bg-slate-100 rounded-full p-1">
          <button
            type="button"
            onClick={() => onChange("planType", "ESOP")}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
              planType === "ESOP" ? "bg-slate-900 text-white" : "text-slate-600"
            }`}
          >
            ESOP
          </button>
          <button
            type="button"
            onClick={() => onChange("planType", "PHANTOM")}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
              planType === "PHANTOM"
                ? "bg-slate-900 text-white"
                : "text-slate-600"
            }`}
          >
            Phantom
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="group/input">
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2 group-hover/input:text-blue-600 transition-colors">
              <PieChartIcon className="w-4 h-4 text-slate-400 group-hover/input:text-blue-500" />
              Your Options
            </label>
            <input
              type="number"
              value={shares}
              onChange={(e) => onChange("shares", Number(e.target.value))}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-mono text-lg text-slate-900 shadow-sm hover:border-slate-300"
            />
          </div>
          <div className="group/input">
            <label className="block text-sm font-bold text-slate-700 mb-2 group-hover/input:text-blue-600 transition-colors">
              Strike Price (€)
            </label>
            <input
              type="number"
              step="0.01"
              value={strikePrice}
              onChange={(e) => onChange("strikePrice", Number(e.target.value))}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-mono text-lg text-slate-900 shadow-sm hover:border-slate-300"
            />
          </div>
        </div>

        {/* Row 2: Pool & Dilution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="group/input">
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2 group-hover/input:text-blue-600 transition-colors">
              <Users className="w-4 h-4 text-slate-400 group-hover/input:text-blue-500" />
              Fully Diluted Shares
            </label>
            <input
              type="number"
              value={totalShares}
              onChange={(e) => onChange("totalShares", Number(e.target.value))}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-mono text-lg text-slate-900 shadow-sm hover:border-slate-300"
            />
          </div>
          <div className="group/input">
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2 group-hover/input:text-rose-500 transition-colors">
              Future Dilution (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="99"
                value={expectedDilution}
                onChange={(e) =>
                  onChange("expectedDilution", Number(e.target.value))
                }
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all font-mono text-lg text-slate-900 shadow-sm hover:border-slate-300"
              />
              <span className="absolute right-4 top-4 font-bold text-slate-400">
                %
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: Vesting Schedule */}
        <div className="pt-6 border-t border-slate-100/50">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            Vesting Schedule
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="group/input">
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide group-hover/input:text-blue-600 transition-colors">
                Grant Date
              </label>
              <input
                type="date"
                value={grantDate}
                onChange={(e) => onChange("grantDate", e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-mono text-sm text-slate-900 shadow-sm hover:border-slate-300"
              />
            </div>
            <div className="group/input">
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide group-hover/input:text-blue-600 transition-colors flex items-center gap-1">
                <Hourglass className="w-3 h-3" /> Vesting (Months)
              </label>
              <input
                type="number"
                value={vestingMonths}
                onChange={(e) =>
                  onChange("vestingMonths", Number(e.target.value))
                }
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-mono text-sm text-slate-900 shadow-sm hover:border-slate-300"
              />
            </div>
            <div className="group/input">
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide group-hover/input:text-blue-600 transition-colors">
                Cliff (Months)
              </label>
              <input
                type="number"
                value={cliffMonths}
                onChange={(e) =>
                  onChange("cliffMonths", Number(e.target.value))
                }
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-mono text-sm text-slate-900 shadow-sm hover:border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Valuation Slider */}
        <div className="pt-8 border-t border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-bold text-slate-900 flex items-center gap-2">
              Exit Valuation <Sparkles className="w-4 h-4 text-amber-400" />
            </label>
            <span className="text-[10px] font-bold tracking-wide uppercase text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md">
              Hypothesis
            </span>
          </div>

          <div className="relative mb-6 group/val">
            <span className="absolute left-5 top-5 text-slate-400 text-xl pointer-events-none group-focus-within/val:text-blue-500 transition-colors">
              €
            </span>
            <input
              type="number"
              value={companyValuation}
              onChange={(e) =>
                onChange("companyValuation", Number(e.target.value))
              }
              className="w-full p-5 pl-12 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-mono text-3xl font-bold text-blue-900 shadow-sm text-right"
            />
          </div>

          <input
            type="range"
            min={MIN_VAL}
            max={MAX_VAL}
            step="1000000"
            value={companyValuation}
            onChange={(e) =>
              onChange("companyValuation", Number(e.target.value))
            }
            className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600
              [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110"
            style={{
              background: `linear-gradient(to right, #2563eb ${sliderPercentage}%, #e2e8f0 ${sliderPercentage}%)`,
            }}
          />
          <div className="flex justify-between text-xs text-slate-500 font-bold mt-3 uppercase tracking-wide">
            <span>€1M (Seed)</span>
            <span>{formatCurrency(companyValuation, true)}</span>
            <span>€100M (Series B/C)</span>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-slate-500">
          {planType === "PHANTOM"
            ? "Phantom: no real shares issued, no exercise cost – you receive a cash bonus linked to exit value."
            : "ESOP: real options with exercise cost, potential higher upside but requires upfront cash."}
        </p>
      </div>
    </div>
  );
}
