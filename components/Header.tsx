'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings, LogOut, ChevronDown, Bell, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { UserRole } from '@/types';

// ── Les 7 liens publics ───────────────────────────────────
const navItems = [
  { path: '/',              label: 'Accueil'      },
  { path: '/programmes',    label: 'Programmes'   },
  { path: '/media',         label: 'Médiathèque'  },
  { path: '/direct',        label: 'Direct', badge: true },
  { path: '/localisation',  label: 'Localisation' },
  { path: '/don',           label: 'Donner'       },
];

// ── Variants ──────────────────────────────────────────────
const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0.3,  ease: 'easeIn'  } },
};

const sidebarVariants = {
  hidden:  { x: '-100%', opacity: 0 },
  visible: {
    x: 0, opacity: 1,
    transition: { type: 'spring', stiffness: 180, damping: 28, mass: 1.1, opacity: { duration: 0.25 } },
  },
  exit: {
    x: '-100%', opacity: 0,
    transition: { type: 'spring', stiffness: 220, damping: 32, mass: 0.9, opacity: { duration: 0.2 } },
  },
};

const navItemVariants = {
  hidden:  { x: -24, opacity: 0 },
  visible: (i: number) => ({
    x: 0, opacity: 1,
    transition: { delay: i * 0.06 + 0.2, type: 'spring', stiffness: 260, damping: 22 },
  }),
};

const dropdownVariants = {
  hidden:  { opacity: 0, scale: 0.95, y: -6 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.15, ease: 'easeOut' } },
  exit:    { opacity: 0, scale: 0.95, y: -6, transition: { duration: 0.1 } },
};

