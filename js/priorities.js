 (() => {
  const allowed = /^[a-z0-9\-_]+$/i;
  // Helper to read the sticky header height from the CSS variable
  const headerHeight = () =>
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--header-h')
    ) || 80;

   // When navigating via hash links, open the corresponding <details>
   const hashOpen = () => {
     if (!location.hash) return;
 
     const hash = location.hash.slice(1);
     if (!allowed.test(hash)) return;
 
     const el = document.querySelector(`#${hash}`);
    if (!el) return;

    if (el.nodeName.toLowerCase() === 'details') {
       el.open = true;
     }

    const y = el.getBoundingClientRect().top + window.scrollY - headerHeight();
    window.scrollTo({ top: y, behavior: 'smooth' });
   };

   window.addEventListener('hashchange', hashOpen);
   // Run on initial page load in case a hash is present
   hashOpen();
 })();
