/* ═══════════════════════════════════════════════════════
   PORTFOLIO — script.js  Final Definitive Version
   ═══════════════════════════════════════════════════════ */

// ── THEME ─────────────────────────────────────────────
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const stored = localStorage.getItem('fu-theme');
if (stored) html.setAttribute('data-theme', stored);

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('fu-theme', next);
  initCanvas(); // re-init canvas on theme change
});

// ── HERO CANVAS — floating dot constellation ──────────
const canvas = document.getElementById('hero-canvas');
let ctx, W, H, dots = [], RAF;

function initCanvas() {
  if (!canvas) return;
  cancelAnimationFrame(RAF);
  ctx = canvas.getContext('2d');
  resize();
  dots = [];
  const count = Math.min(80, Math.floor((W * H) / 14000));
  const dark = html.getAttribute('data-theme') === 'dark';
  for (let i = 0; i < count; i++) {
    dots.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      a: Math.random() * 0.5 + 0.15,
    });
  }
  loop();
}

function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}

function loop() {
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);
  const dark = html.getAttribute('data-theme') === 'dark';
  const dotColor = dark ? '200,160,80' : '120,100,60';
  const lineColor = dark ? '200,160,80' : '130,110,70';

  for (let i = 0; i < dots.length; i++) {
    const d = dots[i];
    d.x += d.vx; d.y += d.vy;
    if (d.x < 0 || d.x > W) d.vx *= -1;
    if (d.y < 0 || d.y > H) d.vy *= -1;

    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${dotColor},${d.a})`;
    ctx.fill();

    for (let j = i + 1; j < dots.length; j++) {
      const d2 = dots[j];
      const dx = d.x - d2.x, dy = d.y - d2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d2.x, d2.y);
        ctx.strokeStyle = `rgba(${lineColor},${(1 - dist / 130) * 0.14})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  RAF = requestAnimationFrame(loop);
}

window.addEventListener('resize', () => { resize(); });
window.addEventListener('load', initCanvas);

// ── NAV SHADOW ────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 8 ? '0 4px 30px rgba(0,0,0,.09)' : 'none';
}, { passive: true });

// ── ACTIVE NAV ────────────────────────────────────────
const navLinks = document.querySelectorAll('.nav-menu a');
const sections = document.querySelectorAll('section[id]');

const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(l => l.classList.remove('on'));
    const a = document.querySelector(`.nav-menu a[href="#${e.target.id}"]`);
    if (a) a.classList.add('on');
  });
}, { rootMargin: '-44% 0px -54% 0px' });
sections.forEach(s => navObs.observe(s));

// ── SCROLL REVEAL ─────────────────────────────────────
(() => {
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const parent  = entry.target.parentElement;
      const pending = [...parent.querySelectorAll('.sr:not(.in)')];
      const idx     = pending.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('in'), Math.max(0, idx * 70));
      o.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.sr').forEach(el => obs.observe(el));
})();

// ── SMOOTH SCROLL ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 62, behavior: 'smooth' });
  });
});

// ── PROJECT CARD TILT ─────────────────────────────────
document.querySelectorAll('.pc:not(.pc-slash):not(.pc-arc)').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
    const y = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
    card.style.transform = `translateY(-6px) perspective(700px) rotateY(${x * 2.5}deg) rotateX(${-y * 1.8}deg)`;
    card.style.transition = 'box-shadow .32s, border-color .32s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform .38s cubic-bezier(.16,1,.3,1), box-shadow .38s, border-color .38s';
  });
});

// ── VINYL PAUSE ON SCROLL ─────────────────────────────
const vinyl = document.querySelector('.mp-vinyl');
const musicSection = document.getElementById('music');
if (vinyl && musicSection) {
  new IntersectionObserver(entries => {
    vinyl.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused';
  }, { threshold: 0.1 }).observe(musicSection);
}
