import * as THREE from './libs/three.module.js';

// Crear la escena, cámara y renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('bubbles-container').appendChild(renderer.domElement);

// Crear el cubemap para el skybox
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

// Luces
const light = new THREE.DirectionalLight(0xffffff, 6);
light.position.set(0, 2, 2).normalize();
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
hemiLight.position.set(0, 5, 0);
scene.add(hemiLight);

// Variables de rotación
let targetRotation = 0;
let currentRotation = 0;
const rotationSpeed = 0.05;
let rotating = false;

// Manejo del teclado
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

// Detección del mouse sobre la puerta en nx.png
window.addEventListener('mousemove', (event) => {
    const mouse = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
    };
    
    // Definir coordenadas aproximadas de la puerta en nx.png (ajustar según sea necesario)
    const doorBounds = {
        xMin: -0.2, xMax: 0.2, // Posiciones X normalizadas de la puerta
        yMin: -0.5, yMax: 0 // Posiciones Y normalizadas de la puerta
    };

    if (mouse.x > doorBounds.xMin && mouse.x < doorBounds.xMax && 
        mouse.y > doorBounds.yMin && mouse.y < doorBounds.yMax) {
        document.body.style.cursor = 'pointer'; // Cambiar cursor al pasar por la puerta
    } else {
        document.body.style.cursor = 'default';
    }
});

// Animación
function animate() {
    requestAnimationFrame(animate);

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

    renderer.render(scene, camera);
}

animate();
