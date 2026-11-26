import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext.jsx';
import { useScrollLock } from '../utils/useScrollLock.js';
import {
  Newspaper,
  Calendar,
  Sparkles,
  ArrowRight,
  X,
  Share2,
  Bookmark,
  FileText,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function News() {
  const { news, lang } = useApp();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  // Lock background scroll when article modal is open
  useScrollLock(Boolean(selectedArticle));

  const categories = [
    { id: 'All', labelBn: 'সকল নোটিশ ও খবর', labelEn: 'All Notices & News' },
    { id: 'Academic Notice', labelBn: 'একাডেমিক নোটিশ', labelEn: 'Academic Notice' },
    { id: 'Examination', labelBn: 'পরীক্ষা সংক্রান্ত', labelEn: 'Examination' },
    { id: 'Admission', labelBn: 'ভর্তি সংক্রান্ত', labelEn: 'Admission' },
    { id: 'General Notice', labelBn: 'সাধারণ নোটিশ', labelEn: 'General Notice' },
    { id: 'Holiday', labelBn: 'ছুটির নোটিশ', labelEn: 'Holiday' },
    { id: 'Career & Placement', labelBn: 'ক্যারিয়ার ও প্লেসমেন্ট', labelEn: 'Career & Placement' },
    { id: 'Urgent Notice', labelBn: 'জরুরি নোটিশ', labelEn: 'Urgent Notice' },
    { id: 'Notice', labelBn: 'প্রশাসনিক নোটিশ', labelEn: 'Official Notice' },
    { id: 'Achievement', labelBn: 'সাফল্য ও অর্জন', labelEn: 'Achievement' },
    { id: 'Spotlight', labelBn: 'স্পটলাইট', labelEn: 'Spotlight' },
    { id: 'Campus', labelBn: 'ক্যাম্পাস জীবন', labelEn: 'Campus News' }
  ];

  const getCategoryLabel = (catId) => {
    const found = categories.find(c => c.id === catId);
    if (found) return lang === 'bn' ? found.labelBn : found.labelEn;
    return catId || (lang === 'bn' ? 'সাধারণ নোটিশ' : 'General Notice');
  };

  const filteredNews = useMemo(() => news.filter(n => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Notice') return n.category === 'Notice' || String(n.category || '').includes('Notice');
    return n.category === activeCategory;
  }), [news, activeCategory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-transparent text-[#EDE8DF] py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-2">
            <Newspaper className="w-4 h-4" />
            <span>
              {lang === 'bn' ? 'কলেজ নোটিশ ও সাফল্য • অফিসিয়াল গ্যাজেট' : 'COLLEGE GAZETTES & NOTICES • OFFICIAL UPDATES'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif-regal font-black text-[#FDFBF7] tracking-tight">
            {lang === 'bn' ? 'খবর ও সাম্প্রতিক বিজ্ঞপ্তি' : 'News & Official Announcements'}
          </h1>
          <p className="text-xs sm:text-sm text-[#A89884] mt-1 max-w-2xl font-sans leading-relaxed">
            {lang === 'bn'
              ? 'আরটেকের প্রাতিষ্ঠানিক নোটিশ, সমাবর্তন, গবেষণা আবিষ্কার ও অ্যালামনাইদের পেশাগত অর্জনের খবর।'
              : 'Official administrative circulars, convocation updates, cutting-edge textile research, and alumni achievements.'}
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto py-2 px-1 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/40 scale-110'
                  : 'bg-white dark:bg-slate-900 text-stone-700 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800 border border-[#C5A880]/20'
              }`}
            >
              {lang === 'bn' ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {filteredNews && filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className="plaque-elevated rounded-2xl overflow-hidden flex flex-col justify-between border border-[#C5A880]/25 group shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div>
                  {item.image ? (
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900 on-dark-media">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-emerald-600 text-white keep-white text-xs font-bold shadow">
                        {getCategoryLabel(item.category)}
                      </span>
                      <span className="absolute bottom-3 left-3 text-xs text-white keep-white font-mono font-semibold drop-shadow">
                        {item.date}
                      </span>
                    </div>
                  ) : (
                    <div className="px-5 pt-5 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white keep-white text-xs font-bold shadow">
                        {getCategoryLabel(item.category)}
                      </span>
                      <span className="text-xs text-[#374151] dark:text-[#DCD3C1] font-mono font-semibold">
                        {item.date}
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="font-bold text-[#FDFBF7] text-base group-hover:text-[#BD452F] dark:group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {lang === 'bn' ? (item.titleBn || item.title) : (item.title || item.titleBn)}
                    </h3>
                    <p className="text-xs text-[#292524] dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed font-sans">
                      {lang === 'bn'
                        ? (item.summaryBn || item.summary || item.contentBn || item.content)
                        : (item.summary || item.summaryBn || item.content || item.contentBn)}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => setSelectedArticle(item)}
                    className="w-full py-2.5 rounded-xl bg-[#F4EFE6] dark:bg-slate-900 hover:bg-[#EAE0D2] dark:hover:bg-slate-800 text-[#0C0A09] dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-[#C5A880]/30 transition cursor-pointer"
                  >
                    <span>{lang === 'bn' ? 'সম্পূর্ণ প্রতিবেদন পড়ুন' : 'Read Full Article'}</span>
                    <ArrowRight className="w-4 h-4 text-[#BD452F] dark:text-emerald-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-[#FAF9F6] dark:bg-[#141311] border border-[#C5A880]/20 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-[#DFCA9E] flex items-center justify-center mx-auto border border-amber-500/25">
              <Newspaper className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-serif-regal font-bold text-[#0C0A09] dark:text-[#FDFBF7]">
              {lang === 'bn' ? 'বর্তমানে কোনো নোটিশ বা খবর প্রকাশিত নেই' : 'No Official Notices Published'}
            </h3>
            <p className="text-xs text-[#57534E] dark:text-[#A89884] max-w-md mx-auto leading-relaxed">
              {lang === 'bn'
                ? 'কলেজের প্রশাসনিক নোটিশ, একাডেমিক সার্কুলার ও সমাবর্তন সংক্রান্ত ঘোষণা প্রকাশিত হলে তা এখানে নোটিশ বোর্ডে সংযুক্ত করা হবে।'
                : 'Administrative circulars, academic notices, and official announcements from the college administration will appear here.'}
            </p>
          </div>
        )}

      </div>

      {/* Article Reader Modal (Smooth 60fps spring reveal) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedArticle && (
            <motion.div
              key="news-reader-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedArticle(null);
              }}
            >
              <motion.div
                key="news-reader-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-[#C5A880]/30 relative shadow-2xl max-h-[90vh] overflow-y-auto overscroll-contain"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-stone-200 dark:bg-slate-900 text-stone-800 dark:text-slate-400 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white keep-white text-xs font-bold shadow">
                    {getCategoryLabel(selectedArticle.category)}
                  </span>
                  <span className="text-xs text-[#A89884] font-mono font-semibold">
                    {selectedArticle.date}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-serif-regal font-black text-[#FDFBF7] mb-4 leading-snug">
                  {lang === 'bn'
                    ? (selectedArticle.titleBn || selectedArticle.title)
                    : (selectedArticle.title || selectedArticle.titleBn)}
                </h2>

                {selectedArticle.image && (
                  <div className="rounded-2xl overflow-hidden mb-5 max-h-72 w-full border border-[#C5A880]/20">
                    <img
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="text-xs sm:text-sm text-[#292524] dark:text-slate-300 space-y-4 leading-relaxed font-sans">
                  <p className="font-bold text-[#0C0A09] dark:text-slate-100 text-sm sm:text-base leading-relaxed">
                    {lang === 'bn'
                      ? (selectedArticle.summaryBn || selectedArticle.summary)
                      : (selectedArticle.summary || selectedArticle.summaryBn)}
                  </p>
                  <p className="leading-relaxed">
                    {lang === 'bn'
                      ? (selectedArticle.contentBn || selectedArticle.content || selectedArticle.description)
                      : (selectedArticle.content || selectedArticle.contentBn || selectedArticle.description)}
                  </p>
                </div>

                {/* Attached PDF Document Button */}
                {selectedArticle.pdfUrl && (
                  <div className="mt-5 p-4 rounded-2xl bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-red-600 text-white shadow">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="font-bold text-red-950 dark:text-white text-xs sm:text-sm">
                          {lang === 'bn' ? 'অফিসিয়াল নোটিশ PDF ফাইল' : 'Official Notice PDF Document'}
                        </h5>
                        <p className="text-[11px] text-red-800 dark:text-red-200">
                          {lang === 'bn' ? 'মূল সার্কুলার বা স্বাক্ষরিত নোটিশের কপি ডাউনলোড করুন' : 'Download or view verified administrative gazette copy'}
                        </p>
                      </div>
                    </div>

                    <a
                      href={selectedArticle.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5 text-white" />
                      <span>{lang === 'bn' ? 'PDF ডাউনলোড / ভিউ' : 'Download / View PDF'}</span>
                      <ExternalLink className="w-3 h-3 text-white" />
                    </a>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-[#C5A880]/20 flex items-center justify-between text-xs text-[#A89884]">
                  <span className="font-semibold">
                    {lang === 'bn' ? 'প্রকাশনায়: আরটেক জনসংযোগ ও তথ্য শাখা' : 'Published by: RTEC Public Relations & Information Wing'}
                  </span>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-slate-900 text-stone-900 dark:text-white font-bold hover:bg-stone-300 dark:hover:bg-slate-800 cursor-pointer shadow-sm"
                  >
                    {lang === 'bn' ? 'বন্ধ করুন' : 'Close Article'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </motion.div>
  );
}
