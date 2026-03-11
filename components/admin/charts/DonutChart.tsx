/**
 * DonutChart.tsx
 * ───────────────
 * Diagramme circulaire (donut) — Répartition par catégorie.
 *
 * PROPS :
 *   data    : tableau { name, value, color }
 *   title   : titre affiché au centre
 *   subtitle: sous-titre affiché au centre (ex: total)
 *
 * BIBLIOTHÈQUE : recharts
 * USAGE : <DonutChart data={[...]} title="250" subtitle="membres" />
 */
'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export interface DonutSlice {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  title: string;
  subtitle: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10 text-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.payload.color }} />
        <span className="font-bold text-white/70 text-xs">{d.name}</span>
      </div>
      <p className="font-black text-lg">{d.value}</p>
    </div>
  );
};

export default function DonutChart({ data, title, subtitle }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
      <div className="relative" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}   // trou central du donut
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Texte central superposé */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-slate-900">{title}</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{subtitle}</span>
        </div>
      </div>

      {/* Légende sous le donut */}
      <div className="mt-4 space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-sm font-bold text-slate-600">{d.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900">{d.value}</span>
              <span className="text-xs text-slate-400 font-medium w-10 text-right">
                {Math.round((d.value / total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
