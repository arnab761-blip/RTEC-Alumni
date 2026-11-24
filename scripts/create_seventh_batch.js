import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 114 Examinees of 7th Batch (Session: 2024-25, Level-1 Term-I Exam 2025)
const rawSeventhBatchData = [
  // ========================================================
  // YARN ENGINEERING (30 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: '25090101001', name: 'MIR RIYADUL HOSSAIN RIYADH', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 2, regNo: '25090101002', name: 'MD. SOHANUR RAHMAN SIHAB', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 3, regNo: '25090101003', name: 'MD. LUTFUL KABIR', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 4, regNo: '25090101004', name: 'MD. ABU SUFIAN SAUROV', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 5, regNo: '25090101005', name: 'AMIT CHANDRA SARKER', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 6, regNo: '25090101006', name: 'DIPON ROY', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 7, regNo: '25090101007', name: 'MD. MEHEDI HASAN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 8, regNo: '25090101008', name: 'MD. IMRAN BIN MONZUR', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 9, regNo: '25090101009', name: 'MOST. SANJIDA ALAM SHETU', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 10, regNo: '25090101010', name: 'MD. SAMSUL AREFIN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 11, regNo: '25090101011', name: 'MASRAFIA SIDDIKI', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 12, regNo: '25090101012', name: 'MST. MARIA SARKAR', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 13, regNo: '25090101013', name: 'MD. TAOSIF WAHID TASIM', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 14, regNo: '25090101015', name: 'MD HARUNUR RASHID RIFAT', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 15, regNo: '25090101016', name: 'ALFES SANY', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 16, regNo: '25090101017', name: 'MD. ZAHID HASAN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 17, regNo: '25090101018', name: 'SREE BIPLOB KUMAR SARKER', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 18, regNo: '25090101019', name: 'AYSHA SIDDIKA', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 19, regNo: '25090101020', name: 'MST. MANSURA KHATUN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 20, regNo: '25090101021', name: 'MD. JAKARIA MIA', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 21, regNo: '25090101022', name: 'MD. ATIKUR RAHMAN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 22, regNo: '25090101023', name: 'MD. NAFIUL KARIM', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 23, regNo: '25090101024', name: 'MIR. NAFI IN NUR', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 24, regNo: '25090101025', name: 'MD. SAFAYAT HOSSEN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 25, regNo: '25090101026', name: 'MD. AZMOT ALI', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 26, regNo: '25090101027', name: 'AHANAF ABID', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 27, regNo: '25090101028', name: 'MD. REZAUN NABI RAZIN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 28, regNo: '25090101029', name: 'MD. ARIF HOSSEN MITHUN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 29, regNo: '25090101030', name: 'MD. FARHAN SHAHARIAR', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 30, regNo: '24090101020', name: 'MD. SHAHARIAYAR AHMED', department: 'Yarn Engineering', remarks: 'Readmitted from Session 2023-24' },

  // ========================================================
  // FABRIC ENGINEERING (29 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: '25090201001', name: 'MD. AMIR HAMZA JOY', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 2, regNo: '25090201002', name: 'MD. TASDIKUL HASAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 3, regNo: '25090201003', name: 'MD. NAZIUR ISLAM NISSAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 4, regNo: '25090201004', name: 'MD. ASRAFUL ISLAM SAKIB', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 5, regNo: '25090201005', name: 'SHEEKH MD. FORID RAHMAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 6, regNo: '25090201006', name: 'ESTIAS HASSAN EMON', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 7, regNo: '25090201007', name: 'ANIRUDDHO SARKAR', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 8, regNo: '25090201008', name: 'MD. AMINUL ISLAM', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 9, regNo: '25090201009', name: 'MD. SIAMUR RAHAMAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 10, regNo: '25090201010', name: 'MST. SHARMIN AKTER', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 11, regNo: '25090201011', name: 'MST. ANIKA ISLAM TONNI', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 12, regNo: '25090201012', name: 'MASUM SHAHRIAR', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 13, regNo: '25090201013', name: 'MD. ABUL HASNAT MRIDHA', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 14, regNo: '25090201014', name: 'PARIKKHIT CHANDRO', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 15, regNo: '25090201015', name: 'MD. KHAN JAHAN ALI SHAKK', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 16, regNo: '25090201016', name: 'MD. RASEL MONDOL', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 17, regNo: '25090201017', name: 'ABU ZAHAD SUMON', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 18, regNo: '25090201018', name: 'MD. HIMEL HAQUE', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 19, regNo: '25090201019', name: 'MD. HASANUZZAMAN GALIB', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 20, regNo: '25090201020', name: 'MD. FAHIM RIYAD SOJIB', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 21, regNo: '25090201021', name: 'AZADI HASNAT', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 22, regNo: '25090201022', name: 'MD. SAHARIAR HOSSEIN SHOBUS', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 23, regNo: '25090201023', name: 'MD. AFRIDI ALAM FAHIM', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 24, regNo: '25090201025', name: 'SWAPTAK SUMAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 25, regNo: '25090201026', name: 'MST. FAHMIDA KHANOM TULY', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 26, regNo: '25090201027', name: 'MD. KAMAL MAHMUD KAJOL', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 27, regNo: '25090201028', name: 'MD. TOYABUR ISLAM', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 28, regNo: '24090201003', name: 'MD. MUZIBUL ALAM CHOWDHURY', department: 'Fabric Engineering', remarks: 'Readmitted from Session 2023-24' },
  { deptSlNo: 29, regNo: '24090201023', name: 'SM SAMIUL HASAN', department: 'Fabric Engineering', remarks: 'Readmitted from Session 2023-24' },

  // ========================================================
  // WET PROCESS ENGINEERING (27 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: '25090301001', name: 'MD. SHEHAB SHADIK SHUVO', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 2, regNo: '25090301002', name: 'AL FAYSAL AHMMED', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 3, regNo: '25090301003', name: 'ANAYET HOSEN SONET', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 4, regNo: '25090301004', name: 'AHNAF SHARIAR AHMED', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 5, regNo: '25090301005', name: 'DURJOY AHAMED TITAS', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 6, regNo: '25090301006', name: 'MD. ABIR HASSAN MONDOL', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 7, regNo: '25090301007', name: 'ELLIUS UDDIN RABBI', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 8, regNo: '25090301008', name: 'MD. MOSTOFA KAMAL', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 9, regNo: '25090301009', name: 'MD. KOWSER ALI', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 10, regNo: '25090301010', name: 'MD. NAZMUL HAQUE NOBIN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 11, regNo: '25090301011', name: 'MD. MAFIK AL AMIN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 12, regNo: '25090301012', name: 'MD. AL HASIB', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 13, regNo: '25090301013', name: 'MD. SHAFIUL ISLAM SHAKIB', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 14, regNo: '25090301014', name: 'MARJUK MUTTAQI', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 15, regNo: '25090301015', name: 'ABID HASAN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 16, regNo: '25090301018', name: 'MST. TUNAZZINA AKTER', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 17, regNo: '25090301019', name: 'MD. AL-AMIN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 18, regNo: '25090301020', name: 'MD. MEHEDY HASAN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 19, regNo: '25090301021', name: 'VOKTO KUMAR DAS', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 20, regNo: '25090301022', name: 'SAIFUR RAHMAN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 21, regNo: '25090301023', name: 'MD. ABDULLAH AL MAMUN HRIDOY', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 22, regNo: '25090301024', name: 'MD. ABRAR JAHIN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 23, regNo: '25090301025', name: 'MD. ASADUJJAMAN ASAD', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 24, regNo: '25090301026', name: 'M. R. A. FOZLE RABBI', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 25, regNo: '25090301027', name: 'MD. SALEQUR RAHMAN SAMI', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 26, regNo: '25090301028', name: 'MD. RAFIUL ISLAM KOUSHIK', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 27, regNo: '25090301030', name: 'MD. ATIKULLAH ARSHAD', department: 'Wet Process Engineering', remarks: '' },

  // ========================================================
  // APPAREL ENGINEERING (28 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: '25090401001', name: 'MD. EYAQUIB ALI', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 2, regNo: '25090401002', name: 'MST. SHABRINA AFRIN TOMA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 3, regNo: '25090401003', name: 'MD. SIFAT MUSTAKIM', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 4, regNo: '25090401005', name: 'MOST. JAME KHATUN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 5, regNo: '25090401006', name: 'MST. NAHID MUHAJABIN BUSRA NOVA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 6, regNo: '25090401007', name: 'DURJOY CHANDRA ROY', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 7, regNo: '25090401009', name: 'JOYSREE RANI RAY KONA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 8, regNo: '25090401010', name: 'SHAIKH IMROZ MOHAMMAD', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 9, regNo: '25090401011', name: 'MD. FORIDUL ISLAM FAHIM', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 10, regNo: '25090401012', name: 'MD. ABU SAEEM', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 11, regNo: '25090401013', name: 'MD. NURULLAH BIN SIDDIK', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 12, regNo: '25090401014', name: 'MOST. SADIA AFROZ', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 13, regNo: '25090401015', name: 'MD. ARIFUL ISLAM', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 14, regNo: '25090401016', name: 'MD. SHEHAB AL IMRAN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 15, regNo: '25090401017', name: 'MD. MORSALIN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 16, regNo: '25090401018', name: 'SHARIFUL ISLAM SHRABON', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 17, regNo: '25090401019', name: 'MD. AL MOKTADIR', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 18, regNo: '25090401020', name: 'MD. MARUF HASAN ROJOB', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 19, regNo: '25090401021', name: 'MOST. MAHFUZA AKTER MOU', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 20, regNo: '25090401022', name: 'MD. MOSADDIKUR RAHMAN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 21, regNo: '25090401023', name: 'MST. TURFATU NAZZINA ISLAM SEJUTI', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 22, regNo: '25090401024', name: 'MD. SHOHAG HASAN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 23, regNo: '25090401025', name: 'THALHA IBNAY MOSTAFIZ MD. THAHA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 24, regNo: '25090401026', name: 'ABDULLAH AN NUR', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 25, regNo: '25090401027', name: 'MD. RASEL ISLAM', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 26, regNo: '25090401028', name: 'MD. HUZZAD HOSSAIN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 27, regNo: '25090401029', name: 'MD. SHOJEEB SHORDER', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 28, regNo: '24090401015', name: 'SHIMUL CHANDRA SARKAR', department: 'Apparel Engineering', remarks: 'Readmitted from Session 2023-24' }
];

