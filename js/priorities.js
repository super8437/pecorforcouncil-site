(() => {
  // When navigating via hash links, open the corresponding <details>
  const hashOpen = () => {
    if (!location.hash) return;

    const hash = location.hash.slice(1);
    const allowed = /^[a-z0-9\-_]+$/i;
    if (!allowed.test(hash)) return;

    const el = document.querySelector(`#${hash}`);
    if (el && el.nodeName.toLowerCase() === 'details') {
      el.open = true;
      if (typeof el.scrollIntoView === 'function') {
        el.scrollIntoView();
      }
      // Adjust scroll to account for sticky header using computed height
      const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
      requestAnimationFrame(() => window.scrollBy(0, -headerH));
    }
  };

  window.addEventListener('hashchange', hashOpen);
  // Run on initial page load in case a hash is present
  hashOpen();

  // Allow table of contents links to open and scroll without jumping to top
  document
    .querySelectorAll('nav[aria-label="Priorities overview"] a[href^="#"]')
    .forEach((a) => {
      a.addEventListener('click', (e) => {
        const hash = a.getAttribute('href').slice(1);
        const allowed = /^[a-z0-9\-_]+$/i;
        if (!allowed.test(hash)) return;
        e.preventDefault();
        history.pushState(null, '', `#${hash}`);
        hashOpen();
      });
    });
})();
