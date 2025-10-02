const fs = require('fs');
const path = require('path');

console.log('🔧 Applying Navbar Dark Mode Fix...\n');

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

    // Find the white background rule
    const searchPattern = `.cid-tykduTdXjF .builder-sidebar,
.cid-tykduTdXjF .collapse,
.cid-tykduTdXjF .navbar.navbar-expand-lg .dropdown .dropdown-menu {
  background-color: #ffffff;
}`;

    const replacementText = `.cid-tykduTdXjF .builder-sidebar,
.cid-tykduTdXjF .collapse,
.cid-tykduTdXjF .navbar.navbar-expand-lg .dropdown .dropdown-menu {
  background-color: #ffffff;
}

body.dark-mode .cid-tykduTdXjF .builder-sidebar,
body.dark-mode .cid-tykduTdXjF .collapse,
body.dark-mode .cid-tykduTdXjF .navbar.navbar-expand-lg .dropdown .dropdown-menu {
  background-color: rgba(15, 20, 40, 0.95) !important;
}`;

    if (content.includes(searchPattern)) {
      content = content.replace(searchPattern, replacementText);
      fs.writeFileSync(filePath, content, 'utf8');
      stats.filesProcessed++;
      if (stats.filesProcessed % 100 === 0) {
        console.log(`✓ Fixed ${stats.filesProcessed} files...`);
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

console.log(`\n✅ Done! Fixed ${stats.filesProcessed} files.`);
console.log('Navbar white background is now fixed in dark mode across ALL pages!');
console.log('\nRefresh any blog page and toggle dark mode to verify.');
