'use client';

import React, { useState } from 'react';
import { UserRole } from '@/types';
import WeeklySchedule from '@/components/programmes/WeeklySchedule';
import SpecialPrograms from '@/components/programmes/SpecialPrograms';
import AddProgramModal, { NewEventForm } from '@/components/programmes/AddProgrammodal'

import DepartmentGrid from '@/components/programmes/DepartementGrid';
import YouthDepartment from '@/components/programmes/departements/YouthDepartement';
import EcodimDepartment from '@/components/programmes/departements/EcodimDepartement';
import WomenDepartment from '@/components/programmes/departements/WomenDepartement';
import BibleDepartment from '@/components/programmes/departements/BibleDepartement';
import { useAuth } from '@/context/AuthContext';

type ProgramTab = 'cults' | 'special' | 'departments';

const TABS: { id: ProgramTab; label: string; icon: string }[] = [
  { id: 'cults',       label: 'Cultes',               icon: 'church'      },
  { id: 'special',     label: 'Programmes Spéciaux',  icon: 'event_star'  },
  { id: 'departments', label: 'Vie des Départements', icon: 'diversity_3' },
];

const INITIAL_SCHEDULE = [
  { day: 'Lundi',    events: [{ title: 'Intersession Générale', time: '17h00 - 19h00', type: 'Prière',       icon: 'volunteer_activism', color: 'bg-indigo-500', department: 'Général', isSuspended: false }] },
  { day: 'Mardi',    events: [{ title: "Culte d'Enseignement",  time: '17h00 - 19h00', type: 'Enseignement', icon: 'school',             color: 'bg-amber-500',  department: 'Général', isSuspended: false }] },
  { day: 'Jeudi',    events: [{ title: 'Culte de Délivrance',   time: '17h00 - 19h00', type: 'Prière',       icon: 'auto_awesome',       color: 'bg-purple-600', department: 'Général', isSuspended: false }] },
  { day: 'Vendredi', events: [] },
  { day: 'Samedi',   events: [] },
  { day: 'Dimanche', events: [{ title: 'Culte Dominical',       time: '08h30 - 10h30', type: 'Célébration',  icon: 'church',             color: 'bg-primary',    department: 'Général', isSuspended: false }] },
];

const EMPTY_FORM: NewEventForm = {
  startDate: '', endDate: '', title: '',
  startTime: '', endTime: '',
  type: 'Célébration', department: 'Général', duration: 1,
};