console.log(`Total 7th Batch raw students: ${rawSeventhBatchData.length}`);

const deptBnMap = {
  'Yarn Engineering': 'ইয়ার্ন ইঞ্জিনিয়ারিং',
  'Fabric Engineering': 'ফ্যাব্রিক ইঞ্জিনিয়ারিং',
  'Wet Process Engineering': 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং',
  'Apparel Engineering': 'অ্যাপারেল ইঞ্জিনিয়ারিং'
};

const START_SERIAL = 601; // 1st (1-109), 2nd (110-222), 3rd (223-320), 4th (321-405), 5th (406-512), 6th (513-600)

const seventhBatchStudents = rawSeventhBatchData.map((std, idx) => {
  const serialNo = START_SERIAL + idx;
  const batchSlNo = idx + 1;
  let session = '2024-2025';
  if (std.remarks.includes('2023-24')) session = '2023-2024';

  return {
    id: `std-${std.regNo}`,
    serialNo,
    batchSlNo,
    deptSlNo: std.deptSlNo,
    regNo: std.regNo,
    name: std.name,
    nameBn: std.name,
    department: std.department,
    deptBn: deptBnMap[std.department] || std.department,
    batch: '7th Batch (2024-25)',
    session,
    year: 'Undergraduate / 7th Batch',
    studentType: 'Undergraduate',
    currentJob: '',
    currentLocation: '',
    bloodGroup: '',
    phone: '',
    email: '',
    avatar: '',
    role: '7th Batch Member',
    status: 'Undergraduate',
    remarks: std.remarks || '',
    activities: ''
  };
});

const outputPath = path.resolve(projectRoot, 'src', 'data', 'seventhBatchStudents.js');
const fileContent = `export const SEVENTH_BATCH_STUDENTS = ${JSON.stringify(seventhBatchStudents, null, 2)};\n`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`Successfully generated ${seventhBatchStudents.length} 7th Batch students at ${outputPath}`);
