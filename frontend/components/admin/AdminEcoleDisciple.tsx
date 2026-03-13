/**
 * AdminEcodim.tsx
 * ────────────────
 * Onglet "École des Disciples" du dashboard admin.
 *
 * FONCTIONNALITÉS :
 *   - Afficher les étudiants groupés par niveau (1→4)
 *   - Changer le niveau d'un étudiant (flèche haut/bas)
 *   - Supprimer un étudiant du niveau (quand il change de niveau externe)
 *   - Ajouter un étudiant à un niveau
 *
 * NIVEAUX définis dans EcodimContext.ECODIM_LEVELS
 * MAINTENANCE : modifier EcodimContext pour changer les niveaux disponibles
 */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp, ChevronDown, Trash2, Plus,
  BookOpen, X, Save, Loader2, AlertTriangle, Users,
} from 'lucide-react';
import { useEcoDisciple, ECODIM_LEVELS, EcodimLevel, EcodimStudent } from '@/context/EcoleDeDiscipleContext';
import { useNotifications } from '@/context/NotificationContext';

const P = '#135bec';

// ── Formulaire ajout étudiant vide ────────────────────────
const EMPTY_STUDENT = {
  name: '', avatar: '', avatarColor: '#135bec',
  level: 1 as EcodimLevel, joinedAt: '', parish: '', phone: '',
};

// ── Couleurs d'avatar prédéfinies ─────────────────────────
const AVATAR_COLORS = ['#135bec','#7c3aed','#dc2626','#16a34a','#f59e0b','#0891b2','#be185d'];

