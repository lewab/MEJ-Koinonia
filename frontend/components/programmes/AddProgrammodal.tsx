'use client';

import React from 'react';

const DEPARTMENTS = [
  'Général', 'Jeunesse', 'Ecodim (Enfants)',
  'Hommes', 'Femmes', 'Chorale / Louange',
  'Evangélisation', 'Social',
];

export interface NewEventForm {
  startDate: string;
  endDate: string;
  title: string;
  startTime: string;
  endTime: string;
  type: string;
  department: string;
  duration: number;
}

interface AddProgramModalProps {
  isOpen: boolean;
  newEvent: NewEventForm;
  onChange: (updated: NewEventForm) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const AddProgramModal: React.FC<AddProgramModalProps> = ({
  isOpen,
  newEvent,
  onChange,
  onSubmit,
  onClose,
}) => {
  if (!isOpen) return null;

  const set = (field: Partial<NewEventForm>) => onChange({ ...newEvent, ...field });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <h3 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          <span className="material-icons-round text-primary text-4xl">edit_calendar</span>
          Nouveau Programme
        </h3>

        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-6 text-sm font-medium">
          Ajoutez ici les programmes spéciaux (camps, retraites, vigiles).
          L'agenda hebdomadaire reste fixe.
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">
              Titre de l'événement
            </label>
            <input
              required
              type="text"
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium outline-none"
              placeholder="ex: Grande Veillée"
              value={newEvent.title}
              onChange={(e) => set({ title: e.target.value })}
            />
          </div>

          {/* Département + Durée */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">
                Département
              </label>
              <select
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary outline-none appearance-none"
                value={newEvent.department}
                onChange={(e) => set({ department: e.target.value })}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">
                Durée (Jours)
              </label>
              <input
                required
                type="number"
                min="1"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary outline-none"
                value={newEvent.duration}
                onChange={(e) => set({ duration: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>

          {/* Dates */}
          {newEvent.duration > 1 ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">
                  Date de Début
                </label>
                <input
                  required type="date"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary outline-none"
                  value={newEvent.startDate}
                  onChange={(e) => set({ startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">
                  Date de Fin
                </label>
                <input
                  required type="date"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary outline-none"
                  value={newEvent.endDate}
                  onChange={(e) => set({ endDate: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">
                Date de l'événement
              </label>
              <input
                required type="date"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary outline-none"
                value={newEvent.startDate}
                onChange={(e) => set({ startDate: e.target.value })}
              />
            </div>
          )}

          {/* Horaires + Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">
                Heure début
              </label>
              <input
                required type="time"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary outline-none"
                value={newEvent.startTime}
                onChange={(e) => set({ startTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">
                Heure fin
              </label>
              <input
                required type="time"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary outline-none"
                value={newEvent.endTime}
                onChange={(e) => set({ endTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">
                Type
              </label>
              <input
                required type="text"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary outline-none"
                placeholder="ex: Prière"
                value={newEvent.type}
                onChange={(e) => set({ type: e.target.value })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-4 rounded-2xl bg-primary text-white font-bold shadow-xl hover:bg-primary-hover transition-all"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProgramModal;