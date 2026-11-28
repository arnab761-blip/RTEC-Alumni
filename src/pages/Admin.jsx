import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext.jsx';
import CloudinaryImageInput from '../components/CloudinaryImageInput.jsx';
import { useScrollLock } from '../utils/useScrollLock.js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  GraduationCap,
  Briefcase,
  Calendar,
  HeartHandshake,
  Newspaper,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Download,
  Award,
  Phone,
  Mail,
  Building,
  Droplet,
  ExternalLink,
  Image as ImageIcon,
  Clock,
  Eye,
  Copy,
  UserCheck,
  MapPin,
  MessageSquareQuote,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  FileText,
  FileSpreadsheet,
  RefreshCw,
  Database
} from 'lucide-react';
import UserAvatar from '../components/UserAvatar.jsx';
import ExcelImportModal from '../components/ExcelImportModal.jsx';
import { downloadStudentTemplate } from '../utils/excelImport.js';
import GoogleSignInModal, { GoogleSignInButton } from '../components/GoogleSignInModal.jsx';

const BATCH_OPTIONS = [
  '1st Batch (2018-19)',
  '2nd Batch (2019-20)',
  '3rd Batch (2020-21)',
  '4th Batch (2021-22)',
  '5th Batch (2022-23)',
  '6th Batch (2023-24)',
  '7th Batch (2024-25)',
  '8th Batch (2025-26)'
];

