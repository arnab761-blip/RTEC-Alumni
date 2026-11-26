import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import {
  ShieldCheck,
  MapPin,
  Edit3,
  CheckCircle2,
  Ticket,
  Clock,
  XCircle,
  ArrowRight
} from 'lucide-react';
import UserAvatar from '../components/UserAvatar.jsx';

export default function Profile() {
  const {
    user,
    students = [],
    studentSubmissions = [],
    mySubmission: appMySubmission,
    mySubmissionId,
    registeredEvents = [],
    events = [],
    updateOwnProfile,
    lang
  } = useApp();

  const mySubmission = appMySubmission || studentSubmissions.find(
    (s) => (user?.email && s.email?.toLowerCase().trim() === user.email?.toLowerCase().trim()) ||
           (mySubmissionId && s.id === mySubmissionId)
  );

  const matchedStudent = useMemo(() => {
    const cleanEmail = (user?.email || '').toLowerCase().trim();
    if (!cleanEmail) return null;
    return students.find(st => st.email && st.email.toLowerCase().trim() === cleanEmail) || null;
  }, [students, user?.email]);

  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'events'
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Synced Form State
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.company || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(
    user?.address || user?.location || mySubmission?.address || mySubmission?.currentLocation || matchedStudent?.address || matchedStudent?.currentLocation || ''
  );
  const [bio, setBio] = useState(user?.bio || mySubmission?.bio || matchedStudent?.activities || '');

  useEffect(() => {
    setName(user?.name || '');
    setRole(user?.company || '');
    setPhone(user?.phone || mySubmission?.phone || matchedStudent?.phone || '');
    setAddress(
      user?.address || user?.location || mySubmission?.address || mySubmission?.currentLocation || matchedStudent?.address || matchedStudent?.currentLocation || ''
    );
    setBio(user?.bio || mySubmission?.bio || matchedStudent?.activities || '');
  }, [user, mySubmission, matchedStudent]);

  // Only show genuine registrations belonging to this user for existing events
  const myRegisteredEvents = useMemo(() => {
    const cleanEmail = (user?.email || '').toLowerCase().trim();
    return (registeredEvents || []).filter(reg => {
      const belongsToUser = !reg.attendeeEmail || (cleanEmail && reg.attendeeEmail === cleanEmail);
      const eventStillExists = (events || []).some(e => e.id === reg.eventId);
      return belongsToUser && eventStillExists;
    });
  }, [registeredEvents, events, user?.email]);

  const handleSave = (e) => {
    e.preventDefault();
    updateOwnProfile({
      name,
      company: role,
      phone,
      address,
      bio
    });
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

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
                src={user?.avatar}
                name={user?.name}
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
                <h1 className="text-xl sm:text-2xl font-black text-white">{user?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {user?.isVerified
                    ? (lang === 'bn' ? '✓ ভেরিফায়েড সদস্য' : '✓ Verified Member')
                    : (lang === 'bn' ? 'যাচাইকরণ অপেক্ষমাণ' : 'Pending Verification')}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#374151] dark:text-slate-300 font-mono font-medium">
                {user?.batch || (lang === 'bn' ? 'আরটেক সদস্য' : 'RTEC Member')} • {user?.department || 'Textile Engineering'}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                {user?.company || (user?.role === 'admin'
                  ? (lang === 'bn' ? 'আরটেক প্রশাসন' : 'RTEC Administration')
                  : (lang === 'bn' ? 'আরটেক শিক্ষার্থী / অ্যালামনাই' : 'RTEC Student / Alumni'))}
              </p>
              <p className="text-xs text-slate-400">
                {user?.email}
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
                    ? '✓ প্রোফাইল তথ্য ও ঠিকানা সফলভাবে সংরক্ষণ করা হয়েছে!'
                    : '✓ Profile information & address saved successfully!'}
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
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                : mySubmission.status === 'declined'
                ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                : 'bg-amber-950/25 border-amber-500/40 text-amber-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {mySubmission.status === 'approved' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : mySubmission.status === 'declined' ? (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              )}
              <div>
                <p className="text-xs font-bold text-[#FDFBF7]">
                  {mySubmission.status === 'approved'
                    ? (lang === 'bn' ? 'স্টুডেন্ট আইডি রেজিস্ট্রি: অনুমোদিত (Approved)' : 'Student Registry: Approved')
                    : mySubmission.status === 'declined'
                    ? (lang === 'bn' ? 'স্টুডেন্ট আইডি রেজিস্ট্রি: প্রত্যাখ্যাত (Declined)' : 'Student Registry: Declined')
                    : (lang === 'bn' ? 'স্টুডেন্ট আইডি রেজিস্ট্রি: অ্যাডমিন অনুমোদনের অপেক্ষমাণ (Pending)' : 'Student Registry: Pending Approval')}
                </p>
                <p className="text-[11px] text-[#DCD3C1] mt-0.5 font-sans">
                  {mySubmission.status === 'approved'
                    ? (lang === 'bn' ? 'আপনার জমা দেওয়া তথ্য অ্যাডমিন কর্তৃক অনুমোদিত হয়েছে এবং প্রকাশিত রয়েছে।' : 'Your submission has been verified and published.')
                    : mySubmission.status === 'declined'
                    ? (lang === 'bn'
                        ? `মন্তব্য: ${mySubmission.reviewNotes || 'তথ্য অসম্পূর্ণ'}। অনুগ্রহ করে স্টুডেন্ট পোর্টালে গিয়ে হালনাগাদ করুন।`
                        : `Note: ${mySubmission.reviewNotes || 'Incomplete information'}. Please update in the Student Portal.`)
                    : (lang === 'bn' ? 'আপনার আবেদনটি সংরক্ষিত হয়েছে। অ্যাডমিন প্যানেল থেকে অনুমোদন দেওয়া হলে প্রকাশিত হবে।' : 'Your profile is awaiting review by RTEC Admin.')}
                </p>
              </div>
            </div>

            <Link
              to="/student-portal"
              className="px-3.5 py-1.5 rounded-xl bg-[#201E1A] hover:bg-[#25221E] border border-[#C5A880]/30 text-xs font-bold text-[#DFCA9E] transition whitespace-nowrap shrink-0"
            >
              {lang === 'bn' ? 'তথ্য পরিবর্তন / বিস্তারিত →' : 'Edit / View →'}
            </Link>
          </div>
        )}

        {/* Edit Form Drawer */}
        <AnimatePresence>
          {isEditing && (
            <motion.form
              key="profile-edit-form"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSave}
              className="overflow-hidden mb-8"
            >
              <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
                <h3 className="text-base font-bold text-white mb-2">
                  {lang === 'bn' ? 'প্রোফাইল তথ্য আপডেট করুন' : 'Update Profile Information'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'bn' ? 'আপনার পূর্ণ নাম লিখুন' : 'Enter your full name'}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'প্রতিষ্ঠান ও পদবি' : 'Organization & Designation'}
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder={lang === 'bn' ? 'যেমন: শিক্ষার্থী, আরটেক / প্রকৌশলী' : 'e.g. Student at RTEC / Textile Engineer'}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 17XX-XXXXXX"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'ঠিকানা' : 'Address'}
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={lang === 'bn' ? 'যেমন: পীরগঞ্জ, রংপুর / ঢাকা' : 'e.g. Pirganj, Rangpur / Dhaka'}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'bn' ? 'সংক্ষিপ্ত পরিচিতি (Bio)' : 'Short Bio'}
                  </label>
                  <textarea
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={lang === 'bn' ? 'আপনার সম্পর্কে সংক্ষেপে লিখুন...' : 'Write a short bio about yourself...'}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 cursor-pointer"
                >
                  {lang === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 mb-6 gap-4">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 px-4 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 border-b-2 cursor-pointer ${
              activeTab === 'info'
                ? 'border-emerald-400 text-emerald-400 scale-110'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'bn' ? 'অ্যাকাউন্ট ওভারভিউ' : 'Account Overview'}
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 px-4 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 border-b-2 cursor-pointer ${
              activeTab === 'events'
                ? 'border-emerald-400 text-emerald-400 scale-110'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'bn' ? 'আমার নিবন্ধিত ইভেন্ট' : 'My Registered Events'}
            {myRegisteredEvents.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                {myRegisteredEvents.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'info' && (
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="font-bold text-white text-base">
                  {lang === 'bn' ? 'পরিচিতি ও বিবরণ' : 'About & Bio'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {bio || (lang === 'bn' ? 'এখনও কোনো পরিচিতি যুক্ত করা হয়নি।' : 'No bio added yet.')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 block">
                      {lang === 'bn' ? 'যোগাযোগ ফোন:' : 'Phone:'}
                    </span>
                    <p className="text-white font-semibold mt-0.5">
                      {phone || (lang === 'bn' ? 'দেওয়া হয়নি' : 'Not provided')}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'bn' ? 'ঠিকানা:' : 'Address:'}</span>
                    </span>
                    <p className="text-white font-semibold mt-0.5">
                      {address || (lang === 'bn' ? 'দেওয়া হয়নি' : 'Not provided')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-emerald-400" />
                  <span>{lang === 'bn' ? 'নিবন্ধিত ইভেন্ট ও টিকিট' : 'Registered Events & Passes'}</span>
                </h3>

                {myRegisteredEvents.length > 0 ? (
                  <div className="space-y-3">
                    {myRegisteredEvents.map((reg) => (
                      <div
                        key={reg.id}
                        className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex items-center justify-between gap-4"
                      >
                        <div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 font-bold">
                            {lang === 'bn' ? 'নিশ্চিতকৃত টিকিট' : 'Confirmed Ticket'}
                          </span>
                          <h4 className="font-bold text-white text-sm mt-1">
                            {lang === 'bn' ? reg.eventTitleBn : reg.eventTitle}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {reg.date} • {lang === 'bn' ? reg.venueBn : reg.venue}
                          </p>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono font-bold mt-1">
                            Token: {reg.token}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 font-mono bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-500/30 shrink-0">
                          {lang === 'bn' ? 'অ্যাক্টিভ পাস' : 'Active Pass'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
                    <Ticket className="w-8 h-8 text-slate-500 mx-auto" />
                    <h4 className="text-sm font-bold text-white">
                      {lang === 'bn' ? 'এখনও কোনো ইভেন্টে নিবন্ধন করা হয়নি' : 'No Registered Events Yet'}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      {lang === 'bn'
                        ? 'আপনি কোনো ইভেন্ট বা প্রোগ্রামে নিবন্ধন করলে আপনার কনফার্মড টিকিট ও পাস এখানে দেখাবে।'
                        : 'When you register for an upcoming reunion, seminar, or campus event, your active pass will appear here.'}
                    </p>
                    <Link
                      to="/events"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
                    >
                      <span>{lang === 'bn' ? 'ইভেন্ট ও প্রোগ্রাম দেখুন' : 'Browse Events'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
