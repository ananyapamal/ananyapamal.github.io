// bubbles.js

const canvas = document.getElementById("bubbleCanvas");
const ctx = canvas.getContext("2d");
const aboutWrapper = document.getElementById("about-wrapper");

let bubbles = [];
const NUM_BUBBLES = 30;

// --- Resize canvas to fit container with high-DPI support ---
function resizeCanvas() {
  const width = aboutWrapper.clientWidth;
  const height = aboutWrapper.clientHeight;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// --- Bubble class ---
class Bubble {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * aboutWrapper.offsetWidth;
    this.y = Math.random() * aboutWrapper.offsetHeight;
    this.radius = Math.random() * 15 + 15; // smaller, realistic size
    this.speed = Math.random() * 0.4 + 0.2;
    this.drift = (Math.random() - 0.5) * 0.3;
    this.angle = Math.random() * Math.PI * 2;
    this.popped = false;
    this.opacity = Math.random() * 0.4 + 0.3;
    this.baseHue = Math.random() * 360; // subtle color shift
  }

  draw() {
    if (this.radius <= 0) return;

    // Radial gradient for realistic bubble look
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

    // Highlight reflection for shininess
    ctx.beginPath();
    ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fill();
  }

  update() {
    if (!this.popped) {
      this.x += Math.cos(this.angle) * this.speed + this.drift;
      this.y += Math.sin(this.angle) * this.speed;

      // Bounce off edges
      if (this.x - this.radius < 0) {
        this.x = this.radius;
        this.angle = Math.PI - this.angle;
      } else if (this.x + this.radius > aboutWrapper.offsetWidth) {
        this.x = aboutWrapper.offsetWidth - this.radius;
        this.angle = Math.PI - this.angle;
      }

      if (this.y - this.radius < 0) {
        this.y = this.radius;
        this.angle = -this.angle;
      } else if (this.y + this.radius > aboutWrapper.offsetHeight) {
        this.y = aboutWrapper.offsetHeight - this.radius;
        this.angle = -this.angle;
      }
    } else {
      // Shrink smoothly when popped
      if (this.radius > 0) this.radius -= 1.5;
      else this.radius = 0;
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

// --- Initialize bubbles ---
function initBubbles() {
  bubbles = [];
  for (let i = 0; i < NUM_BUBBLES; i++) {
    bubbles.push(new Bubble());
  }
}

initBubbles();

// --- Animation loop ---
function animate() {
  ctx.clearRect(0, 0, aboutWrapper.offsetWidth, aboutWrapper.offsetHeight);
  bubbles.forEach(bubble => {
    bubble.update();
    bubble.draw();
  });
  requestAnimationFrame(animate);
}

animate();

// --- Click to pop ---
canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  bubbles.forEach(bubble => {
    if (!bubble.popped && bubble.isClicked(mouseX, mouseY)) {
      bubble.pop();
    }
  });
});
