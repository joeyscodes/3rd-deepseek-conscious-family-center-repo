/* ─── CINEMATIC CANVAS BACKGROUND ─── */
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let W, H, time = 0;
const nodes = [];
const COLORS = ['#1F6B3A','#4CAF50','#F4C542','#F28C28','#E94E77','#BE44AD','#3498DB'];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Generate floating leaf/orb nodes
function initNodes() {
  nodes.length = 0;
  const count = Math.min(70, Math.floor(W * H / 18000));
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 3 + Math.random() * 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: 0.1 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      leafAngle: Math.random() * Math.PI * 2,
      leafSpeed: (Math.random() - 0.5) * 0.01,
    });
  }
}
initNodes();
window.addEventListener('resize', initNodes);

function drawLeaf(x, y, r, angle, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.bezierCurveTo(r * 0.7, -r * 0.5, r * 0.7, r * 0.5, 0, r);
  ctx.bezierCurveTo(-r * 0.7, r * 0.5, -r * 0.7, -r * 0.5, 0, -r);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawBackground() {
  // Deep forest gradient
  const grad = ctx.createRadialGradient(W*0.3, H*0.4, 0, W*0.5, H*0.5, W*0.9);
  grad.addColorStop(0, '#1a4f28');
  grad.addColorStop(0.4, '#0f3d1c');
  grad.addColorStop(0.7, '#0a2e14');
  grad.addColorStop(1, '#061a0c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function drawWave(t) {
  // Animated aurora waves at the bottom
  for (let wave = 0; wave < 3; wave++) {
    ctx.beginPath();
    const waveOffset = wave * (Math.PI * 2 / 3);
    const amp = 60 + wave * 20;
    const baseY = H * (0.55 + wave * 0.14);
    ctx.moveTo(0, baseY);
    for (let x = 0; x <= W; x += 8) {
      const y = baseY + Math.sin((x / W) * Math.PI * 3 + t * 0.8 + waveOffset) * amp
                      + Math.sin((x / W) * Math.PI * 5 + t * 0.5 + waveOffset) * (amp * 0.4);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    const waveColors = [
      'rgba(31,107,58,0.22)',
      'rgba(76,175,80,0.14)',
      'rgba(244,197,66,0.07)',
    ];
    ctx.fillStyle = waveColors[wave];
    ctx.fill();
  }
}

function drawGlowOrbs(t) {
  const orbPositions = [
    { x: W * 0.15, y: H * 0.25, r: 120, color: 'rgba(76,175,80,0.07)' },
    { x: W * 0.8, y: H * 0.35, r: 150, color: 'rgba(244,197,66,0.05)' },
    { x: W * 0.5, y: H * 0.7, r: 180, color: 'rgba(31,107,58,0.08)' },
    { x: W * 0.9, y: H * 0.7, r: 100, color: 'rgba(190,68,173,0.04)' },
  ];
  orbPositions.forEach((o, i) => {
    const pulse = 1 + Math.sin(t * 0.6 + i * 1.3) * 0.15;
    const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * pulse);
    g.addColorStop(0, o.color);
    g.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r * pulse, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  });
}

function drawNodes(t) {
  nodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;
    n.leafAngle += n.leafSpeed;
    if (n.x < -20) n.x = W + 20;
    if (n.x > W + 20) n.x = -20;
    if (n.y < -20) n.y = H + 20;
    if (n.y > H + 20) n.y = -20;
    const pAlpha = n.alpha * (0.7 + 0.3 * Math.sin(t + n.phase));
    drawLeaf(n.x, n.y, n.r, n.leafAngle, n.color, pAlpha);
  });
}

function drawConnections() {
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
}

function animate() {
  time += 0.012;
  ctx.clearRect(0, 0, W, H);
  drawBackground();
  drawGlowOrbs(time);
  drawWave(time);
  drawConnections();
  drawNodes(time);
  requestAnimationFrame(animate);
}
animate();

/* ─── NAV SCROLL BEHAVIOUR ─── */
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

/* ─── SCROLL REVEAL ─── */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

/* ─── COUNTER ANIMATION ─── */
function animateCount(el, target, suffix) {
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + (suffix || '+');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + (suffix || '+');
  }
  requestAnimationFrame(update);
}
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.count);
      if (!isNaN(target)) animateCount(el, target, '+');
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

/* ─── FAQ TOGGLE ─── */
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-a.open').forEach(a => {
    a.classList.remove('open');
    a.previousElementSibling.classList.remove('open');
  });
  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('open');
  }
}

/* ─── FLOATING PARTICLES (DOM) ─── */
function spawnParticles() {
  const container = document.getElementById('particles');
  const colors = ['#4CAF50','#F4C542','#F28C28','#E94E77','#BE44AD','#3498DB'];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 3 + Math.random() * 6;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;
      bottom:-10px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${8+Math.random()*12}s;
      animation-delay:${Math.random()*8}s;
    `;
    container.appendChild(p);
  }
}
spawnParticles();
