
// Importar Three.js y los módulos necesarios desde el CDN
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.module.js';
import { StereoEffect } from 'https://cdn.jsdelivr.net/npm/three@0.150.0/examples/jsm/effects/StereoEffect.js';

// Configuración de la escena
const scene = new THREE.Scene();

// Crear una cámara
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Crear un renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Configurar el efecto stereo
const effect = new StereoEffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Crear algunos objetos en la escena (esferas flotantes)
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

for (let i = 0; i < 100; i++) {
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
    );
    scene.add(sphere);
}

// Luz ambiental
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Animar la escena
function animate() {
    requestAnimationFrame(animate);

    // Rotar la cámara lentamente para un efecto visual
    camera.rotation.y += 0.002;

    // Renderizar la escena con el efecto stereo
    effect.render(scene, camera);
}

animate();

// Ajustar el tamaño si la ventana cambia de tamaño
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    effect.setSize(width, height);
});

