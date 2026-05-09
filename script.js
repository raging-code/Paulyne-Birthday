// ===== SUPABASE CONFIG (lazy initialization) =====
let supabaseClient = null;
let supabaseInitialized = false;
let messagesData = [];
let currentMsgPage = 0;
let totalMsgPages = 0;
let gbBusy = false;
const accentClasses = ['ec-lavender', 'ec-peach', 'ec-lemon', 'ec-rose', 'ec-blue'];

async function initSupabase() {
  if (supabaseInitialized) return supabaseClient;
  if (typeof window.supabase !== 'undefined') {
    const SUPABASE_URL = 'https://rsxkatksleryuvdgvuib.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzeGthdGtzbGVyeXV2ZGd2dWliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODE3NDUsImV4cCI6MjA5MzU1Nzc0NX0.hmySwLwdOaDvdHqL1Z6WiK_RHY-RGEa_PisU_Rgh_2I';
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    supabaseInitialized = true;
    return supabaseClient;
  } else {
    console.warn('Supabase library not loaded yet');
    return null;
  }
}

function showToast(buttonElement, message) {
  // Remove any existing toast
  const existing = document.querySelector('.toast-pop');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-pop';
  toast.innerHTML = `<span style="font-size:14px;">✓</span> ${message}`;
  buttonElement.insertAdjacentElement('afterend', toast);

  // Auto‑remove after animation
  setTimeout(() => {
    if (toast.parentNode) toast.remove();
  }, 2700);
}

// ---------- COUNTDOWN ----------
function tick() {
  const t = new Date('2026-05-23T18:00:00') - new Date();
  if (t <= 0) return;
  const p = (n) => String(Math.floor(n)).padStart(2, '0');
  document.getElementById('cdD').textContent = p(t / 86400000);
  document.getElementById('cdH').textContent = p((t % 86400000) / 3600000);
  document.getElementById('cdM').textContent = p((t % 3600000) / 60000);
  document.getElementById('cdS').textContent = p((t % 60000) / 1000);
}
tick();
setInterval(tick, 1000);

// ---------- MUSIC PLAYER ----------
const audio = document.getElementById('bgAudio'),
  playPause = document.getElementById('playPauseBtn'),
  playIcon = document.getElementById('playIcon'),
  pauseIconA = document.getElementById('pauseIconA'),
  pauseIconB = document.getElementById('pauseIconB'),
  seek = document.getElementById('seekSlider'),
  mute = document.getElementById('muteBtn');
let muted = false, lastVol = 0.7;
audio.volume = 0.7;

function updateSeekFill() {
  const p = seek.value + '%';
  seek.style.background = `linear-gradient(to right,var(--dusty-blue-deep) 0%,var(--dusty-blue-deep) ${p},var(--border) ${p},var(--border) 100%)`;
}
function setPlayingUI(playing) {
  playIcon.style.display = playing ? 'none' : '';
  if (pauseIconA) pauseIconA.style.display = playing ? '' : 'none';
  if (pauseIconB) pauseIconB.style.display = playing ? '' : 'none';
}
playPause.addEventListener('click', () => audio.paused ? audio.play().catch(() => {}) : audio.pause());
audio.addEventListener('play', () => setPlayingUI(true));
audio.addEventListener('pause', () => setPlayingUI(false));
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    seek.value = (audio.currentTime / audio.duration) * 100;
    updateSeekFill();
  }
});
seek.addEventListener('input', () => {
  if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
  updateSeekFill();
});
mute.addEventListener('click', () => {
  muted = !muted;
  if (muted) { lastVol = audio.volume || 0.7; audio.volume = 0; } else audio.volume = lastVol;
  mute.innerHTML = muted
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
});
document.addEventListener('DOMContentLoaded', () => audio.play().catch(() => {}));

// ---------- NAVIGATION ----------
window.addEventListener('scroll', () => {
  document.getElementById('siteNav').classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});
// Close mobile menu on link click – replaces inline onclick
function closeMob() {
  document.getElementById('mobileMenu').classList.remove('open');
}
document.querySelectorAll('#mobileMenu a').forEach(link => link.addEventListener('click', closeMob));
window.closeMob = closeMob; // keep global reference for any other usage

// ---------- FAQ TOGGLE – replaces inline onclick ----------
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}
document.querySelectorAll('.faq-trigger').forEach(btn => btn.addEventListener('click', function() {
  toggleFaq(this);
}));
window.toggleFaq = toggleFaq; // keep global reference

