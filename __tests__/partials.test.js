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
const footerDisclaimer = footerDOM.window.document
  .querySelector('.footer-disclaimer')
  .textContent.trim();

const headerIncludeRE = /<!--#\s*include\s+virtual=['"]\/partials\/header\.html['"]\s*-->/i;
const footerIncludeRE = /<!--#\s*include\s+virtual=['"]\/partials\/footer[^'"]*\.html['"]\s*-->/i;

describe('shared partials', () => {
  htmlFiles.forEach((file) => {
    test(`${file} renders shared header and footer`, () => {
      const filePath = path.join(root, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      expect(raw).toMatch(headerIncludeRE);
      expect(raw).toMatch(footerIncludeRE);

      const rendered = raw
        .replace(headerIncludeRE, headerPartial)
        .replace(footerIncludeRE, footerPartial);

      const dom = new JSDOM(rendered);
      const header = dom.window.document.querySelector('header').outerHTML;
      const skip = dom.window.document.querySelector('.skip-link').outerHTML;
      const footer = dom.window.document.querySelector('footer').outerHTML;
      const disclaimer = dom.window.document
        .querySelector('.footer-disclaimer')
        .textContent.trim();
      const navScript = dom.window.document.querySelector('script[src="/js/nav.js"]');

      expect(header).toBe(expectedHeader);
      expect(skip).toBe(expectedSkip);
      expect(footer).toBe(expectedFooter);
      expect(disclaimer).toBe(footerDisclaimer);
      expect(navScript).not.toBeNull();
    });
  });
});