// ── Composant ─────────────────────────────────────────────
const Header: React.FC = () => {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout }        = useAuth();
  const { unreadCount }         = useNotifications();

  const [isMenuOpen,   setIsMenuOpen]   = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const isAdmin = user?.role === UserRole.ADMIN;

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setIsMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      {/* ══ HEADER ════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <motion.div
                whileHover={{ rotate: 6, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="relative w-12 h-12 rounded-full overflow-hidden shadow-xl"
              >
                <Image src="/assets/images/logo.jpeg" alt="MEJ Logo" fill className="object-cover" priority />
              </motion.div>
              <div className="hidden sm:block">
                <p className="font-bold text-xl text-slate-900 leading-none tracking-tighter uppercase">MEJ</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Koinonia</p>
              </div>
            </Link>

            {/* NAV DESKTOP */}
            <nav className="hidden lg:flex items-center h-20">
              {navItems.map((item) => {
                const active = pathname === item.path;
                return (
                  <Link key={item.path} href={item.path}
                    className={`relative px-4 h-full text-[14px] font-bold transition-colors flex items-center gap-1.5
                      ${active ? 'text-primary' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    {item.label}
                    {item.badge && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-primary rounded-t-full"
                      initial={false}
                      animate={{ width: active ? '70%' : '0%', opacity: active ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* DROITE */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">

                  {/* Cloche — lien vers notifications ADMIN seulement */}
                  {isAdmin ? (
                    <Link href="/admin/notifications"
                      className="relative p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                      )}
                    </Link>
                  ) : (
                    <button className="relative p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                      <Bell className="w-5 h-5" />
                    </button>
                  )}

                  {/* Avatar + dropdown */}
                  <div className="relative">
                    <button onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-2xl hover:bg-slate-50 transition-all group focus:outline-none"
                    >
                      {/* Badge admin visible desktop */}
                      {isAdmin && (
                        <span className="hidden md:flex items-center gap-1 text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">
                          <ShieldCheck className="w-2.5 h-2.5" /> Admin
                        </span>
                      )}
                      <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user.role}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-primary transition-colors flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'var(--color-primary)' }}>
                        {user.avatar
                          ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          : <span className="text-white font-bold text-base">{getInitial(user.name)}</span>
                        }
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                          <motion.div
                            variants={dropdownVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-20 origin-top-right"
                          >
                            {/* Infos utilisateur */}
                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                              <p className="font-bold text-slate-900 text-sm truncate">{user.name}</p>
                              <p className="text-xs text-slate-400 font-medium truncate">{user.role}</p>
                            </div>

                            {/* ── Dashboard Admin — visible UNIQUEMENT si ADMIN ── */}
                            {isAdmin && (
                              <Link href="/admin" onClick={() => setShowDropdown(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-amber-700 hover:bg-amber-50 transition-colors border-b border-slate-100"
                              >
                                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                                  <LayoutDashboard className="w-4 h-4 text-amber-600" />
                                </div>
                                Dashboard Admin
                              </Link>
                            )}

                            <Link href="/settings" onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                <Settings className="w-4 h-4 text-slate-500" />
                              </div>
                              Paramètres
                            </Link>

                            <div className="h-px bg-slate-100 mx-3" />

                            <button onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                <LogOut className="w-4 h-4 text-red-400" />
                              </div>
                              Déconnexion
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <Link href="/auth"
                  className="hidden sm:flex items-center bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-primary transition-all shadow-lg active:scale-95"
                >
                  Nous Rejoindre
                </Link>
              )}

              {/* Burger mobile */}
              <motion.button whileTap={{ scale: 0.88 }}
                className="lg:hidden p-2.5 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* ══ MENU MOBILE ═══════════════════════════════════════ */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div variants={backdropVariants} initial="hidden" animate="visible" exit="exit"
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60]"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.aside variants={sidebarVariants} initial="hidden" animate="visible" exit="exit"
              className="fixed inset-y-0 left-0 w-[300px] bg-white z-[70] shadow-2xl flex flex-col will-change-transform"
            >
              {/* En-tête */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md shrink-0">
                    <Image src="/assets/images/logo.jpeg" alt="MEJ" fill className="object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-base text-slate-900 tracking-tighter block">MEJ Koinonia</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Ministère Jubilé</span>
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.85, rotate: 90 }} onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Profil utilisateur */}
              {user && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                  className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3"
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-base shrink-0"
                    style={{ backgroundColor: 'var(--color-primary)' }}>
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      : getInitial(user.name)
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{user.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {isAdmin && <ShieldCheck className="w-3 h-3 text-amber-500 shrink-0" />}
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider truncate">{user.role}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Liens */}
              <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">

                {/* Dashboard Admin — en haut, bien visible, ADMIN seulement */}
                {isAdmin && (
                  <motion.div custom={-1} variants={navItemVariants} initial="hidden" animate="visible">
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-between w-full px-4 py-3.5 rounded-2xl font-bold text-sm transition-colors mb-3 ${
                        pathname === '/admin'
                          ? 'bg-amber-500 text-white shadow-lg'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <LayoutDashboard className="w-4 h-4 shrink-0" />
                        Dashboard Admin
                      </div>
                      <span className="text-[9px] font-black bg-amber-200/60 px-2 py-0.5 rounded-full uppercase">ADMIN</span>
                    </Link>
                  </motion.div>
                )}

                {navItems.map((item, i) => {
                  const active = pathname === item.path;
                  return (
                    <motion.div key={item.path} custom={i} variants={navItemVariants} initial="hidden" animate="visible">
                      <Link href={item.path} onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-between w-full px-5 py-3.5 rounded-2xl font-bold text-base transition-colors
                          ${active ? 'text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <div className="flex items-center gap-3">
                          {active && <motion.div layoutId="mobileActivePill" className="w-1.5 h-5 bg-primary rounded-full" />}
                          <span>{item.label}</span>
                        </div>
                        {item.badge && <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Pied */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                className="p-5 border-t border-slate-100 space-y-2.5"
              >
                {user ? (
                  <>
                    <Link href="/settings" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-slate-50 text-slate-700 py-3.5 rounded-2xl font-bold hover:bg-slate-100 transition-all">
                      <Settings className="w-4 h-4" /> Paramètres
                    </Link>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full bg-red-50 text-red-600 py-3.5 rounded-2xl font-bold hover:bg-red-100 transition-all">
                      <LogOut className="w-4 h-4" /> Déconnexion
                    </motion.button>
                  </>
                ) : (
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold hover:bg-primary transition-all shadow-lg">
                    Nous Rejoindre
                  </Link>
                )}
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;