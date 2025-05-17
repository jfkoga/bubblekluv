import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz direccional
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(0, 5, 10);
scene.add(light);

// Luz puntual desde la cámara
const pointLight = new THREE.PointLight(0xffffff, 3);
pointLight.position.set(0, 0, 1);
camera.add(pointLight);

// Cargar modelo
const loader = new GLTFLoader();
loader.load('models/hands/hands.glb', (gltf) => {
  const hands = gltf.scene;
  hands.scale.set(1, 1, 1);
  hands.position.set(0, -1.5, -2);
  hands.rotation.set(0, Math.PI, 0);
  camera.add(hands);
  scene.add(camera);  // ¡Agrega la cámara a la escena!
}, undefined, (error) => {
  console.error('Error al cargar hands.glb', error);
});

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
