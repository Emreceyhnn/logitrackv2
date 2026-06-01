import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function findTests(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results.push(...findTests(filePath));
    } else if (file.endsWith('.test.tsx')) {
      results.push(filePath);
    }
  }
  return results;
}

const files = findTests('app');
if (fs.existsSync('poc.test.tsx')) files.push('poc.test.tsx');

console.log(`Found ${files.length} .test.tsx files.`);

for (const file of files) {
  console.log(`Testing: ${file}`);
  try {
    execSync(`npx tsx --experimental-test-module-mocks --test-force-exit --test "${file}"`, { stdio: 'ignore' });
    console.log(`✅ Passed: ${file}`);
  } catch (e) {
    console.log(`❌ Failed: ${file}`);
  }
}
console.log("Done checking.");
