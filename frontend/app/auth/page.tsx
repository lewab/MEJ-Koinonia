'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

// ── Comptes de démo (simule une vraie API) ────────────────
const DEMO_ACCOUNTS = [
  { email: 'admin@mej.com',  password: '1111', name: 'Admin MEJ',    role: UserRole.ADMIN,  avatar: '' },
  { email: 'membre@mej.com', password: '2222', name: 'Jean-Pierre',  role: UserRole.MEMBER, avatar: '' },
];

type Mode = 'login' | 'register';

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [mode,      setMode]      = useState<Mode>('login');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [showPass,  setShowPass]  = useState(false);

  // Champs
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simule un délai réseau
    await new Promise(r => setTimeout(r, 900));

    try {
      if (mode === 'login') {
        const account = DEMO_ACCOUNTS.find(
          a => a.email === email && a.password === password
        );
        if (!account) throw new Error('Email ou mot de passe incorrect.');

        login({
          id: `user-${Date.now()}`,
          name: account.name,
          email: account.email,
          role: account.role,
          avatar: account.avatar,
        });
        router.push('/');
      } else {
        if (!firstName || !lastName || !email || !password)
          throw new Error('Tous les champs sont requis.');
        if (password.length < 4)
          throw new Error('Mot de passe trop court (min. 4 caractères).');

        login({
          id: `user-${Date.now()}`,
          name: `${firstName} ${lastName}`,
          email,
          role: UserRole.MEMBER,
          avatar: '',
        });
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (type: 'admin' | 'member') => {
    const acc = type === 'admin' ? DEMO_ACCOUNTS[0] : DEMO_ACCOUNTS[1];
    setEmail(acc.email);
    setPassword(acc.password);
    setMode('login');
  };

  return (
    <div className="min-h-screen flex items-stretch bg-slate-950">

      {/* ── Panneau gauche — Identité visuelle ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-16 overflow-hidden">
        {/* Image de fond */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1600&q=80"
            alt="background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/80 to-primary/30" />
        </div>

        {/* Contenu gauche */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-xl shadow-blue-500/20">
              <Image src="/assets/images/logo.jpeg" alt="MEJ Logo" fill className="object-cover" />
            </div>
            <div>
              <span className="flex gap-2 text-white font-black text-lg leading-none">
                  <span>MEJ</span>
                  <span>KOÏNONIA</span>
                </span>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ministère d'évangélisation</p>
            </div>
          </div>

          {/* Texte central */}
          <div className="space-y-8 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="text-6xl font-bold text-white leading-[0.9] tracking-tighter mb-6">
                Connectez-vous à<br />
                <span className="text-primary">la Source</span><br />
                de Vie.
              </h1>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Accédez à nos ressources spirituelles, participez à nos programmes et rejoignez une communauté de foi vivante.
              </p>
            </motion.div>

            {/* Témoignage */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <p className="text-white/80 italic text-base leading-relaxed mb-4">
                "Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos."
              </p>
              <p className="text-primary font-bold text-sm uppercase tracking-widest">— Matthieu 11:28</p>
            </motion.div>
          </div>

          {/* Bouton retour */}
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-sm w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Retour au site
          </Link>
        </div>
      </div>

      {/* ── Panneau droit — Formulaire ── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-white">
        {/* Retour mobile */}
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm mb-10 lg:hidden w-fit">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        <div className="max-w-md mx-auto w-full">

          {/* Titre */}
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10 space-y-2"
          >
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              {mode === 'login' ? 'Bienvenue 👋' : 'Créer un compte'}
            </h2>
            <p className="text-slate-500 text-lg">
              {mode === 'login'
                ? 'Heureux de vous revoir parmi nous.'
                : 'Rejoignez la communauté MEJ Koinonia.'}
            </p>
          </motion.div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 gap-4 overflow-hidden"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Prénom</label>
                    <input
                      type="text" value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      required={mode === 'register'}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium outline-none text-slate-900"
                      placeholder="Jean"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nom</label>
                    <input
                      type="text" value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      required={mode === 'register'}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium outline-none text-slate-900"
                      placeholder="Dupont"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium outline-none text-slate-900"
                placeholder="exemple@mej.com"
              />
            </div>

            {/* Mot de passe */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-5 py-4 pr-14 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium outline-none text-slate-900"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Erreur */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 text-red-600 px-5 py-4 rounded-2xl text-sm font-bold border border-red-100"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bouton submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Connexion...</>
                : mode === 'login' ? 'Se connecter' : "S'inscrire"
              }
            </motion.button>
          </form>

          {/* Switch mode */}
          <div className="text-center mt-6">
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-primary font-bold hover:underline text-sm"
            >
              {mode === 'login' ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
            </button>
          </div>

          {/* Séparateur démo */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Comptes démo</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Boutons démo */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => fillDemo('admin')}
              className="flex items-center gap-2 px-4 py-3.5 rounded-2xl border-2 border-slate-200 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">Admin</p>
                <p className="text-[10px] text-slate-400 font-medium">admin@mej.com</p>
              </div>
            </button>

            <button
              onClick={() => fillDemo('member')}
              className="flex items-center gap-2 px-4 py-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 font-bold text-sm">
                JP
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">Membre</p>
                <p className="text-[10px] text-slate-400 font-medium">membre@mej.com</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}