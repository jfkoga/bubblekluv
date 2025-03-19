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

// Posiciones predefinidas para la cámara
const positions = [
    { x: 20, y: 0, z: 0 },   // Derecha
    { x: -20, y: 0, z: 0 },  // Izquierda
    { x: 0, y: 20, z: 0 },   // Arriba
    { x: 0, y: -20, z: 0 },  // Abajo
    { x: 0, y: 0, z: 20 },   // Frente
    { x: 0, y: 0, z: -20 }   // Atrás
];

let currentPosition = 4; // Iniciar en la posición de frente
let targetPosition = positions[currentPosition]; // Posición objetivo
camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
camera.lookAt(0, 0, 0);

// Velocidad de interpolación de la cámara
const moveSpeed = 0.05;

// Manejo del teclado para mover la cámara
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowRight':
            targetPosition = positions[0]; // Derecha
            break;
        case 'ArrowLeft':
            targetPosition = positions[1]; // Izquierda
            break;
        case 'ArrowUp':
            targetPosition = positions[2]; // Arriba
            break;
        case 'ArrowDown':
            targetPosition = positions[3]; // Abajo
            break;
    }
});

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Interpolación de la cámara hacia la posición objetivo
    camera.position.lerp(targetPosition, moveSpeed);

    // Asegurarse de que la cámara siempre mire al centro (0, 0, 0)
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

animate();
