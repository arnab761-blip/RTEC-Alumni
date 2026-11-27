import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    src: '/images/slider/slide-01-main-gate.webp',
    titleBn: 'প্রধান ফটক • আরটেক, পীরগঞ্জ',
    titleEn: 'Main Gate • RTEC, Pirganj'
  },
  {
    id: 2,
    src: '/images/slider/slide-14-aerial-campus-view.jpg',
    titleBn: 'উপর থেকে ক্যাম্পাস ভিউ • আরটেক, পীরগঞ্জ',
    titleEn: 'Aerial Campus View • RTEC, Pirganj'
  },
  {
    id: 3,
    src: '/images/slider/slide-02-academic-monument.webp',
    titleBn: 'অ্যাকাডেমিক ভবন ও ক্যাম্পাস ভাস্কর্য',
    titleEn: 'Academic Building & Campus Monument'
  },
  {
    id: 4,
    src: '/images/slider/slide-03-campus-night-lights.webp',
    titleBn: 'রাতের আলোয় ক্যাম্পাস',
    titleEn: 'Night Campus Lights'
  },
  {
    id: 5,
    src: '/images/slider/slide-04-academic-building.webp',
    titleBn: 'প্রশাসনিক ভবন',
    titleEn: 'Administrative Building'
  },
  {
    id: 6,
    src: '/images/slider/slide-05-textile-lab.webp',
    titleBn: 'অ্যাপারেল ম্যানুফ্যাকচারিং ও সুইং ল্যাবরেটরি',
    titleEn: 'Apparel Manufacturing & Industrial Sewing Lab'
  },
  {
    id: 7,
    src: '/images/slider/slide-06-campus-view.webp',
    titleBn: 'ক্যাম্পাস ভিউ ও মসজিদ',
    titleEn: 'Campus View & Mosque'
  },
  {
    id: 8,
    src: '/images/slider/slide-07-mosque.webp',
    titleBn: 'আরটেক কেন্দ্রীয় মসজিদ',
    titleEn: 'RTEC Central Mosque'
  },
  {
    id: 9,
    src: '/images/slider/slide-08-college-bus.webp',
    titleBn: 'শিক্ষার্থীদের অফিসিয়াল আরটেক বাস',
    titleEn: 'Official RTEC Student Bus'
  },
  {
    id: 10,
    src: '/images/slider/slide-09-campus-life.webp',
    titleBn: 'সন্ধ্যার ক্যাম্পাস ও খেলাধুলা',
    titleEn: 'Evening Campus Life & Sports'
  },
  {
    id: 11,
    src: '/images/slider/slide-10-sports-ground.webp',
    titleBn: 'বাস্কেটবল কোর্ট ও খেলার মাঠ',
    titleEn: 'Basketball Court & Sports Ground'
  },
  {
    id: 12,
    src: '/images/slider/slide-11-research-club.webp',
    titleBn: 'কেন্দ্রীয় অডিটোরিয়াম',
    titleEn: 'Central Auditorium'
  },
  {
    id: 13,
    src: '/images/slider/slide-12-memorial.webp',
    titleBn: 'ক্যাম্পাস স্মৃতিসৌধ',
    titleEn: 'Campus Memorial Monument'
  },
  {
    id: 14,
    src: '/images/slider/slide-13-entrance.webp',
    titleBn: 'ক্যাম্পাস প্রবেশপথ ও নিরাপত্তা ফটক',
    titleEn: 'Campus Entrance & Security Gate'
  },
  {
    id: 15,
    src: '/images/slider/slide-15-night-campus-view.jpg',
    titleBn: 'নাইট ক্যাম্পাস ভিউ',
    titleEn: 'Night Campus View'
  },
  {
    id: 16,
    src: '/images/slider/slide-16-shahid-abu-sayed-hall.jpg',
    titleBn: 'শহীদ আবু সাঈদ হল',
    titleEn: 'Shahid Abu Sayed Hall'
  }
];

/**
 * HeroSlider Component
 *
 * Guarantees:
 * 1. 100% full original image visibility (ZERO cropping via object-contain)
 * 2. Auto-play every 5s with full timer reset on manual Next/Prev or swipe
 * 3. Press & Hold (mobile) and Hover (desktop) pause support
 * 4. Synchronous image and caption updates with 60fps CSS crossfade
 */
export default function HeroSlider() {
  const { lang } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef(null);

  // Auto-advance every 5 seconds; resets cleanly whenever currentIndex or isPaused changes
  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, isPaused]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const handleTouchStart = (e) => {
    setIsPaused(true);
    if (e.touches && e.touches.length > 0) {
      touchStartXRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e) => {
    setIsPaused(false);
    if (touchStartXRef.current !== null && e.changedTouches && e.changedTouches.length > 0) {
      const diff = touchStartXRef.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    }
    touchStartXRef.current = null;
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-2 overflow-x-hidden">
      {/* Framed Banner Container: Proportional height */}
      <div
        className="relative w-full h-[220px] sm:h-[340px] md:h-[420px] lg:h-[460px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-[#C5A880]/30 bg-[#0E0D0C] select-none group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onPointerDown={() => setIsPaused(true)}
        onPointerUp={() => setIsPaused(false)}
        onPointerCancel={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          setIsPaused(false);
          touchStartXRef.current = null;
        }}
      >
        
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
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-[#BD452F] text-white/90 hover:text-white border border-white/20 backdrop-blur-sm flex items-center justify-center transition cursor-pointer shadow-md"
          title={lang === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
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
