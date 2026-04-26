/* ============================================================
   PORTFOLIO SCRIPT.JS
   Alex Rizki — Personal Portfolio
   Author: Portfolio Generator
   ============================================================ */

'use strict';

/* ============================================================
   1. LOADING SCREEN
   Sembunyikan loading screen setelah halaman siap
============================================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  // Tunggu animasi bar selesai (1.8s), lalu fade out
  setTimeout(() => {
    loader.classList.add('hidden');
    // Mulai animasi reveal awal setelah loader hilang
    setTimeout(() => triggerHeroReveal(), 300);
  }, 2000);
});

/* ============================================================
   2. NAVBAR — SCROLL BEHAVIOR & ACTIVE LINKS
============================================================ */
const navbar  = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  // Ubah background saat scroll melewati 60px
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  // Update active nav link berdasarkan posisi scroll
  let currentSection = '';
  sections.forEach(sec => {
    const offset = sec.offsetTop - 100;
    if (window.scrollY >= offset) {
      currentSection = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateNavbar, { passive: true });

/* ============================================================
   3. SMOOTH SCROLL — Navbar & Mobile Links
============================================================ */
function smoothScrollTo(targetId) {
  const target = document.querySelector(targetId);
  if (!target) return;
  const offsetTop = target.offsetTop - 70;
  window.scrollTo({ top: offsetTop, behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    smoothScrollTo(href);
    // Tutup mobile menu jika terbuka
    closeMobileMenu();
  });
});

/* ============================================================
   4. MOBILE MENU — Hamburger Toggle
============================================================ */
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose  = document.getElementById('mobileClose');

function openMobileMenu() {
  hamburger.classList.add('active');
  mobileMenu.classList.add('active');
  mobileOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('active');
  mobileOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMobileMenu);
mobileClose.addEventListener('click', closeMobileMenu);
mobileOverlay.addEventListener('click', closeMobileMenu);

/* ============================================================
   5. DARK MODE TOGGLE
============================================================ */
const darkToggle  = document.getElementById('darkToggle');
const toggleIcon  = document.getElementById('toggleIcon');
const body        = document.body;

// Cek preferensi tersimpan
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
  body.classList.remove('light-mode');
  toggleIcon.className = 'ph ph-sun';
}

darkToggle.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark-mode');
  body.classList.toggle('light-mode', !isDark);
  toggleIcon.className = isDark ? 'ph ph-sun' : 'ph ph-moon';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* ============================================================
   6. TYPING TEXT ANIMATION
   Animasi mengetik jabatan di hero section
============================================================ */
const typedEl    = document.getElementById('typedText');
const roles      = [
  'Web Developer',
  'Front End Developer',
  'UI/UX Designer',
  'Laravel Developer',
  'Freelancer',
  'Problem Solver',
];

let roleIndex   = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingTimer = null;

function typeText() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    // Hapus karakter
    typedEl.textContent = currentRole.slice(0, charIndex - 1);
    charIndex--;
  } else {
    // Tambah karakter
    typedEl.textContent = currentRole.slice(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 110;

  if (!isDeleting && charIndex === currentRole.length) {
    // Selesai mengetik — tunggu lalu hapus
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Selesai menghapus — pindah ke peran berikutnya
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  typingTimer = setTimeout(typeText, delay);
}

// Mulai setelah loader selesai
setTimeout(typeText, 2300);

/* ============================================================
   7. SCROLL REVEAL ANIMATIONS
   Elemen muncul saat masuk viewport
============================================================ */
function triggerHeroReveal() {
  // Langsung tampilkan elemen hero tanpa menunggu scroll
  document.querySelectorAll('.hero .reveal, .hero .reveal-left, .hero .reveal-right')
    .forEach(el => el.classList.add('visible'));
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Jika element adalah progress bar, trigger animasinya
      const fills = entry.target.querySelectorAll('.progress-fill');
      fills.forEach(fill => {
        const targetWidth = fill.getAttribute('data-width');
        fill.style.width = targetWidth + '%';
      });
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px',
});

// Observasi semua elemen reveal
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ============================================================
   8. PROGRESS BARS — Animasi saat skill section terlihat
============================================================ */
const skillsSection = document.getElementById('skills');
let skillsAnimated = false;

const skillObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !skillsAnimated) {
    skillsAnimated = true;
    document.querySelectorAll('.progress-fill').forEach(fill => {
      const targetWidth = fill.getAttribute('data-width');
      setTimeout(() => {
        fill.style.width = targetWidth + '%';
      }, 300);
    });
  }
}, { threshold: 0.3 });

if (skillsSection) skillObserver.observe(skillsSection);

/* ============================================================
   9. COUNTER ANIMATION — Angka statistik
============================================================ */
const counters     = document.querySelectorAll('.counter');
let countersStarted = false;

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1500;
  const step     = target / (duration / 16);
  let current    = 0;

  const update = () => {
    current += step;
    if (current >= target) {
      el.textContent = target;
    } else {
      el.textContent = Math.floor(current);
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    counters.forEach(counter => animateCounter(counter));
  }
}, { threshold: 0.5 });

const aboutSection = document.getElementById('about');
if (aboutSection) counterObserver.observe(aboutSection);

/* ============================================================
   10. PROJECT FILTER — Tab filter proyek
============================================================ */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ============================================================
   11. CONTACT FORM — Submit handler
============================================================ */
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Loading state
    submitBtn.innerHTML = '<i class="ph ph-circle-notch" style="animation:spin 0.8s linear infinite"></i> Mengirim...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        formSuccess.classList.add('show');
        contactForm.reset();

        // Sembunyikan pesan sukses setelah 5 detik
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      alert('Terjadi kesalahan. Silakan coba lagi.');
    }
  });
}

/* ============================================================
   12. BACK TO TOP BUTTON
============================================================ */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   13. INJECT DYNAMIC CSS KEYFRAMES
============================================================ */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

/* ============================================================
   14. CURSOR GLOW EFFECT (Desktop only)
   Efek cahaya mengikuti cursor
============================================================ */
if (window.innerWidth > 900) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

/* ============================================================
   15. NAVBAR SCROLL INIT
   Jalankan saat pertama load
============================================================ */
updateNavbar();
