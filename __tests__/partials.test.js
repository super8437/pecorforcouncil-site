const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const htmlFiles = fs
  .readdirSync(root)
  .filter((f) => f.endsWith('.html') && !f.startsWith('partial'));

const headerPartial = fs.readFileSync(path.join(root, 'partials', 'header.html'), 'utf8');
const footerPartial = fs.readFileSync(path.join(root, 'partials', 'footer.html'), 'utf8');

const headerDOM = new JSDOM(headerPartial);
const expectedHeader = headerDOM.window.document.querySelector('header').outerHTML;
const expectedSkip = headerDOM.window.document.querySelector('.skip-link').outerHTML;
const footerDOM = new JSDOM(footerPartial);
const expectedFooter = footerDOM.window.document.querySelector('footer').outerHTML;

describe('shared partials', () => {
  htmlFiles.forEach((file) => {
    test(`${file} renders shared header and footer`, () => {
      const filePath = path.join(root, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const dom = new JSDOM(raw);
      const header = dom.window.document.querySelector('header').outerHTML;
      const skip = dom.window.document.querySelector('.skip-link').outerHTML;
      const footer = dom.window.document.querySelector('footer').outerHTML;

      expect(header).toBe(expectedHeader);
      expect(skip).toBe(expectedSkip);
      expect(footer).toBe(expectedFooter);
    });
  });
});
