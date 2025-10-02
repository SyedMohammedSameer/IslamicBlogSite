const fs = require('fs');
const path = require('path');

console.log('=========================================');
console.log('🔧 Fixing Dark Mode & Logo Issues');
console.log('=========================================\n');

let stats = {
  filesProcessed: 0,
  logoFixed: 0,
  darkModeFixed: 0,
  errors: 0
};

function getAllHtmlFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file === '.git' || file === 'node_modules') return;
      arrayOfFiles = getAllHtmlFiles(filePath, arrayOfFiles);
    } else if (file.endsWith('.html')) {
      arrayOfFiles.push(filePath);
    }
  });
  return arrayOfFiles;
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fileChanged = false;

    // 1. COMPLETELY REPLACE ALL LOGO IMAGES
    // Replace any islamic-miracles-wormhole.webp or other variants
    if (content.includes('islamic-miracles-wormhole.webp') ||
        content.includes('islamic-miracles.webp') ||
        content.includes('islamic-miracles.gif')) {

      content = content.replace(
        /<img[^>]*src="[^"]*islamic-miracles[^"]*\.(webp|gif|png|jpg|jpeg)"[^>]*>/gi,
        '<img decoding="async" alt="Islamic Miracles" src="./assets/images/islamic-miracles-logo.svg" style="width: 50px; height: 50px;">'
      );

      // Also replace in amp-img tags
      content = content.replace(
        /src="[^"]*islamic-miracles[^"]*\.(webp|gif|png|jpg|jpeg)"/gi,
        'src="./assets/images/islamic-miracles-logo.svg"'
      );

      stats.logoFixed++;
      fileChanged = true;
    }

    // 2. FIX DARK MODE STYLES - Replace the problematic dark mode section
    if (content.includes('/* ===== ENHANCED DARK MODE WITH TOGGLE =====')) {
      const fixedDarkModeCSS = `

/* ===== FIXED DARK MODE WITH PROPER COLORS ===== */
:root {
  --bg-light: #f8f9fa;
  --bg-dark: #0f1419;
  --text-light: #2c3e50;
  --text-dark: #e8eaed;
  --card-light: #ffffff;
  --card-dark: #1e2538;
  --navbar-light: rgba(255, 255, 255, 0.9);
  --navbar-dark: rgba(20, 25, 38, 0.95);
  --primary-light: #1B4332;
  --primary-dark: #52b788;
  --accent: #64bf46;
}

/* ===== DARK MODE ACTIVE CLASS ===== */
body.dark-mode {
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%) !important;
  color: #e8eaed !important;
}

/* NAVBAR DARK MODE - NO WHITE BOX */
body.dark-mode .navbar,
body.dark-mode .menu,
body.dark-mode .cid-tykduTdXjF,
body.dark-mode .cid-tykduTdXjF .navbar,
body.dark-mode section.menu {
  background: rgba(20, 25, 38, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  border-bottom: 1px solid rgba(82, 183, 136, 0.2) !important;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5) !important;
}

/* FIX ALL TEXT COLORS IN DARK MODE */
body.dark-mode .text-black,
body.dark-mode .nav-link,
body.dark-mode .navbar-caption,
body.dark-mode .dropdown-item,
body.dark-mode .brand-name,
body.dark-mode .brand-name a {
  color: #e8eaed !important;
}

body.dark-mode .text-primary {
  color: #52b788 !important;
}

body.dark-mode .mbr-text,
body.dark-mode p,
body.dark-mode .mbr-section-subtitle,
body.dark-mode li,
body.dark-mode .display-4,
body.dark-mode .display-5,
body.dark-mode .display-7 {
  color: #e8eaed !important;
}

body.dark-mode .mbr-section-title,
body.dark-mode .display-1,
body.dark-mode .display-2,
body.dark-mode h1, body.dark-mode h2,
body.dark-mode h3, body.dark-mode h4 {
  color: #ffffff !important;
  text-shadow: 0 2px 12px rgba(82, 183, 136, 0.4);
}

/* CARDS AND BOXES IN DARK MODE */
body.dark-mode .card,
body.dark-mode .item-box,
body.dark-mode .item-box-wrapper,
body.dark-mode .item-wrapper,
body.dark-mode .card-wrapper {
  background: rgba(30, 37, 56, 0.7) !important;
  border: 1px solid rgba(82, 183, 136, 0.2) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
  backdrop-filter: blur(16px) !important;
}

body.dark-mode .card:hover,
body.dark-mode .item-wrapper:hover {
  border-color: rgba(82, 183, 136, 0.5) !important;
  box-shadow: 0 12px 48px rgba(82, 183, 136, 0.2),
              0 8px 32px rgba(0, 0, 0, 0.6) !important;
}

/* DROPDOWN MENUS IN DARK MODE */
body.dark-mode .dropdown-menu,
body.dark-mode .builder-sidebar,
body.dark-mode .navbar-collapse {
  background: rgba(20, 25, 38, 0.98) !important;
  backdrop-filter: blur(24px) !important;
  border: 1px solid rgba(82, 183, 136, 0.2) !important;
}

body.dark-mode .dropdown-item:hover {
  background: rgba(82, 183, 136, 0.15) !important;
  color: #ffffff !important;
}

/* SECTIONS BACKGROUND IN DARK MODE */
body.dark-mode section,
body.dark-mode .cid-tF4hhqjIqj,
body.dark-mode .cid-truALLdQC0,
body.dark-mode .cid-tosj0hymaw,
body.dark-mode .cid-tw2Zf5Bp9C,
body.dark-mode .cid-tNfSA8dt1p {
  background-color: transparent !important;
}

/* BUTTONS IN DARK MODE */
body.dark-mode .btn-primary,
body.dark-mode .btn {
  background: linear-gradient(135deg, #2D6A4F 0%, #52b788 100%) !important;
  border: none !important;
  color: #ffffff !important;
  box-shadow: 0 4px 20px rgba(82, 183, 136, 0.4) !important;
}

body.dark-mode .btn:hover {
  box-shadow: 0 8px 30px rgba(82, 183, 136, 0.6) !important;
}

/* GOOGLE TRANSLATE IN DARK MODE */
body.dark-mode #google_translate_element {
  background: rgba(30, 37, 56, 0.95) !important;
  border: 1px solid rgba(82, 183, 136, 0.3) !important;
  color: #e8eaed !important;
}

body.dark-mode #google_translate_element select {
  background: rgba(20, 25, 38, 0.9) !important;
  color: #e8eaed !important;
}

/* DARK MODE TOGGLE BUTTON STYLING */
body.dark-mode #darkModeToggle {
  background: rgba(30, 37, 56, 0.95) !important;
  border-color: rgba(82, 183, 136, 0.4) !important;
  box-shadow: 0 4px 20px rgba(82, 183, 136, 0.3) !important;
}

/* ===== LIGHT MODE (Default) ===== */
body {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
  color: #2c3e50 !important;
}

.navbar,
.menu,
.cid-tykduTdXjF .navbar {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  border-bottom: 1px solid rgba(27, 67, 50, 0.1) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
}

.card,
.item-wrapper,
.item-box {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(16px) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.12),
              inset 0 1px 1px rgba(255, 255, 255, 0.9) !important;
}

.card:hover,
.item-wrapper:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 48px rgba(31, 38, 135, 0.2),
              inset 0 1px 1px rgba(255, 255, 255, 1) !important;
  border-color: rgba(27, 67, 50, 0.3) !important;
}

.dropdown-menu {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(27, 67, 50, 0.1) !important;
  border-radius: 12px !important;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15) !important;
}

/* ===== COMMON STYLES (Both Modes) ===== */
.btn {
  border-radius: 16px !important;
  background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%) !important;
  border: none !important;
  color: #ffffff !important;
  box-shadow: 0 8px 24px rgba(27, 67, 50, 0.3) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 32px rgba(27, 67, 50, 0.4) !important;
}

#scrollToTopButton {
  backdrop-filter: blur(12px);
  background: linear-gradient(135deg, rgba(27, 67, 50, 0.9), rgba(45, 106, 79, 0.9)) !important;
  box-shadow: 0 4px 20px rgba(27, 67, 50, 0.4);
  transition: all 0.3s ease;
}

#scrollToTopButton:hover {
  transform: scale(1.2) rotate(360deg);
}

body.dark-mode #scrollToTopButton {
  background: linear-gradient(135deg, rgba(45, 106, 79, 0.9), rgba(82, 183, 136, 0.9)) !important;
  box-shadow: 0 4px 20px rgba(82, 183, 136, 0.5);
}

/* ===== SMOOTH TRANSITIONS ===== */
body, .navbar, .card, .dropdown-menu, .btn,
.text-black, .nav-link, .mbr-text, p {
  transition: background-color 0.4s ease,
              color 0.4s ease,
              border-color 0.4s ease,
              box-shadow 0.4s ease !important;
}

/* ===== CUSTOM SCROLLBAR ===== */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: rgba(248, 249, 250, 0.5);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #1B4332, #2D6A4F);
  border-radius: 6px;
}

body.dark-mode ::-webkit-scrollbar-track {
  background: rgba(15, 20, 25, 0.5);
}

body.dark-mode ::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #2D6A4F, #52b788);
}

/* ===== MOBILE SIDEBAR ===== */
@media (max-width: 991px) {
  .builder-sidebar {
    background: rgba(255, 255, 255, 0.98) !important;
    backdrop-filter: blur(24px) !important;
  }

  body.dark-mode .builder-sidebar {
    background: rgba(20, 25, 38, 0.98) !important;
  }
}

/* ===== ANIMATED GRADIENT HERO ===== */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.cid-sBvrVBmg4q {
  background: linear-gradient(-45deg, #1B4332, #2D6A4F, #52b788, #95d5b2) !important;
  background-size: 400% 400% !important;
  animation: gradientShift 15s ease infinite !important;
}

body.dark-mode .cid-sBvrVBmg4q {
  background: linear-gradient(-45deg, #0a0e27, #1B4332, #2D6A4F, #1a1f3a) !important;
  background-size: 400% 400% !important;
}
`;

      // Find and replace the dark mode section
      const darkModeStart = content.indexOf('/* ===== ENHANCED DARK MODE WITH TOGGLE =====');
      const darkModeEnd = content.indexOf('body.dark-mode ::-webkit-scrollbar-thumb {', darkModeStart);

      if (darkModeStart !== -1 && darkModeEnd !== -1) {
        // Find the end of the scrollbar section
        const sectionEnd = content.indexOf('}', content.indexOf('}', darkModeEnd) + 1) + 1;
        const beforeDarkMode = content.substring(0, darkModeStart);
        const afterDarkMode = content.substring(sectionEnd);

        content = beforeDarkMode + fixedDarkModeCSS + afterDarkMode;
        stats.darkModeFixed++;
        fileChanged = true;
      }
    }

    if (fileChanged) {
      fs.writeFileSync(filePath, content, 'utf8');
      stats.filesProcessed++;
      if (stats.filesProcessed % 100 === 0) {
        console.log(`✓ Processed ${stats.filesProcessed} files...`);
      }
    }
  } catch (error) {
    console.error(`✗ Error: ${filePath}: ${error.message}`);
    stats.errors++;
  }
}

