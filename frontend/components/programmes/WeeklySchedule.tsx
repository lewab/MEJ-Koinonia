'use client';

import React from 'react';
import { UserRole } from '@/types';

interface ScheduleEvent {
  title: string;
  time: string;
  type: string;
  icon: string;
  color: string;
  department: string;
  isSuspended: boolean;
}

interface DayPlan {
  day: string;
  events: ScheduleEvent[];
}

interface WeeklyScheduleProps {
  weeklySchedule: DayPlan[];
  userRole?: UserRole | string;
  onToggleSuspension: (dayIdx: number, eventIdx: number) => void;
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  weeklySchedule,
  userRole,
  onToggleSuspension,
}) => {
  return (
    <div className="space-y-24">
      <section>
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-6">
            <div className="w-2 h-14 bg-primary rounded-full shadow-lg shadow-primary/20" />
            <div>
              <h3 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tighter">
                Agenda Hebdomadaire
              </h3>
              <p className="text-2xl text-slate-500 font-medium mt-2">
                Rythmez votre vie spirituelle avec nos cultes réguliers.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {weeklySchedule.map((dayPlan, dayIdx) => {
            const visibleEvents = dayPlan.events
              .map((event, originalIdx) => ({ ...event, originalIdx }))
              .filter(event => !event.isSuspended || userRole === UserRole.ADMIN);

            if (visibleEvents.length === 0) return null;

            return (
              <div
                key={dayPlan.day}
                className="bg-white rounded-[3rem] border border-slate-50 shadow-xl overflow-hidden flex flex-col hover:border-primary/20 transition-all duration-500 group hover:-translate-y-2"
              >
                <div className="bg-slate-100 py-8 px-8 flex justify-between items-center">
                  <span className="text-slate-900 font-bold text-3xl tracking-tighter uppercase">
                    {dayPlan.day}
                  </span>
                  <div className="w-10 h-1 rounded-full bg-slate-300" />
                </div>

                <div className="p-8 space-y-8 flex-1">
                  {visibleEvents.map((event) => (
                    <div
                      key={event.originalIdx}
                      className={`relative flex items-start gap-5 transition-all duration-300 ${
                        event.isSuspended ? 'opacity-50 grayscale' : ''
                      }`}
                    >
                      {event.isSuspended && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                          <span className="bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/20 -rotate-12 shadow-lg backdrop-blur-sm">
                            Suspendu
                          </span>
                        </div>
                      )}

                      <div
                        className={`w-14 h-14 ${event.color} text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0`}
                      >
                        <span className="material-icons-round text-2xl">{event.icon}</span>
                      </div>

                      <div className="flex-1">
                        <h4
                          className={`font-bold text-slate-900 text-xl leading-tight mb-1 ${
                            event.isSuspended ? 'line-through decoration-red-500 decoration-2' : ''
                          }`}
                        >
                          {event.title}
                        </h4>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">
                          {event.time}
                        </p>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold">
                          {event.department}
                        </span>
                      </div>

                      {userRole === UserRole.ADMIN && event.title !== 'Culte Dominical' && (
                        <button
                          onClick={() => onToggleSuspension(dayIdx, event.originalIdx)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all z-20 ${
                            event.isSuspended
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-red-100 text-red-500 hover:bg-red-500 hover:text-white'
                          }`}
                          title={event.isSuspended ? 'Réactiver' : 'Suspendre'}
                        >
                          <span className="material-icons-round text-lg">
                            {event.isSuspended ? 'check' : 'block'}
                          </span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default WeeklySchedule;