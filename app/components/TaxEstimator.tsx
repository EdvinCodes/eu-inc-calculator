// app/components/TaxEstimator.tsx
"use client";
import { useState } from "react";
import { ShieldCheck, ChevronDown, Info, Pencil } from "lucide-react";
import {
  TAX_JURISDICTIONS,
  calculateTax,
  type TaxJurisdiction,
} from "@/app/lib/taxRates";
import { formatCurrency, type CurrencyType } from "@/app/lib/calculations";

interface Props {
  grossProfit: number;
  vestedProfit: number;
  currency: CurrencyType;
}

export default function TaxEstimator({
  grossProfit,
  vestedProfit,
  currency,
}: Props) {
  const [selected, setSelected] = useState<TaxJurisdiction>(
    TAX_JURISDICTIONS[0],
  );
  const [customRate, setCustomRate] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [useVested, setUseVested] = useState(false);

  const effectiveRate =
    selected.code === "OTHER" && customRate !== ""
      ? Number(customRate)
      : undefined;

  const amountToTax = useVested ? vestedProfit : grossProfit;
  const tax = calculateTax(amountToTax, selected, effectiveRate);

  const netBarWidth =
    amountToTax > 0 ? Math.max((tax.netAfterTax / amountToTax) * 100, 0) : 0;
  const taxBarWidth = 100 - netBarWidth;
  const symbol = currency === "USD" ? "$" : currency === "GBP" ? "£" : "€";

  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white/60 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800 relative z-10">
        <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
        </div>
        Tax Estimator by Country
      </h2>

      <div className="flex items-center justify-between mb-6 bg-slate-50 p-2 rounded-xl border border-slate-200 z-20 relative">
        <span className="text-sm font-bold text-slate-700 pl-2">
          Calculate tax on:
        </span>
        <div className="flex bg-slate-200/50 p-1 rounded-lg">
          <button
            onClick={() => setUseVested(false)}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              !useVested
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Total Profit
          </button>
          <button
            onClick={() => setUseVested(true)}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              useVested
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Vested Today
          </button>
        </div>
      </div>

      <div className="relative mb-6 z-20">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-400 transition-colors font-medium text-slate-800"
        >
          <span className="flex items-center gap-3 text-lg">
            <span>{selected.flag}</span>
            <span>{selected.name}</span>
            {selected.taxFreeAllowance > 0 && (
              <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                {selected.taxFreeAllowance >= 1000
                  ? `${symbol}${selected.taxFreeAllowance / 1000}k Exempt`
                  : `${symbol}${selected.taxFreeAllowance} Exempt`}
              </span>
            )}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50">
            {TAX_JURISDICTIONS.map((j) => (
              <button
                key={j.code}
                onClick={() => {
                  setSelected(j);
                  setIsOpen(false);
                  setCustomRate("");
                }}
                className={`w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left ${
                  selected.code === j.code
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-700"
                }`}
              >
                <span className="text-xl">{j.flag}</span>
                <span className="flex-1 font-medium">{j.name}</span>
                <span className="text-sm font-mono text-slate-500">
                  {j.brackets ? "Progressive" : `${j.capitalGainsTax}%`}
                </span>
                {j.taxFreeAllowance > 0 && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    {j.taxFreeAllowance >= 1000
                      ? `${symbol}${j.taxFreeAllowance / 1000}k Exempt`
                      : `${symbol}${j.taxFreeAllowance} Exempt`}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {selected.code === "OTHER" && (
        <div className="mb-6 flex items-center gap-3">
          <Pencil className="w-4 h-4 text-slate-400" />
          <input
            type="number"
            min={0}
            max={100}
            step={0.5}
            placeholder="Enter your tax rate %"
            value={customRate}
            onChange={(e) => setCustomRate(e.target.value)}
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-mono text-lg text-slate-900"
          />
          <span className="font-bold text-slate-500 text-lg">%</span>
        </div>
      )}

      <div className="flex items-start gap-2 mb-8 p-3 bg-amber-50 border border-amber-100 rounded-xl">
        <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700 leading-relaxed">
          {selected.notes}
        </p>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100 mb-6">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500 rounded-l-full"
            style={{ width: `${netBarWidth}%` }}
          />
          <div
            className="h-full bg-gradient-to-r from-rose-400 to-red-500 transition-all duration-500 rounded-r-full"
            style={{ width: `${taxBarWidth}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">
              Net After Tax
            </p>
            <p className="font-mono text-2xl font-extrabold text-emerald-700">
              {formatCurrency(tax.netAfterTax, currency)}
            </p>
          </div>
          <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl">
            <p className="text-xs font-bold text-rose-500 uppercase tracking-wide mb-1">
              Tax Paid
            </p>
            <p className="font-mono text-2xl font-extrabold text-rose-600">
              {formatCurrency(tax.taxPaid, currency)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-500 font-medium">
            Effective tax rate
          </p>
          <p className="font-mono font-bold text-slate-800 text-lg">
            {tax.effectiveRate.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
