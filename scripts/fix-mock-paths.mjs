import fs from 'fs';
import path from 'path';

function findTests(dir, extensions = ['.test.ts', '.test.tsx']) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results.push(...findTests(filePath, extensions));
    } else if (extensions.some((ext) => file.endsWith(ext))) {
      results.push(filePath);
    }
  }
  return results;
}

const ROOT = process.cwd();
const appDir = path.join(ROOT, 'app');
const testFiles = findTests(appDir);

let modifiedCount = 0;

testFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let hasChanges = false;

  // Replace mock.module("@/app/...") with relative path
  const regex = /mock\.module\(['"]@\/app\/(.*?)['"]/g;
  
  content = content.replace(regex, (match, capture) => {
    hasChanges = true;
    
    // capture is e.g. "lib/language/DictionaryContext"
    // We want to point to ROOT/app/capture
    const targetPath = path.join(appDir, capture);
    const fileDir = path.dirname(file);
    
    let relativePath = path.relative(fileDir, targetPath).replace(/\\/g, '/');
    
    // Node requires relative paths to start with ./ or ../
    if (!relativePath.startsWith('.')) {
      relativePath = './' + relativePath;
    }
    
    return `mock.module("${relativePath}"`;
  });

  if (hasChanges) {
    fs.writeFileSync(file, content, 'utf-8');
    modifiedCount++;
  }
});

console.log(`\n✅ ${modifiedCount} dosyadaki mock.module("@/app/...") yolları düzeltildi.\n`);
