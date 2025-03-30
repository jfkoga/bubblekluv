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

// Crear luces con más intensidad
const light = new THREE.DirectionalLight(0xffffff, 6);
light.position.set(0, 2, 2).normalize();
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
hemiLight.position.set(0, 5, 0);
scene.add(hemiLight);

// Configuración de rotación con inercia
let targetRotation = 0; // Ángulo de rotación objetivo
let currentRotation = 0; // Ángulo de rotación actual
let rotationVelocity = 0; // Velocidad de rotación acumulada
const rotationSpeed = 0.005; // Velocidad de rotación controlable
const dampingFactor = 0.95; // Factor de amortiguación para suavizar el movimiento

// Indicadores de teclas presionadas
let isRightPressed = false;
let isLeftPressed = false;

// Manejo del teclado para rotar la cámara
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        isRightPressed = true;
    } else if (event.key === 'ArrowLeft') {
        isLeftPressed = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowRight') {
        isRightPressed = false;
    } else if (event.key === 'ArrowLeft') {
        isLeftPressed = false;
    }
});

function animate() {
    requestAnimationFrame(animate);

    // Controlar la rotación cuando se mantiene presionada una tecla
    if (isRightPressed) {
        rotationVelocity -= rotationSpeed; // Desplazamiento hacia la derecha
    } 
    if (isLeftPressed) {
        rotationVelocity += rotationSpeed; // Desplazamiento hacia la izquierda
    }

    // Aplicar amortiguación para suavizar la rotación
    rotationVelocity *= dampingFactor;

    // Aplicar la rotación de la cámara
    currentRotation += rotationVelocity;

    // Actualizar la posición de la cámara en función de la rotación
    camera.position.x = Math.sin(currentRotation) * 20;
    camera.position.z = Math.cos(currentRotation) * 20;
    camera.lookAt(0, 0, 0);

    // Renderizar la escena
    renderer.render(scene, camera);
}

animate();
