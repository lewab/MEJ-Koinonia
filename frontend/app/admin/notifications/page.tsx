'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications, formatTimeAgo, NOTIF_CONFIG, NotifType } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import {
  Bell, Check, CheckCheck, Trash2, ArrowLeft,
  Filter, ChevronRight, ShieldCheck
} from 'lucide-react';

const FILTERS: { label: string; value: NotifType | 'all' }[] = [
  { label: 'Tout',            value: 'all'          },
  { label: 'Médias',          value: 'media_upload' },
  { label: 'Dons',            value: 'donation'     },
  { label: 'Membres',         value: 'member_join'  },
  { label: 'École des Disc.', value: 'ecodim'       },
  { label: 'Programmes',      value: 'programme_add'},
];

export default function NotificationsPage() {
  const { user } = useAuth();
  const {
    notifications, unreadCount,
    markAsRead, markAllAsRead, deleteNotification, clearAll
  } = useNotifications();

  const [filter,   setFilter]   = useState<NotifType | 'all'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
        <ShieldCheck className="w-12 h-12 text-red-400" />
        <h2 className="text-2xl font-bold text-slate-900">Accès réservé aux administrateurs</h2>
        <Link href="/" className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-primary transition-all">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const deleteSelected = () => {
    selected.forEach(id => deleteNotification(id));
    setSelected(new Set());
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 pb-20 max-w-4xl mx-auto space-y-6">

      {/* En-tête */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin"
            className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-black rounded-full border border-red-200">
                  {unreadCount} non lues
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm font-medium mt-0.5">
              Toutes les activités du site en temps réel.
            </p>
          </div>
        </div>

        {/* Actions globales */}
        <div className="flex items-center gap-2">
          {selected.size > 0 ? (
            <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              onClick={deleteSelected}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all">
              <Trash2 className="w-4 h-4" /> Supprimer ({selected.size})
            </motion.button>
          ) : (
            <>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 hover:border-primary hover:text-primary transition-all">
                  <CheckCheck className="w-4 h-4" /> Tout lire
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clearAll}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 hover:border-red-300 hover:text-red-500 transition-all">
                  <Trash2 className="w-4 h-4" /> Vider
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map(f => {
          const count = f.value === 'all'
            ? notifications.length
            : notifications.filter(n => n.type === f.value).length;
          return (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                filter === f.value
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {f.label}
              {count > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                  filter === f.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Liste notifications */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center">
              <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-400">Aucune notification pour cette catégorie.</p>
            </motion.div>
          ) : (
            filtered.map((notif, i) => {
              const cfg        = NOTIF_CONFIG[notif.type];
              const isSelected = selected.has(notif.id);

              return (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => markAsRead(notif.id)}
                  className={`flex items-start gap-4 p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : !notif.read
                        ? 'border-blue-100 bg-blue-50/40 hover:bg-blue-50'
                        : 'border-slate-100 bg-white hover:bg-slate-50'
                  }`}
                >
                  {/* Checkbox sélection */}
                  <button
                    onClick={e => { e.stopPropagation(); toggleSelect(notif.id); }}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isSelected ? 'bg-primary border-primary' : 'border-slate-300 hover:border-primary'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </button>

                  {/* Icône type */}
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 border ${cfg.bg}`}>
                    {cfg.icon}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-bold text-sm ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                          {formatTimeAgo(notif.timestamp)}
                        </span>
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{notif.message}</p>

                    {/* Méta-données */}
                    {notif.meta && (
                      <div className="flex flex-wrap gap-2 mt-2.5">
                        {notif.meta.amount && (
                          <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                            💝 {notif.meta.amount.toLocaleString()} FCFA · {notif.meta.operator}
                          </span>
                        )}
                        {notif.meta.fileName && (
                          <span className="text-[11px] font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
                            🎬 {notif.meta.fileName} · {notif.meta.fileType}
                          </span>
                        )}
                        {notif.meta.memberName && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                            👤 {notif.meta.memberName}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <button
                    onClick={e => { e.stopPropagation(); deleteNotification(notif.id); }}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0 opacity-0 group-hover:opacity-100"
                    style={{ opacity: undefined }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}