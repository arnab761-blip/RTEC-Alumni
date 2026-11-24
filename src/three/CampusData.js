// Campus landmarks and coordinates derived accurately from the RTEC Satellite Map
export const CAMPUS_LANDMARKS = [
  {
    id: 'main-gate',
    step: 1,
    name: 'মেইন গেট (প্রধান ফটক)',
    nameEn: 'MAIN GATE & ENTRANCE',
    code: 'MAIN GATE',
    coords: { x: 10, y: 0, z: 65 },
    cameraPos: { x: 10, y: 3.5, z: 82 },
    lookAt: { x: 10, y: 3, z: 45 },
    category: 'Entrance & Security',
    categoryBn: 'প্রবেশদ্বার ও নিরাপত্তা',
    icon: 'DoorOpen',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজের প্রধান প্রবেশদ্বার। পীরগঞ্জ-পীরগাছা মহাসড়কের পাশে অবস্থিত এই রাজকীয় ফটক দিয়ে ক্যাম্পাসের মূল অভ্যন্তরীণ যোগাযোগ শুরু হয়। ফটকের উপরে রয়েছে কলেজের দৃষ্টিনন্দন নামফলক।',
    descriptionEn: 'The monumental main gate of Rangpur Textile Engineering College on the Pirganj regional highway. Welcoming all students, faculty, and esteemed alumni to the premier textile hub of North Bengal.',
    facts: [
      '২৪/৭ নিরাপত্তা পাহারা ও আর্চওয়ে মেটাল ডিটেক্টর',
      'গেটের উপরে দ্বৈত ভাষায় সুবিশাল নামফলক ও কলেজ মনোগ্রাম',
      'ক্যাম্পাসের মূল চত্বরের সাথে সরাসরি পিচঢালা সংযোগ সড়ক'
    ],
    stats: { established: '2011', security: '24/7 Monitored', access: 'Biometric & ID' }
  },
  {
    id: 'academic',
    step: 2,
    name: 'একাডেমিক ভবন',
    nameEn: 'ACADEMIC BUILDING',
    code: 'ACADEMIC',
    coords: { x: -15, y: 0, z: 20 },
    cameraPos: { x: 8, y: 7, z: 20 },
    lookAt: { x: -15, y: 5, z: 20 },
    category: 'Academics & Admin',
    categoryBn: 'প্রশাসনিক ও শিক্ষা ভবন',
    icon: 'Building2',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'ড. এম এ ওয়াজেদ মিয়া টেক্সটাইল একাডেমিক ভবন। এখানে অধ্যক্ষ মহোদয়ের দপ্তর, রেজিস্ট্রার শাখা, অত্যাধুনিক মাল্টিমিডিয়া লেকচার গ্যালারি, শিক্ষকবৃন্দের অফিস ও চারটি প্রধান টেক্সটাইল ডিপার্টমেন্টের ক্লাসরুম অবস্থিত।',
    descriptionEn: 'Dr. MA Wazed Miah Academic Complex, housing state-of-the-art lecture galleries, executive administrative wings, faculty chambers, and specialized smart classrooms for Yarn, Fabric, Wet Process & Apparel Engineering.',
    facts: [
      '৪ তলা বিশিষ্ট সুবিশাল একাডেমিক আর্কিটেকচার',
      '১২টি সেন্ট্রালি প্রজেকশন সমৃদ্ধ শীতাতপ নিয়ন্ত্রিত স্মার্ট ক্লাসরুম',
      'অধ্যক্ষ ও বিভাগীয় প্রধানগণের অফিস'
    ],
    stats: { floors: '4 Stories', classrooms: '18 Rooms', capacity: '1200+ Students' }
  },
  {
    id: 'library',
    step: 3,
    name: 'সেন্ট্রাল লাইব্রেরি',
    nameEn: 'CENTRAL LIBRARY',
    code: 'LIBRARY',
    coords: { x: 25, y: 0, z: 5 },
    cameraPos: { x: 18, y: 6, z: 20 },
    lookAt: { x: 25, y: 4, z: 5 },
    category: 'Research & Study',
    categoryBn: 'গবেষণা ও পাঠাগার',
    icon: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'টেক্সটাইল প্রযুক্তি, মেটেরিয়াল সায়েন্স এবং সাধারণ বিজ্ঞানের সুবিশাল গ্রন্থভাণ্ডার। এখানে ১৫,০০০+ বই, আন্তর্জাতিক জার্নাল এবং ডিজিটাল ই-লাইব্রেরি কর্নার রয়েছে যেখানে শিক্ষার্থীরা সরাসরি বিশ্বমানের পেপার পড়তে পারে।',
    descriptionEn: 'RTEC Central Library, housing over 15,000 engineering titles, subscribed international research journals (AATCC, TRJ), air-conditioned quiet reading zones, and high-speed digital cataloging terminals.',
    facts: [
      'টেক্সটাইল, পলিমার ও ন্যানোটেকনোলজি বিষয়ক আন্তর্জাতিক জার্নাল',
      'একসাথে ২০০+ শিক্ষার্থীর পড়াশোনার ডিজিটাল রিডিং রুম',
      'IEEE ও ScienceDirect ওপেন অ্যাক্সেস ওয়াইফাই জোন'
    ],
    stats: { volumes: '15,000+ Books', seating: '250 Seats', digital: 'High-speed Fiber' }
  },
  {
    id: 'computer-lab',
    step: 4,
    name: 'কম্পিউটার ও ক্যাড ল্যাব',
    nameEn: 'COMPUTER & CAD LAB',
    code: 'COMPUTER LAB',
    coords: { x: 18, y: 0, z: -20 },
    cameraPos: { x: 10, y: 5, z: -6 },
    lookAt: { x: 18, y: 3.5, z: -20 },
    category: 'Technology & CAD',
    categoryBn: 'তথ্যপ্রযুক্তি ও ডিজাইন ল্যাব',
    icon: 'Monitor',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'টেক্সটাইল ডিজাইন, উইভিং প্যাটার্ন এবং গার্মেন্টস মার্কার মেকিংয়ের জন্য বিশেষায়িত কম্পিউটার ল্যাব। হাই-কনফিগ পিসিতে রয়েছে টেক্সটাইল ক্যাড ও ক্যাম সফটওয়্যার।',
    descriptionEn: 'Specialized Computer and Textile CAD/CAM Laboratory equipped with 80+ high-performance workstations for weave pattern simulation, garment digitizing, marker making, and engineering simulations.',
    facts: [
      'NedGraphics, Lectra & Optitex লাইসেন্সপ্রাপ্ত সফটওয়্যার',
      'হাই-স্পিড ডেডিকেটেড ফাইবার অপটিক নেটওয়ার্ক',
      'প্রোগ্রামিং ও আইওটি ল্যাবরেটরি রিসার্চ ফেসিলিটি'
    ],
    stats: { workstations: '80+ PCs', software: 'CAD/CAM Suite', lan: '10 Gbps Backbone' }
  },
  {
    id: 'auditorium',
    step: 5,
    name: 'অডিটোরিয়াম ও ফ্যাব্রিক ল্যাব',
    nameEn: 'AUDITORIUM & FABRIC SHED',
    code: 'AUDITORIUM',
    coords: { x: 22, y: 0, z: -45 },
    cameraPos: { x: 12, y: 6, z: -30 },
    lookAt: { x: 22, y: 4.5, z: -45 },
    category: 'Cultural & Testing',
    categoryBn: 'সাংস্কৃতিক ও ফ্যাব্রিক ল্যাব',
    icon: 'Drama',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'সুবিশাল ৮০০ আসনের কেন্দ্রীয় অডিটোরিয়াম। অ্যালামনাই রিইউনিয়ন, জাতীয় টেক্সটাইল সেমিনার, সমাবর্তন ও সাংস্কৃতিক উৎসবের প্রাণকেন্দ্র। পেছনে রয়েছে ফ্যাব্রিক ম্যানুফ্যাকচারিং টেস্ট ফেসিলিটি।',
    descriptionEn: 'The 800-capacity Grand College Auditorium, hosting national textile conferences, annual alumni galas, technical summits, and stage performances, paired with the Fabric Manufacturing testing wing.',
    facts: [
      'অত্যাধুনিক অ্যাকোস্টিক সাউন্ড ও থিয়েট্রিক্যাল লাইটিং ব্যবস্থা',
      'সেন্ট্রালি এয়ার-কন্ডিশন্ড ভিআইপি কনফারেন্স লাউঞ্জ',
      'বার্ষিক অ্যালামনাই মিলনমেলা ও টেক্সটাইল এক্সপোর মূল ভেন্যু'
    ],
    stats: { capacity: '800 Seats', acoustics: 'Pro Studio Audio', stage: 'Full Proscenium' }
  },
  {
    id: 'weaving-shed',
    step: 6,
    name: 'উইভিং ও স্পিনিং শেড',
    nameEn: 'WEAVING & SPINNING SHED',
    code: 'WEAVING SHED',
    coords: { x: 68, y: 0, z: -10 },
    cameraPos: { x: 44, y: 6.5, z: -10 },
    lookAt: { x: 68, y: 4, z: -10 },
    category: 'Heavy Machinery & Mills',
    categoryBn: 'ভারী শিল্প ও তাঁত শেড',
    icon: 'Cog',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজের গর্ব—শিল্প কারখানার সমতুল্য ভারী উইভিং শেড। এখানে রয়েছে আধুনিক এয়ার-জেট লুম, রেপিয়ার লুম, শাটললেস উইভিং মেশিন ও সেমি-অটো স্পিনিং ড্রাফটিং মেশিন।',
    descriptionEn: 'Industrial-grade Weaving and Yarn Spinning Machinery shed. Equipped with Air-jet looms, modern Rapier looms, circular knitting frames, and automated testing machinery for live factory-floor simulations.',
    facts: [
      'টয়োটা ও সুমিতোমো এয়ার-জেট হাই-স্পিড লুম',
      'জ্যাকার্ড ও ডব্বি শেডিং মেকানিজম প্র্যাকটিক্যাল প্ল্যাটফর্ম',
      'রিসার্চ অ্যান্ড ইন্ডাস্ট্রিয়াল ট্রায়াল প্রোডাকশন ক্যাপাসিটি'
    ],
    stats: { area: '12,000 sq ft', looms: '14 Industrial Looms', power: 'High-Voltage Substation' }
  },
  {
    id: 'apparel-lab',
    step: 7,
    name: 'পোশাক উৎপাদন শেড (Apparel Lab)',
    nameEn: 'APPAREL MANUFACTURING LAB',
    code: 'APPAREL MANUFACTURING LAB',
    coords: { x: -25, y: 0, z: -35 },
    cameraPos: { x: -25, y: 6.5, z: -55 },
    lookAt: { x: -25, y: 3.5, z: -35 },
    category: 'Garments & Production',
    categoryBn: 'গার্মেন্টস ও পোশাক ল্যাব',
    icon: 'Scissors',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'আধুনিক পোশাক উৎপাদন ও ওয়াশিং ল্যাবরেটরি। জুঁকি (Juki) ও ব্রাদার (Brother) ইন্ডাস্ট্রিয়াল সিউইং মেশিন, অটো স্প্রেডিং টেবিল, ফিউজিং মেশিন এবং গার্মেন্টস ফিনিশিং সেকশন।',
    descriptionEn: 'Apparel Manufacturing and Pattern Engineering Laboratory. Fully replicated export-quality garment line featuring automated fabric spreading tables, CAD cutters, heavy-duty industrial sewing and fusing lines.',
    facts: [
      '৩০+ ইন্ডাস্ট্রিয়াল ডাবল-নিডল ও ওভারলক মেশিনারি',
      'প্যাটার্ন মেকিং, গ্রেডিং ও মার্কার প্লটিং ইউনিট',
      'গার্মেন্টস কোয়ালিটি কন্ট্রোল (AQL) টেস্টিং ল্যাব'
    ],
    stats: { machines: '35+ Units', lines: '2 Complete Assembly Lines', standard: 'Export Standard' }
  },
  {
    id: 'basketball',
    step: 8,
    name: 'বাস্কেটবল মাঠ',
    nameEn: 'BASKETBALL FIELD',
    code: 'BASKETBALL FIELD',
    coords: { x: -75, y: 0, z: -40 },
    cameraPos: { x: -62, y: 5, z: -30 },
    lookAt: { x: -75, y: 2.5, z: -40 },
    category: 'Sports & Athletics',
    categoryBn: 'খেলাধুলা ও অ্যাথলেটিকস',
    icon: 'Trophy',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'আন্তর্জাতিক স্ট্যান্ডার্ড মাপের এক্রিলিক কোটিং বাস্কেটবল গ্রাউন্ড। ক্যাম্পাসের পশ্চিম পাশে অবস্থিত, যেখানে বিকেলে শিক্ষার্থীরা বাস্কেটবল টুর্নামেন্ট ও প্র্যাকটিসে মেতে ওঠে।',
    descriptionEn: 'Standard championship-grade basketball court located on the western recreation wing, equipped with safety fencing, backboards, and high-intensity night floodlights.',
    facts: [
      'শক-অ্যাবজরবিং এক্রিলিক কোর্ট ফ্লোরিং',
      'নাইট ম্যাচের জন্য শক্তিশালী এলইডি ফ্লাডলাইট',
      'আন্তঃকলেজ বাস্কেটবল লিগের নিয়মিত ভেন্যু'
    ],
    stats: { surface: 'All-Weather Acrylic', lights: '4 Flood Towers', matches: 'Inter-Batch League' }
  },
  {
    id: 'swimming-pool',
    step: 9,
    name: 'ক্যাম্পাস সুইমিং পুল',
    nameEn: 'SWIMMING POOL',
    code: 'SWIMMING POOL',
    coords: { x: -115, y: 0, z: -30 },
    cameraPos: { x: -98, y: 6, z: -20 },
    lookAt: { x: -115, y: 1.5, z: -30 },
    category: 'Aquatics & Fitness',
    categoryBn: 'সাঁতার ও ফিটনেস',
    icon: 'Waves',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'আরটেকের পশ্চিম প্রান্তে মনোরম প্রাকৃতিক পরিবেশে অবস্থিত ক্যাম্পাস সুইমিং পুল। সাঁতার অনুশীলন ও শিক্ষার্থীদের ফিটনেস বজায় রাখার জন্য একটি অত্যন্ত জনপ্রিয় স্পট।',
    descriptionEn: 'Campus Olympic-style swimming pool featuring crystalline water, tiled diving deck, lane markers, and adjoining changing facilities for student recreation and annual aquatic competitions.',
    facts: [
      'অটোমেটিক ফিল্টারেশন ও ওয়াটার পিউরিফিকেশন সিস্টেম',
      'প্রশিক্ষণপ্রাপ্ত লাইফগার্ড ও নিরাপত্তা সরঞ্জাম',
      'গ্রীষ্মকালীন বাৎসরিক সাঁতার প্রতিযোগিতা'
    ],
    stats: { length: '25 Meters', depth: '4 - 8 Feet', filtration: 'Automated Sand Filter' }
  },
  {
    id: 'central-field',
    step: 10,
    name: 'আরটেক সেন্ট্রাল ফিল্ড',
    nameEn: 'RTEC CENTRAL FIELD',
    code: 'CENTRAL FIELD',
    coords: { x: -115, y: 0, z: -90 },
    cameraPos: { x: -85, y: 10, z: -65 },
    lookAt: { x: -115, y: 2, z: -90 },
    category: 'Main Stadium & Ground',
    categoryBn: 'মূল স্টেডিয়াম ও খেলার মাঠ',
    icon: 'Shield',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'ক্যাম্পাসের উত্তর-পশ্চিম কোণে অবস্থিত আরটেকের সুবিশাল সেন্ট্রাল খেলার মাঠ। ক্রিকেট ও ফুটবল ম্যাচ, বার্ষিক স্পোর্টস ডে, ড্রোন কম্পিটিশন এবং সমাবর্তনের প্যারেড গ্রাউন্ড।',
    descriptionEn: 'The sprawling RTEC Central Stadium and Playground. The grand venue for inter-engineering cricket and football tourneys, track-and-field athletics, and festive convocation galas.',
    facts: [
      'ফুল সাইজ ফুটবল ও টার্ফ ক্রিকেট পিচ',
      'চারপাশে ৪০০ মিটার স্প্রিন্ট রানিং ট্র্যাক',
      'গ্যালারি ও স্পেকটেটর প্যাভিলিয়ন'
    ],
    stats: { dimensions: '110m x 80m', sports: 'Cricket, Football, Athletics', capacity: '2000+ Viewers' }
  },
  {
    id: 'girls-hall',
    step: 11,
    name: 'মেয়েদের হল (ছাত্রী নিবাস)',
    nameEn: "GIRL'S HALL",
    code: "GIRL'S HALL",
    coords: { x: -35, y: 0, z: -70 },
    cameraPos: { x: -12, y: 7, z: -70 },
    lookAt: { x: -35, y: 5, z: -70 },
    category: 'Female Dormitory',
    categoryBn: 'ছাত্রী নিবাস ও ডাইনিং',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'ছাত্রীদের জন্য সম্পূর্ণ নিরাপদ ও আধুনিক আবাসিক হল। সুসজ্জিত রিডিং রুম, সেন্ট্রাল ডাইনিং হল, কমন রুম ও ইনডোর গেমস সুবিধা সমৃদ্ধ। কঠোর নিরাপত্তা বেষ্টনী দ্বারা পরিবেষ্টিত।',
    descriptionEn: 'Secure and welcoming residential dormitory for female textile engineering students. Features quiet reading libraries, spacious shared rooms, dining hall, and round-the-clock female warden supervision.',
    facts: [
      '২৪ ঘণ্টা মহিলা নিরাপত্তা কর্মী ও সিসিটিভি সার্ভিল্যান্স',
      'নিজস্ব জেনারেটর ব্যাকআপ ও বিশুদ্ধ খাবার পানির ফিল্টার',
      'ইনডোর টেবিল টেনিস ও ব্যাডমিন্টন কোর্ট'
    ],
    stats: { floors: '4 Stories', capacity: '300 Female Engineers', dining: 'Hygienic Mess' }
  },
  {
    id: 'teachers-quarters',
    step: 12,
    name: 'টিচার্স ডরমিটরি ও কোয়ার্টার',
    nameEn: 'TEACHERS QUARTERS',
    code: 'QUATAR',
    coords: { x: 2, y: 0, z: -75 },
    cameraPos: { x: 12, y: 5.5, z: -62 },
    lookAt: { x: 2, y: 3.5, z: -75 },
    category: 'Faculty Residence',
    categoryBn: 'শিক্ষক ও কর্মকর্তাদের আবাসন',
    icon: 'Trees',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'শিক্ষক ও কর্মকর্তাদের জন্য নির্মিত ছায়াঘেরা শান্ত আবাসন চত্বর। ফুল বাগান ও বৃক্ষরাজিতে ঘেরা এই ভবনগুলোতে সম্মানিত শিক্ষকমণ্ডলী ও তাঁদের পরিবারবর্গ বসবাস করেন।',
    descriptionEn: 'Peaceful residential enclave dedicated to faculty members, assistant professors, and technical administrative staff, surrounded by lush gardens, flowering hedges, and fruit trees.',
    facts: [
      'শিক্ষকদের জন্য আধুনিক ফ্যামিলি অ্যাপার্টমেন্ট ও গেস্ট রুম',
      'ক্যাম্পাসের অভ্যন্তরীণ একাডেমিক ভবনের নিকটবর্তী অবস্থান',
      'শান্ত ও মনোরম পরিবেশ'
    ],
    stats: { buildings: '3 Blocks', units: '24 Family Apartments', greenCover: 'Lush Foliage' }
  },
  {
    id: 'abu-sayed-hall',
    step: 13,
    name: 'শহীদ আবু সাঈদ হল (ছেলেদের হল)',
    nameEn: 'SHAHID ABU SAYED HALL',
    code: 'SHAHID ABU SAYED HALL',
    coords: { x: -10, y: 0, z: -125 },
    cameraPos: { x: -34, y: 8, z: -125 },
    lookAt: { x: -10, y: 5, z: -125 },
    category: 'Male Dormitory',
    categoryBn: 'ছাত্রদের প্রধান আবাসিক হল',
    icon: 'Award',
    image: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'রংপুরের ঐতিহাসিক শহীদ আবু সাঈদের অমর স্মৃতির প্রতি শ্রদ্ধা জানিয়ে নামাঙ্কিত ছেলেদের প্রধান আবাসিক হল। বিশাল চারতলা ভবন, অভ্যন্তরীণ স্কয়ার চত্বর, ক্যান্টিন ও প্রাণবন্ত ছাত্র রাজনীতির স্মৃতিবিজড়িত কেন্দ্র।',
    descriptionEn: 'The primary male student hall named in solemn commemoration of Rangpur hero Shahid Abu Sayed. A multi-winged 4-story dormitory housing hundreds of aspiring textile engineers with vibrant community life.',
    facts: [
      'বীর শহীদ আবু সাঈদের সম্মানে নামাঙ্কিত স্মারক ফলক',
      'সুবিশাল ছাত্র মিলনায়তন, রিডিং রুম ও ব্যাডমিন্টন প্রাঙ্গণ',
      'ক্যাম্পাসের উত্তর প্রান্তে সুপরিসর প্রাকৃতিক দৃশ্য'
    ],
    stats: { floors: '4 Stories', capacity: '500+ Students', blocks: 'East & West Wings' }
  },
  {
    id: 'principal-quarter',
    step: 14,
    name: 'অধ্যক্ষের বাসভবন',
    nameEn: "PRINCIPAL'S QUARTER",
    code: 'PEINCIPLE QUATAR',
    coords: { x: 65, y: 0, z: -125 },
    cameraPos: { x: 50, y: 6, z: -112 },
    lookAt: { x: 65, y: 3.5, z: -125 },
    category: 'Executive Residence',
    categoryBn: 'অধ্যক্ষের বাসভবন ও বাংলো',
    icon: 'Building',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'রংপুর টেক্সটাইল ইঞ্জিনিয়ারিং কলেজের অধ্যক্ষ মহোদয়ের সরকারি বাংলো ও বাসভবন। ক্যাম্পাসের উত্তর-পূর্ব কোণে করতোয়া নদীর প্রাকৃতিক সান্নিধ্যে মনোরম স্থাপত্যে নির্মিত।',
    descriptionEn: 'The official executive residence and bungalow of the College Principal. Nestled in the serene northeastern corner near the Karatoya River banks with manicured lawns and private drive.',
    facts: [
      'ক্লাসিক্যাল বাংলো আর্কিটেকচার ও মনোরম ড্রাইভওয়ে',
      'করতোয়া নদীর তীরবর্তী শ্যামলিমায় ঘেরা নিভৃত ক্যাম্পাস কর্নার',
      'ভিআইপি অতিথি ও শিক্ষাবিদদের অভ্যর্থনা লাউঞ্জ'
    ],
    stats: { style: 'Bungalow Architecture', garden: 'Private Rose Garden', riverView: 'East Bank' }
  },
  {
    id: 'mosque',
    step: 15,
    name: 'ক্যাম্পাস জামে মসজিদ',
    nameEn: 'CENTRAL CAMPUS MOSQUE',
    code: 'MOSQUE',
    coords: { x: 55, y: 0, z: 60 },
    cameraPos: { x: 42, y: 5.5, z: 72 },
    lookAt: { x: 55, y: 4, z: 60 },
    category: 'Spiritual & Worship',
    categoryBn: 'উপাসনা ও জামে মসজিদ',
    icon: 'Moon',
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    descriptionBn: 'প্রধান ফটকের ডানপাশে অবস্থিত সুন্দর শুভ্র ও সবুজ গম্বুজ বিশিষ্ট ক্যাম্পাস জামে মসজিদ। পাঁচ ওয়াক্ত সালাত ও জুমার নামাজে শিক্ষক, শিক্ষার্থী ও কর্মচারীদের মিলনস্থল।',
    descriptionEn: 'The tranquil Central Campus Mosque near the Main Gate, featuring an emerald dome, tall minaret, and marble wudu fountains, welcoming over 500 worshippers for daily and Jumuah prayers.',
    facts: [
      'সুদৃশ্য সবুজ গম্বুজ ও সুউচ্চ মিনার',
      'মার্বেল পাথরে বাঁধানো সুবিশাল ওজুশালা',
      'একসাথে ৫০০+ মুসল্লির সালাত আদায়ের চমৎকার ব্যবস্থা'
    ],
    stats: { capacity: '500+ Musallis', architecture: 'Islamic Dome & Minaret', carpets: 'Imported Turkish Carpets' }
  }
];

