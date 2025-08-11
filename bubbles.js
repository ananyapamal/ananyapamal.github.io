const canvas = document.getElementById('bubbleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

class Bubble {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;
    this.radius = Math.random() * 20 + 10;
    this.speed = Math.random() * 1 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.color = `rgba(173, 216, 230, ${this.opacity})`;
    this.popped = false;
  }
  
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  
  update() {
    if (!this.popped) {
      this.y -= this.speed;
      if (this.y + this.radius < 0) {
        this.reset();
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
