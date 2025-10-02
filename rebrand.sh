#!/bin/bash

# Rebranding script for Islamic Blog Site
# This script replaces all instances of "Miracles of Quran" with "Islamic Miracles"
# and removes Play Store references

echo "========================================="
echo "Starting Rebranding Process"
echo "========================================="

# 1. Replace "Miracles of Quran" with "Islamic Miracles" in all HTML files
echo ""
echo "[1/5] Replacing 'Miracles of Quran' with 'Islamic Miracles'..."
find . -type f -name "*.html" -exec sed -i 's/Miracles of Quran/Islamic Miracles/g' {} +
find . -type f -name "*.html" -exec sed -i 's/Miracles of quran/Islamic Miracles/g' {} +
find . -type f -name "*.html" -exec sed -i 's/miracles of quran/Islamic Miracles/g' {} +
find . -type f -name "*.html" -exec sed -i 's/MIRACLES OF QURAN/ISLAMIC MIRACLES/g' {} +
echo "✓ Completed text replacement in HTML files"

# 2. Replace in JavaScript files
echo ""
echo "[2/5] Replacing branding in JavaScript files..."
find . -type f -name "*.js" -exec sed -i 's/Miracles of Quran/Islamic Miracles/g' {} +
find . -type f -name "*.js" -exec sed -i 's/miracles of quran/Islamic Miracles/g' {} +
echo "✓ Completed text replacement in JS files"

# 3. Remove Play Store links (commented out, not deleted, for safety)
echo ""
echo "[3/5] Commenting out Play Store links..."
find . -type f -name "*.html" -exec sed -i 's|<a href="https://play\.google\.com/store/apps/details[^>]*>|<!-- Play Store link removed: &|g' {} +
find . -type f -name "*.html" -exec sed -i 's|</a><!-- Play Store link removed:|--></a>|g' {} +
echo "✓ Completed Play Store link removal"

# 4. Remove Play Store directory
echo ""
echo "[4/5] Removing Play Store directory..."
if [ -d "play.google.com" ]; then
    rm -rf play.google.com
    echo "✓ Removed play.google.com directory"
else
    echo "⊘ play.google.com directory not found"
fi

# 5. Search for any remaining brand references
echo ""
echo "[5/5] Searching for any remaining 'miracle' references..."
echo "Files still containing 'miracle' (case-insensitive):"
grep -ri "miracle.*quran\|quran.*miracle" --include="*.html" --include="*.js" . | head -20

echo ""
echo "========================================="
echo "Rebranding Process Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Review the changes"
echo "2. Update color scheme/design manually or with additional scripts"
echo "3. Test the site"
echo "4. Commit changes to git"
