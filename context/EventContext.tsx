/**
 * EventContext.tsx
 * ─────────────────
 * Contexte global pour les événements MEJ.
 * Ces événements sont affichés sur la page d'accueil ET gérés depuis le dashboard admin.
 *
 * MÉTHODES DISPONIBLES :
 *   addEvent(event)           → ajoute un événement en tête de liste
 *   removeEvent(id)           → supprime un événement par ID
 *   updateEvent(id, partial)  → modifie les champs d'un événement existant
 *
 * MAINTENANCE :
 *   - Données initiales mock → remplacer INITIAL_EVENTS par un fetch API
 *   - Pour persister : ajouter localStorage ou appel backend dans chaque méthode
 */
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Event } from '@/types';

// ── Données initiales (mock) ─────────────────────────────
// TODO: Remplacer par GET /api/events
const INITIAL_EVENTS: Event[] = [
  {
    id: 'e-1',
    title: 'Nuit de Louange',
    date: 'SAM 12 AVR',
    time: '20:00 - 23:00',
    description: "Une soirée extraordinaire pour élever le nom de Jésus ensemble dans la louange.",
    imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80',
    location: 'MEJ Koinonia · Talangaï',
  },
  {
    id: 'e-2',
    title: 'Formation Biblique',
    date: 'JEU 17 AVR',
    time: '18:00 - 19:30',
    description: "Étude approfondie sur les Actes des Apôtres — comment l'Esprit Saint agit aujourd'hui.",
    imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
    location: 'Salle Polyvalente · OCH',
  },
  {
    id: 'e-3',
    title: 'Retraite Spirituelle',
    date: 'SAM 26 AVR',
    time: '08:00 - 18:00',
    description: "Une journée de silence, de prière et de ressourcement spirituel pour les membres MEJ.",
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
    location: 'Centre de Retraite · Brazzaville',
  },
];

// ── Interface du contexte ────────────────────────────────
interface EventContextType {
  events: Event[];
  /** Ajoute un nouvel événement en haut de la liste */
  addEvent: (event: Event) => void;
  /** Supprime un événement par son ID */
  removeEvent: (id: string) => void;
  /** Modifie partiellement un événement existant */
  updateEvent: (id: string, partial: Partial<Omit<Event, 'id'>>) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────
export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);

  const addEvent = useCallback((event: Event) => {
    setEvents(prev => [event, ...prev]);
  }, []);

  const removeEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  // Fusionne les champs modifiés avec l'événement existant (spread partiel)
  const updateEvent = useCallback((id: string, partial: Partial<Omit<Event, 'id'>>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...partial } : e));
  }, []);

  return (
    <EventContext.Provider value={{ events, addEvent, removeEvent, updateEvent }}>
      {children}
    </EventContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────
export function useEvents() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEvents must be used within EventProvider');
  return ctx;
}
