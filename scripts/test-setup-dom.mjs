/**
 * Shared jsdom setup for component tests (.test.tsx).
 * 
 * Instead of each test file importing "global-jsdom/register" independently
 * (which creates a fresh DOM environment per file), this module initializes
 * jsdom once via the --import flag and shares it across all test files in the
 * batch.
 * 
 * Usage: node --import ./scripts/test-setup-dom.mjs --test ...
 */
import "global-jsdom/register";
