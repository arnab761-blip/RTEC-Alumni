import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const yarnStudents = [
  { studentId: 'Y-01', merit: 1209, name: 'MRITYUNJOY CHANDRA ROY' },
  { studentId: 'Y-02', merit: 1214, name: 'MD. SAJID UR RAHMAN' },
  { studentId: 'Y-03', merit: 1226, name: 'S. M. RASHEDUL AMIN RAHI' },
  { studentId: 'Y-04', merit: 1234, name: 'MD. ARIF ISTIAK' },
  { studentId: 'Y-05', merit: 1235, name: 'MD. ATIK HASAN' },
  { studentId: 'Y-06', merit: 1236, name: 'MST. MEGHLA ISLAM MONI' },
  { studentId: 'Y-07', merit: 1237, name: 'MST. MONI AKTER' },
  { studentId: 'Y-08', merit: 1254, name: 'SADMAN SAKIB' },
  { studentId: 'Y-09', merit: 1271, name: 'MST. ASMAUL HUSNA MARUFA' },
  { studentId: 'Y-10', merit: 1273, name: 'SHABRINA JAHIN OISHEY' },
  { studentId: 'Y-11', merit: 1274, name: 'HRIDOY KUMAR ROY' },
  { studentId: 'Y-12', merit: 1275, name: 'MD. NISAR UDDIN NIYAZ' },
  { studentId: 'Y-13', merit: 1284, name: 'MD. NADIM HOSSAIN' },
  { studentId: 'Y-14', merit: 1294, name: 'MD. NOYON' },
  { studentId: 'Y-15', merit: 1295, name: 'MD. MOJAMMEL HOSSEN' },
  { studentId: 'Y-16', merit: 1296, name: 'MD. BIPLOB SARKAR' },
  { studentId: 'Y-17', merit: 1297, name: 'JOY KUMAR MONDOL' },
  { studentId: 'Y-18', merit: 1316, name: 'MST. SUMAIYA YESMIN' },
  { studentId: 'Y-19', merit: 1327, name: 'MST. ISHRAT JAHAN NURTAJ' },
  { studentId: 'Y-20', merit: 1353, name: 'DEVOBROTO SARKER' },
  { studentId: 'Y-21', merit: 1356, name: 'MOST. SUMAIYA FERDOUS' },
  { studentId: 'Y-22', merit: 1378, name: 'ALMAS JAHIN APON' },
  { studentId: 'Y-23', merit: 1379, name: 'MD. JAKIR HOSSAIN' },
  { studentId: 'Y-24', merit: 1390, name: 'PRIAM ROY BISWAS' },
  { studentId: 'Y-25', merit: 1405, name: 'MD. SOHAG MONDOL' },
  { studentId: 'Y-26', merit: 1459, name: 'MD. RUBYAT HASAN RAFI' },
  { studentId: 'Y-27', merit: 1471, name: 'ABUL HASAN' },
  { studentId: 'Y-28', merit: 1484, name: 'AFIF AHMED' },
  { studentId: 'Y-29', merit: 1667, name: 'SHARON AICH' },
  { studentId: 'Y-30', merit: 1670, name: 'MD. ARJU SHEIKH' }
];

const fabricStudents = [
  { studentId: 'F-01', merit: 967, name: 'MD. MAHMUDUL RAFI' },
  { studentId: 'F-02', merit: 980, name: 'MD. NAHID MORSHED' },
  { studentId: 'F-03', merit: 981, name: 'MD. MASBAUL HAQ-RAFI' },
  { studentId: 'F-04', merit: 984, name: 'MD. RANA BABU' },
  { studentId: 'F-05', merit: 985, name: 'MD. SAJU ISLAM' },
  { studentId: 'F-06', merit: 986, name: 'DELOAR HOSEN' },
  { studentId: 'F-07', merit: 989, name: 'MD. IMRAN' },
  { studentId: 'F-08', merit: 994, name: 'ARIFUL HAQUE SOURAV' },
  { studentId: 'F-09', merit: 1003, name: 'MD. AHOSANUL ISLAM MARUF' },
  { studentId: 'F-10', merit: 1020, name: 'ATKIYA ANIKA' },
  { studentId: 'F-11', merit: 1039, name: 'MST. MUKTI KHATUN' },
  { studentId: 'F-12', merit: 1047, name: 'MD. TOUKIR MIA' },
  { studentId: 'F-13', merit: 1057, name: 'MD. AMIR HAMJA' },
  { studentId: 'F-14', merit: 1075, name: 'MD. SHAKIBUL HASAN' },
  { studentId: 'F-15', merit: 1110, name: 'MD. NAHID HOSSEN' },
  { studentId: 'F-16', merit: 1111, name: 'MD. SAHED' },
  { studentId: 'F-17', merit: 1113, name: 'MOST. ANTARA LABIBA KOTHIKA' },
  { studentId: 'F-18', merit: 1135, name: 'MD. SHAHRIAR KABIR SRABON' },
  { studentId: 'F-19', merit: 1136, name: 'TOPU SEN' },
  { studentId: 'F-20', merit: 1139, name: 'MD. REDOWAN ISLAM' },
  { studentId: 'F-21', merit: 1155, name: 'SOVON NONDI SOURAV' },
  { studentId: 'F-22', merit: 1165, name: 'MD. NUR MOHAMMAD JIM' },
  { studentId: 'F-23', merit: 1166, name: 'MST. SUMIYA AKTER SUMI' },
  { studentId: 'F-24', merit: 1168, name: 'MOST. MADHURY ZAHAN BUSRA' },
  { studentId: 'F-25', merit: 1176, name: 'MD. FAZLA RABBI' },
  { studentId: 'F-26', merit: 1184, name: 'MD. RONY ISLAM' },
  { studentId: 'F-27', merit: 1188, name: 'MEHEDI HASAN RAFI' },
  { studentId: 'F-28', merit: 1205, name: 'RIAJUL ISLAM RATUL' },
  { studentId: 'F-29', merit: 1207, name: 'MD. JAFOR SADIK CHOWDHURY' },
  { studentId: 'F-30', merit: 1208, name: 'MOUMITA SIRAJ' }
];

