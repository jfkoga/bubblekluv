// app.js (versión modificada con VideoTexture sobre un plano 3D)

import * as THREE from './libs/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('bubbles-container').appendChild(renderer.domElement);

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
const light = new THREE.DirectionalLight(0xffffff, 6);
light.position.set(0, 2, 2).normalize();
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 1.2));
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.5));

// Cámara
camera.position.z = 20;

// Burbujas (simplificadas para demo)
const bubbles = [];
const bubbleGeometry = new THREE.SphereGeometry(1, 16, 16);
const bubbleMaterial = new THREE.MeshPhysicalMaterial({
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
for (let i = 0; i < 50; i++) {
  const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
  bubble.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30);
  scene.add(bubble);
  bubbles.push(bubble);
}

// Crear video DOM y textura
const video = document.createElement('video');
video.src = 'video.mp4'; // archivo en el proyecto
video.crossOrigin = 'anonymous';
video.loop = true;
video.muted = true;
video.play();

const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBFormat;

// Plano que simula una pantalla de móvil
const screenGeometry = new THREE.PlaneGeometry(4, 2.5);
const screenMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
const screen = new THREE.Mesh(screenGeometry, screenMaterial);
screen.position.set(0, -1.5, -5);
scene.add(screen);

// Movimiento cámara (con teclas)
let rotation = 0;
let velocity = 0;
let left = false;
let right = false;
const damping = 0.95;
const speed = 0.01;

window.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') left = true;
  if (e.key === 'ArrowRight') right = true;
});
window.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft') left = false;
  if (e.key === 'ArrowRight') right = false;
});

function animate() {
  requestAnimationFrame(animate);

  if (left) velocity += speed;
  if (right) velocity -= speed;

  velocity *= damping;
  rotation += velocity;

  camera.position.x = Math.sin(rotation) * 20;
  camera.position.z = Math.cos(rotation) * 20;
  camera.lookAt(0, 0, 0);

  bubbles.forEach(b => {
    b.rotation.x += 0.002;
    b.rotation.y += 0.002;
  });

  renderer.render(scene, camera);
}

animate();
