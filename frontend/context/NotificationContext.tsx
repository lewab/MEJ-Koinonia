'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────
export type NotifType =
  | 'media_upload'      // nouveau fichier uploadé
  | 'donation'          // nouveau don reçu
  | 'member_join'       // nouveau membre inscrit
  | 'ecodim'            // inscription école des disciples
  | 'programme_add'     // nouveau programme ajouté
  | 'media_delete'      // fichier supprimé
  | 'member_update'     // profil membre modifié
  | 'system';           // notification système

export interface AppNotification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  meta?: Record<string, any>; // données supplémentaires (montant don, nom fichier, etc.)
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

// ── Notifications mock initiales ──────────────────────────
const INITIAL_NOTIFS: AppNotification[] = [
  {
    id: 'n-1',
    type: 'media_upload',
    title: 'Nouveau fichier uploadé',
    message: '"La Puissance de la Prière" a été ajouté à la médiathèque par Pasteur Jean-Pierre.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
    meta: { fileName: 'La Puissance de la Prière', uploader: 'Pasteur Jean-Pierre', fileType: 'video' },
  },
  {
    id: 'n-2',
    type: 'donation',
    title: 'Nouveau don reçu',
    message: 'Un don de 5 000 FCFA a été effectué via MTN Mobile Money.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    read: false,
    meta: { amount: 5000, operator: 'MTN', currency: 'FCFA' },
  },
  {
    id: 'n-3',
    type: 'member_join',
    title: 'Nouveau membre inscrit',
    message: 'Marie Koubemba vient de rejoindre MEJ Koinonia.',
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    read: false,
    meta: { memberName: 'Marie Koubemba' },
  },
  {
    id: 'n-4',
    type: 'ecodim',
    title: 'Inscription École des Disciples',
    message: 'Jonas Moukala a demandé à s\'inscrire à l\'École des Disciples.',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    read: true,
    meta: { memberName: 'Jonas Moukala' },
  },
  {
    id: 'n-5',
    type: 'media_upload',
    title: 'Nouveau fichier uploadé',
    message: '"Nuit de Louange 2024" (audio) a été ajouté à la médiathèque.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
    meta: { fileName: 'Nuit de Louange 2024', fileType: 'audio' },
  },
  {
    id: 'n-6',
    type: 'donation',
    title: 'Nouveau don reçu',
    message: 'Un don de 10 000 FCFA a été effectué via Airtel Money.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    read: true,
    meta: { amount: 10000, operator: 'Airtel', currency: 'FCFA' },
  },
  {
    id: 'n-7',
    type: 'programme_add',
    title: 'Nouveau programme ajouté',
    message: 'La "Retraite Spirituelle Mars 2025" a été ajoutée aux programmes.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    meta: { programTitle: 'Retraite Spirituelle Mars 2025' },
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount,
      addNotification, markAsRead, markAllAsRead, deleteNotification, clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}

// ── Helpers ───────────────────────────────────────────────
export function formatTimeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)  return 'À l\'instant';
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
  return `Il y a ${Math.floor(diff / 86400)}j`;
}

export const NOTIF_CONFIG: Record<NotifType, { icon: string; color: string; bg: string }> = {
  media_upload:  { icon: '🎬', color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-100'    },
  donation:      { icon: '💝', color: 'text-rose-700',   bg: 'bg-rose-50 border-rose-100'    },
  member_join:   { icon: '👤', color: 'text-emerald-700',bg: 'bg-emerald-50 border-emerald-100'},
  ecodim:        { icon: '📖', color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-100'  },
  programme_add: { icon: '📅', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-100'},
  media_delete:  { icon: '🗑️', color: 'text-red-700',   bg: 'bg-red-50 border-red-100'      },
  member_update: { icon: '✏️', color: 'text-slate-700',  bg: 'bg-slate-50 border-slate-200'  },
  system:        { icon: '⚙️', color: 'text-gray-700',   bg: 'bg-gray-50 border-gray-200'    },
};