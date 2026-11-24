import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext.jsx';
import { useScrollLock } from '../utils/useScrollLock.js';
import {
  Image as ImageIcon,
  Heart,
  Upload,
  X,
  Sparkles,
  Calendar,
  Users,
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
    batch: user?.batch || '1st Batch',
    year: '2024',
    image: ''
  });

  const categories = [
    'All',
    'Rag Day',
    'Lab Memories',
    'Sports',
    'Campus Life',
    'Cultural',
    'Convocation'
  ];

  const filteredMemories = memories.filter(
    m => selectedCategory === 'All' || m.category === selectedCategory
  );

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    addMemory(newMemory);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setUploadModalOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-transparent text-[#EDE8DF] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-2">
              <ImageIcon className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ক্যাম্পাস মেমোরি আর্কাইভ • ফটো গ্যালারি' : 'Campus Memory Archive • Photo Gallery'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {lang === 'bn' ? 'স্মৃতির সোনালী পাতা (Memory Gallery)' : 'Milestones & Campus Photo Archive'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {lang === 'bn'
                ? 'র‍্যাগ ডে, উইভিং শেডের রাতজাগা প্রজেক্ট, সেন্ট্রাল মাঠের খেলাধুলা ও ক্যাম্পাসের পুরোনো সোনালী দিনগুলোর ছবির আর্কাইভ।'
                : 'Rag Day milestones, late-night weaving shed projects, central sports tournaments, and nostalgic campus memories.'}
            </p>
          </div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/50 transition hover:scale-105"
          >
            <Upload className="w-4 h-4 text-white" />
            <span>{lang === 'bn' ? 'স্মৃতি শেয়ার করুন (ছবি জমা দিন)' : 'Submit Photo / Memory'}</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 font-bold'
                  : 'bg-white dark:bg-slate-900 text-stone-700 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800 border border-[#C5A880]/20'
              }`}
            >
              {cat === 'All' ? (lang === 'bn' ? 'সকল ছবি (All Photos)' : 'All Photos') : cat}
            </button>
          ))}
        </div>

        {/* Photos Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className="glass-card rounded-2xl overflow-hidden group border border-slate-800/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div
                className="relative h-60 w-full overflow-hidden cursor-pointer"
                onClick={() => setLightboxImage(mem)}
              >
                <img
                  src={mem.image}
                  alt={mem.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-slate-900/90 text-emerald-300 text-[10px] font-mono border border-emerald-500/30 font-bold">
                  {mem.category}
                </span>

                <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 text-[10px] font-mono">
                  {mem.batch} ({mem.year})
                </span>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-sm font-bold text-white drop-shadow-md">
                    {lang === 'bn' ? (mem.titleBn || mem.title) : (mem.title || mem.titleBn)}
                  </h3>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] font-mono">{mem.batch}</span>
                <button
                  onClick={() => likeMemory(mem.id)}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-semibold p-1"
                >
                  <Heart className="w-4 h-4 fill-rose-500/30 hover:fill-rose-500 transition" />
                  <span>{mem.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxImage && typeof document !== 'undefined' && createPortal(
        <div
          data-lenis-prevent="true"
          data-modal-open="true"
          className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overscroll-contain"
          onClick={() => setLightboxImage(null)}
        >
          <div
            data-lenis-prevent="true"
            className="max-w-4xl w-full glass-panel rounded-3xl overflow-hidden border border-slate-700 p-2 relative overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-900/80 text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={lightboxImage.image}
              alt={lightboxImage.title}
              className="w-full max-h-[75vh] object-contain rounded-2xl"
            />

            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">
                  {lang === 'bn' ? (lightboxImage.titleBn || lightboxImage.title) : (lightboxImage.title || lightboxImage.titleBn)}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {lightboxImage.batch} • {lightboxImage.year} • {lightboxImage.category}
                </p>
              </div>

              <button
                onClick={() => likeMemory(lightboxImage.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 font-bold text-xs"
              >
                <Heart className="w-4 h-4 fill-rose-500" />
                <span>{lightboxImage.likes} Likes</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Upload Memory Modal */}
      {uploadModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          data-lenis-prevent="true"
          data-modal-open="true"
          className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overscroll-contain"
          onClick={(e) => {
            if (e.target === e.currentTarget) setUploadModalOpen(false);
          }}
        >
          <div
            data-lenis-prevent="true"
            className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-700 relative overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setUploadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1">
              {lang === 'bn' ? 'ক্যাম্পাস জীবনের ছবি যুক্ত করুন' : 'Submit Campus Memory Photo'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {lang === 'bn' ? 'আপনার স্মৃতি আমাদের আর্কাইভের অংশ হবে।' : 'Your photo will be archived in the official memory gallery.'}
            </p>

            {uploadSuccess ? (
              <div className="p-6 text-center bg-emerald-950/40 rounded-2xl border border-emerald-500/40 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">
                  {lang === 'bn' ? 'ছবি সফলভাবে যুক্ত করা হয়েছে!' : 'Photo submitted successfully!'}
                </h4>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'bn' ? 'ছবির ক্যাপশন / শিরোনাম' : 'Photo Caption / Title'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'bn' ? 'যেমন: উইভিং শেডে শেষ রাতের প্রজেক্ট' : 'e.g., Late night project at Weaving Shed'}
                    value={newMemory.title}
                    onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value, titleBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                    </label>
                    <select
                      value={newMemory.category}
                      onChange={(e) => setNewMemory({ ...newMemory, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Rag Day">Rag Day</option>
                      <option value="Lab Memories">Lab Memories</option>
                      <option value="Sports">Sports</option>
                      <option value="Campus Life">Campus Life</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Convocation">Convocation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'ব্যাচ ও সাল' : 'Batch & Year'}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === 'bn' ? 'যেমন: 4th Batch (2022)' : 'e.g., 4th Batch (2022)'}
                      value={newMemory.batch}
                      onChange={(e) => setNewMemory({ ...newMemory, batch: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'bn' ? 'ছবির সরাসরি ওয়েব লিংক (Image URL)' : 'Direct Image URL'}
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newMemory.image}
                    onChange={(e) => setNewMemory({ ...newMemory, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {lang === 'bn' ? '(Imgur, Google Drive বা যেকোনো অনলাইন ছবির লিংক দিন)' : '(Imgur, Google Drive, or any direct image link)'}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow"
                >
                  {lang === 'bn' ? 'স্মৃতি সংরক্ষণ করুন (Submit)' : 'Submit Photo'}
                </button>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
