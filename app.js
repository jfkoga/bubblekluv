import * as THREE from './libs/three.module.js';

// Crear la escena, cámara y renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('bubbles-container').appendChild(renderer.domElement);

// Crear el video de fondo
const video = document.createElement('video');
video.src = 'textures/background.mp4';
video.autoplay = true;
video.loop = true;
video.muted = true;
video.play();
video.crossOrigin = 'anonymous'; // Para evitar problemas de CORS

const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBFormat;

// Crear burbujas
const numBubbles = 100; // Número de burbujas
const bubbles = [];
const bubbleSize = 1;

for (let i = 0; i < numBubbles; i++) {
    const geometry = new THREE.SphereGeometry(bubbleSize, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: 0x87CEEB, // Color azul claro
        transparent: true,
        opacity: 0.6,
        emissive: 0x00ffff, // Color de emisión azul para un brillo sutil
        emissiveIntensity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false // No escribir en el buffer de profundidad
    });
    const bubble = new THREE.Mesh(geometry, material);

    // Posicionar burbujas aleatoriamente
    bubble.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
    );

    // Añadir un movimiento suave a las burbujas
    bubble.userData = {
        movement: new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize().multiplyScalar(0.02)
    };

    bubbles.push(bubble);
    scene.add(bubble);
}

camera.position.z = 20;

function animate() {
    requestAnimationFrame(animate);

    // Actualizar el movimiento de las burbujas
    bubbles.forEach(bubble => {
        bubble.position.add(bubble.userData.movement);

        // Rebotar burbujas en los límites
        if (bubble.position.x > 15 || bubble.position.x < -15) bubble.userData.movement.x *= -1;
        if (bubble.position.y > 15 || bubble.position.y < -15) bubble.userData.movement.y *= -1;
        if (bubble.position.z > 15 || bubble.position.z < -15) bubble.userData.movement.z *= -1;
    });

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
