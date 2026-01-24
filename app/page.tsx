"use client";
import React, { useState } from "react";
import {
  Calculator,
  TrendingUp,
  Info,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  PieChart as PieChartIcon,
  Users,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// --- UTILS (Defined outside to prevent re-renders) ---
const formatCurrency = (val: number, compact = false) => {
  // We use 'en-IE' (Ireland) to get English format with Euro (€1,000.00)
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(val);
};

// --- TOOLTIP COMPONENT (Defined outside) ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-3 rounded-xl shadow-xl text-white text-sm">
        <p className="font-medium" style={{ color: data.color }}>
          {data.name}
        </p>
        <p className="text-lg font-bold font-mono">
          {formatCurrency(data.value)}
        </p>
      </div>
    );
  }
  return null;
};

// --- MAIN COMPONENT ---
export default function Home() {
  // --- STATE ---
  const [shares, setShares] = useState(1000);
  const [strikePrice, setStrikePrice] = useState(0.5);
  const [companyValuation, setCompanyValuation] = useState(10000000);
  const [totalShares, setTotalShares] = useState(1000000);

  // --- LOGIC (Derived State) ---
  const safeTotalShares = totalShares > 0 ? totalShares : 1;
  const sharePrice = companyValuation / safeTotalShares;
  const equityValue = shares * sharePrice;
  const costToExercise = shares * strikePrice;
  const grossProfit = equityValue - costToExercise;

  const results = {
    equityValue,
    costToExercise,
    profit: grossProfit > 0 ? grossProfit : 0,
    ownership: (shares / safeTotalShares) * 100,
  };

  const chartData = [
    { name: "Net Profit", value: results.profit, color: "#10b981" }, // Emerald 500
    { name: "Exercise Cost", value: results.costToExercise, color: "#f43f5e" }, // Rose 500
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto animate-[fade-in_0.6s_ease-out_both]">
        {/* HEADER */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm mb-6">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> EU Inc. Protocol
            Ready
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-4">
            EU Inc.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Equity Simulator
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Forecast the true value of your Stock Options. Financial precision
            for the new era of European startups.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: INPUTS */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-white/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl pointer-events-none"></div>

              <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-slate-800">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calculator className="w-5 h-5 text-blue-600" />
                </div>
                Scenario Configuration
              </h2>

              <div className="space-y-6">
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <PieChartIcon className="w-4 h-4 text-slate-400" /> Your
                      Options
                    </label>
                    <input
                      type="number"
                      value={shares}
                      onChange={(e) => setShares(Number(e.target.value))}
                      className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition font-mono text-lg text-slate-900 shadow-sm hover:border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Strike Price (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={strikePrice}
                      onChange={(e) => setStrikePrice(Number(e.target.value))}
                      className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition font-mono text-lg text-slate-900 shadow-sm hover:border-slate-300"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" /> Fully Diluted
                    Shares (Pool)
                  </label>
                  <input
                    type="number"
                    value={totalShares}
                    onChange={(e) => setTotalShares(Number(e.target.value))}
                    className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition font-mono text-lg text-slate-900 shadow-sm hover:border-slate-300"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Required to calculate your actual ownership percentage.
                  </p>
                </div>

                {/* Valuation Input */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-900 flex items-center gap-2">
                      Exit Valuation{" "}
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </label>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      Hypothesis
                    </span>
                  </div>

                  <div className="relative mb-4">
                    <span className="absolute left-4 top-4 text-slate-400 text-xl">
                      €
                    </span>
                    <input
                      type="number"
                      value={companyValuation}
                      onChange={(e) =>
                        setCompanyValuation(Number(e.target.value))
                      }
                      className="w-full p-4 pl-10 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none transition font-mono text-2xl font-bold text-blue-900 shadow-sm text-right"
                    />
                  </div>
                  <input
                    type="range"
                    min="1000000"
                    max="100000000"
                    step="1000000"
                    value={companyValuation}
                    onChange={(e) =>
                      setCompanyValuation(Number(e.target.value))
                    }
                    className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-xs text-slate-500 font-medium mt-2 px-1">
                    <span>€1M (Seed)</span>
                    <span>€100M (Series B/C)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: RESULTS */}
          <div className="lg:col-span-5 space-y-6 sticky top-12">
            {/* Dark Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden border border-slate-800/50 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <h2 className="text-sm font-bold text-blue-200/80 uppercase tracking-widest mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Estimated Net Profit
              </h2>
              <div className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 mb-6 tracking-tight">
                {formatCurrency(results.profit)}
              </div>

              <div className="h-40 w-full mb-8 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={6}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={8}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          className="drop-shadow-lg"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-1">
                  <span className="text-slate-400 text-xs font-medium uppercase">
                    Ownership
                  </span>
                  <span className="text-white text-lg font-bold">
                    {results.ownership.toFixed(3)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-700/50 relative z-10">
                <div>
                  <p className="text-xs font-medium text-slate-400 mb-1">
                    Gross Equity
                  </p>
                  <p className="font-mono text-xl text-white font-semibold flex items-center gap-2">
                    {formatCurrency(results.equityValue, true)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-400 mb-1">
                    Exercise Cost
                  </p>
                  <p className="font-mono text-xl text-rose-300 font-semibold">
                    -{formatCurrency(results.costToExercise, true)}
                  </p>
                </div>
              </div>
            </div>

            {/* MONETIZATION CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-1 rounded-3xl shadow-lg shadow-blue-900/20 transform transition hover:-translate-y-1">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-[22px] text-white relative overflow-hidden h-full">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Info className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-lg">
                      Tax Reality Check 2026
                    </h3>
                  </div>
                  <p className="text-blue-100 text-sm mb-6 leading-relaxed pr-4">
                    Did you know tax authorities can claim up to{" "}
                    <strong>45%</strong> of this profit? Don&apos;t let your
                    success dilute. Get the definitive playbook to protect your
                    assets in the EU.
                  </p>
                  <button className="w-full bg-white text-blue-800 py-3.5 px-6 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:bg-blue-50 transition-all flex items-center justify-between group">
                    <span className="flex items-center gap-2">
                      Get the Playbook
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-extrabold py-1 px-2 rounded-md">
                      €10
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
