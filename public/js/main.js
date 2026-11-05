/**
 * EHS Flux Corporation — main.js
 * Handles: navigation toggle, smooth scroll, active nav link, footer year.
 */
(function () {
  'use strict';

  // ---------- Footer year ----------
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- Mobile nav toggle ----------
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape or outside click
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (navMenu.classList.contains('open') &&
          !navMenu.contains(e.target) &&
          !navToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- Smooth scroll for in-page anchors ----------
  // (Native CSS scroll-behavior: smooth handles most cases; this adds navbar offset)
  var navHeight = 76;
  function getNavHeight() {
    var navbar = document.getElementById('navbar');
    return navbar ? navbar.offsetHeight : 76;
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - getNavHeight() - 12;
      window.scrollTo({ top: top, behavior: 'smooth' });
      // Update focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      // Update URL without jump
      if (history.pushState) history.pushState(null, '', href);
    });
  });

  // ---------- Active nav link on scroll ----------
  var navLinks = Array.from(document.querySelectorAll('.nav-link'));
  var sections = ['main', 'services', 'water-treatment', 'zld', 'industries', 'about', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            var href = link.getAttribute('href') || '';
            var isActive = href === '#' + id || (id === 'main' && href === '#main');
            link.classList.toggle('active', isActive);
            if (isActive) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(function (s) { observer.observe(s); });
  }

  // ---------- Navbar shadow on scroll ----------
  var navbar = document.getElementById('navbar');
  if (navbar) {
    var onScroll = function () {
      if (window.pageYOffset > 20) navbar.style.boxShadow = 'var(--shadow-md)';
      else navbar.style.boxShadow = 'var(--shadow-sm)';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
