'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ThumbsUp, Share2, Send, Users, Wifi, WifiOff,
  Radio, ChevronRight, Heart, Flame, HandMetal, Copy, Check
} from 'lucide-react';

// ────────────────────────────────────────────────────────────
// 🎥 CONFIGURATION DU DIRECT
// ────────────────────────────────────────────────────────────
// Option A — YouTube Live (recommandé)
//   1. Lance un live sur YouTube Studio (téléphone ou PC)
//   2. Copie l'ID de ta vidéo live (ex: "dQw4w9WgXcQ" dans youtube.com/watch?v=dQw4w9WgXcQ)
//   3. Colle-le dans YOUTUBE_LIVE_ID ci-dessous
//   4. Mets IS_LIVE = true quand tu es en direct, false sinon
//
// Option B — Facebook Live
//   Remplace l'iframe src par : https://www.facebook.com/plugins/video.php?href=URL_DU_LIVE
// ────────────────────────────────────────────────────────────
const YOUTUBE_LIVE_ID = 'jfKfPfyJRdk'; // ← Remplace par ton ID YouTube Live
const IS_LIVE         = true;           // ← true = en direct | false = pas de direct
const STREAM_TITLE    = 'Culte Dominical — "La Fidélité de Dieu"';
const STREAM_SPEAKER  = 'Pasteur Jean';
const STREAM_PARISH   = 'MEJ Koinonia · Talangaï';
const VIEWER_COUNT    = '1.2k';
// ────────────────────────────────────────────────────────────

// Réactions disponibles
const REACTIONS = [
  { icon: '🙏', label: 'Amen',    key: 'amen'  },
  { icon: '🔥', label: 'Feu',     key: 'fire'  },
  { icon: '❤️', label: 'Amour',   key: 'love'  },
  { icon: '🎉', label: 'Joie',    key: 'joy'   },
];

// Messages de chat simulés
const INITIAL_MESSAGES = [
  { id: 1,  user: 'Marie K.',    avatar: 'MK', color: 'bg-blue-100 text-blue-700',   text: 'Amen ! Gloire à Dieu 🙏',              time: '10:42' },
  { id: 2,  user: 'Pasteur Paul',avatar: 'PP', color: 'bg-purple-100 text-purple-700',text: 'Que la paix soit avec vous tous !',    time: '10:43' },
  { id: 3,  user: 'Sœur Agnès', avatar: 'SA', color: 'bg-rose-100 text-rose-700',    text: 'Je suis bénie par ce message 🔥',       time: '10:44' },
  { id: 4,  user: 'Frère David', avatar: 'FD', color: 'bg-emerald-100 text-emerald-700', text: 'Alléluia ! Que Dieu vous bénisse.',  time: '10:45' },
  { id: 5,  user: 'Marie K.',    avatar: 'MK', color: 'bg-blue-100 text-blue-700',   text: 'Ce passage touche mon cœur ❤️',          time: '10:46' },
  { id: 6,  user: 'Jonas M.',    avatar: 'JM', color: 'bg-amber-100 text-amber-700', text: 'Merci Seigneur pour ce direct !',       time: '10:47' },
];

interface ChatMessage {
  id: number;
  user: string;
  avatar: string;
  color: string;
  text: string;
  time: string;
}

// Composant bulle de réaction flottante
function FloatingReaction({ emoji, id }: { emoji: string; id: number }) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 1, y: 0, x: Math.random() * 40 - 20, scale: 0.5 }}
      animate={{ opacity: 0, y: -120, scale: 1.4 }}
      transition={{ duration: 1.8, ease: 'easeOut' }}
      className="absolute bottom-16 right-6 text-3xl pointer-events-none z-50"
    >
      {emoji}
    </motion.div>
  );
}

