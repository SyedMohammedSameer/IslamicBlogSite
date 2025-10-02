const fs = require('fs');
const path = require('path');

console.log('🔧 Force Fixing Google Translate Colors...\n');

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

    // Add very specific, high-priority rules right after the Google Translate styles section
    const searchText = '.goog-te-gadget-simple {';

    if (content.includes(searchText)) {
      // Find the end of the Google Translate CSS block
      const insertPoint = content.indexOf('}', content.indexOf(searchText)) + 1;

      const forcedStyles = `

/* FORCE DARK MODE TRANSLATE TEXT - HIGH PRIORITY */
body.dark-mode .goog-te-gadget,
body.dark-mode .goog-te-gadget *,
body.dark-mode .goog-te-gadget-simple,
body.dark-mode .goog-te-gadget-simple *,
body.dark-mode #google_translate_element,
body.dark-mode #google_translate_element *,
body.dark-mode #google_translate_element select,
body.dark-mode #google_translate_element select option,
body.dark-mode #google_translate_element span,
body.dark-mode #google_translate_element div,
body.dark-mode #google_translate_element font {
  color: #e8eaed !important;
  background-color: transparent !important;
}

body.dark-mode #google_translate_element select {
  background-color: rgba(20, 25, 38, 0.9) !important;
  border: 1px solid rgba(100, 191, 70, 0.3) !important;
  padding: 4px 8px !important;
}

body.dark-mode .goog-te-gadget-icon {
  background-image: none !important;
  display: none !important;
}

body.dark-mode #google_translate_element a,
body.dark-mode .goog-te-gadget a {
  color: #64bf46 !important;
}
`;

      content = content.slice(0, insertPoint) + forcedStyles + content.slice(insertPoint);

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

console.log('\n✅ DONE! Fixed ${stats.filesProcessed} files');
console.log(`Errors: ${stats.errors}`);
console.log('\nForced ALL Google Translate elements to light color!');
console.log('Hard refresh (Ctrl+Shift+R) and check dark mode.');
