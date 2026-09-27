/* =====================================================================
   script.js
   All interactive behavior for the portfolio, split into small,
   independent functions. Each is initialized once on DOMContentLoaded.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  runTerminalTypingEffect();
  initMobileNavToggle();
  initScrollSpyNav();
  initProjectAccordion();
  initSkillBarAnimation();
  initContactForm();
});

/* ---------------------------------------------------------------------
   Footer year
   --------------------------------------------------------------------- */
function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------------------
   Hero terminal: types out a short "session" line by line, then leaves
   a blinking cursor. This is the single orchestrated motion moment on
   the page — everything else stays static or responds to user action.
   --------------------------------------------------------------------- */
function runTerminalTypingEffect() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  // Respect users who've asked for reduced motion: render instantly.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Each entry is either a typed command (prompt) or a printed result (output).
  // TODO: personalize this sequence with your own name / focus areas.
  const sequence = [
    { type: 'prompt', text: 'whoami' },
    { type: 'output', text: 'Your Name — Computer Science student' },
    { type: 'prompt', text: 'cat focus.txt' },
    { type: 'output', text: 'Cybersecurity · Network Analysis · ML for Security' },
    { type: 'prompt', text: './run --intro' },
    { type: 'output', text: 'Building tools that make network traffic and cryptographic\nsystems easier to understand, attack, and defend.' },
  ];

  if (prefersReducedMotion) {
    body.innerHTML = sequence
      .map(line => renderStaticLine(line))
      .join('');
    return;
  }

  let seqIndex = 0;

  function typeNextLine() {
    if (seqIndex >= sequence.length) return;

    const entry = sequence[seqIndex];
    const lineEl = document.createElement('div');
    lineEl.className = 'terminal__line';
    body.appendChild(lineEl);

    if (entry.type === 'prompt') {
      typeText(lineEl, `$ ${entry.text}`, 'terminal__prompt', () => {
        seqIndex++;
        setTimeout(typeNextLine, 200);
      });
    } else {
      // Output prints instantly beneath the command that produced it.
      lineEl.innerHTML = `<span class="terminal__output">${escapeHtml(entry.text).replace(/\n/g, '<br>')}</span>`;
      seqIndex++;
      setTimeout(typeNextLine, 400);
    }
  }

  function typeText(el, text, className, onDone) {
    let i = 0;
    const speed = 35; // ms per character
    (function step() {
      el.innerHTML = `<span class="${className}">${escapeHtml(text.slice(0, i))}</span><span class="terminal__cursor"></span>`;
      i++;
      if (i <= text.length) {
        setTimeout(step, speed);
      } else {
        el.innerHTML = `<span class="${className}">${escapeHtml(text)}</span>`;
        onDone();
      }
    })();
  }

  typeNextLine();
}

function renderStaticLine(entry) {
  if (entry.type === 'prompt') {
    return `<div class="terminal__line"><span class="terminal__prompt">$ ${escapeHtml(entry.text)}</span></div>`;
  }
  return `<div class="terminal__line"><span class="terminal__output">${escapeHtml(entry.text).replace(/\n/g, '<br>')}</span></div>`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---------------------------------------------------------------------
   Mobile navigation toggle (hamburger opens/closes the sidebar)
   --------------------------------------------------------------------- */
function initMobileNavToggle() {
  const toggle = document.getElementById('navToggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the sidebar after choosing a section, on small screens.
  sidebar.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------------------
   Scroll-spy: highlights the current section's file-tree entry
   --------------------------------------------------------------------- */
function initScrollSpyNav() {
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!('IntersectionObserver' in window) || sections.length === 0) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach(section => observer.observe(section));
}

/* ---------------------------------------------------------------------
   Projects accordion: click a project header to expand its details
   --------------------------------------------------------------------- */
function initProjectAccordion() {
  const headers = document.querySelectorAll('[data-toggle]');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const entry = header.closest('.project-entry');
      const isOpen = entry.getAttribute('data-open') === 'true';

      entry.setAttribute('data-open', String(!isOpen));
      header.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

/* ---------------------------------------------------------------------
   Skill bars: animate width from 0 to their target level only once
   they scroll into view, instead of on page load off-screen.
   --------------------------------------------------------------------- */
function initSkillBarAnimation() {
  const items = document.querySelectorAll('.skill-item');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    // Fallback: just set widths immediately.
    items.forEach(fillSkillBar);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fillSkillBar(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  items.forEach(item => observer.observe(item));
}

function fillSkillBar(item) {
  const level = item.getAttribute('data-level') || '0';
  const fill = item.querySelector('.skill-bar__fill');
  if (fill) fill.style.width = `${level}%`;
}

/* ---------------------------------------------------------------------
   Contact form: client-side validation + a simulated submit.
   NOTE: this demo has no backend. To actually receive messages, wire
   this up to a form service (e.g. Formspree, Netlify Forms) or your
   own API endpoint inside the fetch() call below.
   --------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', async event => {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = '✗ Please fill in every field before sending.';
      status.style.color = '#FF6B6B';
      return;
    }

    if (!isValidEmail(email)) {
      status.textContent = '✗ That email address doesn\'t look right.';
      status.style.color = '#FF6B6B';
      return;
    }

    status.textContent = 'sending...';
    status.style.color = '';

    try {
      // TODO: replace this simulated delay with a real request, e.g.:
      // await fetch('https://your-form-endpoint', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, message }),
      // });
      await new Promise(resolve => setTimeout(resolve, 600));

      status.textContent = `✓ Thanks, ${name} — your message is on its way.`;
      status.style.color = '#6FCF97';
      form.reset();
    } catch (err) {
      status.textContent = '✗ Something went wrong. Please email me directly instead.';
      status.style.color = '#FF6B6B';
    }
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
