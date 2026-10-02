const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const layout = fs.readFileSync(path.join(root, 'app/layout.tsx'), 'utf8');
const bundled = fs.readFileSync(path.join(root, 'app/market.css'), 'utf8');
const staticCSS = fs.readFileSync(path.join(root, 'public/market/style.css'), 'utf8');
const guideCSS = fs.readFileSync(path.join(root, 'app/guide.css'), 'utf8');
assert.match(layout, /import "\.\/market\.css";/, 'Global market styles must be bundled by Next.js');
assert(layout.indexOf('import "./market.css"') < layout.indexOf('import "./guide.css"'), 'Guide styles must layer after marketplace');
assert(!layout.includes('<link rel="stylesheet" href="/market/style.css"'), 'Page must not depend solely on public stylesheet link');
assert(bundled.length > 30000 && staticCSS.length > 30000, 'Full marketplace stylesheet must be available');
assert.match(bundled, /\.site-header\{/);
assert.match(bundled, /\.hero\{/);
assert.match(bundled, /\.cards\{/);
assert.match(guideCSS, /\.guide-wrap\{/);
assert(!bundled.includes("url('./images/"), 'Bundled CSS must use absolute public image paths');
const matches = [...bundled.matchAll(/url\(['"]?(\/market\/images\/[^)'" ]+)/g)];
assert(matches.length >= 6, 'Expected marble image assets in bundled CSS');
for (const match of matches) {
  const local = path.join(root, 'public', match[1].slice(1));
  assert(fs.existsSync(local), `Missing asset: ${match[1]}`);
}
console.log(`CSS package OK: layout imports market.css, ${matches.length} image URLs resolved, original CSS preserved`);
