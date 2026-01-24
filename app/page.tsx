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

// --- UTILS ---
const formatCurrency = (val: number, compact = false) => {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(val);
};

// --- TOOLTIP COMPONENT (Fixed Z-Index) ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      // Añadimos z-50 y translate-z para forzarlo a estar encima de todo
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-2xl text-white text-sm relative z-50 min-w-[150px]">
        <p
          className="font-medium mb-1 opacity-90"
          style={{ color: data.color }}
        >
          {data.name}
        </p>
        <p className="text-xl font-bold font-mono tracking-tight">
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

  // --- LOGIC ---
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
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-5xl mx-auto animate-[fade-in_0.6s_ease-out_both]">
        {/* HEADER */}
        <div className="text-center mb-16 relative z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur border border-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm mb-6 hover:scale-105 transition-transform duration-300 cursor-default">
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
          {/* LEFT COLUMN: INPUTS */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white/60 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl pointer-events-none transition-opacity opacity-50 group-hover:opacity-100"></div>

              <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-slate-800">
                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                  <Calculator className="w-5 h-5 text-blue-600" />
                </div>
                Scenario Configuration
              </h2>

              <div className="space-y-8">
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group/input">
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2 group-hover/input:text-blue-600 transition-colors">
                      <PieChartIcon className="w-4 h-4 text-slate-400 group-hover/input:text-blue-500" />{" "}
                      Your Options
                    </label>
                    <input
                      type="number"
                      value={shares}
                      onChange={(e) => setShares(Number(e.target.value))}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 font-mono text-lg text-slate-900 shadow-sm hover:border-slate-300"
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
                      onChange={(e) => setStrikePrice(Number(e.target.value))}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 font-mono text-lg text-slate-900 shadow-sm hover:border-slate-300"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="group/input">
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2 group-hover/input:text-blue-600 transition-colors">
                    <Users className="w-4 h-4 text-slate-400 group-hover/input:text-blue-500" />{" "}
                    Fully Diluted Shares (Pool)
                  </label>
                  <input
                    type="number"
                    value={totalShares}
                    onChange={(e) => setTotalShares(Number(e.target.value))}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 font-mono text-lg text-slate-900 shadow-sm hover:border-slate-300"
                  />
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    Required to calculate your actual ownership percentage.
                  </p>
                </div>

                {/* Valuation Input */}
                <div className="pt-8 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-bold text-slate-900 flex items-center gap-2">
                      Exit Valuation{" "}
                      <Sparkles className="w-4 h-4 text-amber-400" />
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
                        setCompanyValuation(Number(e.target.value))
                      }
                      className="w-full p-5 pl-12 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-mono text-3xl font-bold text-blue-900 shadow-sm text-right"
                    />
                  </div>

                  <div className="px-1">
                    <input
                      type="range"
                      min="1000000"
                      max="100000000"
                      step="1000000"
                      value={companyValuation}
                      onChange={(e) =>
                        setCompanyValuation(Number(e.target.value))
                      }
                      className="w-full accent-blue-600 cursor-grab active:cursor-grabbing h-2 bg-slate-200 rounded-lg appearance-none hover:bg-slate-300 transition-colors"
                    />
                    <div className="flex justify-between text-xs text-slate-500 font-bold mt-3 uppercase tracking-wide">
                      <span>€1M (Seed)</span>
                      <span>€100M (Series B/C)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: RESULTS */}
          <div className="lg:col-span-5 space-y-6 sticky top-8">
            {/* Dark Card */}
            <div className="bg-[#0f172a] text-white p-8 rounded-[2rem] shadow-2xl relative border border-slate-800 ring-1 ring-white/10">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

              <h2 className="text-xs font-bold text-indigo-300/80 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 relative z-10">
                <TrendingUp className="w-3 h-3" /> Estimated Net Profit
              </h2>

              <div className="relative z-10">
                <div className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 mb-8 tracking-tight drop-shadow-sm">
                  {formatCurrency(results.profit)}
                </div>
              </div>

              {/* Chart Container - FIX APLICADO */}
              <div className="h-48 w-full mb-8 relative">
                {/* 1. TEXTO DE FONDO (Puesto primero para que quede atrás) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-1 z-0">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Ownership
                  </span>
                  <span className="text-white text-xl font-bold font-mono">
                    {results.ownership.toFixed(3)}%
                  </span>
                </div>

                {/* 2. GRÁFICO (Puesto segundo con z-index superior para que el hover funcione) */}
                <div className="relative z-10 h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={6}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={6}
                        isAnimationActive={true}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            className="outline-none"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "transparent" }}
                        wrapperStyle={{ outline: "none", zIndex: 100 }} // Forzamos z-index extremo
                        allowEscapeViewBox={{ x: true, y: true }} // Permite salir del contenedor
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

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

            {/* MONETIZATION CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-[2px] rounded-[24px] shadow-lg shadow-blue-900/20 hover:shadow-blue-600/30 transition-shadow duration-300">
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[22px] text-white relative overflow-hidden">
                <div className="relative z-10">
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
                    of this profit? Don&apos;t let your success dilute.
                  </p>

                  {/* --- LEMON SQUEEZY LINK --- */}
                  <a
                    href="https://eu-inc-tools.lemonsqueezy.com/checkout/buy/a6857a23-cf9b-4c66-b3f9-91eeb8c30a13"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white text-blue-700 py-4 px-6 rounded-xl font-bold shadow-xl hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-between group cursor-pointer"
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
          </div>
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
