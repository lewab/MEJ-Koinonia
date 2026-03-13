'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Play, Heart, BookOpen, Radio, Users,
  MapPin, Clock, Calendar, ChevronDown, Star,
  Quote, Sparkles, Music, Video, ChevronRight,
} from 'lucide-react';
import { useEvents } from '@/context/EventContext';

// ── Couleur primary ───────────────────────────────────────
const P = '#135bec';

// ── Hero slides ───────────────────────────────────────────
const SLIDES = [
  {
    title: 'Une Jeunesse\nEnracinée\ndans l\'Amour',
    sub: 'Le Mouvement Eucharistique des Jeunes de Koinonia — une communauté vivante au cœur de Brazzaville.',
    tag: 'Bienvenue au MEJ Koinonia',
    img: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=2000&q=80',
    cta: 'Nous Rejoindre',
    href: '/auth',
  },
  {
    title: 'La Parole\nQui\nTransforme',
    sub: 'Chaque mardi et jeudi à 17h00 — plongez dans la Parole de Dieu et vivez la transformation intérieure.',
    tag: 'Formation · Mardi & Jeudi',
    img: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=2000&q=80',
    cta: 'Voir le programme',
    href: '/programmes',
  },
  {
    title: 'École\ndes\nDisciples',
    sub: 'Le parcours d\'excellence spirituelle de janvier à décembre — pour devenir un témoin de la foi.',
    tag: 'Formation · Janvier 2025',
    img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=2000&q=80',
    cta: 'S\'inscrire',
    href: '/programmes',
  },
];

// ── Stats ──────────────────────────────────────────────────
const STATS = [
  { value: 250, suffix: '+', label: 'Membres actifs'    },
  { value: 3,   suffix: '',  label: 'Paroisses'         },
  { value: 8,   suffix: '+', label: 'Ans de présence'   },
  { value: 120, suffix: '+', label: 'Enseignements'     },
];

// ── Témoignages ───────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: 'Le MEJ m\'a appris à prier avec toute mon âme. Je suis entré comme curieux, je suis resté par amour.',
    name: 'Jonas M.', role: 'Membre depuis 2020', avatar: 'JM', color: '#135bec',
  },
  {
    quote: 'L\'École des Disciples a complètement transformé ma façon de lire la Bible et de vivre ma foi.',
    name: 'Marie K.', role: 'École des Disciples 2024', avatar: 'MK', color: '#7c3aed',
  },
  {
    quote: 'Les nuits de louange sont des moments hors du temps. On sent vraiment la présence de Dieu.',
    name: 'Sœur Agnès', role: 'Membre depuis 2019', avatar: 'SA', color: '#dc2626',
  },
];

// ── Équipe ────────────────────────────────────────────────
const TEAM = [
  {
    name: 'Pasteur Jean-Pierre',
    role: 'Responsable spirituel',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    tag: 'Fondateur',
  },
  {
    name: 'Évangéliste Marie',
    role: 'Directrice formation',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    tag: 'Formation',
  },
  {
    name: 'Frère Samuel',
    role: 'Animation louange',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    tag: 'Louange',
  },
  {
    name: 'Sœur Claire',
    role: 'Coordination jeunesse',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    tag: 'Jeunesse',
  },
];

