const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing All Navbar White Backgrounds...\n');

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
    let changed = false;

    // Match ANY .cid-* class that has the white background pattern
    const regex = /(\.cid-\w+) \.builder-sidebar,\n\1 \.collapse,\n\1 \.navbar\.navbar-expand-lg \.dropdown \.dropdown-menu \{\n  background-color: #ffffff;\n\}/g;

    const matches = content.match(regex);

    if (matches) {
      matches.forEach(match => {
        // Extract the CID class
        const cidMatch = match.match(/\.cid-\w+/);
        if (cidMatch) {
          const cidClass = cidMatch[0];

          // Add the dark mode override right after the original rule
          const darkModeRule = `\n\nbody.dark-mode ${cidClass} .builder-sidebar,\nbody.dark-mode ${cidClass} .collapse,\nbody.dark-mode ${cidClass} .navbar.navbar-expand-lg .dropdown .dropdown-menu {\n  background-color: rgba(15, 20, 40, 0.95) !important;\n}`;

          content = content.replace(match, match + darkModeRule);
          changed = true;
        }
      });

      if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        stats.filesProcessed++;
        if (stats.filesProcessed % 100 === 0) {
          console.log(`✓ Fixed ${stats.filesProcessed} files...`);
        }
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

console.log(`\n✅ Done! Fixed ${stats.filesProcessed} files.`);
console.log(`Errors: ${stats.errors}`);
console.log('\nAll navbar white backgrounds now have dark mode overrides!');
console.log('Refresh any page and toggle dark mode to verify.');
