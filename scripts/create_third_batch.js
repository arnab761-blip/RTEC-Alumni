import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 98 Examinees of 3rd Batch (Session: 2020-21, Level-4 Term-II Exam 2024)
const rawThirdBatchData = [
  // ========================================================
  // YARN ENGINEERING (26 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: 'R202111001', name: 'MD. BULBUL AHAMMAD', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 2, regNo: 'R202111002', name: 'SUITY RANI RAY', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 3, regNo: 'R202111003', name: 'MD. SHAH SUFIAN AKAND', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 4, regNo: 'R202111004', name: 'MOST. MAHABUBA KHATUN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 5, regNo: 'R202111005', name: 'NOOR MOHAMMAD MANIK', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 6, regNo: 'R202111006', name: 'MD. ASHADUZZAMAN CHOWDHURY', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 7, regNo: 'R202111007', name: 'RUHUL AMIN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 8, regNo: 'R202111008', name: 'MD. MAHMUDUL HASAN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 9, regNo: 'R202111009', name: 'MD. AL-IMRAN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 10, regNo: 'R202111010', name: 'MD. AZAD RAHMAN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 11, regNo: 'R202111011', name: 'ASHFAK AHEMED', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 12, regNo: 'R202111014', name: 'KAWSAR ISLAM', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 13, regNo: 'R202111015', name: 'MD. SOHAN ALI', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 14, regNo: 'R202111016', name: 'MD. ABU ABDULLAH ARAFAT', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 15, regNo: 'R202111017', name: 'MASUD RANA', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 16, regNo: 'R202111018', name: 'IFFA ARA', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 17, regNo: 'R202111019', name: 'MD. REZWAN MIA', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 18, regNo: 'R202111021', name: 'MOST. MAHAFUJA', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 19, regNo: 'R202111022', name: 'FARUK MIA', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 20, regNo: 'R202111023', name: 'ATIKUR RAHMAN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 21, regNo: 'R202111024', name: 'FARAH ULFAT LUBNA', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 22, regNo: 'R202111025', name: 'ENAMUL HAQUE', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 23, regNo: 'R202111026', name: 'MD. SAFWAN SARKER SIAM', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 24, regNo: 'R202111020', name: 'MD. SAIFULLAH OYON', department: 'Yarn Engineering', remarks: 'Level-4 Term-II Examinee' },
  { deptSlNo: 25, regNo: 'R202011001', name: 'MD. RABIUL HASAN', department: 'Yarn Engineering', remarks: 'Readmitted from Session 2019-20' },
  { deptSlNo: 26, regNo: 'R202011003', name: 'ABDULLAH AL MAMUN', department: 'Yarn Engineering', remarks: 'Readmitted from Session 2019-20' },

  // ========================================================
  // FABRIC ENGINEERING (23 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: 'R202112001', name: 'MD. MEHDI HASAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 2, regNo: 'R202112002', name: 'MD. SHAKIL ISLAM SOJIB', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 3, regNo: 'R202112003', name: 'MD. NAIMUR RAHMAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 4, regNo: 'R202112004', name: 'MD. KAMRUZZAMAN SARKER', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 5, regNo: 'R202112005', name: 'MD. FARHAD HOSSAIN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 6, regNo: 'R202112006', name: 'SAMIUL ISLAM', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 7, regNo: 'R202112007', name: 'JAFRINE AKTER', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 8, regNo: 'R202112009', name: 'MD. MEHEDI HASAN RUBEL', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 9, regNo: 'R202112010', name: 'MD. SAEM MIM', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 10, regNo: 'R202112011', name: 'MD. BIJOY SARKER', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 11, regNo: 'R202112012', name: 'MD. MONIRUZZAMAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 12, regNo: 'R202112015', name: 'MD. ISTEAK AHMMED', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 13, regNo: 'R202112016', name: 'MD. RIAD ALI', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 14, regNo: 'R202112018', name: 'SYED MD. SIAM', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 15, regNo: 'R202112019', name: 'S. M. ABID MAHMUD', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 16, regNo: 'R202112021', name: 'MD. SAZZAD HOSSAIN RASHED', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 17, regNo: 'R202112022', name: 'MD. JUWEL RANA', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 18, regNo: 'R202112023', name: 'MD. HUMAYON KABIR', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 19, regNo: 'R202112024', name: 'LAILAK AHMED TONMOY', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 20, regNo: 'R202112025', name: 'URBOSHI ADHIKARY DISHA', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 21, regNo: 'R202112026', name: 'MD. SHAMEEM ISLAM SHAKIB', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 22, regNo: 'R202112027', name: 'IQBAL HOSSAIN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 23, regNo: 'R202112028', name: 'SAJID AHMED', department: 'Fabric Engineering', remarks: '' },

  // ========================================================
  // WET PROCESS ENGINEERING (24 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: 'R202113001', name: 'NEEROB CHANDRA ROY', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 2, regNo: 'R202113002', name: 'MD. RASHEDUL ISLAM', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 3, regNo: 'R202113003', name: 'MD. IMAM MUSA SHUVO', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 4, regNo: 'R202113004', name: 'MD. HASEN MIA', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 5, regNo: 'R202113005', name: 'MD. SABBIR ALI', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 6, regNo: 'R202113007', name: 'MD. NASIM SHEAK', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 7, regNo: 'R202113008', name: 'MD. MURADUZZAMAN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 8, regNo: 'R202113009', name: 'MST. ARABIAN ARA', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 9, regNo: 'R202113012', name: 'MD. ENAMUL HAQUE', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 10, regNo: 'R202113014', name: 'MD. FOYSAL BABU', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 11, regNo: 'R202113016', name: 'MD. ISTIAQ AHMAD', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 12, regNo: 'R202113017', name: 'ALI JOHN TATTHYO', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 13, regNo: 'R202113018', name: 'MD. JANNATUL BAKI RAKIB', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 14, regNo: 'R202113019', name: 'PALASH CHANDRA ROY', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 15, regNo: 'R202113020', name: 'MD. JUWEL RANA', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 16, regNo: 'R202113022', name: 'MD. LIAMULLAH PRAMANIK LISU', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 17, regNo: 'R202113023', name: 'MD. MAFMUD HASAN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 18, regNo: 'R202113025', name: 'MD. IMJAMAM HAQUE', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 19, regNo: 'R202113026', name: 'MD. MAHFUDUL BADSHA', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 20, regNo: 'R202113027', name: 'MD. MAFEJUL ISLAM', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 21, regNo: 'R202113028', name: 'MD. KAMRUZZAMAN KAZOL RIFAT', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 22, regNo: 'R202113029', name: 'MD. NURUN NOBI REYAD', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 23, regNo: 'R202113030', name: 'MD. SHAJEDUL ISLAM', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 24, regNo: 'R202013020', name: 'MD. SHAJEDUL ISLAM', department: 'Wet Process Engineering', remarks: 'Readmitted from Session 2019-20' },

  // ========================================================
  // APPAREL ENGINEERING (25 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: 'R202114001', name: 'SADIA AFRIN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 2, regNo: 'R202114002', name: 'JARIN TASNIM', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 3, regNo: 'R202114004', name: 'MOST. SANJIDA KHATUN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 4, regNo: 'R202114005', name: 'MD. RASHED MIA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 5, regNo: 'R202114006', name: 'MD. ZUBAER JISAN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 6, regNo: 'R202114008', name: 'MST. NUPUR AKTER', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 7, regNo: 'R202114009', name: 'MD. SHAHARIAR SHAKIB JAMIN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 8, regNo: 'R202114010', name: 'MD. ATIKUZZAMAN MIA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 9, regNo: 'R202114012', name: 'ASIF AHMED SHAD', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 10, regNo: 'R202114013', name: 'MD. SOHEL RANA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 11, regNo: 'R202114014', name: 'MD. SHEBLI NOMAN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 12, regNo: 'R202114015', name: 'MD. FARHAD ALAM AMIT', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 13, regNo: 'R202114016', name: 'MST. HELENA PERVIN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 14, regNo: 'R202114017', name: 'MD. MAMINUL ISLAM', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 15, regNo: 'R202114018', name: 'MD. SAKIFUZZAMAN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 16, regNo: 'R202114019', name: 'FATIMA TUZ JOHORA ARNI', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 17, regNo: 'R202114020', name: 'MST. SUMAIYA KHANOM DRISTY', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 18, regNo: 'R202114021', name: 'MD. AL-AMIN HOSSAIN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 19, regNo: 'R202114022', name: 'MD. RAHID AL-HASAN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 20, regNo: 'R202114023', name: 'MD. TUWAN HOSSEN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 21, regNo: 'R202114024', name: 'KAMAL CHANDRA BARMAN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 22, regNo: 'R202114027', name: 'KANIZ FATEMA TITHI', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 23, regNo: 'R202114028', name: 'SAAD MAHMUD KHAN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 24, regNo: 'R202114029', name: 'S. M. AHASAN HABIB', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 25, regNo: 'R202014001', name: 'LABONI AKTER', department: 'Apparel Engineering', remarks: 'Readmitted from Session 2019-20' }
];

