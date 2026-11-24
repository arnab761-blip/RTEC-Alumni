import * as XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { FIRST_BATCH_STUDENTS } from '../src/data/firstBatchStudents.js';
import { SECOND_BATCH_STUDENTS } from '../src/data/secondBatchStudents.js';
import { THIRD_BATCH_STUDENTS } from '../src/data/thirdBatchStudents.js';
import { FOURTH_BATCH_STUDENTS } from '../src/data/fourthBatchStudents.js';
import { FIFTH_BATCH_STUDENTS } from '../src/data/fifthBatchStudents.js';
import { SIXTH_BATCH_STUDENTS } from '../src/data/sixthBatchStudents.js';
import { SEVENTH_BATCH_STUDENTS } from '../src/data/seventhBatchStudents.js';
import { EIGHTH_BATCH_STUDENTS } from '../src/data/eighthBatchStudents.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const masterExcelPath = path.join(projectRoot, 'RTEC_Students_Master.xlsx');
const publicExcelPath = path.join(projectRoot, 'public', 'RTEC_Students_Master.xlsx');
const firstBatchExcelPath = path.join(projectRoot, 'RTEC_1st_Batch_Students_2018-19.xlsx');
const publicFirstBatchExcelPath = path.join(projectRoot, 'public', 'RTEC_1st_Batch_Students_2018-19.xlsx');
const secondBatchExcelPath = path.join(projectRoot, 'RTEC_2nd_Batch_Students_2019-20.xlsx');
const publicSecondBatchExcelPath = path.join(projectRoot, 'public', 'RTEC_2nd_Batch_Students_2019-20.xlsx');
const thirdBatchExcelPath = path.join(projectRoot, 'RTEC_3rd_Batch_Students_2020-21.xlsx');
const publicThirdBatchExcelPath = path.join(projectRoot, 'public', 'RTEC_3rd_Batch_Students_2020-21.xlsx');
const fourthBatchExcelPath = path.join(projectRoot, 'RTEC_4th_Batch_Students_2021-22.xlsx');
const publicFourthBatchExcelPath = path.join(projectRoot, 'public', 'RTEC_4th_Batch_Students_2021-22.xlsx');
const fifthBatchExcelPath = path.join(projectRoot, 'RTEC_5th_Batch_Students_2022-23.xlsx');
const publicFifthBatchExcelPath = path.join(projectRoot, 'public', 'RTEC_5th_Batch_Students_2022-23.xlsx');
const sixthBatchExcelPath = path.join(projectRoot, 'RTEC_6th_Batch_Students_2023-24.xlsx');
const publicSixthBatchExcelPath = path.join(projectRoot, 'public', 'RTEC_6th_Batch_Students_2023-24.xlsx');
const seventhBatchExcelPath = path.join(projectRoot, 'RTEC_7th_Batch_Students_2024-25.xlsx');
const publicSeventhBatchExcelPath = path.join(projectRoot, 'public', 'RTEC_7th_Batch_Students_2024-25.xlsx');
const eighthBatchExcelPath = path.join(projectRoot, 'RTEC_8th_Batch_Students_2025-26.xlsx');
const publicEighthBatchExcelPath = path.join(projectRoot, 'public', 'RTEC_8th_Batch_Students_2025-26.xlsx');

const allStudents = [
  ...FIRST_BATCH_STUDENTS,
  ...SECOND_BATCH_STUDENTS,
  ...THIRD_BATCH_STUDENTS,
  ...FOURTH_BATCH_STUDENTS,
  ...FIFTH_BATCH_STUDENTS,
  ...SIXTH_BATCH_STUDENTS,
  ...SEVENTH_BATCH_STUDENTS,
  ...EIGHTH_BATCH_STUDENTS
];

