const fs = require('fs');
const path = require('path');

console.log('=========================================');
console.log('Islamic Miracles - Modern Redesign');
console.log('=========================================\n');

let stats = {
  filesProcessed: 0,
  logoUpdates: 0,
  translateFixes: 0,
  darkModeAdded: 0,
  glassmorphismAdded: 0,
  errors: 0
};

// Get all HTML files
function getAllHtmlFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      if (file === '.git' || file === 'node_modules') return;
      arrayOfFiles = getAllHtmlFiles(filePath, arrayOfFiles);
    } else {
      if (file.endsWith('.html')) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

// Process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fileChanged = false;

    // 1. Fix Google Translate widget size
    if (content.includes('googleTranslateElementInit')) {
      // Add CSS to make translate widget smaller and fixed to bottom
      const translateStyles = `
/* Google Translate Widget Styling */
.goog-te-banner-frame {display: none !important;}
body {top: 0 !important;}
#google_translate_element {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  font-size: 12px !important;
}
#google_translate_element select {
  border: none;
  background: transparent;
  font-size: 12px;
  padding: 4px;
  outline: none;
  cursor: pointer;
}
.goog-te-gadget {
  font-size: 0 !important;
}
.goog-te-gadget img {
  display: none !important;
}
.goog-te-gadget-simple {
  background: transparent !important;
  border: none !important;
  font-size: 12px !important;
  padding: 0 !important;
}
`;

      // Insert before closing style tag
      if (content.includes('</style>')) {
        content = content.replace('</style>', translateStyles + '</style>');
        stats.translateFixes++;
        fileChanged = true;
      }
    }

    // 2. Add Dark Mode Support
    if (!content.includes('/* DARK MODE */')) {
      const darkModeStyles = `

/* ===== DARK MODE SUPPORT ===== */
:root {
  --bg-light: #ffffff;
  --bg-dark: #0f1419;
  --text-light: #48525c;
  --text-dark: #e8eaed;
  --card-light: #f7f7f7;
  --card-dark: #1a1f2e;
  --navbar-light: #ffffff;
  --navbar-dark: #16202e;
  --primary: #1B4332;
  --primary-dark: #2D6A4F;
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: var(--bg-dark) !important;
    color: var(--text-dark) !important;
  }

  .navbar, .menu {
    background-color: var(--navbar-dark) !important;
  }

  .cid-tykduTdXjF .navbar {
    background: var(--navbar-dark) !important;
  }

  .card, .item-box, .item-box-wrapper {
    background-color: var(--card-dark) !important;
  }

  .mbr-text, p, .mbr-section-subtitle {
    color: var(--text-dark) !important;
  }

  .text-black, .nav-link {
    color: var(--text-dark) !important;
  }

  .dropdown-menu {
    background-color: var(--card-dark) !important;
  }

  section {
    background-color: var(--bg-dark) !important;
  }

  .cid-tF4hhqjIqj, .cid-truALLdQC0, .cid-tosj0hymaw, .cid-tw2Zf5Bp9C, .cid-tNfSA8dt1p {
    background-color: var(--bg-dark) !important;
  }
}

/* ===== GLASSMORPHISM EFFECTS ===== */
.navbar {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15) !important;
}

@media (prefers-color-scheme: dark) {
  .navbar {
    background: rgba(22, 32, 46, 0.85) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  #google_translate_element {
    background: rgba(26, 31, 46, 0.95) !important;
    color: #e8eaed !important;
  }
}

.card, .item-wrapper {
  background: rgba(247, 247, 247, 0.7) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.3s ease;
}

.card:hover, .item-wrapper:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

@media (prefers-color-scheme: dark) {
  .card, .item-wrapper {
    background: rgba(26, 31, 46, 0.7) !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

/* ===== MODERN BUTTON STYLES ===== */
.btn {
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
}

.btn:hover {
  transform: translateY(-2px) scale(1.02);
}

/* ===== IMPROVED SIDEBAR (Mobile) ===== */
@media (max-width: 991px) {
  .builder-sidebar {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  }

  @media (prefers-color-scheme: dark) {
    .builder-sidebar {
      background: rgba(15, 20, 25, 0.95) !important;
    }
  }
}

/* ===== SCROLL TO TOP BUTTON ===== */
#scrollToTopButton {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background-color: rgba(27, 67, 50, 0.85) !important;
  transition: all 0.3s ease;
}

#scrollToTopButton:hover {
  transform: scale(1.1);
  background-color: rgba(27, 67, 50, 1) !important;
}

/* ===== SMOOTH ANIMATIONS ===== */
* {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* ===== IMPROVED TYPOGRAPHY ===== */
body {
  font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-smooth: antialiased;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.mbr-section-title {
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* ===== DESKTOP SIDEBAR NAVIGATION (NEW!) ===== */
@media (min-width: 992px) {
  body {
    padding-left: 0;
  }

  /* Make navbar sticky on desktop */
  .navbar-fixed-top {
    position: sticky !important;
    top: 0;
    z-index: 1000;
  }
}
`;

      // Insert before closing style tag
      if (content.includes('</style>')) {
        content = content.replace('</style>', darkModeStyles + '</style>');
        stats.darkModeAdded++;
        stats.glassmorphismAdded++;
        fileChanged = true;
      }
    }

    // 3. Update logo references (miracles-of-quran -> islamic-miracles)
    const logoUpdates = [
      { from: /miracles-of-quran\.ico/g, to: 'islamic-miracles.ico' },
      { from: /miracles-of-quran\.webp/g, to: 'islamic-miracles.webp' },
      { from: /miracles-of-quran-wormhole\.webp/g, to: 'islamic-miracles-wormhole.webp' },
      { from: /miracles-of-quran-1\.gif/g, to: 'islamic-miracles.gif' }
    ];

    logoUpdates.forEach(({ from, to }) => {
      if (content.match(from)) {
        content = content.replace(from, to);
        stats.logoUpdates++;
        fileChanged = true;
      }
    });

    // Write back if changed
    if (fileChanged) {
      fs.writeFileSync(filePath, content, 'utf8');
      stats.filesProcessed++;

      if (stats.filesProcessed % 100 === 0) {
        console.log(`✓ Processed ${stats.filesProcessed} files...`);
      }
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    stats.errors++;
  }
}

