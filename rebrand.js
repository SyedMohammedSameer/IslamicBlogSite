const fs = require('fs');
const path = require('path');

console.log('=========================================');
console.log('Starting Rebranding Process');
console.log('=========================================\n');

// Configuration
const replacements = [
  { from: /Miracles of Quran/g, to: 'Islamic Miracles' },
  { from: /Miracles of quran/g, to: 'Islamic Miracles' },
  { from: /miracles of quran/gi, to: 'Islamic Miracles' },
  { from: /MIRACLES OF QURAN/g, to: 'ISLAMIC MIRACLES' },
];

const playStorePattern = /<a\s+href="https:\/\/play\.google\.com\/store\/apps\/details[^>]*>[\s\S]*?<\/a>/gi;

let stats = {
  filesProcessed: 0,
  textReplacements: 0,
  playStoreLinksRemoved: 0,
  errors: 0
};

// Recursively get all files with specific extensions
function getAllFiles(dirPath, extensions, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      // Skip certain directories
      if (file === '.git' || file === 'node_modules') return;
      arrayOfFiles = getAllFiles(filePath, extensions, arrayOfFiles);
    } else {
      if (extensions.some(ext => file.endsWith(ext))) {
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

    // Apply text replacements
    replacements.forEach(({ from, to }) => {
      const matches = content.match(from);
      if (matches) {
        content = content.replace(from, to);
        stats.textReplacements += matches.length;
        fileChanged = true;
      }
    });

    // Remove Play Store links
    const playStoreMatches = content.match(playStorePattern);
    if (playStoreMatches) {
      content = content.replace(playStorePattern, '<!-- Play Store link removed -->');
      stats.playStoreLinksRemoved += playStoreMatches.length;
      fileChanged = true;
    }

    // Write back if changed
    if (fileChanged) {
      fs.writeFileSync(filePath, content, 'utf8');
      stats.filesProcessed++;

      // Show progress every 100 files
      if (stats.filesProcessed % 100 === 0) {
        console.log(`Processed ${stats.filesProcessed} files...`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    stats.errors++;
  }
}

// Main execution
console.log('[1/4] Scanning for HTML and JS files...');
const htmlFiles = getAllFiles('.', ['.html']);
const jsFiles = getAllFiles('.', ['.js']).filter(f => !f.includes('rebrand.js'));

console.log(`Found ${htmlFiles.length} HTML files and ${jsFiles.length} JS files\n`);

console.log('[2/4] Processing HTML files...');
htmlFiles.forEach(processFile);

console.log('[3/4] Processing JS files...');
jsFiles.forEach(processFile);

console.log('\n[4/4] Removing Play Store directory...');
const playStoreDir = path.join(__dirname, 'play.google.com');
if (fs.existsSync(playStoreDir)) {
  fs.rmSync(playStoreDir, { recursive: true, force: true });
  console.log('✓ Removed play.google.com directory');
} else {
  console.log('⊘ play.google.com directory not found');
}

// Summary
console.log('\n=========================================');
console.log('Rebranding Process Complete!');
console.log('=========================================');
console.log(`Files modified: ${stats.filesProcessed}`);
console.log(`Text replacements: ${stats.textReplacements}`);
console.log(`Play Store links removed: ${stats.playStoreLinksRemoved}`);
console.log(`Errors: ${stats.errors}`);
console.log('\nNext steps:');
console.log('1. Review the changes with git diff');
console.log('2. Update color scheme/design');
console.log('3. Test the site');
console.log('4. Commit changes');
