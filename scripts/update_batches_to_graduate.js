import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FIRST_BATCH_STUDENTS } from '../src/data/firstBatchStudents.js';
import { SECOND_BATCH_STUDENTS } from '../src/data/secondBatchStudents.js';
import { THIRD_BATCH_STUDENTS } from '../src/data/thirdBatchStudents.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const transformToGraduate = (list, defaultRole) => {
  return list.map(s => {
    // Clean remarks if it mentions Withheld or Failed
    let remarks = s.remarks || '';
    if (remarks.toLowerCase().includes('failed') || remarks.toLowerCase().includes('withheld')) {
      remarks = '';
    }

    return {
      id: s.id,
      serialNo: s.serialNo,
      batchSlNo: s.batchSlNo || s.deptSlNo,
      deptSlNo: s.deptSlNo,
      regNo: s.regNo,
      name: s.name,
      nameBn: s.nameBn || s.name,
      department: s.department,
      deptBn: s.deptBn,
      batch: s.batch,
      session: s.session,
      year: 'Graduate / ' + s.batch.split(' ')[0] + ' Batch',
      studentType: 'Graduate',
      currentJob: s.currentJob || '',
      currentLocation: s.currentLocation || '',
      bloodGroup: s.bloodGroup || '',
      phone: s.phone || '',
      email: s.email || '',
      avatar: s.avatar || '',
      role: defaultRole,
      status: 'Graduate',
      remarks: remarks,
      activities: s.activities || ''
    };
  });
};

const updated1st = transformToGraduate(FIRST_BATCH_STUDENTS, '1st Batch Graduate');
const updated2nd = transformToGraduate(SECOND_BATCH_STUDENTS, '2nd Batch Graduate');
const updated3rd = transformToGraduate(THIRD_BATCH_STUDENTS, '3rd Batch Graduate');

// Write back to files
fs.writeFileSync(
  path.join(projectRoot, 'src', 'data', 'firstBatchStudents.js'),
  `export const FIRST_BATCH_STUDENTS = ${JSON.stringify(updated1st, null, 2)};\n`,
  'utf-8'
);

fs.writeFileSync(
  path.join(projectRoot, 'src', 'data', 'secondBatchStudents.js'),
  `export const SECOND_BATCH_STUDENTS = ${JSON.stringify(updated2nd, null, 2)};\n`,
  'utf-8'
);

fs.writeFileSync(
  path.join(projectRoot, 'src', 'data', 'thirdBatchStudents.js'),
  `export const THIRD_BATCH_STUDENTS = ${JSON.stringify(updated3rd, null, 2)};\n`,
  'utf-8'
);

console.log('Successfully updated 1st, 2nd, and 3rd Batch data files with studentType: Graduate!');
console.log(`- 1st Batch: ${updated1st.length}`);
console.log(`- 2nd Batch: ${updated2nd.length}`);
console.log(`- 3rd Batch: ${updated3rd.length}`);
console.log(`- Total: ${updated1st.length + updated2nd.length + updated3rd.length}`);
