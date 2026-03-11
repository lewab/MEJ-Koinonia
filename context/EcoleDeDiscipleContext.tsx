/**
 * EcodimContext.tsx
 * ─────────────────
 * Contexte global pour l'École des Disciples.
 * Gère les inscriptions par niveau (1→4).
 *
 * NIVEAUX :
 *   1 = Débutant   2 = Intermédiaire   3 = Avancé   4 = Diplômé
 *
 * USAGE :
 *   const { students, addStudent, removeStudent, changeLevel } = useEcodim();
 *
 * MAINTENANCE :
 *   - Pour ajouter un niveau : modifier ECODIM_LEVELS + EcodimStudent.level
 *   - Pour connecter au backend : remplacer les setState par des fetch dans chaque fonction
 */
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export type EcodimLevel = 1 | 2 | 3 | 4;

export interface EcodimStudent {
  id: string;
  name: string;
  avatar: string;          // initiales ex: "MK"
  avatarColor: string;     // couleur hex de l'avatar
  level: EcodimLevel;      // niveau actuel (1-4)
  joinedAt: string;        // date d'inscription à l'école
  parish: string;          // paroisse d'appartenance
  phone?: string;
}

/** Libellés et couleurs par niveau */
export const ECODIM_LEVELS: Record<EcodimLevel, { label: string; color: string; bg: string; border: string }> = {
  1: { label: 'Débutant',       color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200'   },
  2: { label: 'Intermédiaire',  color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200'  },
  3: { label: 'Avancé',         color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
  4: { label: 'Diplômé',        color: 'text-emerald-700',bg: 'bg-emerald-50',border: 'border-emerald-200'},
};

// ── Données initiales (mock — à remplacer par API) ────────────────────────────

const INITIAL_STUDENTS: EcodimStudent[] = [
  { id: 'ec-1', name: 'Jonas Moukala',   avatar: 'JM', avatarColor: '#f59e0b', level: 3, joinedAt: 'Jan 2024', parish: 'MEJ Koinonia',  phone: '+242 06 000 0001' },
  { id: 'ec-2', name: 'Marie Koubemba',  avatar: 'MK', avatarColor: '#135bec', level: 2, joinedAt: 'Jan 2024', parish: 'MEJ Koinonia',  phone: '+242 06 000 0002' },
  { id: 'ec-3', name: 'Sœur Agnès',      avatar: 'SA', avatarColor: '#dc2626', level: 4, joinedAt: 'Jan 2023', parish: 'MEJ OCH',       phone: '+242 06 000 0003' },
  { id: 'ec-4', name: 'Frère David',     avatar: 'FD', avatarColor: '#16a34a', level: 1, joinedAt: 'Fév 2025', parish: 'MEJ Koinonia',  phone: '+242 06 000 0004' },
  { id: 'ec-5', name: 'Pasteur Paul',    avatar: 'PP', avatarColor: '#7c3aed', level: 4, joinedAt: 'Jan 2022', parish: 'MEJ OCH',       phone: '+242 06 000 0005' },
  { id: 'ec-6', name: 'Claire Nzinga',   avatar: 'CN', avatarColor: '#0891b2', level: 2, joinedAt: 'Jan 2024', parish: 'MEJ Koinonia',  phone: '+242 06 000 0006' },
  { id: 'ec-7', name: 'Théophile M.',    avatar: 'TM', avatarColor: '#be185d', level: 1, joinedAt: 'Mar 2025', parish: 'MEJ OCH',       phone: '+242 06 000 0007' },
];

// ── Interface du contexte ─────────────────────────────────────────────────────

interface EcoDiscipleContextType {
  students: EcodimStudent[];
  /** Ajouter un nouvel étudiant */
  addStudent: (student: Omit<EcodimStudent, 'id'>) => void;
  /** Supprimer un étudiant (ex: changement de niveau → sortie) */
  removeStudent: (id: string) => void;
  /** Changer le niveau d'un étudiant */
  changeLevel: (id: string, newLevel: EcodimLevel) => void;
}

// ── Contexte ──────────────────────────────────────────────────────────────────

const EcoDiscipleContext = createContext<EcoDiscipleContextType | undefined>(undefined);

export function EcoDiscipleProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<EcodimStudent[]>(INITIAL_STUDENTS);

  /** Ajoute un étudiant avec un ID auto-généré */
  const addStudent = useCallback((student: Omit<EcodimStudent, 'id'>) => {
    const newStudent: EcodimStudent = {
      ...student,
      id: `ec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setStudents(prev => [newStudent, ...prev]);
  }, []);

  /** Supprime définitivement un étudiant de la liste */
  const removeStudent = useCallback((id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  }, []);

  /** Met à jour le niveau d'un étudiant existant */
  const changeLevel = useCallback((id: string, newLevel: EcodimLevel) => {
    setStudents(prev =>
      prev.map(s => s.id === id ? { ...s, level: newLevel } : s)
    );
  }, []);

  return (
    <EcoDiscipleContext.Provider value={{ students, addStudent, removeStudent, changeLevel }}>
      {children}
    </EcoDiscipleContext.Provider>
  );
}

export function useEcoDisciple() {
  const ctx = useContext(EcoDiscipleContext);
  if (!ctx) throw new Error('useEcodim must be used within EcodimProvider');
  return ctx;
}
