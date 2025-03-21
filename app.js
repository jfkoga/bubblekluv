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
    'textures/skybox/bblklv-clubentrance-01/px.png',
    'textures/skybox/bblklv-clubentrance-01/nx.png',
    'textures/skybox/bblklv-clubentrance-01/py.png',
    'textures/skybox/bblklv-clubentrance-01/ny.png',
    'textures/skybox/bblklv-clubentrance-01/pz.png',
    'textures/skybox/bblklv-clubentrance-01/nz.png'
]);
scene.background = textureCube;

// Crear luces
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Configuración de rotación
let targetRotation = 0;
let currentRotation = 0;
const rotationSpeed = 0.1;
let rotating = false;

window.addEventListener('keydown', (event) => {
    if (rotating) return;
    switch (event.key) {
        case 'ArrowRight':
            targetRotation -= Math.PI / 4;
            rotating = true;
            break;
        case 'ArrowLeft':
            targetRotation += Math.PI / 4;
            rotating = true;
            break;
    }
});

function animate() {
    requestAnimationFrame(animate);
    if (rotating) {
        let delta = (targetRotation - currentRotation) * rotationSpeed;
        if (Math.abs(delta) < 0.002) {
            currentRotation = targetRotation;
            rotating = false;
        } else {
            delta *= 0.9; // Hace la última parte del movimiento más suave
            currentRotation += delta;
        }
        camera.position.x = Math.sin(currentRotation) * 20;
        camera.position.z = Math.cos(currentRotation) * 20;
        camera.lookAt(0, 0, 0);
    }
    renderer.render(scene, camera);
}
animate();
