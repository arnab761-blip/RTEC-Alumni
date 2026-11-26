import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AuthStatusPopup from './components/AuthStatusPopup.jsx';
import BackgroundWatermark from './components/BackgroundWatermark.jsx';
import { forceUnlockScroll } from './utils/useScrollLock.js';
import { GraduationCap } from 'lucide-react';

// Lazy-loaded pages for high-speed performance
import Home from './pages/Home.jsx';
const Teachers = lazy(() => import('./pages/Teachers.jsx'));
const Students = lazy(() => import('./pages/Students.jsx'));
const AlumniDirectory = lazy(() => import('./pages/AlumniDirectory.jsx'));
const Events = lazy(() => import('./pages/Events.jsx'));
const Jobs = lazy(() => import('./pages/Jobs.jsx'));
const Mentorship = lazy(() => import('./pages/Mentorship.jsx'));
const Gallery = lazy(() => import('./pages/Gallery.jsx'));
const Forum = lazy(() => import('./pages/Forum.jsx'));
const News = lazy(() => import('./pages/News.jsx'));
const Auth = lazy(() => import('./pages/Auth.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const StudentPortal = lazy(() => import('./pages/StudentPortal.jsx'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
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
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center p-6">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[#C5A880]/20 border-t-[#C5A880] animate-spin" />
        <GraduationCap className="w-5 h-5 text-[#DFCA9E]" />
      </div>
      <p className="text-[11px] text-[#A89884] font-mono-tech tracking-widest uppercase">
        {lang === 'bn' ? 'রেজিস্ট্রার সংযোগ হচ্ছে • LOADING...' : 'CONNECTING TO REGISTER • LOADING...'}
      </p>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    forceUnlockScroll();
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const LazyPage = ({ component: Component }) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/teachers" element={<LazyPage component={Teachers} />} />
          <Route path="/students" element={<LazyPage component={Students} />} />
          <Route path="/student-portal" element={<LazyPage component={StudentPortal} />} />
          <Route path="/student-id" element={<LazyPage component={StudentPortal} />} />
          <Route path="/directory" element={<LazyPage component={AlumniDirectory} />} />
          <Route path="/events" element={<LazyPage component={Events} />} />
          <Route path="/jobs" element={<LazyPage component={Jobs} />} />
          <Route path="/mentorship" element={<LazyPage component={Mentorship} />} />
          <Route path="/gallery" element={<LazyPage component={Gallery} />} />
          <Route path="/forum" element={<LazyPage component={Forum} />} />
          <Route path="/news" element={<LazyPage component={News} />} />
          <Route path="/auth" element={<LazyPage component={Auth} />} />
          <Route path="/profile" element={<LazyPage component={Profile} />} />
          <Route path="/admin" element={<LazyPage component={Admin} />} />
          <Route path="/about" element={<LazyPage component={About} />} />
          <Route path="/contact" element={<LazyPage component={Contact} />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AnimatePresence>
    </ErrorBoundary>
  );
}

function AppLayout() {
  const { theme } = useApp();
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
        <ScrollToTop />
        <ErrorBoundary>
          <AppLayout />
        </ErrorBoundary>
      </Router>
    </AppProvider>
  );
}
