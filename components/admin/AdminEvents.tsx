/**
 * AdminEvents.tsx
 * ────────────────
 * Onglet "Événements" du dashboard admin.
 * Permet : Lire, Ajouter, Modifier, Supprimer des événements.
 *
 * CONTEXTE : useEvents() depuis EventContext
 * NOTIFICATIONS : addNotification() déclenché à chaque action
 * MAINTENANCE :
 *   - Champs du formulaire : modifier EVENT_FIELDS + le state formData
 *   - Pour connecter à une API : remplacer addEvent/removeEvent par des fetch
 */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Calendar, Clock, MapPin,
  X, Save, Loader2, AlertTriangle, Check,
} from 'lucide-react';
import { useEvents } from '@/context/EventContext';
import { useNotifications } from '@/context/NotificationContext';
import { Event } from '@/types';

// ── Couleur primary ───────────────────────────────────────
const P = '#135bec';

// ── État initial du formulaire ────────────────────────────
const EMPTY_FORM = {
  title: '',
  date: '',
  time: '',
  description: '',
  imageUrl: '',
  location: '',
};

export default function AdminEvents() {
  const { events, addEvent, removeEvent, updateEvent } = useEvents() as any;
  const { addNotification } = useNotifications();

  // ── État UI ───────────────────────────────────────────────
  const [showForm,    setShowForm]    = useState(false);
  const [editId,      setEditId]      = useState<string | null>(null); // null = ajout, string = modification
  const [deleteId,    setDeleteId]    = useState<string | null>(null); // confirm suppression
  const [saving,      setSaving]      = useState(false);
  const [formData,    setFormData]    = useState(EMPTY_FORM);

  // ── Ouvrir le formulaire en mode ajout ────────────────────
  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setEditId(null);
    setShowForm(true);
  };

  // ── Ouvrir le formulaire en mode modification ─────────────
  const openEdit = (event: Event) => {
    setFormData({
      title:       event.title,
      date:        event.date,
      time:        event.time,
      description: event.description,
      imageUrl:    event.imageUrl,
      location:    event.location || '',
    });
    setEditId(event.id);
    setShowForm(true);
  };

  // ── Sauvegarder (ajout ou modification) ───────────────────
  const handleSave = async () => {
    if (!formData.title || !formData.date || !formData.time) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600)); // simulation réseau

    if (editId) {
      // Modification : mise à jour de l'événement existant
      updateEvent?.(editId, formData);
      addNotification({
        type: 'programme_add',
        title: 'Événement modifié',
        message: `"${formData.title}" a été mis à jour.`,
        meta: { programTitle: formData.title },
      });
    } else {
      // Ajout : nouvel événement avec ID unique
      addEvent({
        ...formData,
        id: `ev-${Date.now()}`,
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80',
      });
      addNotification({
        type: 'programme_add',
        title: 'Nouvel événement ajouté',
        message: `"${formData.title}" a été ajouté au calendrier.`,
        meta: { programTitle: formData.title },
      });
    }

    setSaving(false);
    setShowForm(false);
  };

  // ── Confirmer la suppression ───────────────────────────────
  const handleDelete = (id: string, title: string) => {
    removeEvent(id);
    addNotification({
      type: 'media_delete',
      title: 'Événement supprimé',
      message: `"${title}" a été retiré du calendrier.`,
    });
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">

      {/* En-tête section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Événements</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {events.length} événement{events.length > 1 ? 's' : ''} · Visibles sur la page d'accueil
          </p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-sm shadow-lg"
          style={{ backgroundColor: P, boxShadow: `0 8px 20px rgba(19,91,236,0.3)` }}
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Liste des événements */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {events.map((event: Event, i: number) => (
            <motion.div key={event.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-[1.5rem] border border-slate-100 flex items-center gap-4 p-4 shadow-sm hover:shadow-md transition-all group"
            >
              {/* Vignette */}
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <img src={event.imageUrl} alt={event.title}
                  className="w-full h-full object-cover" />
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 truncate">{event.title}</p>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full border"
                    style={{ color: P, backgroundColor: 'rgba(19,91,236,0.06)', borderColor: 'rgba(19,91,236,0.2)' }}>
                    {event.date}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />{event.time}
                  </span>
                  {event.location && (
                    <span className="text-xs text-slate-400 font-medium hidden md:flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{event.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions : Modifier + Supprimer */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => openEdit(event)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(event.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {events.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-bold">Aucun événement</p>
            <p className="text-sm mt-1">Cliquez sur "Ajouter" pour créer le premier.</p>
          </div>
        )}
      </div>

      {/* ── Modal Formulaire (Ajout / Modification) ────────── */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
              onClick={() => setShowForm(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[520px] bg-white rounded-[2rem] shadow-2xl z-50 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header modal */}
              <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 shrink-0">
                <h4 className="font-bold text-slate-900 text-lg">
                  {editId ? 'Modifier l\'événement' : 'Nouvel événement'}
                </h4>
                <button onClick={() => setShowForm(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Corps du formulaire */}
              <div className="overflow-y-auto flex-1 px-7 py-6 space-y-4">

                {/* Titre */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Titre *</label>
                  <input type="text" value={formData.title}
                    onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                    placeholder="Ex: Nuit de Louange"
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent outline-none font-medium text-slate-900 transition-all"
                    onFocus={e  => { e.target.style.borderColor = P; e.target.style.backgroundColor = '#fff'; }}
                    onBlur={e   => { e.target.style.borderColor = 'transparent'; e.target.style.backgroundColor = ''; }}
                  />
                </div>

                {/* Date + Heure sur la même ligne */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Date *</label>
                    <input type="text" value={formData.date}
                      onChange={e => setFormData(f => ({ ...f, date: e.target.value }))}
                      placeholder="SAM 12 AVR"
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent outline-none font-medium text-slate-900 transition-all"
                      onFocus={e  => { e.target.style.borderColor = P; e.target.style.backgroundColor = '#fff'; }}
                      onBlur={e   => { e.target.style.borderColor = 'transparent'; e.target.style.backgroundColor = ''; }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Heure *</label>
                    <input type="text" value={formData.time}
                      onChange={e => setFormData(f => ({ ...f, time: e.target.value }))}
                      placeholder="20:00 - 23:00"
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent outline-none font-medium text-slate-900 transition-all"
                      onFocus={e  => { e.target.style.borderColor = P; e.target.style.backgroundColor = '#fff'; }}
                      onBlur={e   => { e.target.style.borderColor = 'transparent'; e.target.style.backgroundColor = ''; }}
                    />
                  </div>
                </div>

                {/* Lieu */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Lieu</label>
                  <input type="text" value={formData.location}
                    onChange={e => setFormData(f => ({ ...f, location: e.target.value }))}
                    placeholder="Ex: MEJ Koinonia · Talangaï"
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent outline-none font-medium text-slate-900 transition-all"
                    onFocus={e  => { e.target.style.borderColor = P; e.target.style.backgroundColor = '#fff'; }}
                    onBlur={e   => { e.target.style.borderColor = 'transparent'; e.target.style.backgroundColor = ''; }}
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Description</label>
                  <textarea value={formData.description} rows={3}
                    onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                    placeholder="Description de l'événement..."
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent outline-none font-medium text-slate-900 resize-none transition-all"
                    onFocus={e  => { e.target.style.borderColor = P; e.target.style.backgroundColor = '#fff'; }}
                    onBlur={e   => { e.target.style.borderColor = 'transparent'; e.target.style.backgroundColor = ''; }}
                  />
                </div>

                {/* URL Image */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">URL Image</label>
                  <input type="url" value={formData.imageUrl}
                    onChange={e => setFormData(f => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent outline-none font-medium text-slate-900 transition-all"
                    onFocus={e  => { e.target.style.borderColor = P; e.target.style.backgroundColor = '#fff'; }}
                    onBlur={e   => { e.target.style.borderColor = 'transparent'; e.target.style.backgroundColor = ''; }}
                  />
                </div>
              </div>

              {/* Footer modal */}
              <div className="px-7 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                <button onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-100 transition-all">
                  Annuler
                </button>
                <button onClick={handleSave} disabled={saving || !formData.title || !formData.date || !formData.time}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm text-white transition-all disabled:opacity-50"
                  style={{ backgroundColor: P }}
                >
                  {saving
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</>
                    : <><Save className="w-4 h-4" /> {editId ? 'Modifier' : 'Créer'}</>
                  }
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Modal Confirmation Suppression ─────────────────── */}
      <AnimatePresence>
        {deleteId && (() => {
          const ev = events.find((e: Event) => e.id === deleteId);
          return ev ? (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
                onClick={() => setDeleteId(null)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[400px] bg-white rounded-[2rem] shadow-2xl z-50 p-8 text-center"
              >
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg mb-2">Supprimer cet événement ?</h4>
                <p className="text-slate-500 text-sm mb-6">
                  <strong>"{ev.title}"</strong> sera retiré de la page d'accueil. Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)}
                    className="flex-1 py-3 rounded-2xl font-bold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                    Annuler
                  </button>
                  <button onClick={() => handleDelete(deleteId, ev.title)}
                    className="flex-1 py-3 rounded-2xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all">
                    Supprimer
                  </button>
                </div>
              </motion.div>
            </>
          ) : null;
        })()}
      </AnimatePresence>

    </div>
  );
}
