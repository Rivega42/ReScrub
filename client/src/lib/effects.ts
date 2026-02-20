// Visual effects for Easter eggs — pure canvas, no libraries

export function confetti() {
  const existing = document.getElementById("__confetti_canvas");
  if (existing) return;

  const canvas = document.createElement("canvas");
  canvas.id = "__confetti_canvas";
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;will-change:transform";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d")!;
  const pieces: {
    x: number; y: number; vx: number; vy: number;
    w: number; h: number; color: string; rot: number; rotV: number;
  }[] = [];

  const colors = [
    "#ff6b6b","#ffd93d","#6bcb77","#4d96ff","#c77dff",
    "#ff9f43","#54a0ff","#ee5a24","#0abde3","#ff6348",
  ];
  for (let i = 0; i < 180; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 4,
      vy: 2.5 + Math.random() * 4,
      w: 8 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.2,
    });
  }

  let startTime: number | null = null;
  const duration = 3500;

  function draw(ts: number) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const progress = Math.min(elapsed / duration, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotV;
      p.vy += 0.07;

      const alpha = progress > 0.75 ? 1 - (progress - 0.75) / 0.25 : 1;
      ctx.globalAlpha = alpha;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    if (progress < 1) {
      requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(draw);
}

export function matrixRain() {
  const existing = document.getElementById("__matrix_canvas");
  if (existing) return;

  const canvas = document.createElement("canvas");
  canvas.id = "__matrix_canvas";
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;will-change:transform";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d")!;
  const fontSize = 14;
  const cols = Math.floor(canvas.width / fontSize);
  const drops = new Array(cols).fill(1);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()アイウエオカキクケコ";

  let startTime: number | null = null;
  const duration = 3500;

  function draw(ts: number) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const progress = Math.min(elapsed / duration, 1);

    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const alpha = progress > 0.75 ? 1 - (progress - 0.75) / 0.25 : 1;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#00ff41";
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    ctx.globalAlpha = 1;

    if (progress < 1) {
      requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(draw);
}

export function rocketLaunch() {
  const existing = document.getElementById("__rocket_canvas");
  if (existing) return;

  const canvas = document.createElement("canvas");
  canvas.id = "__rocket_canvas";
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;will-change:transform";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d")!;

  let startTime: number | null = null;
  const duration = 3500;
  const startY = canvas.height + 60;
  const endY = -100;
  const rocketX = canvas.width / 2;

  const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];

  function easeInExpo(t: number) {
    return t === 0 ? 0 : Math.pow(2, 10 * t - 10);
  }

  function draw(ts: number) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const progress = Math.min(elapsed / duration, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rocketY = startY + (endY - startY) * easeInExpo(progress);

    // Exhaust particles
    if (progress < 0.9) {
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: rocketX + (Math.random() - 0.5) * 10,
          y: rocketY + 40,
          vx: (Math.random() - 0.5) * 3,
          vy: 2 + Math.random() * 3,
          life: 1,
          color: ["#ff6348", "#ffd93d", "#ff9f43"][Math.floor(Math.random() * 3)],
        });
      }
    }

    // Draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.04;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4 * p.life, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw rocket emoji
    ctx.globalAlpha = 1;
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🚀", rocketX, rocketY);

    // Smoke trail
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = "#888";
    ctx.font = "20px serif";
    for (let i = 0; i < 5; i++) {
      const trailY = rocketY + 50 + i * 30;
      const alpha = 0.15 * (1 - i / 5);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(rocketX + (Math.random() - 0.5) * 8, trailY, 8 + i * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (progress < 1) {
      requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(draw);
}
