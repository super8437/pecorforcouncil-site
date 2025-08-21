(() => {
  // When navigating via hash links, open the corresponding <details>
  const hashOpen = () => {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    if (el && el.nodeName.toLowerCase() === 'details') {
      el.open = true;
    }
    // Adjust scroll to account for sticky header using computed height
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
    requestAnimationFrame(() => window.scrollBy(0, -headerH));
  };
  window.addEventListener('hashchange', hashOpen);
  // Run on initial page load in case a hash is present
  hashOpen();
})();