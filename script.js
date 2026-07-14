/* =========================================================
   CONFIG — edit these two things freely
========================================================= */
const MONTHSARRY_DATE = "2026-7-14T04:30:00"; // <-- change to your real start date
const LOVE_LETTER_TEXT =
"My Love,\n\n" +
"[We met in the most unconventional way, yet we found each other in the most random time of our lives and yet it felt just right, " +
"A ring is a promise of a lifetime, and here I say that I will be with you forever.]\n\n" +
"I love you more than words can describe.\n\n" +
"Forever yours,\nKenneth";

/* =========================================================
   PRELOADER
========================================================= */
window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  setTimeout(() => pre.classList.add("done"), 500);
});

/* =========================================================
   CUSTOM CURSOR
========================================================= */
(function customCursor(){
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;
  let ringX = 0, ringY = 0;

  window.addEventListener("mousemove", (e) => {
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
    ringX = e.clientX; ringY = e.clientY;
  });

  (function loop(){
    const rect = ring.getBoundingClientRect();
    const curX = rect.left + rect.width / 2 || ringX;
    const curY = rect.top + rect.height / 2 || ringY;
    const nx = curX + (ringX - curX) * 0.18;
    const ny = curY + (ringY - curY) * 0.18;
    ring.style.left = nx + "px";
    ring.style.top = ny + "px";
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll("button, a").forEach(el => {
    el.addEventListener("mouseenter", () => ring.style.transform = "translate(-50%,-50%) scale(1.6)");
    el.addEventListener("mouseleave", () => ring.style.transform = "translate(-50%,-50%) scale(1)");
  });
})();

/* =========================================================
   NIGHT SKY CANVAS (intro screen)
========================================================= */
(function nightSky(){
  const canvas = document.getElementById("sky-canvas");
  const ctx = canvas.getContext("2d");
  let w, h, stars = [], sparkles = [];

  function resize(){
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  for (let i = 0; i < 140; i++){
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2
    });
  }
  for (let i = 0; i < 30; i++){
    sparkles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      life: Math.random() * 100
    });
  }

  let running = true;
  function draw(){
    if (!running) return;
    ctx.clearRect(0, 0, w, h);

    // twinkling stars
    stars.forEach(s => {
      s.phase += s.speed;
      const alpha = 0.5 + Math.sin(s.phase) * 0.5;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    });

    // moving sparkles
    sparkles.forEach(p => {
      p.x += p.dx; p.y += p.dy; p.life -= 1;
      if (p.life <= 0){
        p.x = Math.random() * w; p.y = Math.random() * h; p.life = 150;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,190,220,0.8)";
      ctx.shadowColor = "#ff9ec4";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(draw);
  }
  draw();

  window.stopNightSky = () => running = false;
})();

/* Floating hearts drifting up on the intro screen */
(function introHearts(){
  const intro = document.getElementById("intro");
  function spawn(){
    if (!intro || intro.style.display === "none") return;
    const h = document.createElement("div");
    h.textContent = "❤";
    h.style.position = "absolute";
    h.style.left = Math.random() * 100 + "%";
    h.style.bottom = "-40px";
    h.style.fontSize = 12 + Math.random() * 22 + "px";
    h.style.color = "rgba(255,111,165,0.5)";
    h.style.pointerEvents = "none";
    h.style.zIndex = "1";
    h.style.transition = "transform 9s linear, opacity 9s linear";
    intro.appendChild(h);
    requestAnimationFrame(() => {
      h.style.transform = `translateY(-${window.innerHeight + 100}px) translateX(${(Math.random()-0.5)*120}px)`;
      h.style.opacity = "0";
    });
    setTimeout(() => h.remove(), 9200);
  }
  setInterval(spawn, 550);
})();

/* =========================================================
   OPEN MY HEART — transition into main site
========================================================= */
const openBtn = document.getElementById("openHeartBtn");
const introHeart = document.getElementById("introHeart");
const overlay = document.getElementById("transitionOverlay");
const intro = document.getElementById("intro");
const mainSite = document.getElementById("mainSite");
const bgMusic = document.getElementById("bgMusic");

openBtn.addEventListener("click", () => {
  openBtn.disabled = true;
  introHeart.style.animation = "heartGlow 0.5s ease-in-out 3";

  // try to start music (user gesture satisfies autoplay policies)
  bgMusic.volume = 0.6;
  bgMusic.play().catch(() => {});
  updatePlayPauseIcons(true);

  overlay.classList.add("active");

  setTimeout(() => {
    intro.style.display = "none";
    window.stopNightSky && window.stopNightSky();
    mainSite.classList.remove("hidden");
    document.body.style.cursor = "";
    overlay.classList.remove("active");
    overlay.style.opacity = "0";
    initAfterReveal();
  }, 1400);
});

/* =========================================================
   FUNCTIONS THAT ONLY NEED TO RUN AFTER MAIN SITE REVEALS
========================================================= */
function initAfterReveal(){
  startTypewriter();
  startLoveCounter();
  observeReveals();
  startFloatingLayer();
}

/* =========================================================
   TYPEWRITER LOVE LETTER
========================================================= */
function startTypewriter(){
  const el = document.getElementById("typewriterText");
  const cursor = document.getElementById("typeCursor");
  const text = LOVE_LETTER_TEXT;
  let i = 0;

  function tick(){
    if (i >= text.length){
      return;
    }
    const ch = text.charAt(i);
    el.textContent += ch;
    i++;

    let delay = 32 + Math.random() * 25;
    if (",;".includes(ch)) delay += 220;
    if (".!?\n".includes(ch)) delay += 420;

    setTimeout(tick, delay);
  }
  tick();
}

/* =========================================================
   LOVE COUNTER
========================================================= */
function startLoveCounter(){
  const start = new Date(MONTHSARRY_DATE);
  const els = {
    y: document.getElementById("cYears"),
    mo: document.getElementById("cMonths"),
    d: document.getElementById("cDays"),
    h: document.getElementById("cHours"),
    mi: document.getElementById("cMinutes"),
    s: document.getElementById("cSeconds")
  };

  function update(){
    const now = new Date();
    let diffMs = now - start;
    if (diffMs < 0) diffMs = 0;

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();
    let hours = now.getHours() - start.getHours();
    let minutes = now.getMinutes() - start.getMinutes();
    let seconds = now.getSeconds() - start.getSeconds();

    if (seconds < 0){ seconds += 60; minutes--; }
    if (minutes < 0){ minutes += 60; hours--; }
    if (hours < 0){ hours += 24; days--; }
    if (days < 0){
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += prevMonth;
      months--;
    }
    if (months < 0){ months += 12; years--; }

    els.y.textContent = Math.max(years, 0);
    els.mo.textContent = Math.max(months, 0);
    els.d.textContent = Math.max(days, 0);
    els.h.textContent = Math.max(hours, 0);
    els.mi.textContent = Math.max(minutes, 0);
    els.s.textContent = Math.max(seconds, 0);
  }

  update();
  setInterval(update, 1000);
}

/* =========================================================
   SCROLL REVEAL — Intersection Observer
========================================================= */
function observeReveals(){
  const items = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

  items.forEach(item => io.observe(item));
}

/* =========================================================
   AMBIENT FLOATING LAYER — hearts, sparkles, petals
========================================================= */
function startFloatingLayer(){
  const layer = document.getElementById("floatingLayer");
  const symbols = ["❤", "❤", "✨", "❀"];

  function spawnFloater(){
    const el = document.createElement("span");
    const type = symbols[Math.floor(Math.random() * symbols.length)];
    el.className = "floater";
    el.textContent = type;

    const size = 10 + Math.random() * 20;
    const duration = 10 + Math.random() * 8;
    const drift = (Math.random() - 0.5) * 160;
    const rot = (Math.random() - 0.5) * 360;

    el.style.left = Math.random() * 100 + "%";
    el.style.fontSize = size + "px";
    el.style.color = type === "❀" ? "rgba(224,177,166,0.7)" : "rgba(255,158,196,0.55)";
    el.style.setProperty("--drift", drift + "px");
    el.style.setProperty("--rot", rot + "deg");
    el.style.animationDuration = duration + "s";

    layer.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 200);
  }

  setInterval(spawnFloater, 450);
  for (let i = 0; i < 10; i++) setTimeout(spawnFloater, i * 200);
}

