import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { formatDriveImageUrl } from '../utils/driveImage.js';
import { useScrollLock } from '../utils/useScrollLock.js';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  Mail,
  Phone,
  Award,
  Heart,
  Droplet,
  BookOpen,
  Calendar,
  X,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import UserAvatar from '../components/UserAvatar.jsx';

const BATCHES = [
  { id: 'all', nameBn: 'সকল ব্যাচ', nameEn: 'All Batches' },
  { id: '1st', nameBn: '১ম ব্যাচ (২০১৮-১৯)', nameEn: '1st Batch (2018-19)' },
  { id: '2nd', nameBn: '২য় ব্যাচ (২০১৯-২০)', nameEn: '2nd Batch (2019-20)' },
  { id: '3rd', nameBn: '৩য় ব্যাচ (২০২০-২১)', nameEn: '3rd Batch (2020-21)' },
  { id: '4th', nameBn: '৪র্থ ব্যাচ (২০২১-২২)', nameEn: '4th Batch (2021-22)' },
  { id: '5th', nameBn: '৫ম ব্যাচ (২০২২-২৩)', nameEn: '5th Batch (2022-23)' },
  { id: '6th', nameBn: '৬ষ্ঠ ব্যাচ (২০২৩-২৪)', nameEn: '6th Batch (2023-24)' },
  { id: '7th', nameBn: '৭ম ব্যাচ (২০২৪-২৫)', nameEn: '7th Batch (2024-25)' },
  { id: '8th', nameBn: '৮ম ব্যাচ (২০২৫-২৬)', nameEn: '8th Batch (2025-26)' }
];

const DEPARTMENTS = [
  { id: 'all', nameBn: 'সকল বিভাগ', nameEn: 'All Departments' },
  { id: 'Yarn Engineering', nameBn: 'ইয়ার্ন', nameEn: 'Yarn' },
  { id: 'Fabric Engineering', nameBn: 'ফ্যাব্রিক', nameEn: 'Fabric' },
  { id: 'Wet Process Engineering', nameBn: 'ওয়েট প্রসেস', nameEn: 'Wet Process' },
  { id: 'Apparel Manufacturing', nameBn: 'অ্যাপারেল', nameEn: 'Apparel' }
];

