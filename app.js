import * as THREE from './libs/three.module.js';

// Crear la escena, cámara y renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('bubbles-container').appendChild(renderer.domElement);

// Crear el cubemap para el skybox (FIJO, sin movimiento)
const loader = new THREE.CubeTextureLoader();
const textureCube = loader.load([
    'textures/skybox/bblklv-clubentrance-01/px.png', // derecha
    'textures/skybox/bblklv-clubentrance-01/nx.png', // izquierda
    'textures/skybox/bblklv-clubentrance-01/py.png', // arriba
    'textures/skybox/bblklv-clubentrance-01/ny.png', // abajo
    'textures/skybox/bblklv-clubentrance-01/pz.png', // frente
    'textures/skybox/bblklv-clubentrance-01/nz.png'  // atrás
]);

scene.background = textureCube;

// Crear luces
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Configuración de rotación
let targetRotation = 0;  // Rotación objetivo en radianes
let currentRotation = 0; // Rotación actual
const rotationSpeed = 0.05; // Velocidad de interpolación
let rotating = false; // Control de estado de rotación

// Manejo del teclado para rotar la cámara
window.addEventListener('keydown', (event) => {
    if (rotating) return; // Si ya está rotando, ignoramos nuevas entradas hasta que termine

    switch (event.key) {
        case 'ArrowRight':
            targetRotation -= Math.PI / 4; // Rotar 45° a la derecha
            rotating = true;
            break;
        case 'ArrowLeft':
            targetRotation += Math.PI / 4; // Rotar 45° a la izquierda
            rotating = true;
            break;
    }
});

// Crear burbujas flotantes
const bubbleGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const bubbleMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, transparent: true, opacity: 0.7 });

const bubbles = [];
const numBubbles = 30;

for (let i = 0; i < numBubbles; i++) {
    const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    bubble.position.set(
        (Math.random() - 0.5) * 50, // Posición X aleatoria
        Math.random() * 10 - 5, // Posición Y aleatoria
        (Math.random() - 0.5) * 50 // Posición Z aleatoria
    );
    scene.add(bubble);
    bubbles.push(bubble);
}

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Si la cámara está en movimiento, interpolamos la rotación
    if (rotating) {
        currentRotation += (targetRotation - currentRotation) * rotationSpeed;

        if (Math.abs(targetRotation - currentRotation) < 0.01) {
            currentRotation = targetRotation;
            rotating = false;
        }

        camera.position.x = Math.sin(currentRotation) * 20;
        camera.position.z = Math.cos(currentRotation) * 20;
        camera.lookAt(0, 0, 0);
    }

    // Animar burbujas flotando
    bubbles.forEach(bubble => {
        bubble.position.y += 0.02; // Mover burbuja hacia arriba
        if (bubble.position.y > 5) {
            bubble.position.y = -5; // Reiniciar la posición cuando salga de la vista
        }
    });

    renderer.render(scene, camera);
}

animate();

// -------------------------
//      AUDIO PLAYER
// -------------------------
const audio = new Audio();
audio.src = 'audio/bubblekluv-waitforme.mp3';
audio.loop = true;
audio.volume = 0.5;

// Verificar que el navegador permita la reproducción
document.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().catch(error => console.error("Error al reproducir audio:", error));
    }
}, { once: true });

const playButton = document.createElement('button');
playButton.innerText = '▶️ Play';
playButton.style.position = 'fixed';
playButton.style.bottom = '20px';
playButton.style.right = '20px';
playButton.style.width = '90px';
playButton.style.height = '90px';
playButton.style.borderRadius = '50%';
playButton.style.fontSize = '18px';
playButton.style.border = 'none';
playButton.style.background = 'rgba(0, 0, 0, 0.8)';
playButton.style.color = 'white';
playButton.style.cursor = 'pointer';
playButton.style.boxShadow = '0px 0px 10px rgba(255, 255, 255, 0.5)';

// Control de reproducción
let isPlaying = false;
playButton.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playButton.innerText = '▶️ Play';
    } else {
        audio.play().catch(error => console.error("Error al iniciar audio:", error));
        playButton.innerText = '⏸ Pause';
    }
    isPlaying = !isPlaying;
});

document.body.appendChild(playButton);
