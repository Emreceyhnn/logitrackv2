const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./app');
const alphaPatterns = new Map(); // pattern -> Set(files)

files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    // Multiline-aware match
    const matches = content.match(/alpha\([\s\S]+?\)/g);
    if (matches) {
        matches.forEach(m => {
            const cleanM = m.replace(/\s+/g, ' ');
            if (!alphaPatterns.has(cleanM)) alphaPatterns.set(cleanM, new Set());
            alphaPatterns.get(cleanM).add(f);
        });
    }
});

const sorted = [...alphaPatterns.entries()].sort((a, b) => b[1].size - a[1].size);
sorted.forEach(([pattern, filesSet]) => {
    console.log(`${filesSet.size}: ${pattern}`);
    filesSet.forEach(f => console.log(`  - ${f}`));
});
