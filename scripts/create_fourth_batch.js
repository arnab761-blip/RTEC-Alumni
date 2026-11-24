import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 85 Examinees of 4th Batch (Session: 2021-22, Level-3 Term-II Exam 2024)
const rawFourthBatchData = [
  // ========================================================
  // YARN ENGINEERING (20 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: '22090101001', name: 'SOBUJ DATTA', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 2, regNo: '22090101002', name: 'ABU RAIHAN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 3, regNo: '22090101003', name: 'MD. NUR NOBI ISLAM', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 4, regNo: '22090101006', name: 'SADIA AFRIN BONNY', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 5, regNo: '22090101009', name: 'MD. MAYDUL ISLAM', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 6, regNo: '22090101011', name: 'MD. ARIFUL ISSAM', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 7, regNo: '22090101012', name: 'MD. ZAHID HASAN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 8, regNo: '22090101013', name: 'MD. SHARIF AHAMMED', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 9, regNo: '22090101014', name: 'MD. SHAKIBUL HASAN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 10, regNo: '22090101016', name: 'MOHAMMED ABIR HOSSAIN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 11, regNo: '22090101017', name: 'TABASSUM MASHEAT TUBA', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 12, regNo: '22090101020', name: 'MD. AHMAD ROMAN UDDIN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 13, regNo: '22090101022', name: 'MD. SHAHRIER ISLAM BADHON', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 14, regNo: '22090101023', name: 'MD. MOSTAKIN HOSSAIN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 15, regNo: '22090101024', name: 'MD. RAYHAN MIA', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 16, regNo: '22090101026', name: 'MOSTAKIM ISLAM', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 17, regNo: '22090101027', name: 'ARGHO MOHON GHOSH', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 18, regNo: '22090101028', name: 'MD. ANISUZZAMAN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 19, regNo: '22090101029', name: 'MD. JUBAYER SARKER', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 20, regNo: '22090101030', name: 'JAHID HASAN', department: 'Yarn Engineering', remarks: '' },

  // ========================================================
  // FABRIC ENGINEERING (23 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: '22090201001', name: 'MD. ALIF MONDOL', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 2, regNo: '22090201002', name: 'MD. ABU SAYEM', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 3, regNo: '22090201005', name: 'MISRAT HASAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 4, regNo: '22090201006', name: 'PROTTOY DAS', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 5, regNo: '22090201007', name: 'MD. ABRAR LABIB CHOWDHURY', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 6, regNo: '22090201008', name: 'ZANNATUL FERDAUS', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 7, regNo: '22090201009', name: 'MD. MAINUL ISLAM', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 8, regNo: '22090201010', name: 'MD. EMON HOSSEN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 9, regNo: '22090201011', name: 'MD. ATIK SHAHRIARE', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 10, regNo: '22090201012', name: 'MD. SOHEL RANA', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 11, regNo: '22090201013', name: 'MD. YEAKUB HASAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 12, regNo: '22090201014', name: 'MD. YOUSUF ALI', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 13, regNo: '22090201015', name: 'PALAB ROY', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 14, regNo: '22090201016', name: 'MD. NAHID HASAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 15, regNo: '22090201020', name: 'SUBORNO CHANDRA BARMAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 16, regNo: '22090201021', name: 'SHEFAT ULLAH', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 17, regNo: '22090201022', name: 'FARZANA MITI MOSTOFA', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 18, regNo: '22090201023', name: 'MD. ARIFUL ISLAM', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 19, regNo: '22090201024', name: 'MARUF AHMED', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 20, regNo: '22090201026', name: 'SAIDUL ISLAM RIFAT', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 21, regNo: '22090201027', name: 'MD. LOHAN MONDOL', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 22, regNo: '22090201029', name: 'KOUSHIK CHANDRA SHILL', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 23, regNo: 'R202112008', name: 'SOUROV KUMAR ROY', department: 'Fabric Engineering', remarks: 'Readmitted from Session 2020-21' },

  // ========================================================
  // WET PROCESS ENGINEERING (18 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: '22090301001', name: 'MD. RABIUL ISLAM', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 2, regNo: '22090301002', name: 'SHRABAN ROY', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 3, regNo: '22090301004', name: 'MD. FAZLE RABBY', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 4, regNo: '22090301005', name: 'MD. MUSFIQUR RAHMAN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 5, regNo: '22090301006', name: 'MD. ASHIKUR RAHMAN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 6, regNo: '22090301007', name: 'MD. SAHKHAWAT FAYSAL', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 7, regNo: '22090301008', name: 'MD. NAZIUR RAHMAN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 8, regNo: '22090301011', name: 'SHUVODATTA SANTO', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 9, regNo: '22090301013', name: 'IMTIAZ HASAN ANIK', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 10, regNo: '22090301014', name: 'NUR ALOM', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 11, regNo: '22090301015', name: 'MD. RAKIBUL HASAN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 12, regNo: '22090301020', name: 'SHAHDAT HOSSAIN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 13, regNo: '22090301023', name: 'MD. SHARIF MIA', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 14, regNo: '22090301025', name: 'ASRAFUL ISLAM', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 15, regNo: '22090301027', name: 'MD. TAFRIZUL ISLAM', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 16, regNo: '22090301028', name: 'MD. JOBAER ALAM', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 17, regNo: '22090301030', name: 'MD. AKHTARUZZAMAN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 18, regNo: 'R202113024', name: 'MD. FAKRUL ISLAM SHAH', department: 'Wet Process Engineering', remarks: 'Readmitted from Session 2020-21' },

  // ========================================================
  // APPAREL ENGINEERING (24 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: '22090401002', name: 'MD. SAKIBUL ANAM', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 2, regNo: '22090401004', name: 'MD. MAHFUZ ALAM', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 3, regNo: '22090401005', name: 'JERIN TAJNIN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 4, regNo: '22090401006', name: 'JANOKY RANI', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 5, regNo: '22090401007', name: 'MST. SHAMIMA AKTER MILI', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 6, regNo: '22090401008', name: 'RIFAH TASNIA RAKTI', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 7, regNo: '22090401011', name: 'MUSFIKA MIM', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 8, regNo: '22090401012', name: 'AMINA SIDDIQUA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 9, regNo: '22090401013', name: 'ISRAT JAMILA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 10, regNo: '22090401014', name: 'MST. KANCHI KHATUN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 11, regNo: '22090401015', name: 'MD. TOUHIDUL ISLAM SIAM', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 12, regNo: '22090401016', name: 'AYESHA SIDDIKA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 13, regNo: '22090401017', name: 'RUKAIYA ISLAM RAMA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 14, regNo: '22090401018', name: 'F. R. I JOBA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 15, regNo: '22090401019', name: 'PRETILOTA GHOSH', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 16, regNo: '22090401020', name: 'MD. ABU JOBAYER JIM', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 17, regNo: '22090401022', name: 'MD. ZULFIKAR ALI ZILAN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 18, regNo: '22090401023', name: 'MD. RABIUL ISLAM', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 19, regNo: '22090401024', name: 'MD. AL KADIR', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 20, regNo: '22090401025', name: 'MD. SAJIB ALI', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 21, regNo: '22090401026', name: 'EHSAN AHMED SAIKAT', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 22, regNo: '22090401027', name: 'MEHEDI HASAN JIBON', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 23, regNo: '22090401028', name: 'TASNIA KHATUN MIM', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 24, regNo: '22090401030', name: 'MD. JAWADUL ISLAM ZISUN', department: 'Apparel Engineering', remarks: '' }
];

