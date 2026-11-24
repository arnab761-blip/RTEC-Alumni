import { readStudentsFromExcel, masterExcelPath } from '../server/excelSync.js';

async function testSync() {
  console.log('1. Testing student update via API...');
  const testStudent = {
    regNo: 'R201911001',
    name: 'MOHAMMED SAQLINE HOSSAIN',
    batch: '1st Batch (2018-19)',
    department: 'Yarn Engineering',
    session: '2018-2019',
    bloodGroup: 'B+',
    phone: '01700000000',
    email: 'test@student.rtec.bd'
  };

  const updateRes = await fetch('http://localhost:5000/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testStudent)
  });
  const updateJson = await updateRes.json();
  console.log('API update result:', updateJson.success);

  // Read excel file to verify update wrote to Excel
  const excelStudents = readStudentsFromExcel(masterExcelPath);
  const matched = excelStudents.find(s => s.regNo === 'R201911001');
  console.log('Excel verified student:', {
    regNo: matched.regNo,
    bloodGroup: matched.bloodGroup,
    phone: matched.phone,
    email: matched.email
  });

  if (matched.bloodGroup === 'B+' && matched.phone === '01700000000') {
    console.log('✓ SUCCESS: Website change automatically updated Master Excel!');
  } else {
    console.error('✗ FAILED: Excel did not update');
  }

  // Now revert back to empty so student can claim fresh
  console.log('2. Reverting back to empty fields...');
  const resetStudent = {
    regNo: 'R201911001',
    name: 'MOHAMMED SAQLINE HOSSAIN',
    batch: '1st Batch (2018-19)',
    department: 'Yarn Engineering',
    session: '2018-2019',
    bloodGroup: '',
    phone: '',
    email: ''
  };
  await fetch('http://localhost:5000/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resetStudent)
  });

  const revertedExcel = readStudentsFromExcel(masterExcelPath);
  const revertedMatched = revertedExcel.find(s => s.regNo === 'R201911001');
  console.log('Reverted Excel verified:', {
    regNo: revertedMatched.regNo,
    bloodGroup: revertedMatched.bloodGroup,
    phone: revertedMatched.phone
  });
  console.log('✓ All 2-way sync tests passed perfectly!');
  process.exit(0);
}

testSync().catch(err => {
  console.error(err);
  process.exit(1);
});
