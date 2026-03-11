'use client';

import React from 'react';
import { UserRole } from '@/types';

interface SpecialEvent {
  id: number;
  title: string;
  time: string;
  type: string;
  department: string;
  durationDetails: string;
}

interface SpecialProgramsProps {
  specialEvents: SpecialEvent[];
  userRole?: UserRole | string;
  onAddClick: () => void;
}

const SpecialPrograms: React.FC<SpecialProgramsProps> = ({
  specialEvents,
  userRole,
  onAddClick,
}) => {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <div className="w-2 h-14 bg-amber-500 rounded-full shadow-lg shadow-amber-500/20" />
          <div>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter">
              Programmes Spéciaux
            </h3>
            <p className="text-xl text-slate-500 font-medium mt-2">
              Événements ponctuels, retraites et grandes célébrations.
            </p>
          </div>
        </div>

        {userRole === UserRole.ADMIN && (
          <button
            onClick={onAddClick}
            className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-bold shadow-xl hover:bg-primary transition-all flex items-center gap-3 active:scale-95"
          >
            <span className="material-icons-round text-3xl">add_box</span>
            <span className="hidden md:inline">Ajouter Programme</span>
          </button>
        )}
      </div>

      {specialEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialEvents.map((event) => (
            <div
              key={event.id}
              className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-icons-round text-9xl">event_star</span>
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/10">
                  <span className="material-icons-round text-sm text-amber-400">star</span>
                  Spécial
                </div>
                <h4 className="text-3xl font-bold mb-4 leading-tight">{event.title}</h4>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-blue-200">
                    <span className="material-icons-round">calendar_month</span>
                    <span className="font-bold text-lg capitalize">{event.durationDetails}</span>
                  </div>
                  <div className="flex items-center gap-3 text-blue-200">
                    <span className="material-icons-round">schedule</span>
                    <span className="font-medium text-lg">{event.time}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
                    {event.department}
                  </span>
                  <button className="w-10 h-10 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <span className="material-icons-round">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-slate-100">
          <span className="material-icons-round text-6xl text-slate-300 mb-4 block">event_busy</span>
          <p className="text-xl text-slate-500 font-medium">
            Aucun programme spécial prévu pour le moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default SpecialPrograms;