// ---------- SCROLL REVEAL ----------
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
document.querySelectorAll('.fi').forEach(el => obs.observe(el));

// ---------- TRAVEL COLLAGE ANIMATION ----------
(function() {
  const co = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('anim-in'); co.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.photo-slot').forEach(s => co.observe(s));
})();

// ---------- PAGINATED CAROUSEL FACTORY ----------
function makeCarousel(opts) {
  let page = 0, busy = false;
  const { pairEl, prevBtn, nextBtn, pipsEl, counterEl, pages, buildCards, syncExtra, stageEl, swipePair } = opts;

  function syncUI(p) {
    prevBtn.disabled = p === 0;
    nextBtn.disabled = p === pages - 1;
    pipsEl.querySelectorAll('[data-pip]').forEach((el, i) => el.classList.toggle('active', i === p));
    if (syncExtra) syncExtra(p);
  }
  function goTo(np, dir) {
    if (busy || np === page || np < 0 || np >= pages) return;
    busy = true;
    const outX = dir === 'next' ? '-40px' : '40px', inX = dir === 'next' ? '40px' : '-40px';
    pairEl.style.cssText = 'transition:opacity .26s ease,transform .26s ease;opacity:0;transform:translateX(' + outX + ')';
    setTimeout(() => {
      page = np;
      pairEl.innerHTML = buildCards(page);
      syncUI(page);
      pairEl.style.cssText = 'transition:none;opacity:0;transform:translateX(' + inX + ')';
      void pairEl.offsetWidth;
      pairEl.style.cssText = 'transition:opacity .3s ease,transform .3s ease;opacity:1;transform:translateX(0)';
      setTimeout(() => { pairEl.style.cssText = ''; busy = false; }, 320);
    }, 240);
  }
  for (let i = 0; i < pages; i++) {
    const pip = document.createElement('div');
    pip.setAttribute('data-pip', i);
    pip.className = opts.pipClass + (i === 0 ? ' active' : '');
    pip.addEventListener('click', () => { if (!busy) goTo(i, i > page ? 'next' : 'prev'); });
    pipsEl.appendChild(pip);
  }
  prevBtn.addEventListener('click', () => { if (!busy) goTo(page - 1, 'prev'); });
  nextBtn.addEventListener('click', () => { if (!busy) goTo(page + 1, 'next'); });

  const swipeTarget = swipePair || stageEl;
  if (swipeTarget) {
    let tx = 0, ty = 0, sw = false;
    swipeTarget.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; sw = false; }, { passive: true });
    swipeTarget.addEventListener('touchmove', e => { if (!sw) { let dx = Math.abs(e.touches[0].clientX - tx), dy = Math.abs(e.touches[0].clientY - ty); if (dx > 8 || dy > 8) sw = dx > dy; } }, { passive: true });
    swipeTarget.addEventListener('touchend', e => { if (!sw) return; let dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 44) dx < 0 ? goTo(page + 1, 'next') : goTo(page - 1, 'prev'); }, { passive: true });
  }

  pairEl.innerHTML = buildCards(0);
  syncUI(0);
}

// ---------- 18 FACTS WIDGET (UPDATED FACTS) ----------
(function() {
  const FACTS = [
    "She loves flowers over chocolates any day.",
    "She’s always loved New York City and anything Disney",
    "She never travels without her digicam—it’s how she keeps memories",
    "She loves planning events… clearly 👀",
    "Certified Best Crammer—award-winning, actually",
    "She genuinely enjoys planning events, big or small",
    "She’s a certified crammer—and somehow makes it work (even won it at the Graduation Ball)",
    "She’s naturally outgoing and enjoys being around people",
    "She’s deeply sentimental, even about the little things.",
    "Shopping is her love language (and her coping mechanism)",
    "She has always wanted to see the aurora borealis at least once in her life",
    "She loves going to the beach, but somehow always ends up hating the sand",
    "The “therapist” of the group—always giving advice, whether it’s about relationships or life in general",
    "Carries an “IDGAF” personality on the outside, but cares more than she lets on",
    "Naturally funny in her own way, often without trying",
    "Severely honest—she’ll tell you the truth, even if it’s not what you want to hear",
    "Ride or die for the people she genuinely loves and trusts",
    "Ambitious, and always thinking about what’s next"
  ];
  const ACCENTS = ['accent-lavender', 'accent-blue', 'accent-rose', 'accent-peach'];

  function buildCards(p) {
    return [0, 1].map(o => {
      const i = p * 2 + o, n = i + 1, a = ACCENTS[i % 4];
      return `<div class="fact-card ${a}"><div class="watermark" aria-hidden="true">${n}</div><div class="card-badge"><div class="badge-dot"></div><span class="badge-label">${String(n).padStart(2,'0')}</span></div><p class="card-text">${FACTS[i]}</p></div>`;
    }).join('');
  }

  makeCarousel({
    pairEl: document.getElementById('factsCardPair'),
    prevBtn: document.getElementById('factsPrevBtn'),
    nextBtn: document.getElementById('factsNextBtn'),
    pipsEl: document.getElementById('factsPips'),
    counterEl: document.getElementById('factsCounter'),
    stageEl: document.getElementById('factsStage'),
    pages: 9,
    pipClass: 'pip',
    buildCards,
    syncExtra: p => {
      document.getElementById('factsCounter').innerHTML = `Fact <strong>${p*2+1}</strong> &amp; <strong>${p*2+2}</strong> of 18`;
    }
  });
})();

