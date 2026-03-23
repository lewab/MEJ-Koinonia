'use client';

import React from 'react';

interface Props { onBack: () => void; }

const EcodimDepartment: React.FC<Props> = ({ onBack }) => (
  <div className="space-y-8 animate-in slide-in-from-right-12 duration-500">
    <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold mb-4 transition-colors">
      <span className="material-icons-round">arrow_back</span> Retour aux départements
    </button>

    <div className="relative bg-gradient-to-br from-emerald-400 to-green-600 rounded-[4rem] p-16 md:p-24 text-white shadow-2xl overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <span className="inline-block px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold uppercase tracking-widest border border-white/20">La Pépinière de la Foi</span>
          <h3 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter">ECODIM</h3>
          <p className="text-xl md:text-2xl text-emerald-50 font-medium">"Laissez venir à moi les petits enfants". Nous formons les champions de demain dans l'amour de Dieu.</p>
        </div>
        <div className="hidden md:block">
          <span className="material-icons-round text-[15rem] text-white/20">child_care</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { icon: 'menu_book', bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-100 hover:border-emerald-300', title: 'École du Dimanche', sub: 'Tous les dimanches 08h30', subColor: 'text-emerald-600', desc: "Enseignements bibliques adaptés par âge, chants, mémorisation de versets et travaux manuels." },
        { icon: 'egg_alt', bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-100 hover:border-amber-300', title: 'Spécial Pâques', sub: 'Événement Annuel', subColor: 'text-amber-600', desc: "Grande chasse aux œufs, théâtre sur la résurrection et chorale des enfants." },
        { icon: 'redeem', bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-100 hover:border-red-300', title: "Arbre de Noël", sub: 'Décembre', subColor: 'text-red-600', desc: "Spectacle de la Nativité, distribution de cadeaux et goûter festif." },
      ].map((card) => (
        <div key={card.title} className={`bg-white p-12 rounded-[3.5rem] border-2 ${card.border} shadow-xl flex flex-col items-center text-center transition-colors`}>
          <div className={`w-24 h-24 ${card.bg} ${card.text} rounded-full flex items-center justify-center mb-8`}>
            <span className="material-icons-round text-5xl">{card.icon}</span>
          </div>
          <h4 className="text-3xl font-bold text-slate-800 mb-2">{card.title}</h4>
          <p className={`${card.subColor} font-bold uppercase tracking-wider text-sm mb-6`}>{card.sub}</p>
          <p className="text-slate-500 text-lg">{card.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default EcodimDepartment;