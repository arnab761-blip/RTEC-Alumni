import React, { useState } from 'react';
import { CAMPUS_LANDMARKS } from '../three/CampusData.js';
import { useApp } from '../context/AppContext.jsx';
import { MapPin, Navigation, Maximize2, Minimize2, Eye } from 'lucide-react';

export default function MiniMap({ currentStep, onSelectLandmark, isMobile }) {
  const { lang = 'en' } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  // Normalization constants to map 3D coordinates (X: -150 to 150, Z: -150 to 100) onto a 2D radar
  const mapWidth = isExpanded ? 320 : 180;
  const mapHeight = isExpanded ? 280 : 160;

  const toMapCoords = (x, z) => {
    // X goes from -150 (West) to 130 (East River)
    // Z goes from 80 (South Gate) to -140 (North Hall)
    const normX = (x + 150) / 280;
    const normY = (z - 80) / (-220); // flip so north is top
    return {
      left: `${Math.max(6, Math.min(94, normX * 100))}%`,
      top: `${Math.max(6, Math.min(94, normY * 100))}%`
    };
  };

  return (
    <div
      className={`glass-panel rounded-2xl shadow-2xl p-2.5 transition-all duration-300 border border-emerald-500/30 ${
        isExpanded ? 'w-80 sm:w-96' : 'w-48 sm:w-56'
      }`}
    >
      {/* MiniMap Header */}
      <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-slate-700/50">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
          <Navigation className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{lang === 'bn' ? 'ক্যাম্পাস ম্যাপ' : 'Campus Radar'}</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800/80 transition"
          title={isExpanded ? 'Collapse Map' : 'Expand Map'}
        >
          {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Radar Map Canvas Representation */}
      <div
        className="relative w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800"
        style={{ height: isExpanded ? '230px' : '130px' }}
      >
        {/* River on East (Right side) */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-sky-900/60 border-l border-sky-500/40 flex items-center justify-center">
          <span className="text-[9px] text-sky-300 font-mono rotate-90 whitespace-nowrap opacity-75">
            {lang === 'bn' ? 'করতোয়া নদী' : 'Karatoa River'}
          </span>
        </div>

        {/* Central Field on Northwest */}
        <div className="absolute left-2 top-2 w-14 h-12 rounded bg-emerald-950/70 border border-emerald-600/40 flex items-center justify-center">
          <span className="text-[8px] text-emerald-300 font-medium">{lang === 'bn' ? 'খেলার মাঠ' : 'Sports Field'}</span>
        </div>

        {/* Highway Road at South (Bottom) */}
        <div className="absolute left-0 right-0 bottom-1 h-3 bg-slate-800 border-t border-slate-700 flex items-center justify-center">
          <span className="text-[7px] text-slate-400">{lang === 'bn' ? 'মহাসড়ক' : 'Highway'}</span>
        </div>

        {/* All 15 Landmark Pins */}
        {CAMPUS_LANDMARKS.map((landmark, idx) => {
          const { left, top } = toMapCoords(landmark.coords.x, landmark.coords.z);
          const isActive = currentStep === idx;

          return (
            <button
              key={landmark.id}
              onClick={() => onSelectLandmark(idx)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-transform ${
                isActive ? 'scale-125 z-20' : 'scale-90 z-10 hover:scale-110'
              }`}
              style={{ left, top }}
              title={`${landmark.step}. ${landmark.name}`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-500/40 animate-pulse'
                    : 'bg-slate-700 text-slate-200 border border-slate-500 hover:bg-emerald-600'
                }`}
              >
                {landmark.step}
              </div>

              {/* Tooltip on hover */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block whitespace-nowrap bg-slate-950/95 text-emerald-300 text-[10px] px-2 py-0.5 rounded shadow-lg border border-slate-700 pointer-events-none z-30">
                {landmark.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Current location label */}
      <div className="mt-2 px-1 flex items-center justify-between text-[11px] text-slate-300">
        <span className="truncate text-emerald-300 font-medium">
          {CAMPUS_LANDMARKS[currentStep]?.step}. {CAMPUS_LANDMARKS[currentStep]?.name}
        </span>
        <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-1">
          {currentStep + 1}/15
        </span>
      </div>
    </div>
  );
}
