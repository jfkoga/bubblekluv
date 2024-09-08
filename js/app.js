// Importar Three.js y los módulos necesarios desde el CDN de jsdelivr
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.module.js';
import { StereoEffect } from 'https://cdn.jsdelivr.net/npm/three@0.150.0/examples/jsm/effects/StereoEffect.js';

// Crear una escena
const scene = new THREE.Scene();

// Crear una cámara
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Crear el renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear el efecto stereo
const effect = new StereoEffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Crear geometría y material para las esferas
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

// Añadir varias esferas a la escena
for (let i = 0; i < 100; i++) {
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
    );
    scene.add(sphere);
}

// Añadir una luz ambiental
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Animar la escena
function animate() {
    requestAnimationFrame(animate);

    // Girar la cámara lentamente para crear un efecto visual
    camera.rotation.y += 0.002;

    // Renderizar la escena con el efecto stereo
    effect.render(scene, camera);
}

animate();

// Ajustar el tamaño de la escena si se cambia el tamaño de la ventana
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    effect.setSize(width, height);
});
