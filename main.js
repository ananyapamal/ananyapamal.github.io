// main.js — scroll animations, nav behavior, mobile menu

(function () {
  const header = document.getElementById('site-header');
  const nav = document.getElementById('site-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = nav.querySelectorAll('a');
  const sections = document.querySelectorAll('section[id]');

  // Sticky header background on scroll
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Active nav link highlighting
  const observerOptions = { root: null, rootMargin: '-40% 0px -55% 0px', threshold: 0 };
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // Reveal-on-scroll animations
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Trigger hero reveals immediately on load
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
  });

  // Wake GhostBuster AI on Render so the free-tier service is warm when clicked
  const GHOSTBUSTER_URL = 'https://ghostbuster-ai-js5l.onrender.com/';
  function wakeGhostBuster() {
    fetch(GHOSTBUSTER_URL, { mode: 'no-cors', cache: 'no-store' }).catch(() => {});
  }
  wakeGhostBuster();
  setInterval(wakeGhostBuster, 10 * 60 * 1000);
})();
