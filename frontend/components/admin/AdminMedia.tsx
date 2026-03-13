/**
 * AdminMedia.tsx
 * ───────────────
 * Onglet "Médiathèque" du dashboard admin — CRUD complet.
 *
 * CONTEXTE : useMedia() + useNotifications()
 * ACTIONS : Lire, Ajouter (lien URL), Modifier titre/speaker, Supprimer
 * MAINTENANCE :
 *   - Champs formulaire : modifier EMPTY_FORM + les inputs
 *   - Upload réel : remplacer imageUrl/url par FormData + fetch /api/upload
 */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Film, Music, X,
  Save, Loader2, AlertTriangle, Search,
} from 'lucide-react';
import { useMedia } from '@/context/MediaContext';
import { useNotifications } from '@/context/NotificationContext';
import { MediaItem } from '@/types';

const P = '#135bec';

const EMPTY_FORM: Omit<MediaItem, 'id'> = {
  title: '', speaker: '', duration: '', type: 'video',
  date: '', description: '', image: '', size: '',
};

export default function AdminMedia() {
  const { mediaList, addMedia, removeMedia, updateMedia } = useMedia() as any;
  const { addNotification } = useNotifications();

  const [search,   setSearch]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState(EMPTY_FORM);

  // ── Filtrage par recherche ────────────────────────────────
  const filtered = mediaList.filter((m: MediaItem) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.speaker.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };

  const openEdit = (item: MediaItem) => {
    setForm({ title: item.title, speaker: item.speaker, duration: item.duration,
      type: item.type, date: item.date, description: item.description,
      image: item.image, size: item.size });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.speaker) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    if (editId) {
      updateMedia?.(editId, form);
    } else {
      addMedia({ ...form, id: `m-${Date.now()}`,
        image: form.image || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
        date: form.date || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      });
    }
    setSaving(false);
    setShowForm(false);
  };

  const handleDelete = (id: string, title: string) => {
    removeMedia(id);
    addNotification({ type: 'media_delete', title: 'Fichier supprimé',
      message: `"${title}" a été supprimé de la médiathèque.`, meta: { fileName: title } });
    setDeleteId(null);
  };

  const inputClass = "w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent outline-none font-medium text-slate-900 transition-all";
  const focusOn  = (e: React.FocusEvent<any>) => { e.target.style.borderColor = P; e.target.style.backgroundColor = '#fff'; };
  const focusOff = (e: React.FocusEvent<any>) => { e.target.style.borderColor = 'transparent'; e.target.style.backgroundColor = ''; };

  return (
    <div className="space-y-5">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Médiathèque</h3>
          <p className="text-sm text-slate-500 mt-0.5">{mediaList.length} fichiers</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="pl-9 pr-4 py-2.5 rounded-2xl bg-slate-100 border-2 border-transparent outline-none text-sm font-medium text-slate-700 w-44 transition-all"
              onFocus={e => e.target.style.borderColor = P}
              onBlur={e  => e.target.style.borderColor = 'transparent'}
            />
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-sm"
            style={{ backgroundColor: P, boxShadow: `0 8px 20px rgba(19,91,236,0.3)` }}>
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Titre', 'Intervenant', 'Type', 'Durée', 'Date', ''].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest first:pl-6 last:pr-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filtered.map((item: MediaItem, i: number) => (
                  <motion.tr key={item.id} layout
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 max-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          item.type === 'video' ? 'bg-red-50' : 'bg-blue-50'
                        }`}>
                          {item.type === 'video'
                            ? <Film className="w-4 h-4 text-red-500" />
                            : <Music className="w-4 h-4 text-blue-500" />
                          }
                        </div>
                        <span className="font-bold text-slate-900 truncate text-sm">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.speaker}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        item.type === 'video'
                          ? 'bg-red-50 text-red-700 border-red-100'
                          : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>{item.type}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">{item.duration}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(item)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(item.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400">
                  <Film className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="font-bold text-sm">Aucun fichier trouvé</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal formulaire */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" onClick={() => setShowForm(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[500px] bg-white rounded-[2rem] shadow-2xl z-50 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 shrink-0">
                <h4 className="font-bold text-slate-900 text-lg">{editId ? 'Modifier le fichier' : 'Nouveau fichier'}</h4>
                <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5" /></button>
              </div>
              <div className="overflow-y-auto flex-1 px-7 py-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Titre *</label>
                  <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Titre de la prédication" className={inputClass} onFocus={focusOn} onBlur={focusOff} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Intervenant *</label>
                    <input type="text" value={form.speaker} onChange={e => setForm(f => ({ ...f, speaker: e.target.value }))}
                      placeholder="Nom" className={inputClass} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Durée</label>
                    <input type="text" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                      placeholder="52:14" className={inputClass} onFocus={focusOn} onBlur={focusOff} />
                  </div>
                </div>
                {/* Type vidéo / audio */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Type</label>
                  <div className="flex gap-3">
                    {(['video', 'audio'] as const).map(t => (
                      <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm border-2 transition-all ${
                          form.type === t
                            ? t === 'video' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'border-slate-200 text-slate-500'
                        }`}>
                        {t === 'video' ? <Film className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                        {t === 'video' ? 'Vidéo' : 'Audio'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">URL Image de couverture</label>
                  <input type="url" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                    placeholder="https://..." className={inputClass} onFocus={focusOn} onBlur={focusOff} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Description</label>
                  <textarea value={form.description} rows={3} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className={`${inputClass} resize-none`} onFocus={focusOn} onBlur={focusOff} />
                </div>
              </div>
              <div className="px-7 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                <button onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-100">Annuler</button>
                <button onClick={handleSave} disabled={saving || !form.title || !form.speaker}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm text-white disabled:opacity-50"
                  style={{ backgroundColor: P }}>
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</> : <><Save className="w-4 h-4" /> {editId ? 'Modifier' : 'Créer'}</>}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal suppression */}
      <AnimatePresence>
        {deleteId && (() => {
          const item = mediaList.find((m: MediaItem) => m.id === deleteId);
          return item ? (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" onClick={() => setDeleteId(null)} />
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[400px] bg-white rounded-[2rem] shadow-2xl z-50 p-8 text-center">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg mb-2">Supprimer ce fichier ?</h4>
                <p className="text-slate-500 text-sm mb-6"><strong>"{item.title}"</strong> sera définitivement supprimé.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-2xl font-bold border-2 border-slate-200 text-slate-600">Annuler</button>
                  <button onClick={() => handleDelete(deleteId, item.title)} className="flex-1 py-3 rounded-2xl font-bold bg-red-500 text-white hover:bg-red-600">Supprimer</button>
                </div>
              </motion.div>
            </>
          ) : null;
        })()}
      </AnimatePresence>
    </div>
  );
}
