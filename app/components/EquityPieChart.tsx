// app/components/EquityPieChart.tsx
"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency, type CurrencyType } from "@/app/lib/calculations";

interface Props {
  profit: number;
  costToExercise: number;
  ownership: number;
  currency: CurrencyType;
}

// 1. Movemos el CustomTooltip FUERA del componente principal
// Añadimos 'currency' a sus propiedades esperadas
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, currency }: any) => {
  if (active && payload?.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-2xl text-white text-sm z-50 min-w-[150px]">
        <p
          className="font-medium mb-1 opacity-90"
          style={{ color: data.color }}
        >
          {data.name}
        </p>
        <p className="text-xl font-bold font-mono">
          {formatCurrency(data.value, currency)}
        </p>
      </div>
    );
  }
  return null;
};

export default function EquityPieChart({
  profit,
  costToExercise,
  ownership,
  currency,
}: Props) {
  const chartData = [
    { name: "Net Profit", value: profit, color: "#10b981" },
    { name: "Exercise Cost", value: costToExercise, color: "#f43f5e" },
  ];

  return (
    <div className="h-48 w-full mb-8 relative">
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
          Ownership
        </span>
        <span className="text-white text-xl font-bold font-mono">
          {ownership.toFixed(3)}%
        </span>
      </div>
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
              // 2. Usamos una función anónima para inyectarle la prop 'currency' que viene del padre
              content={(props) => (
                <CustomTooltip {...props} currency={currency} />
              )}
              cursor={{ fill: "transparent" }}
              wrapperStyle={{ outline: "none", zIndex: 100 }}
              allowEscapeViewBox={{ x: true, y: true }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
