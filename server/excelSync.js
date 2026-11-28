import * as XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const projectRoot = path.resolve(__dirname, '..');
export const masterExcelPath = path.join(projectRoot, 'RTEC_Students_Master.xlsx');
export const publicExcelPath = path.join(projectRoot, 'public', 'RTEC_Students_Master.xlsx');
export const firstBatchExcelPath = path.join(projectRoot, 'RTEC_1st_Batch_Students_2018-19.xlsx');
export const secondBatchExcelPath = path.join(projectRoot, 'RTEC_2nd_Batch_Students_2019-20.xlsx');
export const thirdBatchExcelPath = path.join(projectRoot, 'RTEC_3rd_Batch_Students_2020-21.xlsx');
export const fourthBatchExcelPath = path.join(projectRoot, 'RTEC_4th_Batch_Students_2021-22.xlsx');
export const fifthBatchExcelPath = path.join(projectRoot, 'RTEC_5th_Batch_Students_2022-23.xlsx');
export const sixthBatchExcelPath = path.join(projectRoot, 'RTEC_6th_Batch_Students_2023-24.xlsx');
export const seventhBatchExcelPath = path.join(projectRoot, 'RTEC_7th_Batch_Students_2024-25.xlsx');
export const eighthBatchExcelPath = path.join(projectRoot, 'RTEC_8th_Batch_Students_2025-26.xlsx');

/**
 * Formats a student object into a standardized row for Excel
 */
export const formatStudentToExcelRow = (s, idx) => {
  return {
    'SL': s.serialNo || idx + 1,
    'Dept_SL': s.deptSlNo || '',
    'Exam_Roll_RegNo': s.regNo || s.studentId || '',
    'Student_ID': s.studentId || '',
    'Admission_Merit': s.merit || '',
    'Student_Name': s.name || '',
    'Department': s.department || 'Yarn Engineering',
    'Department_BN': s.deptBn || '',
    'Batch': s.batch || '1st Batch (2018-19)',
    'Session': s.session || '2018-2019',
    'Student_Type': s.studentType || 'Graduate',
    'Job_Title_Designation': s.designation || '',
    'Company_Organization': s.company || '',
    'Current_Job': s.currentJob || '',
    'Work_Location': s.workLocation || s.currentLocation || '',
    'Industry_Sector': s.jobSector || '',
    'Experience': s.experienceYears || '',
    'LinkedIn': s.linkedin || '',
    'Blood_Group': s.bloodGroup || '',
    'Phone': s.phone || '',
    'Email': s.email || '',
    'Remarks': s.remarks || ''
  };
};

/**
 * Normalizes an uploaded/read Excel row back into a Student DB/JSON object
 */
