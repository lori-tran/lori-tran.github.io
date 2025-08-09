// Navigation active state + mobile toggle
(function () {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const links = Array.from(document.querySelectorAll('.nav-link'));

  // Toggle menu on mobile
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  // Close menu after click (mobile)
  links.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });

  // Scroll spy (simple)
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function onScroll() {
    const y = window.scrollY + 120;
    let active = links[0];
    sections.forEach((sec, i) => {
      if (sec.offsetTop <= y) active = links[i];
    });
    links.forEach((l) => l.classList.remove('active'));
    active && active.classList.add('active');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Contact form removed - using simple contact info instead
})();