// Road network points for rendering realistic asphalt curves
export const CAMPUS_ROADS = [
  // Highway road outside main gate
  [ { x: -140, z: 80 }, { x: -40, z: 78 }, { x: 10, z: 75 }, { x: 80, z: 72 }, { x: 160, z: 50 } ],
  // Main entry avenue from Main Gate to Central Academic Junction
  [ { x: 10, z: 75 }, { x: 10, z: 55 }, { x: 5, z: 35 }, { x: 0, z: 15 } ],
  // Central Crossroad to East (Library, Weaving Shed, Auditorium)
  [ { x: 0, z: 15 }, { x: 25, z: 15 }, { x: 45, z: 10 }, { x: 70, z: 10 } ],
  // North Spine Road from Academic to Shahid Abu Sayed Hall
  [ { x: 0, z: 15 }, { x: -2, z: -25 }, { x: -5, z: -60 }, { x: -8, z: -100 }, { x: -10, z: -120 } ],
  // West Avenue to Sports Complex (Apparel Shed, Basketball, Pool, Central Field)
  [ { x: 0, z: 15 }, { x: -25, z: 15 }, { x: -60, z: 15 }, { x: -90, z: 15 }, { x: -115, z: 10 } ],
  // Sports road North connecting to Central Field
  [ { x: -115, z: 10 }, { x: -115, z: -30 }, { x: -115, z: -70 }, { x: -115, z: -90 } ],
  // Branch from North road to Principal Quarter
  [ { x: -8, z: -100 }, { x: 25, z: -110 }, { x: 65, z: -115 } ],
  // Branch to Mosque from main gate
  [ { x: 10, z: 65 }, { x: 35, z: 62 }, { x: 55, z: 60 } ],
  // Inner connecting street past Apparel Lab North facade & Girls Hall
  [ { x: -5, z: -48 }, { x: -25, z: -48 }, { x: -65, z: -48 } ],
  // Access loop connecting North spine road past Abu Sayed Hall West Quadrangle to Central Field
  [ { x: -10, z: -120 }, { x: -34, z: -125 }, { x: -65, z: -120 }, { x: -115, z: -90 } ]
];
