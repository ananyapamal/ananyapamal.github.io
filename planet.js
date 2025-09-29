// planet.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('planetCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Lighting (for realism)
const ambientLight = new THREE.AmbientLight(0x888888);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Load Mars texture
const textureLoader = new THREE.TextureLoader();
const marsTexture = textureLoader.load('images/2k_mars.jpg');

const geometry = new THREE.SphereGeometry(2, 64, 64);
const material = new THREE.MeshPhongMaterial({
  map: marsTexture
});

const planet = new THREE.Mesh(geometry, material);
planet.position.set(0, 0, 0);   // center planet
camera.position.set(0, 0, 6);   // pull camera back so planet is visible
scene.add(planet);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  planet.rotation.y += 0.002; // slow spin
  renderer.render(scene, camera);
}
animate();