/**
 * alias-resolver.mjs
 *
 * Custom Node.js ESM loader hook that resolves TypeScript `@/` path aliases
 * to the project root. This must be passed via `--import` BEFORE tsx so that
 * `mock.module("@/app/lib/...")` calls are resolved correctly by Node's test runner.
 *
 * Usage: node --import ./scripts/alias-resolver.mjs --loader tsx ...
 */

import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire, register } from 'module';
import path from 'path';
import { isMainThread } from 'worker_threads';

if (isMainThread) {
  // Register this file as an ESM loader hook
  register(import.meta.url);
}

// Resolve the project root (one level up from scripts/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

/**
 * Node.js ESM resolve hook.
 * Called for every `import` / `import()` / `mock.module()` specifier.
 */
export async function resolve(specifier, context, nextResolve) {
  // Map `@/foo/bar` → `<PROJECT_ROOT>/foo/bar`
  if (specifier.startsWith('@/')) {
    const relativePath = specifier.slice(2); // strip the '@/'
    const absolutePath = path.join(PROJECT_ROOT, relativePath);
    const resolved = pathToFileURL(absolutePath).href;
    return nextResolve(resolved, context);
  }

  // For everything else, delegate to the next resolver (tsx, Node built-in)
  return nextResolve(specifier, context);
}