const wetProcessStudents = [
  { studentId: 'W-01', merit: 129, name: 'SHAH MD. ATIK MORSHED' },
  { studentId: 'W-02', merit: 168, name: 'MD. BELAYET HOSSAIN' },
  { studentId: 'W-03', merit: 245, name: 'SADAT HASAN NIROB' },
  { studentId: 'W-04', merit: 278, name: 'KHONDAKER SAKIB HASAN' },
  { studentId: 'W-05', merit: 353, name: 'MD. SALIHIN SHEIKH SHIFAT' },
  { studentId: 'W-06', merit: 496, name: 'MD. ABU TALEB' },
  { studentId: 'W-07', merit: 526, name: 'TASNIA TABUSSUM PAPRI' },
  { studentId: 'W-08', merit: 567, name: 'MD. MASUD PARVEZ SAIKAT' },
  { studentId: 'W-09', merit: 568, name: 'MAHEZABIN' },
  { studentId: 'W-10', merit: 591, name: 'MD. ABDULLAH NOMAN SAJOL' },
  { studentId: 'W-11', merit: 613, name: 'MD. TAWHED PRAMANIK' },
  { studentId: 'W-12', merit: 641, name: 'MD. SHADHIN WAZED' },
  { studentId: 'W-13', merit: 675, name: 'A. SM. FAREHA BYZID' },
  { studentId: 'W-14', merit: 676, name: 'MD. AHASANUL HOQE RIDOY' },
  { studentId: 'W-15', merit: 712, name: 'SHOWROV KUNDU' },
  { studentId: 'W-16', merit: 716, name: 'MD. ZUBAYER ALI' },
  { studentId: 'W-17', merit: 719, name: 'ANIKA SHUCHI' },
  { studentId: 'W-18', merit: 725, name: 'MD. ABDULLAH SHAHEEN' },
  { studentId: 'W-19', merit: 741, name: 'MD. REJOAN MIA' },
  { studentId: 'W-20', merit: 743, name: 'KAWSAR AHMED' },
  { studentId: 'W-21', merit: 745, name: 'MD. FARHAN FORID' },
  { studentId: 'W-22', merit: 773, name: 'MD. SIFAT SHEIK' },
  { studentId: 'W-23', merit: 787, name: 'MD. JAHID HASAN' },
  { studentId: 'W-24', merit: 812, name: 'RAMIT HASAN SUBORNO' },
  { studentId: 'W-25', merit: 816, name: 'MAHERAZ AHMED MAHIN' },
  { studentId: 'W-26', merit: 829, name: 'S. M. RUBAYEDUZZAMAN' },
  { studentId: 'W-27', merit: 830, name: 'MD. MOSTOFA AL AMIN' },
  { studentId: 'W-28', merit: 841, name: 'MD. TANVIRUL ISLAM TAQI' },
  { studentId: 'W-29', merit: 851, name: 'MD. MURAD PARVEG' },
  { studentId: 'W-30', merit: 873, name: 'ABDUR RAHMAN NUR' }
];

