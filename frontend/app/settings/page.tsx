'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Bell, Save, Loader2, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const TABS = [
  { id: 'profile',       label: 'Mon Profil',     icon: User },
  { id: 'security',      label: 'Sécurité',        icon: Shield   },
  { id: 'notifications', label: 'Notifications',   icon: Bell     },
];

const NOTIF_PREFS = [
  { key: 'culte',    title: 'Rappels de culte',        desc: 'Notification 1h avant chaque culte.' },
  { key: 'media',    title: 'Nouveaux contenus',       desc: 'Ajout de vidéos dans la médiathèque.' },
  { key: 'news',     title: 'Actualités du Mouvement', desc: 'Newsletter hebdomadaire MEJ.' },
];

export default function SettingsPage() {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [loading,   setLoading]   = useState(false);
  const [saved,     setSaved]     = useState(false);

  // Champs profil
  const [name,  setName]  = useState(user?.name  || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio,   setBio]   = useState('Membre passionné du mouvement MEJ.');

  // Champs sécurité
  const [currentPass, setCurrentPass] = useState('');
  const [newPass,     setNewPass]     = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass,    setShowPass]    = useState(false);

  // Notifications
  const [notifs, setNotifs] = useState({ culte: true, media: true, news: false });

  // Écran non connecté
  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-8">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
          <Lock className="w-9 h-9 text-slate-400" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Accès restreint</h2>
          <p className="text-slate-500 text-lg max-w-md">
            Connectez-vous pour accéder à vos paramètres personnels.
          </p>
        </div>
        <Link href="/auth"
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-primary transition-all shadow-xl">
          Se connecter
        </Link>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    updateUser({ name, email } as any);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getInitials = (n: string) => n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-10">

      {/* En-tête */}
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center shadow-2xl shrink-0">
          <Settings className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tighter">Paramètres</h1>
          <p className="text-slate-500 font-medium mt-1">Gérez votre profil et vos préférences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── Sidebar ── */}
        <div className="lg:col-span-4 space-y-4">

          {/* Tabs */}
          <div className="bg-white rounded-[2.5rem] p-3 border border-slate-100 shadow-sm">
            {TABS.map((tab) => {
              const Icon   = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-base transition-all duration-200 ${
                    active ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Carte profil */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl text-center relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-xl border-4 border-white/20 overflow-hidden">
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  : getInitials(user.name)
                }
              </div>
              <h3 className="text-lg font-bold truncate">{user.name}</h3>
              <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mt-1">{user.role}</p>
              <div className="bg-white/10 rounded-2xl px-4 py-3 text-sm font-medium mt-5 border border-white/10">
                Membre depuis <span className="text-white font-bold">Sept 2023</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Contenu ── */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">

            <form onSubmit={handleSave}>
              <div className="p-8 md:p-10">
                <AnimatePresence mode="wait">

                  {/* ── Profil ── */}
                  {activeTab === 'profile' && (
                    <motion.div key="profile"
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className="pb-4 border-b border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900">Informations publiques</h3>
                        <p className="text-slate-500 text-sm mt-1">Ces informations sont visibles par les autres membres.</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nom complet</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-medium transition-all text-slate-900"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-medium transition-all text-slate-900"
                        />
                        <p className="text-xs text-slate-400 pl-1">Utilisée pour la connexion.</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Biographie</label>
                        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4}
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-medium transition-all text-slate-900 resize-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* ── Sécurité ── */}
                  {activeTab === 'security' && (
                    <motion.div key="security"
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className="pb-4 border-b border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900">Mot de passe</h3>
                        <p className="text-slate-500 text-sm mt-1">Choisissez un mot de passe fort de 8 caractères minimum.</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mot de passe actuel</label>
                        <div className="relative">
                          <input type={showPass ? 'text' : 'password'} value={currentPass}
                            onChange={e => setCurrentPass(e.target.value)} placeholder="••••••••"
                            className="w-full px-5 py-4 pr-14 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-medium transition-all text-slate-900"
                          />
                          <button type="button" onClick={() => setShowPass(v => !v)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                            {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nouveau</label>
                          <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="••••••••"
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none font-medium transition-all text-slate-900"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Confirmer</label>
                          <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="••••••••"
                            className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 focus:ring-4 focus:ring-primary/10 outline-none font-medium transition-all text-slate-900 ${
                              confirmPass && confirmPass !== newPass ? 'border-red-300 focus:border-red-400' : 'border-transparent focus:border-primary'
                            }`}
                          />
                          {confirmPass && confirmPass !== newPass && (
                            <p className="text-xs text-red-500 font-bold pl-1">Les mots de passe ne correspondent pas.</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
                        <Shield className="w-6 h-6 text-primary mt-0.5 shrink-0" />
                        <div>
                          <h4 className="font-bold text-blue-900 text-sm">Authentification à deux facteurs</h4>
                          <p className="text-blue-700/80 text-xs mt-1">Pour plus de sécurité, activez l'A2F lors de votre prochaine connexion.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Notifications ── */}
                  {activeTab === 'notifications' && (
                    <motion.div key="notifications"
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className="pb-4 border-b border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900">Préférences de notification</h3>
                        <p className="text-slate-500 text-sm mt-1">Choisissez ce que vous souhaitez recevoir.</p>
                      </div>

                      <div className="space-y-3">
                        {NOTIF_PREFS.map(pref => (
                          <div key={pref.key}
                            onClick={() => setNotifs(n => ({ ...n, [pref.key]: !n[pref.key as keyof typeof n] }))}
                            className="flex items-center justify-between p-5 bg-slate-50 hover:bg-white rounded-2xl border-2 border-transparent hover:border-slate-200 transition-all cursor-pointer group"
                          >
                            <div>
                              <h4 className="font-bold text-slate-900">{pref.title}</h4>
                              <p className="text-slate-500 text-sm">{pref.desc}</p>
                            </div>
                            {/* Toggle custom */}
                            <div className={`w-12 h-6 rounded-full transition-all duration-300 shrink-0 ml-4 relative ${
                              notifs[pref.key as keyof typeof notifs] ? 'bg-primary' : 'bg-slate-300'
                            }`}>
                              <motion.div
                                animate={{ x: notifs[pref.key as keyof typeof notifs] ? 24 : 2 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="px-8 md:px-10 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
                <button type="button" onClick={() => window.history.back()}
                  className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-slate-900 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Retour
                </button>
                <div className="flex items-center gap-3">
                  <AnimatePresence>
                    {saved && (
                      <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4" /> Enregistré !
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-primary-hover transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</>
                      : <><Save className="w-4 h-4" /> Enregistrer</>
                    }
                  </motion.button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}