const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'server', 'excelSync.js');
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Find the exact line numbers for the section to replace
// We need to replace lines with studentType, currentJob, currentLocation in normalizeExcelRowToStudent
// (the second occurrence — first occurrence is in formatStudentToExcelRow return object)

let normalizeStart = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("export const normalizeExcelRowToStudent")) {
    normalizeStart = i;
    break;
  }
}

console.log('normalizeExcelRowToStudent starts at line:', normalizeStart + 1);

// Find studentType line inside normalizeExcelRowToStudent
let studentTypeLine = -1;
for (let i = normalizeStart; i < lines.length; i++) {
  if (lines[i].includes("const studentType = getVal(")) {
    studentTypeLine = i;
    break;
  }
}
console.log('studentType line:', studentTypeLine + 1);
console.log('Content:', lines[studentTypeLine]);
console.log('currentJob line:', studentTypeLine + 2, lines[studentTypeLine + 1]);
console.log('currentLocation line:', studentTypeLine + 3, lines[studentTypeLine + 2]);

// Build replacement block
const indent = '  ';
const newBlock = [
  lines[studentTypeLine], // keep studentType as-is
  `${indent}const designation = getVal(['jobtitledesignation', 'jobtitle', 'job_title_designation', 'designation', '\u09aa\u09a6\u09ac\u09c0', '\u09aa\u09c7\u09b6\u09be']);`,
  `${indent}const company = getVal(['companyorganization', 'company_organization', 'company', 'organization', '\u0995\u09cb\u09ae\u09cd\u09aa\u09be\u09a8\u09bf', '\u09aa\u09cd\u09b0\u09a4\u09bf\u09b7\u09cd\u09a0\u09be\u09a8']);`,
  `${indent}const currentJob = getVal(['currentjob', 'current_job', 'job', 'workplace', '\u0995\u09b0\u09cd\u09ae\u0995\u09cd\u09b7\u09c7\u09a4\u09cd\u09b0', '\u099a\u09be\u0995\u09b0\u09bf', '\u09aa\u09a6\u09ac\u09bf']);`,
  `${indent}const workLocation = getVal(['worklocation', 'work_location', 'currentlocation', 'current_location', 'joblocation', 'job_location', 'location', 'city', '\u09a0\u09bf\u0995\u09be\u09a8\u09be', '\u0985\u09ac\u09b8\u09cd\u09a5\u09be\u09a8']);`,
  `${indent}const jobSector = getVal(['industrysector', 'industry_sector', 'sector', 'industry', '\u0987\u09a8\u09cd\u09a1\u09be\u09b8\u09cd\u099f\u09cd\u09b0\u09bf', '\u09b8\u09c7\u0995\u09cd\u099f\u09b0']);`,
  `${indent}const experienceYears = getVal(['experience', 'experienceyears', 'experience_years', '\u0985\u09ad\u09bf\u099c\u09cd\u099e\u09a4\u09be']);`,
  `${indent}const linkedin = getVal(['linkedin', 'linkedinurl', 'linkedin_portfolio_url', 'portfoliourl', 'portfolio', '\u09b2\u09bf\u0999\u09cd\u0995\u09a1\u0987\u09a8']);`,
];

// Replace lines studentTypeLine, studentTypeLine+1, studentTypeLine+2 with newBlock
lines.splice(studentTypeLine, 3, ...newBlock);

content = lines.join('\n');

// Now fix the return object in normalizeExcelRowToStudent to include new fields
// Find "currentJob: currentJob || ''," and "currentLocation: currentLocation || '',"
const oldReturn = `    currentJob: currentJob || '',\n    currentLocation: currentLocation || '',`;
const newReturn = `    designation: designation || '',\n    company: company || '',\n    currentJob: currentJob || '',\n    workLocation: workLocation || '',\n    jobSector: jobSector || '',\n    experienceYears: experienceYears || '',\n    linkedin: linkedin || '',`;

if (content.includes(oldReturn)) {
  content = content.replace(oldReturn, newReturn);
  console.log('Return object updated!');
} else {
  console.log('WARNING: Could not find return object pattern. Searching...');
  const idx = content.indexOf('currentJob: currentJob ||');
  console.log('currentJob return at index:', idx);
  if (idx >= 0) console.log(JSON.stringify(content.slice(idx - 10, idx + 100)));
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('File saved!');

// Verify
const verify = fs.readFileSync(filePath, 'utf8').split('\n');
let ni = -1;
for (let i = 0; i < verify.length; i++) {
  if (verify[i].includes("export const normalizeExcelRowToStudent")) { ni = i; break; }
}
console.log('\n--- normalizeExcelRowToStudent section (lines around designation) ---');
for (let i = ni; i < Math.min(ni + 50, verify.length); i++) {
  if (verify[i].includes('designation') || verify[i].includes('company') || verify[i].includes('currentJob') || verify[i].includes('workLocation') || verify[i].includes('linkedin') || verify[i].includes('jobSector')) {
    console.log(i+1, verify[i]);
  }
}
