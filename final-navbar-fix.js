const fs = require('fs');
const path = require('path');

console.log('🔧 Final Navbar White Background Fix...\n');

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

    // Match the pattern: .cid-XXXXX .builder-sidebar,.cid-XXXXX .collapse,.cid-XXXXX .navbar.navbar-expand-lg .dropdown .dropdown-menu{background-color: #ffffff;}
    // This regex handles both minified and formatted CSS
    const regex = /(\.cid-\w+)\s+\.builder-sidebar,\1\s+\.collapse,\1\s+\.navbar\.navbar-expand-lg\s+\.dropdown\s+\.dropdown-menu\s*\{\s*background-color:\s*#ffffff;\s*\}/g;

    if (content.match(regex)) {
      // Add dark mode override after each match
      content = content.replace(regex, (match, cidClass) => {
        return match + `\n\nbody.dark-mode ${cidClass} .builder-sidebar,\nbody.dark-mode ${cidClass} .collapse,\nbody.dark-mode ${cidClass} .navbar.navbar-expand-lg .dropdown .dropdown-menu {\n  background-color: rgba(15, 20, 40, 0.95) !important;\n}`;
      });

      changed = true;
    }

    if (changed) {
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

console.log(`\n✅ Done! Fixed ${stats.filesProcessed} files.`);
console.log(`Errors: ${stats.errors}`);
console.log('\nAll navbar white backgrounds should now be dark in dark mode!');
