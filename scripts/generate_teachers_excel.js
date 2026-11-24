import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { INITIAL_TEACHERS } from '../src/data/teachersData.js';

const EXCEL_OUT_PATH = path.resolve('d:/RTEC alumni/RTEC_Teachers_Faculty.xlsx');
const MASTER_EXCEL_PATH = path.resolve('d:/RTEC alumni/RTEC_Students_Master.xlsx');

const excelRows = INITIAL_TEACHERS.map((t, idx) => ({
  'ক্রমিক নং (SL)': idx + 1,
  'নাম (বাংলা)': t.nameBn,
  'Name (English)': t.name,
  'পদবী (বাংলা)': t.designationBn,
  'Designation (English)': t.designation,
  'বিভাগ (বাংলা)': t.deptBn,
  'Department (English)': t.department,
  'দপ্তর / প্রতিষ্ঠান': t.office,
  'কক্ষ / চেম্বার': t.officeRoom || '',
  'মোবাইল / ফোন': t.phone || t.mobile || '',
  'ইমেইল (Email)': t.email,
  'যোগদানের তারিখ': t.joiningDate || 'N/A',
  'নিজ জেলা': t.homeDistrict || 'N/A',
  'বিসিএস ব্যাচ': t.bcsBatch || 'N/A',
  'জ্যেষ্ঠতা ক্রম (Seniority)': t.order,
  'অধ্যক্ষ / বিভাগীয় প্রধান': t.designation?.toLowerCase().includes('principal') ? 'Principal (অধ্যক্ষ)' : (t.isHod ? 'HOD (বিভাগীয় প্রধান)' : 'Faculty/Officer'),
  'অফিসিয়াল ছবি (Photo)': t.photo
}));

// 1. Create Standalone RTEC_Teachers_Faculty.xlsx
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(excelRows);

// Set column widths
ws['!cols'] = [
  { wch: 14 }, // SL
  { wch: 35 }, // Name BN
  { wch: 30 }, // Name EN
  { wch: 32 }, // Desig BN
  { wch: 32 }, // Desig EN
  { wch: 35 }, // Dept BN
  { wch: 35 }, // Dept EN
  { wch: 35 }, // Office
  { wch: 35 }, // Chamber
  { wch: 20 }, // Phone
  { wch: 30 }, // Email
  { wch: 18 }, // Joining
  { wch: 16 }, // District
  { wch: 18 }, // BCS
  { wch: 16 }, // Order
  { wch: 24 }, // HOD Status
  { wch: 45 }  // Photo
];

XLSX.utils.book_append_sheet(wb, ws, 'RTEC Faculty & Officers');
XLSX.writeFile(wb, EXCEL_OUT_PATH);
console.log(`✓ Successfully generated standalone teachers Excel at: ${EXCEL_OUT_PATH}`);

// 2. Append/Update Teachers sheet in RTEC_Students_Master.xlsx
if (fs.existsSync(MASTER_EXCEL_PATH)) {
  try {
    const masterWb = XLSX.readFile(MASTER_EXCEL_PATH);
    if (masterWb.SheetNames.includes('Faculty & Teachers')) {
      // Remove old sheet
      delete masterWb.Sheets['Faculty & Teachers'];
      masterWb.SheetNames = masterWb.SheetNames.filter(s => s !== 'Faculty & Teachers');
    }
    const facultyWs = XLSX.utils.json_to_sheet(excelRows);
    facultyWs['!cols'] = ws['!cols'];
    XLSX.utils.book_append_sheet(masterWb, facultyWs, 'Faculty & Teachers');
    XLSX.writeFile(masterWb, MASTER_EXCEL_PATH);
    console.log(`✓ Successfully updated Master Excel with "Faculty & Teachers" sheet at: ${MASTER_EXCEL_PATH}`);
  } catch (err) {
    console.error('Error updating master excel:', err.message);
  }
}
