'use client';

import React from 'react';

interface DepartmentGridProps {
  onSelect: (dept: string) => void;
}

const departments = [
  {
    id: 'youth',
    label: 'Jeunesse',
    desc: 'Pour les 18-35 ans. Un cadre dynamique pour vivre sa foi.',
    icon: 'groups',
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    link: 'text-blue-600',
  },
  {
    id: 'ecodim',
    label: 'Ecodim',
    desc: "L'école du dimanche pour l'éducation spirituelle des enfants.",
    icon: 'child_care',
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    link: 'text-emerald-600',
  },
  {
    id: 'bible',
    label: 'Formation',
    desc: 'École des disciples et cursus théologique pour tous.',
    icon: 'menu_book',
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    link: 'text-amber-600',
  },
  {
    id: 'women',
    label: 'Femmes',
    desc: 'Unies pour bâtir, prier et impacter notre génération.',
    icon: 'diversity_1',
    bg: 'bg-pink-100',
    text: 'text-pink-500',
    link: 'text-pink-500',
  },
];

const DepartmentGrid: React.FC<DepartmentGridProps> = ({ onSelect }) => {
  return (
    <div>
      <div className="flex items-center gap-6 mb-16">
        <div className="w-2 h-14 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/20" />
        <div>
          <h3 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tighter">
            Nos Départements
          </h3>
          <p className="text-2xl text-slate-500 font-medium mt-2">
            Engagez-vous et grandissez dans votre groupe d'appartenance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map((dept) => (
          <div
            key={dept.id}
            onClick={() => onSelect(dept.id)}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-2"
          >
            <div
              className={`w-20 h-20 ${dept.bg} ${dept.text} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}
            >
              <span className="material-icons-round text-4xl">{dept.icon}</span>
            </div>
            <h4 className="text-3xl font-bold text-slate-900 mb-4">{dept.label}</h4>
            <p className="text-slate-500 text-lg mb-8">{dept.desc}</p>
            <span className={`${dept.link} font-bold flex items-center gap-2 group-hover:gap-4 transition-all`}>
              Découvrir <span className="material-icons-round">arrow_forward</span>
            </span>
          </div>
        ))}

        {/* Hommes — placeholder */}
        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner opacity-70">
          <div className="w-20 h-20 bg-slate-200 text-slate-500 rounded-3xl flex items-center justify-center mb-8">
            <span className="material-icons-round text-4xl">engineering</span>
          </div>
          <h4 className="text-3xl font-bold text-slate-400 mb-4">Hommes</h4>
          <p className="text-slate-400 text-lg mb-8">Bientôt disponible.</p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentGrid;