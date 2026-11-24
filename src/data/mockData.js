import { FIRST_BATCH_STUDENTS } from './firstBatchStudents.js';
import { SECOND_BATCH_STUDENTS } from './secondBatchStudents.js';
import { THIRD_BATCH_STUDENTS } from './thirdBatchStudents.js';
import { FOURTH_BATCH_STUDENTS } from './fourthBatchStudents.js';
import { FIFTH_BATCH_STUDENTS } from './fifthBatchStudents.js';
import { SIXTH_BATCH_STUDENTS } from './sixthBatchStudents.js';
import { SEVENTH_BATCH_STUDENTS } from './seventhBatchStudents.js';
import { EIGHTH_BATCH_STUDENTS } from './eighthBatchStudents.js';

export const INITIAL_ALUMNI = [];


export const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    title: 'Grand RTEC Alumni Reunion & Gala 2026',
    titleBn: 'গ্র্যান্ড আরটেক অ্যালামনাই পুনর্মিলনী ও গালা ২০২৬',
    date: '2026-12-25',
    time: '09:00 AM - 09:00 PM',
    venue: 'RTEC Central Auditorium & Grounds, Pirganj, Rangpur',
    venueBn: 'আরটেক সেন্ট্রাল অডিটোরিয়াম ও প্রাঙ্গণ, পীরগঞ্জ, রংপুর',
    category: 'Reunion',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'সকল ব্যাচের প্রাক্তন ও বর্তমান শিক্ষার্থীদের অংশগ্রহণে অনুষ্ঠিত হতে যাচ্ছে ঐতিহাসিক অ্যালামনাই মিলনমেলা ২০২৬। স্মৃতিচারণ, সাংস্কৃতিক সন্ধ্যা, পিঠা উৎসব ও অ্যালামনাইদের সম্মাননা প্রদান।',
    descriptionEn: 'The flagship annual gathering of all RTEC alumni batches. Reconnect with batchmates, attend networking sessions, gala dinner, and cultural performances.',
    registrationFee: '৳ 1,500',
    seatsTotal: 1000,
    seatsRegistered: 642,
    status: 'Registration Open',
    schedule: [
      { time: '09:00 AM', event: 'Registration & Welcome Kit Distribution' },
      { time: '10:30 AM', event: 'Grand Campus Rally & Photo Session at Main Gate' },
      { time: '12:00 PM', event: 'Inaugural Ceremony at Central Auditorium' },
      { time: '01:30 PM', event: 'Traditional Grand Lunch Feast' },
      { time: '03:30 PM', event: 'Batch-wise Nostalgia & Discussion' },
      { time: '06:30 PM', event: 'Mega Musical Concert & Lantern Fest' }
    ]
  },
  {
    id: 'evt-2',
    title: 'National Textile Career Summit & Job Fair 2026',
    titleBn: 'জাতীয় টেক্সটাইল ক্যারিয়ার সামিট ও চাকরি মেলা ২০২৬',
    date: '2026-11-28',
    time: '10:00 AM - 05:00 PM',
    venue: 'Dr. MA Wazed Miah Academic Complex, RTEC',
    venueBn: 'ড. এম এ ওয়াজেদ মিয়া একাডেমিক ভবন, আরটেক',
    category: 'Career Fair',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'দেশের শীর্ষস্থানীয় ২০+ টেক্সটাইল ও গার্মেন্টস গ্রুপ সরাসরি অন-স্পট ইন্টারভিউ এবং ক্যারিয়ার গাইডলাইন প্রদান করবে। ফ্রেশার ও অভিজ্ঞ প্রকৌশলীদের জন্য উন্মুক্ত।',
    descriptionEn: 'Over 20 leading textile conglomerates and multinational buying houses offering on-spot interviews and career mentorship.',
    registrationFee: 'Free (নিবন্ধিত সদস্যদের জন্য ফ্রি)',
    seatsTotal: 500,
    seatsRegistered: 410,
    status: 'Registration Open',
    schedule: [
      { time: '10:00 AM', event: 'Opening Keynote by BGMEA/BTMA Leaders' },
      { time: '11:30 AM', event: 'On-Spot CV Drop & Walk-in Interviews' },
      { time: '02:30 PM', event: 'Panel: Future of Smart & Technical Textiles' }
    ]
  },
  {
    id: 'evt-3',
    title: 'Alumni Football & Cricket Championship (Batch Cup)',
    titleBn: 'আরটেক অ্যালামনাই ব্যাচ কাপ ফুটবল ও ক্রিকেট টুর্নামেন্ট',
    date: '2027-01-15',
    time: '08:00 AM - 06:00 PM',
    venue: 'RTEC Central Field & Stadium',
    venueBn: 'আরটেক সেন্ট্রাল ফিল্ড ও স্টেডিয়াম',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'সকল ব্যাচের অংশগ্রহণে সেন্ট্রাল ফিল্ডে অনুষ্ঠিত হবে আন্তঃব্যাচ টি-১০ ক্রিকেট এবং মিনি ফুটবল চ্যাম্পিয়নশিপ। ট্রফি ও মেডেল বিতরণ।',
    descriptionEn: 'Exciting Inter-Batch sports tournament featuring T-10 Cricket and Mini-Football championship on the central pitch.',
    registrationFee: '৳ 5,000 (Per Team)',
    seatsTotal: 16,
    seatsRegistered: 12,
    status: 'Team Registration Open',
    schedule: [
      { time: '08:00 AM', event: 'Toss & Group Stage Matches' },
      { time: '02:30 PM', event: 'Semi-Finals & Grand Finale' },
      { time: '05:00 PM', event: 'Trophy Handover Ceremony' }
    ]
  }
];

export const INITIAL_JOBS = [];

export const INITIAL_CAMPAIGNS = [
  {
    id: 'cmp-1',
    title: 'Shahid Abu Sayed Memorial Student Scholarship Fund',
    titleBn: 'শহীদ আবু সাঈদ স্মারক শিক্ষা ও মেধা বৃত্তি তহবিল',
    target: 500000,
    raised: 384500,
    donorCount: 142,
    category: 'Scholarship',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'রংপুরের বীর শহীদ আবু সাঈদের অমর স্মৃতির প্রতি শ্রদ্ধায় আর্থিকভাবে অসচ্ছল কিন্তু মেধাবী আরটেক শিক্ষার্থীদের মাসিক শিক্ষাবৃত্তি প্রদানের স্থায়ী ফান্ড।',
    descriptionEn: 'Endowment fund providing monthly financial stipends to meritorious textile engineering students facing financial hardships.',
    donors: [
      { name: '1st Batch Alumni Association', amount: 50000, date: '2026-11-01' },
      { name: 'Engr. Tanvir Ahmed', amount: 25000, date: '2026-11-03' },
      { name: 'Dr. Md. Asif Iqbal', amount: 35000, date: '2026-11-05' },
      { name: 'RTEC 4th Batch Friends', amount: 40000, date: '2026-11-07' }
    ]
  },
  {
    id: 'cmp-2',
    title: 'Modern Smart Textile & IoT Lab Modernization Fund',
    titleBn: 'স্মার্ট টেক্সটাইল ও আইওটি ল্যাব আধুনিকায়ন প্রকল্প',
    target: 800000,
    raised: 520000,
    donorCount: 88,
    category: 'Campus Infrastructure',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'শিক্ষার্থীদের জন্য স্মার্ট ফেব্রিক্স, কন্ডাক্টিভ ফাইবার এবং ডিজিটাল সিউইং সিমুলেটর ক্রয়ের মাধ্যমে কম্পিউটার ও অ্যাপারেল ল্যাবকে বিশ্বমানে উন্নীত করার উদ্যোগ।',
    descriptionEn: 'Equipping our campus labs with smart wearable fabric sensors, micro-controllers, and CAD software for advanced research.',
    donors: [
      { name: 'Overseas Alumni Chapter (UK & USA)', amount: 150000, date: '2026-10-25' },
      { name: 'Farzana Akter Ritu', amount: 20000, date: '2026-11-02' }
    ]
  },
  {
    id: 'cmp-3',
    title: 'Emergency Medical & Welfare Aid Fund for Students',
    titleBn: 'শিক্ষার্থী জরুরি চিকিৎসা ও কল্যাণ তহবিল',
    target: 300000,
    raised: 215000,
    donorCount: 165,
    category: 'Welfare',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'হঠাৎ কোনো শিক্ষার্থী বা কর্মচারী গুরুতর অসুস্থ হলে অথবা দুর্ঘটনা ঘটলে তাৎক্ষণিক চিকিৎসা সহায়তা প্রদানের বিশেষ তহবিল।',
    descriptionEn: 'Rapid-response emergency fund ensuring immediate medical assistance for any student facing critical healthcare needs.',
    donors: [
      { name: 'Anonymous Alumni', amount: 30000, date: '2026-11-04' },
      { name: 'Nusrat Jahan Synthia', amount: 15000, date: '2026-11-06' }
    ]
  }
];