export default function DirectPage() {
  const [messages,      setMessages]      = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input,         setInput]         = useState('');
  const [reactions,     setReactions]     = useState({ amen: 450, fire: 128, love: 89, joy: 67 });
  const [floating,      setFloating]      = useState<{ id: number; emoji: string }[]>([]);
  const [copied,        setCopied]        = useState(false);
  const [amened,        setAmened]        = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const nextId     = useRef(100);

  // Auto-scroll chat vers le bas
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id:     nextId.current++,
      user:   'Vous',
      avatar: 'ME',
      color:  'bg-primary/10 text-primary',
      text:   input.trim(),
      time:   new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  const handleReaction = (key: string, emoji: string) => {
    setReactions(prev => ({ ...prev, [key]: (prev as any)[key] + 1 }));
    const id = nextId.current++;
    setFloating(prev => [...prev, { id, emoji }]);
    setTimeout(() => setFloating(prev => prev.filter(f => f.id !== id)), 2000);
  };

  const handleAmen = () => {
    setAmened(true);
    handleReaction('amen', '🙏');
    setTimeout(() => setAmened(false), 1500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Colonne gauche : vidéo + infos ── */}
        <div className="lg:col-span-8 flex flex-col gap-5">

          {/* ── Lecteur vidéo ── */}
          <div className="relative w-full aspect-video bg-slate-950 rounded-[2rem] overflow-hidden shadow-2xl">

            {IS_LIVE ? (
              /* YouTube Live embed */
              <iframe
                src={`https://www.youtube.com/embed/${YOUTUBE_LIVE_ID}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                title="Live MEJ Koinonia"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            ) : (
              /* Écran "Pas de direct" */
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-slate-950">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center">
                    <WifiOff className="w-10 h-10 text-slate-500" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-white font-bold text-xl">Aucun direct en cours</p>
                  <p className="text-slate-400 text-sm">Le prochain culte en direct sera annoncé bientôt.</p>
                </div>
                <div className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl">
                  <Wifi className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400 text-sm font-medium">Revenez dimanche à 08h30</span>
                </div>
              </div>
            )}

            {/* Badge LIVE */}
            {IS_LIVE && (
              <div className="absolute top-4 left-4 z-10 flex items-center gap-3 pointer-events-none">
                <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg shadow-red-900/40">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  EN DIRECT
                </div>
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-white/10">
                  <Users className="w-3.5 h-3.5" />
                  {VIEWER_COUNT} spectateurs
                </div>
              </div>
            )}

            {/* Réactions flottantes */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <AnimatePresence>
                {floating.map(f => <FloatingReaction key={f.id} emoji={f.emoji} id={f.id} />)}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Infos du direct ── */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">

            {/* Titre + actions */}
            <div className="px-8 py-6 border-b border-slate-100">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {IS_LIVE && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full uppercase tracking-widest border border-red-100">
                        <Radio className="w-3 h-3" /> Live
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{STREAM_PARISH}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">{STREAM_TITLE}</h1>
                </div>

                <div className="flex gap-3 shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={handleAmen}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm ${
                      amened
                        ? 'bg-primary text-white shadow-primary/30'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Amen · {reactions.amen}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={handleShare}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    {copied ? 'Copié !' : 'Partager'}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Prédicateur + réactions */}
            <div className="px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              {/* Prédicateur */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg">
                  {STREAM_SPEAKER.split(' ').map(w => w[0]).join('').slice(0,2)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{STREAM_SPEAKER}</p>
                  <p className="text-xs text-slate-500 font-medium">Prédicateur du jour</p>
                </div>
                <button className="ml-2 px-4 py-2 rounded-xl border-2 border-primary text-primary font-bold text-xs hover:bg-primary hover:text-white transition-all">
                  Suivre
                </button>
              </div>

              {/* Boutons réactions */}
              <div className="flex items-center gap-2">
                {REACTIONS.map(r => (
                  <motion.button
                    key={r.key}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleReaction(r.key, r.icon)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-sm font-bold text-slate-700 transition-all"
                  >
                    <span className="text-base">{r.icon}</span>
                    <span className="text-xs text-slate-500">{(reactions as any)[r.key]}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Prochain direct ── */}
          <div className="bg-slate-900 rounded-[2rem] p-6 flex items-center gap-5 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
              <Radio className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 relative z-10">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Prochain culte</p>
              <p className="text-white font-bold text-lg leading-tight">Culte de Jeudi · Enseignement Biblique</p>
              <p className="text-slate-400 text-sm mt-1 font-medium">Jeudi 12 Mars · 18h00 — MEJ Koinonia</p>
            </div>
            <button className="shrink-0 flex items-center gap-2 px-5 py-3 bg-primary rounded-2xl text-white font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary-hover transition-all relative z-10">
              Rappel <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Colonne droite : chat ── */}
        <div className="lg:col-span-4 flex flex-col" style={{ height: 'calc(100vh - 160px)', minHeight: '600px' }}>
          <div className="flex-1 flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">

            {/* Header chat */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Chat en Direct</h3>
                  <p className="text-[10px] text-slate-400 font-medium">{messages.length} messages</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Connecté
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/40">
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i < 6 ? i * 0.05 : 0 }}
                  className="flex gap-3 group"
                >
                  <div className={`w-8 h-8 rounded-xl ${msg.color} flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5`}>
                    {msg.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-800 truncate">{msg.user}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{msg.time}</span>
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm border border-slate-100 inline-block max-w-full">
                      <p className="text-sm text-slate-700 leading-relaxed break-words">{msg.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input message */}
            <div className="p-4 border-t border-slate-100 bg-white shrink-0">
              <div className="flex gap-2 items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Écrivez un message..."
                    className="w-full pl-4 pr-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none text-sm font-medium text-slate-900 transition-all"
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30 hover:bg-primary-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2 font-medium">
                Soyez respectueux · Gloire à Dieu 🙏
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}