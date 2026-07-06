// bubbles.js

const bubbleCanvas = document.getElementById('bubbleCanvas');
const ctx = bubbleCanvas.getContext('2d');
const aboutSection = document.getElementById('about');

let bubbles = [];
const NUM_BUBBLES = 30;
let width = 0;
let height = 0;

function resizeCanvas() {
  width = aboutSection.clientWidth;
  height = aboutSection.clientHeight;
  if (!width || !height) return;

  const dpr = window.devicePixelRatio || 1;
  bubbleCanvas.width = Math.round(width * dpr);
  bubbleCanvas.height = Math.round(height * dpr);
  bubbleCanvas.style.width = width + 'px';
  bubbleCanvas.style.height = height + 'px';

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

class Bubble {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = Math.random() * 15 + 15;
    this.speed = Math.random() * 0.4 + 0.2;
    this.drift = (Math.random() - 0.5) * 0.3;
    this.angle = Math.random() * Math.PI * 2;
    this.popped = false;
    this.opacity = Math.random() * 0.4 + 0.4;
    this.baseHue = Math.random() * 360;
  }

  draw() {
    if (this.radius <= 0) return;

    const gradient = ctx.createRadialGradient(
      this.x - this.radius * 0.2,
      this.y - this.radius * 0.2,
      this.radius * 0.1,
      this.x,
      this.y,
      this.radius
    );

    const hue = (this.baseHue + performance.now() / 100) % 360;
    gradient.addColorStop(0, `hsla(${hue}, 100%, 95%, ${this.opacity})`);
    gradient.addColorStop(0.4, `hsla(${hue}, 100%, 85%, ${this.opacity * 0.8})`);
    gradient.addColorStop(1, `hsla(${hue}, 100%, 75%, ${this.opacity * 0.5})`);

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fill();
  }

  update() {
    if (!this.popped) {
      this.x += Math.cos(this.angle) * this.speed + this.drift;
      this.y += Math.sin(this.angle) * this.speed;

      if (this.x - this.radius < 0) {
        this.x = this.radius;
        this.angle = Math.PI - this.angle;
      } else if (this.x + this.radius > width) {
        this.x = width - this.radius;
        this.angle = Math.PI - this.angle;
      }

      if (this.y - this.radius < 0) {
        this.y = this.radius;
        this.angle = -this.angle;
      } else if (this.y + this.radius > height) {
        this.y = height - this.radius;
        this.angle = -this.angle;
      }
    } else if (this.radius > 0) {
      this.radius -= 1.5;
    }
  }

  isClicked(mx, my) {
    const dx = mx - this.x;
    const dy = my - this.y;
    return Math.sqrt(dx * dx + dy * dy) < this.radius;
  }

  pop() {
    this.popped = true;
  }
}

function initBubbles() {
  bubbles = [];
  for (let i = 0; i < NUM_BUBBLES; i++) {
    bubbles.push(new Bubble());
  }
}

function animateBubbles() {
  if (width && height) {
    ctx.clearRect(0, 0, width, height);
    bubbles.forEach(bubble => {
      bubble.update();
      bubble.draw();
    });
  }
  requestAnimationFrame(animateBubbles);
}

function start() {
  resizeCanvas();
  if (!width || !height) return;
  initBubbles();
}

function handlePop(clientX, clientY) {
  const rect = bubbleCanvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  bubbles.forEach(bubble => {
    if (!bubble.popped && bubble.isClicked(x, y)) {
      bubble.pop();
    }
  });
}

bubbleCanvas.addEventListener('click', e => handlePop(e.clientX, e.clientY));

bubbleCanvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const touch = e.touches[0];
  handlePop(touch.clientX, touch.clientY);
}, { passive: false });

window.addEventListener('resize', start);

if (typeof ResizeObserver !== 'undefined') {
  new ResizeObserver(start).observe(aboutSection);
}

let started = false;

function boot() {
  if (started) return;
  started = true;
  start();
  animateBubbles();
}

window.addEventListener('load', boot);

if (document.readyState === 'complete') {
  boot();
}
