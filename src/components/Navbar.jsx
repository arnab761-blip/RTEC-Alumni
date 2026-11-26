import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatDriveImageUrl } from '../utils/driveImage.js';
import { useScrollLock } from '../utils/useScrollLock.js';
import {
  Users,
  GraduationCap,
  Calendar,
  Briefcase,
  HeartHandshake,
  Image as ImageIcon,
  Newspaper,
  ShieldCheck,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Building2,
  Compass,
  ArrowUpRight,
  Sparkles,
  Ticket,
  BookOpen,
  PhoneCall,
  Search,
  MessageSquareQuote,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserAvatar from './UserAvatar.jsx';
import GoogleSignInModal, { GoogleLogo } from './GoogleSignInModal.jsx';

export default function Navbar() {
  const location = useLocation();
  const { user, logout, lang, setLang, collegeLogo, theme, toggleTheme, isAdminEmail } = useApp();
  const isAuthorizedAdmin = Boolean(user?.role === 'admin' && isAdminEmail?.(user?.email));
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerScrollLocked, setDrawerScrollLocked] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Keep scroll locked through the full drawer open + exit transition; release in onExitComplete
  useEffect(() => {
    if (drawerOpen) {
      setDrawerScrollLocked(true);
    }
  }, [drawerOpen]);

  useScrollLock(drawerScrollLocked);

  // Close Index Drawer on Escape key
  useEffect(() => {
    if (!drawerOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  // Core docked items for the floating dock (Desktop)
  const primaryDockItems = [
    {
      to: '/',
      labelBn: 'হোম',
      labelEn: 'Home',
      icon: Building2,
      subBn: 'সূচনা',
      subEn: 'Overview'
    },
    {
      to: '/directory',
      labelBn: 'অ্যালামনাই',
      labelEn: 'Directory',
      icon: GraduationCap,
      subBn: 'আইডি ও প্রোফাইল',
      subEn: 'Alumni ID'
    },
    {
      to: '/teachers',
      labelBn: 'শিক্ষক',
      labelEn: 'Faculty',
      icon: BookOpen,
      subBn: 'অনুষদ সদস্য',
      subEn: 'Professors'
    },
    {
      to: '/students',
      labelBn: 'শিক্ষার্থী',
      labelEn: 'Students',
      icon: Users,
      subBn: 'বর্তমান ব্যাচ',
      subEn: 'Enrolled'
    },
    {
      to: '/forum',
      labelBn: 'অভিজ্ঞতা শেয়ার',
      labelEn: 'Experience Share',
      icon: MessageSquareQuote,
      subBn: 'ক্যারিয়ার ও অভিজ্ঞতা',
      subEn: 'Experience & Stories'
    }
  ];

  // Mobile Bottom Bar Items (5 equal 20% width items, zero overflow, app-like)
  const mobileDockItems = [
    {
      to: '/',
      labelBn: 'হোম',
      labelEn: 'Home',
      icon: Building2
    },
    {
      to: '/directory',
      labelBn: 'ডিরেক্টরি',
      labelEn: 'Directory',
      icon: GraduationCap
    },
    {
      to: '/teachers',
      labelBn: 'অনুষদ',
      labelEn: 'Faculty',
      icon: BookOpen
    },
    {
      to: '/students',
      labelBn: 'শিক্ষার্থী',
      labelEn: 'Students',
      icon: Users
    },
    {
      to: '/forum',
      labelBn: 'অভিজ্ঞতা শেয়ার',
      labelEn: 'Experience Share',
      icon: MessageSquareQuote
    }
  ];

  // Extended architectural archive menu items
  const archiveLinks = [
    { to: '/student-portal', labelBn: 'শিক্ষার্থী আইডি ও তথ্য পোর্টাল', labelEn: 'Student ID & Self-Input Portal', icon: GraduationCap, descBn: 'শিক্ষার্থীদের নিজস্ব প্রোফাইল ও আইডি খোলার পোর্টাল', descEn: 'Self-register student profile & submit info' },
    { to: '/events', labelBn: 'টিকেট ও ইভেন্ট', labelEn: 'Tickets & Events', icon: Ticket, descBn: 'পুনর্মিলনী ও বার্ষিক কনক্লেভ টিকেট', descEn: 'Reunion gala passes & conclaves' },
    { to: '/jobs', labelBn: 'ক্যারিয়ার ও নিয়োগ', labelEn: 'Career & Industry', icon: Briefcase, descBn: 'টেক্সটাইল মিল ও বহুজাতিক সুযোগ', descEn: 'Textile mills & global openings' },
    { to: '/mentorship', labelBn: 'সিনিয়র মেন্টরশিপ', labelEn: 'Mentorship', icon: Compass, descBn: 'অভিজ্ঞ গ্র্যাজুয়েটদের সান্নিধ্য', descEn: 'Guidance from senior engineers' },
    { to: '/gallery', labelBn: 'আর্কাইভাল গ্যালারি', labelEn: 'Campus Archive', icon: ImageIcon, descBn: 'ঐতিহাসিক মুহূর্ত ও স্মৃতিচারণ', descEn: 'Milestones & photo archives' },
    { to: '/news', labelBn: 'অফিসিয়াল গ্যাজেট ও নোটিশ', labelEn: 'Gazette & News', icon: Newspaper, descBn: 'কলেজ প্রশাসনের জরুরি ঘোষণা', descEn: 'Official administrative notices' },
    { to: '/about', labelBn: 'কলেজ পরিচিতি ও ইতিহাস', labelEn: 'History & Charter', icon: Building2, descBn: 'বস্ত্র অধিদপ্তর ও বুটেক্স অধ্যাদেশ', descEn: 'Establishment & BUTEX charter' },
    { to: '/contact', labelBn: 'যোগাযোগ ও জনসংযোগ', labelEn: 'Contact Desk', icon: PhoneCall, descBn: 'অফিস ও ক্যাম্পাসের দিকনির্দেশনা', descEn: 'Administrative office & address' }
  ];

  return (
    <>
      {/* 1. ARCHITECTURAL TOP MASTHEAD (Sticky at viewport top with light backdrop-blur-md) */}
      <header className="sticky top-0 z-50 w-full bg-[#FAF9F6]/95 dark:bg-[#141311]/95 backdrop-blur-md border-b border-[#C5A880]/30 dark:border-[#C5A880]/25 shadow-md transition-colors duration-300">
        
        {/* TIER 1: OFFICIAL COLLEGE CREST & FULL INSTITUTIONAL TITLE */}
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5">
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3.5 group focus:outline-none w-full min-w-0"
          >
            {/* College Official Crest / Seal */}
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-white dark:bg-[#1E1C18] border border-[#C5A880]/50 dark:border-[#C5A880]/40 p-0.5 sm:p-1 flex items-center justify-center shadow-md group-hover:border-[#854D0E] dark:group-hover:border-[#DFCA9E] transition-colors overflow-hidden shrink-0">
              <img
                src={collegeLogo ? formatDriveImageUrl(collegeLogo) : '/images/rtec-logo.png'}
                alt="RTEC Seal"
                className="w-full h-full object-contain rounded"
                onError={(e) => {
                  e.currentTarget.src = '/images/rtec-logo.png';
                }}
              />
            </div>

            {/* College Full Title & Heritage Accreditation */}
            <div className="min-w-0 flex-1">
              <h1 className="font-serif-regal font-bold text-xs xs:text-[13px] sm:text-base lg:text-lg text-[#0C0A09] dark:text-[#FDFBF7] tracking-wide uppercase group-hover:text-[#854D0E] dark:group-hover:text-[#DFCA9E] transition-colors leading-tight">
                {lang === 'bn'
                  ? 'রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ, পীরগঞ্জ, রংপুর'
                  : 'Rangpur Textile Engineering College, Pirganj, Rangpur'}
              </h1>
              <div className="flex items-center gap-1.5 text-[9px] xs:text-[10px] sm:text-[11px] text-[#854D0E] dark:text-[#DFCA9E] font-mono-tech font-bold tracking-wide mt-0.5">
                <span>
                  {lang === 'bn'
                    ? 'বস্ত্র ও পাট মন্ত্রণালয় • বুটেক্স অধিভুক্ত'
                    : 'Affiliated with BUTEX & Min. of Textiles and Jute'}
                </span>
                <span className="hidden sm:inline text-[#C5A880]/60">•</span>
                <span className="hidden md:inline text-[#57534E] dark:text-[#A89884]/90 font-medium">
                  ESTD. 2018 • 25.4311° N, 89.1500° E
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* TIER 2: UTILITY & ACTION CONTROLS BAR (Language, Theme, Login/Profile, Admin, Index) */}
        <div className="w-full bg-[#EFE9DC]/95 dark:bg-[#181715]/95 border-t border-[#C5A880]/30 dark:border-[#C5A880]/20 px-3 sm:px-6 lg:px-8 py-1.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            
            {/* Left Controls: Bilingual Switcher & Theme Switcher */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Bilingual Switcher */}
              <div className="flex items-center bg-white dark:bg-[#1E1C18] border border-[#C5A880]/50 dark:border-[#C5A880]/30 rounded-lg p-0.5 text-[10px] sm:text-[11px] font-mono-tech shadow-inner">
                <button
                  type="button"
                  onClick={() => setLang('bn')}
                  className={`px-2 py-0.5 rounded font-bold transition-all duration-200 select-none cursor-pointer ${
                    lang === 'bn'
                      ? 'bg-[#854D0E] text-white dark:bg-[#C5A880] dark:text-[#121110] shadow font-black scale-105'
                      : 'text-[#57534E] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF] hover:scale-105'
                  }`}
                  title="বাংলা"
                >
                  বাং
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-2 py-0.5 rounded font-bold transition-all duration-200 select-none cursor-pointer ${
                    lang === 'en'
                      ? 'bg-[#854D0E] text-white dark:bg-[#C5A880] dark:text-[#121110] shadow font-black scale-105'
                      : 'text-[#57534E] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF] hover:scale-105'
                  }`}
                  title="English"
                >
                  EN
                </button>
              </div>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg border border-[#C5A880]/50 dark:border-[#C5A880]/30 hover:border-[#854D0E] dark:hover:border-[#C5A880] bg-white dark:bg-[#1E1C18] text-[#854D0E] dark:text-[#DFCA9E] transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 select-none shadow-sm text-xs font-mono-tech cursor-pointer shrink-0 flex items-center gap-1.5 font-bold"
                title={
                  theme === 'dark'
                    ? (lang === 'bn' ? 'লাইট মোডে পরিবর্তন' : 'Switch to Light Mode')
                    : (lang === 'bn' ? 'ডার্ক মোডে পরিবর্তন' : 'Switch to Dark Mode')
                }
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#DFCA9E]" />
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#DFCA9E]">
                      {lang === 'bn' ? 'লাইট' : 'Light'}
                    </span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#854D0E]" />
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#854D0E]">
                      {lang === 'bn' ? 'ডার্ক' : 'Dark'}
                    </span>
                  </>
                )}
              </button>

              {/* Desktop-only quick link to Student Portal */}
              <Link
                to="/student-portal"
                className={`hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono-tech font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 border shrink-0 ${
                  location.pathname === '/student-portal'
                    ? 'bg-[#854D0E] text-white dark:bg-[#C5A880] dark:text-[#121110] border-[#854D0E] scale-105'
                    : 'bg-white dark:bg-[#1E1C18] text-[#854D0E] dark:text-[#DFCA9E] border-[#C5A880]/40 dark:border-[#C5A880]/30 hover:border-[#854D0E] dark:hover:border-[#C5A880]'
                }`}
                title={lang === 'bn' ? 'শিক্ষার্থী আইডি ও তথ্য জমা' : 'Student Portal'}
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#854D0E] dark:text-[#DFCA9E]" />
                <span className="text-[10px]">{lang === 'bn' ? 'আইডি পোর্টাল' : 'Student ID'}</span>
              </Link>
            </div>

            {/* Right Controls: Authorized Admin Button (hidden for normal users) + Google Login / Profile + 3-line Index Menu */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Admin Quick Link - ONLY visible when logged in with an authorized Admin Gmail */}
              {isAuthorizedAdmin && (
                <Link
                  to="/admin"
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono-tech font-bold uppercase tracking-wider transition border shrink-0 flex items-center gap-1 active:scale-95 shadow-sm ${
                    location.pathname === '/admin'
                      ? 'bg-[#BD452F] text-white border-[#8E2E1D] shadow-md font-black'
                      : 'bg-[#BD452F] text-white border-[#8E2E1D] shadow-sm hover:bg-[#9C3320] font-black'
                  }`}
                  title={lang === 'bn' ? 'এডমিন পোর্টাল' : 'Administration'}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span className="text-[10px] sm:text-xs font-black text-white">
                    {lang === 'bn' ? 'এডমিন' : 'Admin'}
                  </span>
                </Link>
              )}

              {/* User Account / Profile Controls */}
              {user && user.role !== 'guest' ? (
                <div className="relative shrink-0">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1 sm:gap-1.5 p-1 sm:px-2 sm:py-1 rounded-lg bg-white dark:bg-[#1E1C18] hover:bg-slate-50 dark:hover:bg-[#25221E] border border-[#C5A880]/40 dark:border-[#C5A880]/30 transition cursor-pointer active:scale-95 shadow-sm"
                    title={lang === 'bn' ? 'প্রোফাইল মেন্যু খুলুন' : 'Open Profile Menu'}
                  >
                    <UserAvatar
                      src={user.avatar}
                      name={user.name}
                      role={user.role}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded border border-[#C5A880]/40 shrink-0"
                    />
                    <div className="hidden sm:block text-left">
                      <p className="text-[11px] font-bold text-[#0C0A09] dark:text-[#FDFBF7] leading-none truncate max-w-[80px]">
                        {lang === 'bn' ? (user.nameBn ? user.nameBn.split(' ')[0] : user.name.split(' ')[0]) : user.name.split(' ')[0]}
                      </p>
                    </div>
                    <ChevronDown className="w-3 h-3 text-[#854D0E] dark:text-[#A89884]" />
                  </button>

                  {/* Dropdown Menu with Framer Motion */}
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        key="profile-dropdown-menu"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#181715] p-3 shadow-2xl border border-slate-200 dark:border-[#C5A880]/30 z-50 text-slate-900 dark:text-[#EDE8DF]"
                        onMouseLeave={() => setUserDropdownOpen(false)}
                      >
                      <div className="px-2 py-1.5 border-b border-slate-100 dark:border-[#C5A880]/15 mb-2">
                        <p className="text-xs font-serif-regal font-black text-slate-900 dark:text-[#FDFBF7] truncate">
                          {lang === 'bn' ? user.nameBn || user.name : user.name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-[#A89884] font-mono-tech truncate mt-0.5">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-mono-tech uppercase font-bold bg-amber-50 text-amber-800 border border-amber-300 dark:bg-[#C5A880]/15 dark:text-[#DFCA9E] dark:border-[#C5A880]/25">
                          {user.role === 'admin' 
                            ? (lang === 'bn' ? 'এডমিনিস্ট্রেটর' : 'ADMINISTRATOR') 
                            : (lang === 'bn' ? 'শিক্ষার্থী / সদস্য' : 'STUDENT / MEMBER')}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {isAuthorizedAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="dropdown-menu-item dropdown-item-admin"
                          >
                            <ShieldCheck className="w-4 h-4 shrink-0" />
                            <span>{lang === 'bn' ? 'এডমিন কনসোল' : 'Admin Console'}</span>
                          </Link>
                        )}

                        <Link
                          to="/student-portal"
                          onClick={() => setUserDropdownOpen(false)}
                          className="dropdown-menu-item dropdown-item-portal"
                        >
                          <GraduationCap className="w-4 h-4 shrink-0" />
                          <span>{lang === 'bn' ? 'স্টুডেন্ট আইডি পোর্টাল' : 'Student Portal'}</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="dropdown-menu-item dropdown-item-profile"
                        >
                          <User className="w-4 h-4 shrink-0" />
                          <span>{lang === 'bn' ? 'আমার প্রোফাইল' : 'My Profile'}</span>
                        </Link>
                      </div>

                      <div className="pt-2 mt-1.5 border-t border-slate-100 dark:border-[#C5A880]/15">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="dropdown-menu-item dropdown-item-logout w-full cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 shrink-0" />
                          <span>{lang === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
                        </button>
                      </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsGoogleModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E1C18] hover:bg-slate-50 dark:hover:bg-[#25221E] border border-slate-300 dark:border-[#C5A880]/40 text-slate-800 dark:text-[#DFCA9E] transition shadow-sm font-sans cursor-pointer shrink-0 font-bold active:scale-95"
                    title={lang === 'bn' ? 'গুগল দিয়ে প্রবেশ করুন' : 'Sign in with Google'}
                  >
                    <GoogleLogo className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[10px] sm:text-xs font-bold font-sans">
                      {lang === 'bn' ? 'লগইন' : 'Login'}
                    </span>
                  </button>
                </div>
              )}

              {/* 3-line Index Archive Drawer Button */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#C5A880]/20 hover:bg-[#F3EFE7] dark:hover:bg-[#C5A880]/30 border-2 border-[#854D0E] dark:border-[#DFCA9E] text-[#854D0E] dark:text-[#DFCA9E] transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm font-black"
                aria-label="Open College Archive"
                title={lang === 'bn' ? 'আর্কাইভ ও ইনডেক্স মেন্যু' : 'College Index & Menu'}
              >
                <Menu className="w-4 h-4 shrink-0 text-[#854D0E] dark:text-[#DFCA9E] stroke-[2.5]" />
                <span className="text-[10px] sm:text-xs font-mono-tech tracking-wider uppercase font-black text-[#854D0E] dark:text-[#DFCA9E]">
                  {lang === 'bn' ? 'ইনডেক্স' : 'INDEX'}
                </span>
              </button>
            </div>

          </div>
        </div>

      </header>

      {/* 2A. DEDICATED MOBILE BOTTOM APP BAR (Fixed at screen bottom, 5 equal items, ZERO overflow, hidden on Admin) */}
      {!location.pathname.startsWith('/admin') && (
        <nav 
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F6]/95 dark:bg-[#141311]/95 border-t border-[#C5A880]/40 dark:border-[#C5A880]/30 backdrop-blur-xl shadow-[0_-4px_25px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.6)] md:hidden pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1 px-1.5 transition-colors"
          aria-label="Mobile Navigation Bar"
        >
          <div className="flex items-start justify-between w-full max-w-md mx-auto">
            {mobileDockItems.map((item) => {
              const isActive = location.pathname === item.to;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex-1 flex flex-col items-center justify-start py-1 px-0.5 rounded-lg transition-all duration-200 hover:scale-105 min-w-0 ${
                    isActive
                      ? 'text-[#854D0E] dark:text-[#DFCA9E] font-bold scale-105'
                      : 'text-[#78716C] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF]'
                  }`}
                >
                  <div className={`p-1 rounded-md transition-all duration-200 ${
                    isActive ? 'bg-[#C5A880]/25 dark:bg-[#C5A880]/20 text-[#854D0E] dark:text-[#DFCA9E] shadow-sm scale-110' : ''
                  }`}>
                    <IconComponent className={`w-4.5 h-4.5 shrink-0 ${
                      isActive ? 'text-[#854D0E] dark:text-[#DFCA9E]' : 'text-[#78716C] dark:text-[#A89884]'
                    }`} />
                  </div>
                  <span className="text-[9.5px] font-sans font-semibold tracking-tighter mt-0.5 line-clamp-2 text-center w-full leading-[1.15]">
                    {lang === 'bn' ? item.labelBn : item.labelEn}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* 2B. BESPOKE FLOATING COMMAND DOCK (Desktop & Tablet >= 768px, hidden on Admin) */}
      {!location.pathname.startsWith('/admin') && (
        <nav 
          className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-auto"
          aria-label="Floating Navigation Dock"
        >
          <div className="bg-[#FAF9F6]/95 dark:bg-[#181715]/95 rounded-2xl px-3.5 py-2 border border-[#C5A880]/40 dark:border-[#C5A880]/35 shadow-2xl flex items-center justify-center gap-3 backdrop-blur-md transition-colors duration-200">
            {primaryDockItems.map((item) => {
              const isActive = location.pathname === item.to;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative group flex flex-col items-center justify-center px-3.5 py-1.5 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:scale-105 ${
                    isActive
                      ? 'bg-[#C5A880]/25 dark:bg-[#C5A880]/15 text-[#854D0E] dark:text-[#DFCA9E] border border-[#C5A880]/50 dark:border-[#C5A880]/40 font-bold scale-110'
                      : 'text-[#78716C] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF] hover:bg-[#F3EFE7] dark:hover:bg-[#1E1C18]'
                  }`}
                >
                  <IconComponent className={`w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-[#854D0E] dark:text-[#DFCA9E]' : 'text-[#78716C] dark:text-[#A89884]'
                  }`} />
                  <span className="text-[11px] font-sans font-semibold tracking-tight mt-0.5 leading-none">
                    {lang === 'bn' ? item.labelBn : item.labelEn}
                  </span>

                  {/* Active Indicator Crosshair Dot */}
                  {isActive && (
                    <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#854D0E] dark:bg-[#DFCA9E] shadow-[0_0_6px_#854D0E] dark:shadow-[0_0_6px_#DFCA9E]" />
                  )}
                </Link>
              );
            })}

            {/* Quick Drawer trigger inside Dock */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg text-[#78716C] dark:text-[#A89884] hover:text-[#854D0E] dark:hover:text-[#DFCA9E] hover:bg-[#F3EFE7] dark:hover:bg-[#1E1C18] transition-all duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer font-bold"
              title={lang === 'bn' ? 'সকল সেকশন' : 'More'}
            >
              <Compass className="w-4.5 h-4.5" />
              <span className="text-[11px] font-sans font-semibold mt-0.5 leading-none">
                {lang === 'bn' ? 'ইনডেক্স' : 'More'}
              </span>
            </button>
          </div>
        </nav>
      )}

      {/* 3. ARCHITECTURAL REGISTER DRAWER (Synchronized GPU Backdrop Fade + Right Slide) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence onExitComplete={() => setDrawerScrollLocked(false)}>
          {drawerOpen && (
            <>
              <motion.div
                key="rtec-drawer-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, pointerEvents: 'none' }}
                transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
                className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
                onClick={() => setDrawerOpen(false)}
              />
              <motion.div
                key="rtec-drawer-panel"
                role="dialog"
                aria-modal="true"
                aria-label="Campus and Academy Index"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%', pointerEvents: 'none' }}
                transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="fixed top-0 right-0 bottom-0 z-[9999] w-full max-w-md bg-[#FAF9F6] dark:bg-[#161513] border-l border-[#C5A880]/30 dark:border-[#C5A880]/25 h-full overflow-y-auto flex flex-col p-6 shadow-2xl overscroll-contain"
                style={{
                  willChange: 'transform',
                  backgroundImage: 'radial-gradient(rgba(197, 168, 128, 0.08) 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#C5A880]/20 mb-6">
                  <div>
                    <span className="text-[10px] font-mono-tech uppercase tracking-widest text-[#854D0E] dark:text-[#DFCA9E] font-bold">
                      RTEC ARCHIVES • CENTRAL INDEX
                    </span>
                    <h3 className="text-base sm:text-lg font-serif-regal font-bold text-[#0C0A09] dark:text-[#FDFBF7] mt-0.5">
                      {lang === 'bn' ? 'ক্যাম্পাস ও একাডেমি ইনডেক্স' : 'Campus & Academy Index'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-2 rounded-lg bg-white dark:bg-[#1E1C18] border border-[#C5A880]/30 text-[#44403C] dark:text-[#A89884] hover:text-[#0C0A09] dark:hover:text-[#EDE8DF] hover:border-[#854D0E] dark:hover:border-[#C5A880] transition shadow-sm cursor-pointer"
                    aria-label="Close Drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Central Quick Account Hub in Drawer */}
                <div className="mb-5 p-4 rounded-2xl bg-amber-50 dark:bg-[#1E1C18] border border-amber-300 dark:border-[#C5A880]/30 shadow-md space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-300/60 dark:border-[#C5A880]/20">
                    <span className="text-[10px] font-mono-tech uppercase font-bold text-[#78350F] dark:text-[#DFCA9E] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#854D0E] dark:text-[#DFCA9E]" />
                      <span>
                        {isAuthorizedAdmin
                          ? (lang === 'bn' ? 'অ্যাকাউন্ট ও প্রশাসন হাব' : 'Account & Admin Hub')
                          : (lang === 'bn' ? 'অ্যাকাউন্ট ও পোর্টাল হাব' : 'Account & Student Hub')}
                      </span>
                    </span>
                    {user && user.role !== 'guest' ? (
                      <span className="text-[9px] font-mono-tech px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/40">
                        {user.role}
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono-tech px-2 py-0.5 rounded-full font-bold uppercase bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100">
                        GUEST
                      </span>
                    )}
                  </div>

                  {user && user.role !== 'guest' ? (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <UserAvatar
                          src={user.avatar}
                          name={user.name}
                          role={user.role}
                          className="w-8 h-8 rounded-full border border-amber-500/40 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#0C0A09] dark:text-[#FDFBF7] truncate">
                            {lang === 'bn' ? user.nameBn || user.name : user.name}
                          </p>
                          <p className="text-[10px] text-[#374151] dark:text-[#DCD3C1] font-mono truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={logout}
                        className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-500/20 dark:hover:bg-rose-500/35 text-rose-800 dark:text-rose-200 text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer border border-rose-300 dark:border-rose-500/40"
                        title={lang === 'bn' ? 'লগআউট' : 'Logout'}
                      >
                        <LogOut className="w-3 h-3" />
                        <span>{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
                      </button>
                    </div>
                  ) : null}

                  {/* Action buttons inside Hub */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {(!user || user.role === 'guest') ? (
                      <button
                        type="button"
                        onClick={() => {
                          setDrawerOpen(false);
                          setIsGoogleModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white dark:bg-[#141311] border border-slate-300 dark:border-[#C5A880]/30 hover:bg-slate-50 dark:hover:bg-[#25221E] text-xs font-bold text-[#0C0A09] dark:text-[#FDFBF7] transition shadow-sm cursor-pointer"
                      >
                        <GoogleLogo className="w-3.5 h-3.5 shrink-0" />
                        <span>{lang === 'bn' ? 'গুগল সাইন ইন' : 'Google Login'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setDrawerOpen(false);
                        }}
                        className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/40 hover:bg-rose-200 dark:hover:bg-rose-500/35 text-xs font-bold text-rose-800 dark:text-rose-200 transition shadow-sm cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 shrink-0" />
                        <span>{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
                      </button>
                    )}

                    {isAuthorizedAdmin ? (
                      <Link
                        to="/admin"
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-bold transition shadow-sm bg-[#BD452F] hover:bg-[#9C3320] text-white"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>{lang === 'bn' ? 'এডমিন কনসোল' : 'Admin Console'}</span>
                      </Link>
                    ) : (
                      <Link
                        to={user && user.role !== 'guest' ? '/profile' : '/student-portal'}
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-bold transition shadow-sm bg-emerald-700 hover:bg-emerald-600 text-white"
                      >
                        <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {user && user.role !== 'guest'
                            ? (lang === 'bn' ? 'আমার প্রোফাইল' : 'My Profile')
                            : (lang === 'bn' ? 'স্টুডেন্ট পোর্টাল' : 'Student Portal')}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Directory Links List */}
                <div className="space-y-2.5 flex-1">
                  <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#854D0E] dark:text-[#DFCA9E] block mb-2 font-bold">
                    {lang === 'bn' ? '— বিশেষায়িত পোর্টাল সূচি' : '— SPECIALIZED ARCHIVES'}
                  </span>

                  {archiveLinks.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setDrawerOpen(false)}
                        className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-[transform,background-color,border-color] duration-200 ${
                          isActive
                            ? 'drawer-archive-card-active shadow-lg scale-[1.01]'
                            : 'drawer-archive-card bg-white dark:bg-[#1E1C18] border-[#C5A880]/30 dark:border-[#C5A880]/20 hover:border-[#854D0E]/60 dark:hover:border-[#C5A880]/45 hover:bg-[#F8F5EE] dark:hover:bg-[#25221E] shadow-sm'
                        }`}
                      >
                        <div className={`p-2.5 rounded-lg mt-0.5 shrink-0 transition-colors ${
                          isActive
                            ? 'drawer-active-icon shadow-md'
                            : 'bg-[#F4EFE6] dark:bg-[#121110] border border-[#C5A880]/40 dark:border-[#C5A880]/25 text-[#854D0E] dark:text-[#DFCA9E]'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-xs font-bold font-sans ${
                              isActive ? 'drawer-active-title font-extrabold' : 'drawer-archive-title text-[#0C0A09] dark:text-[#FDFBF7]'
                            }`}>
                              {lang === 'bn' ? item.labelBn : item.labelEn}
                            </span>
                            {isActive ? (
                              <span className="drawer-current-badge px-2.5 py-0.5 rounded-full text-[9px] font-mono-tech font-extrabold tracking-wider shrink-0 shadow-sm">
                                {lang === 'bn' ? 'বর্তমান পেজ' : 'CURRENT PAGE'}
                              </span>
                            ) : (
                              <ArrowUpRight className="w-3.5 h-3.5 text-[#854D0E] dark:text-[#DFCA9E] shrink-0" />
                            )}
                          </div>
                          <p className={`text-[11px] mt-0.5 truncate font-sans leading-relaxed ${
                            isActive ? 'drawer-active-desc font-semibold' : 'drawer-archive-desc text-[#374151] dark:text-[#DCD3C1] font-medium'
                          }`}>
                            {lang === 'bn' ? item.descBn : item.descEn}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Drawer Footer with Theme Toggle */}
                <div className="pt-4 border-t border-[#C5A880]/20 mt-6 flex items-center justify-between text-[11px] font-mono-tech text-[#57534E] dark:text-[#A89884]">
                  <span className="font-semibold">{lang === 'bn' ? 'আরটেক পীরগঞ্জ, রংপুর' : 'RTEC PIRGANJ, RANGPUR'}</span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1E1C18] border border-[#C5A880]/35 text-[#854D0E] dark:text-[#DFCA9E] hover:border-[#854D0E] dark:hover:border-[#C5A880] transition shadow-sm cursor-pointer"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-[#DFCA9E]" />
                        <span className="font-bold">{lang === 'bn' ? 'লাইট মোড' : 'Light Mode'}</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-[#854D0E]" />
                        <span className="font-bold text-[#854D0E]">{lang === 'bn' ? 'ডার্ক মোড' : 'Dark Mode'}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Google Sign-in Modal accessible globally from Navbar */}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
      />
    </>
  );
}
