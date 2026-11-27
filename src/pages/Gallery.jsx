import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { formatDriveImageUrl } from '../utils/driveImage.js';
import { useScrollLock } from '../utils/useScrollLock.js';
import CloudinaryImageInput from '../components/CloudinaryImageInput.jsx';
import {
  Image as ImageIcon,
  Heart,
  Upload,
  X,
  CheckCircle2,
  BookOpen,
  Calendar
} from 'lucide-react';

export default function Gallery() {
  const { memories, likeMemory, addMemory, user, mySubmission, students = [], alumni = [], lang, apiBaseUrl = '' } = useApp();
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [gateNotice, setGateNotice] = useState('');

  const isPendingUser = Boolean(
    user?.submissionStatus === 'pending' ||
    mySubmission?.status === 'pending'
  );
  const userEmailLower = (user?.email || '').toLowerCase().trim();
  const canShareMemory = Boolean(
    user &&
    user.role &&
    user.role !== 'guest' &&
    !isPendingUser && (
      user.role === 'admin' ||
      mySubmission?.status === 'approved' ||
      user.submissionStatus === 'approved' ||
      (userEmailLower && students.some(s => s.email?.toLowerCase().trim() === userEmailLower)) ||
      (userEmailLower && alumni.some(a => a.email?.toLowerCase().trim() === userEmailLower && a.isVerified !== false))
    )
  );

  const handleOpenUploadModal = () => {
    if (!canShareMemory) {
      setGateNotice(
        isPendingUser
          ? (lang === 'bn'
              ? 'আপনার অ্যাকাউন্টটি এখনো অ্যাডমিন অনুমোদনের অপেক্ষায় আছে। অনুমোদনের আগে আপনি শুধু সবকিছু দেখতে পারবেন।'
              : 'Your account is pending Admin approval. You can view all memories, but cannot post yet.')
          : (lang === 'bn'
              ? 'পোস্ট করতে হলে অনুমোদিত শিক্ষার্থী বা অ্যালামনাই হিসেবে লগইন থাকতে হবে। লগইন ছাড়া আপনি শুধু সবকিছু দেখতে পারবেন।'
              : 'Only approved Students and Alumni can share memories. Please sign in with a verified account to post.')
      );
      setTimeout(() => setGateNotice(''), 5000);
      return;
    }
    setGateNotice('');
    setUploadModalOpen(true);
  };

  // Lock background scroll when lightbox or upload modal is open
  useScrollLock(Boolean(selectedMemory || uploadModalOpen));

  // Form State
  const [newMemory, setNewMemory] = useState({
    title: '',
    titleBn: '',
    story: '',
    batch: user?.batch || '1st Batch (2018-19)',
    memoryDate: '',
    image: ''
  });

  const memoryList = memories || [];

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const hasPhoto = Boolean(newMemory.image && newMemory.image.trim());
    const hasStory = Boolean(newMemory.story && newMemory.story.trim());

    if (!hasPhoto && !hasStory) {
      setUploadError(
        lang === 'bn'
          ? 'দয়া করে একটি ছবি আপলোড করুন অথবা স্মৃতি/গল্প আকারে কিছু লিখুন।'
          : 'Please upload a photo or write a memory story/article.'
      );
      return;
    }

    setUploadError('');
    const displayDate = newMemory.memoryDate.trim() || new Date().getFullYear().toString();
    addMemory({
      ...newMemory,
      year: displayDate,
      memoryDate: displayDate,
      postType: hasPhoto ? 'photo' : 'article'
    });
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setUploadModalOpen(false);
      setNewMemory({
        title: '',
        titleBn: '',
        story: '',
        batch: user?.batch || '1st Batch (2018-19)',
        memoryDate: '',
        image: ''
      });
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-transparent text-[#0C0A09] dark:text-[#EDE8DF] py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-2">
              <ImageIcon className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ক্যাম্পাস মেমোরি আর্কাইভ • ফটো ও স্মৃতিকথা' : 'Campus Memory Archive • Photos & Stories'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0C0A09] dark:text-white tracking-tight">
              {lang === 'bn' ? 'স্মৃতির সোনালী পাতা (Memory Archive)' : 'Milestones & Campus Memory Archive'}
            </h1>
            <p className="text-xs sm:text-sm text-[#374151] dark:text-[#DCD3C1] mt-1 max-w-xl font-medium">
              {lang === 'bn'
                ? 'ক্যাম্পাস জীবন, ল্যাব ও প্রজেক্টের কাজ, সেন্ট্রাল মাঠের খেলাধুলা ও সমাবর্তনের শালীন ও স্মরণীয় মুহূর্তগুলোর ছবি এবং স্মৃতিকথা।'
                : 'An archive of respectful campus life photos, lab projects, sports moments, and written alumni stories.'}
            </p>
          </div>

          <button
            onClick={handleOpenUploadModal}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/30 transition hover:scale-105 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-white" />
            <span>{lang === 'bn' ? 'স্মৃতি বা গল্প শেয়ার করুন' : 'Share Photo or Story'}</span>
          </button>
        </div>

        {gateNotice && (
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/40 text-xs text-amber-900 dark:text-amber-200 font-semibold">
            {gateNotice}
          </div>
        )}

        {/* Memories Grid OR Clean Empty State */}
        {memoryList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memoryList.map((mem) => {
              const hasImage = Boolean(mem.image);
              const dateLabel = mem.memoryDate || mem.year;
              return (
                <div
                  key={mem.id}
                  className="plaque-elevated rounded-2xl overflow-hidden group border border-[#C5A880]/30 hover:border-emerald-500/50 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
                >
                  {hasImage ? (
                    <div
                      className="relative h-60 w-full overflow-hidden cursor-pointer on-dark-media"
                      onClick={() => setSelectedMemory(mem)}
                    >
                      <img
                        src={formatDriveImageUrl(mem.image)}
                        alt={mem.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-85 group-hover:opacity-70 transition-opacity" />

                      {dateLabel && (
                        <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded bg-slate-950/90 text-white keep-white text-[10px] font-mono border border-white/20">
                          {mem.batch} {dateLabel ? `(${dateLabel})` : ''}
                        </span>
                      )}

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-sm font-bold text-white keep-white drop-shadow-md">
                          {lang === 'bn' ? (mem.titleBn || mem.title) : (mem.title || mem.titleBn)}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="p-5 flex-1 flex flex-col justify-between cursor-pointer bg-[#F8F5EE] dark:bg-[#1E1C18] min-h-[200px]"
                      onClick={() => setSelectedMemory(mem)}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300/60 dark:border-emerald-500/30">
                            <BookOpen className="w-3 h-3" />
                            <span>{lang === 'bn' ? 'স্মৃতিকথা / আর্টিকেল' : 'Memory Story'}</span>
                          </span>
                          {dateLabel && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#57534E] dark:text-[#A89884]">
                              <Calendar className="w-3 h-3" />
                              {dateLabel}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-extrabold text-[#0C0A09] dark:text-white leading-snug mb-2">
                          {lang === 'bn' ? (mem.titleBn || mem.title) : (mem.title || mem.titleBn)}
                        </h3>
                        {mem.story && (
                          <p className="text-xs text-[#374151] dark:text-[#DCD3C1] leading-relaxed line-clamp-4">
                            {mem.story}
                          </p>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-3 inline-block">
                        {lang === 'bn' ? 'সম্পূর্ণ পড়ুন →' : 'Read full story →'}
                      </span>
                    </div>
                  )}

                  {hasImage && mem.story && (
                    <div
                      className="px-4 py-2.5 bg-white/70 dark:bg-[#1C1A17] border-t border-[#C5A880]/15 cursor-pointer"
                      onClick={() => setSelectedMemory(mem)}
                    >
                      <p className="text-xs text-[#374151] dark:text-[#DCD3C1] line-clamp-2 leading-relaxed">
                        {mem.story}
                      </p>
                    </div>
                  )}

                  <div className="p-3 bg-[#F8F5EE] dark:bg-[#181715] border-t border-[#C5A880]/20 flex items-center justify-between text-xs text-[#374151] dark:text-[#DCD3C1]">
                    <span className="text-[11px] font-mono font-semibold">
                      {mem.batch}{dateLabel ? ` • ${dateLabel}` : ''}
                    </span>
                    <button
                      onClick={() => likeMemory(mem.id)}
                      className="flex items-center gap-1 text-xs text-rose-700 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 font-bold p-1 cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-rose-500/30 hover:fill-rose-500 transition" />
                      <span>{mem.likes}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl plaque-elevated border border-[#C5A880]/25 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto border border-emerald-300 dark:border-emerald-500/30">
              <ImageIcon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-serif-regal font-bold text-[#0C0A09] dark:text-[#FDFBF7]">
              {lang === 'bn' ? 'এখনো কোনো ক্যাম্পাস স্মৃতি আর্কাইভে যুক্ত করা হয়নি' : 'No Campus Memories Yet'}
            </h3>
            <p className="text-xs sm:text-sm text-[#374151] dark:text-[#DCD3C1] max-w-md mx-auto leading-relaxed font-medium">
              {lang === 'bn'
                ? 'ক্যাম্পাস জীবন, ল্যাব প্রজেক্ট, খেলাধুলা ও সমাবর্তনের শালীন ও স্মরণীয় ছবি অথবা স্মৃতিকথা এখানে সংরক্ষিত হবে। প্রথম স্মৃতিটি যুক্ত করতে নিচের বাটনে ক্লিক করুন।'
                : 'Respectful campus life photos, lab projects, sports moments, and written stories will appear here once submitted.'}
            </p>
            <div className="pt-2">
              <button
                onClick={handleOpenUploadModal}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{lang === 'bn' ? 'প্রথম স্মৃতি যুক্ত করুন' : 'Share First Memory'}</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Lightbox / Story Reader Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedMemory && (
            <motion.div
              key="gallery-lightbox-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain"
              onClick={() => setSelectedMemory(null)}
            >
              <motion.div
                key="gallery-lightbox-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl w-full bg-white dark:bg-[#181715] rounded-3xl overflow-hidden border border-[#C5A880]/35 p-2 sm:p-4 relative overscroll-contain shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/80 text-white hover:bg-black cursor-pointer"
                >
                  <X className="w-5 h-5 keep-white" />
                </button>

                {selectedMemory.image && (
                  <img
                    src={formatDriveImageUrl(selectedMemory.image)}
                    alt={selectedMemory.title}
                    className="w-full max-h-[65vh] object-contain rounded-2xl bg-black mb-3"
                  />
                )}

                <div className="p-3 sm:p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-[#0C0A09] dark:text-white text-lg">
                        {lang === 'bn' ? (selectedMemory.titleBn || selectedMemory.title) : (selectedMemory.title || selectedMemory.titleBn)}
                      </h3>
                      <p className="text-xs text-[#374151] dark:text-[#DCD3C1] font-mono font-medium mt-0.5">
                        {selectedMemory.batch}{(selectedMemory.memoryDate || selectedMemory.year) ? ` • ${selectedMemory.memoryDate || selectedMemory.year}` : ''}
                      </p>
                    </div>

                    <button
                      onClick={() => likeMemory(selectedMemory.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 font-bold text-xs cursor-pointer shrink-0"
                    >
                      <Heart className="w-4 h-4 fill-rose-500" />
                      <span>{selectedMemory.likes} {lang === 'bn' ? 'পছন্দ' : 'Likes'}</span>
                    </button>
                  </div>

                  {selectedMemory.story && (
                    <div className="pt-3 border-t border-[#C5A880]/20 text-sm text-[#1C1917] dark:text-[#EDE8DF] leading-relaxed whitespace-pre-line">
                      {selectedMemory.story}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Upload Memory Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {uploadModalOpen && (
            <motion.div
              key="gallery-upload-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) setUploadModalOpen(false);
              }}
            >
              <motion.div
                key="gallery-upload-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white dark:bg-[#181715] w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6 border border-[#C5A880]/35 relative overscroll-contain shadow-2xl text-[#0C0A09] dark:text-[#FDFBF7]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-[#25221E] text-[#1C1917] dark:text-[#FDFBF7] hover:bg-slate-200 dark:hover:bg-[#332E28] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <h3 className="text-base font-bold text-[#0C0A09] dark:text-white mb-1">
                  {lang === 'bn' ? 'ক্যাম্পাসের স্মৃতি বা গল্প শেয়ার করুন' : 'Share Campus Memory or Story'}
                </h3>
                <p className="text-xs text-[#374151] dark:text-[#DCD3C1] mb-3 font-medium">
                  {lang === 'bn'
                    ? 'ছবি দিয়ে অথবা ছবি ছাড়াই শুধু গল্প/আর্টিকেল আকারে আপনার স্মৃতি সংরক্ষণ করতে পারেন।'
                    : 'Share a photo, a written story/article, or both in the campus memory archive.'}
                </p>
                <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/35 border border-amber-300/70 dark:border-amber-500/30 text-[11px] text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                  {lang === 'bn'
                    ? 'সাবমিশন গাইডলাইন: শুধুমাত্র শালীন, ইতিবাচক ও শিক্ষাপ্রতিষ্ঠান-বান্ধব ক্যাম্পাস স্মৃতি এবং অ্যালামনাই গল্পই অনুমোদন করা হবে।'
                    : 'Submission Guideline: Only respectful, positive campus and alumni memories or stories will be approved for the archive.'}
                </div>

                {uploadSuccess ? (
                  <div className="p-6 text-center bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-500/40 space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <h4 className="font-bold text-emerald-950 dark:text-white text-sm">
                      {lang === 'bn' ? 'স্মৃতি সফলভাবে সংরক্ষিত হয়েছে!' : 'Memory submitted successfully!'}
                    </h4>
                  </div>
                ) : (
                  <form onSubmit={handleUploadSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1C1917] dark:text-[#FDFBF7] mb-1">
                        {lang === 'bn' ? 'শিরোনাম / ক্যাপশন *' : 'Memory Title / Caption *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={lang === 'bn' ? 'যেমন: ফার্স্ট ইয়ারে উইভিং ল্যাবের প্রথম দিন' : 'e.g., First year days at Weaving Lab'}
                        value={newMemory.title}
                        onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value, titleBn: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141311] border border-slate-300 dark:border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#1C1917] dark:text-[#FDFBF7] mb-1">
                          {lang === 'bn' ? 'ব্যাচ' : 'Batch'}
                        </label>
                        <input
                          type="text"
                          placeholder={lang === 'bn' ? 'যেমন: 1st Batch (2018-19)' : 'e.g., 1st Batch (2018-19)'}
                          value={newMemory.batch}
                          onChange={(e) => setNewMemory({ ...newMemory, batch: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141311] border border-slate-300 dark:border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1C1917] dark:text-[#FDFBF7] mb-1">
                          {lang === 'bn' ? 'আনুমানিক সময় / সাল' : 'Approx. Date / Year'}
                        </label>
                        <input
                          type="text"
                          placeholder={lang === 'bn' ? 'যেমন: মার্চ ২০১৯ / ১ম বর্ষ' : 'e.g., March 2019 / 1st Year'}
                          value={newMemory.memoryDate}
                          onChange={(e) => setNewMemory({ ...newMemory, memoryDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141311] border border-slate-300 dark:border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1C1917] dark:text-[#FDFBF7] mb-1">
                        {lang === 'bn' ? 'স্মৃতিকথা / গল্প (ছবি ছাড়াও লিখতে পারেন)' : 'Story / Article (Optional if photo added)'}
                      </label>
                      <textarea
                        rows={3}
                        placeholder={lang === 'bn'
                          ? 'আপনার ক্যাম্পাস জীবনের প্রিয় কোনো ঘটনা বা গল্প লিখুন (ছবি না থাকলে এটি অবশ্যই লিখুন)...'
                          : 'Write your campus memory or story here (you can post without a photo)...'}
                        value={newMemory.story}
                        onChange={(e) => {
                          setUploadError('');
                          setNewMemory({ ...newMemory, story: e.target.value });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141311] border border-slate-300 dark:border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>

                    <div>
                      <CloudinaryImageInput
                        label={lang === 'bn' ? 'ছবি আপলোড করুন (ঐচ্ছিক)' : 'Upload Photo (Optional)'}
                        value={newMemory.image}
                        onChange={(val) => {
                          setUploadError('');
                          setNewMemory({ ...newMemory, image: val });
                        }}
                        lang={lang}
                        fallbackIcon={ImageIcon}
                        apiBaseUrl={apiBaseUrl}
                        folder="rtec-alumni/gallery"
                      />
                      {uploadError && (
                        <p className="text-[11px] text-red-600 dark:text-red-400 mt-1.5 font-medium">
                          {uploadError}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow cursor-pointer"
                    >
                      {lang === 'bn' ? 'স্মৃতি সংরক্ষণ করুন (Submit)' : 'Submit Memory'}
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