const apparelStudents = [
  { studentId: 'A-01', merit: 153, name: 'AMEO ROY' },
  { studentId: 'A-02', merit: 430, name: 'MST. SUMIYA ISRAT' },
  { studentId: 'A-03', merit: 464, name: 'MOST. FAUZIA FARIHA DIA MONI' },
  { studentId: 'A-04', merit: 465, name: 'MST. ABIDA SULTANA' },
  { studentId: 'A-05', merit: 482, name: 'MD. ABU RAYHAN' },
  { studentId: 'A-06', merit: 500, name: 'MOST. MYSHA AKTER METI' },
  { studentId: 'A-07', merit: 523, name: 'TAPOS CHANDRO RAY' },
  { studentId: 'A-08', merit: 612, name: 'BM MUKTADIR' },
  { studentId: 'A-09', merit: 691, name: 'MD. MEZBA-UL-HASAN SHARON' },
  { studentId: 'A-10', merit: 711, name: 'RAFIKA SULTANA RAKA' },
  { studentId: 'A-11', merit: 740, name: 'MD. SOHANUR RAHMAN MONDAL' },
  { studentId: 'A-12', merit: 746, name: 'MOST. RAISA TABASSUM' },
  { studentId: 'A-13', merit: 802, name: 'MST. AMBIA AFRIN KEYA' },
  { studentId: 'A-14', merit: 840, name: 'MD. RAFI ULLAH' },
  { studentId: 'A-15', merit: 849, name: 'MD. K. B. R. HABIB' },
  { studentId: 'A-16', merit: 879, name: 'S. M. SAMIUL ALIM' },
  { studentId: 'A-17', merit: 880, name: 'MOST. FAHMIDA KHATUN ARIFA' },
  { studentId: 'A-18', merit: 890, name: 'MD. ROBIUL ISLAM RAHAT' },
  { studentId: 'A-19', merit: 891, name: 'MD. NURNOBI SARKER' },
  { studentId: 'A-20', merit: 904, name: 'SIYAM' },
  { studentId: 'A-21', merit: 911, name: 'MD. SHOFIULLAH SIHAB' },
  { studentId: 'A-22', merit: 918, name: 'MD. MUSFIQUR RAHMAN SARKER' },
  { studentId: 'A-23', merit: 919, name: 'MD. TANVIR RAZZAK POLOK' },
  { studentId: 'A-24', merit: 921, name: 'MD. SOHAN' },
  { studentId: 'A-25', merit: 922, name: 'MD. KHAIRUL ISLAM SUMON' },
  { studentId: 'A-26', merit: 940, name: 'MD. HUMAYUN AZAD' },
  { studentId: 'A-27', merit: 941, name: 'M. A. MOTIN KOWSARY' },
  { studentId: 'A-28', merit: 942, name: 'MD. TAZUL RAHMAN' },
  { studentId: 'A-29', merit: 945, name: 'MAJEDUL ISLAM' },
  { studentId: 'A-30', merit: 963, name: 'MD. KHALID HASAN' }
];

let globalSerial = 715;
let batchSerial = 1;

const buildStudent = (s, dept, deptBn, deptSl) => {
  return {
    id: `std-8th-${s.studentId}`,
    serialNo: globalSerial++,
    batchSlNo: batchSerial++,
    deptSlNo: deptSl,
    studentId: s.studentId,
    regNo: s.studentId, // As instructed, studentId is placed in regNo column
    merit: s.merit,
    name: s.name,
    nameBn: s.name,
    department: dept,
    deptBn: deptBn,
    batch: '8th Batch (2025-26)',
    session: '2025-2026',
    year: 'Undergraduate / 8th Batch',
    studentType: 'Undergraduate',
    currentJob: '',
    currentLocation: '',
    bloodGroup: '',
    phone: '',
    email: '',
    avatar: '',
    role: '8th Batch Member',
    status: 'Undergraduate (Newly Admitted)',
    remarks: `Merit: ${s.merit}`,
    activities: ''
  };
};

const allEighthBatch = [];

yarnStudents.forEach((s, idx) => {
  allEighthBatch.push(buildStudent(s, 'Yarn Engineering', 'ইয়ার্ন ইঞ্জিনিয়ারিং', idx + 1));
});

fabricStudents.forEach((s, idx) => {
  allEighthBatch.push(buildStudent(s, 'Fabric Engineering', 'ফ্যাব্রিক ইঞ্জিনিয়ারিং', idx + 1));
});

wetProcessStudents.forEach((s, idx) => {
  allEighthBatch.push(buildStudent(s, 'Wet Process Engineering', 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং', idx + 1));
});

apparelStudents.forEach((s, idx) => {
  allEighthBatch.push(buildStudent(s, 'Apparel Engineering', 'অ্যাপারেল ইঞ্জিনিয়ারিং', idx + 1));
});

console.log(`Generated ${allEighthBatch.length} 8th batch students. Serial range: 715 to ${globalSerial - 1}`);

const fileContent = `export const EIGHTH_BATCH_STUDENTS = ${JSON.stringify(allEighthBatch, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, '../src/data/eighthBatchStudents.js'), fileContent, 'utf8');
console.log('Saved to src/data/eighthBatchStudents.js successfully.');
