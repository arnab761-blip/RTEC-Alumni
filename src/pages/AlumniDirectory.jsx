import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { formatDriveImageUrl } from '../utils/driveImage.js';
import { useScrollLock } from '../utils/useScrollLock.js';
import {
  Search,
  Filter,
  GraduationCap,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
  X,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Download,
  ArrowRight,
  Layers,
  Award
} from 'lucide-react';
import { LinkedinIcon } from '../components/SocialIcons.jsx';
import UserAvatar from '../components/UserAvatar.jsx';

export default function AlumniDirectory() {
  const { alumni, lang } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Lock background scroll when alumni details modal is open
  useScrollLock(Boolean(selectedProfile));

  // Batches list (1st Batch: 2018-19 to 8th Batch: 2025-26)
  const batches = [
    'All',
    '1st Batch (2018-19)',
    '2nd Batch (2019-20)',
    '3rd Batch (2020-21)',
    '4th Batch (2021-22)',
    '5th Batch (2022-23)',
    '6th Batch (2023-24)',
    '7th Batch (2024-25)',
    '8th Batch (2025-26)'
  ];

  // Departments list
  const departments = [
    'All',
    'Yarn Engineering',
    'Fabric Engineering',
    'Wet Process Engineering',
    'Apparel Manufacturing'
  ];

  // Helper to extract roman batch
  const getRomanBatch = (batchStr) => {
    if (!batchStr) return 'ALM';
    if (batchStr.includes('1st')) return 'BATCH I';
    if (batchStr.includes('2nd')) return 'BATCH II';
    if (batchStr.includes('3rd')) return 'BATCH III';
    if (batchStr.includes('4th')) return 'BATCH IV';
    if (batchStr.includes('5th')) return 'BATCH V';
    if (batchStr.includes('6th')) return 'BATCH VI';
    if (batchStr.includes('7th')) return 'BATCH VII';
    if (batchStr.includes('8th')) return 'BATCH VIII';
    return batchStr;
  };

  // Filtered Alumni list
  const filteredAlumni = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    return alumni.filter((alm) => {
      const matchSearch =
        !q ||
        alm.name?.toLowerCase().includes(q) ||
        alm.nameBn?.toLowerCase().includes(q) ||
        alm.company?.toLowerCase().includes(q) ||
        alm.designation?.toLowerCase().includes(q) ||
        alm.role?.toLowerCase().includes(q) ||
        alm.jobSector?.toLowerCase().includes(q) ||
        alm.workLocation?.toLowerCase().includes(q) ||
        alm.location?.toLowerCase().includes(q) ||
        alm.skills?.some(s => s.toLowerCase().includes(q));

      const matchBatch = selectedBatch === 'All' || alm.batch === selectedBatch;
      const matchDept = selectedDept === 'All' || alm.department === selectedDept;

      return matchSearch && matchBatch && matchDept;
    });
  }, [alumni, searchQuery, selectedBatch, selectedDept]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen text-[#EDE8DF] py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Architectural Header */}
        <div className="mb-8 pb-6 border-b border-[#C5A880]/20">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-tech text-[#A89884] uppercase mb-2">
            <span className="text-[#DFCA9E]">
              {lang === 'bn' ? 'অফিসিয়াল অ্যালামনাই ডিরেক্টরি' : 'OFFICIAL ALUMNI DIRECTORY'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-regal font-black text-[#FDFBF7] tracking-tight">
            {lang === 'bn' ? 'আরটেক অ্যালামনাই ডিরেক্টরি ও আইডি রেজিস্ট্রি' : 'RTEC Alumni Directory'}
          </h1>
          <p className="text-xs sm:text-sm text-[#DCD3C1] mt-2 max-w-3xl font-sans leading-relaxed">
            {lang === 'bn'
              ? '১ম ব্যাচ (২০১৮-১৯) থেকে শুরু করে সকল সেশনের অনুমোদিত টেক্সটাইল প্রকৌশলীদের অফিসিয়াল প্রোফাইল ও পরিচিতি। সরাসরি প্রফেশনাল সংযোগ স্থাপন করুন।'
              : 'Verified profiles of RTEC graduates across academic batches from 2018-19 to 2025-26.'}
          </p>
        </div>

        {/* Architectural Filter & Search Console */}
        <div className="plaque-elevated p-4 sm:p-6 rounded-xl border border-[#C5A880]/25 mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Search Input */}
            <div className="relative md:col-span-1">
              <Search className="w-4 h-4 text-[#A89884] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'bn' ? 'নাম, পদবি, কোম্পানি বা স্কিল লিখুন...' : 'Search name, role, company or skill...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#141311] border border-[#C5A880]/25 text-[#FDFBF7] placeholder-[#A89884]/60 text-xs sm:text-sm focus:outline-none focus:border-[#C5A880] transition font-sans"
              />
            </div>

            {/* Batch Filter */}
            <div>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#141311] border border-[#C5A880]/25 text-[#FDFBF7] text-xs sm:text-sm focus:outline-none focus:border-[#C5A880] transition font-mono-tech"
              >
                {batches.map((b) => (
                  <option key={b} value={b} className="bg-[#141311] text-[#EDE8DF]">
                    {b === 'All' ? (lang === 'bn' ? 'সকল ব্যাচ (All Batches)' : 'All 8 Batches') : b}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#141311] border border-[#C5A880]/25 text-[#FDFBF7] text-xs sm:text-sm focus:outline-none focus:border-[#C5A880] transition font-sans"
              >
                {departments.map((d) => (
                  <option key={d} value={d} className="bg-[#141311] text-[#EDE8DF]">
                    {d === 'All' ? (lang === 'bn' ? 'সকল ডিপার্টমেন্ট (All Depts)' : 'All Departments') : d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result Count and Clear Filters */}
          <div className="flex items-center justify-between text-xs font-mono-tech text-[#A89884] pt-1 border-t border-[#C5A880]/15">
            <span>
              {lang === 'bn' ? 'মোট মিলেছে:' : 'TOTAL MATCHED:'}{' '}
              <strong className="text-[#DFCA9E] font-bold">{filteredAlumni.length}</strong>{' '}
              {lang === 'bn' ? 'জন প্রোফাইল' : 'PROFILES'}
            </span>
            {(searchQuery || selectedBatch !== 'All' || selectedDept !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBatch('All');
                  setSelectedDept('All');
                }}
                className="text-[#DE644E] hover:underline uppercase tracking-wider"
              >
                {lang === 'bn' ? 'ফিল্টার রিসেট' : 'Clear Filters'}
              </button>
            )}
          </div>
        </div>

        {/* Bespoke Alumni "Prestige ID Badge / Editorial Profile" Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAlumni.map((alm, idx) => (
            <div
              key={alm.id}
              className="plaque-elevated rounded-xl overflow-hidden border border-[#C5A880]/25 hover:border-[#C5A880]/60 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between group shadow-lg hover:shadow-2xl relative"
            >
              
              {/* ID Badge Metallic Header Strip */}
              <div className="p-3 bg-[#161513] border-b border-[#C5A880]/20 flex items-center justify-between text-[10px] font-mono-tech text-[#A89884]">
                <span className="font-bold text-[#DFCA9E]">
                  {getRomanBatch(alm.batch)}
                </span>
                <span className="truncate max-w-[110px]">
                  RTEC-ID-{(idx + 1).toString().padStart(4, '0')}
                </span>
              </div>

              {/* Main ID Body */}
              <div className="p-5 space-y-4">
                
                {/* Portrait with Brass Border & Verified Pin */}
                <div className="flex items-start justify-between gap-3">
                  <div className="relative">
                    <UserAvatar
                      src={alm.avatar}
                      name={alm.name}
                      role="alumni"
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-lg border-2 border-[#C5A880]/40 p-0.5 bg-[#121110] shadow"
                    />
                    {alm.isVerified && (
                      <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#C5A880] text-[#121110] shadow" title={lang === 'bn' ? 'ভেরিফায়েড অ্যালামনাই' : 'Verified Alumni'}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded bg-[#141311] text-[#DFCA9E] text-[10px] font-mono-tech border border-[#C5A880]/25">
                      {lang === 'bn' ? `ব্যাচ '${alm.passingYear?.slice(-2) || '২২'}` : `PASS '${alm.passingYear?.slice(-2) || '22'}`}
                    </span>
                    <span className="block text-[9px] text-[#A89884] font-mono-tech mt-1">
                      {lang === 'bn' ? 'রেজি: ভেরিফায়েড' : 'REG: VERIFIED'}
                    </span>
                  </div>
                </div>

                {/* Name & Academic Credentials */}
                <div>
                  <h3 className="font-serif-regal font-bold text-base sm:text-lg text-[#FDFBF7] group-hover:text-[#DFCA9E] transition-colors leading-tight">
                    {lang === 'bn' ? (alm.nameBn || alm.name) : (alm.name || alm.nameBn)}
                  </h3>
                  <p className="text-[11px] text-[#DE644E] font-mono-tech mt-0.5">
                    {lang === 'bn' ? (alm.deptBn || alm.department) : (alm.department || alm.deptBn)}
                  </p>
                </div>

                {/* Outer Card Summary: Strictly Designation & Company */}
                <div className="p-3 rounded-lg bg-[#141311] border border-[#C5A880]/20 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-[#EDE8DF]">
                    <Briefcase className="w-3.5 h-3.5 text-[#DFCA9E] shrink-0" />
                    <span className="font-bold truncate">
                      {alm.designation || alm.role || (lang === 'bn' ? 'পদবী সংযুক্ত নেই' : 'Role Not Listed')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A89884] pl-5 truncate font-sans font-medium">
                    {alm.company || (lang === 'bn' ? 'প্রতিষ্ঠানের নাম সংযুক্ত নেই' : 'Company Not Listed')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-[#161513] border-t border-[#C5A880]/20 flex items-center gap-2">
                <button
                  onClick={() => setSelectedProfile(alm)}
                  className="btn-agency flex-1 py-2 px-3 rounded text-xs font-sans uppercase tracking-wider cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
                </button>
                {alm.linkedin && (
                  <a
                    href={alm.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded bg-[#141311] hover:bg-[#1E1C18] border border-[#C5A880]/25 text-[#A89884] hover:text-[#DFCA9E] transition"
                    title={lang === 'bn' ? 'লিঙ্কডইন প্রোফাইল' : 'LinkedIn Profile'}
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredAlumni.length === 0 && (
          <div className="plaque-elevated p-12 rounded-xl text-center max-w-lg mx-auto my-12 border border-[#C5A880]/30 space-y-3">
            <GraduationCap className="w-12 h-12 text-[#DFCA9E] mx-auto mb-2 opacity-80" />
            <h3 className="font-serif-regal font-bold text-lg text-[#FDFBF7]">
              {lang === 'bn' ? 'ডিরেক্টরিতে কোনো ডামি প্রোফাইল নেই' : 'Directory is Clean — No Dummy Profiles'}
            </h3>
            <p className="text-xs text-[#A89884] font-sans leading-relaxed">
              {lang === 'bn' 
                ? 'সকল ডামি অ্যালামনাই প্রোফাইল মুছে দেওয়া হয়েছে। প্রাক্তন শিক্ষার্থীরা তাদের নিজস্ব প্রফেশনাল তথ্য ও ক্যারিয়ার প্রোফাইল নিবন্ধন করলে এখানে ক্রমানুসারে প্রদর্শিত হবে।' 
                : 'All dummy alumni profiles have been purged. Official graduates can register their verified career profiles to appear here.'}
            </p>
          </div>
        )}

      </div>

      {/* Full Profile Dossier Modal mounted via Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedProfile && (
            <motion.div 
              key="alumni-profile-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedProfile(null);
              }}
            >
              <motion.div 
                key="alumni-profile-modal-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#181715] border border-stone-200 dark:border-[#C5A880]/40 relative shadow-2xl my-auto overscroll-contain text-stone-900 dark:text-[#EDE8DF]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="absolute top-5 right-5 p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 dark:bg-[#141311] dark:border-[#C5A880]/25 dark:text-[#A89884] dark:hover:text-[#EDE8DF] transition-colors cursor-pointer"
                  aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-4 mb-6 pb-4 border-b border-[#C5A880]/20">
                  <UserAvatar
                    src={selectedProfile.avatar}
                    name={selectedProfile.name}
                    role="alumni"
                    className="w-20 h-20 rounded-xl border-2 border-[#C5A880]/40 shadow-md bg-[#121110]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif-regal font-bold text-xl text-[#FDFBF7]">
                        {lang === 'bn' ? (selectedProfile.nameBn || selectedProfile.name) : (selectedProfile.name || selectedProfile.nameBn)}
                      </h3>
                      {selectedProfile.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-[#DFCA9E]" />
                      )}
                    </div>
                    <p className="text-xs text-[#DFCA9E] font-mono-tech mt-0.5">
                      {selectedProfile.batch}{selectedProfile.passingYear ? ` • ${selectedProfile.passingYear}` : ''}
                    </p>
                    <p className="text-xs text-[#DE644E] font-mono-tech">
                      {lang === 'bn' ? (selectedProfile.deptBn || selectedProfile.department) : (selectedProfile.department || selectedProfile.deptBn)}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F5EE] dark:bg-[#141311] border border-[#C5A880]/30 dark:border-[#C5A880]/20 space-y-2.5 text-xs mb-5 font-sans">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[#57534E] dark:text-[#A89884] font-mono-tech uppercase text-[11px] shrink-0">
                      {lang === 'bn' ? 'পদবী / ডেজিগনেশন:' : 'DESIGNATION / ROLE:'}
                    </span>
                    <span className="text-[#0C0A09] dark:text-[#FDFBF7] font-bold text-right">
                      {selectedProfile.designation || selectedProfile.role || '—'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[#57534E] dark:text-[#A89884] font-mono-tech uppercase text-[11px] shrink-0">
                      {lang === 'bn' ? 'কোম্পানি / প্রতিষ্ঠান:' : 'COMPANY / ORGANIZATION:'}
                    </span>
                    <span className="text-[#854D0E] dark:text-[#DFCA9E] font-bold text-right">
                      {selectedProfile.company || '—'}
                    </span>
                  </div>

                  {selectedProfile.jobSector && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[#57534E] dark:text-[#A89884] font-mono-tech uppercase text-[11px] shrink-0">
                        {lang === 'bn' ? 'ইন্ডাস্ট্রি সেক্টর:' : 'INDUSTRY SECTOR:'}
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-right">
                        {selectedProfile.jobSector}
                      </span>
                    </div>
                  )}

                  {selectedProfile.experienceYears && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[#57534E] dark:text-[#A89884] font-mono-tech uppercase text-[11px] shrink-0">
                        {lang === 'bn' ? 'অভিজ্ঞতা:' : 'EXPERIENCE:'}
                      </span>
                      <span className="text-[#1C1917] dark:text-[#EDE8DF] font-semibold text-right">
                        {selectedProfile.experienceYears}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[#57534E] dark:text-[#A89884] font-mono-tech uppercase text-[11px] shrink-0">
                      {lang === 'bn' ? 'চাকরির স্থান / লোকেশন:' : 'WORK LOCATION:'}
                    </span>
                    <span className="text-[#1C1917] dark:text-[#EDE8DF] font-medium text-right">
                      {selectedProfile.workLocation || selectedProfile.location || 'Bangladesh'}
                    </span>
                  </div>

                  {selectedProfile.email && (
                    <div className="flex items-start justify-between gap-4 pt-1 border-t border-[#C5A880]/15">
                      <span className="text-[#57534E] dark:text-[#A89884] font-mono-tech uppercase text-[11px] shrink-0">
                        {lang === 'bn' ? 'ইমেইল:' : 'EMAIL:'}
                      </span>
                      <a
                        href={`mailto:${selectedProfile.email}`}
                        className="text-[#BD452F] dark:text-[#DE644E] hover:underline font-mono-tech text-[11px] font-bold text-right break-all"
                      >
                        {selectedProfile.email}
                      </a>
                    </div>
                  )}
                </div>

                {selectedProfile.bio && (
                  <div className="mb-5 p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#141311]/70 border border-[#C5A880]/20">
                    <h4 className="text-[10px] font-mono-tech uppercase tracking-wider text-[#854D0E] dark:text-[#DFCA9E] mb-1.5 font-bold">
                      {lang === 'bn' ? 'সংক্ষিপ্ত জীবনী ও বিবরণ' : 'BIOGRAPHY & CAREER SUMMARY'}
                    </h4>
                    <p className="text-xs text-[#292524] dark:text-[#DCD3C1] leading-relaxed font-sans whitespace-pre-line">
                      {selectedProfile.bio}
                    </p>
                  </div>
                )}

                {selectedProfile.skills && selectedProfile.skills.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-[10px] font-mono-tech uppercase tracking-wider text-[#57534E] dark:text-[#A89884] mb-2 font-bold">
                      {lang === 'bn' ? 'কারিগরি দক্ষতা ও স্পেশালাইজেশন' : 'TECHNICAL SPECIALIZATION & SKILLS'}
                    </h4>
                    <div className="flex flex-wrap gap-1.5 font-mono-tech text-xs">
                      {selectedProfile.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded bg-[#F4EFE6] dark:bg-[#141311] text-[#854D0E] dark:text-[#DFCA9E] border border-[#C5A880]/25 text-[11px] font-semibold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-[#C5A880]/20 flex items-center gap-3">
                  {selectedProfile.email ? (
                    <a
                      href={`mailto:${selectedProfile.email}?subject=${encodeURIComponent(
                        lang === 'bn'
                          ? 'RTEC অ্যালামনাই ডিরেক্টরি থেকে যোগাযোগ'
                          : 'Connecting via RTEC Alumni Directory'
                      )}`}
                      className="btn-agency btn-agency-terracotta flex-1 py-2.5 rounded text-xs font-sans uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'ইমেইল পাঠান (Email)' : 'Send Email'}</span>
                    </a>
                  ) : (
                    <div className="flex-1 py-2.5 px-3 rounded bg-stone-100 dark:bg-[#141311] border border-[#C5A880]/20 text-[#57534E] dark:text-[#A89884] text-xs font-sans text-center">
                      {lang === 'bn' ? 'ইমেইল সংযুক্ত নেই' : 'Email Not Provided'}
                    </div>
                  )}
                  {selectedProfile.linkedin && (
                    <a
                      href={selectedProfile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-4 rounded bg-[#141311] hover:bg-[#1E1C18] text-[#DFCA9E] text-xs font-mono-tech flex items-center gap-1.5 border border-[#C5A880]/25 transition"
                    >
                      <LinkedinIcon className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </motion.div>
  );
}
