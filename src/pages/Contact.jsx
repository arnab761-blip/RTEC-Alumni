import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2
} from 'lucide-react';

export default function Contact() {
  const { lang, submitContactMessage, footerContact } = useApp();
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitContactMessage({
      ...formData,
      source: 'contact'
    });
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen text-[#EDE8DF] py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Archival Header */}
        <div className="mb-8 pb-6 border-b border-[#C5A880]/20">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-tech text-[#A89884] uppercase mb-2">
            <span className="text-[#DE644E] font-bold">
              {lang === 'bn' ? 'ক্যাম্পাস যোগাযোগ ও অনুসন্ধান ডেস্ক' : 'CONTACT & INQUIRY DESK'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-regal font-black text-[#FDFBF7] tracking-tight">
            {lang === 'bn' ? 'যোগাযোগ ও তথ্য কেন্দ্র' : 'Contact Desk'}
          </h1>
          <p className="text-xs sm:text-sm text-[#DCD3C1] mt-2 max-w-3xl font-sans leading-relaxed">
            {lang === 'bn'
              ? 'অধ্যক্ষের দপ্তর, একাডেমিক অফিস ও অ্যালামনাই অ্যাসোসিয়েশনের সাথে যোগাযোগের মাধ্যম।'
              : 'Get in touch with the college office, academic desk, or alumni association.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Details Cards */}
          <div className="space-y-4">
            <div className="plaque-elevated p-6 rounded-xl border border-[#C5A880]/25 space-y-3 transition-all duration-200 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-lg bg-[#141311] border border-[#C5A880]/25 text-[#DFCA9E] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#DE644E]" />
              </div>
              <h3 className="font-serif-regal font-bold text-base text-[#FDFBF7]">
                {lang === 'bn' ? 'ক্যাম্পাস ডাক ঠিকানা' : 'Campus Postal Address'}
              </h3>
              <p className="text-xs text-[#DCD3C1] leading-relaxed font-sans">
                {lang === 'bn' ? (
                  <>
                    রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ (আরটেক)<br />
                    {footerContact?.addressBn || 'টুকুরিয়া, পীরগঞ্জ, রংপুর - ৫৪২০, বাংলাদেশ।'}
                  </>
                ) : (
                  <>
                    Rangpur Textile Engineering College (RTEC)<br />
                    {footerContact?.addressEn || 'Tukuriya, Pirganj, Rangpur - 5420, Bangladesh.'}
                  </>
                )}
              </p>
            </div>

            <div className="plaque-elevated p-6 rounded-xl border border-[#C5A880]/25 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#141311] border border-[#C5A880]/25 text-[#DFCA9E] flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#DFCA9E]" />
              </div>
              <h3 className="font-serif-regal font-bold text-base text-[#FDFBF7]">
                {lang === 'bn' ? 'টেলিফোন ও হটলাইন' : 'Telephone & Hotlines'}
              </h3>
              <p className="text-xs text-[#DCD3C1] leading-relaxed font-mono-tech">
                {lang === 'bn' ? 'অধ্যক্ষের দপ্তর: ' : 'Principal Desk: '}{footerContact?.phone || '+880 521-55421'}<br />
                {lang === 'bn' ? 'ওয়েবসাইট: ' : 'Official Portal: '}rtec.pirgonj.rangpur.gov.bd
              </p>
            </div>

            <div className="plaque-elevated p-6 rounded-xl border border-[#C5A880]/25 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#141311] border border-[#C5A880]/25 text-[#DFCA9E] flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#DFCA9E]" />
              </div>
              <h3 className="font-serif-regal font-bold text-base text-[#FDFBF7]">
                {lang === 'bn' ? 'ইমেইল ও অফিসিয়াল পোর্টাল' : 'Official Email & Web Portal'}
              </h3>
              <p className="text-xs text-[#DCD3C1] leading-relaxed font-mono-tech">
                {footerContact?.email || 'info@rtec.edu.bd'}<br />
                alumni@rtec.edu.bd<br />
                {lang === 'bn' ? 'ওয়েব: ' : 'Web: '}rtec.pirgonj.rangpur.gov.bd
              </p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-2 plaque-elevated p-6 sm:p-8 rounded-2xl border border-[#C5A880]/30">
            <h2 className="font-serif-regal font-bold text-lg sm:text-xl text-[#FDFBF7] mb-1">
              {lang === 'bn' ? 'বার্তা বা জিজ্ঞাসা পাঠান' : 'Send a Message or Inquiry'}
            </h2>
            <p className="text-xs text-[#A89884] mb-6 font-sans">
              {lang === 'bn'
                ? 'আপনার বার্তা সরাসরি সংশ্লিষ্ট অফিসে পৌঁছে দেওয়া হবে।'
                : 'Your message will be shared directly with the college and alumni team.'}
            </p>

            {sent ? (
              <div className="p-8 text-center bg-[#141311] rounded-xl border border-[#C5A880]/40 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#DFCA9E] mx-auto" />
                <h3 className="font-serif-regal font-bold text-base text-[#FDFBF7]">
                  {lang === 'bn' ? 'ধন্যবাদ! বার্তাটি সফলভাবে পাঠানো হয়েছে' : 'Thank you! Your message has been sent'}
                </h3>
                <p className="text-xs text-[#A89884] font-mono-tech">
                  {lang === 'bn' ? 'আমরা শীঘ্রই আপনার ইমেইলে ফিরতি যোগাযোগ করব।' : 'We will reply to your email soon.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-tech text-[#A89884] mb-1">
                      {lang === 'bn' ? 'আপনার নাম' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={lang === 'bn' ? 'নাম লিখুন' : 'Enter your name'}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-tech text-[#A89884] mb-1">
                      {lang === 'bn' ? 'ইমেইল' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@mail.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-[#A89884] mb-1">
                    {lang === 'bn' ? 'বিষয় (Subject)' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={lang === 'bn' ? 'যেমন: পুনর্মিলনী রেজিস্ট্রেশন / অ্যাকাডেমিক তথ্য' : 'e.g., Reunion Registration / Academic Transcripts'}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-[#A89884] mb-1">
                    {lang === 'bn' ? 'বার্তা (Message)' : 'Message'}
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={lang === 'bn' ? 'আপনার বার্তা বিস্তারিত লিখুন...' : 'Write your detailed message here...'}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141311] border border-[#C5A880]/25 text-xs text-[#FDFBF7] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-agency btn-agency-terracotta py-2.5 px-6 rounded text-xs uppercase tracking-wider inline-flex items-center gap-2 font-bold"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </motion.div>
  );
}
