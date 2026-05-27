/*=============================================
   CONSCIOUS FAMILY CENTRE (CFC)
   PREMIUM SCRIPT.JS – Interactions & Animations
===============================================*/

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 600);
    });
  }

  /* ---------- NAVBAR SCROLL ---------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const hero = document.querySelector('.hero');
    if (hero) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          navbar.classList.toggle('scrolled', !entry.isIntersecting);
        });
      }, { threshold: 0 });
      observer.observe(hero);
    } else {
      navbar.classList.add('scrolled');
    }
  }

  /* ---------- MOBILE MENU ---------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  /* ---------- SCROLL REVEAL (IntersectionObserver) ---------- */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ---------- 3D TILT EFFECT ON CARDS ---------- */
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });

  /* ---------- FLOATING BUBBLES (Hero) ---------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    const colors = ['#F4C542','#F28C28','#E94E77','#8E44AD','#3498DB','#4CAF50'];
    for (let i = 0; i < 25; i++) {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble');
      const size = Math.random() * 60 + 20;
      bubble.style.width = size + 'px';
      bubble.style.height = size + 'px';
      bubble.style.left = Math.random() * 100 + '%';
      bubble.style.top = Math.random() * 100 + '%';
      bubble.style.background = colors[Math.floor(Math.random() * colors.length)];
      bubble.style.animationDelay = Math.random() * 5 + 's';
      bubble.style.animationDuration = (Math.random() * 10 + 6) + 's';
      bubble.style.opacity = Math.random() * 0.3 + 0.1;
      hero.appendChild(bubble);
    }
  }

  /* ---------- PARALLAX BACKGROUND (simple CSS fixed) ---------- */
  // Already handled via background-attachment: fixed on some sections if needed.
  // We'll add a class for desktop only to avoid mobile jank.
  if (window.innerWidth > 768) {
    document.querySelectorAll('.parallax-bg').forEach(section => {
      section.style.backgroundAttachment = 'fixed';
    });
  }
});
