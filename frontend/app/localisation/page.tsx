'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Navigation, Phone, ChevronRight, Search, Calendar } from 'lucide-react';

// Import dynamique obligatoire — Leaflet ne fonctionne pas côté serveur (SSR)
const ParishMap = dynamic(
  () => import('@/components/location/ChurchLocation'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-medium text-sm">Chargement de la carte...</p>
        </div>
      </div>
    ),
  }
);

// ── Données des paroisses ─────────────────────────────────
// 📍 Remplace lat/lng par les vraies coordonnées GPS de chaque église
// Pour trouver les coordonnées : ouvre Google Maps → clic droit → "Quelles sont les coordonnées ici ?"
const PARISHES = [
  {
    name:    'MEJ Koinonia ',
    address: 'Marché Talangaï, Brazzaville',
    time:    '08h30 - 10h30',
    days:    'Mardi, Jeudi, Dimanche',
    phone:   '+242 06 000 0000',
    status:  'OUVERT',
    // ⬇️ Coordonnées actuelles : centre de Poto-Poto, Brazzaville
    // Remplace par les vraies coordonnées de l'église
    lat:  -4.225601,
    lng:  15.288686,
  },
  {
    name:    'MEJ OCH',
    address: 'Marché Talangaï, Brazzaville',
    time:    '08h30 - 10h30',
    days:    'Dimanche',
    phone:   '+242 06 000 0001',
    status:  'OUVERT',
    lat:  -4.263179,
    lng:  15.27175,
     
  },
  {
    name:    'Cathédrale Sacré-Cœur',
    address: 'Centre-ville, Brazzaville',
    time:    '07h00, 09h00, 11h00',
    days:    'Tous les jours',
    phone:   '+242 06 000 0002',
    status:  null,
    lat:  -4.2700,
    lng:  15.2700,
  },
];

export default function LocalisationPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [search,      setSearch]      = useState('');

  const filtered = PARISHES.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (originalIndex: number) => {
    setActiveIndex(originalIndex);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-10 pb-16 space-y-8">

      {/* En-tête */}
      <div className="space-y-2">
        <span className="text-primary font-bold text-xs uppercase tracking-[0.5em]">Nous trouver</span>
        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tighter leading-none">Nos Paroisses</h2>
        <p className="text-slate-500 text-lg font-medium">Retrouvez-nous à Brazzaville et dans ses environs.</p>
      </div>

      {/* Layout principal */}
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-18rem)] min-h-[600px]">

        {/* ── Sidebar liste ── */}
        <div className="w-full lg:w-[380px] shrink-0 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">

          {/* Recherche */}
          <div className="p-5 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une paroisse..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none text-sm font-medium text-slate-900 transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-400 font-medium mt-3 px-1">
              {PARISHES.length} paroisse{PARISHES.length > 1 ? 's' : ''} · Brazzaville
            </p>
          </div>

          {/* Liste scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {PARISHES.map((parish, i) => {
              const isActive = i === activeIndex;
              return (
                <motion.div
                  key={i}
                  onClick={() => handleSelect(i)}
                  whileTap={{ scale: 0.98 }}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${
                    isActive
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {/* Header carte */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}>
                      <span className="material-icons-round text-xl">church</span>
                    </div>
                    {parish.status && (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">
                        {parish.status}
                      </span>
                    )}
                  </div>

                  <h4 className={`font-bold text-base leading-tight mb-1.5 transition-colors ${isActive ? 'text-primary' : 'text-slate-900'}`}>
                    {parish.name}
                  </h4>
                  <p className="text-slate-500 text-xs mb-3 leading-relaxed">{parish.address}</p>

                  {/* Horaires */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 rounded-xl px-3 py-2 mb-3">
                    <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{parish.time}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 rounded-xl px-3 py-2 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{parish.days}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); handleSelect(i); }}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        isActive
                          ? 'bg-primary text-white shadow-md shadow-primary/30'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Navigation className="w-3.5 h-3.5" /> Itinéraire
                    </button>
                    <a
                      href={`tel:${parish.phone}`}
                      onClick={e => e.stopPropagation()}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Carte ── */}
        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative">
          <ParishMap parishes={PARISHES} activeIndex={activeIndex} />

          {/* Info bulle paroisse active */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-5 left-5 right-5 md:left-auto md:right-5 md:w-80 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-100 p-4 z-[1000]"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm leading-tight truncate">{PARISHES[activeIndex].name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{PARISHES[activeIndex].address}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Clock className="w-3 h-3 text-primary" />
                    <span className="text-xs font-bold text-primary">{PARISHES[activeIndex].time}</span>
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${PARISHES[activeIndex].lat},${PARISHES[activeIndex].lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md hover:bg-primary-hover transition-colors shrink-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Note sur les coordonnées */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
        <span className="text-amber-500 shrink-0 text-lg">📍</span>
        <div>
          <p className="text-sm font-bold text-amber-800">Coordonnées GPS à personnaliser</p>
          <p className="text-xs text-amber-600 mt-0.5">
            Dans <code className="bg-amber-100 px-1 rounded">app/localisation/page.tsx</code>, remplace les valeurs <code className="bg-amber-100 px-1 rounded">lat</code> et <code className="bg-amber-100 px-1 rounded">lng</code> dans le tableau <code className="bg-amber-100 px-1 rounded">PARISHES</code> par les vraies coordonnées trouvées sur Google Maps (clic droit → "Quelles sont les coordonnées ici ?").
          </p>
        </div>
      </div>
    </div>
  );
}