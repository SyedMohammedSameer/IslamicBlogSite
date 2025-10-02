const fs = require('fs');
const path = require('path');

console.log('🔧 Patching Dark Mode Text Colors...\n');

let stats = { filesProcessed: 0, errors: 0 };

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

    // Find the dark mode text section and add more comprehensive rules
    const searchText = 'body.dark-mode .mbr-text,\nbody.dark-mode p,\nbody.dark-mode .mbr-section-subtitle,\nbody.dark-mode .text-black,\nbody.dark-mode .nav-link,\nbody.dark-mode .dropdown-item {\n  color: var(--text-dark) !important;\n}';

    const replacementText = `body.dark-mode .mbr-text,
body.dark-mode p,
body.dark-mode .mbr-section-subtitle,
body.dark-mode .text-black,
body.dark-mode .nav-link,
body.dark-mode .dropdown-item,
body.dark-mode .navbar-caption,
body.dark-mode .brand-name,
body.dark-mode .brand-name a,
body.dark-mode a.text-black,
body.dark-mode .link.text-black,
body.dark-mode a.nav-link,
body.dark-mode .display-4,
body.dark-mode .display-5,
body.dark-mode .display-7,
body.dark-mode li,
body.dark-mode span {
  color: #e8eaed !important;
}

body.dark-mode .text-primary,
body.dark-mode a.text-primary {
  color: #64bf46 !important;
}

body.dark-mode .cid-tykduTdXjF {
  background-color: transparent !important;
}

body.dark-mode .cid-tykduTdXjF .navbar {
  background: rgba(20, 25, 40, 0.95) !important;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5) !important;
}

body.dark-mode .hamburger span,
body.dark-mode .close-sidebar span {
  background: #e8eaed !important;
}`;

    if (content.includes(searchText)) {
      content = content.replace(searchText, replacementText);
      fs.writeFileSync(filePath, content, 'utf8');
      stats.filesProcessed++;
      if (stats.filesProcessed % 100 === 0) {
        console.log(`✓ Patched ${stats.filesProcessed} files...`);
      }
    }
  } catch (error) {
    console.error(`✗ Error: ${filePath}: ${error.message}`);
    stats.errors++;
  }
}

const htmlFiles = getAllHtmlFiles('.');
console.log(`Processing ${htmlFiles.length} files...\n`);
htmlFiles.forEach(processFile);

console.log(`\n✅ Done! Patched ${stats.filesProcessed} files.`);
console.log('Dark mode text should now be readable!');
