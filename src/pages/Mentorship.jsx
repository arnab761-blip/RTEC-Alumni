import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { useScrollLock } from '../utils/useScrollLock.js';
import UserAvatar from '../components/UserAvatar.jsx';
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
  const { alumni, user, lang, submitMentorshipRequest } = useApp();
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('All');
  const [bookingForm, setBookingForm] = useState({
    studentName: user?.name && user.role !== 'guest' ? user.name : '',
    studentEmail: user?.email && user.role !== 'guest' ? user.email : '',
    topic: 'Higher Studies & International Scholarships',
    details: ''
  });

  // Lock background scroll when booking modal is open
  useScrollLock(Boolean(bookingModalOpen && selectedMentor));

  const tracks = [
    {
      titleBn: 'উচ্চশিক্ষা ও স্কলারশিপ',
      titleEn: 'Higher Studies & Scholarships',
      descBn: 'আইইএলটিএস, জিআরই ও বিদেশে আবেদনের পরামর্শ',
      descEn: 'IELTS, GRE & scholarship application tips'
    },
    {
      titleBn: 'মার্চেন্ডাইজিং ও সোর্সিং',
      titleEn: 'Merchandising & Sourcing',
      descBn: 'কস্টিং ও বায়ার কমিউনিকেশন অভিজ্ঞতা',
      descEn: 'Costing, buyer communication & practical tips'
    },
    {
      titleBn: 'মিল ও ফ্যাক্টরি অভিজ্ঞতা',
      titleEn: 'Mill & Factory Life',
      descBn: 'স্পিনিং, উইভিং ও ডাইং ফ্লোরের বাস্তব ধারণা',
      descEn: 'Real insights on spinning, weaving & dyeing floors'
    },
    {
      titleBn: 'সিভি ও ইন্টারভিউ প্রস্তুতি',
      titleEn: 'CV & Interview Prep',
      descBn: 'সিভি ফিডব্যাক ও আন্তরিক ইন্টারভিউ টিপস',
      descEn: 'Friendly CV feedback & interview advice'
    }
  ];

  // Mentors filter (Memoized)
  const mentors = useMemo(() => alumni.filter(a => a.isMentor), [alumni]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    submitMentorshipRequest({
      mentorId: selectedMentor?.id || 'general-desk',
      mentorName: selectedMentor?.name || 'RTEC Career & Mentorship Desk',
      mentorEmail: selectedMentor?.email || '',
      studentName: bookingForm.studentName || user?.name || 'RTEC Student',
      studentEmail: bookingForm.studentEmail || user?.email || '',
      studentBatch: user?.batch || '',
      topic: bookingForm.topic,
      details: bookingForm.details
    });
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModalOpen(false);
      setBookingForm(prev => ({ ...prev, details: '' }));
    }, 2200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-transparent text-[#EDE8DF] py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Banner */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-[#C5A880]/30 p-6 sm:p-10 mb-10 shadow-2xl">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>{lang === 'bn' ? 'স্বেচ্ছাসেবী মেন্টরশিপ • জুনিয়রদের পাশে সিনিয়ররা' : 'VOLUNTARY ALUMNI MENTORSHIP • COMMUNITY SUPPORT'}</span>
            </span>

            <h1 className="text-2xl sm:text-4xl font-serif-regal font-black text-[#FDFBF7] tracking-tight leading-snug">
              {lang === 'bn' ? 'সিনিয়র অ্যালামনাইদের সাথে আন্তরিক মেন্টরশিপ ও পরামর্শ' : 'Friendly Guidance & Mentorship from Senior Alumni'}
            </h1>

            <p className="text-xs sm:text-sm text-[#DCD3C1] mt-2 leading-relaxed font-sans">
              {lang === 'bn'
                ? 'চাকরি, উচ্চশিক্ষা ও টেক্সটাইল ইন্ডাস্ট্রির অভিজ্ঞতা নিয়ে স্বেচ্ছায় জুনিয়রদের পাশে থাকা সিনিয়র অ্যালামনাইদের কাছ থেকে সহজ ও বন্ধুত্বপূর্ণ দিকনির্দেশনা নিন।'
                : 'Connect with friendly senior graduates who volunteer their time to share advice on textile jobs, higher studies, and career growth—no formality needed.'}
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
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif-regal font-bold text-[#FDFBF7]">
              {lang === 'bn' ? `আমাদের স্বেচ্ছাসেবী মেন্টরবৃন্দ (${mentors.length} জন)` : `Volunteer Alumni Mentors (${mentors.length})`}
            </h2>
            <p className="text-xs text-[#A89884] mt-0.5">
              {lang === 'bn'
                ? 'যেকোনো সিনিয়রের সাথে ফ্রি ও সহজ পরামর্শ সেশনের জন্য অনুরোধ পাঠান।'
                : 'Pick a mentor below to request a friendly, free 1-on-1 guidance chat.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedMentor({
                id: 'general-desk',
                name: lang === 'bn' ? 'আরটেক অ্যালামনাই মেন্টরশিপ কমিউনিটি' : 'RTEC Alumni Mentorship Community',
                company: lang === 'bn' ? 'স্বেচ্ছাসেবী অ্যালামনাই নেটওয়ার্ক' : 'Voluntary Alumni Support Network',
                email: ''
              });
              setBookingModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition shrink-0 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>{lang === 'bn' ? 'পরামর্শের অনুরোধ করুন' : 'Ask for Guidance'}</span>
          </button>
        </div>

        {mentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="plaque-elevated rounded-2xl p-6 border border-[#C5A880]/25 flex flex-col justify-between shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <UserAvatar
                      src={mentor.avatar}
                      name={mentor.name}
                      role="alumni"
                      className="w-16 h-16 rounded-2xl border-2 border-emerald-600/40 shadow-sm shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-[#FDFBF7] text-base">
                        {lang === 'bn' ? (mentor.nameBn || mentor.name) : (mentor.name || mentor.nameBn)}
                      </h3>
                      <p className="text-xs text-emerald-800 dark:text-emerald-400 font-bold">{mentor.batch}</p>
                      <p className="text-[11px] text-[#A89884]">{mentor.department}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8F4EC] dark:bg-slate-900/90 border border-[#C5A880]/20 space-y-1 text-xs mb-3">
                    <p className="font-bold text-[#1C1917] dark:text-white truncate">{mentor.role || mentor.designation}</p>
                    <p className="text-emerald-800 dark:text-emerald-300 font-semibold truncate">{mentor.company}</p>
                    <p className="text-stone-600 dark:text-slate-400 text-[11px] font-mono">{mentor.location}</p>
                  </div>

                  {mentor.bio && (
                    <p className="text-xs text-[#292524] dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                      {mentor.bio}
                    </p>
                  )}

                  {mentor.skills && mentor.skills.length > 0 && (
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
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-white" />
                  <span>{lang === 'bn' ? 'ফ্রি সেশনের অনুরোধ করুন' : 'Request a Free Chat'}</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-14 px-4 rounded-3xl plaque-elevated border border-[#C5A880]/25 space-y-3">
            <GraduationCap className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="text-lg font-serif-regal font-bold text-[#0C0A09] dark:text-[#FDFBF7]">
              {lang === 'bn' ? 'অ্যালামনাই মেন্টরশিপ কমিউনিটি উন্মুক্ত' : 'Alumni Mentorship Community is Open'}
            </h3>
            <p className="text-xs sm:text-sm text-[#374151] dark:text-[#DCD3C1] max-w-lg mx-auto leading-relaxed">
              {lang === 'bn'
                ? 'যেকোনো সিনিয়র অ্যালামনাই স্বেচ্ছায় জুনিয়রদের গাইড করতে যুক্ত হতে পারেন। আপনার কোনো প্রশ্ন বা পরামর্শের প্রয়োজন হলে নিচের বাটনে ক্লিক করে এখনই বার্তা পাঠাতে পারেন।'
                : 'Senior graduates who volunteer as mentors appear here. Meanwhile, feel free to send a friendly mentorship request below and our alumni community will connect with you.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedMentor({
                  id: 'general-desk',
                  name: lang === 'bn' ? 'আরটেক অ্যালামনাই মেন্টরশিপ কমিউনিটি' : 'RTEC Alumni Mentorship Community',
                  company: lang === 'bn' ? 'স্বেচ্ছাসেবী অ্যালামনাই নেটওয়ার্ক' : 'Voluntary Alumni Support Network',
                  email: ''
                });
                setBookingModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{lang === 'bn' ? 'পরামর্শের অনুরোধ পাঠান' : 'Send a Mentorship Request'}</span>
            </button>
          </div>
        )}

      </div>

      {/* Booking Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {bookingModalOpen && selectedMentor && (
            <motion.div
              key="mentorship-booking-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) setBookingModalOpen(false);
              }}
            >
              <motion.div
                key="mentorship-booking-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel w-full max-w-md rounded-3xl p-6 border border-[#C5A880]/30 relative overscroll-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 dark:text-slate-400 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#FDFBF7] mb-1">
              {lang === 'bn' ? `${selectedMentor.name}-এর সাথে কথা বলুন` : `Connect with ${selectedMentor.name}`}
            </h3>
            <p className="text-xs text-emerald-800 dark:text-emerald-400 font-bold mb-4">{selectedMentor.company}</p>

            {bookingSuccess ? (
              <div className="p-6 text-center bg-emerald-100 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-500/40 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-bold text-emerald-950 dark:text-white text-sm">
                  {lang === 'bn' ? 'আপনার অনুরোধ পৌঁছে গেছে!' : 'Request Sent!'}
                </h4>
                <p className="text-xs text-emerald-900 dark:text-slate-300">
                  {lang === 'bn'
                    ? 'সিনিয়র মেন্টর সময় মিলিয়ে আপনার ইমেইলে একটি Google Meet লিংক শেয়ার করবেন।'
                    : 'Your mentor will reach out to your email with a Google Meet link when available.'}
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
                    value={bookingForm.studentName}
                    onChange={(e) => setBookingForm({ ...bookingForm, studentName: e.target.value })}
                    placeholder={lang === 'bn' ? 'আপনার পূর্ণ নাম লিখুন' : 'Enter your full name'}
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
                    value={bookingForm.studentEmail}
                    onChange={(e) => setBookingForm({ ...bookingForm, studentEmail: e.target.value })}
                    placeholder="your.email@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] dark:text-slate-300 mb-1">
                    {lang === 'bn' ? 'আলোচনার বিষয় (Topic)' : 'Discussion Topic'}
                  </label>
                  <select
                    value={bookingForm.topic}
                    onChange={(e) => setBookingForm({ ...bookingForm, topic: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Higher Studies & International Scholarships">{lang === 'bn' ? 'উচ্চশিক্ষা ও স্কলারশিপ বিদেশে (Higher Studies)' : 'Higher Studies & International Scholarships'}</option>
                    <option value="Apparel Merchandising & Sourcing Careers">{lang === 'bn' ? 'মার্চেন্ডাইজিং ক্যারিয়ার প্রস্তুতি (Merchandising)' : 'Apparel Merchandising & Sourcing Careers'}</option>
                    <option value="Textile Mills & Manufacturing Operations">{lang === 'bn' ? 'টেক্সটাইল মিলস প্রোডাকশন লিডারশিপ' : 'Textile Mills & Manufacturing Operations'}</option>
                    <option value="CV Review & Mock Interview Preparation">{lang === 'bn' ? 'সিভি রিভিউ ও মক ইন্টারভিউ গাইডলাইন' : 'CV Review & Mock Interview Preparation'}</option>
                    <option value="Others">{lang === 'bn' ? 'অন্যান্য (Others)' : 'Others'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] dark:text-slate-300 mb-1">
                    {lang === 'bn' ? 'কোন বিষয়ে কথা বলতে চান?' : 'How can a senior help you?'}
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={bookingForm.details}
                    onChange={(e) => setBookingForm({ ...bookingForm, details: e.target.value })}
                    placeholder={lang === 'bn' ? 'আপনার প্রশ্ন বা যে বিষয়ে পরামর্শ নিতে চান লিখুন...' : 'Share your questions or what you would like to discuss...'}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow cursor-pointer"
                >
                  {lang === 'bn' ? 'অনুরোধ পাঠান' : 'Send Request'}
                </button>
              </form>
            )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </motion.div>
  );
}
