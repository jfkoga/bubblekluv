import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';

// Escena, cámara y renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('bubbles-container').appendChild(renderer.domElement);

// Controles de órbita (opcional)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Skybox
const loader = new THREE.CubeTextureLoader();
const textureCube = loader.load([
  'textures/skybox/bblklv-clubentrance-01/px.png',
  'textures/skybox/bblklv-clubentrance-01/nx.png',
  'textures/skybox/bblklv-clubentrance-01/py.png',
  'textures/skybox/bblklv-clubentrance-01/ny.png',
  'textures/skybox/bblklv-clubentrance-01/pz.png',
  'textures/skybox/bblklv-clubentrance-01/nz.png'
]);
scene.background = textureCube;

// Luces
const directionalLight = new THREE.DirectionalLight(0xffffff, 6);
directionalLight.position.set(0, 2, 2).normalize();
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
hemiLight.position.set(0, 5, 0);
scene.add(hemiLight);

// Variables de rotación de cámara
let currentRotation = 0;
let rotationVelocity = 0;
const rotationSpeed = 0.005;
const dampingFactor = 0.95;
let isRightPressed = false;
let isLeftPressed = false;

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') isRightPressed = true;
  if (event.key === 'ArrowLeft') isLeftPressed = true;
});
window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowRight') isRightPressed = false;
  if (event.key === 'ArrowLeft') isLeftPressed = false;
});

// Crear burbujas
const numBubbles = 150;
const bubbles = [];

for (let i = 0; i < numBubbles; i++) {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.1,
    transmission: 1,
    thickness: 0.5,
    reflectivity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0,
    transparent: true,
    opacity: 0.7
  });
  const bubble = new THREE.Mesh(geometry, material);
  bubble.position.set(
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 30
  );
  bubble.userData = {
    movement: new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02
    ),
    rotationSpeed: new THREE.Vector3(
      Math.random() * 0.01,
      Math.random() * 0.01,
      Math.random() * 0.01
    )
  };
  bubbles.push(bubble);
  scene.add(bubble);
}

// Cargar modelo de manos
const gltfLoader = new GLTFLoader();
let hands;

gltfLoader.load(
  'models/hands/hands.glb',
  (gltf) => {
    hands = gltf.scene;
    hands.scale.set(1, 1, 1);
    hands.position.set(0, -2, -5); // Frente a la cámara
    camera.add(hands);

    // Añadir una luz puntual desde la cámara
    const pointLight = new THREE.PointLight(0xffffff, 3);
    pointLight.position.set(0, 0, 1);
    camera.add(pointLight);

    scene.add(camera); // Añadir la cámara a la escena después de agregar las manos y la luz
  },
  undefined,
  (error) => {
    console.error('Error al cargar modelo GLB:', error);
  }
);

// Animación
function animate() {
  requestAnimationFrame(animate);

  // Movimiento de cámara
  if (isRightPressed) rotationVelocity -= rotationSpeed;
  if (isLeftPressed) rotationVelocity += rotationSpeed;
  rotationVelocity *= dampingFactor;
  currentRotation += rotationVelocity;

  camera.position.x = Math.sin(currentRotation) * 20;
  camera.position.z = Math.cos(currentRotation) * 20;
  camera.lookAt(0, 0, 0);

  // Movimiento burbujas
  bubbles.forEach((bubble) => {
    bubble.position.add(bubble.userData.movement);
    bubble.rotation.x += bubble.userData.rotationSpeed.x;
    bubble.rotation.y += bubble.userData.rotationSpeed.y;
    bubble.rotation.z += bubble.userData.rotationSpeed.z;

    if (bubble.position.x > 15 || bubble.position.x < -15)
      bubble.userData.movement.x *= -1;
    if (bubble.position.y > 15 || bubble.position.y < -15)
      bubble.userData.movement.y *= -1;
    if (bubble.position.z > 15 || bubble.position.z < -15)
      bubble.userData.movement.z *= -1;
  });

  controls.update(); // Actualizar controles de órbita
  renderer.render(scene, camera);
}

animate();
