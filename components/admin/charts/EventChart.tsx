/**
 * EventsChart.tsx
 * ────────────────
 * Diagramme en lignes — Nombre d'événements par trimestre/an.
 *
 * DONNÉES : mock (à remplacer par API /api/stats/events)
 * BIBLIOTHÈQUE : recharts
 * MAINTENANCE : modifier EVENTS_DATA + changer VIEW entre 'quarterly' et 'yearly'
 */
'use client';

import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';

// ── Données par trimestre ──────────────────────────────────
const QUARTERLY_DATA = [
  { period: 'T1 2024', events: 4 },
  { period: 'T2 2024', events: 7 },
  { period: 'T3 2024', events: 5 },
  { period: 'T4 2024', events: 9 },
  { period: 'T1 2025', events: 6 },
  { period: 'T2 2025', events: 8 },
];

// ── Données par année ──────────────────────────────────────
const YEARLY_DATA = [
  { period: '2021', events: 12 },
  { period: '2022', events: 18 },
  { period: '2023', events: 24 },
  { period: '2024', events: 25 },
  { period: '2025', events: 14 },
];

const PRIMARY = '#135bec';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10 text-sm">
      <p className="font-bold text-white/60 text-xs mb-1">{label}</p>
      <p className="font-black text-lg">{payload[0].value} <span className="text-white/50 text-xs font-normal">événements</span></p>
    </div>
  );
};

export default function EventsChart() {
  // 'quarterly' | 'yearly' — contrôle quelle vue afficher
  const [view, setView] = useState<'quarterly' | 'yearly'>('quarterly');
  const data = view === 'quarterly' ? QUARTERLY_DATA : YEARLY_DATA;

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Activité</p>
          <h3 className="text-lg font-bold text-slate-900">Événements organisés</h3>
        </div>
        {/* Toggle trimestriel / annuel */}
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {(['quarterly', 'yearly'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={view === v
                ? { backgroundColor: PRIMARY, color: '#fff' }
                : { color: '#64748b' }
              }
            >
              {v === 'quarterly' ? 'Trimestre' : 'Année'}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            {/* Dégradé sous la courbe */}
            <linearGradient id="eventGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"   stopColor={PRIMARY} stopOpacity={0.15} />
              <stop offset="95%"  stopColor={PRIMARY} stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="period" tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="events"
            stroke={PRIMARY}
            strokeWidth={3}
            fill="url(#eventGradient)"
            dot={{ fill: PRIMARY, strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, fill: PRIMARY }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
