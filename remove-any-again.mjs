import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory && !['node_modules', '.next', '.git'].includes(f)) {
      walkDir(dirPath, callback);
    } else if (!isDirectory && (dirPath.endsWith('.test.ts') || dirPath.endsWith('.test.tsx'))) {
      callback(dirPath);
    }
  }
}

let modifiedCount = 0;
walkDir('./app', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // React Component Typing
  content = content.replace(/([A-Z][a-zA-Z0-9_]*)\s*:\s*any(\s*[=;])/g, '$1: React.ElementType$2');
  content = content.replace(/\{\s*children\s*\}\s*:\s*any/g, '{ children }: { children?: React.ReactNode }');

  // Generic <any> replacement
  content = content.replace(/<([^>]*)\bany\b([^>]*)>/g, '<$1unknown$2>');
  content = content.replace(/<([^>]*)\bany\b([^>]*)>/g, '<$1unknown$2>');
  
  // Specific patterns
  content = content.replace(/=>\s*any\b/g, '=> unknown');
  content = content.replace(/\bany\[\]/g, 'unknown[]');
  content = content.replace(/\bas\s+any\b/g, 'as unknown');
  content = content.replace(/:\s*any\b/g, ': unknown');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
  }
});

// poc.test.tsx is in root
if (fs.existsSync('./poc.test.tsx')) {
  let pocContent = fs.readFileSync('./poc.test.tsx', 'utf8');
  let origPoc = pocContent;
  pocContent = pocContent.replace(/([A-Z][a-zA-Z0-9_]*)\s*:\s*any(\s*[=;])/g, '$1: React.ElementType$2');
  pocContent = pocContent.replace(/:\s*any\b/g, ': unknown');
  if (pocContent !== origPoc) {
    fs.writeFileSync('./poc.test.tsx', pocContent, 'utf8');
  }
}

console.log(`Successfully modified ${modifiedCount} test files.`);
