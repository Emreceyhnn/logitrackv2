const { execSync } = require('child_process');
try {
  console.log("Running test...");
  execSync('npx tsx --experimental-test-module-mocks --test-force-exit --test "app/[lang]/(pages)/(dashboard)/analytics/page.test.tsx"', { stdio: 'inherit' });
} catch (e) {
  console.error("Test failed");
}
