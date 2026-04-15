/* ===== PARTICLES ANIMATION ===== */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  const PARTICLE_COUNT = 80;
  const CONNECT_DIST = 120;

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      if (mouse.x !== null) {
        const dx = mouse.x - this.x, dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) { this.vx += dx * 0.00008; this.vy += dy * 0.00008; }
      }
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`; ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.08 * (1 - dist / CONNECT_DIST)})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===== MOBILE NAV ===== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  const spans = navToggle.querySelectorAll('span');
  if (navLinks.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = 'none'; spans[1].style.opacity = '1'; spans[2].style.transform = 'none';
  }
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = 'none'; spans[1].style.opacity = '1'; spans[2].style.transform = 'none';
  });
});

/* ===== SCROLL REVEAL ===== */
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('active'), idx * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealElements.forEach(el => revealObserver.observe(el));

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + suffix;
  }, 25);
}

// Hero counters
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(document.getElementById('counter1'), 150, '+');
      animateCounter(document.getElementById('counter2'), 500, '+');
      animateCounter(document.getElementById('counter3'), 98, '%');
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
heroObserver.observe(document.querySelector('.hero-stats'));

// Stats bar counters
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        animateCounter(counter, target, counter.closest('.stat-block').querySelector('p').textContent.includes('%') ? '%' : '+');
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

/* ===== SMOOTH SCROLL FOR NAV LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ===== TYPING EFFECT (optional visual) ===== */
const typingTexts = ['Data Governance', 'Data Quality', 'Data Architecture', 'Data Management'];
let textIndex = 0, charIndex = 0, isDeleting = false;
const heroGradientText = document.querySelector('.hero h1 .gradient-text');

function typeEffect() {
  if (!heroGradientText) return;
  const current = typingTexts[textIndex];

  if (!isDeleting) {
    heroGradientText.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) { isDeleting = true; setTimeout(typeEffect, 2000); return; }
  } else {
    heroGradientText.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) { isDeleting = false; textIndex = (textIndex + 1) % typingTexts.length; }
  }
  setTimeout(typeEffect, isDeleting ? 50 : 100);
}
setTimeout(typeEffect, 2000);

/* ===== FORM HANDLER ===== */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '✓ Đã gửi thành công!';
  btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}

/* ===== PARALLAX ON HERO VISUAL ===== */
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && window.innerWidth > 768) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    heroVisual.style.transform = `translate(${x}px, ${y}px)`;
  });
}
