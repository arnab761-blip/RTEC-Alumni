import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { formatDriveImageUrl } from '../utils/driveImage.js';
import HeroSlider from '../components/HeroSlider.jsx';
import {
  Users,
  GraduationCap,
  Calendar,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Droplets,
  ArrowUpRight,
  Building2,
  MessageSquareQuote,
  HelpCircle,
  Newspaper,
  FileText,
  ExternalLink,
  Spool,
  Shirt
} from 'lucide-react';
import UserAvatar from '../components/UserAvatar.jsx';

function WeaveIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M8 3v18M16 3v18M3 8h18M3 16h18" />
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
    </svg>
  );
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1]
    }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

export default function Home() {
  const { teachers, students, alumni, jobs, forumPosts = [], news = [], lang, user, isAdminEmail } = useApp();
  const isAuthorizedAdmin = Boolean(user?.role === 'admin' && isAdminEmail?.(user?.email));
  const recentNotices = useMemo(() => [...news].reverse().slice(0, 3), [news]);
  const principal = useMemo(() => {
    const list = Array.isArray(teachers) ? teachers : [];
    return list.find((t) => t?.designation?.toLowerCase() === 'principal' || t?.designationBn === 'অধ্যক্ষ') || list[0] || null;
  }, [teachers]);
  const graduatedStudentsCount = useMemo(() => {
    const count = (students || []).filter((s) => {
      const b = String(s?.batch || '').toLowerCase();
      return b.includes('1st') || b.includes('2nd') || b.includes('3rd') || b.includes('১ম') || b.includes('২য়') || b.includes('৩য়');
    }).length;
    return count || 320;
  }, [students]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen text-[#EDE8DF] flex flex-col"
    >
      
      {/* 1. TOP PREMIER CAMPUS BANNER SLIDESHOW (Prominent & Clear) */}
      <HeroSlider />

      {/* 2. INSTITUTIONAL HERO MASTHEAD */}
      <section className="relative pt-8 pb-14 sm:pt-14 sm:pb-20 border-b border-[#C5A880]/15 grid-blueprint bg-transparent w-full max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">

          {/* Asymmetric 60/40 Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left 7 Columns: Editorial Headline & Purpose */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7 space-y-6"
            >
              <motion.div variants={fadeInUp} custom={0}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-rose-50 border border-rose-300 text-rose-900 dark:bg-[#BD452F]/20 dark:border-[#BD452F]/40 dark:text-[#DE644E] text-[11px] font-mono-tech tracking-wider uppercase font-bold shadow-sm">
                  <span>{lang === 'bn' ? 'প্রতিষ্ঠিত ২০১৮' : 'ESTD. 2018'}</span>
                </div>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                custom={1}
                className="text-3xl sm:text-5xl lg:text-6xl font-serif-regal font-extrabold text-[#FDFBF7] tracking-tight leading-[1.12]"
              >
                {lang === 'bn' ? (
                  <>
                    রংপুর টেক্সটাইল{' '}
                    <span className="block italic font-editorial text-[#DFCA9E] font-normal">
                      ইঞ্জিনিয়ারিং কলেজ
                    </span>
                    <span className="block text-2xl sm:text-4xl text-[#C5A880] font-sans font-black mt-2">
                      অ্যালামনাই ও কেন্দ্রীয় প্রাতিষ্ঠানিক রেজিস্ট্রি
                    </span>
                  </>
                ) : (
                  <>
                    Rangpur Textile{' '}
                    <span className="block italic font-editorial text-[#DFCA9E] font-normal">
                      Engineering College
                    </span>
                    <span className="block text-2xl sm:text-4xl text-[#C5A880] font-sans font-black mt-2">
                      Official Alumni & Institutional Archive
                    </span>
                  </>
                )}
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                custom={2}
                className="text-sm sm:text-base text-[#1C1917] dark:text-[#EFE9DC] font-sans leading-relaxed max-w-2xl font-medium"
              >
                {lang === 'bn' ? (
                  <>
                    এটি ৪ বছর মেয়াদী বিএসসি ইন টেক্সটাইল ইঞ্জিনিয়ারিং ডিগ্রি প্রদানকারী বুটেক্স (BUTEX) অধিভুক্ত একটি সরকারি ইঞ্জিনিয়ারিং কলেজ।
                    <span className="block mt-1">
                      প্রতিষ্ঠানটি বস্ত্র অধিদপ্তর (Department of Textiles - DoT), বস্ত্র ও পাট মন্ত্রণালয়ের অধিভুক্ত।
                    </span>
                  </>
                ) : (
                  <>
                    It&apos;s a BUTEX-affiliated public engineering college offering a 4-year B.Sc. in Textile Engineering degree.
                    <span className="block mt-1">
                      It is operated under the Department of Textiles (DoT), Ministry of Textiles and Jute.
                    </span>
                  </>
                )}
              </motion.p>

              {/* Bespoke Agency CTAs with Sliding Hover Fill */}
              <motion.div
                variants={fadeInUp}
                custom={3}
                className="space-y-3 pt-2"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/directory"
                    className="btn-agency px-6 py-3 rounded text-xs sm:text-sm font-sans uppercase tracking-wider"
                  >
                    <Users className="w-4 h-4 text-[#DFCA9E]" />
                    <span>{lang === 'bn' ? 'অ্যালামনাই খুঁজুন' : 'Find Alumni'}</span>
                    <ArrowRight className="w-4 h-4 text-[#DFCA9E]" />
                  </Link>

                  <Link
                    to="/forum"
                    className="btn-agency btn-agency-terracotta px-5 py-3 rounded text-xs sm:text-sm font-sans uppercase tracking-wider"
                  >
                    <MessageSquareQuote className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'সিনিয়র অভিজ্ঞতা বিনিময়' : 'Experience Share & Insights'}</span>
                  </Link>

                  {isAuthorizedAdmin && (
                    <Link
                      to="/admin"
                      className="px-3.5 py-3 rounded bg-[#BD452F]/10 dark:bg-[#BD452F]/20 hover:bg-[#BD452F]/20 dark:hover:bg-[#BD452F]/30 border border-[#BD452F]/40 text-xs text-[#BD452F] dark:text-[#DE644E] transition font-mono-tech flex items-center gap-1.5 font-bold"
                      title={lang === 'bn' ? 'অ্যাডমিনিস্ট্রেটিভ কনসোল' : 'Administrative Console'}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{lang === 'bn' ? 'এডমিন' : 'Admin'}</span>
                    </Link>
                  )}
                </div>

                {/* Direct Student Portal Entry Button */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/student-portal"
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500/40 text-xs sm:text-sm font-bold shadow-md hover:-translate-y-0.5 transition font-sans"
                  >
                    <GraduationCap className="w-4 h-4 shrink-0" />
                    <span>{lang === 'bn' ? 'স্টুডেন্ট পোর্টাল (নিবন্ধন ও আইডি)' : 'Student Portal'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>

              {/* Quick Latest Notice Alert Ticker */}
              {recentNotices[0] && (
                <motion.div
                  variants={fadeInUp}
                  custom={4}
                  className="pt-2 w-full max-w-xl min-w-0"
                >
                  <Link
                    to="/news"
                    className="flex items-center gap-2 sm:gap-2.5 px-3 py-2 rounded-lg bg-white dark:bg-[#1A1916] hover:bg-[#F5EFE6] dark:hover:bg-[#22201A] border border-[#C5A880]/40 dark:border-[#C5A880]/30 text-xs transition group w-full max-w-full min-w-0 shadow-sm"
                  >
                    <span className="px-2 py-0.5 rounded bg-[#BD452F] text-white text-[10px] font-mono-tech uppercase font-bold shrink-0 flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      {lang === 'bn' ? 'সর্বশেষ নোটিশ' : 'LATEST NOTICE'}
                    </span>
                    <span className="text-[#1A1612] dark:text-[#EDE8DF] group-hover:text-[#BD452F] dark:group-hover:text-[#DFCA9E] truncate min-w-0 flex-1 font-sans text-xs font-semibold">
                      {lang === 'bn' ? (recentNotices[0].titleBn || recentNotices[0].title) : (recentNotices[0].title || recentNotices[0].titleBn)}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#BD452F] dark:text-[#DFCA9E] shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              )}
            </motion.div>

            {/* Right 5 Columns: Institute Charter Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="plaque-elevated rounded-xl p-6 border border-[#C5A880]/30 relative overflow-hidden">
                
                <div className="flex items-center justify-between pb-4 border-b border-[#C5A880]/15 text-[10px] font-mono-tech text-[#A89884]">
                  <span className="text-[#DFCA9E]">{lang === 'bn' ? 'প্রতিষ্ঠান চার্টার' : 'INSTITUTE CHARTER'}</span>
                  <span>{lang === 'bn' ? 'বি.এসসি. ইন টেক্সটাইল ইঞ্জিনিয়ারিং' : 'B.SC. TEXTILE ENGINEERING'}</span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono-tech uppercase text-[#A89884] block">
                        {lang === 'bn' ? 'একাডেমিক ব্যাচসমূহ' : 'Academic Batches'}
                      </span>
                      <h4 className="text-base sm:text-lg font-serif-regal font-bold text-[#FDFBF7]">
                        {lang === 'bn' ? '১ম ব্যাচ — ৮ম ব্যাচ' : '1st Batch — 8th Batch'}
                      </h4>
                      <p className="text-xs text-[#A89884] font-mono-tech">
                        {lang === 'bn' ? 'সেশন: ২০১৮-১৯ থেকে ২০২৫-২৬' : 'Sessions: 2018-19 to 2025-26'}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded bg-[#C5A880]/15 text-[#DFCA9E] border border-[#C5A880]/30 text-xs font-mono-tech font-bold">
                      {lang === 'bn' ? '০৮ সেশন' : '08 SESSIONS'}
                    </span>
                  </div>

                  {/* Roman Numeral Batch Grid */}
                  <div className="grid grid-cols-4 gap-1.5 pt-2 font-mono-tech text-center text-xs">
                    {[
                      { num: 'I', sess: '18-19' },
                      { num: 'II', sess: '19-20' },
                      { num: 'III', sess: '20-21' },
                      { num: 'IV', sess: '21-22' },
                      { num: 'V', sess: '22-23' },
                      { num: 'VI', sess: '23-24' },
                      { num: 'VII', sess: '24-25' },
                      { num: 'VIII', sess: '25-26' },
                    ].map((b, idx) => (
                      <div key={idx} className="p-2 rounded bg-[#141311] border border-[#C5A880]/15">
                        <span className="block font-serif-regal font-bold text-[#DFCA9E] text-sm">
                          {b.num}
                        </span>
                        <span className="text-[9px] text-[#A89884] block">
                          '{b.sess}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Registered Records */}
                  <div className="pt-3 border-t border-[#C5A880]/15 space-y-2 text-xs font-sans">
                    <div className="flex items-center justify-between text-[#EDE8DF]">
                      <span className="text-[#A89884]">{lang === 'bn' ? 'নিবন্ধিত অ্যালামনাই:' : 'Verified Alumni:'}</span>
                      <strong className="text-[#DFCA9E] font-mono-tech">
                        {alumni.length} {lang === 'bn' ? 'জন প্রকৌশলী' : 'Engineers'}
                      </strong>
                    </div>
                    <Link
                      to="/teachers"
                      className="flex items-center justify-between text-[#EDE8DF] rounded-md px-2 py-1 -mx-2 hover:bg-[#141311] transition group cursor-pointer"
                      title={lang === 'bn' ? 'বিভাগ ও শিক্ষকমণ্ডলী দেখুন' : 'View Departments & Faculty'}
                    >
                      <span className="text-[#A89884] group-hover:text-[#EDE8DF] transition-colors">
                        {lang === 'bn' ? 'একাডেমিক বিভাগ:' : 'Departments:'}
                      </span>
                      <strong className="text-[#DFCA9E] font-mono-tech inline-flex items-center gap-1 group-hover:underline">
                        <span>{lang === 'bn' ? '৪টি বিভাগ' : '4 Departments'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </strong>
                    </Link>
                    <div className="flex items-center justify-between text-[#EDE8DF]">
                      <span className="text-[#A89884]">{lang === 'bn' ? 'শিক্ষকমণ্ডলী:' : 'Teaching Faculty:'}</span>
                      <strong className="text-[#DFCA9E] font-mono-tech">
                        {teachers.length} {lang === 'bn' ? 'জন শিক্ষক' : 'Teachers'}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-[#EDE8DF]">
                      <span className="text-[#A89884]">{lang === 'bn' ? 'অধ্যয়নরত শিক্ষার্থী:' : 'Enrolled Students:'}</span>
                      <strong className="text-[#DFCA9E] font-mono-tech">
                        {students.length} {lang === 'bn' ? 'জন নিবন্ধিত' : 'Registered'}
                      </strong>
                    </div>
                  </div>

                  {/* Quick Verification Link */}
                  <div className="pt-2">
                    <Link
                      to="/directory"
                      className="w-full py-2 rounded bg-[#141311] hover:bg-[#1E1C18] border border-[#C5A880]/20 text-xs font-mono-tech text-[#DFCA9E] flex items-center justify-center gap-1.5 transition"
                    >
                      <span>{lang === 'bn' ? 'অ্যালামনাই খুঁজুন' : 'Find Alumni'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 3. JOIN THE CENTRAL RTEC ENGINEERING REGISTER (Prominent Top Onboarding CTA) */}
      <section className="py-12 sm:py-16 bg-transparent border-b border-[#C5A880]/15">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <span className="inline-block px-3 py-1 rounded bg-[#C5A880]/15 text-[#DFCA9E] text-[11px] font-mono-tech tracking-wider uppercase border border-[#C5A880]/25">
            {lang === 'bn' ? 'কেন্দ্রীয় অ্যালামনাই নেটওয়ার্ক' : 'CENTRAL ALUMNI NETWORK'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif-regal font-extrabold text-[#FDFBF7]">
            {lang === 'bn'
              ? 'আপনি কি আরটেকের সাবেক বা বর্তমান শিক্ষার্থী?'
              : 'Join the Central RTEC Engineering Register'}
          </h2>
          <p className="text-xs sm:text-sm text-[#DCD3C1] max-w-2xl mx-auto leading-relaxed font-sans">
            {lang === 'bn'
              ? 'আপনার ব্যাচমেটদের সাথে যুক্ত হন, অফিসিয়াল ডিরেক্টরিতে আপনার বর্তমান পদবী ও কোম্পানির তথ্য আপডেট করুন এবং প্রিয় বিদ্যাপীঠের ভবিষ্যৎ গঠনে ভূমিকা রাখুন।'
              : 'Register your profile, link your current mill or company details, and mentor the next generation of textile engineers.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/auth"
              className="btn-agency btn-agency-terracotta px-6 py-3 rounded text-xs sm:text-sm font-sans uppercase tracking-wider"
            >
              <span>{lang === 'bn' ? 'অ্যালামনাই একাউন্ট রেজিস্টার করুন' : 'Create Alumni Account'}</span>
            </Link>
            <Link
              to="/directory"
              className="btn-agency px-6 py-3 rounded text-xs sm:text-sm font-sans uppercase tracking-wider"
            >
              <span>{lang === 'bn' ? 'ডিরেক্টরি ডাটাবেজ সার্চ' : 'Search Directory'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. RECENT OFFICIAL NOTICES BOARD (Features 3 Latest Published Notices) */}
      <section className="py-12 sm:py-16 border-b border-[#C5A880]/20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-tech text-[#DE644E] uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-[#DE644E] animate-pulse" />
                <Newspaper className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'অফিসিয়াল নোটিশ বোর্ড' : 'OFFICIAL NOTICE BOARD'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-regal font-bold text-[#FDFBF7]">
                {lang === 'bn' ? 'সাম্প্রতিক প্রাতিষ্ঠানিক নোটিশসমূহ' : 'Recent Official Notices & Circulars'}
              </h2>
              <p className="text-xs sm:text-sm text-[#A89884] font-sans mt-1">
                {lang === 'bn'
                  ? 'কলেজ প্রশাসন ও বস্ত্র অধিদপ্তর কর্তৃক প্রকাশিত সর্বশেষ ৩টি নোটিশ, ফলাফল ও নির্দেশনা'
                  : 'Latest 3 academic circulars, exam notices & administrative announcements from RTEC'}
              </p>
            </div>

            <Link
              to="/news"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C5A880]/15 hover:bg-[#C5A880]/25 text-[#DFCA9E] border border-[#C5A880]/35 text-xs font-mono-tech transition group self-start md:self-auto"
            >
              <Newspaper className="w-4 h-4 text-[#DE644E]" />
              <span>{lang === 'bn' ? 'সকল নোটিশ ও সার্কুলার দেখুন' : 'View All Notices & Archive'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 3 Featured Notices Grid */}
          {recentNotices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentNotices.map((notice, idx) => (
                <div
                  key={notice.id || idx}
                  className="plaque-espresso rounded-xl p-5 sm:p-6 border border-[#C5A880]/25 hover:border-[#C5A880]/50 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    {/* Category & Date */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-mono-tech font-bold uppercase tracking-wide bg-[#DE644E]/20 text-[#DE644E] border border-[#DE644E]/30">
                        {lang === 'bn' ? (
                          {
                            'Academic': 'একাডেমিক',
                            'Academic Notice': 'একাডেমিক নোটিশ',
                            'Examination & Results': 'পরীক্ষা ও ফলাফল',
                            'Examination': 'পরীক্ষা',
                            'Admission': 'ভর্তি',
                            'General': 'সাধারণ',
                            'General Notice': 'সাধারণ নোটিশ',
                            'Holiday': 'ছুটি',
                            'Career & Placement': 'ক্যারিয়ার',
                            'Urgent Notice': 'জরুরি নোটিশ',
                            'Notice': 'নোটিশ',
                            'Achievement': 'অর্জন',
                            'Spotlight': 'স্পটলাইট',
                            'Campus': 'ক্যাম্পাস'
                          }[notice.category] || notice.category || 'নোটিশ'
                        ) : (notice.category || 'Notice')}
                      </span>
                      <span className="text-[11px] font-mono-tech text-[#A89884] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#C5A880]" />
                        <span>{notice.date}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif-regal font-bold text-base sm:text-lg text-[#FDFBF7] group-hover:text-[#DFCA9E] transition-colors leading-snug line-clamp-2">
                      {lang === 'bn' ? (notice.titleBn || notice.title) : (notice.title || notice.titleBn)}
                    </h3>

                    {/* Excerpt / Summary */}
                    <p className="text-xs text-[#DCD3C1] font-sans mt-2.5 line-clamp-3 leading-relaxed">
                      {lang === 'bn'
                        ? (notice.summaryBn || notice.summary || notice.content || notice.description)
                        : (notice.summary || notice.content || notice.description || notice.summaryBn)}
                    </p>

                    {/* PDF / Attachment Action Links */}
                    <div className="mt-4 pt-3 border-t border-[#C5A880]/15 flex flex-wrap gap-2">
                      {notice.pdfUrl && (
                        <a
                          href={notice.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DE644E]/15 hover:bg-[#DE644E]/25 text-[#DE644E] border border-[#DE644E]/40 text-xs font-mono-tech font-bold transition shadow-sm"
                          title={lang === 'bn' ? 'অফিসিয়াল PDF ডাউনলোড বা দেখুন' : 'Download or View PDF'}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'অফিসিয়াল PDF ডাউনলোড' : 'Download PDF'}</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      )}
                      {notice.imageUrl && (
                        <a
                          href={notice.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1A1916] hover:bg-[#22201A] text-[#DFCA9E] border border-[#C5A880]/20 text-xs font-mono-tech transition"
                        >
                          <span>{lang === 'bn' ? 'ছবি দেখুন' : 'View Image'}</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Footer Link */}
                  <div className="mt-5 pt-3 border-t border-[#C5A880]/15 flex items-center justify-between text-xs font-mono-tech">
                    <span className="text-[11px] text-[#A89884]">
                      {lang === 'bn' ? 'আরটেক প্রশাসন' : 'RTEC Admin'}
                    </span>
                    <Link
                      to="/news"
                      className="text-[#DFCA9E] hover:underline flex items-center gap-1 font-sans text-xs font-semibold"
                    >
                      <span>{lang === 'bn' ? 'বিস্তারিত নোটিশ পড়ুন →' : 'Read Full Circular →'}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="plaque-espresso rounded-xl p-6 border border-[#C5A880]/25 text-center">
              <p className="text-xs sm:text-sm text-[#374151] dark:text-[#DCD3C1] font-sans font-medium">
                {lang === 'bn'
                  ? 'কলেজ প্রশাসন থেকে নতুন অফিসিয়াল নোটিশ বা সার্কুলার প্রকাশিত হলে এখানে প্রদর্শিত হবে।'
                  : 'Official academic notices and circulars from RTEC administration will be published here.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. KEY INSTITUTIONAL METRICS CARDS */}
      <section className="py-10 sm:py-14 border-b border-[#C5A880]/20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                num: '08',
                labelBn: 'সফল শিক্ষাবর্ষ ব্যাচ',
                labelEn: 'Academic Batches',
                subBn: '১ম সেশন (২০১৮-১৯) হতে ৮ম সেশন (২০২৫-২৬)',
                subEn: 'From 2018-19 to 2025-26 Session',
                cardClass: 'bg-amber-50/90 dark:bg-[#211C14] border-amber-300/75 dark:border-amber-500/30',
                numClass: 'text-amber-800 dark:text-[#DFCA9E]'
              },
              {
                num: `${graduatedStudentsCount}`,
                labelBn: 'গ্র্যাজুয়েট শিক্ষার্থী',
                labelEn: 'Graduated Students',
                subBn: '১ম, ২য় ও ৩য় ব্যাচের মোট উত্তীর্ণ শিক্ষার্থী',
                subEn: 'Total graduates across 1st, 2nd & 3rd Batches',
                cardClass: 'bg-emerald-50/90 dark:bg-[#13201B] border-emerald-300/75 dark:border-emerald-500/30',
                numClass: 'text-emerald-800 dark:text-emerald-300'
              },
              {
                num: '120',
                labelBn: 'বার্ষিক অনুমোদিত আসন',
                labelEn: 'Approved Annual Seats',
                subBn: '৪টি বিভাগে ৩০টি করে আসন (মোট ১২০টি আসন)',
                subEn: '30 seats per department under BUTEX',
                cardClass: 'bg-rose-50/90 dark:bg-[#231615] border-rose-300/75 dark:border-rose-500/30',
                numClass: 'text-rose-800 dark:text-[#DE644E]'
              },
              {
                num: `${students.length || 834}`,
                labelBn: 'মোট শিক্ষার্থী ও গবেষক',
                labelEn: 'Undergraduate Scholars',
                subBn: 'বস্ত্র অধিদপ্তর (DoT) পরিচালিত কেন্দ্রীয় ভর্তি পরীক্ষার মাধ্যমে মনোনীত',
                subEn: 'Admitted through the Department of Textiles (DoT) admission test',
                cardClass: 'bg-indigo-50/90 dark:bg-[#161924] border-indigo-300/75 dark:border-indigo-500/30',
                numClass: 'text-indigo-800 dark:text-indigo-300'
              }
            ].map((metric, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-5 sm:p-6 border shadow-sm hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between ${metric.cardClass}`}
              >
                <div>
                  <span className={`font-serif-regal text-3xl sm:text-4xl font-black block ${metric.numClass}`}>
                    {metric.num}
                  </span>
                  <h4 className="font-sans font-bold text-sm sm:text-base text-[#0C0A09] dark:text-[#FDFBF7] mt-1.5">
                    {lang === 'bn' ? metric.labelBn : metric.labelEn}
                  </h4>
                </div>
                <p className="text-[11px] text-[#44403C] dark:text-[#A89884] font-mono-tech mt-2.5 leading-relaxed">
                  {lang === 'bn' ? metric.subBn : metric.subEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SENIOR ALUMNI INSIGHTS & EXPERIENCES */}
      <section className="py-14 sm:py-20 border-b border-[#C5A880]/15 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-mono-tech text-[#DE644E] uppercase tracking-widest block">
                {lang === 'bn' ? 'অভিজ্ঞতা ও দিকনির্দেশনা' : 'ALUMNI STORIES & ADVICE'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif-regal font-extrabold text-[#FDFBF7] mt-1">
                {lang === 'bn' ? 'সিনিয়র অ্যালামনাইদের অভিজ্ঞতা ও ক্যারিয়ার গল্প' : 'Senior Alumni Insights & Experiences'}
              </h2>
              <p className="text-xs sm:text-sm text-[#A89884] font-sans mt-1.5 max-w-2xl">
                {lang === 'bn'
                  ? 'চাকরি, টেক্সটাইল মিল লাইফ, উচ্চশিক্ষা ও ক্যারিয়ার বাস্তবতা নিয়ে সিনিয়র গ্র্যাজুয়েট প্রকৌশলীদের শেয়ার করা বাস্তব অভিজ্ঞতা ও দিকনির্দেশনা।'
                  : 'Real-world insights, mill experiences, scholarships, and practical career advice shared by RTEC graduates.'}
              </p>
            </div>
            <Link
              to="/forum"
              className="inline-flex items-center gap-1.5 text-xs font-mono-tech uppercase text-[#DFCA9E] hover:underline shrink-0"
            >
              <span>{lang === 'bn' ? 'সকল অভিজ্ঞতা ও প্রশ্ন দেখুন' : 'View All Insights & Questions'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Grid of Featured Senior Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forumPosts.filter(p => p && p.status !== 'pending' && p.status !== 'declined').slice(0, 3).map((post) => (
              <div
                key={post.id}
                className="plaque-elevated rounded-xl p-6 border border-[#C5A880]/25 flex flex-col justify-between hover:border-[#C5A880]/60 transition-all duration-200 hover:-translate-y-1 group"
              >
                <div>
                  {/* Category and Type Badges */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#C5A880]/15 mb-4 text-[10px] font-mono-tech">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      post.type === 'experience'
                        ? 'bg-[#BD452F]/20 text-[#DE644E] border border-[#BD452F]/30'
                        : 'bg-[#C5A880]/20 text-[#DFCA9E] border border-[#C5A880]/30'
                    }`}>
                      {post.type === 'experience'
                        ? (lang === 'bn' ? 'অভিজ্ঞতা শেয়ার' : 'EXPERIENCE')
                        : (lang === 'bn' ? 'প্রশ্নোত্তর' : 'Q&A THREAD')}
                    </span>
                    <span className="text-[#A89884]">{post.category}</span>
                  </div>

                  {/* Post Title */}
                  <h3 className="font-serif-regal font-bold text-base sm:text-lg text-[#FDFBF7] group-hover:text-[#DFCA9E] transition-colors leading-snug">
                    {lang === 'bn' ? (post.titleBn || post.title) : (post.title || post.titleBn)}
                  </h3>

                  {/* Post Excerpt */}
                  <p className="text-xs text-[#DCD3C1] font-sans mt-2.5 line-clamp-3 leading-relaxed">
                    {post.content || post.body || post.description}
                  </p>

                  {/* Author Credentials */}
                  <div className="mt-5 pt-3 border-t border-[#C5A880]/15 flex items-center gap-3">
                    <UserAvatar
                      src={post.avatar || post.authorAvatar}
                      name={post.author}
                      role={post.authorRole?.toLowerCase()?.includes('alumni') ? 'alumni' : (post.authorRole?.toLowerCase()?.includes('admin') ? 'faculty' : 'student')}
                      className="w-9 h-9 rounded-full border border-[#C5A880]/30"
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-sans font-bold text-[#FDFBF7] truncate">
                        {post.author}
                      </h4>
                      <p className="text-[10px] font-mono-tech text-[#A89884] truncate">
                        {post.authorBatch} • {post.authorRole}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Meta */}
                <div className="mt-5 pt-3 border-t border-[#C5A880]/15 flex items-center justify-between text-xs font-mono-tech">
                  <span className="text-[#DFCA9E] flex items-center gap-1.5">
                    <MessageSquareQuote className="w-3.5 h-3.5 text-[#DE644E]" />
                    <span>{post.replies?.length || 0} {lang === 'bn' ? 'টি উত্তর/মতামত' : 'Responses'}</span>
                  </span>
                  <Link
                    to="/forum"
                    className="text-[#DFCA9E] hover:underline flex items-center gap-1 font-sans text-xs"
                  >
                    <span>{lang === 'bn' ? 'উত্তর পড়ুন →' : 'Read Thread →'}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Quick CTA Banner to Ask a Question or Share Story */}
          <div className="mt-8 plaque-espresso rounded-xl p-5 sm:p-6 border border-[#C5A880]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#1A1916] border border-[#C5A880]/25 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-[#DFCA9E]" />
              </div>
              <div>
                <h4 className="text-sm font-serif-regal font-bold text-[#FDFBF7]">
                  {lang === 'bn' ? 'সিনিয়র গ্র্যাজুয়েট প্রকৌশলীদের কাছে কোনো প্রশ্ন আছে?' : 'Have a Question for Senior Graduate Engineers?'}
                </h4>
                <p className="text-xs text-[#A89884] font-sans">
                  {lang === 'bn'
                    ? 'স্পিনিং, ডাইং, মার্চেন্ডাইজিং বা বিদেশে স্কলারশিপের ব্যাপারে সিনিয়রদের সরাসরি জিজ্ঞাসা করুন।'
                    : 'Post your career questions or share your industry lessons directly with RTEC graduates.'}
                </p>
              </div>
            </div>

            <Link
              to="/forum"
              className="btn-agency btn-agency-terracotta px-5 py-2.5 rounded text-xs font-sans uppercase tracking-wider shrink-0"
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>{lang === 'bn' ? 'প্রশ্ন বা অভিজ্ঞতা পোস্ট করুন' : 'Ask Question / Share Story'}</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 6. OUR LEADERSHIP & TEACHERS */}
      <section className="py-14 sm:py-20 border-b border-[#C5A880]/15 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-8">
            <span className="text-[10px] font-mono-tech uppercase text-[#DE644E] tracking-widest block">
              {lang === 'bn' ? 'প্রশাসন ও শিক্ষকমণ্ডলী' : 'COLLEGE LEADERSHIP & FACULTY'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif-regal font-extrabold text-[#FDFBF7] mt-1">
              {lang === 'bn' ? 'আমাদের নেতৃত্ব ও শিক্ষকমণ্ডলী' : 'Our Leadership & Teachers'}
            </h2>
          </div>

          <div className="plaque-elevated rounded-2xl p-6 sm:p-12 border border-[#C5A880]/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            
            {/* Principal Photo with Corner Brackets */}
            <div className="lg:col-span-4 text-center lg:text-left">
              <div className="relative inline-block w-48 h-48 sm:w-60 sm:h-60 rounded-xl overflow-hidden border border-[#C5A880]/40 shadow-2xl p-1 bg-[#1A1916]">
                <UserAvatar
                  src={principal?.photo}
                  name={principal?.name || 'Principal, RTEC'}
                  role="teacher"
                  className="w-full h-full rounded"
                  iconClassName="w-20 h-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 right-3 text-center px-2 py-1 rounded bg-[#181715]/95 text-[#DFCA9E] text-[11px] font-mono-tech border border-[#C5A880]/30 uppercase">
                  {lang === 'bn' ? 'অধ্যক্ষ' : 'Principal'}
                </span>
              </div>
            </div>

            {/* Inscription Body */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono-tech text-[#DE644E] uppercase">
                <Building2 className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'অধ্যক্ষের বার্তা' : 'Message from the Principal'}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif-regal font-bold text-[#FDFBF7] leading-snug">
                {lang === 'bn'
                  ? '"চতুর্থ শিল্প বিপ্লবের চ্যালেঞ্জ মোকাবিলায় টেকসই ও আধুনিক বস্ত্র প্রকৌশলী তৈরিই আমাদের ব্রত"'
                  : '"Preparing Skilled, Ethical Textile Engineers for the Global Textile Industry"'}
              </h3>

              <p className="text-xs sm:text-sm text-[#DCD3C1] font-sans leading-relaxed">
                {lang === 'bn'
                  ? 'রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ (আরটেক) শুধুমাত্র একটি বিদ্যাপীঠ নয়; এটি উত্তরবঙ্গের শিল্পায়ন ও প্রযুক্তিগত উৎকর্ষের প্রাণকেন্দ্র। ২০১৮-১৯ শিক্ষাবর্ষ থেকে যাত্রা শুরু করে আজ আমাদের গ্র্যাজুয়েটরা আন্তর্জাতিক স্পিনিং, উইভিং, ডাইং ও অ্যাপারেল সেক্টরে নেতৃত্ব দিচ্ছেন। আমাদের সম্মানিত অ্যালামনাইরা ভবিষ্যৎ শিক্ষার্থীদের আলোকবর্তিকা।'
                  : 'Rangpur Textile Engineering College is a center of textile education and innovation in northern Bangladesh. From our founding batch to our current students, RTEC graduates are contributing to sustainable manufacturing and industry leadership worldwide.'}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#C5A880]/20">
                <div>
                  <h4 className="font-serif-regal font-bold text-base text-[#FDFBF7]">
                    {lang === 'bn'
                      ? (principal?.nameBn || 'জনাব ইঞ্জিনিয়ার মোঃ সাইফুর রহমান')
                      : (principal?.name || 'Engr. Md. Saifur Rahman')}
                  </h4>
                  <p className="text-xs text-[#DFCA9E] font-mono-tech">
                    {lang === 'bn'
                      ? 'অধ্যক্ষ, রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ'
                      : 'Principal, Rangpur Textile Engineering College'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/teachers"
                    className="btn-agency px-4 py-2 rounded text-xs font-sans uppercase tracking-wider"
                  >
                    <span>{lang === 'bn' ? 'অনুষদ পরিচিতি' : 'Faculty & Teachers'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#DFCA9E]" />
                  </Link>

                  <Link
                    to="/about"
                    className="px-4 py-2 rounded bg-[#1A1916] hover:bg-[#201E1A] border border-[#C5A880]/25 text-xs text-[#EDE8DF] font-mono-tech transition"
                  >
                    {lang === 'bn' ? 'কলেজের ইতিহাস' : 'Charter & History'}
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 7. 4 TEXTILE ENGINEERING DEPARTMENTS */}
      <section id="departments" className="py-14 sm:py-20 border-b border-[#C5A880]/15 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <span className="text-[10px] font-mono-tech uppercase text-[#DFCA9E] tracking-widest block">
              {lang === 'bn' ? 'একাডেমিক প্রোগ্রাম • ৪টি বিভাগ' : 'ACADEMIC PROGRAMS • 4 DEPARTMENTS'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif-regal font-extrabold text-[#FDFBF7] mt-1">
              {lang === 'bn' ? 'বিশেষায়িত ৪টি বস্ত্র প্রকৌশল বিভাগ' : '4 Textile Engineering Departments'}
            </h2>
            <p className="text-xs sm:text-sm text-[#A89884] font-sans mt-2">
              {lang === 'bn'
                ? 'আধুনিক শিল্পমানের ল্যাবরেটরি, প্র্যাক্টিক্যাল শেড ও আন্তর্জাতিক কারিকুলাম সমৃদ্ধ চার বছর মেয়াদী বি.এসসি. ডিগ্রি।'
                : 'Four-year Bachelor of Science degrees supported by industrial spinning frames, weaving looms, coloration labs, and apparel studios.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                code: 'YE-01',
                seats: lang === 'bn' ? '৩০টি আসন' : '30 Seats',
                titleBn: 'ইয়ার্ন ইঞ্জিনিয়ারিং',
                titleEn: 'Yarn Engineering',
                descBn: 'তুলা ও ম্যান-মেড ফাইবারের স্পিনিং প্রযুক্তি, রিং, রোটর ও কমপ্যাক্ট সুতা উৎপাদন এবং টেক্সটাইল ফাইবার টেস্টিং ল্যাব।',
                descEn: 'Natural and synthetic fiber processing, ring, rotor and air-jet spinning technologies, and fiber testing.',
                icon: Spool,
                accent: 'border-[#BD452F]/40'
              },
              {
                code: 'FE-02',
                seats: lang === 'bn' ? '৩০টি আসন' : '30 Seats',
                titleBn: 'ফ্যাব্রিক ইঞ্জিনিয়ারিং',
                titleEn: 'Fabric Engineering',
                descBn: 'আধুনিক শাটললেস উইভিং লুম, সার্কুলার ও ফ্ল্যাট নিটিং টেকনোলজি এবং ৩ডি ফ্যাব্রিক স্ট্রাকচারাল ডিজাইন।',
                descEn: 'High-speed shuttleless weaving, rapier and air-jet loom operations, knitting, and fabric structural design.',
                icon: WeaveIcon,
                accent: 'border-[#C5A880]/40'
              },
              {
                code: 'WPE-03',
                seats: lang === 'bn' ? '৩০টি আসন' : '30 Seats',
                titleBn: 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং',
                titleEn: 'Wet Process Engineering',
                descBn: 'টেক্সটাইল কালারেশন, ডাইং, রোটারি প্রিন্টিং, ওয়াটার-রেপেলেন্ট ন্যানো ফিনিশিং ও গ্রিন ইটিপি (ETP) প্রযুক্তি।',
                descEn: 'Textile dyeing, pretreatment, rotary screen printing, sustainable finishing chemistry, and effluent treatment.',
                icon: Droplets,
                accent: 'border-[#1E3A2F]/80'
              },
              {
                code: 'AME-04',
                seats: lang === 'bn' ? '৩০টি আসন' : '30 Seats',
                titleBn: 'অ্যাপারেল ম্যানুফ্যাকচারিং',
                titleEn: 'Apparel Manufacturing',
                descBn: 'কম্পিউটারাইজড ক্যাড/ক্যাম প্যাটার্ন স্টুডিও, শিল্পমানের সুইং প্রোডাকশন লাইন ও গ্লোবাল মার্চেন্ডাইজিং।',
                descEn: 'Computerized CAD/CAM pattern design, garment production line management, merchandising, and supply chain.',
                icon: Shirt,
                accent: 'border-[#BD452F]/40'
              }
            ].map((dept, idx) => (
              <div
                key={idx}
                className={`plaque-elevated rounded-xl p-6 border ${dept.accent} flex flex-col justify-between hover:border-[#DFCA9E] transition-all duration-200 hover:-translate-y-1 group`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#C5A880]/15 mb-4">
                    <span className="text-[10px] font-mono-tech text-[#DFCA9E] font-bold">
                      {dept.code}
                    </span>
                    <span className="text-[9px] font-mono-tech uppercase text-[#A89884]">
                      {dept.seats}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#141311] border border-[#C5A880]/20 inline-flex items-center justify-center text-[#DFCA9E] mb-3 group-hover:scale-105 transition-transform">
                    <dept.icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-serif-regal font-bold text-lg text-[#FDFBF7] mb-2">
                    {lang === 'bn' ? dept.titleBn : dept.titleEn}
                  </h3>

                  <p className="text-xs text-[#DCD3C1] font-sans leading-relaxed">
                    {lang === 'bn' ? dept.descBn : dept.descEn}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#C5A880]/15 flex items-center justify-end text-xs font-mono-tech">
                  <Link to="/teachers" className="text-[#DFCA9E] hover:underline flex items-center gap-1">
                    <span>{lang === 'bn' ? 'অনুষদ →' : 'Faculty →'}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Centralized Admission Banner */}
          <div className="mt-8 p-4 rounded-xl plaque-espresso border border-[#C5A880]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-tech">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#BD452F] shrink-0" />
              <span className="text-[#DCD3C1]">
                {lang === 'bn'
                  ? 'ভর্তি প্রক্রিয়া: বস্ত্র অধিদপ্তর (DoT) পরিচালিত টেক্সটাইল ইঞ্জিনিয়ারিং কলেজগুলোর কেন্দ্রীয় সমন্বিত পরীক্ষার মাধ্যমে মোট ১২০ আসনে শিক্ষার্থী নির্বাচন করা হয়।'
                  : 'Admission: Centralized admission test conducted by the Department of Textiles (DoT) under BUTEX for 120 annual seats.'}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#1A1916] border border-[#C5A880]/30 text-[#DFCA9E] whitespace-nowrap text-[11px]">
              {lang === 'bn' ? '১২০ আসন / শিক্ষাবর্ষ' : '120 SEATS / YEAR'}
            </span>
          </div>

        </div>
      </section>

      {/* 8. FEATURED ALUMNI & FACULTY SPOTLIGHT */}
      <section className="py-14 sm:py-20 border-b border-[#C5A880]/15 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[10px] font-mono-tech uppercase text-[#DFCA9E] tracking-widest block">
                {lang === 'bn' ? 'কমিউনিটি স্পটলাইট' : 'COMMUNITY SPOTLIGHT'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif-regal font-extrabold text-[#FDFBF7] mt-1">
                {lang === 'bn' ? 'বিশিষ্ট অ্যালামনাই ও শিক্ষকমণ্ডলী' : 'Featured Alumni & Faculty'}
              </h2>
            </div>
          </div>

          {/* Asymmetric Editorial Grid (Shown when verified alumni exist) */}
          {alumni.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Feature Left Profile (5 Cols) */}
              <div className="lg:col-span-5 plaque-elevated rounded-xl p-6 sm:p-8 border border-[#C5A880]/30 flex flex-col justify-between relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#C5A880]/15 text-[10px] font-mono-tech text-[#A89884]">
                    <span className="text-[#DFCA9E]">{lang === 'bn' ? 'অ্যালামনাই স্পটলাইট' : 'ALUMNI SPOTLIGHT'}</span>
                    <span>{alumni[0]?.batch || (lang === 'bn' ? 'আরটেক অ্যালামনাই' : 'RTEC ALUMNI')}</span>
                  </div>

                  <div className="relative h-64 w-full rounded-lg overflow-hidden border border-[#C5A880]/25 bg-[#121110] on-dark-media">
                    <UserAvatar
                      src={alumni[0]?.avatar}
                      name={alumni[0]?.name}
                      role="alumni"
                      className="w-full h-full rounded-none"
                      iconClassName="w-20 h-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-transparent pointer-events-none" />
                    {alumni[0]?.company && (
                      <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-[#181715]/90 text-white keep-white text-xs font-mono-tech border border-[#C5A880]/30">
                        {alumni[0].company}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif-regal font-bold text-[#FDFBF7]">
                      {alumni[0]?.name}
                    </h3>
                    <p className="text-xs text-[#DFCA9E] font-mono-tech mt-0.5">
                      {alumni[0]?.role} {alumni[0]?.batch ? `• ${alumni[0].batch}` : ''}
                    </p>
                    {alumni[0]?.bio && (
                      <p className="text-xs text-[#DCD3C1] font-sans mt-2 leading-relaxed">
                        {alumni[0].bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#C5A880]/15 flex items-center justify-between text-xs font-mono-tech">
                  <span className="text-[#A89884]">{alumni[0]?.location || 'Bangladesh'}</span>
                  <Link to="/directory" className="text-[#DFCA9E] hover:underline flex items-center gap-1">
                    <span>{lang === 'bn' ? 'প্রোফাইল ফাইল →' : 'View File →'}</span>
                  </Link>
                </div>
              </div>

              {/* Right 7 Cols: Compact Technical ID Badges */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {alumni.slice(1, 5).map((alm, idx) => (
                  <div
                    key={alm.id}
                    className="plaque-espresso rounded-xl p-5 border border-[#C5A880]/20 flex flex-col justify-between hover:border-[#C5A880]/50 transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <UserAvatar
                          src={alm.avatar}
                          name={alm.name}
                          role="alumni"
                          className="w-14 h-14 rounded-lg border border-[#C5A880]/30"
                        />
                        <span className="px-2 py-0.5 rounded bg-[#121110] text-[#DFCA9E] text-[10px] font-mono-tech border border-[#C5A880]/20">
                          {alm.passingYear || 'VERIFIED'}
                        </span>
                      </div>

                      <h4 className="font-serif-regal font-bold text-base text-[#FDFBF7]">
                        {alm.name}
                      </h4>
                      <p className="text-[11px] font-mono-tech text-[#DFCA9E]">
                        {alm.batch}
                      </p>
                      <p className="text-xs text-[#DCD3C1] mt-1 font-sans line-clamp-1">
                        {alm.role}{alm.company ? ` @ ${alm.company}` : ''}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#C5A880]/15 flex items-center justify-between text-[11px] font-mono-tech">
                      <span className="text-[#A89884] truncate">{alm.department}</span>
                      <Link to="/directory" className="text-[#DFCA9E] hover:underline shrink-0">
                        ID-{idx + 2}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="plaque-elevated rounded-xl p-8 border border-[#C5A880]/25 text-center space-y-3">
              <p className="text-sm text-[#374151] dark:text-[#DCD3C1] font-sans font-medium max-w-xl mx-auto">
                {lang === 'bn'
                  ? 'ভেরিফায়েড অ্যালামনাই প্রোফাইলগুলো অনুমোদিত হলে এখানে প্রদর্শিত হবে। স্টুডেন্ট পোর্টাল থেকে আপনার প্রোফাইল জমা দিন অথবা ডিরেক্টরি দেখুন।'
                  : 'Verified RTEC alumni profiles will be showcased here as graduates register and verify their profiles.'}
              </p>
              <Link
                to="/student-portal"
                className="btn-agency btn-agency-terracotta px-5 py-2.5 rounded text-xs font-sans uppercase tracking-wider inline-flex"
              >
                <span>{lang === 'bn' ? 'প্রোফাইল নিবন্ধন করুন →' : 'Register Your Profile →'}</span>
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* 7. INDUSTRY REFERRAL & CAREER DESK */}
      <section className="py-14 sm:py-20 border-b border-[#C5A880]/15 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="plaque-elevated rounded-2xl p-6 sm:p-10 border border-[#C5A880]/25 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#C5A880]/15 mb-6">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-11 h-11 aspect-square shrink-0 rounded-xl bg-[#BD452F]/15 text-[#DE644E] flex items-center justify-center border border-[#BD452F]/30">
                  <Briefcase className="w-5 h-5 text-[#DE644E]" />
                </div>
                <div>
                  <h3 className="font-serif-regal font-bold text-xl sm:text-2xl text-[#0C0A09] dark:text-[#FDFBF7]">
                    {lang === 'bn' ? 'অ্যালামনাই জব ও ক্যারিয়ার রেফারাল ডেস্ক' : 'Alumni Employment & Career Referral Desk'}
                  </h3>
                  <p className="text-xs text-[#57534E] dark:text-[#A89884] font-sans mt-0.5">
                    {lang === 'bn'
                      ? 'আরটেক অ্যালামনাইরা সরাসরি তাদের পরিচালিত টেক্সটাইল মিল, বায়িং হাউস ও ল্যাবে জুনিয়র গ্র্যাজুয়েটদের রেফারেল প্রদান করেন।'
                      : 'Direct industry openings posted by senior alumni heading composite mills, international buying houses, and laboratories.'}
                  </p>
                </div>
              </div>

              <Link
                to="/jobs"
                className="btn-agency px-5 py-2.5 rounded text-xs font-sans uppercase tracking-wider self-start md:self-auto shrink-0"
              >
                <span>{lang === 'bn' ? `সকল সার্কুলার (${jobs.length})` : `All Openings (${jobs.length})`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {jobs.slice(0, 3).map((job) => (
                  <Link
                    key={job.id}
                    to="/jobs"
                    className="block p-4 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] hover:bg-[#F0EAE1] dark:hover:bg-[#1E1C18] border border-[#C5A880]/20 hover:border-[#C5A880]/50 transition group shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-sans font-bold text-sm text-[#0C0A09] dark:text-[#FDFBF7] group-hover:text-[#BD452F] dark:group-hover:text-[#DFCA9E] transition-colors line-clamp-2">
                        {lang === 'bn' ? job.titleBn || job.title : job.title}
                      </h4>
                      <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#854D0E] dark:text-[#DFCA9E] border border-[#C5A880]/30 font-bold shrink-0">
                        {job.type}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs font-mono-tech text-[#57534E] dark:text-[#A89884] pt-2 border-t border-[#C5A880]/15">
                      <div className="flex items-center gap-1.5 font-bold text-[#1C1917] dark:text-[#EDE8DF]">
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span>{job.location}</span>
                        <span className="text-[#BD452F] dark:text-[#DE644E] font-bold">{job.salary}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/20 text-center">
                <p className="text-xs sm:text-sm text-[#374151] dark:text-[#DCD3C1] font-sans font-medium">
                  {lang === 'bn'
                    ? 'নতুন চাকরির সার্কুলার বা রেফারাল পোস্ট করা হলে এখানে প্রদর্শিত হবে।'
                    : 'Verified job openings and alumni referrals will appear here once posted.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

    </motion.div>
  );
}
