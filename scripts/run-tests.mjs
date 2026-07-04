/**
 * Collects every *.test.ts / *.test.tsx under app/ and runs them with the
 * same tsx invocation `npm run test:single` uses. Referenced by `npm test`.
 */
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

function collectTests(dir, out = []) {
  for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) collectTests(rel, out);
    else if (/\.test\.tsx?$/.test(entry.name)) out.push(rel);
  }
  return out;
}

const files = collectTests("app");

if (files.length === 0) {
  console.error("No test files found under app/");
  process.exit(1);
}

console.log(`Running ${files.length} test file(s)...`);

// Windows'ta komut satırı uzunluk limiti (~8k) nedeniyle partiler halinde koş.
const BATCH_SIZE = 40;
let failed = false;

// node --test treats its arguments as glob patterns: an unescaped path like
// app/[lang]/page.test.tsx is a character class ([l,a,n,g]) that matches
// nothing, so every test under app/[lang]/ was silently skipped. Backslash
// escapes don't survive Windows path handling, so substitute each bracket
// with the single-character wildcard `?`, which matches the literal bracket.
const escapeGlob = (p) => p.replace(/[[\]]/g, "?");

for (let i = 0; i < files.length; i += BATCH_SIZE) {
  const batch = files.slice(i, i + BATCH_SIZE).map(escapeGlob);
  const result = spawnSync(
    "npx",
    [
      "dotenv",
      "-c",
      "--",
      "npx",
      "tsx",
      "--experimental-test-module-mocks",
      "--test-force-exit",
      "--test",
      ...batch,
    ],
    { stdio: "inherit", shell: true }
  );
  if ((result.status ?? 1) !== 0) failed = true;
}

process.exit(failed ? 1 : 0);
