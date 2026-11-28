import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { useScrollLock } from '../utils/useScrollLock.js';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  PlusCircle,
  Building,
  CheckCircle2,
  X,
  Send,
  Sparkles,
  Search,
  Lock,
  ShieldAlert,
  EyeOff
} from 'lucide-react';

export default function Jobs() {
  const { jobs, addJob, submitJobApplication, user, lang = 'en', students = [], alumni = [], mySubmission } = useApp();
  const [selectedJob, setSelectedJob] = useState(null);
  const [postJobModalOpen, setPostJobModalOpen] = useState(false);
  const [graduateGateModalOpen, setGraduateGateModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [salaryMode, setSalaryMode] = useState('negotiable'); // 'negotiable' | 'range'
  const [applyForm, setApplyForm] = useState({
    name: user?.name || '',
    batch: `${user?.batch || '8th Batch'} - ${user?.department || 'Yarn Eng.'}`,
    cvLink: '',
    coverNote: ''
  });

  const JOB_TYPE_LABELS = {
    'Full-time': { bn: 'ফুল-টাইম (Full-time)', en: 'Full-time' },
    'Full Time': { bn: 'ফুল-টাইম (Full Time)', en: 'Full Time' },
    'Internship / Entry Level': { bn: 'ইন্টার্নশিপ / এন্ট্রি লেভেল', en: 'Internship / Entry Level' },
    'Internship': { bn: 'ইন্টার্নশিপ', en: 'Internship' },
    'Remote': { bn: 'রিমোট / অনলাইন', en: 'Remote' },
    'Part Time': { bn: 'পার্ট-টাইম', en: 'Part Time' },
    'Contractual': { bn: 'চুক্তিভিত্তিক', en: 'Contractual' },
    'Management Trainee (MTO)': { bn: 'ম্যানেজমেন্ট ট্রেইনি (MTO)', en: 'Management Trainee (MTO)' }
  };
  const getJobTypeLabel = (typeVal) => {
    const found = JOB_TYPE_LABELS[typeVal];
    if (!found) return typeVal;
    return lang === 'bn' ? found.bn : found.en;
  };

  // Lock background scroll when any job modal is open
  useScrollLock(Boolean(postJobModalOpen || graduateGateModalOpen || selectedJob));

  const isGraduateBatch = (batchStr = '') => {
    const b = String(batchStr).toLowerCase();
    return b.includes('1st') || b.includes('2nd') || b.includes('3rd') || b.includes('১ম') || b.includes('২য়') || b.includes('৩য়');
  };

  const matchedStudent = useMemo(() => {
    if (!user && !mySubmission) return null;
    return students.find(s =>
      (user?.regNo && s.regNo === user.regNo) ||
      (mySubmission?.regNo && s.regNo === mySubmission.regNo) ||
      (user?.email && s.email?.toLowerCase() === user.email.toLowerCase())
    ) || null;
  }, [students, user, mySubmission]);

  const matchedAlumni = useMemo(() => {
    if (!user && !mySubmission) return null;
    return alumni.find(a =>
      (user?.email && a.email?.toLowerCase() === user.email.toLowerCase() && a.isVerified) ||
      (mySubmission?.email && a.email?.toLowerCase() === mySubmission.email.toLowerCase() && a.isVerified)
    ) || null;
  }, [alumni, user, mySubmission]);

  const isApprovedAccount = Boolean(
    user?.role === 'alumni' ||
    mySubmission?.status === 'approved' ||
    user?.submissionStatus === 'approved' ||
    (user?.isVerified && user?.status === 'approved') ||
    matchedAlumni
  );

  // Strict restriction: ONLY verified Graduate Students / Alumni (and never pending users) can post jobs
  const isPendingUser = Boolean(
    user?.submissionStatus === 'pending' ||
    mySubmission?.status === 'pending'
  );
  const isVerifiedGraduate = Boolean(
    user &&
    user.role !== 'guest' &&
    !isPendingUser && (
      user.role === 'admin' ||
      matchedAlumni ||
      (isApprovedAccount && (
        user.role === 'alumni' ||
        user.studentType === 'Graduate' ||
        mySubmission?.studentType === 'Graduate' ||
        matchedStudent?.studentType === 'Graduate' ||
        isGraduateBatch(user.batch || mySubmission?.batch || matchedStudent?.batch)
      ))
    )
  );

  const handleOpenPostJob = () => {
    if (isVerifiedGraduate) {
      setPostJobModalOpen(true);
    } else {
      setGraduateGateModalOpen(true);
    }
  };

  // Search and filter
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // New Job Form State
  const [newJobData, setNewJobData] = useState({
    title: '',
    titleBn: '',
    company: '',
    location: '',
    type: 'Full-time',
    department: 'Yarn Engineering',
    experience: '1-3 Years',
    salary: '',
    deadline: '2026-12-31',
    description: '',
    posterName: user?.name ? `${user.name} (${user.batch || 'Graduate'})` : '',
    posterEmail: user?.email || '',
    requirements: ['B.Sc in Textile Engineering', 'Good communication skills']
  });

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!isVerifiedGraduate) {
      setPostJobModalOpen(false);
      setGraduateGateModalOpen(true);
      return;
    }

    const finalSalary = salaryMode === 'negotiable' || !newJobData.salary.trim()
      ? 'Negotiable'
      : newJobData.salary.trim();

    addJob({
      ...newJobData,
      salary: finalSalary,
      postedBy: newJobData.posterName || (user?.name ? `${user.name} (${user.batch || 'Graduate'})` : 'Alumni Member'),
      postedByEmail: newJobData.posterEmail || user?.email || '',
      status: 'pending'
    });
    setPostJobModalOpen(false);
    setSalaryMode('negotiable');
    setNewJobData(prev => ({
      ...prev,
      title: '',
      titleBn: '',
      company: '',
      location: '',
      salary: '',
      description: ''
    }));
    setToastMessage(
      lang === 'bn'
        ? '✓ আপনার চাকরির সার্কুলার সফলভাবে অ্যাডমিনের কাছে জমা হয়েছে! অ্যাডমিন যাচাই করে অনুমোদন (Approve) করলে এটি সবার জন্য লাইভ হবে।'
        : '✓ Your job circular has been submitted for admin verification! It will go live once approved by an admin.'
    );
    setTimeout(() => setToastMessage(''), 6000);
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (selectedJob) {
      submitJobApplication({
        jobId: selectedJob.id,
        jobTitle: selectedJob.titleBn || selectedJob.title,
        company: selectedJob.company,
        applicantName: applyForm.name || user?.name || 'RTEC Applicant',
        applicantEmail: user?.email || '',
        applicantBatch: applyForm.batch,
        cvLink: applyForm.cvLink,
        coverNote: applyForm.coverNote
      });
    }
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setApplyModalOpen(false);
      setApplyForm(prev => ({ ...prev, cvLink: '', coverNote: '' }));
    }, 2000);
  };

  const filteredJobs = useMemo(() => jobs.filter(j => {
    const isApproved = (j.status || 'approved') === 'approved';
    const matchSearch =
      (j.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (j.company || '').toLowerCase().includes(search.toLowerCase()) ||
      (j.location || '').toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === 'All' || j.type === selectedType;
    return isApproved && matchSearch && matchType;
  }), [jobs, search, selectedType]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-transparent text-[#EDE8DF] py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Post Job Button */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                key="jobs-toast"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.2 }}
                className="system-toast fixed top-36 sm:top-36 right-4 sm:right-8 z-[99999] max-w-md p-4 rounded-2xl border-2 border-emerald-400 bg-[#064E3B] text-white text-xs sm:text-sm font-bold flex items-center gap-3 shadow-2xl"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                <div className="flex-1">{toastMessage}</div>
                <button type="button" onClick={() => setToastMessage('')} className="p-1 hover:text-emerald-200 text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-2">
              <Briefcase className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ক্যারিয়ার ও কর্মসংস্থান' : 'Career Opportunities'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {lang === 'bn' ? 'ক্যারিয়ার ও জব বোর্ড' : 'Career & Job Board'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {lang === 'bn'
                ? 'সিনিয়র অ্যালামনাইদের সরাসরি তত্ত্বাবধানে ও রেফারেন্সে টেক্সটাইল মিলস ও বায়িং হাউসের চাকরির সুযোগ।'
                : 'Textile mill, apparel, and buying house career opportunities shared and referred directly by RTEC senior alumni.'}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <button
              onClick={handleOpenPostJob}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/50 transition hover:scale-105 cursor-pointer"
            >
              {isVerifiedGraduate ? (
                <PlusCircle className="w-4 h-4 text-slate-950" />
              ) : (
                <Lock className="w-4 h-4 text-slate-950" />
              )}
              <span>{lang === 'bn' ? 'নতুন চাকরির বিজ্ঞপ্তি দিন' : 'Post a Job'}</span>
            </button>
            <span className="text-[10px] font-mono text-slate-400">
              {lang === 'bn'
                ? 'শুধুমাত্র গ্র্যাজুয়েট শিক্ষার্থীরা পোস্ট করতে পারবেন • সবাই দেখতে পারবেন'
                : 'Graduates only can post • Everyone can view & apply'}
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 mb-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'bn' ? 'চাকরির পদবি, কোম্পানি বা লোকেশন দিয়ে সার্চ করুন...' : 'Search by job title, company, or location...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:w-56">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="All">{lang === 'bn' ? 'সকল কাজের ধরন' : 'All Job Types'}</option>
              <option value="Full-time">{lang === 'bn' ? 'ফুল-টাইম (Full-time)' : 'Full-time'}</option>
              <option value="Internship / Entry Level">{lang === 'bn' ? 'ইন্টার্নশিপ / এন্ট্রি লেভেল' : 'Internship / Entry Level'}</option>
              <option value="Remote">{lang === 'bn' ? 'রিমোট / অনলাইন' : 'Remote'}</option>
              <option value="Others">{lang === 'bn' ? 'অন্যান্য (Others)' : 'Others'}</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                      {getJobTypeLabel(job.type)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {job.department}
                    </span>
                    {job.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                        {lang === 'bn' ? '★ বিশেষ বিজ্ঞপ্তি' : '★ Featured'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white hover:text-emerald-300 transition-colors">
                    {lang === 'bn' ? (job.titleBn || job.title) : (job.title || job.titleBn)}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-semibold text-white">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>
                        {!job.salary || job.salary.toLowerCase().includes('negotiable')
                          ? (lang === 'bn' ? 'আলোচনা সাপেক্ষে' : 'Negotiable')
                          : job.salary}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'শেষ তারিখ:' : 'Deadline:'} {job.deadline}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 pt-1">
                    {job.description}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-500">
                    {lang === 'bn' ? 'পোস্ট করেছেন:' : 'Posted by:'} <span className="text-emerald-400 font-medium">{job.postedBy}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-col items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setApplyModalOpen(true);
                    }}
                    className="w-full sm:w-36 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow cursor-pointer"
                  >
                    {lang === 'bn' ? 'আবেদন করুন' : 'Apply Now'}
                  </button>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="w-full sm:w-36 py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700/80 transition cursor-pointer"
                  >
                    {lang === 'bn' ? 'বিস্তারিত বিবরণ' : 'View Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/20 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-[#DFCA9E] flex items-center justify-center mx-auto border border-amber-500/25">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-serif-regal font-bold text-[#0C0A09] dark:text-[#FDFBF7]">
              {lang === 'bn' ? 'বর্তমানে কোনো চাকরির বিজ্ঞপ্তি প্রকাশিত নেই' : 'No Active Job Openings'}
            </h3>
            <p className="text-xs text-[#57534E] dark:text-[#A89884] max-w-md mx-auto leading-relaxed">
              {lang === 'bn'
                ? 'নতুন সার্কুলার বা ক্যাম্পাস রিক্রুটমেন্ট বিজ্ঞপ্তি প্রকাশিত হলে তা এখানে প্রদর্শিত হবে। আপনি চাইলে সরাসরি আপনার প্রতিষ্ঠানের চাকরির বিজ্ঞপ্তি শেয়ার করতে পারেন।'
                : 'Verified career opportunities and campus recruitments will be listed here. You can also share job opportunities from your organization.'}
            </p>
            <div className="pt-2">
              <button
                onClick={handleOpenPostJob}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                {isVerifiedGraduate ? <PlusCircle className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>{lang === 'bn' ? 'নতুন চাকরি বা ইন্টার্নশিপ পোস্ট করুন' : 'Post a Job or Internship'}</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Post a Job Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {postJobModalOpen && (
            <motion.div
              key="post-job-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) setPostJobModalOpen(false);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-slate-700 relative shadow-2xl max-h-[90vh] overflow-y-auto overscroll-contain"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setPostJobModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-lg font-bold text-white mb-1">
                  {lang === 'bn' ? 'নতুন চাকরির বিজ্ঞপ্তি / রেফারেন্স পোস্ট করুন' : 'Post a Job Opening or Alumni Referral'}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  {lang === 'bn'
                    ? 'আপনার প্রতিষ্ঠানে উন্মুক্ত পদ সম্পর্কে আরটেকের শিক্ষার্থী ও অ্যালামনাইদের জানান।'
                    : 'Share open positions or referral opportunities at your organization with RTEC students & alumni.'}
                </p>

                <form onSubmit={handlePostSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'পদের নাম *' : 'Job Title *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'bn' ? 'যেমন: Assistant Merchandiser / Quality Officer' : 'e.g., Assistant Merchandiser / Quality Officer'}
                      value={newJobData.title}
                      onChange={(e) => setNewJobData({ ...newJobData, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {lang === 'bn' ? 'কোম্পানির নাম *' : 'Company Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={lang === 'bn' ? 'প্রতিষ্ঠানের নাম' : 'Organization / Mill name'}
                        value={newJobData.company}
                        onChange={(e) => setNewJobData({ ...newJobData, company: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {lang === 'bn' ? 'কাজের লোকেশন *' : 'Job Location *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={lang === 'bn' ? 'যেমন: গাজীপুর / ঢাকা' : 'e.g., Gazipur / Dhaka'}
                        value={newJobData.location}
                        onChange={(e) => setNewJobData({ ...newJobData, location: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {lang === 'bn' ? 'কাজের ধরন' : 'Employment Type'}
                      </label>
                      <select
                        value={newJobData.type}
                        onChange={(e) => setNewJobData({ ...newJobData, type: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Full-time">{lang === 'bn' ? 'ফুল-টাইম (Full-time)' : 'Full-time'}</option>
                        <option value="Internship / Entry Level">{lang === 'bn' ? 'ইন্টার্নশিপ / এন্ট্রি লেভেল' : 'Internship / Entry Level'}</option>
                        <option value="Remote">{lang === 'bn' ? 'রিমোট / অনলাইন' : 'Remote'}</option>
                        <option value="Others">{lang === 'bn' ? 'অন্যান্য (Others)' : 'Others'}</option>
                      </select>
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <label className="block text-xs font-semibold text-slate-300">
                          {lang === 'bn' ? 'বেতন (ঐচ্ছিক)' : 'Salary (Optional)'}
                        </label>
                        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-[10px] font-semibold">
                          <button
                            type="button"
                            onClick={() => {
                              setSalaryMode('negotiable');
                              setNewJobData({ ...newJobData, salary: '' });
                            }}
                            className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                              salaryMode === 'negotiable'
                                ? 'bg-emerald-600 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {lang === 'bn' ? 'গোপন / আলোচনা' : 'Negotiable'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSalaryMode('range')}
                            className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                              salaryMode === 'range'
                                ? 'bg-emerald-600 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {lang === 'bn' ? 'রেঞ্জ দিন' : 'Specify'}
                          </button>
                        </div>
                      </div>
                      {salaryMode === 'negotiable' ? (
                        <div className="w-full px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-700/80 text-xs text-emerald-300 flex items-center gap-1.5">
                          <EyeOff className="w-3.5 h-3.5 shrink-0" />
                          <span>{lang === 'bn' ? 'আলোচনা সাপেক্ষে (বেতন গোপন থাকবে)' : 'Negotiable (Salary kept hidden)'}</span>
                        </div>
                      ) : (
                        <input
                          type="text"
                          placeholder={lang === 'bn' ? 'যেমন: ৳ ৩৫,০০০ - ৳ ৪৫,০০০' : 'e.g., BDT 35,000 - 45,000'}
                          value={newJobData.salary}
                          onChange={(e) => setNewJobData({ ...newJobData, salary: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {lang === 'bn' ? 'আপনার নাম ও পদবি/ব্যাচ *' : 'Your Name & Designation / Batch *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={lang === 'bn' ? 'যেমন: আপনার নাম (ব্যাচ)' : 'e.g., Your Name (Batch)'}
                        value={newJobData.posterName}
                        onChange={(e) => setNewJobData({ ...newJobData, posterName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {lang === 'bn' ? 'যোগাযোগের ইমেইল *' : 'Contact Email *'}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="hr@company.com"
                        value={newJobData.posterEmail}
                        onChange={(e) => setNewJobData({ ...newJobData, posterEmail: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'চাকরির বিবরণ ও আবেদনের নিয়ম *' : 'Job Description & Application Instructions *'}
                    </label>
                    <textarea
                      rows="3"
                      required
                      placeholder={lang === 'bn'
                        ? 'দায়িত্ব, প্রয়োজনীয় যোগ্যতা ও কীভাবে সিভি পাঠাতে হবে...'
                        : 'Key responsibilities, eligibility requirements, and how to submit CV...'}
                      value={newJobData.description}
                      onChange={(e) => setNewJobData({ ...newJobData, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-[11px] leading-relaxed flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {lang === 'bn'
                        ? 'বিজ্ঞপ্তিটি জমা দেওয়ার পর অ্যাডমিন প্যানেলে যাচাইয়ের জন্য যাবে। অ্যাডমিন অনুমোদন (Approve) করলে এটি সবার জন্য প্রকাশিত হবে।'
                        : 'Once submitted, your circular will enter the Admin approval queue and go live after being approved by an administrator.'}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-950/50 cursor-pointer"
                  >
                    {lang === 'bn' ? 'বিজ্ঞপ্তি জমার জন্য পাঠান' : 'Submit for Admin Approval'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Job Details Modal (when View Details is clicked) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedJob && !applyModalOpen && (
            <motion.div
              key="job-details-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedJob(null);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-slate-700 relative overscroll-contain max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30 mb-2">
                  {selectedJob.type} • {selectedJob.department}
                </span>

                <h3 className="text-lg font-bold text-white mb-1">
                  {lang === 'bn' ? (selectedJob.titleBn || selectedJob.title) : (selectedJob.title || selectedJob.titleBn)}
                </h3>
                <p className="text-xs text-emerald-400 font-semibold mb-4">{selectedJob.company}</p>

                <div className="grid grid-cols-2 gap-3 text-xs mb-4 p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{lang === 'bn' ? 'লোকেশন' : 'Location'}</span>
                    <span className="font-semibold text-white">{selectedJob.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{lang === 'bn' ? 'বেতন' : 'Salary'}</span>
                    <span className="font-semibold text-emerald-400">
                      {!selectedJob.salary || selectedJob.salary.toLowerCase().includes('negotiable')
                        ? (lang === 'bn' ? 'আলোচনা সাপেক্ষে' : 'Negotiable')
                        : selectedJob.salary}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{lang === 'bn' ? 'শেষ তারিখ' : 'Deadline'}</span>
                    <span className="font-semibold text-white">{selectedJob.deadline}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{lang === 'bn' ? 'পোস্ট করেছেন' : 'Posted By'}</span>
                    <span className="font-semibold text-emerald-300">{selectedJob.postedBy}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line mb-5">
                  {selectedJob.description}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 cursor-pointer"
                  >
                    {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                  </button>
                  <button
                    onClick={() => setApplyModalOpen(true)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow cursor-pointer"
                  >
                    {lang === 'bn' ? 'আবেদন করুন' : 'Apply Now'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Graduate-Only Job Posting Restriction Gate Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {graduateGateModalOpen && (
            <motion.div
              key="graduate-job-gate-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) setGraduateGateModalOpen(false);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel w-full max-w-md rounded-3xl p-6 border border-amber-500/40 relative shadow-2xl text-center space-y-4 overscroll-contain"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setGraduateGateModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-white">
                  {lang === 'bn'
                    ? 'শুধুমাত্র গ্র্যাজুয়েট শিক্ষার্থীরা জব পোস্ট করতে পারবেন'
                    : 'Graduate Verification Required to Post Jobs'}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'bn'
                    ? 'RTEC জব বোর্ডে নতুন চাকরির বিজ্ঞপ্তি বা রেফারেন্স পোস্ট করার সুবিধা শুধুমাত্র অনুমোদিত গ্র্যাজুয়েট শিক্ষার্থীদের (১ম–৩য় ব্যাচ ও ভেরিফাইড অ্যালামনাই) জন্য সংরক্ষিত। বর্তমান শিক্ষার্থী ও অন্য সবাই প্রকাশিত সব চাকরির বিজ্ঞপ্তি দেখতে ও আবেদন করতে পারবেন।'
                    : 'Posting new job openings on the RTEC Job Board is exclusively restricted to verified Graduate Students (1st–3rd Batch & verified Alumni). Current students and visitors can view all openings and apply directly.'}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  {(!user || user.role === 'guest') ? (
                    <Link
                      to="/auth"
                      onClick={() => setGraduateGateModalOpen(false)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition text-center"
                    >
                      {lang === 'bn' ? 'অ্যাকাউন্ট লগইন করুন' : 'Sign In to Account'}
                    </Link>
                  ) : (
                    <Link
                      to="/student-portal"
                      onClick={() => setGraduateGateModalOpen(false)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition text-center"
                    >
                      {lang === 'bn' ? 'স্টুডেন্ট প্রোফাইল দেখুন' : 'Verify via Student Profile'}
                    </Link>
                  )}
                  <button
                    onClick={() => setGraduateGateModalOpen(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 cursor-pointer"
                  >
                    {lang === 'bn' ? 'ঠিক আছে' : 'Understood'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Apply Now Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {applyModalOpen && selectedJob && (
            <motion.div
              key="apply-job-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) setApplyModalOpen(false);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-700 relative overscroll-contain"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setApplyModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-base font-bold text-white mb-1">
                  {lang === 'bn' ? 'আবেদন:' : 'Apply:'} {lang === 'bn' ? (selectedJob.titleBn || selectedJob.title) : (selectedJob.title || selectedJob.titleBn)}
                </h3>
                <p className="text-xs text-emerald-400 mb-4">{selectedJob.company}</p>

                {appliedSuccess ? (
                  <div className="p-6 text-center bg-emerald-950/40 rounded-2xl border border-emerald-500/40 space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                    <h4 className="font-bold text-white text-sm">
                      {lang === 'bn' ? 'আবেদন সফলভাবে গ্রহণ করা হয়েছে!' : 'Application Submitted Successfully!'}
                    </h4>
                    <p className="text-xs text-slate-300">
                      {lang === 'bn'
                        ? 'আপনার সিভি ও আবেদনপত্রটি সরাসরি পোস্টকারী সিনিয়র প্রকৌশলীর কাছে পাঠানো হয়েছে।'
                        : 'Your CV and application note have been forwarded to the posting alumnus/referrer.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {lang === 'bn' ? 'আপনার নাম' : 'Your Full Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={applyForm.name}
                        onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                        placeholder={lang === 'bn' ? 'আপনার পূর্ণ নাম লিখুন' : 'Enter your full name'}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {lang === 'bn' ? 'ব্যাচ ও ডিপার্টমেন্ট' : 'Batch & Department'}
                      </label>
                      <input
                        type="text"
                        required
                        value={applyForm.batch}
                        onChange={(e) => setApplyForm({ ...applyForm, batch: e.target.value })}
                        placeholder={lang === 'bn' ? 'যেমন: ৫ম ব্যাচ - ইয়ার্ন ইঞ্জিনিয়ারিং' : 'e.g., 5th Batch - Yarn Eng.'}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {lang === 'bn' ? 'সিভি / রেজুমে লিংক (Drive/Dropbox/PDF)' : 'CV / Resume Link (Drive / Dropbox / PDF)'}
                      </label>
                      <input
                        type="url"
                        required
                        value={applyForm.cvLink}
                        onChange={(e) => setApplyForm({ ...applyForm, cvLink: e.target.value })}
                        placeholder="https://drive.google.com/..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {lang === 'bn' ? 'রেফারারের উদ্দেশ্যে ছোট বার্তা (Cover Note)' : 'Cover Note to Referrer'}
                      </label>
                      <textarea
                        rows="3"
                        value={applyForm.coverNote}
                        onChange={(e) => setApplyForm({ ...applyForm, coverNote: e.target.value })}
                        placeholder={lang === 'bn' ? 'আপনার কাজের আগ্রহ ও অভিজ্ঞতা সম্পর্কে লিখুন...' : 'Share your relevant background and interest...'}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow cursor-pointer"
                    >
                      {lang === 'bn' ? 'আবেদন নিশ্চিত করুন' : 'Confirm Application'}
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