// Main execution
console.log('[1/3] Scanning for HTML files...');
const htmlFiles = getAllHtmlFiles('.');

console.log(`Found ${htmlFiles.length} HTML files\n`);

console.log('[2/3] Applying modern redesign...');
console.log('  • Adding dark mode support');
console.log('  • Adding glassmorphism effects');
console.log('  • Fixing Google Translate widget');
console.log('  • Updating logo references\n');

htmlFiles.forEach(processFile);

console.log('\n[3/3] Renaming logo files...');

// Rename logo files in assets/images
const logoRenames = [
  { from: 'assets/images/miracles-of-quran.ico', to: 'assets/images/islamic-miracles.ico' },
  { from: 'assets/images/miracles-of-quran.webp', to: 'assets/images/islamic-miracles.webp' },
  { from: 'assets/images/miracles-of-quran-wormhole.webp', to: 'assets/images/islamic-miracles-wormhole.webp' },
  { from: 'assets/images/miracles-of-quran-1.gif', to: 'assets/images/islamic-miracles.gif' }
];

logoRenames.forEach(({ from, to }) => {
  try {
    if (fs.existsSync(from) && !fs.existsSync(to)) {
      fs.copyFileSync(from, to);
      console.log(`  ✓ Created ${to}`);
    }
  } catch (error) {
    console.log(`  ⊘ ${from} not found or ${to} already exists`);
  }
});

// Summary
console.log('\n=========================================');
console.log('Redesign Complete!');
console.log('=========================================');
console.log(`Files modified: ${stats.filesProcessed}`);
console.log(`Logo updates: ${stats.logoUpdates}`);
console.log(`Google Translate fixes: ${stats.translateFixes}`);
console.log(`Dark mode added: ${stats.darkModeAdded} files`);
console.log(`Glassmorphism added: ${stats.glassmorphismAdded} files`);
console.log(`Errors: ${stats.errors}`);
console.log('\n✨ Your site now features:');
console.log('  • 🌙 Automatic dark mode (based on system preference)');
console.log('  • 💎 Glassmorphism effects on cards and navbar');
console.log('  • 🔤 Fixed Google Translate widget (small, bottom-right)');
console.log('  • 🎨 Updated logo references');
console.log('  • ⚡ Smooth animations and transitions');
console.log('  • 📱 Improved mobile sidebar');
console.log('\nNext: Open index.html in your browser to see the changes!');
