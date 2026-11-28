const fs = require('fs');
const path = require('path');

// === 1. Fix SupportTreatModal.jsx ===
const modalPath = path.join(__dirname, '..', 'src', 'components', 'SupportTreatModal.jsx');
let modal = fs.readFileSync(modalPath, 'utf8');

// Remove dollar from total treat display (line ~328)
modal = modal.replace(
  /৳\{totalBdt\} <span className="text-xs font-normal opacity-75">\(\$\{totalUsd\}\)<\/span>/g,
  '৳{totalBdt}'
);

// Update payment label - remove "& International"
modal = modal.replace(
  "'পেমেন্ট মাধ্যম নির্বাচন করুন (দেশীয় ও আন্তর্জাতিক):'",
  "'পেমেন্ট পদ্ধতি নির্বাচন করুন:'"
);
modal = modal.replace(
  "'Choose Payment Method (Local & International):'",
  "'Choose Payment Method:'"
);

// Change grid from 4 cols (was for International) to 3 cols
modal = modal.replace(
  '"grid grid-cols-2 sm:grid-cols-4 gap-2"',
  '"grid grid-cols-3 gap-2"'
);

// Fix name field: use placeholder instead of pre-filled value
// The current code sets senderName from user.name on open
// We want it to be a true placeholder (clear the value, show name as placeholder)
modal = modal.replace(
  `if (user && user.role !== 'guest' && user.name) {
        setSenderName(user.name);
      }`,
  `// Name stays empty; user's name shown as placeholder only`
);

// Update placeholder to show user name as hint
modal = modal.replace(
  `placeholder={lang === 'bn' ? 'আপনার নাম লিখুন' : 'Your name'}`,
  `placeholder={user && user.role !== 'guest' && user.name ? user.name : (lang === 'bn' ? 'আপনার নাম লিখুন' : 'Your name')}`
);

// Upgrade thank-you message to warm, grateful tone
modal = modal.replace(
  `{lang === 'bn'
                      ? \`ধন্যবাদ! আপনার \${quantity}x \${activeTreat.titleBn} গ্রহণ করা হয়েছে\`
                      : \`Thank You for the \${quantity}x \${activeTreat.titleEn}!\`}`,
  `{lang === 'bn'
                      ? \`অসংখ্য ধন্যবাদ! আপনার ভালোবাসা আমাদের অনুপ্রেরণা 💛\`
                      : \`Thank you for your support — your little contribution means the world to us! 💛\`}`
);

modal = modal.replace(
  `{lang === 'bn'
                      ? 'আপনার ভালোবাসা ও অনুপ্রেরণা আমাদের RTEC Alumni ওয়েবসাইটকে আরও সুন্দর ও সমৃদ্ধ রাখতে সাহায্য করবে।'
                      : 'Your generosity helps keep the RTEC Alumni platform running smoothly for everyone.'}`,
  `{lang === 'bn'
                      ? 'আপনার এই ছোট্ট সহায়তা আমাদের কাছে অনেক বড়। আমরা সত্যিই কৃতজ্ঞ।'
                      : 'Your little contribution is big to us. We are truly grateful for your kindness and support.'}`
);

// Add staggered animation to thank-you checkmark for extra delight
modal = modal.replace(
  `transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg"`,
  `transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-emerald-200 dark:ring-emerald-800"`
);

fs.writeFileSync(modalPath, modal, 'utf8');
console.log('SupportTreatModal.jsx updated!');

// === 2. Fix Navbar.jsx: "Student Portal" -> "Student Profile" everywhere ===
const navbarPath = path.join(__dirname, '..', 'src', 'components', 'Navbar.jsx');
let navbar = fs.readFileSync(navbarPath, 'utf8');

// In archiveLinks: Student Portal label
navbar = navbar.replace(
  "labelBn: '스টুডেন্ট 포르탈'",
  "labelBn: '스টুডেন্ট 프로파일'"
);

// Use actual Bengali from the file
navbar = navbar.replace(
  "labelBn: '\u09b8\u09cd\u099f\u09c1\u09a1\u09c7\u09a8\u09cd\u099f \u09aa\u09cb\u09b0\u09cd\u099f\u09be\u09b2', labelEn: 'Student Portal'",
  "labelBn: '\u09b8\u09cd\u099f\u09c1\u09a1\u09c7\u09a8\u09cd\u099f \u09aa\u09cd\u09b0\u09cb\u09ab\u09be\u0987\u09b2', labelEn: 'Student Profile'"
);

// descEn for student portal
navbar = navbar.replace(
  "descEn: 'Submit or update your student profile'",
  "descEn: 'View or update your student profile'"
);

// Dropdown menu: "Student Portal" -> "Student Profile"
navbar = navbar.replace(
  "'\u09b8\u09cd\u099f\u09c1\u09a1\u09c7\u09a8\u09cd\u099f \u09aa\u09cb\u09b0\u09cd\u099f\u09be\u09b2' : 'Student Portal'",
  "'\u09b8\u09cd\u099f\u09c1\u09a1\u09c7\u09a8\u09cd\u099f \u09aa\u09cd\u09b0\u09cb\u09ab\u09be\u0987\u09b2' : 'Student Profile'"
);
// Also in drawer hub
navbar = navbar.replace(
  "'\u09b8\u09cd\u099f\u09c1\u09a1\u09c7\u09a8\u09cd\u099f \u09aa\u09cb\u09b0\u09cd\u099f\u09be\u09b2' : 'Student Portal'",
  "'\u09b8\u09cd\u099f\u09c1\u09a1\u09c7\u09a8\u09cd\u099f \u09aa\u09cd\u09b0\u09cb\u09ab\u09be\u0987\u09b2' : 'Student Profile'"
);

// top bar "Student ID" button title
navbar = navbar.replace(
  "title={lang === 'bn' ? '\u09b6\u09bf\u0995\u09cd\u09b7\u09be\u09b0\u09cd\u09a5\u09c0 \u0986\u0987\u09a1\u09bf \u0993 \u09a4\u09a5\u09cd\u09af \u099c\u09ae\u09be' : 'Student Portal'}",
  "title={lang === 'bn' ? '\u09b6\u09bf\u0995\u09cd\u09b7\u09be\u09b0\u09cd\u09a5\u09c0 \u09aa\u09cd\u09b0\u09cb\u09ab\u09be\u0987\u09b2' : 'Student Profile'}"
);

fs.writeFileSync(navbarPath, navbar, 'utf8');
console.log('Navbar.jsx updated!');

// Verify
const modalVerify = fs.readFileSync(modalPath, 'utf8');
console.log('\n--- Verification ---');
console.log('Has real bKash number:', modalVerify.includes('01873275283'));
console.log('Has real Rocket number:', modalVerify.includes('01925251621'));
console.log('No International tab:', !modalVerify.includes("id: 'international'"));
console.log('No dollar in badge:', !modalVerify.includes("/ ${item.unitUsd}") && !modalVerify.includes('/ $2') && !modalVerify.includes('/ $5'));
console.log('Empty name init:', modalVerify.includes('Name stays empty'));
console.log('Warm thank-you:', modalVerify.includes('little contribution'));
