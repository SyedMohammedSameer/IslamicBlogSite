const fs = require('fs');
const path = require('path');

console.log('=========================================');
console.log('🚀 ULTIMATE Modern Redesign v2.0');
console.log('=========================================\n');

let stats = {
  filesProcessed: 0,
  darkModeToggleAdded: 0,
  enhancedDesign: 0,
  logoReplaced: 0,
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

    // 1. REPLACE OLD LOGO COMPLETELY - Replace <amp-img> tags
    if (content.includes('miracles-of-quran')) {
      // Find and replace the logo amp-img with SVG
      content = content.replace(
        /<amp-img[^>]*src="[^"]*miracles-of-quran[^"]*"[^>]*>[\s\S]*?<\/amp-img>/g,
        '<amp-img loading="lazy" src="./assets/images/islamic-miracles-logo.svg" layout="fixed" width="50" height="50" alt="Islamic Miracles" class="mobirise-loader"><div class="mobirise-spinner"><em></em><em></em><em></em></div><img width="50" height="50" src="./assets/images/islamic-miracles-logo.svg" alt="Islamic Miracles"></amp-img>'
      );
      stats.logoReplaced++;
      fileChanged = true;
    }

    // 2. ADD DARK MODE TOGGLE BUTTON - Insert before </body>
    if (!content.includes('darkModeToggle') && content.includes('</body>')) {
      const darkModeToggleHTML = `
<!-- DARK MODE TOGGLE BUTTON -->
<button id="darkModeToggle" onclick="toggleDarkMode()"
  style="position: fixed; top: 80px; right: 20px; z-index: 10000;
  background: rgba(255,255,255,0.9); backdrop-filter: blur(10px);
  border: 2px solid rgba(27,67,50,0.3); border-radius: 50%; width: 50px; height: 50px;
  cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.3s;
  display: flex; align-items: center; justify-content: center; font-size: 24px;">
  <span id="modeIcon">🌙</span>
</button>

<script>
// Dark Mode Toggle Script
function toggleDarkMode() {
  const body = document.body;
  const isDark = body.classList.toggle('dark-mode');
  const icon = document.getElementById('modeIcon');
  const toggle = document.getElementById('darkModeToggle');

  if (isDark) {
    icon.textContent = '☀️';
    toggle.style.background = 'rgba(26,31,46,0.9)';
    toggle.style.borderColor = 'rgba(183,228,199,0.3)';
    localStorage.setItem('darkMode', 'enabled');
  } else {
    icon.textContent = '🌙';
    toggle.style.background = 'rgba(255,255,255,0.9)';
    toggle.style.borderColor = 'rgba(27,67,50,0.3)';
    localStorage.setItem('darkMode', 'disabled');
  }
}

// Check saved preference on load
(function() {
  const darkMode = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (darkMode === 'enabled' || (darkMode === null && prefersDark)) {
    document.body.classList.add('dark-mode');
    document.getElementById('modeIcon').textContent = '☀️';
    const toggle = document.getElementById('darkModeToggle');
    toggle.style.background = 'rgba(26,31,46,0.9)';
    toggle.style.borderColor = 'rgba(183,228,199,0.3)';
  }
})();
</script>
`;
      content = content.replace('</body>', darkModeToggleHTML + '</body>');
      stats.darkModeToggleAdded++;
      fileChanged = true;
    }

    // 3. ENHANCE DARK MODE STYLES - Replace existing dark mode section
    if (content.includes('/* ===== DARK MODE SUPPORT =====')) {
      const enhancedDarkMode = `

/* ===== ENHANCED DARK MODE WITH TOGGLE ===== */
:root {
  --bg-light: #f8f9fa;
  --bg-dark: #0a0e27;
  --text-light: #2c3e50;
  --text-dark: #e8eaed;
  --card-light: #ffffff;
  --card-dark: #1a1f3a;
  --navbar-light: rgba(255, 255, 255, 0.95);
  --navbar-dark: rgba(15, 20, 40, 0.95);
  --primary: #1B4332;
  --primary-dark: #2D6A4F;
  --accent: #64bf46;
  --shadow-light: rgba(0, 0, 0, 0.1);
  --shadow-dark: rgba(0, 0, 0, 0.5);
}

/* DARK MODE CLASS */
body.dark-mode {
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%) !important;
  color: var(--text-dark) !important;
}

body.dark-mode .navbar,
body.dark-mode .menu,
body.dark-mode .cid-tykduTdXjF .navbar {
  background: var(--navbar-dark) !important;
  border-bottom: 1px solid rgba(100, 191, 70, 0.2) !important;
}

body.dark-mode .card,
body.dark-mode .item-box,
body.dark-mode .item-box-wrapper,
body.dark-mode .item-wrapper {
  background: rgba(26, 31, 58, 0.6) !important;
  border: 1px solid rgba(100, 191, 70, 0.2) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
}

body.dark-mode .mbr-text,
body.dark-mode p,
body.dark-mode .mbr-section-subtitle,
body.dark-mode .text-black,
body.dark-mode .nav-link,
body.dark-mode .dropdown-item {
  color: var(--text-dark) !important;
}

body.dark-mode .dropdown-menu,
body.dark-mode .builder-sidebar {
  background: rgba(15, 20, 40, 0.95) !important;
  border: 1px solid rgba(100, 191, 70, 0.2) !important;
}

body.dark-mode section {
  background-color: transparent !important;
}

body.dark-mode .cid-tF4hhqjIqj,
body.dark-mode .cid-truALLdQC0,
body.dark-mode .cid-tosj0hymaw,
body.dark-mode .cid-tw2Zf5Bp9C,
body.dark-mode .cid-tNfSA8dt1p {
  background: transparent !important;
}

body.dark-mode .mbr-section-title {
  color: #ffffff !important;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

body.dark-mode .btn-primary {
  background: linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%) !important;
  box-shadow: 0 4px 15px rgba(45, 106, 79, 0.4) !important;
}

body.dark-mode #google_translate_element {
  background: rgba(26, 31, 46, 0.95) !important;
  border: 1px solid rgba(100, 191, 70, 0.2) !important;
  color: #e8eaed !important;
}

/* LIGHT MODE (Default) */
body {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
  color: var(--text-light) !important;
}

/* ===== ULTRA GLASSMORPHISM ===== */
.navbar {
  background: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  border-bottom: 1px solid rgba(27, 67, 50, 0.1) !important;
  box-shadow: 0 8px 32px 0 rgba(27, 67, 50, 0.1) !important;
}

.card,
.item-wrapper,
.item-box {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(16px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15),
              inset 0 1px 1px rgba(255, 255, 255, 0.8) !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover,
.item-wrapper:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 48px 0 rgba(31, 38, 135, 0.25),
              inset 0 1px 1px rgba(255, 255, 255, 0.9) !important;
  border: 1px solid rgba(27, 67, 50, 0.3) !important;
}

/* ===== NEON GLOW EFFECTS ===== */
.mbr-section-title {
  text-shadow: 0 0 20px rgba(27, 67, 50, 0.3);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.btn {
  border-radius: 16px !important;
  background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%) !important;
  border: none !important;
  box-shadow: 0 8px 24px rgba(27, 67, 50, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.btn:hover:before {
  left: 100%;
}

.btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 32px rgba(27, 67, 50, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
}

/* ===== ANIMATED GRADIENT BACKGROUNDS ===== */
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

/* ===== FLOATING ANIMATION ===== */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.navbar-logo {
  animation: float 6s ease-in-out infinite;
}

/* ===== ENHANCED SCROLL TO TOP ===== */
#scrollToTopButton {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: linear-gradient(135deg, rgba(27, 67, 50, 0.9), rgba(45, 106, 79, 0.9)) !important;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(27, 67, 50, 0.4);
}

#scrollToTopButton:hover {
  transform: scale(1.2) rotate(360deg);
  box-shadow: 0 6px 30px rgba(27, 67, 50, 0.6);
}

/* ===== BETTER DROPDOWN MENUS ===== */
.dropdown-menu {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(27, 67, 50, 0.1) !important;
  border-radius: 12px !important;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15) !important;
}

.dropdown-item:hover {
  background: linear-gradient(90deg, rgba(27, 67, 50, 0.1), rgba(45, 106, 79, 0.1)) !important;
  transform: translateX(8px);
  transition: all 0.3s;
}

/* ===== IMPROVED TYPOGRAPHY ===== */
body {
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-smooth: always;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.display-1, .display-2, .mbr-section-title {
  font-weight: 800;
  background: linear-gradient(135deg, #1B4332, #2D6A4F, #52b788);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ===== PARALLAX EFFECT ON IMAGES ===== */
amp-img {
  transition: transform 0.5s ease;
}

amp-img:hover {
  transform: scale(1.05);
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

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #2D6A4F, #52b788);
}

body.dark-mode ::-webkit-scrollbar-track {
  background: rgba(10, 14, 39, 0.5);
}

/* ===== LOADING ANIMATIONS ===== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeInUp 0.6s ease-out;
}

.card:nth-child(1) { animation-delay: 0.1s; }
.card:nth-child(2) { animation-delay: 0.2s; }
.card:nth-child(3) { animation-delay: 0.3s; }
.card:nth-child(4) { animation-delay: 0.4s; }

/* ===== MOBILE RESPONSIVENESS ===== */
@media (max-width: 991px) {
  .builder-sidebar {
    background: rgba(255, 255, 255, 0.98) !important;
    backdrop-filter: blur(24px) !important;
    -webkit-backdrop-filter: blur(24px) !important;
  }

  body.dark-mode .builder-sidebar {
    background: rgba(15, 20, 40, 0.98) !important;
  }
}
`;

      content = content.replace(
        /\/\* ===== DARK MODE SUPPORT ===== \*\/[\s\S]*?\/\* ===== GLASSMORPHISM EFFECTS ===== \*\/[\s\S]*?@media \(max-width: 991px\)[^}]+\}[^}]+\}/,
        enhancedDarkMode
      );
      stats.enhancedDesign++;
      fileChanged = true;
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
console.log('[1/4] Scanning files...');
const htmlFiles = getAllHtmlFiles('.');
console.log(`Found ${htmlFiles.length} files\n`);

