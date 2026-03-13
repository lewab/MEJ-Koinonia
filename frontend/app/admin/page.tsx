/**
 * app/admin/page.tsx
 * ───────────────────
 * Page principale du Dashboard Admin MEJ Koinonia.
 *
 * ARCHITECTURE : Orchestrateur — ne contient pas de logique métier.
 *   Chaque onglet est un composant indépendant dans /components/admin/
 *
 * ONGLETS :
 *   overview   → Vue d'ensemble + diagrammes recharts
 *   members    → Tableau des membres (lecture)
 *   donations  → Historique des dons (lecture)
 *   media      → Médiathèque CRUD (AdminMedia)
 *   ecodim     → École des Disciples CRUD par niveau (AdminEcodim)
 *   events     → Événements CRUD (AdminEvents)
 *
 * SÉCURITÉ : Garde UserRole.ADMIN — redirige si non admin
 *
 * MAINTENANCE :
 *   - Ajouter un onglet : ajouter dans TABS + un <case> dans le switch
 *   - Diagrammes : modifier les données dans /components/admin/charts/
 *   - Connecter API : remplacer les mock dans chaque Context
 */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Heart, BookOpen, Film, TrendingUp, Bell,
  ShieldCheck, ArrowUpRight, Eye, MapPin, ChevronRight,
  CheckCircle2, Clock, Trash2, Calendar, AlertCircle,
} from 'lucide-react';

// ── Contextes ──────────────────────────────────────────────
import { useAuth }          from '@/context/AuthContext';
import { useMedia }         from '@/context/MediaContext';
import { useNotifications, formatTimeAgo, NOTIF_CONFIG } from '@/context/NotificationContext';
import { useEvents }        from '@/context/EventContext';
import { useEcoDisciple, ECODIM_LEVELS } from '@/context/EcoleDeDiscipleContext';

// ── Composants admin fragmentés ────────────────────────────
import AdminEvents  from '@/components/admin/AdminEvents';
import AdminEcodim  from '@/components/admin/AdminEcoleDisciple';
import AdminMedia   from '@/components/admin/AdminMedia';

// ── Diagrammes recharts ────────────────────────────────────
import MembersChart from '@/components/admin/charts/MemberChart';
import EventsChart  from '@/components/admin/charts/EventChart';
import DonutChart, { DonutSlice } from '@/components/admin/charts/DonutChart';

import { UserRole } from '@/types';

// ── Couleur primary ────────────────────────────────────────
const P = '#135bec';

// ─────────────────────────────────────────────────────────
// DONNÉES MOCK — membres et dons
// TODO: Remplacer par API calls dans useEffect
// ─────────────────────────────────────────────────────────

const MOCK_MEMBERS = [
  { id: 1, name: 'Marie Koubemba', role: 'Membre Actif', joined: '02 Mars 2025', ecodim: true,  avatar: 'MK', color: 'bg-blue-100 text-blue-700'    },
  { id: 2, name: 'Jonas Moukala',  role: 'Membre Actif', joined: '28 Fév 2025',  ecodim: true,  avatar: 'JM', color: 'bg-amber-100 text-amber-700'   },
  { id: 3, name: 'Sœur Agnès',     role: 'Membre Actif', joined: '20 Fév 2025',  ecodim: false, avatar: 'SA', color: 'bg-rose-100 text-rose-700'     },
  { id: 4, name: 'Frère David',    role: 'Membre Actif', joined: '15 Fév 2025',  ecodim: false, avatar: 'FD', color: 'bg-emerald-100 text-emerald-700'},
  { id: 5, name: 'Pasteur Paul',   role: 'Modérateur',   joined: '01 Jan 2025',  ecodim: true,  avatar: 'PP', color: 'bg-purple-100 text-purple-700'  },
];

const MOCK_DONATIONS = [
  { id: 1, name: 'Anonyme',   amount: 5000,  operator: 'MTN',   date: '03 Mars 2025', status: 'confirmé'   },
  { id: 2, name: 'Marie K.',  amount: 10000, operator: 'Airtel', date: '02 Mars 2025', status: 'confirmé'   },
  { id: 3, name: 'Anonyme',   amount: 2500,  operator: 'MTN',   date: '01 Mars 2025', status: 'confirmé'   },
  { id: 4, name: 'Jonas M.',  amount: 25000, operator: 'Airtel', date: '28 Fév 2025',  status: 'confirmé'   },
  { id: 5, name: 'Anonyme',   amount: 1000,  operator: 'MTN',   date: '27 Fév 2025',  status: 'en attente' },
];

const TOTAL_DONS = MOCK_DONATIONS.reduce((s, d) => s + d.amount, 0);

// ─────────────────────────────────────────────────────────
// Sous-composants locaux légers
// ─────────────────────────────────────────────────────────