// ---------- CUSTOM SELECT DROPDOWN ----------
(function initCustomSelect() {
  const w = document.getElementById('attendingWrapper');
  const t = document.getElementById('attendingTrigger');
  const d = document.getElementById('attendingDisplay');
  const hi = document.getElementById('attendingValue');
  if (!w) return;
  const open = () => w.classList.add('open');
  const close = () => w.classList.remove('open');
  t.addEventListener('click', e => { e.stopPropagation(); w.classList.contains('open') ? close() : open(); });
  t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); w.classList.contains('open') ? close() : open(); } if (e.key === 'Escape') { close(); t.blur(); } });
  w.querySelectorAll('.cs-opt:not(.cs-opt-disabled)').forEach(o => {
    o.addEventListener('click', e => {
      e.stopPropagation();
      d.textContent = o.textContent;
      hi.value = o.dataset.value;
      t.classList.remove('placeholder');
      w.querySelectorAll('.cs-opt').forEach(x => x.classList.remove('cs-selected'));
      o.classList.add('cs-selected');
      close();
    });
  });
  document.addEventListener('click', e => { if (!w.contains(e.target)) close(); });
})();

// ========== RSVP & GUESTBOOK WITH SUPABASE ==========

// RSVP SUBMISSION
// RSVP SUBMISSION (updated)
// RSVP SUBMISSION (with validation)
document.querySelector('#rsvp .btn-rose').addEventListener('click', async () => {
  const client = await initSupabase();
  if (!client) {
    showToast(document.querySelector('#rsvp .btn-rose'), 'Connection issue. Please try again.');
    return;
  }

  const fullNameInput = document.querySelector('#rsvp input[placeholder="Your full name"]');
  const emailInput = document.querySelector('#rsvp input[placeholder="your@email.com"]');
  const phoneInput = document.querySelector('#rsvp input[placeholder="+63 900 000 0000"]');
  const full_name = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const contact_number = phoneInput.value.trim();
  const attending = document.getElementById('attendingValue').value;

  // --- Validation ---
  if (!full_name) {
    showToast(document.querySelector('#rsvp .btn-rose'), 'Please fill in your full name.');
    return;
  }
  if (!email) {
    showToast(document.querySelector('#rsvp .btn-rose'), 'Please fill in your email address.');
    return;
  }
  // Simple email check
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showToast(document.querySelector('#rsvp .btn-rose'), 'Please enter a valid email address.');
    return;
  }
  // Phone: optional, but if given, must be valid
  if (contact_number) {
    // Accept +63 or 0 followed by 10 digits (Philippine mobile)
    const phonePattern = /^(?:\+63|0)\d{10}$/;
    if (!phonePattern.test(contact_number.replace(/\s/g, ''))) {
      showToast(document.querySelector('#rsvp .btn-rose'), 'Please enter a valid contact number (e.g., +639XXXXXXXXX).');
      return;
    }
  }
  if (!attending) {
    showToast(document.querySelector('#rsvp .btn-rose'), 'Please select your attendance.');
    return;
  }
  // --- End validation ---

  const { error } = await client.from('rsvp').insert([{ full_name, email, contact_number, attending }]);
  if (error) {
    showToast(document.querySelector('#rsvp .btn-rose'), 'Oops! Could not submit RSVP.');
  } else {
    // Clear form
    fullNameInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
    document.getElementById('attendingDisplay').textContent = 'Select your response…';
    document.getElementById('attendingValue').value = '';
    document.getElementById('attendingTrigger').classList.add('placeholder');
    // Success toast
    showToast(document.querySelector('#rsvp .btn-rose'), '✨ RSVP sent');
  }
});
// ---------- GUESTBOOK WITH SMOOTH CAROUSEL ANIMATION ----------
let guestbookObserved = false;

