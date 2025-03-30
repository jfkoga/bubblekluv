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

// Configuración de rotación
let targetRotation = 0;
let currentRotation = 0;
const rotationSpeed = 0.1; // Ajustado para transiciones más suaves
let rotating = false;

// Configuración de movimiento vertical
let targetVerticalPosition = 0;
let currentVerticalPosition = 0;
const verticalSpeed = 0.1; // Ajustado para una transición suave en el eje Y
let movingVertically = false;

// Manejo del teclado para rotar la cámara y moverla verticalmente
window.addEventListener('keydown', (event) => {
    if (rotating || movingVertically) return;

    switch (event.key) {
        case 'ArrowRight':
            targetRotation -= Math.PI / 4;
            rotating = true;
            break;
        case 'ArrowLeft':
            targetRotation += Math.PI / 4;
            rotating = true;
            break;
        case 'ArrowUp':
            targetVerticalPosition = 10; // Mover la cámara hacia arriba
            movingVertically = true;
            break;
        case 'ArrowDown':
            targetVerticalPosition = 0; // Volver al punto inicial
            movingVertically = true;
            break;
    }
});

// Crear burbujas
const numBubbles = 150;
const bubbles = [];
const bubbleSize = 1;

for (let i = 0; i < numBubbles; i++) {
    const geometry = new THREE.SphereGeometry(bubbleSize, 32, 32);
    
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.1,
        transmission: 1,
        thickness: 0.5,
        reflectivity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0,
        transparent: true,
        opacity: 0.7
    });

    const bubble = new THREE.Mesh(geometry, material);

    bubble.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
    );

    bubble.userData = {
        movement: new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
        ),
        rotationSpeed: new THREE.Vector3(
            Math.random() * 0.01,
            Math.random() * 0.01,
            Math.random() * 0.01
        )
    };

    bubbles.push(bubble);
    scene.add(bubble);
}

function animate() {
    requestAnimationFrame(animate);

    // Suavizar la rotación de la cámara
    if (rotating) {
        currentRotation = THREE.MathUtils.lerp(currentRotation, targetRotation, rotationSpeed);

        if (Math.abs(targetRotation - currentRotation) < 0.002) {
            currentRotation = targetRotation;
            rotating = false;
        }

        camera.position.x = Math.sin(currentRotation) * 20;
        camera.position.z = Math.cos(currentRotation) * 20;
        camera.lookAt(0, 0, 0);
    }

    // Suavizar el movimiento vertical de la cámara
    if (movingVertically) {
        currentVerticalPosition = THREE.MathUtils.lerp(currentVerticalPosition, targetVerticalPosition, verticalSpeed);

        if (Math.abs(targetVerticalPosition - currentVerticalPosition) < 0.01) {
            currentVerticalPosition = targetVerticalPosition;
            movingVertically = false;
        }

        camera.position.y = currentVerticalPosition;
    }

    bubbles.forEach(bubble => {
        bubble.position.add(bubble.userData.movement);
        bubble.rotation.x += bubble.userData.rotationSpeed.x;
        bubble.rotation.y += bubble.userData.rotationSpeed.y;
        bubble.rotation.z += bubble.userData.rotationSpeed.z;

        if (bubble.position.x > 15 || bubble.position.x < -15) bubble.userData.movement.x *= -1;
        if (bubble.position.y > 15 || bubble.position.y < -15) bubble.userData.movement.y *= -1;
        if (bubble.position.z > 15 || bubble.position.z < -15) bubble.userData.movement.z *= -1;
    });

    renderer.render(scene, camera);
}

animate();
