import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import {
  Volume2,
  VolumeX,
  X,
  ChevronRight,
  ChevronLeft,
  Info,
  Sparkles,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Maximize2
} from 'lucide-react';

export default function BuildingInfoModal({
  landmark,
  onClose,
  onNext,
  onPrev,
  isFirst,
  isLast,
  onSpeak,
  isSpeaking,
}) {
  const { lang = 'en' } = useApp();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'facts' | 'stats'

  if (!landmark) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md sm:max-w-lg glass-panel rounded-3xl p-4 sm:p-5 shadow-2xl border border-emerald-500/30 text-slate-100"
    >
      {/* Top Header Badge & Close */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            {lang === 'bn' ? `স্টপ ${landmark.step} / ১৫` : `Stop ${landmark.step} / 15`}
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
            {lang === 'bn' ? landmark.categoryBn : (landmark.categoryEn || landmark.category || landmark.categoryBn)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Audio speech button */}
          <button
            onClick={() => onSpeak(landmark)}
            className={`p-2 rounded-xl transition-all ${
              isSpeaking
                ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title={isSpeaking
              ? (lang === 'bn' ? 'অডিও বন্ধ করুন' : 'Stop Audio Tour')
              : (lang === 'bn' ? 'অডিও ট্যুর শুনুন' : 'Play Campus Audio Tour')}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              title={lang === 'bn' ? 'কার্ড বন্ধ করুন' : 'Close card'}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Image with Gradient Overlay (Only if real photo exists, else architectural header) */}
      {landmark.image ? (
        <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden mb-3.5 border border-slate-700/50 group on-dark-media">
          <img
            src={landmark.image}
            alt={landmark.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white keep-white tracking-wide leading-tight drop-shadow-md">
                {landmark.name}
              </h2>
              <p className="text-xs text-emerald-300 keep-emerald-light font-mono tracking-wider font-semibold">
                {landmark.nameEn}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-900/90 text-slate-200 keep-white text-[10px] font-mono border border-slate-700">
              {landmark.code}
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full rounded-2xl mb-3.5 p-4 bg-slate-900/95 border border-slate-700/70 flex items-end justify-between on-dark-media">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white keep-white tracking-wide leading-tight">
              {landmark.name}
            </h2>
            <p className="text-xs text-emerald-300 keep-emerald-light font-mono tracking-wider font-semibold mt-0.5">
              {landmark.nameEn}
            </p>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 keep-white text-[10px] font-mono border border-slate-600">
            {landmark.code}
          </span>
        </div>
      )}

      {/* Sub tabs */}
      <div className="flex border-b border-slate-800 mb-3 gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-1.5 px-3 text-xs font-semibold transition border-b-2 ${
            activeTab === 'overview'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          {lang === 'bn' ? 'বিবরণ' : 'Overview'}
        </button>
        <button
          onClick={() => setActiveTab('facts')}
          className={`pb-1.5 px-3 text-xs font-semibold transition border-b-2 ${
            activeTab === 'facts'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          {lang === 'bn' ? 'বৈশিষ্ট্য' : 'Features'}
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-1.5 px-3 text-xs font-semibold transition border-b-2 ${
            activeTab === 'stats'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          {lang === 'bn' ? 'পরিসংখ্যান' : 'Specs'}
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[75px] max-h-36 overflow-y-auto pr-1 text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
          >
            {activeTab === 'overview' && (
              <div>
                <p className="text-slate-200 mb-2">
                  {lang === 'bn' ? (landmark.descriptionBn || landmark.descriptionEn) : (landmark.descriptionEn || landmark.descriptionBn)}
                </p>
              </div>
            )}

            {activeTab === 'facts' && (
              <ul className="space-y-1.5">
                {landmark.facts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'stats' && (
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(landmark.stats).map(([key, val]) => (
                  <div key={key} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                    <span className="block text-[10px] text-slate-400 capitalize">{key}</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-300">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 text-slate-200 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          {lang === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
        </button>

        <span className="text-xs text-slate-400 font-mono">
          {landmark.step} / 15
        </span>

        <button
          onClick={onNext}
          disabled={isLast}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 text-white shadow-lg shadow-emerald-900/30 cursor-pointer"
        >
          {lang === 'bn' ? 'পরবর্তী' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
