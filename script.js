// ===== HERO PHOTO COLLAGE (left & right wings only) =====
window.addEventListener('load', function () {
  const photos = [
    'Pictures/013A0202.JPG',
    'Pictures/013A0205.JPG',
    'Pictures/013A0208.JPG',
    'Pictures/013A0259.JPG',
    'Pictures/013A0389.JPG',
    'Pictures/013A0391.JPG',
    'Pictures/013A0473.JPG',
  ];

  const container = document.getElementById('photo-collage');
  const heroW = container.offsetWidth  || window.innerWidth;
  const heroH = container.offsetHeight || window.innerHeight;

  // Deterministic so positions are stable on each load
  function sr(seed) {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
  }

  const isMobile = window.innerWidth <= 600;

  if (isMobile) {
    // Mobile: show 4 small photos peeking at corners — 2 top, 2 bottom
    const corners = [
      { top: -20,          left: -30,          rot: 15,  w: 130, photo: 0 },
      { top: -20,          left: heroW - 100,  rot: -12, w: 120, photo: 2 },
      { top: heroH - 100,  left: -25,          rot: -10, w: 125, photo: 4 },
      { top: heroH - 90,   left: heroW - 110,  rot: 14,  w: 130, photo: 6 % photos.length },
    ];
    corners.forEach(({ top, left, rot, w, photo }) => {
      const img = document.createElement('img');
      img.src   = photos[photo];
      const h   = w * 1.3;
      img.style.cssText = `width:${w}px;height:${h}px;top:${top}px;left:${left}px;transform:rotate(${rot}deg);opacity:0.85;`;
      container.appendChild(img);
    });
    return;
  }

  // Desktop: full left/right wings
  const perSide = 10;
  const wingW   = heroW * 0.32;

  for (let side = 0; side < 2; side++) {
    for (let j = 0; j < perSide; j++) {
      const i   = side * perSide + j;
      const img = document.createElement('img');
      img.src   = photos[i % photos.length];
      img.loading = 'lazy';

      const w   = 220 + sr(i * 7)  * 200;
      const h   = w   * (0.68 + sr(i * 11) * 0.55);
      const rot = (sr(i * 3) - 0.5) * 28;
      const op  = 0.75 + sr(i * 5) * 0.25;

      const topBand   = (j / perSide) * (heroH + h * 0.4) - h * 0.2;
      const topJitter = (sr(i * 17) - 0.5) * heroH * 0.1;
      const top       = topBand + topJitter;

      let left;
      if (side === 0) {
        left = -w * 0.4 + sr(i * 13) * (wingW - w * 0.2);
      } else {
        left = heroW * 0.68 + sr(i * 13) * (wingW - w * 0.2);
      }

      img.style.cssText = `width:${w}px;height:${h}px;top:${top}px;left:${left}px;transform:rotate(${rot}deg);opacity:${op};`;
      container.appendChild(img);
    }
  }
});


