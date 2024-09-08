import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.module.js';
import { StereoEffect } from 'https://cdn.jsdelivr.net/npm/three@0.150.0/examples/jsm/effects/StereoEffect.js';

// Configuración básica de la escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const effect = new StereoEffect(renderer);

// Crear geometría y material para la esfera
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Añadir una luz
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

function animate() {
    requestAnimationFrame(animate);

    // Animar la esfera
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    effect.render(scene, camera);
}

animate();

// Ajustar el tamaño del renderizador al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

