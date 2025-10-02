const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Navbar White Box in Dark Mode...\n');

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

    // Find the section where we added dark mode navbar styles
    const searchPattern = 'body.dark-mode .cid-tykduTdXjF .navbar {\n  background: var(--navbar-dark) !important;\n  border-bottom: 1px solid rgba(100, 191, 70, 0.2) !important;\n}';

    const replacementText = `body.dark-mode section.menu.cid-tykduTdXjF,
body.dark-mode .cid-tykduTdXjF,
body.dark-mode .menu.cid-tykduTdXjF {
  background-color: transparent !important;
  background: transparent !important;
}

body.dark-mode .cid-tykduTdXjF .navbar,
body.dark-mode section.menu.cid-tykduTdXjF .navbar {
  background: rgba(20, 25, 40, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  border-bottom: 1px solid rgba(100, 191, 70, 0.2) !important;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5) !important;
}

body.dark-mode .cid-tykduTdXjF .menu-container {
  background: transparent !important;
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
console.log('The navbar white box should now be gone in dark mode!');
console.log('\nRefresh your browser and toggle dark mode to see the fix.');
