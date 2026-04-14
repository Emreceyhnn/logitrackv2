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
let count = 0;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let orig = content;

    // 1. Core Property Strings (remove .main)
    content = content.replace(/\(theme\.palette\.text\.primary as any\)\.main(?!\w)/g, 'theme.palette.text.primary');
    content = content.replace(/\(theme\.palette\.text\.secondary as any\)\.main(?!\w)/g, 'theme.palette.text.secondary');
    content = content.replace(/\(theme\.palette\.common\.black as any\)\.main(?!\w)/g, 'theme.palette.common.black');
    content = content.replace(/\(theme\.palette\.common\.white as any\)\.main(?!\w)/g, 'theme.palette.common.white');
    content = content.replace(/\(theme\.palette\.divider as any\)\.main(?!\w)/g, 'theme.palette.divider');
    content = content.replace(/\(theme\.palette\.background\.default as any\)\.main(?!\w)/g, 'theme.palette.background.default');
    content = content.replace(/\(theme\.palette\.background\.paper as any\)\.main(?!\w)/g, 'theme.palette.background.paper');

    // 2. Alpha Variants (_alpha objects)
    content = content.replace(/\(theme\.palette\.text\.primary as any\)\.main_(\w+)/g, '(theme.palette.text as any).primary_alpha.main_$1');
    content = content.replace(/\(theme\.palette\.text\.secondary as any\)\.main_(\w+)/g, '(theme.palette.text as any).secondary_alpha.main_$1');
    content = content.replace(/\(theme\.palette\.common\.black as any\)\.main_(\w+)/g, '(theme.palette.common as any).black_alpha.main_$1');
    content = content.replace(/\(theme\.palette\.common\.white as any\)\.main_(\w+)/g, '(theme.palette.common as any).white_alpha.main_$1');
    content = content.replace(/\(theme\.palette\.divider as any\)\.main_(\w+)/g, '(theme.palette as any).divider_alpha.main_$1');
    content = content.replace(/\(theme\.palette\.background\.default as any\)\.main_(\w+)/g, '(theme.palette.background as any).default_alpha.main_$1');
    content = content.replace(/\(theme\.palette\.background\.paper as any\)\.main_(\w+)/g, '(theme.palette.background as any).paper_alpha.main_$1');

    // 3. SX Prop Strings (Clean up .main)
    content = content.replace(/\"background\.paper\.main\"/g, '\"background.paper\"');
    content = content.replace(/\"background\.default\.main\"/g, '\"background.default\"');
    content = content.replace(/\"text\.primary\.main\"/g, '\"text.primary\"');
    content = content.replace(/\"text\.secondary\.main\"/g, '\"text.secondary\"');

    if (orig !== content) {
        fs.writeFileSync(f, content, 'utf8');
        count++;
    }
});

console.log('Successfully updated ' + count + ' files with standardized palette accessors.');
