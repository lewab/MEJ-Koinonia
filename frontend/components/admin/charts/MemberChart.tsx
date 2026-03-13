/**
 * MembersChart.tsx
 * ─────────────────
 * Diagramme en bâtons — Nouveaux membres par trimestre.
 *
 * DONNÉES : mock (à remplacer par API /api/stats/members)
 * BIBLIOTHÈQUE : recharts (npm install recharts)
 * MAINTENANCE : modifier MEMBERS_DATA pour changer les périodes
 */
'use client';

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

// ── Données trimestrielles (mock) ─────────────────────────
// Format: { period: "Q1 2024", count: 42 }
const MEMBERS_DATA = [
  { period: 'T1 2024', count: 18 },
  { period: 'T2 2024', count: 27 },
  { period: 'T3 2024', count: 22 },
  { period: 'T4 2024', count: 35 },
  { period: 'T1 2025', count: 41 },
  { period: 'T2 2025', count: 29 },
];

// ── Couleur primary (doit correspondre à globals.css) ─────
const PRIMARY = '#135bec';
const PRIMARY_LIGHT = 'rgba(19,91,236,0.15)';

/** Tooltip personnalisé affiché au survol d'une barre */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10 text-sm">
      <p className="font-bold text-white/60 text-xs mb-1">{label}</p>
      <p className="font-black text-lg">{payload[0].value} <span className="text-white/50 text-xs font-normal">membres</span></p>
    </div>
  );
};

export default function MembersChart() {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Croissance</p>
        <h3 className="text-lg font-bold text-slate-900">Nouveaux membres / trimestre</h3>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={MEMBERS_DATA} barSize={32} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: PRIMARY_LIGHT, radius: 8 }} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {MEMBERS_DATA.map((entry, index) => (
              // La dernière barre est mise en valeur avec la couleur primary
              <Cell
                key={index}
                fill={index === MEMBERS_DATA.length - 1 ? PRIMARY : '#e2e8f0'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