console.log(`Total 4th Batch raw students: ${rawFourthBatchData.length}`);

const deptBnMap = {
  'Yarn Engineering': 'ইয়ার্ন ইঞ্জিনিয়ারিং',
  'Fabric Engineering': 'ফ্যাব্রিক ইঞ্জিনিয়ারিং',
  'Wet Process Engineering': 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং',
  'Apparel Engineering': 'অ্যাপারেল ইঞ্জিনিয়ারিং'
};

const START_SERIAL = 321; // 1st batch (1-109), 2nd batch (110-222), 3rd batch (223-320)

const fourthBatchStudents = rawFourthBatchData.map((std, idx) => {
  const serialNo = START_SERIAL + idx;
  const batchSlNo = idx + 1;
  const session = std.remarks && std.remarks.includes('2020-21') ? '2020-2021' : '2021-2022';
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
    batch: '4th Batch (2021-22)',
    session,
    year: 'Undergraduate / 4th Batch',
    studentType: 'Undergraduate',
    currentJob: '',
    currentLocation: '',
    bloodGroup: '',
    phone: '',
    email: '',
    avatar: '',
    role: '4th Batch Member',
    status: 'Undergraduate',
    remarks: std.remarks || '',
    activities: ''
  };
});

const outputPath = path.resolve(projectRoot, 'src', 'data', 'fourthBatchStudents.js');
const fileContent = `export const FOURTH_BATCH_STUDENTS = ${JSON.stringify(fourthBatchStudents, null, 2)};\n`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`Successfully generated ${fourthBatchStudents.length} 4th Batch students at ${outputPath}`);
