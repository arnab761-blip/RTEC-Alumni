const fs = require('fs');
const path = require('path');

// Fix thank-you message in SupportTreatModal.jsx
const modalPath = path.join(__dirname, '..', 'src', 'components', 'SupportTreatModal.jsx');
let lines = fs.readFileSync(modalPath, 'utf8').split('\n');

// Find lines 241-248 (0-indexed: 240-247) and replace
// Line 242 (0-idx 241): thank-you heading BN
// Line 243 (0-idx 242): thank-you heading EN
// Line 247 (0-idx 246): sub text BN
// Line 248 (0-idx 247): sub text EN

// Find the thank-you heading line
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Thank You for the') && lines[i].includes('titleEn')) {
    console.log('Found EN line at:', i+1, lines[i]);
    lines[i] = lines[i].replace(
      `\`Thank You for the \${quantity}x \${activeTreat.titleEn}!\`}`,
      `\`Thank you for your support — you made our day! \u{1F49B}\`}`
    );
    // Fix BN line (previous line)
    lines[i-1] = lines[i-1].replace(
      `\`ধন্যবাদ! আপনার \${quantity}x \${activeTreat.titleBn} গ্রহণ করা হয়েছে\``,
      `\`অসংখ্য ধন্যবাদ! আপনার ভালোবাসা আমাদের অনুপ্রেরণা \u{1F49B}\``
    );
  }
  if (lines[i].includes("Your generosity helps keep")) {
    console.log('Found generosity line at:', i+1);
    lines[i] = lines[i].replace(
      "'Your generosity helps keep the RTEC Alumni platform running smoothly for everyone.'",
      "'Your little contribution is big to us. We are truly grateful for your kindness.'"
    );
  }
  if (lines[i].includes('আপনার ভালোবাসা ও অনুপ্রেরণা আমাদের RTEC')) {
    console.log('Found BN sub line at:', i+1);
    lines[i] = lines[i].replace(
      "'আপনার ভালোবাসা ও অনুপ্রেরণা আমাদের RTEC Alumni ওয়েবসাইটকে আরও সুন্দর ও সমৃদ্ধ রাখতে সাহায্য করবে।'",
      "'আপনার এই ছোট্ট সহায়তা আমাদের কাছে অনেক বড়। আমরা সত্যিই কৃতজ্ঞ।'"
    );
  }
}

fs.writeFileSync(modalPath, lines.join('\n'), 'utf8');
console.log('Thank-you message updated!');

// Also fix Navbar "Student Portal" -> "Student Profile" using line-by-line
const navbarPath = path.join(__dirname, '..', 'src', 'components', 'Navbar.jsx');
let navLines = fs.readFileSync(navbarPath, 'utf8').split('\n');

let portalCount = 0;
for (let i = 0; i < navLines.length; i++) {
  if (navLines[i].includes('Student Portal') || navLines[i].includes('\u09b8\u09cd\u099f\u09c1\u09a1\u09c7\u09a8\u09cd\u099f \u09aa\u09cb\u09b0\u09cd\u099f\u09be\u09b2')) {
    // Don't change URL paths like /student-portal
    // Only change display labels
    const orig = navLines[i];
    navLines[i] = navLines[i]
      .replace(/'\u09b8\u09cd\u099f\u09c1\u09a1\u09c7\u09a8\u09cd\u099f \u09aa\u09cb\u09b0\u09cd\u099f\u09be\u09b2'/g, "'\u09b8\u09cd\u099f\u09c1\u09a1\u09c7\u09a8\u09cd\u099f \u09aa\u09cd\u09b0\u09cb\u09ab\u09be\u0987\u09b2'")
      .replace(/'Student Portal'/g, "'Student Profile'");
    if (navLines[i] !== orig) {
      portalCount++;
      console.log(`Line ${i+1} changed: Student Portal -> Student Profile`);
    }
  }
}

fs.writeFileSync(navbarPath, navLines.join('\n'), 'utf8');
console.log(`Navbar: ${portalCount} label replacements done`);

// Final verification
const finalModal = fs.readFileSync(modalPath, 'utf8');
console.log('\n=== Final Verification ===');
console.log('bKash number correct:', finalModal.includes('01873275283'));
console.log('Rocket number correct:', finalModal.includes('01925251621'));
console.log('No International:', !finalModal.includes("id: 'international'"));
console.log('No dollar in badge:', !finalModal.includes("/ ${item.unitUsd}"));
console.log('Warm thank-you EN:', finalModal.includes('little contribution'));
console.log('Empty name init:', finalModal.includes('Name stays empty'));
