/* ==========================================================================
   VINAY PATEL — PORTFOLIO SCRIPT
   Vanilla JS only. Modules: navbar, cursor glow, particles, typing effect,
   terminal console, scroll reveal, counters, skill bars, tilt, carousel,
   contribution graph, contact form validation.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initNavbar();
  initMobileNav();
  initCursorGlow();
  initParticles();
  initTypingEffect();
  initTerminal();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initSkillCircles();
  initTilt();
  initTestimonialCarousel();
  initContributionGraph();
  initContactForm();
  initScrollTop();
  initResumeButton();
  initActiveNavLink();
});

/* ---------- Footer year ---------- */
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Navbar background on scroll ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Mobile nav toggle ---------- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* ---------- Custom cursor glow (desktop only) ---------- */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  if (window.matchMedia('(pointer: coarse)').matches) {
    glow.style.display = 'none';
    return;
  }
  window.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  }, { passive: true });
}

/* ---------- Floating glowing particles (hero canvas) ---------- */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = canvas.closest('.hero');
  let particles = [];
  let width, height;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    const count = Math.min(70, Math.floor((width * height) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.15,
      hue: Math.random() > 0.5 ? '45,212,245' : '139,123,255'
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue}, ${p.alpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `rgba(${p.hue}, ${p.alpha})`;
      ctx.fill();
    });
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

/* ---------- Hero typing effect ---------- */
function initTypingEffect() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const roles = [
    'Python Backend Developer',
    'FastAPI Developer',
    'AWS Cloud Developer',
    'Backend Engineer',
    'API Developer'
  ];
  let roleIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 40 : 65);
  }
  tick();
}

/* ---------- Signature element: animated API console ---------- */
function initTerminal() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  const script = [
    { type: 'prompt', text: 'vinay@backend', path: ' ~/services/api', suffix: ' $ ' },
    { type: 'cmd', text: 'curl -X GET /api/v1/dags/daily_ingest_pipeline' },
    { type: 'wait', ms: 500 },
    { type: 'line', text: '{' },
    { type: 'line', text: '  "dag_id": ', key: true, extra: '"daily_ingest_pipeline",' },
    { type: 'line', text: '  "runner": ', key: true, extra: '"MWAA",' },
    { type: 'line', text: '  "tasks": ', key: true, extra: '["extract", "transform", "load"],' },
    { type: 'status', text: '  "status": "success" ✓' },
    { type: 'line', text: '}' },
    { type: 'wait', ms: 900 },
    { type: 'prompt', text: 'vinay@backend', path: ' ~/services/api', suffix: ' $ ' },
    { type: 'cmd', text: 'pytest tests/test_vehicle_api.py -v' },
    { type: 'wait', ms: 400 },
    { type: 'status', text: '20 passed in 1.84s ✓' },
    { type: 'wait', ms: 900 },
    { type: 'prompt', text: 'vinay@backend', path: ' ~/services/api', suffix: ' $ ' },
    { type: 'cmd', text: 'echo "ready for production"' },
    { type: 'status', text: 'ready for production' },
    { type: 'wait', ms: 1600 }
  ];

  let i = 0;

  function typeLine(text, className, callback) {
    const lineEl = document.createElement('div');
    lineEl.className = 'term-line';
    if (className) lineEl.classList.add(className);
    body.appendChild(lineEl);
    let c = 0;
    function step() {
      lineEl.textContent = text.slice(0, c);
      c++;
      if (c <= text.length) {
        setTimeout(step, 16);
      } else if (callback) {
        callback();
      }
    }
    step();
    body.scrollTop = body.scrollHeight;
  }

  function renderStatic(text, className) {
    const lineEl = document.createElement('div');
    lineEl.className = 'term-line' + (className ? ' ' + className : '');
    lineEl.textContent = text;
    body.appendChild(lineEl);
    body.scrollTop = body.scrollHeight;
  }

  function clearIfTooLong() {
    while (body.children.length > 14) {
      body.removeChild(body.firstChild);
    }
  }

  function next() {
    if (i >= script.length) {
      setTimeout(() => { body.innerHTML = ''; i = 0; next(); }, 1200);
      return;
    }
    const step = script[i];
    clearIfTooLong();

    if (step.type === 'wait') {
      i++;
      setTimeout(next, step.ms);
    } else if (step.type === 'prompt') {
      const lineEl = document.createElement('div');
      lineEl.className = 'term-line';
      lineEl.innerHTML = `<span class="term-prompt">${step.text}</span><span class="term-path">${step.path}</span><span class="term-comment">${step.suffix}</span>`;
      body.appendChild(lineEl);
      body.scrollTop = body.scrollHeight;
      i++;
      setTimeout(next, 260);
    } else if (step.type === 'cmd') {
      i++;
      typeLine(step.text, null, () => setTimeout(next, 200));
    } else if (step.type === 'status') {
      i++;
      renderStatic(step.text, 'term-status-ok');
      setTimeout(next, 260);
    } else {
      i++;
      renderStatic(step.text);
      setTimeout(next, 90);
    }
  }

  next();
}

