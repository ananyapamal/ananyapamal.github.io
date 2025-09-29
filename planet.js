// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 6); // pull camera back

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('planetCanvas'),
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Lighting
const ambientLight = new THREE.AmbientLight(0x888888);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Planet
const textureLoader = new THREE.TextureLoader();
textureLoader.load('images/2k_mars.jpg',
  (marsTexture) => {
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const material = new THREE.MeshPhongMaterial({ map: marsTexture });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(0, 0, 0); // center it
    scene.add(planet);

    // Animate
    function animate() {
      requestAnimationFrame(animate);
      planet.rotation.y += 0.002;
      renderer.render(scene, camera);
    }
    animate();
  },
  undefined,
  (err) => { console.error('Error loading texture', err); }
);

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
