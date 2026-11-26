import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { useScrollLock } from '../utils/useScrollLock.js';
import CloudinaryImageInput from '../components/CloudinaryImageInput.jsx';
import { formatDriveImageUrl } from '../utils/driveImage.js';
import GoogleSignInModal, { GoogleSignInButton, GoogleLogo } from '../components/GoogleSignInModal.jsx';
import {
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Mail,
  Phone,
  Hash,
  Briefcase,
  MapPin,
  Sparkles,
  ShieldCheck,
  Send,
  AlertCircle,
  RotateCcw,
  User,
  ArrowRight,
  Droplet,
  BookOpen,
  Image as ImageIcon,
  Search,
  Edit3,
  ExternalLink,
  Check,
  ShieldAlert,
  AlertTriangle,
  LogOut
} from 'lucide-react';
import UserAvatar from '../components/UserAvatar.jsx';

const BATCH_OPTIONS = [
  '8th Batch (2025-26)',
  '7th Batch (2024-25)',
  '6th Batch (2023-24)',
  '5th Batch (2022-23)',
  '4th Batch (2021-22)',
  '3rd Batch (2020-21)',
  '2nd Batch (2019-20)',
  '1st Batch (2018-19)'
];

const DEPARTMENT_OPTIONS = [
  { id: 'Yarn Engineering', nameEn: 'Yarn Engineering (YE)', nameBn: 'ইয়ার্ন ইঞ্জিনিয়ারিং' },
  { id: 'Fabric Engineering', nameEn: 'Fabric Engineering (FE)', nameBn: 'ফ্যাব্রিক ইঞ্জিনিয়ারিং' },
  { id: 'Wet Process Engineering', nameEn: 'Wet Process Engineering (WPE)', nameBn: 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং' },
  { id: 'Apparel Manufacturing', nameEn: 'Apparel Manufacturing (AE)', nameBn: 'অ্যাপারেল ম্যানুফ্যাকচারিং' }
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function StudentPortal() {
  const {
    user,
    lang,
    studentSubmissions = [],
    students = [],
    mySubmission,
    mySubmissionId,
    trackSubmission,
    submitStudentProfile,
    getRegNoClaimConflict,
    loginWithGmail,
    logout,
    submitDispute,
    isAdminEmail,
    apiBaseUrl
  } = useApp();

  const maskEmail = (emailStr) => {
    if (!emailStr || !emailStr.includes('@')) return '';
    const [local, domain] = emailStr.trim().split('@');
    if (local.length <= 2) return `${local[0] || '*'}***@${domain}`;
    return `${local.slice(0, 2)}***@${domain}`;
  };

  // Active submission strictly bound to the current authenticated user's session
  const activeSubmission = useMemo(() => {
    const currentEmail = user && user.role !== 'guest' ? (user.email || '').toLowerCase().trim() : '';
    if (currentEmail) {
      return studentSubmissions.find(s => s.email && s.email.toLowerCase().trim() === currentEmail) || null;
    }
    return mySubmission || null;
  }, [mySubmission, studentSubmissions, user]);

  // Toggle for Edit Mode
  const [isEditingDetails, setIsEditingDetails] = useState(false);

  // Search / Lookup input state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupMessage, setLookupMessage] = useState('');

  // Quick Gmail Login state
  const [gmailInput, setGmailInput] = useState('');
  const [gmailNameInput, setGmailNameInput] = useState('');
  const [isGmailLoginActive, setIsGmailLoginActive] = useState(!user || user.role === 'guest');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  // Lock native background scrolling while any modal is open
  useScrollLock(Boolean(isDisputeModalOpen || isGoogleModalOpen));

  // ID Dispute Form State
  const [disputeRegNo, setDisputeRegNo] = useState('');
  const [disputeName, setDisputeName] = useState('');
  const [disputePhone, setDisputePhone] = useState('');
  const [disputeEmail, setDisputeEmail] = useState('');
  const [disputeDesc, setDisputeDesc] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);
  const [isDisputeLoading, setIsDisputeLoading] = useState(false);

  // Form Fields (All Optional as requested)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    nameEn: '',
    email: '',
    phone: '',
    regNo: '',
    batch: '',
    department: '',
    deptBn: '',
    currentJob: '',
    designation: '',
    company: '',
    jobSector: '',
    workLocation: '',
    experienceYears: '',
    linkedin: '',
    currentLocation: '',
    bloodGroup: 'B+',
    avatar: '',
    bio: ''
  });

  const [toastMessage, setToastMessage] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [batchError, setBatchError] = useState(false);
  const [deptError, setDeptError] = useState(false);
  const phoneFieldRef = useRef(null);
  const phoneInputRef = useRef(null);
  const batchFieldRef = useRef(null);
  const deptFieldRef = useRef(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  // Reset edit/lookup transient UI states whenever authenticated account changes
  useEffect(() => {
    setIsEditingDetails(false);
    setLookupMessage('');
    if (!activeSubmission && (!user || user.role === 'guest')) {
      setFormData(prev => ({
        ...prev,
        id: '',
        email: '',
        regNo: ''
      }));
    }
  }, [user?.email, user?.role]);

  // Sync formData whenever activeSubmission or authenticated user changes
  useEffect(() => {
    if (activeSubmission) {
      setFormData({
        id: activeSubmission.id || '',
        name: activeSubmission.name || '',
        nameEn: activeSubmission.nameEn || '',
        email: activeSubmission.email || '',
        phone: activeSubmission.phone || '',
        regNo: activeSubmission.regNo || '',
        batch: activeSubmission.batch || '',
        department: activeSubmission.department || '',
        deptBn: activeSubmission.deptBn || '',
        currentJob: activeSubmission.currentJob || '',
        designation: activeSubmission.designation || '',
        company: activeSubmission.company || '',
        jobSector: activeSubmission.jobSector || '',
        workLocation: activeSubmission.workLocation || '',
        experienceYears: activeSubmission.experienceYears || '',
        linkedin: activeSubmission.linkedin || '',
        currentLocation: activeSubmission.currentLocation || '',
        bloodGroup: activeSubmission.bloodGroup || 'B+',
        avatar: activeSubmission.avatar || '',
        bio: activeSubmission.bio || ''
      });
    } else if (user && user.role !== 'guest') {
      const userEmailNorm = (user.email || '').toLowerCase().trim();
      const matchedStd = students.find(s =>
        s.email && userEmailNorm && s.email.toLowerCase().trim() === userEmailNorm
      );
      setFormData({
        id: '',
        email: user.email || '',
        name: matchedStd?.nameBn || matchedStd?.name || user.nameBn || user.name || '',
        nameEn: matchedStd?.name || user.name || '',
        regNo: matchedStd?.regNo || '',
        batch: matchedStd?.batch || '',
        department: matchedStd?.department || '',
        deptBn: matchedStd?.deptBn || '',
        phone: matchedStd?.phone || user.phone || '',
        bloodGroup: matchedStd?.bloodGroup || user.bloodGroup || 'B+',
        avatar: matchedStd?.avatar || user.avatar || '',
        bio: matchedStd?.activities || '',
        currentJob: matchedStd?.currentJob || user.currentJob || '',
        designation: matchedStd?.designation || '',
        company: matchedStd?.company || '',
        jobSector: matchedStd?.jobSector || '',
        workLocation: matchedStd?.workLocation || '',
        experienceYears: '',
        linkedin: matchedStd?.linkedin || '',
        currentLocation: matchedStd?.currentLocation || user.currentLocation || ''
      });
    }
  }, [activeSubmission, user, students]);

  // Pre-fill dispute info from user or regNo
  useEffect(() => {
    if (user && user.email && !disputeEmail) {
      setDisputeEmail(user.email);
    }
    if (user && user.name && !disputeName) {
      setDisputeName(user.name);
    }
    if (formData.regNo && !disputeRegNo) {
      setDisputeRegNo(formData.regNo);
    }
  }, [user, formData.regNo]);

  const handleDisputeSubmit = (e) => {
    e.preventDefault();
    if (!disputeRegNo.trim()) {
      triggerToast(lang === 'bn' ? 'অনুগ্রহ করে বিরোধপূর্ণ রেজিস্ট্রেশন নম্বরটি লিখুন' : 'Please enter the disputed registration number');
      return;
    }
    setIsDisputeLoading(true);
    submitDispute({
      regNo: disputeRegNo.trim(),
      name: disputeName.trim() || user?.name || (lang === 'bn' ? 'শিক্ষার্থী' : 'Student'),
      phone: disputePhone.trim(),
      email: disputeEmail.trim() || user?.email || '',
      description: disputeDesc.trim() || (lang === 'bn' ? 'আমার রেজিস্ট্রেশন নম্বর দিয়ে অন্য কেউ ভুয়া প্রোফাইল খুলেছে, অনুগ্রহ করে রিসেট করুন।' : 'Someone falsely claimed my registration number. Please reset this profile.')
    });
    setIsDisputeLoading(false);
    setDisputeSubmitted(true);
    triggerToast(lang === 'bn' ? '✓ আপনার কমপ্লেইন সফলভাবে অ্যাডমিনের কাছে জমা হয়েছে!' : '✓ Your ID dispute has been submitted to Admin!');
  };

  const handleLookup = (e) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    const query = lookupQuery.trim().toLowerCase();
    const currentEmail = (user && user.role !== 'guest' ? user.email : '')?.trim().toLowerCase() || '';
    const foundSub = trackSubmission(query, currentEmail);

    if (foundSub) {
      const subEmail = (foundSub.email || '').trim().toLowerCase();
      // If submission belongs to a DIFFERENT email, show read-only status warning — never hijack or allow editing
      if (subEmail && currentEmail && subEmail !== currentEmail) {
        setLookupMessage(
          lang === 'bn'
            ? `🔒 এই রেজিস্ট্রেশন নম্বর (${foundSub.regNo}) ইতিমধ্যেই অন্য একটি অ্যাকাউন্ট (${maskEmail(subEmail)}) দ্বারা নিবন্ধিত (স্ট্যাটাস: ${foundSub.status?.toUpperCase()})। আপনার আইডি অন্য কেউ ব্যবহার করে থাকলে নিচে 'রিপোর্ট / কমপ্লেইন' করুন।`
            : `🔒 Registration (${foundSub.regNo}) is already registered under ${maskEmail(subEmail)} (Status: ${foundSub.status?.toUpperCase()}). Submit a dispute report below if unauthorized.`
        );
        triggerToast(lang === 'bn' ? 'এই রেজিস্ট্রেশন নম্বরটি ইতিমধ্যেই অন্য জিমেইলে সংরক্ষিত।' : 'This registration number is claimed by another account.');
        return;
      }

      if (subEmail && !currentEmail) {
        setLookupMessage(
          lang === 'bn'
            ? `✓ আবেদন পাওয়া গেছে: ${foundSub.name || foundSub.regNo} • স্ট্যাটাস: ${foundSub.status?.toUpperCase()}। এডিট করতে ${maskEmail(subEmail)} দিয়ে গুগল সাইন-ইন করুন।`
            : `✓ Application found: ${foundSub.name || foundSub.regNo} • Status: ${foundSub.status?.toUpperCase()}. Sign in with ${maskEmail(subEmail)} to edit.`
        );
        triggerToast(lang === 'bn' ? `স্ট্যাটাস: ${foundSub.status?.toUpperCase()}` : `Status: ${foundSub.status?.toUpperCase()}`);
        return;
      }

      setLookupMessage(lang === 'bn' ? `✓ আবেদন পাওয়া গেছে: ${foundSub.name || foundSub.regNo}` : `✓ Found submission for ${foundSub.name || foundSub.regNo}`);
      setIsEditingDetails(false);
      triggerToast(lang === 'bn' ? 'আবেদনের তথ্য সফলভাবে লোড হয়েছে।' : 'Submission loaded successfully.');
      return;
    }

    const foundStd = students.find(s => s.regNo && s.regNo.toLowerCase() === query);
    if (foundStd) {
      const stdConflict = getRegNoClaimConflict(foundStd.regNo, currentEmail, activeSubmissionId);
      if (stdConflict) {
        setLookupMessage(
          lang === 'bn'
            ? `🔒 রেজিস্ট্রেশন নম্বর ${foundStd.regNo} ইতিমধ্যেই একটি ভেরিফায়েড জিমেইল (${maskEmail(stdConflict.ownerEmail)}) দ্বারা সংরক্ষিত রয়েছে।`
            : `🔒 Registration ${foundStd.regNo} is already verified and claimed by ${maskEmail(stdConflict.ownerEmail)}.`
        );
        triggerToast(lang === 'bn' ? 'এই আইডিটি ইতিমধ্যেই অন্য জিমেইল দ্বারা ক্লেইম করা হয়েছে।' : 'This student ID is already claimed.');
        return;
      }

      setFormData(prev => ({
        ...prev,
        regNo: foundStd.regNo,
        name: foundStd.nameBn || foundStd.name,
        nameEn: foundStd.name,
        batch: foundStd.batch,
        department: foundStd.department,
        deptBn: foundStd.deptBn,
        bloodGroup: foundStd.bloodGroup || prev.bloodGroup,
        phone: foundStd.phone || prev.phone,
        email: currentEmail || prev.email,
        currentJob: foundStd.currentJob || prev.currentJob,
        currentLocation: foundStd.currentLocation || prev.currentLocation
      }));
      setLookupMessage(lang === 'bn' ? `✓ অক্লেইমড রেকর্ড পাওয়া গেছে: ${foundStd.name} (${foundStd.batch})। নিচের ফর্মে আপনার তথ্য পূরণ করুন।` : `✓ Unclaimed student record found for ${foundStd.name}. Complete your profile below.`);
      setIsEditingDetails(true);
      triggerToast(lang === 'bn' ? 'শিক্ষার্থীর রেকর্ড পাওয়া গেছে! নিচের ফর্মে আপনার বিবরণ দিন।' : 'Student record loaded! Fill your details below.');
      return;
    }

    setLookupMessage(lang === 'bn' ? '✕ এই তথ্য দিয়ে কোনো আবেদন বা শিক্ষার্থী রেকর্ড পাওয়া যায়নি। নিচে নতুন আবেদন জমা দিতে পারেন।' : '✕ No student record found with these details.');
  };

  const handleQuickGmailLogin = (e) => {
    e.preventDefault();
    if (!gmailInput.trim()) return;

    let email = gmailInput.trim();
    if (!email.includes('@')) {
      email = `${email}@gmail.com`;
    }

    if (isEmailTaken(email)) {
      triggerToast(lang === 'bn' ? 'এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে' : 'This email already exists');
      return;
    }

    const authRes = loginWithGmail(email, gmailNameInput);
    if (authRes?.error === 'ADMIN_GOOGLE_REQUIRED') {
      triggerToast(
        lang === 'bn'
          ? 'অ্যাডমিন জিমেইলে প্রবেশের জন্য অনুগ্রহ করে উপরের "গুগল দিয়ে লগইন" বাটনে ক্লিক করুন।'
          : 'Admin Gmail requires official Google Sign-In verification. Please use the Google button.'
      );
      setIsGoogleModalOpen(true);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      email: email,
      name: gmailNameInput || prev.name
    }));
    setIsGmailLoginActive(false);
    triggerToast(lang === 'bn' ? `স্বাগতম! জিমেইল সংযুক্ত হয়েছে: ${email}` : `Gmail connected: ${email}`);
  };

  // Duplicate & ownership checks against other submissions and enrolled directory
  const activeSubmissionId = activeSubmission?.id;
  const effectiveFormEmail = (formData.email || (user && user.role !== 'guest' ? user.email : '') || '').trim();

  const isEmailTaken = (email) => {
    if (!email || !email.trim()) return false;
    const normalized = email.trim().toLowerCase();
    const normReg = (formData.regNo || '').trim().toLowerCase();

    const inSubmissions = studentSubmissions.some(
      s => s.id !== activeSubmissionId &&
           s.status !== 'declined' &&
           s.email && s.email.trim().toLowerCase() === normalized &&
           (!normReg || !s.regNo || s.regNo.trim().toLowerCase() !== normReg)
    );
    if (inSubmissions) return true;

    const inStudents = students.some(
      st => st.email && st.email.trim().toLowerCase() === normalized &&
            (!normReg || !st.regNo || st.regNo.trim().toLowerCase() !== normReg)
    );
    return inStudents;
  };

  const matchedStudentFromList = useMemo(() => students.find(
    st => st.regNo && formData.regNo && st.regNo.trim().toLowerCase() === formData.regNo.trim().toLowerCase()
  ), [students, formData.regNo]);

  const regNoConflict = useMemo(
    () => getRegNoClaimConflict(formData.regNo, effectiveFormEmail, activeSubmissionId),
    [getRegNoClaimConflict, formData.regNo, effectiveFormEmail, activeSubmissionId]
  );

  const emailIsDuplicate = isEmailTaken(effectiveFormEmail);
  const regNoIsDuplicate = Boolean(regNoConflict);

  const localPhoneDigits = String(formData.phone || '')
    .replace(/\D/g, '')
    .replace(/^88/, '')
    .slice(0, 11);
  const phoneIsInvalid = localPhoneDigits.length > 0 && localPhoneDigits.length < 11;

  const handlePhoneDigitsChange = (raw) => {
    const cleaned = String(raw || '').replace(/\D/g, '').replace(/^88/, '').slice(0, 11);
    if (cleaned.length === 0 || cleaned.length === 11) {
      setPhoneError(false);
    }
    setFormData({
      ...formData,
      phone: cleaned ? `+88${cleaned}` : ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (phoneIsInvalid) {
      setPhoneError(true);
      triggerToast(lang === 'bn' ? 'ইনভ্যালিড ফোন নম্বর! +88 এর পর ঠিক ১১টি ডিজিট দিন।' : 'Invalid phone number! Please enter all 11 digits after +88.');
      phoneFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      phoneInputRef.current?.focus({ preventScroll: true });
      return;
    }
    setPhoneError(false);

    if (!formData.batch) {
      setBatchError(true);
      triggerToast(lang === 'bn' ? 'অনুগ্রহ করে আপনার ব্যাচ সিলেক্ট করুন' : 'Please select your batch');
      batchFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setBatchError(false);

    if (!formData.department) {
      setDeptError(true);
      triggerToast(lang === 'bn' ? 'অনুগ্রহ করে আপনার ডিপার্টমেন্ট সিলেক্ট করুন' : 'Please select your department');
      deptFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setDeptError(false);

    const finalEmail = effectiveFormEmail || (gmailInput.trim() ? (gmailInput.includes('@') ? gmailInput.trim() : `${gmailInput.trim()}@gmail.com`) : '');
    const finalRegNo = formData.regNo?.trim();

    if (!finalEmail) {
      triggerToast(lang === 'bn' ? 'প্রোফাইল ভেরিফাই ও সংরক্ষণ করতে অনুগ্রহ করে আপনার জিমেইল অ্যাকাউন্ট দিন' : 'Please connect or enter your Gmail address before submitting');
      return;
    }

    const submitConflict = getRegNoClaimConflict(finalRegNo, finalEmail, activeSubmissionId);
    if (submitConflict) {
      triggerToast(
        lang === 'bn'
          ? `এই রেজিস্ট্রেশন নম্বরটি ইতিমধ্যেই অন্য একটি অ্যাকাউন্ট (${maskEmail(submitConflict.ownerEmail)}) দ্বারা সংরক্ষিত!`
          : `This registration number is already claimed by ${maskEmail(submitConflict.ownerEmail)}!`
      );
      return;
    }

    if (isEmailTaken(finalEmail)) {
      triggerToast(lang === 'bn' ? 'এই ইমেইলটি ইতিমধ্যেই অন্য একটি প্রোফাইলে ব্যবহৃত হয়েছে' : 'This email is already registered with another profile');
      return;
    }

    const saved = submitStudentProfile({
      ...formData,
      email: finalEmail
    });

    if (saved?.error === 'REGNO_CLAIMED') {
      triggerToast(lang === 'bn' ? 'এই রেজিস্ট্রেশন নম্বরটি ইতিমধ্যেই অন্য একটি অ্যাকাউন্ট দ্বারা সংরক্ষিত!' : 'This registration number is already claimed!');
      return;
    }
    if (saved?.error === 'EMAIL_TAKEN') {
      triggerToast(lang === 'bn' ? 'এই ইমেইলটি ইতিমধ্যেই ব্যবহৃত হয়েছে' : 'This email already exists');
      return;
    }

    setIsEditingDetails(false);
    triggerToast(lang === 'bn' ? '✓ আপনার আবেদনটি সফলভাবে জমা হয়েছে এবং অ্যাডমিন যাচাইয়ের জন্য অপেক্ষমাণ রয়েছে!' : '✓ Your profile has been submitted and is pending admin verification!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen py-8 sm:py-12 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Global Toast Notification (Portaled above sticky header & crisp in both modes) */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                key="portal-toast"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="system-toast fixed top-36 sm:top-36 right-4 sm:right-8 z-[99999] px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2.5 max-w-md"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

        {/* Masthead Header */}
        <div className="pb-6 border-b border-[#C5A880]/20 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[10px] font-mono-tech uppercase mb-2">
            <span className="px-2.5 py-0.5 rounded bg-[#C5A880]/20 text-[#854D0E] dark:text-[#DFCA9E] border border-[#C5A880]/40 font-bold">
              STUDENT SELF-INPUT PORTAL
            </span>
            <span className="text-[#57534E] dark:text-[#A89884]">RTEC PIRGANJ • OFFICIAL ENROLLMENT</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif-regal font-black tracking-tight text-[#0C0A09] dark:text-[#FDFBF7]">
            {lang === 'bn'
              ? 'শিক্ষার্থী আইডি ও তথ্য সংযোজন পোর্টাল'
              : 'Student Self-Registration & Profile Portal'}
          </h1>
          <p className="text-xs sm:text-sm text-[#37332D] dark:text-[#DCD3C1] mt-2 font-sans max-w-2xl leading-relaxed">
            {lang === 'bn'
              ? 'রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজের অধ্যয়নরত বা প্রাক্তন শিক্ষার্থীবৃন্দ নিজস্ব প্রোফাইল ও আইডি তথ্য জমা দিন। জমা দেওয়ার পর আবেদনটি অ্যাডমিন যাচাই করে অনুমোদন (Approve) করলে মূল ডিরেক্টরিতে লাইভ প্রকাশিত হবে।'
              : 'Students of Rangpur Textile Engineering College can submit their profile details. Submissions enter a pending verification state for administrative approval before publishing.'}
          </p>
        </div>

        {/* ========================================================
            ACCOUNT STATUS & GOOGLE SIGN-IN BANNER
            Always prominent so user never loses login/logout/admin access
            ======================================================== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-amber-500/10 to-emerald-500/10 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#1E1C18] border border-blue-500/30 flex items-center justify-center shrink-0 shadow-md">
              <GoogleLogo className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#0C0A09] dark:text-[#FDFBF7]">
                  {user && user.role !== 'guest'
                    ? (lang === 'bn' ? `বর্তমান আইডি: ${user.name}` : `Active Account: ${user.name}`)
                    : (lang === 'bn' ? 'গুগল দিয়ে সাইন ইন করুন' : 'Sign in with Google Account')}
                </span>
                {user && user.role !== 'guest' && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase font-black ${
                    user.role === 'admin'
                      ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                  }`}>
                    {user.role}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#374151] dark:text-[#DCD3C1] font-sans mt-0.5 font-medium">
                {user && user.role === 'admin' && isAdminEmail?.(user.email)
                  ? (lang === 'bn' ? '✓ আপনি বর্তমানে অ্যাডমিন হিসেবে সংযুক্ত রয়েছেন।' : '✓ You are logged in with Administrator privileges.')
                  : (lang === 'bn' ? 'আপনার স্টুডেন্ট প্রোফাইল সংরক্ষণ ও স্ট্যাটাস দেখতে গুগল দিয়ে সাইন ইন করুন।' : 'Sign in with your Google account to save and track your student profile.')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto shrink-0">
            {(!user || user.role === 'guest') && (
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <GoogleLogo className="w-4 h-4 bg-white rounded-full p-0.5" />
                <span>{lang === 'bn' ? 'গুগল দিয়ে প্রবেশ' : 'Sign in with Google'}</span>
              </button>
            )}

            {user && user.role !== 'guest' && (
              <button
                type="button"
                onClick={logout}
                className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                title={lang === 'bn' ? 'লগআউট' : 'Sign Out'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
              </button>
            )}

            {user && user.role === 'admin' && isAdminEmail?.(user.email) && (
              <Link
                to="/admin"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
              </Link>
            )}
          </div>
        </div>

        {/* ========================================================
            QUICK STATUS TRACKING & LOOKUP BAR
            Allows any student to check their status in 1 click
            ======================================================== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#181715] border border-[#C5A880]/30 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-bold text-[#854D0E] dark:text-[#DFCA9E] uppercase tracking-wider block">
                {lang === 'bn' ? '🔍 আপনার আবেদনের স্ট্যাটাস যাচাই করুন' : '🔍 Track Application Status'}
              </span>
              <p className="text-xs text-[#57534E] dark:text-[#A89884] font-sans">
                {lang === 'bn'
                  ? 'পূর্বের জমার স্ট্যাটাস দেখতে রেজিস্ট্রেশন নম্বর বা জিমেইল লিখুন:'
                  : 'Enter your Registration No or Gmail to track approval status:'}
              </p>
            </div>

            <form onSubmit={handleLookup} className="w-full sm:w-auto flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A89884]" />
                <input
                  type="text"
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  placeholder={lang === 'bn' ? 'রেজিস্ট্রেশন / স্টুডেন্ট আইডি বা জিমেইল...' : 'Reg No / Student ID or Gmail...'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#A89884]/70 focus:outline-none focus:border-[#C5A880] font-sans"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#854D0E] hover:bg-[#6D3F0B] dark:bg-[#C5A880] dark:hover:bg-[#DFCA9E] text-white dark:text-slate-950 font-bold text-xs transition shadow shrink-0 cursor-pointer"
              >
                {lang === 'bn' ? 'স্ট্যাটাস দেখুন' : 'Track'}
              </button>
            </form>
          </div>

          {lookupMessage && (
            <p className="mt-2 text-xs font-semibold text-center sm:text-left text-[#854D0E] dark:text-[#DFCA9E]">
              {lookupMessage}
            </p>
          )}
        </div>

        {/* ========================================================
            CASE A: USER HAS AN ACTIVE SUBMISSION (PENDING / APPROVED / DECLINED)
            Permanent Profile & Status Dashboard View
            ======================================================== */}
        <AnimatePresence mode="wait">
        {activeSubmission && !isEditingDetails ? (
          <motion.div
            key="portal-case-a"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22 }}
            className="space-y-6"
          >

            {/* Main Dynamic Status Banner */}
            <div
              className={`p-6 sm:p-7 rounded-3xl border-2 shadow-xl transition-all ${
                activeSubmission.status === 'approved'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 dark:bg-emerald-950/60 dark:border-emerald-500 dark:text-emerald-100'
                  : activeSubmission.status === 'declined'
                  ? 'bg-rose-50 border-rose-500 text-rose-950 dark:bg-rose-950/60 dark:border-rose-500 dark:text-rose-100'
                  : 'bg-amber-50 border-amber-500 text-amber-950 dark:bg-amber-950/60 dark:border-amber-500 dark:text-amber-100'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                    {activeSubmission.status === 'approved' ? (
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                        <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                      </div>
                    ) : activeSubmission.status === 'declined' ? (
                      <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
                        <XCircle className="w-7 h-7 stroke-[2.5]" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 animate-pulse">
                        <Clock className="w-7 h-7 stroke-[2.5]" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2
                        className={`text-lg sm:text-xl font-serif-regal font-black tracking-tight ${
                          activeSubmission.status === 'approved'
                            ? 'text-emerald-950 dark:text-emerald-100'
                            : activeSubmission.status === 'declined'
                            ? 'text-rose-950 dark:text-rose-100'
                            : 'text-amber-950 dark:text-amber-100'
                        }`}
                      >
                        {activeSubmission.status === 'approved'
                          ? (lang === 'bn' ? '✓ আবেদন অনুমোদিত (Approved & Live)' : '✓ Application Approved & Live')
                          : activeSubmission.status === 'declined'
                          ? (lang === 'bn' ? '✕ আবেদন পর্যালোচনায় / প্রত্যাখ্যাত (Declined)' : '✕ Application Declined')
                          : (lang === 'bn' ? '⏳ আবেদন সফলভাবে জমা হয়েছে • অপেক্ষমাণ (Pending)' : '⏳ Status: Pending Admin Verification')}
                      </h2>

                      <span
                        className={`text-[10px] font-mono-tech px-2.5 py-0.5 rounded-full uppercase font-black tracking-wider shadow-sm ${
                          activeSubmission.status === 'approved'
                            ? 'bg-emerald-600 text-white'
                            : activeSubmission.status === 'declined'
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-500 text-slate-950 animate-pulse'
                        }`}
                      >
                        {activeSubmission.status?.toUpperCase()}
                      </span>
                    </div>

                    <p
                      className={`text-xs sm:text-sm font-sans font-medium leading-relaxed max-w-2xl ${
                        activeSubmission.status === 'approved'
                          ? 'text-emerald-950 dark:text-emerald-100'
                          : activeSubmission.status === 'declined'
                          ? 'text-rose-950 dark:text-rose-100'
                          : 'text-amber-950 dark:text-amber-100'
                      }`}
                    >
                      {activeSubmission.status === 'approved'
                        ? (lang === 'bn'
                            ? 'অভিনন্দন! আপনার জমা দেওয়া শিক্ষার্থী প্রোফাইলটি কলেজ অ্যাডমিন কর্তৃক যাচাইপূর্বক অনুমোদন দেওয়া হয়েছে। আপনার নাম ও প্রোফাইল সরাসরি শিক্ষার্থী/অ্যালামনাই ডিরেক্টরিতে সক্রিয় রয়েছে।'
                            : 'Congratulations! Your profile has been verified and approved by the RTEC Administrator. It is actively published in the public college directory.')
                        : activeSubmission.status === 'declined'
                        ? (lang === 'bn'
                            ? `অ্যাডমিন পর্যবেক্ষণ: "${activeSubmission.reviewNotes || 'কিছু তথ্যে অসম্পূর্ণতা রয়েছে'}।" অনুগ্রহ করে নিচের 'তথ্য পরিবর্তন' বাটনে ক্লিক করে তথ্য সংশোধন করে পুনরায় জমা দিন।`
                            : `Admin Feedback: "${activeSubmission.reviewNotes || 'Incomplete details'}." Please click 'Edit Details' below to update and resubmit.`)
                        : (lang === 'bn'
                            ? 'আপনার তথ্যটি ডাটাবেজে সংরক্ষিত রয়েছে এবং বর্তমানে অ্যাডমিন পর্যালোচনায় (Pending) রয়েছে। অ্যাডমিন প্যানেল থেকে অনুমোদন দিলে এটি স্বয়ংক্রিয়ভাবে মূল ডিরেক্টরিতে যুক্ত হবে।'
                            : 'Your profile has been recorded and is currently awaiting administrative review. Once approved, it will automatically appear in the public roster.')}
                    </p>

                    <div
                      className={`flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono-tech font-bold ${
                        activeSubmission.status === 'approved'
                          ? 'text-emerald-900 dark:text-emerald-300'
                          : activeSubmission.status === 'declined'
                          ? 'text-rose-900 dark:text-rose-300'
                          : 'text-amber-900 dark:text-amber-300'
                      }`}
                    >
                      <span>{lang === 'bn' ? 'আইডি:' : 'ID:'} <strong>{activeSubmission.id}</strong></span>
                      <span>•</span>
                      <span>{lang === 'bn' ? 'জমা দেওয়া হয়েছে:' : 'Submitted:'} <strong>{activeSubmission.submittedAt}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto">
                  {activeSubmission.status === 'approved' && (
                    <Link
                      to="/students"
                      className="btn-approve w-full md:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
                    >
                      <span>{lang === 'bn' ? 'ডিরেক্টরিতে আপনার প্রোফাইল দেখুন →' : 'View in Directory →'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  <button
                    onClick={() => setIsEditingDetails(true)}
                    className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-[#201E1A] hover:bg-[#F4EFE6] dark:hover:bg-[#2A2722] text-[#0C0A09] dark:text-[#FDFBF7] border border-[#C5A880]/50 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#854D0E] dark:text-[#DFCA9E]" />
                    <span>{lang === 'bn' ? 'তথ্য পরিবর্তন / এডিট করুন' : 'Edit Details'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Overview Card */}
            <div className="plaque-elevated p-6 sm:p-8 rounded-3xl border border-[#C5A880]/30 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-6 border-b border-[#C5A880]/20">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  <UserAvatar
                    src={activeSubmission.avatar}
                    name={activeSubmission.name}
                    role="student"
                    className="w-24 h-24 rounded-2xl border-2 border-[#C5A880]/40 shadow-lg shrink-0"
                    iconClassName="w-12 h-12"
                  />
                  <div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h3 className="text-xl sm:text-2xl font-serif-regal font-black text-[#0C0A09] dark:text-[#FDFBF7]">
                        {activeSubmission.name || (lang === 'bn' ? 'শিক্ষার্থী' : 'Student')}
                      </h3>
                      {activeSubmission.regNo && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-[#F4EFE6] dark:bg-[#141311] border border-[#C5A880]/40 text-[#854D0E] dark:text-[#DFCA9E] font-mono-tech font-bold text-xs">
                          {lang === 'bn' ? `রেজি: ${activeSubmission.regNo}` : `Reg: ${activeSubmission.regNo}`}
                        </span>
                      )}
                    </div>

                    {activeSubmission.nameEn && activeSubmission.nameEn !== activeSubmission.name && (
                      <p className="text-xs text-[#57534E] dark:text-[#A89884] font-medium mt-0.5">
                        {activeSubmission.nameEn}
                      </p>
                    )}

                    <p className="text-xs font-bold text-[#854D0E] dark:text-[#DFCA9E] mt-1">
                      {[activeSubmission.batch, (lang === 'bn' ? activeSubmission.deptBn : activeSubmission.department) || activeSubmission.department].filter(Boolean).join(' • ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-sans">
                {/* Gmail */}
                <div className="p-3.5 rounded-xl bg-[#F8F5EE] dark:bg-[#141311] border border-[#C5A880]/30 space-y-1">
                  <span className="text-[10px] font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] uppercase block">
                    {lang === 'bn' ? 'জিমেইল অ্যাকাউন্ট' : 'Google Email'}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono-tech font-bold text-[#854D0E] dark:text-[#DFCA9E] truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{activeSubmission.email || (lang === 'bn' ? 'তথ্য নেই' : 'Not provided')}</span>
                  </div>
                </div>

                {/* Mobile Phone */}
                <div className="p-3.5 rounded-xl bg-[#F8F5EE] dark:bg-[#141311] border border-[#C5A880]/30 space-y-1">
                  <span className="text-[10px] font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] uppercase block">
                    {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono-tech font-bold text-[#0C0A09] dark:text-[#FDFBF7] truncate">
                    <Phone className="w-3.5 h-3.5 text-[#57534E] dark:text-[#A89884] shrink-0" />
                    <span>{activeSubmission.phone || (lang === 'bn' ? 'তথ্য নেই' : 'Not provided')}</span>
                  </div>
                </div>

                {/* Blood Group */}
                <div className="p-3.5 rounded-xl bg-[#F8F5EE] dark:bg-[#141311] border border-[#C5A880]/30 space-y-1">
                  <span className="text-[10px] font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] uppercase block">
                    {lang === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}
                  </span>
                  <div className="pt-0.5">
                    <span className="badge-blood-group">
                      <Droplet className="w-3.5 h-3.5 text-red-600 dark:text-rose-400 fill-current" />
                      <span>{activeSubmission.bloodGroup || (lang === 'bn' ? 'তথ্য নেই' : 'N/A')}</span>
                    </span>
                  </div>
                </div>

                {/* Current Job */}
                <div className="p-3.5 rounded-xl bg-[#F8F5EE] dark:bg-[#141311] border border-[#C5A880]/30 space-y-1">
                  <span className="text-[10px] font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] uppercase block">
                    {lang === 'bn' ? 'বর্তমান কর্মক্ষেত্র ও পদবি' : 'Current Job / Workplace'}
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-[#0C0A09] dark:text-[#FDFBF7] truncate">
                    <Briefcase className="w-3.5 h-3.5 text-[#854D0E] dark:text-[#DFCA9E] shrink-0" />
                    <span className="truncate">{activeSubmission.currentJob || (lang === 'bn' ? 'অধ্যয়নরত শিক্ষার্থী' : 'Student')}</span>
                  </div>
                </div>

                {/* Current Location */}
                <div className="p-3.5 rounded-xl bg-[#F8F5EE] dark:bg-[#141311] border border-[#C5A880]/30 space-y-1">
                  <span className="text-[10px] font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] uppercase block">
                    {lang === 'bn' ? 'বর্তমান অবস্থান / ঠিকানা' : 'Current City / Location'}
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-[#0C0A09] dark:text-[#FDFBF7] truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#BD452F] shrink-0" />
                    <span className="truncate">{activeSubmission.currentLocation || (lang === 'bn' ? 'তথ্য নেই' : 'Not provided')}</span>
                  </div>
                </div>

                {/* Tracking ID */}
                <div className="p-3.5 rounded-xl bg-[#F8F5EE] dark:bg-[#141311] border border-[#C5A880]/30 space-y-1">
                  <span className="text-[10px] font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] uppercase block">
                    {lang === 'bn' ? 'ট্র্যাকিং রেফারেন্স আইডি' : 'Tracking Reference ID'}
                  </span>
                  <div className="font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] truncate">
                    {activeSubmission.id}
                  </div>
                </div>
              </div>

              {/* Bio / Description */}
              {activeSubmission.bio && (
                <div className="p-4 rounded-xl bg-[#F8F5EE] dark:bg-[#141311] border border-[#C5A880]/30 text-xs">
                  <span className="text-[10px] font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] uppercase block mb-1">
                    {lang === 'bn' ? 'সংক্ষিপ্ত পরিচয় / নোট' : 'Short Bio / Note'}
                  </span>
                  <p className="text-[#1C1917] dark:text-[#DCD3C1] italic leading-relaxed">
                    "{activeSubmission.bio}"
                  </p>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#C5A880]/20 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[#57534E] dark:text-[#A89884] font-sans">
                  {lang === 'bn'
                    ? 'আপনার তথ্যে কোনো ভুল থাকলে এখনই পরিবর্তন করতে পারবেন।'
                    : 'You can update your details at any time before or after verification.'}
                </p>

                <button
                  onClick={() => setIsEditingDetails(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'তথ্য পরিবর্তন / এডিট করুন' : 'Edit Submitted Info'}</span>
                </button>
              </div>

            </div>

            {/* Profile Overview Card */}
          </motion.div>
        ) : (
          <motion.div
            key="portal-case-b"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22 }}
            className="space-y-6"
          >

            {/* Editing Notice Banner */}
            {isEditingDetails && activeSubmission && (
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Edit3 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    {lang === 'bn'
                      ? `আপনি "${activeSubmission.name || activeSubmission.regNo}"-এর জমাকৃত তথ্য সম্পাদনা করছেন।`
                      : `You are editing your submission for ${activeSubmission.name || activeSubmission.regNo}.`}
                  </span>
                </div>
                <button
                  onClick={() => setIsEditingDetails(false)}
                  className="px-3 py-1 rounded-lg bg-white dark:bg-[#201E1A] hover:bg-[#F4EFE6] dark:hover:bg-[#2A2722] text-[#1C1917] dark:text-[#FDFBF7] border border-[#C5A880]/30 text-xs font-bold transition cursor-pointer"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
              </div>
            )}

            {/* Gmail / Google Sign In Helper Card */}
            {(!user || user.role === 'guest') && (
              <div className="plaque-elevated p-6 rounded-2xl border border-[#C5A880]/30 relative overflow-hidden">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="space-y-1.5 text-center lg:text-left">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-700 dark:text-red-300 text-[10px] font-bold border border-red-500/30">
                      <Mail className="w-3 h-3 text-red-500" />
                      <span>{lang === 'bn' ? 'গুগল / জিমেইল একাউন্ট ভেরিফিকেশন' : 'Google / Gmail Account'}</span>
                    </div>
                    <h3 className="text-lg font-serif-regal font-bold text-[#0C0A09] dark:text-[#FDFBF7]">
                      {lang === 'bn' ? '১-ক্লিকে গুগল দিয়ে লগইন করুন' : '1-Click Sign in with Google'}
                    </h3>
                    <p className="text-xs text-[#57534E] dark:text-[#A89884] max-w-md font-sans">
                      {lang === 'bn'
                        ? 'গুগল দিয়ে প্রবেশ করলে আইডি কার্ডের ছবি বা জটিল ভেরিফিকেশন ছাড়াই আপনি আপনার প্রোফাইল নিরাপদে পরিচালনা করতে পারবেন।'
                        : 'Sign in with your Google account to manage and secure your profile without manual ID card verification.'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                    <GoogleSignInButton
                      onClick={() => setIsGoogleModalOpen(true)}
                      className="px-4 py-2.5 text-xs shadow-md"
                      text={lang === 'bn' ? 'গুগল দিয়ে লগইন' : 'Sign in with Google'}
                    />

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-[10px] text-[#A89884] font-bold uppercase shrink-0">
                        {lang === 'bn' ? 'অথবা' : 'OR'}
                      </span>
                      <form onSubmit={handleQuickGmailLogin} className="flex items-center gap-1.5 w-full">
                        <input
                          type="text"
                          required
                          value={gmailInput}
                          onChange={(e) => setGmailInput(e.target.value)}
                          placeholder={lang === 'bn' ? 'your.email@gmail.com' : 'your.email@gmail.com'}
                          className="w-full sm:w-44 px-3 py-2 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#57534E] dark:placeholder-[#BDB09E] focus:outline-none focus:border-[#C5A880]"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition whitespace-nowrap cursor-pointer shrink-0 shadow-sm"
                        >
                          {lang === 'bn' ? 'যুক্ত' : 'Go'}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submission Form Card */}
            <div className="plaque-elevated p-6 sm:p-8 rounded-3xl border border-[#C5A880]/30 shadow-2xl relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#C5A880]/20 mb-6 gap-2">
                <div>
                  <span className="text-[10px] font-mono-tech text-[#854D0E] dark:text-[#DFCA9E] uppercase tracking-wider block">
                    INFORMATION DISCLOSURE FORM
                  </span>
                  <h2 className="text-xl font-serif-regal font-bold text-[#0C0A09] dark:text-[#FDFBF7] mt-0.5">
                    {isEditingDetails
                      ? (lang === 'bn' ? 'শিক্ষার্থী তথ্য সংশোধন ফর্ম' : 'Edit Student Profile Form')
                      : (lang === 'bn' ? 'শিক্ষার্থী প্রোফাইল ফর্ম' : 'Student Profile Input Form')}
                  </h2>
                </div>

                {/* Explicit badge stating all fields are optional as requested */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] font-sans font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{lang === 'bn' ? 'সকল ফিল্ড অপশনাল (Optional)' : 'All fields are optional'}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* STEP 0: Registration Number & Instant Official Directory Autofill (At the very top!) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F5EE] dark:bg-[#141311]/90 border border-[#C5A880]/40 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-mono-tech font-bold text-[#854D0E] dark:text-[#DFCA9E] uppercase tracking-wider flex items-center gap-2">
                      <Hash className="w-4 h-4 text-[#BD452F] dark:text-[#DE644E]" />
                      <span>{lang === 'bn' ? 'ধাপ ১: রেজিস্ট্রেশন নম্বর লিখুন (সবার আগে)' : 'Step 1: Enter Registration Number First'}</span>
                    </label>
                    <span className="text-[10px] font-sans text-[#57534E] dark:text-[#A89884]">
                      {lang === 'bn' ? 'নম্বর লিখলেই অটো-ফিল অপশন চলে আসবে' : 'Official profile autofill triggers automatically'}
                    </span>
                  </div>

                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89884]" />
                    <input
                      type="text"
                      value={formData.regNo}
                      onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                      placeholder={lang === 'bn' ? 'আপনার রেজিস্ট্রেশন নম্বর লিখুন (উদা: 8025102)' : 'Enter Registration No (e.g. 8025102)'}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#1A1916] border text-sm text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#A89884]/70 focus:outline-none transition font-mono-tech font-bold ${
                        regNoIsDuplicate ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-[#C5A880]/40 focus:border-[#C5A880]'
                      }`}
                    />
                  </div>

                  <AnimatePresence>
                    {regNoIsDuplicate && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1.5 mt-1.5">
                          <p className="text-xs text-rose-500 font-bold flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {regNoConflict?.ownerEmail
                                ? (lang === 'bn'
                                    ? `এই রেজিস্ট্রেশন নম্বরটি ইতিমধ্যেই ${maskEmail(regNoConflict.ownerEmail)} দ্বারা সংরক্ষিত`
                                    : `Already claimed by ${maskEmail(regNoConflict.ownerEmail)}`)
                                : (lang === 'bn' ? 'এই রেজিস্ট্রেশন নম্বরটি ইতিমধ্যে ব্যবহৃত হয়েছে' : 'This registration number already exists')}
                            </span>
                          </p>
                          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed">
                            <div className="flex items-center gap-1.5 font-bold mb-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                              <span>{lang === 'bn' ? 'এটি কি আপনারই রেজিস্ট্রেশন নম্বর?' : 'Is this your actual registration number?'}</span>
                            </div>
                            <span>
                              {lang === 'bn' ? (
                                <>
                                  অন্য কেউ যদি আপনার নম্বর ব্যবহার করে থাকে,{' '}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDisputeRegNo(formData.regNo);
                                      setIsDisputeModalOpen(true);
                                    }}
                                    className="underline font-bold text-amber-800 dark:text-amber-200 hover:text-black dark:hover:text-white cursor-pointer"
                                  >
                                    'কমপ্লেইন ও রিপোর্ট'
                                  </button>{' '}
                                  উইন্ডোতে ক্লিক করে অ্যাডমিনকে জানান। অ্যাডমিন যাচাই করে ১-ক্লিকে ভুয়া আইডি মুছে আপনার নম্বর উন্মুক্ত করে দেবেন।
                                </>
                              ) : (
                                <>
                                  If someone else falsely used your registration number, click{' '}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDisputeRegNo(formData.regNo);
                                      setIsDisputeModalOpen(true);
                                    }}
                                    className="underline font-bold text-amber-800 dark:text-amber-200 hover:text-black dark:hover:text-white cursor-pointer"
                                  >
                                    'Dispute & Report'
                                  </button>{' '}
                                  to notify the administrator. Admin will verify and reset the number for you.
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {matchedStudentFromList && !regNoIsDuplicate && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/45 border border-emerald-400/60 text-xs text-emerald-900 dark:text-emerald-200 flex flex-wrap items-center justify-between gap-2.5 shadow-sm">
                          <div className="flex items-center gap-2 font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>
                              {matchedStudentFromList.name} ({matchedStudentFromList.batch} • {lang === 'bn' ? (matchedStudentFromList.deptBn || matchedStudentFromList.department) : matchedStudentFromList.department})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                name: matchedStudentFromList.nameBn || matchedStudentFromList.name || prev.name,
                                nameEn: matchedStudentFromList.name || prev.nameEn,
                                batch: matchedStudentFromList.batch || prev.batch,
                                department: matchedStudentFromList.department || prev.department,
                                deptBn: matchedStudentFromList.deptBn || prev.deptBn,
                                bloodGroup: matchedStudentFromList.bloodGroup || prev.bloodGroup,
                                phone: matchedStudentFromList.phone || prev.phone,
                                currentLocation: matchedStudentFromList.address || matchedStudentFromList.currentLocation || prev.currentLocation
                              }));
                              triggerToast(lang === 'bn' ? '✓ আপনার নাম, ব্যাচ ও বিভাগের তথ্য অটো-ফিল করা হয়েছে!' : '✓ Your name, cohort & department details auto-filled!');
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-sm transition flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{lang === 'bn' ? '১-ক্লিকে তথ্য অটো-ফিল করুন' : 'Auto-fill Official Details'}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* SECTION 1: Personal & Identification */}
                <div>
                  <h3 className="text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#854D0E] dark:text-[#DFCA9E]" />
                    <span>{lang === 'bn' ? 'ব্যক্তিগত পরিচিতি ও যোগাযোগ' : 'Personal & Contact Information'}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Single Name Field */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name || formData.nameEn || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value, nameEn: e.target.value })}
                        placeholder={lang === 'bn' ? 'আপনার পূর্ণ নাম লিখুন' : 'Enter your full name'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#A89884]/60 focus:outline-none focus:border-[#C5A880] transition font-sans"
                      />
                    </div>

                    {/* Gmail Account */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1.5 flex items-center justify-between">
                        <span>{lang === 'bn' ? 'জিমেইল অ্যাকাউন্ট (Gmail)' : 'Gmail Account'}</span>
                        <span className="text-[10px] text-[#57534E] dark:text-[#A89884] font-mono-tech">@gmail.com</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89884]" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your.email@gmail.com"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border text-xs text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#A89884]/60 focus:outline-none transition font-mono-tech ${
                            emailIsDuplicate ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-[#C5A880]/30 focus:border-[#C5A880]'
                          }`}
                        />
                      </div>
                      <AnimatePresence>
                        {emailIsDuplicate && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="text-xs text-rose-500 font-bold mt-1.5 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{lang === 'bn' ? 'এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে' : 'This email already exists'}</span>
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Mobile Number (+88 Bangladesh Prefix + Fixed 11-Digit Numpad) */}
                    <div ref={phoneFieldRef}>
                      <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1.5 flex items-center justify-between">
                        <span>{lang === 'bn' ? 'মোবাইল নম্বর (+88 বাংলাদেশ)' : 'Mobile Phone (+88 BD)'}</span>
                        <span className={`text-[10px] font-mono-tech font-bold ${
                          phoneError && phoneIsInvalid
                            ? 'text-rose-500'
                            : localPhoneDigits.length === 11
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-[#57534E] dark:text-[#A89884]'
                        }`}>
                          {localPhoneDigits.length}/11
                        </span>
                      </label>
                      <div
                        className={`flex items-center rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border transition overflow-hidden ${
                          phoneError && phoneIsInvalid
                            ? 'border-rose-500 ring-1 ring-rose-500/50'
                            : 'border-[#C5A880]/30 focus-within:border-[#C5A880]'
                        }`}
                      >
                        <span className="px-3 py-2.5 bg-[#F0EAE0] dark:bg-[#1E1C18] border-r border-[#C5A880]/30 text-xs font-mono-tech font-extrabold text-[#1C1917] dark:text-[#DFCA9E] flex items-center gap-1.5 shrink-0 select-none">
                          <Phone className="w-3.5 h-3.5 text-[#BD452F] dark:text-[#DE644E]" />
                          <span>+88</span>
                        </span>
                        <input
                          ref={phoneInputRef}
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={11}
                          value={localPhoneDigits}
                          onChange={(e) => handlePhoneDigitsChange(e.target.value)}
                          placeholder="017XXXXXXXX"
                          className="w-full px-3.5 py-2.5 bg-transparent text-xs text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#A89884]/60 focus:outline-none font-mono-tech font-bold tracking-wide"
                        />
                      </div>
                      {phoneError && phoneIsInvalid && (
                        <p className="text-[11px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {lang === 'bn'
                              ? `ইনভ্যালিড ফোন নম্বর (১১টি ডিজিট পূর্ণ করুন: ${localPhoneDigits.length}/১১)`
                              : `Invalid phone number (must be 11 digits: ${localPhoneDigits.length}/11)`}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Academic Credentials */}
                <div className="pt-4 border-t border-[#C5A880]/20">
                  <h3 className="text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-[#854D0E] dark:text-[#DFCA9E]" />
                    <span>{lang === 'bn' ? 'শিক্ষা ও ব্যাচ সংক্রান্ত তথ্য' : 'Academic Credentials & Cohort'}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Batch */}
                    <div ref={batchFieldRef}>
                      <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1.5">
                        {lang === 'bn' ? 'কততম ব্যাচ (Batch)' : 'Cohort / Batch'}
                      </label>
                      <select
                        value={formData.batch}
                        onChange={(e) => {
                          setBatchError(false);
                          setFormData({ ...formData, batch: e.target.value });
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none transition font-sans ${
                          batchError && !formData.batch
                            ? 'border-rose-500 ring-1 ring-rose-500/50'
                            : 'border-[#C5A880]/30 focus:border-[#C5A880]'
                        }`}
                      >
                        <option value="" className="bg-white dark:bg-[#141311] text-[#A89884]">
                          {lang === 'bn' ? 'ব্যাচ সিলেক্ট করুন' : 'Select Batch'}
                        </option>
                        {BATCH_OPTIONS.map((b) => (
                          <option key={b} value={b} className="bg-white dark:bg-[#141311] text-[#1C1917] dark:text-[#EDE8DF]">
                            {b}
                          </option>
                        ))}
                      </select>
                      {batchError && !formData.batch && (
                        <p className="text-[11px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{lang === 'bn' ? 'অনুগ্রহ করে ব্যাচ সিলেক্ট করুন' : 'Please select your batch'}</span>
                        </p>
                      )}
                    </div>

                    {/* Department */}
                    <div ref={deptFieldRef}>
                      <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1.5">
                        {lang === 'bn' ? 'বিভাগ (Department)' : 'Department'}
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => {
                          setDeptError(false);
                          const found = DEPARTMENT_OPTIONS.find(d => d.id === e.target.value);
                          setFormData({
                            ...formData,
                            department: e.target.value,
                            deptBn: found ? found.nameBn : ''
                          });
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none transition font-sans ${
                          deptError && !formData.department
                            ? 'border-rose-500 ring-1 ring-rose-500/50'
                            : 'border-[#C5A880]/30 focus:border-[#C5A880]'
                        }`}
                      >
                        <option value="" className="bg-white dark:bg-[#141311] text-[#A89884]">
                          {lang === 'bn' ? 'ডিপার্টমেন্ট সিলেক্ট করুন' : 'Select Department'}
                        </option>
                        {DEPARTMENT_OPTIONS.map((d) => (
                          <option key={d.id} value={d.id} className="bg-white dark:bg-[#141311] text-[#1C1917] dark:text-[#EDE8DF]">
                            {lang === 'bn' ? d.nameBn : d.nameEn}
                          </option>
                        ))}
                      </select>
                      {deptError && !formData.department && (
                        <p className="text-[11px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{lang === 'bn' ? 'অনুগ্রহ করে ডিপার্টমেন্ট সিলেক্ট করুন' : 'Please select your department'}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Elaborated Career, Job Designation, Company & Location */}
                <div className="pt-4 border-t border-[#C5A880]/20 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-[#854D0E] dark:text-[#DFCA9E]" />
                      <span>{lang === 'bn' ? 'কর্মসংস্থান, পদবী ও ক্যারিয়ার বিবরণ (গ্র্যাজুয়েটদের জন্য বিস্তারিত)' : 'Career, Designation, Company & Location'}</span>
                    </h3>
                    <span className="text-[10px] font-sans text-[#854D0E] dark:text-[#DFCA9E]">
                      {lang === 'bn' ? 'বর্তমান শিক্ষার্থী হলে নিচে প্রযোজ্য ঘরগুলো খালি রাখতে পারেন' : 'Optional for current undergraduate students'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Job Title / Designation */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1.5">
                        {lang === 'bn' ? 'চাকরির পদবী / ডেজিগনেশন (Designation)' : 'Job Title / Designation'}
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89884]" />
                        <input
                          type="text"
                          value={formData.designation}
                          onChange={(e) => setFormData({
                            ...formData,
                            designation: e.target.value,
                            currentJob: e.target.value && formData.company ? `${e.target.value}, ${formData.company}` : (e.target.value || formData.company || '')
                          })}
                          placeholder={lang === 'bn' ? 'উদা: Senior Merchandiser / Production Officer / Quality Engineer' : 'e.g. Senior Merchandiser / Production Officer'}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#A89884]/60 focus:outline-none focus:border-[#C5A880] transition font-sans"
                        />
                      </div>
                    </div>

                    {/* Company / Mill Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1.5">
                        {lang === 'bn' ? 'কোম্পানি / মিল / প্রতিষ্ঠানের নাম (Company Name)' : 'Company / Mill / Organization Name'}
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89884]" />
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({
                            ...formData,
                            company: e.target.value,
                            currentJob: formData.designation && e.target.value ? `${formData.designation}, ${e.target.value}` : (formData.designation || e.target.value || '')
                          })}
                          placeholder={lang === 'bn' ? 'উদা: বেক্সিমকো / স্কয়ার ফ্যাশনস / ডিবিএল গ্রুপ' : 'e.g. Beximco Textiles / Square Fashions / DBL'}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#A89884]/60 focus:outline-none focus:border-[#C5A880] transition font-sans"
                        />
                      </div>
                    </div>

                    {/* Industry Sector */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1.5">
                        {lang === 'bn' ? 'ইন্ডাস্ট্রি সেক্টর / পেশার ধরন (Sector)' : 'Industry Sector / Field'}
                      </label>
                      <select
                        value={formData.jobSector}
                        onChange={(e) => setFormData({ ...formData, jobSector: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880] transition font-sans"
                      >
                        <option value="">{lang === 'bn' ? '— সেক্টর নির্বাচন করুন (ঐচ্ছিক) —' : '— Select Sector (Optional) —'}</option>
                        <option value="Apparel & Merchandising">{lang === 'bn' ? 'অ্যাপারেল ও মার্চেন্ডাইজিং (Apparel / Buying House)' : 'Apparel & Merchandising / Buying House'}</option>
                        <option value="Yarn / Spinning">{lang === 'bn' ? 'ইয়ার্ন ও স্পিনিং মিলস (Spinning)' : 'Yarn / Spinning Mills'}</option>
                        <option value="Fabric / Weaving & Knitting">{lang === 'bn' ? 'ফ্যাব্রিক (উইভিং ও নিটিং)' : 'Fabric (Weaving & Knitting)'}</option>
                        <option value="Wet Processing / Dyeing">{lang === 'bn' ? 'ওয়েট প্রসেস / ডাইং ও ফিনিশিং' : 'Wet Processing / Dyeing & Finishing'}</option>
                        <option value="Quality Assurance / Testing Lab">{lang === 'bn' ? 'কোয়ালিটি অ্যাসুরেন্স ও টেস্টিং ল্যাব (QA/QC)' : 'Quality Assurance & Testing Lab'}</option>
                        <option value="Higher Studies / Research">{lang === 'bn' ? 'উচ্চশিক্ষা ও গবেষণা (M.Sc. / Ph.D.)' : 'Higher Studies & Research'}</option>
                        <option value="Govt. / Academic Service">{lang === 'bn' ? 'সরকারি চাকরি / শিক্ষকতা' : 'Government / Academic Service'}</option>
                        <option value="Entrepreneur / Business">{lang === 'bn' ? 'উদ্যোক্তা / নিজস্ব ব্যবসা' : 'Entrepreneur / Business'}</option>
                        <option value="Currently Studying / Seeking">{lang === 'bn' ? 'অধ্যয়নরত / ফ্রেশার (ইন্টার্ন)' : 'Current Student / Fresh Graduate'}</option>
                      </select>
                    </div>

                    {/* Job Location */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1.5">
                        {lang === 'bn' ? 'চাকরির লোকেশন / কর্মস্থল (Job Location)' : 'Work / Job Location'}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89884]" />
                        <input
                          type="text"
                          value={formData.workLocation}
                          onChange={(e) => setFormData({
                            ...formData,
                            workLocation: e.target.value,
                            currentLocation: formData.currentLocation || e.target.value
                          })}
                          placeholder={lang === 'bn' ? 'উদা: গাজীপুর / সাভার / নারায়ণগঞ্জ / ঢাকা / বিদেশ' : 'e.g. Gazipur / Savar / Narayanganj / Dhaka'}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#A89884]/60 focus:outline-none focus:border-[#C5A880] transition font-sans"
                        />
                      </div>
                    </div>

                    {/* Experience Duration */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1.5">
                        {lang === 'bn' ? 'অভিজ্ঞতা / চাকরির মেয়াদ (Experience)' : 'Work Experience / Tenure'}
                      </label>
                      <input
                        type="text"
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                        placeholder={lang === 'bn' ? 'উদা: ২ বছর / ২০২৩ থেকে চলমান / ফ্রেশার' : 'e.g. 2+ Years / Since 2023 / Fresher'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#A89884]/60 focus:outline-none focus:border-[#C5A880] transition font-sans"
                      />
                    </div>

                    {/* Current Address / Hometown */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1.5">
                        {lang === 'bn' ? 'বর্তমান ঠিকানা / নিজ জেলা (Home / Address)' : 'Current Address / Hometown'}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89884]" />
                        <input
                          type="text"
                          value={formData.currentLocation}
                          onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value, address: e.target.value })}
                          placeholder={lang === 'bn' ? 'উদা: পীরগঞ্জ, রংপুর / উত্তরা, ঢাকা' : 'e.g. Pirganj, Rangpur / Uttara, Dhaka'}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#A89884]/60 focus:outline-none focus:border-[#C5A880] transition font-sans"
                        />
                      </div>
                    </div>

                    {/* LinkedIn / Professional Profile */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1.5">
                        {lang === 'bn' ? 'LinkedIn প্রোফাইল লিংক (ঐচ্ছিক)' : 'LinkedIn / Portfolio URL (Optional)'}
                      </label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="https://www.linkedin.com/in/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#A89884]/60 focus:outline-none focus:border-[#C5A880] transition font-mono-tech"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 4: Blood Group & Photo & Bio */}
                <div className="pt-4 border-t border-[#C5A880]/20 space-y-4">
                  <h3 className="text-xs font-mono-tech font-bold text-[#57534E] dark:text-[#A89884] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-[#854D0E] dark:text-[#DFCA9E]" />
                    <span>{lang === 'bn' ? 'ছবি ও অতিরিক্ত তথ্য' : 'Photo & Additional Info'}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Blood Group */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1.5">
                        {lang === 'bn' ? 'রক্তের গ্রুপ (Blood Group)' : 'Blood Group'}
                      </label>
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-[#C5A880] transition font-mono-tech"
                      >
                        {BLOOD_GROUPS.map((bg) => (
                          <option key={bg} value={bg} className="bg-white dark:bg-[#141311] text-[#1C1917] dark:text-[#EDE8DF]">
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Avatar / Photo with Direct Gallery Upload & Cloudinary */}
                    <div className="sm:col-span-2">
                      <CloudinaryImageInput
                        label={lang === 'bn' ? 'প্রোফাইল ছবি (গ্যালারি থেকে আপলোড)' : 'Profile Photo (Upload from Gallery)'}
                        value={formData.avatar}
                        onChange={(val) => setFormData({ ...formData, avatar: val })}
                        lang={lang}
                        fallbackIcon={ImageIcon}
                        apiBaseUrl={apiBaseUrl}
                        folder="rtec-alumni/students"
                      />
                    </div>
                  </div>

                  {/* Bio / Description */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1.5">
                      {lang === 'bn' ? 'সংক্ষিপ্ত পরিচয় / বার্তা (Bio / Notes)' : 'Short Bio / Note'}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder={lang === 'bn' ? 'আপনার শিক্ষা বা পেশাগত আগ্রহ সম্পর্কে সংক্ষিপ্ত তথ্য...' : 'Write a short description or professional summary...'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#A89884]/60 focus:outline-none focus:border-[#C5A880] transition font-sans resize-none"
                    />
                  </div>
                </div>

                {/* Submission CTA */}
                <div className="pt-4 border-t border-[#C5A880]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[11px] text-[#57534E] dark:text-[#A89884] font-sans text-center sm:text-left">
                    {lang === 'bn'
                      ? '🔒 তথ্য প্রেরণের পর তা পেন্ডিং অবস্থায় থাকবে এবং অ্যাডমিন কর্তৃক অনুমোদিত হলে ওয়েবসাইটে প্রকাশিত হবে।'
                      : '🔒 Upon submission, your record will enter pending status until approved by the RTEC administrator.'}
                  </p>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {isEditingDetails && (
                      <button
                        type="button"
                        onClick={() => setIsEditingDetails(false)}
                        className="px-5 py-3 rounded-xl bg-slate-200 dark:bg-[#201E1A] hover:bg-slate-300 dark:hover:bg-[#2A2722] text-[#1C1917] dark:text-[#FDFBF7] font-bold text-xs transition cursor-pointer"
                      >
                        {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={regNoIsDuplicate || emailIsDuplicate}
                      className={`w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/20 transition group ${
                        regNoIsDuplicate || emailIsDuplicate
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:from-emerald-500 hover:to-teal-500 cursor-pointer'
                      }`}
                    >
                      <Send className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
                      <span>
                        {isEditingDetails
                          ? (lang === 'bn' ? 'তথ্য আপডেট করুন (Update Submission)' : 'Update My Information')
                          : (lang === 'bn' ? 'তথ্য জমা দিন (Submit for Approval)' : 'Submit for Approval')}
                      </span>
                    </button>
                  </div>
                </div>

              </form>
            </div>

          </motion.div>
        )}
        </AnimatePresence>

        {/* ========================================================
            COMPACT MINIMIZED ID DISPUTE TOGGLE BAR AT BOTTOM
            Replaces the huge open box with a neat toggle bar
            ======================================================== */}
        <div id="dispute-section" className="mt-8 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0C0A09] dark:text-[#FDFBF7]">
                {lang === 'bn'
                  ? 'আপনার রেজিস্ট্রেশন নম্বর কি অন্য কেউ ব্যবহার করেছে?'
                  : 'Did someone falsely claim your Registration Number?'}
              </h4>
              <p className="text-xs text-[#57534E] dark:text-[#A89884] font-sans">
                {lang === 'bn'
                  ? 'অ্যাডমিনের কাছে কমপ্লেইন বা বিরোধ নিষ্পত্তির রিপোর্ট জমা দিতে পাশের বাটনে ক্লিক করুন।'
                  : 'Click the button to submit a dispute report to the college administrator.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDisputeModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer whitespace-nowrap shrink-0"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{lang === 'bn' ? 'রিপোর্ট / কমপ্লেইন উইন্ডো খুলুন' : 'Open Dispute Report Form'}</span>
          </button>
        </div>

        {/* ========================================================
            ID DISPUTE & COMPLAINT FLOATING MODAL WINDOW
            ======================================================== */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {isDisputeModalOpen && (
              <motion.div
                key="portal-dispute-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[99999] overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overscroll-contain"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setIsDisputeModalOpen(false);
                }}
              >
                <motion.div
                  key="portal-dispute-card"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full max-w-2xl bg-white dark:bg-[#1A1815] rounded-3xl border border-amber-500/30 shadow-2xl p-6 sm:p-8 my-auto text-left max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsDisputeModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-[#2A2722] hover:bg-slate-200 dark:hover:bg-[#35312B] text-slate-700 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
                aria-label="Close"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-3.5 pb-4 border-b border-[#C5A880]/20 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-tech px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold uppercase">
                      ID DISPUTE & REPORT DESK
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      {lang === 'bn' ? 'অ্যাডমিন সহায়তা' : 'Admin Assistance'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif-regal font-black text-[#0C0A09] dark:text-[#FDFBF7] mt-1">
                    {lang === 'bn' ? 'রেজিস্ট্রেশন নম্বর সংক্রান্ত অভিযোগ ও বিরোধ নিষ্পত্তি' : 'Registration Number Dispute & Complaint'}
                  </h3>
                  <p className="text-xs text-[#57534E] dark:text-[#A89884] font-sans mt-0.5 leading-relaxed">
                    {lang === 'bn'
                      ? 'কোনো সহপাঠী বা অন্য কেউ যদি ভুলবশত বা অসদুপায়ে আপনার রেজিস্ট্রেশন নম্বর দিয়ে অ্যাকাউন্ট খুলে ফেলে, তবে নিচের বক্সে তথ্য দিন। কলেজ অ্যাডমিন যাচাই করে ১-ক্লিকে ভুয়া প্রোফাইল মুছে আপনার নম্বর উন্মুক্ত করে দেবেন।'
                      : 'If someone falsely registered using your student ID, submit a dispute report below. The college administrator will review and reset the registration number with 1-click.'}
                  </p>
                </div>
              </div>

              {disputeSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-600/50 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-100">
                    {lang === 'bn' ? '✓ আপনার অভিযোগটি অ্যাডমিন প্যানেলে জমা হয়েছে!' : '✓ Your dispute report has been sent to Admin!'}
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
                    {lang === 'bn'
                      ? `রেজিস্ট্রেশন নম্বর (${disputeRegNo}) সংক্রান্ত আপনার বার্তাটি সংরক্ষিত হয়েছে। অ্যাডমিন প্যানেল থেকে ভুয়া তথ্য রিসেট করা মাত্র আপনি আপনার আসল তথ্য জমা দিতে পারবেন।`
                      : `Your report for Registration No (${disputeRegNo}) is queued. Once the administrator resets the disputed claim, you will be able to register your true profile.`}
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDisputeSubmitted(false);
                        setDisputeDesc('');
                      }}
                      className="px-4 py-2 rounded-xl bg-white dark:bg-[#201E1A] border border-emerald-400 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-[#2A2722] transition cursor-pointer"
                    >
                      {lang === 'bn' ? 'আরেকটি রিপোর্ট জমা দিন' : 'Submit another report'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDisputeModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition cursor-pointer"
                    >
                      {lang === 'bn' ? 'উইন্ডো বন্ধ করুন' : 'Close Window'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleDisputeSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Disputed Registration Number */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                        {lang === 'bn' ? 'বিরোধপূর্ণ রেজিস্ট্রেশন নম্বর *' : 'Disputed Registration No *'}
                      </label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A89884]" />
                        <input
                          type="text"
                          required
                          value={disputeRegNo}
                          onChange={(e) => setDisputeRegNo(e.target.value)}
                          placeholder="8025101"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] font-mono-tech focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Real Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                        {lang === 'bn' ? 'আপনার প্রকৃত নাম *' : 'Your Real Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={disputeName}
                        onChange={(e) => setDisputeName(e.target.value)}
                        placeholder={lang === 'bn' ? 'আপনার আসল নাম লিখুন' : 'Enter your real name'}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-amber-500 font-sans"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                        {lang === 'bn' ? 'আপনার মোবাইল নম্বর *' : 'Your Phone Number *'}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A89884]" />
                        <input
                          type="text"
                          required
                          value={disputePhone}
                          onChange={(e) => setDisputePhone(e.target.value)}
                          placeholder="01712-XXXXXX"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] font-mono-tech focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Google Email */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                        {lang === 'bn' ? 'গুগল ইমেইল' : 'Google Email (Optional)'}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A89884]" />
                        <input
                          type="email"
                          value={disputeEmail}
                          onChange={(e) => setDisputeEmail(e.target.value)}
                          placeholder="your.email@gmail.com"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] font-mono-tech focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                      {lang === 'bn' ? 'অভিযোগের বিবরণ / ঘটনার বিস্তারিত' : 'Dispute Description / Details'}
                    </label>
                    <textarea
                      rows={3}
                      value={disputeDesc}
                      onChange={(e) => setDisputeDesc(e.target.value)}
                      placeholder={lang === 'bn'
                        ? 'উদা: আমার রেজিস্ট্রেশন নম্বরটি অন্য কেউ অসদুপায়ে ব্যবহার করে স্টুডেন্ট পোর্টালে তথ্য দিয়ে ফেলেছে। অনুগ্রহ করে সেই তথ্য মুছে আমার আইডি উন্মুক্ত করে দিন।'
                        : 'e.g. My student registration number was used by someone else. Please verify and reset this profile so I can register.'}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] placeholder-[#A89884]/60 focus:outline-none focus:border-amber-500 resize-none font-sans"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <span className="text-[11px] text-[#57534E] dark:text-[#A89884] font-medium">
                      {lang === 'bn'
                        ? '🔒 আপনার যোগাযোগের তথ্য শুধুমাত্র কলেজের অফিসিয়াল অ্যাডমিন দেখতে পাবেন।'
                        : '🔒 Your contact info is strictly confidential and only visible to College Admins.'}
                    </span>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setIsDisputeModalOpen(false)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-[#201E1A] hover:bg-slate-300 dark:hover:bg-[#2A2722] text-[#1C1917] dark:text-[#FDFBF7] font-bold text-xs transition cursor-pointer"
                      >
                        {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        disabled={isDisputeLoading}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/20 transition cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isDisputeLoading
                          ? (lang === 'bn' ? 'পাঠানো হচ্ছে...' : 'Submitting...')
                          : (lang === 'bn' ? 'অ্যাডমিনকে রিপোর্ট জমা দিন' : 'Submit Dispute to Admin')}
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

        {/* Google Sign-in Modal */}
        <GoogleSignInModal
          isOpen={isGoogleModalOpen}
          onClose={() => setIsGoogleModalOpen(false)}
          onSuccess={(usr) => {
            setFormData(prev => ({
              ...prev,
              email: usr.email,
              name: usr.name || prev.name
            }));
            setDisputeEmail(usr.email);
            if (usr.name) setDisputeName(usr.name);
          }}
        />

      </div>
    </motion.div>
  );
}