async function loadMessages() {
  const client = await initSupabase();
  if (!client) return;
  const { data, error } = await client.from('messages').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error loading messages:', error);
    messagesData = [];
  } else {
    messagesData = data || [];
  }
  totalMsgPages = Math.max(1, Math.ceil(messagesData.length / 2));
  currentMsgPage = Math.min(currentMsgPage, totalMsgPages - 1);
  renderGuestbookPage(false);
  updateGuestbookPagination();
}

function renderGuestbookPage(animate = false, direction = 'next') {
  const pairEl = document.getElementById('gbCardPair');
  if (!pairEl) return;
  const start = currentMsgPage * 2;
  const pageMessages = messagesData.slice(start, start + 2);
  
  let html;
  if (pageMessages.length === 0) {
    html = '<div class="entry-card ec-lavender"><div class="entry-qmark">✨</div><p>Be the first to leave a message!</p></div>';
    pairEl.classList.add('single-card');
  } else {
    pairEl.classList.toggle('single-card', pageMessages.length === 1);
    html = pageMessages.map((msg, idx) => {
      const accent = accentClasses[(start + idx) % accentClasses.length];
      return `<div class="entry-card ${accent}"><div class="entry-qmark">"</div><p>${escapeHtml(msg.message)}</p><div class="entry-author">${escapeHtml(msg.name_relation)}</div></div>`;
    }).join('');
  }

  if (!animate) {
    pairEl.innerHTML = html;
    return;
  }

  const outX = direction === 'next' ? '-40px' : '40px';
  const inX = direction === 'next' ? '40px' : '-40px';
  pairEl.style.cssText = 'transition: opacity 0.26s ease, transform 0.26s ease; opacity: 0; transform: translateX(' + outX + ');';
  
  setTimeout(() => {
    pairEl.innerHTML = html;
    pairEl.style.cssText = 'transition: none; opacity: 0; transform: translateX(' + inX + ');';
    void pairEl.offsetWidth;
    pairEl.style.cssText = 'transition: opacity 0.3s ease, transform 0.3s ease; opacity: 1; transform: translateX(0);';
    setTimeout(() => {
      pairEl.style.cssText = '';
    }, 320);
  }, 240);
}

function updateGuestbookPagination() {
  const prevBtn = document.getElementById('gbPrevBtn');
  const nextBtn = document.getElementById('gbNextBtn');
  const pipsEl = document.getElementById('gbPips');
  const counterEl = document.getElementById('gbCounter');
  if (!prevBtn) return;

  prevBtn.disabled = currentMsgPage === 0;
  nextBtn.disabled = currentMsgPage === totalMsgPages - 1;

  pipsEl.innerHTML = '';
  for (let i = 0; i < totalMsgPages; i++) {
    const pip = document.createElement('div');
    pip.className = `gb-pip ${i === currentMsgPage ? 'active' : ''}`;
    pip.addEventListener('click', () => {
      if (!gbBusy && i !== currentMsgPage) {
        goToGuestbookPage(i, i > currentMsgPage ? 'next' : 'prev');
      }
    });
    pipsEl.appendChild(pip);
  }

  const start = currentMsgPage * 2 + 1;
  const end = Math.min((currentMsgPage + 1) * 2, messagesData.length);
  if (messagesData.length === 0) {
    counterEl.innerHTML = `Message <strong>0</strong> of <strong>0</strong>`;
  } else {
    counterEl.innerHTML = `Message <strong>${start}</strong>${start !== end ? '–<strong>' + end + '</strong>' : ''} of <strong>${messagesData.length}</strong>`;
  }
}

function goToGuestbookPage(newPage, direction) {
  if (gbBusy || newPage === currentMsgPage || newPage < 0 || newPage >= totalMsgPages) return;
  gbBusy = true;
  currentMsgPage = newPage;
  renderGuestbookPage(true, direction);
  updateGuestbookPagination();
  setTimeout(() => { gbBusy = false; }, 600);
}

