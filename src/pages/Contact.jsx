import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Clock,
  Compass,
  CheckCircle2,
  Navigation,
  Building2,
  ArrowRight
} from 'lucide-react';

export default function Contact() {
  const { lang } = useApp();
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2500);
  };

  return (
    <div className="min-h-screen text-[#EDE8DF] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Archival Header */}
        <div className="mb-8 pb-6 border-b border-[#C5A880]/20">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-tech text-[#A89884] uppercase mb-2">
            <span className="text-[#DE644E] font-bold">
              {lang === 'bn' ? 'ক্যাম্পাস যোগাযোগ ও অনুসন্ধান ডেস্ক' : 'CAMPUS LIAISON & INQUIRY DESK'}
            </span>
            <span>RTEC PIRGANJ • 25.4311° N, 89.1500° E</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-regal font-black text-[#FDFBF7] tracking-tight">
            {lang === 'bn' ? 'যোগাযোগ ও প্রাতিষ্ঠানিক তথ্য কেন্দ্র' : 'Contact & Institutional Information Desk'}
          </h1>
          <p className="text-xs sm:text-sm text-[#DCD3C1] mt-2 max-w-3xl font-sans leading-relaxed">
            {lang === 'bn'
              ? 'অধ্যক্ষের দপ্তর, একাডেমিক রেজিস্ট্রি, অ্যালামনাই অ্যাসোসিয়েশন এবং ক্যাম্পাসে পৌঁছানোর দিকনির্দেশনা।'
              : 'Principal’s Secretariat, Academic Registry, Alumni Relations Office, and Campus Transit Directions.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Details Cards */}
          <div className="space-y-4">
            <div className="plaque-elevated p-6 rounded-xl border border-[#C5A880]/25 space-y-3">
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
                    টুকুরিয়া, পীরগঞ্জ উপজেলা, রংপুর - ৫৪২০, বাংলাদেশ।<br />
                    (পীরগঞ্জ সদর থেকে পীরগাছা রোড)
                  </>
                ) : (
                  <>
                    Rangpur Textile Engineering College (RTEC)<br />
                    Tukuriya, Pirganj Upazila, Rangpur - 5420, Bangladesh.<br />
                    (Pirganj Sadar to Pirgacha Road)
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
                {lang === 'bn' ? 'অধ্যক্ষের দপ্তর: ' : 'Principal Desk: '}+880 521-55421<br />
                {lang === 'bn' ? 'রেজিস্ট্রার শাখা: ' : 'Registrar Office: '}+880 1711-000000<br />
                {lang === 'bn' ? 'অ্যালামনাই হেল্পডেস্ক: ' : 'Alumni Helpdesk: '}+880 1700-000000
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
                info@rtec.edu.bd<br />
                alumni@rtec.edu.bd<br />
                {lang === 'bn' ? 'ওয়েব: ' : 'Web: '}rtec.pirgonj.rangpur.gov.bd
              </p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-2 plaque-elevated p-6 sm:p-8 rounded-2xl border border-[#C5A880]/30">
            <h2 className="font-serif-regal font-bold text-lg sm:text-xl text-[#FDFBF7] mb-1">
              {lang === 'bn' ? 'বার্তা বা প্রাতিষ্ঠানিক জিজ্ঞাসা প্রেরণ করুন' : 'Send an Inquiry or Official Correspondence'}
            </h2>
            <p className="text-xs text-[#A89884] mb-6 font-sans">
              {lang === 'bn'
                ? 'আপনার বার্তা সরাসরি সংশ্লিষ্ট প্রশাসনিক ডেস্কে পৌঁছে দেওয়া হবে।'
                : 'Your message will be securely routed directly to the designated administrative secretariat.'}
            </p>

            {sent ? (
              <div className="p-8 text-center bg-[#141311] rounded-xl border border-[#C5A880]/40 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#DFCA9E] mx-auto" />
                <h3 className="font-serif-regal font-bold text-base text-[#FDFBF7]">
                  {lang === 'bn' ? 'ধন্যবাদ! বার্তাটি সফলভাবে পাঠানো হয়েছে' : 'Thank you! Your dispatch has been transmitted'}
                </h3>
                <p className="text-xs text-[#A89884] font-mono-tech">
                  {lang === 'bn' ? 'আমরা শীঘ্রই আপনার ইমেইলে ফিরতি যোগাযোগ করব।' : 'The registry will respond to your stated email shortly.'}
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
                  <span>{lang === 'bn' ? 'বার্তা প্রেরণ করুন' : 'Dispatch Message'}</span>
                </button>
              </form>
            )}

            {/* Travel Directions Note */}
            <div className="mt-8 pt-6 border-t border-[#C5A880]/15 text-xs text-[#DCD3C1] space-y-2">
              <h4 className="font-serif-regal font-bold text-sm text-[#DFCA9E] flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-[#DE644E]" />
                <span>{lang === 'bn' ? 'কীভাবে আরটেক সেন্ট্রাল ক্যাম্পাসে পৌঁছাবেন:' : 'How to Reach RTEC Central Campus:'}</span>
              </h4>
              <p className="leading-relaxed font-sans">
                {lang === 'bn'
                  ? 'ঢাকা গাবতলী বা মহাখালী থেকে রংপুরগামী যেকোনো দূরপাল্লার বাসে উঠে পীরগঞ্জ বাসস্ট্যান্ডে নামতে হবে। সেখান থেকে অটো বা রিকশাযোগে পীরগাছা রোড ধরে ৫ মিনিট এগোলেই হাতের বাম পাশে ঐতিহ্যবাহী রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজের প্রধান ফটক (Main Gate) দেখতে পাবেন।'
                  : 'Board any inter-district coach bound for Rangpur from Dhaka (Gabtoli or Mohakhali) and disembark at Pirganj Bus Station. From Pirganj Sadar, take a 5-minute electric rickshaw ride eastward along Pirgacha Road. The grand gates of Rangpur Textile Engineering College will greet you on the left side of the highway.'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