export const INITIAL_NEWS = [];

export const INITIAL_FORUM_POSTS = [];

export const INITIAL_MEMORIES = [
  {
    id: 'mem-1',
    title: 'First Batch Rag Day Celebration at Main Gate',
    titleBn: '১ম ব্যাচের ঐতিহাসিক র‍্যাগ ডে চত্বর',
    category: 'Rag Day',
    batch: '1st Batch',
    year: '2016',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
    likes: 184
  },
  {
    id: 'mem-2',
    title: 'Late Night Weaving Machinery Project Trial',
    titleBn: 'উইভিং শেডে শেষ রাতের প্রজেক্ট ট্রায়াল',
    category: 'Lab Memories',
    batch: '3rd Batch',
    year: '2018',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    likes: 129
  },
  {
    id: 'mem-3',
    title: 'Inter-College Football Champions Celebration on Central Field',
    titleBn: 'সেন্ট্রাল মাঠে আন্তঃকলেজ চ্যাম্পিয়ন উদযাপন',
    category: 'Sports',
    batch: '5th Batch',
    year: '2020',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    likes: 215
  },
  {
    id: 'mem-4',
    title: 'Rainy Afternoon at Shahid Abu Sayed Hall Veranda',
    titleBn: 'শহীদ আবু সাঈদ হলের বারান্দায় বৃষ্টির বিকেল',
    category: 'Campus Life',
    batch: '6th Batch',
    year: '2022',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    likes: 176
  },
  {
    id: 'mem-5',
    title: 'Central Auditorium Cultural Fest Night',
    titleBn: 'অডিটোরিয়াম কালচারাল নাইট ও নাট্যোৎসব',
    category: 'Cultural',
    batch: '4th Batch',
    year: '2019',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    likes: 142
  },
  {
    id: 'mem-6',
    title: 'Convocation Gown Toss at Academic Building Portico',
    titleBn: 'একাডেমিক ভবনের সামনে সমাবর্তন গাউন টস',
    category: 'Convocation',
    batch: '2nd Batch',
    year: '2017',
    image: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?auto=format&fit=crop&w=1200&q=80',
    likes: 298
  }
];

export { INITIAL_TEACHERS } from './teachersData.js';


export const BATCHES_LIST = [
  { id: '1st Batch (2018-19)', nameBn: '১ম ব্যাচ (২০১৮-১৯)', nameEn: '1st Batch (2018-19)', session: '2018-2019' },
  { id: '2nd Batch (2019-20)', nameBn: '২য় ব্যাচ (২০১৯-২০)', nameEn: '2nd Batch (2019-20)', session: '2019-2020' },
  { id: '3rd Batch (2020-21)', nameBn: '৩য় ব্যাচ (২০২০-২১)', nameEn: '3rd Batch (2020-21)', session: '2020-2021' },
  { id: '4th Batch (2021-22)', nameBn: '৪র্থ ব্যাচ (২০২১-২২)', nameEn: '4th Batch (2021-22)', session: '2021-2022' },
  { id: '5th Batch (2022-23)', nameBn: '৫ম ব্যাচ (২০২২-২৩)', nameEn: '5th Batch (2022-23)', session: '2022-2023' },
  { id: '6th Batch (2023-24)', nameBn: '৬ষ্ঠ ব্যাচ (২০২৩-২৪)', nameEn: '6th Batch (2023-24)', session: '2023-2024' },
  { id: '7th Batch (2024-25)', nameBn: '৭ম ব্যাচ (২০২৪-২৫)', nameEn: '7th Batch (2024-25)', session: '2024-2025' },
  { id: '8th Batch (2025-26)', nameBn: '৮ম ব্যাচ (২০২৫-২৬)', nameEn: '8th Batch (2025-26)', session: '2025-2026' }
];

export const INITIAL_STUDENTS = [
  ...FIRST_BATCH_STUDENTS,
  ...SECOND_BATCH_STUDENTS,
  ...THIRD_BATCH_STUDENTS,
  ...FOURTH_BATCH_STUDENTS,
  ...FIFTH_BATCH_STUDENTS,
  ...SIXTH_BATCH_STUDENTS,
  ...SEVENTH_BATCH_STUDENTS,
  ...EIGHTH_BATCH_STUDENTS
];

export { EIGHTH_BATCH_STUDENTS };

export const INITIAL_STUDENT_SUBMISSIONS = [];

