import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory && !['node_modules', '.next', '.git'].includes(f)) {
      walkDir(dirPath, callback);
    } else if (!isDirectory && (dirPath.endsWith('.test.ts') || dirPath.endsWith('.test.tsx'))) {
      callback(dirPath);
    }
  }
}

let modifiedCount = 0;

walkDir('./app', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. { children }: any -> { children }: { children?: React.ReactNode } or { children }: Record<string, unknown>
  content = content.replace(/\{(\s*children\s*)\}\s*:\s*any/g, '{$1}: { children?: React.ReactNode }');

  // 2. Component: any; -> Component: React.ElementType;
  content = content.replace(/(let\s+[A-Z][a-zA-Z0-9]*\s*):\s*any\s*;/g, '$1: React.ElementType;');
  
  // 3. something: any -> something: unknown
  content = content.replace(/(let\s+[a-zA-Z0-9_]*\s*):\s*any\s*;/g, '$1: unknown;');
  content = content.replace(/(const\s+[a-zA-Z0-9_]*\s*):\s*any\s*=/g, '$1: unknown =');
  content = content.replace(/(let\s+[a-zA-Z0-9_]*\s*):\s*any\s*=/g, '$1: unknown =');

  // 4. as any -> as unknown
  content = content.replace(/\bas\s+any\b/g, 'as unknown');

  // 5. Array<any> or any[] -> unknown[]
  content = content.replace(/\bany\[\]/g, 'unknown[]');
  content = content.replace(/\bArray<any>/g, 'Array<unknown>');

  // 6. Generic Function params like (param: any)
  content = content.replace(/\(\s*([a-zA-Z0-9_]+)\s*:\s*any\s*\)/g, '($1: unknown)');

  // 7. function(a: any, b: any) -> function(a: unknown, b: unknown)
  content = content.replace(/:\s*any(\s*[,)])/g, ': unknown$1');

  // 8. => any
  content = content.replace(/=>\s*any\b/g, '=> unknown');

  // 9. Promise<any>
  content = content.replace(/Promise<any>/g, 'Promise<unknown>');

  // 10. Object properties: `body: any`
  content = content.replace(/(\b[a-zA-Z0-9_]+\s*):\s*any\b/g, '$1: unknown');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
  }
});

walkDir('./app', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  // fallback for any remaining 'any'
  // Note: we might need to add React imports if we used React.ReactNode
  if (content.includes('React.ReactNode') && !content.includes('import React') && !content.includes('import * as React')) {
    content = 'import React from "react";\n' + content;
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

console.log(`Successfully modified ${modifiedCount} test files to remove 'any'.`);
