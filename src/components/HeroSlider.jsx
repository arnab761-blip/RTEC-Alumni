import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    src: '/images/slider/slide-01-main-gate.webp',
    titleBn: 'প্রধান প্রবেশদ্বার • রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ, পীরগঞ্জ',
    titleEn: 'Main Entrance & Gateway Arch • RTEC, Pirganj'
  },
  {
    id: 2,
    src: '/images/slider/slide-14-aerial-campus-view.jpg',
    titleBn: 'ড্রোন এরিয়াল ভিউ • আরটেক ক্যাম্পাস প্রাঙ্গণ ও অ্যাকাডেমিক কমপ্লেক্স',
    titleEn: 'Aerial Drone Panorama & Academic Complex • RTEC Pirganj'
  },
  {
    id: 3,
    src: '/images/slider/slide-02-academic-monument.webp',
    titleBn: 'কেন্দ্রীয় প্রশাসনিক ভবন ও ক্যাম্পাস স্বাধীনতা ভাস্কর্য',
    titleEn: 'Academic Complex & Central Campus Monument'
  },
  {
    id: 4,
    src: '/images/slider/slide-03-campus-night-lights.webp',
    titleBn: 'উৎসবমুখর ক্যাম্পাস ও স্টিল ভাস্কর্যের নৈশ আলোকসজ্জা',
    titleEn: 'Night Campus Illumination & Steel Sculpture'
  },
  {
    id: 5,
    src: '/images/slider/slide-04-academic-building.webp',
    titleBn: 'বহুতল প্রশাসনিক ভবন ও অ্যাকাডেমিক পোর্টিকো',
    titleEn: 'Administrative Building & Academic Portico'
  },
  {
    id: 6,
    src: '/images/slider/slide-05-textile-lab.webp',
    titleBn: 'আধুনিক অ্যাপারেল ম্যানুফ্যাকচারিং ও সুইং ল্যাবরেটরি',
    titleEn: 'Apparel Manufacturing & Industrial Sewing Lab'
  },
  {
    id: 7,
    src: '/images/slider/slide-06-campus-view.webp',
    titleBn: 'সবুজ ক্যাম্পাস প্রাঙ্গণ ও স্থাপত্যশৈলীপূর্ণ ওয়াচ টাওয়ার',
    titleEn: 'Green Campus Quadrangle & Architectural Tower'
  },
  {
    id: 8,
    src: '/images/slider/slide-07-mosque.webp',
    titleBn: 'আরটেক কেন্দ্রীয় জামে মসজিদ ও ক্যাম্পাস চত্বর',
    titleEn: 'RTEC Central Campus Jame Mosque'
  },
  {
    id: 9,
    src: '/images/slider/slide-08-college-bus.webp',
    titleBn: 'শিক্ষার্থীদের অফিসিয়াল আরটেক পরিবহন বাস বহর',
    titleEn: 'Official RTEC Student Fleet & Transit Bus'
  },
  {
    id: 10,
    src: '/images/slider/slide-09-campus-life.webp',
    titleBn: 'নৈশ ছাত্রাবাস প্রাঙ্গণ ও শিক্ষার্থীদের সান্ধ্যকালীন খেলাধুলা',
    titleEn: 'Evening Student Residence Life & Sports'
  },
  {
    id: 11,
    src: '/images/slider/slide-10-sports-ground.webp',
    titleBn: 'আরটেক বাস্কেটবল কোর্ট ও কেন্দ্রীয় আউটডোর ক্রীড়া প্রাঙ্গণ',
    titleEn: 'RTEC Basketball Court & Outdoor Sports Arena'
  },
  {
    id: 12,
    src: '/images/slider/slide-11-research-club.webp',
    titleBn: 'কেন্দ্রীয় অডিটোরিয়াম ও মেকাটেক্স রিসার্চ ক্লাব ফিনালে',
    titleEn: 'Central Auditorium & Research Club Grand Finale'
  },
  {
    id: 13,
    src: '/images/slider/slide-12-memorial.webp',
    titleBn: 'ক্যাম্পাস স্বাধীনতা ও শহীদ স্মারক স্মৃতিসৌধ',
    titleEn: 'Campus Memorial & Heritage Monument'
  },
  {
    id: 14,
    src: '/images/slider/slide-13-entrance.webp',
    titleBn: 'মহাসড়ক সংলগ্ন আরটেক প্রধান সীমানা তোরণ',
    titleEn: 'Highway Access Colonnade & Security Gateway'
  }
];

/**
 * HeroSlider Component
 * 
 * Guarantees:
 * 1. 100% full original image visibility (ZERO cropping, ZERO top cutting, full gate name visible via object-contain)
 * 2. Continuous unconditional auto-play every 3s (never pauses on hover, scroll, or click)
 * 3. 60fps GPU-composited CSS crossfade (zero white flash or blank screen)
 * 4. Clean & uncluttered (no pause buttons, no numbers, no dots)
 */
export default function HeroSlider() {
  const { lang } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Unconditional continuous auto-play every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const currentSlide = SLIDES[currentIndex];

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-2 overflow-x-hidden">
      {/* Framed Banner Container: Proportional height */}
      <div className="relative w-full h-[220px] sm:h-[340px] md:h-[420px] lg:h-[460px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-[#C5A880]/30 bg-[#0E0D0C] select-none group">
        
        {/* Layered Stacked Slides with GPU-composited CSS Crossfade */}
        {SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              style={{ willChange: 'opacity' }}
            >
              {/* Blurred atmospheric ambient background layer to fill widescreen margins */}
              <img
                src={slide.src}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-35 pointer-events-none select-none"
              />

              {/* Main sharp original image: 100% INTACT, ZERO CROPPING, full gate name visible */}
              <img
                src={slide.src}
                alt={lang === 'bn' ? slide.titleBn : slide.titleEn}
                className="relative z-10 w-full h-full object-contain object-center pointer-events-none select-none"
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          );
        })}

        {/* Clean, crystal-clear Landmark Caption in the bottom-left corner */}
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-4.5 sm:left-5 z-30 pointer-events-none max-w-[calc(100%-4rem)]">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-white/30 text-white shadow-2xl max-w-full">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" style={{ color: '#FBBF24' }} />
            <span
              className="hero-slider-caption-text font-semibold text-[11px] sm:text-sm tracking-wide truncate drop-shadow"
              style={{ color: '#FFFFFF' }}
            >
              {lang === 'bn' ? currentSlide.titleBn : currentSlide.titleEn}
            </span>
          </div>
        </div>

        {/* Subtle Side Navigation Arrows (Minimal & Clean) */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-[#BD452F] text-white/90 hover:text-white border border-white/20 backdrop-blur-sm flex items-center justify-center transition cursor-pointer shadow-md"
          title={lang === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-[#BD452F] text-white/90 hover:text-white border border-white/20 backdrop-blur-sm flex items-center justify-center transition cursor-pointer shadow-md"
          title={lang === 'bn' ? 'পরবর্তী' : 'Next'}
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

      </div>
    </div>
  );
}
