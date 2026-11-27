import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Coffee,
  UtensilsCrossed,
  Heart,
  Sparkles,
  X,
  CheckCircle2,
  Copy,
  Check,
  CreditCard,
  Smartphone,
  Globe,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useScrollLock } from '../utils/useScrollLock.js';

const TREAT_OPTIONS = {
  coffee: {
    id: 'coffee',
    titleBn: 'কফি অফার করুন',
    titleEn: 'Offer a Coffee',
    subBn: 'এক কাপ গরম কফিতে আমাদের কোডিং ও মেইনটেন্যান্সে উৎসাহ দিন',
    subEn: 'Fuel late-night coding & platform maintenance with a warm cup of coffee',
    unitBdt: 100,
    unitUsd: 2,
    emoji: '☕',
    icon: Coffee,
    badgeBn: 'জনপ্রিয় পছন্দ',
    badgeEn: 'Quick Treat'
  },
  biryani: {
    id: 'biryani',
    titleBn: 'বিরিয়ানি অফার করুন',
    titleEn: 'Offer a Biryani',
    subBn: 'এক প্লেট কাচ্চি/বিরিয়ানি দিয়ে পুরো টিমকে সারপ্রাইজ ট্রিট দিন!',
    subEn: 'Celebrate the platform with a hearty plate of Biryani for the builders!',
    unitBdt: 350,
    unitUsd: 5,
    emoji: '🍛',
    icon: UtensilsCrossed,
    badgeBn: 'স্পেশাল ট্রিট',
    badgeEn: 'Special Treat'
  }
};

const PAYMENT_CHANNELS = [
  {
    id: 'bkash',
    name: 'bKash',
    nameBn: 'বিকাশ (bKash)',
    type: 'mfs',
    labelBn: 'Personal / Send Money',
    labelEn: 'Personal / Send Money',
    account: '01XXX-XXXXXX',
    noteBn: 'রেফারেন্সে লিখুন: RTEC Coffee / Biryani',
    noteEn: 'Reference: RTEC Coffee / Biryani',
    accent: 'border-pink-400/60 bg-pink-50 dark:bg-[#26141C] text-pink-800 dark:text-pink-300'
  },
  {
    id: 'nagad',
    name: 'Nagad',
    nameBn: 'নগদ (Nagad)',
    type: 'mfs',
    labelBn: 'Personal / Send Money',
    labelEn: 'Personal / Send Money',
    account: '01XXX-XXXXXX',
    noteBn: 'রেফারেন্সে লিখুন: RTEC Treat',
    noteEn: 'Reference: RTEC Treat',
    accent: 'border-orange-400/60 bg-orange-50 dark:bg-[#261A12] text-orange-800 dark:text-orange-300'
  },
  {
    id: 'rocket',
    name: 'Rocket',
    nameBn: 'রকেট (Rocket)',
    type: 'mfs',
    labelBn: 'Personal / Send Money',
    labelEn: 'Personal / Send Money',
    account: '01XXX-XXXXXX-X',
    noteBn: 'রেফারেন্সে লিখুন: RTEC',
    noteEn: 'Reference: RTEC',
    accent: 'border-purple-400/60 bg-purple-50 dark:bg-[#1E1426] text-purple-800 dark:text-purple-300'
  },
  {
    id: 'international',
    name: 'International',
    nameBn: 'আন্তর্জাতিক / কার্ড',
    type: 'intl',
    labelBn: 'Outside Bangladesh (Card / Global)',
    labelEn: 'Outside Bangladesh (Card / Global)',
    account: 'arnab.rts761@gmail.com',
    noteBn: 'দেশের বাইরে থেকে পেমেন্ট করতে ইমেইলে যোগাযোগ করুন বা নিচে তথ্য দিন',
    noteEn: 'For international support (Card / PayPal / Wise), reach out or leave a note below',
    accent: 'border-sky-400/60 bg-sky-50 dark:bg-[#131E29] text-sky-800 dark:text-sky-300'
  }
];