// ── Helpers ──────────────────────────────────────────────
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};
const formatDateFull = (dateStr: string) => {
  if (!dateStr) return '';
  const s = new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// ── Page ──────────────────────────────────────────────────
export default function ProgramsPage() {
  const { user } = useAuth();
  const userRole = user?.role;

  const [activeTab,      setActiveTab]      = useState<ProgramTab>('cults');
  const [isModalOpen,    setIsModalOpen]    = useState(false);
  const [activeDept,     setActiveDept]     = useState<string | null>(null);
  const [weeklySchedule, setWeeklySchedule] = useState(INITIAL_SCHEDULE);
  const [specialEvents,  setSpecialEvents]  = useState<any[]>([]);
  const [newEvent,       setNewEvent]       = useState<NewEventForm>(EMPTY_FORM);

  const toggleEventSuspension = (dayIdx: number, eventIdx: number) => {
    setWeeklySchedule(prev =>
      prev.map((day, dI) =>
        dI !== dayIdx ? day : {
          ...day,
          events: day.events.map((evt, eI) =>
            eI !== eventIdx ? evt : { ...evt, isSuspended: !evt.isSuspended }
          ),
        }
      )
    );
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    let durationDetails = '';
    if (newEvent.duration > 1 && newEvent.startDate && newEvent.endDate) {
      durationDetails = `Du ${formatDate(newEvent.startDate)} au ${formatDate(newEvent.endDate)}`;
    } else if (newEvent.startDate) {
      durationDetails = formatDateFull(newEvent.startDate);
    }

    setSpecialEvents(prev => [...prev, {
      id: Date.now(),
      title: newEvent.title,
      time: `${newEvent.startTime} - ${newEvent.endTime}`,
      type: newEvent.type,
      department: newEvent.department,
      duration: newEvent.duration,
      durationDetails,
      startDate: newEvent.startDate,
      endDate: newEvent.endDate,
    }]);

    setIsModalOpen(false);
    setActiveTab('special');
    setNewEvent(EMPTY_FORM);
  };

  // ── Render du contenu par onglet ─────────────────────
  const renderContent = () => {
    if (activeTab === 'cults') {
      return (
        <WeeklySchedule
          weeklySchedule={weeklySchedule}
          userRole={userRole}
          onToggleSuspension={toggleEventSuspension}
        />
      );
    }

    if (activeTab === 'special') {
      return (
        <SpecialPrograms
          specialEvents={specialEvents}
          userRole={userRole}
          onAddClick={() => setIsModalOpen(true)}
        />
      );
    }

    if (activeTab === 'departments') {
      if (activeDept === 'youth')  return <YouthDepartment  onBack={() => setActiveDept(null)} />;
      if (activeDept === 'ecodim') return <EcodimDepartment onBack={() => setActiveDept(null)} />;
      if (activeDept === 'women')  return <WomenDepartment  onBack={() => setActiveDept(null)} />;
      if (activeDept === 'bible')  return <BibleDepartment  onBack={() => setActiveDept(null)} />;
      return <DepartmentGrid onSelect={setActiveDept} />;
    }

    return null;
  };

  return (
    <div className="space-y-24 pb-32 px-4 sm:px-6 lg:px-12 relative">

      {/* En-tête */}
      <section className="text-center max-w-5xl mx-auto space-y-10 pt-10">
        <span className="text-primary font-bold text-sm uppercase tracking-[0.6em] block">
          Croissance & Communion
        </span>
        <h2 className="text-6xl md:text-9xl font-bold text-slate-900 tracking-tighter leading-none">
          Nos Programmes
        </h2>
        <p className="text-2xl md:text-3xl text-slate-500 leading-relaxed font-medium max-w-4xl mx-auto">
          Découvrez une vie communautaire riche, articulée autour de la formation spirituelle, du service et de la joie.
        </p>
      </section>

      {/* Onglets */}
      <section className="max-w-6xl mx-auto overflow-x-auto hide-scrollbar py-6">
        <div className="bg-white p-4 rounded-[4rem] border border-slate-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] flex items-center gap-4 min-w-max md:min-w-0 md:justify-center">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setActiveDept(null); }}
              className={`flex items-center gap-4 px-12 py-7 rounded-[3.5rem] font-bold transition-all duration-500 group ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-2xl scale-105'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className={`material-icons-round text-3xl transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {tab.icon}
              </span>
              <span className="whitespace-nowrap text-2xl tracking-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Contenu */}
      <div className="max-w-[1500px] mx-auto">
        {renderContent()}
      </div>

      {/* FAB Admin */}
      {userRole === UserRole.ADMIN && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-10 right-10 z-50 bg-slate-900 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform hover:bg-primary border-4 border-white"
          title="Ajouter un programme"
        >
          <span className="material-icons-round text-3xl">add</span>
        </button>
      )}

      {/* Section contact */}
      <section className="max-w-[1500px] mx-auto pt-10">
        <div className="bg-primary/5 rounded-[5rem] p-20 md:p-32 text-center border border-primary/10 shadow-inner overflow-hidden relative group">
          <div className="absolute -top-20 -right-20 p-8 text-primary/5 rotate-12 group-hover:scale-125 transition-transform duration-1000">
            <span className="material-icons-round text-[350px]">help_outline</span>
          </div>
          <div className="relative z-10 space-y-12">
            <h4 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tighter">
              Inscriptions & Renseignements
            </h4>
            <p className="text-slate-500 text-2xl mb-16 max-w-3xl mx-auto font-medium leading-relaxed">
              Besoin de plus d'informations sur nos formations ou nos cultes ? Le secrétariat est à votre disposition.
            </p>
            <div className="flex flex-wrap justify-center gap-10">
              <button className="bg-slate-900 text-white px-16 py-8 rounded-[2.5rem] font-bold text-2xl shadow-2xl hover:bg-primary transition-all active:scale-95">
                Prendre Rendez-vous
              </button>
              <button className="bg-white text-slate-900 px-16 py-8 rounded-[2.5rem] font-bold text-2xl border border-slate-200 shadow-xl hover:bg-slate-50 transition-all">
                Télécharger le Guide (PDF)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <AddProgramModal
        isOpen={isModalOpen}
        newEvent={newEvent}
        onChange={setNewEvent}
        onSubmit={handleAddEvent}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}