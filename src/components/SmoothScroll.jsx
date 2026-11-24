import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { forceUnlockScroll } from '../utils/useScrollLock.js';

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Reset any lingering scroll locks on page route change
    forceUnlockScroll();

    // Detect touch-enabled or mobile devices (phones, tablets, touchscreens)
    const isTouch = typeof window !== 'undefined' && (
      'ontouchstart' in window || 
      (navigator.maxTouchPoints > 0) || 
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
      window.innerWidth <= 1024
    );

    // CRITICAL: On touch/mobile devices, NEVER initialize Lenis!
    // Native mobile browser touch scrolling runs directly on the GPU Compositor thread at 120Hz.
    // Hijacking touch in JS causes scroll delays, buffering, and sudden jumpy scrolling.
    if (isTouch) {
      if (window.__lenis) {
        window.__lenis.destroy();
        window.__lenis = null;
      }
      return;
    }

    // On desktop non-touch screens with mouse wheel, use a snappy, lightweight Lenis
    const lenis = new Lenis({
      duration: 0.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 0,
      wheelMultiplier: 1.0,
      infinite: false,
      prevent: (node) => {
        return (
          node?.hasAttribute?.('data-lenis-prevent') ||
          Boolean(node?.closest?.('[data-lenis-prevent]')) ||
          document.body.classList.contains('modal-scroll-locked')
        );
      }
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Scroll to top on page transition
    lenis.start();
    lenis.scrollTo(0, { immediate: true });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = null;
    };
  }, [location.pathname]);

  return <>{children}</>;
}
