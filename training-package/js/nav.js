(function () {
  function normalizePathname(pathname) {
    try {
      const clean = (pathname || '').split('?')[0].split('#')[0];
      const parts = clean.split('/').filter(Boolean);
      return parts.length ? parts[parts.length - 1] : '';
    } catch {
      return '';
    }
  }

  function setActiveLink(links, predicate) {
    links.forEach((a) => {
      const isActive = predicate(a);
      if (isActive) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      } else {
        a.classList.remove('is-active');
        a.removeAttribute('aria-current');
      }
    });
  }

  function initNavActiveState() {
    const links = Array.from(document.querySelectorAll('.nav-link'));
    if (!links.length) return;

    const currentFile = normalizePathname(window.location.pathname);
    const currentHash = window.location.hash || '';

    // Prefer exact filename match (e.g. tools.html)
    setActiveLink(links, (a) => {
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('http')) return false;
      if (href.startsWith('#')) return href === currentHash;

      const hrefFile = normalizePathname(href);
      if (!hrefFile) return false;
      return hrefFile === currentFile;
    });

    // If no filename matched (e.g. root path or directory), keep hash highlighting for internal links
    const hasActive = links.some((a) => a.classList.contains('is-active'));
    if (!hasActive && currentHash) {
      setActiveLink(
        links,
        (a) => (a.getAttribute('href') || '') === currentHash
      );
    }
  }

  document.addEventListener('DOMContentLoaded', initNavActiveState);
  window.addEventListener('hashchange', initNavActiveState);

  function createNavToggle(navContainer, navMenu) {
    const btn = document.createElement('button');
    btn.className = 'nav-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'فتح وإغلاق القائمة');
    btn.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
    navContainer.insertBefore(btn, navMenu);
    return btn;
  }

  function initMobileNavToggle() {
    const navContainer = document.querySelector('.navbar .nav-container');
    const navMenu = document.querySelector('.navbar .nav-menu');
    if (!navContainer || !navMenu) return;

    let navToggle = document.querySelector('.navbar .nav-toggle');
    if (!navToggle) {
      navToggle = createNavToggle(navContainer, navMenu);
    }

    const closeMenu = () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('nav-open', isOpen);
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeMenu());
    });
  }

  function injectContactPanel() {
    if (document.querySelector('.contact-panel')) return;
    const panel = document.createElement('div');
    panel.className = 'contact-panel';
    panel.innerHTML = `
      <div class="contact-title">تواصل معنا</div>
      <a href="tel:01121891913" class="contact-item">📞 01121891913</a>
      <a href="mailto:eng.mohamed0shaban@gmail.com" class="contact-item">✉️ eng.mohamed0shaban@gmail.com</a>
      <a href="https://www.linkedin.com/in/mohamedshabanai" target="_blank" rel="noopener" class="contact-item">🔗 linkedin.com/in/mohamedshabanai</a>
      <a href="https://robovai.blogspot.com" target="_blank" rel="noopener" class="contact-item">🌐 robovai.blogspot.com</a>
    `;
    document.body.appendChild(panel);
  }

  function injectFloatingCTA() {
    if (document.querySelector('.floating-cta-container')) return;
    const cta = document.createElement('div');
    cta.className = 'floating-cta-container';
    cta.innerHTML = `
      <a href="https://wa.me/201121891913" target="_blank" rel="noopener" class="floating-btn whatsapp-btn" aria-label="تواصل واتساب">
        <span class="tooltip">واتساب</span>
        📱
      </a>
      <a href="tel:01121891913" class="floating-btn call-btn" aria-label="اتصال مباشر">
        <span class="tooltip">اتصال</span>
        📞
      </a>
      <a href="mailto:eng.mohamed0shaban@gmail.com" class="floating-btn email-btn" aria-label="إرسال إيميل">
        <span class="tooltip">إيميل</span>
        ✉️
      </a>
    `;
    document.body.appendChild(cta);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMobileNavToggle();
    injectContactPanel();
    injectFloatingCTA();
  });
})();
