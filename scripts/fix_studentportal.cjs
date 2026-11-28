const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'StudentPortal.jsx');
let content = fs.readFileSync(filePath, 'utf8');
let lines = content.split('\n');

let count = 0;
for (let i = 0; i < lines.length; i++) {
  const orig = lines[i];
  // Replace visible labels - but skip: createPortal, key="portal-...", function name, comments, code keys
  // Only change user-visible text strings
  lines[i] = lines[i]
    .replace(/'스튜데ন্ট পোর্টাল'/g, "'স্টুডেন্ট প্রোফাইল'")
    .replace("'স্টুডেন্ট পোর্টাল' : 'STUDENT PORTAL'", "'স্টুডেন্ট প্রোফাইল' : 'STUDENT PROFILE'")
    .replace("'শিক্ষার্থী আইডি ও তথ্য সংযোজন পোর্টাল'", "'শিক্ষার্থী আইডি ও প্রোফাইল আপডেট'")
    .replace("'Student Self-Registration & Profile Portal'", "'Student Self-Registration & Profile'")
    .replace("'স্টুডেন্ট পোর্টাল ফর্ম শুধুমাত্র বর্তমান শিক্ষার্থীদের জন্য'", "'স্টুডেন্ট প্রোফাইল ফর্ম শুধুমাত্র বর্তমান শিক্ষার্থীদের জন্য'")
    .replace("'Student Portal Form is Reserved for Current Students'", "'Student Profile Form is Reserved for Current Students'")
    .replace("'Student Portal Form is for Current Students Only'", "'Student Profile Form is for Current Students Only'");

  if (lines[i] !== orig) {
    count++;
    console.log(`Line ${i+1}: changed`);
  }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log(`StudentPortal.jsx: ${count} lines changed`);
