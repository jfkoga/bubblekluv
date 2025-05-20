import * as THREE from './libs/three.module.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { FBXLoader } from './libs/FBXLoader.js';

// Escena y cámara
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);

// Render
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

// Controles
const controls = new OrbitControls(camera, renderer.domElement);

// FBXLoader para las manos
const loader = new FBXLoader();
loader.load('./models/hands/hands.fbx', function (object) {
  object.scale.set(0.01, 0.01, 0.01); // ajusta según necesidad
  object.position.set(0, 0, 0);
  scene.add(object);
}, undefined, function (error) {
  console.error('Error al cargar FBX:', error);
});

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animación
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
