/**
 * ConditionalFooter.tsx
 * ──────────────────────
 * Footer conditionnel — s'affiche sur toutes les pages SAUF :
 *   /admin    (dashboard admin)
 *   /auth     (connexion / inscription)
 *   /direct   (page live — immersif plein écran)
 *
 * POURQUOI UN COMPOSANT SÉPARÉ ?
 *   layout.tsx est un Server Component — il ne peut pas lire le pathname
 *   (usePathname est un hook client). Ce composant 'use client' résout ça.
 *
 * MAINTENANCE :
 *   - Ajouter une page sans footer : ajouter son préfixe dans NO_FOOTER_PATHS
 *   - Modifier le contenu du footer : éditer directement la section <footer> ci-dessous
 *   - Changer les liens : modifier NAV_LINKS et COMMUNITY_LINKS
 */
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

// ── Pages qui N'ont PAS de footer ─────────────────────────
// Utilise startsWith → /admin couvre aussi /admin/notifications, etc.
const NO_FOOTER_PATHS = ['/admin', '/auth', '/direct'];

// ── Liens de navigation footer ────────────────────────────
const NAV_LINKS = [
  { label: 'Accueil',       href: '/'           },
  { label: 'Médiathèque',  href: '/media'       },
  { label: 'Programmes',   href: '/programmes'  },
  { label: 'Localisation', href: '/localisation'},
];

const COMMUNITY_LINKS = [
  { label: 'Faire un Don', href: '/don'     },
  { label: 'Nous rejoindre', href: '/auth'  },
  { label: 'À propos',     href: '/a-propos'},
  { label: 'Contact',      href: '#contact' },
];

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Vérifie si le pathname commence par l'un des préfixes exclus
  const shouldHide = NO_FOOTER_PATHS.some(p => pathname.startsWith(p));
  if (shouldHide) return null;

  return (
    <footer className="bg-slate-950 text-slate-400">

      {/* ── Corps principal ── */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Colonne marque */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm"
                style={{ backgroundColor: '#135bec' }}>
                MEJ
              </div>
              <div>
                <span className="text-white font-black text-lg leading-none block">MEJ KOÏNONIA</span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Koinonia · Brazzaville</span>
              </div>
            </div>

            <p className="text-sm leading-relaxed max-w-xs">
              Le Ministère d'évanglisation Jubilé au service de la foi et de l'excellence de la jeunesse congolaise.
            </p>

            {/* Réseaux sociaux */}
            <div className="flex gap-3">
              {['FB', 'YT', 'IG', 'TG'].map(r => (
                <a key={r} href="#"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                  {r}
                </a>
              ))}
            </div>
          </div>

          {/* Liens navigation */}
          <div className="md:col-span-2 space-y-5">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-sm hover:text-white transition-colors hover:translate-x-1 inline-block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens communauté */}
          <div className="md:col-span-2 space-y-5">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Communauté</h4>
            <ul className="space-y-3">
              {COMMUNITY_LINKS.map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-sm hover:text-white transition-colors hover:translate-x-1 inline-block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0" style={{ color: '#135bec' }} />
                <a href="mailto:contact@mej.cg" className="hover:text-white transition-colors">
                  contact@mej.cg
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0" style={{ color: '#135bec' }} />
                <a href="tel:+24206123456" className="hover:text-white transition-colors">
                  +242 06 123 4567
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#135bec' }} />
                <span>Avenue Marien Ngouabi · Talangaï<br />Brazzaville, Congo</span>
              </li>
            </ul>

            {/* Horaires culte */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-4">
              <p className="text-white font-bold text-xs uppercase tracking-widest mb-2">Cultes</p>
              <p className="text-sm">Mardi & Jeudi · <span className="text-white font-bold">17h00 - 19h00</span></p>
              <p className="text-sm">Dimanche · <span className="text-white font-bold">08h30 - 10h30</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bas du footer ── */}
      <div className="border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-slate-500">
            © {new Date().getFullYear()} Ministère d'Évangélisation Jubilé — Koinonia. Tous droits réservés.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
            Fait avec <Heart className="w-3 h-3 text-red-500 mx-1 fill-current" /> pour la jeunesse congolaise
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