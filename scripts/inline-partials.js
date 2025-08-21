const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const distArg = process.argv[2];
const outDir = distArg ? path.resolve(root, distArg) : root;

// Clean and copy files if writing to a different directory
if (outDir !== root) {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const skip = new Set(['node_modules', 'partials', 'scripts', 'dist', '__tests__']);
  fs.readdirSync(root).forEach((entry) => {
    if (skip.has(entry)) return;
    fs.cpSync(path.join(root, entry), path.join(outDir, entry), { recursive: true });
  });
}

const header = fs.readFileSync(path.join(root, 'partials', 'header.html'), 'utf8');
const footer = fs.readFileSync(path.join(root, 'partials', 'footer.html'), 'utf8');

const htmlFiles = fs
  .readdirSync(outDir)
  .filter((file) => file.endsWith('.html') && !file.startsWith('partial'));

htmlFiles.forEach((file) => {
  const filePath = path.join(outDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content
    .replace(/<!--#include virtual="\/partials\/header\.html"\s*-->/g, header)
    .replace(/<!--#include virtual="\/partials\/footer\.html"\s*-->/g, footer);
  fs.writeFileSync(filePath, content);
});

console.log(
  `Inlined partials into ${htmlFiles.length} HTML files${outDir !== root ? ` in ${path.relative(
    root,
    outDir
  )}` : ''}`
);
