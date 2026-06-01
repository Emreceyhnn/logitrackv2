import { execSync } from 'child_process';
import path from 'path';

try {
  const testPath = path.resolve('app/[lang]/(pages)/(dashboard)/analytics/page.test.tsx');
  console.log("Running test at:", testPath);
  execSync(`npx tsx --experimental-test-module-mocks --test-force-exit --test "${testPath}"`, { stdio: 'inherit' });
} catch (e) {
  console.error("Test failed");
}