// Guestbook navigation buttons
document.getElementById('gbPrevBtn')?.addEventListener('click', () => {
  if (!gbBusy && currentMsgPage > 0) goToGuestbookPage(currentMsgPage - 1, 'prev');
});
document.getElementById('gbNextBtn')?.addEventListener('click', () => {
  if (!gbBusy && currentMsgPage < totalMsgPages - 1) goToGuestbookPage(currentMsgPage + 1, 'next');
});

// Swipe support on guestbook cards
const gbStage = document.querySelector('.gb-card-stage');
if (gbStage) {
  let touchStartX = 0, touchStartY = 0, swiping = false;
  gbStage.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    swiping = false;
  }, { passive: true });
  gbStage.addEventListener('touchmove', e => {
    if (!swiping) {
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      if (dx > 8 || dy > 8) swiping = dx > dy;
    }
  }, { passive: true });
  gbStage.addEventListener('touchend', e => {
    if (!swiping) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 44) {
      if (dx < 0 && currentMsgPage < totalMsgPages - 1) goToGuestbookPage(currentMsgPage + 1, 'next');
      else if (dx > 0 && currentMsgPage > 0) goToGuestbookPage(currentMsgPage - 1, 'prev');
    }
  }, { passive: true });
}

// Character counter
const gbMessage = document.getElementById('gbMessage');
const charCount = document.getElementById('charCount');
if (gbMessage && charCount) {
  gbMessage.addEventListener('input', () => {
    const remaining = 300 - gbMessage.value.length;
    charCount.textContent = remaining;
    charCount.style.color = remaining < 20 ? 'var(--rose)' : 'var(--dusty-blue-mid)';
  });
}

// Guestbook message submission
// Guestbook message submission (updated)
document.querySelector('#guestbook .btn-rose').addEventListener('click', async () => {
  const client = await initSupabase();
  if (!client) {
    showToast(document.querySelector('#guestbook .btn-rose'), 'Connection issue. Try again.');
    return;
  }
  const form = document.querySelector('#guestbook .gb-form');
  const name_relation = form.querySelector('input').value.trim();
  const messageField = form.querySelector('textarea');
  const message = messageField.value.trim();
  if (!name_relation || !message) {
    showToast(document.querySelector('#guestbook .btn-rose'), 'Please fill in both fields.');
    return;
  }
  if (message.length > 300) {
    showToast(document.querySelector('#guestbook .btn-rose'), 'Message must be 300 characters or fewer.');
    return;
  }
  const { error } = await client.from('messages').insert([{ name_relation, message }]);
  if (error) {
    showToast(document.querySelector('#guestbook .btn-rose'), 'Could not save your message.');
  } else {
    form.querySelector('input').value = '';
    messageField.value = '';
    document.getElementById('charCount').textContent = '300';
    document.getElementById('charCount').style.color = 'var(--dusty-blue-mid)';
    // ── Show toast ──
    showToast(document.querySelector('#guestbook .btn-rose'), 'Message saved');
    // Reload messages and go to page 0
    await loadMessages();
    if (totalMsgPages > 0) {
      gbBusy = false;
      currentMsgPage = 0;
      renderGuestbookPage(false);
      updateGuestbookPagination();
    }
  }
});

// Lazy-load guestbook when section enters viewport
const guestbookSection = document.getElementById('guestbook');
if (guestbookSection) {
  const gbObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !guestbookObserved) {
      guestbookObserved = true;
      loadMessages();
      gbObserver.disconnect();
    }
  }, { threshold: 0.1 });
  gbObserver.observe(guestbookSection);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ---------- LIGHTBOX FACTORY ----------
function makeLightbox(lbId, closeId, prevId, nextId, items, getSrc) {
  const lb = document.getElementById(lbId),
    img = lb.querySelector('img'),
    counter = lb.querySelector('.lightbox-counter');
  let idx = 0, touchStart = 0;

  function update(i) { idx = Math.max(0, Math.min(items.length - 1, i)); img.src = getSrc(items[idx]); counter.textContent = `${idx + 1} / ${items.length}`; }
  function open(i) { update(i); lb.classList.add('active'); document.body.style.overflow = 'hidden'; }
  function close() { lb.classList.remove('active'); document.body.style.overflow = ''; }

  items.forEach((item, i) => item.addEventListener('click', e => { e.stopPropagation(); open(i); }));
  document.getElementById(closeId).addEventListener('click', close);
  document.getElementById(prevId).addEventListener('click', () => update(idx - 1));
  document.getElementById(nextId).addEventListener('click', () => update(idx + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  lb.addEventListener('touchstart', e => { touchStart = e.changedTouches[0].screenX; });
  lb.addEventListener('touchend', e => {
    if (!lb.classList.contains('active')) return;
    let d = e.changedTouches[0].screenX - touchStart;
    if (Math.abs(d) > 50) update(d > 0 ? idx - 1 : idx + 1);
  });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') update(idx + 1);
    if (e.key === 'ArrowLeft') update(idx - 1);
  });
}

