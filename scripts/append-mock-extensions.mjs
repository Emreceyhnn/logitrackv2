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

  // Match relative mock modules: mock.module("../something" or "./something"
  const regex = /mock\.module\(['"](\.[^'"]+)['"]/g;
  
  content = content.replace(regex, (match, capture) => {
    // skip if it already has an extension
    if (capture.endsWith('.ts') || capture.endsWith('.tsx') || capture.endsWith('.json')) {
      return match;
    }

    const fileDir = path.dirname(file);
    const targetPathBase = path.resolve(fileDir, capture);
    
    let newCapture = capture;
    
    // Check which extension it has
    if (fs.existsSync(targetPathBase + '.ts')) {
      newCapture += '.ts';
      hasChanges = true;
    } else if (fs.existsSync(targetPathBase + '.tsx')) {
      newCapture += '.tsx';
      hasChanges = true;
    } else if (fs.existsSync(path.join(targetPathBase, 'index.ts'))) {
      newCapture += '/index.ts';
      hasChanges = true;
    } else if (fs.existsSync(path.join(targetPathBase, 'index.tsx'))) {
      newCapture += '/index.tsx';
      hasChanges = true;
    } else if (fs.existsSync(targetPathBase + '.json')) {
      newCapture += '.json';
      hasChanges = true;
    }
    
    return `mock.module("${newCapture}"`;
  });

  if (hasChanges) {
    fs.writeFileSync(file, content, 'utf-8');
    modifiedCount++;
  }
});

console.log(`\n✅ ${modifiedCount} dosyadaki relative mock.module() yollarına dosya uzantıları (.ts, .tsx) eklendi.\n`);
