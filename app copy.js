import * as THREE from './libs/three.module.js';  // Asegúrate de que la ruta sea correcta

// Crear la escena, cámara y renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Activa transparencia
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('bubbles-container').appendChild(renderer.domElement);

// Crear burbujas
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6 });
const bubble = new THREE.Mesh(geometry, material);
scene.add(bubble);

camera.position.z = 5;

// Animación
function animate() {
    requestAnimationFrame(animate);
    bubble.rotation.x += 0.01;
    bubble.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();