// Lightbox for Years
makeLightbox('yearLightbox', 'lbClose', 'lbPrev', 'lbNext',
  Array.from(document.querySelectorAll('.year-item')),
  item => item.querySelector('img').src
);
// Lightbox for Travel
makeLightbox('travelLightbox', 'travelLbClose', 'travelLbPrev', 'travelLbNext',
  Array.from(document.querySelectorAll('.photo-slot')),
  item => item.querySelector('img').src
);
// Lightbox for Gallery
makeLightbox('galleryLightbox', 'galleryLbClose', 'galleryLbPrev', 'galleryLbNext',
  Array.from(document.querySelectorAll('.gallery-slide')),
  item => item.querySelector('img')?.src || item.querySelector('img')?.getAttribute('data-src')
);
// Lightbox for Memories
makeLightbox('memoriesLightbox', 'memoriesLbClose', 'memoriesLbPrev', 'memoriesLbNext',
  Array.from(document.querySelectorAll('.polaroid')),
  item => item.querySelector('img').src
);

// ---------- DYNAMIC GALLERY with lazy image loading ----------
(function () {
  const stage = document.getElementById('galleryStage');
  const pipsEl = document.getElementById('galleryPips');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  const counterEl = document.getElementById('galleryCounter');

  const slides = Array.from(stage.querySelectorAll('.gallery-slide'));
  const TOTAL = slides.length;
  if (TOTAL === 0) {
    document.getElementById('gallery').style.display = 'none';
    return;
  }
  if (TOTAL === 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }

  const firstImg = slides[0].querySelector('img');
  if (firstImg && firstImg.getAttribute('data-src')) {
    firstImg.src = firstImg.getAttribute('data-src');
    firstImg.removeAttribute('data-src');
  }

  let current = 0, busy = false;

  for (let i = 0; i < TOTAL; i++) {
    const pip = document.createElement('button');
    pip.className = 'gallery-pip' + (i === 0 ? ' active' : '');
    pip.setAttribute('aria-label', 'Go to photo ' + (i + 1));
    pip.addEventListener('click', () => { if (!busy) go(i); });
    pipsEl.appendChild(pip);
  }

  counterEl.textContent = '01 / ' + String(TOTAL).padStart(2, '0');

  function go(index, dir) {
    if (busy || index === current) return;
    const prev = current;
    current = ((index % TOTAL) + TOTAL) % TOTAL;
    dir = dir || (index > prev ? 'next' : 'prev');

    const newImg = slides[current].querySelector('img');
    if (newImg && newImg.getAttribute('data-src')) {
      newImg.src = newImg.getAttribute('data-src');
      newImg.removeAttribute('data-src');
    }

    slides[prev].classList.remove('active');
    slides[prev].classList.add(dir === 'next' ? 'exit-right' : 'exit-left');
    slides[current].classList.add('active');

    Array.from(pipsEl.children).forEach((p, i) => p.classList.toggle('active', i === current));
    counterEl.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(TOTAL).padStart(2, '0');

    busy = true;
    setTimeout(() => {
      slides[prev].classList.remove('exit-right', 'exit-left');
      busy = false;
    }, 650);
  }

  prevBtn.addEventListener('click', () => { if (!busy) go(current - 1, 'prev'); });
  nextBtn.addEventListener('click', () => { if (!busy) go(current + 1, 'next'); });

  let sx = 0, sy = 0, sd = false, sh = false;
  stage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; sd = sh = false; }, { passive: true });
  stage.addEventListener('touchmove', e => {
    if (!sd) {
      const dx = Math.abs(e.touches[0].clientX - sx), dy = Math.abs(e.touches[0].clientY - sy);
      if (dx > 8 || dy > 8) { sd = true; sh = dx >= dy; }
    }
  }, { passive: true });
  stage.addEventListener('touchend', e => {
    if (!sd || !sh) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 44) dx < 0 ? go(current + 1, 'next') : go(current - 1, 'prev');
  }, { passive: true });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1, 'next'); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(current - 1, 'prev'); }
  });
})();

