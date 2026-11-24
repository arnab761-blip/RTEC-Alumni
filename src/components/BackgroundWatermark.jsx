import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatDriveImageUrl } from '../utils/driveImage.js';

/**
 * BackgroundWatermark & Textile Ambient Wallpaper Component
 * 
 * Delivers an exquisite, professional textile-themed ambient environment:
 * 1. Warm atelier ambient lighting gradients (eradicates pale/flat washed-out white in light mode).
 * 2. Fine twill/jacquard micro-weave fabric lattice (warp & weft textile yarn interlacing).
 * 3. Flowing loom filament yarn wave curves across the canvas.
 * 4. A dedicated central luminance halo that keeps the official RTEC seal crisp, prominent,
 *    and crystal clear (never obscured or blended into background patterns).
 */
export default function BackgroundWatermark() {
  const { theme, collegeLogo } = useApp();
  const isDark = theme === 'dark';

  const watermarkSrc = collegeLogo ? formatDriveImageUrl(collegeLogo) : '/images/rtec-watermark.png';

  return (
    <aside
      aria-hidden="true"
      className="fixed inset-0 w-full h-[100dvh] z-0 pointer-events-none select-none overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      {/* 1. TEXTILE ATELIER AMBIENT LIGHTING WALLPAPER */}
      <div
        className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
        style={{
          background: isDark
            ? `
              radial-gradient(ellipse 90% 60% at 15% 15%, rgba(197, 168, 128, 0.09) 0%, transparent 65%),
              radial-gradient(ellipse 80% 50% at 85% 85%, rgba(189, 69, 47, 0.07) 0%, transparent 60%),
              radial-gradient(ellipse 70% 60% at 85% 15%, rgba(30, 58, 47, 0.08) 0%, transparent 60%),
              radial-gradient(ellipse 70% 50% at 15% 85%, rgba(197, 168, 128, 0.07) 0%, transparent 60%),
              linear-gradient(180deg, #121110 0%, #151412 50%, #121110 100%)
            `
            : `
              radial-gradient(ellipse 95% 65% at 12% 12%, rgba(224, 203, 168, 0.38) 0%, transparent 65%),
              radial-gradient(ellipse 85% 55% at 88% 88%, rgba(235, 195, 175, 0.30) 0%, transparent 60%),
              radial-gradient(ellipse 75% 60% at 85% 15%, rgba(200, 220, 210, 0.25) 0%, transparent 60%),
              radial-gradient(ellipse 75% 55% at 15% 85%, rgba(228, 208, 176, 0.32) 0%, transparent 60%),
              linear-gradient(180deg, #FAF7F2 0%, #F5EFE6 50%, #FAF6F0 100%)
            `,
          opacity: 1
        }}
      />

      {/* 2. TEXTILE WOVEN TWILL / JACQUARD FABRIC LATTICE PATTERN */}
      <div
        className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? `
              repeating-linear-gradient(45deg, rgba(197, 168, 128, 0.028) 0px, rgba(197, 168, 128, 0.028) 1px, transparent 1px, transparent 7px),
              repeating-linear-gradient(-45deg, rgba(197, 168, 128, 0.028) 0px, rgba(197, 168, 128, 0.028) 1px, transparent 1px, transparent 7px),
              repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.012) 0px, rgba(255, 255, 255, 0.012) 1px, transparent 1px, transparent 14px),
              repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.012) 0px, rgba(255, 255, 255, 0.012) 1px, transparent 1px, transparent 14px)
            `
            : `
              repeating-linear-gradient(45deg, rgba(140, 115, 75, 0.045) 0px, rgba(140, 115, 75, 0.045) 1.2px, transparent 1.2px, transparent 8px),
              repeating-linear-gradient(-45deg, rgba(140, 115, 75, 0.045) 0px, rgba(140, 115, 75, 0.045) 1.2px, transparent 1.2px, transparent 8px),
              repeating-linear-gradient(0deg, rgba(140, 115, 75, 0.02) 0px, rgba(140, 115, 75, 0.02) 1px, transparent 1px, transparent 16px),
              repeating-linear-gradient(90deg, rgba(140, 115, 75, 0.02) 0px, rgba(140, 115, 75, 0.02) 1px, transparent 1px, transparent 16px)
            `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%'
        }}
      />

      {/* 3. FLOWING LOOM WARP & WEFT YARN WAVEFORMS (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-35 dark:opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="loomGoldThread" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#C5A880' : '#854D0E'} stopOpacity="0.3" />
            <stop offset="50%" stopColor={isDark ? '#DFCA9E' : '#B45309'} stopOpacity="0.45" />
            <stop offset="100%" stopColor={isDark ? '#C5A880' : '#854D0E'} stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="loomTerracottaThread" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#BD452F' : '#C2410C'} stopOpacity="0.25" />
            <stop offset="60%" stopColor={isDark ? '#DE644E' : '#9A3412'} stopOpacity="0.35" />
            <stop offset="100%" stopColor={isDark ? '#BD452F' : '#EA580C'} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Warp yarn 1 */}
        <path
          d="M-50,180 C280,120 450,290 820,210 C1120,150 1280,310 1520,240"
          fill="none"
          stroke="url(#loomGoldThread)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
        />
        {/* Warp yarn 2 */}
        <path
          d="M-40,240 C320,180 500,360 880,270 C1180,210 1340,380 1520,310"
          fill="none"
          stroke="url(#loomGoldThread)"
          strokeWidth="1"
        />
        {/* Filament yarn 3 (cross weave) */}
        <path
          d="M-60,720 C240,640 480,820 860,710 C1200,620 1320,800 1520,740"
          fill="none"
          stroke="url(#loomTerracottaThread)"
          strokeWidth="1.5"
          strokeDasharray="5 7"
        />
        {/* Filament yarn 4 */}
        <path
          d="M-50,780 C260,700 520,880 910,770 C1240,680 1380,850 1520,800"
          fill="none"
          stroke="url(#loomTerracottaThread)"
          strokeWidth="1"
        />
      </svg>

      {/* 4. DEAD-CENTER FIXED WATERMARK CONTAINER (STRICT FIXED POSITIONING - NEVER SHIFTS OR JUMPS) */}
      <div 
        className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        style={{
          width: '100vw',
          height: '100dvh'
        }}
      >
        {/* Dedicated central luminance protective halo */}
        <div
          className="absolute w-[260px] h-[260px] sm:w-[460px] sm:h-[460px] md:w-[620px] md:h-[620px] lg:w-[780px] lg:h-[780px] rounded-full pointer-events-none transition-opacity duration-500"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(20, 18, 16, 0.85) 0%, rgba(18, 17, 16, 0.5) 50%, transparent 75%)'
              : 'radial-gradient(circle, rgba(252, 250, 245, 0.90) 0%, rgba(248, 243, 235, 0.60) 50%, transparent 75%)',
            filter: 'blur(30px)'
          }}
        />

        {/* Official RTEC College Logo Watermark - Perfectly Centered, Steady & Fixed */}
        <img
          src={watermarkSrc}
          alt=""
          loading="eager"
          decoding="async"
          className="relative w-[230px] sm:w-[380px] md:w-[520px] lg:w-[680px] xl:w-[780px] max-w-[76vw] max-h-[65dvh] object-contain pointer-events-none select-none transition-opacity duration-500"
          style={{
            opacity: isDark ? 0.13 : 0.15,
            mixBlendMode: isDark ? 'screen' : 'multiply',
            filter: isDark
              ? 'contrast(1.25) brightness(1.2) drop-shadow(0 0 35px rgba(197, 168, 128, 0.12))'
              : 'contrast(1.35) brightness(0.92) drop-shadow(0 0 30px rgba(133, 77, 14, 0.12))'
          }}
        />
      </div>
    </aside>
  );
}