console.log(`Generating Master Excel for:`);
console.log(`- 1st Batch: ${FIRST_BATCH_STUDENTS.length} students`);
console.log(`- 2nd Batch: ${SECOND_BATCH_STUDENTS.length} students`);
console.log(`- 3rd Batch: ${THIRD_BATCH_STUDENTS.length} students`);
console.log(`- 4th Batch: ${FOURTH_BATCH_STUDENTS.length} students`);
console.log(`- 5th Batch: ${FIFTH_BATCH_STUDENTS.length} students`);
console.log(`- 6th Batch: ${SIXTH_BATCH_STUDENTS.length} students`);
console.log(`- 7th Batch: ${SEVENTH_BATCH_STUDENTS.length} students`);
console.log(`- 8th Batch: ${EIGHTH_BATCH_STUDENTS.length} students`);
console.log(`- Grand Total: ${allStudents.length} students`);

const colsConfig = [
  { wch: 6 },  // SL
  { wch: 8 },  // Dept_SL
  { wch: 18 }, // Exam_Roll_RegNo
  { wch: 12 }, // Student_ID
  { wch: 16 }, // Admission_Merit
  { wch: 32 }, // Student_Name
  { wch: 25 }, // Department
  { wch: 25 }, // Department_BN
  { wch: 22 }, // Batch
  { wch: 14 }, // Session
  { wch: 16 }, // Student_Type
  { wch: 28 }, // Current_Job
  { wch: 20 }, // Job_Location
  { wch: 13 }, // Blood_Group
  { wch: 16 }, // Phone
  { wch: 28 }, // Email
  { wch: 24 }  // Remarks
];

// Helper to format rows for Excel
const formatRows = (list) => {
  return list.map(s => ({
    'SL': s.serialNo,
    'Dept_SL': s.deptSlNo,
    'Exam_Roll_RegNo': s.regNo || s.studentId,
    'Student_ID': s.studentId || '',
    'Admission_Merit': s.merit || '',
    'Student_Name': s.name,
    'Department': s.department,
    'Department_BN': s.deptBn,
    'Batch': s.batch,
    'Session': s.session,
    'Student_Type': s.studentType || (s.batch && (s.batch.includes('4th') || s.batch.includes('5th') || s.batch.includes('6th') || s.batch.includes('7th') || s.batch.includes('8th')) ? 'Undergraduate' : 'Graduate'),
    'Current_Job': s.currentJob || '',
    'Job_Location': s.currentLocation || '',
    'Blood_Group': s.bloodGroup || '',
    'Phone': s.phone || '',
    'Email': s.email || '',
    'Remarks': s.remarks || ''
  }));
};

// 1. MASTER WORKBOOK (Contains All Students, Per Batch Sheets, Per Dept Sheets)
const wbMaster = XLSX.utils.book_new();

// Sheet 1: All Students
const wsAll = XLSX.utils.json_to_sheet(formatRows(allStudents));
wsAll['!cols'] = colsConfig;
XLSX.utils.book_append_sheet(wbMaster, wsAll, 'All_834_Students');

// Sheet 2: 1st Batch
const ws1st = XLSX.utils.json_to_sheet(formatRows(FIRST_BATCH_STUDENTS));
ws1st['!cols'] = colsConfig;
XLSX.utils.book_append_sheet(wbMaster, ws1st, '1st_Batch_2018-19');

// Sheet 3: 2nd Batch
const ws2nd = XLSX.utils.json_to_sheet(formatRows(SECOND_BATCH_STUDENTS));
ws2nd['!cols'] = colsConfig;
XLSX.utils.book_append_sheet(wbMaster, ws2nd, '2nd_Batch_2019-20');

// Sheet 4: 3rd Batch
const ws3rd = XLSX.utils.json_to_sheet(formatRows(THIRD_BATCH_STUDENTS));
ws3rd['!cols'] = colsConfig;
XLSX.utils.book_append_sheet(wbMaster, ws3rd, '3rd_Batch_2020-21');

// Sheet 5: 4th Batch
const ws4th = XLSX.utils.json_to_sheet(formatRows(FOURTH_BATCH_STUDENTS));
ws4th['!cols'] = colsConfig;
XLSX.utils.book_append_sheet(wbMaster, ws4th, '4th_Batch_2021-22');

