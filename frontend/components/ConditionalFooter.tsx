/**
 * ConditionalFooter.tsx
 * ──────────────────────
 * Footer conditionnel — s'affiche sur toutes les pages SAUF :
 *   /admin    (dashboard admin)
 *   /auth     (connexion / inscription)
 *   /direct   (page live — immersif plein écran)
 *
 * MAINTENANCE :
 *   - Ajouter une page sans footer  → ajouter son préfixe dans NO_FOOTER_PATHS
 *   - Changer les liens réseaux     → modifier SOCIAL_LINKS (href + aria-label)
 *   - Changer les liens nav         → modifier NAV_LINKS et COMMUNITY_LINKS
 *   - Changer adresse / horaires    → modifier directement la section Contact
 */
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// ── Pages sans footer ────────────────────────────────────
const NO_FOOTER_PATHS = ['/admin', '/auth', '/direct'];

// ── Liens réseaux sociaux ────────────────────────────────
// Remplacer les href par les vraies URLs MEJ Koinonia
const SOCIAL_LINKS = [
  {
    id: 'facebook',
    href: 'https://www.facebook.com/profile.php?id=61576252354885',   // ← Remplacer par la page Facebook MEJ
    label: 'Facebook',
    // Icône Facebook officielle
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: 'youtube',
    href: 'https://www.youtube.com/@MEJCOMKOINONIA',    // ← Remplacer par la chaîne YouTube MEJ
    label: 'YouTube',
    // Icône YouTube officielle
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    id: 'instagram',
    href: 'https://instagram.com',  // ← Remplacer par le compte Instagram MEJ
    label: 'Instagram',
    // Icône Instagram officielle
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    id: 'tiktok',
    href: 'https://vm.tiktok.com/ZS9RH2V8RrFU4-6sUwo/', // ← Remplace par ton lien TikTok
    label: 'TikTok',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.75 2h2.25c.2 1.8 1.4 3.2 3 3.7v2.3c-1.2 0-2.3-.4-3.2-1v6.5c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.3 0 .6 0 .9.1v2.4c-.3-.1-.6-.2-.9-.2-2 0-3.6 1.6-3.6 3.6s1.6 3.6 3.6 3.6 3.6-1.6 3.6-3.6V2z"/>
      </svg>
    ),
  },
];

// ── Liens navigation ─────────────────────────────────────
const NAV_LINKS = [
  { label: 'Accueil',      href: '/'            },
  { label: 'Médiathèque', href: '/media'        },
  { label: 'Programmes',  href: '/programmes'   },
  { label: 'Localisation',href: '/localisation' },
];

const COMMUNITY_LINKS = [
  { label: 'Faire un Don',   href: '/don'      },
  { label: 'Nous rejoindre', href: '/auth'     },
  { label: 'À propos',       href: '/a-propos' },
  { label: 'Contact',        href: '#contact'  },
];

// ─────────────────────────────────────────────────────────

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Masquer le footer sur les pages exclues
  const shouldHide = NO_FOOTER_PATHS.some(p => pathname.startsWith(p));
  if (shouldHide) return null;

  return (
    <footer className="bg-slate-950 text-slate-400">

      {/* Corps principal */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* ── Colonne marque ── */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group shrink-0">
              <motion.div
                whileHover={{ rotate: 6, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="relative w-12 h-12 rounded-full overflow-hidden shadow-xl"
              >
                <Image src="/assets/images/logo.jpeg" alt="MEJ Logo" fill className="object-cover" priority />
              </motion.div>
              
            </Link>
              <div>
                <span className="flex gap-2 text-white font-black text-lg leading-none">
                  <span>MEJ</span>
                  <span>KOÏNONIA</span>
                </span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  Brazzaville · Congo
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed max-w-xs">
              Le Ministère d'Évangélisation Jubilé au service de la foi
              et de l'excellence de la jeunesse congolaise.
            </p>

            {/* Réseaux sociaux — vraies icônes SVG */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(s => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Navigation ── */}
          <div className="md:col-span-2 space-y-5">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">
              Navigation
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Communauté ── */}
          <div className="md:col-span-2 space-y-5">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">
              Communauté
            </h4>
            <ul className="space-y-3">
              {COMMUNITY_LINKS.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0" style={{ color: '#135bec' }} />
                <a href="mailto:contact@mej.cg" className="hover:text-white transition-colors">
                  koinonia@mej.cg
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0" style={{ color: '#135bec' }} />
                <a href="tel:+24206123456" className="hover:text-white transition-colors">
                  +242 06 757 5593
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#135bec' }} />
                <span>
                  Avenue Marien Ngouabi · Talangaï<br />
                  Brazzaville, Congo
                </span>
              </li>
            </ul>

            {/* Horaires */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-white font-bold text-xs uppercase tracking-widest mb-2">
                Cultes
              </p>
              <p className="text-sm">
                Mardi & Jeudi ·{' '}
                <span className="text-white font-bold">17h00 – 19h00</span>
              </p>
              <p className="text-sm">
                Dimanche ·{' '}
                <span className="text-white font-bold">08h30 – 10h30</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bas du footer */}
      <div className="border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-slate-500">
            © {new Date().getFullYear()} Ministère d'Évangélisation Jubilé — Koinonia.
            Tous droits réservés.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
            Fait avec{' '}
            <Heart className="w-3 h-3 text-red-500 mx-1 fill-current" />{' '}
            pour la jeunesse congolaise
          </div>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}