import React from 'react';

export function LinkedinIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

export function FacebookIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
    </svg>
  );
}

/**
 * Official Facebook Brand Logo Badge
 * Crisp, authentic #1877F2 blue circle with white modern 'f'
 */
export function FacebookBadge({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="18" fill="#1877F2" />
      <path
        d="M23.5 18H20V29H15.5V18H13V14H15.5V11.2C15.5 8.7 17 7 19.8 7C21.1 7 22.3 7.2 22.7 7.3V10.7H21C19.7 10.7 19.4 11.4 19.4 12.3V14H23.2L22.7 18H23.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/**
 * Official National Emblem / Seal of the People's Republic of Bangladesh
 * (গণপ্রজাতন্ত্রী বাংলাদেশ সরকার জাতীয় প্রতীক)
 * Features:
 * - Water lily (শাপলা) on river waves
 * - Bordered by two paddy rice sheaves (ধানের শীষ)
 * - Three connected jute leaves at the apex (পাট পাতা)
 * - Four five-pointed stars (চার তারকা)
 * - Authentic Government Green (#006A4E), Red (#F42A41) and Gold (#E6A100)
 */
export function BangladeshGovSeal({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Ring */}
      <circle cx="50" cy="50" r="48" fill="#006A4E" stroke="#C5A880" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="42" fill="#F42A41" stroke="#FFD700" strokeWidth="1.2" />
      
      {/* Inner Central Disc */}
      <circle cx="50" cy="50" r="38" fill="#006A4E" />

      {/* Water Waves (নদী ও ঢেউ) */}
      <path
        d="M26 68 C32 65 38 71 44 68 C50 65 56 71 62 68 C68 65 74 71 76 68"
        stroke="#FFD700"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M24 73 C30 70 36 76 42 73 C48 70 54 76 60 73 C66 70 72 76 78 73"
        stroke="#FFD700"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Water Lily / Shapla (শাপলা ফুল) */}
      {/* Center Petal */}
      <path
        d="M50 38 C47 46 47 56 50 62 C53 56 53 46 50 38 Z"
        fill="#FFFFFF"
        stroke="#FFD700"
        strokeWidth="0.8"
      />
      {/* Left Petal */}
      <path
        d="M50 62 C43 57 37 47 41 42 C45 42 47 50 50 62 Z"
        fill="#FFFFFF"
        stroke="#FFD700"
        strokeWidth="0.8"
      />
      {/* Right Petal */}
      <path
        d="M50 62 C57 57 63 47 59 42 C55 42 53 50 50 62 Z"
        fill="#FFFFFF"
        stroke="#FFD700"
        strokeWidth="0.8"
      />
      {/* Outer Left Petal */}
      <path
        d="M50 63 C40 61 31 52 35 48 C38 48 43 55 50 63 Z"
        fill="#FFFFFF"
        stroke="#FFD700"
        strokeWidth="0.8"
      />
      {/* Outer Right Petal */}
      <path
        d="M50 63 C60 61 69 52 65 48 C62 48 57 55 50 63 Z"
        fill="#FFFFFF"
        stroke="#FFD700"
        strokeWidth="0.8"
      />

      {/* 3 Jute Leaves at Crest (শীর্ষে ৩টি সংযুক্ত পাট পাতা) */}
      <path
        d="M50 20 C48 24 48 28 50 31 C52 28 52 24 50 20 Z"
        fill="#FFD700"
        stroke="#B38600"
        strokeWidth="0.6"
      />
      <path
        d="M48 29 C44 26 40 25 39 28 C42 30 45 30 48 30 Z"
        fill="#FFD700"
        stroke="#B38600"
        strokeWidth="0.6"
      />
      <path
        d="M52 29 C56 26 60 25 61 28 C58 30 55 30 52 30 Z"
        fill="#FFD700"
        stroke="#B38600"
        strokeWidth="0.6"
      />

      {/* 4 Five-Pointed Stars (দুই পাশে দুটি করে ৪টি তারকা) */}
      {/* Left Stars */}
      <polygon points="28,27 29.5,31 34,31 30.5,33.5 32,37.5 28,35 24,37.5 25.5,33.5 22,31 26.5,31" fill="#FFD700" />
      <polygon points="34,18 35.5,21.5 39.5,21.5 36.5,23.5 37.5,27 34,25 30.5,27 31.5,23.5 28.5,21.5 32.5,21.5" fill="#FFD700" />

      {/* Right Stars */}
      <polygon points="72,27 73.5,31 78,31 74.5,33.5 76,37.5 72,35 68,37.5 69.5,33.5 66,31 70.5,31" fill="#FFD700" />
      <polygon points="66,18 67.5,21.5 71.5,21.5 68.5,23.5 69.5,27 66,25 62.5,27 63.5,23.5 60.5,21.5 64.5,21.5" fill="#FFD700" />

      {/* Two Sheaves of Paddy Rice / Dhaner Shish (উভয় পাশে দুটি ধানের শীষের বেষ্টনী) */}
      <path
        d="M20 64 C18 52 22 38 29 28"
        stroke="#FFD700"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M80 64 C82 52 78 38 71 28"
        stroke="#FFD700"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