// Sheet 6: 5th Batch
const ws5th = XLSX.utils.json_to_sheet(formatRows(FIFTH_BATCH_STUDENTS));
ws5th['!cols'] = colsConfig;
XLSX.utils.book_append_sheet(wbMaster, ws5th, '5th_Batch_2022-23');

// Sheet 7: 6th Batch
const ws6th = XLSX.utils.json_to_sheet(formatRows(SIXTH_BATCH_STUDENTS));
ws6th['!cols'] = colsConfig;
XLSX.utils.book_append_sheet(wbMaster, ws6th, '6th_Batch_2023-24');

// Sheet 8: 7th Batch
const ws7th = XLSX.utils.json_to_sheet(formatRows(SEVENTH_BATCH_STUDENTS));
ws7th['!cols'] = colsConfig;
XLSX.utils.book_append_sheet(wbMaster, ws7th, '7th_Batch_2024-25');

// Sheet 9: 8th Batch
const ws8th = XLSX.utils.json_to_sheet(formatRows(EIGHTH_BATCH_STUDENTS));
ws8th['!cols'] = colsConfig;
XLSX.utils.book_append_sheet(wbMaster, ws8th, '8th_Batch_2025-26');

// Sheet 9-12: Department Sheets
const departments = [
  { name: 'Yarn_Engineering', label: 'Yarn Engineering' },
  { name: 'Fabric_Engineering', label: 'Fabric Engineering' },
  { name: 'Wet_Process_Engineering', label: 'Wet Process Engineering' },
  { name: 'Apparel_Engineering', label: 'Apparel Engineering' }
];

for (const dept of departments) {
  const deptList = allStudents.filter(s => s.department === dept.label);
  const wsDept = XLSX.utils.json_to_sheet(formatRows(deptList));
  wsDept['!cols'] = colsConfig;
  XLSX.utils.book_append_sheet(wbMaster, wsDept, dept.name);
}

// 2. STANDALONE WORKBOOKS
const makeStandalone = (list, sheetName, filePath, publicPath) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(formatRows(list));
  ws['!cols'] = colsConfig;
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filePath);
  XLSX.writeFile(wb, publicPath);
  console.log(`Saved ${sheetName} to: ${filePath}`);
};

// Ensure public dir exists
const publicDir = path.join(projectRoot, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write master files
XLSX.writeFile(wbMaster, masterExcelPath);
console.log(`Saved master Excel to: ${masterExcelPath}`);

XLSX.writeFile(wbMaster, publicExcelPath);
console.log(`Saved public master Excel to: ${publicExcelPath}`);

// Write batch standalone files
makeStandalone(FIRST_BATCH_STUDENTS, '1st_Batch_2018-19', firstBatchExcelPath, publicFirstBatchExcelPath);
makeStandalone(SECOND_BATCH_STUDENTS, '2nd_Batch_2019-20', secondBatchExcelPath, publicSecondBatchExcelPath);
makeStandalone(THIRD_BATCH_STUDENTS, '3rd_Batch_2020-21', thirdBatchExcelPath, publicThirdBatchExcelPath);
makeStandalone(FOURTH_BATCH_STUDENTS, '4th_Batch_2021-22', fourthBatchExcelPath, publicFourthBatchExcelPath);
makeStandalone(FIFTH_BATCH_STUDENTS, '5th_Batch_2022-23', fifthBatchExcelPath, publicFifthBatchExcelPath);
makeStandalone(SIXTH_BATCH_STUDENTS, '6th_Batch_2023-24', sixthBatchExcelPath, publicSixthBatchExcelPath);
makeStandalone(SEVENTH_BATCH_STUDENTS, '7th_Batch_2024-25', seventhBatchExcelPath, publicSeventhBatchExcelPath);
makeStandalone(EIGHTH_BATCH_STUDENTS, '8th_Batch_2025-26', eighthBatchExcelPath, publicEighthBatchExcelPath);

console.log('Master & Batch Excel files successfully generated!');
