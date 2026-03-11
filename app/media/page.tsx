'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Play, Download, Video, Headphones } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMedia } from '@/context/MediaContext';
import { UserRole } from '@/types';
import UploadModal from '@/components/media/UploadModal';

export default function MediaPage() {
  const { user } = useAuth();
  const { mediaList, archivesList, addMedia } = useMedia();
  const isAdmin = user?.role === UserRole.ADMIN;

  const [search,      setSearch]      = useState('');
  const [filter,      setFilter]      = useState<'all' | 'video' | 'audio'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = mediaList.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                        item.speaker.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || item.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-12 pb-24 space-y-16">

      {/* ── Barre de recherche ── */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 flex flex-col lg:flex-row gap-5 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input type="text" placeholder="Rechercher une prédication, un thème..."
            className="w-full pl-14 pr-5 py-4 rounded-2xl border-2 border-transparent bg-slate-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-medium text-slate-900 transition-all"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-3 flex-wrap">
          {(['all', 'video', 'audio'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                filter === f ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
              }`}>
              {f === 'video' && <Video className="w-4 h-4 text-red-500" />}
              {f === 'audio' && <Headphones className="w-4 h-4 text-blue-500" />}
              {f === 'all' ? 'Tout' : f === 'video' ? 'Vidéos' : 'Audios'}
            </button>
          ))}
        </div>
        {isAdmin && (
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-blue-500/25 hover:bg-primary-hover transition-all whitespace-nowrap">
            <Plus className="w-5 h-5" /> Ajouter un contenu
          </motion.button>
        )}
      </section>

      {/* ── Dernières publications ── */}
      <section>
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-primary font-bold text-xs uppercase tracking-[0.5em] block mb-2">Nouveautés</span>
            <h3 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tighter leading-none">Dernières Publications</h3>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-xl font-bold text-slate-400">Aucun résultat pour "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item, i) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img src={item.image} alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <div className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wide backdrop-blur-md border border-white/20 ${
                    item.type === 'video' ? 'bg-red-600/80' : 'bg-primary/80'
                  }`}>
                    {item.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <Headphones className="w-3.5 h-3.5" />}
                    {item.type}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10">
                    {item.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-7 h-7 text-slate-900 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mb-3 uppercase tracking-wide">
                    <span>{item.date}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-primary">{item.speaker}</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 tracking-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-slate-500 text-sm mb-5 line-clamp-2 flex-1 leading-relaxed">{item.description}</p>
                  )}
                  <div className="flex gap-3 mt-auto">
                    <button className="flex-1 py-3.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-primary transition-all flex items-center justify-center gap-2 text-sm shadow-lg active:scale-95">
                      <Play className="w-4 h-4" />
                      {item.type === 'video' ? 'Regarder' : 'Écouter'}
                    </button>
                    <button className="w-14 h-14 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl border border-slate-100 flex items-center justify-center transition-all">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── Archives ── */}
      <section>
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-primary font-bold text-xs uppercase tracking-[0.5em] block mb-2">Parcours</span>
            <h3 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tighter leading-none">Archives & Séries</h3>
          </div>
          <select className="bg-white border border-slate-100 rounded-2xl text-sm font-bold px-5 py-3 outline-none shadow-sm appearance-none cursor-pointer text-slate-700">
            <option>Toutes les années</option>
            <option>2025</option><option>2024</option><option>2023</option>
          </select>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Contenu', 'Intervenant', 'Date', ''].map(h => (
                    <th key={h} className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {archivesList.map((item, i) => (
                  <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                          item.type === 'video' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {item.type === 'video' ? <Video className="w-5 h-5" /> : <Headphones className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{item.title}</p>
                          <p className="text-xs text-primary font-bold mt-0.5">{item.duration}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-500">{item.speaker}</td>
                    <td className="px-8 py-5 text-sm text-slate-400 font-medium">{item.date}</td>
                    <td className="px-8 py-5 text-right">
                      <button className="inline-flex items-center gap-2 bg-slate-900 hover:bg-primary text-white px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm active:scale-95">
                        <Play className="w-4 h-4" /> Lire
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-8 text-center border-t border-slate-50">
            <button className="text-primary font-bold hover:underline text-sm">Charger plus d'archives →</button>
          </div>
        </div>
      </section>

      {/* FAB mobile admin */}
      {isAdmin && (
        <motion.button whileTap={{ scale: 0.92 }} onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-primary rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center lg:hidden border-4 border-white">
          <Plus className="w-7 h-7 text-white" />
        </motion.button>
      )}

      {/* Modal upload */}
      <AnimatePresence>
        {isModalOpen && (
          <UploadModal
            onClose={() => setIsModalOpen(false)}
            onAdd={(item) => { addMedia(item); setIsModalOpen(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}