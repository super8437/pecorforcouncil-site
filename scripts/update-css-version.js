const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cssPath = path.join(root, 'css', 'styles.css');

const version = Math.floor(fs.statSync(cssPath).mtimeMs).toString();

const htmlFiles = fs
  .readdirSync(root)
  .filter((file) => file.endsWith('.html'));

htmlFiles.forEach((file) => {
  const filePath = path.join(root, file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\/css\/styles\.css(?:\?v=[^"']*)?/g, `/css/styles.css?v=${version}`);
  fs.writeFileSync(filePath, content);
});

console.log(`Updated ${htmlFiles.length} HTML files with version ${version}`);
