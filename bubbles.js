const bubbleCanvas = document.getElementById('bubbleCanvas');
const aboutWrapper = document.getElementById('about-wrapper');
const ctx = bubbleCanvas.getContext('2d');

function resizeCanvas() {
  // Get wrapper size
  const width = aboutWrapper.offsetWidth;
  const height = aboutWrapper.offsetHeight;
  const dpr = window.devicePixelRatio || 1;
  
  // Set canvas size accounting for device pixel ratio
  bubbleCanvas.width = width * dpr;
  bubbleCanvas.height = height * dpr;
  bubbleCanvas.style.width = width + 'px';
  bubbleCanvas.style.height = height + 'px';

  // Scale the context to handle high DPI screens
  ctx.setTransform(1, 0, 0, 1, 0, 0); // reset any existing transform
  ctx.scale(dpr, dpr);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Draw a simple circle to check visibility
ctx.fillStyle = 'rgba(0, 150, 255, 0.5)';
ctx.beginPath();
ctx.arc(50, 50, 40, 0, Math.PI * 2);
ctx.fill();

class Bubble {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * aboutWrapper.offsetWidth;
    this.y = Math.random() * aboutWrapper.offsetHeight;
    this.radius = Math.random() * 20 + 10;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.color = `rgba(173, 216, 230, ${this.opacity})`;
    this.popped = false;
    this.baseHue = Math.random() * 360;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.5 + 0.3;
    this.drift = (Math.random() - 0.5) * 0.4;
  }
  
  draw() {
    // Rainbow refraction gradient
    const now = performance.now();
    const hue = (this.baseHue + now / 50) % 360;
    const rainbow = ctx.createRadialGradient(
      this.x, this.y, this.radius * 0.1,
      this.x, this.y, this.radius
    );
    rainbow.addColorStop(0, `hsla(${hue}, 100%, 90%, 0.2)`);
    rainbow.addColorStop(0.4, `hsla(${(hue + 60) % 360}, 100%, 80%, 0.3)`);
    rainbow.addColorStop(0.8, `hsla(${(hue + 120) % 360}, 100%, 70%, 0.5)`);
    rainbow.addColorStop(1, `hsla(${(hue + 180) % 360}, 100%, 80%, 0.2)`);

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = rainbow;
    ctx.fill();

    // Highlight reflection
    ctx.beginPath();
    ctx.arc(
      this.x - this.radius * 0.3,
      this.y - this.radius * 0.3,
      this.radius * 0.25,
      0, Math.PI * 2
    );
    ctx.fillStyle = `rgba(255, 255, 255, 0.6)`;
    ctx.fill();

    // Thin white edge
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius - 0.5, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, 0.8)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  update() {
    if (!this.popped) {
      this.x += Math.cos(this.angle) * this.speed + this.drift;
      this.y += Math.sin(this.angle) * this.speed;

      // Bounce off edges using current aboutWrapper size
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
const NUM_BUBBLES = 50;

function initBubbles() {
  bubbles = [];
  for (let i = 0; i < NUM_BUBBLES; i++) {
    bubbles.push(new Bubble());
  }
}

initBubbles();

function animate() {
  ctx.clearRect(0, 0, aboutWrapper.offsetWidth, aboutWrapper.offsetHeight);
  bubbles.forEach(bubble => {
    bubble.update();
    bubble.draw();
  });
  requestAnimationFrame(animate);
}

animate();

bubbleCanvas.addEventListener('click', (e) => {
  const rect = bubbleCanvas.getBoundingClientRect();
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
