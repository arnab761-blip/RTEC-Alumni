import React, { Suspense, lazy, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AuthStatusPopup from './components/AuthStatusPopup.jsx';
import BackgroundWatermark from './components/BackgroundWatermark.jsx';
import SupportTreatModal from './components/SupportTreatModal.jsx';
import { forceUnlockScroll } from './utils/useScrollLock.js';
import { GraduationCap } from 'lucide-react';

// Retry wrapper for lazy-loaded pages so transient chunk/network hiccups recover automatically
function lazyWithRetry(importer) {
  return lazy(async () => {
    let lastErr;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await importer();
      } catch (err) {
        lastErr = err;
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 350 * (attempt + 1)));
        }
      }
    }
    throw lastErr;
  });
}

// Eagerly loaded core pages for instant, zero-delay navigation
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Auth from './pages/Auth.jsx';
import Forum from './pages/Forum.jsx';
import Gallery from './pages/Gallery.jsx';

// Lazy-loaded pages with automatic retry
const Teachers = lazyWithRetry(() => import('./pages/Teachers.jsx'));
const Students = lazyWithRetry(() => import('./pages/Students.jsx'));
const AlumniDirectory = lazyWithRetry(() => import('./pages/AlumniDirectory.jsx'));
const Jobs = lazyWithRetry(() => import('./pages/Jobs.jsx'));
const Mentorship = lazyWithRetry(() => import('./pages/Mentorship.jsx'));
const News = lazyWithRetry(() => import('./pages/News.jsx'));
const Profile = lazyWithRetry(() => import('./pages/Profile.jsx'));
const Admin = lazyWithRetry(() => import('./pages/Admin.jsx'));
const Contact = lazyWithRetry(() => import('./pages/Contact.jsx'));
const StudentPortal = lazyWithRetry(() => import('./pages/StudentPortal.jsx'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidUpdate(prevProps) {
    if (this.state.hasError && this.props.resetKey !== prevProps.resetKey) {
      this.setState({ hasError: false, error: null });
    }
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      const savedLang = typeof window !== 'undefined' ? (localStorage.getItem('rtec_lang') || 'en') : 'en';
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold font-serif-regal text-stone-900 dark:text-[#FDFBF7]">
            {savedLang === 'bn' ? 'পেজটি লোড হতে কিছুটা বিলম্ব হচ্ছে' : 'Taking longer than expected to load'}
          </h2>
          <p className="text-xs text-stone-600 dark:text-[#A89884] max-w-md">
            {savedLang === 'bn' ? 'অনুগ্রহ করে পেজটি রিফ্রেশ করুন অথবা পুনরায় চেষ্টা করুন।' : 'Please refresh the page or try again shortly.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:scale-105"
          >
            {savedLang === 'bn' ? 'পেজ রিফ্রেশ করুন' : 'Reload Page'}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function PageLoader() {
  const { lang } = useApp();
  return (
    <div data-page-loader="true" className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center p-6">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[#C5A880]/20 border-t-[#C5A880] animate-spin" />
        <GraduationCap className="w-5 h-5 text-[#DFCA9E]" />
      </div>
      <p className="text-[11px] text-[#A89884] font-mono-tech tracking-widest uppercase">
        {lang === 'bn' ? 'লোড হচ্ছে • LOADING...' : 'LOADING...'}
      </p>
    </div>
  );
}

// Persistent per-history-entry scroll cache (survives route transitions & browser Back/Forward)
const SCROLL_STORAGE_KEY = 'rtec_scroll_positions';
const scrollPositions = new Map();

function loadStoredScrollPositions() {
  if (typeof window === 'undefined') return;
  try {
    const raw = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        Object.entries(parsed).forEach(([k, v]) => {
          if (typeof v === 'number' && Number.isFinite(v)) scrollPositions.set(k, v);
        });
      }
    }
  } catch {
    // ignore storage errors
  }
}
loadStoredScrollPositions();

function saveScrollPos(key, y) {
  if (!key || typeof y !== 'number' || !Number.isFinite(y)) return;
  scrollPositions.set(key, y);
  // Keep Map bounded to most recent 40 history entries
  if (scrollPositions.size > 40) {
    const firstKey = scrollPositions.keys().next().value;
    if (firstKey !== undefined) scrollPositions.delete(firstKey);
  }
  try {
    sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(Object.fromEntries(scrollPositions)));
  } catch {
    // ignore storage quota errors
  }
}

const LazyPage = ({ component: Component }) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

function AnimatedRoutes() {
  const location = useLocation();
  const navigationType = useNavigationType();

  const activeKeyRef = useRef(location.key);
  const prevKeyRef = useRef(location.key);
  const prevPathnameRef = useRef(location.pathname);
  const isTransitioningRef = useRef(false);
  const pendingScrollRef = useRef({ y: 0, isPop: false });
  const restoreRafRef = useRef(null);
  const fallbackTimerRef = useRef(null);

  // Take full control of scroll restoration so AnimatePresence exit/enter doesn't clash with browser Back
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Continuously record the user's scroll position for the active history entry
  useEffect(() => {
    const handleScroll = () => {
      if (isTransitioningRef.current) return;
      saveScrollPos(activeKeyRef.current, window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const applyPendingScroll = useCallback(() => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (restoreRafRef.current) {
      cancelAnimationFrame(restoreRafRef.current);
    }

    const { y, isPop } = pendingScrollRef.current;
    const startedAt = performance.now();

    const step = () => {
      const isLoading = Boolean(document.querySelector('[data-page-loader="true"]'));
      const maxScrollable = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const elapsed = performance.now() - startedAt;

      if (isPop && y > 0 && (isLoading || maxScrollable < y * 0.85) && elapsed < 1500) {
        restoreRafRef.current = requestAnimationFrame(step);
        return;
      }

      restoreRafRef.current = requestAnimationFrame(() => {
        window.scrollTo({ top: y, left: 0, behavior: 'instant' });
        requestAnimationFrame(() => {
          if (isPop && Math.abs(window.scrollY - y) > 4) {
            window.scrollTo({ top: y, left: 0, behavior: 'instant' });
          }
          isTransitioningRef.current = false;
        });
      });
    };

    restoreRafRef.current = requestAnimationFrame(step);
  }, []);

  useLayoutEffect(() => {
    forceUnlockScroll();
    const prevKey = prevKeyRef.current;
    const prevPath = prevPathnameRef.current;

    if (prevKey !== location.key || prevPath !== location.pathname) {
      if (!isTransitioningRef.current) {
        saveScrollPos(prevKey, window.scrollY);
      }

      const isPop = navigationType === 'POP';
      const savedY = scrollPositions.get(location.key) ?? 0;
      const targetY = isPop ? savedY : 0;

      prevKeyRef.current = location.key;
      prevPathnameRef.current = location.pathname;
      activeKeyRef.current = location.key;
      pendingScrollRef.current = { y: targetY, isPop };

      if (prevPath === location.pathname) {
        // AnimatePresence won't run exit/enter when pathname is identical
        isTransitioningRef.current = true;
        applyPendingScroll();
      } else {
        isTransitioningRef.current = true;
        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = setTimeout(() => {
          if (isTransitioningRef.current) applyPendingScroll();
        }, 550);
      }
    }
  }, [location.key, location.pathname, navigationType, applyPendingScroll]);

  useEffect(() => {
    return () => {
      if (restoreRafRef.current) cancelAnimationFrame(restoreRafRef.current);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, []);

  return (
    <ErrorBoundary resetKey={location.pathname}>
      <AnimatePresence mode="wait" onExitComplete={applyPendingScroll}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/teachers" element={<LazyPage component={Teachers} />} />
          <Route path="/students" element={<LazyPage component={Students} />} />
          <Route path="/student-portal" element={<LazyPage component={StudentPortal} />} />
          <Route path="/student-id" element={<LazyPage component={StudentPortal} />} />
          <Route path="/directory" element={<LazyPage component={AlumniDirectory} />} />
          <Route path="/jobs" element={<LazyPage component={Jobs} />} />
          <Route path="/mentorship" element={<LazyPage component={Mentorship} />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/news" element={<LazyPage component={News} />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<LazyPage component={Profile} />} />
          <Route path="/admin" element={<LazyPage component={Admin} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<LazyPage component={Contact} />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AnimatePresence>
    </ErrorBoundary>
  );
}

function AppLayout() {
  const { theme, supportModalState, closeSupportModal } = useApp();
  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-[#121110] text-[#EDE8DF]' : 'bg-[#FAF8F5] text-[#29241E]'
      } flex flex-col font-sans selection:bg-[#C5A880] selection:text-[#121110] relative w-full max-w-full overflow-x-clip`}
    >
      {/* Fixed Ambient College Seal Watermark */}
      <BackgroundWatermark />

      <Navbar />
      <AuthStatusPopup />
      <SupportTreatModal
        isOpen={Boolean(supportModalState?.isOpen)}
        initialTreat={supportModalState?.initialTreat || 'coffee'}
        onClose={closeSupportModal}
      />
      <main className="flex-1 flex flex-col w-full max-w-full overflow-x-clip pb-24 sm:pb-28 relative z-10 bg-transparent">
        <AnimatedRoutes />
      </main>
      <div className="relative z-20 w-full max-w-full overflow-x-clip">
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <ErrorBoundary>
          <AppLayout />
        </ErrorBoundary>
      </Router>
    </AppProvider>
  );
}