/* =========================================================
   NAVIGATION TOGGLE (mobile)
========================================================= */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

/* =========================================================
   MUSIC CONTROLS
========================================================= */
const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const volumeSlider = document.getElementById("volumeSlider");
const muteBtn = document.getElementById("muteBtn");
const unmutedIcon = document.getElementById("unmutedIcon");
const mutedIcon = document.getElementById("mutedIcon");

function updatePlayPauseIcons(isPlaying){
  playIcon.style.display = isPlaying ? "none" : "inline";
  pauseIcon.style.display = isPlaying ? "inline" : "none";
}

playPauseBtn.addEventListener("click", () => {
  if (bgMusic.paused){
    bgMusic.play().catch(() => {});
    updatePlayPauseIcons(true);
  } else {
    bgMusic.pause();
    updatePlayPauseIcons(false);
  }
});

volumeSlider.addEventListener("input", (e) => {
  bgMusic.volume = parseFloat(e.target.value);
  bgMusic.muted = false;
  unmutedIcon.style.display = "inline";
  mutedIcon.style.display = "none";
});

muteBtn.addEventListener("click", () => {
  bgMusic.muted = !bgMusic.muted;
  unmutedIcon.style.display = bgMusic.muted ? "none" : "inline";
  mutedIcon.style.display = bgMusic.muted ? "inline" : "none";
});

