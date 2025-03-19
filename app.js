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
camera.position.set(positions[currentPosition].x, positions[currentPosition].y, positions[currentPosition].z);
camera.lookAt(0, 0, 0);

// Manejo del teclado para mover la cámara
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowRight':
            currentPosition = 0; // Derecha
            break;
        case 'ArrowLeft':
            currentPosition = 1; // Izquierda
            break;
        case 'ArrowUp':
            currentPosition = 2; // Arriba
            break;
        case 'ArrowDown':
            currentPosition = 3; // Abajo
            break;
    }
    
    camera.position.set(positions[currentPosition].x, positions[currentPosition].y, positions[currentPosition].z);
    camera.lookAt(0, 0, 0);
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
