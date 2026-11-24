import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 88 Examinees of 6th Batch (Session: 2023-24, Level-2 Term-I Exam 2025)
const rawSixthBatchData = [
  // ========================================================
  // YARN ENGINEERING (17 Examinees)
  // ========================================================
  { deptSlNo: 3, regNo: '24090101004', name: 'MD. RESADUN NOBI RUDRA', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 4, regNo: '24090101005', name: 'M. M. NAFIUL ISLAM NOSIB', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 5, regNo: '24090101006', name: 'MST. ALIF NUR AKTER SHUROVI', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 6, regNo: '24090101007', name: 'MD. SABBIR HASAN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 7, regNo: '24090101009', name: 'MD. TOHIDURZAMAN TORU', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 8, regNo: '24090101010', name: 'SURAIYA PARVIN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 9, regNo: '24090101011', name: 'MUMTAHINA BINTE MOHIB', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 10, regNo: '24090101012', name: 'NAFIU SHADAD', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 11, regNo: '24090101013', name: 'SUMON KUMAR', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 12, regNo: '24090101014', name: 'SANJIDA FAIROOZ KONA', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 13, regNo: '24090101016', name: 'MST. TASMIM NAHAR', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 14, regNo: '24090101017', name: 'HOSSAIN AHAMMED', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 15, regNo: '24090101018', name: 'MD. ABU NEHAT', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 16, regNo: '24090101021', name: 'MD. RAKIB HOSSAIN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 17, regNo: '24090101023', name: 'MD. TAWSHIN NAWAL NILOY', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 18, regNo: '24090101024', name: 'MD. SHAHRIAR KABIR EMON', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 19, regNo: '23090101021', name: 'MD. MEHEDI HASAN MUNNA', department: 'Yarn Engineering', remarks: 'Readmitted from Session 2022-23' },

  // ========================================================
  // FABRIC ENGINEERING (23 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: '24090201001', name: 'SHUVASISH ROY SHOUROV', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 2, regNo: '24090201004', name: 'SADIA ROSNI RAMISA', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 3, regNo: '24090201005', name: 'MOST. FAHIMA JANNAT', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 4, regNo: '24090201006', name: 'MD. ABDUR RAHMAN SHAEKH', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 5, regNo: '24090201007', name: 'MOST. REFAT JAHAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 6, regNo: '24090201008', name: 'MD. SAMIUL ISLAM', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 7, regNo: '24090201010', name: 'GOWTOM KUMAR RAY', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 8, regNo: '24090201011', name: 'HASNAT JAHAN HEMU', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 9, regNo: '24090201012', name: 'MD. FAHIM FARDOUSH', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 10, regNo: '24090201013', name: 'MD. SHAHAB UDDIN SHUMON', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 11, regNo: '24090201014', name: 'ABDULLAH AL KAWSAR', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 12, regNo: '24090201015', name: 'MD. HASANUR ISLAM', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 13, regNo: '24090201016', name: 'MD. SHAHRIAR PARVEZ NADIM', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 14, regNo: '24090201017', name: 'JOTIRMOY ROY SUMONTO', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 15, regNo: '24090201018', name: 'UMME SADIA AFRIN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 16, regNo: '24090201020', name: 'SHAM SONDOR ROY', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 17, regNo: '24090201021', name: 'DHRITI BARMAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 18, regNo: '24090201025', name: 'MD. ASIF MAHMUD', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 19, regNo: '24090201026', name: 'MD. MEHEDI HASAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 20, regNo: '24090201027', name: 'MD. NUR ISLAM SIDDIQUE', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 21, regNo: '24090201028', name: 'MD. NURUZZAMAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 22, regNo: '24090201029', name: 'SHUVO CHANDRA DAS RUKASH', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 23, regNo: '23090201017', name: 'HRIDAY KUMAR ROY', department: 'Fabric Engineering', remarks: 'Readmitted from Session 2022-23' },

  // ========================================================
  // WET PROCESS ENGINEERING (24 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: '24090301001', name: 'K. M. YOUSUF HASAN BADHON', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 2, regNo: '24090301002', name: 'MD. TANVIR ISLAM SITHON', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 3, regNo: '24090301003', name: 'FERDOUS SAADI', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 4, regNo: '24090301004', name: 'MD. MERAJUL ISLAM', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 5, regNo: '24090301005', name: 'MD. SHAHAJALAL', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 6, regNo: '24090301006', name: 'BADIUZZAMAN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 7, regNo: '24090301008', name: 'MD. SHOHIDUL ISLAM', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 8, regNo: '24090301011', name: 'S. M. YASIN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 9, regNo: '24090301013', name: 'MD. MUSTUK WADUD SOHAG', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 10, regNo: '24090301014', name: 'MD. ASIF SORKER', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 11, regNo: '24090301015', name: 'MD. BAKHTIAR HOSSAIN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 12, regNo: '24090301016', name: 'S. M. TAFSIRUL HASAN NADIM', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 13, regNo: '24090301017', name: 'BILASH CHANDRA PAL', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 14, regNo: '24090301018', name: 'MD. ABU BAKKAR', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 15, regNo: '24090301020', name: 'MD. ABDUL AZIZ', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 16, regNo: '24090301021', name: 'MD. MAHFUZ IBNE AFZAL', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 17, regNo: '24090301022', name: 'MD. ABU SAYED', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 18, regNo: '24090301024', name: 'MD. ABDUS SALAM', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 19, regNo: '24090301026', name: 'MD. SAIED AFRIDI', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 20, regNo: '24090301027', name: 'MD. ARIF ZAWAD', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 21, regNo: '24090301029', name: 'MASUMA MAHJEBIN JUTHI', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 22, regNo: '24090301030', name: 'MST. NISHA AKHTER', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 23, regNo: '23090301014', name: 'MD. ROMIO HASAN', department: 'Wet Process Engineering', remarks: 'Readmitted from Session 2022-23' },
  { deptSlNo: 24, regNo: '23090301023', name: 'MD. ISRAFIL ALAM', department: 'Wet Process Engineering', remarks: 'Readmitted from Session 2022-23' },

  // ========================================================
  // APPAREL ENGINEERING (24 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: '24090401002', name: 'MISHUATU ZANNAT MEGHLA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 2, regNo: '24090401003', name: 'LAMYEA BINTEA LITHE', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 3, regNo: '24090401004', name: 'MD. AMINUR RAHMAN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 4, regNo: '24090401005', name: 'RIPON BABU', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 5, regNo: '24090401006', name: 'MOST. AFIA FARZANA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 6, regNo: '24090401008', name: 'DHRITI DIPON ROY', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 7, regNo: '24090401010', name: 'MUSFIQA TABASSUM', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 8, regNo: '24090401011', name: 'MOST. RINGKY AKTER', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 9, regNo: '24090401013', name: 'AKTARUN NAHAR NITU', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 10, regNo: '24090401014', name: 'MST. SUBARNA YASMIN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 11, regNo: '24090401016', name: 'K. M. MUSTAKIM IMAM NAFEES', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 12, regNo: '24090401017', name: 'MD. ALAMIN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 13, regNo: '24090401018', name: 'MOST. SHAHORIN ZAMAN SHAWON', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 14, regNo: '24090401019', name: 'AYESHA SIDDIKA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 15, regNo: '24090401020', name: 'MD. MARUF HASAN ALIF', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 16, regNo: '24090401021', name: 'FARIA IMROSE TISA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 17, regNo: '24090401022', name: 'MD. NADIMUL HASAN NAHIN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 18, regNo: '24090401023', name: 'ISRAT JAHAN TANNA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 19, regNo: '24090401024', name: 'ZOBAYER AHMED', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 20, regNo: '24090401026', name: 'SAIKAT SARKER', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 21, regNo: '24090401027', name: 'SAMIA RAHMAN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 22, regNo: '24090401028', name: 'SUMAIYA AKTER', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 23, regNo: '24090401029', name: 'MST. MARZIA HAQUE', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 24, regNo: '24090401030', name: 'MST. KHADIJA KHATUN', department: 'Apparel Engineering', remarks: '' }
];

console.log(`Total 6th Batch raw students: ${rawSixthBatchData.length}`);

const deptBnMap = {
  'Yarn Engineering': 'ইয়ার্ন ইঞ্জিনিয়ারিং',
  'Fabric Engineering': 'ফ্যাব্রিক ইঞ্জিনিয়ারিং',
  'Wet Process Engineering': 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং',
  'Apparel Engineering': 'অ্যাপারেল ইঞ্জিনিয়ারিং'
};

const START_SERIAL = 513; // 1st (1-109), 2nd (110-222), 3rd (223-320), 4th (321-405), 5th (406-512)

const sixthBatchStudents = rawSixthBatchData.map((std, idx) => {
  const serialNo = START_SERIAL + idx;
  const batchSlNo = idx + 1;
  let session = '2023-2024';
  if (std.remarks.includes('2022-23')) session = '2022-2023';

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
    batch: '6th Batch (2023-24)',
    session,
    year: 'Undergraduate / 6th Batch',
    studentType: 'Undergraduate',
    currentJob: '',
    currentLocation: '',
    bloodGroup: '',
    phone: '',
    email: '',
    avatar: '',
    role: '6th Batch Member',
    status: 'Undergraduate',
    remarks: std.remarks || '',
    activities: ''
  };
});

const outputPath = path.resolve(projectRoot, 'src', 'data', 'sixthBatchStudents.js');
const fileContent = `export const SIXTH_BATCH_STUDENTS = ${JSON.stringify(sixthBatchStudents, null, 2)};\n`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`Successfully generated ${sixthBatchStudents.length} 6th Batch students at ${outputPath}`);
