const fs = require('fs');
const path = require('path');

class PathFixer {
  constructor(sourceDir) {
    this.sourceDir = sourceDir;
    this.processedFiles = 0;
    this.miraculesSubDir = path.join(sourceDir, 'www.miracles-of-quran.com');
  }

  // Get all HTML files recursively with circular reference protection
  getAllHtmlFiles(dir, visited = new Set()) {
    const files = [];
    
    // Get absolute path to avoid circular references
    const absDir = path.resolve(dir);
    
    // Check if we've already visited this directory
    if (visited.has(absDir)) {
      console.log(`⚠️  Skipping circular reference: ${absDir}`);
      return files;
    }
    
    visited.add(absDir);
    
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        
        // Skip certain directories that might cause issues
        if (item.name.startsWith('.') || 
            item.name === 'node_modules' || 
            item.name.includes('backup') ||
            item.name === 'hts-cache') {
          continue;
        }
        
        if (item.isDirectory()) {
          files.push(...this.getAllHtmlFiles(fullPath, visited));
        } else if (item.name.endsWith('.html')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.log(`⚠️  Could not read directory ${dir}: ${error.message}`);
    }
    
    return files;
  }

  // Analyze current file structure
  analyzeStructure() {
    console.log('🔍 Analyzing current structure...');
    
    // Check for dual index.html situation
    const outsideIndex = path.join(this.sourceDir, 'index.html');
    const insideIndex = path.join(this.miraculesSubDir, 'index.html');
    
    if (fs.existsSync(outsideIndex) && fs.existsSync(insideIndex)) {
      console.log('⚠️  Found TWO index.html files:');
      console.log('   1. Outside: ' + outsideIndex);
      console.log('   2. Inside:  ' + insideIndex);
      
      // Analyze both files
      try {
        const outsideContent = fs.readFileSync(outsideIndex, 'utf8');
        const insideContent = fs.readFileSync(insideIndex, 'utf8');
        
        console.log('\n📄 Outside index.html preview:');
        console.log('   Title:', this.extractTitle(outsideContent));
        console.log('   Size:', outsideContent.length, 'characters');
        console.log('   Contains HTTrack refs:', outsideContent.toLowerCase().includes('httrack'));
        
        console.log('\n📄 Inside index.html preview:');
        console.log('   Title:', this.extractTitle(insideContent));
        console.log('   Size:', insideContent.length, 'characters');
        console.log('   Contains HTTrack refs:', insideContent.toLowerCase().includes('httrack'));
        
      } catch (error) {
        console.log('   Could not read index files for analysis');
      }
    }
    
    if (fs.existsSync(this.miraculesSubDir)) {
      console.log('\n✅ Found www.miracles-of-quran.com subdirectory');
      
      // Check what's inside
      const contents = fs.readdirSync(this.miraculesSubDir);
      console.log('📁 Contents:', contents.slice(0, 10).join(', ') + (contents.length > 10 ? '...' : ''));
      
      // Check for common directories
      const commonDirs = ['css', 'js', 'images', 'assets'];
      commonDirs.forEach(dir => {
        if (contents.includes(dir)) {
          console.log(`  ✅ Found ${dir} directory`);
        }
      });
      
      return true;
    } else {
      console.log('❌ www.miracles-of-quran.com subdirectory not found');
      console.log('📁 Current contents:', fs.readdirSync(this.sourceDir));
      return false;
    }
  }

