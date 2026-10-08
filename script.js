/* ============================================================
   BIRTHDAY WEBSITE – script.js
   Handles: Loader, Navbar, Mobile Menu, Scroll Reveal,
            Lightbox, Form Submit, Particle Background
============================================================ */

/* ============================================================
   1. LOADER
============================================================ */
function hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader || loader.classList.contains('hidden')) return;
  loader.classList.add('hidden');
  document.body.style.overflow = 'auto';
  triggerHeroAnimations();
}

// Hide loader after max 3s no matter what (videos shouldn't block this)
const loaderTimeout = setTimeout(hideLoader, 3000);

// If page loads fast, hide sooner
window.addEventListener('load', () => {
  clearTimeout(loaderTimeout);
  setTimeout(hideLoader, 800);
});

// Prevent scroll while loading
document.body.style.overflow = 'hidden';

/* ============================================================
   2. HERO ANIMATIONS (run once loader is done)
============================================================ */
function triggerHeroAnimations() {
  const heroElements = document.querySelectorAll('.hero .reveal');

  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, index * 180);
  });
}

/* ============================================================
   3. NAVBAR – scroll behavior
============================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ============================================================
   4. ACTIVE NAV LINK – highlight based on scroll position
============================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active-link');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active-link');
    }
  });
});

/* Add active link style dynamically */
const navStyle = document.createElement('style');
navStyle.textContent = `
  .nav-links a.active-link {
    color: var(--gold) !important;
  }
  .nav-links a.active-link::after {
    width: 100% !important;
  }
`;
document.head.appendChild(navStyle);

/* ============================================================
   5. HAMBURGER / MOBILE MENU
============================================================ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow =
    mobileMenu.classList.contains('open') ? 'hidden' : 'auto';
});

mobileClose.addEventListener('click', () => {
  closeMobile();
});

// Close on backdrop click
mobileMenu.addEventListener('click', (e) => {
  if (e.target === mobileMenu) closeMobile();
});

function closeMobile() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = 'auto';
}

/* ============================================================
   6. SCROLL REVEAL – IntersectionObserver
============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Stagger children inside a grid if needed
        const children = entry.target.querySelectorAll(
          '.stat-card, .gallery-item, .wish-card'
        );
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('visible'), i * 100);
        });

        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ============================================================
   6b. LAZY VIDEO AUTOPLAY — play only when in viewport
============================================================ */
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}, { threshold: 0.25 });

document.querySelectorAll('.gallery-item video').forEach(video => {
  videoObserver.observe(video);
});

/* ============================================================
   7. LIGHTBOX (Images + Videos)
============================================================ */
const lightbox         = document.getElementById('lightbox');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');
const lightboxImg      = document.getElementById('lightboxImg');
const lightboxClose    = document.getElementById('lightboxClose');
const lightboxPrev     = document.getElementById('lightboxPrev');
const lightboxNext     = document.getElementById('lightboxNext');

// --- Video lightbox ---
const videoLightbox         = document.getElementById('videoLightbox');
const videoLightboxBackdrop = document.getElementById('videoLightboxBackdrop');
const videoLightboxClose    = document.getElementById('videoLightboxClose');
const videoLightboxPlayer   = document.getElementById('videoLightboxPlayer');

const galleryItems = document.querySelectorAll('.gallery-item');
let currentImageIndex = 0;

// Collect ONLY image gallery items for prev/next navigation
const galleryImages = [];
const galleryImageItems = [];

galleryItems.forEach((item) => {
  const img = item.querySelector('img');
  if (img) {
    galleryImages.push({ src: img.src, alt: img.alt });
    galleryImageItems.push(item);
  }
});

// Attach click handlers
galleryItems.forEach((item) => {
  const video = item.querySelector('video');
  const img   = item.querySelector('img');

  item.addEventListener('click', () => {
    if (video) {
      openVideoLightbox(video.src);
    } else if (img) {
      const imgIndex = galleryImageItems.indexOf(item);
      currentImageIndex = imgIndex;
      openLightbox(imgIndex);
    }
  });
});

