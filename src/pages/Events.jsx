import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { useScrollLock } from '../utils/useScrollLock.js';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  CheckCircle2,
  X,
  Sparkles,
  ChevronRight,
  Share2,
  ArrowRight,
  Layers,
  Award
} from 'lucide-react';

export default function Events() {
  const { events, registerForEvent, user, lang } = useApp();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  // Lock background scroll when registration modal is open
  useScrollLock(Boolean(registerModalOpen && selectedEvent));

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    batch: user?.batch || '1st Batch (2018-19)',
    email: user?.email || '',
    phone: '',
    guests: '0',
    tshirt: 'L'
  });

  // Countdown timer for flagship Grand Reunion
  const targetDate = new Date('2026-12-25T09:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!selectedEvent) return;
    registerForEvent(selectedEvent.id, formData);
    setRegisteredSuccess(true);
    setTimeout(() => {
      setRegisteredSuccess(false);
      setRegisterModalOpen(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen text-[#EDE8DF] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Archival Header */}
        <div className="mb-8 pb-6 border-b border-[#C5A880]/20">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-tech text-[#A89884] uppercase mb-2">
            <span className="text-[#DE644E]">OFFICIAL EVENT PASSES & CONVOCATIONS</span>
            <span>RTEC PIRGANJ • CONCLAVE REGISTER</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-regal font-black text-[#FDFBF7] tracking-tight">
            {lang === 'bn' ? 'আরটেক ইভেন্ট টিকেট ও সম্মেলন তালিকা' : 'Official Event Passes & Conclaves'}
          </h1>
          <p className="text-xs sm:text-sm text-[#DCD3C1] mt-2 max-w-3xl font-sans leading-relaxed">
            {lang === 'bn'
              ? 'বার্ষিক অ্যালামনাই পুনর্মিলনী, টেক্সটাইল সামিট, ইন্ডাস্ট্রিয়াল কনক্লেভ ও টেকনিক্যাল সেমিনারের অফিশিয়াল টিকিট সংগ্রহ ও অনলাইন আসন সংরক্ষণ করুন।'
              : 'Secure official admission passes and RSVP for flagship convocations, industrial summits, and student seminars.'}
          </p>
        </div>

        {/* Flagship Countdown Hero: Master Invitation Pass */}
        <div className="ticket-pass rounded-2xl overflow-hidden plaque-espresso border border-[#C5A880]/35 p-6 sm:p-10 mb-12 shadow-2xl relative">
          
          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#BD452F]/20 text-[#DE644E] text-[11px] font-mono-tech border border-[#BD452F]/40 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#DE644E]" />
              <span>{lang === 'bn' ? 'কাউন্টডাউন টাইমার • লাইভ' : 'FLAGSHIP GALA COUNTDOWN'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif-regal font-extrabold text-[#FDFBF7] leading-tight">
              {lang === 'bn'
                ? '১ম গ্র্যান্ড আরটেক অ্যালামনাই পুনর্মিলনী ২০২৬'
                : '1st Grand RTEC Alumni Reunion Gala 2026'}
            </h2>
            
            <p className="text-xs sm:text-sm text-[#DCD3C1] font-sans leading-relaxed max-w-2xl">
              {lang === 'bn'
                ? 'সকল ৮টি ব্যাচের (১ম হতে ৮ম ব্যাচ) প্রাক্তন ও বর্তমান প্রকৌশলী, সম্মানিত শিক্ষকবৃন্দ ও অতিথিবৃন্দের স্মরণীয় মিলনমেলা। ২৫ ডিসেম্বর ২০২৬, আরটেক সেন্ট্রাল ক্যাম্পাস, পীরগঞ্জ, রংপুর।'
                : 'Uniting 8 cohorts of distinguished textile engineers, faculty scholars, and patrons for an unforgettable evening at RTEC central campus, Pirganj.'}
            </p>

            {/* Architectural Countdown Boxes */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-2 max-w-md font-mono-tech">
              {[
                { label: lang === 'bn' ? 'দিন (DAYS)' : 'DAYS', val: timeLeft.days },
                { label: lang === 'bn' ? 'ঘণ্টা (HRS)' : 'HOURS', val: timeLeft.hours },
                { label: lang === 'bn' ? 'মিনিট (MIN)' : 'MINS', val: timeLeft.minutes },
                { label: lang === 'bn' ? 'সেকেন্ড (SEC)' : 'SECS', val: timeLeft.seconds }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#141311] border border-[#C5A880]/20 text-center">
                  <span className="block text-xl sm:text-3xl font-black text-[#DFCA9E] font-serif-regal">
                    {String(item.val).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-[#A89884] block mt-0.5">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setSelectedEvent(events[0]);
                  setRegisterModalOpen(true);
                }}
                className="btn-agency btn-agency-terracotta px-6 py-3 rounded text-xs sm:text-sm font-sans uppercase tracking-wider"
              >
                <Ticket className="w-4 h-4" />
                <span>{lang === 'bn' ? 'গালা টিকিট সংরক্ষণ করুন (RSVP)' : 'Reserve Gala Pass Now'}</span>
              </button>

              <span className="text-xs font-mono-tech text-[#A89884]">
                {lang === 'bn' ? 'টিকেট ফি: ৳ ১,০০০ (গালা ডিনার ও গিফট হ্যাম্পার সহ)' : 'Fee: ৳ 1,000 (Includes Gala Dinner & Kit)'}
              </span>
            </div>
          </div>

        </div>

        {/* Section Heading */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono-tech text-[#DFCA9E] uppercase tracking-wider block">
              SCHEDULED CONFERENCES & MEETS
            </span>
            <h2 className="text-xl sm:text-2xl font-serif-regal font-bold text-[#FDFBF7] mt-0.5">
              {lang === 'bn' ? 'সকল অনুমোদিত ইভেন্ট ও টিকেট' : 'Upcoming Conclaves & Event Passes'}
            </h2>
          </div>
          <span className="text-xs font-mono-tech text-[#A89884]">
            TOTAL: {events.length} SESSIONS
          </span>
        </div>

        {/* Authentic Perforated Admission Tickets Grid */}
        <div className="space-y-6">
          {events.map((evt, idx) => (
            <div
              key={evt.id}
              className="ticket-pass rounded-2xl overflow-hidden plaque-espresso border border-[#C5A880]/25 hover:border-[#C5A880]/60 transition-all shadow-xl relative"
            >
              
              {/* Notches on Desktop */}
              <div className="ticket-notch-top hidden lg:block" style={{ right: '28%' }} />
              <div className="ticket-notch-bottom hidden lg:block" style={{ right: '28%' }} />

              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-dashed divide-[#C5A880]/25">
                
                {/* Left Pass Body (8 Cols) */}
                <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                  
                  <div>
                    {/* Header bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#C5A880]/15 text-[10px] font-mono-tech text-[#A89884]">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#141311] text-[#DFCA9E] font-bold border border-[#C5A880]/20">
                          {evt.category}
                        </span>
                        <span>PASS ID: RTEC-EVT-{(idx + 1).toString().padStart(3, '0')}</span>
                      </div>
                      <span className="text-[#DE644E] font-bold">
                        {lang === 'bn' ? `ফি: ${evt.registrationFee}` : `FEE: ${evt.registrationFee}`}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="mt-4">
                      <h3 className="font-serif-regal font-bold text-xl sm:text-2xl text-[#FDFBF7] leading-snug">
                        {lang === 'bn' ? evt.titleBn || evt.title : evt.title}
                      </h3>
                      <p className="text-xs text-[#DCD3C1] mt-2 leading-relaxed font-sans">
                        {lang === 'bn' ? evt.descriptionBn : evt.descriptionEn || evt.descriptionBn}
                      </p>
                    </div>

                    {/* Event Logistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs font-mono-tech">
                      <div className="flex items-center gap-2 text-[#EDE8DF]">
                        <Calendar className="w-3.5 h-3.5 text-[#DFCA9E] shrink-0" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#EDE8DF]">
                        <Clock className="w-3.5 h-3.5 text-[#DFCA9E] shrink-0" />
                        <span>{evt.time || '10:00 AM'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#EDE8DF]">
                        <MapPin className="w-3.5 h-3.5 text-[#DE644E] shrink-0" />
                        <span className="truncate">{evt.venueBn || evt.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Seat Booking Progress */}
                  <div className="pt-3 border-t border-[#C5A880]/15 space-y-1.5 font-mono-tech">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#A89884]">
                        SEATS RESERVED: <strong className="text-[#DFCA9E]">{evt.seatsRegistered}</strong> / {evt.seatsTotal}
                      </span>
                      <span className="text-[#DE644E]">
                        {Math.round(((evt.seatsRegistered || 0) / evt.seatsTotal) * 100)}% OCCUPIED
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#141311] overflow-hidden border border-[#C5A880]/15">
                      <div
                        className="h-full bg-gradient-to-r from-[#BD452F] to-[#DFCA9E] rounded-full"
                        style={{ width: `${Math.min(100, ((evt.seatsRegistered || 0) / evt.seatsTotal) * 100)}%` }}
                      />
                    </div>
                  </div>

                </div>

                {/* Right Tear-off Stub (4 Cols) */}
                <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-[#161513]/80 space-y-6">
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[9px] font-mono-tech text-[#A89884] uppercase">
                      <span>ADMIT ONE</span>
                      <span>TEAR-OFF NOTCH</span>
                    </div>

                    <div className="p-3.5 rounded bg-[#121110] border border-[#C5A880]/20 space-y-1.5">
                      <span className="text-[9px] font-mono-tech uppercase text-[#A89884] block">
                        ACCESS LEVEL
                      </span>
                      <span className="font-serif-regal font-bold text-base text-[#DFCA9E] block">
                        CONFIRMED DELEGATE
                      </span>
                      <span className="text-[10px] text-[#A89884] font-mono-tech block">
                        {lang === 'bn' ? 'সেন্ট্রাল ক্যাম্পাস, পীরগঞ্জ' : 'Pirganj Campus Auditorium'}
                      </span>
                    </div>
                  </div>

                  {/* Barcode & Button */}
                  <div className="space-y-3">
                    <div className="w-full h-10 barcode-lines rounded-sm opacity-80" />
                    
                    <button
                      onClick={() => {
                        setSelectedEvent(evt);
                        setRegisterModalOpen(true);
                      }}
                      className="btn-agency btn-agency-terracotta w-full py-2.5 rounded text-xs font-sans uppercase tracking-wider"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'টিকেট বুক করুন' : 'Reserve Pass'}</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Online Registration Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {registerModalOpen && selectedEvent && (
            <motion.div 
              key="event-register-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              data-lenis-prevent="true"
              data-modal-open="true"
              className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) setRegisterModalOpen(false);
              }}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                data-lenis-prevent="true"
                className="plaque-elevated w-full max-w-lg rounded-2xl p-6 sm:p-8 border border-[#C5A880]/40 relative shadow-2xl my-auto overscroll-contain"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setRegisterModalOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-lg bg-[#141311] border border-[#C5A880]/25 text-[#A89884] hover:text-[#EDE8DF]"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                <span className="text-[10px] font-mono-tech text-[#DE644E] uppercase tracking-wider block">
                  ADMISSION PASS REGISTRATION
                </span>
                <h3 className="font-serif-regal font-bold text-lg sm:text-xl text-[#FDFBF7] mt-1 mb-1">
                  {selectedEvent.titleBn || selectedEvent.title}
                </h3>
                <p className="text-xs text-[#A89884] mb-6 font-sans">
                  {lang === 'bn' ? 'রেজিস্ট্রেশন নিশ্চিত হলে ডিজিটাল কনফার্মেশন স্লিপ তৈরি হবে।' : 'Fill your details to issue an authentic digital gate pass token.'}
                </p>

                {registeredSuccess ? (
                  <div className="p-8 text-center bg-[#141311] rounded-xl border border-[#C5A880]/40 space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-[#DFCA9E] mx-auto" />
                    <h4 className="font-serif-regal font-bold text-lg text-[#FDFBF7]">
                      {lang === 'bn' ? 'অভিনন্দন! রেজিস্ট্রেশন সফল হয়েছে' : 'Pass Reserved Successfully!'}
                    </h4>
                    <p className="text-xs text-[#DCD3C1] font-mono-tech">
                      TOKEN: <strong className="text-[#DFCA9E]">RTEC-EVT-{Date.now().toString().slice(-6)}</strong>
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4 font-sans">
                    <div>
                      <label className="block text-xs font-mono-tech text-[#A89884] mb-1">
                        {lang === 'bn' ? 'আপনার পূর্ণ নাম' : 'FULL NAME'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono-tech text-[#A89884] mb-1">
                          {lang === 'bn' ? 'ব্যাচ ও সেশন' : 'BATCH / SESSION'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.batch}
                          onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono-tech text-[#A89884] mb-1">
                          {lang === 'bn' ? 'টি-শার্ট সাইজ' : 'T-SHIRT SIZE'}
                        </label>
                        <select
                          value={formData.tshirt}
                          onChange={(e) => setFormData({ ...formData, tshirt: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                        >
                          <option value="M">M (Medium)</option>
                          <option value="L">L (Large)</option>
                          <option value="XL">XL (Extra Large)</option>
                          <option value="XXL">XXL</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono-tech text-[#A89884] mb-1">
                          {lang === 'bn' ? 'ইমেইল' : 'EMAIL'}
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono-tech text-[#A89884] mb-1">
                          {lang === 'bn' ? 'ফোন নম্বর' : 'MOBILE PHONE'}
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+880 1700..."
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded bg-[#141311] border border-[#C5A880]/20 flex items-center justify-between text-xs font-mono-tech">
                      <span className="text-[#A89884]">REGISTRATION PASS FEE:</span>
                      <span className="text-[#DFCA9E] font-bold text-sm">{selectedEvent.registrationFee}</span>
                    </div>

                    <button
                      type="submit"
                      className="btn-agency btn-agency-terracotta w-full py-3 rounded text-xs font-sans uppercase tracking-wider"
                    >
                      {lang === 'bn' ? 'নিবন্ধন নিশ্চিত করুন (Issue Pass)' : 'Confirm & Issue Pass'}
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}
