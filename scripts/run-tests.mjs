/**
 * Collects every *.test.ts / *.test.tsx under app/ and runs them with the
 * same tsx invocation `npm run test:single` uses. Referenced by `npm test`.
 *
 * Isolation model (why this matters):
 *   node:test's `mock.module` registrations are PROCESS-scoped and leak between
 *   files that share a process. Component tests (.test.tsx) mock heavily
 *   (contexts, hooks, MUI, controllers); running many per process made results
 *   depend on file order — a test could pass only because a sibling leaked the
 *   mock it needed. That is non-deterministic and unacceptable for CI gating.
 *
 *   Therefore each .test.tsx runs in its OWN process (perfect isolation). To
 *   keep this fast, files run through a bounded concurrency pool rather than
 *   serially. Unit tests (.test.ts) don't render and are stable when batched,
 *   so they keep the fast batched path.
 */
import { spawn, spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { cpus } from "node:os";

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

const unitTests = files.filter((f) => f.endsWith(".test.ts"));
const componentTests = files.filter((f) => f.endsWith(".test.tsx"));

console.log(
  `Found ${files.length} test file(s): ${unitTests.length} unit + ${componentTests.length} component`
);

// node --test treats its arguments as glob patterns: an unescaped path like
// app/[lang]/page.test.tsx is a character class ([l,a,n,g]) that matches
// nothing, so every test under app/[lang]/ was silently skipped. Backslash
// escapes don't survive Windows path handling, so substitute each bracket
// with the single-character wildcard `?`, which matches the literal bracket.
const escapeGlob = (p) => p.replace(/[[\]]/g, "?");

let failed = false;

// ── Unit tests (no jsdom needed) — batched for speed ────────────────────────
// Windows'ta komut satırı uzunluk limiti (~8k) nedeniyle partiler halinde koş.
const BATCH_SIZE = 40;
if (unitTests.length > 0) {
  console.log(`\n── Running ${unitTests.length} unit test(s)...`);
  for (let i = 0; i < unitTests.length; i += BATCH_SIZE) {
    const batch = unitTests.slice(i, i + BATCH_SIZE).map(escapeGlob);
    const result = spawnSync(
      "npx",
      [
        "dotenv",
        "-c",
        "--",
        "npx",
        "tsx",
        "--import",
        "./scripts/test-setup-css.mjs",
        "--experimental-test-module-mocks",
        "--test-force-exit",
        "--test",
        ...batch,
      ],
      { stdio: "inherit", shell: true }
    );
    if ((result.status ?? 1) !== 0) failed = true;
  }
}

// ── Component tests — one process per file (isolation), pooled for speed ─────
function runComponentFile(file) {
  return new Promise((resolve) => {
    const child = spawn(
      "npx",
      [
        "dotenv",
        "-c",
        "--",
        "npx",
        "tsx",
        "--import",
        "./scripts/test-setup-css.mjs",
        "--import",
        "./scripts/test-setup-dom.mjs",
        "--experimental-test-module-mocks",
        "--test-force-exit",
        "--test",
        escapeGlob(file),
      ],
      { shell: true }
    );
    let output = "";
    child.stdout.on("data", (d) => (output += d));
    child.stderr.on("data", (d) => (output += d));
    child.on("close", (code) => resolve({ file, code: code ?? 1, output }));
  });
}

async function runPool(list, concurrency) {
  let cursor = 0;
  let done = 0;
  const failures = [];
  const worker = async () => {
    while (cursor < list.length) {
      const file = list[cursor++];
      const { code, output } = await runComponentFile(file);
      done++;
      if (code !== 0) {
        failures.push({ file, output });
        console.log(`✖ [${done}/${list.length}] ${file}`);
      } else {
        console.log(`✔ [${done}/${list.length}] ${file}`);
      }
    }
  };
  const poolSize = Math.min(concurrency, list.length);
  await Promise.all(Array.from({ length: poolSize }, worker));
  return failures;
}

if (componentTests.length > 0) {
  // Leave headroom for the OS; each worker is a full tsx+jsdom process.
  const concurrency = Math.max(2, Math.min(8, (cpus().length || 4) - 1));
  console.log(
    `\n── Running ${componentTests.length} component test(s), isolated (${concurrency} in parallel)...`
  );
  const failures = await runPool(componentTests, concurrency);
  if (failures.length > 0) {
    failed = true;
    console.log(`\n===== ${failures.length} component file(s) failed =====`);
    for (const { file, output } of failures) {
      console.log(`\n──────── ${file} ────────`);
      console.log(output.trimEnd());
    }
  }
}

process.exit(failed ? 1 : 0);