// ===== FALLING PETALS =====
(function initPetals() {
  const canvas = document.getElementById('petals');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#F5C842', '#E07B00', '#FF9A3C', '#FDE79A', '#FFB347', '#E8954E'];

  const petals = Array.from({ length: 35 }, () => ({
    x:        Math.random() * window.innerWidth,
    y:        Math.random() * -window.innerHeight,
    size:     3 + Math.random() * 7,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.04,
    speedX:   (Math.random() - 0.5) * 1.2,
    speedY:   0.7 + Math.random() * 1.3,
    swing:    Math.random() * Math.PI * 2,
    swingSpd: 0.015 + Math.random() * 0.02,
    color:    COLORS[Math.floor(Math.random() * COLORS.length)],
    opacity:  0.3 + Math.random() * 0.45,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      p.swing    += p.swingSpd;
      p.x        += p.speedX + Math.sin(p.swing) * 0.6;
      p.y        += p.speedY;
      p.rotation += p.rotSpeed;

      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();


// ===== COUNTDOWN TIMER =====
(function initCountdown() {
  const target = new Date('2026-12-02T12:00:00');

  function update() {
    const diff = target - new Date();
    if (diff <= 0) {
      document.getElementById('countdown').innerHTML =
        '<span style="font-family:Cormorant Garamond,serif;font-style:italic;color:var(--gold);font-size:1.4rem">We are married! ✦</span>';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);

    document.getElementById('cd-days').textContent    = String(d).padStart(2, '0');
    document.getElementById('cd-hours').textContent   = String(h).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(m).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(s).padStart(2, '0');
  }
  update();
  setInterval(update, 1000);
})();


// ===== GSAP SCROLL ANIMATIONS =====
gsap.registerPlugin(ScrollTrigger);

// Hero entrance sequence
gsap.timeline({ delay: 0.5 })
  .to('.hero-sub',       { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' })
  .to('.hero-names',     { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out' }, '-=0.5')
  .to('.hero-invite',    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
  .to('.countdown',      { opacity: 1,        duration: 0.8, ease: 'power2.out' }, '-=0.3')
  .to('.scratch-wrapper',{ opacity: 1, y: 0,  duration: 0.7, ease: 'power2.out' }, '-=0.4')
  .to('.cta-btn',        { opacity: 1,         duration: 0.6 }, '-=0.2');

// Wedding section cards
gsap.to('.wedding-main-card', {
  opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
  scrollTrigger: { trigger: '#wedding', start: 'top 75%' }
});
gsap.to('.rituals-column', {
  opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: 'power2.out',
  scrollTrigger: { trigger: '#wedding', start: 'top 75%' }
});

// Story text
gsap.to('.story-text', {
  opacity: 1, y: 0, duration: 1, ease: 'power2.out',
  scrollTrigger: { trigger: '.story-text', start: 'top 80%' }
});
gsap.to('.story-line', {
  width: '60px', duration: 1.5, ease: 'power2.out',
  scrollTrigger: { trigger: '.story-line', start: 'top 85%' }
});

// Venue layout
gsap.to('.venue-details', {
  opacity: 1, x: 0, duration: 0.9, ease: 'power2.out',
  scrollTrigger: { trigger: '.venue-layout', start: 'top 80%' }
});
gsap.to('.venue-map-wrap', {
  opacity: 1, x: 0, duration: 0.9, delay: 0.15, ease: 'power2.out',
  scrollTrigger: { trigger: '.venue-layout', start: 'top 80%' }
});

// RSVP form
gsap.to('.rsvp-form', {
  opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
  scrollTrigger: { trigger: '.rsvp-form', start: 'top 80%' }
});


// ===== SCRATCH CARD =====
const scratchCanvas = document.getElementById('scratchCard');
const sCtx = scratchCanvas.getContext('2d');
let isScratching = false;

function drawGoldFoil() {
  const grad = sCtx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
  grad.addColorStop(0,   '#B8860B');
  grad.addColorStop(0.3, '#DAA520');
  grad.addColorStop(0.6, '#F5D060');
  grad.addColorStop(1,   '#C9A84C');
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

  sCtx.strokeStyle = 'rgba(255,255,255,0.12)';
  sCtx.lineWidth = 0.5;
  for (let x = 0; x < scratchCanvas.width; x += 7) {
    sCtx.beginPath(); sCtx.moveTo(x, 0); sCtx.lineTo(x, scratchCanvas.height); sCtx.stroke();
  }
  for (let y = 0; y < scratchCanvas.height; y += 7) {
    sCtx.beginPath(); sCtx.moveTo(0, y); sCtx.lineTo(scratchCanvas.width, y); sCtx.stroke();
  }
  sCtx.fillStyle = 'rgba(100,20,20,0.6)';
  sCtx.font = '600 12px Montserrat, sans-serif';
  sCtx.textAlign = 'center'; sCtx.textBaseline = 'middle';
  sCtx.fillText('✦  Scratch Here  ✦', scratchCanvas.width / 2, scratchCanvas.height / 2);
}
drawGoldFoil();

function getScratchXY(e) {
  const rect = scratchCanvas.getBoundingClientRect();
  const sx = scratchCanvas.width / rect.width, sy = scratchCanvas.height / rect.height;
  const src = e.touches ? e.touches[0] : e;
  return { x: (src.clientX - rect.left) * sx, y: (src.clientY - rect.top) * sy };
}

function scratch(e) {
  if (!isScratching) return;
  e.preventDefault();
  const { x, y } = getScratchXY(e);
  sCtx.globalCompositeOperation = 'destination-out';
  sCtx.beginPath();
  sCtx.arc(x, y, 38, 0, Math.PI * 2);
  sCtx.fill();
  checkReveal();
}

function checkReveal() {
  const data = sCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
  let cleared = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] === 0) cleared++;
  if (cleared / (scratchCanvas.width * scratchCanvas.height) > 0.35) {
    gsap.to(scratchCanvas, {
      opacity: 0, duration: 0.6, ease: 'power2.inOut',
      onComplete: () => { scratchCanvas.style.pointerEvents = 'none'; }
    });
  }
}

scratchCanvas.addEventListener('mousedown',  () => { isScratching = true; });
scratchCanvas.addEventListener('mousemove',  scratch);
scratchCanvas.addEventListener('mouseup',    () => { isScratching = false; });
scratchCanvas.addEventListener('mouseleave', () => { isScratching = false; });
scratchCanvas.addEventListener('touchstart', (e) => { isScratching = true; e.preventDefault(); }, { passive: false });
scratchCanvas.addEventListener('touchmove',  scratch, { passive: false });
scratchCanvas.addEventListener('touchend',   () => { isScratching = false; });


// ===== PHOTO STRIPS =====
document.querySelectorAll('.photo-strip').forEach(strip => {
  const cards = strip.querySelectorAll('.photo-card');
  cards.forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      duration: 0.7,
      delay: i * 0.1,
      ease: 'power2.out',
      scrollTrigger: { trigger: strip, start: 'top 85%' }
    });
  });
});


// ===== MANTRAS TYPEWRITER =====
function typewriterOnScroll(el) {
  const text = el.dataset.typewriter || '';
  let done = false;

  ScrollTrigger.create({
    trigger: el,
    start: 'top 80%',
    onEnter: () => {
      if (done) return;
      done = true;
      el.textContent = '';
      let i = 0;
      const timer = setInterval(() => {
        el.textContent += text[i++];
        if (i >= text.length) {
          clearInterval(timer);
          el.classList.add('done');
        }
      }, 55);
    }
  });
}

document.querySelectorAll('.mantra-sanskrit[data-typewriter]').forEach(typewriterOnScroll);

// Mantra items stagger in
gsap.utils.toArray('.mantra-item').forEach((item, i) => {
  gsap.to(item, {
    opacity: 1, y: 0, duration: 0.9, delay: i * 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '#mantras', start: 'top 70%' }
  });
});


// ===== PHOTO WALL (bottom) =====
(function buildPhotoWall() {
  const photos = [
    'Pictures/013A0202.JPG',
    'Pictures/013A0205.JPG',
    'Pictures/013A0208.JPG',
    'Pictures/013A0259.JPG',
    'Pictures/013A0389.JPG',
    'Pictures/013A0391.JPG',
    'Pictures/013A0473.JPG',
  ];

  const grid = document.getElementById('photowall-grid');
  if (!grid) return;

  function sr(seed) {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
  }

  const isMobile = window.innerWidth <= 600;

  if (isMobile) {
    // Mobile: 2-column flex grid, no absolute positioning
    Object.assign(grid.style, {
      display: 'flex', flexWrap: 'wrap', gap: '10px',
      height: 'auto', padding: '0 1rem', justifyContent: 'center',
    });
    photos.forEach((src, i) => {
      const img  = document.createElement('img');
      img.src    = src;
      const rot  = (sr(i * 3) - 0.5) * 10;
      img.style.cssText = `
        width:calc(50% - 5px);height:160px;
        object-fit:cover;border-radius:4px;
        transform:rotate(${rot}deg);opacity:0;
        box-shadow:0 4px 16px rgba(0,0,0,0.5);
        flex-shrink:0;
      `;
      grid.appendChild(img);
      ScrollTrigger.create({
        trigger: grid, start: 'top 90%',
        onEnter: () => gsap.to(img, { opacity: 1, duration: 0.5, delay: i * 0.08, ease: 'power2.out' })
      });
    });
    return;
  }

  // Desktop: scattered absolute layout
  const gridW = grid.offsetWidth || 1100;
  const gridH = 600;
  const cols  = [0, 1, 2, 3, 0, 1, 2];
  const rows  = [0, 0, 0, 0, 1, 1, 1];
  const colW  = gridW / 4;
  const rowH  = gridH / 2;

  photos.forEach((src, i) => {
    const img = document.createElement('img');
    img.src   = src;

    const w   = 240 + sr(i * 7)  * 100;
    const h   = w   * (0.72 + sr(i * 11) * 0.4);
    const rot = (sr(i * 3) - 0.5) * 20;
    const op  = 0.82 + sr(i * 5) * 0.18;

    const colX = cols[i] * colW + (colW - w) * 0.5 + (sr(i * 17) - 0.5) * 60;
    const rowY = rows[i] * rowH + (rowH - h) * 0.5 + (sr(i * 13) - 0.5) * 40;

    img.style.cssText = `
      width:${w}px;height:${h}px;
      left:${Math.max(0, colX)}px;top:${Math.max(0, rowY)}px;
      transform:rotate(${rot}deg);opacity:0;z-index:${i + 1};
    `;
    grid.appendChild(img);

    ScrollTrigger.create({
      trigger: grid, start: 'top 85%',
      onEnter: () => gsap.to(img, { opacity: op, duration: 0.7, delay: i * 0.1, ease: 'power2.out' })
    });
  });
})();


// ===== RSVP SUBMIT =====
// ⚙️  Replace these two values with your own contact details
const RSVP_WHATSAPP = '918426878666'; // your WhatsApp number with country code, no + or spaces
const RSVP_EMAIL    = 'rajatmittal2012@gmail.com';   // your email address

function handleRSVP(e) {
  e.preventDefault();
  const form      = e.target;
  const name      = (form['rsvp-name'].value     || '').trim();
  const mobile    = (form['rsvp-mobile'].value   || '').trim().replace(/\s/g, '');
  const email     = (form['rsvp-email'].value    || '').trim();
  const guests    = (form['rsvp-guests'].value   || '1').trim();
  const attending = (form['rsvp-attending'].value|| 'Not specified').trim();

  const attendIcon = attending.toLowerCase().includes('unable') ? '❌' : '✅';

  const msgBody =
    `🌸 *Rajat & Riya — Wedding RSVP* 🌸\n` +
    `━━━━━━━━━━━━━━━━━━\n\n` +
    `👤 *Name:* ${name}\n` +
    `${attendIcon} *Attending:* ${attending}\n` +
    `👥 *Guests:* ${guests}\n` +
    (mobile ? `📱 *Mobile:* ${mobile}\n` : ``) +
    (email  ? `📧 *Email:* ${email}\n`  : ``) +
    `\n━━━━━━━━━━━━━━━━━━\n` +
    `📅 *Date:* Wednesday, December 2, 2026\n` +
    `📍 *Venue:* Sandhu Palace, Dholpur\n\n` +
    `_Sent from the wedding website_ 💍`;

  // Decide channel: prefer WhatsApp if mobile provided, else email
  if (mobile) {
    window.open(
      `https://wa.me/${RSVP_WHATSAPP}?text=${encodeURIComponent(msgBody)}`,
      '_blank'
    );
  } else if (email) {
    window.location.href =
      `mailto:${RSVP_EMAIL}` +
      `?subject=${encodeURIComponent('RSVP – ' + name)}` +
      `&body=${encodeURIComponent(msgBody)}`;
  }

  // Animate form out and show thank-you
  gsap.to('.rsvp-form', {
    opacity: 0, y: -20, duration: 0.5,
    onComplete: () => {
      form.style.display = 'none';
      const thanks = document.getElementById('rsvp-thanks');
      thanks.classList.remove('hidden');
      gsap.from(thanks, { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' });
    }
  });
}
