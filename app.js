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

// Crear burbujas
const bubbles = [];
const bubbleGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const bubbleMaterial = new THREE.MeshStandardMaterial({
    color: 0x66ccff,
    transparent: true,
    opacity: 0.6,
    emissive: 0x66ccff,
    emissiveIntensity: 0.4
});

for (let i = 0; i < 20; i++) {
    const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
    bubble.position.set(
        (Math.random() - 0.5) * 10,
        Math.random() * 5,
        (Math.random() - 0.5) * 10
    );
    scene.add(bubble);
    bubbles.push(bubble);
}

// Animar burbujas
function animateBubbles() {
    bubbles.forEach(bubble => {
        bubble.position.y += 0.02;
        if (bubble.position.y > 5) {
            bubble.position.y = -2;
            bubble.position.x = (Math.random() - 0.5) * 10;
            bubble.position.z = (Math.random() - 0.5) * 10;
        }
    });
}

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

    animateBubbles();
    renderer.render(scene, camera);
}

animate();