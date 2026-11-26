import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { formatDriveImageUrl } from '../utils/driveImage.js';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { FacebookBadge } from './SocialIcons.jsx';

export default function Footer() {
  const { lang, collegeLogo, footerContact, user, isAdminEmail } = useApp();
  const isAuthorizedAdmin = Boolean(user?.role === 'admin' && isAdminEmail?.(user?.email));
  const rtecLogoSrc = collegeLogo ? formatDriveImageUrl(collegeLogo) : '/images/rtec-logo.png';

  const phone = footerContact?.phone || '+880 521-55421';
  const email = footerContact?.email || 'info@rtec.edu.bd';
  const address = lang === 'bn'
    ? (footerContact?.addressBn || 'টুকুরিয়া, পীরগঞ্জ, রংপুর-৫৪২০, বাংলাদেশ')
    : (footerContact?.addressEn || 'Tukuriya, Pirganj, Rangpur-5420, Bangladesh');

  return (
    <footer className="bg-[#FAF9F6] dark:bg-[#100F0E] border-t border-[#C5A880]/30 dark:border-[#C5A880]/20 text-[#374151] dark:text-[#A89884] text-xs mt-auto w-full overflow-x-hidden">
      
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-20 sm:pt-9 sm:pb-24">
        
        {/* Main Grid: College Identity & Clean Links Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Official College Identity & Direct Contacts */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1A1916] border border-[#C5A880]/40 p-1 flex items-center justify-center font-serif-regal font-extrabold text-xs text-[#854D0E] dark:text-[#DFCA9E] shadow-sm overflow-hidden shrink-0">
                <img src={rtecLogoSrc} alt="RTEC" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif-regal font-bold text-sm sm:text-base text-[#0C0A09] dark:text-[#FDFBF7] tracking-wide uppercase truncate">
                  {lang === 'bn' ? 'রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ' : 'Rangpur Textile Engineering College'}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-[#854D0E] dark:text-[#DFCA9E] font-mono-tech font-bold">
                  {lang === 'bn'
                    ? 'বস্ত্র ও পাট মন্ত্রণালয় • বুটেক্স অধিভুক্ত • স্থাপিত ২০১৮'
                    : 'Affiliated with BUTEX & Min. of Textiles and Jute • Estd. 2018'}
                </p>
              </div>
            </div>

            {/* Clean Contact Details */}
            <div className="space-y-1.5 text-xs text-[#4B5563] dark:text-[#A89884] font-mono-tech pt-0.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#BD452F] shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#854D0E] dark:text-[#DFCA9E] shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-[#BD452F] dark:hover:text-[#DFCA9E] transition-colors">
                    {phone}
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#854D0E] dark:text-[#DFCA9E] shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-[#BD452F] dark:hover:text-[#DFCA9E] transition-colors">
                    {email}
                  </a>
                </div>
              </div>
            </div>

            {/* Official Institutional Portals & Admin Quick Access */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <a
                href="https://rtec.pirgonj.rangpur.gov.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-700 dark:hover:text-emerald-400 transition flex items-center gap-1.5 text-[11px] font-mono-tech font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-300/60 dark:border-emerald-700/50 shadow-sm"
                title={lang === 'bn' ? 'আরটেক সরকারি ওয়েবসাইট' : 'RTEC Government Portal'}
              >
                <img src={rtecLogoSrc} alt="RTEC" className="w-3.5 h-3.5 object-contain shrink-0" />
                <span>{lang === 'bn' ? 'সরকারি ওয়েবসাইট' : 'Govt Portal'}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>

              <a
                href="https://www.facebook.com/share/1A26Xmkj4s/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-700 dark:hover:text-blue-400 transition flex items-center gap-1.5 text-[11px] font-mono-tech font-bold text-blue-800 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md border border-blue-300/60 dark:border-blue-700/50 shadow-sm"
                title={lang === 'bn' ? 'আরটেক ফেসবুক কমিউনিটি' : 'RTEC Facebook Community'}
              >
                <FacebookBadge className="w-3.5 h-3.5 shrink-0" />
                <span>{lang === 'bn' ? 'ফেসবুক' : 'Facebook'}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>

              {isAuthorizedAdmin && (
                <Link
                  to="/admin"
                  className="hover:text-[#8E2E1D] dark:hover:text-[#FDFBF7] transition flex items-center gap-1.5 text-[11px] font-mono-tech font-bold text-[#854D0E] dark:text-[#DFCA9E] bg-amber-50 dark:bg-[#1E1C18] px-2.5 py-1 rounded-md border border-[#C5A880]/50 dark:border-[#C5A880]/40 shadow-sm"
                  title={lang === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#BD452F] dark:text-[#DFCA9E] shrink-0" />
                  <span>{lang === 'bn' ? 'এডমিন পোর্টাল' : 'Admin'}</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Columns: Clear, Uncluttered 2-Column Links Matrix */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-6 sm:gap-8 pt-3 lg:pt-0 border-t border-[#C5A880]/20 lg:border-t-0">
            
            {/* Col A: Academic Registers */}
            <div className="space-y-2.5 font-sans">
              <h4 className="font-serif-regal font-bold text-xs uppercase tracking-wider text-[#854D0E] dark:text-[#DFCA9E] pb-1.5 border-b border-[#C5A880]/25">
                {lang === 'bn' ? 'একাডেমিক রেজিস্ট্রি' : 'ACADEMIC REGISTERS'}
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/directory" className="text-[#4B5563] dark:text-[#A89884] hover:text-[#BD452F] dark:hover:text-[#FDFBF7] font-medium transition-colors block py-0.5">
                    {lang === 'bn' ? 'অ্যালামনাই আইডি ডিরেক্টরি' : 'Alumni ID Directory'}
                  </Link>
                </li>
                <li>
                  <Link to="/teachers" className="text-[#4B5563] dark:text-[#A89884] hover:text-[#BD452F] dark:hover:text-[#FDFBF7] font-medium transition-colors block py-0.5">
                    {lang === 'bn' ? 'শ্রদ্ধেয় শিক্ষকমণ্ডলী' : 'Distinguished Faculty'}
                  </Link>
                </li>
                <li>
                  <Link to="/students" className="text-[#4B5563] dark:text-[#A89884] hover:text-[#BD452F] dark:hover:text-[#FDFBF7] font-medium transition-colors block py-0.5">
                    {lang === 'bn' ? 'বর্তমান শিক্ষার্থী ও ব্যাচ' : 'Enrolled Students Body'}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-[#4B5563] dark:text-[#A89884] hover:text-[#BD452F] dark:hover:text-[#FDFBF7] font-medium transition-colors block py-0.5">
                    {lang === 'bn' ? '৪টি ইঞ্জিনিয়ারিং বিভাগ' : '4 Core Departments'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col B: Community & Career */}
            <div className="space-y-2.5 font-sans">
              <h4 className="font-serif-regal font-bold text-xs uppercase tracking-wider text-[#854D0E] dark:text-[#DFCA9E] pb-1.5 border-b border-[#C5A880]/25">
                {lang === 'bn' ? 'কমিউনিটি ও ক্যারিয়ার' : 'COMMUNITY & CAREER'}
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/forum" className="text-[#BD452F] dark:text-[#DFCA9E] hover:text-[#8E2E1D] dark:hover:text-white font-bold transition-colors block py-0.5">
                    {lang === 'bn' ? 'সিনিয়র অভিজ্ঞতা বিনিময়' : 'Experience Share & Stories'}
                  </Link>
                </li>
                <li>
                  <Link to="/student-portal" className="text-[#4B5563] dark:text-[#A89884] hover:text-[#BD452F] dark:hover:text-[#FDFBF7] font-medium transition-colors block py-0.5">
                    {lang === 'bn' ? 'শিক্ষার্থী ও আইডি পোর্টাল' : 'Student ID Portal'}
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="text-[#4B5563] dark:text-[#A89884] hover:text-[#BD452F] dark:hover:text-[#FDFBF7] font-medium transition-colors block py-0.5">
                    {lang === 'bn' ? 'অ্যালামনাই জব সার্কুলার' : 'Alumni Job Openings'}
                  </Link>
                </li>
                <li>
                  <Link to="/mentorship" className="text-[#4B5563] dark:text-[#A89884] hover:text-[#BD452F] dark:hover:text-[#FDFBF7] font-medium transition-colors block py-0.5">
                    {lang === 'bn' ? 'সিনিয়র মেন্টরশিপ' : 'Senior Mentorship'}
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Minimal Editorial Bottom Bar: Copyright & Credits */}
        <div className="mt-8 pt-5 border-t border-[#C5A880]/25 dark:border-[#C5A880]/15 flex flex-col lg:flex-row items-center justify-between gap-y-3 gap-x-6 text-[12px] sm:text-[12.5px] font-sans">
          
          {/* Left: Copyright */}
          <p className="text-[#57534E] dark:text-[#A89884] text-center lg:text-left">
            {lang === 'bn'
              ? '© ২০২৬ আরটেক অ্যালামনাই অ্যাসোসিয়েশন। সর্বস্বত্ব সংরক্ষিত।'
              : '© 2026 RTEC Alumni Association. All rights reserved.'}
          </p>

          {/* Right: Developer & QA Credits */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-end gap-y-1.5 gap-x-2 text-center lg:text-right">
            <span className="inline-flex flex-wrap items-center justify-center gap-x-1">
              <span className="text-[#57534E] dark:text-[#C9C0B3]">
                {lang === 'bn' ? 'ডেভেলপমেন্টে:' : 'Developed by'}
              </span>
              <a
                href="https://www.linkedin.com/in/md-tahmidul-islam-arnab-580587320/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B92ju51LVShS4kPDu0W7pLw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="relative whitespace-nowrap font-semibold text-[#1C1917] dark:text-[#F5F0E6] hover:text-[#BD452F] dark:hover:text-[#DFCA9E] transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:w-full after:h-[1px] after:bg-[#BD452F] dark:after:bg-[#DFCA9E] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                {lang === 'bn' ? 'মো. তাহমিদুল ইসলাম অর্ণব' : 'Md. Tahmidul Islam Arnab'}
              </a>
              <span className="whitespace-nowrap text-[#57534E] dark:text-[#C9C0B3] text-[11.5px]">
                {lang === 'bn' ? '(৫ম ব্যাচ)' : '(5th Batch)'}
              </span>
            </span>

            <span className="hidden sm:inline text-[#C5A880]/70 dark:text-[#C5A880]/50 select-none" aria-hidden="true">·</span>

            <span className="inline-flex flex-wrap items-center justify-center gap-x-1">
              <span className="text-[#57534E] dark:text-[#C9C0B3]">
                {lang === 'bn' ? 'কিউএ ও টেস্টিং:' : 'QA & Testing by'}
              </span>
              <a
                href="https://www.linkedin.com/in/abdur-rouf-87a449338/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BzfHUWGZzQbuZmJ8vRBe6Bg%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="relative whitespace-nowrap font-semibold text-[#1C1917] dark:text-[#F5F0E6] hover:text-[#BD452F] dark:hover:text-[#DFCA9E] transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:w-full after:h-[1px] after:bg-[#BD452F] dark:after:bg-[#DFCA9E] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                {lang === 'bn' ? 'আব্দুর রউফ চৌধুরী' : 'Abdur Rouf Chowdhury'}
              </a>
              <span className="whitespace-nowrap text-[#57534E] dark:text-[#C9C0B3] text-[11.5px]">
                {lang === 'bn' ? '(৫ম ব্যাচ)' : '(5th Batch)'}
              </span>
            </span>
          </div>

        </div>

      </div>

    </footer>
  );
}
