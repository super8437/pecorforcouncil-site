# pecorforcouncil-site

Council Campaign Website

## Development

Inline the shared header and footer into the HTML files and serve them locally:

```bash
node scripts/inline-partials.js dist
npx serve dist
```

The script copies the site into a `dist/` directory and replaces the `<!--#include -->` directives with the content of the partials so the header and footer appear during development.
