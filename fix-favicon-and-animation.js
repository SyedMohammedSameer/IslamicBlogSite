const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Favicon & Logo Animation...\n');

let stats = {
  faviconFixed: 0,
  animationRemoved: 0,
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
    let changed = false;

    // 1. Fix favicon - use SVG logo instead of .ico
    if (content.includes('islamic-miracles.ico')) {
      content = content.replace(
        /href="\.\/assets\/images\/islamic-miracles\.ico"/g,
        'href="./assets/images/islamic-miracles-logo.svg"'
      );
      stats.faviconFixed++;
      changed = true;
    }

    // Also check for other old favicon references
    if (content.includes('miracles-of-quran.ico')) {
      content = content.replace(
        /href="\.\/assets\/images\/miracles-of-quran\.ico"/g,
        'href="./assets/images/islamic-miracles-logo.svg"'
      );
      stats.faviconFixed++;
      changed = true;
    }

    // 2. Remove floating animation from logo
    const floatingAnimation = `.navbar-logo {
  animation: float 6s ease-in-out infinite;
}`;

    if (content.includes(floatingAnimation)) {
      content = content.replace(floatingAnimation, `.navbar-logo {
  /* Animation removed for stability */
}`);
      stats.animationRemoved++;
      changed = true;
    }

    // Also remove the @keyframes float definition
    const floatKeyframes = `@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}`;

    if (content.includes(floatKeyframes)) {
      content = content.replace(floatKeyframes, '/* Float animation removed */');
      changed = true;
    }

    // Handle minified version
    if (content.includes('animation: float 6s ease-in-out infinite')) {
      content = content.replace(/animation:\s*float\s+6s\s+ease-in-out\s+infinite;?/g, '/* animation removed */');
      stats.animationRemoved++;
      changed = true;
    }

    if (content.match(/@keyframes\s+float\s*\{[^}]+\}/)) {
      content = content.replace(/@keyframes\s+float\s*\{[^}]+\}/g, '/* keyframes removed */');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      if ((stats.faviconFixed + stats.animationRemoved) % 100 === 0) {
        console.log(`✓ Processed ${stats.faviconFixed + stats.animationRemoved} changes...`);
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
console.log(`Favicons updated: ${stats.faviconFixed}`);
console.log(`Animations removed: ${stats.animationRemoved}`);
console.log(`Errors: ${stats.errors}`);
console.log('\n✨ Changes:');
console.log('  • Favicon now uses SVG logo');
console.log('  • Logo no longer floats/animates');
console.log('  • Static, professional appearance');
console.log('\nRefresh your browser to see the changes!');
