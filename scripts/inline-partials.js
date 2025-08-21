const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const partialsDir = path.join(root, 'partials');

const header = fs.readFileSync(path.join(partialsDir, 'header.html'), 'utf8');
const footer = fs.readFileSync(path.join(partialsDir, 'footer.html'), 'utf8');

const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith('.html'));

htmlFiles.forEach((file) => {
  const filePath = path.join(root, file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/<!--#include virtual="\/partials\/header\.html"\s*-->/g, header);
  content = content.replace(/<!--#include virtual="\/partials\/footer\.html"\s*-->/g, footer);
  fs.writeFileSync(filePath, content);
});

console.log(`Inlined partials into ${htmlFiles.length} HTML files`);
