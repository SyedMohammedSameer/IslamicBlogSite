const fs = require('fs');
const path = require('path');

class RemoveFooterSection {
  constructor(sourceDir) {
    this.sourceDir = sourceDir;
    this.processedFiles = 0;
  }

  getAllHtmlFiles(dir, visited = new Set()) {
    const files = [];
    const absDir = path.resolve(dir);
    
    if (visited.has(absDir)) return files;
    visited.add(absDir);
    
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        if (item.name.startsWith('.') || 
            item.name === 'node_modules' || 
            item.name === 'hts-cache' ||
            item.name.includes('backup')) continue;
        
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory()) {
          files.push(...this.getAllHtmlFiles(fullPath, visited));
        } else if (item.name.endsWith('.html')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.log(`⚠️  Could not read directory ${dir}`);
    }
    
    return files;
  }

  processFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      let changesMade = false;
      
      // Remove the entire footer3 section that contains the Simple/Intermediate/Advanced layout
      // but preserve the Google Translate widget
      
      // First extract the Google Translate widget if it exists
      const googleTranslateMatch = content.match(/<div id="google_translate_element"><\/div>[\s\S]*?<script src=".*?translate_a\/element.*?<\/script>/);
      let googleTranslateWidget = '';
      if (googleTranslateMatch) {
        googleTranslateWidget = googleTranslateMatch[0];
      }
      
      // Remove the footer section (cid-tJkSLE66e9)
      if (content.includes('cid-tJkSLE66e9')) {
        const before = content;
        content = content.replace(/<section[^>]*cid-tJkSLE66e9[^>]*>[\s\S]*?<\/section>/g, '');
        if (content !== before) changesMade = true;
      }
      
      // If we had a Google Translate widget and removed the footer, add it back before the closing body tag
      if (googleTranslateWidget && changesMade) {
        content = content.replace('</body>', `
<div style="text-align: center; padding: 8px; background: #f8f9fa; font-size: 0;">
  <div style="display: inline-block; transform: scale(0.75); transform-origin: center;">
    ${googleTranslateWidget}
  </div>
</div>
<style>
  /* Force smaller Google Translate styling */
  #google_translate_element {
    zoom: 0.75 !important;
    -moz-transform: scale(0.75) !important;
    -webkit-transform: scale(0.75) !important;
    transform: scale(0.75) !important;
    font-size: 11px !important;
    line-height: 1.2 !important;
  }
  
  #google_translate_element * {
    font-size: 11px !important;
    max-height: 24px !important;
  }
  
  #google_translate_element .goog-te-combo {
    font-size: 10px !important;
    padding: 1px 3px !important;
    height: 20px !important;
    border: 1px solid #ccc !important;
  }
  
  #google_translate_element .goog-logo-link {
    font-size: 9px !important;
  }
  
  #google_translate_element img {
    max-height: 12px !important;
    max-width: 40px !important;
    vertical-align: middle !important;
  }
  
  /* Hide Google branding if too large */
  .goog-logo-link img {
    display: none !important;
  }
  
  /* Delay styling to override Google's scripts */
  .goog-te-gadget {
    font-size: 0 !important;
  }
  
  .goog-te-gadget > span {
    font-size: 10px !important;
  }
</style>
<script>
  // Apply styling after Google Translate loads
  setTimeout(function() {
    const googleElements = document.querySelectorAll('#google_translate_element, #google_translate_element *');
    googleElements.forEach(el => {
      if (el.tagName === 'SELECT') {
        el.style.fontSize = '10px';
        el.style.height = '20px';
        el.style.padding = '1px 3px';
      }
      if (el.tagName === 'IMG') {
        el.style.maxHeight = '12px';
        el.style.maxWidth = '40px';
      }
    });
  }, 2000);
</script>
</body>`);
      }
      
      if (changesMade) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.processedFiles++;
        return { success: true, changed: true };
      }
      
      return { success: true, changed: false };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async runRemoval() {
    console.log('🗑️  REMOVING FOOTER SECTION');
    console.log('=' .repeat(60));
    
    const htmlFiles = this.getAllHtmlFiles(this.sourceDir);
    console.log(`📄 Processing ${htmlFiles.length} files...\n`);
    
    console.log('🎯 CHANGES:');
    console.log('❌ Removing Simple/Intermediate/Advanced footer section');
    console.log('✅ Keeping Google Translate widget (smaller size)');
    console.log('✅ Moving Google Translate to a clean, compact location\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    htmlFiles.forEach((file, index) => {
      if (index % 100 === 0) {
        console.log(`⏳ Processing ${index}/${htmlFiles.length} files...`);
      }
      
      const result = this.processFile(file);
      if (result.success) {
        successCount++;
      } else {
        errorCount++;
        console.log(`❌ Error processing ${path.basename(file)}: ${result.error}`);
      }
    });
    
    console.log('\n✅ FOOTER REMOVAL COMPLETE!');
    console.log('=' .repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   ✅ Successfully processed: ${successCount} files`);
    console.log(`   🗑️  Files cleaned: ${this.processedFiles} files`);
    console.log(`   ❌ Errors: ${errorCount} files`);
    
    console.log('\n🎉 IMPROVEMENTS:');
    console.log('   ✅ Removed cluttered footer section');
    console.log('   ✅ Google Translate preserved and repositioned (compact size)');
    console.log('   ✅ Much cleaner page layout');
    
    console.log('\n🧪 Refresh your browser to see the clean, compact layout!');
  }
}

// Execute immediately
const remover = new RemoveFooterSection('./');
remover.runRemoval().catch(console.error);