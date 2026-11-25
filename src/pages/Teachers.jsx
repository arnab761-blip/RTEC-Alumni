import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatDriveImageUrl } from '../utils/driveImage.js';
import { useScrollLock } from '../utils/useScrollLock.js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Mail,
  Phone,
  Building,
  BookOpen,
  Search,
  Award,
  MapPin,
  Calendar,
  X,
  CheckCircle2,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import UserAvatar from '../components/UserAvatar.jsx';

const DEPARTMENTS = [
  { id: 'all', nameBn: 'সকল অনুষদ ও বিভাগ', nameEn: 'All Faculty & Staff' },
  { id: 'Administration', nameBn: 'প্রশাসন', nameEn: 'Administration' },
  { id: 'Textile Engineering', nameBn: 'টেক্সটাইল ইঞ্জিনিয়ারিং', nameEn: 'Textile Engineering' },
  { id: 'Wet Process', nameBn: 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং', nameEn: 'Wet Process Engineering' },
  { id: 'Fashion', nameBn: 'ফ্যাশন ও অ্যাপারেল ডিজাইন', nameEn: 'Fashion & Design' },
  { id: 'Basic Science', nameBn: 'বেসিক সায়েন্স (পদার্থ)', nameEn: 'Basic Science (Physics)' },
  { id: 'Technical Workshop', nameBn: 'কারিগরি ওয়ার্কশপ ও ল্যাব', nameEn: 'Technical Workshop & Labs' }
];

export default function Teachers() {
  const { teachers, lang } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalScrollLocked, setModalScrollLocked] = useState(false);

  const openTeacherModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
    setModalScrollLocked(true);
  };

  const closeTeacherModal = () => {
    setIsModalOpen(false);
  };

  // Keep scroll locked through the entire modal exit animation
  useScrollLock(modalScrollLocked);

  // Close Faculty Dossier Modal on Escape key
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeTeacherModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Filter teachers (Memoized for 60fps smooth scrolling & filtering)
  const filteredTeachers = useMemo(() => (teachers || []).filter((teacher) => {
    if (!teacher) return false;
    const dept = (teacher.department || '').toLowerCase();
    const deptBn = (teacher.deptBn || '').toLowerCase();
    
    let matchesDept = selectedDept === 'all';
    if (!matchesDept) {
      if (selectedDept === 'Administration') {
        matchesDept = dept.includes('administration') || deptBn.includes('প্রশাসন') || teacher.designation?.toLowerCase().includes('principal');
      } else if (selectedDept === 'Textile Engineering') {
        matchesDept = dept.includes('textile engineering') || deptBn.includes('টেক্সটাইল ইঞ্জিনিয়ারিং');
      } else if (selectedDept === 'Wet Process') {
        matchesDept = dept.includes('wet process') || deptBn.includes('ওয়েট প্রসেস');
      } else if (selectedDept === 'Fashion') {
        matchesDept = dept.includes('fashion') || deptBn.includes('ফ্যাশন') || dept.includes('apparel') || deptBn.includes('অ্যাপারেল');
      } else if (selectedDept === 'Basic Science') {
        matchesDept = dept.includes('physics') || deptBn.includes('পদার্থ') || dept.includes('basic science') || deptBn.includes('বিজ্ঞান');
      } else if (selectedDept === 'Technical Workshop') {
        matchesDept = dept.includes('workshop') || deptBn.includes('ওয়ার্কশপ') || dept.includes('instructor') || deptBn.includes('ইন্সট্রাক্টর') || deptBn.includes('ফোরম্যান');
      } else {
        matchesDept = dept.includes(selectedDept.toLowerCase()) || deptBn.includes(selectedDept.toLowerCase());
      }
    }

    const q = (searchTerm || '').toLowerCase().trim();
    const matchesSearch =
      !q ||
      teacher.name?.toLowerCase().includes(q) ||
      teacher.nameBn?.toLowerCase().includes(q) ||
      teacher.designation?.toLowerCase().includes(q) ||
      teacher.designationBn?.toLowerCase().includes(q) ||
      teacher.department?.toLowerCase().includes(q) ||
      teacher.deptBn?.toLowerCase().includes(q) ||
      teacher.homeDistrict?.toLowerCase().includes(q) ||
      teacher.phone?.toLowerCase().includes(q) ||
      teacher.mobile?.toLowerCase().includes(q) ||
      teacher.email?.toLowerCase().includes(q) ||
      teacher.joiningDate?.toLowerCase().includes(q) ||
      teacher.bcsBatch?.toLowerCase().includes(q);

    return matchesDept && matchesSearch;
  }), [teachers, selectedDept, searchTerm]);

  const totalPrincipalAndHod = useMemo(() => (teachers || []).filter(t => t.isHod).length, [teachers]);

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
            <span className="text-[#DFCA9E]">OFFICIAL FACULTY & STAFF ROSTER • RTEC SENATE</span>
            <span>MINISTRY OF TEXTILES & JUTE • BUTEX AFFILIATED</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-regal font-black text-[#FDFBF7] tracking-tight">
            {lang === 'bn' ? 'সম্মানিত শিক্ষকমণ্ডলী ও কর্মকর্তাবৃন্দ' : 'Distinguished Faculty & Officers'}
          </h1>
          <p className="text-xs sm:text-sm text-[#DCD3C1] mt-2 max-w-3xl font-sans leading-relaxed">
            {lang === 'bn'
              ? 'রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ (RTEC), পীরগঞ্জ, রংপুর-এর সম্মানিত অধ্যক্ষ, বিভাগীয় প্রধান, সহকারী অধ্যাপক, প্রভাষক, কারিগরি প্রশিক্ষক ও কর্মকর্তাবৃন্দের প্রাতিষ্ঠানিক তালিকা।'
              : 'Official roster of the Principal, Assistant Professors, Lecturers, Technical Instructors, and Officers serving at Rangpur Textile Engineering College.'}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="p-4 rounded-xl plaque-elevated text-center border border-[#C5A880]/20">
            <span className="text-2xl sm:text-3xl font-serif-regal font-black text-[#DFCA9E]">{(teachers || []).length}</span>
            <p className="text-[11px] font-mono-tech text-[#A89884] mt-1">
              {lang === 'bn' ? 'মোট অনুষদ ও কর্মকর্তা' : 'Total Faculty & Officers'}
            </p>
          </div>
          <div className="p-4 rounded-xl plaque-elevated text-center border border-[#C5A880]/20">
            <span className="text-2xl sm:text-3xl font-serif-regal font-black text-[#DE644E]">{totalPrincipalAndHod}</span>
            <p className="text-[11px] font-mono-tech text-[#A89884] mt-1">
              {lang === 'bn' ? 'অধ্যক্ষ ও বিভাগীয় প্রধান' : 'Principal & Department Heads'}
            </p>
          </div>
          <div className="p-4 rounded-xl plaque-elevated text-center border border-[#C5A880]/20">
            <span className="text-2xl sm:text-3xl font-serif-regal font-black text-[#DFCA9E]">04</span>
            <p className="text-[11px] font-mono-tech text-[#A89884] mt-1">
              {lang === 'bn' ? 'ইঞ্জিনিয়ারিং বিভাগ' : 'Core Tech Departments'}
            </p>
          </div>
          <div className="p-4 rounded-xl plaque-elevated text-center border border-[#C5A880]/20">
            <span className="text-2xl sm:text-3xl font-serif-regal font-black text-[#DFCA9E]">100%</span>
            <p className="text-[11px] font-mono-tech text-[#A89884] mt-1">
              {lang === 'bn' ? 'বিসিএস ও সরকারি কর্মকর্তা' : 'Government Accredited'}
            </p>
          </div>
        </div>

        {/* Search & Department Selector */}
        <div className="plaque-elevated p-4 sm:p-6 rounded-xl border border-[#C5A880]/25 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89884]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'bn' ? 'নাম, পদবী, বিভাগ, ফোন বা জেলা দিয়ে খুঁজুন...' : 'Search by name, role, dept, phone, district...'}
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

            <p className="text-xs text-[#A89884] font-mono-tech">
              {lang === 'bn'
                ? `প্রদর্শিত: ${filteredTeachers.length} জন সম্মানিত সদস্য`
                : `Active Roster: ${filteredTeachers.length} Members`}
            </p>
          </div>

          {/* Department Tabs */}
          <div className="flex flex-wrap gap-2.5 pt-2 border-t border-[#C5A880]/15">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 cursor-pointer ${
                  selectedDept === dept.id
                    ? 'bg-[#C5A880] text-[#121110] font-bold shadow scale-110'
                    : 'bg-[#141311] text-[#A89884] hover:text-[#EDE8DF] border border-[#C5A880]/20'
                }`}
              >
                {lang === 'bn' ? dept.nameBn : dept.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Teachers Grid */}
        {filteredTeachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="plaque-elevated rounded-xl overflow-hidden border border-[#C5A880]/25 hover:border-[#C5A880]/60 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative h-64 w-full overflow-hidden bg-[#141311] on-dark-media">
                    <UserAvatar
                      src={teacher.photo}
                      name={teacher.name}
                      role="teacher"
                      className="w-full h-full rounded-none object-cover"
                      iconClassName="w-20 h-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-transparent pointer-events-none" />

                    {/* Status & HOD Pill */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {teacher.designation?.toLowerCase().includes('principal') || teacher.designationBn?.includes('অধ্যক্ষ') ? (
                        <span className="px-2.5 py-1 rounded text-[10px] font-mono-tech font-black bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md flex items-center gap-1 uppercase tracking-wider border border-amber-300/40">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>PRINCIPAL / অধ্যক্ষ</span>
                        </span>
                      ) : teacher.isHod ? (
                        <span className="px-2.5 py-1 rounded text-[10px] font-mono-tech font-bold bg-[#BD452F] text-white shadow flex items-center gap-1 uppercase tracking-wider">
                          <Award className="w-3 h-3" />
                          <span>HOD / বিভাগীয় প্রধান</span>
                        </span>
                      ) : null}

                      {teacher.bcsBatch && teacher.bcsBatch !== 'N/A' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
                          {teacher.bcsBatch}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono-tech bg-[#181715]/90 text-[#DFCA9E] border border-[#C5A880]/30 uppercase font-medium">
                        {teacher.deptBn || teacher.department}
                      </span>
                      {teacher.order && (
                        <span className="text-[10px] font-mono-tech text-[#A89884] bg-black/60 px-2 py-0.5 rounded">
                          #{teacher.order}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-serif-regal font-bold text-lg text-[#FDFBF7] group-hover:text-[#DFCA9E] transition-colors leading-tight">
                        {lang === 'bn' ? teacher.nameBn || teacher.name : teacher.name}
                      </h3>
                      <p className="text-xs font-mono-tech text-[#DE644E] mt-0.5 font-semibold">
                        {lang === 'bn' ? teacher.designationBn || teacher.designation : teacher.designation}
                      </p>
                    </div>

                    {/* Quick Meta Row: Phone, District, Joining */}
                    <div className="space-y-1.5 pt-2 border-t border-[#C5A880]/15 text-xs font-mono-tech">
                      {teacher.phone && (
                        <div className="flex items-center gap-2 text-[#DCD3C1]">
                          <Phone className="w-3.5 h-3.5 text-[#DFCA9E] shrink-0" />
                          <a href={`tel:${teacher.phone}`} className="hover:text-[#DFCA9E] hover:underline">
                            {teacher.phone}
                          </a>
                        </div>
                      )}

                      {teacher.email && (
                        <div className="flex items-center gap-2 text-[#A89884] truncate">
                          <Mail className="w-3.5 h-3.5 text-[#DFCA9E] shrink-0" />
                          <a href={`mailto:${teacher.email}`} className="truncate hover:text-[#DFCA9E] hover:underline">
                            {teacher.email}
                          </a>
                        </div>
                      )}

                      {teacher.joiningDate && teacher.joiningDate !== 'N/A' && (
                        <div className="flex items-center gap-2 text-[#A89884]">
                          <Calendar className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                          <span>{lang === 'bn' ? `যোগদান: ${teacher.joiningDate}` : `Joined: ${teacher.joiningDate}`}</span>
                        </div>
                      )}

                      {teacher.homeDistrict && teacher.homeDistrict !== 'N/A' && (
                        <div className="flex items-center gap-2 text-[#A89884]">
                          <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                          <span>{lang === 'bn' ? `নিজ জেলা: ${teacher.homeDistrict}` : `Home District: ${teacher.homeDistrict}`}</span>
                        </div>
                      )}
                    </div>

                    {teacher.officeRoom && (
                      <div className="text-[11px] text-[#A89884] flex items-center gap-2 font-mono-tech pt-1">
                        <Building className="w-3 h-3 text-[#C5A880] shrink-0" />
                        <span className="truncate">{teacher.officeRoom}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 pt-0 border-t border-[#C5A880]/15 mt-2">
                  <div className="flex items-center justify-between gap-2 pt-3">
                    {teacher.phone ? (
                      <a
                        href={`tel:${teacher.phone}`}
                        className="text-[#DFCA9E] hover:underline flex items-center gap-1.5 text-xs font-mono-tech"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'সরাসরি কল' : 'Call'}</span>
                      </a>
                    ) : teacher.email ? (
                      <a
                        href={`mailto:${teacher.email}`}
                        className="text-[#DFCA9E] hover:underline flex items-center gap-1.5 text-xs font-mono-tech"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'ইমেইল' : 'Email'}</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-[#A89884] font-mono-tech">RTEC Faculty</span>
                    )}

                    <button
                      onClick={() => openTeacherModal(teacher)}
                      className="btn-agency px-3.5 py-1.5 rounded text-[11px] font-sans uppercase tracking-wider cursor-pointer"
                    >
                      <span>{lang === 'bn' ? 'বিস্তারিত প্রোফাইল' : 'Full Dossier'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 plaque-elevated rounded-2xl border border-[#C5A880]/20">
            <h3 className="font-serif-regal text-xl text-[#FDFBF7]">
              {lang === 'bn' ? 'কোন শিক্ষক বা কর্মকর্তা পাওয়া যায়নি' : 'No Faculty or Officers Found'}
            </h3>
            <p className="text-xs text-[#A89884] mt-1 font-sans">
              {lang === 'bn' ? 'অনুসন্ধান বা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।' : 'Alter your search keyword or department selection.'}
            </p>
          </div>
        )}

      </div>

      {/* Teacher Detail Dossier Modal mounted via Portal (Synchronized GPU Backdrop + Card) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence
          onExitComplete={() => {
            setSelectedTeacher(null);
            setModalScrollLocked(false);
          }}
        >
          {isModalOpen && selectedTeacher && (
            <>
              <motion.div
                key="teacher-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, pointerEvents: 'none' }}
                transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
                style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
                className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
              />
              <motion.div
                key="teacher-modal-wrapper"
                initial={false}
                animate={{ pointerEvents: 'auto' }}
                exit={{ pointerEvents: 'none' }}
                transition={{ duration: 0.24 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto overscroll-contain"
                onClick={closeTeacherModal}
              >
                <motion.div
                  key="teacher-modal-card"
                  role="dialog"
                  aria-modal="true"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
                  style={{ willChange: 'transform, opacity' }}
                  className="w-full max-w-lg rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#181715] border border-stone-200 dark:border-[#C5A880]/40 relative shadow-2xl my-auto overscroll-contain text-stone-900 dark:text-[#EDE8DF]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={closeTeacherModal}
                    className="absolute top-5 right-5 p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 dark:bg-[#141311] dark:border-[#C5A880]/25 dark:text-[#A89884] dark:hover:text-[#EDE8DF] transition-colors duration-150 cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>

                <div className="flex items-start gap-4 mb-6 pb-4 border-b border-stone-200 dark:border-[#C5A880]/20">
                  <UserAvatar
                    src={selectedTeacher.photo}
                    name={selectedTeacher.name}
                    role="teacher"
                    className="w-24 h-24 rounded-xl border-2 border-stone-300 dark:border-[#C5A880]/40 shadow-md bg-[#121110] object-cover"
                    iconClassName="w-12 h-12"
                  />
                  <div>
                    <h3 className="font-serif-regal font-bold text-xl text-stone-900 dark:text-[#FDFBF7]">
                      {lang === 'bn' ? selectedTeacher.nameBn || selectedTeacher.name : selectedTeacher.name}
                    </h3>
                    <p className="text-xs text-[#DE644E] font-mono-tech mt-0.5 font-bold">
                      {lang === 'bn' ? selectedTeacher.designationBn || selectedTeacher.designation : selectedTeacher.designation}
                    </p>
                    <p className="text-xs text-amber-700 dark:text-[#DFCA9E] font-mono-tech mt-0.5 font-medium">
                      {selectedTeacher.deptBn || selectedTeacher.department}
                    </p>
                    {selectedTeacher.bcsBatch && selectedTeacher.bcsBatch !== 'N/A' && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-mono-tech bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 rounded font-semibold">
                        {selectedTeacher.bcsBatch}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#141311] border border-stone-200 dark:border-[#C5A880]/15 space-y-2.5 text-xs mb-5 font-mono-tech">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 dark:text-[#A89884] font-medium">দপ্তর / OFFICE:</span>
                    <span className="text-stone-900 dark:text-[#FDFBF7] font-bold text-right">{selectedTeacher.office || 'রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ'}</span>
                  </div>
                  {selectedTeacher.officeRoom && (
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 dark:text-[#A89884] font-medium">কক্ষ / CHAMBER:</span>
                      <span className="text-stone-900 dark:text-[#FDFBF7] font-bold text-right">{selectedTeacher.officeRoom}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 dark:text-[#A89884] font-medium">মোবাইল / PHONE:</span>
                    <a href={`tel:${selectedTeacher.phone || selectedTeacher.mobile}`} className="text-amber-800 dark:text-[#DFCA9E] font-bold hover:underline">
                      {selectedTeacher.phone || selectedTeacher.mobile || 'N/A'}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 dark:text-[#A89884] font-medium">ইমেইল / EMAIL:</span>
                    <a href={`mailto:${selectedTeacher.email}`} className="text-amber-800 dark:text-[#DFCA9E] font-bold hover:underline">
                      {selectedTeacher.email || 'N/A'}
                    </a>
                  </div>
                  {selectedTeacher.joiningDate && selectedTeacher.joiningDate !== 'N/A' && (
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 dark:text-[#A89884] font-medium">যোগদানের তারিখ:</span>
                      <span className="text-stone-900 dark:text-[#EDE8DF] font-semibold">{selectedTeacher.joiningDate}</span>
                    </div>
                  )}
                  {selectedTeacher.homeDistrict && selectedTeacher.homeDistrict !== 'N/A' && (
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 dark:text-[#A89884] font-medium">নিজ জেলা:</span>
                      <span className="text-stone-900 dark:text-[#EDE8DF] font-semibold">{selectedTeacher.homeDistrict}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 dark:text-[#A89884] font-medium">স্ট্যাটাস / STATUS:</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {selectedTeacher.status || 'Active Official'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 dark:border-[#C5A880]/20 flex items-center justify-end gap-3">
                  {selectedTeacher.phone && (
                    <a
                      href={`tel:${selectedTeacher.phone || selectedTeacher.mobile}`}
                      className="px-4 py-2.5 rounded-lg text-xs font-sans uppercase tracking-wider inline-flex items-center gap-2 border border-stone-300 dark:border-[#C5A880]/40 text-stone-800 dark:text-[#EDE8DF] hover:bg-stone-100 dark:hover:bg-[#1E1C18] transition font-bold"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'সরাসরি কল' : 'Call'}</span>
                    </a>
                  )}
                  {selectedTeacher.email && (
                    <a
                      href={`mailto:${selectedTeacher.email}`}
                      className="btn-agency btn-agency-terracotta px-5 py-2.5 rounded-lg text-xs font-sans uppercase tracking-wider inline-flex items-center gap-2 font-bold"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'ইমেইল পাঠান' : 'Direct Email'}</span>
                    </a>
                  )}
                </div>

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