export default function AdminEcodim() {
  const { students, addStudent, removeStudent, changeLevel } = useEcoDisciple();
  const { addNotification } = useNotifications();

  // ── État UI ───────────────────────────────────────────────
  const [showForm,  setShowForm]  = useState(false);
  const [deleteId,  setDeleteId]  = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [formData,  setFormData]  = useState(EMPTY_STUDENT);
  // Filtre par niveau — null = tous les niveaux
  const [filterLvl, setFilterLvl] = useState<EcodimLevel | null>(null);

  // ── Étudiants filtrés ─────────────────────────────────────
  const displayed = filterLvl
    ? students.filter(s => s.level === filterLvl)
    : students;

  // ── Étudiants par niveau (pour les compteurs) ─────────────
  const byLevel = (lvl: EcodimLevel) => students.filter(s => s.level === lvl);

  // ── Auto-générer les initiales depuis le nom ──────────────
  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0] || '').join('').slice(0, 2).toUpperCase();

  // ── Ajouter un étudiant ───────────────────────────────────
  const handleAdd = async () => {
    if (!formData.name || !formData.parish) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    addStudent({
      ...formData,
      avatar: formData.avatar || getInitials(formData.name),
      joinedAt: formData.joinedAt || new Date().toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
    });
    addNotification({
      type: 'ecodim',
      title: 'Inscription École des Disciples',
      message: `${formData.name} a été inscrit(e) au niveau ${ECODIM_LEVELS[formData.level].label}.`,
      meta: { memberName: formData.name },
    });
    setSaving(false);
    setShowForm(false);
    setFormData(EMPTY_STUDENT);
  };

  // ── Changer de niveau ─────────────────────────────────────
  const handleChangeLevel = (student: EcodimStudent, direction: 'up' | 'down') => {
    const newLevel = (direction === 'up'
      ? Math.min(student.level + 1, 4)
      : Math.max(student.level - 1, 1)) as EcodimLevel;

    if (newLevel === student.level) return;
    changeLevel(student.id, newLevel);
    addNotification({
      type: 'member_update',
      title: 'Changement de niveau',
      message: `${student.name} est passé(e) au ${ECODIM_LEVELS[newLevel].label}.`,
      meta: { memberName: student.name },
    });
  };

  // ── Supprimer ─────────────────────────────────────────────
  const handleDelete = (id: string, name: string) => {
    removeStudent(id);
    addNotification({
      type: 'member_update',
      title: 'Étudiant retiré',
      message: `${name} a été retiré(e) de l'École des Disciples.`,
      meta: { memberName: name },
    });
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">École des Disciples</h3>
          <p className="text-sm text-slate-500 mt-0.5">{students.length} étudiants · 4 niveaux</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-sm"
          style={{ backgroundColor: P, boxShadow: `0 8px 20px rgba(19,91,236,0.3)` }}
        >
          <Plus className="w-4 h-4" /> Inscrire
        </button>
      </div>

      {/* Cartes résumé par niveau */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {([1, 2, 3, 4] as EcodimLevel[]).map(lvl => {
          const cfg   = ECODIM_LEVELS[lvl];
          const count = byLevel(lvl).length;
          const active = filterLvl === lvl;
          return (
            <button key={lvl} onClick={() => setFilterLvl(active ? null : lvl)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${cfg.bg} ${active ? cfg.border : 'border-transparent'}`}
            >
              <p className={`text-2xl font-black ${cfg.color}`}>{count}</p>
              <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${cfg.color} opacity-70`}>
                Niv. {lvl} — {cfg.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Badge filtre actif */}
      {filterLvl && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Filtre actif :</span>
          <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${ECODIM_LEVELS[filterLvl].bg} ${ECODIM_LEVELS[filterLvl].color} ${ECODIM_LEVELS[filterLvl].border}`}>
            Niveau {filterLvl} — {ECODIM_LEVELS[filterLvl].label}
            <button onClick={() => setFilterLvl(null)} className="ml-1 opacity-60 hover:opacity-100">
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}

      {/* Tableau des étudiants */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Étudiant</th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest hidden md:table-cell">Paroisse</th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Niveau</th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest hidden sm:table-cell">Inscrit</th>
              <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout">
              {displayed.map((student, i) => {
                const cfg = ECODIM_LEVELS[student.level];
                return (
                  <motion.tr key={student.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* Nom + avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                          style={{ backgroundColor: student.avatarColor }}>
                          {student.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{student.name}</p>
                          {student.phone && <p className="text-xs text-slate-400">{student.phone}</p>}
                        </div>
                      </div>
                    </td>

                    {/* Paroisse */}
                    <td className="px-6 py-4 text-sm text-slate-500 hidden md:table-cell">{student.parish}</td>

                    {/* Badge niveau */}
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        Niv. {student.level} — {cfg.label}
                      </span>
                    </td>

                    {/* Date inscription */}
                    <td className="px-6 py-4 text-sm text-slate-400 hidden sm:table-cell">{student.joinedAt}</td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {/* Monter de niveau */}
                        <button
                          onClick={() => handleChangeLevel(student, 'up')}
                          disabled={student.level === 4}
                          title="Monter d'un niveau"
                          className="p-1.5 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        {/* Descendre de niveau */}
                        <button
                          onClick={() => handleChangeLevel(student, 'down')}
                          disabled={student.level === 1}
                          title="Descendre d'un niveau"
                          className="p-1.5 text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        {/* Supprimer */}
                        <button
                          onClick={() => setDeleteId(student.id)}
                          title="Retirer de l'école"
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>

            {displayed.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-14 text-slate-400">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="font-bold text-sm">Aucun étudiant pour ce niveau</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal Ajout étudiant ──────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
              onClick={() => setShowForm(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[480px] bg-white rounded-[2rem] shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-lg">Inscrire un étudiant</h4>
                <button onClick={() => setShowForm(false)}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-7 py-6 space-y-4">
                {/* Nom */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Nom complet *</label>
                  <input type="text" value={formData.name}
                    onChange={e => setFormData(f => ({ ...f, name: e.target.value, avatar: getInitials(e.target.value) }))}
                    placeholder="Prénom Nom"
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent outline-none font-medium text-slate-900"
                    onFocus={e => { e.target.style.borderColor = P; e.target.style.backgroundColor = '#fff'; }}
                    onBlur={e  => { e.target.style.borderColor = 'transparent'; e.target.style.backgroundColor = ''; }}
                  />
                </div>

                {/* Paroisse + Téléphone */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Paroisse *</label>
                    <input type="text" value={formData.parish}
                      onChange={e => setFormData(f => ({ ...f, parish: e.target.value }))}
                      placeholder="MEJ Koinonia"
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent outline-none font-medium text-slate-900"
                      onFocus={e => { e.target.style.borderColor = P; e.target.style.backgroundColor = '#fff'; }}
                      onBlur={e  => { e.target.style.borderColor = 'transparent'; e.target.style.backgroundColor = ''; }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Téléphone</label>
                    <input type="tel" value={formData.phone}
                      onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+242 06..."
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent outline-none font-medium text-slate-900"
                      onFocus={e => { e.target.style.borderColor = P; e.target.style.backgroundColor = '#fff'; }}
                      onBlur={e  => { e.target.style.borderColor = 'transparent'; e.target.style.backgroundColor = ''; }}
                    />
                  </div>
                </div>

                {/* Niveau */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Niveau de départ</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([1, 2, 3, 4] as EcodimLevel[]).map(lvl => {
                      const cfg = ECODIM_LEVELS[lvl];
                      const active = formData.level === lvl;
                      return (
                        <button key={lvl} type="button"
                          onClick={() => setFormData(f => ({ ...f, level: lvl }))}
                          className={`px-4 py-3 rounded-2xl border-2 text-sm font-bold text-left transition-all ${cfg.bg} ${active ? cfg.border : 'border-transparent'} ${cfg.color}`}
                        >
                          Niv. {lvl} — {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Couleur avatar */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Couleur avatar</label>
                  <div className="flex gap-2">
                    {AVATAR_COLORS.map(c => (
                      <button key={c} type="button"
                        onClick={() => setFormData(f => ({ ...f, avatarColor: c }))}
                        className="w-8 h-8 rounded-full border-2 transition-all"
                        style={{
                          backgroundColor: c,
                          borderColor: formData.avatarColor === c ? '#0f172a' : 'transparent',
                          transform: formData.avatarColor === c ? 'scale(1.15)' : 'scale(1)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-7 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-2xl font-bold text-sm text-slate-500 hover:bg-slate-100 transition-all">
                  Annuler
                </button>
                <button onClick={handleAdd} disabled={saving || !formData.name || !formData.parish}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm text-white disabled:opacity-50"
                  style={{ backgroundColor: P }}
                >
                  {saving
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Inscription...</>
                    : <><Save className="w-4 h-4" /> Inscrire</>
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
          const s = students.find(st => st.id === deleteId);
          return s ? (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
                onClick={() => setDeleteId(null)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[400px] bg-white rounded-[2rem] shadow-2xl z-50 p-8 text-center"
              >
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg mb-2">Retirer cet étudiant ?</h4>
                <p className="text-slate-500 text-sm mb-6">
                  <strong>{s.name}</strong> sera retiré(e) de l'École des Disciples (niveau {ECODIM_LEVELS[s.level].label}).
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)}
                    className="flex-1 py-3 rounded-2xl font-bold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                    Annuler
                  </button>
                  <button onClick={() => handleDelete(deleteId, s.name)}
                    className="flex-1 py-3 rounded-2xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all">
                    Retirer
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
