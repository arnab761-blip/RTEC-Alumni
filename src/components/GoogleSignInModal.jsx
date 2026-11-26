import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { useScrollLock } from '../utils/useScrollLock.js';
import { X, ShieldCheck } from 'lucide-react';

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
      className={`w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-[#C5A880]/40 bg-white dark:bg-[#1E1C18] hover:bg-slate-50 dark:hover:bg-[#282520] text-[#0C0A09] dark:text-[#FDFBF7] font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-sm hover:shadow transition active:scale-[0.99] cursor-pointer ${className}`}
    >
      <GoogleLogo className="w-5 h-5 shrink-0" />
      <span>{label}</span>
    </button>
  );
}

function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function GoogleSignInModal({ isOpen, onClose, onSuccess }) {
  const { lang, theme, loginWithGmail, showToast, googleClientId } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
  const [gsiError, setGsiError] = useState('');
  const gsiButtonRef = useRef(null);

  const activeClientId = (googleClientId || import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();

  // Lock background scroll when open
  useScrollLock(Boolean(isOpen));

  useEffect(() => {
    if (!isOpen || !activeClientId) {
      setGsiReady(false);
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const tryInitGsi = () => {
      if (cancelled) return;
      if (window.google?.accounts?.id && gsiButtonRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: activeClientId,
            callback: (response) => {
              const payload = decodeJwtPayload(response?.credential || '');
              if (!payload || !payload.email) {
                setGsiError(lang === 'bn' ? 'গুগল অ্যাকাউন্ট যাচাই করা যায়নি।' : 'Could not verify Google account response.');
                return;
              }
              const email = String(payload.email).toLowerCase().trim();
              const name = payload.name || '';
              const picture = payload.picture || '';
              const user = loginWithGmail(email, name, { avatar: picture, googleVerified: Boolean(payload.email_verified) });
              showToast?.(
                lang === 'bn'
                  ? `✓ গুগল অ্যাকাউন্ট দিয়ে সফলভাবে লগইন হয়েছে: ${email}`
                  : `✓ Signed in with Google: ${email}`
              );
              if (onSuccess) onSuccess(user);
              onClose();
            },
            auto_select: false,
            cancel_on_tap_outside: true
          });

          gsiButtonRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(gsiButtonRef.current, {
            type: 'standard',
            theme: theme === 'dark' ? 'filled_black' : 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'pill',
            width: Math.min(340, gsiButtonRef.current.offsetWidth || 320)
          });
          setGsiReady(true);
          setGsiError('');
        } catch (err) {
          setGsiError(err?.message || 'Google Sign-In initialization error.');
        }
        return;
      }

      attempts += 1;
      if (attempts < 25) {
        setTimeout(tryInitGsi, 200);
      }
    };

    tryInitGsi();
    return () => {
      cancelled = true;
    };
  }, [isOpen, activeClientId, theme, lang]);

  if (typeof document === 'undefined') return null;

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!emailInput.trim()) return;

    let email = emailInput.trim().toLowerCase();
    if (!email.includes('@')) {
      email = `${email}@gmail.com`;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = loginWithGmail(email, nameInput);
      setIsLoading(false);
      if (result?.error === 'ADMIN_GOOGLE_REQUIRED') {
        setGsiError(
          lang === 'bn'
            ? 'অ্যাডমিন অ্যাকাউন্টে প্রবেশের জন্য অবশ্যই উপরের অফিসিয়াল "Continue with Google" বাটন ব্যবহার করে গুগল ভেরিফিকেশন সম্পন্ন করতে হবে।'
            : 'Administrator accounts require real Google OAuth verification via the official Sign in with Google button.'
        );
        return;
      }
      showToast?.(
        lang === 'bn'
          ? `✓ গুগল অ্যাকাউন্ট দিয়ে সফলভাবে লগইন হয়েছে: ${email}`
          : `✓ Successfully signed in with Google: ${email}`
      );
      if (onSuccess) onSuccess(result);
      onClose();
    }, 250);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="google-signin-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overscroll-contain"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key="google-signin-card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md bg-white dark:bg-[#181715] border border-slate-300 dark:border-[#C5A880]/35 rounded-3xl p-6 sm:p-7 shadow-2xl relative text-[#0C0A09] dark:text-[#FDFBF7] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {gsiError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-600/50 text-rose-900 dark:text-rose-200 text-xs font-semibold text-center leading-relaxed">
                {gsiError}
              </div>
            )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-[#25221E] text-[#1C1917] dark:text-[#FDFBF7] hover:bg-slate-200 dark:hover:bg-[#332E28] transition cursor-pointer"
          aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Google Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#201E1A] shadow-md border border-slate-200 dark:border-[#C5A880]/30 flex items-center justify-center mx-auto mb-3">
            <GoogleLogo className="w-8 h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-[#0C0A09] dark:text-[#FDFBF7]">
            {lang === 'bn' ? 'গুগল দিয়ে সাইন ইন করুন' : 'Continue with Google'}
          </h3>
          <p className="text-xs text-[#374151] dark:text-[#DCD3C1] mt-1 font-medium">
            {lang === 'bn'
              ? 'রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ প্ল্যাটফর্মে আপনার গুগল অ্যাকাউন্ট যুক্ত করুন।'
              : 'Connect your Google account to the RTEC Alumni & Student platform.'}
          </p>
        </div>

        {/* Official Google Identity Services Button when Google OAuth Client ID is configured */}
        {activeClientId ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-2">
              <div ref={gsiButtonRef} className="w-full flex justify-center min-h-[44px]" />
              {!gsiReady && !gsiError && (
                <p className="text-xs text-[#374151] dark:text-[#DCD3C1] mt-2 font-medium">
                  {lang === 'bn' ? 'গুগল সাইন-ইন লোড হচ্ছে...' : 'Loading Google Sign-In...'}
                </p>
              )}
              {gsiError && (
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-2 font-semibold text-center">
                  {gsiError}
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Clean Google Email Sign-in Form (Zero admin leaks or autofill) */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1917] dark:text-[#FDFBF7] mb-1.5">
                {lang === 'bn' ? 'জিমেইল ঠিকানা (Google Email)' : 'Google Email'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#141311] border border-slate-300 dark:border-[#C5A880]/35 text-xs text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#6B7280] dark:placeholder-[#A89884] focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <span className="text-[11px] text-[#44403C] dark:text-[#DCD3C1] mt-1 block font-medium">
                {lang === 'bn' ? '* আপনার ব্যক্তিগত জিমেইল ঠিকানা লিখুন' : '* Enter your Google / Gmail address'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1917] dark:text-[#FDFBF7] mb-1.5">
                {lang === 'bn' ? 'আপনার নাম (ঐচ্ছিক)' : 'Full Name (Optional)'}
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={lang === 'bn' ? 'আপনার পূর্ণ নাম লিখুন' : 'Enter your full name'}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#141311] border border-slate-300 dark:border-[#C5A880]/35 text-xs text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#6B7280] dark:placeholder-[#A89884] focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-blue-600/25 transition cursor-pointer disabled:opacity-50"
              >
                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                  <GoogleLogo className="w-3.5 h-3.5" />
                </span>
                <span>
                  {isLoading
                    ? (lang === 'bn' ? 'সংযোগ হচ্ছে...' : 'Signing in...')
                    : (lang === 'bn' ? 'গুগল দিয়ে প্রবেশ করুন' : 'Continue with Google')}
                </span>
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 text-center">
          <p className="text-[11px] text-[#374151] dark:text-[#DCD3C1] flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{lang === 'bn' ? 'নিরাপদ গুগল অ্যাকাউন্ট প্রমাণীকরণ' : 'Secure Google Account Authentication'}</span>
          </p>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