export default function SupportTreatModal({ isOpen, initialTreat = 'coffee', onClose }) {
  const { lang, user, submitContactMessage } = useApp();
  const [selectedTreat, setSelectedTreat] = useState(initialTreat || 'coffee');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [senderName, setSenderName] = useState('');
  const [trxId, setTrxId] = useState('');
  const [note, setNote] = useState('');
  const [copiedId, setCopiedId] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useScrollLock(Boolean(isOpen));

  useEffect(() => {
    if (isOpen) {
      setSelectedTreat(initialTreat === 'biryani' ? 'biryani' : 'coffee');
      setIsSubmitted(false);
      setTrxId('');
      setNote('');
      if (user && user.role !== 'guest' && user.name) {
        setSenderName(user.name);
      }
    }
  }, [isOpen, initialTreat, user]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  const activeTreat = TREAT_OPTIONS[selectedTreat] || TREAT_OPTIONS.coffee;
  const activeChannel = PAYMENT_CHANNELS.find((c) => c.id === paymentMethod) || PAYMENT_CHANNELS[0];
  const totalBdt = activeTreat.unitBdt * quantity;
  const totalUsd = activeTreat.unitUsd * quantity;

  const handleCopy = (text, id) => {
    try {
      navigator.clipboard?.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(''), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleSendTreat = (e) => {
    e.preventDefault();
    if (submitContactMessage) {
      submitContactMessage({
        name: senderName.trim() || (lang === 'bn' ? 'শুভাকাঙ্ক্ষী' : 'Supporter'),
        email: user?.email || 'supporter@rtec.edu.bd',
        subject: `Treat Offer: ${quantity}x ${activeTreat.titleEn} (৳${totalBdt} / $${totalUsd}) via ${activeChannel.name}`,
        message: [
          `Treat: ${quantity}x ${activeTreat.titleEn}`,
          `Channel: ${activeChannel.name}`,
          trxId.trim() ? `TrxID / Ref: ${trxId.trim()}` : null,
          note.trim() ? `Note: ${note.trim()}` : null
        ]
          .filter(Boolean)
          .join(' | '),
        source: 'support-treat'
      });
    }

    confetti({
      particleCount: selectedTreat === 'biryani' ? 110 : 75,
      spread: 75,
      origin: { y: 0.6 }
    });
    setIsSubmitted(true);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="support-treat-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto overscroll-contain"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose?.();
          }}
        >
          <motion.div
            key="support-treat-card"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#181715] border border-amber-300/70 dark:border-[#C5A880]/40 p-6 sm:p-7 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto overscroll-contain text-[#0C0A09] dark:text-[#FDFBF7]"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 dark:bg-[#25221E] text-stone-700 dark:text-[#EDE8DF] hover:bg-stone-200 dark:hover:bg-[#332E28] transition cursor-pointer"
              aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-[#C5A880]/20 mb-5">
              <motion.div
                animate={{ rotate: [0, -6, 6, 0], scale: [1, 1.06, 1] }}
                transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.5 }}
                className="w-12 h-12 aspect-square shrink-0 rounded-2xl bg-gradient-to-br from-amber-500 to-[#BD452F] text-white flex items-center justify-center shadow-lg"
              >
                {selectedTreat === 'biryani' ? (
                  <UtensilsCrossed className="w-6 h-6 text-white keep-white" />
                ) : (
                  <Coffee className="w-6 h-6 text-white keep-white" />
                )}
              </motion.div>
              <div className="min-w-0 pr-6">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono-tech uppercase tracking-wider font-bold text-[#BD452F] dark:text-[#DFCA9E]">
                  <Sparkles className="w-3 h-3" />
                  <span>{lang === 'bn' ? 'প্ল্যাটফর্ম সাপোর্ট ও ট্রিট' : 'SUPPORT THE PLATFORM'}</span>
                </span>
                <h3 className="text-lg sm:text-xl font-serif-regal font-black text-[#0C0A09] dark:text-[#FDFBF7] leading-tight mt-0.5">
                  {lang === 'bn' ? 'কফি বা বিরিয়ানি অফার করুন' : 'Offer a Coffee or Biryani'}
                </h3>
              </div>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 px-4 text-center space-y-4 rounded-2xl bg-emerald-50 dark:bg-[#13201B] border border-emerald-300 dark:border-emerald-500/35"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg"
                >
                  <CheckCircle2 className="w-8 h-8 text-white keep-white" />
                </motion.div>
                <div className="space-y-1.5">
                  <h4 className="text-lg font-serif-regal font-black text-emerald-950 dark:text-white">
                    {lang === 'bn'
                      ? `ধন্যবাদ! আপনার ${quantity}x ${activeTreat.titleBn} গ্রহণ করা হয়েছে`
                      : `Thank You for the ${quantity}x ${activeTreat.titleEn}!`}
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-200 max-w-sm mx-auto leading-relaxed">
                    {lang === 'bn'
                      ? 'আপনার ভালোবাসা ও অনুপ্রেরণা আমাদের RTEC Alumni ওয়েবসাইটকে আরও সুন্দর ও সমৃদ্ধ রাখতে সাহায্য করবে।'
                      : 'Your generosity helps keep the RTEC Alumni platform running smoothly for everyone.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  {lang === 'bn' ? 'সম্পন্ন করুন' : 'Done'}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSendTreat} className="space-y-4">
                {/* Treat Selector */}
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(TREAT_OPTIONS).map((item) => {
                    const isSelected = selectedTreat === item.id;
                    const IconComp = item.icon;
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedTreat(item.id)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? 'border-[#BD452F] bg-amber-50/90 dark:bg-[#251D17] shadow-md'
                            : 'border-[#C5A880]/30 bg-stone-50 dark:bg-[#141311] hover:border-[#C5A880]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-xl">{item.emoji}</span>
                          <span className={`text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-[#BD452F] text-white keep-white'
                              : 'bg-stone-200 dark:bg-[#201E1A] text-stone-700 dark:text-[#DFCA9E]'
                          }`}>
                            ৳{item.unitBdt} / ${item.unitUsd}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <IconComp className="w-3.5 h-3.5 text-[#BD452F] dark:text-[#DFCA9E] shrink-0" />
                          <span className="font-bold text-xs sm:text-sm text-[#0C0A09] dark:text-[#FDFBF7]">
                            {lang === 'bn' ? item.titleBn : item.titleEn}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Quantity & Total Bar */}
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#141311] border border-[#C5A880]/25 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#44403C] dark:text-[#DCD3C1] mr-1">
                      {lang === 'bn' ? 'সংখ্যা:' : 'Qty:'}
                    </span>
                    {[1, 2, 3, 5].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQuantity(q)}
                        className={`w-8 h-8 rounded-lg text-xs font-mono-tech font-bold transition cursor-pointer ${
                          quantity === q
                            ? 'bg-[#BD452F] text-white keep-white shadow-sm'
                            : 'bg-white dark:bg-[#1E1C18] text-[#1C1917] dark:text-[#EDE8DF] border border-[#C5A880]/30 hover:border-[#BD452F]'
                        }`}
                      >
                        {q}x
                      </button>
                    ))}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono-tech uppercase text-[#57534E] dark:text-[#A89884] block">
                      {lang === 'bn' ? 'মোট পরিমাণ' : 'Total Treat'}
                    </span>
                    <strong className="text-sm sm:text-base font-mono-tech font-black text-[#854D0E] dark:text-[#DFCA9E]">
                      ৳{totalBdt} <span className="text-xs font-normal opacity-75">(${totalUsd})</span>
                    </strong>
                  </div>
                </div>

                {/* Payment Method Selector (Local BD & International) */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-[#1C1917] dark:text-[#FDFBF7]">
                    {lang === 'bn' ? 'পেমেন্ট মাধ্যম নির্বাচন করুন (দেশীয় ও আন্তর্জাতিক):' : 'Choose Payment Method (Local & International):'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PAYMENT_CHANNELS.map((ch) => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setPaymentMethod(ch.id)}
                        className={`px-2.5 py-2 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          paymentMethod === ch.id
                            ? 'bg-[#1C1917] text-white dark:bg-[#C5A880] dark:text-[#121110] border-transparent shadow-md'
                            : 'bg-white dark:bg-[#141311] text-[#374151] dark:text-[#DCD3C1] border-[#C5A880]/30 hover:border-[#854D0E]'
                        }`}
                      >
                        {ch.type === 'intl' ? <Globe className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                        <span>{ch.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Selected Channel Account Info Box */}
                  <div className={`p-3.5 rounded-2xl border space-y-1.5 ${activeChannel.accent}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 shrink-0" />
                        <span>{lang === 'bn' ? activeChannel.nameBn : activeChannel.name} • {lang === 'bn' ? activeChannel.labelBn : activeChannel.labelEn}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 bg-white/80 dark:bg-black/25 px-3 py-2 rounded-xl border border-black/10 dark:border-white/10">
                      <span className="font-mono-tech font-bold text-xs sm:text-sm select-all">
                        {activeChannel.account}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeChannel.account, activeChannel.id)}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E1C18] border border-black/15 dark:border-white/15 text-[11px] font-bold flex items-center gap-1 hover:bg-stone-100 dark:hover:bg-[#2A2722] transition cursor-pointer shrink-0 text-[#0C0A09] dark:text-[#FDFBF7]"
                      >
                        {copiedId === activeChannel.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{lang === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{lang === 'bn' ? 'কপি' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] opacity-90 font-medium">
                      {lang === 'bn' ? activeChannel.noteBn : activeChannel.noteEn}
                    </p>
                  </div>
                </div>

                {/* Optional Supporter Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#44403C] dark:text-[#A89884] mb-1">
                      {lang === 'bn' ? 'আপনার নাম' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder={lang === 'bn' ? 'আপনার নাম লিখুন' : 'Your name'}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#BD452F]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#44403C] dark:text-[#A89884] mb-1">
                      {lang === 'bn' ? 'TrxID / রেফারেন্স (ঐচ্ছিক)' : 'Transaction ID / Ref (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. 9K7A2B..."
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-[#141311] border border-[#C5A880]/30 text-xs font-mono-tech text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#BD452F]"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={lang === 'bn' ? 'ছোট কোনো শুভেচ্ছা বার্তা (ঐচ্ছিক)...' : 'Leave a short cheer or note (optional)...'}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#BD452F]"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#BD452F] to-amber-600 hover:from-[#9C3320] hover:to-amber-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-white keep-white fill-current" />
                  <span>
                    {lang === 'bn'
                      ? `${quantity}x ${activeTreat.titleBn} নিশ্চিত করুন (৳${totalBdt})`
                      : `Confirm ${quantity}x ${activeTreat.titleEn} (৳${totalBdt} / $${totalUsd})`}
                  </span>
                  <Send className="w-3.5 h-3.5 text-white keep-white" />
                </motion.button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
