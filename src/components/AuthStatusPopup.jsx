import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, LogOut, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function AuthStatusPopup() {
  const { authFeedback, dismissAuthFeedback, lang } = useApp();

  if (typeof document === 'undefined') return null;

  const isLogin = authFeedback?.type === 'login';

  return createPortal(
    <AnimatePresence>
      {authFeedback && (
        <motion.div
          key={authFeedback.id}
          initial={{ opacity: 0, y: -36, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28, mass: 0.85 }}
          className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[999999] w-[92vw] max-w-md pointer-events-auto"
          role="status"
          aria-live="polite"
        >
          <div
            className={`auth-status-popup relative overflow-hidden rounded-2xl p-4 sm:p-5 border shadow-2xl flex items-center gap-3.5 ${
              isLogin
                ? 'auth-status-popup-login shadow-emerald-950/15 dark:shadow-emerald-950/60'
                : 'auth-status-popup-logout shadow-slate-900/15 dark:shadow-black/60'
            }`}
          >
            {/* Animated Top Progress Bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 3.3, ease: 'linear' }}
              className={`absolute top-0 left-0 right-0 h-1 origin-left ${
                isLogin
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500'
                  : 'bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 dark:from-slate-400 dark:via-slate-200 dark:to-slate-400'
              }`}
            />

            {/* Animated Badge Icon */}
            <motion.div
              initial={{ rotate: -18, scale: 0.65 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.05 }}
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 relative border ${
                isLogin
                  ? 'bg-emerald-50 dark:bg-emerald-500/25 border-emerald-200 dark:border-emerald-300/60 text-emerald-700 dark:text-emerald-100'
                  : 'bg-slate-100 dark:bg-slate-700/70 border-slate-200 dark:border-slate-500 text-slate-700 dark:text-slate-100'
              }`}
            >
              {isLogin ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.6, 1.25, 1.4] }}
                    transition={{ duration: 1.1, repeat: 1 }}
                    className="absolute -top-1 -right-1 text-amber-500 dark:text-amber-300"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </motion.span>
                </>
              ) : (
                <LogOut className="w-5 h-5" />
              )}
            </motion.div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono-tech uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full border ${
                    isLogin
                      ? 'bg-emerald-100 dark:bg-emerald-500/35 text-emerald-800 dark:text-white border-emerald-300 dark:border-emerald-300/60'
                      : 'bg-slate-800 dark:bg-slate-700 text-white border-slate-700 dark:border-slate-500 keep-white'
                  }`}
                >
                  {isLogin
                    ? (lang === 'bn' ? 'অ্যাকাউন্ট যুক্ত' : 'SIGNED IN')
                    : (lang === 'bn' ? 'সেশন সমাপ্ত' : 'SESSION ENDED')}
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
                {isLogin
                  ? (lang === 'bn' ? 'লগইন সাকসেসফুল!' : 'Login Successful!')
                  : (lang === 'bn' ? 'লগআউট সম্পন্ন হয়েছে' : 'Logged Out Successfully')}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-200 truncate mt-0.5 font-sans font-medium">
                {isLogin
                  ? (lang === 'bn'
                      ? `স্বাগতম, ${authFeedback.name || authFeedback.email}`
                      : `Welcome, ${authFeedback.name || authFeedback.email}`)
                  : (lang === 'bn'
                      ? 'আপনার অ্যাকাউন্ট থেকে নিরাপদে সাইন আউট সম্পন্ন হয়েছে।'
                      : 'You have been safely signed out of your account.')}
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={dismissAuthFeedback}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/15 dark:hover:bg-white/25 text-slate-600 dark:text-white transition shrink-0 cursor-pointer"
              aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