/* --- IMAGE LIGHTBOX --- */
function openLightbox(index) {
  const image = galleryImages[index];
  lightboxImg.src = image.src;
  lightboxImg.alt = image.alt;
  lightbox.classList.add('open');
  lightboxBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxBackdrop.classList.remove('open');
  document.body.style.overflow = 'auto';
  setTimeout(() => { lightboxImg.src = ''; }, 400);
}

function showPrev() {
  currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
  animateLightboxChange('right');
  setTimeout(() => {
    lightboxImg.src = galleryImages[currentImageIndex].src;
    lightboxImg.alt = galleryImages[currentImageIndex].alt;
  }, 150);
}

function showNext() {
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  animateLightboxChange('left');
  setTimeout(() => {
    lightboxImg.src = galleryImages[currentImageIndex].src;
    lightboxImg.alt = galleryImages[currentImageIndex].alt;
  }, 150);
}

function animateLightboxChange(direction) {
  const wrapper = document.querySelector('.lightbox-img-wrapper');
  const xVal = direction === 'left' ? '-30px' : '30px';
  wrapper.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
  wrapper.style.opacity = '0';
  wrapper.style.transform = `translateX(${xVal})`;
  setTimeout(() => {
    wrapper.style.transform = `translateX(${direction === 'left' ? '30px' : '-30px'})`;
    wrapper.style.opacity = '1';
    wrapper.style.transform = 'translateX(0)';
  }, 160);
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

/* --- VIDEO LIGHTBOX --- */
function openVideoLightbox(src) {
  videoLightboxPlayer.src = src;
  videoLightboxPlayer.muted = false;
  videoLightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  videoLightboxPlayer.play().catch(() => {});
}

function closeVideoLightbox() {
  videoLightbox.classList.remove('open');
  videoLightboxPlayer.pause();
  videoLightboxPlayer.src = '';
  document.body.style.overflow = 'auto';
}

videoLightboxClose.addEventListener('click', closeVideoLightbox);
videoLightboxBackdrop.addEventListener('click', closeVideoLightbox);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('open')) {
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'Escape') closeLightbox();
  }
  if (videoLightbox.classList.contains('open')) {
    if (e.key === 'Escape') closeVideoLightbox();
  }
});

/* ============================================================
   9. FLOATING PARTICLES (Canvas – Hero Background)
============================================================ */
const canvas = document.createElement('canvas');
canvas.id = 'particleCanvas';
canvas.style.cssText = `
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.45;
`;

const heroSection = document.querySelector('.hero');
heroSection.appendChild(canvas);

const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = heroSection.offsetWidth;
  canvas.height = heroSection.offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class
class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = -(Math.random() * 0.5 + 0.2);
    this.alpha = Math.random() * 0.6 + 0.2;
    this.color = Math.random() > 0.5
      ? `rgba(245, 200, 66, ${this.alpha})`   // gold
      : `rgba(255, 107, 157, ${this.alpha})`; // rose
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 0.0015;

    if (this.y < -10 || this.alpha <= 0) this.reset();
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Create particles
const PARTICLE_COUNT = 80;
const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

// Animation loop
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

animateParticles();

/* ============================================================
   10. SMOOTH SCROLL – all anchor links
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const offset = navbar.offsetHeight + 20;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   11. NAVBAR HIDE ON SCROLL DOWN / SHOW ON SCROLL UP
============================================================ */
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 200) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }

  lastScrollY = currentScrollY;
});

/* ============================================================
   12. STAT CARDS – COUNTER ANIMATION
============================================================ */
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const h3 = entry.target.querySelector('h3');
        if (!h3) return;

        const text = h3.textContent.trim();
        const isNum = /^\d+/.test(text);
        if (!isNum) return;

        const target = parseInt(text);
        const suffix = text.replace(/[0-9]/g, '');
        let current = 0;
        const step = Math.ceil(target / 60);

        const counter = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(counter);
          }
          h3.textContent = current + suffix;
        }, 25);

        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-card').forEach(card => {
  statObserver.observe(card);
});

