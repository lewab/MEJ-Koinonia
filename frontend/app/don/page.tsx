'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Check, Lock, ChevronRight, History, Heart, TrendingUp, Users, Sparkles } from 'lucide-react';

const HISTORY = [
  { type: 'Dîme Mensuelle',      date: '22 Oct 2024', amount: '10 000', status: 'Succès' },
  { type: 'Projet Construction', date: '15 Oct 2024', amount: '5 000',  status: 'Succès' },
  { type: 'Offrande Culte',      date: '08 Oct 2024', amount: '2 000',  status: 'Succès' },
];

const STATS = [
  { icon: Heart,      label: 'Donateurs ce mois',  value: '147',    color: 'text-rose-500',   bg: 'bg-rose-50'   },
  { icon: TrendingUp, label: 'Collecté en 2024',   value: '2.4M F', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Users,      label: 'Projets financés',   value: '12',     color: 'text-blue-600',    bg: 'bg-blue-50'   },
];

export default function DonationPage() {
  const [amount,   setAmount]   = useState('');
  const [operator, setOperator] = useState<'mtn' | 'airtel'>('mtn');
  const [phone,    setPhone]    = useState('');
  const [step,     setStep]     = useState<'form' | 'confirm' | 'success'>('form');

  const handleConfirm = () => {
    if (!amount || !phone) return;
    setStep('confirm');
  };

  const handleSuccess = () => {
    setStep('success');
    setTimeout(() => setStep('form'), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero Banner ── */}
      <div className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-slate-900" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px]" />

        <div className="relative z-10 px-4 sm:px-6 lg:px-12 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Semer pour récolter
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-none mb-4">
                Donner, c'est
                <span className="text-primary"> agir.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto">
                Chaque contribution, grande ou petite, bâtit le royaume et transforme des vies.
              </p>
            </motion.div>

            {/* Stats rapides */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 mt-10 max-w-2xl mx-auto"
            >
              {STATS.map((stat, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                  <div className={`w-8 h-8 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <p className="text-xl font-bold text-white leading-none mb-1">{stat.value}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Contenu principal ── */}
      <div className="px-4 sm:px-6 lg:px-12 py-12 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Formulaire / Steps ── */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">

              {/* STEP : Formulaire */}
              {step === 'form' && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden"
                >
                  {/* Card header */}
                  <div className="px-10 pt-10 pb-6 border-b border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Faire un Don</h2>
                      <p className="text-slate-500 text-sm">Via Mobile Money — rapide et sécurisé</p>
                    </div>
                  </div>

                  <div className="p-10 space-y-10">

                    {/* Montant */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                        Montant (XAF)
                      </label>

                      {/* Suggestions */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {['1000', '5000', '10000', '25000', '50000', '100000'].map((val) => (
                          <button
                            key={val}
                            onClick={() => setAmount(val)}
                            className={`py-3.5 px-4 rounded-2xl border-2 font-bold text-base transition-all duration-200 ${
                              amount === val
                                ? 'border-primary bg-primary text-white shadow-lg shadow-blue-500/25'
                                : 'border-slate-100 text-slate-600 hover:border-slate-300 bg-slate-50 hover:bg-white'
                            }`}
                          >
                            {parseInt(val).toLocaleString()}
                          </button>
                        ))}
                      </div>

                      {/* Champ libre */}
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">FCFA</span>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full pl-16 pr-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 text-xl font-bold focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                          placeholder="Autre montant..."
                        />
                      </div>

                      {/* Barre de progression visuelle */}
                      {amount && parseInt(amount) > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10"
                        >
                          <p className="text-sm font-bold text-primary">
                            ✨ Vous donnez <span className="text-lg">{parseInt(amount).toLocaleString()} FCFA</span>
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Opérateur */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                        Opérateur
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {/* MTN */}
                        <label className="relative cursor-pointer group">
                          <input type="radio" name="operator" className="peer sr-only"
                            checked={operator === 'mtn'} onChange={() => setOperator('mtn')} />
                          <div className="p-6 rounded-2xl border-2 border-slate-100 bg-slate-50 peer-checked:border-yellow-400 peer-checked:bg-yellow-50 flex flex-col items-center gap-3 transition-all hover:border-yellow-300 hover:bg-yellow-50/50">
                            <div className="w-14 h-14 rounded-2xl bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/30">
                              <span className="font-black text-slate-900 text-base">MTN</span>
                            </div>
                            <span className="font-bold text-slate-700 text-sm">MTN Mobile Money</span>
                          </div>
                          <motion.div
                            className="absolute top-3 right-3 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                            initial={false}
                            animate={{ scale: operator === 'mtn' ? 1 : 0, opacity: operator === 'mtn' ? 1 : 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          >
                            <Check className="w-3.5 h-3.5 text-slate-900" />
                          </motion.div>
                        </label>

                        {/* Airtel */}
                        <label className="relative cursor-pointer group">
                          <input type="radio" name="operator" className="peer sr-only"
                            checked={operator === 'airtel'} onChange={() => setOperator('airtel')} />
                          <div className="p-6 rounded-2xl border-2 border-slate-100 bg-slate-50 peer-checked:border-red-400 peer-checked:bg-red-50 flex flex-col items-center gap-3 transition-all hover:border-red-300 hover:bg-red-50/50">
                            <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
                              <span className="font-black text-white text-xl">A</span>
                            </div>
                            <span className="font-bold text-slate-700 text-sm">Airtel Money</span>
                          </div>
                          <motion.div
                            className="absolute top-3 right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                            initial={false}
                            animate={{ scale: operator === 'airtel' ? 1 : 0, opacity: operator === 'airtel' ? 1 : 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          >
                            <Check className="w-3.5 h-3.5 text-white" />
                          </motion.div>
                        </label>
                      </div>
                    </div>

                    {/* Téléphone */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                        Numéro de téléphone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                          <span className="text-slate-500 font-bold">+242</span>
                        </div>
                        <input
                          type="tel"
                          placeholder="06 123 4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="block w-full pl-20 pr-14 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 text-xl font-bold tracking-widest focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        />
                        <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                          <Smartphone className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-slate-400 font-medium">Le montant sera débité de ce compte Mobile Money.</p>
                    </div>

                    {/* CTA */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirm}
                      disabled={!amount || !phone}
                      className="w-full py-5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-lg shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span>
                        {amount && parseInt(amount) > 0
                          ? `Confirmer ${parseInt(amount).toLocaleString()} FCFA`
                          : 'Entrez un montant'}
                      </span>
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>

                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                      <Lock className="w-3 h-3" />
                      <span>Paiement sécurisé · SSL 256-bit</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP : Confirmation */}
              {step === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 space-y-8"
                >
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto">
                      <Lock className="w-8 h-8 text-amber-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Confirmer le paiement</h2>
                    <p className="text-slate-500">Vérifiez les détails avant de valider</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 space-y-4 border border-slate-100">
                    {[
                      { label: 'Montant',    value: `${parseInt(amount).toLocaleString()} FCFA` },
                      { label: 'Opérateur', value: operator === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money' },
                      { label: 'Numéro',    value: `+242 ${phone}` },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium text-sm">{row.label}</span>
                        <span className="font-bold text-slate-900">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep('form')}
                      className="flex-1 py-4 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
                    >
                      Modifier
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSuccess}
                      className="flex-1 py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-primary-hover transition-all"
                    >
                      Valider le don
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* STEP : Succès */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-16 text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"
                  >
                    <Check className="w-12 h-12 text-emerald-600" />
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Don effectué !</h2>
                    <p className="text-slate-500">Merci pour votre générosité. Que Dieu multiplie ce que vous avez semé.</p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 rounded-2xl text-emerald-700 font-bold text-lg">
                    <Sparkles className="w-5 h-5" />
                    {parseInt(amount).toLocaleString()} FCFA reçus
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-4 space-y-6">

            {/* Historique */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-7 py-6 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <History className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Historique</h3>
                  <p className="text-xs text-slate-500">Vos derniers dons</p>
                </div>
              </div>

              <div className="px-4 py-4 space-y-1">
                {HISTORY.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.type}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{item.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{item.amount} F</p>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                        {item.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="px-7 pb-6">
                <button className="w-full py-3 text-sm text-primary font-bold hover:bg-primary/5 rounded-2xl transition-all">
                  Voir tout l'historique →
                </button>
              </div>
            </div>

            {/* Verset d'encouragement */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
              <div className="relative z-10 space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Parole d'encouragement</span>
                <p className="text-white font-bold text-lg leading-snug italic">
                  "Donnez et il vous sera donné : on versera dans votre sein une bonne mesure..."
                </p>
                <p className="text-slate-500 text-sm font-bold">— Luc 6:38</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}