
const ctx = canvas.getContext('2d');
const aboutWrapper = document.getElementById('about-wrapper');
const bubbleCanvas = document.getElementById('bubbleCanvas');

function resizeCanvas() {
  bubbleCanvas.width = aboutWrapper.offsetWidth;
  bubbleCanvas.height = aboutWrapper.offsetHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

class Bubble {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height * Math.random();
    this.radius = Math.random() * 20 + 10;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.color = `rgba(173, 216, 230, ${this.opacity})`;
    this.popped = false;
    this.baseHue = Math.random() * 360; // different starting color per bubble
    this.angle = Math.random() * Math.PI * 2; // random direction in radians
    this.speed = Math.random() * 0.5 + 0.3;    // slower for floaty feel
    this.drift = (Math.random() - 0.5) * 0.4;  // slight horizontal drift
  }
  
  draw() {
    // Improve sharpness by matching canvas resolution to device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.scale(1 / dpr, 1 / dpr);
  
    // 🌈 Rainbow refraction gradient
    const rainbow = ctx.createRadialGradient(
      this.x, this.y, this.radius * 0.1,  // bright center
      this.x, this.y, this.radius         // outer edge
    );
  
    const hue = (this.baseHue + performance.now() / 50) % 360;
    rainbow.addColorStop(0, `hsla(${hue}, 100%, 90%, 0.2)`);   // almost clear center
    rainbow.addColorStop(0.4, `hsla(${(hue + 60) % 360}, 100%, 80%, 0.3)`);
    rainbow.addColorStop(0.8, `hsla(${(hue + 120) % 360}, 100%, 70%, 0.5)`);
    rainbow.addColorStop(1, `hsla(${(hue + 180) % 360}, 100%, 80%, 0.2)`);
  
    // Fill with rainbow gradient
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = rainbow;
    ctx.fill();
  
    // ✨ Highlight reflection
    ctx.beginPath();
    ctx.arc(
      this.x - this.radius * 0.3,
      this.y - this.radius * 0.3,
      this.radius * 0.25,
      0, Math.PI * 2
    );
    ctx.fillStyle = `rgba(255, 255, 255, 0.6)`;
    ctx.fill();
  
    // ⚪ Thin white edge
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius - 0.5, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, 0.8)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  
    ctx.restore();
  }
  
  
  
  update() {
    if (!this.popped) {
      // Move in direction of angle + random drift
      this.x += Math.cos(this.angle) * this.speed + this.drift;
      this.y += Math.sin(this.angle) * this.speed;
  
      // Keep bubbles inside canvas bounds
      if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
        this.angle = Math.PI - this.angle; // bounce horizontally
      }
      if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
        this.angle = -this.angle; // bounce vertically
      }
    }
  }
  
  
  pop() {
    this.popped = true;
    this.color = 'rgba(255, 255, 255, 0.8)';
    this.radius += 5;
    setTimeout(() => this.reset(), 200);
  }
}

let bubbles = [];
for (let i = 0; i < 50; i++) {
  bubbles.push(new Bubble());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bubbles.forEach(bubble => {
    bubble.update();
    bubble.draw();
  });
  requestAnimationFrame(animate);
}
animate();

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  bubbles.forEach(bubble => {
    const dx = mouseX - bubble.x;
    const dy = mouseY - bubble.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < bubble.radius) {
      bubble.pop();
    }
  });
});