export const normalizeExcelRowToStudent = (row, idx) => {
  const getVal = (candidates) => {
    for (const key of Object.keys(row)) {
      const cleanKey = key.toLowerCase().replace(/[\s_\-.]/g, '');
      for (const cand of candidates) {
        if (cleanKey === cand.toLowerCase().replace(/[\s_\-.]/g, '')) {
          return String(row[key] ?? '').trim();
        }
      }
    }
    return '';
  };

  const name = getVal(['name', 'studentname', 'fullname', 'নাম', 'শিক্ষার্থীর নাম', 'examineename']);
  const regNo = getVal(['regno', 'reg_no', 'registration', 'reg', 'roll', 'examroll', 'examrollregno', 'রেজিস্ট্রেশন', 'রেজি']);
  const department = getVal(['department', 'dept', 'বিভাগ', 'টেকনোলজি']);
  const deptBn = getVal(['departmentbn', 'deptbn', 'বিভাগবাংলা']);
  const batch = getVal(['batch', 'ব্যাচ', 'session', 'শিক্ষাবর্ষ']);
  const session = getVal(['session', 'সেশন', 'academicsession']);
  const studentType = getVal(['studenttype', 'student_type', 'type', 'স্টুডেন্টটাইপ', 'স্টুডেন্ট টাইপ', 'টাইপ', 'status']) || 'Graduate';
  const designation = getVal(['jobtitledesignation', 'jobtitle', 'job_title_designation', 'designation', 'পদবী', 'পেশা']);
  const company = getVal(['companyorganization', 'company_organization', 'company', 'organization', 'কোম্পানি', 'প্রতিষ্ঠান']);
  const currentJob = getVal(['currentjob', 'current_job', 'job', 'workplace', 'কর্মক্ষেত্র', 'চাকরি', 'পদবি']);
  const workLocation = getVal(['worklocation', 'work_location', 'currentlocation', 'current_location', 'joblocation', 'job_location', 'location', 'city', 'ঠিকানা', 'অবস্থান']);
  const jobSector = getVal(['industrysector', 'industry_sector', 'sector', 'industry', 'ইন্ডাস্ট্রি', 'সেক্টর']);
  const experienceYears = getVal(['experience', 'experienceyears', 'experience_years', 'অভিজ্ঞতা']);
  const linkedin = getVal(['linkedin', 'linkedinurl', 'linkedin_portfolio_url', 'portfoliourl', 'portfolio', 'লিঙ্কডইন']);
  const bloodGroup = getVal(['bloodgroup', 'blood', 'blood_group', 'রক্তের গ্রুপ']);
  const phone = getVal(['phone', 'mobile', 'cell', 'ফোন', 'মোবাইল']);
  const email = getVal(['email', 'mail', 'জিমেইল', 'ইমেইল']);
  const remarks = getVal(['remarks', 'মন্তব্য']);
  const serialNoStr = getVal(['sl', 'serialno', 'serial', 'ক্রমিক', 'সিরিয়াল']);
  const deptSlNoStr = getVal(['deptsl', 'deptslno', 'ডিপার্টমেন্টক্রমিক']);

  if (!name && !regNo) {
    return null;
  }

  const serialNo = parseInt(serialNoStr, 10) || (idx + 1);
  const deptSlNo = parseInt(deptSlNoStr, 10) || 0;

  // Department Bengali translation mapping fallback
  let resolvedDeptBn = deptBn;
  if (!resolvedDeptBn) {
    if (department.includes('Yarn')) resolvedDeptBn = 'ইয়ার্ন ইঞ্জিনিয়ারিং';
    else if (department.includes('Fabric')) resolvedDeptBn = 'ফ্যাব্রিক ইঞ্জিনিয়ারিং';
    else if (department.includes('Wet')) resolvedDeptBn = 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং';
    else if (department.includes('Apparel')) resolvedDeptBn = 'অ্যাপারেল ইঞ্জিনিয়ারিং';
  }

  const is7thBatch = (batch && batch.includes('7th')) || (session && session.includes('2024-25')) || (regNo && regNo.startsWith('2509')) || serialNo > 600;
  const is6thBatch = !is7thBatch && ((batch && batch.includes('6th')) || (session && session.includes('2023-24')) || (regNo && regNo.startsWith('2409')) || (serialNo > 512 && serialNo <= 600));
  const is5thBatch = !is7thBatch && !is6thBatch && ((batch && batch.includes('5th')) || (session && session.includes('2022-23')) || (regNo && regNo.startsWith('2309')) || (serialNo > 405 && serialNo <= 512));
  const is4thBatch = !is7thBatch && !is6thBatch && !is5thBatch && ((batch && batch.includes('4th')) || (session && session.includes('2021-22')) || (regNo && regNo.startsWith('2209')) || (serialNo > 320 && serialNo <= 405));
  const is3rdBatch = !is7thBatch && !is6thBatch && !is5thBatch && !is4thBatch && ((batch && batch.includes('3rd')) || (session && session.includes('2020-21')) || (regNo && regNo.startsWith('R2021')) || (serialNo > 222 && serialNo <= 320));
  const is2ndBatch = !is7thBatch && !is6thBatch && !is5thBatch && !is4thBatch && !is3rdBatch && ((batch && batch.includes('2nd')) || (session && session.includes('2019-20')) || (regNo && regNo.startsWith('R2020')) || (serialNo > 109 && serialNo <= 222));

  let resolvedBatch = batch;
  let resolvedSession = session;
  let resolvedRole = '1st Batch Member';
  let resolvedStudentType = studentType || 'Graduate';
  let resolvedStatus = 'Graduate';
  let resolvedYear = 'Graduate / 1st Batch';

  if (is7thBatch) {
    resolvedBatch = resolvedBatch || '7th Batch (2024-25)';
    resolvedSession = resolvedSession || '2024-2025';
    resolvedRole = '7th Batch Member';
    resolvedStudentType = 'Undergraduate';
    resolvedStatus = 'Undergraduate';
    resolvedYear = 'Undergraduate / 7th Batch';
  } else if (is6thBatch) {
    resolvedBatch = resolvedBatch || '6th Batch (2023-24)';
    resolvedSession = resolvedSession || '2023-2024';
    resolvedRole = '6th Batch Member';
    resolvedStudentType = 'Undergraduate';
    resolvedStatus = 'Undergraduate';
    resolvedYear = 'Undergraduate / 6th Batch';
  } else if (is5thBatch) {
    resolvedBatch = resolvedBatch || '5th Batch (2022-23)';
    resolvedSession = resolvedSession || '2022-2023';
    resolvedRole = '5th Batch Member';
    resolvedStudentType = 'Undergraduate';
    resolvedStatus = 'Undergraduate';
    resolvedYear = 'Undergraduate / 5th Batch';
  } else if (is4thBatch) {
    resolvedBatch = resolvedBatch || '4th Batch (2021-22)';
    resolvedSession = resolvedSession || '2021-2022';
    resolvedRole = '4th Batch Member';
    resolvedStudentType = 'Undergraduate';
    resolvedStatus = 'Undergraduate';
    resolvedYear = 'Undergraduate / 4th Batch';
  } else if (is3rdBatch) {
    resolvedBatch = resolvedBatch || '3rd Batch (2020-21)';
    resolvedSession = resolvedSession || '2020-2021';
    resolvedRole = '3rd Batch Graduate';
    resolvedStudentType = 'Graduate';
    resolvedStatus = 'Graduate';
    resolvedYear = 'Graduate / 3rd Batch';
  } else if (is2ndBatch) {
    resolvedBatch = resolvedBatch || '2nd Batch (2019-20)';
    resolvedSession = resolvedSession || '2019-2020';
    resolvedRole = '2nd Batch Graduate';
    resolvedStudentType = 'Graduate';
    resolvedStatus = 'Graduate';
    resolvedYear = 'Graduate / 2nd Batch';
  } else {
    resolvedBatch = resolvedBatch || '1st Batch (2018-19)';
    resolvedSession = resolvedSession || '2018-2019';
    resolvedRole = '1st Batch Graduate';
    resolvedStudentType = 'Graduate';
    resolvedStatus = 'Graduate';
    resolvedYear = 'Graduate / 1st Batch';
  }

  return {
    id: `std-${regNo || serialNo}`,
    serialNo,
    deptSlNo,
    name: name.toUpperCase(),
    nameBn: name.toUpperCase(),
    regNo: regNo || `RTEC-${serialNo}`,
    batch: resolvedBatch,
    department: department || 'Yarn Engineering',
    deptBn: resolvedDeptBn,
    session: resolvedSession,
    year: resolvedYear,
    studentType: resolvedStudentType,
    designation: designation || '',
    company: company || '',
    currentJob: currentJob || '',
    workLocation: workLocation || '',
    jobSector: jobSector || '',
    experienceYears: experienceYears || '',
    linkedin: linkedin || '',
    bloodGroup: bloodGroup ? bloodGroup.toUpperCase() : '',
    phone: phone || '',
    email: email || '',
    avatar: '',
    role: resolvedRole,
    status: resolvedStatus,
    remarks: remarks || '',
    activities: ''
  };
};

