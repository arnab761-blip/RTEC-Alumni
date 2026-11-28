import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import CloudinaryImageInput from '../components/CloudinaryImageInput.jsx';
import {
  ShieldCheck,
  MapPin,
  Edit3,
  CheckCircle2,
  Clock,
  XCircle,
  Briefcase,
  GraduationCap,
  Phone,
  Hash,
  Droplet,
  Globe,
  Image as ImageIcon,
  Save
} from 'lucide-react';
import UserAvatar from '../components/UserAvatar.jsx';

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

const DEPARTMENT_OPTIONS = [
  { id: 'Yarn Engineering', nameEn: 'Yarn Engineering (YE)', nameBn: 'ইয়ার্ন ইঞ্জিনিয়ারিং' },
  { id: 'Fabric Engineering', nameEn: 'Fabric Engineering (FE)', nameBn: 'ফ্যাব্রিক ইঞ্জিনিয়ারিং' },
  { id: 'Wet Process Engineering', nameEn: 'Wet Process Engineering (WPE)', nameBn: 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং' },
  { id: 'Apparel Engineering', nameEn: 'Apparel Engineering (AE)', nameBn: 'অ্যাপারেল ইঞ্জিনিয়ারিং' }
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

const extractLocalPhoneDigits = (rawPhone) => {
  const digits = String(rawPhone || '').replace(/\D/g, '');
  if (digits.startsWith('880') && digits.length >= 13) return digits.slice(2, 13);
  if (digits.startsWith('88') && digits.length >= 13) return digits.slice(2, 13);
  return digits.slice(0, 11);
};

export default function Profile() {
  const {
    user,
    students = [],
    alumni = [],
    studentSubmissions = [],
    mySubmission: appMySubmission,
    mySubmissionId,
    updateOwnProfile,
    lang,
    apiBaseUrl = ''
  } = useApp();

  const mySubmission = appMySubmission || studentSubmissions.find(
    (s) => (user?.email && s.email?.toLowerCase().trim() === user.email?.toLowerCase().trim()) ||
           (mySubmissionId && s.id === mySubmissionId)
  );

  const matchedStudent = useMemo(() => {
    const cleanEmail = (user?.email || '').toLowerCase().trim();
    const cleanReg = (user?.regNo || mySubmission?.regNo || '').toLowerCase().trim();
    return students.find(st =>
      (cleanEmail && st.email && st.email.toLowerCase().trim() === cleanEmail) ||
      (cleanReg && st.regNo && st.regNo.toLowerCase().trim() === cleanReg)
    ) || null;
  }, [students, user?.email, user?.regNo, mySubmission?.regNo]);

  const matchedAlumni = useMemo(() => {
    const cleanEmail = (user?.email || '').toLowerCase().trim();
    if (!cleanEmail) return null;
    return alumni.find(a => a.email && a.email.toLowerCase().trim() === cleanEmail) || null;
  }, [alumni, user?.email]);

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const buildInitialForm = () => {
    const rawPhone = mySubmission?.phone || matchedStudent?.phone || matchedAlumni?.phone || user?.phone || '';
    const cleanLoc = mySubmission?.currentLocation || mySubmission?.address || matchedStudent?.currentLocation || matchedStudent?.address || matchedAlumni?.location || user?.address || user?.location || '';
    const cleanCompany = mySubmission?.company || matchedStudent?.company || matchedAlumni?.company || user?.companyName || '';
    const cleanDesig = mySubmission?.designation || matchedStudent?.designation || matchedAlumni?.designation || user?.designation || '';

    return {
      regNo: mySubmission?.regNo || matchedStudent?.regNo || matchedAlumni?.regNo || user?.regNo || '',
      name: mySubmission?.name || matchedStudent?.name || matchedAlumni?.name || user?.name || '',
      phone: extractLocalPhoneDigits(rawPhone),
      batch: mySubmission?.batch || matchedStudent?.batch || matchedAlumni?.batch || user?.batch || '',
      department: mySubmission?.department || matchedStudent?.department || matchedAlumni?.department || user?.department || '',
      deptBn: mySubmission?.deptBn || matchedStudent?.deptBn || user?.deptBn || '',
      designation: cleanDesig,
      company: cleanCompany,
      jobSector: mySubmission?.jobSector || matchedStudent?.jobSector || matchedAlumni?.jobSector || user?.jobSector || '',
      workLocation: mySubmission?.workLocation || matchedStudent?.workLocation || matchedAlumni?.workLocation || user?.workLocation || '',
      experienceYears: mySubmission?.experienceYears || matchedStudent?.experienceYears || matchedAlumni?.experienceYears || user?.experienceYears || '',
      currentLocation: cleanLoc,
      linkedin: mySubmission?.linkedin || matchedStudent?.linkedin || matchedAlumni?.linkedin || user?.linkedin || '',
      bloodGroup: mySubmission?.bloodGroup || matchedStudent?.bloodGroup || matchedAlumni?.bloodGroup || user?.bloodGroup || 'Unknown',
      avatar: mySubmission?.avatar || matchedStudent?.avatar || matchedAlumni?.avatar || user?.avatar || '',
      bio: mySubmission?.bio || matchedStudent?.activities || matchedAlumni?.bio || user?.bio || ''
    };
  };

  const [formData, setFormData] = useState(buildInitialForm);

  useEffect(() => {
    setFormData(buildInitialForm());
  }, [user, mySubmission, matchedStudent, matchedAlumni]);

  const handleRegNoChange = (val) => {
    const trimmed = val.trim().toLowerCase();
    const found = trimmed
      ? students.find(s => s.regNo && String(s.regNo).trim().toLowerCase() === trimmed)
      : null;

    if (found) {
      setFormData(prev => ({
        ...prev,
        regNo: val,
        name: prev.name || found.name || '',
        batch: prev.batch || found.batch || '',
        department: prev.department || found.department || '',
        deptBn: prev.deptBn || found.deptBn || '',
        phone: prev.phone || extractLocalPhoneDigits(found.phone),
        bloodGroup: prev.bloodGroup !== 'Unknown' ? prev.bloodGroup : (found.bloodGroup || 'Unknown'),
        currentLocation: prev.currentLocation || found.currentLocation || found.address || ''
      }));
    } else {
      setFormData(prev => ({ ...prev, regNo: val }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formattedPhone = formData.phone.length === 11 ? `+88${formData.phone}` : formData.phone;
    updateOwnProfile({
      ...formData,
      phone: formattedPhone,
      address: formData.currentLocation,
      location: formData.currentLocation
    });
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const displayPhone = formData.phone.length === 11 ? `+88${formData.phone}` : formData.phone;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-transparent text-[#EDE8DF] py-8 sm:py-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Profile Card Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <UserAvatar
                src={formData.avatar || user?.avatar}
                name={formData.name || user?.name}
                role={user?.role}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-emerald-500/40 shadow-xl"
                iconClassName="w-12 h-12"
              />
              {user?.isVerified && (
                <span
                  className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-slate-950"
                  title={lang === 'bn' ? 'ভেরিফায়েড সদস্য' : 'Verified Member'}
                >
                  <ShieldCheck className="w-5 h-5" />
                </span>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#0C0A09] dark:text-white">
                  {formData.name || user?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  {user?.isVerified
                    ? (lang === 'bn' ? '✓ ভেরিফায়েড সদস্য' : '✓ Verified Member')
                    : (lang === 'bn' ? 'যাচাইকরণ অপেক্ষমাণ' : 'Pending Verification')}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#374151] dark:text-slate-300 font-mono font-medium">
                {formData.batch || user?.batch || (lang === 'bn' ? 'আরটেক সদস্য' : 'RTEC Member')} • {formData.department || user?.department || 'Textile Engineering'}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                {(formData.designation && formData.company)
                  ? `${formData.designation}, ${formData.company}`
                  : (formData.company || formData.designation || user?.company || (user?.role === 'admin'
                    ? (lang === 'bn' ? 'আরটেক প্রশাসন' : 'RTEC Administration')
                    : (lang === 'bn' ? 'আরটেক শিক্ষার্থী / অ্যালামনাই' : 'RTEC Student / Alumni')))}
              </p>
              <p className="text-xs text-[#57534E] dark:text-slate-400">
                {user?.email}{formData.regNo ? ` • Reg: ${formData.regNo}` : ''}
              </p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {isEditing
                  ? (lang === 'bn' ? 'বাতিল করুন' : 'Cancel')
                  : (lang === 'bn' ? 'প্রোফাইল এডিট' : 'Edit Profile')}
              </span>
            </button>
          </div>

          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/90 border border-emerald-500/60 text-xs font-bold text-emerald-900 dark:text-white text-center shadow-md">
                  {lang === 'bn'
                    ? '✓ সম্পূর্ণ প্রোফাইল তথ্য ও স্টুডেন্ট পোর্টাল রেকর্ড সফলভাবে সংরক্ষণ ও সিঙ্ক হয়েছে!'
                    : '✓ Profile & Student Portal details saved and synced successfully!'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Student Self-Submission Status Card */}
        {mySubmission && (
          <div
            className={`p-5 rounded-2xl border mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
              mySubmission.status === 'approved'
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                : mySubmission.status === 'declined'
                ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-500/40 text-rose-900 dark:text-rose-200'
                : 'bg-amber-50 dark:bg-amber-950/25 border-amber-500/40 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {mySubmission.status === 'approved' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : mySubmission.status === 'declined' ? (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              )}
              <div>
                <p className="text-xs font-bold">
                  {mySubmission.status === 'approved'
                    ? (lang === 'bn' ? 'স্টুডেন্ট আইডি রেজিস্ট্রি: অনুমোদিত (Approved)' : 'Student Registry: Approved')
                    : mySubmission.status === 'declined'
                    ? (lang === 'bn' ? 'স্টুডেন্ট আইডি রেজিস্ট্রি: প্রত্যাখ্যাত (Declined)' : 'Student Registry: Declined')
                    : (lang === 'bn' ? 'স্টুডেন্ট আইডি রেজিস্ট্রি: অ্যাডমিন অনুমোদনের অপেক্ষমাণ (Pending)' : 'Student Registry: Pending Approval')}
                </p>
                <p className="text-[11px] opacity-90 mt-0.5 font-sans">
                  {mySubmission.status === 'approved'
                    ? (lang === 'bn' ? 'আপনার জমা দেওয়া তথ্য অ্যাডমিন কর্তৃক অনুমোদিত হয়েছে এবং প্রকাশিত রয়েছে।' : 'Your submission has been verified and published.')
                    : mySubmission.status === 'declined'
                    ? (lang === 'bn'
                        ? `মন্তব্য: ${mySubmission.reviewNotes || 'তথ্য অসম্পূর্ণ'}। অনুগ্রহ করে প্রোফাইল আপডেট করুন।`
                        : `Note: ${mySubmission.reviewNotes || 'Incomplete information'}. Please update your details.`)
                    : (lang === 'bn' ? 'আপনার আবেদনটি সংরক্ষিত হয়েছে। অ্যাডমিন প্যানেল থেকে অনুমোদন দেওয়া হলে প্রকাশিত হবে।' : 'Your profile is awaiting review by RTEC Admin.')}
                </p>
              </div>
            </div>

            <Link
              to="/student-portal"
              className="px-3.5 py-1.5 rounded-xl bg-[#201E1A] hover:bg-[#25221E] border border-[#C5A880]/30 text-xs font-bold text-[#DFCA9E] transition whitespace-nowrap shrink-0"
            >
              {lang === 'bn' ? 'স্টুডেন্ট পোর্টাল →' : 'Student Portal →'}
            </Link>
          </div>
        )}

        {/* Unified Full Edit Form Drawer (Synced with Student Portal) */}
        <AnimatePresence>
          {isEditing && (
            <motion.form
              key="profile-edit-form"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              onSubmit={handleSave}
              className="overflow-hidden mb-8"
            >
              <div className="plaque-elevated p-6 rounded-3xl border border-emerald-500/35 space-y-5 bg-white dark:bg-[#181715]">
                <div className="border-b border-[#C5A880]/20 pb-3">
                  <h3 className="text-base font-bold text-[#0C0A09] dark:text-white">
                    {lang === 'bn' ? 'সম্পূর্ণ প্রোফাইল তথ্য আপডেট করুন' : 'Update Complete Profile Information'}
                  </h3>
                  <p className="text-xs text-[#57534E] dark:text-[#A89884] mt-0.5">
                    {lang === 'bn'
                      ? 'এখান থেকে তথ্য আপডেট করলে তা স্বয়ংক্রিয়ভাবে স্টুডেন্ট পোর্টাল ও ডিরেক্টরিতে সিঙ্ক হবে।'
                      : 'Changes saved here sync directly with your Student Portal & Directory record.'}
                  </p>
                </div>

                {/* Basic & Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                      {lang === 'bn' ? 'রেজিস্ট্রেশন নম্বর (Reg No)' : 'Registration No'}
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A89884]" />
                      <input
                        type="text"
                        value={formData.regNo}
                        onChange={(e) => handleRegNoChange(e.target.value)}
                        placeholder="e.g. 2018-1-5-001"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-emerald-500 font-mono-tech"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                      {lang === 'bn' ? 'পূর্ণ নাম *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={lang === 'bn' ? 'আপনার পূর্ণ নাম লিখুন' : 'Enter your full name'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                      {lang === 'bn' ? 'মোবাইল নম্বর (+88 BD)' : 'Mobile Phone (+88 BD)'}
                    </label>
                    <div className="flex items-center rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 focus-within:border-emerald-500 overflow-hidden">
                      <span className="px-2.5 py-2.5 bg-[#F0EAE0] dark:bg-[#1E1C18] border-r border-[#C5A880]/30 text-xs font-mono-tech font-bold text-[#1C1917] dark:text-[#DFCA9E] shrink-0">
                        +88
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={11}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3 py-2.5 bg-transparent text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none font-mono-tech"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                      {lang === 'bn' ? 'কততম ব্যাচ (Batch)' : 'Academic Batch'}
                    </label>
                    <select
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">{lang === 'bn' ? 'ব্যাচ সিলেক্ট করুন' : 'Select Batch'}</option>
                      {BATCH_OPTIONS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                      {lang === 'bn' ? 'বিভাগ (Department)' : 'Department'}
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => {
                        const found = DEPARTMENT_OPTIONS.find(d => d.id === e.target.value);
                        setFormData({
                          ...formData,
                          department: e.target.value,
                          deptBn: found ? found.nameBn : ''
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">{lang === 'bn' ? 'ডিপার্টমেন্ট সিলেক্ট করুন' : 'Select Department'}</option>
                      {DEPARTMENT_OPTIONS.map((d) => (
                        <option key={d.id} value={d.id}>{lang === 'bn' ? d.nameBn : d.nameEn}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Career & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                      {lang === 'bn' ? 'চাকরির পদবী / ডেজিগনেশন' : 'Job Title / Designation'}
                    </label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder={lang === 'bn' ? 'উদা: Senior Merchandiser / Production Officer' : 'e.g. Senior Merchandiser / Production Officer'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                      {lang === 'bn' ? 'কোম্পানি / মিল / প্রতিষ্ঠানের নাম' : 'Company / Mill / Organization Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder={lang === 'bn' ? 'উদা: বেক্সিমকো / স্কয়ার / ডিবিএল' : 'e.g. Beximco / Square Fashions / DBL'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                      {lang === 'bn' ? 'ইন্ডাস্ট্রি সেক্টর / পেশার ধরন' : 'Industry Sector / Field'}
                    </label>
                    <select
                      value={formData.jobSector}
                      onChange={(e) => setFormData({ ...formData, jobSector: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">{lang === 'bn' ? '— সেক্টর নির্বাচন করুন (ঐচ্ছিক) —' : '— Select Sector (Optional) —'}</option>
                      <option value="Apparel & Merchandising">{lang === 'bn' ? 'অ্যাপারেল ও মার্চেন্ডাইজিং' : 'Apparel & Merchandising / Buying House'}</option>
                      <option value="Yarn / Spinning">{lang === 'bn' ? 'ইয়ার্ন ও স্পিনিং মিলস' : 'Yarn / Spinning Mills'}</option>
                      <option value="Fabric / Weaving & Knitting">{lang === 'bn' ? 'ফ্যাব্রিক (উইভিং ও নিটিং)' : 'Fabric (Weaving & Knitting)'}</option>
                      <option value="Wet Processing / Dyeing">{lang === 'bn' ? 'ওয়েট প্রসেস / ডাইং ও ফিনিশিং' : 'Wet Processing / Dyeing & Finishing'}</option>
                      <option value="Quality Assurance / Testing Lab">{lang === 'bn' ? 'কোয়ালিটি অ্যাসুরেন্স ও টেস্টিং ল্যাব' : 'Quality Assurance & Testing Lab'}</option>
                      <option value="Higher Studies / Research">{lang === 'bn' ? 'উচ্চশিক্ষা ও গবেষণা' : 'Higher Studies & Research'}</option>
                      <option value="Govt. / Academic Service">{lang === 'bn' ? 'সরকারি চাকরি / শিক্ষকতা' : 'Government / Academic Service'}</option>
                      <option value="Entrepreneur / Business">{lang === 'bn' ? 'উদ্যোক্তা / নিজস্ব ব্যবসা' : 'Entrepreneur / Business'}</option>
                      <option value="Currently Studying / Seeking">{lang === 'bn' ? 'অধ্যয়নরত / ফ্রেশার' : 'Current Student / Fresh Graduate'}</option>
                      <option value="Others">{lang === 'bn' ? 'অন্যান্য (Others)' : 'Others'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                      {lang === 'bn' ? 'চাকরির লোকেশন / কর্মস্থল' : 'Work / Job Location'}
                    </label>
                    <input
                      type="text"
                      value={formData.workLocation}
                      onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                      placeholder={lang === 'bn' ? 'উদা: গাজীপুর / সাভার / ঢাকা' : 'e.g. Gazipur / Savar / Dhaka'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                      {lang === 'bn' ? 'অভিজ্ঞতা / চাকরির মেয়াদ' : 'Work Experience / Tenure'}
                    </label>
                    <input
                      type="text"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                      placeholder={lang === 'bn' ? 'উদা: ২ বছর / ২০২৩ থেকে চলমান' : 'e.g. 2+ Years / Since 2023'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                      {lang === 'bn' ? 'বর্তমান ঠিকানা / নিজ জেলা' : 'Current Address / Hometown'}
                    </label>
                    <input
                      type="text"
                      value={formData.currentLocation}
                      onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                      placeholder={lang === 'bn' ? 'উদা: পীরগঞ্জ, রংপুর / উত্তরা, ঢাকা' : 'e.g. Pirganj, Rangpur / Uttara, Dhaka'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                      {lang === 'bn' ? 'LinkedIn / পোর্টফোলিও লিংক (ঐচ্ছিক)' : 'LinkedIn / Portfolio URL (Optional)'}
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="https://www.linkedin.com/in/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-emerald-500 font-mono-tech"
                    />
                  </div>
                </div>

                {/* Blood Group, Photo & Bio */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                      {lang === 'bn' ? 'রক্তের গ্রুপ (Blood Group)' : 'Blood Group'}
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-emerald-500 font-mono-tech"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

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

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] dark:text-[#DCD3C1] mb-1">
                    {lang === 'bn' ? 'সংক্ষিপ্ত পরিচিতি / বার্তা (Short Bio / Note)' : 'Short Bio / Note'}
                  </label>
                  <textarea
                    rows="3"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder={lang === 'bn' ? 'আপনার সম্পর্কে সংক্ষেপে লিখুন...' : 'Write a short bio or professional summary...'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-[#FDFBF7] focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-[#25221E] text-[#1C1917] dark:text-[#FDFBF7] font-bold text-xs cursor-pointer"
                  >
                    {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'পরিবর্তন সংরক্ষণ ও সিঙ্ক করুন' : 'Save & Sync Changes'}</span>
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 mb-6 gap-4">
          <div className="pb-3 px-4 text-xs font-bold border-b-2 border-emerald-400 text-emerald-700 dark:text-emerald-400">
            {lang === 'bn' ? 'অ্যাকাউন্ট ওভারভিউ' : 'Account Overview'}
          </div>
        </div>

        {/* Account Overview */}
        <div className="plaque-elevated p-6 rounded-3xl border border-[#C5A880]/25 space-y-5 bg-white dark:bg-[#181715]">
          <div>
            <h3 className="font-bold text-[#0C0A09] dark:text-white text-base">
              {lang === 'bn' ? 'পরিচিতি ও বিবরণ' : 'About & Bio'}
            </h3>
            <p className="text-xs sm:text-sm text-[#374151] dark:text-slate-300 leading-relaxed mt-1">
              {formData.bio || (lang === 'bn' ? 'এখনও কোনো পরিচিতি যুক্ত করা হয়নি।' : 'No bio added yet.')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-4 border-t border-[#C5A880]/20 text-xs">
            <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-slate-900/80 border border-[#C5A880]/20 dark:border-slate-800">
              <span className="text-[#57534E] dark:text-slate-400 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === 'bn' ? 'রেজিস্ট্রেশন নম্বর:' : 'Registration No:'}</span>
              </span>
              <p className="text-[#0C0A09] dark:text-white font-semibold mt-0.5 font-mono-tech">
                {formData.regNo || (lang === 'bn' ? 'দেওয়া হয়নি' : 'Not provided')}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-slate-900/80 border border-[#C5A880]/20 dark:border-slate-800">
              <span className="text-[#57534E] dark:text-slate-400 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === 'bn' ? 'ব্যাচ ও বিভাগ:' : 'Batch & Dept:'}</span>
              </span>
              <p className="text-[#0C0A09] dark:text-white font-semibold mt-0.5">
                {formData.batch || '—'} • {formData.department || '—'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-slate-900/80 border border-[#C5A880]/20 dark:border-slate-800">
              <span className="text-[#57534E] dark:text-slate-400 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === 'bn' ? 'যোগাযোগ ফোন:' : 'Phone:'}</span>
              </span>
              <p className="text-[#0C0A09] dark:text-white font-semibold mt-0.5 font-mono-tech">
                {displayPhone || (lang === 'bn' ? 'দেওয়া হয়নি' : 'Not provided')}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-slate-900/80 border border-[#C5A880]/20 dark:border-slate-800">
              <span className="text-[#57534E] dark:text-slate-400 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === 'bn' ? 'পদবি ও প্রতিষ্ঠান:' : 'Role & Company:'}</span>
              </span>
              <p className="text-[#0C0A09] dark:text-white font-semibold mt-0.5">
                {(formData.designation || formData.company)
                  ? `${formData.designation}${formData.designation && formData.company ? ' @ ' : ''}${formData.company}`
                  : (lang === 'bn' ? 'দেওয়া হয়নি' : 'Not provided')}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-slate-900/80 border border-[#C5A880]/20 dark:border-slate-800">
              <span className="text-[#57534E] dark:text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === 'bn' ? 'কর্মস্থল ও ঠিকানা:' : 'Work & Address:'}</span>
              </span>
              <p className="text-[#0C0A09] dark:text-white font-semibold mt-0.5">
                {formData.workLocation || formData.currentLocation || (lang === 'bn' ? 'দেওয়া হয়নি' : 'Not provided')}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-slate-900/80 border border-[#C5A880]/20 dark:border-slate-800">
              <span className="text-[#57534E] dark:text-slate-400 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-rose-500" />
                <span>{lang === 'bn' ? 'রক্তের গ্রুপ:' : 'Blood Group:'}</span>
              </span>
              <p className="text-[#0C0A09] dark:text-white font-semibold mt-0.5 font-mono-tech">
                {formData.bloodGroup || 'Unknown'}
              </p>
            </div>
          </div>

          {formData.linkedin && (
            <div className="pt-2">
              <a
                href={formData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{formData.linkedin}</span>
              </a>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
