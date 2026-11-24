import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import {
  User,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Calendar,
  HeartHandshake,
  Edit3,
  CheckCircle2,
  Ticket,
  Clock,
  AlertCircle,
  XCircle
} from 'lucide-react';
import UserAvatar from '../components/UserAvatar.jsx';

export default function Profile() {
  const { user, setUser, studentSubmissions = [], mySubmission: appMySubmission, mySubmissionId, lang } = useApp();
  const mySubmission = appMySubmission || studentSubmissions.find(
    (s) => (user?.email && s.email?.toLowerCase().trim() === user.email?.toLowerCase().trim()) ||
           (mySubmissionId && s.id === mySubmissionId)
  );
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'events' | 'donations'
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.company || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSave = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      name,
      company: role
    });
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-transparent text-[#EDE8DF] py-8 sm:py-12">
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
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-slate-950" title="Verified Member">
                  <ShieldCheck className="w-5 h-5" />
                </span>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{user?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {user?.isVerified ? '✓ Verified Member' : 'Pending Verification'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#374151] dark:text-slate-300 font-mono font-medium">
                {user?.batch || 'RTEC Member'} • {user?.department || 'Textile Engineering'}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                {user?.company || (user?.role === 'admin' ? 'RTEC Administration' : 'RTEC Student / Alumni')}
              </p>
              <p className="text-xs text-slate-400">
                {user?.email}
              </p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isEditing ? 'বাতিল করুন' : 'প্রোফাইল এডিট'}</span>
            </button>
          </div>

          {saveSuccess && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-bold text-emerald-400 text-center">
              ✓ প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!
            </div>
          )}
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
                    ? (lang === 'bn' ? 'স্টুডেন্ট আইডি রেজিস্ট্রি: পর্যালোচনায় রয়েছে (Declined)' : 'Student Registry: Declined')
                    : (lang === 'bn' ? 'স্টুডেন্ট আইডি রেজিস্ট্রি: অ্যাডমিন অনুমোদনের অপেক্ষমাণ (Pending)' : 'Student Registry: Pending Approval')}
                </p>
                <p className="text-[11px] text-[#DCD3C1] mt-0.5 font-sans">
                  {mySubmission.status === 'approved'
                    ? (lang === 'bn' ? 'আপনার জমা দেওয়া তথ্য অ্যাডমিন কর্তৃক অনুমোদিত হয়েছে এবং ডিরেক্টরিতে প্রকাশিত।' : 'Your submission has been verified and published.')
                    : mySubmission.status === 'declined'
                    ? (lang === 'bn' ? `মন্তব্য: ${mySubmission.reviewNotes || 'তথ্য অসম্পূর্ণ'}। অনুগ্রহ করে স্টুডেন্ট পোর্টালে গিয়ে হালনাগাদ করুন।` : `Note: ${mySubmission.reviewNotes}`)
                    : (lang === 'bn' ? 'আপনার আবেদনটি সংরক্ষিত হয়েছে। অ্যাডমিন প্যানেল থেকে অনুমোদন দেওয়া হলে ডিরেক্টরিতে আসবে।' : 'Your profile is awaiting review by RTEC Admin.')}
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
        {isEditing && (
          <form onSubmit={handleSave} className="glass-panel p-6 rounded-3xl border border-emerald-500/30 mb-8 space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-white mb-2">প্রোফাইল তথ্য আপডেট করুন</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">পূর্ণ নাম</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">প্রতিষ্ঠান ও পদবি</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ফোন নম্বর</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">বর্তমান ঠিকানা</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">সংক্ষিপ্ত পরিচিতি (Bio)</label>
              <textarea
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
            >
              পরিবর্তন সংরক্ষণ করুন
            </button>
          </form>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
              activeTab === 'info'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            অ্যাকাউন্ট ওভারভিউ
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
              activeTab === 'events'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'bn' ? 'আমার নিবন্ধিত ইভেন্ট' : 'My Registered Events'}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base">
              {lang === 'bn' ? 'পরিচিতি ও বিবরণ' : 'About & Bio'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{bio}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">
                  {lang === 'bn' ? 'যোগাযোগ ফোন:' : 'Phone:'}
                </span>
                <p className="text-white font-semibold mt-0.5">{phone}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">
                  {lang === 'bn' ? 'বর্তমান অবস্থান:' : 'Current Location:'}
                </span>
                <p className="text-white font-semibold mt-0.5">{location}</p>
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
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 font-bold">
                  Confirmed Ticket
                </span>
                <h4 className="font-bold text-white text-sm mt-1">
                  {lang === 'bn' ? 'গ্র্যান্ড আরটেক অ্যালামনাই পুনর্মিলনী ২০২৬' : 'Grand RTEC Alumni Reunion 2026'}
                </h4>
                <p className="text-xs text-slate-400">
                  {lang === 'bn' ? '২৫ ডিসেম্বর ২০২৬ • আরটেক সেন্ট্রাল ক্যাম্পাস' : '25 December 2026 • RTEC Central Campus'}
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono font-bold mt-1">
                  Token: RTEC-EVT-984210
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 font-mono bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-500/30">
                Active Pass
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
