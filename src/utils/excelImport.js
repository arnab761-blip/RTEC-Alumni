import * as XLSX from 'xlsx';

/**
 * Normalizes an uploaded Excel/CSV row into the standard student object schema.
 */
const normalizeStudentRow = (row, idx) => {
  // Case-insensitive key lookup helper
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

  const name = getVal(['name', 'studentname', 'fullname', 'নাম', 'শিক্ষার্থীর নাম', 'examineename', 'examinee']);
  const regNo = getVal(['regno', 'reg_no', 'registration', 'reg', 'roll', 'examroll', 'examrollregno', 'রেজিস্ট্রেশন', 'রেজিস্ট্রেশন নম্বর', 'রেজি']);
  const department = getVal(['department', 'dept', 'বিভাগ', 'টেকনোলজি']);
  const deptBn = getVal(['departmentbn', 'deptbn', 'বিভাগবাংলা']);
  const batch = getVal(['batch', 'ব্যাচ', 'session', 'শিক্ষাবর্ষ']);
  const session = getVal(['session', 'সেশন', 'academicsession']);
  const bloodGroup = getVal(['bloodgroup', 'blood', 'blood_group', 'রক্তের গ্রুপ', 'রক্ত']);
  const phone = getVal(['phone', 'mobile', 'cell', 'ফোন', 'মোবাইল']);
  const email = getVal(['email', 'mail', 'জিমেইল', 'ইমেইল']);
  const result = getVal(['result', 'ফলাফল', 'status']);
  const remarks = getVal(['remarks', 'মন্তব্য', 'failedsubject', 'failedsubjects']);
  const serialNoStr = getVal(['sl', 'serialno', 'serial', 'ক্রমিক', 'সিরিয়াল']);
  const deptSlNoStr = getVal(['deptsl', 'deptslno']);

  if (!name && !regNo) {
    return null; // Empty row
  }

  const serialNo = parseInt(serialNoStr, 10) || (idx + 1);
  const deptSlNo = parseInt(deptSlNoStr, 10) || 0;

  // Format blood group
  let cleanBlood = bloodGroup.toUpperCase().replace(/\s/g, '');
  if (!['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].includes(cleanBlood)) {
    cleanBlood = '';
  }

  // Auto-resolve Bengali department name
  let resolvedDeptBn = deptBn;
  if (!resolvedDeptBn) {
    if (department.includes('Yarn')) resolvedDeptBn = 'ইয়ার্ন ইঞ্জিনিয়ারিং';
    else if (department.includes('Fabric')) resolvedDeptBn = 'ফ্যাব্রিক ইঞ্জিনিয়ারিং';
    else if (department.includes('Wet')) resolvedDeptBn = 'ওয়েট প্রসেস ইঞ্জিনিয়ারিং';
    else if (department.includes('Apparel')) resolvedDeptBn = 'অ্যাপারেল ইঞ্জিনিয়ারিং';
  }

  return {
    id: `std-${regNo || serialNo}`,
    serialNo,
    deptSlNo,
    name: name.toUpperCase(),
    nameBn: name.toUpperCase(),
    regNo: regNo || `RTEC-${serialNo}`,
    batch: batch || '1st Batch (2018-19)',
    department: department || 'Yarn Engineering',
    deptBn: resolvedDeptBn,
    session: session || '2018-2019',
    year: 'Graduated / Pioneer Batch',
    bloodGroup: cleanBlood,
    phone: phone,
    email: email,
    avatar: '',
    role: '1st Batch Member',
    status: result || 'Passed',
    result: result || 'Passed',
    remarks: remarks || '',
    activities: ''
  };
};

/**
 * Parses an Excel (.xlsx, .xls) or CSV file in the browser.
 */
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('কোন ফাইল সিলেক্ট করা হয়নি'));
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          throw new Error('এক্সেল ফাইলে কোনো শিট পাওয়া যায়নি');
        }

        const sheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          throw new Error('এক্সেল ফাইলটিতে কোনো ডেটা নেই বা ফাইলটি খালি');
        }

        const students = [];
        const warnings = [];

        rawJson.forEach((row, idx) => {
          const student = normalizeStudentRow(row, idx);
          if (student) {
            if (!student.name || !student.regNo) {
              warnings.push(`সারি ${idx + 2}: নাম অথবা রেজিস্ট্রেশন নম্বর অনুপস্থিত`);
            }
            students.push(student);
          }
        });

        resolve({
          success: true,
          fileName: file.name,
          sheetName: firstSheetName,
          totalRows: rawJson.length,
          validStudentsCount: students.length,
          students,
          warnings
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(new Error('ফাইল পড়তে ব্যর্থ হয়েছে'));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Generates and downloads the official master student Excel file.
 */
export const downloadStudentTemplate = () => {
  const link = document.createElement('a');
  link.href = '/RTEC_Students_Master.xlsx';
  link.download = 'RTEC_Students_Master.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
