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
  const { alumni, user, lang, submitContactMessage } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [senderName, setSenderName] = useState(user?.name || '');
  const [senderContact, setSenderContact] = useState(user?.email || '');
  const [messageBody, setMessageBody] = useState('');

  // Lock background scroll when any alumni modal is open
  useScrollLock(Boolean(selectedProfile || contactModalOpen));

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
    return alumni.filter((alm) => {
      const matchSearch =
        alm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (alm.nameBn && alm.nameBn.includes(searchQuery)) ||
        alm.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alm.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alm.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alm.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchBatch = selectedBatch === 'All' || alm.batch === selectedBatch;
      const matchDept = selectedDept === 'All' || alm.department === selectedDept;

      return matchSearch && matchBatch && matchDept;
    });
  }, [alumni, searchQuery, selectedBatch, selectedDept]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    submitContactMessage({
      name: senderName || user?.name || 'RTEC Visitor',
      email: senderContact.includes('@') ? senderContact : '',
      phone: senderContact.includes('@') ? '' : senderContact,
      subject: selectedProfile ? `Direct Message to ${selectedProfile.name}` : 'Alumni Directory Message',
      message: messageBody,
      recipientName: selectedProfile?.name || '',
      recipientId: selectedProfile?.id || '',
      source: 'alumni-directory'
    });
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setContactModalOpen(false);
      setMessageBody('');
    }, 2000);
  };

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
              {lang === 'bn' ? 'অফিসিয়াল অ্যালামনাই রেজিস্টার • সেকশন ০২' : 'OFFICIAL ARCHIVAL REGISTER • SECTION 02'}
            </span>
            <span>{lang === 'bn' ? 'আরটেক পীরগঞ্জ • বুটেক্স অধিভুক্ত' : 'RTEC PIRGANJ • BUTEX AFFILIATION'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-regal font-black text-[#FDFBF7] tracking-tight">
            {lang === 'bn' ? 'আরটেক অ্যালামনাই ডিরেক্টরি ও আইডি রেজিস্ট্রি' : 'RTEC Alumni Directory & Identity Register'}
          </h1>
          <p className="text-xs sm:text-sm text-[#DCD3C1] mt-2 max-w-3xl font-sans leading-relaxed">
            {lang === 'bn'
              ? '১ম ব্যাচ (২০১৮-১৯) থেকে শুরু করে সকল সেশনের অনুমোদিত টেক্সটাইল প্রকৌশলীদের অফিসিয়াল প্রোফাইল আইডি ব্যাজ। সরাসরি প্রফেশনাল সংযোগ স্থাপন করুন।'
              : 'Verified credentials and professional identities of RTEC graduates across all 8 academic sessions from 2018-19 to 2025-26.'}
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

                {/* Professional Status Plate */}
                <div className="p-2.5 rounded bg-[#141311] border border-[#C5A880]/15 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-[#EDE8DF]">
                    <Briefcase className="w-3.5 h-3.5 text-[#DFCA9E] shrink-0" />
                    <span className="font-semibold truncate">{alm.role}</span>
                  </div>
                  <p className="text-[11px] text-[#A89884] pl-5 truncate font-sans">
                    {alm.company}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#A89884] font-mono-tech pt-0.5">
                    <MapPin className="w-3 h-3 text-[#DE644E] shrink-0" />
                    <span className="truncate">{alm.location}</span>
                  </div>
                </div>

                {/* Skills tags */}
                {alm.skills && (
                  <div className="flex flex-wrap gap-1">
                    {alm.skills.slice(0, 2).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded bg-[#141311] text-[#A89884] text-[9px] font-mono-tech border border-[#C5A880]/15"
                      >
                        {skill}
                      </span>
                    ))}
                    {alm.skills.length > 2 && (
                      <span className="text-[9px] text-[#A89884] self-center font-mono-tech">
                        +{alm.skills.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-[#161513] border-t border-[#C5A880]/20 flex items-center gap-2">
                <button
                  onClick={() => setSelectedProfile(alm)}
                  className="btn-agency flex-1 py-2 px-3 rounded text-xs font-sans uppercase tracking-wider"
                >
                  <span>{lang === 'bn' ? 'আইডি ফাইল দেখুন' : 'View Credentials'}</span>
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

                <div className="p-4 rounded-xl bg-[#141311] border border-[#C5A880]/15 space-y-2 text-xs mb-5 font-mono-tech">
                  <div className="flex items-center justify-between">
                    <span className="text-[#A89884]">{lang === 'bn' ? 'পদবী / দায়িত্ব:' : 'POSITION / ROLE:'}</span>
                    <span className="text-[#FDFBF7] font-bold">{selectedProfile.role}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#A89884]">{lang === 'bn' ? 'প্রতিষ্ঠান:' : 'ORGANIZATION:'}</span>
                    <span className="text-[#DFCA9E] font-bold">{selectedProfile.company}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#A89884]">{lang === 'bn' ? 'অবস্থান:' : 'LOCATION:'}</span>
                    <span className="text-[#EDE8DF]">{selectedProfile.location}</span>
                  </div>
                </div>

                {selectedProfile.bio && (
                  <div className="mb-5">
                    <h4 className="text-[10px] font-mono-tech uppercase tracking-wider text-[#A89884] mb-1.5">
                      {lang === 'bn' ? 'সংক্ষিপ্ত জীবনী' : 'EXECUTIVE BIOGRAPHY'}
                    </h4>
                    <p className="text-xs text-[#DCD3C1] leading-relaxed font-sans">
                      {selectedProfile.bio}
                    </p>
                  </div>
                )}

                {selectedProfile.skills && selectedProfile.skills.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-[10px] font-mono-tech uppercase tracking-wider text-[#A89884] mb-2">
                      {lang === 'bn' ? 'কারিগরি দক্ষতা ও স্পেশালাইজেশন' : 'TECHNICAL SPECIALIZATION & SKILLS'}
                    </h4>
                    <div className="flex flex-wrap gap-1.5 font-mono-tech text-xs">
                      {selectedProfile.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded bg-[#141311] text-[#DFCA9E] border border-[#C5A880]/20 text-[11px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-[#C5A880]/20 flex items-center gap-3">
                  <button
                    onClick={() => setContactModalOpen(true)}
                    className="btn-agency btn-agency-terracotta flex-1 py-2.5 rounded text-xs font-sans uppercase tracking-wider"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'বার্তা প্রেরণ করুন' : 'Dispatch Message'}</span>
                  </button>
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

      {/* Direct Contact Form Modal mounted via Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {contactModalOpen && selectedProfile && (
            <motion.div 
              key="alumni-contact-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) setContactModalOpen(false);
              }}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="plaque-elevated w-full max-w-md rounded-2xl p-6 border border-[#C5A880]/40 relative my-auto overscroll-contain"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setContactModalOpen(false)}
                  className="absolute top-4 right-4 text-[#A89884] hover:text-[#EDE8DF]"
                >
                  <X className="w-4 h-4" />
                </button>

                <h3 className="font-serif-regal font-bold text-base text-[#FDFBF7] mb-1">
                  {lang === 'bn' ? `${selectedProfile.name}-কে বার্তা পাঠান` : `Dispatch Message to ${selectedProfile.name}`}
                </h3>
                <p className="text-xs text-[#A89884] mb-4 font-sans">
                  {lang === 'bn' ? 'বার্তাটি সরাসরি আরটেক অভ্যন্তরীণ ডাক মাধ্যমে প্রেরিত হবে।' : 'Dispatched via institutional communication channel.'}
                </p>

                {messageSent ? (
                  <div className="p-6 text-center text-[#DFCA9E] font-mono-tech text-xs bg-[#141311] rounded-xl border border-[#C5A880]/40">
                    ✓ {lang === 'bn' ? 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!' : 'Message dispatched successfully!'}
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="space-y-3 font-sans">
                    <div>
                      <label className="block text-xs font-mono-tech text-[#A89884] mb-1">
                        {lang === 'bn' ? 'আপনার নাম' : 'YOUR NAME'}
                      </label>
                      <input
                        type="text"
                        required
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder={lang === 'bn' ? 'আপনার পূর্ণ নাম লিখুন' : 'Your full name'}
                        className="w-full px-3 py-2 rounded bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono-tech text-[#A89884] mb-1">
                        {lang === 'bn' ? 'ইমেইল বা ফোন নম্বর' : 'CONTACT EMAIL / PHONE'}
                      </label>
                      <input
                        type="text"
                        required
                        value={senderContact}
                        onChange={(e) => setSenderContact(e.target.value)}
                        placeholder={lang === 'bn' ? 'ইমেইল বা ০১৭XXXXXXXX' : 'Email or phone number'}
                        className="w-full px-3 py-2 rounded bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono-tech text-[#A89884] mb-1">
                        {lang === 'bn' ? 'বার্তা' : 'MESSAGE'}
                      </label>
                      <textarea
                        rows="3"
                        required
                        value={messageBody}
                        onChange={(e) => setMessageBody(e.target.value)}
                        placeholder={lang === 'bn' ? 'আপনার বার্তা লিখুন...' : 'Write your message...'}
                        className="w-full px-3 py-2 rounded bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-agency btn-agency-terracotta w-full py-2.5 rounded text-xs font-sans uppercase tracking-wider"
                    >
                      {lang === 'bn' ? 'বার্তা প্রেরণ সম্পন্ন করুন' : 'Confirm & Send'}
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
