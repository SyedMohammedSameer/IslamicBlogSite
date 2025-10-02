const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Google Translate Text Colors...\n');

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

    // Find the existing Google Translate dark mode styles
    const searchPattern = `body.dark-mode #google_translate_element {
  background: rgba(26, 31, 46, 0.95) !important;
  border: 1px solid rgba(100, 191, 70, 0.2) !important;
  color: #e8eaed !important;
}`;

    const replacementText = `body.dark-mode #google_translate_element {
  background: rgba(26, 31, 46, 0.95) !important;
  border: 1px solid rgba(100, 191, 70, 0.2) !important;
  color: #e8eaed !important;
}

body.dark-mode #google_translate_element select {
  background: rgba(20, 25, 38, 0.9) !important;
  color: #e8eaed !important;
  border: 1px solid rgba(100, 191, 70, 0.3) !important;
}

body.dark-mode #google_translate_element .goog-te-gadget {
  color: #e8eaed !important;
}

body.dark-mode #google_translate_element .goog-te-gadget-simple {
  color: #e8eaed !important;
  background: transparent !important;
}

body.dark-mode #google_translate_element span {
  color: #e8eaed !important;
}

body.dark-mode #google_translate_element a {
  color: #64bf46 !important;
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
    console.error(`✗ Error: ${path.basename(filePath)}: ${error.message}`);
    stats.errors++;
  }
}

const htmlFiles = getAllHtmlFiles('.');
console.log(`Processing ${htmlFiles.length} files...\n`);
htmlFiles.forEach(processFile);

console.log('\n=========================================');
console.log('✅ COMPLETE!');
console.log('=========================================');
console.log(`Files fixed: ${stats.filesProcessed}`);
console.log(`Errors: ${stats.errors}`);
console.log('\n✨ Google Translate text is now readable in dark mode:');
console.log('  • "Select Language" - light gray');
console.log('  • "Powered by" - light gray');
console.log('  • Dropdown - light text on dark background');
console.log('  • Links - bright green');
console.log('\nRefresh and toggle dark mode to see!');
