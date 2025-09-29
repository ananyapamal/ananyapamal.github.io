// planet.js

// === Scene & Camera ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 6); // pull camera back so planet is visible

// === Renderer ===
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('planetCanvas'),
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

// === Lighting ===
const ambientLight = new THREE.AmbientLight(0x888888); // soft ambient
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// === Planet variable ===
let planet; // will store the sphere mesh

// === Load Mars texture ===
const textureLoader = new THREE.TextureLoader();
textureLoader.load('images/2k_mars.jpg', (marsTexture) => {
  const geometry = new THREE.SphereGeometry(2, 64, 64);
  const material = new THREE.MeshPhongMaterial({
    map: marsTexture
  });

  planet = new THREE.Mesh(geometry, material);
  planet.position.set(0, 1, 0); // lift planet slightly
  scene.add(planet);
});

// === Animate loop ===
function animate() {
  requestAnimationFrame(animate);

  if (planet) planet.rotation.y += 0.002; // rotate only if planet exists

  renderer.render(scene, camera);
}
animate();

// === Handle window resize ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});