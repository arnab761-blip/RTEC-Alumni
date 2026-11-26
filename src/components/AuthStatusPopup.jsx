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
          initial={{ opacity: 0, y: -36, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28, mass: 0.85 }}
          className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[999999] w-[92vw] max-w-md pointer-events-auto"
          role="status"
          aria-live="polite"
        >
          <div
            className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border-2 shadow-2xl backdrop-blur-xl flex items-center gap-3.5 ${
              isLogin
                ? 'bg-[#064E3B]/95 border-emerald-400 text-white shadow-emerald-950/60'
                : 'bg-[#1C1917]/95 border-[#C5A880] text-[#FDFBF7] shadow-black/60'
            }`}
          >
            {/* Animated Top Shimmer Bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 3.3, ease: 'linear' }}
              className={`absolute top-0 left-0 right-0 h-1 origin-left ${
                isLogin ? 'bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-300' : 'bg-gradient-to-r from-[#C5A880] via-amber-300 to-[#C5A880]'
              }`}
            />

            {/* Animated Pulse Badge Icon */}
            <motion.div
              initial={{ rotate: -20, scale: 0.6 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.05 }}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 relative border ${
                isLogin
                  ? 'bg-emerald-500/25 border-emerald-300/60 text-emerald-200'
                  : 'bg-[#C5A880]/20 border-[#C5A880]/50 text-[#DFCA9E]'
              }`}
            >
              {isLogin ? (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.6, 1.25, 1.4] }}
                    transition={{ duration: 1.1, repeat: 1 }}
                    className="absolute -top-1 -right-1 text-amber-300"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </motion.span>
                </>
              ) : (
                <LogOut className="w-6 h-6" />
              )}
            </motion.div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono-tech uppercase tracking-widest font-extrabold px-2 py-0.5 rounded-full ${
                    isLogin
                      ? 'bg-emerald-400/25 text-emerald-100 border border-emerald-300/40'
                      : 'bg-[#C5A880]/20 text-[#DFCA9E] border border-[#C5A880]/40'
                  }`}
                >
                  {isLogin
                    ? (lang === 'bn' ? 'অ্যাকাউন্ট যুক্ত' : 'SIGNED IN')
                    : (lang === 'bn' ? 'সেশন সমাপ্ত' : 'SESSION ENDED')}
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-extrabold tracking-tight mt-1 text-white">
                {isLogin
                  ? (lang === 'bn' ? 'লগইন সাকসেসফুল!' : 'Login Successful!')
                  : (lang === 'bn' ? 'লগড আউট সম্পন্ন!' : 'Logged Out Successfully')}
              </h4>

              <p className="text-xs text-white/85 truncate mt-0.5 font-sans">
                {isLogin
                  ? (lang === 'bn'
                      ? `স্বাগতম, ${authFeedback.name || authFeedback.email}`
                      : `Welcome, ${authFeedback.name || authFeedback.email}`)
                  : (lang === 'bn'
                      ? 'আপনার অ্যাকাউন্ট থেকে নিরাপদে লগআউট সম্পন্ন হয়েছে।'
                      : 'You have been safely signed out of your account.')}
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={dismissAuthFeedback}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition shrink-0 cursor-pointer"
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
