(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  const header = document.querySelector('.header');
  if (!toggle || !nav || !header) return;

  /* ---------- Mobile nav open/close ---------- */
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

  /* ---------- Mark active link ---------- */
  const path = location.pathname.replace(/index\.html$/, '/');
  document.querySelectorAll('.nav__list a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (href === path || (href !== '/' && path.startsWith(href))) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Header translucency on scroll (video-safe) ---------- */
  // Keep CSS var in sync with actual header height (for the fixed backplate)
  const setHeaderHeight = () => {
    header.style.setProperty('--header-h', header.offsetHeight + 'px');
  };

  // Hysteresis so we don't flicker right at the top
  const THRESH_ON = 12;  // add .is-scrolled above this
  const THRESH_OFF = 6;  // remove it when back below this
  let scrolled = false;
  let ticking = false;

  const applyScrollState = (y) => {
    if (!scrolled && y > THRESH_ON) {
      scrolled = true;
      header.classList.add('is-scrolled');
    } else if (scrolled && y < THRESH_OFF) {
      scrolled = false;
      header.classList.remove('is-scrolled');
    }
  };

  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset || 0;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        applyScrollState(y);
        ticking = false;
      });
    }
  };

  // Init
  setHeaderHeight();
  applyScrollState(window.scrollY || 0);

  // Listeners
  window.addEventListener('resize', setHeaderHeight, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
})();