// ── Composant compteur animé ──────────────────────────────
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = value / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Page ──────────────────────────────────────────────────
export default function Home() {
  const { events } = useEvents();
  const [slide, setSlide] = useState(0);
  const [testimonial, setTestimonial] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTestimonial(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const current = SLIDES[slide];

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════
          1. HERO — pleine largeur, image entière visible
          Hauteur : ratio 16/9 plafonné à 560px (≈ 50vh moyen)
          object-contain = image entière, pas de recadrage
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-slate-950"
        style={{ height: 'min(56.25vw, 560px)' }}>

        {/* Image de fond avec transition — object-contain pour image entière */}
        <AnimatePresence mode="sync">
          <motion.div key={slide} className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: [0.25,0.1,0.25,1] }}
          >
            {/* L'image occupe toute la section sans être coupée */}
            <img src={current.img} alt=""
              className="w-full h-full object-contain" />
            {/* Dégradés sur les bords pour lisibilité du texte */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Grain overlay subtil */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")', backgroundSize: '256px' }} />

        {/* Contenu */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 max-w-[1400px] mx-auto">

          <AnimatePresence mode="wait">
            <motion.div key={slide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="space-y-4 max-w-2xl"
            >
              {/* Tag */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-[2px] rounded-full" style={{ backgroundColor: P }} />
                <span className="text-white/70 text-xs font-bold uppercase tracking-[0.4em]">
                  {current.tag}
                </span>
              </div>

              {/* Titre — plus compact pour le hero 50vh */}
              <h1 className="text-[clamp(2rem,5vw,4rem)] font-black text-white leading-[0.92] tracking-[-0.03em]">
                {current.title.split('\n').map((line, i) => (
                  <span key={i} className="block">
                    {i === 1
                      ? <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.4)', color: 'transparent' }}>{line}</span>
                      : line
                    }
                  </span>
                ))}
              </h1>

              <p className="text-white/65 text-base md:text-lg font-medium leading-relaxed max-w-lg">
                {current.sub}
              </p>

              <div className="flex items-center gap-4 pt-1">
                <Link href={current.href}
                  className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all hover:gap-4 hover:-translate-y-0.5"
                  style={{ backgroundColor: P, boxShadow: `0 16px 40px rgba(19,91,236,0.45)` }}
                >
                  {current.cta} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/media"
                  className="flex items-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-white/80 text-base border border-white/20 hover:bg-white/10 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" /> Voir les médias
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots + slide counter */}
          <div className="absolute bottom-10 left-6 sm:left-12 lg:left-20 xl:left-32 flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: i === slide ? 40 : 16,
                    backgroundColor: i === slide ? P : 'rgba(255,255,255,0.3)',
                  }}
                />
              ))}
            </div>
            <span className="text-white/30 text-xs font-bold tracking-widest">
              0{slide + 1} / 0{SLIDES.length}
            </span>
          </div>

          {/* Scroll indicator */}
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 right-6 sm:right-12 hidden md:flex flex-col items-center gap-2">
            <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest rotate-90 mb-2">Scroll</span>
            <ChevronDown className="w-4 h-4 text-white/30" />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. STATS — bande sombre
      ══════════════════════════════════════════════════════ */}
      <section className="bg-slate-950 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/10">
            {STATS.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center md:px-8"
              >
                <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-2">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. CITATION — grand fond blanc cassé
      ══════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-32 px-6 sm:px-12 lg:px-20 xl:px-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-5xl mx-auto text-center relative"
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-slate-100 pointer-events-none select-none"
            style={{ fontSize: '18rem', lineHeight: 1, fontFamily: 'Georgia, serif', fontWeight: 900 }}>
            "
          </div>
          <div className="relative z-10 space-y-10">
            <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: P }}>Sagesse & Foi</span>
            <blockquote className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight italic">
              L'Eucharistie est l'autoroute vers le Ciel. Plus nous la recevons, plus nous devenons comme Jésus.
            </blockquote>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-1 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Bx Carlo Acutis</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. ACTIVITÉS — 3 cartes larges
      ══════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20 md:py-32 px-6 sm:px-12 lg:px-20 xl:px-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: P }}>Ce que nous vivons</span>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mt-3">
                Nos<br />Activités
              </h2>
            </div>
            <Link href="/programmes"
              className="flex items-center gap-2 font-bold text-slate-500 hover:text-slate-900 transition-colors text-sm">
              Voir tout le programme <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Video, label: 'Médiathèque', href: '/media',
                desc: 'Redécouvrez tous nos enseignements en vidéo et audio.',
                bg: 'bg-slate-900', accent: '#135bec',
                img: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
              },
              {
                icon: Radio, label: 'En Direct', href: '/direct',
                desc: 'Nos célébrations en temps réel, où que vous soyez.',
                bg: 'bg-red-600', accent: '#fff',
                img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
                badge: 'LIVE',
              },
              {
                icon: Heart, label: 'Donner', href: '/don',
                desc: 'Soutenez les missions et les œuvres du mouvement.',
                bg: 'bg-rose-500', accent: '#fff',
                img: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.12, duration: 0.6, ease: 'easeOut' }}
                >
                  <Link href={item.href}
                    className="group relative rounded-[2.5rem] overflow-hidden flex flex-col min-h-[420px] cursor-pointer block"
                  >
                    {/* Fond image */}
                    <div className="absolute inset-0">
                      <img src={item.img} alt={item.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-slate-900/70 group-hover:bg-slate-900/60 transition-colors duration-500" />
                    </div>

                    {/* Badge LIVE */}
                    {item.badge && (
                      <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-black tracking-widest">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        {item.badge}
                      </div>
                    )}

                    {/* Contenu */}
                    <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-10">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${item.bg}`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-3xl font-black text-white mb-3 tracking-tight">{item.label}</h3>
                      <p className="text-white/65 font-medium leading-relaxed mb-6">{item.desc}</p>
                      <div className="flex items-center gap-2 text-white font-bold text-sm group-hover:gap-4 transition-all">
                        Découvrir <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. ÉVÉNEMENTS — depuis EventContext (admin)
      ══════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-32 px-6 sm:px-12 lg:px-20 xl:px-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: P }}>Calendrier</span>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mt-3">
                Prochains<br />Cultes
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Mis à jour par l'admin
            </div>
          </div>

          <div className="space-y-4">
            {events.slice(0, 4).map((event, i) => (
              <motion.div key={event.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group flex items-stretch gap-0 rounded-[2rem] overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
              >
                {/* Bande date colorée */}
                <div className="w-24 md:w-32 shrink-0 flex flex-col items-center justify-center py-6 text-white font-black text-center leading-tight"
                  style={{ backgroundColor: P }}>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">
                    {event.date.split(' ')[0]}
                  </span>
                  <span className="text-3xl md:text-4xl">{event.date.split(' ')[1]}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-1">
                    {event.date.split(' ')[2] || ''}
                  </span>
                </div>

                {/* Image */}
                <div className="w-32 md:w-48 shrink-0 overflow-hidden">
                  <img src={event.imageUrl} alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>

                {/* Infos */}
                <div className="flex-1 flex flex-col justify-center px-6 md:px-10 py-6 gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                    style={{ color: P }}>
                    <Clock className="w-3.5 h-3.5" /> {event.time}
                  </div>
                  <h4 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                    {event.title}
                  </h4>
                  <p className="text-slate-500 text-sm line-clamp-1 font-medium">{event.description}</p>
                  {event.location && (
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                      <MapPin className="w-3.5 h-3.5" /> {event.location}
                    </div>
                  )}
                </div>

                {/* Flèche */}
                <div className="hidden md:flex items-center pr-8">
                  <div className="w-10 h-10 rounded-full border-2 border-slate-100 group-hover:border-blue-600 group-hover:bg-blue-600 flex items-center justify-center transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/programmes"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold border-2 border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all">
              Voir tous les événements <Calendar className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. TÉMOIGNAGES — fond sombre
      ══════════════════════════════════════════════════════ */}
      <section className="bg-slate-950 py-20 md:py-32 px-6 sm:px-12 lg:px-20 xl:px-32 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: P }}>Voix de la communauté</span>
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-[0.9] mt-3">
              Ils témoignent
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col gap-6 hover:bg-white/8 transition-colors"
              >
                {/* Étoiles */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-white/80 text-lg font-medium leading-relaxed italic flex-1">
                  "{t.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
                    style={{ backgroundColor: t.color }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs font-medium">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7. ÉQUIPE — photos + rôles
      ══════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20 md:py-32 px-6 sm:px-12 lg:px-20 xl:px-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: P }}>Les bergers du troupeau</span>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] mt-3">
              Notre Équipe
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {TEAM.map((member, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group text-center"
              >
                <div className="relative rounded-[2rem] overflow-hidden mb-5 aspect-[3/4]">
                  <img src={member.img} alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <span className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest text-white px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: P }}>
                    {member.tag}
                  </span>
                </div>
                <h4 className="font-black text-slate-900 text-lg tracking-tight">{member.name}</h4>
                <p className="text-slate-500 text-sm font-medium mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          8. CTA FINAL — pleine largeur, fond bleu
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-40 px-6 overflow-hidden text-center"
        style={{ backgroundColor: P }}>
        {/* Cercles décoratifs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl mx-auto space-y-8"
        >
          <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-white/15 text-white/90 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full border border-white/20">
              <Sparkles className="w-3.5 h-3.5" /> Rejoins le mouvement
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter">
            Bâtissons une jeunesse de joie et d'excellence.
          </h2>
          <p className="text-white/70 text-xl font-medium max-w-xl mx-auto leading-relaxed">
            Rejoins des centaines de jeunes qui vivent leur foi avec passion à Brazzaville et au-delà.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth"
              className="flex items-center gap-2.5 bg-white font-black text-lg px-10 py-5 rounded-2xl hover:bg-slate-100 transition-all hover:-translate-y-1 active:scale-95 shadow-xl"
              style={{ color: P }}>
              Nous Rejoindre <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/localisation"
              className="flex items-center gap-2.5 bg-white/15 text-white font-black text-lg px-10 py-5 rounded-2xl border border-white/30 hover:bg-white/25 transition-all">
              <MapPin className="w-5 h-5" /> Nos Paroisses
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}