export default function Admin() {
  const {
    user,
    setUser,
    login,
    lang,
    // Teachers
    teachers = [],
    addTeacher,
    updateTeacher,
    deleteTeacher,
    // Students
    students = [],
    addStudent,
    updateStudent,
    deleteStudent,
    syncWithExcelFile,
    exportExcelFile,
    // Alumni
    alumni = [],
    addAlumni,
    updateAlumni,
    deleteAlumni,
    toggleVerifyAlumni,
    toggleMentorAlumni,
    // Jobs
    jobs = [],
    addJob,
    approveJob,
    declineJob,
    updateJob,
    deleteJob,
    jobApplications = [],
    deleteJobApplication,
    // News
    news = [],
    addNews,
    updateNews,
    deleteNews,
    // Campaigns
    campaigns = [],
    addCampaign,
    updateCampaign,
    deleteCampaign,
    // Forum & Q&A
    forumPosts = [],
    deleteForumPost,
    deleteForumReply,
    // Inquiries & Mentorship
    contactMessages = [],
    updateContactStatus,
    deleteContactMessage,
    mentorshipRequests = [],
    updateMentorshipRequestStatus,
    deleteMentorshipRequest,
    // Logo & Branding
    collegeLogo,
    updateCollegeLogo,
    resetCollegeLogo,
    // Footer & Official Contact Info
    footerContact,
    updateFooterContact,
    resetFooterContact,
    // Student Submissions & Approvals
    studentSubmissions = [],
    approveSubmission,
    declineSubmission,
    deleteSubmission,
    // Forum Approval Actions
    approveForumPost,
    declineForumPost,
    // ID Dispute & Complaint Management
    disputes = [],
    resolveDispute,
    deleteDispute,
    resetStudentClaim,
    // Admin Email Management
    adminEmails = [],
    addAdminEmail,
    removeAdminEmail,
    isAdminEmail,
    googleClientId = '',
    updateGoogleClientId,
    apiBaseUrl = '',
    updateApiBaseUrl,
    mongoStatus,
    checkMongoHealth,
    // System
    resetAllData
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const [toastMessage, setToastMessage] = useState('');
  const [customLogoUrl, setCustomLogoUrl] = useState(collegeLogo || '');
  const [isAdminGoogleModalOpen, setIsAdminGoogleModalOpen] = useState(false);
  const [newAdminEmailInput, setNewAdminEmailInput] = useState('');
  const [newAdminNoteInput, setNewAdminNoteInput] = useState('');
  const [googleClientIdInput, setGoogleClientIdInput] = useState(googleClientId || '');
  const [apiBaseUrlInput, setApiBaseUrlInput] = useState(apiBaseUrl || '');

  // Footer Contact State
  const [footerPhone, setFooterPhone] = useState(footerContact?.phone || '+880 521-55421');
  const [footerEmail, setFooterEmail] = useState(footerContact?.email || 'info@rtec.edu.bd');
  const [footerAddressBn, setFooterAddressBn] = useState(footerContact?.addressBn || 'টুকুরিয়া, পীরগঞ্জ, রংপুর-৫৪২০, বাংলাদেশ');
  const [footerAddressEn, setFooterAddressEn] = useState(footerContact?.addressEn || 'Tukuriya, Pirganj, Rangpur-5420, Bangladesh');

  useEffect(() => {
    if (footerContact) {
      setFooterPhone(footerContact.phone || '+880 521-55421');
      setFooterEmail(footerContact.email || 'info@rtec.edu.bd');
      setFooterAddressBn(footerContact.addressBn || 'টুকুরিয়া, পীরগঞ্জ, রংপুর-৫৪২০, বাংলাদেশ');
      setFooterAddressEn(footerContact.addressEn || 'Tukuriya, Pirganj, Rangpur-5420, Bangladesh');
    }
  }, [footerContact]);

  useEffect(() => {
    setCustomLogoUrl(collegeLogo || '');
  }, [collegeLogo]);

  // Search states for tables
  const [teacherSearch, setTeacherSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [studentBatchFilter, setStudentBatchFilter] = useState('all');
  const [studentDeptFilter, setStudentDeptFilter] = useState('all');
  const [studentPage, setStudentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(25);
  const [isSyncingExcel, setIsSyncingExcel] = useState(false);

  useEffect(() => {
    setStudentPage(1);
  }, [studentSearch, studentBatchFilter, studentDeptFilter, studentsPerPage]);
  const [alumniSearch, setAlumniSearch] = useState('');
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [submissionFilter, setSubmissionFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'declined'
  const [disputeSearch, setDisputeSearch] = useState('');
  const [disputeFilter, setDisputeFilter] = useState('all'); // 'all' | 'pending' | 'resolved'
  const [jobSearch, setJobSearch] = useState('');
  const [jobFilter, setJobFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'declined'
  const [forumSearch, setForumSearch] = useState('');
  const [forumTypeFilter, setForumTypeFilter] = useState('all'); // 'all' | 'question' | 'experience'
  const [forumStatusFilter, setForumStatusFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'declined'
  const [expandedForumPostId, setExpandedForumPostId] = useState(null);

  // Modal states
  const [modalType, setModalType] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewSubmission, setViewSubmission] = useState(null);
  const [declinePrompt, setDeclinePrompt] = useState(null);
  const [isExcelImportOpen, setIsExcelImportOpen] = useState(false);

  // Lock background scroll when any admin modal is open
  useScrollLock(Boolean(modalType || deleteConfirm || viewSubmission || declinePrompt || isExcelImportOpen));

  // Form states
  const [formData, setFormData] = useState({});

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Helper to open create modal
  const handleOpenAdd = (type, defaultData = {}) => {
    setModalType(type);
    setActiveItem(null);
    setFormData(defaultData);
  };

  // Helper to open edit modal
  const handleOpenEdit = (type, item) => {
    setModalType(type);
    setActiveItem(item);
    setFormData({ ...item });
  };

  // Handle form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (modalType === 'addTeacher') {
      addTeacher(formData);
      showToast(lang === 'bn' ? 'নতুন শিক্ষক সফলভাবে যুক্ত করা হয়েছে!' : 'New faculty member added successfully!');
    } else if (modalType === 'editTeacher') {
      updateTeacher(activeItem.id, formData);
      showToast(lang === 'bn' ? 'শিক্ষকের তথ্য আপডেট করা হয়েছে!' : 'Faculty details updated successfully!');
    } else if (modalType === 'addStudent') {
      addStudent(formData);
      showToast(lang === 'bn' ? 'নতুন শিক্ষার্থী সফলভাবে যুক্ত করা হয়েছে!' : 'New student record added successfully!');
    } else if (modalType === 'editStudent') {
      updateStudent(activeItem.id, formData);
      showToast(lang === 'bn' ? 'শিক্ষার্থীর তথ্য আপডেট করা হয়েছে!' : 'Student details updated successfully!');
    } else if (modalType === 'addAlumni') {
      addAlumni(formData);
      showToast(lang === 'bn' ? 'নতুন অ্যালামনাই সফলভাবে যুক্ত করা হয়েছে!' : 'New alumni added successfully!');
    } else if (modalType === 'editAlumni') {
      updateAlumni(activeItem.id, formData);
      showToast(lang === 'bn' ? 'অ্যালামনাই তথ্য আপডেট করা হয়েছে!' : 'Alumni details updated successfully!');
    } else if (modalType === 'addJob') {
      addJob(formData);
      showToast(lang === 'bn' ? 'নতুন চাকরি পোস্ট করা হয়েছে!' : 'Job circular posted successfully!');
    } else if (modalType === 'editJob') {
      updateJob(activeItem.id, formData);
      showToast(lang === 'bn' ? 'চাকরির বিজ্ঞপ্তি আপডেট করা হয়েছে!' : 'Job circular updated successfully!');
    } else if (modalType === 'addNews') {
      addNews(formData);
      showToast(lang === 'bn' ? 'নতুন নোটিশ প্রকাশিত হয়েছে!' : 'Notice published successfully!');
    } else if (modalType === 'editNews') {
      updateNews(activeItem.id, formData);
      showToast(lang === 'bn' ? 'নোটিশ আপডেট করা হয়েছে!' : 'Notice updated successfully!');
    }

    setModalType(null);
    setActiveItem(null);
    setFormData({});
  };

  // Execute delete
  const executeDelete = () => {
    if (!deleteConfirm) return;
    const { type, id, name } = deleteConfirm;

    if (type === 'teacher') {
      deleteTeacher(id);
      showToast(lang === 'bn' ? `${name} - তালিকা থেকে মুছে ফেলা হয়েছে!` : `${name} deleted!`);
    } else if (type === 'student') {
      deleteStudent(id);
      showToast(lang === 'bn' ? `${name} - তালিকা থেকে মুছে ফেলা হয়েছে!` : `${name} deleted!`);
    } else if (type === 'alumni') {
      deleteAlumni(id);
      showToast(lang === 'bn' ? `${name} - তালিকা থেকে মুছে ফেলা হয়েছে!` : `${name} deleted!`);
    } else if (type === 'job') {
      deleteJob(id);
      showToast(lang === 'bn' ? 'চাকরির বিজ্ঞপ্তি মুছে ফেলা হয়েছে!' : 'Job deleted!');
    } else if (type === 'news') {
      deleteNews(id);
      showToast(lang === 'bn' ? 'নোটিশ মুছে ফেলা হয়েছে!' : 'Notice deleted!');
    } else if (type === 'forumPost') {
      deleteForumPost(id);
      showToast(lang === 'bn' ? 'ফোরাম পোস্ট সফলভাবে মুছে ফেলা হয়েছে!' : 'Forum post deleted successfully!');
    } else if (type === 'forumReply') {
      deleteForumReply(deleteConfirm.postId, id);
      showToast(lang === 'bn' ? 'মন্তব্য মুছে ফেলা হয়েছে!' : 'Comment deleted successfully!');
    }

    setDeleteConfirm(null);
  };

  // Filtered queries (Memoized for 60 FPS scrolling & input responsiveness)
  const filteredTeachers = useMemo(() => {
    const q = (teacherSearch || '').toLowerCase().trim();
    return (teachers || []).filter(t => {
      if (!t) return false;
      return (
        !q ||
        t.name?.toLowerCase().includes(q) ||
        t.nameBn?.toLowerCase().includes(q) ||
        t.department?.toLowerCase().includes(q) ||
        t.deptBn?.includes(q) ||
        t.designation?.toLowerCase().includes(q)
      );
    });
  }, [teachers, teacherSearch]);

  const filteredStudents = useMemo(() => {
    if (!Array.isArray(students)) return [];
    const q = (studentSearch || '').toLowerCase().trim();
    return students.filter(s => {
      if (!s) return false;
      const matchesSearch =
        !q ||
        s.name?.toLowerCase().includes(q) ||
        s.nameBn?.toLowerCase().includes(q) ||
        s.regNo?.toLowerCase().includes(q) ||
        s.studentId?.toLowerCase().includes(q) ||
        (s.merit && String(s.merit) === q) ||
        s.batch?.toLowerCase().includes(q) ||
        s.department?.toLowerCase().includes(q) ||
        (s.serialNo && String(s.serialNo) === q);

      const matchesBatch =
        studentBatchFilter === 'all' ||
        s.batch?.toLowerCase().includes(studentBatchFilter.toLowerCase());

      const matchesDept =
        studentDeptFilter === 'all' ||
        s.department?.toLowerCase().includes(studentDeptFilter.toLowerCase());

      return matchesSearch && matchesBatch && matchesDept;
    });
  }, [students, studentSearch, studentBatchFilter, studentDeptFilter]);

  const totalStudentPages = Math.max(1, Math.ceil((filteredStudents.length || 0) / (studentsPerPage === 'all' ? filteredStudents.length || 1 : Number(studentsPerPage))));
  const paginatedStudents = useMemo(() => {
    if (studentsPerPage === 'all') return filteredStudents;
    const size = Number(studentsPerPage);
    const start = (studentPage - 1) * size;
    return filteredStudents.slice(start, start + size);
  }, [filteredStudents, studentPage, studentsPerPage]);

  const filteredAlumni = useMemo(() => {
    const q = (alumniSearch || '').toLowerCase().trim();
    return (alumni || []).filter(a => {
      if (!a) return false;
      return (
        !q ||
        a.name?.toLowerCase().includes(q) ||
        a.nameBn?.toLowerCase().includes(q) ||
        a.batch?.toLowerCase().includes(q) ||
        a.company?.toLowerCase().includes(q) ||
        a.department?.toLowerCase().includes(q)
      );
    });
  }, [alumni, alumniSearch]);

  const pendingSubmissionsCount = useMemo(
    () => (studentSubmissions || []).filter(s => s?.status === 'pending').length,
    [studentSubmissions]
  );

  const filteredSubmissions = useMemo(() => {
    const q = (submissionSearch || '').toLowerCase().trim();
    return (studentSubmissions || []).filter(s => {
      if (!s) return false;
      const matchesFilter = submissionFilter === 'all' || s.status === submissionFilter;
      const matchesSearch =
        !q ||
        s.name?.toLowerCase().includes(q) ||
        s.nameEn?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone?.toLowerCase().includes(q) ||
        s.regNo?.toLowerCase().includes(q) ||
        s.batch?.toLowerCase().includes(q) ||
        s.department?.toLowerCase().includes(q) ||
        s.currentJob?.toLowerCase().includes(q) ||
        s.currentLocation?.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [studentSubmissions, submissionFilter, submissionSearch]);

  const pendingJobsCount = useMemo(
    () => (jobs || []).filter(j => j?.status === 'pending').length,
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const q = (jobSearch || '').toLowerCase().trim();
    return (jobs || []).filter(j => {
      if (!j) return false;
      const jobStatus = j.status || 'approved';
      const matchesFilter = jobFilter === 'all' || jobStatus === jobFilter;
      const matchesSearch =
        !q ||
        j.title?.toLowerCase().includes(q) ||
        j.titleBn?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        j.department?.toLowerCase().includes(q) ||
        j.postedBy?.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [jobs, jobFilter, jobSearch]);

  const pendingDisputesCount = useMemo(
    () => (disputes || []).filter(d => d?.status === 'pending').length,
    [disputes]
  );

  const filteredDisputes = useMemo(() => {
    const q = (disputeSearch || '').toLowerCase().trim();
    return (disputes || []).filter(d => {
      if (!d) return false;
      const matchesFilter = disputeFilter === 'all' || d.status === disputeFilter;
      const matchesSearch =
        !q ||
        d.regNo?.toLowerCase().includes(q) ||
        d.name?.toLowerCase().includes(q) ||
        d.email?.toLowerCase().includes(q) ||
        d.phone?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [disputes, disputeFilter, disputeSearch]);

  const pendingForumPostsCount = useMemo(
    () => (forumPosts || []).filter(p => p?.status === 'pending').length,
    [forumPosts]
  );

  const filteredForumPosts = useMemo(() => {
    const q = (forumSearch || '').toLowerCase().trim();
    return (forumPosts || []).filter((post) => {
      if (!post) return false;
      const postStatus = post.status || 'approved';
      const matchesStatus = forumStatusFilter === 'all' || postStatus === forumStatusFilter;
      const matchesType =
        forumTypeFilter === 'all' ||
        (forumTypeFilter === 'question' && post.type === 'question') ||
        (forumTypeFilter === 'experience' && (post.type === 'experience' || post.type === 'tip'));
      const matchesSearch =
        !q ||
        post.title?.toLowerCase().includes(q) ||
        post.titleBn?.toLowerCase().includes(q) ||
        post.body?.toLowerCase().includes(q) ||
        post.content?.toLowerCase().includes(q) ||
        post.description?.toLowerCase().includes(q) ||
        post.author?.toLowerCase().includes(q) ||
        post.category?.toLowerCase().includes(q) ||
        (post.tags && post.tags.some(t => t.toLowerCase().includes(q)));
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [forumPosts, forumStatusFilter, forumTypeFilter, forumSearch]);

  // Strict Admin Authorization Guard
  if (!user || user.role !== 'admin' || !isAdminEmail?.(user.email)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-md w-full plaque-elevated p-8 rounded-3xl border border-red-500/30 text-center space-y-6 shadow-2xl bg-white dark:bg-[#181715]">
          <div className="w-16 h-16 rounded-3xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-lg shadow-red-950/20">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono-tech px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-700 dark:text-red-300 font-bold uppercase tracking-wider">
              {lang === 'bn' ? 'সংরক্ষিত প্রশাসনিক এলাকা' : 'Restricted Administrative Area'}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif-regal font-black text-[#0C0A09] dark:text-[#FDFBF7]">
              {lang === 'bn' ? 'অফিসিয়াল অ্যাডমিন লগইন প্রয়োজন' : 'Admin Authorization Required'}
            </h2>
            <p className="text-xs text-[#374151] dark:text-[#DCD3C1] font-sans leading-relaxed font-medium">
              {lang === 'bn'
                ? 'এই প্যানেলটি শুধুমাত্র অনুমোদিত কলেজ অ্যাডমিনের জন্য সংরক্ষিত। অনুগ্রহ করে আপনার অনুমোদিত গুগল অ্যাকাউন্ট দিয়ে সাইন ইন করুন।'
                : 'This console is restricted to verified college administrators. Please sign in with your authorized Google account.'}
            </p>
          </div>

          {user && user.role !== 'guest' && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 font-medium">
              {lang === 'bn'
                ? `বর্তমান লগইন: "${user.email}" (এই অ্যাকাউন্টে অ্যাডমিন পারমিশন নেই)`
                : `Logged in as: "${user.email}" (Not an authorized admin account)`}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <GoogleSignInButton
              onClick={() => setIsAdminGoogleModalOpen(true)}
              className="w-full justify-center py-3 text-xs shadow-md"
              text={lang === 'bn' ? 'অ্যাডমিন জিমেইল দিয়ে প্রবেশ করুন' : 'Sign In with Admin Google Account'}
            />

            <Link
              to="/"
              className="block w-full py-2.5 rounded-xl bg-slate-100 dark:bg-[#201E1A] hover:bg-slate-200 dark:hover:bg-[#2A2722] text-slate-700 dark:text-slate-300 text-xs font-bold transition text-center cursor-pointer"
            >
              {lang === 'bn' ? 'হোমপেজে ফিরে যান' : 'Return to Home'}
            </Link>
          </div>

          <GoogleSignInModal
            isOpen={isAdminGoogleModalOpen}
            onClose={() => setIsAdminGoogleModalOpen(false)}
            onSuccess={(usr) => {
              if (isAdminEmail(usr.email)) {
                showToast(lang === 'bn' ? `স্বাগতম অ্যাডমিন! (${usr.email})` : `Welcome Admin! (${usr.email})`);
              } else {
                showToast(lang === 'bn' ? `✕ ${usr.email} অ্যাডমিন হিসেবে অনুমোদিত নয়!` : `✕ ${usr.email} is not authorized as Admin!`);
              }
            }}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      data-admin-panel="true"
      className="min-h-screen bg-transparent text-[#EDE8DF] py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Notification Toast */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                key="admin-toast"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.2 }}
                className="system-toast fixed top-36 sm:top-36 right-4 sm:right-8 z-[99999] max-w-md p-4 rounded-2xl border-2 border-emerald-400 bg-[#064E3B] text-white text-xs sm:text-sm font-bold flex items-center gap-3 shadow-2xl"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                <span className="flex-1">{toastMessage}</span>
                <button
                  type="button"
                  onClick={() => setToastMessage('')}
                  className="p-1 rounded-lg hover:bg-emerald-800/80 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#C5A880]/20">
          <div>
            <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'bn' ? 'এডমিনিস্ট্রেটর কন্ট্রোল ও ম্যানেজমেন্ট প্যানেল' : 'Administrator Control & Management Portal'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#FDFBF7] tracking-tight">
              {lang === 'bn' ? 'আরটেক সেন্ট্রাল এডমিন ড্যাশবোর্ড' : 'RTEC Central Admin Dashboard'}
            </h1>
            <p className="text-xs sm:text-sm text-[#A89884] mt-1">
              {lang === 'bn'
                ? 'শিক্ষক মণ্ডলী, শিক্ষার্থী, অ্যালামনাই (১ম-৮ম ব্যাচ) ও ক্যারিয়ার সার্কুলার সম্পাদন ও নিয়ন্ত্রণ করুন।'
                : 'Manage faculty, students (1st-8th batch), alumni, and job postings with full administrative control.'}
            </p>
          </div>

          {/* Admin Mode Indicator */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-600 text-emerald-950 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping" />
              <span>{lang === 'bn' ? `এডমিন সুবিধা সক্রিয় (${user.name || user.email})` : `Admin Active (${user.name || user.email})`}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pb-4 mb-8 border-b border-[#C5A880]/20">
          {[
            { id: 'overview', labelBn: 'ড্যাশবোর্ড', labelEn: 'Overview', icon: ShieldCheck, count: null },
            {
              id: 'submissions',
              labelBn: 'আবেদন যাচাই',
              labelEn: 'Approvals',
              icon: Clock,
              count: pendingSubmissionsCount,
              isPending: pendingSubmissionsCount > 0
            },
            {
              id: 'disputes',
              labelBn: 'আইডি রিপোর্ট / কমপ্লেইন',
              labelEn: 'ID Disputes',
              icon: ShieldAlert,
              count: pendingDisputesCount,
              isPending: pendingDisputesCount > 0
            },
            { id: 'teachers', labelBn: 'শিক্ষক মণ্ডলী', labelEn: 'Faculty', icon: GraduationCap, count: teachers.length },
            { id: 'students', labelBn: 'শিক্ষার্থী তালিকা', labelEn: 'Students', icon: Users, count: students.length },
            { id: 'alumni', labelBn: 'অ্যালামনাই', labelEn: 'Alumni', icon: Award, count: alumni.length },
            {
              id: 'jobs',
              labelBn: 'জব বোর্ড',
              labelEn: 'Jobs',
              icon: Briefcase,
              count: pendingJobsCount > 0 ? pendingJobsCount : jobs.length,
              isPending: pendingJobsCount > 0
            },
            { id: 'news', labelBn: 'খবর ও নোটিশ', labelEn: 'News & Notices', icon: Newspaper, count: news.length },
            {
              id: 'forum',
              labelBn: 'অভিজ্ঞতা শেয়ার ও ফোরাম',
              labelEn: 'Experience Share',
              icon: MessageSquareQuote,
              count: pendingForumPostsCount > 0 ? pendingForumPostsCount : forumPosts.length,
              isPending: pendingForumPostsCount > 0
            },
            {
              id: 'inquiries',
              labelBn: 'বার্তা ও মেন্টরশিপ',
              labelEn: 'Inbox & Mentorship',
              icon: MessageSquare,
              count: contactMessages.filter(m => m.source !== 'alumni-directory' && m.status !== 'resolved').length + mentorshipRequests.filter(r => r.status === 'pending').length,
              isPending: (contactMessages.filter(m => m.source !== 'alumni-directory' && m.status !== 'resolved').length + mentorshipRequests.filter(r => r.status === 'pending').length) > 0
            },
            { id: 'settings', labelBn: 'সিস্টেম সেটিংস', labelEn: 'Settings', icon: RotateCcw, count: null }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 dark:bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/40 scale-110 border border-emerald-500 z-10'
                    : 'bg-white dark:bg-[#181715] text-[#292524] dark:text-[#DCD3C1] hover:bg-[#F8F4EC] dark:hover:bg-[#201E1A] hover:text-black dark:hover:text-[#FDFBF7] hover:-translate-y-0.5 hover:scale-105 border border-[#C5A880]/30 shadow-sm hover:border-[#C5A880]/50'
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${tab.isPending ? 'text-amber-400 animate-pulse' : ''}`} />
                <span>{lang === 'bn' ? tab.labelBn : tab.labelEn}</span>
                {tab.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    tab.isPending
                      ? (isActive ? 'bg-amber-400 text-slate-950 shadow' : 'bg-amber-500 text-slate-950 animate-pulse')
                      : (isActive ? 'bg-white/20 text-white font-bold' : 'bg-stone-200 dark:bg-[#201E1A] text-stone-800 dark:text-[#A89884]')
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div
              key="tab-overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Pending Submissions Card */}
              <div
                onClick={() => setActiveTab('submissions')}
                className={`cursor-pointer plaque-elevated p-5 rounded-2xl border transition group ${
                  pendingSubmissionsCount > 0
                    ? 'border-amber-500/70 bg-amber-950/20 hover:border-amber-400 shadow-lg shadow-amber-950/30'
                    : 'border-[#C5A880]/20 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Clock className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                    pendingSubmissionsCount > 0 ? 'text-amber-400 animate-pulse' : 'text-[#DFCA9E]'
                  }`} />
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    pendingSubmissionsCount > 0
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-[#C5A880]/20 text-[#DFCA9E]'
                  }`}>
                    {pendingSubmissionsCount > 0 ? `${pendingSubmissionsCount} টি নতুন` : (lang === 'bn' ? 'যাচাই' : 'Verify')}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-[#FDFBF7]">{pendingSubmissionsCount}</h3>
                <p className="text-xs font-bold text-[#DCD3C1] mt-1">{lang === 'bn' ? 'পেন্ডিং আবেদন' : 'Pending Approvals'}</p>
                <p className="text-[11px] text-[#A89884] mt-0.5">{lang === 'bn' ? 'অনুমোদনের অপেক্ষায়' : 'Awaiting Review'}</p>
              </div>

              {/* ID Dispute Reports Card */}
              <div
                onClick={() => setActiveTab('disputes')}
                className={`cursor-pointer plaque-elevated p-5 rounded-2xl border transition group ${
                  pendingDisputesCount > 0
                    ? 'border-red-500/70 bg-red-950/30 hover:border-red-400 shadow-lg shadow-red-950/40'
                    : 'border-[#C5A880]/20 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <ShieldAlert className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                    pendingDisputesCount > 0 ? 'text-rose-400 animate-pulse' : 'text-[#DFCA9E]'
                  }`} />
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    pendingDisputesCount > 0
                      ? 'bg-rose-500 text-white shadow'
                      : 'bg-[#C5A880]/20 text-[#DFCA9E]'
                  }`}>
                    {pendingDisputesCount > 0 ? `${pendingDisputesCount} টি অভিযোগ` : (lang === 'bn' ? 'অভিযোগ' : 'Disputes')}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-[#FDFBF7]">{pendingDisputesCount}</h3>
                <p className="text-xs font-bold text-[#DCD3C1] mt-1">{lang === 'bn' ? 'আইডি বিরোধ ও কমপ্লেইন' : 'ID Dispute Reports'}</p>
                <p className="text-[11px] text-[#A89884] mt-0.5">{lang === 'bn' ? '১-ক্লিকে ভুয়া আইডি রিসেট' : '1-Click Reg Reset'}</p>
              </div>

              <div
                onClick={() => setActiveTab('teachers')}
                className="cursor-pointer plaque-elevated p-5 rounded-2xl border border-[#C5A880]/20 hover:border-emerald-500/50 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <GraduationCap className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50 font-bold">
                    {lang === 'bn' ? 'ব্যবস্থাপনা' : 'Manage'}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-[#FDFBF7]">{teachers.length}</h3>
                <p className="text-xs font-bold text-[#DCD3C1] mt-1">{lang === 'bn' ? 'শিক্ষক মণ্ডলী' : 'Total Faculty'}</p>
                <p className="text-[11px] text-[#A89884] mt-0.5">{lang === 'bn' ? 'প্রফেসর ও বিভাগীয় প্রধান' : 'Professors & HODs'}</p>
              </div>

              <div
                onClick={() => setActiveTab('students')}
                className="cursor-pointer plaque-elevated p-5 rounded-2xl border border-[#C5A880]/20 hover:border-teal-500/50 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-6 h-6 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950/50 text-teal-900 dark:text-teal-300 border border-teal-300 dark:border-teal-700/50 font-bold">
                    {lang === 'bn' ? 'ব্যবস্থাপনা' : 'Manage'}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-[#FDFBF7]">{students.length}</h3>
                <p className="text-xs font-bold text-[#DCD3C1] mt-1">{lang === 'bn' ? 'বর্তমান শিক্ষার্থী' : 'Current Students'}</p>
                <p className="text-[11px] text-[#A89884] mt-0.5">{lang === 'bn' ? '১ম থেকে ৮ম ব্যাচ' : '1st to 8th Batch'}</p>
              </div>

              <div
                onClick={() => setActiveTab('alumni')}
                className="cursor-pointer plaque-elevated p-5 rounded-2xl border border-[#C5A880]/20 hover:border-sky-500/50 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-6 h-6 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/50 text-sky-900 dark:text-sky-300 border border-sky-300 dark:border-sky-700/50 font-bold">
                    {lang === 'bn' ? 'ব্যবস্থাপনা' : 'Manage'}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-[#FDFBF7]">{alumni.length}</h3>
                <p className="text-xs font-bold text-[#DCD3C1] mt-1">{lang === 'bn' ? 'নিবন্ধিত অ্যালামনাই' : 'Registered Alumni'}</p>
                <p className="text-[11px] text-[#A89884] mt-0.5">{lang === 'bn' ? '১ম - ৮ম ব্যাচ' : '1st - 8th Batch'}</p>
              </div>

              {/* Jobs Card */}
              <div
                onClick={() => setActiveTab('jobs')}
                className="cursor-pointer plaque-elevated p-5 rounded-2xl border border-[#C5A880]/20 hover:border-amber-500/50 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Briefcase className="w-6 h-6 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 font-bold">
                    {lang === 'bn' ? 'ব্যবস্থাপনা' : 'Manage'}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-[#FDFBF7]">{jobs.length}</h3>
                <p className="text-xs font-bold text-[#DCD3C1] mt-1">{lang === 'bn' ? 'সক্রিয় চাকরির সার্কুলার' : 'Active Jobs'}</p>
                <p className="text-[11px] text-[#A89884] mt-0.5">{lang === 'bn' ? 'টেক্সটাইল ইন্ড্রাস্ট্রিজ' : 'Textile Mills'}</p>
              </div>

              {/* News & Notices Card */}
              <div
                onClick={() => setActiveTab('news')}
                className="cursor-pointer plaque-elevated p-5 rounded-2xl border border-[#C5A880]/20 hover:border-emerald-500/50 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Newspaper className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50 font-bold">
                    {lang === 'bn' ? 'ব্যবস্থাপনা' : 'Manage'}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-[#FDFBF7]">{news.length}</h3>
                <p className="text-xs font-bold text-[#DCD3C1] mt-1">{lang === 'bn' ? 'খবর ও নোটিশ' : 'News & Notices'}</p>
                <p className="text-[11px] text-[#A89884] mt-0.5">{lang === 'bn' ? 'নোটিশ ও সাম্প্রতিক বিজ্ঞপ্তি' : 'Campus Circulars'}</p>
              </div>

              {/* Forum Card */}
              <div
                onClick={() => setActiveTab('forum')}
                className="cursor-pointer plaque-elevated p-5 rounded-2xl border border-[#C5A880]/20 hover:border-teal-500/50 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <MessageSquareQuote className="w-6 h-6 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950/50 text-teal-900 dark:text-teal-300 border border-teal-300 dark:border-teal-700/50 font-bold">
                    {lang === 'bn' ? 'মডারেশন' : 'Moderate'}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-[#FDFBF7]">{forumPosts.length}</h3>
                <p className="text-xs font-bold text-[#DCD3C1] mt-1">{lang === 'bn' ? 'অভিজ্ঞতা শেয়ার ও ফোরাম' : 'Experience Share'}</p>
                <p className="text-[11px] text-[#A89884] mt-0.5">{lang === 'bn' ? 'ক্যারিয়ার ও বাস্তব গল্প' : 'Career Stories & Tips'}</p>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="p-6 rounded-3xl plaque-elevated border border-[#C5A880]/20">
              <h3 className="text-sm font-bold text-[#FDFBF7] mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'bn' ? 'দ্রুত শর্টকাট (Quick Shortcuts)' : 'Quick Action Shortcuts'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => setActiveTab('submissions')}
                  className="p-3.5 rounded-xl bg-[#181715] hover:bg-[#201E1A] border border-amber-500/40 text-left transition hover:border-amber-400 flex items-center gap-3 cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#FDFBF7]">{lang === 'bn' ? 'আবেদন যাচাই করুন' : 'Verify Submissions'}</p>
                    <span className="text-[10px] text-amber-300 font-bold">{pendingSubmissionsCount} Pending</span>
                  </div>
                </button>
                <button
                  onClick={() => handleOpenAdd('addTeacher', {
                    name: '',
                    nameBn: '',
                    designation: 'Assistant Professor',
                    designationBn: 'সহকারী অধ্যাপক',
                    department: 'Yarn Engineering',
                    deptBn: 'ইয়ার্ন ইঞ্জিনিয়ারিং',
                    email: '',
                    phone: '',
                    education: 'B.Sc. in Textile Engineering (BUTEX)',
                    research: '',
                    officeRoom: 'Academic Building'
                  })}
                  className="p-3.5 rounded-xl bg-[#181715] hover:bg-[#201E1A] border border-[#C5A880]/20 text-left transition hover:border-emerald-500/40 flex items-center gap-3 cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#FDFBF7]">{lang === 'bn' ? 'নতুন শিক্ষক যোগ করুন' : 'Add Teacher'}</p>
                    <span className="text-[10px] text-[#A89884]">{lang === 'bn' ? 'অনুষদ সদস্য যুক্ত করুন' : 'Add Faculty Member'}</span>
                  </div>
                </button>

                <button
                  onClick={() => handleOpenAdd('addStudent', {
                    name: '',
                    nameBn: '',
                    regNo: '',
                    batch: '8th Batch (2025-26)',
                    department: 'Yarn Engineering',
                    deptBn: 'ইয়ার্ন ইঞ্জিনিয়ারিং',
                    session: '2025-2026',
                    year: '1st Year (2nd Semester)',
                    bloodGroup: 'B+',
                    email: '',
                    phone: '',
                    avatar: '',
                    role: 'Student Member'
                  })}
                  className="p-3.5 rounded-xl bg-[#181715] hover:bg-[#201E1A] border border-[#C5A880]/20 text-left transition hover:border-teal-500/40 flex items-center gap-3 cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#FDFBF7]">{lang === 'bn' ? 'নতুন শিক্ষার্থী যুক্ত করুন' : 'Add Student'}</p>
                    <span className="text-[10px] text-[#A89884]">{lang === 'bn' ? '১ম - ৮ম ব্যাচ' : '1st - 8th Batch'}</span>
                  </div>
                </button>

                <button
                  onClick={() => handleOpenAdd('addAlumni', {
                    name: '',
                    nameBn: '',
                    batch: '1st Batch (2018-19)',
                    passingYear: '2023',
                    department: 'Fabric Engineering',
                    deptBn: 'ফ্যাব্রিক ইঞ্জিনিয়ারিং',
                    role: 'Senior Executive',
                    company: '',
                    location: 'Dhaka, Bangladesh',
                    email: '',
                    phone: '',
                    avatar: '',
                    bio: '',
                    isVerified: true,
                    isMentor: false
                  })}
                  className="p-3.5 rounded-xl bg-[#181715] hover:bg-[#201E1A] border border-[#C5A880]/20 text-left transition hover:border-sky-500/40 flex items-center gap-3 cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#FDFBF7]">{lang === 'bn' ? 'নতুন অ্যালামনাই যোগ করুন' : 'Add Alumni'}</p>
                    <span className="text-[10px] text-[#A89884]">{lang === 'bn' ? '১ম - ৮ম ব্যাচ' : '1st - 8th Batch'}</span>
                  </div>
                </button>

                <button
                  onClick={() => handleOpenAdd('addJob', {
                    title: '',
                    titleBn: '',
                    company: '',
                    location: 'Dhaka',
                    type: 'Full-time',
                    salary: 'Negotiable',
                    deadline: '2026-12-31',
                    department: 'Yarn Engineering',
                    description: ''
                  })}
                  className="p-3.5 rounded-xl bg-[#181715] hover:bg-[#201E1A] border border-[#C5A880]/20 text-left transition hover:border-amber-500/40 flex items-center gap-3 cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#FDFBF7]">{lang === 'bn' ? 'নতুন চাকরি পোস্ট করুন' : 'Post Job'}</p>
                    <span className="text-[10px] text-[#A89884]">{lang === 'bn' ? 'চাকরি ও ক্যারিয়ার বিজ্ঞপ্তি' : 'Career Opening'}</span>
                  </div>
                </button>

                <button
                  onClick={() => handleOpenAdd('addNews', {
                    title: '',
                    titleBn: '',
                    category: 'Academic Notice',
                    summaryBn: '',
                    summary: '',
                    contentBn: '',
                    content: '',
                    date: lang === 'bn' ? '১৯ নভেম্বর, ২০২৬' : '19 Nov, 2026',
                    pdfUrl: '',
                    image: '',
                    isPinned: false
                  })}
                  className="p-3.5 rounded-xl bg-[#181715] hover:bg-[#201E1A] border border-[#C5A880]/20 text-left transition hover:border-emerald-500/40 flex items-center gap-3 cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#FDFBF7]">{lang === 'bn' ? 'নতুন খবর / নোটিশ প্রকাশ' : 'Publish News'}</p>
                    <span className="text-[10px] text-[#A89884]">{lang === 'bn' ? 'খবর ও অফিসিয়াল নোটিশ' : 'News & Notices'}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Preview Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Teachers */}
              <div className="p-5 rounded-3xl plaque-elevated border border-[#C5A880]/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-[#FDFBF7] uppercase tracking-wider flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'bn' ? 'শিক্ষক মণ্ডলী' : 'Recent Faculty'}</span>
                  </h4>
                  <button onClick={() => setActiveTab('teachers')} className="text-xs text-emerald-400 hover:underline">
                    {lang === 'bn' ? `সবগুলো (${teachers.length})` : `View All (${teachers.length})`}
                  </button>
                </div>
                <div className="space-y-2.5">
                  {teachers.slice(0, 4).map((t) => (
                    <div key={t.id} className="p-3 rounded-xl bg-[#181715] border border-[#C5A880]/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={t.photo} alt={t.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-[#FDFBF7]">{lang === 'bn' ? t.nameBn || t.name : t.name}</p>
                          <p className="text-[10px] text-[#A89884]">{lang === 'bn' ? t.designationBn : t.designation} • {lang === 'bn' ? t.deptBn : t.department}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenEdit('editTeacher', t)}
                        className="p-1.5 rounded-lg bg-[#201E1A] hover:bg-[#25221E] text-[#DCD3C1]"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Students */}
              <div className="p-5 rounded-3xl plaque-elevated border border-[#C5A880]/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-[#FDFBF7] uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-400" />
                    <span>{lang === 'bn' ? 'শিক্ষার্থী তালিকা' : 'Recent Students'}</span>
                  </h4>
                  <button onClick={() => setActiveTab('students')} className="text-xs text-teal-400 hover:underline">
                    {lang === 'bn' ? `সবগুলো (${students.length})` : `View All (${students.length})`}
                  </button>
                </div>
                <div className="space-y-2.5">
                  {students.slice(0, 4).map((s) => (
                    <div key={s.id} className="p-3 rounded-xl bg-[#181715] border border-[#C5A880]/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-[#FDFBF7]">{lang === 'bn' ? s.nameBn || s.name : s.name}</p>
                          <p className="text-[10px] text-[#A89884] font-mono">
                            {lang === 'bn' ? `রেজি: ${s.regNo || 'N/A'}` : `Reg: ${s.regNo || 'N/A'}`} • {s.batch}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenEdit('editStudent', s)}
                        className="p-1.5 rounded-lg bg-[#201E1A] hover:bg-[#25221E] text-[#DCD3C1]"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </motion.div>
          )}

          {/* TAB 1.5: STUDENT & ALUMNI SUBMISSIONS & APPROVALS */}
          {activeTab === 'submissions' && (
            <motion.div
              key="tab-submissions"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#FDFBF7]">
                    {lang === 'bn' ? 'শিক্ষার্থী আবেদন ও প্রোফাইল যাচাই' : 'Student Submissions & Approval Desk'}
                  </h3>
                  {pendingSubmissionsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500 text-slate-950 animate-pulse">
                      {pendingSubmissionsCount} {lang === 'bn' ? 'পেন্ডিং' : 'Pending'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#A89884] mt-0.5 max-w-2xl">
                  {lang === 'bn'
                    ? 'শিক্ষার্থীরা জিমেইল ও রেজিস্ট্রেশন দিয়ে যেসকল তথ্য জমা দিয়েছে তা পর্যালোচনা করুন। এক-ক্লিকে অনুমোদন (Approve) বা প্রত্যাখ্যান (Decline) করুন।'
                    : 'Review self-submitted student profiles. Approve to immediately list in the directory, or decline with feedback.'}
                </p>
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#141311] border border-[#C5A880]/20 text-xs font-sans">
                {[
                  { id: 'all', labelBn: `সবগুলো (${studentSubmissions.length})`, labelEn: `All (${studentSubmissions.length})` },
                  { id: 'pending', labelBn: `⏳ পেন্ডিং (${pendingSubmissionsCount})`, labelEn: `⏳ Pending (${pendingSubmissionsCount})` },
                  { id: 'approved', labelBn: `✅ অনুমোদিত (${studentSubmissions.filter(s => s.status === 'approved').length})`, labelEn: `Approved` },
                  { id: 'declined', labelBn: `❌ প্রত্যাখ্যাত (${studentSubmissions.filter(s => s.status === 'declined').length})`, labelEn: `Declined` }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSubmissionFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      submissionFilter === f.id
                        ? 'bg-[#C5A880] text-slate-950 shadow font-extrabold'
                        : 'text-[#A89884] hover:text-[#EDE8DF]'
                    }`}
                  >
                    {lang === 'bn' ? f.labelBn : f.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Filter */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89884]" />
              <input
                type="text"
                value={submissionSearch}
                onChange={(e) => setSubmissionSearch(e.target.value)}
                placeholder={lang === 'bn' ? 'নাম, রেজি. নং, জিমেইল বা ব্যাচ দিয়ে খুঁজুন...' : 'Search by name, reg no, gmail or batch...'}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] placeholder-[#A89884]/60 font-sans focus:outline-none focus:border-[#C5A880]"
              />
              {submissionSearch && (
                <button
                  onClick={() => setSubmissionSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89884] hover:text-[#EDE8DF]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Submissions Table / Cards */}
            {filteredSubmissions.length > 0 ? (
              <div className="rounded-2xl plaque-elevated border border-[#C5A880]/25 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#141311] text-[#A89884] border-b border-[#C5A880]/20 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-4">{lang === 'bn' ? 'শিক্ষার্থীর নাম ও ছবি' : 'Student & Photo'}</th>
                        <th className="p-4">{lang === 'bn' ? 'জিমেইল ও ফোন' : 'Gmail & Phone'}</th>
                        <th className="p-4">{lang === 'bn' ? 'রেজি. নং ও ব্যাচ' : 'Reg No & Batch'}</th>
                        <th className="p-4">{lang === 'bn' ? 'চাকরি ও অবস্থান' : 'Job & Location'}</th>
                        <th className="p-4">{lang === 'bn' ? 'আবেদনের অবস্থা' : 'Status'}</th>
                        <th className="p-4 text-right">{lang === 'bn' ? 'সিদ্ধান্ত / অ্যাকশন' : 'Decision Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C5A880]/15">
                      {filteredSubmissions.map((sub) => {
                        const isPending = sub.status === 'pending';
                        const isApproved = sub.status === 'approved';
                        const isDeclined = sub.status === 'declined';

                        return (
                          <tr key={sub.id} className="hover:bg-[#1E1C18]/40 transition">
                            {/* Student Name & Avatar */}
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <UserAvatar
                                  src={sub.avatar}
                                  name={sub.name}
                                  role="student"
                                  className="w-10 h-10 rounded-xl shrink-0 border border-[#C5A880]/25 bg-[#121110]"
                                />
                                <div className="min-w-0">
                                  <p className="font-bold text-[#FDFBF7] truncate">{sub.name || (lang === 'bn' ? 'নাম নেই' : 'Unnamed')}</p>
                                  {sub.nameEn && sub.nameEn !== sub.name && (
                                    <p className="text-[11px] text-[#A89884] truncate">{sub.nameEn}</p>
                                  )}
                                  <span className="text-[10px] text-[#A89884] font-mono-tech block">
                                    {sub.submittedAt}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Gmail & Phone */}
                            <td className="p-4 space-y-1">
                              <div className="flex items-center gap-1.5 text-[#DFCA9E] font-mono-tech truncate">
                                <Mail className="w-3.5 h-3.5 text-[#A89884] shrink-0" />
                                <a href={`mailto:${sub.email}`} className="hover:underline truncate max-w-[170px]" title={sub.email}>
                                  {sub.email || 'N/A'}
                                </a>
                              </div>
                              {sub.phone && (
                                <div className="flex items-center gap-1.5 text-[#DCD3C1] font-mono-tech text-[11px]">
                                  <Phone className="w-3 h-3 text-[#A89884] shrink-0" />
                                  <a href={`tel:${sub.phone}`} className="hover:underline">
                                    {sub.phone}
                                  </a>
                                </div>
                              )}
                            </td>

                            {/* Reg No & Batch */}
                            <td className="p-4 space-y-0.5">
                              <span className="px-2 py-0.5 rounded font-mono-tech font-bold text-[11px] bg-[#141311] text-[#DFCA9E] border border-[#C5A880]/25 inline-block">
                                {sub.regNo ? (lang === 'bn' ? `রেজি: ${sub.regNo}` : `Reg: ${sub.regNo}`) : (lang === 'bn' ? 'রেজি: N/A' : 'Reg: N/A')}
                              </span>
                              <p className="text-[11px] text-[#DCD3C1] truncate">{sub.batch}</p>
                              <p className="text-[10px] text-[#A89884] truncate">{lang === 'bn' ? (sub.deptBn || sub.department) : (sub.department || sub.deptBn)}</p>
                            </td>

                            {/* Job & Location */}
                            <td className="p-4 space-y-0.5 max-w-[220px]">
                              <div className="flex items-start gap-1 text-[#DCD3C1] text-xs font-semibold">
                                <Briefcase className="w-3 h-3 text-[#DFCA9E] shrink-0 mt-0.5" />
                                <span className="truncate">
                                  {sub.designation && sub.company
                                    ? `${sub.designation} — ${sub.company}`
                                    : (sub.currentJob || sub.designation || sub.company || (lang === 'bn' ? 'অধ্যয়নরত' : 'Student'))}
                                </span>
                              </div>
                              {sub.jobSector && (
                                <span className="inline-block text-[10px] font-mono-tech text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                  {sub.jobSector}
                                </span>
                              )}
                              {(sub.workLocation || sub.currentLocation) && (
                                <div className="flex items-center gap-1 text-[#A89884] text-[11px]">
                                  <MapPin className="w-3 h-3 text-[#DE644E] shrink-0" />
                                  <span className="truncate">{sub.workLocation || sub.currentLocation}</span>
                                </div>
                              )}
                            </td>

                            {/* Status */}
                            <td className="p-4">
                              {isPending && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                  <span>{lang === 'bn' ? 'অপেক্ষমাণ' : 'Pending'}</span>
                                </span>
                              )}
                              {isApproved && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                  <span>{lang === 'bn' ? 'অনুমোদিত' : 'Approved'}</span>
                                </span>
                              )}
                              {isDeclined && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700/60">
                                  <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                  <span>{lang === 'bn' ? 'প্রত্যাখ্যাত' : 'Declined'}</span>
                                </span>
                              )}
                            </td>

                            {/* Decision Action Buttons */}
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* View Details Modal Trigger */}
                                <button
                                  onClick={() => setViewSubmission(sub)}
                                  className="btn-action-view p-2 rounded-lg text-xs"
                                  title={lang === 'bn' ? 'পূর্ণ বিবরণ দেখুন' : 'View Full Details'}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                {/* Approve Button */}
                                {!isApproved && (
                                  <button
                                    onClick={() => {
                                      approveSubmission(sub.id);
                                      showToast(lang === 'bn' ? `✓ ${sub.name || 'শিক্ষার্থী'}-এর আবেদন অনুমোদিত এবং ডিরেক্টরিতে যুক্ত হয়েছে!` : `✓ Approved ${sub.name}!`);
                                    }}
                                    className="btn-approve px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer shrink-0"
                                    title={lang === 'bn' ? 'অনুমোদন করুন' : 'Approve Submission'}
                                  >
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                    <span className="font-bold">{lang === 'bn' ? 'অনুমোদন' : 'Approve'}</span>
                                  </button>
                                )}

                                {/* Decline Button */}
                                {!isDeclined && (
                                  <button
                                    onClick={() => setDeclinePrompt(sub)}
                                    className="btn-decline px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer shrink-0"
                                    title={lang === 'bn' ? 'প্রত্যাখ্যান করুন' : 'Decline Submission'}
                                  >
                                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                    <span className="font-bold">{lang === 'bn' ? 'ডিক্লাইন' : 'Decline'}</span>
                                  </button>
                                )}

                                {/* Delete Button */}
                                <button
                                  onClick={() => {
                                    if (window.confirm(lang === 'bn' ? 'আপনি কি এই আবেদন রেকর্ডটি মুছে ফেলতে চান?' : 'Delete this submission?')) {
                                      deleteSubmission(sub.id);
                                      showToast(lang === 'bn' ? 'আবেদন রেকর্ড মুছে ফেলা হয়েছে' : 'Submission removed');
                                    }
                                  }}
                                  className="btn-action-delete p-2 rounded-lg text-xs cursor-pointer"
                                  title={lang === 'bn' ? 'রেকর্ড মুছুন' : 'Delete Record'}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-2xl plaque-elevated border border-[#C5A880]/25 text-center max-w-md mx-auto">
                <Clock className="w-10 h-10 text-[#A89884] mx-auto mb-3" />
                <h4 className="font-bold text-base text-[#FDFBF7]">
                  {lang === 'bn' ? 'কোনো আবেদন পাওয়া যায়নি' : 'No Submissions Found'}
                </h4>
                <p className="text-xs text-[#A89884] mt-1 font-sans">
                  {lang === 'bn'
                    ? 'শিক্ষার্থীরা যখন স্টুডেন্ট প্রোফাইল থেকে নিজস্ব তথ্য জমা দিবে, তখন তা এখানে প্রদর্শিত হবে।'
                    : 'When students submit their profiles from Student Profile, they will appear here for review.'}
                </p>
              </div>
            )}
            </motion.div>
          )}

          {/* TAB 1.7: ID DISPUTE & FRAUD CLAIM MANAGEMENT */}
          {activeTab === 'disputes' && (
            <motion.div
              key="tab-disputes"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#FDFBF7]">
                    {lang === 'bn' ? 'শিক্ষার্থী আইডি বিরোধ ও কমপ্লেইন ডেস্ক' : 'Student ID Dispute & Fraud Claims'}
                  </h3>
                  {pendingDisputesCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-600 text-white animate-pulse">
                      {pendingDisputesCount} {lang === 'bn' ? 'টি নতুন অভিযোগ' : 'Pending'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#A89884] mt-0.5 max-w-2xl leading-relaxed">
                  {lang === 'bn'
                    ? 'যেসব শিক্ষার্থী অভিযোগ করেছে যে তাদের রেজিস্ট্রেশন নম্বর অন্য কেউ ভুয়া তথ্য দিয়ে ব্যবহার করেছে, তাদের তালিকা নিচে দেখুন। "১-ক্লিকে রিসেট ও ভুয়া ক্লেইম বাতিল" বাটনে চাপলে স্বয়ংক্রিয়ভাবে সেই নম্বরের ভুয়া সাবমিশন ও ডেটা ডিলিট হয়ে যাবে এবং আসল শিক্ষার্থীর জন্য আইডিটি উন্মুক্ত হয়ে যাবে।'
                    : 'Review ID claims disputed by real students. Click "Reset Registration" to instantly wipe imposter submissions and free up the ID.'}
                </p>
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#141311] border border-[#C5A880]/20 text-xs font-sans">
                {[
                  { id: 'all', labelBn: `সবগুলো (${disputes.length})`, labelEn: `All (${disputes.length})` },
                  { id: 'pending', labelBn: `⏳ অপেক্ষমাণ (${pendingDisputesCount})`, labelEn: `⏳ Pending (${pendingDisputesCount})` },
                  { id: 'resolved', labelBn: `✅ সমাধানকৃত (${disputes.filter(d => d.status === 'resolved').length})`, labelEn: `Resolved` }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setDisputeFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      disputeFilter === f.id
                        ? 'bg-[#C5A880] text-slate-950 shadow font-extrabold'
                        : 'text-[#A89884] hover:text-[#EDE8DF]'
                    }`}
                  >
                    {lang === 'bn' ? f.labelBn : f.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Filter */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89884]" />
              <input
                type="text"
                value={disputeSearch}
                onChange={(e) => setDisputeSearch(e.target.value)}
                placeholder={lang === 'bn' ? 'রেজিস্ট্রেশন, শিক্ষার্থীর নাম, ফোন বা ইমেইল দিয়ে খুঁজুন...' : 'Search by reg no, student name, phone or email...'}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] placeholder-[#A89884]/60 font-sans focus:outline-none focus:border-[#C5A880]"
              />
              {disputeSearch && (
                <button
                  onClick={() => setDisputeSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89884] hover:text-[#EDE8DF]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Disputes Table */}
            {filteredDisputes.length > 0 ? (
              <div className="plaque-elevated rounded-2xl border border-[#C5A880]/25 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#C5A880]/20 bg-[#141311] text-[#A89884] font-mono-tech uppercase text-[10px]">
                        <th className="p-4">{lang === 'bn' ? 'বিরোধপূর্ণ রেজি. নং' : 'Disputed Reg. No'}</th>
                        <th className="p-4">{lang === 'bn' ? 'আসল শিক্ষার্থীর নাম ও তথ্য' : 'True Owner Details'}</th>
                        <th className="p-4">{lang === 'bn' ? 'অভিযোগের বিবরণ / কারণ' : 'Dispute Reason / Description'}</th>
                        <th className="p-4">{lang === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                        <th className="p-4 text-right">{lang === 'bn' ? '১-ক্লিক অ্যাকশন' : '1-Click Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C5A880]/15">
                      {filteredDisputes.map((disp) => {
                        const isPending = disp.status === 'pending';
                        const isResolved = disp.status === 'resolved';

                        return (
                          <tr key={disp.id} className="hover:bg-[#181715]/70 transition">
                            {/* Reg No */}
                            <td className="p-4 align-top">
                              <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono font-bold text-xs">
                                #{disp.regNo}
                              </span>
                              <span className="block text-[10px] text-[#A89884] mt-1 font-mono">
                                ID: {disp.id}
                              </span>
                            </td>

                            {/* Real Student Contact */}
                            <td className="p-4 align-top space-y-1">
                              <p className="font-bold text-[#FDFBF7] text-xs">
                                {disp.name || (lang === 'bn' ? 'শিক্ষার্থী' : 'Student')}
                              </p>
                              {disp.phone && (
                                <p className="text-[11px] text-[#A89884] flex items-center gap-1 font-mono">
                                  <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                                  <span>{disp.phone}</span>
                                </p>
                              )}
                              {disp.email && (
                                <p className="text-[11px] text-[#A89884] flex items-center gap-1 font-mono">
                                  <Mail className="w-3 h-3 text-sky-400 shrink-0" />
                                  <span>{disp.email}</span>
                                </p>
                              )}
                            </td>

                            {/* Description */}
                            <td className="p-4 align-top max-w-xs">
                              <p className="text-xs text-[#EDE8DF] font-sans leading-relaxed">
                                {disp.description || (lang === 'bn' ? 'রেজিস্ট্রেশন নম্বর সংক্রান্ত ভুয়া ক্লেইম' : 'Unauthorized claim reported for registration number')}
                              </p>
                              {disp.actionTaken && (
                                <p className="text-[10px] text-emerald-400 mt-1 font-sans italic">
                                  {lang === 'bn' ? 'পদক্ষেপ:' : 'Action:'} {disp.actionTaken}
                                </p>
                              )}
                            </td>

                            {/* Status */}
                            <td className="p-4 align-top">
                              {isPending ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                                  <span>{lang === 'bn' ? 'অপেক্ষমাণ' : 'Pending'}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>{lang === 'bn' ? 'সমাধানকৃত' : 'Resolved'}</span>
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="p-4 align-top text-right">
                              <div className="flex items-center justify-end gap-2 flex-wrap">
                                {/* 1-Click Reset Registration */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const confirmMsg = lang === 'bn'
                                      ? `রেজিস্ট্রেশন নং ${disp.regNo}-এর ভুয়া ক্লেইমটি বাতিল ও রিসেট করবেন?\n\nএতে এই রেজিস্ট্রেশন নম্বরে জমা হওয়া ভুয়া আবেদন বা তথ্য মুছে যাবে এবং প্রকৃত শিক্ষার্থীর জন্য আইডি উন্মুক্ত হবে।`
                                      : `Cancel and reset the disputed claim for Registration No. ${disp.regNo}?\n\nThis will clear the fraudulent claim/submission and free the ID for the rightful student.`;
                                    if (window.confirm(confirmMsg)) {
                                      resetStudentClaim(disp.regNo, disp.id);
                                      showToast(lang === 'bn'
                                        ? `✓ রেজিস্ট্রেশন ${disp.regNo}-এর ভুয়া ক্লেইম মুছে দেওয়া হয়েছে ও আইডি রিসেট হয়েছে!`
                                        : `✓ Cleared claim and reset ID for registration ${disp.regNo}!`);
                                    }
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-950/30 transition active:scale-95 cursor-pointer"
                                  title={lang === 'bn' ? 'ভুয়া ক্লেইম ডিলিট ও আইডি রিসেট করুন' : 'Delete false claim & reset ID'}
                                >
                                  <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>{lang === 'bn' ? 'রিসেট ও ক্লেইম বাতিল' : 'Reset & Clear Claim'}</span>
                                </button>

                                {/* Mark Resolved */}
                                {isPending && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      resolveDispute(disp.id, lang === 'bn' ? 'অ্যাডমিন কর্তৃক নিষ্পত্তি করা হয়েছে' : 'Resolved by Admin');
                                      showToast(lang === 'bn' ? '✓ অভিযোগ নিষ্পত্তি হিসেবে চিহ্নিত হয়েছে' : '✓ Dispute marked as resolved');
                                    }}
                                    className="p-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 transition cursor-pointer"
                                    title={lang === 'bn' ? 'নিষ্পত্তি চিহ্নিত করুন' : 'Mark as Resolved'}
                                  >
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  </button>
                                )}

                                {/* Delete Record */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(lang === 'bn' ? 'এই অভিযোগ রেকর্ডটি মুছে ফেলতে চান?' : 'Delete this dispute record?')) {
                                      deleteDispute(disp.id);
                                      showToast(lang === 'bn' ? 'অভিযোগ রেকর্ড মুছে ফেলা হয়েছে' : 'Dispute record deleted');
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition cursor-pointer"
                                  title={lang === 'bn' ? 'রেকর্ড মুছুন' : 'Delete Record'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-2xl plaque-elevated border border-[#C5A880]/25 text-center max-w-md mx-auto">
                <ShieldAlert className="w-10 h-10 text-[#A89884] mx-auto mb-3" />
                <h4 className="font-bold text-base text-[#FDFBF7]">
                  {lang === 'bn' ? 'কোনো আইডি সংক্রান্ত অভিযোগ নেই' : 'No ID Disputes Found'}
                </h4>
                <p className="text-xs text-[#A89884] mt-1 font-sans">
                  {lang === 'bn'
                    ? 'শিক্ষার্থীরা যখন কোনো রেজিস্ট্রেশন নম্বরের বিরোধ বা ভুয়া ক্লেইম রিপোর্ট করবে, তখন তা এখানে প্রদর্শিত হবে।'
                    : 'When students report registration number disputes or false claims, they will appear here.'}
                </p>
              </div>
            )}
            </motion.div>
          )}

          {/* TAB 2: TEACHERS MANAGEMENT */}
          {activeTab === 'teachers' && (
            <motion.div
              key="tab-teachers"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#FDFBF7]">{lang === 'bn' ? 'শিক্ষক মণ্ডলী তালিকা ও নিয়ন্ত্রণ' : 'Faculty Leadership Management'}</h3>
                <p className="text-xs text-[#A89884] mt-0.5">
                  {lang === 'bn' ? 'শিক্ষকের পদবী, বিভাগ, শিক্ষাগত যোগ্যতা ও যোগাযোগের তথ্য পরিবর্তন করুন।' : 'Add, edit, or remove faculty members and department heads.'}
                </p>
              </div>

              <button
                onClick={() => handleOpenAdd('addTeacher', {
                  name: '',
                  nameBn: '',
                  designation: 'Assistant Professor',
                  designationBn: 'সহকারী অধ্যাপক',
                  department: 'Yarn Engineering',
                  deptBn: 'ইয়ার্ন ইঞ্জিনিয়ারিং',
                  email: '',
                  phone: '',
                  education: 'B.Sc. in Textile Engineering (BUTEX)',
                  research: '',
                  officeRoom: 'Academic Building, Room 205'
                })}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>{lang === 'bn' ? 'নতুন শিক্ষক যুক্ত করুন' : 'Add New Teacher'}</span>
              </button>
            </div>

            {/* Search Filter */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89884]" />
              <input
                type="text"
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                placeholder={lang === 'bn' ? 'শিক্ষকের নাম, পদবী বা বিভাগ দিয়ে খুঁজুন...' : 'Search by faculty name, designation, or department...'}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] placeholder-[#A89884]/60 font-sans focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            {/* Table */}
            <div className="rounded-2xl plaque-elevated border border-[#C5A880]/25 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#141311] text-[#A89884] border-b border-[#C5A880]/20 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4">{lang === 'bn' ? 'ছবি ও নাম' : 'Photo & Name'}</th>
                      <th className="p-4">{lang === 'bn' ? 'পদবী' : 'Designation'}</th>
                      <th className="p-4">{lang === 'bn' ? 'বিভাগ' : 'Department'}</th>
                      <th className="p-4">{lang === 'bn' ? 'যোগাযোগ' : 'Contact'}</th>
                      <th className="p-4">{lang === 'bn' ? 'অফিস রুম' : 'Office Room'}</th>
                      <th className="p-4 text-right">{lang === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C5A880]/15">
                    {filteredTeachers.map((t) => (
                      <tr key={t.id} className="hover:bg-[#1E1C18]/40 transition">
                        <td className="p-4 flex items-center gap-3">
                          <UserAvatar
                            src={t.photo}
                            name={t.name}
                            role="teacher"
                            className="w-10 h-10 rounded-xl shrink-0 border border-[#C5A880]/25"
                          />
                          <div>
                            <div className="font-bold text-[#FDFBF7] flex items-center gap-1.5">
                              <span>{lang === 'bn' ? t.nameBn || t.name : t.name}</span>
                              {t.isHod && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                                  HOD
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#A89884] font-sans">{t.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-emerald-400 font-medium">
                          {lang === 'bn' ? t.designationBn || t.designation : t.designation}
                        </td>
                        <td className="p-4 text-[#DCD3C1]">
                          {lang === 'bn' ? t.deptBn || t.department : t.department}
                        </td>
                        <td className="p-4 text-[#A89884]">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[#EDE8DF] font-mono-tech">{t.phone || t.mobile}</span>
                            <span className="text-[10px] text-[#A89884] font-mono-tech">{t.email}</span>
                            {t.joiningDate && t.joiningDate !== 'N/A' && (
                              <span className="text-[10px] text-[#DFCA9E]">
                                {lang === 'bn' ? 'যোগদান:' : 'Joined:'} {lang === 'bn' ? t.joiningDate : (t.joiningDateEn || t.joiningDate)}
                              </span>
                            )}
                            {t.homeDistrict && t.homeDistrict !== 'N/A' && (
                              <span className="text-[10px] text-[#A89884]">
                                {lang === 'bn' ? 'জেলা:' : 'District:'} {lang === 'bn' ? t.homeDistrict : (t.homeDistrictEn || t.homeDistrict)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-[#A89884]">
                          {lang === 'bn' ? (t.officeRoom || 'N/A') : (t.officeRoomEn || t.officeRoom || 'N/A')}
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEdit('editTeacher', t)}
                            className="btn-action-edit p-2 rounded-lg"
                            title={lang === 'bn' ? 'সম্পাদনা করুন' : 'Edit Faculty'}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'teacher', id: t.id, name: t.nameBn || t.name })}
                            className="btn-action-delete p-2 rounded-lg"
                            title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete Faculty'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            </motion.div>
          )}

          {/* TAB 3: STUDENTS MANAGEMENT (1st to 8th Batch, NO roll, NO cgpa, only regNo) */}
          {activeTab === 'students' && (
            <motion.div
              key="tab-students"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-[#FDFBF7]">
                    {lang === 'bn' ? 'শিক্ষার্থী তালিকা ও কন্ট্রোল' : 'Student Directory Management'}
                  </h3>
                  <div className="badge-live-sync">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></span>
                    <span>{lang === 'bn' ? 'এক্সেল দ্বি-মুখী সংযোগ সক্রিয়' : 'Live Excel 2-Way Synced'}</span>
                  </div>
                </div>
                <p className="text-xs text-stone-600 dark:text-[#A89884] mt-0.5">
                  {lang === 'bn'
                    ? '১ম, ২য়, ৩য়, ৪র্থ, ৫ম, ৬ষ্ঠ, ৭ম ও ৮ম ব্যাচসহ সকল শিক্ষার্থীর তালিকা ও এক্সেল শিট সরাসরি রিয়েল-টাইম কানেক্টেড। ওয়েবসাইটের ইনপুট এক্সেলে এবং এক্সেলের ইনপুট ওয়েবসাইটে স্বয়ংক্রিয়ভাবে সিঙ্ক হয়।'
                    : 'All student cohorts (1st, 2nd, 3rd, 4th, 5th, 6th, 7th & 8th Batches) synchronized with live Excel. Changes in web or Excel update automatically.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={async () => {
                    setIsSyncingExcel(true);
                    const res = await syncWithExcelFile();
                    setIsSyncingExcel(false);
                    if (res.success) {
                      setToastMessage(lang === 'bn' ? `✓ এক্সেল শিট থেকে ${res.count} জন শিক্ষার্থী সফলভাবে সিঙ্ক হয়েছে!` : `✓ Successfully synced ${res.count} students from Excel!`);
                    } else {
                      setToastMessage(lang === 'bn' ? `✗ সিঙ্ক সমস্যা: ${res.error}` : `✗ Sync error: ${res.error}`);
                    }
                  }}
                  disabled={isSyncingExcel}
                  className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
                  title={lang === 'bn' ? 'সার্ভারের মাস্টার এক্সেল ফাইল থেকে রিলোড/সিঙ্ক করুন' : 'Force re-sync from server Master Excel'}
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncingExcel ? 'animate-spin' : ''}`} />
                  <span>{lang === 'bn' ? 'এক্সেল সিঙ্ক (Live)' : 'Sync Excel'}</span>
                </button>

                <button
                  onClick={exportExcelFile}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
                  title={lang === 'bn' ? 'বর্তমান লাইভ এক্সেল ফাইলটি ডাউনলোড করুন' : 'Download Live Master Excel File'}
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>{lang === 'bn' ? 'লাইভ এক্সেল ডাউনলোড' : 'Download Excel'}</span>
                </button>

                <button
                  onClick={() => setIsExcelImportOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-white" />
                  <span>{lang === 'bn' ? 'এক্সেলে বাল্ক আপলোড' : 'Bulk Import Excel'}</span>
                </button>

                <button
                  onClick={() => handleOpenAdd('addStudent', {
                    serialNo: students.length + 1,
                    deptSlNo: 0,
                    name: '',
                    nameBn: '',
                    regNo: '',
                    batch: '1st Batch (2018-19)',
                    department: 'Yarn Engineering',
                    deptBn: 'ইয়ার্ন ইঞ্জিনিয়ারিং',
                    session: '2018-2019',
                    year: 'Graduated / Pioneer Batch',
                    bloodGroup: '',
                    email: '',
                    phone: '',
                    avatar: '',
                    result: 'Passed',
                    remarks: '',
                    role: '1st Batch Member'
                  })}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-950/40 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>{lang === 'bn' ? 'নতুন শিক্ষার্থী' : 'Add Single'}</span>
                </button>
              </div>
            </div>

            {/* Search Filter & Live Stats */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89884]" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder={lang === 'bn' ? 'রেজিস্ট্রেশন নং, নাম বা বিভাগ দিয়ে খুঁজুন...' : 'Search by reg no, name, or department...'}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] placeholder-[#A89884]/60 font-sans focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <select
                  value={studentBatchFilter}
                  onChange={(e) => setStudentBatchFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] font-sans focus:outline-none focus:border-[#C5A880] cursor-pointer"
                >
                  <option value="all">{lang === 'bn' ? 'সকল ব্যাচ' : 'All Batches'}</option>
                  <option value="1st">{lang === 'bn' ? '১ম ব্যাচ (২০১৮-১৯)' : '1st Batch (2018-19)'}</option>
                  <option value="2nd">{lang === 'bn' ? '২য় ব্যাচ (২০১৯-২০)' : '2nd Batch (2019-20)'}</option>
                  <option value="3rd">{lang === 'bn' ? '৩য় ব্যাচ (২০২০-২১)' : '3rd Batch (2020-21)'}</option>
                  <option value="4th">{lang === 'bn' ? '৪র্থ ব্যাচ (২০২১-২২)' : '4th Batch (2021-22)'}</option>
                  <option value="5th">{lang === 'bn' ? '৫ম ব্যাচ (২০২২-২৩)' : '5th Batch (2022-23)'}</option>
                  <option value="6th">{lang === 'bn' ? '৬ষ্ঠ ব্যাচ (২০২৩-২৪)' : '6th Batch (2023-24)'}</option>
                  <option value="7th">{lang === 'bn' ? '৭ম ব্যাচ (২০২৪-২৫)' : '7th Batch (2024-25)'}</option>
                  <option value="8th">{lang === 'bn' ? '৮ম ব্যাচ (২০২৫-২৬)' : '8th Batch (2025-26)'}</option>
                </select>

                <select
                  value={studentDeptFilter}
                  onChange={(e) => setStudentDeptFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] font-sans focus:outline-none focus:border-[#C5A880] cursor-pointer"
                >
                  <option value="all">{lang === 'bn' ? 'সকল বিভাগ' : 'All Departments'}</option>
                  <option value="Yarn">{lang === 'bn' ? 'ইয়ার্ন (YE)' : 'Yarn Engineering'}</option>
                  <option value="Fabric">{lang === 'bn' ? 'ফ্যাব্রিক (FE)' : 'Fabric Engineering'}</option>
                  <option value="Wet">{lang === 'bn' ? 'ওয়েট প্রসেস (WPE)' : 'Wet Process Engineering'}</option>
                  <option value="Apparel">{lang === 'bn' ? 'অ্যাপারেল (AE)' : 'Apparel Engineering'}</option>
                </select>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-[#A89884] self-end md:self-center">
                <span>TOTAL: <strong className="text-teal-400 font-bold">{filteredStudents.length}</strong> / {students.length} STUDENTS</span>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl plaque-elevated border border-[#C5A880]/25 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#141311] text-[#A89884] border-b border-[#C5A880]/20 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4 w-12 text-center">{lang === 'bn' ? 'সিরিয়াল' : 'SL'}</th>
                      <th className="p-4">{lang === 'bn' ? 'রেজিস্ট্রেশন নং (স্টুডেন্ট আইডি) ও ছবি' : 'Reg No (Student ID) & Photo'}</th>
                      <th className="p-4">{lang === 'bn' ? 'নাম' : 'Name'}</th>
                      <th className="p-4">{lang === 'bn' ? 'বিভাগ' : 'Department'}</th>
                      <th className="p-4">{lang === 'bn' ? 'ব্যাচ ও সেশন' : 'Batch & Session'}</th>
                      <th className="p-4">{lang === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}</th>
                      <th className="p-4">{lang === 'bn' ? 'ফোন ও ইমেইল' : 'Phone & Email'}</th>
                      <th className="p-4">{lang === 'bn' ? 'স্টুডেন্ট টাইপ' : 'Student Type'}</th>
                      <th className="p-4">{lang === 'bn' ? 'বর্তমান চাকরি ও অবস্থান' : 'Job & Location'}</th>
                      <th className="p-4 text-right">{lang === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C5A880]/15">
                    {paginatedStudents.map((s, idx) => (
                      <tr key={s.id || s.regNo} className="hover:bg-[#1E1C18]/40 transition">
                        <td className="p-4 text-center font-mono font-bold text-stone-600 dark:text-[#A89884]">
                          {s.serialNo || (studentPage - 1) * Number(studentsPerPage === 'all' ? 0 : studentsPerPage) + idx + 1}
                        </td>
                        <td className="p-4 flex items-center gap-3">
                          <UserAvatar
                            src={s.avatar}
                            name={s.name}
                            role="student"
                            className="w-10 h-10 rounded-xl shrink-0 border border-stone-300 dark:border-[#C5A880]/25 bg-stone-100 dark:bg-[#121110]"
                          />
                          <div>
                            <span className="font-mono font-bold text-[#DE644E] block">{s.regNo || 'N/A'}</span>
                            <span className="text-[10px] text-stone-600 dark:text-[#A89884] font-mono">{s.session || '2018-2019'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-stone-900 dark:text-[#FDFBF7] font-mono">{s.name}</div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            {s.merit && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                🏆 {lang === 'bn' ? 'মেধা ক্রম:' : 'Merit:'} #{s.merit}
                              </span>
                            )}
                            {s.role && (
                              <span className="text-[10px] text-stone-600 dark:text-[#A89884] font-sans">{s.role}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-stone-800 dark:text-[#DCD3C1]">
                          <span className="font-medium">{lang === 'bn' ? s.deptBn || s.department : s.department}</span>
                        </td>
                        <td className="p-4 text-stone-800 dark:text-[#DCD3C1]">
                          <div className="font-medium">{s.batch}</div>
                          <span className="text-[10px] text-stone-600 dark:text-[#A89884]">{s.session || ''}</span>
                        </td>
                        <td className="p-4">
                          {s.bloodGroup ? (
                            <span className="badge-blood-group">
                              {s.bloodGroup}
                            </span>
                          ) : (
                            <span className="badge-empty-unset">{lang === 'bn' ? 'ফাঁকা' : 'Empty'}</span>
                          )}
                        </td>
                        <td className="p-4 text-stone-800 dark:text-[#DCD3C1]">
                          {s.phone || s.email ? (
                            <div className="space-y-0.5 text-[11px]">
                              {s.phone && <div className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{s.phone}</div>}
                              {s.email && <div className="text-stone-700 dark:text-[#A89884] truncate max-w-[150px] font-medium">{s.email}</div>}
                            </div>
                          ) : (
                            <span className="badge-unclaimed">
                              {lang === 'bn' ? 'অপ্রদত্ত' : 'Unclaimed'}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={s.studentType === 'Undergraduate' ? 'badge-undergraduate' : 'badge-graduate'}>
                            {s.studentType || 'Graduate'}
                          </span>
                        </td>
                        <td className="p-4 text-stone-800 dark:text-[#DCD3C1]">
                          {s.currentJob || s.currentLocation ? (
                            <div className="space-y-0.5 text-[11px]">
                              {s.currentJob && <div className="font-semibold text-amber-800 dark:text-amber-300 truncate max-w-[160px]">{s.currentJob}</div>}
                              {s.currentLocation && <div className="text-stone-700 dark:text-[#A89884] text-[10px] font-medium">{s.currentLocation}</div>}
                            </div>
                          ) : (
                            <span className="badge-empty-unset">{lang === 'bn' ? 'অপ্রদত্ত' : 'Unset'}</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-1 whitespace-nowrap">
                          {(s.email || s.phone || s.bloodGroup || s.currentJob || s.currentLocation || s.avatar || s.activities) && (
                            <button
                              onClick={() => {
                                const msg = lang === 'bn'
                                  ? `${s.name} (${s.regNo})-এর সব ইউজার তথ্য (ইমেইল, ফোন, রক্তের গ্রুপ, চাকরি, লোকেশন, ছবি) মুছে আগের খালি অবস্থায় (Unclaimed / Unset) ফেরত নেবেন?\n\nএটি এই আইডির সাথে যুক্ত ভুল সাবমিশনও মুছে দেবে।`
                                  : `Undo & reset all claimed info (Email, Phone, Blood Group, Career, Location, Photo) for ${s.name} (${s.regNo}) back to blank (Unclaimed / Unset)?\n\nThis will also clear any linked submission for this ID.`;
                                if (window.confirm(msg)) {
                                  resetStudentClaim(s.regNo);
                                  showToast(lang === 'bn'
                                    ? `✓ ${s.regNo}-এর সব ইউজার তথ্য মুছে আনসেট (Unclaimed) করা হয়েছে!`
                                    : `✓ Reset ${s.regNo} back to Unclaimed & Unset!`);
                                }
                              }}
                              className="p-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition cursor-pointer"
                              title={lang === 'bn' ? 'ইউজার তথ্য আনডু / আনক্লেম করুন' : 'Undo & Reset User Info (Unclaim / Unset)'}
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit('editStudent', s)}
                            className="btn-action-edit p-2 rounded-lg cursor-pointer"
                            title={lang === 'bn' ? 'সম্পাদনা করুন' : 'Edit Student'}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'student', id: s.id || s.regNo, name: s.name })}
                            className="btn-action-delete p-2 rounded-lg cursor-pointer"
                            title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete Student'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Admin Student Pagination Bar */}
              <div className="p-4 border-t border-[#C5A880]/20 bg-stone-50 dark:bg-[#141311] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
                <div className="text-stone-700 dark:text-[#A89884]">
                  {lang === 'bn' ? 'প্রদর্শিত: ' : 'Showing: '}
                  <strong className="text-stone-900 dark:text-teal-400 font-bold">
                    {studentsPerPage === 'all'
                      ? `১ - ${filteredStudents.length}`
                      : `${(studentPage - 1) * Number(studentsPerPage) + 1} - ${Math.min(studentPage * Number(studentsPerPage), filteredStudents.length)}`}
                  </strong>
                  {lang === 'bn' ? ` (মোট ${filteredStudents.length} জনের মধ্যে)` : ` of ${filteredStudents.length} Students`}
                </div>

                {studentsPerPage !== 'all' && totalStudentPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setStudentPage((p) => Math.max(1, p - 1))}
                      disabled={studentPage === 1}
                      className="px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-[#C5A880]/30 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-200 dark:hover:bg-[#1E1C18] text-stone-800 dark:text-[#EDE8DF] font-bold cursor-pointer"
                    >
                      {lang === 'bn' ? 'পূর্ববর্তী' : 'Prev'}
                    </button>

                    {Array.from({ length: totalStudentPages }, (_, i) => i + 1)
                      .filter((page) => page === 1 || page === totalStudentPages || Math.abs(page - studentPage) <= 2)
                      .map((page, idx, arr) => (
                        <React.Fragment key={page}>
                          {idx > 0 && arr[idx - 1] !== page - 1 && (
                            <span className="px-1 text-stone-400">...</span>
                          )}
                          <button
                            onClick={() => setStudentPage(page)}
                            className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center transition cursor-pointer text-xs ${
                              studentPage === page
                                ? 'bg-teal-600 text-white font-black shadow-sm'
                                : 'border border-stone-300 dark:border-[#C5A880]/30 hover:bg-stone-200 dark:hover:bg-[#1E1C18] text-stone-800 dark:text-[#EDE8DF]'
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}

                    <button
                      onClick={() => setStudentPage((p) => Math.min(totalStudentPages, p + 1))}
                      disabled={studentPage === totalStudentPages}
                      className="px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-[#C5A880]/30 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-200 dark:hover:bg-[#1E1C18] text-stone-800 dark:text-[#EDE8DF] font-bold cursor-pointer"
                    >
                      {lang === 'bn' ? 'পরবর্তী' : 'Next'}
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 text-stone-700 dark:text-[#A89884]">
                  <span>{lang === 'bn' ? 'সারি সংখ্যা:' : 'Rows:'}</span>
                  <select
                    value={studentsPerPage}
                    onChange={(e) => setStudentsPerPage(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-stone-300 dark:border-[#C5A880]/30 bg-white dark:bg-[#181715] text-stone-900 dark:text-[#FDFBF7] font-bold cursor-pointer"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value="all">{lang === 'bn' ? 'সকল' : 'All'}</option>
                  </select>
                </div>
              </div>
            </div>
            </motion.div>
          )}

          {/* TAB 4: ALUMNI MANAGEMENT */}
          {activeTab === 'alumni' && (
            <motion.div
              key="tab-alumni"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#FDFBF7]">
                  {lang === 'bn' ? 'অ্যালামনাই নেটওয়ার্ক ও অনুমোদন' : 'Alumni Network & Verification'}
                </h3>
                <p className="text-xs text-[#A89884] mt-0.5">
                  {lang === 'bn'
                    ? '১ম থেকে ৮ম ব্যাচের অ্যালামনাই তথ্য সম্পাদনা এবং ব্লু-ব্যাজ অনুমোদন দিন।'
                    : 'Manage 1st to 8th batch alumni profiles and approve verified blue-badge status.'}
                </p>
              </div>

              <button
                onClick={() => handleOpenAdd('addAlumni', {
                  name: '',
                  nameBn: '',
                  batch: '1st Batch (2018-19)',
                  passingYear: '2023',
                  department: 'Fabric Engineering',
                  deptBn: 'ফ্যাব্রিক ইঞ্জিনিয়ারিং',
                  role: 'Senior Executive',
                  company: '',
                  location: 'Dhaka, Bangladesh',
                  email: '',
                  phone: '',
                  avatar: '',
                  bio: ''
                })}
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-950/40 transition"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>{lang === 'bn' ? 'নতুন অ্যালামনাই যোগ করুন' : 'Add Alumni'}</span>
              </button>
            </div>

            {/* Search Filter */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89884]" />
              <input
                type="text"
                value={alumniSearch}
                onChange={(e) => setAlumniSearch(e.target.value)}
                placeholder={lang === 'bn' ? 'নাম, কোম্পানি বা ব্যাচ দিয়ে খুঁজুন...' : 'Search by name, company, or batch...'}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] placeholder-[#A89884]/60 font-sans focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            {/* Table */}
            <div className="rounded-2xl plaque-elevated border border-[#C5A880]/25 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#141311] text-[#A89884] border-b border-[#C5A880]/20 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4">{lang === 'bn' ? 'ছবি ও নাম' : 'Photo & Name'}</th>
                      <th className="p-4">{lang === 'bn' ? 'ব্যাচ ও পাসিং' : 'Batch & Year'}</th>
                      <th className="p-4">{lang === 'bn' ? 'বিভাগ' : 'Department'}</th>
                      <th className="p-4">{lang === 'bn' ? 'পদবী ও কোম্পানি' : 'Designation & Company'}</th>
                      <th className="p-4">{lang === 'bn' ? 'ভেরিফিকেশন স্ট্যাটাস' : 'Verification'}</th>
                      <th className="p-4 text-right">{lang === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C5A880]/15">
                    {filteredAlumni.map((a) => (
                      <tr key={a.id} className="hover:bg-[#1E1C18]/40 transition">
                        <td className="p-4 flex items-center gap-3">
                          <UserAvatar
                            src={a.avatar}
                            name={a.name}
                            role="alumni"
                            className="w-10 h-10 rounded-xl shrink-0 border border-[#C5A880]/25"
                          />
                          <div>
                            <div className="font-bold text-[#FDFBF7] flex items-center gap-1.5">
                              <span>{lang === 'bn' ? a.nameBn || a.name : a.name}</span>
                              {a.isVerified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                              )}
                            </div>
                            <span className="text-[10px] text-[#A89884] font-sans">{a.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-[#DCD3C1]">
                          <div>{a.batch}</div>
                          <span className="text-[10px] text-[#A89884]">
                            {lang === 'bn' ? `পাসিং: ${a.passingYear}` : `Class of ${a.passingYear}`}
                          </span>
                        </td>
                        <td className="p-4 text-[#DCD3C1]">
                          {lang === 'bn' ? a.deptBn || a.department : a.department}
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-[#FDFBF7]">{a.role}</div>
                          <span className="text-[10px] text-[#A89884]">{a.company}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col items-start gap-1.5">
                            <button
                              onClick={() => {
                                toggleVerifyAlumni(a.id);
                                showToast(lang === 'bn' ? 'ভেরিফিকেশন স্ট্যাটাস পরিবর্তন করা হয়েছে!' : 'Verification toggled!');
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                                a.isVerified
                                  ? 'bg-sky-100 dark:bg-sky-950/70 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700/60 shadow-sm'
                                  : 'btn-action-view'
                              }`}
                            >
                              {a.isVerified
                                ? (lang === 'bn' ? '✓ ভেরিফায়েড (ব্লু ব্যাজ)' : '✓ Verified')
                                : (lang === 'bn' ? 'পেন্ডিং (ক্লিক করে অনুমোদন)' : 'Pending (Click to Verify)')}
                            </button>
                            <button
                              onClick={() => {
                                toggleMentorAlumni(a.id);
                                showToast(lang === 'bn' ? 'মেন্টরশিপ স্ট্যাটাস আপডেট করা হয়েছে!' : 'Mentor status updated!');
                              }}
                              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                                a.isMentor
                                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700/60'
                                  : 'bg-stone-100 dark:bg-[#141311] text-stone-700 dark:text-[#A89884] border-stone-300 dark:border-[#C5A880]/20 hover:border-emerald-500/40'
                              }`}
                            >
                              {a.isMentor
                                ? (lang === 'bn' ? '★ সক্রিয় মেন্টর' : '★ Active Mentor')
                                : (lang === 'bn' ? '+ মেন্টর করুন' : '+ Set as Mentor')}
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEdit('editAlumni', a)}
                            className="btn-action-edit p-2 rounded-lg"
                            title={lang === 'bn' ? 'সম্পাদনা করুন' : 'Edit Alumni'}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'alumni', id: a.id, name: a.nameBn || a.name })}
                            className="btn-action-delete p-2 rounded-lg"
                            title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete Alumni'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            </motion.div>
          )}

          {/* TAB 6: JOBS MANAGEMENT */}
          {activeTab === 'jobs' && (
            <motion.div
              key="tab-jobs"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#FDFBF7]">{lang === 'bn' ? 'চাকরি ও ক্যারিয়ার সার্কুলার' : 'Job Board Management'}</h3>
                <p className="text-xs text-[#A89884] mt-0.5">{lang === 'bn' ? 'ব্যবহারকারী ও গ্র্যাজুয়েটদের পোস্ট করা চাকরির বিজ্ঞপ্তি যাচাই-বাছাই ও অনুমোদন করুন।' : 'Review and approve job circulars posted by graduates and users.'}</p>
              </div>

              <button
                onClick={() => handleOpenAdd('addJob', {
                  title: '',
                  titleBn: '',
                  company: '',
                  location: 'Dhaka',
                  type: 'Full Time',
                  salary: 'Negotiable',
                  deadline: '2026-12-31',
                  department: 'Yarn Engineering',
                  description: 'Textile engineer required for immediate joining.',
                  status: 'approved'
                })}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>{lang === 'bn' ? 'নতুন চাকরি পোস্ট করুন' : 'Post Job'}</span>
              </button>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', labelBn: 'সকল চাকরি', labelEn: 'All', count: jobs.length },
                  { id: 'pending', labelBn: 'অপেক্ষমাণ (Pending)', labelEn: 'Pending', count: pendingJobsCount, isAlert: pendingJobsCount > 0 },
                  { id: 'approved', labelBn: 'অনুমোদিত (Approved)', labelEn: 'Approved', count: jobs.filter(j => (j.status || 'approved') === 'approved').length },
                  { id: 'declined', labelBn: 'বাতিলকৃত (Declined)', labelEn: 'Declined', count: jobs.filter(j => j.status === 'declined').length }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setJobFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      jobFilter === tab.id
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-[#181715] text-[#DCD3C1] hover:bg-[#201E1A] border border-[#C5A880]/20'
                    }`}
                  >
                    <span>{lang === 'bn' ? tab.labelBn : tab.labelEn}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      tab.isAlert ? 'bg-rose-500 text-white font-bold animate-pulse' : 'bg-[#141311] text-[#A89884]'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative max-w-xs flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89884]" />
                <input
                  type="text"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  placeholder={lang === 'bn' ? 'পদের নাম বা কোম্পানি দিয়ে খুঁজুন...' : 'Search by title or company...'}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] placeholder-[#A89884]/60 font-sans focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredJobs.length === 0 ? (
                <div className="p-8 text-center text-[#A89884] bg-[#141311] rounded-2xl border border-[#C5A880]/20 text-xs">
                  {lang === 'bn' ? 'কোনো চাকরির বিজ্ঞপ্তি পাওয়া যায়নি।' : 'No job circulars match the selected filter.'}
                </div>
              ) : (
                filteredJobs.map((j) => {
                  const currentStatus = j.status || 'approved';
                  return (
                    <div key={j.id} className="p-4 rounded-2xl plaque-elevated border border-[#C5A880]/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-[#FDFBF7] text-base">{lang === 'bn' ? j.titleBn || j.title : j.title}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-950 dark:text-teal-200 border border-teal-300 dark:border-teal-700/60">
                            {j.type}
                          </span>
                          {currentStatus === 'pending' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span>{lang === 'bn' ? 'অনুমোদনের অপেক্ষায়' : 'Pending Approval'}</span>
                            </span>
                          )}
                          {currentStatus === 'approved' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>{lang === 'bn' ? 'অনুমোদিত' : 'Approved'}</span>
                            </span>
                          )}
                          {currentStatus === 'declined' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                              <X className="w-3 h-3 text-rose-400" />
                              <span>{lang === 'bn' ? 'বাতিলকৃত' : 'Declined'}</span>
                            </span>
                          )}
                          {j.pdfUrl && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700/60 flex items-center gap-1 font-mono font-bold">
                              <FileText className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                              <span>PDF</span>
                            </span>
                          )}
                          {j.image && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-sky-100 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200 border border-sky-300 dark:border-sky-700/60 flex items-center gap-1 font-mono font-bold">
                              <ImageIcon className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                              <span>{lang === 'bn' ? 'ছবি' : 'Image'}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#DCD3C1]">
                          {j.company} • {j.location} • <span className="text-emerald-400 font-bold">{j.salary}</span>
                        </p>
                        <p className="text-[11px] text-[#A89884] font-mono">
                          {lang === 'bn' ? `ডেডলাইন: ${j.deadline} • বিভাগ: ${j.department}` : `Deadline: ${j.deadline} • Dept: ${j.department}`}
                          {j.postedBy && (
                            <span className="ml-2 text-teal-400 font-sans">
                              • {lang === 'bn' ? `পোস্টকারী: ${j.postedBy}` : `Posted by: ${j.postedBy}`}
                            </span>
                          )}
                        </p>
                        {jobApplications.filter(a => a.jobId === j.id).length > 0 && (
                          <div className="mt-2.5 pt-2.5 border-t border-[#C5A880]/15 space-y-1.5">
                            <span className="text-[10px] font-mono font-bold text-[#DFCA9E] uppercase block">
                              {lang === 'bn'
                                ? `জমাকৃত আবেদন (${jobApplications.filter(a => a.jobId === j.id).length})`
                                : `Submitted Applications (${jobApplications.filter(a => a.jobId === j.id).length})`}
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {jobApplications.filter(a => a.jobId === j.id).map((app) => (
                                <div key={app.id} className="p-2 rounded-lg bg-[#141311] border border-[#C5A880]/15 flex items-center justify-between gap-2 text-[11px]">
                                  <div className="min-w-0">
                                    <p className="font-bold text-[#FDFBF7] truncate">{app.applicantName} ({app.applicantBatch})</p>
                                    {app.cvLink && (
                                      <a href={app.cvLink} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline font-mono text-[10px] flex items-center gap-1">
                                        <ExternalLink className="w-2.5 h-2.5" />
                                        <span>{lang === 'bn' ? 'সিভি লিংক দেখুন' : 'View CV Link'}</span>
                                      </a>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => deleteJobApplication(app.id)}
                                    className="p-1 text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer shrink-0"
                                    title={lang === 'bn' ? 'আবেদন মুছুন' : 'Delete Application'}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {currentStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                approveJob(j.id);
                                showToast(lang === 'bn' ? 'চাকরির বিজ্ঞপ্তিটি সফলভাবে অনুমোদিত হয়েছে!' : 'Job approved successfully!');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                              title={lang === 'bn' ? 'অনুমোদন করুন' : 'Approve Job'}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{lang === 'bn' ? 'অনুমোদন' : 'Approve'}</span>
                            </button>
                            <button
                              onClick={() => {
                                declineJob(j.id);
                                showToast(lang === 'bn' ? 'চাকরির বিজ্ঞপ্তিটি বাতিল করা হয়েছে।' : 'Job declined.');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                              title={lang === 'bn' ? 'বাতিল করুন' : 'Decline Job'}
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>{lang === 'bn' ? 'বাতিল' : 'Decline'}</span>
                            </button>
                          </>
                        )}
                        {currentStatus === 'declined' && (
                          <button
                            onClick={() => {
                              approveJob(j.id);
                              showToast(lang === 'bn' ? 'পুনরায় অনুমোদিত হয়েছে!' : 'Re-approved!');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-600 text-emerald-200 border border-emerald-500/40 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{lang === 'bn' ? 'পুনরায় অনুমোদন' : 'Re-Approve'}</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit('editJob', j)}
                          className="btn-action-edit p-2 rounded-xl cursor-pointer"
                          title={lang === 'bn' ? 'সম্পাদনা করুন' : 'Edit Job'}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'job', id: j.id, name: j.titleBn || j.title })}
                          className="btn-action-delete p-2 rounded-xl cursor-pointer"
                          title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete Job'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            </motion.div>
          )}

          {/* TAB 7: NEWS & NOTICES */}
          {activeTab === 'news' && (
            <motion.div
              key="tab-news"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#FDFBF7]">{lang === 'bn' ? 'খবর ও নোটিশ ব্যবস্থাপনা' : 'News & Notice Management'}</h3>
                <p className="text-xs text-[#A89884] mt-0.5">{lang === 'bn' ? 'অফিসিয়াল নোটিশ বোর্ড, খবর ও সমাবর্তন সংক্রান্ত ঘোষণা দিন।' : 'Publish, edit and moderate campus news, official circulars and notices.'}</p>
              </div>

              <button
                onClick={() => handleOpenAdd('addNews', {
                  title: '',
                  titleBn: '',
                  category: 'Academic Notice',
                  summaryBn: '',
                  summary: '',
                  contentBn: '',
                  content: '',
                  date: lang === 'bn' ? '১৯ নভেম্বর, ২০২৬' : '19 November, 2026',
                  pdfUrl: '',
                  image: '',
                  isPinned: false
                })}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>{lang === 'bn' ? 'নতুন খবর / নোটিশ প্রকাশ করুন' : 'Publish News / Notice'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {news.map((n) => (
                <div key={n.id} className="p-4 rounded-2xl plaque-elevated border border-[#C5A880]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/60">
                        {n.category}
                      </span>
                      <h4 className="font-bold text-[#FDFBF7] text-sm">{lang === 'bn' ? n.titleBn || n.title : n.title}</h4>
                      {n.pdfUrl && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700/60 flex items-center gap-1 font-mono font-bold">
                          <FileText className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                          <span>PDF</span>
                        </span>
                      )}
                      {n.image && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-sky-100 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200 border border-sky-300 dark:border-sky-700/60 flex items-center gap-1 font-mono font-bold">
                          <ImageIcon className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                          <span>{lang === 'bn' ? 'ছবি' : 'Image'}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#DCD3C1] line-clamp-1">{n.summaryBn || n.summary || n.contentBn || n.content}</p>
                    <span className="text-[10px] text-[#A89884]">{n.date}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEdit('editNews', n)}
                      className="btn-action-edit p-2 rounded-xl"
                      title={lang === 'bn' ? 'সম্পাদনা করুন' : 'Edit Notice'}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ type: 'news', id: n.id, name: n.titleBn || n.title })}
                      className="btn-action-delete p-2 rounded-xl shrink-0"
                      title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete Notice'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            </motion.div>
          )}

          {/* TAB: Q&A AND FORUM MODERATION */}
          {activeTab === 'forum' && (
            <motion.div
              key="tab-forum"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#FDFBF7]">
                  {lang === 'bn' ? 'অভিজ্ঞতা শেয়ার ও ফোরাম কমিউনিটি পরিচালনা' : 'Experience Share & Forum Moderation'}
                </h3>
                <p className="text-xs text-[#A89884] mt-0.5">
                  {lang === 'bn'
                    ? 'শিক্ষার্থী ও অ্যালামনাইদের প্রশ্ন, ক্যারিয়ার ও টেকনিক্যাল অভিজ্ঞতা শেয়ার পর্যবেক্ষণ ও অনুপযুক্ত পোস্ট বা মন্তব্য মুছে ফেলুন।'
                    : 'Monitor and moderate questions, experience shares, and comments across the campus forum.'}
                </p>
              </div>

              <Link
                to="/forum"
                target="_blank"
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition shrink-0"
              >
                <ExternalLink className="w-4 h-4 text-white" />
                <span>{lang === 'bn' ? 'ফোরাম পেজ খুলুন' : 'Open Public Forum'}</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              <div className="p-4 rounded-2xl plaque-elevated border border-amber-500/35 bg-amber-950/15 space-y-1">
                <span className="text-[10px] font-mono-tech text-amber-300 uppercase font-bold">
                  {lang === 'bn' ? 'অনুমোদন বাকি (Pending)' : 'Pending Approval'}
                </span>
                <p className="text-2xl font-bold text-amber-400 font-mono-tech">
                  {pendingForumPostsCount}
                </p>
              </div>
              <div className="p-4 rounded-2xl plaque-elevated border border-[#C5A880]/20 space-y-1">
                <span className="text-[10px] font-mono-tech text-[#A89884] uppercase">
                  {lang === 'bn' ? 'মোট ফোরাম পোস্ট' : 'Total Posts'}
                </span>
                <p className="text-2xl font-bold text-[#FDFBF7] font-mono-tech">
                  {forumPosts.length}
                </p>
              </div>
              <div className="p-4 rounded-2xl plaque-elevated border border-[#C5A880]/20 space-y-1">
                <span className="text-[10px] font-mono-tech text-[#A89884] uppercase">
                  {lang === 'bn' ? 'প্রশ্ন ও জিজ্ঞাসা' : 'Questions'}
                </span>
                <p className="text-2xl font-bold text-amber-400 font-mono-tech">
                  {forumPosts.filter(p => p.type === 'question').length}
                </p>
              </div>
              <div className="p-4 rounded-2xl plaque-elevated border border-[#C5A880]/20 space-y-1">
                <span className="text-[10px] font-mono-tech text-[#A89884] uppercase">
                  {lang === 'bn' ? 'অভিজ্ঞতা শেয়ার' : 'Experiences'}
                </span>
                <p className="text-2xl font-bold text-emerald-400 font-mono-tech">
                  {forumPosts.filter(p => p.type === 'experience' || p.type === 'tip').length}
                </p>
              </div>
              <div className="p-4 rounded-2xl plaque-elevated border border-[#C5A880]/20 space-y-1">
                <span className="text-[10px] font-mono-tech text-[#A89884] uppercase">
                  {lang === 'bn' ? 'সর্বমোট মন্তব্য' : 'Total Comments'}
                </span>
                <p className="text-2xl font-bold text-[#DFCA9E] font-mono-tech">
                  {forumPosts.reduce((acc, p) => acc + (p.replies?.length || 0), 0)}
                </p>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl plaque-elevated border border-[#C5A880]/20">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89884]" />
                  <input
                    type="text"
                    value={forumSearch}
                    onChange={(e) => setForumSearch(e.target.value)}
                    placeholder={lang === 'bn' ? 'প্রশ্ন, অভিজ্ঞতা, লেখক বা ট্যাগ দিয়ে অনুসন্ধান করুন...' : 'Search questions, experiences, authors, or tags...'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141311] border border-[#C5A880]/30 text-xs text-[#FDFBF7] placeholder-[#A89884]/60 focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { id: 'all', labelBn: 'সব স্ট্যাটাস', labelEn: 'All Status' },
                    { id: 'pending', labelBn: `অপেক্ষমাণ (${pendingForumPostsCount})`, labelEn: `Pending (${pendingForumPostsCount})` },
                    { id: 'approved', labelBn: 'অনুমোদিত', labelEn: 'Approved' },
                    { id: 'declined', labelBn: 'প্রত্যাখ্যাত', labelEn: 'Declined' }
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setForumStatusFilter(st.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                        forumStatusFilter === st.id
                          ? 'bg-emerald-600 text-white shadow-md font-bold'
                          : 'bg-[#141311] text-[#DCD3C1] hover:text-[#FDFBF7] border border-[#C5A880]/20'
                      }`}
                    >
                      {lang === 'bn' ? st.labelBn : st.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#C5A880]/15">
                {[
                  { id: 'all', labelBn: 'সকল পোস্ট', labelEn: 'All Types' },
                  { id: 'question', labelBn: 'প্রশ্ন ও জিজ্ঞাসা', labelEn: 'Questions' },
                  { id: 'experience', labelBn: 'অভিজ্ঞতা শেয়ার', labelEn: 'Experiences' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setForumTypeFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      forumTypeFilter === f.id
                        ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                        : 'bg-[#141311] text-[#DCD3C1] hover:text-[#FDFBF7] border border-[#C5A880]/20'
                    }`}
                  >
                    {lang === 'bn' ? f.labelBn : f.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredForumPosts.length === 0 ? (
                <div className="p-8 text-center rounded-2xl plaque-elevated border border-[#C5A880]/20 space-y-2">
                  <MessageSquareQuote className="w-8 h-8 text-[#A89884] mx-auto opacity-50" />
                  <p className="text-sm font-bold text-[#FDFBF7]">
                    {lang === 'bn' ? 'কোন পোস্ট পাওয়া যায়নি!' : 'No forum posts found!'}
                  </p>
                  <p className="text-xs text-[#A89884]">
                    {lang === 'bn' ? 'সার্চ কুয়েরি বা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।' : 'Try adjusting your search query or type filter.'}
                  </p>
                </div>
              ) : (
                filteredForumPosts.map((post) => {
                  const isExpanded = expandedForumPostId === post.id;
                  const replies = post.replies || [];
                  const activeRepliesCount = replies.filter(r => !r.isDeleted).length;

                  return (
                    <div
                      key={post.id}
                      className="p-5 rounded-2xl plaque-elevated border border-[#C5A880]/25 space-y-4 transition"
                    >
                      {/* Top Row: Badges, Approval Status, Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {(post.status || 'approved') === 'pending' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-500/40 animate-pulse">
                              {lang === 'bn' ? '⏳ অপেক্ষমাণ (Pending)' : '⏳ Pending Approval'}
                            </span>
                          ) : post.status === 'declined' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold uppercase bg-rose-950/80 text-rose-300 border border-rose-500/40">
                              {lang === 'bn' ? '✕ প্রত্যাখ্যাত (Declined)' : '✕ Declined'}
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                              {lang === 'bn' ? '✓ প্রকাশিত (Approved)' : '✓ Approved'}
                            </span>
                          )}

                          {post.type === 'question' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              {lang === 'bn' ? 'প্রশ্ন / জিজ্ঞাসা' : 'Question'}
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              {lang === 'bn' ? 'অভিজ্ঞতা শেয়ার' : 'Experience / Tip'}
                            </span>
                          )}

                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold bg-[#141311] text-[#DFCA9E] border border-[#C5A880]/20">
                            {post.category}
                          </span>

                          <span className="text-[11px] font-mono-tech text-[#A89884]">
                            {post.date}
                          </span>
                        </div>

                        {/* Admin Approve / Decline / Delete Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          {(post.status || 'approved') !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => {
                                approveForumPost(post.id);
                                showToast(lang === 'bn' ? '✓ পোস্ট অনুমোদিত ও প্রকাশিত হয়েছে!' : '✓ Post approved & published!');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{lang === 'bn' ? 'অনুমোদন দিন' : 'Approve'}</span>
                            </button>
                          )}
                          {(post.status || 'approved') === 'pending' && (
                            <button
                              type="button"
                              onClick={() => {
                                declineForumPost(post.id);
                                showToast(lang === 'bn' ? 'পোস্ট প্রত্যাখ্যান করা হয়েছে' : 'Post declined');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600 hover:text-white text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>{lang === 'bn' ? 'প্রত্যাখ্যান' : 'Decline'}</span>
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteConfirm({
                              type: 'forumPost',
                              id: post.id,
                              name: post.titleBn || post.title
                            })}
                            className="btn-action-delete px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                            title={lang === 'bn' ? 'পোস্টটি স্থায়ীভাবে মুছে ফেলুন' : 'Delete this post'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{lang === 'bn' ? 'পোস্ট মুছুন' : 'Delete Post'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Author Header */}
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          src={post.authorAvatar}
                          name={post.author}
                          role={post.authorRole?.toLowerCase()?.includes('alumni') ? 'alumni' : (post.authorRole?.toLowerCase()?.includes('admin') ? 'faculty' : 'student')}
                          className="w-9 h-9 rounded-xl border border-[#C5A880]/30 shrink-0"
                        />
                        <div>
                          <h5 className="font-bold text-xs sm:text-sm text-[#FDFBF7]">
                            {post.author}
                          </h5>
                          <p className="text-[10px] font-mono-tech text-[#A89884]">
                            {post.authorRole || 'Community Member'} • {post.authorEmail || ''}
                          </p>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-base text-[#FDFBF7] leading-snug">
                          {lang === 'bn' ? post.titleBn || post.title : post.title}
                        </h4>
                        <p className="text-xs text-[#DCD3C1] leading-relaxed line-clamp-3">
                          {post.body || post.content || post.description}
                        </p>
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-[#141311] text-[#A89884] border border-[#C5A880]/15"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer Actions: Comment Toggle & Direct Link */}
                      <div className="pt-3 border-t border-[#C5A880]/15 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-xs font-mono-tech text-[#A89884]">
                          <span>▲ {post.upvotes || 0} {lang === 'bn' ? 'ভোট' : 'votes'}</span>
                          <span>•</span>
                          <span>{post.views || 0} {lang === 'bn' ? 'বার দেখা হয়েছে' : 'views'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedForumPostId(isExpanded ? null : post.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#141311] hover:bg-[#201E1A] text-xs font-mono-tech font-bold text-[#DCD3C1] hover:text-[#FDFBF7] border border-[#C5A880]/25 flex items-center gap-2 transition cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                            <span>
                              {lang === 'bn'
                                ? `${replies.length} টি মন্তব্য (${activeRepliesCount} সক্রিয়)`
                                : `${replies.length} Replies (${activeRepliesCount} active)`}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <Link
                            to="/forum"
                            className="px-3 py-1.5 rounded-xl bg-[#141311] hover:bg-[#201E1A] text-xs font-mono-tech text-[#DFCA9E] hover:text-[#FDFBF7] border border-[#C5A880]/20 flex items-center gap-1.5 transition"
                          >
                            <span>{lang === 'bn' ? 'ফোরামে দেখুন' : 'View'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>

                      {/* Collapsible Replies List */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 border-t border-[#C5A880]/20 space-y-2.5">
                              <h6 className="text-xs font-bold text-[#DFCA9E] font-mono-tech uppercase">
                                {lang === 'bn' ? `এই পোস্টের মন্তব্যসমূহ (${replies.length}):` : `Comments on this post (${replies.length}):`}
                              </h6>

                              {replies.length === 0 ? (
                                <div className="p-3 rounded-xl bg-[#141311] border border-[#C5A880]/15 text-xs text-[#A89884] italic text-center font-sans">
                                  {lang === 'bn' ? 'এই পোস্টে এখনও কোন মন্তব্য করা হয়নি।' : 'No comments on this post yet.'}
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {replies.map((reply, rIdx) => {
                                    if (reply.isDeleted) {
                                      return (
                                        <div
                                          key={reply.id || rIdx}
                                          className="p-3 rounded-xl bg-[#141311] border border-rose-500/25 text-xs flex items-center justify-between gap-3 text-rose-300/80 italic font-sans"
                                        >
                                          <div className="flex items-center gap-2">
                                            <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                            <span>
                                              {lang === 'bn' ? 'দিস কমেন্ট ইজ ডিলিটেড (এই মন্তব্যটি মুছে ফেলা হয়েছে)' : 'This comment is deleted.'}
                                            </span>
                                          </div>
                                          <span className="text-[10px] text-[#A89884] font-mono-tech not-italic">
                                            {reply.deletedAt || (lang === 'bn' ? 'মুছে ফেলা হয়েছে' : 'Deleted')}
                                          </span>
                                        </div>
                                      );
                                    }

                                    return (
                                      <div
                                        key={reply.id || rIdx}
                                        className="p-3.5 rounded-xl bg-[#141311] border border-[#C5A880]/20 space-y-2 transition-all duration-200"
                                      >
                                        <div className="flex items-center justify-between gap-3">
                                          <div className="flex items-center gap-2">
                                            <UserAvatar
                                              src={reply.avatar}
                                              name={reply.author}
                                              role={reply.role?.toLowerCase()?.includes('alumni') ? 'alumni' : (reply.role?.toLowerCase()?.includes('admin') ? 'faculty' : 'student')}
                                              className="w-7 h-7 rounded-lg border border-[#C5A880]/30 shrink-0"
                                            />
                                            <div>
                                              <div className="flex items-center gap-2">
                                                <h6 className="text-xs font-bold text-[#FDFBF7]">
                                                  {reply.author}
                                                </h6>
                                                {reply.isEdited && (
                                                  <span className="text-[9px] font-mono-tech text-amber-400">
                                                    ({lang === 'bn' ? 'সম্পাদিত' : 'Edited'})
                                                  </span>
                                                )}
                                              </div>
                                              <p className="text-[10px] text-[#A89884] font-mono-tech">
                                                {reply.role || 'Member'} • {reply.date}
                                              </p>
                                            </div>
                                          </div>

                                          {/* Admin Delete Comment Button */}
                                          <button
                                            onClick={() => setDeleteConfirm({
                                              type: 'forumReply',
                                              id: reply.id,
                                              postId: post.id,
                                              name: lang === 'bn' ? `${reply.author}-এর মন্তব্য` : `Reply by ${reply.author}`
                                            })}
                                            className="btn-action-delete px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all duration-200 cursor-pointer"
                                            title={lang === 'bn' ? 'এই মন্তব্যটি মুছে ফেলুন' : 'Delete comment'}
                                          >
                                            <Trash2 className="w-3 h-3" />
                                            <span>{lang === 'bn' ? 'মন্তব্য মুছুন' : 'Delete'}</span>
                                          </button>
                                        </div>

                                        <p className="text-xs text-[#DCD3C1] leading-relaxed pl-9">
                                          {reply.content}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>
            </motion.div>
          )}

          {/* TAB 8: SYSTEM SETTINGS & BACKUP */}
          {/* TAB 8B: CONTACT INQUIRIES & MENTORSHIP INBOX */}
          {activeTab === 'inquiries' && (
            <motion.div
              key="tab-inquiries"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Mentorship Requests */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-[#FDFBF7]">
                    {lang === 'bn' ? 'মেন্টরশিপ সেশন অনুরোধসমূহ' : 'Mentorship Session Requests'}
                  </h3>
                  <p className="text-xs text-[#A89884] mt-0.5">
                    {lang === 'bn'
                      ? 'শিক্ষার্থী ও নবীনদের পাঠানো ক্যারিয়ার মেন্টরশিপ সেশন বুকিং তালিকা ও অনুমোদন ব্যবস্থাপনা।'
                      : 'Manage 1-on-1 career mentorship bookings submitted directly from the Mentorship portal.'}
                  </p>
                </div>

                {mentorshipRequests.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl plaque-elevated border border-[#C5A880]/20 text-xs text-[#A89884]">
                    {lang === 'bn' ? 'এখনো কোনো মেন্টরশিপ অনুরোধ জমা পড়েনি।' : 'No mentorship session requests received yet.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mentorshipRequests.map((req) => (
                      <div key={req.id} className="p-5 rounded-2xl plaque-elevated border border-[#C5A880]/25 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mb-1 border ${
                              req.status === 'approved' || req.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : req.status === 'declined'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}>
                              {req.status === 'approved'
                                ? (lang === 'bn' ? 'অনুমোদিত' : 'Approved')
                                : req.status === 'completed'
                                ? (lang === 'bn' ? 'সম্পন্ন' : 'Completed')
                                : req.status === 'declined'
                                ? (lang === 'bn' ? 'প্রত্যাখ্যাত' : 'Declined')
                                : (lang === 'bn' ? 'অপেক্ষমাণ' : 'Pending')}
                            </span>
                            <h4 className="font-bold text-[#FDFBF7] text-sm">{req.studentName}</h4>
                            <p className="text-[11px] font-mono text-[#A89884]">{req.studentEmail} {req.studentBatch ? `• ${req.studentBatch}` : ''}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              deleteMentorshipRequest(req.id);
                              showToast(lang === 'bn' ? 'অনুরোধ মুছে ফেলা হয়েছে।' : 'Request deleted.');
                            }}
                            className="btn-action-delete p-2 rounded-lg"
                            title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="p-3 rounded-xl bg-[#141311] border border-[#C5A880]/15 text-xs space-y-1">
                          <div className="text-[#DFCA9E] font-bold">
                            {lang === 'bn' ? `মেন্টর: ${req.mentorName}` : `Mentor: ${req.mentorName}`}
                          </div>
                          <div className="text-[#DCD3C1] font-semibold">
                            {lang === 'bn' ? `বিষয়: ${req.topic}` : `Topic: ${req.topic}`}
                          </div>
                          <p className="text-[#A89884] leading-relaxed">{req.details}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {req.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => {
                                updateMentorshipRequestStatus(req.id, 'approved');
                                showToast(lang === 'bn' ? 'মেন্টরশিপ অনুমোদিত!' : 'Mentorship approved!');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                            >
                              {lang === 'bn' ? 'অনুমোদন দিন' : 'Approve'}
                            </button>
                          )}
                          {req.status !== 'completed' && (
                            <button
                              type="button"
                              onClick={() => {
                                updateMentorshipRequestStatus(req.id, 'completed');
                                showToast(lang === 'bn' ? 'সেশন সম্পন্ন চিহ্নিত!' : 'Marked completed!');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer"
                            >
                              {lang === 'bn' ? 'সম্পন্ন চিহ্নিত করুন' : 'Mark Completed'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Page Inquiries */}
              <div className="space-y-4 pt-6 border-t border-[#C5A880]/20">
                <div>
                  <h3 className="text-xl font-bold text-[#FDFBF7]">
                    {lang === 'bn' ? 'যোগাযোগ পেজের বার্তা ইনবক্স' : 'Contact Page Inquiries'}
                  </h3>
                  <p className="text-xs text-[#A89884] mt-0.5">
                    {lang === 'bn'
                      ? 'ওয়েবসাইটের যোগাযোগ (Contact) পেজ থেকে ব্যবহারকারীদের পাঠানো বার্তাসমূহ।'
                      : 'Messages submitted through the official Contact Us page.'}
                  </p>
                </div>

                {contactMessages.filter(m => m.source !== 'alumni-directory').length === 0 ? (
                  <div className="p-8 text-center rounded-2xl plaque-elevated border border-[#C5A880]/20 text-xs text-[#A89884]">
                    {lang === 'bn' ? 'কোনো বার্তা এখনো জমা হয়নি।' : 'Inbox is empty — no contact messages yet.'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contactMessages.filter(m => m.source !== 'alumni-directory').map((msg) => (
                      <div key={msg.id} className="p-5 rounded-2xl plaque-elevated border border-[#C5A880]/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              msg.status === 'resolved'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}>
                              {msg.status === 'resolved' ? (lang === 'bn' ? 'সমাধানকৃত' : 'Resolved') : (lang === 'bn' ? 'অপঠিত / নতুন' : 'Unread')}
                            </span>
                            <h4 className="font-bold text-[#FDFBF7] text-sm">{msg.subject}</h4>
                            <span className="text-[11px] font-mono text-[#A89884]">
                              ({msg.source === 'alumni-directory' ? (lang === 'bn' ? 'ডিরেক্টরি' : 'Directory') : (lang === 'bn' ? 'যোগাযোগ পেজ' : 'Contact Page')})
                            </span>
                          </div>
                          <p className="text-xs text-[#DCD3C1] leading-relaxed">{msg.message}</p>
                          <p className="text-[11px] font-mono text-[#A89884]">
                            {lang === 'bn' ? 'প্রেরক:' : 'From:'} <strong className="text-[#DFCA9E]">{msg.name}</strong> • {msg.email || msg.phone}
                            {msg.recipientName ? ` → ${msg.recipientName}` : ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {msg.status !== 'resolved' && (
                            <button
                              type="button"
                              onClick={() => {
                                updateContactStatus(msg.id, 'resolved');
                                showToast(lang === 'bn' ? 'বার্তা সমাধানকৃত চিহ্নিত!' : 'Marked resolved!');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                            >
                              {lang === 'bn' ? 'সমাধান হয়েছে' : 'Mark Resolved'}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              deleteContactMessage(msg.id);
                              showToast(lang === 'bn' ? 'বার্তা মুছে ফেলা হয়েছে।' : 'Message deleted.');
                            }}
                            className="btn-action-delete p-2 rounded-lg"
                            title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 9: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <motion.div
              key="tab-settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 max-w-2xl"
            >
            <div>
              <h3 className="text-xl font-bold text-[#FDFBF7]">{lang === 'bn' ? 'সিস্টেম কনফিগারেশন ও ডাটা ব্যাকআপ' : 'System Backup & Reset'}</h3>
              <p className="text-xs text-[#A89884] mt-0.5">{lang === 'bn' ? 'সব ডাটা রিসেট বা লোকাল ব্যাকআপ এক্সপোর্ট করার সুবিধা।' : 'Export database backup or restore initial defaults.'}</p>
            </div>

            {/* College Logo & Branding Card */}
            <div className="p-6 rounded-3xl plaque-elevated border border-[#C5A880]/20 space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
                  <ImageIcon className="w-3.5 h-3.5" />
                  {lang === 'bn' ? 'ব্র্যান্ডিং ও আইডেন্টিটি' : 'Branding & Identity'}
                </span>
                <h4 className="text-base font-bold text-[#FDFBF7]">
                  {lang === 'bn' ? 'কলেজ লোগো পরিবর্তন (College Logo Upload)' : 'Custom College Logo'}
                </h4>
                <p className="text-xs text-[#A89884] mt-1">
                  {lang === 'bn'
                    ? 'ওয়েবসাইটের সবার উপরে বামপাশে কলেজের নামের সাথে প্রদর্শিত অফিসিয়াল লোগোটি পরিবর্তন বা সেট করুন। গ্যালারি থেকে সরাসরি ছবি আপলোড করলে তা স্বয়ংক্রিয়ভাবে কম্প্রেস হয়ে Cloudinary-তে সেভ হবে।'
                    : 'Set custom college logo displayed in the top navbar next to college name. Upload directly from your gallery to save on Cloudinary.'}
                </p>
              </div>

              <CloudinaryImageInput
                label={lang === 'bn' ? 'কলেজ লোগো (গ্যালারি থেকে আপলোড)' : 'College Logo (Upload from Gallery)'}
                value={customLogoUrl}
                onChange={setCustomLogoUrl}
                lang={lang}
                fallbackIcon={ImageIcon}
                apiBaseUrl={apiBaseUrl}
                folder="rtec-alumni/branding"
                darkSurface
              />

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    updateCollegeLogo(customLogoUrl);
                    showToast(lang === 'bn' ? 'কলেজ লোগো সফলভাবে সংরক্ষিত ও আপডেট হয়েছে!' : 'College logo saved and updated successfully!');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>{lang === 'bn' ? 'লোগো সংরক্ষণ করুন (Save Logo)' : 'Save College Logo'}</span>
                </button>

                {collegeLogo && (
                  <button
                    type="button"
                    onClick={() => {
                      resetCollegeLogo();
                      setCustomLogoUrl('');
                      showToast(lang === 'bn' ? 'ডিফল্ট RTEC লোগো ব্যাজ ফিরিয়ে আনা হয়েছে!' : 'Restored default RTEC logo badge!');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#181715] hover:bg-[#201E1A] border border-[#C5A880]/20 text-[#DCD3C1] hover:text-[#FDFBF7] font-bold text-xs flex items-center gap-2 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'ডিফল্ট লোগোতে ফিরুন (Reset)' : 'Reset to Default'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Footer & Official Contact Information Card */}
            <div className="p-6 rounded-3xl plaque-elevated border border-[#C5A880]/20 space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
                  <Phone className="w-3.5 h-3.5" />
                  {lang === 'bn' ? 'ফুটার ও প্রাতিষ্ঠানিক যোগাযোগ' : 'Footer & Official Contacts'}
                </span>
                <h4 className="text-base font-bold text-[#FDFBF7]">
                  {lang === 'bn' ? 'ফুটার তথ্য ও যোগাযোগ সম্পাদনা (Footer Information)' : 'Footer Contact & Address Configuration'}
                </h4>
                <p className="text-xs text-[#A89884] mt-1 leading-relaxed">
                  {lang === 'bn'
                    ? 'ওয়েবসাইটের ফুটারে প্রদর্শিত কলেজের অফিশিয়াল ফোন নম্বর, ইমেইল/জিমেইল অ্যাড্রেস এবং বাংলা ও ইংরেজি ঠিকানা এখান থেকে সরাসরি পরিবর্তন করা যাবে।'
                    : 'Configure official contact numbers, institutional email, and campus address displayed across all page footers.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-[#DCD3C1] mb-1">
                    {lang === 'bn' ? 'অফিসিয়াল ফোন নম্বর / হেল্পলাইন' : 'Official Phone / Helpline'}
                  </label>
                  <input
                    type="text"
                    value={footerPhone}
                    onChange={(e) => setFooterPhone(e.target.value)}
                    placeholder="+880 521-55421"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141311] border border-[#C5A880]/30 text-xs text-[#FDFBF7] font-mono-tech focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Email / Gmail */}
                <div>
                  <label className="block text-xs font-semibold text-[#DCD3C1] mb-1">
                    {lang === 'bn' ? 'অফিসিয়াল ইমেইল / জিমেইল অ্যাড্রেস' : 'Official Email / Gmail'}
                  </label>
                  <input
                    type="email"
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                    placeholder="info@rtec.edu.bd"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141311] border border-[#C5A880]/30 text-xs text-[#FDFBF7] font-mono-tech focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Address BN */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#DCD3C1] mb-1">
                    {lang === 'bn' ? 'কলেজের পূর্ণাঙ্গ ঠিকানা (বাংলা)' : 'Full Campus Address (Bengali)'}
                  </label>
                  <input
                    type="text"
                    value={footerAddressBn}
                    onChange={(e) => setFooterAddressBn(e.target.value)}
                    placeholder="টুকুরিয়া, পীরগঞ্জ, রংপুর-৫৪২০, বাংলাদেশ"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141311] border border-[#C5A880]/30 text-xs text-[#FDFBF7] font-sans focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Address EN */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#DCD3C1] mb-1">
                    {lang === 'bn' ? 'কলেজের ঠিকানা (ইংরেজি)' : 'Campus Address (English)'}
                  </label>
                  <input
                    type="text"
                    value={footerAddressEn}
                    onChange={(e) => setFooterAddressEn(e.target.value)}
                    placeholder="Tukuriya, Pirganj, Rangpur-5420, Bangladesh"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141311] border border-[#C5A880]/30 text-xs text-[#FDFBF7] font-sans focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    updateFooterContact({
                      phone: footerPhone,
                      email: footerEmail,
                      addressBn: footerAddressBn,
                      addressEn: footerAddressEn
                    });
                    showToast(lang === 'bn' ? 'ফুটার তথ্য সফলভাবে সংরক্ষিত ও আপডেট হয়েছে!' : 'Footer contact details saved and published!');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/50 transition cursor-pointer"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>{lang === 'bn' ? 'ফুটার তথ্য সংরক্ষণ করুন' : 'Save Footer Information'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetFooterContact();
                    setFooterPhone('+880 521-55421');
                    setFooterEmail('info@rtec.edu.bd');
                    setFooterAddressBn('টুকুরিয়া, পীরগঞ্জ, রংপুর-৫৪২০, বাংলাদেশ');
                    setFooterAddressEn('Tukuriya, Pirganj, Rangpur-5420, Bangladesh');
                    showToast(lang === 'bn' ? 'ডিফল্ট ফুটার তথ্য ফিরিয়ে আনা হয়েছে!' : 'Restored default footer details!');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#181715] hover:bg-[#201E1A] border border-[#C5A880]/20 text-[#DCD3C1] hover:text-[#FDFBF7] font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'ডিফল্ট তথ্যে ফিরে যান' : 'Reset to Default'}</span>
                </button>
              </div>
            </div>

            {/* Authorized Admin Gmails Management Card */}
            <div className="p-6 rounded-3xl plaque-elevated border border-[#C5A880]/20 space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {lang === 'bn' ? 'অ্যাডমিন সিকিউরিটি ও এক্সেস' : 'Admin Security & Access'}
                </span>
                <h4 className="text-base font-bold text-[#FDFBF7]">
                  {lang === 'bn' ? 'অনুমোদিত অ্যাডমিন জিমেইল তালিকা (Authorized Admin Gmails)' : 'Authorized Admin Gmail Accounts'}
                </h4>
                <p className="text-xs text-[#A89884] mt-1">
                  {lang === 'bn'
                    ? 'শুধুমাত্র নিচের তালিকায় থাকা জিমেইল অ্যাকাউন্টগুলো দিয়ে লগইন করলেই এই অ্যাডমিন প্যানেল দেখা ও ব্যবহার করা যাবে। সাধারণ শিক্ষার্থী বা অন্য কেউ কখনোই অ্যাডমিন অপশন দেখতে পাবে না।'
                    : 'Only Gmail accounts listed below are authorized to access and control the Administrator Console. Guests and students will never see admin buttons.'}
                </p>
              </div>

              {/* Admin Emails List */}
              <div className="space-y-2.5">
                {adminEmails.map((admEmail) => {
                  const isMaster = ['megasonic298@gmail.com', 'arnab.rts761@gmail.com'].includes(admEmail.toLowerCase().trim());
                  return (
                    <div
                      key={admEmail}
                      className="p-3.5 rounded-2xl bg-[#141311] border border-[#C5A880]/20 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono-tech text-xs sm:text-sm font-bold text-[#FDFBF7] truncate">
                              {admEmail}
                            </span>
                            {isMaster && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                {lang === 'bn' ? 'সুপার অ্যাডমিন' : 'Super Admin'}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#A89884] block">
                            {isMaster
                              ? (lang === 'bn' ? 'স্থায়ী সিস্টেম সুপার অ্যাডমিন' : 'Permanent System Super Admin')
                              : (lang === 'bn' ? 'অনুমোদিত সহকারী অ্যাডমিন' : 'Authorized Sub-Admin')}
                          </span>
                        </div>
                      </div>

                      {!isMaster && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm(lang === 'bn' ? `আপনি কি "${admEmail}"-এর অ্যাডমিন অ্যাক্সেস বাতিল করতে চান?` : `Remove admin access for "${admEmail}"?`)) {
                              await removeAdminEmail(admEmail);
                              showToast(lang === 'bn' ? 'অ্যাডমিন অ্যাক্সেস প্রত্যাহার করা হয়েছে' : 'Admin access removed');
                            }
                          }}
                          className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/30 text-xs transition cursor-pointer shrink-0"
                          title={lang === 'bn' ? 'অ্যাডমিন বাতিল করুন' : 'Remove Admin'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add New Admin Email Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newAdminEmailInput.trim()) return;
                  const res = await addAdminEmail(newAdminEmailInput.trim(), newAdminNoteInput.trim());
                  if (res.success) {
                    setNewAdminEmailInput('');
                    setNewAdminNoteInput('');
                    showToast(lang === 'bn' ? '✓ নতুন অ্যাডমিন জিমেইল সফলভাবে যোগ হয়েছে!' : '✓ New admin email authorized successfully!');
                  } else {
                    showToast(res.message || 'Error adding admin email');
                  }
                }}
                className="pt-2 space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#DCD3C1] mb-1">
                      {lang === 'bn' ? 'নতুন অ্যাডমিনের জিমেইল' : 'New Admin Gmail Address'}
                    </label>
                    <input
                      type="email"
                      required
                      value={newAdminEmailInput}
                      onChange={(e) => setNewAdminEmailInput(e.target.value)}
                      placeholder="teacher.name@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141311] border border-[#C5A880]/30 text-xs text-[#FDFBF7] font-mono-tech focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#DCD3C1] mb-1">
                      {lang === 'bn' ? 'পরিচিতি নোট (ঐচ্ছিক)' : 'Note / Identity (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={newAdminNoteInput}
                      onChange={(e) => setNewAdminNoteInput(e.target.value)}
                      placeholder={lang === 'bn' ? 'উদা: সহকারী শিক্ষক / মডারেটর' : 'e.g. Faculty Moderator'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141311] border border-[#C5A880]/30 text-xs text-[#FDFBF7] font-sans focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'নতুন অ্যাডমিন যুক্ত করুন' : 'Authorize Admin Email'}</span>
                </button>
              </form>
            </div>

            <div className="p-6 rounded-3xl plaque-elevated border border-[#C5A880]/20 space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#FDFBF7]">{lang === 'bn' ? 'JSON ব্যাকআপ ডাউনলোড' : 'Download JSON Backup'}</h4>
                <p className="text-xs text-[#A89884]">
                  {lang === 'bn'
                    ? 'বর্তমান শিক্ষক, শিক্ষার্থী (১ম-৮ম ব্যাচ), এবং অ্যালামনাই ডেটাবেজের পূর্ণাঙ্গ JSON ব্যাকআপ ফাইল হিসেবে ডাউনলোড করুন।'
                    : 'Download full JSON snapshot of faculty, students (1st-8th batch), and alumni.'}
                </p>
                <button
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
                      teachers,
                      students,
                      alumni,
                      events,
                      jobs,
                      news
                    }, null, 2));
                    const dlAnchor = document.createElement('a');
                    dlAnchor.setAttribute("href", dataStr);
                    dlAnchor.setAttribute("download", `rtec_alumni_backup_${new Date().toISOString().split('T')[0]}.json`);
                    dlAnchor.click();
                    showToast(lang === 'bn' ? 'ব্যাকআপ ফাইল সফলভাবে ডাউনলোড হয়েছে!' : 'Backup downloaded successfully!');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#181715] hover:bg-[#201E1A] border border-[#C5A880]/20 text-xs font-bold text-emerald-400 flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'সম্পূর্ণ ডেটাবেজ ডাউনলোড করুন (Export JSON)' : 'Export Full JSON Backup'}</span>
                </button>
              </div>

              <div className="pt-6 border-t border-[#C5A880]/20 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-[#FDFBF7] flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'bn' ? 'লাইভ ব্যাকএন্ড সার্ভার (Render + MongoDB Atlas)' : 'Live Backend Server URL (Render + MongoDB Atlas)'}</span>
                  </h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold ${
                    mongoStatus?.isConnected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {mongoStatus?.isConnected
                      ? (lang === 'bn' ? '✓ সংযুক্ত (Connected)' : '✓ Connected')
                      : (lang === 'bn' ? '✗ অফলাইন / অপেক্ষমাণ' : '✗ Offline / Unreachable')}
                  </span>
                </div>
                <p className="text-xs text-[#A89884]">
                  {lang === 'bn'
                    ? 'Render-এ আপনার Node সার্ভার ডিপ্লয় করার পর প্রাপ্ত লাইভ URL (যেমন: https://rtec-alumni-api.onrender.com) এখানে দিয়ে টেস্ট ও সেভ করুন। UptimeRobot-এ এই URL-এর শেষে /api/health বসিয়ে পিং সেট করবেন।'
                    : 'Enter your deployed Render Web Service URL (e.g., https://rtec-alumni-api.onrender.com) to connect MongoDB Atlas live across all devices. Point UptimeRobot to <URL>/api/health.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={apiBaseUrlInput}
                    onChange={(e) => setApiBaseUrlInput(e.target.value)}
                    placeholder="https://rtec-alumni.onrender.com"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#141311] border border-[#C5A880]/30 text-xs text-[#FDFBF7] font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      const clean = updateApiBaseUrl?.(apiBaseUrlInput);
                      const health = await checkMongoHealth?.(clean);
                      if (health?.status === 'connected') {
                        showToast(lang === 'bn' ? '✓ লাইভ Render + MongoDB Atlas সফলভাবে কানেক্ট হয়েছে!' : '✓ Live Render + MongoDB Atlas connected!');
                      } else {
                        showToast(lang === 'bn' ? 'সার্ভার URL সেভ হয়েছে, তবে এখনো রেসপন্স আসেনি (Render চালু থাকলে ৩০ সেকেন্ড পরে টেস্ট করুন)।' : 'Backend URL saved, waiting for Render server response.');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shrink-0"
                  >
                    {lang === 'bn' ? 'সেভ ও কানেকশন টেস্ট' : 'Save & Test Connection'}
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-[#C5A880]/20 space-y-3">
                <h4 className="text-sm font-bold text-[#FDFBF7] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span>{lang === 'bn' ? 'Google OAuth Client ID সেটআপ (গুগল সাইন-ইন)' : 'Google OAuth Client ID (Real Google Sign-In)'}</span>
                </h4>
                <p className="text-xs text-[#A89884]">
                  {lang === 'bn'
                    ? 'Google Cloud Console থেকে প্রাপ্ত Web OAuth Client ID এখানে দিলে সাইন-ইন পপআপে আসল গুগল অ্যাকাউন্ট পিকার (One-Click Google Sign-In) সক্রিয় হবে।'
                    : 'Paste your Google Cloud OAuth 2.0 Web Client ID to activate official one-click Google Identity popup authentication.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={googleClientIdInput}
                    onChange={(e) => setGoogleClientIdInput(e.target.value)}
                    placeholder="xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#141311] border border-[#C5A880]/30 text-xs text-[#FDFBF7] font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updateGoogleClientId?.(googleClientIdInput);
                      showToast(lang === 'bn' ? '✓ Google Client ID সংরক্ষিত হয়েছে!' : '✓ Google Client ID saved!');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer shrink-0"
                  >
                    {lang === 'bn' ? 'Client ID সংরক্ষণ করুন' : 'Save Client ID'}
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-[#C5A880]/20 space-y-2">
                <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'লোকাল ক্যাশ রিসেট করুন (Reset Cache)' : 'Reset Local Cache'}</span>
                </h4>
                <p className="text-xs text-[#A89884]">
                  {lang === 'bn'
                    ? 'ব্রাউজারের লোকাল স্টোরেজ ক্যাশ পরিষ্কার করে মূল ডাটাবেজে ফিরে যেতে ক্লিক করুন।'
                    : 'Clear local browser cache and restore official initial records.'}
                </p>
                <button
                  onClick={() => {
                    if (window.confirm(lang === 'bn' ? 'আপনি কি নিশ্চিত যে লোকাল ক্যাশ রিসেট করতে চান?' : 'Are you sure you want to reset local cached data?')) {
                      resetAllData();
                      showToast(lang === 'bn' ? 'সকল লোকাল ক্যাশ সফলভাবে রিসেট করা হয়েছে!' : 'Local cache cleared and restored!');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-xs font-bold text-rose-300 flex items-center gap-2 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'ক্যাশ রিসেট চালান (Reset Cache)' : 'Reset Local Cache'}</span>
                </button>
              </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* CREATE & EDIT MODAL */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {modalType && (
            <motion.div
              key="admin-crud-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              data-admin-modal="true"
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setModalType(null);
                  setActiveItem(null);
                }
              }}
            >
              <motion.div
                key="admin-crud-modal-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-2xl bg-[#181715] border border-[#C5A880]/30 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto overscroll-contain"
              >
              <button
                onClick={() => {
                  setModalType(null);
                  setActiveItem(null);
                }}
                className="absolute top-5 right-5 p-2 rounded-xl bg-[#201E1A] text-[#DCD3C1] hover:text-[#FDFBF7]"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-[#FDFBF7] mb-4">
                {modalType === 'addTeacher' && (lang === 'bn' ? 'নতুন শিক্ষক যুক্ত করুন' : 'Add New Teacher')}
                {modalType === 'editTeacher' && (lang === 'bn' ? 'শিক্ষকের তথ্য পরিবর্তন করুন' : 'Edit Teacher Details')}
                {modalType === 'addStudent' && (lang === 'bn' ? 'নতুন শিক্ষার্থী যুক্ত করুন' : 'Add New Student')}
                {modalType === 'editStudent' && (lang === 'bn' ? 'শিক্ষার্থীর তথ্য পরিবর্তন করুন' : 'Edit Student Details')}
                {modalType === 'addAlumni' && (lang === 'bn' ? 'নতুন অ্যালামনাই যুক্ত করুন' : 'Add New Alumni')}
                {modalType === 'editAlumni' && (lang === 'bn' ? 'অ্যালামনাই প্রোফাইল পরিবর্তন করুন' : 'Edit Alumni Profile')}
                {modalType === 'addJob' && (lang === 'bn' ? 'নতুন চাকরির বিজ্ঞপ্তি দিন' : 'Post Job Circular')}
                {modalType === 'editJob' && (lang === 'bn' ? 'চাকরির বিজ্ঞপ্তি সম্পাদনা করুন' : 'Edit Job Circular')}
                {modalType === 'addNews' && (lang === 'bn' ? 'নতুন নোটিশ প্রকাশ করুন' : 'Publish Notice')}
                {modalType === 'editNews' && (lang === 'bn' ? 'নোটিশ সম্পাদনা করুন' : 'Edit Notice')}
              </h3>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                {/* TEACHER FORM */}
                {(modalType === 'addTeacher' || modalType === 'editTeacher') && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'নাম (বাংলায়) *' : 'Name (Bengali) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.nameBn || ''}
                          onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                          placeholder={lang === 'bn' ? 'উদা: ইঞ্জিনিয়ার মোঃ সাইফুর রহমান' : 'e.g. ইঞ্জিনিয়ার মোঃ সাইফুর রহমান'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'নাম (ইংরেজিতে) *' : 'Name (English) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={lang === 'bn' ? 'উদা: Engr. Md. Saifur Rahman' : 'e.g. Engr. Md. Saifur Rahman'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'পদবী (বাংলায়) *' : 'Designation (Bengali) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.designationBn || ''}
                          onChange={(e) => setFormData({ ...formData, designationBn: e.target.value })}
                          placeholder={lang === 'bn' ? 'উদা: সহযোগী অধ্যাপক' : 'e.g. সহযোগী অধ্যাপক'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'পদবী (ইংরেজিতে) *' : 'Designation (English) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.designation || ''}
                          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                          placeholder={lang === 'bn' ? 'উদা: Associate Professor' : 'e.g. Associate Professor'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'বিভাগ (Department) *' : 'Department *'}
                        </label>
                        <select
                          value={formData.department || 'Yarn Engineering'}
                          onChange={(e) => {
                            const val = e.target.value;
                            const deptMap = {
                              'Yarn Engineering': 'ইয়ার্ন ইঞ্জিনিয়ারিং',
                              'Fabric Engineering': 'ফ্যাব্রিক ইঞ্জিনিয়ারিং',
                              'Wet Process Engineering': 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং',
                              'Apparel Manufacturing': 'অ্যাপারেল ম্যানুফ্যাকচারিং',
                              'Basic Science': 'বেসিক সায়েন্স'
                            };
                            setFormData({
                              ...formData,
                              department: val,
                              deptBn: deptMap[val] || val
                            });
                          }}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        >
                          <option value="Yarn Engineering">{lang === 'bn' ? 'ইয়ার্ন ইঞ্জিনিয়ারিং (YE)' : 'Yarn Engineering (YE)'}</option>
                          <option value="Fabric Engineering">{lang === 'bn' ? 'ফ্যাব্রিক ইঞ্জিনিয়ারিং (FE)' : 'Fabric Engineering (FE)'}</option>
                          <option value="Wet Process Engineering">{lang === 'bn' ? 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং (WPE)' : 'Wet Process Engineering (WPE)'}</option>
                          <option value="Apparel Manufacturing">{lang === 'bn' ? 'অ্যাপারেল ম্যানুফ্যাকচারিং (AE)' : 'Apparel Manufacturing (AE)'}</option>
                          <option value="Basic Science">{lang === 'bn' ? 'বেসিক সায়েন্স' : 'Basic Science'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'অফিস কক্ষ (Office Room)' : 'Office Room'}
                        </label>
                        <input
                          type="text"
                          value={formData.officeRoom || ''}
                          onChange={(e) => setFormData({ ...formData, officeRoom: e.target.value })}
                          placeholder={lang === 'bn' ? 'একাডেমিক ভবন, কক্ষ ২০৪' : 'Academic Building, Room 204'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'ইমেইল (Email)' : 'Email Address'}
                        </label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@rtec.edu.bd"
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'ফোন নম্বর (Phone)' : 'Phone Number'}
                        </label>
                        <input
                          type="text"
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+880 1712-345678"
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">
                        {lang === 'bn' ? 'শিক্ষাগত যোগ্যতা (Education)' : 'Academic Qualifications / Education'}
                      </label>
                      <input
                        type="text"
                        value={formData.education || ''}
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        placeholder={lang === 'bn' ? 'বি.এসসি এবং এম.এসসি ইন টেক্সটাইল ইঞ্জিনিয়ারিং (বুটেক্স)' : 'M.Sc. in Textile Eng. (BUTEX), B.Sc. in Textile Eng.'}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">
                        {lang === 'bn' ? 'গবেষণা ও স্পেশালাইজেশন (Research Interests)' : 'Research & Specialization'}
                      </label>
                      <input
                        type="text"
                        value={formData.research || ''}
                        onChange={(e) => setFormData({ ...formData, research: e.target.value })}
                        placeholder={lang === 'bn' ? 'পরিবেশবান্ধব ডাইং, স্মার্ট টেক্সটাইল' : 'Eco-friendly Dyeing, Nano-finishing, Smart Textiles'}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>

                    <CloudinaryImageInput
                      label={lang === 'bn' ? 'শিক্ষকের ছবি (গ্যালারি থেকে আপলোড)' : 'Faculty Photo (Upload from Gallery)'}
                      value={formData.photo || ''}
                      onChange={(val) => setFormData({ ...formData, photo: val })}
                      lang={lang}
                      fallbackIcon={GraduationCap}
                      apiBaseUrl={apiBaseUrl}
                      folder="rtec-alumni/teachers"
                      darkSurface
                    />

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="isHod"
                        checked={formData.isHod || false}
                        onChange={(e) => setFormData({ ...formData, isHod: e.target.checked })}
                        className="rounded border-slate-800"
                      />
                      <label htmlFor="isHod" className="text-slate-300 font-semibold">
                        {lang === 'bn' ? 'তিনি কি বিভাগীয় প্রধান (Head of Department)?' : 'Is this faculty member Head of Department?'}
                      </label>
                    </div>
                  </>
                )}

                {/* STUDENT FORM: 1st to 8th Batch, NO roll, NO cgpa, only regNo */}
                {(modalType === 'addStudent' || modalType === 'editStudent') && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'নাম (বাংলায়) *' : 'Name (Bengali) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.nameBn || ''}
                          onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                          placeholder={lang === 'bn' ? 'উদা: মো. রিয়াজুল ইসলাম' : 'e.g. মো. রিয়াজুল ইসলাম'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'নাম (ইংরেজিতে) *' : 'Name (English) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={lang === 'bn' ? 'উদা: Md. Riazul Islam' : 'e.g. Md. Riazul Islam'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'রেজিস্ট্রেশন নম্বর (Registration No.) *' : 'Registration No *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.regNo || ''}
                          onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                          placeholder="2018-10-01"
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'রক্তের গ্রুপ (Blood Group)' : 'Blood Group'}
                        </label>
                        <select
                          value={formData.bloodGroup || ''}
                          onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        >
                          <option value="">{lang === 'bn' ? 'ফাঁকা / Unset (Empty)' : 'Empty / Unset'}</option>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'ব্যাচ (Batch: ১ম - ৮ম) *' : 'Batch (1st - 8th) *'}
                        </label>
                        <select
                          value={formData.batch || '8th Batch (2025-26)'}
                          onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        >
                          {BATCH_OPTIONS.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'বিভাগ (Department) *' : 'Department *'}
                        </label>
                        <select
                          value={formData.department || 'Yarn Engineering'}
                          onChange={(e) => {
                            const val = e.target.value;
                            const deptMap = {
                              'Yarn Engineering': 'ইয়ার্ন ইঞ্জিনিয়ারিং',
                              'Fabric Engineering': 'ফ্যাব্রিক ইঞ্জিনিয়ারিং',
                              'Wet Process Engineering': 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং',
                              'Apparel Manufacturing': 'অ্যাপারেল ম্যানুফ্যাকচারিং'
                            };
                            setFormData({
                              ...formData,
                              department: val,
                              deptBn: deptMap[val] || val
                            });
                          }}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        >
                          <option value="Yarn Engineering">{lang === 'bn' ? 'ইয়ার্ন ইঞ্জিনিয়ারিং (YE)' : 'Yarn Engineering'}</option>
                          <option value="Fabric Engineering">{lang === 'bn' ? 'ফ্যাব্রিক ইঞ্জিনিয়ারিং (FE)' : 'Fabric Engineering'}</option>
                          <option value="Wet Process Engineering">{lang === 'bn' ? 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং (WPE)' : 'Wet Process Engineering'}</option>
                          <option value="Apparel Manufacturing">{lang === 'bn' ? 'অ্যাপারেল ম্যানুফ্যাকচারিং (AE)' : 'Apparel Manufacturing'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'শিক্ষাবর্ষ (Session)' : 'Session'}
                        </label>
                        <input
                          type="text"
                          value={formData.session || ''}
                          onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                          placeholder="2025-2026"
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'পদবী/দায়িত্ব (Role)' : 'Role'}
                        </label>
                        <input
                          type="text"
                          value={formData.role || ''}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          placeholder={lang === 'bn' ? 'ক্লাস প্রতিনিধি (CR) / সদস্য' : 'Class Representative (CR) / Member'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'ইমেইল (Email)' : 'Email Address'}
                        </label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="student@rtec.edu.bd"
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'ফোন নম্বর (Phone)' : 'Phone Number'}
                        </label>
                        <input
                          type="text"
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+880 1..."
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">
                        {lang === 'bn' ? 'ক্লাব ও সহশিক্ষা কার্যক্রম' : 'Activities & Clubs'}
                      </label>
                      <input
                        type="text"
                        value={formData.activities || ''}
                        onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                        placeholder={lang === 'bn' ? 'আরটেক টেক্সটাইল ক্লাব, ডিবেট, ক্রীড়া' : 'RTEC Textile Club, Debate Society, Sports'}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>

                    {/* Career, Designation, Company & Work Location */}
                    <div className="pt-3 border-t border-slate-800/80 space-y-3">
                      <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'চাকরি, পদবী ও কর্মস্থলের ঠিকানা (ফাঁকা রাখলে Unset হবে)' : 'Career, Designation & Location (Leave blank for Unset)'}</span>
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-400 block mb-1">
                            {lang === 'bn' ? 'পেশা / পদবী (Designation)' : 'Job Title / Designation'}
                          </label>
                          <input
                            type="text"
                            value={formData.designation || ''}
                            onChange={(e) => {
                              const des = e.target.value;
                              const comp = formData.company || '';
                              setFormData({
                                ...formData,
                                designation: des,
                                currentJob: des && comp ? `${des}, ${comp}` : (des || comp || '')
                              });
                            }}
                            placeholder={lang === 'bn' ? 'উদা: Production Officer' : 'e.g. Production Officer'}
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">
                            {lang === 'bn' ? 'প্রতিষ্ঠান / কোম্পানি (Company)' : 'Company / Organization'}
                          </label>
                          <input
                            type="text"
                            value={formData.company || ''}
                            onChange={(e) => {
                              const comp = e.target.value;
                              const des = formData.designation || '';
                              setFormData({
                                ...formData,
                                company: comp,
                                currentJob: des && comp ? `${des}, ${comp}` : (des || comp || '')
                              });
                            }}
                            placeholder={lang === 'bn' ? 'উদা: Square Textiles Ltd.' : 'e.g. Square Textiles Ltd.'}
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-400 block mb-1">
                            {lang === 'bn' ? 'বর্তমান চাকরি / সারসংক্ষেপ (Current Job)' : 'Current Job / Role Summary'}
                          </label>
                          <input
                            type="text"
                            value={formData.currentJob || ''}
                            onChange={(e) => setFormData({ ...formData, currentJob: e.target.value })}
                            placeholder={lang === 'bn' ? 'ফাঁকা রাখলে Unset দেখাবে' : 'Leave blank for Unset'}
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">
                            {lang === 'bn' ? 'কর্মস্থল / বর্তমান ঠিকানা (Location)' : 'Work / Current Location'}
                          </label>
                          <input
                            type="text"
                            value={formData.currentLocation || formData.workLocation || ''}
                            onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value, workLocation: e.target.value })}
                            placeholder={lang === 'bn' ? 'উদা: Gazipur, Dhaka' : 'e.g. Gazipur, Dhaka'}
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-400 block mb-1">
                            {lang === 'bn' ? 'ইন্ডাস্ট্রি সেক্টর (Job Sector)' : 'Industry Sector'}
                          </label>
                          <input
                            type="text"
                            value={formData.jobSector || ''}
                            onChange={(e) => setFormData({ ...formData, jobSector: e.target.value })}
                            placeholder={lang === 'bn' ? 'উদা: Dyeing & Finishing' : 'e.g. Dyeing & Finishing'}
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">
                            {lang === 'bn' ? 'অভিজ্ঞতা (Experience)' : 'Experience'}
                          </label>
                          <input
                            type="text"
                            value={formData.experienceYears || ''}
                            onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                            placeholder={lang === 'bn' ? 'উদা: ২ বছর' : 'e.g. 2 Years'}
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'LinkedIn / পোর্টফোলিও লিংক' : 'LinkedIn / Portfolio URL'}
                        </label>
                        <input
                          type="text"
                          value={formData.linkedin || ''}
                          onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                          placeholder="https://www.linkedin.com/in/..."
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <CloudinaryImageInput
                      label={lang === 'bn' ? 'শিক্ষার্থীর ছবি (গ্যালারি থেকে আপলোড)' : 'Student Photo (Upload from Gallery)'}
                      value={formData.avatar || ''}
                      onChange={(val) => setFormData({ ...formData, avatar: val })}
                      lang={lang}
                      fallbackIcon={Users}
                      apiBaseUrl={apiBaseUrl}
                      folder="rtec-alumni/students"
                      darkSurface
                    />
                  </>
                )}

                {/* ALUMNI FORM: 1st to 8th Batch */}
                {(modalType === 'addAlumni' || modalType === 'editAlumni') && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'নাম (বাংলায়) *' : 'Name (Bengali) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.nameBn || ''}
                          onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                          placeholder={lang === 'bn' ? 'উদা: প্রকৌ. মাহমুদুল হাসান' : 'e.g. প্রকৌ. মাহমুদুল হাসান'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'নাম (ইংরেজিতে) *' : 'Name (English) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={lang === 'bn' ? 'উদা: Engr. Mahmudul Hasan' : 'e.g. Engr. Mahmudul Hasan'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'ব্যাচ (১ম - ৮ম) *' : 'Batch (1st - 8th) *'}
                        </label>
                        <select
                          value={formData.batch || '1st Batch (2018-19)'}
                          onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        >
                          {BATCH_OPTIONS.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'পাসিং বছর *' : 'Passing Year *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.passingYear || ''}
                          onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                          placeholder="2023"
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'বিভাগ *' : 'Department *'}
                        </label>
                        <select
                          value={formData.department || 'Yarn Engineering'}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        >
                          <option value="Yarn Engineering">{lang === 'bn' ? 'ইয়ার্ন ইঞ্জিনিয়ারিং (YE)' : 'Yarn Engineering'}</option>
                          <option value="Fabric Engineering">{lang === 'bn' ? 'ফ্যাব্রিক ইঞ্জিনিয়ারিং (FE)' : 'Fabric Engineering'}</option>
                          <option value="Wet Process Engineering">{lang === 'bn' ? 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং (WPE)' : 'Wet Process Engineering'}</option>
                          <option value="Apparel Manufacturing">{lang === 'bn' ? 'অ্যাপারেল ম্যানুফ্যাকচারিং (AE)' : 'Apparel Manufacturing'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'বর্তমান পদবী *' : 'Current Role / Designation *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.role || ''}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          placeholder={lang === 'bn' ? 'সিনিয়র এক্সিকিউটিভ / প্রোডাকশন ম্যানেজার' : 'General Manager (Operations)'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'কোম্পানি / প্রতিষ্ঠান *' : 'Company / Organization *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.company || ''}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder={lang === 'bn' ? 'স্কয়ার / ডিবিএল / বেক্সিমকো টেক্সটাইলস' : 'Square Textiles Ltd.'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'ইমেইল' : 'Email'}
                        </label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'চাকরির লোকেশন' : 'Work Location'}
                        </label>
                        <input
                          type="text"
                          value={formData.workLocation || formData.location || ''}
                          onChange={(e) => setFormData({ ...formData, workLocation: e.target.value, location: e.target.value })}
                          placeholder={lang === 'bn' ? 'ঢাকা / গাজীপুর / বিদেশে' : 'Dhaka / Gazipur / UK'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'ইন্ডাস্ট্রি সেক্টর' : 'Industry Sector'}
                        </label>
                        <input
                          type="text"
                          value={formData.jobSector || ''}
                          onChange={(e) => setFormData({ ...formData, jobSector: e.target.value })}
                          placeholder={lang === 'bn' ? 'উদা: Apparel & Merchandising / Dyeing' : 'e.g. Apparel & Merchandising'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'অভিজ্ঞতা / মেয়াদ' : 'Experience'}
                        </label>
                        <input
                          type="text"
                          value={formData.experienceYears || ''}
                          onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                          placeholder={lang === 'bn' ? 'উদা: ২ বছর / ২০২২-বর্তমান' : 'e.g. 2+ Years'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <CloudinaryImageInput
                      label={lang === 'bn' ? 'অ্যালামনাই ছবি (গ্যালারি থেকে আপলোড)' : 'Alumni Photo (Upload from Gallery)'}
                      value={formData.avatar || ''}
                      onChange={(val) => setFormData({ ...formData, avatar: val })}
                      lang={lang}
                      fallbackIcon={Award}
                      apiBaseUrl={apiBaseUrl}
                      folder="rtec-alumni/alumni"
                      darkSurface
                    />

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isVerified"
                          checked={formData.isVerified || false}
                          onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                        />
                        <label htmlFor="isVerified" className="text-slate-300 font-semibold cursor-pointer">
                          {lang === 'bn' ? 'অ্যালামনাই ভেরিফাইড ব্লু-ব্যাজ অনুমোদন করুন' : 'Grant Verified Alumni Blue-Badge'}
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isMentor"
                          checked={formData.isMentor || false}
                          onChange={(e) => setFormData({ ...formData, isMentor: e.target.checked })}
                        />
                        <label htmlFor="isMentor" className="text-emerald-300 font-semibold cursor-pointer">
                          {lang === 'bn' ? 'সিনিয়র মেন্টর হিসেবে যুক্ত করুন' : 'Feature on Mentorship Page'}
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {/* JOB CIRCULAR FORM */}
                {(modalType === 'addJob' || modalType === 'editJob') && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'চাকরির পদবী (বাংলায়) *' : 'Job Title (Bengali) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.titleBn || ''}
                          onChange={(e) => setFormData({ ...formData, titleBn: e.target.value, title: formData.title || e.target.value })}
                          placeholder={lang === 'bn' ? 'উদা: কোয়ালিটি অ্যাসুরেন্স এক্সিকিউটিভ' : 'e.g. কোয়ালিটি অ্যাসুরেন্স এক্সিকিউটিভ'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'পদের নাম (ইংরেজিতে) *' : 'Job Title (English) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title || ''}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value, titleBn: formData.titleBn || e.target.value })}
                          placeholder={lang === 'bn' ? 'উদা: কোয়ালিটি অ্যাসুরেন্স এক্সিকিউটিভ' : 'e.g. Quality Assurance Executive'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'কোম্পানি / মিলস এর নাম *' : 'Company / Mills Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.company || ''}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder={lang === 'bn' ? 'উদা: বেক্সিমকো / স্কয়ার / হা-মীম গ্রুপ' : 'e.g. Beximco Textiles / Square / Ha-Meem'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'লোকেশন / কর্মস্থল' : 'Location / Job Site'}
                        </label>
                        <input
                          type="text"
                          value={formData.location || ''}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder={lang === 'bn' ? 'গাজীপুর / নারায়ণগঞ্জ / ঢাকা' : 'Gazipur / Narayanganj / Dhaka'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'কাজের ধরন (Type)' : 'Job Type'}
                        </label>
                        <select
                          value={formData.type || 'Full-time'}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        >
                          <option value="Full-time">{lang === 'bn' ? 'ফুল-টাইম (Full-time)' : 'Full-time'}</option>
                          <option value="Internship / Entry Level">{lang === 'bn' ? 'ইন্টার্নশিপ / এন্ট্রি লেভেল' : 'Internship / Entry Level'}</option>
                          <option value="Management Trainee (MTO)">{lang === 'bn' ? 'ম্যানেজমেন্ট ট্রেইনি (MTO)' : 'Management Trainee (MTO)'}</option>
                          <option value="Contractual">{lang === 'bn' ? 'চুক্তিভিত্তিক' : 'Contractual'}</option>
                          <option value="Remote">{lang === 'bn' ? 'রিমোট / পার্ট টাইম' : 'Remote / Part Time'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'বিভাগ / ফিল্ড' : 'Department'}
                        </label>
                        <select
                          value={formData.department || 'Yarn Engineering'}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        >
                          <option value="Yarn Engineering">{lang === 'bn' ? 'ইয়ার্ন ইঞ্জিনিয়ারিং (YE)' : 'Yarn Engineering (YE)'}</option>
                          <option value="Fabric Engineering">{lang === 'bn' ? 'ফ্যাব্রিক ইঞ্জিনিয়ারিং (FE)' : 'Fabric Engineering (FE)'}</option>
                          <option value="Wet Process Engineering">{lang === 'bn' ? 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং (WPE)' : 'Wet Process Engineering (WPE)'}</option>
                          <option value="Apparel Manufacturing">{lang === 'bn' ? 'অ্যাপারেল ম্যানুফ্যাকচারিং (AE)' : 'Apparel Manufacturing (AE)'}</option>
                          <option value="All Textile Engineering">{lang === 'bn' ? 'সকল টেক্সটাইল বিভাগ' : 'All Textile Departments'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'বেতন / পারিশ্রমিক' : 'Salary / Compensation'}
                        </label>
                        <input
                          type="text"
                          value={formData.salary || ''}
                          onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                          placeholder={lang === 'bn' ? '৳ ৩৫,০০০ - ৪৫,০০০ / Negotiable' : 'BDT 35,000 - 45,000 / Negotiable'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'আবেদনের শেষ তারিখ (Deadline)' : 'Application Deadline'}
                        </label>
                        <input
                          type="text"
                          value={formData.deadline || ''}
                          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                          placeholder="2026-12-31"
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'আবেদনের লিংক বা ইমেইল' : 'Apply URL / Contact Email'}
                        </label>
                        <input
                          type="text"
                          value={formData.applyLink || formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, applyLink: e.target.value, email: e.target.value })}
                          placeholder={lang === 'bn' ? 'career@company.com বা https://...' : 'career@company.com or https://...'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">
                        {lang === 'bn' ? 'কাজের বিবরণ ও প্রার্থীর যোগ্যতা (Job Description) *' : 'Job Description & Requirements *'}
                      </label>
                      <textarea
                        rows="3"
                        required
                        value={formData.description || formData.descriptionBn || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value, descriptionBn: e.target.value })}
                        placeholder={lang === 'bn' ? 'পদের দায়িত্ব, শিক্ষাগত যোগ্যতা এবং অভিজ্ঞতার বিবরণ লিখুন...' : 'Outline role responsibilities, qualifications, and experience requirements...'}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white leading-relaxed font-sans"
                      />
                    </div>

                    <CloudinaryImageInput
                      label={lang === 'bn' ? 'সার্কুলার ব্যানার বা ছবি (গ্যালারি থেকে আপলোড)' : 'Job Circular Banner / Image (Upload from Gallery)'}
                      value={formData.image || ''}
                      onChange={(val) => setFormData({ ...formData, image: val })}
                      lang={lang}
                      fallbackIcon={Briefcase}
                      apiBaseUrl={apiBaseUrl}
                      folder="rtec-alumni/jobs"
                      darkSurface
                    />

                    {/* PDF Circular Link */}
                    <div>
                      <label className="text-slate-400 block mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-bold text-[#DFCA9E]">
                          <FileText className="w-3.5 h-3.5 text-red-400" />
                          <span>{lang === 'bn' ? 'অফিসিয়াল PDF সার্কুলার ফাইল লিংক (Google Drive লিংক বা PDF URL)' : 'Official PDF Circular (Drive Link or URL)'}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {lang === 'bn' ? 'PDF সংযুক্তি' : 'PDF Attachment'}
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.pdfUrl || ''}
                        onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                        placeholder={lang === 'bn' ? 'https://drive.google.com/file/d/.../view বা https://.../circular.pdf' : 'https://drive.google.com/file/d/.../view or https://.../circular.pdf'}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px]"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        {lang === 'bn'
                          ? 'Google Drive-এর পিডিএফ ফাইলের শেয়ার লিংক ("Anyone with the link can view") এখানে পেস্ট করুন।'
                          : 'Paste shareable Google Drive link of the circular PDF.'}
                      </p>
                    </div>
                  </>
                )}

                {/* NOTICE / NEWS FORM */}
                {(modalType === 'addNews' || modalType === 'editNews') && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'নোটিশ শিরোনাম (বাংলায়) *' : 'Notice Title (Bengali) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.titleBn || ''}
                          onChange={(e) => setFormData({ ...formData, titleBn: e.target.value, title: formData.title || e.target.value })}
                          placeholder={lang === 'bn' ? 'উদা: সেমিস্টার ফাইনাল পরীক্ষার সময়সূচি ঘোষণা' : 'e.g. সেমিস্টার ফাইনাল পরীক্ষার সময়সূচি'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'নোটিশ শিরোনাম (ইংরেজিতে) *' : 'Notice Title (English) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title || ''}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value, titleBn: formData.titleBn || e.target.value })}
                          placeholder={lang === 'bn' ? 'উদা: Semester Final Exam Schedule' : 'e.g. Semester Final Examination Schedule Published'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'নোটিশ ক্যাটাগরি *' : 'Category *'}
                        </label>
                        <select
                          value={formData.category || 'Academic Notice'}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        >
                          <option value="Academic Notice">{lang === 'bn' ? 'Academic Notice (একাডেমিক নোটিশ)' : 'Academic Notice'}</option>
                          <option value="Examination">{lang === 'bn' ? 'Examination (পরীক্ষা সংক্রান্ত)' : 'Examination'}</option>
                          <option value="Admission">{lang === 'bn' ? 'Admission (ভর্তি সংক্রান্ত)' : 'Admission'}</option>
                          <option value="General Notice">{lang === 'bn' ? 'General Notice (সাধারণ নোটিশ)' : 'General Notice'}</option>
                          <option value="Holiday">{lang === 'bn' ? 'Holiday & Vacation (ছুটির নোটিশ)' : 'Holiday & Vacation'}</option>
                          <option value="Career & Placement">{lang === 'bn' ? 'Career & Placement (ক্যারিয়ার সংক্রান্ত)' : 'Career & Placement'}</option>
                          <option value="Urgent Notice">{lang === 'bn' ? 'Urgent Circular (জরুরি বিজ্ঞপ্তি)' : 'Urgent Circular'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">
                          {lang === 'bn' ? 'প্রকাশনার তারিখ (Date)' : 'Publish Date'}
                        </label>
                        <input
                          type="text"
                          value={formData.date || ''}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          placeholder={lang === 'bn' ? '১৯ নভেম্বর, ২০২৬ বা 2026-11-19' : '19 Nov, 2026 or 2026-11-19'}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">
                        {lang === 'bn' ? 'সংক্ষিপ্ত সারসংক্ষেপ (Short Summary)' : 'Short Summary (Preview)'}
                      </label>
                      <input
                        type="text"
                        value={lang === 'bn' ? (formData.summaryBn || formData.summary || '') : (formData.summary || formData.summaryBn || '')}
                        onChange={(e) => setFormData({ ...formData, summaryBn: e.target.value, summary: e.target.value })}
                        placeholder={lang === 'bn' ? 'কার্ডে প্রদর্শনের জন্য ১-২ লাইনের সারসংক্ষেপ...' : '1-2 line preview summary for the notice card...'}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">
                        {lang === 'bn' ? 'সম্পূর্ণ নোটিশের বিবরণ (Full Notice Details) *' : 'Full Notice Content *'}
                      </label>
                      <textarea
                        rows="4"
                        required
                        value={lang === 'bn' ? (formData.contentBn || formData.content || formData.description || '') : (formData.content || formData.contentBn || formData.description || '')}
                        onChange={(e) => setFormData({ ...formData, contentBn: e.target.value, content: e.target.value, description: e.target.value })}
                        placeholder={lang === 'bn' ? 'নোটিশের বিস্তারিত বিষয়বস্তু, নির্দেশনা এবং জরুরি নির্দেশাবলী লিখুন...' : 'Write full notice details, instructions, and important guidelines...'}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-sans leading-relaxed"
                      />
                    </div>

                    <CloudinaryImageInput
                      label={lang === 'bn' ? 'নোটিশ ব্যানার বা ছবি (গ্যালারি থেকে আপলোড)' : 'Notice Banner / Image (Upload from Gallery)'}
                      value={formData.image || ''}
                      onChange={(val) => setFormData({ ...formData, image: val })}
                      lang={lang}
                      fallbackIcon={Newspaper}
                      apiBaseUrl={apiBaseUrl}
                      folder="rtec-alumni/notices"
                      darkSurface
                    />

                    {/* PDF Circular Link */}
                    <div>
                      <label className="text-slate-400 block mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-bold text-[#DFCA9E]">
                          <FileText className="w-3.5 h-3.5 text-red-400" />
                          <span>{lang === 'bn' ? 'অফিসিয়াল PDF সার্কুলার ফাইল লিংক (Google Drive লিংক বা PDF URL)' : 'Official PDF Circular (Drive Link or URL)'}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {lang === 'bn' ? 'PDF সংযুক্তি' : 'PDF Attachment'}
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.pdfUrl || ''}
                        onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                        placeholder={lang === 'bn' ? 'https://drive.google.com/file/d/.../view বা https://.../notice.pdf' : 'https://drive.google.com/file/d/.../view or https://.../notice.pdf'}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px]"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        {lang === 'bn'
                          ? 'Google Drive-এর পিডিএফ ফাইলের শেয়ার লিংক ("Anyone with the link can view") এখানে পেস্ট করুন। ব্যবহারকারীরা সরাসরি ডাউনলোড ও দেখতে পারবে।'
                          : 'Paste shareable Google Drive link of the official notice PDF.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="isPinned"
                        checked={formData.isPinned || false}
                        onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                      />
                      <label htmlFor="isPinned" className="text-slate-300 font-semibold cursor-pointer">
                        {lang === 'bn' ? 'পিন নোটিশ হিসেবে ওপরে রাখুন (Pin to top)' : 'Pin notice to top of notice board'}
                      </label>
                    </div>
                  </>
                )}

                {/* Submit Buttons */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                  <div>
                    {modalType === 'editStudent' && activeItem?.regNo && (
                      <button
                        type="button"
                        onClick={() => {
                          const msg = lang === 'bn'
                            ? `${activeItem.name} (${activeItem.regNo})-এর সব ইউজার তথ্য (ইমেইল, ফোন, রক্তের গ্রুপ, চাকরি, লোকেশন, ছবি) মুছে Unclaimed ও Unset অবস্থায় ফেরত নেবেন?`
                            : `Undo & clear all claimed info (Email, Phone, Blood Group, Career, Location, Photo) for ${activeItem.name} (${activeItem.regNo}) back to Unclaimed & Unset?`;
                          if (window.confirm(msg)) {
                            resetStudentClaim(activeItem.regNo);
                            showToast(lang === 'bn'
                              ? `✓ ${activeItem.regNo}-এর সব ইউজার তথ্য মুছে Unclaimed & Unset করা হয়েছে!`
                              : `✓ Cleared & reset ${activeItem.regNo} back to Unclaimed & Unset!`);
                            setModalType(null);
                            setActiveItem(null);
                            setFormData({});
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/35 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'ইউজার তথ্য আনডু / আনক্লেম করুন' : 'Undo & Reset to Unclaimed'}</span>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 ml-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setModalType(null);
                        setActiveItem(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                    >
                      {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-lg shadow-emerald-950/50"
                    >
                      {lang === 'bn' ? 'সংরক্ষণ করুন (Save)' : 'Save Record'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}

      {/* DELETE CONFIRMATION MODAL */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              key="admin-delete-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              data-admin-modal="true"
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setDeleteConfirm(null);
                }
              }}
            >
              <motion.div
                key="admin-delete-modal-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-sm bg-[#181715] border border-rose-500/40 rounded-3xl p-6 text-center space-y-4 overscroll-contain shadow-2xl"
              >
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#FDFBF7]">
                  {lang === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?'}
                </h3>
                <p className="text-xs text-[#DCD3C1]">
                  <span className="font-bold text-rose-400">{deleteConfirm.name}</span>{' '}
                  {lang === 'bn' ? '-কে স্থায়ীভাবে ডেটাবেজ থেকে মুছে ফেলা হবে।' : 'will be permanently deleted.'}
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 rounded-xl bg-[#201E1A] text-[#DCD3C1] hover:text-[#FDFBF7] text-xs font-semibold cursor-pointer"
                  >
                    {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    onClick={executeDelete}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-950/50 cursor-pointer"
                  >
                    {lang === 'bn' ? 'হ্যাঁ, মুছে ফেলুন' : 'Yes, Delete'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* VIEW SUBMISSION DETAILS MODAL */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {viewSubmission && (
            <motion.div
              key="admin-viewsub-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              data-admin-modal="true"
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) setViewSubmission(null);
              }}
            >
              <motion.div
                key="admin-viewsub-modal-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-2xl bg-[#181715] border border-[#C5A880]/30 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto overscroll-contain"
              >
            <button
              onClick={() => setViewSubmission(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#201E1A] text-[#DCD3C1] hover:text-[#FDFBF7]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Overview in Modal */}
            <div className="flex items-start gap-4 pb-5 border-b border-[#C5A880]/20 mb-6">
              <UserAvatar
                src={viewSubmission.avatar}
                name={viewSubmission.name}
                role="student"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#C5A880]/40 shrink-0 bg-[#121110]"
                iconClassName="w-8 h-8 sm:w-10 sm:h-10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-[#FDFBF7] truncate">
                    {viewSubmission.name || (lang === 'bn' ? 'নাম নেই' : 'Unnamed')}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    viewSubmission.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : viewSubmission.status === 'declined'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {viewSubmission.status}
                  </span>
                </div>
                {viewSubmission.nameEn && (
                  <p className="text-xs text-[#A89884] font-sans">{viewSubmission.nameEn}</p>
                )}
                <p className="text-xs text-[#DFCA9E] font-mono-tech mt-1">
                  {viewSubmission.batch} • {lang === 'bn' ? (viewSubmission.deptBn || viewSubmission.department) : (viewSubmission.department || viewSubmission.deptBn)}
                </p>
                <p className="text-[10px] text-[#A89884] font-mono-tech mt-0.5">
                  {lang === 'bn' ? 'আবেদন সময়:' : 'Submitted:'} {viewSubmission.submittedAt}
                </p>
              </div>
            </div>

            {/* Detailed Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans mb-6">
              <div className="p-3 rounded-xl bg-[#141311] border border-[#C5A880]/15 space-y-1">
                <span className="text-[10px] font-mono-tech text-[#A89884] uppercase">
                  {lang === 'bn' ? 'জিমেইল / ইমেইল' : 'Gmail / Email'}
                </span>
                <p className="font-bold text-[#FDFBF7] font-mono-tech flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-[#DFCA9E] shrink-0" />
                  <a href={`mailto:${viewSubmission.email}`} className="hover:underline truncate">
                    {viewSubmission.email || 'N/A'}
                  </a>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#141311] border border-[#C5A880]/15 space-y-1">
                <span className="text-[10px] font-mono-tech text-[#A89884] uppercase">
                  {lang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Phone'}
                </span>
                <p className="font-bold text-[#FDFBF7] font-mono-tech flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#DFCA9E] shrink-0" />
                  <a href={`tel:${viewSubmission.phone}`} className="hover:underline">
                    {viewSubmission.phone || 'N/A'}
                  </a>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#141311] border border-[#C5A880]/15 space-y-1">
                <span className="text-[10px] font-mono-tech text-[#A89884] uppercase">
                  {lang === 'bn' ? 'রেজিস্ট্রেশন নম্বর' : 'Registration No'}
                </span>
                <p className="font-bold text-[#DFCA9E] font-mono-tech">
                  {viewSubmission.regNo || 'N/A'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#141311] border border-[#C5A880]/15 space-y-1">
                <span className="text-[10px] font-mono-tech text-[#A89884] uppercase">
                  {lang === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}
                </span>
                <p className="font-mono-tech">
                  <span className="badge-blood-group">
                    <Droplet className="w-3.5 h-3.5 text-red-600 dark:text-rose-400 fill-current" />
                    <span>{viewSubmission.bloodGroup || 'N/A'}</span>
                  </span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#141311] border border-[#C5A880]/15 space-y-1">
                <span className="text-[10px] font-mono-tech text-[#A89884] uppercase">
                  {lang === 'bn' ? 'এখন কোথায় চাকরি করে' : 'Current Workplace / Role'}
                </span>
                <p className="font-bold text-[#FDFBF7] flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#DFCA9E] shrink-0" />
                  <span>{viewSubmission.currentJob || (lang === 'bn' ? 'অধ্যয়নরত (চাকরি করছি না)' : 'Studying (Currently Enrolled)')}</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#141311] border border-[#C5A880]/15 space-y-1">
                <span className="text-[10px] font-mono-tech text-[#A89884] uppercase">
                  {lang === 'bn' ? 'ঠিকানা / বর্তমান অবস্থান' : 'Address / Current Location'}
                </span>
                <p className="font-bold text-[#FDFBF7] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#DE644E] shrink-0" />
                  <span>{viewSubmission.address || viewSubmission.currentLocation || 'N/A'}</span>
                </p>
              </div>
            </div>

            {/* Bio / Extra note */}
            {viewSubmission.bio && (
              <div className="p-4 rounded-xl bg-[#141311] border border-[#C5A880]/15 text-xs font-sans mb-6">
                <span className="text-[10px] font-mono-tech text-[#A89884] uppercase block mb-1">
                  {lang === 'bn' ? 'সংক্ষিপ্ত পরিচয় ও বিবরণ' : 'Short Bio & Note'}
                </span>
                <p className="text-[#DCD3C1] leading-relaxed italic">
                  "{viewSubmission.bio}"
                </p>
              </div>
            )}

            {/* Modal Decision Buttons */}
            <div className="pt-4 border-t border-[#C5A880]/20 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setViewSubmission(null)}
                className="px-4 py-2 rounded-xl bg-[#201E1A] text-[#DCD3C1] hover:text-[#FDFBF7] text-xs font-semibold"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>

              <div className="flex items-center gap-2">
                {viewSubmission.status !== 'approved' && (
                  <button
                    onClick={() => {
                      approveSubmission(viewSubmission.id);
                      showToast(lang === 'bn' ? `✓ ${viewSubmission.name}-এর আবেদন সফলভাবে অনুমোদিত হয়েছে!` : `✓ Approved ${viewSubmission.name}!`);
                      setViewSubmission(null);
                    }}
                    className="btn-approve px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>{lang === 'bn' ? 'অনুমোদন করুন (Approve)' : 'Approve Submission'}</span>
                  </button>
                )}

                {viewSubmission.status !== 'declined' && (
                  <button
                    onClick={() => {
                      const target = viewSubmission;
                      setViewSubmission(null);
                      setDeclinePrompt(target);
                    }}
                    className="btn-decline px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                    <span>{lang === 'bn' ? 'প্রত্যাখ্যান করুন (Decline)' : 'Decline'}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )}

      {/* DECLINE PROMPT MODAL */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {declinePrompt && (
            <motion.div
              key="admin-decline-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              data-admin-modal="true"
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) setDeclinePrompt(null);
              }}
            >
              <motion.div
                key="admin-decline-modal-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md bg-[#181715] border border-rose-500/40 rounded-3xl p-6 text-center space-y-4 overscroll-contain shadow-2xl"
              >
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                  <XCircle className="w-6 h-6" />
                </div>

                <h3 className="text-base font-bold text-[#FDFBF7]">
                  {lang === 'bn' ? 'আবেদন প্রত্যাখ্যানের কারণ' : 'Decline Submission'}
                </h3>
                <p className="text-xs text-[#DCD3C1]">
                  <span className="font-bold text-rose-300">{declinePrompt.name || (lang === 'bn' ? 'শিক্ষার্থী' : 'Student')}</span>
                  {lang === 'bn' ? '-এর আবেদনটি প্রত্যাখ্যাত হিসেবে চিহ্নিত হবে।' : "'s submission will be marked as declined."}
                </p>

                <div className="text-left">
                  <label className="block text-xs font-semibold text-[#A89884] mb-1">
                    {lang === 'bn' ? 'প্রত্যাখ্যানের কারণ / মন্তব্য (ঐচ্ছিক):' : 'Reason / Note (Optional):'}
                  </label>
                  <input
                    key={`${declinePrompt.id}-${lang}`}
                    type="text"
                    id="declineReasonInput"
                    placeholder={lang === 'bn' ? 'উদা: রেজিস্ট্রেশন নম্বর মিলছে না' : 'e.g. Registration number does not match'}
                    defaultValue={lang === 'bn' ? 'তথ্য অসম্পূর্ণ বা যাচাইয়ে অমিল রয়েছে' : 'Incomplete information or verification mismatch'}
                    className="w-full p-2.5 rounded-xl bg-[#141311] border border-[#C5A880]/30 text-xs text-[#FDFBF7] placeholder-[#A89884]/60 focus:outline-none focus:border-rose-500 font-sans"
                  />
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setDeclinePrompt(null)}
                    className="px-4 py-2 rounded-xl bg-[#201E1A] text-[#DCD3C1] hover:text-[#FDFBF7] text-xs font-semibold cursor-pointer"
                  >
                    {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    onClick={() => {
                      const inputVal = document.getElementById('declineReasonInput')?.value || '';
                      declineSubmission(declinePrompt.id, inputVal);
                      showToast(lang === 'bn' ? `${declinePrompt.name}-এর আবেদন প্রত্যাখ্যাত করা হয়েছে।` : `Declined submission`);
                      setDeclinePrompt(null);
                    }}
                    className="btn-decline px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md cursor-pointer"
                  >
                    {lang === 'bn' ? 'প্রত্যাখ্যান নিশ্চিত করুন' : 'Confirm Decline'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Bulk Excel Import to MongoDB Modal */}
      <ExcelImportModal
        isOpen={isExcelImportOpen}
        onClose={() => setIsExcelImportOpen(false)}
      />

    </motion.div>
  );
}
