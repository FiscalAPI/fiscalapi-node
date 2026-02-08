/**
 * Post-build script to add .js extensions to ESM imports/exports
 * Required for Node.js native ESM support
 */
const fs = require('fs');
const path = require('path');

const esmDir = path.join(__dirname, '..', 'dist', 'esm');

// Extensions that should NOT have .js added
const SKIP_EXTENSIONS = ['.js', '.mjs', '.cjs', '.json', '.node'];

// Stats for logging
let stats = {
  filesProcessed: 0,
  importsFixed: 0
};


function hasSkipExtension(importPath) {
  return SKIP_EXTENSIONS.some(ext => importPath.endsWith(ext));
}


function processFile(filePath) {
  if (!filePath.endsWith('.js')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;


  const staticImportRegex = /(from\s+['"])(\.\.?\/[^'"]+)(['"])/g;

  content = content.replace(staticImportRegex, (match, prefix, importPath, suffix) => {
    if (hasSkipExtension(importPath)) {
      return match; // Already has extension, skip
    }
    modified = true;
    stats.importsFixed++;
    return `${prefix}${importPath}.js${suffix}`;
  });


  const dynamicImportRegex = /(import\s*\(\s*['"])(\.\.?\/[^'"]+)(['"]\s*\))/g;

  content = content.replace(dynamicImportRegex, (match, prefix, importPath, suffix) => {
    if (hasSkipExtension(importPath)) {
      return match; // Already has extension, skip
    }
    modified = true;
    stats.importsFixed++;
    return `${prefix}${importPath}.js${suffix}`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    stats.filesProcessed++;
  }
}

/**
 * Recursively process all files in a directory
 */
function processDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`Error: Directory not found: ${dir}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}

// Main execution
console.log('Fixing ESM imports...');
console.log(`Directory: ${esmDir}`);

try {
  processDirectory(esmDir);
  console.log(`Done! Fixed ${stats.importsFixed} imports in ${stats.filesProcessed} files.`);
} catch (error) {
  console.error('Error fixing ESM imports:', error.message);
  process.exit(1);
}
