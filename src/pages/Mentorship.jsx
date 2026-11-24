import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext.jsx';
import { useScrollLock } from '../utils/useScrollLock.js';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  X,
  MessageSquare,
  Globe,
  Briefcase,
  Award,
  ChevronRight
} from 'lucide-react';

export default function Mentorship() {
  const { alumni, user, lang } = useApp();
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('All');

  // Lock background scroll when booking modal is open
  useScrollLock(Boolean(bookingModalOpen && selectedMentor));

  const tracks = [
    {
      titleBn: 'উচ্চশিক্ষা ও স্কলারশিপ',
      titleEn: 'Higher Studies & Scholarships',
      descBn: 'আইইএলটিএস, জিআরই ও ফান্ডিং',
      descEn: 'IELTS, GRE & global graduate funding'
    },
    {
      titleBn: 'মার্চেন্ডাইজিং ট্রেইনিং',
      titleEn: 'Merchandising & Sourcing',
      descBn: 'কস্টিং ও আন্তর্জাতিক বায়ার ডিল',
      descEn: 'Costing, compliance & buyer negotiations'
    },
    {
      titleBn: 'ফ্যাক্টরি অপারেশন',
      titleEn: 'Plant & Mill Leadership',
      descBn: 'স্পিনিং, ডাইং ও ফিনিশিং প্ল্যান্ট',
      descEn: 'Spinning, weaving & wet processing plants'
    },
    {
      titleBn: 'সিভি ও ইন্টারভিউ গাইড',
      titleEn: 'Career & Interview Prep',
      descBn: 'অন-স্পট মক ইন্টারভিউ প্রস্তুতি',
      descEn: 'CV reviews & mock panel interview mastery'
    }
  ];

  // Mentors filter
  const mentors = alumni.filter(a => a.isMentor);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModalOpen(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-transparent text-[#EDE8DF] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Banner */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-[#C5A880]/30 p-6 sm:p-10 mb-10 shadow-2xl">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>{lang === 'bn' ? 'ক্যারিয়ার গাইডলাইন • মেন্টরশিপ প্রোগ্রাম' : 'CAREER GUIDELINES • SENIOR MENTORSHIP'}</span>
            </span>

            <h1 className="text-2xl sm:text-4xl font-serif-regal font-black text-[#FDFBF7] tracking-tight leading-snug">
              {lang === 'bn' ? 'অভিজ্ঞ অ্যালামনাইদের সাথে সরাসরি মেন্টরশিপ' : 'Direct 1-on-1 Mentorship with Senior Alumni'}
            </h1>

            <p className="text-xs sm:text-sm text-[#DCD3C1] mt-2 leading-relaxed font-sans">
              {lang === 'bn'
                ? 'টেক্সটাইল শিল্পের শীর্ষস্থানীয় বিশেষজ্ঞ, গবেষক এবং বহুজাতিক প্রতিষ্ঠানের সিনিয়র প্রাক্তন প্রকৌশলীদের কাছ থেকে ক্যারিয়ার ও উচ্চশিক্ষার দিকনির্দেশনা নিন।'
                : 'Receive personalized guidance on industrial manufacturing, global merchandising, academic research, and international higher studies from experienced graduates.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {tracks.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-[#C5A880]/25 shadow-sm">
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    {lang === 'bn' ? item.titleBn : item.titleEn}
                  </h4>
                  <p className="text-[10px] text-stone-600 dark:text-slate-400 mt-0.5 font-medium">
                    {lang === 'bn' ? item.descBn : item.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-serif-regal font-bold text-[#FDFBF7]">
            {lang === 'bn' ? `আমাদের সম্মানিত মেন্টরবৃন্দ (${mentors.length} জন)` : `Distinguished Mentors (${mentors.length})`}
          </h2>
          <p className="text-xs text-[#A89884] mt-0.5">
            {lang === 'bn'
              ? 'যেকোনো মেন্টরের সাথে ফ্রী ১-অন-১ সেশন বুকিং করতে ক্লিক করুন।'
              : 'Click on any mentor profile below to schedule a complimentary one-on-one session.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="plaque-elevated rounded-2xl p-6 border border-[#C5A880]/25 flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600/40 shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-[#FDFBF7] text-base">{mentor.name}</h3>
                    <p className="text-xs text-emerald-800 dark:text-emerald-400 font-bold">{mentor.batch}</p>
                    <p className="text-[11px] text-[#A89884]">{mentor.department}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F8F4EC] dark:bg-slate-900/90 border border-[#C5A880]/20 space-y-1 text-xs mb-3">
                  <p className="font-bold text-[#1C1917] dark:text-white truncate">{mentor.role}</p>
                  <p className="text-emerald-800 dark:text-emerald-300 font-semibold truncate">{mentor.company}</p>
                  <p className="text-stone-600 dark:text-slate-400 text-[11px] font-mono">{mentor.location}</p>
                </div>

                <p className="text-xs text-[#292524] dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                  {mentor.bio}
                </p>

                {mentor.skills && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {mentor.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedMentor(mentor);
                  setBookingModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>{lang === 'bn' ? 'মেন্টরশিপ সেশন বুক করুন (ফ্রী)' : 'Book Mentorship Session (Free Slot)'}</span>
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* Booking Modal */}
      {bookingModalOpen && selectedMentor && typeof document !== 'undefined' && createPortal(
        <div
          data-lenis-prevent="true"
          data-modal-open="true"
          className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overscroll-contain"
          onClick={(e) => {
            if (e.target === e.currentTarget) setBookingModalOpen(false);
          }}
        >
          <div
            data-lenis-prevent="true"
            className="glass-panel w-full max-w-md rounded-3xl p-6 border border-[#C5A880]/30 relative overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 dark:text-slate-400 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#FDFBF7] mb-1">
              {lang === 'bn' ? `${selectedMentor.name}-এর সাথে সেশন বুকিং` : `Book Session with ${selectedMentor.name}`}
            </h3>
            <p className="text-xs text-emerald-800 dark:text-emerald-400 font-bold mb-4">{selectedMentor.company}</p>

            {bookingSuccess ? (
              <div className="p-6 text-center bg-emerald-100 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-500/40 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-bold text-emerald-950 dark:text-white text-sm">
                  {lang === 'bn' ? 'সেশন রিকোয়েস্ট নিশ্চিত হয়েছে!' : 'Mentorship Request Confirmed!'}
                </h4>
                <p className="text-xs text-emerald-900 dark:text-slate-300">
                  {lang === 'bn'
                    ? 'মেন্টর মহোদয় আপনার দেওয়া ইমেইলে গুগল মিট (Google Meet) লিংক পাঠিয়ে দেবেন।'
                    : 'The mentor will dispatch a Google Meet invitation to your designated email.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] dark:text-slate-300 mb-1">
                    {lang === 'bn' ? 'আপনার নাম' : 'Your Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue={user?.name || ''}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] dark:text-slate-300 mb-1">
                    {lang === 'bn' ? 'ইমেইল (যেখানে মিটিং লিংক যাবে)' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    defaultValue={user?.email || ''}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] dark:text-slate-300 mb-1">
                    {lang === 'bn' ? 'আলোচনার বিষয় (Topic)' : 'Discussion Topic'}
                  </label>
                  <select className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-white focus:outline-none focus:border-emerald-500">
                    <option>{lang === 'bn' ? 'উচ্চশিক্ষা ও স্কলারশিপ বিদেশে (Higher Studies)' : 'Higher Studies & International Scholarships'}</option>
                    <option>{lang === 'bn' ? 'মার্চেন্ডাইজিং ক্যারিয়ার প্রস্তুতি (Merchandising)' : 'Apparel Merchandising & Sourcing Careers'}</option>
                    <option>{lang === 'bn' ? 'টেক্সটাইল মিলস প্রোডাকশন লিডারশিপ' : 'Textile Mills & Manufacturing Operations'}</option>
                    <option>{lang === 'bn' ? 'সিভি রিভিউ ও মক ইন্টারভিউ গাইডলাইন' : 'CV Review & Mock Interview Preparation'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] dark:text-slate-300 mb-1">
                    {lang === 'bn' ? 'আপনার নির্দিষ্ট প্রশ্ন বা লক্ষ্য' : 'Specific Inquiries or Goals'}
                  </label>
                  <textarea
                    rows="3"
                    required
                    placeholder={lang === 'bn' ? 'আপনি ঠিক কোন বিষয়ে পরামর্শ চান...' : 'Describe what guidance you are seeking...'}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow"
                >
                  {lang === 'bn' ? 'সেশন রিকোয়েস্ট পাঠান (Confirm Slot)' : 'Confirm Slot & Send Request'}
                </button>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