/** Carte de statistique cliquable */
function StatCard({ icon, label, value, sub, bg, href }: {
  icon: React.ReactNode; label: string; value: string | number;
  sub?: string; bg: string; href?: string;
}) {
  const Inner = (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}
      className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg}`}>{icon}</div>
        {href && <ArrowUpRight className="w-4 h-4 text-slate-300" />}
      </div>
      <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
      <p className="font-bold text-slate-700 mt-1">{label}</p>
      {sub && <p className="text-xs text-slate-400 font-medium mt-1">{sub}</p>}
    </motion.div>
  );
  return href ? <Link href={href}>{Inner}</Link> : Inner;
}

/** Titre de section */
function SectionTitle({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        {sub && <p className="text-sm text-slate-500 mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Définition des onglets
// ─────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',   label: 'Vue d\'ensemble', icon: TrendingUp },
  { id: 'members',    label: 'Membres',          icon: Users      },
  { id: 'donations',  label: 'Dons',             icon: Heart      },
  { id: 'media',      label: 'Médiathèque',      icon: Film       },
  { id: 'ecodim',     label: 'École des Disc.',  icon: BookOpen   },
  { id: 'events',     label: 'Événements',       icon: Calendar   },
];

// ─────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const { user }       = useAuth();
  const { mediaList }  = useMedia();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { events }     = useEvents();
  const { students }   = useEcoDisciple();

  const [activeTab, setActiveTab] = useState<string>('overview');

  // ── Garde admin ───────────────────────────────────────────
  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
          <ShieldCheck className="w-9 h-9 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Accès refusé</h2>
        <p className="text-slate-500">Cette page est réservée aux administrateurs.</p>
        <button onClick={() => router.push('/')}
          className="px-6 py-3 rounded-2xl font-bold text-white"
          style={{ backgroundColor: P }}>
          Retour à l'accueil
        </button>
      </div>
    );
  }

  // ── Données dérivées pour les diagrammes ──────────────────

  /** Répartition des membres par rôle — donut */
  const memberDonutData: DonutSlice[] = [
    { name: 'Membre Actif', value: MOCK_MEMBERS.filter(m => m.role === 'Membre Actif').length, color: P          },
    { name: 'Modérateur',   value: MOCK_MEMBERS.filter(m => m.role === 'Modérateur').length,   color: '#7c3aed'  },
    { name: 'Admin',        value: 1,                                                            color: '#f59e0b'  },
  ];

  /** Répartition École des Disciples par niveau — donut */
  const ecodimDonutData: DonutSlice[] = ([1,2,3,4] as const).map(lvl => ({
    name:  ECODIM_LEVELS[lvl].label,
    value: students.filter(s => s.level === lvl).length,
    color: ['#135bec','#f59e0b','#7c3aed','#16a34a'][lvl - 1],
  })).filter(d => d.value > 0);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 pb-20 max-w-[1400px] mx-auto space-y-8">

      {/* ── En-tête ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-lg"
            style={{ backgroundColor: '#f59e0b', boxShadow: '0 8px 24px rgba(245,158,11,0.3)' }}>
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Admin</h1>
              <span className="text-[10px] font-black text-amber-700 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full uppercase tracking-widest">
                MEJ Koinonia
              </span>
            </div>
            <p className="text-slate-500 font-medium">
              Bienvenue, {user.name} · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
        <Link href="/admin/notifications"
          className="relative flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-700 hover:border-slate-400 transition-all shadow-sm">
          <Bell className="w-4 h-4" />
          Notifications
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>

      {/* ── Onglets ────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(tab => {
          const Icon   = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all"
              style={active
                ? { backgroundColor: '#0f172a', color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }
                : { backgroundColor: '#fff', color: '#64748b', border: '1px solid #e2e8f0' }
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Contenu des onglets ─────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >

          {/* ════════════════════════════════════════════════
              ONGLET : Vue d'ensemble
          ════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-8">

              {/* 4 cartes stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Users  className="w-6 h-6 text-blue-600"   />} label="Membres"        value={MOCK_MEMBERS.length}                bg="bg-blue-100"  href="/admin?tab=members"   sub="Total inscrits"         />
                <StatCard icon={<Heart  className="w-6 h-6 text-rose-600"   />} label="Total des dons"  value={`${TOTAL_DONS.toLocaleString()} F`} bg="bg-rose-100"  href="/admin?tab=donations" sub={`${MOCK_DONATIONS.length} transactions`} />
                <StatCard icon={<BookOpen className="w-6 h-6 text-amber-600"/>} label="École des Disc." value={students.length}                    bg="bg-amber-100" href="/admin?tab=ecodim"    sub="4 niveaux actifs"       />
                <StatCard icon={<Film   className="w-6 h-6 text-violet-600" />} label="Médias"          value={mediaList.length}                   bg="bg-violet-100"href="/admin?tab=media"     sub="Fichiers médiathèque"   />
              </div>

              {/* Diagrammes ligne 1 : bâtons membres + courbe événements */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MembersChart />
                <EventsChart  />
              </div>

              {/* Diagrammes ligne 2 : 2 donuts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Répartition des membres</p>
                  <DonutChart
                    data={memberDonutData}
                    title={String(MOCK_MEMBERS.length + 1)}
                    subtitle="membres"
                  />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">École des Disciples par niveau</p>
                  <DonutChart
                    data={ecodimDonutData}
                    title={String(students.length)}
                    subtitle="étudiants"
                  />
                </div>
              </div>

              {/* Activité récente + membres récents */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Activité récente */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Activité récente</h3>
                    <Link href="/admin/notifications" className="text-xs font-bold flex items-center gap-1 hover:underline"
                      style={{ color: P }}>
                      Tout voir <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {notifications.slice(0, 5).map(notif => {
                      const cfg = NOTIF_CONFIG[notif.type];
                      return (
                        <div key={notif.id} onClick={() => markAsRead(notif.id)}
                          className={`flex items-start gap-4 px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/40' : ''}`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 border ${cfg.bg}`}>
                            {cfg.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate ${!notif.read ? 'text-slate-900' : 'text-slate-600'}`}>{notif.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{notif.message}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{formatTimeAgo(notif.timestamp)}</span>
                            {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Membres récents */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Membres récents</h3>
                    <button onClick={() => setActiveTab('members')} className="text-xs font-bold flex items-center gap-1 hover:underline" style={{ color: P }}>
                      Tout voir <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {MOCK_MEMBERS.slice(0, 5).map(m => (
                      <div key={m.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${m.color}`}>{m.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">{m.name}</p>
                          <p className="text-xs text-slate-400">{m.joined}</p>
                        </div>
                        {m.ecodim && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full whitespace-nowrap">École</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════
              ONGLET : Membres (lecture)
          ════════════════════════════════════════════════ */}
          {activeTab === 'members' && (
            <div>
              <SectionTitle title="Membres inscrits"
                sub={`${MOCK_MEMBERS.length} membres · ${MOCK_MEMBERS.filter(m=>m.ecodim).length} à l'École des Disciples`} />
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {['Membre','Rôle','Inscrit le','École des Disc.','Actions'].map(h => (
                          <th key={h} className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {MOCK_MEMBERS.map(m => (
                        <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${m.color}`}>{m.avatar}</div>
                              <span className="font-bold text-slate-900">{m.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">{m.role}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{m.joined}</td>
                          <td className="px-6 py-4">
                            {m.ecodim
                              ? <span className="flex items-center gap-1.5 w-fit text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100"><CheckCircle2 className="w-3 h-3" /> Inscrit</span>
                              : <span className="flex items-center gap-1.5 w-fit text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100"><Clock className="w-3 h-3" /> Non inscrit</span>
                            }
                          </td>
                          <td className="px-6 py-4">
                            <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════
              ONGLET : Dons (lecture)
          ════════════════════════════════════════════════ */}
          {activeTab === 'donations' && (
            <div className="space-y-6">
              {/* Résumé chiffres */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Total collecté', value: `${TOTAL_DONS.toLocaleString()} FCFA`, sub: 'Toutes transactions' },
                  { label: 'Transactions',   value: MOCK_DONATIONS.length, sub: 'Ce mois'  },
                  { label: 'Don moyen',      value: `${Math.round(TOTAL_DONS / MOCK_DONATIONS.length).toLocaleString()} F`, sub: 'Par transaction' },
                ].map(c => (
                  <div key={c.label} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{c.label}</p>
                    <p className="text-3xl font-black text-slate-900">{c.value}</p>
                    <p className="text-sm text-slate-500 font-medium mt-1">{c.sub}</p>
                  </div>
                ))}
              </div>
              <SectionTitle title="Historique des dons" sub="Toutes les transactions reçues" />
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {['Donateur','Montant','Opérateur','Date','Statut'].map(h => (
                          <th key={h} className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {MOCK_DONATIONS.map(d => (
                        <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{d.name}</td>
                          <td className="px-6 py-4"><span className="font-black text-slate-900">{d.amount.toLocaleString()}</span><span className="text-slate-400 text-xs ml-1">FCFA</span></td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                              d.operator === 'MTN' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-red-50 text-red-700 border-red-100'
                            }`}>{d.operator}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{d.date}</td>
                          <td className="px-6 py-4">
                            <span className={`flex items-center gap-1.5 w-fit text-xs font-bold px-2.5 py-1 rounded-full border ${
                              d.status === 'confirmé' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {d.status === 'confirmé' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════
              ONGLETS : composants délégués
          ════════════════════════════════════════════════ */}
          {activeTab === 'media'   && <AdminMedia   />}
          {activeTab === 'ecodim'  && <AdminEcodim  />}
          {activeTab === 'events'  && <AdminEvents  />}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
