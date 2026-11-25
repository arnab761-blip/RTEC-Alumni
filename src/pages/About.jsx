import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import {
  Building2,
  GraduationCap,
  Award,
  Compass,
  MapPin,
  CheckCircle2,
  Users,
  BookOpen,
  Globe,
  ArrowRight
} from 'lucide-react';

export default function About() {
  const { lang } = useApp();

  const departments = [
    {
      titleBn: 'ইয়ার্ন ইঞ্জিনিয়ারিং',
      titleEn: 'Yarn Engineering',
      code: 'Yarn Engineering',
      seatsBn: '৩০টি আসন',
      seatsEn: '30 Seats',
      descBn: 'তুলা ও সিন্থেটিক ফাইবার স্পিনিং, রিং ও রোটর ইয়ার্ন প্রযুক্তি, পলিমার ব্লেন্ডিং ও কোয়ালিটি কন্ট্রোল ল্যাবরেটরি।',
      descEn: 'Cotton and synthetic fiber spinning, ring and rotor yarn technologies, polymer blending, and quality control laboratories.'
    },
    {
      titleBn: 'ফ্যাব্রিক ইঞ্জিনিয়ারিং',
      titleEn: 'Fabric Engineering',
      code: 'Fabric Engineering',
      seatsBn: '৩০টি আসন',
      seatsEn: '30 Seats',
      descBn: 'উইভিং ও নিটিং প্রযুক্তি, এয়ার-জেট ও রেপিয়ার লুম অপারেশন, জ্যাকার্ড ডিজাইন এবং টেক্সটাইল ফ্যাব্রিক স্ট্রাকচার।',
      descEn: 'Weaving and knitting technologies, air-jet and rapier loom operation, jacquard styling, and advanced fabric structural geometry.'
    },
    {
      titleBn: 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং',
      titleEn: 'Wet Process Engineering',
      code: 'Wet Process Engineering',
      seatsBn: '৩০টি আসন',
      seatsEn: '30 Seats',
      descBn: 'টেক্সটাইল প্রিট্রিটমেন্ট, ডাইং, প্রিন্টিং, পরিবেশবান্ধব ফিনিশিং কেমিস্ট্রি ও ওয়াটারলেস ডাইং রিসার্চ।',
      descEn: 'Textile pretreatment, coloration, printing, eco-friendly finishing chemistry, and sustainable waterless dyeing research.'
    },
    {
      titleBn: 'অ্যাপারেল ইঞ্জিনিয়ারিং',
      titleEn: 'Apparel Manufacturing',
      code: 'Apparel Manufacturing',
      seatsBn: '৩০টি আসন',
      seatsEn: '30 Seats',
      descBn: 'পোশাক উৎপাদন প্রযুক্তি, ক্যাড প্যাটার্ন মেকিং, ইন্ডাস্ট্রিয়াল ইঞ্জিনিয়ারিং (IE), মার্চেন্ডাইজিং ও সাপ্লাই চেইন।',
      descEn: 'Garment manufacturing technology, CAD pattern construction, industrial engineering (IE), global merchandising, and supply chains.'
    }
  ];

  const facilities = [
    {
      bn: 'ড. এম এ ওয়াজেদ মিয়া ৪-তলা আধুনিক একাডেমিক ভবন',
      en: 'Dr. M. A. Wazed Miah 4-Story Academic Building'
    },
    {
      bn: '১৫,০০০+ বই ও আন্তর্জাতিক জার্নাল সমৃদ্ধ সেন্ট্রাল লাইব্রেরি',
      en: 'Central Library with 15,000+ Volumes & International Journals'
    },
    {
      bn: 'ভারী শিল্প উইভিং শেড ও এয়ার-জেট লুম রিসার্চ ইউনিট',
      en: 'Heavy Industrial Weaving Shed & Air-Jet Loom Research Unit'
    },
    {
      bn: 'কম্পিউটার ও টেক্সটাইল ক্যাড/ক্যাম ল্যাবরেটরি (৮০+ পিসি)',
      en: 'Computer & Textile CAD/CAM Laboratory (80+ High-Performance PCs)'
    },
    {
      bn: 'পোশাক উৎপাদন ও অ্যাপারেল ম্যানুফ্যাকচারিং শেড',
      en: 'Apparel Manufacturing & Garment Technology Pilot Shed'
    },
    {
      bn: 'বীর শহীদ আবু সাঈদ হল (ছাত্রদের প্রধান আবাসিক হল)',
      en: 'Shaheed Abu Sayeed Hall (Male Students Residence)'
    },
    {
      bn: 'নিরাপদ ছাত্রী নিবাস (মেয়েদের হল ও ডাইনিং)',
      en: 'Secure Female Students Residence & Dining Complex'
    },
    {
      bn: '৮০০ আসনের সেন্ট্রাল অডিটোরিয়াম ও ফ্যাব্রিক টেস্টিং কমপ্লেক্স',
      en: '800-Seat Central Auditorium & Advanced Fabric Testing Complex'
    },
    {
      bn: 'আন্তঃকলেজ টুর্নামেন্টের জন্য সুবিশাল সেন্ট্রাল খেলার মাঠ',
      en: 'Expansive Central Sports Stadium for Inter-Collegiate Tournaments'
    },
    {
      bn: 'অল-ওয়েদার বাস্কেটবল গ্রাউন্ড ও ফ্লাডলাইট টাওয়ার',
      en: 'All-Weather Basketball Court with Floodlight Towers'
    },
    {
      bn: 'ক্যাম্পাস সুইমিং পুল ও একুয়াটিক স্পোর্টস জোন',
      en: 'Campus Swimming Pool & Aquatic Sports Zone'
    },
    {
      bn: 'মনোরম সবুজ গম্বুজ বিশিষ্ট কেন্দ্রীয় ক্যাম্পাস জামে মসজিদ',
      en: 'Picturesque Green-Domed Central Campus Jam-e Mosque'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen text-[#EDE8DF] py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="plaque-elevated rounded-2xl border border-[#C5A880]/30 p-6 sm:p-12 mb-12 shadow-2xl relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#BD452F]/20 text-[#DE644E] text-[11px] font-mono-tech border border-[#BD452F]/40 uppercase mb-3 font-bold">
              {lang === 'bn' ? 'প্রতিষ্ঠান চার্টার ও ইতিহাস • টুকুরিয়া, পীরগঞ্জ' : 'INSTITUTE CHARTER & HISTORY • TUKURIYA, PIRGANJ'}
            </span>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-regal font-black text-[#FDFBF7] tracking-tight leading-tight">
              {lang === 'bn' ? 'রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ (আরটেক)' : 'Rangpur Textile Engineering College (RTEC)'}
            </h1>
            <p className="text-xs sm:text-sm text-[#DFCA9E] font-mono-tech mt-1 font-semibold">
              {lang === 'bn'
                ? 'প্রতিষ্ঠিত ২০১৮ (একনেক অনুমোদিত) • বুটেক্স ও বস্ত্র অধিদপ্তর (বস্ত্র ও পাট মন্ত্রণালয়) অধিভুক্ত'
                : 'ESTABLISHED 2018 (ECNEC APPROVED) • AFFILIATED WITH BUTEX & DOT, MINISTRY OF TEXTILES'}
            </p>

            <p className="text-xs sm:text-sm text-[#DCD3C1] mt-4 leading-relaxed font-sans">
              {lang === 'bn'
                ? 'বস্ত্র ও পাট মন্ত্রণালয়, বস্ত্র অধিদপ্তর (DOT) কর্তৃক প্রতিষ্ঠিত এবং বাংলাদেশ টেক্সটাইল বিশ্ববিদ্যালয় (BUTEX) অধিভুক্ত উত্তরবঙ্গের শীর্ষস্থানীয় সরকারি টেক্সটাইল প্রযুক্তি গবেষণা প্রতিষ্ঠান। একনেক (ECNEC) কর্তৃক আগস্ট ২০১৮ সালে অনুমোদন লাভ করে এবং ২০১৮-১৯ শিক্ষাবর্ষ থেকে ৪টি বিশেষায়িত বিভাগে বিএসসি ইন টেক্সটাইল ইঞ্জিনিয়ারিং কোর্স সফলভাবে পরিচালিত হচ্ছে। ফেব্রুয়ারি ২০২৫-এ কলেজটির নাম আনুষ্ঠানিকভাবে "রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ" (RTEC) নির্ধারণ করা হয়।'
                : 'Founded by the Department of Textiles (DOT), Ministry of Textiles and Jute, and affiliated with Bangladesh University of Textiles (BUTEX), RTEC is North Bengal\'s premier public textile technology and engineering institution. Approved by ECNEC in August 2018, RTEC offers premier B.Sc. in Textile Engineering degrees across four specialized departments since the 2018–19 academic year. In February 2025, the college was officially designated as "Rangpur Textile Engineering College" (RTEC).'}
            </p>

            <div className="mt-4 pt-3 border-t border-[#C5A880]/15 flex flex-wrap gap-4 text-xs font-mono-tech text-[#A89884]">
              <span>
                {lang === 'bn' ? 'অধ্যক্ষ:' : 'Principal:'}{' '}
                <strong className="text-[#DFCA9E]">
                  {lang === 'bn' ? 'ইঞ্জিনিয়ার মো. রঞ্জু মিয়া' : 'Engr. Md. Ranju Mia'}
                </strong>
              </span>
              <span>•</span>
              <span>
                {lang === 'bn' ? 'বার্ষিক আসন:' : 'Annual Seats:'}{' '}
                <strong className="text-[#DFCA9E]">
                  {lang === 'bn' ? '১২০টি (প্রতি বিভাগে ৩০টি)' : '120 (30 per department)'}
                </strong>
              </span>
              <span>•</span>
              <span>
                {lang === 'bn' ? 'মোট শিক্ষার্থী:' : 'Total Students:'}{' '}
                <strong className="text-[#DFCA9E]">
                  {lang === 'bn' ? '৬৮৭ জন' : '687 Students'}
                </strong>
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/teachers"
                className="btn-agency btn-agency-terracotta px-5 py-2.5 rounded text-xs font-sans uppercase tracking-wider"
              >
                <GraduationCap className="w-4 h-4" />
                <span>{lang === 'bn' ? 'শ্রদ্ধেয় শিক্ষকমণ্ডলী' : 'Distinguished Faculty'}</span>
              </Link>
              <Link
                to="/students"
                className="btn-agency px-5 py-2.5 rounded text-xs font-sans uppercase tracking-wider"
              >
                <Users className="w-4 h-4" />
                <span>{lang === 'bn' ? 'শিক্ষার্থী তালিকা' : 'Student Directory'}</span>
              </Link>
              <Link
                to="/forum"
                className="btn-agency px-5 py-2.5 rounded text-xs font-sans uppercase tracking-wider"
              >
                <Award className="w-4 h-4 text-[#DFCA9E]" />
                <span>{lang === 'bn' ? 'সিনিয়র অভিজ্ঞতা বিনিময়' : 'Experience Share & Stories'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Academic Departments */}
        <div className="mb-14">
          <div className="max-w-2xl mb-8">
            <span className="text-[10px] font-mono-tech text-[#DFCA9E] uppercase tracking-wider block font-bold">
              {lang === 'bn' ? 'একাডেমিক বিভাগসমূহ • মোট ১২০টি আসন' : 'ACADEMIC DIVISIONS • 120 TOTAL SEATS'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-regal font-extrabold text-[#FDFBF7] mt-1">
              {lang === 'bn' ? '৪টি প্রধান টেক্সটাইল ইঞ্জিনিয়ারিং বিভাগ' : '4 Core Textile Engineering Departments'}
            </h2>
            <p className="text-xs text-[#A89884] font-sans mt-1">
              {lang === 'bn'
                ? 'প্রতিটি বিভাগে বার্ষিক ৩০ জন করে মোট ১২০ জন শিক্ষার্থী কেন্দ্রীয় সমন্বিত পরীক্ষার মাধ্যমে ভর্তির সুযোগ পান।'
                : 'Each department admits 30 students annually (120 total) through the central BUTEX affiliated combined admission examination.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {departments.map((dept, idx) => (
              <div key={idx} className="plaque-elevated p-6 rounded-xl border border-[#C5A880]/20 space-y-3 transition-all duration-200 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded bg-[#141311] border border-[#C5A880]/25 text-[#DFCA9E] flex items-center justify-center font-bold text-xs font-mono-tech">
                    0{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono-tech text-[#DFCA9E] bg-[#141311] px-2 py-0.5 rounded border border-[#C5A880]/20 font-bold">
                    {lang === 'bn' ? dept.seatsBn : dept.seatsEn}
                  </span>
                </div>
                <h3 className="font-serif-regal font-bold text-[#FDFBF7] text-base">
                  {lang === 'bn' ? dept.titleBn : dept.titleEn}
                </h3>
                <p className="text-[11px] text-[#DE644E] font-mono-tech font-bold">{dept.code}</p>
                <p className="text-xs text-[#DCD3C1] leading-relaxed font-sans">
                  {lang === 'bn' ? dept.descBn : dept.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Facilities & Infrastructure */}
        <div className="plaque-elevated p-6 sm:p-10 rounded-2xl border border-[#C5A880]/25 mb-12">
          <h2 className="text-xl sm:text-2xl font-serif-regal font-bold text-[#FDFBF7] mb-4">
            {lang === 'bn' ? 'ক্যাম্পাস অবকাঠামো ও সুযোগ-সুবিধা' : 'Campus Infrastructure & Facilities'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-sans text-[#DCD3C1]">
            {facilities.map((facility, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-[#141311] border border-[#C5A880]/15">
                <CheckCircle2 className="w-4 h-4 text-[#DFCA9E] shrink-0 mt-0.5" />
                <span className="font-medium">{lang === 'bn' ? facility.bn : facility.en}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
