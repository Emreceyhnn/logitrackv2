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

walkDir('./app', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  content = content.replace(/\bunknown\b/g, 'any');
  content = content.replace(/React\.ElementType/g, 'any');
  content = content.replace(/\{\s*children\s*\??\s*:\s*React\.ReactNode\s*\}/g, 'any');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log("Reverted tests to use any.");
