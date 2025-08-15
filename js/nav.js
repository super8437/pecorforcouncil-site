(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  const header = document.querySelector('.header');
  if (!toggle || !nav || !header) return;

  const close = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
  };
  const open = () => {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    nav.removeAttribute('aria-hidden');
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    expanded ? close() : open();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // Mark active link automatically (fallback to manual aria-current in each page if preferred)
  const path = location.pathname.replace(/index\.html$/, '/');
  document.querySelectorAll('.nav__list a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    // Exact match or prefix match for subpages
    if (href === path || (href !== '/' && path.startsWith(href))) {
      a.setAttribute('aria-current', 'page');
    }
  });

  // Add subtle shadow on scroll
  const onScroll = () => {
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll);
})();