const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'utils', 'excelImport.js');
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Find studentType line in normalizeStudentRow
let studentTypeLine = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("const studentType = getVal(") || lines[i].includes("const result = getVal(")) {
    console.log(i+1, lines[i]);
  }
  if (lines[i].includes("const bloodGroup = getVal(") && studentTypeLine === -1) {
    studentTypeLine = i;
  }
}

console.log('bloodGroup line:', studentTypeLine + 1, lines[studentTypeLine]);

// Insert new career fields before bloodGroup
const indent = '  ';
const newFields = [
  `${indent}const designation = getVal(['jobtitledesignation', 'jobtitle', 'job_title_designation', 'designation', '\u09aa\u09a6\u09ac\u09c0', '\u09aa\u09c7\u09b6\u09be']);`,
  `${indent}const company = getVal(['companyorganization', 'company_organization', 'company', 'organization', '\u0995\u09cb\u09ae\u09cd\u09aa\u09be\u09a8\u09bf', '\u09aa\u09cd\u09b0\u09a4\u09bf\u09b7\u09cd\u09a0\u09be\u09a8']);`,
  `${indent}const currentJob = getVal(['currentjob', 'current_job', 'job', 'workplace', '\u0995\u09b0\u09cd\u09ae\u0995\u09cd\u09b7\u09c7\u09a4\u09cd\u09b0', '\u099a\u09be\u0995\u09b0\u09bf', '\u09aa\u09a6\u09ac\u09bf']);`,
  `${indent}const workLocation = getVal(['worklocation', 'work_location', 'currentlocation', 'current_location', 'joblocation', 'job_location', 'location', 'city', '\u09a0\u09bf\u0995\u09be\u09a8\u09be', '\u0985\u09ac\u09b8\u09cd\u09a5\u09be\u09a8']);`,
  `${indent}const jobSector = getVal(['industrysector', 'industry_sector', 'sector', 'industry', '\u0987\u09a8\u09cd\u09a1\u09be\u09b8\u09cd\u099f\u09cd\u09b0\u09bf', '\u09b8\u09c7\u0995\u09cd\u099f\u09b0']);`,
  `${indent}const experienceYears = getVal(['experience', 'experienceyears', 'experience_years', '\u0985\u09ad\u09bf\u099c\u09cd\u099e\u09a4\u09be']);`,
  `${indent}const linkedin = getVal(['linkedin', 'linkedinurl', 'linkedin_portfolio_url', 'portfoliourl', 'portfolio', '\u09b2\u09bf\u0999\u09cd\u0995\u09a1\u0987\u09a8']);`,
];

// Insert before bloodGroup line
lines.splice(studentTypeLine, 0, ...newFields);

content = lines.join('\n');

// Update return object: add new fields after activities: ''
const oldActivities = `    activities: ''`;
const newActivities = `    designation: designation || '',\n    company: company || '',\n    currentJob: currentJob || '',\n    workLocation: workLocation || '',\n    jobSector: jobSector || '',\n    experienceYears: experienceYears || '',\n    linkedin: linkedin || '',\n    activities: ''`;

if (content.includes(oldActivities)) {
  content = content.replace(oldActivities, newActivities);
  console.log('Return object updated!');
} else {
  console.log('WARNING: Could not find activities pattern');
  const idx = content.indexOf("activities:");
  if (idx >= 0) console.log(JSON.stringify(content.slice(idx - 20, idx + 60)));
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('excelImport.js saved!');

// Verify
const verify = fs.readFileSync(filePath, 'utf8').split('\n');
console.log('\n--- New career fields in normalizeStudentRow ---');
verify.forEach((line, i) => {
  if (['designation', 'company', 'currentJob', 'workLocation', 'jobSector', 'linkedin', 'experienceYears'].some(k => line.includes(k))) {
    console.log(i+1, line);
  }
});