console.log('[2/4] Applying ultimate redesign...');
console.log('  • Adding dark/light mode toggle button');
console.log('  • Ultra glassmorphism effects');
console.log('  • Neon glows and gradients');
console.log('  • Animated backgrounds');
console.log('  • Completely replacing logo\n');

htmlFiles.forEach(processFile);

console.log('\n[3/4] Removing old logo files...');
const oldLogos = [
  'assets/images/miracles-of-quran.ico',
  'assets/images/miracles-of-quran.webp',
  'assets/images/miracles-of-quran-1.gif',
  'assets/images/miracles-of-quran-wormhole.webp'
];

oldLogos.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`  ✓ Deleted ${file}`);
    }
  } catch (error) {
    console.log(`  ⊘ Could not delete ${file}`);
  }
});

console.log('\n[4/4] Creating modern logo...');
// The SVG logo already exists from previous script

console.log('\n=========================================');
console.log('✨ ULTIMATE REDESIGN COMPLETE!');
console.log('=========================================');
console.log(`Files processed: ${stats.filesProcessed}`);
console.log(`Dark mode toggles added: ${stats.darkModeToggleAdded}`);
console.log(`Enhanced designs: ${stats.enhancedDesign}`);
console.log(`Logos replaced: ${stats.logoReplaced}`);
console.log(`Errors: ${stats.errors}`);
console.log('\n🎨 NEW FEATURES:');
console.log('  • 🌙☀️ Manual dark/light toggle (top-right)');
console.log('  • 💎 Ultra glassmorphism everywhere');
console.log('  • ✨ Neon glow effects');
console.log('  • 🌈 Animated gradient backgrounds');
console.log('  • 🎭 Floating logo animation');
console.log('  • 🎪 Hover effects with shine');
console.log('  • 📜 Custom scrollbar');
console.log('  • 🚀 Fade-in animations');
console.log('  • 🖼️ New SVG logo');
console.log('\nOpen index.html and click the 🌙/☀️ button!');
