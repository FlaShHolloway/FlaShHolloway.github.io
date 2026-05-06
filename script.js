// === Toast ===
let _toastTimer;
function showToast(msg, isErr) {
  const el = document.getElementById('toast');
  if (!el) return;
  clearTimeout(_toastTimer);
  el.textContent = msg;
  el.className = 'toast show' + (isErr ? ' err' : '');
  _toastTimer = setTimeout(() => { el.className = 'toast'; }, 3500);
}

// === Year ===
document.getElementById('yr').textContent = new Date().getFullYear();

// === Custom Cursor ===
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = -200, my = -200, rx = -200, ry = -200;
let raf;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animCursor() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();

document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

document.querySelectorAll('a,button,.filt,.pj,.sk-box,.ct-a,.stat,.res-it').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// === Particle Background ===
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function randomParticle() {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.2 + 0.3,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    alpha: Math.random() * 0.5 + 0.1,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.006 + Math.random() * 0.008,
  };
}

for (let i = 0; i < 130; i++) particles.push(randomParticle());

const ACCENT_R = 139, ACCENT_G = 124, ACCENT_B = 248;
const CYAN_R = 34, CYAN_G = 211, CYAN_B = 238;

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  const now = Date.now() * 0.001;

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.pulse += p.pulseSpeed;

    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;
    if (p.y < -10) p.y = H + 10;
    if (p.y > H + 10) p.y = -10;

    const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
    const t = (Math.sin(now * 0.3 + i) + 1) / 2;
    const r = Math.round(ACCENT_R + (CYAN_R - ACCENT_R) * t);
    const g = Math.round(ACCENT_G + (CYAN_G - ACCENT_G) * t);
    const b = Math.round(ACCENT_B + (CYAN_B - ACCENT_B) * t);

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
    ctx.fill();

    // subtle glow for larger particles
    if (p.r > 1.0) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.08})`;
      ctx.fill();
    }

    // draw lines to nearby particles
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 90) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - d / 90) * 0.06})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawParticles);
}
drawParticles();

// === Hamburger ===
const ham = document.getElementById('ham');
const mob = document.getElementById('mob');
ham.addEventListener('click', () => {
  mob.classList.toggle('open');
  ham.querySelector('i').className = mob.classList.contains('open') ? 'fas fa-xmark' : 'fas fa-bars';
});
function closeMob() {
  mob.classList.remove('open');
  ham.querySelector('i').className = 'fas fa-bars';
}

// === Scroll Reveal ===
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
  });
}, { threshold: 0.07 });
document.querySelectorAll('.rv').forEach(el => obs.observe(el));

// === Nav Active ===
const navAs = document.querySelectorAll('.nav-list a');
const secs = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (scrollY >= s.offsetTop - 90) cur = s.id; });
  navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
}, { passive: true });

// === Scroll Progress ===
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (total > 0 ? (scrollY / total) * 100 : 0) + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// === Back to Top ===
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', scrollY > 440);
}, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// === Ripple ===
function addRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  const r = document.createElement('span');
  r.className = 'ripple';
  r.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  btn.appendChild(r);
  setTimeout(() => r.remove(), 600);
}
document.querySelectorAll('.btn-fill,.btn-ghost').forEach(btn => {
  btn.classList.add('ripple-container');
  btn.addEventListener('click', addRipple);
});

// === Typing Animation ===
const roles = [
  'Full-Stack Developer',
  'AI/ML Engineer',
  'DevOps Practitioner',
  'Systems Architect',
  'Open-Source Builder',
];
const roleEl = document.querySelector('.hero-role');
if (roleEl) {
  let ri = 0, ci = 0, deleting = false, paused = false;
  const textNode = document.createTextNode('');
  const cursor = document.createElement('span');
  cursor.className = 'hero-cursor';
  roleEl.appendChild(textNode);
  roleEl.appendChild(cursor);

  function typeLoop() {
    if (paused) { setTimeout(typeLoop, 1800); paused = false; return; }
    const word = roles[ri];
    if (!deleting) {
      textNode.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; paused = true; }
      setTimeout(typeLoop, 68);
    } else {
      textNode.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      setTimeout(typeLoop, 34);
    }
  }
  setTimeout(typeLoop, 1000);
}

// === Project Filter ===
document.querySelectorAll('.filt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filt').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    const f = btn.dataset.f;
    document.querySelectorAll('.pj').forEach(c => {
      const cats = c.dataset.cat || '';
      c.hidden = f !== 'all' && !cats.split(',').includes(f);
    });
  });
});

// === DOCX Resume Generator ===
function generateResume() {
  if (!window.docx) { showToast('Resume generator is still loading, please wait a moment.', true); return; }
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, convertInchesToTwip } = window.docx;

  const h = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: t, bold: true, size: 24, color: '111111' })], spacing: { before: 240, after: 80 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' } } });
  const p = (t, o = {}) => new Paragraph({ children: [new TextRun({ text: t, size: 20, ...o })], spacing: { after: 60 } });
  const b = t => new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: t, size: 20 })], spacing: { after: 40 } });
  const s = t => new Paragraph({ children: [new TextRun({ text: t, size: 18, color: '666666' })], spacing: { after: 40 } });
  const sp = () => new Paragraph({ spacing: { after: 80 } });

  const projects = [
    ['SQLPilot', 'Python, FastAPI, sqlparse, OpenAI API', 'AI-powered MySQL tool-calling toolkit with fine-grained security constraints. Gives any LLM structured, constraint-enforced access to MySQL via OpenAI-compatible function calling. Features SQL Guard (sqlparse-based validation), column-level blocking, paginated results, pip-installable API, and a 3-panel test bench UI.'],
    ['Basalt', 'Python, ChromaDB, MarkItDown, OpenAI API', 'Zero-hallucination, model-agnostic dynamic knowledge base system. Works with any LLM provider using bounded context injection - 200-800 tokens of precise content, not massive context dumps. Dual-mode search, multi-round retrieval, isolated KBs, and source citations.'],
    ['Comfy Architect', 'Node.js, Vite, Vanilla JS, WebSockets', 'Advanced agentic workbench for building ComfyUI workflows through natural language. The AI auto-discovers nodes, validates type-safe connections, and self-corrects. Features real-time WebSocket blueprint sync, diff highlighting, interactive node mentions, and one-click workflow downloads.'],
    ['AI Agent Tools', 'Python, JavaScript, Tampermonkey, Docker', 'Universal agentic coding toolkit - one local server with Tampermonkey userscripts for Claude, ChatGPT, and Arena. AI outputs structured action blocks; the script injects buttons and optionally executes everything automatically in Auto Mode. Supports file read/write, patching, shell commands, context memory, and Docker isolation.'],
    ['AI Generation Suite', 'ComfyUI, Python, CivitAI, FLUX/SDXL', 'Complete local AI ecosystem supporting FLUX, SDXL, SD1.5 models with advanced features: image generation, inpainting, upscaling, face swap, and multi-server workflow management. Built on ComfyUI and CivitAI with a custom interactive GUI and automated pipeline orchestration.'],
    ['AI Detector & Paraphraser', 'Python, TensorFlow, NLP, PAN25', 'Advanced AI content detection and intelligent paraphrasing tool. Custom AI detector trained on PAN 25 dataset (360k+ variants) achieving GPTZero-level accuracy. Humanizer bypasses major detection systems including Turnitin and GPTZero with high reliability.'],
    ['WatchList', 'Python, Flask, libtorrent, FFmpeg, Flutter', 'Self-hosted media watchlist with torrent search, in-browser streaming via libtorrent + FFmpeg transcoding, TMDB integration, episode tracking, and push notifications. Available as a web app, Android app, and TV app (Flutter with built-in video player). Multi-user, mobile-friendly, and fully private.'],
    ['Vaultarr', 'Python, Flask, HTMX, Google Drive API', 'Unified self-hosted backup system with a full web UI and CLI. Supports Local and Google Drive providers, backs up Files & Folders, GitHub repos, and YouTube Music playlists. Features hash-based change detection, FIFO retention, cron/interval scheduling, NTFY push notifications, and multi-instance sync for disaster recovery.'],
    ['YTMusic Vault', 'Python, Flask, YouTube Data API, Gemini', 'Local web app to backup, restore, sort, and manage YouTube Music playlists. Features diff comparison between backups, cross-backup search, genre-based auto-sorting via Last.fm, and AI-powered merge and reclassification using Gemini. Fully private - all data stays local.'],
    ['Log Sentinel', 'Python, systemd, NTFY, YAML', 'Lightweight Python daemon monitoring system logs for suspicious activity - SSH brute-force, Fail2ban events, Dovecot/Postfix failures, Nginx probes, and sudo abuse. Config-driven with regex pattern matching, fixed-window deduplication, log rotation awareness, persistent state, and real-time NTFY push alerts.'],
    ['University Management System', 'Laravel, MySQL, AWS', 'Full-stack ERP solution serving 4000+ users daily - single-login platform for students, staff, and faculty. Modules include fee management, biometric attendance tracking, examination management, timetables, real-time analytics, S3 storage, and AWS SES email integration.'],
    ['Event Management Systems', 'PHP, MySQL, QR Code, Twilio', 'Scalable event management platform with QR-based invitation and attendance systems, bulk communication tools, and real-time tracking. Deployed for GMIU Tech Fest 2023 & 2024 (2000+ participants) and Bhavnagar Job Fair 2025 (1000+ registrations).'],
    ['Bird Species Classifier', 'Python, TensorFlow, EfficientNet', 'Machine learning model for classifying Indian exotic bird species using EfficientNet architecture. Trained on a curated dataset achieving 95% accuracy in species identification. Built with Python and TensorFlow with a Gradio-based web interface for inference.'],
    ['Blockchain Research', 'Ethereum, Solidity, IPFS', 'Two published research papers: (1) Ethereum-based Result Management System with a lightweight mining algorithm reducing power consumption by 60% - ARICEMS 2024, Harvard Club of Boston. (2) Blockchain Court Document Management with IPFS - International Conference on Sustainable Development, Delhi-NCR.'],
    ['PHPLite Framework', 'PHP, JavaScript, MVC/MVR', 'Lightweight, high-performance PHP framework as a Laravel alternative for small-to-medium projects. Model-View-Routes architecture with Single Page Application support. Reduced development time by 40% for small projects. Powers multiple production applications including transport and logistics platforms.'],
    ['Transport & Logistics Apps', 'PHP, PHPLite, MySQL, Twilio', 'Transport Bid Management System connecting truckers with job opportunities, and a Vehicle Policy Management System with automated Twilio SMS reminders for policy renewals.'],
    ['Aspire Public School', 'WordPress, PHP, MySQL', 'Modern school website with interactive features and comprehensive information management for the institution.'],
    ['Samarth Dehydration & Spices', 'WordPress, WooCommerce, PHP', 'International B2B e-commerce platform for spice and dehydration products, serving customers in India and Germany.'],
    ['Belmora', 'WordPress, WooCommerce, PHP', 'Premium e-commerce platform with modern design and seamless user experience built on WooCommerce.'],
  ];

  const doc = new Document({
    styles: { default: { document: { run: { font: 'Calibri', size: 20 } } } },
    sections: [{
      properties: { page: { margin: { top: convertInchesToTwip(0.75), right: convertInchesToTwip(0.75), bottom: convertInchesToTwip(0.75), left: convertInchesToTwip(0.75) } } },
      children: [
        new Paragraph({ children: [new TextRun({ text: 'BHUMIT JOGRANA', bold: true, size: 36, color: '111111' })], alignment: AlignmentType.LEFT, spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: 'Full-Stack Developer  |  AI/ML Engineer  |  DevOps', size: 22, color: '555555' })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: 'jograna.bhumit@gmail.com  |  linkedin.com/in/jograna-bhumit  |  flashholloway.github.io', size: 20, color: '555555' })], spacing: { after: 200 } }),
        h('SUMMARY'),
        p('I build things that work in production - agentic AI pipelines, self-hosted systems, enterprise platforms, and everything in between. From constraint-enforced LLM tooling to university-scale ERPs to multi-platform media apps, I ship across the full stack.'),
        p('With a foundation spanning full-stack web development, AI/ML engineering, and infrastructure management, I focus on building tools that solve real problems without unnecessary complexity. My work began at Gyanmanjari Innovative University, where I architected a university-wide ERP serving 4000+ daily users, led blockchain research presented at Harvard, and deployed custom AI systems across the institution - all while managing the production infrastructure they ran on.'),
        h('TECHNICAL SKILLS'),
        p('Languages & Frameworks:', { bold: true }),
        p('JavaScript (ES6+), Python, React, Node.js, PHP, SQL, Bash, Laravel, Django, Flask, FastAPI, WordPress'),
        p('Cloud & DevOps:', { bold: true }),
        p('AWS, GCP, DigitalOcean, Oracle Cloud / Linode, Docker, Podman, Kubernetes, Git, GitHub Actions, GitLab CI, Linux Systems, Nginx'),
        p('AI / ML:', { bold: true }),
        p('ComfyUI, n8n, TensorFlow, PyTorch, LLM Integration, OpenAI, Gemini API, Ollama, Agentic Pipelines, Gradio / Streamlit, LoRA / Fine-tuning'),
        p('Databases & Security:', { bold: true }),
        p('MySQL / MariaDB, Redis, S3, ChromaDB, SQLite, Blockchain / Ethereum, Security Hardening, CompTIA Security+, GrayLog / Grafana'),
        p('Mobile & Self-Hosted:', { bold: true }),
        p('Flutter (Android & TV), Dart, FFmpeg, libtorrent, NTFY Push Notifications, Android, Self-Hosted Infrastructure'),
        p('Automation & Other:', { bold: true }),
        p('Selenium, Playwright / Helium, Web Scraping, Telegram Bots, IoT, IPFS, Smart Contracts'),
        h('PROFESSIONAL EXPERIENCE'),
        p('Research and Development Engineer | IT Infrastructure Lead', { bold: true }),
        s('Gyanmanjari Innovative University | Feb 2023 - May 2025'),
        b('Architected and deployed a full-stack College Management ERP serving 4000+ students and 250+ faculty with single-login, fee management, biometric attendance, and exam modules'),
        b('Led blockchain and AI research resulting in 2 publications at international conferences (Harvard Club of Boston; Delhi-NCR)'),
        b('Improved system efficiency by 70% through automation tools, optimized ISO workflows, and IoT integrations (eSSL biometric)'),
        b('Managed AWS/cloud server infrastructure, security hardening, and CI/CD pipelines for university-wide production systems'),
        b('Built custom AI tools - detection models, image generation pipelines, and LLM integrations - deployed across university workflows'),
        h('EDUCATION'),
        p('Bachelor of Engineering - IT', { bold: true }),
        s('Gujarat Technological University | Aug 2022 - May 2025 | CGPA 8.34 / 10'),
        p('Diploma in Computer Engineering', { bold: true }),
        s('Gujarat Technological University | Jun 2019 - Jun 2022 | CGPA 8.75 / 10'),
        h('PROJECTS'),
        ...projects.flatMap(([n, t, d]) => [p(n, { bold: true }), s(t), p(d), sp()]),
        h('RESEARCH PUBLICATIONS'),
        p('Ethereum-Based Result Management System with Lightweight Mining Algorithm', { bold: true }),
        s('ARICEMS 2024  |  Harvard Club of Boston, U.S.'),
        p('Lightweight mining algorithm reducing power consumption by 60% while maintaining immutability for academic records.'),
        p('Blockchain Court Document Management System', { bold: true }),
        s("Int'l Conference on Sustainable Development  |  Gateway Institute, Delhi-NCR"),
        p('Decentralized document management using Ethereum and IPFS with smart contract automation.'),
        h('CERTIFICATIONS & ACHIEVEMENTS'),
        b('CompTIA Security+ - Industry-recognized cybersecurity certification'),
        b('Technical Excellence Award - Gyanmanjari Innovative University'),
        b('2 International Research Publications - Harvard Club of Boston & Delhi-NCR'),
        b('Production ERP system for 4000+ daily users'),
        b('70% efficiency improvement through university-wide automation'),
        b('Multi-platform development: web, Android, TV apps (Flutter)'),
      ]
    }]
  });

  Packer.toBlob(doc).then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'Bhumit_Jograna.docx'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }).catch(err => {
    console.error('Resume generation failed:', err);
    showToast('Resume generation failed. Please try again.', true);
  });
}