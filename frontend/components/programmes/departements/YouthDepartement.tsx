'use client';

import React from 'react';

interface Props { onBack: () => void; }

const YouthDepartment: React.FC<Props> = ({ onBack }) => (
  <div className="space-y-8 animate-in slide-in-from-right-12 duration-500">
    <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold mb-4 transition-colors">
      <span className="material-icons-round">arrow_back</span> Retour aux départements
    </button>

    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[4rem] p-16 md:p-24 text-white shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1600&q=80')] bg-cover opacity-20 mix-blend-overlay" />
      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
        <span className="inline-block px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold uppercase tracking-widest border border-white/20">Génération Josué</span>
        <h3 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter">La Jeunesse en Action</h3>
        <p className="text-xl md:text-2xl text-blue-100 font-medium">Un espace dynamique pour grandir ensemble, tisser des liens forts et vivre sa foi avec passion.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group hover:-translate-y-2">
        <div className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center mb-10 shadow-lg group-hover:rotate-6 transition-transform">
          <span className="material-icons-round text-4xl">event_available</span>
        </div>
        <h4 className="text-3xl font-bold text-slate-900 mb-4">Réunion Hebdomadaire</h4>
        <div className="flex items-center gap-3 text-primary font-bold text-lg mb-6">
          <span className="material-icons-round">schedule</span> Samedi • 16h00 - 18h00
        </div>
        <p className="text-slate-500 text-xl leading-relaxed">Louange vibrante, partage de la parole, débats thématiques et moments de prière intense.</p>
      </div>

      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group hover:-translate-y-2">
        <div className="w-20 h-20 bg-orange-500 text-white rounded-3xl flex items-center justify-center mb-10 shadow-lg group-hover:-rotate-6 transition-transform">
          <span className="material-icons-round text-4xl">sports_soccer</span>
        </div>
        <h4 className="text-3xl font-bold text-slate-900 mb-4">Activités Sportives</h4>
        <div className="flex items-center gap-3 text-orange-500 font-bold text-lg mb-6">
          <span className="material-icons-round">fitness_center</span> Mens Sana in Corpore Sano
        </div>
        <p className="text-slate-500 text-xl leading-relaxed">Football, basketball, et séances de fitness collectif pour renforcer la cohésion et la discipline.</p>
      </div>

      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group hover:-translate-y-2">
        <div className="w-20 h-20 bg-teal-500 text-white rounded-3xl flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 transition-transform">
          <span className="material-icons-round text-4xl">hiking</span>
        </div>
        <h4 className="text-3xl font-bold text-slate-900 mb-4">Sorties & Excursions</h4>
        <div className="flex items-center gap-3 text-teal-600 font-bold text-lg mb-6">
          <span className="material-icons-round">explore</span> Découverte & Partage
        </div>
        <p className="text-slate-500 text-xl leading-relaxed">Pique-niques, visites culturelles, retraites nature. Ces moments consolident les amitiés.</p>
      </div>
    </div>
  </div>
);

export default YouthDepartment;