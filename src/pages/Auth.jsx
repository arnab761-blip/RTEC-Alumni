import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import GoogleSignInModal, { GoogleSignInButton } from '../components/GoogleSignInModal.jsx';
import { formatDriveImageUrl } from '../utils/driveImage.js';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  UserCheck,
  Mail,
  Lock,
  Building,
  Phone,
  ArrowRight,
  Sparkles,
  Hash,
  CheckCircle2,
  LogOut
} from 'lucide-react';

const BATCH_OPTIONS = [
  '8th Batch (2025-26)',
  '7th Batch (2024-25)',
  '6th Batch (2023-24)',
  '5th Batch (2022-23)',
  '4th Batch (2021-22)',
  '3rd Batch (2020-21)',
  '2nd Batch (2019-20)',
  '1st Batch (2018-19)'
];

const DEPARTMENT_OPTIONS = [
  'Yarn Engineering',
  'Fabric Engineering',
  'Wet Process Engineering',
  'Apparel Manufacturing'
];

export default function Auth() {
  const { user, logout, login, students = [], lang, collegeLogo } = useApp();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('alumni'); // 'alumni' | 'student' | 'admin'
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const [regNo, setRegNo] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [batch, setBatch] = useState('1st Batch (2018-19)');
  const [dept, setDept] = useState('Yarn Engineering');
  const [matchedStudent, setMatchedStudent] = useState(null);
  const [authError, setAuthError] = useState('');

  const handleRegNoChange = (val) => {
    setRegNo(val);
    if (!val.trim()) {
      setMatchedStudent(null);
      return;
    }
    const found = students.find(
      s => s.regNo && String(s.regNo).trim().toLowerCase() === val.trim().toLowerCase()
    );
    if (found) {
      setMatchedStudent(found);
      if (found.name && !name) setName(found.name);
      if (found.batch) setBatch(found.batch);
      if (found.department) setDept(found.department);
      if (found.phone && !phone) setPhone(found.phone);
    } else {
      setMatchedStudent(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    const res = login(
      role,
      email,
      name || matchedStudent?.name || 'Registered Member',
      batch,
      dept,
      { phone, regNo }
    );
    if (res?.error === 'ADMIN_GOOGLE_REQUIRED') {
      setAuthError(
        lang === 'bn'
          ? 'অ্যাডমিন অ্যাকাউন্টের নিরাপত্তার জন্য পাসওয়ার্ডের বদলে উপরের "Continue with Google" বাটনে ক্লিক করে গুগল ভেরিফিকেশন করুন।'
          : 'Admin accounts require verified Google Sign-In. Please click Continue with Google above.'
      );
      setIsGoogleModalOpen(true);
      return;
    }
    navigate('/profile');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-transparent text-[#EDE8DF] py-12 px-4 flex items-center justify-center relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative z-10">
        
        {/* Logo and Welcome */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#1E1C18] border border-[#C5A880]/50 dark:border-[#C5A880]/40 p-2 shadow-lg mx-auto mb-3 flex items-center justify-center overflow-hidden">
            <img
              src={collegeLogo ? formatDriveImageUrl(collegeLogo) : '/images/rtec-logo.png'}
              alt="Rangpur Textile Engineering College Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/images/rtec-logo.png';
              }}
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {mode === 'login'
              ? (lang === 'bn' ? 'অ্যাকাউন্টে প্রবেশ / লগইন করুন' : 'Sign in to Account')
              : (lang === 'bn' ? 'নতুন আইডি নিবন্ধন ও ক্লেইম করুন' : 'Register & Claim ID')}
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            {lang === 'bn'
              ? 'রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ প্ল্যাটফর্ম'
              : 'Rangpur Textile Engineering College Platform'}
          </p>
        </div>

        {/* Role Switcher Tabs (Alumni & Student only) */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-[#F4EFE6] dark:bg-slate-900 border border-[#C5A880]/30 dark:border-slate-800 mb-5">
          {[
            { id: 'alumni', labelBn: 'প্রাক্তন (Alumni)', labelEn: 'Alumni' },
            { id: 'student', labelBn: 'শিক্ষার্থী (Student)', labelEn: 'Student' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRole(item.id)}
              className={`py-2 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105 text-center cursor-pointer ${
                role === item.id
                  ? 'bg-emerald-600 text-white shadow scale-105'
                  : 'text-[#374151] dark:text-slate-300 hover:text-[#0C0A09] dark:hover:text-white'
              }`}
            >
              {lang === 'bn' ? item.labelBn : item.labelEn}
            </button>
          ))}
        </div>

        {/* 1-Click Google Sign In (Hidden when already signed in) */}
        {user && user.role !== 'guest' ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-400/50 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0C0A09] dark:text-white">
                {lang === 'bn' ? `আপনি বর্তমানে লগইন আছেন` : 'You Are Currently Signed In'}
              </h3>
              <p className="text-xs text-[#374151] dark:text-[#DCD3C1] font-mono mt-1">
                {user.name} • {user.email}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <Link
                to={user.role === 'admin' ? '/admin' : '/profile'}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <ArrowRight className="w-4 h-4" />
                <span>{user.role === 'admin' ? (lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel') : (lang === 'bn' ? 'আমার প্রোফাইল' : 'My Profile')}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
              </button>
            </div>
          </div>
        ) : (
        <>
        {/* 1-Click Google Sign In */}
        <div className="mb-5">
          <GoogleSignInButton
            onClick={() => setIsGoogleModalOpen(true)}
            text={mode === 'login'
              ? (lang === 'bn' ? 'গুগল দিয়ে সরাসরি প্রবেশ করুন' : 'Continue with Google')
              : (lang === 'bn' ? 'গুগল দিয়ে আইডি ক্লেইম করুন' : 'Claim ID with Google')}
          />
          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-wider text-slate-500">
              {lang === 'bn' ? 'অথবা আইডি ও পাসওয়ার্ড দিয়ে' : 'OR WITH REG NO & PASSWORD'}
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>
        </div>

        {/* Form */}
        {authError && (
          <div className="mb-3 p-3 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/40 text-xs font-semibold text-rose-900 dark:text-rose-200 leading-relaxed">
            {authError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Registration Number (For Student & Alumni) */}
          {role !== 'admin' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'bn' ? 'রেজিস্ট্রেশন নম্বর' : 'Registration No'}
              </label>
              <div className="relative">
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required={mode === 'register'}
                  value={regNo}
                  onChange={(e) => handleRegNoChange(e.target.value)}
                  placeholder="8025101"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <AnimatePresence>
                {matchedStudent && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 p-2 rounded-xl bg-emerald-950/60 border border-emerald-600/60 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        {lang === 'bn' ? 'কলেজ ডেটাবেজে ভেরিফাইড: ' : 'Verified in College Database: '}
                        <b className="text-white">{matchedStudent.name}</b> ({matchedStudent.batch})
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Full Name */}
          <AnimatePresence>
            {(mode === 'register' || role === 'admin') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Phone Number */}
          {role !== 'admin' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Phone'}
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  required={mode === 'register'}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01712-XXXXXX"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Batch & Dept for registration */}
          <AnimatePresence>
            {mode === 'register' && role !== 'admin' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'bn' ? 'ব্যাচ' : 'Academic Batch'}
                </label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {BATCH_OPTIONS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'bn' ? 'ডিপার্টমেন্ট' : 'Department'}
                </label>
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {DEPARTMENT_OPTIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-950/60 mt-2 cursor-pointer"
          >
            {mode === 'login'
              ? (lang === 'bn' ? 'লগইন করুন' : 'Sign In')
              : (lang === 'bn' ? 'নিবন্ধন ও প্রোফাইল ক্লেইম করুন' : 'Register & Claim Profile')}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
          >
            {mode === 'login'
              ? (lang === 'bn' ? 'অ্যাকাউন্ট নেই? নতুন অ্যাকাউন্ট খুলুন' : "Don't have an account? Register now")
              : (lang === 'bn' ? 'ইতোমধ্যে অ্যাকাউন্ট আছে? লগইন করুন' : 'Already have an account? Sign in')}
          </button>
        </div>
        </>
        )}

        {/* Student Self-Registration Gateway (Hidden when logged in as Alumni) */}
        {user?.role !== 'alumni' && (
        <div className="mt-5 p-4 rounded-2xl bg-[#141311] border border-[#C5A880]/30 text-center space-y-2">
          <p className="text-xs font-bold text-[#FDFBF7]">
            {lang === 'bn' ? 'স্টুডেন্ট আইডি ও প্রোফাইল পোর্টাল' : 'Student ID & Profile Portal'}
          </p>
          <p className="text-[11px] text-[#A89884] font-sans">
            {lang === 'bn'
              ? 'বর্তমান শিক্ষার্থীরা রেজিস্ট্রেশন নম্বর দিয়ে সরাসরি ছবি, রক্তের গ্রুপ ও তথ্য আপডেট করতে চান?'
              : 'Current students: want to update your photo, blood group and info using your student ID?'}
          </p>
          <Link
            to="/student-portal"
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'স্টুডেন্ট প্রোফাইলে যান →' : 'Go to Student Profile →'}</span>
          </Link>
        </div>
        )}

        {/* Google Sign-in Modal */}
        <GoogleSignInModal
          isOpen={isGoogleModalOpen}
          onClose={() => setIsGoogleModalOpen(false)}
          onSuccess={() => navigate('/profile')}
        />

      </div>
    </motion.div>
  );
}
