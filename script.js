/* ============================================================
   Portfolio · Interactive layer
   Clean, modular hooks — extend with your own dynamic modules.
   ============================================================ */

(() => {
  'use strict';

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Reusable Current Profile Card ---------- */
  const currentProfile = {
    roleLabel: 'Senior Test Engineer',
    name: 'Anil Kumar',
    company: 'Happiest Minds Technologies Limited',
    avatar: 'AK',
    summary:
      'Working as a <span class="text-accent-green font-medium">Senior Test Engineer</span> at <span class="text-accent-cyan font-medium">Happiest Minds Technologies Limited</span>, building expertise in enterprise automation testing using Playwright, TypeScript, API Testing and CI/CD practices.',
    location: 'Noida, India',
    skills: [
      { label: 'Playwright', dotClass: 'bg-accent-green' },
      { label: 'TypeScript', dotClass: 'bg-accent-cyan' },
      { label: 'API Testing', dotClass: 'bg-accent-lime' },
      { label: 'CI/CD', dotClass: 'bg-accent-green' }
    ]
  };

  const profileRoleLabel = document.getElementById('profileRoleLabel');
  const profileName = document.getElementById('profileName');
  const profileCompany = document.getElementById('profileCompany');
  const profileAvatar = document.getElementById('profileAvatar');
  const profileCurrentSummary = document.getElementById('profileCurrentSummary');
  const profileLocation = document.getElementById('profileLocation');
  const profileSkills = document.getElementById('profileSkills');

  if (profileRoleLabel) profileRoleLabel.textContent = currentProfile.roleLabel;
  if (profileName) profileName.textContent = currentProfile.name;
  if (profileCompany) profileCompany.textContent = currentProfile.company;
  if (profileAvatar) profileAvatar.textContent = currentProfile.avatar;
  if (profileCurrentSummary) profileCurrentSummary.innerHTML = currentProfile.summary;
  if (profileLocation) profileLocation.textContent = currentProfile.location;

  if (profileSkills) {
    profileSkills.innerHTML = currentProfile.skills
      .map((skill) => `
        <div class="chip"><span class="dot-mini ${skill.dotClass}"></span> ${skill.label}</div>
      `)
      .join('');
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    const iconOpen = navToggle.querySelector('.icon-open');
    const iconClose = navToggle.querySelector('.icon-close');
    let isMenuOpen = false;

    const setMenu = (open) => {
      isMenuOpen = open;
      if (open) {
        mobileMenu.removeAttribute('hidden');
        mobileMenu.style.display = 'block';
        mobileMenu.classList.add('menu-open');
      } else {
        mobileMenu.classList.remove('menu-open');
        // Wait for animation to complete before hiding
        setTimeout(() => {
          if (!isMenuOpen) {
            mobileMenu.setAttribute('hidden', '');
            mobileMenu.style.display = 'none';
          }
        }, 250);
      }
      navToggle.setAttribute('aria-expanded', String(open));
      if (iconOpen) iconOpen.classList.toggle('hidden', open);
      if (iconClose) iconClose.classList.toggle('hidden', !open);
    };

    navToggle.addEventListener('click', () => {
      setMenu(!isMenuOpen);
    });

    // Close after tapping a link
    mobileMenu.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', () => setMenu(false));
    });

    // Reset when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) setMenu(false);
    });
  }

  /* ---------- Bento cursor-glow (per-card spotlight) ---------- */
  document.querySelectorAll('.bento').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Reveal-on-scroll ---------- */
  const revealEls = document.querySelectorAll('.bento, .section-heading');
  revealEls.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Animated stat counters ---------- */
  const statCards = document.querySelectorAll('.stat');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.target) || 0;
    const hasDecimal = !Number.isInteger(target);
    const suffix = el.dataset.suffix || '';
    const numEl = el.querySelector('.stat-num');
    if (!numEl) return;
    const accentSpan = numEl.querySelector('span');
    const accentColor = accentSpan ? accentSpan.className : '';

    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      const value = hasDecimal
        ? (target * eased).toFixed(1)
        : Math.round(target * eased);
      numEl.innerHTML = `${value}<span class="${accentColor}">${suffix}</span>`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const statIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statCards.forEach(el => statIO.observe(el));

  /* ---------- Smooth-scroll with sticky-header offset ---------- */
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('a[href^="#"]');

  const getNavOffset = () => {
    const headerHeight = header ? header.offsetHeight : 0;
    return headerHeight + 20;
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id.length <= 1) return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const offset = getNavOffset();
      const targetY = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });

      // Ensure mobile menu collapses after navigation
      if (mobileMenu && navToggle && window.innerWidth < 768) {
        mobileMenu.querySelectorAll('a[href^="#"]');
        if (navToggle.getAttribute('aria-expanded') === 'true') {
          navToggle.click();
        }
      }
    });
  });

  /* Contact form removed — using direct social/email links instead. */
})();


//  for exprience calculation

const joiningDate = new Date("2023-03-22");
const today = new Date();

const diffYears = (today - joiningDate) / (1000 * 60 * 60 * 24 * 365.25);
const experience = diffYears.toFixed(1);

const statCard = document.querySelector(".stat");
statCard.setAttribute("data-target", experience);

document.getElementById("experienceText").textContent =
  `${experience} years of experience`;