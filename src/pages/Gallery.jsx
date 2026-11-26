import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { formatDriveImageUrl } from '../utils/driveImage.js';
import { useScrollLock } from '../utils/useScrollLock.js';
import {
  Image as ImageIcon,
  Heart,
  Upload,
  X,
  CheckCircle2
} from 'lucide-react';

export default function Gallery() {
  const { memories, likeMemory, addMemory, user, lang } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Lock background scroll when lightbox or upload modal is open
  useScrollLock(Boolean(lightboxImage || uploadModalOpen));

  // Form State
  const [newMemory, setNewMemory] = useState({
    title: '',
    titleBn: '',
    category: 'Rag Day',
    batch: user?.batch || '1st Batch (2018-19)',
    year: new Date().getFullYear().toString(),
    image: ''
  });

  const categories = [
    { id: 'All', bn: 'সকল ছবি', en: 'All Photos' },
    { id: 'Rag Day', bn: 'র‍্যাগ ডে', en: 'Rag Day' },
    { id: 'Lab Memories', bn: 'ল্যাব স্মৃতি', en: 'Lab Memories' },
    { id: 'Sports', bn: 'খেলাধুলা', en: 'Sports' },
    { id: 'Campus Life', bn: 'ক্যাম্পাস জীবন', en: 'Campus Life' },
    { id: 'Cultural', bn: 'সাংস্কৃতিক অনুষ্ঠান', en: 'Cultural' },
    { id: 'Convocation', bn: 'সমাবর্তন', en: 'Convocation' }
  ];

  const getCategoryLabel = (catId) => {
    const found = categories.find(c => c.id === catId);
    if (!found) return catId;
    return lang === 'bn' ? found.bn : found.en;
  };

  const filteredMemories = useMemo(() => (memories || []).filter(
    m => selectedCategory === 'All' || m.category === selectedCategory
  ), [memories, selectedCategory]);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    addMemory(newMemory);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setUploadModalOpen(false);
      setNewMemory({
        title: '',
        titleBn: '',
        category: 'Rag Day',
        batch: user?.batch || '1st Batch (2018-19)',
        year: new Date().getFullYear().toString(),
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
              <span>{lang === 'bn' ? 'ক্যাম্পাস মেমোরি আর্কাইভ • ফটো গ্যালারি' : 'Campus Memory Archive • Photo Gallery'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0C0A09] dark:text-white tracking-tight">
              {lang === 'bn' ? 'স্মৃতির সোনালী পাতা (Memory Gallery)' : 'Milestones & Campus Photo Archive'}
            </h1>
            <p className="text-xs sm:text-sm text-[#374151] dark:text-[#DCD3C1] mt-1 max-w-xl font-medium">
              {lang === 'bn'
                ? 'র‍্যাগ ডে, উইভিং শেডের রাতজাগা প্রজেক্ট, সেন্ট্রাল মাঠের খেলাধুলা ও ক্যাম্পাসের সোনালী দিনগুলোর ছবির আর্কাইভ।'
                : 'Rag Day milestones, late-night weaving shed projects, central sports tournaments, and campus memories.'}
            </p>
          </div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/30 transition hover:scale-105 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-white" />
            <span>{lang === 'bn' ? 'স্মৃতি শেয়ার করুন (ছবি জমা দিন)' : 'Submit Photo / Memory'}</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto py-2 px-1 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 font-bold scale-110'
                  : 'bg-white dark:bg-[#1E1C18] text-[#1C1917] dark:text-[#DCD3C1] hover:bg-[#F3EFE7] dark:hover:bg-[#25221E] border border-[#C5A880]/30'
              }`}
            >
              {lang === 'bn' ? cat.bn : cat.en}
            </button>
          ))}
        </div>

        {/* Photos Grid OR Clean Empty State */}
        {filteredMemories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((mem) => (
              <div
                key={mem.id}
                className="plaque-elevated rounded-2xl overflow-hidden group border border-[#C5A880]/30 hover:border-emerald-500/50 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div
                  className="relative h-60 w-full overflow-hidden cursor-pointer on-dark-media"
                  onClick={() => setLightboxImage(mem)}
                >
                  <img
                    src={formatDriveImageUrl(mem.image)}
                    alt={mem.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-85 group-hover:opacity-70 transition-opacity" />

                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/90 text-emerald-300 keep-emerald-light text-[10px] font-mono border border-emerald-500/40 font-bold">
                    {getCategoryLabel(mem.category)}
                  </span>

                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-950/90 text-white keep-white text-[10px] font-mono border border-white/20">
                    {mem.batch} ({mem.year})
                  </span>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-sm font-bold text-white keep-white drop-shadow-md">
                      {lang === 'bn' ? (mem.titleBn || mem.title) : (mem.title || mem.titleBn)}
                    </h3>
                  </div>
                </div>

                <div className="p-3 bg-[#F8F5EE] dark:bg-[#181715] border-t border-[#C5A880]/20 flex items-center justify-between text-xs text-[#374151] dark:text-[#DCD3C1]">
                  <span className="text-[11px] font-mono font-semibold">{mem.batch}</span>
                  <button
                    onClick={() => likeMemory(mem.id)}
                    className="flex items-center gap-1 text-xs text-rose-700 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 font-bold p-1 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-rose-500/30 hover:fill-rose-500 transition" />
                    <span>{mem.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl plaque-elevated border border-[#C5A880]/25 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto border border-emerald-300 dark:border-emerald-500/30">
              <ImageIcon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-serif-regal font-bold text-[#0C0A09] dark:text-[#FDFBF7]">
              {lang === 'bn' ? 'এখনো কোনো ক্যাম্পাস ছবি আর্কাইভে যুক্ত করা হয়নি' : 'No Campus Archive Photos Yet'}
            </h3>
            <p className="text-xs sm:text-sm text-[#374151] dark:text-[#DCD3C1] max-w-md mx-auto leading-relaxed font-medium">
              {lang === 'bn'
                ? 'ক্যাম্পাস জীবন, র‍্যাগ ডে, ল্যাব বা খেলার মাঠের আসল ছবিগুলো এখানে সংরক্ষিত হবে। প্রথম ছবিটি যুক্ত করতে নিচের বাটনে ক্লিক করুন।'
                : 'Real campus moments, Rag Day celebrations, lab projects, and sports memories will appear here once submitted.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setUploadModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{lang === 'bn' ? 'প্রথম ছবি যুক্ত করুন' : 'Submit First Photo'}</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              key="gallery-lightbox-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain"
              onClick={() => setLightboxImage(null)}
            >
              <motion.div
                key="gallery-lightbox-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-4xl w-full bg-white dark:bg-[#181715] rounded-3xl overflow-hidden border border-[#C5A880]/35 p-2 relative overscroll-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/80 text-white hover:bg-black cursor-pointer"
            >
              <X className="w-5 h-5 keep-white" />
            </button>

            <img
              src={formatDriveImageUrl(lightboxImage.image)}
              alt={lightboxImage.title}
              className="w-full max-h-[75vh] object-contain rounded-2xl bg-black"
            />

            <div className="p-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[#0C0A09] dark:text-white text-base">
                  {lang === 'bn' ? (lightboxImage.titleBn || lightboxImage.title) : (lightboxImage.title || lightboxImage.titleBn)}
                </h3>
                <p className="text-xs text-[#374151] dark:text-[#DCD3C1] font-mono font-medium">
                  {lightboxImage.batch} • {lightboxImage.year} • {getCategoryLabel(lightboxImage.category)}
                </p>
              </div>

              <button
                onClick={() => likeMemory(lightboxImage.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 font-bold text-xs cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-rose-500" />
                <span>{lightboxImage.likes} {lang === 'bn' ? 'পছন্দ' : 'Likes'}</span>
              </button>
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
                className="bg-white dark:bg-[#181715] w-full max-w-md rounded-3xl p-6 border border-[#C5A880]/35 relative overscroll-contain shadow-2xl text-[#0C0A09] dark:text-[#FDFBF7]"
                onClick={(e) => e.stopPropagation()}
              >
            <button
              onClick={() => setUploadModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-[#25221E] text-[#1C1917] dark:text-[#FDFBF7] hover:bg-slate-200 dark:hover:bg-[#332E28] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-[#0C0A09] dark:text-white mb-1">
              {lang === 'bn' ? 'ক্যাম্পাস জীবনের ছবি যুক্ত করুন' : 'Submit Campus Memory Photo'}
            </h3>
            <p className="text-xs text-[#374151] dark:text-[#DCD3C1] mb-4 font-medium">
              {lang === 'bn' ? 'আপনার স্মৃতি আমাদের আর্কাইভের অংশ হবে।' : 'Your photo will be archived in the official memory gallery.'}
            </p>

            {uploadSuccess ? (
              <div className="p-6 text-center bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-500/40 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-bold text-emerald-950 dark:text-white text-sm">
                  {lang === 'bn' ? 'ছবি সফলভাবে যুক্ত করা হয়েছে!' : 'Photo submitted successfully!'}
                </h4>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] dark:text-[#FDFBF7] mb-1">
                    {lang === 'bn' ? 'ছবির ক্যাপশন / শিরোনাম' : 'Photo Caption / Title'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'bn' ? 'যেমন: উইভিং শেডে শেষ রাতের প্রজেক্ট' : 'e.g., Late night project at Weaving Shed'}
                    value={newMemory.title}
                    onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value, titleBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141311] border border-slate-300 dark:border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] dark:text-[#FDFBF7] mb-1">
                      {lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                    </label>
                    <select
                      value={newMemory.category}
                      onChange={(e) => setNewMemory({ ...newMemory, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141311] border border-slate-300 dark:border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-white focus:outline-none focus:border-emerald-500"
                    >
                      {categories.filter(c => c.id !== 'All').map(c => (
                        <option key={c.id} value={c.id}>{lang === 'bn' ? c.bn : c.en}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] dark:text-[#FDFBF7] mb-1">
                      {lang === 'bn' ? 'ব্যাচ ও সাল' : 'Batch & Year'}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === 'bn' ? 'যেমন: 4th Batch (2022)' : 'e.g., 4th Batch (2022)'}
                      value={newMemory.batch}
                      onChange={(e) => setNewMemory({ ...newMemory, batch: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141311] border border-slate-300 dark:border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1917] dark:text-[#FDFBF7] mb-1">
                    {lang === 'bn' ? 'ছবির সরাসরি ওয়েব বা Google Drive লিংক' : 'Direct Image or Google Drive URL'}
                  </label>
                  <input
                    type="url"
                    required
                    placeholder={lang === 'bn' ? 'https://drive.google.com/file/d/... বা সরাসরি লিংক' : 'https://drive.google.com/file/d/... or direct link'}
                    value={newMemory.image}
                    onChange={(e) => setNewMemory({ ...newMemory, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141311] border border-slate-300 dark:border-[#C5A880]/30 text-xs text-[#0C0A09] dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-[#44403C] dark:text-[#DCD3C1] mt-0.5 block">
                    {lang === 'bn' ? '(Google Drive শেয়ার লিংক বা যেকোনো সরাসরি ছবির লিংক দিন)' : '(Google Drive share link or any direct image URL)'}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow cursor-pointer"
                >
                  {lang === 'bn' ? 'স্মৃতি সংরক্ষণ করুন (Submit)' : 'Submit Photo'}
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
