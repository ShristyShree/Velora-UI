/* ═══════════════════════════════════════════════════
   VELORA MOTORS — FINAL JAVASCRIPT
   Premium interactions, animations, scroll magic
═══════════════════════════════════════════════════ */

'use strict';

/* ── LOADER ─────────────────────────────────────── */
const loader     = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');

window.addEventListener('load', () => {
  loaderFill.style.width = '100%';
  setTimeout(() => loader.classList.add('hidden'), 2600);
});

/* ── CUSTOM CURSOR ──────────────────────────────── */
const curDot  = document.getElementById('cursor-dot');
const curRing = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  curDot.style.left = mouseX + 'px';
  curDot.style.top  = mouseY + 'px';
});

// Ring follows with lag
function animateRing() {
  ringX += (mouseX - ringX) * 0.11;
  ringY += (mouseY - ringY) * 0.11;
  curRing.style.left = ringX + 'px';
  curRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover states
const hoverEls = document.querySelectorAll('a, button, .car-hero, .car-card, .car-wide, .feat-card, .review-card, .filter-pill, .store-btn');
hoverEls.forEach(el => {
  el.addEventListener('mouseenter', () => { curDot.classList.add('hovering'); curRing.classList.add('hovering'); });
  el.addEventListener('mouseleave', () => { curDot.classList.remove('hovering'); curRing.classList.remove('hovering'); });
});

/* ── NAVBAR ─────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  // Scrolled state
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Back to top
  backTop.classList.toggle('visible', window.scrollY > 600);

  // Active nav link
  let current = '';
  document.querySelectorAll('section[id]').forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 160) current = sec.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

/* ── MOBILE MENU ────────────────────────────────── */
const hamburger     = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobClose      = document.getElementById('mobClose');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileOverlay.classList.toggle('open');
  document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
});
mobClose.addEventListener('click', closeMobile);

function closeMobile() {
  hamburger.classList.remove('open');
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}
window.closeMobile = closeMobile;

/* ── HERO PARALLAX ──────────────────────────────── */
const heroBg  = document.getElementById('heroBg');
const heroImg = document.getElementById('heroImg');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    heroBg.style.transform = `scale(1.06) translateY(${scrolled * 0.25}px)`;
  }
});

// Subtle mouse parallax on hero bg
document.addEventListener('mousemove', e => {
  const xPos = (e.clientX / window.innerWidth  - 0.5) * 12;
  const yPos = (e.clientY / window.innerHeight - 0.5) * 8;
  if (window.scrollY < window.innerHeight) {
    heroBg.style.transform = `scale(1.06) translate(${xPos}px, ${yPos}px)`;
  }
});

/* ── SCROLL REVEAL ──────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const parent   = entry.target.parentElement;
      const siblings = [...parent.children].filter(c =>
        c.classList.contains('reveal') ||
        c.classList.contains('reveal-left') ||
        c.classList.contains('reveal-right')
      );
      const idx   = siblings.indexOf(entry.target);
      const delay = idx * 90;

      setTimeout(() => entry.target.classList.add('vis'), delay);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObs.observe(el));

/* ── COUNTER ANIMATION ──────────────────────────── */
const statNums = document.querySelectorAll('.stat-num');

function animateCount(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  let current  = 0;
  const steps  = 65;
  const step   = Math.ceil(target / steps);

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString() + suffix;
      clearInterval(timer);
    } else {
      el.textContent = current.toLocaleString() + suffix;
    }
  }, 22);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      statNums.forEach(el => animateCount(el));
      counterObs.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObs.observe(heroStats);

/* ── FILTER TABS ────────────────────────────────── */
const filterPills = document.querySelectorAll('.filter-pill');
const allCarCells = document.querySelectorAll('[data-cat]');

filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const filter = pill.dataset.filter;

    allCarCells.forEach(cell => {
      const match = filter === 'all' || cell.dataset.cat === filter;
      cell.style.transition = 'opacity .4s ease, transform .4s ease';

      if (match) {
        cell.style.opacity   = '1';
        cell.style.transform = 'none';
        cell.style.pointerEvents = 'auto';
      } else {
        cell.style.opacity   = '0.15';
        cell.style.transform = 'scale(0.98)';
        cell.style.pointerEvents = 'none';
      }
    });
  });
});

