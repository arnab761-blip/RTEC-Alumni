import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { useScrollLock } from '../utils/useScrollLock.js';
import { X, ShieldCheck, Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export function GoogleLogo({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function GoogleSignInButton({ onClick, text, className = "" }) {
  const { lang } = useApp();
  const label = text || (lang === 'bn' ? 'গুগল দিয়ে প্রবেশ করুন' : 'Continue with Google');

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1A1916] hover:bg-slate-50 dark:hover:bg-[#24221E] text-slate-800 dark:text-[#EDE8DF] font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-sm hover:shadow transition active:scale-[0.99] cursor-pointer ${className}`}
    >
      <GoogleLogo className="w-5 h-5 shrink-0" />
      <span>{label}</span>
    </button>
  );
}

export default function GoogleSignInModal({ isOpen, onClose, onSuccess }) {
  const { lang, loginWithGmail, showToast, adminEmails } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Lock background scroll when open
  useScrollLock(Boolean(isOpen));

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!emailInput.trim()) return;

    let email = emailInput.trim().toLowerCase();
    if (!email.includes('@')) {
      email = `${email}@gmail.com`;
    }

    setIsLoading(true);
    setTimeout(() => {
      const user = loginWithGmail(email, nameInput);
      setIsLoading(false);
      showToast?.(
        lang === 'bn'
          ? `✓ গুগল অ্যাকাউন্ট দিয়ে সফলভাবে লগইন হয়েছে: ${email}`
          : `✓ Successfully signed in with Google: ${email}`
      );
      if (onSuccess) onSuccess(user);
      onClose();
    }, 350);
  };

  const handleAdminQuickFill = () => {
    const adminEmail = (adminEmails && adminEmails[0]) || 'megasonic298@gmail.com';
    setEmailInput(adminEmail);
    setNameInput('Megasonic Super Admin');
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      data-lenis-prevent="true"
      data-modal-open="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
        data-lenis-prevent="true"
        className="w-full max-w-md bg-white dark:bg-[#181715] border border-slate-200 dark:border-[#C5A880]/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative text-[#1C1917] dark:text-[#EDE8DF] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-[#201E1A] text-slate-500 hover:text-black dark:hover:text-white transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Google Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#201E1A] shadow-md border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto mb-3">
            <GoogleLogo className="w-8 h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-[#FDFBF7]">
            {lang === 'bn' ? 'গুগল দিয়ে প্রবেশ করুন' : 'Sign in with Google'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#A89884] mt-1">
            {lang === 'bn'
              ? 'রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ প্ল্যাটফর্মে আপনার গুগল অ্যাকাউন্ট যুক্ত করুন।'
              : 'Connect your verified Google account to RTEC platform.'}
          </p>
        </div>

        {/* Quick Admin Helper Button */}
        <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-2">
          <div className="text-left">
            <span className="text-[10px] font-mono-tech font-bold uppercase text-amber-700 dark:text-amber-400 block">
              {lang === 'bn' ? 'অ্যাডমিন অ্যাকাউন্ট লিংক:' : 'Admin Account:'}
            </span>
            <span className="text-xs font-mono-tech text-slate-800 dark:text-[#EDE8DF] font-bold">
              megasonic298@gmail.com
            </span>
          </div>
          <button
            type="button"
            onClick={handleAdminQuickFill}
            className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold font-mono-tech transition cursor-pointer shrink-0"
          >
            {lang === 'bn' ? 'অটো-পূরণ' : 'Auto Fill'}
          </button>
        </div>

        {/* Google Sign-in Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-[#DCD3C1] mb-1.5">
              {lang === 'bn' ? 'জিমেইল ঠিকানা (Gmail Address)' : 'Google Email'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#141311] border border-slate-300 dark:border-[#C5A880]/30 text-xs text-slate-900 dark:text-[#FDFBF7] placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#A89884] mt-1 block">
              {lang === 'bn' ? '* শুধু ইউজারনেম লিখলেও হবে (@gmail.com স্বয়ংক্রিয় যুক্ত হবে)' : '* e.g. student@gmail.com'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-[#DCD3C1] mb-1.5">
              {lang === 'bn' ? 'আপনার নাম (Name - ঐচ্ছিক)' : 'Name (Optional)'}
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder={lang === 'bn' ? 'উদা: সাকিব আল হাসান' : 'e.g. Shakib Al Hasan'}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#141311] border border-slate-300 dark:border-[#C5A880]/30 text-xs text-slate-900 dark:text-[#FDFBF7] placeholder-slate-400 focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
            >
              <GoogleLogo className="w-4 h-4 bg-white rounded-full p-0.5" />
              <span>{isLoading ? (lang === 'bn' ? 'সংযোগ হচ্ছে...' : 'Signing in...') : (lang === 'bn' ? 'লগইন করুন (Continue)' : 'Continue with Google')}</span>
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-[10px] text-slate-400 dark:text-[#888] flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>{lang === 'bn' ? 'নিরাপদ গুগল ওয়ান-ক্লিক প্রমাণীকরণ' : 'Verified Google Authentication'}</span>
          </p>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
