// planet.js — 3D Mars with steady rotation

const planetCanvas = document.getElementById('planetCanvas');
const container = planetCanvas.parentElement;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.set(0, 0, 6);

const renderer = new THREE.WebGLRenderer({
  canvas: planetCanvas,
  alpha: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

let planet = null;

const textureLoader = new THREE.TextureLoader();
textureLoader.load(
  'images/2k_mars.jpg',
  marsTexture => {
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const material = new THREE.MeshPhongMaterial({ map: marsTexture, shininess: 5 });
    planet = new THREE.Mesh(geometry, material);
    planet.position.set(0, 0, 0);
    scene.add(planet);
  },
  undefined,
  err => console.error('Error loading texture', err)
);

function updateCamera() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  if (!width || !height) return;

  const aspect = width / height;
  camera.aspect = aspect;

  const radius = 2;
  const fov = (camera.fov * Math.PI) / 180;
  const fill = 0.72;
  const distHeight = radius / (Math.tan(fov / 2) * fill);
  const distWidth = radius / (Math.tan(Math.atan(Math.tan(fov / 2) * aspect)) * fill);
  camera.position.z = Math.max(distHeight, distWidth);

  camera.updateProjectionMatrix();
}

function resize() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  if (!width || !height) return;

  renderer.setSize(width, height, false);
  planetCanvas.style.width = width + 'px';
  planetCanvas.style.height = height + 'px';
  updateCamera();
}

function animatePlanet() {
  requestAnimationFrame(animatePlanet);
  if (planet) {
    planet.rotation.y += 0.002;
  }
  renderer.render(scene, camera);
}

window.addEventListener('resize', resize);

if (typeof ResizeObserver !== 'undefined') {
  new ResizeObserver(resize).observe(container);
}

window.addEventListener('load', resize);
resize();
animatePlanet();
