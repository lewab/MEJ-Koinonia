'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings, LogOut, ChevronDown, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { path: '/',             label: 'Accueil' },
  { path: '/programmes',   label: 'Programmes' },
  { path: '/media',        label: 'Médiathèque' },
  { path: '/direct',       label: 'Direct', badge: true },
  { path: '/localisation', label: 'Localisation' },
  { path: '/don',          label: 'Donner' },
];

const sidebarVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: { type: 'tween', duration: 0.25, ease: 'easeIn' },
  },
};

const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

const navItemVariants = {
  hidden:  { x: -20, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: i * 0.05 + 0.15, type: 'spring', stiffness: 300, damping: 24 },
  }),
};

const dropdownVariants = {
  hidden:  { opacity: 0, scale: 0.95, y: -6 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.15, ease: 'easeOut' } },
  exit:    { opacity: 0, scale: 0.95, y: -6, transition: { duration: 0.1 } },
};

const Header: React.FC = () => {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();

  const [isMenuOpen,    setIsMenuOpen]    = useState(false);
  const [showDropdown,  setShowDropdown]  = useState(false);

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
      {/* ── HEADER PRINCIPAL ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center h-24">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-4 group shrink-0">
              <motion.div
                whileHover={{ rotate: 6, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-blue-500/30"
              >
                MEJ
              </motion.div>
              <div className="hidden sm:block">
                <p className="font-bold text-2xl text-slate-900 leading-none tracking-tighter uppercase mb-1">MEJ</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Talas</p>
              </div>
            </Link>

            {/* NAV DESKTOP */}
            <nav className="hidden lg:flex items-center h-24">
              {navItems.map((item) => {
                const active = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`relative px-5 h-full text-[15px] font-bold transition-colors flex items-center gap-2 group/nav
                      ${active ? 'text-primary' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    {item.label}
                    {item.badge && (
                      <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                    )}
                    {/* barre active animée */}
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[4px] bg-primary rounded-t-full"
                      initial={false}
                      animate={{ width: active ? '75%' : '0%', opacity: active ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* ACTIONS DROITE */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  {/* Cloche */}
                  <button className="relative p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                  </button>

                  {/* Avatar + dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-3 focus:outline-none group"
                    >
                      <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-900 leading-none mb-1">{user.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">{user.role}</p>
                      </div>
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-slate-100 shadow-lg group-hover:border-[#135bec] transition-colors flex items-center justify-center bg-primary">
                        {user.avatar
                          ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          : <span className="text-white font-bold text-lg">{getInitial(user.name)}</span>
                        }
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                    </button>

                    <AnimatePresence>
                      {showDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                          <motion.div
                            variants={dropdownVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 origin-top-right"
                          >
                            <Link
                              href="/settings"
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                            >
                              <Settings className="w-4 h-4" /> Paramètres
                            </Link>
                            <div className="h-px bg-slate-100 my-1" />
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="w-4 h-4" /> Déconnexion
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="hidden sm:flex items-center bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-primary transition-all shadow-lg active:scale-95"
                >
                  Nous Rejoindre
                </Link>
              )}

              {/* Burger */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="lg:hidden p-3 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Ouvrir le menu"
              >
                <Menu className="w-7 h-7" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MENU MOBILE ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden" animate="visible" exit="exit"
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60]"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              variants={sidebarVariants}
              initial="hidden" animate="visible" exit="exit"
              className="fixed inset-y-0 left-0 w-[300px] bg-white z-[70] shadow-2xl flex flex-col"
            >
              {/* En-tête sidebar */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-base">MEJ</div>
                  <div>
                    <span className="font-bold text-lg text-slate-900 tracking-tighter block">MEJ Connect</span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Mouvement Eucharistique</span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.85, rotate: 90 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Profil utilisateur si connecté */}
              {user && (
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-primary flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      : getInitial(user.name)
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider truncate">{user.role}</p>
                  </div>
                </div>
              )}

              {/* Liens de navigation */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {navItems.map((item, i) => {
                  const active = pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      custom={i}
                      variants={navItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link
                        href={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-between w-full px-5 py-3.5 rounded-2xl font-bold text-base transition-colors
                          ${active
                            ? 'bg-primary/8 text-primary'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          {active && (
                            <motion.div
                              layoutId="activePill"
                              className="w-1.5 h-5 bg-primary rounded-full"
                            />
                          )}
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Pied de sidebar */}
              <div className="p-5 border-t border-slate-100 space-y-3">
                {user ? (
                  <>
                    <Link
                      href="/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-slate-50 text-slate-700 py-3.5 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                    >
                      <Settings className="w-5 h-5" /> Paramètres
                    </Link>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full bg-red-50 text-red-600 py-3.5 rounded-2xl font-bold hover:bg-red-100 transition-all"
                    >
                      <LogOut className="w-5 h-5" /> Déconnexion
                    </motion.button>
                  </>
                ) : (
                  <Link
                    href="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold hover:bg-primary transition-all shadow-lg"
                  >
                    Nous Rejoindre
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings, LogOut, ChevronDown, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { path: '/',             label: 'Accueil' },
  { path: '/programmes',   label: 'Programmes' },
  { path: '/media',        label: 'Médiathèque' },
  { path: '/direct',       label: 'Direct', badge: true },
  { path: '/localisation', label: 'Localisation' },
  { path: '/don',          label: 'Donner' },
];

const sidebarVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: { type: 'tween', duration: 0.25, ease: 'easeIn' },
  },
};

const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

const navItemVariants = {
  hidden:  { x: -20, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: i * 0.05 + 0.15, type: 'spring', stiffness: 300, damping: 24 },
  }),
};

const dropdownVariants = {
  hidden:  { opacity: 0, scale: 0.95, y: -6 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.15, ease: 'easeOut' } },
  exit:    { opacity: 0, scale: 0.95, y: -6, transition: { duration: 0.1 } },
};

const Header: React.FC = () => {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();

  const [isMenuOpen,    setIsMenuOpen]    = useState(false);
  const [showDropdown,  setShowDropdown]  = useState(false);

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
      {/* ── HEADER PRINCIPAL ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center h-24">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-4 group shrink-0">
              <motion.div
                whileHover={{ rotate: 6, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-blue-500/30"
              >
                MEJ
              </motion.div>
              <div className="hidden sm:block">
                <p className="font-bold text-2xl text-slate-900 leading-none tracking-tighter uppercase mb-1">MEJ</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Talas</p>
              </div>
            </Link>

            {/* NAV DESKTOP */}
            <nav className="hidden lg:flex items-center h-24">
              {navItems.map((item) => {
                const active = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`relative px-5 h-full text-[15px] font-bold transition-colors flex items-center gap-2 group/nav
                      ${active ? 'text-primary' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    {item.label}
                    {item.badge && (
                      <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                    )}
                    {/* barre active animée */}
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[4px] bg-primary rounded-t-full"
                      initial={false}
                      animate={{ width: active ? '75%' : '0%', opacity: active ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* ACTIONS DROITE */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  {/* Cloche */}
                  <button className="relative p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                  </button>

                  {/* Avatar + dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-3 focus:outline-none group"
                    >
                      <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-900 leading-none mb-1">{user.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">{user.role}</p>
                      </div>
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-slate-100 shadow-lg group-hover:border-[#135bec] transition-colors flex items-center justify-center bg-primary">
                        {user.avatar
                          ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          : <span className="text-white font-bold text-lg">{getInitial(user.name)}</span>
                        }
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                    </button>

                    <AnimatePresence>
                      {showDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                          <motion.div
                            variants={dropdownVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 origin-top-right"
                          >
                            <Link
                              href="/settings"
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                            >
                              <Settings className="w-4 h-4" /> Paramètres
                            </Link>
                            <div className="h-px bg-slate-100 my-1" />
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="w-4 h-4" /> Déconnexion
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="hidden sm:flex items-center bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-primary transition-all shadow-lg active:scale-95"
                >
                  Nous Rejoindre
                </Link>
              )}

              {/* Burger */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="lg:hidden p-3 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Ouvrir le menu"
              >
                <Menu className="w-7 h-7" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MENU MOBILE ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden" animate="visible" exit="exit"
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60]"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              variants={sidebarVariants}
              initial="hidden" animate="visible" exit="exit"
              className="fixed inset-y-0 left-0 w-[300px] bg-white z-[70] shadow-2xl flex flex-col"
            >
              {/* En-tête sidebar */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-base">MEJ</div>
                  <div>
                    <span className="font-bold text-lg text-slate-900 tracking-tighter block">MEJ Connect</span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Mouvement Eucharistique</span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.85, rotate: 90 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Profil utilisateur si connecté */}
              {user && (
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-primary flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      : getInitial(user.name)
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider truncate">{user.role}</p>
                  </div>
                </div>
              )}

              {/* Liens de navigation */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {navItems.map((item, i) => {
                  const active = pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      custom={i}
                      variants={navItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link
                        href={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-between w-full px-5 py-3.5 rounded-2xl font-bold text-base transition-colors
                          ${active
                            ? 'bg-primary/8 text-primary'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          {active && (
                            <motion.div
                              layoutId="activePill"
                              className="w-1.5 h-5 bg-primary rounded-full"
                            />
                          )}
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Pied de sidebar */}
              <div className="p-5 border-t border-slate-100 space-y-3">
                {user ? (
                  <>
                    <Link
                      href="/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-slate-50 text-slate-700 py-3.5 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                    >
                      <Settings className="w-5 h-5" /> Paramètres
                    </Link>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full bg-red-50 text-red-600 py-3.5 rounded-2xl font-bold hover:bg-red-100 transition-all"
                    >
                      <LogOut className="w-5 h-5" /> Déconnexion
                    </motion.button>
                  </>
                ) : (
                  <Link
                    href="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold hover:bg-primary transition-all shadow-lg"
                  >
                    Nous Rejoindre
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;