/* ── CARD 3D TILT ───────────────────────────────── */
const tiltCards = document.querySelectorAll('.car-hero, .car-card, .car-wide, .feat-card, .review-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 7;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 7;
    card.style.transform = `perspective(900px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.01)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.6s cubic-bezier(.16,1,.3,1)';
  });
});

/* ── CINEMATIC STRIP PARALLAX ───────────────────── */
const cinImg = document.getElementById('cinImg');

if (cinImg) {
  window.addEventListener('scroll', () => {
    const strip  = cinImg.closest('.cin-strip');
    const rect   = strip.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const offset = (window.innerHeight / 2 - center) * 0.12;
    cinImg.style.transform = `translateY(${offset}px) scale(1.08)`;
  });
}

/* ── MAGNETIC BUTTONS ───────────────────────────── */
document.querySelectorAll('.btn-primary, .btn-nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.14;
    const y = (e.clientY - r.top  - r.height / 2) * 0.14;
    btn.style.transform = `translateY(-3px) translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── BACK TO TOP ────────────────────────────────── */
const backTop = document.getElementById('backTop');
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── HERO CARD HOVER GLOW ───────────────────────── */
const heroCard = document.getElementById('heroCard');
if (heroCard) {
  heroCard.addEventListener('mousemove', e => {
    const r  = heroCard.getBoundingClientRect();
    const x  = ((e.clientX - r.left) / r.width)  * 100;
    const y  = ((e.clientY - r.top)  / r.height) * 100;
    heroCard.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(200,168,75,.12), rgba(8,8,24,.72) 60%)`;
  });
  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.background = '';
  });
}

/* ── BRAND MARQUEE PAUSE ON HOVER ───────────────── */
const brandList = document.querySelector('.brand-list');
if (brandList) {
  brandList.addEventListener('mouseenter', () => brandList.style.animationPlayState = 'paused');
  brandList.addEventListener('mouseleave', () => brandList.style.animationPlayState = 'running');
}

/* ── SMOOTH ANCHOR SCROLLING ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* ── CURSOR GLOW TRAIL ──────────────────────────── */
const glowTrail = document.createElement('div');
Object.assign(glowTrail.style, {
  position:      'fixed',
  pointerEvents: 'none',
  zIndex:        '9996',
  width:         '320px',
  height:        '320px',
  borderRadius:  '50%',
  background:    'radial-gradient(circle, rgba(200,168,75,.04) 0%, transparent 70%)',
  transform:     'translate(-50%, -50%)',
  transition:    'opacity .3s',
});
document.body.appendChild(glowTrail);

let glowX = 0, glowY = 0;
function animateGlow() {
  glowX += (mouseX - glowX) * 0.07;
  glowY += (mouseY - glowY) * 0.07;
  glowTrail.style.left = glowX + 'px';
  glowTrail.style.top  = glowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();

/* ── COLOR DOT PICKER (MINI PHONE) ─────────────── */
document.querySelectorAll('.pdot').forEach(dot => {
  dot.addEventListener('click', () => {
    document.querySelectorAll('.pdot').forEach(d => d.classList.remove('active-dot'));
    dot.classList.add('active-dot');
  });
});

/* ── FEAT CARD NUMBER PARALLAX ──────────────────── */
document.querySelectorAll('.feat-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const num = card.querySelector('.feat-num');
    if (!num) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top)  / r.height;
    num.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
    num.style.opacity   = '0.07';
  });
  card.addEventListener('mouseleave', () => {
    const num = card.querySelector('.feat-num');
    if (num) { num.style.transform = ''; num.style.opacity = ''; }
  });
});

/* ── PAGE ENTRANCE ──────────────────────────────── */
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';
setTimeout(() => { document.body.style.opacity = '1'; }, 80);

/* ── RESIZE: CLOSE MOBILE MENU ──────────────────── */
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMobile();
});