console.log(`Loaded ${rawThirdBatchData.length} records for 3rd Batch.`);

const getDeptBn = (dept) => {
  if (dept.includes('Yarn')) return 'ইয়ার্ন ইঞ্জিনিয়ারিং';
  if (dept.includes('Fabric')) return 'ফ্যাব্রিক ইঞ্জিনিয়ারিং';
  if (dept.includes('Wet')) return 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং';
  if (dept.includes('Apparel')) return 'অ্যাপারেল ইঞ্জিনিয়ারিং';
  return dept;
};

// Start serialNo at 223 (since 1st Batch has 109, 2nd Batch has 113; 109 + 113 = 222)
const THIRD_BATCH_STUDENTS = rawThirdBatchData.map((item, index) => {
  const serialNo = 223 + index;
  const batchSlNo = index + 1;
  return {
    id: `std-${item.regNo}`,
    serialNo,
    batchSlNo,
    deptSlNo: item.deptSlNo,
    regNo: item.regNo,
    name: item.name,
    nameBn: item.name,
    department: item.department,
    deptBn: getDeptBn(item.department),
    batch: '3rd Batch (2020-21)',
    session: '2020-2021',
    year: 'Graduate / 3rd Batch',
    studentType: 'Graduate',
    currentJob: '',
    currentLocation: '',
    bloodGroup: '',
    phone: '',
    email: '',
    avatar: '',
    role: '3rd Batch Member',
    status: 'Graduate',
    remarks: item.remarks,
    activities: ''
  };
});

// Write to src/data/thirdBatchStudents.js
const destFile = path.join(projectRoot, 'src', 'data', 'thirdBatchStudents.js');
const fileContent = `export const THIRD_BATCH_STUDENTS = ${JSON.stringify(THIRD_BATCH_STUDENTS, null, 2)};\n`;

fs.writeFileSync(destFile, fileContent, 'utf-8');
console.log(`Successfully generated: ${destFile}`);

// Verify counts
const depts = {};
THIRD_BATCH_STUDENTS.forEach(s => {
  depts[s.department] = (depts[s.department] || 0) + 1;
});
console.log('Department Breakdown:');
console.table(depts);
