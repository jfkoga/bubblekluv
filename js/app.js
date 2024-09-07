import * as THREE from '../build/three.module.js';

// Configuración de la escena
const scene = new THREE.Scene();

// Configuración de la cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Configuración del renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear las burbujas (esferas)
const bubbles = [];
const bubbleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const bubbleMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });

for (let i = 0; i < 50; i++) {
    const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    bubble.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    );
    bubble.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
    );
    scene.add(bubble);
    bubbles.push(bubble);
}

// Añadir luz a la escena
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

// Animación
function animate() {
    requestAnimationFrame(animate);

    // Actualizar posición de las burbujas
    bubbles.forEach(bubble => {
        bubble.position.add(bubble.velocity);
        if (bubble.position.length() > 5) {
            bubble.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
        }
    });

    renderer.render(scene, camera);
}

animate();

// Ajuste de tamaño en caso de cambio de ventana
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
