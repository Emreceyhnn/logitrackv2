#!/usr/bin/env node
/**
 * run-tests.mjs
 * Tüm test dosyalarını küçük gruplar halinde sırayla çalıştırır.
 * Windows'ta 260 dosyayı aynı anda spawn etmek sistemi donduruyor;
 * bu script BATCH_SIZE kadar dosyayı her seferinde işler.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const BATCH_SIZE = 8; // Her seferinde kaç test dosyası çalıştırılacak
const CONCURRENCY = 4; // Her batch içindeki eşzamanlı test sayısı
const ROOT = process.cwd();
const ENV_FILE = path.join(ROOT, '.env');
const TSCONFIG_TEST = path.join(ROOT, 'tsconfig.test.json');

// TSX_TSCONFIG_PATH removed since tsconfig.json handles it correctly now

// Tüm test dosyalarını bul
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

// Diziyi N'lik gruplara böl
function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// Alias resolver hook path (absolute, forward-slash for cross-platform)
const ALIAS_RESOLVER = path.join(ROOT, 'scripts', 'alias-resolver.mjs').replace(/\\/g, '/');

// Tek bir batch'i çalıştır
function runBatch(files, batchIndex, total) {
  const quoted = files.map((f) => `"${f}"`).join(' ');
  const cmd = [
    'npx dotenv-cli',
    `-e "${ENV_FILE}"`,
    '--',
    'node',
    '--import tsx',
    '--experimental-test-module-mocks',
    '--test-force-exit',
    `--test-concurrency=${CONCURRENCY}`,
    '--test',
    quoted,
  ].join(' ');

  console.log(
    `\n${'═'.repeat(60)}\n📦 Batch ${batchIndex} / ${total}  (${files.length} dosya)\n${'═'.repeat(60)}`
  );
  files.forEach((f) => console.log(`  • ${path.relative(ROOT, f)}`));
  console.log('');

  try {
    execSync(cmd, { stdio: 'inherit', cwd: ROOT });
    return true;
  } catch {
    return false;
  }
}

// ── Ana akış ────────────────────────────────────────────────────────────────
const appDir = path.join(ROOT, 'app');
const files = findTests(appDir);

console.log(`\n🔍 ${files.length} test dosyası bulundu.`);
console.log(`⚙️  Batch boyutu: ${BATCH_SIZE} | Concurrency: ${CONCURRENCY}\n`);

const batches = chunk(files, BATCH_SIZE);
let failedBatches = 0;

for (let i = 0; i < batches.length; i++) {
  const ok = runBatch(batches[i], i + 1, batches.length);
  if (!ok) failedBatches++;
}

console.log(`\n${'═'.repeat(60)}`);
if (failedBatches === 0) {
  console.log(`✅ Tüm ${batches.length} batch başarıyla tamamlandı.`);
} else {
  console.log(`❌ ${failedBatches} / ${batches.length} batch hata ile bitti.`);
  process.exit(1);
}
