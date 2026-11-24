import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 107 Examinees of 5th Batch (Session: 2022-23, Level-2 Term-II Exam 2024)
const rawFifthBatchData = [
  // ========================================================
  // YARN ENGINEERING (26 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: '23090101002', name: 'MD. ARMIN ISLAM', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 2, regNo: '23090101004', name: 'RAJESH TALUKDER', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 3, regNo: '23090101005', name: 'MD. RAKIBUL ISLAM RAKIB', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 4, regNo: '23090101006', name: 'MOST. MOBASSHIRA AKTER MILI', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 5, regNo: '23090101008', name: 'MD. JAHIRUL ISLAM', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 6, regNo: '23090101010', name: 'MD. RAAD SHAHMAT', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 7, regNo: '23090101013', name: 'MD. MEHEDI HASSAN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 8, regNo: '23090101015', name: 'MD. ABDUR ROUF CHOWDHURY', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 9, regNo: '23090101016', name: 'MD. ABDUR RAHMAN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 10, regNo: '23090101017', name: 'MD. JAKIR HOSSAIN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 11, regNo: '23090101018', name: 'MD. ZANNATUL ISLAM SHIHAB', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 12, regNo: '23090101019', name: 'MD. NASHIM UDDIN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 13, regNo: '23090101022', name: 'MST. TASMIM AKTER MIM', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 14, regNo: '23090101023', name: 'MD. SHAJID HASAN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 15, regNo: '23090101024', name: 'NIBASH CHANDRO MOHONTO', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 16, regNo: '23090101025', name: 'ZARIN TASNIM', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 17, regNo: '23090101026', name: 'MD. AHSAN HABIB', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 18, regNo: '23090101027', name: 'MD. SAHID HASAN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 19, regNo: '23090101028', name: 'MD. KABEL HOSSAIN', department: 'Yarn Engineering', remarks: '' },
  { deptSlNo: 20, regNo: '22090101004', name: 'MD. SAMIUL ISLAM', department: 'Yarn Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 21, regNo: '22090101005', name: 'MD. ASHIKUR RAHMAN', department: 'Yarn Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 22, regNo: '22090101007', name: 'MD. ASADULLAH AL GALIB', department: 'Yarn Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 23, regNo: '22090101010', name: 'MD. RAKIBUL ISLAM', department: 'Yarn Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 24, regNo: '22090101025', name: 'BEHROOZ IBNE SHAHID', department: 'Yarn Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 25, regNo: '22090101018', name: 'MD. AL-AMIN ISLAM', department: 'Yarn Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 26, regNo: '22090101021', name: 'MD. MEHEDI HASAN', department: 'Yarn Engineering', remarks: 'Readmitted from Session 2021-22' },

  // ========================================================
  // FABRIC ENGINEERING (26 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: '23090201003', name: 'MD. RAKIBUL ISLAM POLOK', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 2, regNo: '23090201004', name: 'ARPONA ROY', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 3, regNo: '23090201005', name: 'MD. TANZIM MAHAMUD', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 4, regNo: '23090201006', name: 'APURBO KUMAR ROY', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 5, regNo: '23090201007', name: 'MD. RAKIBUL ISLAM', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 6, regNo: '23090201008', name: 'AMIT HASAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 7, regNo: '23090201009', name: 'NITAI CHANDRO ROY', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 8, regNo: '23090201010', name: 'MD. JUBAYER ISLAM', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 9, regNo: '23090201011', name: 'MD. HADIUL UMAM SINHA', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 10, regNo: '23090201012', name: 'MD. SIHAB HOSSEN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 11, regNo: '23090201013', name: 'MD. REZWANUL ISLAM', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 12, regNo: '23090201015', name: 'MOHAMMAD ALI', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 13, regNo: '23090201016', name: 'MD. SIFAT MONDOL', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 14, regNo: '23090201018', name: 'MD. HASANUZZAMAN HASIB', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 15, regNo: '23090201020', name: 'MD. TAHMIDUL ISLAM ARNAB', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 16, regNo: '23090201021', name: 'ASMA ULL HUSNA', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 17, regNo: '23090201022', name: 'AFIA TABASSUM SHUCHI', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 18, regNo: '23090201023', name: 'RONI ROY', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 19, regNo: '23090201024', name: 'AVISHIKTA SARKER PUJA', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 20, regNo: '23090201026', name: 'MD. SAJID RAHMAN', department: 'Fabric Engineering', remarks: '' },
  { deptSlNo: 21, regNo: '22090201003', name: 'MD. SIAM MAHAMUD', department: 'Fabric Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 22, regNo: '22090201017', name: 'PARTHO PROTIM SARKER', department: 'Fabric Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 23, regNo: '22090201025', name: 'MD. MOSTAKIM BILLA SIAM', department: 'Fabric Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 24, regNo: '22090201030', name: 'SUMON PAHAN', department: 'Fabric Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 25, regNo: 'R202112020', name: 'MD. RASHIDUL ISLAM', department: 'Fabric Engineering', remarks: 'Readmitted from Session 2020-21' },
  { deptSlNo: 26, regNo: 'R202112014', name: 'MANAM MORSHERD', department: 'Fabric Engineering', remarks: 'Readmitted from Session 2020-21' },

  // ========================================================
  // WET PROCESS ENGINEERING (35 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: '23090301001', name: 'MD. NEFAUR RAHMAN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 2, regNo: '23090301002', name: 'NADIM BABU', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 3, regNo: '23090301003', name: 'MD. RABIUL ISLAM', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 4, regNo: '23090301004', name: 'MD. MIRAJ SARDER', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 5, regNo: '23090301005', name: 'MD. SHAMEEM AHOSAN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 6, regNo: '23090301006', name: 'MD. JAKIR ISLAM', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 7, regNo: '23090301007', name: 'MD. TANJILUR RAHMAN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 8, regNo: '23090301008', name: 'MD. FAZLE RABBI ARAFAT', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 9, regNo: '23090301009', name: 'MD. RABIUZZAMAN MIA', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 10, regNo: '23090301010', name: 'MOST. NUSRAT ISLAM OYSHEE', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 11, regNo: '23090301011', name: 'MD. SHAWON MIA', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 12, regNo: '23090301012', name: 'QURAISHI RAKIN ABRAR', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 13, regNo: '23090301015', name: 'ZEBONANANDO RAY', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 14, regNo: '23090301016', name: 'DEBA SREE SARKER', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 15, regNo: '23090301017', name: 'MD. AKBAR ALI', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 16, regNo: '23090301018', name: 'ISTIAK AHAMED', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 17, regNo: '23090301019', name: 'MD. MASUD RANA', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 18, regNo: '23090301021', name: 'MURSHALIN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 19, regNo: '23090301022', name: 'SUZON BABU', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 20, regNo: '23090301024', name: 'MD. ASHIKUR RAHMAN', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 21, regNo: '23090301025', name: 'MD. ABU SAYED ALOM', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 22, regNo: '23090301026', name: 'MD. HUMAYUN KABIR', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 23, regNo: '23090301027', name: 'MD. ROBIUL ISLAM', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 24, regNo: '23090301028', name: 'MD. IMTIAJ AHMMAD', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 25, regNo: '23090301029', name: 'MD. MAHMUDUL HASAN JOY', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 26, regNo: '23090301030', name: 'MD. SHOMONNOY HABIB', department: 'Wet Process Engineering', remarks: '' },
  { deptSlNo: 27, regNo: '22090301009', name: 'ZADOB CHANDRA SEN', department: 'Wet Process Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 28, regNo: '22090301019', name: 'MD. MOYDUL ISLAM', department: 'Wet Process Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 29, regNo: '22090301021', name: 'PROBIR SARKAR MISUK', department: 'Wet Process Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 30, regNo: '22090301029', name: 'MD. SHARIAR NAFEES SIYAM', department: 'Wet Process Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 31, regNo: '22090301003', name: 'MD. SHAH IMRAN', department: 'Wet Process Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 32, regNo: '22090301016', name: 'MD. HABIBUL BASHAR', department: 'Wet Process Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 33, regNo: '22090301024', name: 'MD. REJWAN KABIR', department: 'Wet Process Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 34, regNo: '22090301031', name: 'JAHIDUL ALAM', department: 'Wet Process Engineering', remarks: 'Readmitted from Session 2021-22' },
  { deptSlNo: 35, regNo: 'R202113006', name: 'MD. MAHMUDUN NABI SHARABON', department: 'Wet Process Engineering', remarks: 'Readmitted from Session 2020-21' },

  // ========================================================
  // APPAREL ENGINEERING (20 Examinees)
  // ========================================================
  { deptSlNo: 1, regNo: '23090401003', name: 'MST. NAHIDA AKTER', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 2, regNo: '23090401004', name: 'MST. RAFIATUN JANNAT', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 3, regNo: '23090401006', name: 'NABATI SULTANA LAMIYA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 4, regNo: '23090401007', name: 'MST. JANNATARA JOBA', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 5, regNo: '23090401008', name: 'ARFIN JAHAN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 6, regNo: '23090401009', name: 'MAHBUBA AKTHER MISU', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 7, regNo: '23090401010', name: 'SUMAIYA RAHMAN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 8, regNo: '23090401011', name: 'MD. MOSHIUR RAHMAN ANIK', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 9, regNo: '23090401012', name: 'TASNIM BIN ABDUL WADUD', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 10, regNo: '23090401013', name: 'SHAHRIA NAFIZ SHEZAN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 11, regNo: '23090401017', name: 'MD ABDULLAH AL SHAKIB', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 12, regNo: '23090401018', name: 'MD. HASAN ALI', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 13, regNo: '23090401019', name: 'ABU BOKOR SIDDIQUE', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 14, regNo: '23090401022', name: 'MST. FARJANA KHATUN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 15, regNo: '23090401023', name: 'MD. ASSADUZZAMAN BABU', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 16, regNo: '23090401024', name: 'MD. TAWHIDUL ISLAM', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 17, regNo: '23090401025', name: 'MOST. SIDRATUL MOONTAHA NAZI', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 18, regNo: '23090401026', name: 'MD. SA-ADAT HOSSAIN PRODHAN', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 19, regNo: '23090401029', name: 'SOBUJ TIRKI', department: 'Apparel Engineering', remarks: '' },
  { deptSlNo: 20, regNo: '22090401021', name: 'MD. TANVIR AHMMED', department: 'Apparel Engineering', remarks: 'Readmitted from Session 2021-22' }
];

console.log(`Total 5th Batch raw students: ${rawFifthBatchData.length}`);

const deptBnMap = {
  'Yarn Engineering': 'ইয়ার্ন ইঞ্জিনিয়ারিং',
  'Fabric Engineering': 'ফ্যাব্রিক ইঞ্জিনিয়ারিং',
  'Wet Process Engineering': 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং',
  'Apparel Engineering': 'অ্যাপারেল ইঞ্জিনিয়ারিং'
};

const START_SERIAL = 406; // 1st (1-109), 2nd (110-222), 3rd (223-320), 4th (321-405)

const fifthBatchStudents = rawFifthBatchData.map((std, idx) => {
  const serialNo = START_SERIAL + idx;
  const batchSlNo = idx + 1;
  let session = '2022-2023';
  if (std.remarks.includes('2021-22')) session = '2021-2022';
  else if (std.remarks.includes('2020-21')) session = '2020-2021';

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
    batch: '5th Batch (2022-23)',
    session,
    year: 'Undergraduate / 5th Batch',
    studentType: 'Undergraduate',
    currentJob: '',
    currentLocation: '',
    bloodGroup: '',
    phone: '',
    email: '',
    avatar: '',
    role: '5th Batch Member',
    status: 'Undergraduate',
    remarks: std.remarks || '',
    activities: ''
  };
});

const outputPath = path.resolve(projectRoot, 'src', 'data', 'fifthBatchStudents.js');
const fileContent = `export const FIFTH_BATCH_STUDENTS = ${JSON.stringify(fifthBatchStudents, null, 2)};\n`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`Successfully generated ${fifthBatchStudents.length} 5th Batch students at ${outputPath}`);
