// Toast notification
let _toastTimer;
function showToast(msg, isErr) {
  const el = document.getElementById('toast');
  if (!el) return;
  clearTimeout(_toastTimer);
  el.textContent = msg;
  el.className = 'toast show' + (isErr ? ' err' : '');
  _toastTimer = setTimeout(() => { el.className = 'toast'; }, 3500);
}

// Year
document.getElementById('yr').textContent = new Date().getFullYear();

// Hamburger
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

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.rv').forEach(el => obs.observe(el));

// Nav active highlight
const navAs = document.querySelectorAll('.nav-list a');
const secs = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (scrollY >= s.offsetTop - 80) cur = s.id; });
  navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
}, { passive: true });

// Project filter
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

// DOCX Resume Generator
function generateResume() {
  if (!window.docx) { showToast('Resume generator is still loading, please wait a moment.', true); return; }
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, convertInchesToTwip } = window.docx;

  const h = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: t, bold: true, size: 24, color: '111111' })], spacing: { before: 240, after: 80 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' } } });
  const p = (t, o = {}) => new Paragraph({ children: [new TextRun({ text: t, size: 20, ...o })], spacing: { after: 60 } });
  const b = t => new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: t, size: 20 })], spacing: { after: 40 } });
  const s = t => new Paragraph({ children: [new TextRun({ text: t, size: 18, color: '666666' })], spacing: { after: 40 } });
  const sp = () => new Paragraph({ spacing: { after: 80 } });

  const projects = [
    ['SQLPilot', 'Python, FastAPI, sqlparse, OpenAI API', 'AI-powered MySQL tool-calling toolkit. Constraint-enforced LLM access to MySQL via function calling. SQL Guard, column-level blocking, paginated results, pip-installable API, 3-panel test bench UI.'],
    ['Basalt', 'Python, ChromaDB, MarkItDown, OpenAI API', 'Zero-hallucination knowledge base library. Bounded context injection (200-800 tokens), dual-mode search, isolated KBs, multi-round retrieval, source citations.'],
    ['Comfy Architect', 'Node.js, Vite, Vanilla JS, WebSockets', 'Agentic workbench for ComfyUI workflows via natural language. Auto-discovers nodes, validates type-safe connections, self-corrects. Real-time blueprint sync, one-click exports.'],
    ['AI Agent Tools', 'Python, JavaScript, Tampermonkey, Docker', 'Universal agentic coding toolkit for Claude/ChatGPT/Arena. Auto Mode for file ops, patches, shell commands. Context memory and Docker isolation.'],
    ['AI Generation Suite', 'ComfyUI, Python, CivitAI, FLUX/SDXL', 'Local AI ecosystem: image generation, inpainting, upscaling, face swap, LoRA training, multi-server workflow management.'],
    ['AI Detector & Paraphraser', 'Python, TensorFlow, NLP, PAN25', 'Custom detector trained on 360k+ variants. GPTZero-level accuracy. Humanizer bypasses Turnitin and GPTZero.'],
    ['WatchList', 'Python, Flask, libtorrent, FFmpeg, Flutter', 'Self-hosted media platform with streaming, TMDB, episode tracking, NTFY alerts. Web + Android + TV apps.'],
    ['Vaultarr', 'Python, Flask, HTMX, Google Drive API', 'Unified backup system. Files, GitHub repos, YT Music playlists. Hash-based change detection, scheduling, NTFY, multi-instance sync.'],
    ['YTMusic Vault', 'Python, Flask, YouTube Data API, Gemini', 'YouTube Music backup/restore with diff comparison, Last.fm sorting, AI-powered merge via Gemini.'],
    ['Log Sentinel', 'Python, systemd, NTFY, YAML', 'Security daemon monitoring SSH, Fail2ban, Nginx, Postfix logs. Deduplication, rotation-aware, real-time NTFY alerts.'],
    ['University Management System', 'Laravel, MySQL, AWS', 'ERP for 4000+ daily users. Fee management, biometric attendance, exams, analytics. Live: erp.gmiu.edu.in'],
    ['Event Management Systems', 'PHP, MySQL, QR Code, Twilio', 'QR-based attendance platform. GMIU Tech Fest (2000+ participants), Bhavnagar Job Fair (1000+ registrations).'],
    ['Bird Species Classifier', 'Python, TensorFlow, EfficientNet', 'Indian bird species classification. 95% accuracy. Gradio web interface.'],
    ['Blockchain Research', 'Ethereum, Solidity, IPFS', '2 published papers: Ethereum Result Management (60% lower power) - Harvard. Court Document Management with IPFS - Delhi-NCR.'],
    ['PHPLite Framework', 'PHP, JavaScript, MVC/MVR', 'Lightweight Laravel alternative. 40% faster dev cycles. Powers multiple production platforms.'],
    ['Transport & Logistics', 'PHP, PHPLite, MySQL, Twilio', 'Transport Bid Management + Vehicle Policy Management with SMS reminders. Live: thebharatparivahan.com'],
    ['Aspire Public School', 'WordPress, PHP, MySQL', 'School website. Live: aspirepublicschool.in'],
    ['Samarth Spices', 'WordPress, WooCommerce, PHP', 'B2B e-commerce for India and Germany. Live: samarthspices.de'],
    ['Belmora', 'WordPress, WooCommerce, PHP', 'Premium e-commerce platform. Live: belmora.in'],
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
        p('Full-Stack Developer with 2+ years building scalable web systems, AI/ML pipelines, and DevOps infrastructure. Enterprise ERP systems, published blockchain research, production-grade self-hosted tools. Full lifecycle from architecture to deployment.'),

        h('TECHNICAL SKILLS'),
        p('Languages & Frameworks:', { bold: true }),
        p('JavaScript (ES6+), Python, PHP, SQL, Bash  |  Laravel, Django, Flask, FastAPI, WordPress'),
        p('Cloud & DevOps:', { bold: true }),
        p('AWS, GCP, DigitalOcean, Linode, Oracle Cloud  |  Docker, Podman, Kubernetes  |  Git, GitHub Actions, GitLab CI  |  Linux Administration'),
        p('AI / ML:', { bold: true }),
        p('ComfyUI, n8n, TensorFlow, LLM Integration, Gemini API, Ollama, Agentic Pipelines, Gradio, LoRA Training'),
        p('Databases & Security:', { bold: true }),
        p('MySQL/MariaDB, Redis, S3, ChromaDB  |  Blockchain/Ethereum, Security Hardening, CompTIA Security+, GrayLog'),
        p('Mobile & Self-Hosted:', { bold: true }),
        p('Flutter (Android & TV), FFmpeg, libtorrent, NTFY, Self-Hosted Infrastructure'),
        p('Automation:', { bold: true }),
        p('Selenium, Playwright, Web Scraping, Telegram Bots, IoT Integration, IPFS, Smart Contracts'),

        h('PROFESSIONAL EXPERIENCE'),
        p('Research & Development Engineer  |  IT Infrastructure Lead', { bold: true }),
        s('Gyanmanjari Innovative University  |  Feb 2023 - May 2025'),
        b('Architected and deployed full-stack College Management ERP serving 4000+ students and 250+ faculty'),
        b('Led blockchain and AI research resulting in 2 publications at international conferences'),
        b('Improved system efficiency by 70% through automation, ISO workflows, and IoT integrations'),
        b('Managed AWS/cloud infrastructure, security hardening, and CI/CD pipelines'),
        b('Built custom AI tools deployed across university workflows'),

        h('EDUCATION'),
        p('Bachelor of Engineering - Computer / IT', { bold: true }),
        s('Gujarat Technological University  |  Aug 2022 - May 2025  |  CGPA: 8.34 / 10'),
        p('Diploma in Engineering', { bold: true }),
        s('Gujarat Technological University  |  Jun 2019 - Jun 2022  |  CGPA: 8.75 / 10'),

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
    a.href = url;
    a.download = 'Bhumit_Jograna.docx';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }).catch(err => {
    console.error('Resume generation failed:', err);
    showToast('Resume generation failed. Please try again.', true);
  });
}
