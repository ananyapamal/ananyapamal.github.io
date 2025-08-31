// planet.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("planetCanvas"), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// --- Lighting ---
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 0.6); // soft ambient light
scene.add(ambientLight);

// --- Mars Sphere ---
const geometry = new THREE.SphereGeometry(2, 128, 128);

// Use a red-orange material for Mars look
const material = new THREE.MeshPhongMaterial({
  color: 0xd14f3f,        // base Mars red
  shininess: 10,
  specular: 0xaaaaaa,
});

// Optional: add some noise for texture (basic)
const planet = new THREE.Mesh(geometry, material);
scene.add(planet);

// --- Camera position ---
camera.position.z = 6;

// --- Animation ---
function animate() {
  requestAnimationFrame(animate);
  planet.rotation.y += 0.002; // slow rotation
  renderer.render(scene, camera);
}

animate();

// --- Handle window resize ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
