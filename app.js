import * as THREE from './libs/three.module.js';
import * as TWEEN from './libs/tween.umd.js'; // Asegúrate de tener este archivo en 'libs/'

// Crear la escena, cámara y renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('bubbles-container').appendChild(renderer.domElement);

// Crear el cubemap para el skybox
const loader = new THREE.CubeTextureLoader().setPath('textures/skybox/bblklv-clubentrance-01/');
const textureCube = loader.load([
    'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'
]);
scene.background = textureCube;

// Crear luces
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Posicionar la cámara
camera.position.z = 20;

// Movimiento automático entre cubemaps
const cubemapPositions = [
    new THREE.Vector3(10, 0, 0),  // Derecha
    new THREE.Vector3(-10, 0, 0), // Izquierda
    new THREE.Vector3(0, 10, 0),  // Arriba
    new THREE.Vector3(0, -10, 0), // Abajo
    new THREE.Vector3(0, 0, 10),  // Adelante
    new THREE.Vector3(0, 0, -10)  // Atrás
];

let currentPositionIndex = 0;

function moveCamera(direction) {
    currentPositionIndex += direction;
    if (currentPositionIndex < 0) currentPositionIndex = cubemapPositions.length - 1;
    if (currentPositionIndex >= cubemapPositions.length) currentPositionIndex = 0;

    new TWEEN.Tween(camera.position)
        .to(cubemapPositions[currentPositionIndex], 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
}

window.addEventListener('mousedown', (event) => {
    if (event.clientX > window.innerWidth / 2) {
        moveCamera(1); // Mover a la derecha
    } else {
        moveCamera(-1); // Mover a la izquierda
    }
});

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
