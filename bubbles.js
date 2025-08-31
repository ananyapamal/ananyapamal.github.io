// bubbles.js

const canvas = document.getElementById("bubbleCanvas");
const ctx = canvas.getContext("2d");

// Make canvas fill its container
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Bubble class
class Bubble {
  constructor(x, y, r, speed) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speed = speed;
    this.opacity = 0.5;   // normal opacity
    this.popped = false;
    this.fade = false;
  }

  draw() {
    if (this.popped && !this.fade) return; // fully popped
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(135,206,235,${this.opacity})`;
    ctx.fill();
  }

  update() {
    if (this.popped) {
      if (this.fade) {
        this.opacity -= 0.05;
        if (this.opacity <= 0) {
          this.fade = false;
        }
      }
      return;
    }

    this.y -= this.speed;
    if (this.y + this.r < 0) {
      this.y = canvas.height + this.r; // wrap to bottom
      this.x = Math.random() * canvas.width;
    }
  }

  isClicked(mx, my) {
    const dx = this.x - mx;
    const dy = this.y - my;
    return Math.sqrt(dx*dx + dy*dy) < this.r;
  }

  pop() {
    this.popped = true;
    this.fade = true;
    // Optional: play pop sound here
  }
}

// Create bubbles
const bubbles = [];
for (let i = 0; i < 30; i++) {
  bubbles.push(
    new Bubble(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      20 + Math.random()*10,
      0.5 + Math.random() * 1.5
    )
  );
}

// Animate bubbles
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bubbles.forEach(b => {
    b.update();
    b.draw();
  });
  requestAnimationFrame(animate);
}
animate();

// Click-to-pop
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  bubbles.forEach(b => {
    if (!b.popped && b.isClicked(mx, my)) {
      b.pop();
    }
  });
});