  // Helper function to extract title from HTML
  extractTitle(htmlContent) {
    const titleMatch = htmlContent.match(/<title[^>]*>(.*?)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : 'No title found';
  }

  // Fix paths in HTML files
  fixPathsInHtml(filePath, rootPath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Calculate how deep this file is from the new root
      const relativePath = path.relative(rootPath, filePath);
      const depth = relativePath.split(path.sep).length - 1;
      
      console.log(`📄 Processing: ${relativePath} (depth: ${depth})`);
      
      // Fix different types of relative paths
      if (depth === 0) {
        // File is at root level - change ../ to ./
        content = content.replace(/\.\.\//g, './');
      } else if (depth === 1) {
        // File is one level deep - ../ should become ./
        content = content.replace(/\.\.\//g, '../');
      } else {
        // File is multiple levels deep - adjust accordingly
        const upLevels = '../'.repeat(depth);
        content = content.replace(/\.\.\//g, upLevels);
      }
      
      // Fix absolute paths that reference the old domain structure
      content = content.replace(/["']\/www\.miracles-of-quran\.com\//g, '"/');
      content = content.replace(/["']www\.miracles-of-quran\.com\//g, '"./');
      
      // Fix any remaining broken paths
      content = content.replace(/href="www\.miracles-of-quran\.com\//g, 'href="./');
      content = content.replace(/src="www\.miracles-of-quran\.com\//g, 'src="./');
      
      // Write back only if content changed
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.processedFiles++;
        console.log(`  ✅ Fixed paths in ${path.basename(filePath)}`);
      } else {
        console.log(`  ⏭️  No changes needed for ${path.basename(filePath)}`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }

  // Move files from subdirectory to root and fix paths
  moveAndFixStructure() {
    if (!fs.existsSync(this.miraculesSubDir)) {
      console.log('❌ Subdirectory not found, nothing to move');
      return false;
    }
    
    console.log('🚚 Moving files from subdirectory to root...');
    
    // Handle the index.html conflict specifically
    const outsideIndex = path.join(this.sourceDir, 'index.html');
    const insideIndex = path.join(this.miraculesSubDir, 'index.html');
    
    if (fs.existsSync(outsideIndex) && fs.existsSync(insideIndex)) {
      console.log('🔍 Found two index.html files - handling conflict...');
      
      // Read both files to determine which is which
      const outsideContent = fs.readFileSync(outsideIndex, 'utf8');
      const insideContent = fs.readFileSync(insideIndex, 'utf8');
      
      // HTTrack's index usually contains "HTTrack" or "Mirror" in the title/content
      if (outsideContent.toLowerCase().includes('httrack') || 
          outsideContent.toLowerCase().includes('mirror') ||
          outsideContent.includes('hts-log.txt')) {
        console.log('📄 Outside index.html is HTTrack\'s navigation page');
        console.log('📄 Inside index.html is the actual website homepage');
        
        // Backup HTTrack's index
        fs.renameSync(outsideIndex, path.join(this.sourceDir, 'httrack-index.html'));
        console.log('💾 Renamed HTTrack index to httrack-index.html');
        
        // Move the real website index
        fs.renameSync(insideIndex, outsideIndex);
        console.log('✅ Moved real website index.html to root');
      } else {
        console.log('⚠️  Cannot determine which index.html is which - manual review needed');
        console.log('   - Outside index first 100 chars:', outsideContent.substring(0, 100));
        console.log('   - Inside index first 100 chars:', insideContent.substring(0, 100));
        
        // Keep the inside one as it's more likely to be the real site
        fs.renameSync(outsideIndex, path.join(this.sourceDir, 'original-index.html'));
        fs.renameSync(insideIndex, outsideIndex);
        console.log('✅ Kept inside index.html, backed up outside as original-index.html');
      }
    }
    
    // Move all other files/folders from subdirectory to root
    const items = fs.readdirSync(this.miraculesSubDir);
    
    for (const item of items) {
      if (item === 'index.html') continue; // Already handled above
      
      const srcPath = path.join(this.miraculesSubDir, item);
      const destPath = path.join(this.sourceDir, item);
      
      try {
        if (fs.existsSync(destPath)) {
          console.log(`⚠️  ${item} already exists at root, merging...`);
          if (fs.statSync(srcPath).isDirectory()) {
            this.mergeDirectories(srcPath, destPath);
          } else {
            fs.unlinkSync(destPath);
            fs.renameSync(srcPath, destPath);
          }
        } else {
          fs.renameSync(srcPath, destPath);
          console.log(`✅ Moved ${item} to root`);
        }
      } catch (error) {
        console.error(`❌ Error moving ${item}:`, error.message);
      }
    }
    
    // Remove the empty subdirectory
    try {
      if (fs.readdirSync(this.miraculesSubDir).length === 0) {
        fs.rmdirSync(this.miraculesSubDir);
        console.log('🗑️  Removed empty subdirectory');
      }
    } catch (error) {
      console.log('⚠️  Could not remove subdirectory (may not be empty)');
    }
    
    return true;
  }

  mergeDirectories(src, dest) {
    const items = fs.readdirSync(src);
    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      
      if (fs.existsSync(destPath)) {
        if (fs.statSync(srcPath).isDirectory() && fs.statSync(destPath).isDirectory()) {
          this.mergeDirectories(srcPath, destPath);
        } else {
          fs.unlinkSync(destPath);
          fs.renameSync(srcPath, destPath);
        }
      } else {
        fs.renameSync(srcPath, destPath);
      }
    }
    
    // Remove source directory if empty
    try {
      if (fs.readdirSync(src).length === 0) {
        fs.rmdirSync(src);
      }
    } catch (e) {
      // Directory might not be empty, that's okay
    }
  }

  // Removed backup functionality for speed

  // Main execution
  async execute() {
    console.log('🚀 Starting path fixing process...');
    console.log(`📁 Working directory: ${this.sourceDir}`);
    
    // Analyze current structure
    const hasSubDir = this.analyzeStructure();
    
    if (!hasSubDir) {
      console.log('❌ Expected subdirectory structure not found. Please check your HTTrack download.');
      return;
    }
    
    // Move files and fix structure (no backup)
    const moveSuccess = this.moveAndFixStructure();
    
    if (!moveSuccess) {
      console.log('❌ Failed to move files');
      return;
    }
    
    // Now fix all HTML file paths
    console.log('🔧 Fixing paths in HTML files...');
    const htmlFiles = this.getAllHtmlFiles(this.sourceDir);
    console.log(`📄 Found ${htmlFiles.length} HTML files to process`);
    
    htmlFiles.forEach(filePath => {
      this.fixPathsInHtml(filePath, this.sourceDir);
    });
    
    console.log('✅ Path fixing complete!');
    console.log(`📊 Summary:`);
    console.log(`   - Processed ${this.processedFiles} HTML files`);
    console.log(`   - Ready for deployment!`);
    
    console.log('\n🎯 Next steps:');
    console.log('   1. Test locally: python -m http.server 8000');
    console.log('   2. Check that CSS/JS loads correctly');
    console.log('   3. Deploy to Vercel');
  }
}

// Usage - Update this path to your actual directory
const pathFixer = new PathFixer('./IslamicBlogSite');

// Add some command line argument handling
if (process.argv[2]) {
  const customPath = process.argv[2];
  const customPathFixer = new PathFixer(customPath);
  customPathFixer.execute().catch(console.error);
} else {
  pathFixer.execute().catch(console.error);
}