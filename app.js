import * as THREE from './libs/three.module.js';  // Asegúrate de que la ruta sea correcta

// Crear la escena, cámara y renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Activa transparencia
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('bubbles-container').appendChild(renderer.domElement);

// Crear burbujas
const numBubbles = 100; // Número de burbujas
const bubbles = [];

for (let i = 0; i < numBubbles; i++) {
    const geometry = new THREE.SphereGeometry(Math.random() * 0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6 });
    const bubble = new THREE.Mesh(geometry, material);

    // Posicionar burbujas aleatoriamente
    bubble.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    );

    bubbles.push(bubble);
    scene.add(bubble);
}

camera.position.z = 5;

// Animación
function animate() {
    requestAnimationFrame(animate);

    // Girar todas las burbujas
    bubbles.forEach(bubble => {
        bubble.rotation.x += 0.01;
        bubble.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
}

animate();
