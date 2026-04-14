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

function getOpacityKey(val) {
    let num = parseFloat(val.replace(/\s+/g, ''));
    if (isNaN(num)) return null;
    let percent = Math.round(num * 100);
    return percent < 10 ? `0${percent}` : `${percent}`;
}

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let orig = content;

    // Handle multiline alpha calls by joining them temporarily or using s flag in regex if supported
    // For simplicity, we'll use regex that handles optional whitespace and newlines
    const ws = '\\s*';
    const opacityPart = `(${ws}0\\.\\d+|${ws}1|${ws}0)`;

    // 1. Theme Palette Patterns
    content = content.replace(new RegExp(`alpha\\(theme\\.palette\\.divider,${opacityPart}\\)`, 'g'), (match, p1) => {
        const key = getOpacityKey(p1);
        return key ? `(theme.palette as any).divider_alpha.main_${key}` : match;
    });

    const coreColors = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];
    coreColors.forEach(color => {
        const regex = new RegExp(`alpha\\(theme\\.palette\\.${color}\\.main,${opacityPart}\\)`, 'g');
        content = content.replace(regex, (match, p1) => {
            const key = getOpacityKey(p1);
            return key ? `(theme.palette.${color} as any)._alpha.main_${key}` : match;
        });
    });

    content = content.replace(new RegExp(`alpha\\(theme\\.palette\\.background\\.paper,${opacityPart}\\)`, 'g'), (match, p1) => {
        const key = getOpacityKey(p1);
        return key ? `(theme.palette.background as any).paper_alpha.main_${key}` : match;
    });

    content = content.replace(new RegExp(`alpha\\(theme\\.palette\\.background\\.default,${opacityPart}\\)`, 'g'), (match, p1) => {
        const key = getOpacityKey(p1);
        return key ? `(theme.palette.background as any).default_alpha.main_${key}` : match;
    });

    content = content.replace(new RegExp(`alpha\\(theme\\.palette\\.text\\.primary,${opacityPart}\\)`, 'g'), (match, p1) => {
        const key = getOpacityKey(p1);
        return key ? `(theme.palette.text as any).primary_alpha.main_${key}` : match;
    });

    content = content.replace(new RegExp(`alpha\\(theme\\.palette\\.text\\.secondary,${opacityPart}\\)`, 'g'), (match, p1) => {
        const key = getOpacityKey(p1);
        return key ? `(theme.palette.text as any).secondary_alpha.main_${key}` : match;
    });

    content = content.replace(new RegExp(`alpha\\(theme\\.palette\\.common\\.black,${opacityPart}\\)`, 'g'), (match, p1) => {
        const key = getOpacityKey(p1);
        return key ? `(theme.palette.common as any).black_alpha.main_${key}` : match;
    });

    content = content.replace(new RegExp(`alpha\\(theme\\.palette\\.common\\.white,${opacityPart}\\)`, 'g'), (match, p1) => {
        const key = p1.trim() === '0.015' ? '015' : getOpacityKey(p1);
        return key ? `(theme.palette.common as any).white_alpha.main_${key}` : match;
    });

    // 2. Hardcoded Hex Patterns
    const hexMappings = {
        '#38bdf8': '(theme.palette.kpi as any).cyan_alpha.main_',
        '#cbd5f5': '(theme.palette.kpi as any).slateLight_alpha.main_',
        '#0f172a': '(theme.palette.kpi as any).slateDeep_alpha.main_',
        '#1e293b': '(theme.palette.kpi as any).slateDark_alpha.main_',
        '#94a3b8': '(theme.palette.kpi as any).slateGray_alpha.main_',
        '#0b1120': '(theme.palette.kpi as any).slateDeepest_alpha.main_',
        '#0B1019': '(theme.palette.background as any).midnight._alpha.main_',
        '#1A202C': '(theme.palette.text as any).darkBlue._alpha.main_',
        '#ffffff': '(theme.palette.common as any).white_alpha.main_',
        '#fff': '(theme.palette.common as any).white_alpha.main_',
        '#000000': '(theme.palette.common as any).black_alpha.main_',
        '#000': '(theme.palette.common as any).black_alpha.main_',
        '#e2e8f0': '(theme.palette.kpi as any).lavender_alpha.main_',
    };

    for (const [hex, replacement] of Object.entries(hexMappings)) {
        const regex = new RegExp(`alpha\\((['"])${hex}\\1,${opacityPart}\\)`, 'gi');
        content = content.replace(regex, (match, q, p1) => {
            const key = getOpacityKey(p1);
            return key ? `${replacement}${key}` : match;
        });
    }

    if (orig !== content) {
        fs.writeFileSync(f, content, 'utf8');
        count++;
    }
});

console.log(`Updated migration script processed. Migrated files.`);