export default function Students() {
  const { students, lang } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalScrollLocked, setModalScrollLocked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  const openStudentModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
    setModalScrollLocked(true);
  };

  const closeStudentModal = () => {
    setIsModalOpen(false);
  };

  // Keep scroll locked through the entire modal exit animation
  useScrollLock(modalScrollLocked);

  // Close Student Details Modal on Escape key
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeStudentModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBatch, selectedDept, pageSize]);

  // Filter students & strictly preserve PDF/Excel serial order (Never show Roll or CGPA as per strict user guidelines)
  const filteredStudents = useMemo(() => {
    return students
      .filter((std) => {
        const matchesBatch =
          selectedBatch === 'all' ||
          std.batch?.toLowerCase().includes(selectedBatch.toLowerCase());

        const matchesDept =
          selectedDept === 'all' ||
          std.department?.toLowerCase() === selectedDept.toLowerCase() ||
          std.deptBn?.includes(selectedDept) ||
          (selectedDept.toLowerCase().includes('apparel') && (std.department || '').toLowerCase().includes('apparel'));

        const matchesSearch =
          std.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          std.nameBn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          std.regNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          std.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (std.merit && std.merit.toString() === searchTerm.trim()) ||
          (std.serialNo && std.serialNo.toString() === searchTerm.trim()) ||
          std.activities?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          std.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesBatch && matchesDept && matchesSearch;
      })
      .sort((a, b) => {
        const slA = Number(a.serialNo) || 999999;
        const slB = Number(b.serialNo) || 999999;
        if (slA !== slB) return slA - slB;
        return String(a.regNo || '').localeCompare(String(b.regNo || ''));
      });
  }, [students, selectedBatch, selectedDept, searchTerm]);

  // Paginated students for ultra-fast rendering (0ms lag)
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / (pageSize === 'all' ? filteredStudents.length || 1 : Number(pageSize))));
  const paginatedStudents = useMemo(() => {
    if (pageSize === 'all') return filteredStudents;
    const size = Number(pageSize);
    const start = (currentPage - 1) * size;
    return filteredStudents.slice(start, start + size);
  }, [filteredStudents, currentPage, pageSize]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen text-[#EDE8DF] py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Archival Header */}
        <div className="mb-8 pb-6 border-b border-[#C5A880]/20">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-tech text-[#A89884] uppercase mb-2">
            <span className="text-[#DE644E]">
              {lang === 'bn' ? 'শিক্ষার্থী তালিকা • কেন্দ্রীয় রেজিস্টার' : 'STUDENT ROSTER • CENTRAL REGISTER'}
            </span>
            <span>{lang === 'bn' ? 'আরটেক পীরগঞ্জ • ১ম থেকে ৮ম ব্যাচ' : 'RTEC PIRGANJ • 1ST TO 8TH BATCH'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-regal font-black text-[#FDFBF7] tracking-tight">
            {lang === 'bn' ? 'আরটেক অধ্যয়নরত শিক্ষার্থী রেজিস্ট্রি' : 'RTEC Enrolled Student Registry'}
          </h1>
          <p className="text-xs sm:text-sm text-[#DCD3C1] mt-2 max-w-3xl font-sans leading-relaxed">
            {lang === 'bn'
              ? '১ম ব্যাচ (২০১৮-১৯) থেকে শুরু করে ৮ম ব্যাচ (২০২৫-২৬) পর্যন্ত বর্তমান অধ্যয়নরত ভবিষ্যৎ বস্ত্র প্রকৌশলীবৃন্দের রেজিস্ট্রি।'
              : 'Official student registry spanning academic cohorts from the 1st Batch (2018-19) to the 8th Batch (2025-26).'}
          </p>
        </div>

        {/* Student Self-Registration CTA Banner */}
        <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-teal-50/90 to-emerald-50/90 dark:from-[#181715] dark:via-[#201E1A] dark:to-[#181715] border-2 border-emerald-300 dark:border-[#C5A880]/35 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-[#121110] rounded-[10px] flex items-center justify-center text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-transparent">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono-tech uppercase tracking-widest text-emerald-800 dark:text-[#DFCA9E] font-black">
                {lang === 'bn' ? 'স্টুডেন্ট আইডি ও তথ্য পোর্টাল' : 'STUDENT ENROLLMENT DESK'}
              </span>
              <h3 className="text-base sm:text-lg font-serif-regal font-black text-slate-900 dark:text-[#FDFBF7] mt-0.5">
                {lang === 'bn' ? 'আপনি কি আরটেক শিক্ষার্থী? আপনার নিজস্ব আইডি ও প্রোফাইল যুক্ত করুন' : 'Are you an RTEC Student? Register your official profile'}
              </h3>
              <p className="text-xs text-slate-700 dark:text-[#A89884] font-medium font-sans mt-0.5">
                {lang === 'bn'
                  ? 'জিমেইল দিয়ে লগইন করে রেজিস্ট্রেশন নম্বর, ব্যাচ ও বর্তমান চাকরির তথ্য জমা দিন।'
                  : 'Submit your student details with Gmail for official directory verification.'}
              </p>
            </div>
          </div>

          <Link
            to="/student-portal"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-600 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/25 transition shrink-0 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{lang === 'bn' ? 'তথ্য জমা দিন (Submit Profile) →' : 'Submit My Profile →'}</span>
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="p-4 rounded-xl plaque-elevated text-center border border-[#C5A880]/20">
            <span className="text-2xl sm:text-3xl font-serif-regal font-black text-[#DFCA9E]">{students.length}</span>
            <p className="text-[11px] font-mono-tech text-[#A89884] mt-1">
              {lang === 'bn' ? 'মোট নিবন্ধিত শিক্ষার্থী' : 'Enrolled Students'}
            </p>
          </div>
          <div className="p-4 rounded-xl plaque-elevated text-center border border-[#C5A880]/20">
            <span className="text-2xl sm:text-3xl font-serif-regal font-black text-[#DFCA9E]">08</span>
            <p className="text-[11px] font-mono-tech text-[#A89884] mt-1">
              {lang === 'bn' ? 'সক্রিয় শিক্ষাবর্ষ ব্যাচ' : 'Active Batches'}
            </p>
          </div>
          <div className="p-4 rounded-xl plaque-elevated text-center border border-[#C5A880]/20">
            <span className="text-2xl sm:text-3xl font-serif-regal font-black text-[#DE644E]">100%</span>
            <p className="text-[11px] font-mono-tech text-[#A89884] mt-1">
              {lang === 'bn' ? 'অনুমোদিত রেজি. নং' : 'Verified Registration'}
            </p>
          </div>
          <div className="p-4 rounded-xl plaque-elevated text-center border border-[#C5A880]/20">
            <span className="text-2xl sm:text-3xl font-serif-regal font-black text-[#DFCA9E]">04</span>
            <p className="text-[11px] font-mono-tech text-[#A89884] mt-1">
              {lang === 'bn' ? 'ইঞ্জিনিয়ারিং বিভাগ' : 'Core Disciplines'}
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="plaque-elevated p-4 sm:p-6 rounded-xl border border-[#C5A880]/25 mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89884]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'bn' ? 'নাম, রেজি. নং, বা রক্তের গ্রুপ...' : 'Search by name, reg no or blood group...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#141311] border border-[#C5A880]/25 text-xs sm:text-sm text-[#FDFBF7] placeholder-[#A89884]/60 focus:outline-none focus:border-[#C5A880] transition font-sans"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89884] hover:text-[#EDE8DF]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Batch Filter */}
            <div>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#141311] border border-[#C5A880]/25 text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-[#C5A880] transition font-mono-tech"
              >
                {BATCHES.map((b) => (
                  <option key={b.id} value={b.id} className="bg-[#141311] text-[#EDE8DF]">
                    {lang === 'bn' ? b.nameBn : b.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#141311] border border-[#C5A880]/25 text-xs sm:text-sm text-[#FDFBF7] focus:outline-none focus:border-[#C5A880] transition font-sans"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#141311] text-[#EDE8DF]">
                    {lang === 'bn' ? d.nameBn : d.nameEn}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs font-mono-tech text-[#A89884] pt-2 border-t border-[#C5A880]/15">
            <span>
              TOTAL MATCHED: <strong className="text-[#DFCA9E]">{filteredStudents.length}</strong> STUDENTS
            </span>
            {(searchTerm || selectedBatch !== 'all' || selectedDept !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedBatch('all');
                  setSelectedDept('all');
                }}
                className="text-[#DE644E] hover:underline uppercase"
              >
                {lang === 'bn' ? 'রিসেট ফিল্টার' : 'Clear Filters'}
              </button>
            )}
          </div>
        </div>

        {/* Student Cards Grid */}
        {filteredStudents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {paginatedStudents.map((std, idx) => (
                <div
                  key={std.id || std.regNo}
                  className="plaque-elevated rounded-xl p-5 border border-[#C5A880]/25 hover:border-[#C5A880]/60 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-start gap-3.5 mb-3">
                      <UserAvatar
                        src={std.avatar}
                        name={std.name}
                        role="student"
                        className="w-14 h-14 rounded-lg border border-[#C5A880]/30 p-0.5 bg-stone-100 dark:bg-[#121110]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between text-[10px] font-mono-tech mb-0.5">
                          <span className="text-stone-600 dark:text-[#A89884] font-medium">SL #{std.serialNo || idx + 1}</span>
                          <span className="text-[#DE644E] font-bold font-mono" title={std.studentId ? 'Student ID' : 'Reg No'}>
                            {std.studentId ? `ID: ${std.studentId}` : (std.regNo || 'N/A')}
                          </span>
                        </div>
                        <h4 className="font-serif-regal font-bold text-base text-stone-900 dark:text-[#FDFBF7] group-hover:text-amber-800 dark:group-hover:text-[#DFCA9E] transition-colors truncate">
                          {std.name}
                        </h4>
                        <div className="flex items-center justify-between gap-1 text-[11px] font-mono-tech text-stone-600 dark:text-[#A89884] font-medium">
                          <span className="truncate">{std.batch}</span>
                          {std.merit && (
                            <span className="shrink-0 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                              🏆 #{std.merit}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs pt-2.5 border-t border-stone-200 dark:border-[#C5A880]/15 font-sans">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-600 dark:text-[#A89884] font-mono-tech text-[11px] font-semibold">DEPT:</span>
                        <span className="text-stone-800 dark:text-[#DFCA9E] font-medium truncate">{lang === 'bn' ? std.deptBn || std.department : std.department}</span>
                      </div>
                      <div className="flex justify-between items-center pt-0.5">
                        <span className="text-stone-600 dark:text-[#A89884] font-mono-tech text-[11px] font-semibold">STATUS:</span>
                        <span className={std.studentType === 'Undergraduate' ? 'badge-undergraduate' : 'badge-graduate'}>
                          {std.studentType === 'Undergraduate'
                            ? (lang === 'bn' ? 'আন্ডারগ্র্যাজুয়েট' : 'Undergraduate')
                            : (lang === 'bn' ? 'গ্র্যাজুয়েট' : 'Graduate')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 dark:border-[#C5A880]/15 flex items-center justify-between text-[11px] font-mono-tech">
                    {std.bloodGroup ? (
                      <span className="badge-blood-group">
                        <Droplet className="w-3 h-3 text-red-600 dark:text-rose-400 fill-current" />
                        <span>{std.bloodGroup}</span>
                      </span>
                    ) : (
                      <span className="badge-empty-unset">
                        {lang === 'bn' ? 'রক্ত ফাঁকা' : 'Blood Unset'}
                      </span>
                    )}
                    <button
                      onClick={() => openStudentModal(std)}
                      className="text-amber-800 dark:text-[#DFCA9E] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{lang === 'bn' ? 'ফাইল দেখুন →' : 'View File →'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl plaque-elevated border border-[#C5A880]/25 text-xs font-mono-tech">
              <div className="text-stone-700 dark:text-[#A89884]">
                {lang === 'bn' ? 'প্রদর্শিত হচ্ছে: ' : 'Showing: '}
                <strong className="text-stone-900 dark:text-[#DFCA9E] font-bold">
                  {pageSize === 'all'
                    ? `১ - ${filteredStudents.length}`
                    : `${(currentPage - 1) * Number(pageSize) + 1} - ${Math.min(currentPage * Number(pageSize), filteredStudents.length)}`}
                </strong>
                {lang === 'bn' ? ` (মোট ${filteredStudents.length} জন)` : ` of ${filteredStudents.length} Students`}
              </div>

              {pageSize !== 'all' && totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-[#C5A880]/30 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-200 dark:hover:bg-[#1E1C18] text-stone-800 dark:text-[#EDE8DF] font-bold cursor-pointer"
                  >
                    {lang === 'bn' ? 'পূর্ববর্তী' : 'Prev'}
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
                    .map((page, idx, arr) => (
                      <React.Fragment key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="px-1 text-stone-400">...</span>
                        )}
                        <button
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 380, behavior: 'smooth' });
                          }}
                          className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 cursor-pointer ${
                            currentPage === page
                              ? 'bg-amber-600 text-white dark:bg-[#C5A880] dark:text-[#121110] shadow-sm scale-110'
                              : 'border border-stone-300 dark:border-[#C5A880]/30 hover:bg-stone-200 dark:hover:bg-[#1E1C18] text-stone-800 dark:text-[#EDE8DF]'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}

                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-[#C5A880]/30 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-200 dark:hover:bg-[#1E1C18] text-stone-800 dark:text-[#EDE8DF] font-bold cursor-pointer"
                  >
                    {lang === 'bn' ? 'পরবর্তী' : 'Next'}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 text-stone-700 dark:text-[#A89884]">
                <span>{lang === 'bn' ? 'প্রতি পৃষ্ঠায়:' : 'Per page:'}</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-[#C5A880]/30 bg-stone-100 dark:bg-[#141311] text-stone-900 dark:text-[#FDFBF7] font-bold cursor-pointer"
                >
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                  <option value={96}>96</option>
                  <option value="all">{lang === 'bn' ? 'সকল' : 'All'}</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          <div className="plaque-elevated p-12 rounded-xl text-center max-w-md mx-auto my-12 border border-[#C5A880]/30">
            <Users className="w-10 h-10 text-[#A89884] mx-auto mb-3" />
            <h3 className="font-serif-regal font-bold text-base text-stone-900 dark:text-[#FDFBF7]">
              {lang === 'bn' ? 'কোনো শিক্ষার্থী পাওয়া যায়নি' : 'No Students Found'}
            </h3>
            <p className="text-xs text-stone-600 dark:text-[#A89884] mt-1 font-sans">
              {lang === 'bn' ? 'অনুসন্ধান বা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।' : 'Alter your search keyword or batch selection.'}
            </p>
          </div>
        )}

      </div>

      {/* Student Detail Modal mounted via Portal (Synchronized GPU Backdrop + Card) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence
          onExitComplete={() => {
            setSelectedStudent(null);
            setModalScrollLocked(false);
          }}
        >
          {isModalOpen && selectedStudent && (
            <>
              <motion.div
                key="student-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, pointerEvents: 'none' }}
                transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
                style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
                className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
              />
              <motion.div
                key="student-modal-wrapper"
                initial={false}
                animate={{ pointerEvents: 'auto' }}
                exit={{ pointerEvents: 'none' }}
                transition={{ duration: 0.24 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto overscroll-contain"
                onClick={closeStudentModal}
              >
                <motion.div
                  key="student-modal-card"
                  role="dialog"
                  aria-modal="true"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
                  style={{ willChange: 'transform, opacity' }}
                  className="w-full max-w-md rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#181715] border border-stone-200 dark:border-[#C5A880]/40 relative shadow-2xl my-auto overscroll-contain text-stone-900 dark:text-[#EDE8DF]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={closeStudentModal}
                    className="absolute top-5 right-5 p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 dark:bg-[#141311] dark:border-[#C5A880]/25 dark:text-[#A89884] dark:hover:text-[#EDE8DF] transition-colors duration-150 cursor-pointer"
                    aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                  >
                    <X className="w-4 h-4" />
                  </button>

                <div className="flex items-start gap-4 mb-6 pb-4 border-b border-stone-200 dark:border-[#C5A880]/20">
                  <UserAvatar
                    src={selectedStudent.avatar}
                    name={selectedStudent.name}
                    role="student"
                    className="w-18 h-18 rounded-xl border-2 border-stone-300 dark:border-[#C5A880]/40 shadow-md bg-stone-100 dark:bg-[#121110]"
                  />
                  <div>
                    <span className="text-[11px] font-mono-tech text-[#DE644E] font-bold block">
                      {selectedStudent.studentId ? `STUDENT ID: ${selectedStudent.studentId}` : `REG: ${selectedStudent.regNo || 'N/A'}`}
                    </span>
                    <h3 className="font-serif-regal font-bold text-xl text-stone-900 dark:text-[#FDFBF7] mt-0.5">
                      {lang === 'bn' ? selectedStudent.nameBn || selectedStudent.name : selectedStudent.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <p className="text-xs text-amber-800 dark:text-[#DFCA9E] font-mono-tech font-semibold">
                        {selectedStudent.batch}
                      </p>
                      {selectedStudent.merit && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                          🏆 {lang === 'bn' ? 'ভর্তি মেধা ক্রম:' : 'Admission Merit:'} #{selectedStudent.merit}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#141311] border border-stone-200 dark:border-[#C5A880]/20 space-y-2.5 text-xs mb-5 font-mono-tech">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600 dark:text-[#A89884] font-semibold">
                      {lang === 'bn' ? 'ক্রমিক নং:' : 'SL NO:'}
                    </span>
                    <span className="text-teal-700 dark:text-teal-400 font-bold">#{selectedStudent.serialNo || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600 dark:text-[#A89884] font-semibold">
                      {selectedStudent.studentId ? (lang === 'bn' ? 'স্টুডেন্ট আইডি (রেজিস্ট্রেশন):' : 'STUDENT ID (REG):') : (lang === 'bn' ? 'রেজিস্ট্রেশন নং:' : 'REG NO:')}
                    </span>
                    <span className="font-mono font-bold text-[#DE644E]">{selectedStudent.regNo || selectedStudent.studentId || 'N/A'}</span>
                  </div>
                  {selectedStudent.merit && (
                    <div className="flex items-center justify-between">
                      <span className="text-stone-600 dark:text-[#A89884] font-semibold">{lang === 'bn' ? 'ভর্তি মেধা তালিকা ক্রম:' : 'ADMISSION MERIT:'}</span>
                      <span className="text-amber-800 dark:text-amber-300 font-bold font-mono">#{selectedStudent.merit}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600 dark:text-[#A89884] font-semibold">
                      {lang === 'bn' ? 'সেশন:' : 'SESSION:'}
                    </span>
                    <span className="text-stone-900 dark:text-[#FDFBF7] font-semibold">{selectedStudent.session || '2018-2019'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600 dark:text-[#A89884] font-semibold">
                      {lang === 'bn' ? 'বিভাগ:' : 'DEPARTMENT:'}
                    </span>
                    <span className="text-stone-900 dark:text-[#FDFBF7] font-bold">{lang === 'bn' ? selectedStudent.deptBn || selectedStudent.department : selectedStudent.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600 dark:text-[#A89884] font-semibold">
                      {lang === 'bn' ? 'শিক্ষার্থীর ধরন:' : 'STUDENT TYPE:'}
                    </span>
                    <span className={selectedStudent.studentType === 'Undergraduate' ? 'badge-undergraduate' : 'badge-graduate'}>
                      {selectedStudent.studentType === 'Undergraduate'
                        ? (lang === 'bn' ? 'আন্ডারগ্র্যাজুয়েট' : 'Undergraduate')
                        : (lang === 'bn' ? 'গ্র্যাজুয়েট' : 'Graduate')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600 dark:text-[#A89884] font-semibold">
                      {lang === 'bn' ? 'বর্তমান কর্মক্ষেত্র:' : 'CURRENT JOB:'}
                    </span>
                    {selectedStudent.currentJob ? (
                      <span className="text-amber-800 dark:text-amber-300 font-bold">{selectedStudent.currentJob}</span>
                    ) : (
                      <span className="badge-empty-unset">
                        {lang === 'bn' ? 'অপ্রদত্ত' : 'Not specified'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600 dark:text-[#A89884] font-semibold">
                      {lang === 'bn' ? 'ঠিকানা:' : 'ADDRESS:'}
                    </span>
                    {(selectedStudent.address || selectedStudent.currentLocation) ? (
                      <span className="text-stone-800 dark:text-[#DFCA9E] font-medium text-right max-w-[60%] break-words">
                        {selectedStudent.address || selectedStudent.currentLocation}
                      </span>
                    ) : (
                      <span className="badge-empty-unset">
                        {lang === 'bn' ? 'অপ্রদত্ত' : 'Not specified'}
                      </span>
                    )}
                  </div>
                  {selectedStudent.remarks && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-600 dark:text-[#A89884] font-semibold">
                        {lang === 'bn' ? 'মন্তব্য:' : 'REMARKS:'}
                      </span>
                      <span className="text-stone-800 dark:text-stone-300">{selectedStudent.remarks}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600 dark:text-[#A89884] font-semibold">
                      {lang === 'bn' ? 'রক্তের গ্রুপ:' : 'BLOOD GROUP:'}
                    </span>
                    {selectedStudent.bloodGroup ? (
                      <span className="badge-blood-group">
                        <Droplet className="w-3.5 h-3.5 text-red-600 dark:text-rose-400 fill-current" />
                        <span>{selectedStudent.bloodGroup}</span>
                      </span>
                    ) : (
                      <span className="badge-empty-unset">
                        {lang === 'bn' ? 'ফাঁকা' : 'Unset'}
                      </span>
                    )}
                  </div>
                  <div className="pt-2 border-t border-stone-200 dark:border-[#C5A880]/20 flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-[#A89884] font-semibold">
                        {lang === 'bn' ? 'ফোন:' : 'PHONE:'}
                      </span>
                      {selectedStudent.phone ? (
                        <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{selectedStudent.phone}</span>
                      ) : (
                        <span className="badge-unclaimed">
                          {lang === 'bn' ? 'অপ্রদত্ত' : 'Unclaimed'}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600 dark:text-[#A89884] font-semibold">
                        {lang === 'bn' ? 'ইমেইল:' : 'EMAIL:'}
                      </span>
                      {selectedStudent.email ? (
                        <span className="text-stone-800 dark:text-[#DFCA9E] font-medium">{selectedStudent.email}</span>
                      ) : (
                        <span className="badge-unclaimed">
                          {lang === 'bn' ? 'অপ্রদত্ত' : 'Unclaimed'}
                        </span>
                      )}
                    </div>
                  </div>
                  {!selectedStudent.email && !selectedStudent.phone && (
                    <p className="text-[11px] text-teal-800 dark:text-teal-300 font-sans pt-1">
                      {lang === 'bn' 
                        ? '💡 শিক্ষার্থী নিজে স্টুডেন্ট পোর্টাল থেকে লগইন করে ফোন, ইমেইল, রক্তের গ্রুপ ও চাকরির তথ্য ইনপুট করতে পারবে।'
                        : '💡 The student can claim and update contact and job info directly via the Student Portal.'}
                    </p>
                  )}
                </div>

                <button
                  onClick={closeStudentModal}
                  className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white dark:bg-[#C5A880] dark:text-[#121110] dark:hover:bg-[#DFCA9E] font-bold text-xs uppercase tracking-wider transition-colors duration-150 cursor-pointer shadow-md"
                >
                  <span>{lang === 'bn' ? 'ফাইল বন্ধ করুন' : 'Close File'}</span>
                </button>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

    </motion.div>
  );
}
