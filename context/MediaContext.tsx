/**
 * MediaContext.tsx
 * ─────────────────
 * Contexte global pour la médiathèque.
 * Gère les médias actifs (mediaList) et les archives (archivesList).
 *
 * MÉTHODES :
 *   addMedia(item)            → ajoute un média + déclenche une notif admin
 *   removeMedia(id)           → supprime un média + déclenche une notif admin
 *   updateMedia(id, partial)  → modifie un média sans notif (modification simple)
 *   setNotifyFn(fn)           → injectée depuis layout.tsx pour éviter circular dep
 *
 * MAINTENANCE :
 *   - Données mock → remplacer INITIAL_MEDIA par GET /api/media
 *   - Upload réel → modifier addMedia pour accepter un FormData + fetch /api/upload
 *   - Pour ajouter des champs → modifier MediaItem dans types.ts + le formulaire AdminMedia
 */
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { MediaItem } from '@/types';

// ── Données mock initiales ────────────────────────────────
// TODO: Remplacer par GET /api/media
const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'm-1', title: 'La Puissance de la Prière', speaker: 'Pasteur Jean-Pierre',
    duration: '52:14', type: 'video', date: '15 Jan 2025',
    description: "Découvrez comment la prière transforme le cœur et ouvre les portes du ciel.",
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80',
    size: '320 MB',
  },
  {
    id: 'm-2', title: 'Marcher dans la Foi', speaker: 'Évangéliste Marie',
    duration: '38:45', type: 'audio', date: '10 Jan 2025',
    description: 'Une prédication puissante sur la foi qui déplace les montagnes.',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
    size: '45 MB',
  },
  {
    id: 'm-3', title: "L'Appel de Dieu sur ta Vie", speaker: 'Pasteur Jean-Pierre',
    duration: '1:05:22', type: 'video', date: '05 Jan 2025',
    description: "Comprendre et répondre à l'appel divin sur chaque croyant.",
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
    size: '580 MB',
  },
];

const INITIAL_ARCHIVES: MediaItem[] = [
  { id: 'a-1', title: 'Série : Le Sermon sur la Montagne', speaker: 'Pasteur Jean-Pierre', duration: '48:30', type: 'video',  date: '12 Déc 2024', description: '', image: '', size: '280 MB' },
  { id: 'a-2', title: 'Nuit de Louange 2024',              speaker: 'Équipe Louange',       duration: '2:15:00', type: 'audio', date: '01 Déc 2024', description: '', image: '', size: '120 MB' },
  { id: 'a-3', title: "Retraite Spirituelle : L'Esprit",   speaker: 'Évangéliste Marie',    duration: '1:30:00', type: 'video', date: '15 Nov 2024', description: '', image: '', size: '900 MB' },
];

// ── Type de la fonction de notification injectée ──────────
// Évite une dépendance circulaire entre MediaContext et NotificationContext
type NotifyFn = (notif: { type: string; title: string; message: string; meta?: any }) => void;

// ── Interface du contexte ────────────────────────────────
interface MediaContextType {
  mediaList:    MediaItem[];
  archivesList: MediaItem[];
  addMedia:    (item: MediaItem) => void;
  removeMedia: (id: string) => void;
  /** Modifie partiellement un média existant (titre, speaker, type...) */
  updateMedia: (id: string, partial: Partial<Omit<MediaItem, 'id'>>) => void;
  /** Injectée depuis layout.tsx — ne pas appeler avant le montage */
  setNotifyFn: (fn: NotifyFn) => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────
export function MediaProvider({ children }: { children: ReactNode }) {
  const [mediaList,     setMediaList]     = useState<MediaItem[]>(INITIAL_MEDIA);
  const [archivesList,  setArchivesList]  = useState<MediaItem[]>(INITIAL_ARCHIVES);
  // notifyFn est null jusqu'à ce que layout.tsx l'injecte via setNotifyFn
  const [notifyFn, setNotifyFnState]      = useState<NotifyFn | null>(null);

  /** Injection de la fn de notif depuis le parent (layout) */
  const setNotifyFn = useCallback((fn: NotifyFn) => {
    setNotifyFnState(() => fn);
  }, []);

  /** Ajoute un nouveau média en tête de liste + notifie l'admin */
  const addMedia = useCallback((item: MediaItem) => {
    setMediaList(prev => [item, ...prev]);
    notifyFn?.({
      type:    'media_upload',
      title:   'Nouveau fichier uploadé',
      message: `"${item.title}" (${item.type}) a été ajouté par ${item.speaker}.`,
      meta:    { fileName: item.title, fileType: item.type, uploader: item.speaker },
    });
  }, [notifyFn]);

  /** Supprime un média (actif ou archive) par son ID + notifie l'admin */
  const removeMedia = useCallback((id: string) => {
    // Cherche dans les deux listes avant suppression pour récupérer le titre
    const item = mediaList.find(m => m.id === id) ?? archivesList.find(m => m.id === id);
    setMediaList(prev    => prev.filter(m => m.id !== id));
    setArchivesList(prev => prev.filter(m => m.id !== id));
    if (item) {
      notifyFn?.({
        type:    'media_delete',
        title:   'Fichier supprimé',
        message: `"${item.title}" a été supprimé de la médiathèque.`,
        meta:    { fileName: item.title, fileType: item.type },
      });
    }
  }, [notifyFn, mediaList, archivesList]);

  /** Modifie les champs d'un média existant (spread partiel) — sans notif */
  const updateMedia = useCallback((id: string, partial: Partial<Omit<MediaItem, 'id'>>) => {
    setMediaList(prev =>
      prev.map(m => m.id === id ? { ...m, ...partial } : m)
    );
    setArchivesList(prev =>
      prev.map(m => m.id === id ? { ...m, ...partial } : m)
    );
  }, []);

  return (
    <MediaContext.Provider value={{ mediaList, archivesList, addMedia, removeMedia, updateMedia, setNotifyFn }}>
      {children}
    </MediaContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────
export function useMedia() {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error('useMedia must be used within a MediaProvider');
  return ctx;
}