// ---------- DYNAMIC MEMORIES POLAROID GALLERY (throttled drag) ----------
(function () {
  const viewport = document.getElementById('polViewport');
  const track = document.getElementById('polTrack');
  const prevBtn = document.getElementById('polPrev');
  const nextBtn = document.getElementById('polNext');
  const pipsEl = document.getElementById('polPips');

  const cards = Array.from(track.querySelectorAll('.polaroid'));
  if (cards.length === 0) {
    if (document.querySelector('.memories-section')) document.querySelector('.memories-section').style.display = 'none';
    return;
  }

  let page = 0, cardW = 0, gap = 0, visibleCount = 0, maxPage = 0;
  let dragActive = false, dragStartX = 0, dragCurrentX = 0;
  let animationFrame = null;

  function measure() {
    gap = parseFloat(getComputedStyle(track).gap) || 28;
    cardW = cards[0] ? cards[0].offsetWidth : 200;
    visibleCount = Math.max(1, Math.floor((viewport.offsetWidth + gap) / (cardW + gap)));
    maxPage = Math.max(0, cards.length - visibleCount);
    page = Math.min(page, maxPage);
    buildPips();
    renderPage(false);
  }

  function buildPips() {
    pipsEl.innerHTML = '';
    if (maxPage === 0) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      return;
    }
    prevBtn.style.display = '';
    nextBtn.style.display = '';
    for (let i = 0; i <= maxPage; i++) {
      const pip = document.createElement('button');
      pip.className = 'pol-pip' + (i === page ? ' active' : '');
      pip.setAttribute('aria-label', 'Go to memory set ' + (i + 1));
      pip.addEventListener('click', () => go(i));
      pipsEl.appendChild(pip);
    }
  }

  function renderPage(animate) {
    let offset = page * (cardW + gap);
    if (page === maxPage) {
      const padL = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      offset = Math.max(0, padL + cards.length * (cardW + gap) - gap + padL - viewport.offsetWidth);
    }
    track.style.transition = animate ? '' : 'none';
    track.style.transform = `translateX(-${offset}px)`;
    if (!animate) void track.offsetWidth;
    prevBtn.disabled = page <= 0;
    nextBtn.disabled = page >= maxPage;
    pipsEl.querySelectorAll('.pol-pip').forEach((p, i) => p.classList.toggle('active', i === page));
  }

  function go(p) {
    page = Math.max(0, Math.min(maxPage, p));
    renderPage(true);
  }

  prevBtn.addEventListener('click', () => go(page - 1));
  nextBtn.addEventListener('click', () => go(page + 1));

  let tx = 0, ty = 0, sd = false, sh = false, drag = false;
  viewport.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; sd = sh = drag = false; }, { passive: true });
  viewport.addEventListener('touchmove', e => {
    if (!sd) {
      const dx = Math.abs(e.touches[0].clientX - tx), dy = Math.abs(e.touches[0].clientY - ty);
      if (dx > 6 || dy > 6) { sd = true; sh = dx >= dy; drag = true; }
    }
    if (sh && drag) e.preventDefault();
  }, { passive: false });
  viewport.addEventListener('touchend', e => {
    if (!sd || !sh) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) go(dx < 0 ? page + 1 : page - 1);
    drag = false;
  }, { passive: true });

  let mouseDown = false, mouseStartX = 0;
  function onMouseMove(e) {
    if (!mouseDown) return;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(() => {
      const dx = e.clientX - mouseStartX;
      if (Math.abs(dx) > 40) {
        go(dx < 0 ? page + 1 : page - 1);
        mouseDown = false;
        viewport.style.cursor = 'grab';
        window.removeEventListener('mousemove', onMouseMove);
      }
    });
  }
  viewport.addEventListener('mousedown', e => {
    mouseDown = true;
    mouseStartX = e.clientX;
    viewport.style.cursor = 'grabbing';
    window.addEventListener('mousemove', onMouseMove);
  });
  window.addEventListener('mouseup', () => {
    if (mouseDown) {
      mouseDown = false;
      viewport.style.cursor = 'grab';
      window.removeEventListener('mousemove', onMouseMove);
    }
  });

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(measure, 120); });
  measure();
})();