/**
 * Reads students from an Excel file on disk
 */
export const readStudentsFromExcel = (filePath = masterExcelPath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Excel file not found at: ${filePath}`);
  }

  const fileData = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileData, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const students = [];
  rawRows.forEach((row, idx) => {
    const std = normalizeExcelRowToStudent(row, idx);
    if (std) {
      students.push(std);
    }
  });

  return students;
};

/**
 * Writes the live list of students into the Master Excel file(s)
 */
export const writeStudentsToExcel = (studentsList) => {
  if (!Array.isArray(studentsList) || studentsList.length === 0) {
    return { success: false, error: 'Empty student list' };
  }

  // Sort by serialNo (or regNo)
  const sorted = [...studentsList].sort((a, b) => {
    const slA = a.serialNo || 9999;
    const slB = b.serialNo || 9999;
    if (slA !== slB) return slA - slB;
    return String(a.regNo || '').localeCompare(String(b.regNo || ''));
  });

  const wb = XLSX.utils.book_new();

  const colsConfig = [
    { wch: 6 },  // SL
    { wch: 8 },  // Dept_SL
    { wch: 18 }, // Exam_Roll_RegNo
    { wch: 14 }, // Student_ID
    { wch: 16 }, // Admission_Merit
    { wch: 32 }, // Student_Name
    { wch: 25 }, // Department
    { wch: 25 }, // Department_BN
    { wch: 22 }, // Batch
    { wch: 14 }, // Session
    { wch: 14 }, // Student_Type
    { wch: 28 }, // Job_Title_Designation
    { wch: 30 }, // Company_Organization
    { wch: 30 }, // Current_Job
    { wch: 22 }, // Work_Location
    { wch: 24 }, // Industry_Sector
    { wch: 14 }, // Experience
    { wch: 40 }, // LinkedIn
    { wch: 13 }, // Blood_Group
    { wch: 16 }, // Phone
    { wch: 28 }, // Email
    { wch: 24 }  // Remarks
  ];

  // 1. All Students Sheet (Master)
  const allRows = sorted.map((s, idx) => formatStudentToExcelRow(s, idx));
  const wsAll = XLSX.utils.json_to_sheet(allRows);
  wsAll['!cols'] = colsConfig;
  XLSX.utils.book_append_sheet(wb, wsAll, 'All_Students');

  // 2. Batch Sheets (1st, 2nd, and 3rd Batch)
  const firstBatchList = sorted.filter(s => (s.batch || '').includes('1st'));
  if (firstBatchList.length > 0) {
    const ws1st = XLSX.utils.json_to_sheet(firstBatchList.map((s, idx) => formatStudentToExcelRow(s, idx)));
    ws1st['!cols'] = colsConfig;
    XLSX.utils.book_append_sheet(wb, ws1st, '1st_Batch_2018-19');
  }

  const secondBatchList = sorted.filter(s => (s.batch || '').includes('2nd'));
  if (secondBatchList.length > 0) {
    const ws2nd = XLSX.utils.json_to_sheet(secondBatchList.map((s, idx) => formatStudentToExcelRow(s, idx)));
    ws2nd['!cols'] = colsConfig;
    XLSX.utils.book_append_sheet(wb, ws2nd, '2nd_Batch_2019-20');
  }

  const thirdBatchList = sorted.filter(s => (s.batch || '').includes('3rd'));
  if (thirdBatchList.length > 0) {
    const ws3rd = XLSX.utils.json_to_sheet(thirdBatchList.map((s, idx) => formatStudentToExcelRow(s, idx)));
    ws3rd['!cols'] = colsConfig;
    XLSX.utils.book_append_sheet(wb, ws3rd, '3rd_Batch_2020-21');
  }

  const fourthBatchList = sorted.filter(s => (s.batch || '').includes('4th'));
  if (fourthBatchList.length > 0) {
    const ws4th = XLSX.utils.json_to_sheet(fourthBatchList.map((s, idx) => formatStudentToExcelRow(s, idx)));
    ws4th['!cols'] = colsConfig;
    XLSX.utils.book_append_sheet(wb, ws4th, '4th_Batch_2021-22');
  }

  const fifthBatchList = sorted.filter(s => (s.batch || '').includes('5th'));
  if (fifthBatchList.length > 0) {
    const ws5th = XLSX.utils.json_to_sheet(fifthBatchList.map((s, idx) => formatStudentToExcelRow(s, idx)));
    ws5th['!cols'] = colsConfig;
    XLSX.utils.book_append_sheet(wb, ws5th, '5th_Batch_2022-23');
  }

  const sixthBatchList = sorted.filter(s => (s.batch || '').includes('6th'));
  if (sixthBatchList.length > 0) {
    const ws6th = XLSX.utils.json_to_sheet(sixthBatchList.map((s, idx) => formatStudentToExcelRow(s, idx)));
    ws6th['!cols'] = colsConfig;
    XLSX.utils.book_append_sheet(wb, ws6th, '6th_Batch_2023-24');
  }

  const seventhBatchList = sorted.filter(s => (s.batch || '').includes('7th'));
  if (seventhBatchList.length > 0) {
    const ws7th = XLSX.utils.json_to_sheet(seventhBatchList.map((s, idx) => formatStudentToExcelRow(s, idx)));
    ws7th['!cols'] = colsConfig;
    XLSX.utils.book_append_sheet(wb, ws7th, '7th_Batch_2024-25');
  }

  const eighthBatchList = sorted.filter(s => (s.batch || '').includes('8th'));
  if (eighthBatchList.length > 0) {
    const ws8th = XLSX.utils.json_to_sheet(eighthBatchList.map((s, idx) => formatStudentToExcelRow(s, idx)));
    ws8th['!cols'] = colsConfig;
    XLSX.utils.book_append_sheet(wb, ws8th, '8th_Batch_2025-26');
  }

  // 3. Department-specific Sheets
  const deptConfigs = [
    { name: 'Yarn_Engineering', label: 'Yarn' },
    { name: 'Fabric_Engineering', label: 'Fabric' },
    { name: 'Wet_Process_Engineering', label: 'Wet' },
    { name: 'Apparel_Engineering', label: 'Apparel' }
  ];

  for (const dc of deptConfigs) {
    const deptList = sorted.filter(s => (s.department || '').toLowerCase().includes(dc.label.toLowerCase()));
    if (deptList.length > 0) {
      const deptRows = deptList.map((s, idx) => formatStudentToExcelRow(s, idx));
      const wsDept = XLSX.utils.json_to_sheet(deptRows);
      wsDept['!cols'] = colsConfig;
      XLSX.utils.book_append_sheet(wb, wsDept, dc.name);
    }
  }

  // Save to master Excel
  XLSX.writeFile(wb, masterExcelPath);

  // Also sync to public folder for direct client downloads
  const publicDir = path.join(projectRoot, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  XLSX.writeFile(wb, publicExcelPath);

  // Standalone batch workbooks
  if (firstBatchList.length > 0) {
    const wb1 = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(firstBatchList.map((s, idx) => formatStudentToExcelRow(s, idx)));
    ws1['!cols'] = colsConfig;
    XLSX.utils.book_append_sheet(wb1, ws1, '1st_Batch_2018-19');
    XLSX.writeFile(wb1, firstBatchExcelPath);
    XLSX.writeFile(wb1, path.join(publicDir, 'RTEC_1st_Batch_Students_2018-19.xlsx'));
  }

  if (secondBatchList.length > 0) {
    const wb2 = XLSX.utils.book_new();
    const ws2 = XLSX.utils.json_to_sheet(secondBatchList.map((s, idx) => formatStudentToExcelRow(s, idx)));
    ws2['!cols'] = colsConfig;
    XLSX.utils.book_append_sheet(wb2, ws2, '2nd_Batch_2019-20');
    XLSX.writeFile(wb2, secondBatchExcelPath);
    XLSX.writeFile(wb2, path.join(publicDir, 'RTEC_2nd_Batch_Students_2019-20.xlsx'));
  }

  if (thirdBatchList.length > 0) {
    const wb3 = XLSX.utils.book_new();
    const ws3 = XLSX.utils.json_to_sheet(thirdBatchList.map((s, idx) => formatStudentToExcelRow(s, idx)));
    ws3['!cols'] = colsConfig;
    XLSX.utils.book_append_sheet(wb3, ws3, '3rd_Batch_2020-21');
    XLSX.writeFile(wb3, thirdBatchExcelPath);
    XLSX.writeFile(wb3, path.join(publicDir, 'RTEC_3rd_Batch_Students_2020-21.xlsx'));
  }

  if (fourthBatchList.length > 0) {
    const wb4 = XLSX.utils.book_new();
    const ws4 = XLSX.utils.json_to_sheet(fourthBatchList.map((s, idx) => formatStudentToExcelRow(s, idx)));
    ws4['!cols'] = colsConfig;
    XLSX.utils.book_append_sheet(wb4, ws4, '4th_Batch_2021-22');
    XLSX.writeFile(wb4, fourthBatchExcelPath);
    XLSX.writeFile(wb4, path.join(publicDir, 'RTEC_4th_Batch_Students_2021-22.xlsx'));
  }

  if (fifthBatchList.length > 0) {
    const wb5 = XLSX.utils.book_new();
    const ws5 = XLSX.utils.json_to_sheet(fifthBatchList.map((s, idx) => formatStudentToExcelRow(s, idx)));
    ws5['!cols'] = colsConfig;
    XLSX.utils.book_append_sheet(wb5, ws5, '5th_Batch_2022-23');
    XLSX.writeFile(wb5, fifthBatchExcelPath);
    XLSX.writeFile(wb5, path.join(publicDir, 'RTEC_5th_Batch_Students_2022-23.xlsx'));
  }

  if (sixthBatchList.length > 0) {
    const wb6 = XLSX.utils.book_new();
    const ws6 = XLSX.utils.json_to_sheet(sixthBatchList.map((s, idx) => formatStudentToExcelRow(s, idx)));
    ws6['!cols'] = colsConfig;
    XLSX.utils.book_append_sheet(wb6, ws6, '6th_Batch_2023-24');
    XLSX.writeFile(wb6, sixthBatchExcelPath);
    XLSX.writeFile(wb6, path.join(publicDir, 'RTEC_6th_Batch_Students_2023-24.xlsx'));
  }

  if (seventhBatchList.length > 0) {
    const wb7 = XLSX.utils.book_new();
    const ws7 = XLSX.utils.json_to_sheet(seventhBatchList.map((s, idx) => formatStudentToExcelRow(s, idx)));
    ws7['!cols'] = colsConfig;
    XLSX.utils.book_append_sheet(wb7, ws7, '7th_Batch_2024-25');
    XLSX.writeFile(wb7, seventhBatchExcelPath);
    XLSX.writeFile(wb7, path.join(publicDir, 'RTEC_7th_Batch_Students_2024-25.xlsx'));
  }

  if (eighthBatchList.length > 0) {
    const wb8 = XLSX.utils.book_new();
    const ws8 = XLSX.utils.json_to_sheet(eighthBatchList.map((s, idx) => formatStudentToExcelRow(s, idx)));
    ws8['!cols'] = colsConfig;
    XLSX.utils.book_append_sheet(wb8, ws8, '8th_Batch_2025-26');
    XLSX.writeFile(wb8, eighthBatchExcelPath);
    XLSX.writeFile(wb8, path.join(publicDir, 'RTEC_8th_Batch_Students_2025-26.xlsx'));
  }

  return {
    success: true,
    count: sorted.length,
    masterPath: masterExcelPath,
    publicPath: publicExcelPath,
    firstBatchCount: firstBatchList.length,
    secondBatchCount: secondBatchList.length,
    thirdBatchCount: thirdBatchList.length,
    fourthBatchCount: fourthBatchList.length,
    fifthBatchCount: fifthBatchList.length,
    sixthBatchCount: sixthBatchList.length,
    seventhBatchCount: seventhBatchList.length,
    eighthBatchCount: eighthBatchList.length
  };
};

/**
 * Sets up a file watcher on RTEC_Students_Master.xlsx
 */
let watcherInstance = null;
let debounceTimeout = null;

export const startExcelWatcher = (onFileChangedCallback) => {
  if (watcherInstance) {
    try { watcherInstance.close(); } catch (e) {}
  }

  if (!fs.existsSync(masterExcelPath)) {
    console.log('[Excel Watcher] Master file does not exist yet; watcher deferred.');
    return;
  }

  try {
    watcherInstance = fs.watch(masterExcelPath, (eventType) => {
      if (eventType === 'change') {
        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
          try {
            console.log('[Excel Watcher] Detected external change in RTEC_Students_Master.xlsx! Triggering sync...');
            const updatedStudents = readStudentsFromExcel(masterExcelPath);
            if (typeof onFileChangedCallback === 'function') {
              await onFileChangedCallback(updatedStudents);
            }
          } catch (err) {
            console.error('[Excel Watcher] Error handling change:', err.message);
          }
        }, 1200);
      }
    });
    console.log(`[Excel Watcher] ✓ Actively watching: ${masterExcelPath}`);
  } catch (err) {
    console.error('[Excel Watcher] Failed to watch file:', err.message);
  }
};
