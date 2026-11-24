import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 113 Examinees of 2nd Batch (Session: 2019-20, Level-4 Term-II Exam 2023)
const rawSecondBatchData = [
  // ========================================================
  // YARN ENGINEERING (29 Examinees - All Passed)
  // ========================================================
  { deptSlNo: 1, regNo: 'R202011002', name: 'ALIA YASMIN', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 2, regNo: 'R202011004', name: 'MD. MOSTAFIZUR RAHMANM', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 3, regNo: 'R202011005', name: 'MST. FARZANA AKTER', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 4, regNo: 'R202011006', name: 'MUCKNATIS UL ARIFEN KABBIR', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 5, regNo: 'R202011007', name: 'MD. RAKIBUL HASAN', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 6, regNo: 'R202011009', name: 'HABIBUR NABI ARAFAT', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 7, regNo: 'R202011010', name: 'LARISA AHMED OISHI', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 8, regNo: 'R202011011', name: 'ATOSHI BOSU', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 9, regNo: 'R202011012', name: 'REYAD RASHA AHMED', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 10, regNo: 'R202011013', name: 'MST. KHADIZATUL KOBRA', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 11, regNo: 'R202011014', name: 'MEHEDY HASAN SHANTO', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 12, regNo: 'R202011015', name: 'MD. SHOHAG HOSSAIN ADOR', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 13, regNo: 'R202011016', name: 'MD. MAMUN OR RASHID', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 14, regNo: 'R202011017', name: 'MD. EMRAN HOSSAIN', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 15, regNo: 'R202011018', name: 'MD. ASADUZZAMAN', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 16, regNo: 'R202011019', name: 'MD. SUMON ISLAM', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 17, regNo: 'R202011020', name: 'MD. RAKIBUZZAMAN', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 18, regNo: 'R202011022', name: 'MONIRA MOULA', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 19, regNo: 'R202011023', name: 'SUMAIYA MIR', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 20, regNo: 'R202011024', name: 'MST. SADIA NAZNIN RIA', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 21, regNo: 'R202011025', name: 'MD. FARHAN', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 22, regNo: 'R202011026', name: 'JAHEDUL ISLAM', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 23, regNo: 'R202011027', name: 'AKTARUJJAMAN ROBIN', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 24, regNo: 'R202011028', name: 'BAZLUL KARIM', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 25, regNo: 'R202011029', name: 'MD. TASNIMUL HASSAN', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 26, regNo: 'R202011030', name: 'MD. REJOYAN HOQUE', department: 'Yarn Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 27, regNo: 'R201911013', name: 'ABDULLAH SAMIN BIN BASHIR', department: 'Yarn Engineering', result: 'Passed', remarks: 'Readmitted from Session 2018-19' },
  { deptSlNo: 28, regNo: 'R201911014', name: 'ROBIN ACHARJEE', department: 'Yarn Engineering', result: 'Passed', remarks: 'Readmitted from Session 2018-19' },
  { deptSlNo: 29, regNo: 'R201911022', name: 'MD. RABIUL ISLAM RABI', department: 'Yarn Engineering', result: 'Passed', remarks: 'Readmitted from Session 2018-19' },

  // ========================================================
  // FABRIC ENGINEERING (29 Examinees: 27 Passed, 2 Withheld)
  // ========================================================
  { deptSlNo: 1, regNo: 'R202012001', name: 'AHNAF HOSSAIN', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 2, regNo: 'R202012002', name: 'MD. ABU SHAID', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 3, regNo: 'R202012004', name: 'MOHAMMAD ALI SHAKIL', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 4, regNo: 'R202012005', name: 'SANTO LAL PAUL', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 5, regNo: 'R202012009', name: 'MD. ABDULLAH AL HOSSAIN', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 6, regNo: 'R202012010', name: 'MD. NAFIUL ISLAM', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 7, regNo: 'R202012011', name: 'BHUBAN KANTI DEY', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 8, regNo: 'R202012012', name: 'SOMIYA SULTANA JANNAT', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 9, regNo: 'R202012013', name: 'MAHMUD AL HASAN', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 10, regNo: 'R202012014', name: 'MST. FARIA JARIN OMEY', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 11, regNo: 'R202012015', name: 'SHAHRIAR IBNE MAHMUD', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 12, regNo: 'R202012016', name: 'MD. AMIR ALI', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 13, regNo: 'R202012017', name: 'MD. MEEM OBAIDULLA', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 14, regNo: 'R202012018', name: 'MD. AHAMMAD ULLAH', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 15, regNo: 'R202012019', name: 'MD. MAHIN SADIK AYON', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 16, regNo: 'R202012020', name: 'AKANTA KUNDU', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 17, regNo: 'R202012021', name: 'MAHIYA AKTER SHORNA', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 18, regNo: 'R202012022', name: 'MARUF HASAN SHIHAB', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 19, regNo: 'R202012023', name: 'MD. NAHID HASAN NIMU', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 20, regNo: 'R202012024', name: 'MD. ABU IBNASINA RABBY', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 21, regNo: 'R202012025', name: 'MD. TAKVIR ISLAM', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 22, regNo: 'R202012026', name: 'MD. ISHTIAK AHAMMED', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 23, regNo: 'R202012027', name: 'MD. MILON MIA', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 24, regNo: 'R202012028', name: 'SHOWDIA ISLAM', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 25, regNo: 'R202012029', name: 'ABDUL ROKIB', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 26, regNo: 'R202012030', name: 'SADIA TASNIM', department: 'Fabric Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 27, regNo: 'R201912030', name: 'BIPLOB ALI', department: 'Fabric Engineering', result: 'Passed', remarks: 'Readmitted from Session 2018-19' },
  { deptSlNo: 28, regNo: 'R202012003', name: 'MEHEDI HASAN PAVEL', department: 'Fabric Engineering', result: 'Withheld', remarks: 'Withheld: FME, KTG-II, SFP, FTQC' },
  { deptSlNo: 29, regNo: 'R202012006', name: 'MD. ISTIAQUE HOSSAIN ULLASH', department: 'Fabric Engineering', result: 'Withheld', remarks: 'Withheld: KTG-I' },

  // ========================================================
  // WET PROCESS ENGINEERING (27 Examinees: 26 Passed, 1 Withheld)
  // ========================================================
  { deptSlNo: 1, regNo: 'R202013001', name: 'MD. NAHID HASAN', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 2, regNo: 'R202013002', name: 'FAISAL HOSSAIN', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 3, regNo: 'R202013003', name: 'MD. MEHEDI HASAN', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 4, regNo: 'R202013004', name: 'MST. AFSANA AKTER URME', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 5, regNo: 'R202013005', name: 'MOBAROK HOSSAN', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 6, regNo: 'R202013006', name: 'MD. BENJIR ISLAM', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 7, regNo: 'R202013007', name: 'MD. SHAHANUR ALAM', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 8, regNo: 'R202013009', name: 'MD. FARHAD HOSSAIN', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 9, regNo: 'R202013012', name: 'MD. RAUFUL ISLAM', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 10, regNo: 'R202013013', name: 'MD. AREFIN HOSSAIN', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 11, regNo: 'R202013014', name: 'MD. SAMIUL ISLAM', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 12, regNo: 'R202013015', name: 'MD. KAWSAR AZAM', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 13, regNo: 'R202013016', name: 'MD. MOJAHADUL ISLAM', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 14, regNo: 'R202013017', name: 'MD. SONET MIA', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 15, regNo: 'R202013018', name: 'MD. RONY PRAMANIK', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 16, regNo: 'R202013021', name: 'MD. YASIN ARAFAT HIMEL', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 17, regNo: 'R202013022', name: 'MD. NAZMUL ISLAM', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 18, regNo: 'R202013023', name: 'MD. EMRAN HOSSAIN', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 19, regNo: 'R202013024', name: 'MD. KASHEM SHAIKH', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 20, regNo: 'R202013025', name: 'JANNATUL FERDAUS', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 21, regNo: 'R202013026', name: 'MD. FAYSAL MIA', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 22, regNo: 'R202013028', name: 'MD. MARUF HASAN', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 23, regNo: 'R202013029', name: 'SHUVO ROY', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 24, regNo: 'R202013030', name: 'MD. RONY ISLAM', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 25, regNo: 'R202013031', name: 'MD. MINHAZUL ISLAM', department: 'Wet Process Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 26, regNo: 'R201913024', name: 'MD. ARIF ANJUM TOHAMI', department: 'Wet Process Engineering', result: 'Passed', remarks: 'Readmitted from Session 2018-19' },
  { deptSlNo: 27, regNo: 'R202013019', name: 'MD. HASAN ALI SARKAR MOON', department: 'Wet Process Engineering', result: 'Withheld', remarks: 'Withheld: PHY-II' },

  // ========================================================
  // APPAREL ENGINEERING (28 Examinees - All Passed)
  // ========================================================
  { deptSlNo: 1, regNo: 'R202014002', name: 'JANNATUZ FARIA', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 2, regNo: 'R202014004', name: 'SHAH MD. REAJUL ZANNAT ANIK', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 3, regNo: 'R202014005', name: 'MD. AL MAMUN SHIPU', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 4, regNo: 'R202014006', name: 'KAOWSAR MIAH', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 5, regNo: 'R202014007', name: 'MD. SOZOL ALI', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 6, regNo: 'R202014008', name: 'SHEIKH MD. ABU SHAD RAHMAN', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 7, regNo: 'R202014009', name: 'NUR JAHAN RIMA', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 8, regNo: 'R202014010', name: 'MD. ARAFAT ZAHAN TONMOY', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 9, regNo: 'R202014011', name: 'MD. NAHID HASAN', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 10, regNo: 'R202014012', name: 'SHANTA DAS PUJA', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 11, regNo: 'R202014013', name: 'FERDOUSI AKTER', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 12, regNo: 'R202014015', name: 'SHAHAT HASAN SAJIB', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 13, regNo: 'R202014016', name: 'SOURAV KARMOKAR', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 14, regNo: 'R202014017', name: 'SIFAT HOSSAIN', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 15, regNo: 'R202014018', name: 'ARPITA SAHA', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 16, regNo: 'R202014019', name: 'ISRAT JAHAN TULI', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 17, regNo: 'R202014020', name: 'APURBA MONDOL', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 18, regNo: 'R202014021', name: 'SYADA NAJMEE AHMED', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 19, regNo: 'R202014022', name: 'MD. ISMAIL HOSSAIN ARNOB', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 20, regNo: 'R202014023', name: 'ANIKA IBNAT', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 21, regNo: 'R202014025', name: 'MIZANUR RAHMAN', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 22, regNo: 'R202014026', name: 'MD.ASIKUR RAHMAN', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 23, regNo: 'R202014027', name: 'JANNATUL FERDOUS', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 24, regNo: 'R202014028', name: 'MST. HUMAWARA PARVIN', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 25, regNo: 'R202014029', name: 'MD. ARAFAT KHAN PRITOM', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 26, regNo: 'R202014030', name: 'JEBA YASMIN BORSHA', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 27, regNo: 'R202014031', name: 'TAHMINA AKTER', department: 'Apparel Engineering', result: 'Passed', remarks: '' },
  { deptSlNo: 28, regNo: 'R201914016', name: 'MD. FOYSAL MORSHED KHAN', department: 'Apparel Engineering', result: 'Passed', remarks: 'Readmitted from Session 2018-19' }
];

console.log(`Loaded ${rawSecondBatchData.length} records for 2nd Batch.`);

const getDeptBn = (dept) => {
  if (dept.includes('Yarn')) return 'ইয়ার্ন ইঞ্জিনিয়ারিং';
  if (dept.includes('Fabric')) return 'ফ্যাব্রিক ইঞ্জিনিয়ারিং';
  if (dept.includes('Wet')) return 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং';
  if (dept.includes('Apparel')) return 'অ্যাপারেল ইঞ্জিনিয়ারিং';
  return dept;
};

// Start serialNo at 110 (since 1st Batch has 109 students)
const SECOND_BATCH_STUDENTS = rawSecondBatchData.map((item, index) => {
  const serialNo = 110 + index;
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
    batch: '2nd Batch (2019-20)',
    session: '2019-2020',
    year: 'Level-4 Term-II / 2nd Batch',
    bloodGroup: '',
    phone: '',
    email: '',
    avatar: '',
    role: '2nd Batch Member',
    status: item.result,
    result: item.result,
    remarks: item.remarks,
    activities: ''
  };
});

// Write to src/data/secondBatchStudents.js
const destFile = path.join(projectRoot, 'src', 'data', 'secondBatchStudents.js');
const fileContent = `export const SECOND_BATCH_STUDENTS = ${JSON.stringify(SECOND_BATCH_STUDENTS, null, 2)};\n`;

fs.writeFileSync(destFile, fileContent, 'utf-8');
console.log(`Successfully generated: ${destFile}`);

// Verify counts
const depts = {};
SECOND_BATCH_STUDENTS.forEach(s => {
  depts[s.department] = (depts[s.department] || 0) + 1;
});
console.log('Department Breakdown:');
console.table(depts);