/* =========================================================
   BACK TO TOP
========================================================= */
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 700) backToTop.classList.add("show");
  else backToTop.classList.remove("show");
});
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* =========================================================
   "I LOVE YOU" BUTTON — heart explosion + confetti + fireworks
========================================================= */
const loveYouBtn = document.getElementById("loveYouBtn");
const loveMessage = document.getElementById("loveMessage");
const celebrationCanvas = document.getElementById("celebrationCanvas");
const cctx = celebrationCanvas.getContext("2d");

function resizeCelebrationCanvas(){
  celebrationCanvas.width = window.innerWidth;
  celebrationCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCelebrationCanvas);
resizeCelebrationCanvas();

function randomPink(){
  const hues = [330, 340, 350, 15, 300];
  return `hsl(${hues[Math.floor(Math.random() * hues.length)]}, 90%, 70%)`;
}

loveYouBtn.addEventListener("click", () => {
  loveMessage.classList.add("show");
  document.body.style.animation = "none";
  runHeartExplosion();
  runConfetti();
  setTimeout(runFireworks, 400);
});

function runHeartExplosion(){
  const count = 26;
  const rect = loveYouBtn.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  for (let i = 0; i < count; i++){
    const h = document.createElement("div");
    h.textContent = "❤";
    h.style.position = "fixed";
    h.style.left = originX + "px";
    h.style.top = originY + "px";
    h.style.fontSize = 14 + Math.random() * 20 + "px";
    h.style.color = randomPink();
    h.style.pointerEvents = "none";
    h.style.zIndex = "3100";
    h.style.transition = "transform 1.4s cubic-bezier(.2,.8,.3,1), opacity 1.4s ease";
    document.body.appendChild(h);

    const angle = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * 220;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 60;

    requestAnimationFrame(() => {
      h.style.transform = `translate(${dx}px, ${dy}px) rotate(${(Math.random()-0.5)*180}deg) scale(0.4)`;
      h.style.opacity = "0";
    });
    setTimeout(() => h.remove(), 1500);
  }
}

let confettiParticles = [];
function runConfetti(){
  for (let i = 0; i < 160; i++){
    confettiParticles.push({
      x: Math.random() * celebrationCanvas.width,
      y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 3,
      size: 4 + Math.random() * 6,
      color: randomPink(),
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      life: 220
    });
  }
  requestAnimationFrame(animateCelebration);
}

let fireworks = [];
function runFireworks(){
  for (let burst = 0; burst < 4; burst++){
    setTimeout(() => {
      const fx = celebrationCanvas.width * (0.2 + Math.random() * 0.6);
      const fy = celebrationCanvas.height * (0.2 + Math.random() * 0.35);
      const color = randomPink();
      for (let i = 0; i < 46; i++){
        const angle = (Math.PI * 2 * i) / 46;
        const speed = 2 + Math.random() * 3;
        fireworks.push({
          x: fx, y: fy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          life: 60 + Math.random() * 20
        });
      }
    }, burst * 350);
  }
  requestAnimationFrame(animateCelebration);
}

let celebrationRunning = false;
function animateCelebration(){
  if (celebrationRunning) return;
  celebrationRunning = true;
  step();

  function step(){
    cctx.clearRect(0, 0, celebrationCanvas.width, celebrationCanvas.height);
    let anythingAlive = false;

    confettiParticles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
      if (p.life > 0 && p.y < celebrationCanvas.height + 20){
        anythingAlive = true;
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate(p.rot);
        cctx.fillStyle = p.color;
        cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        cctx.restore();
      }
    });
    confettiParticles = confettiParticles.filter(p => p.life > 0 && p.y < celebrationCanvas.height + 20);

    fireworks.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.life--;
      if (p.life > 0){
        anythingAlive = true;
        cctx.beginPath();
        cctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        cctx.fillStyle = p.color;
        cctx.shadowColor = p.color;
        cctx.shadowBlur = 8;
        cctx.fill();
        cctx.shadowBlur = 0;
      }
    });
    fireworks = fireworks.filter(p => p.life > 0);

    if (anythingAlive){
      requestAnimationFrame(step);
    } else {
      celebrationRunning = false;
      cctx.clearRect(0, 0, celebrationCanvas.width, celebrationCanvas.height);
    }
  }
}

/* =========================================================
   FINALE CANVAS — brightening stars
========================================================= */
(function finaleStars(){
  const canvas = document.getElementById("finaleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, stars = [], brightness = 0.3;

  function resize(){
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  for (let i = 0; i < 90; i++){
    stars.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.5 + 0.5, p: Math.random() * Math.PI * 2 });
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) brightness = 1; });
  }, { threshold: 0.3 });
  io.observe(canvas);

  function draw(){
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
      s.p += 0.02;
      const a = (0.4 + Math.sin(s.p) * 0.4) * brightness;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();
