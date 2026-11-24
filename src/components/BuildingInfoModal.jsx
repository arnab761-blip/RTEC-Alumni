import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'facts' | 'stats'

  if (!landmark) return null;

  return (
    <div className="w-full max-w-md sm:max-w-lg glass-panel rounded-3xl p-4 sm:p-5 shadow-2xl border border-emerald-500/30 text-slate-100 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6">
      {/* Top Header Badge & Close */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            স্টপ {landmark.step} / ১৫
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
            {landmark.categoryBn}
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
            title={isSpeaking ? 'Stop Audio Tour' : 'Play Bengali Audio Tour'}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              title="Close card"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Image with Gradient Overlay */}
      <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden mb-3.5 border border-slate-700/50 group">
        <img
          src={landmark.image}
          alt={landmark.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide leading-tight drop-shadow-md">
              {landmark.name}
            </h2>
            <p className="text-xs text-emerald-400 font-mono tracking-wider font-semibold">
              {landmark.nameEn}
            </p>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 text-[10px] font-mono border border-slate-700">
            {landmark.code}
          </span>
        </div>
      </div>

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
          বিবরণ (Overview)
        </button>
        <button
          onClick={() => setActiveTab('facts')}
          className={`pb-1.5 px-3 text-xs font-semibold transition border-b-2 ${
            activeTab === 'facts'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          বৈশিষ্ট্য (Features)
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-1.5 px-3 text-xs font-semibold transition border-b-2 ${
            activeTab === 'stats'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          পরিসংখ্যান (Specs)
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[75px] max-h-36 overflow-y-auto pr-1 text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
        {activeTab === 'overview' && (
          <div>
            <p className="text-slate-200 mb-2">{landmark.descriptionBn}</p>
            <p className="text-slate-400 text-[11px] italic font-sans">{landmark.descriptionEn}</p>
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
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold transition text-slate-200"
        >
          <ChevronLeft className="w-4 h-4" />
          পূর্ববর্তী
        </button>

        <span className="text-xs text-slate-400 font-mono">
          {landmark.step} / 15
        </span>

        <button
          onClick={onNext}
          disabled={isLast}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-xs font-semibold transition text-white shadow-lg shadow-emerald-900/30"
        >
          পরবর্তী
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
