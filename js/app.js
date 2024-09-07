// Importar Three.js y los módulos necesarios desde un CDN confiable
import * as THREE from 'https://unpkg.com/three@0.150.0/build/three.module.js';
import { ParallaxBarrierEffect } from 'https://unpkg.com/three@0.150.0/examples/jsm/effects/ParallaxBarrierEffect.js';

// Configuración de la escena
const scene = new THREE.Scene();

// Configuración de la cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Configuración del renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear burbujas (esferas)
const bubbles = [];
const bubbleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const bubbleMaterial = new THREE.MeshPhongMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6 });

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

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);

// Configurar el efecto Parallax Barrier
const effect = new ParallaxBarrierEffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Actualizar la posición de las burbujas
    bubbles.forEach(bubble => {
        bubble.position.add(bubble.velocity);

        // Reposicionar la burbuja si se sale de los límites
        if (bubble.position.length() > 5) {
            bubble.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
        }
    });

    // Renderizar la escena con el efecto Parallax Barrier
    effect.render(scene, camera);
}

animate();

// Ajustar el tamaño del renderizador si se cambia el tamaño de la ventana
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    effect.setSize(width, height);
});

