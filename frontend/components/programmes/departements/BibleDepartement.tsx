'use client';

import React from 'react';

interface Props { onBack: () => void; }

const discipleshipLevels = [
  { level: 'Niveau 1', title: 'Fondations de la Foi', desc: 'Découvrir les piliers essentiels de la vie chrétienne.', icon: 'looks_one' },
  { level: 'Niveau 2', title: 'Maturité Spirituelle', desc: 'Approfondir sa relation avec Dieu et sa Parole.', icon: 'looks_two' },
  { level: 'Niveau 3', title: 'Service & Consécration', desc: "Identifier son appel et s'engager dans le corps du Christ.", icon: 'looks_3' },
  { level: 'Final', title: 'École du Ministère', desc: 'Formation spécialisée pour les futurs leaders et responsables.', icon: 'military_tech', special: true },
];

const BibleDepartment: React.FC<Props> = ({ onBack }) => (
  <div className="space-y-8 animate-in slide-in-from-right-12 duration-500">
    <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold mb-4 transition-colors">
      <span className="material-icons-round">arrow_back</span> Retour aux départements
    </button>

    <section className="bg-slate-900 rounded-[5rem] p-12 md:p-32 text-white relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
      <div className="relative z-10 grid lg:grid-cols-5 gap-20 items-center">
        <div className="lg:col-span-2 space-y-14">
          <div className="space-y-6">
            <span className="inline-block px-6 py-3 bg-primary/20 text-blue-200 rounded-full text-sm font-bold uppercase tracking-[0.4em] border border-white/10">
              Cursus Théologique
            </span>
            <h3 className="text-6xl md:text-8xl font-bold leading-[0.85] tracking-tighter">L'École des Disciples</h3>
          </div>
          <p className="text-slate-400 text-2xl leading-relaxed font-medium">
            Une formation structurée pour bâtir un fondement inébranlable et identifier votre appel au service du Seigneur.
          </p>
          <div className="bg-white/5 border border-white/10 p-12 rounded-[4rem] space-y-8">
            <p className="font-bold text-blue-200 flex items-center gap-4 uppercase tracking-[0.2em] text-xl">
              <span className="material-icons-round text-4xl">calendar_today</span> Mardi 17h00 - 19h00
            </p>
            <p className="text-2xl font-medium text-slate-300">Culte d'enseignement ouvert à tous, suivi des sessions par niveaux.</p>
          </div>
          <button className="w-full bg-primary text-white py-8 rounded-[2.5rem] font-bold text-3xl hover:bg-white hover:text-slate-900 transition-all shadow-2xl active:scale-95">
            S'inscrire à la prochaine session
          </button>
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-10">
          {discipleshipLevels.map((lvl, i) => (
            <div
              key={i}
              className={`p-14 rounded-[4rem] border transition-all hover:scale-105 duration-700 shadow-2xl ${
                lvl.special
                  ? 'bg-primary border-primary shadow-primary/40'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-12 shadow-2xl ${lvl.special ? 'bg-white text-primary' : 'bg-primary/20 text-primary'}`}>
                <span className="material-icons-round text-5xl">{lvl.icon}</span>
              </div>
              <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500 mb-6">{lvl.level}</h4>
              <h5 className="text-4xl font-bold mb-8 tracking-tighter leading-none">{lvl.title}</h5>
              <p className={`text-xl leading-relaxed font-medium ${lvl.special ? 'text-blue-50' : 'text-slate-400'}`}>{lvl.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default BibleDepartment;