// Main execution
console.log('[1/2] Scanning files...');
const htmlFiles = getAllHtmlFiles('.');
console.log(`Found ${htmlFiles.length} files\n`);

console.log('[2/2] Fixing issues...');
console.log('  • Replacing ALL logo images with SVG');
console.log('  • Fixing dark mode colors (readable text)');
console.log('  • Removing white box from navbar');
console.log('  • Fixing dropdown colors\n');

htmlFiles.forEach(processFile);

console.log('\n=========================================');
console.log('✅ FIXES COMPLETE!');
console.log('=========================================');
console.log(`Files processed: ${stats.filesProcessed}`);
console.log(`Logos fixed: ${stats.logoFixed}`);
console.log(`Dark modes fixed: ${stats.darkModeFixed}`);
console.log(`Errors: ${stats.errors}`);
console.log('\n🎨 FIXED ISSUES:');
console.log('  ✅ Logo now uses SVG (no more wormhole image)');
console.log('  ✅ Dark mode navbar: No white box');
console.log('  ✅ Dark mode text: Light colors (readable)');
console.log('  ✅ Dark mode primary: Bright green (#52b788)');
console.log('  ✅ Dark mode background: Deep blue-black');
console.log('  ✅ Dropdowns: Proper dark styling');
console.log('\nRefresh your browser and toggle dark mode!');
