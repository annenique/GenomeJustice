// dna-canvas.js — animated double helix for hero background

(function () {
  const canvas = document.getElementById('dnaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, animId;
  const strands = [];
  const particles = [];
  const BASE_PAIRS = 30;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function buildHelix() {
    strands.length = 0;
    particles.length = 0;

    // floating particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1
      });
    }
  }

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // ---- floating particles ----
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });

    // ---- draw multiple DNA strands ----
    const helixConfigs = [
      { cx: W * 0.25, amplitude: 60, speed: 1.0, alpha: 0.5 },
      { cx: W * 0.75, amplitude: 50, speed: 0.8, alpha: 0.4 },
      { cx: W * 0.5,  amplitude: 80, speed: 1.2, alpha: 0.3 },
    ];

    helixConfigs.forEach(cfg => {
      drawHelix(cfg.cx, cfg.amplitude, cfg.speed, cfg.alpha);
    });

    t += 0.008;
    animId = requestAnimationFrame(draw);
  }

  function drawHelix(cx, amplitude, speed, alpha) {
    const wavelength = H * 0.6;
    const steps = 120;
    const stepH = H / steps;

    const s1x = [], s2x = [], sy = [];

    for (let i = 0; i <= steps; i++) {
      const y = i * stepH;
      const phase = (y / wavelength) * Math.PI * 2 + t * speed;
      s1x.push(cx + Math.sin(phase) * amplitude);
      s2x.push(cx + Math.sin(phase + Math.PI) * amplitude);
      sy.push(y);
    }

    // strand 1
    ctx.beginPath();
    ctx.moveTo(s1x[0], sy[0]);
    for (let i = 1; i <= steps; i++) ctx.lineTo(s1x[i], sy[i]);
    ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // strand 2
    ctx.beginPath();
    ctx.moveTo(s2x[0], sy[0]);
    for (let i = 1; i <= steps; i++) ctx.lineTo(s2x[i], sy[i]);
    ctx.strokeStyle = `rgba(123, 92, 250, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // base pairs (rungs)
    const pairCount = 18;
    for (let i = 0; i <= pairCount; i++) {
      const idx = Math.floor((i / pairCount) * steps);
      if (idx > steps) continue;
      const y = sy[idx];
      const x1 = s1x[idx];
      const x2 = s2x[idx];
      const phase = (y / wavelength) * Math.PI * 2 + t * speed;
      const cos = Math.cos(phase);

      // only draw rungs facing "front"
      if (cos > -0.1) {
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = `rgba(57, 255, 20, ${alpha * 0.7 * Math.abs(cos)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // node dots
        const dotR = 3 * Math.abs(cos);
        ctx.beginPath();
        ctx.arc(x1, y, dotR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x2, y, dotR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(123, 92, 250, ${alpha})`;
        ctx.fill();
      }
    }
  }

  function init() {
    resize();
    buildHelix();
    draw();
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    buildHelix();
    draw();
  });

  init();
})();