/* ============================================================
   13. TILT EFFECT – Wish Cards
============================================================ */
document.querySelectorAll('.wish-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform =
      `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    card.style.transition = 'transform 0.4s ease';
  });
});

/* ============================================================
   14. GALLERY ITEM – stagger reveal on load
============================================================ */
const galleryObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.gallery-item');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 100);
        });
        galleryObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

const galleryGrid = document.querySelector('.gallery-grid');
if (galleryGrid) galleryObserver.observe(galleryGrid);

/* ============================================================
   COUNTDOWN TIMER
============================================================ */
function updateCountdown() {
  // Change this date to the actual birthday date
  const birthdayDate = new Date('2026-03-19T00:00:00');
  const now = new Date();
  const diff = birthdayDate - now;

  const expired = document.getElementById('countdown-expired');
  const grid = document.querySelector('.countdown-grid');

  // Guard: if countdown elements don't exist in the page, do nothing
  if (!grid && !expired) return;

  if (diff <= 0) {
    if (grid) grid.style.display = 'none';
    if (expired) expired.classList.add('show');
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (!el) return; // guard: element may not exist
    const newVal = String(val).padStart(2, '0');
    if (el.textContent !== newVal) {
      el.classList.remove('flip');
      void el.offsetWidth; // reflow
      el.classList.add('flip');
      el.textContent = newVal;
    }
  }

  setVal('cd-days', days);
  setVal('cd-hours', hours);
  setVal('cd-minutes', minutes);
  setVal('cd-seconds', seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);



/* ============================================================
   SECRET MESSAGE MODAL
============================================================ */

const secretAudio = new Audio('jade-lemac-constellations.mp3');
secretAudio.loop = true;

// Change this to whatever password you want
const SECRET_PASSWORD = 'Tioluwanimi';

function openSecretModal() {
  document.getElementById('secretBackdrop').classList.add('open');
  document.getElementById('secretModal').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Stop secret message audio if it was left playing somehow
  secretAudio.pause();
  secretAudio.currentTime = 0;

  // Reset to password step every time it opens
  document.getElementById('stepPassword').classList.remove('hidden');
  document.getElementById('stepMessage').classList.add('hidden');
  document.getElementById('passwordInput').value = '';
  document.getElementById('secretError').classList.remove('show');
  document.getElementById('passwordInput').classList.remove('error');
}

function closeSecretModal() {
  document.getElementById('secretBackdrop').classList.remove('open');
  document.getElementById('secretModal').classList.remove('open');
  document.body.style.overflow = 'auto';

  // Stop secret message audio
  secretAudio.pause();
  secretAudio.currentTime = 0;
}

function checkPassword() {
  const input = document.getElementById('passwordInput');
  const error = document.getElementById('secretError');
  const val = input.value.trim();

  if (val === SECRET_PASSWORD) {
    // Correct – show message
    input.classList.remove('error');
    error.classList.remove('show');

    // Pause main music player if playing
    if (isPlaying) pause();
    
    // Play secret message audio
    secretAudio.currentTime = 0;
    secretAudio.play().catch(e => console.error("Playback prevented", e));

    document.getElementById('stepPassword').classList.add('hidden');
    document.getElementById('stepMessage').classList.remove('hidden');

    // Launch full-page confetti + small modal confetti
    launchConfetti();
    launchFullPageConfetti();

    // Start typewriter on the message content
    setTimeout(startTypewriterSequence, 350);

  } else {
    // Wrong – shake and show error
    input.classList.remove('error');
    void input.offsetWidth; // reflow to restart animation
    input.classList.add('error');
    error.classList.add('show');

    // Clear error after 3 seconds
    setTimeout(() => {
      error.classList.remove('show');
      input.classList.remove('error');
    }, 3000);
  }
}

function togglePassword() {
  const input = document.getElementById('passwordInput');
  const eyeIcon = document.getElementById('eyeIcon');

  if (input.type === 'password') {
    input.type = 'text';
    eyeIcon.className = 'fa-solid fa-eye-slash';
  } else {
    input.type = 'password';
    eyeIcon.className = 'fa-solid fa-eye';
  }
}

function launchConfetti() {
  const area = document.getElementById('confettiArea');
  const colors = ['var(--gold)', 'var(--rose)', 'var(--purple)', 'var(--blush)', '#fff'];
  area.innerHTML = '';
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.classList.add('confetti-piece');
    piece.style.left = Math.random() * 100 + '%';
    piece.style.top = Math.random() * 20 + 'px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = Math.random() * 8 + 5 + 'px';
    piece.style.height = Math.random() * 8 + 5 + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.animationDelay = Math.random() * 0.6 + 's';
    piece.style.animationDuration = Math.random() * 0.8 + 0.8 + 's';
    area.appendChild(piece);
  }
}

/* Full-page confetti overlay */
function launchFullPageConfetti() {
  const overlay = document.createElement('div');
  overlay.className = 'confetti-overlay';
  document.body.appendChild(overlay);

  const colors = [
    'var(--gold)', 'var(--rose)', 'var(--purple)',
    'var(--blush)', '#fff', '#a855f7', '#f5c842', '#ff6b9d'
  ];

  for (let i = 0; i < 160; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece confetti-full';
    piece.style.left          = Math.random() * 100 + 'vw';
    piece.style.top           = -(Math.random() * 30 + 10) + 'px';
    piece.style.background    = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width         = Math.random() * 12 + 6 + 'px';
    piece.style.height        = Math.random() * 16 + 6 + 'px';
    piece.style.borderRadius  = Math.random() > 0.4 ? '50%' : '3px';
    piece.style.animationDelay    = Math.random() * 2.5 + 's';
    piece.style.animationDuration = Math.random() * 2 + 2.5 + 's';
    overlay.appendChild(piece);
  }

  // Fade out and remove overlay after 5 seconds
  setTimeout(() => {
    overlay.style.transition = 'opacity 1.2s ease';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 1200);
  }, 4500);
}

/* Typewriter sequence – types title then each paragraph */
function startTypewriterSequence() {
  const title  = document.querySelector('#stepMessage .secret-message-title');
  const bodies = document.querySelectorAll('#stepMessage .secret-message-body');
  if (!title) return;

  const titleHTML  = title.innerHTML;
  const titleText  = title.innerText.trim();
  const bodyTexts  = Array.from(bodies).map(b => b.innerText.trim());

  // Clear body paragraphs now; they'll be filled by the typewriter
  bodies.forEach(b => { b.textContent = ''; });

  const queue = [
    { el: title, text: titleText, speed: 38, finalHTML: titleHTML },
    ...Array.from(bodies).map((b, i) => ({ el: b, text: bodyTexts[i], speed: 30 }))
  ];

  typeQueue(queue, 0);
}

function typeQueue(queue, index) {
  if (index >= queue.length) return;
  const { el, text, speed, finalHTML } = queue[index];

  el.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.className = 'type-cursor';
  el.appendChild(cursor);

  let i = 0;
  function typeNext() {
    if (i < text.length) {
      cursor.insertAdjacentText('beforebegin', text[i]);
      i++;
      // Natural pause at punctuation
      const ch = text[i - 1];
      const delay = (ch === '.' || ch === '!' || ch === '?') ? speed * 5
                  : (ch === ',' || ch === ';')               ? speed * 2.5
                  : speed;
      setTimeout(typeNext, delay);
    } else {
      cursor.remove();
      if (finalHTML) el.innerHTML = finalHTML; // restore rich HTML
      setTimeout(() => typeQueue(queue, index + 1), 250);
    }
  }
  typeNext();
}

// Close modal on Escape key (only when secret modal is actually open)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.getElementById('secretModal').classList.contains('open')) {
    closeSecretModal();
  }
});

/* ============================================================
   BACK TO TOP BUTTON
============================================================ */
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   COMMUNITY WISHES SYSTEM — Firebase Firestore (real-time)
============================================================ */
(function () {
  var db = window.db;

  /* Utils */
  function escapeHtml(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }
  function fmtDate(ts) {
    if (!ts) return '';
    var date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /* Build a wish card */
  function wishCardHTML(w, showPin) {
    return '<div class="wish-card' + (w.pinned ? ' pinned-wish' : '') + '" data-id="' + w.id + '">' +
      (w.pinned && showPin ? '<div class="pin-badge"><i class="fa-solid fa-thumbtack"></i> Pinned</div>' : '') +
      '<div class="wish-quote"><i class="fa-solid fa-quote-left"></i></div>' +
      '<p>' + escapeHtml(w.message) + '</p>' +
      '<div class="wish-author">' +
        '<div class="wish-avatar"><i class="fa-solid fa-user"></i></div>' +
        '<div><h4>' + escapeHtml(w.name) + '</h4>' +
        '<span><i class="fa-solid fa-location-dot"></i> ' + escapeHtml(w.location || 'Somewhere special') + '</span></div>' +
        '<span class="wish-time">' + fmtDate(w.timestamp) + '</span>' +
      '</div></div>';
  }

  /* Tilt effect */
  function addTilt(grid) {
    grid.querySelectorAll('.wish-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -6;
        var ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 6;
        card.style.transform = 'translateY(-8px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
        card.style.transition = 'transform 0.1s ease';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        card.style.transition = 'transform 0.4s ease';
      });
    });
  }

  /* Real-time Firestore listener — updates all grids instantly */
  if (db) {
    db.collection('wishes').orderBy('timestamp', 'desc').onSnapshot(function (snapshot) {
      var wishes = [];
      snapshot.forEach(function (doc) {
        var d = doc.data();
        d.id = doc.id;
        wishes.push(d);
      });

      /* --- Wishes display grid (all visible) --- */
      var displayGrid = document.getElementById('wishesDisplayGrid');
      if (displayGrid) {
        var visible = wishes.filter(function (w) { return !w.hidden; });
        var sorted  = visible.filter(function (w) { return w.pinned; })
                             .concat(visible.filter(function (w) { return !w.pinned; }));
        displayGrid.innerHTML = sorted.map(function (w) { return wishCardHTML(w, false); }).join('');
        addTilt(displayGrid);
      }

      /* --- Community wishes grid (non-seeded only) --- */
      var communityGrid = document.getElementById('communityWishesGrid');
      var noMsg         = document.getElementById('noWishesMsg');
      var header        = document.getElementById('communityWishesHeader');
      var badge         = document.getElementById('wishCount');

      var userWishes  = wishes.filter(function (w) { return !w.seeded && !w.hidden; });
      var pinnedFirst = userWishes.filter(function (w) { return w.pinned; })
                                  .concat(userWishes.filter(function (w) { return !w.pinned; }));

      if (badge)  badge.textContent = userWishes.length;

      if (pinnedFirst.length === 0) {
        if (communityGrid) communityGrid.innerHTML = '';
        if (noMsg)  noMsg.style.display  = 'flex';
        if (header) header.style.display = 'none';
      } else {
        if (noMsg)  noMsg.style.display  = 'none';
        if (header) header.style.display = 'block';
        if (communityGrid) {
          communityGrid.innerHTML = pinnedFirst.map(function (w) { return wishCardHTML(w, true); }).join('');
          addTilt(communityGrid);
        }
      }
    }, function (err) {
      console.error('Firestore snapshot error:', err);
    });
  }

  /* Character counter */
  window.updateCharCount = function () {
    var msg = document.getElementById('wishMessage');
    var cnt = document.getElementById('charCount');
    if (msg && cnt) cnt.textContent = msg.value.length;
  };

  /* Toast */
  window.showToast = function () {
    var t = document.getElementById('wishToast');
    if (!t) return;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 3500);
  };

  /* Submit wish to Firestore */
  window.submitWish = function (e) {
    e.preventDefault();
    var nameEl = document.getElementById('wishName');
    var locEl  = document.getElementById('wishLocation');
    var msgEl  = document.getElementById('wishMessage');
    var btn    = document.getElementById('wishSubmitBtn');

    if (!nameEl || !msgEl || !btn) return;
    var name    = nameEl.value.trim();
    var loc     = locEl ? locEl.value.trim() : '';
    var message = msgEl.value.trim();
    if (!name || !message) return;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    db.collection('wishes').add({
      name:      name,
      location:  loc || 'Somewhere special',
      message:   message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      hidden:    false,
      pinned:    false,
      seeded:    false
    }).then(function () {
      var form = document.getElementById('wishForm');
      var cnt  = document.getElementById('charCount');
      if (form) form.reset();
      if (cnt)  cnt.textContent = '0';
      window.showToast();
    }).catch(function (err) {
      console.error('submitWish error:', err);
    }).finally(function () {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Wish';
    });
  };

})();