/* ---------- Scroll reveal (IntersectionObserver) ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => entry.target.classList.add('is-visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(item => observer.observe(item));
}

/* ---------- Animated count-up statistics ---------- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isDecimal = !Number.isInteger(target);
    const duration = 1600;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
    }
    requestAnimationFrame(frame);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ---------- Skill progress bars ---------- */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar[data-level]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const level = entry.target.dataset.level;
        const fill = entry.target.querySelector('.bar-fill');
        requestAnimationFrame(() => { fill.style.width = level + '%'; });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(b => observer.observe(b));
}

/* ---------- Circular skill charts ---------- */
function initSkillCircles() {
  const circles = document.querySelectorAll('.skill-icon-circle[data-percent]');
  if (!circles.length) return;
  const CIRCUMFERENCE = 264;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const percent = parseFloat(entry.target.dataset.percent);
        const progress = entry.target.querySelector('.circle-progress');
        const offset = CIRCUMFERENCE - (CIRCUMFERENCE * percent) / 100;
        requestAnimationFrame(() => { progress.style.strokeDashoffset = offset; });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  circles.forEach(c => observer.observe(c));
}

/* ---------- 3D tilt effect for project cards ---------- */
function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

/* ---------- Testimonial carousel ---------- */
function initTestimonialCarousel() {
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('testimonialDots');
  if (!track || !dotsContainer) return;

  const slides = track.children.length;
  let index = 0;

  for (let i = 0; i < slides; i++) {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function goTo(i) {
    index = i;
    track.style.transform = `translateX(-${index * 100}%)`;
    [...dotsContainer.children].forEach((d, di) => d.classList.toggle('active', di === index));
  }

  let autoplay = setInterval(() => goTo((index + 1) % slides), 5000);

  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.parentElement.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo((index + 1) % slides), 5000);
  });
}

/* ---------- GitHub-style contribution graph (placeholder data) ---------- */
function initContributionGraph() {
  const container = document.getElementById('contributionGraph');
  if (!container) return;
  const weeks = 26 * 7;
  for (let i = 0; i < weeks; i++) {
    const cell = document.createElement('div');
    cell.className = 'contribution-cell';
    const intensity = Math.random();
    if (intensity > 0.85) cell.style.background = 'var(--cyan)';
    else if (intensity > 0.65) cell.style.background = 'rgba(45,212,245,0.55)';
    else if (intensity > 0.4) cell.style.background = 'rgba(45,212,245,0.28)';
    else if (intensity > 0.2) cell.style.background = 'rgba(255,255,255,0.09)';
    container.appendChild(cell);
  }
}

/* ---------- Contact form validation ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const success = document.getElementById('formSuccess');

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
    subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError') }
  };

  function validateField(key) {
    const { el, error } = fields[key];
    let msg = '';

    if (key === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!el.value.trim()) msg = 'Email is required.';
      else if (!emailPattern.test(el.value.trim())) msg = 'Enter a valid email address.';
    } else {
      if (!el.value.trim()) msg = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
      else if (el.value.trim().length < (key === 'message' ? 10 : 2)) {
        msg = key === 'message' ? 'Message should be at least 10 characters.' : 'This field looks too short.';
      }
    }

    error.textContent = msg;
    el.classList.toggle('error', !!msg);
    return !msg;
  }

  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('error')) validateField(key);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.keys(fields).map(validateField);
    const isValid = results.every(Boolean);

    if (isValid) {
      success.classList.add('show');
      form.reset();
      setTimeout(() => success.classList.remove('show'), 5000);
    } else {
      success.classList.remove('show');
    }
  });
}

/* ---------- Scroll to top button ---------- */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Resume download placeholder ---------- */
// function initResumeButton() {
//   const btn = document.getElementById('resumeBtn');
//   if (!btn) return;
//   btn.addEventListener('click', (e) => {
//     e.preventDefault();
//     const original = btn.querySelector('span').textContent;
//     btn.querySelector('span').textContent = 'Add resume link in script.js';
//     setTimeout(() => { btn.querySelector('span').textContent = original; }, 2200);
//   });
// }

/* ---------- Active nav link on scroll ---------- */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-90px 0px -50% 0px' });

  sections.forEach(section => observer.observe(section));
}