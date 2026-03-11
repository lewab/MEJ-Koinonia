'use client';

import React from 'react';

interface Props { onBack: () => void; }

const WomenDepartment: React.FC<Props> = ({ onBack }) => (
  <div className="space-y-8 animate-in slide-in-from-right-12 duration-500">
    <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold mb-4 transition-colors">
      <span className="material-icons-round">arrow_back</span> Retour aux départements
    </button>

    <div className="relative bg-gradient-to-br from-pink-500 to-rose-600 rounded-[4rem] p-16 md:p-24 text-white shadow-2xl overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <span className="inline-block px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold uppercase tracking-widest border border-white/20">Femmes de Distinction</span>
          <h3 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter">Département des Femmes</h3>
          <p className="text-xl md:text-2xl text-pink-50 font-medium">"La femme sage bâtit sa maison". Unies pour prier, s'entraider et impacter notre génération.</p>
        </div>
        <div className="hidden md:block">
          <span className="material-icons-round text-[15rem] text-white/20">diversity_1</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { icon: 'event_available', bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-100 hover:border-pink-300', title: 'Réunion Hebdomadaire', sub: 'Vendredi 16h00 - 18h00', subColor: 'text-pink-600', desc: "Un temps précieux de partage, d'enseignement biblique et d'intercession spécifique." },
        { icon: 'volunteer_activism', bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-100 hover:border-purple-300', title: 'Entraide & Social', sub: 'Actions Solidaires', subColor: 'text-purple-600', desc: "Visites aux orphelinats, soutien aux veuves et accompagnement des familles." },
        { icon: 'self_improvement', bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-100 hover:border-rose-300', title: 'Retraites Spirituelles', sub: 'Annuelles', subColor: 'text-rose-600', desc: "Des moments à part pour se ressourcer dans la présence de Dieu et renforcer les liens fraternels." },
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

export default WomenDepartment;