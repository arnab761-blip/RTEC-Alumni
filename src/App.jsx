import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import SmoothScroll from './components/SmoothScroll.jsx';
import PageTransition from './components/PageTransition.jsx';
import BackgroundWatermark from './components/BackgroundWatermark.jsx';
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
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold font-serif-regal text-stone-900 dark:text-[#FDFBF7]">
            পেজটি লোড হতে কিছুটা বিলম্ব হচ্ছে
          </h2>
          <p className="text-xs text-stone-600 dark:text-[#A89884] max-w-md">
            অনুগ্রহ করে পেজটি রিফ্রেশ করুন অথবা পুনরায় চেষ্টা করুন।
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-md transition"
          >
            পেজ রিফ্রেশ করুন (Reload)
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center p-6">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[#C5A880]/20 border-t-[#C5A880] animate-spin" />
        <GraduationCap className="w-5 h-5 text-[#DFCA9E]" />
      </div>
      <p className="text-[11px] text-[#A89884] font-mono-tech tracking-widest uppercase">
        রেজিস্ট্রার সংযোগ হচ্ছে • LOADING...
      </p>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/teachers" element={<PageTransition><Teachers /></PageTransition>} />
          <Route path="/students" element={<PageTransition><Students /></PageTransition>} />
          <Route path="/student-portal" element={<PageTransition><StudentPortal /></PageTransition>} />
          <Route path="/student-id" element={<PageTransition><StudentPortal /></PageTransition>} />
          <Route path="/directory" element={<PageTransition><AlumniDirectory /></PageTransition>} />
          <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
          <Route path="/jobs" element={<PageTransition><Jobs /></PageTransition>} />
          <Route path="/mentorship" element={<PageTransition><Mentorship /></PageTransition>} />
          <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
          <Route path="/forum" element={<PageTransition><Forum /></PageTransition>} />
          <Route path="/news" element={<PageTransition><News /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="*" element={<PageTransition><Home /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  </ErrorBoundary>
  );
}

function AppLayout() {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen ${
        isDark ? 'bg-[#121110] text-[#EDE8DF]' : 'bg-[#FAF8F5] text-[#29241E]'
      } flex flex-col font-sans selection:bg-[#C5A880] selection:text-[#121110] relative w-full max-w-full overflow-x-hidden`}
    >
      {/* Fixed Ambient College Seal Watermark */}
      <BackgroundWatermark />

      <Navbar />
      <main className="flex-1 flex flex-col w-full max-w-full overflow-x-hidden pt-[92px] sm:pt-[100px] pb-24 sm:pb-28 relative z-10 bg-transparent">
        <AnimatedRoutes />
      </main>
      <div className="relative z-20 w-full max-w-full overflow-x-hidden">
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
          <SmoothScroll>
            <AppLayout />
          </SmoothScroll>
        </ErrorBoundary>
      </Router>
    </AppProvider>
  );
}
