import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CampusScene from '../three/CampusScene.jsx';
import { CAMPUS_LANDMARKS } from '../three/CampusData.js';
import MiniMap from '../components/MiniMap.jsx';
import BuildingInfoModal from '../components/BuildingInfoModal.jsx';
import { campusSound } from '../components/AudioGuide.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useScrollLock } from '../utils/useScrollLock.js';
import {
  Compass,
  Sun,
  Moon,
  Sunset,
  Volume2,
  VolumeX,
  Play,
  Pause,
  MapPin,
  ChevronRight,
  ChevronLeft,
  DoorOpen,
  HelpCircle,
  Sparkles,
  Info,
  Move,
  RotateCw,
  X
} from 'lucide-react';

export default function CampusTour() {
  const { lang = 'en' } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState('day'); // 'day' | 'sunset' | 'night'
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [autoTour, setAutoTour] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Drag Mode: 'move' = Google Earth ground drag | 'rotate' = 360° free look
  const [dragMode, setDragMode] = useState('move');

  // Gate Banner Dismissed: ONLY shown ONCE per session! Once entered, never shown again!
  const [gateBannerDismissed, setGateBannerDismissed] = useState(() => {
    return sessionStorage.getItem('rtec_gate_entered') === 'true';
  });

  // Selected building for the modal: defaults to null so NO ANNOYING AUTO-POPUPS!
  const [activeModalLandmark, setActiveModalLandmark] = useState(null);

  // Lock background scroll when building info modal is open
  useScrollLock(Boolean(activeModalLandmark));

  const currentLandmark = CAMPUS_LANDMARKS[currentStep] || CAMPUS_LANDMARKS[0];

  const handleEnterCampus = () => {
    setGateBannerDismissed(true);
    sessionStorage.setItem('rtec_gate_entered', 'true');
    setCurrentStep(1); // Flies through gate to academic avenue
  };

  const handleDismissBanner = () => {
    setGateBannerDismissed(true);
    sessionStorage.setItem('rtec_gate_entered', 'true');
  };

  // Ambient sound toggle
  const toggleSound = () => {
    if (soundEnabled) {
      campusSound.stopAmbient();
      setSoundEnabled(false);
    } else {
      campusSound.startAmbient();
      setSoundEnabled(true);
    }
  };

  // Text-to-Speech narration
  const handleSpeak = (landmark) => {
    if (isSpeaking) {
      campusSound.stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToRead = `${landmark.name}। ${landmark.descriptionBn}`;
      campusSound.speak(textToRead, 'bn-BD', () => {
        setIsSpeaking(false);
      });
    }
  };

  // Auto Tour Interval (advances target landmark every 7 seconds)
  useEffect(() => {
    if (!autoTour) return;
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % CAMPUS_LANDMARKS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [autoTour]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] overflow-hidden bg-slate-950 select-none on-dark-media"
    >
      
      {/* 3D WebGL Canvas Scene with Google Earth Style 360-Degree Controls */}
      <CampusScene
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onOpenBuildingDetails={(landmark) => setActiveModalLandmark(landmark)}
        timeOfDay={timeOfDay}
        soundEnabled={soundEnabled}
        dragMode={dragMode}
        onToggleDragMode={() => setDragMode(prev => prev === 'move' ? 'rotate' : 'move')}
        lang={lang}
      />

      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 sm:left-6 sm:right-6 flex items-center justify-between pointer-events-none z-30">
        
        {/* Left: Current Active Landmark Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="glass-panel px-3 py-1.5 rounded-2xl flex items-center gap-2.5 border border-emerald-500/30 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div className="text-left">
              <span className="block text-[10px] text-emerald-400 font-mono leading-none">
                {lang === 'bn' ? `স্টপ ${currentLandmark.step}/১৫` : `Stop ${currentLandmark.step}/15`}
              </span>
              <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[130px] sm:max-w-[200px]">
                {lang === 'bn' ? currentLandmark.name : (currentLandmark.nameEn || currentLandmark.name)}
              </span>
            </div>

            {/* Click to open details */}
            <button
              onClick={() => setActiveModalLandmark(currentLandmark)}
              className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] shadow transition ml-1"
              title={lang === 'bn' ? 'এই ভবনের বিস্তারিত তথ্য দেখুন' : 'View building details'}
            >
              {lang === 'bn' ? 'ℹ️ বিস্তারিত' : 'ℹ️ Details'}
            </button>
          </div>

          {/* Drag Mode Switcher Button: Google Earth Ground Drag vs 360° Rotate */}
          <button
            onClick={() => setDragMode(prev => prev === 'move' ? 'rotate' : 'move')}
            className={`px-3 py-1.5 rounded-2xl glass-panel border flex items-center gap-1.5 text-xs font-bold transition shadow-lg ${
              dragMode === 'move'
                ? 'border-emerald-500 text-emerald-300 bg-emerald-950/40 ring-1 ring-emerald-500/40'
                : 'border-cyan-500 text-cyan-300 bg-cyan-950/40 ring-1 ring-cyan-500/40'
            }`}
            title={lang === 'bn' ? 'ড্র্যাগ মোড পরিবর্তন করুন' : 'Switch drag mode'}
          >
            {dragMode === 'move' ? (
              <>
                <Move className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'রোড ড্র্যাগ মোড (Google Earth)' : 'Road Drag Mode (Google Earth)'}</span>
                <span className="sm:hidden">{lang === 'bn' ? 'রোড মুভ' : 'Road Move'}</span>
              </>
            ) : (
              <>
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">{lang === 'bn' ? '৩৬০° ফ্রি লুক মোড' : '360° Free Look Mode'}</span>
                <span className="sm:hidden">{lang === 'bn' ? '৩৬০° লুক' : '360° Look'}</span>
              </>
            )}
          </button>
        </div>

        {/* Center: Control Guidance Pill (Desktop only) */}
        <div className="hidden xl:flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-slate-700/60 text-[11px] text-slate-300 pointer-events-auto shadow-md">
          <span className="text-emerald-400 font-semibold">{lang === 'bn' ? '🖱️ কন্ট্রোল:' : '🖱️ Controls:'}</span>
          <span>
            {dragMode === 'move'
              ? (lang === 'bn' ? 'লেফট ক্লিক ড্র্যাগ: রাস্তা দিয়ে ঘুরুন' : 'Left-drag: Navigate campus roads')
              : (lang === 'bn' ? 'লেফট ক্লিক ড্র্যাগ: ৩৬০° ঘুরুন' : 'Left-drag: Rotate 360° view')}
          </span>
          <span className="text-slate-500">•</span>
          <span>{lang === 'bn' ? 'স্ক্রল: সামনে/পেছনে এগোন' : 'Scroll: Move forward/back'}</span>
          <span className="text-slate-500">•</span>
          <span>{lang === 'bn' ? 'রাস্তায় ক্লিক: সরাসরি হেঁটে যান' : 'Click road: Walk directly'}</span>
        </div>

        {/* Right: Environment & Audio Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          
          {/* Day / Sunset / Night Toggle */}
          <div className="glass-panel p-1 rounded-2xl flex items-center gap-1 border border-slate-700/60">
            <button
              onClick={() => setTimeOfDay('day')}
              className={`p-1.5 rounded-xl transition ${
                timeOfDay === 'day' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Sunny Day"
            >
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setTimeOfDay('sunset')}
              className={`p-1.5 rounded-xl transition ${
                timeOfDay === 'sunset' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Golden Sunset"
            >
              <Sunset className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setTimeOfDay('night')}
              className={`p-1.5 rounded-xl transition ${
                timeOfDay === 'night' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Night Campus"
            >
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Ambient Birdsong / Wind Sound */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-2xl glass-panel border transition ${
              soundEnabled
                ? 'border-emerald-500 text-emerald-300 bg-emerald-950/40 shadow-lg shadow-emerald-900/30'
                : 'border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={soundEnabled ? 'Mute Campus Sounds' : 'Play Campus Ambient Sounds (Birds & Wind)'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Auto Tour Play / Pause */}
          <button
            onClick={() => setAutoTour(!autoTour)}
            className={`p-2 rounded-2xl glass-panel border transition ${
              autoTour
                ? 'border-amber-500 text-amber-300 bg-amber-950/40'
                : 'border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={autoTour ? 'Pause Auto Tour' : 'Start Auto Tour (Auto Advance)'}
          >
            {autoTour ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Help Instructions */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 rounded-2xl glass-panel border border-slate-800 text-slate-400 hover:text-white transition"
            title="Navigation Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Gate Welcome Overlay */}
      <AnimatePresence>
        {!gateBannerDismissed && currentStep === 0 && (
          <motion.div
            key="gate-welcome-overlay"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto z-20 w-11/12 max-w-xl"
          >
          <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-emerald-500/40 shadow-2xl backdrop-blur-2xl relative">
            <button
              onClick={handleDismissBanner}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white transition"
              title={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {lang === 'bn' ? 'স্বাগতম' : 'WELCOME'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug drop-shadow-lg mb-2">
              {lang === 'bn' ? 'রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজে স্বাগতম' : 'Welcome to Rangpur Textile Engineering College'}
            </h2>
            <p className="text-sm sm:text-base text-emerald-300 font-semibold mb-3">
              {lang === 'bn' ? 'পীরগঞ্জ, রংপুর, বাংলাদেশ' : 'Pirganj, Rangpur, Bangladesh'}
            </p>
            <p className="text-xs text-slate-300 max-w-md mx-auto mb-5 leading-relaxed">
              {lang === 'bn'
                ? 'Google Earth-এর মতো মাউসের লেফট বাটন চেপে ধরে রাস্তা ও ক্যাম্পাসের চারপাশ ড্র্যাগ করুন, রাস্তায় ক্লিক করে সরাসরি হেঁটে যান অথবা নিচের বাটনে চাপ দিন।'
                : 'Left-click & drag along campus roads like Google Earth, click anywhere on a path to walk there directly, or enter through the main gate below.'}
            </p>

            <button
              onClick={handleEnterCampus}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-950/60 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
              <DoorOpen className="w-5 h-5 text-slate-950" />
              <span>{lang === 'bn' ? 'ফটক খুলে ভেতরে প্রবেশ করুন' : 'Enter Campus Gate'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal Popup */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            key="campus-help-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowHelp(false);
            }}
          >
            <motion.div
              key="campus-help-card"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel p-6 rounded-3xl max-w-md w-full border border-slate-700 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              {lang === 'bn' ? 'ক্যাম্পাস ৩ডি ট্যুর কন্ট্রোল গাইড' : '3D Campus Tour Control Guide'}
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <strong className="text-emerald-300">{lang === 'bn' ? '১. রাস্তা দিয়ে চলা ও ড্র্যাগ:' : '1. Drag Along Roads:'}</strong>{' '}
                {lang === 'bn'
                  ? 'Google Earth-এর মতো মাউসের লেফট ক্লিক চেপে ধরে যেকোনো রাস্তা বরাবর ড্র্যাগ করলেই পুরো ক্যাম্পাসের যেকোনো প্রান্তে চলে যাওয়া যাবে।'
                  : 'Hold left-click and drag across the campus like Google Earth to move smoothly along campus paths.'}
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <strong className="text-emerald-300">{lang === 'bn' ? '২. রাস্তায় ক্লিক করে হেঁটে যান:' : '2. Click Road to Walk:'}</strong>{' '}
                {lang === 'bn'
                  ? 'ক্যাম্পাসের যেকোনো রাস্তা বা চত্বরের ওপর এক ক্লিকেই ক্যামেরা মসৃণভাবে হেঁটে সেখানে পৌঁছে যাবে।'
                  : 'Click directly on any campus path or courtyard to walk the camera smoothly to that spot.'}
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <strong className="text-emerald-300">{lang === 'bn' ? '৩. ৩৬০ ডিগ্রি ভিউ:' : '3. 360° Free Look:'}</strong>{' '}
                {lang === 'bn'
                  ? 'মাউসের রাইট ক্লিক চেপে ড্র্যাগ করলে (অথবা ওপরে "৩৬০° লুক" মোড দিলে) দাঁড়িয়ে থেকে চারপাশ ৩৬০ ডিগ্রিতে দেখা যাবে।'
                  : 'Right-click drag (or switch to "360° Look" mode above) to rotate your view 360 degrees from any point.'}
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <strong className="text-emerald-300">{lang === 'bn' ? '৪. ভবনের তথ্য দেখা:' : '4. Inspect Landmarks:'}</strong>{' '}
                {lang === 'bn'
                  ? 'ভবনের মাথার ওপর থাকা "ℹ️ বিস্তারিত" বাটনে চাপ দিলে বা উপরে থাকা বাটনে চাপ দিলে তথ্য ভেসে উঠবে।'
                  : 'Click the floating "ℹ️ Details" pill above any building or in the top bar to open its full dossier.'}
              </div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
            >
              {lang === 'bn' ? 'বুঝেছি' : 'Got It'}
            </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Building Details Modal: ONLY opens when user explicitly clicks "ℹ️ বিস্তারিত" button */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activeModalLandmark && (
            <motion.div
              key="campus-building-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain"
              onClick={() => setActiveModalLandmark(null)}
            >
              <div
                className="w-full max-w-lg pointer-events-auto overscroll-contain"
                onClick={(e) => e.stopPropagation()}
              >
                <BuildingInfoModal
                  landmark={activeModalLandmark}
                  onClose={() => setActiveModalLandmark(null)}
                  onNext={() => {
                    const nextIdx = (activeModalLandmark.step) % CAMPUS_LANDMARKS.length;
                    setActiveModalLandmark(CAMPUS_LANDMARKS[nextIdx]);
                    setCurrentStep(nextIdx);
                  }}
                  onPrev={() => {
                    const prevIdx = (activeModalLandmark.step - 2 + CAMPUS_LANDMARKS.length) % CAMPUS_LANDMARKS.length;
                    setActiveModalLandmark(CAMPUS_LANDMARKS[prevIdx]);
                    setCurrentStep(prevIdx);
                  }}
                  isFirst={activeModalLandmark.step === 1}
                  isLast={activeModalLandmark.step === CAMPUS_LANDMARKS.length}
                  onSpeak={handleSpeak}
                  isSpeaking={isSpeaking}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Interactive Radar Mini-Map (Bottom Right) */}
      <div className="absolute bottom-16 sm:bottom-6 right-3 sm:right-6 z-30 pointer-events-auto">
        <MiniMap
          currentStep={currentStep}
          onSelectLandmark={(stepIdx) => {
            setCurrentStep(stepIdx);
          }}
        />
      </div>

      {/* Bottom Horizontal Quick Landmark Selector Bar with Next/Prev road jumpers */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-auto max-w-full px-2">
        <div className="glass-panel px-3 py-1.5 rounded-full flex items-center gap-1.5 overflow-x-auto max-w-[96vw] sm:max-w-3xl border border-slate-700/60 shadow-2xl no-scrollbar">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 text-[10px] font-bold transition flex items-center gap-1 shrink-0"
            title={lang === 'bn' ? 'পূর্ববর্তী ভবন' : 'Previous landmark'}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'bn' ? 'পূর্ববর্তী' : 'Prev'}</span>
          </button>

          {CAMPUS_LANDMARKS.map((landmark, idx) => {
            const isActive = currentStep === idx;
            return (
              <button
                key={landmark.id}
                onClick={() => setCurrentStep(idx)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold scale-105 shadow-md shadow-emerald-900/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={landmark.name}
              >
                {landmark.step}. {landmark.code}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentStep(prev => Math.min(CAMPUS_LANDMARKS.length - 1, prev + 1))}
            disabled={currentStep === CAMPUS_LANDMARKS.length - 1}
            className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-[10px] font-bold transition flex items-center gap-1 shrink-0"
            title={lang === 'bn' ? 'পরবর্তী ভবন' : 'Next landmark'}
          >
            <span className="hidden sm:inline">{lang === 'bn' ? 'পরবর্তী' : 'Next'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
