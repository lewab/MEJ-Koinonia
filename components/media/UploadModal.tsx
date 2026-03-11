'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Video, Headphones, CloudUpload, CheckCircle2, Loader2 } from 'lucide-react';
import { MediaItem } from '@/types';

interface UploadModalProps {
  onClose: () => void;
  onAdd: (item: MediaItem) => void;
}

export default function UploadModal({ onClose, onAdd }: UploadModalProps) {
  const [dragOver,  setDragOver]  = useState(false);
  const [file,      setFile]      = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded,  setUploaded]  = useState(false);
  const [form, setForm] = useState({
    title: '', speaker: '', description: '', type: 'video' as 'video' | 'audio',
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    if (f.type.startsWith('video/')) setForm(p => ({ ...p, type: 'video' }));
    if (f.type.startsWith('audio/')) setForm(p => ({ ...p, type: 'audio' }));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.speaker) return;
    setUploading(true);
    await new Promise(r => setTimeout(r, 2000));

    const newItem: MediaItem = {
      id: `m-${Date.now()}`,
      title: form.title,
      speaker: form.speaker,
      description: form.description,
      type: form.type,
      duration: '0:00',
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      image: form.type === 'video'
        ? 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
      size: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : 'N/A',
    };

    setUploading(false);
    setUploaded(true);
    await new Promise(r => setTimeout(r, 700));
    onAdd(newItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-10 pt-10 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-blue-500/30">
              <CloudUpload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Publier un contenu</h3>
              <p className="text-slate-500 text-sm">Vidéo ou audio · visible immédiatement</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {/* Zone drop */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragOver ? 'border-primary bg-primary/5 scale-[1.01]'
              : file   ? 'border-emerald-400 bg-emerald-50'
              :           'border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white'
            }`}
          >
            <input ref={fileRef} type="file" accept="video/*,audio/*" className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <AnimatePresence mode="wait">
              {file ? (
                <motion.div key="file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-4 justify-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    {form.type === 'video' ? <Video className="w-6 h-6 text-emerald-600" /> : <Headphones className="w-6 h-6 text-emerald-600" />}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900 text-sm">{file.name}</p>
                    <p className="text-xs text-emerald-600 font-bold">{(file.size / 1024 / 1024).toFixed(1)} MB · {form.type}</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 ml-2" />
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-600 mb-1">Glissez votre fichier ici</p>
                  <p className="text-sm text-slate-400">ou cliquez pour sélectionner · MP4, MKV, MP3, WAV</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Type */}
          <div className="grid grid-cols-2 gap-3">
            {(['video', 'audio'] as const).map((t) => (
              <button key={t} type="button" onClick={() => setForm(p => ({ ...p, type: t }))}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 font-bold transition-all ${
                  form.type === t
                    ? t === 'video' ? 'border-red-400 bg-red-50 text-red-600' : 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-100 text-slate-500 hover:border-slate-300'
                }`}>
                {t === 'video' ? <Video className="w-5 h-5" /> : <Headphones className="w-5 h-5" />}
                {t === 'video' ? 'Vidéo' : 'Audio'}
              </button>
            ))}
          </div>

          {/* Titre */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Titre *</label>
            <input required type="text"
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-medium transition-all text-slate-900"
              placeholder="La Puissance de la Prière..."
              value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>

          {/* Intervenant */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Intervenant *</label>
            <input required type="text"
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-medium transition-all text-slate-900"
              placeholder="Pasteur Jean-Pierre..."
              value={form.speaker} onChange={e => setForm(p => ({ ...p, speaker: e.target.value }))} />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
            <textarea rows={3}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-medium transition-all text-slate-900 resize-none"
              placeholder="Brève description..."
              value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>

          {/* Note */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
            <span className="text-amber-500 shrink-0">💡</span>
            <div>
              <p className="text-sm font-bold text-amber-800">Stockage local (Phase 1)</p>
              <p className="text-xs text-amber-600 mt-0.5">Pour un stockage permanent, connecter Cloudinary ou Supabase.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-colors border-2 border-slate-100">
              Annuler
            </button>
            <motion.button type="submit" whileTap={{ scale: 0.98 }}
              disabled={uploading || !form.title || !form.speaker}
              className="flex-[2] py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-primary-hover transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Publication...</>
               : uploaded ? <><CheckCircle2 className="w-5 h-5" /> Publié !</>
               : <><CloudUpload className="w-5 h-5" /> Publier</>}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}