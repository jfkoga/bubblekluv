import * as THREE from './libs/three.module.js';

// Crear la escena, cámara y renderer bubblekluv
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
let rotationVelocity = 0;
const rotationSpeed = 0.1; // Mayor velocidad de rotación
const dampingFactor = 0.9; // Factor de amortiguación

// Manejo del teclado para rotar la cámara
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowRight':
            targetRotation -= Math.PI / 2; // Rotación hacia la derecha
            break;
        case 'ArrowLeft':
            targetRotation += Math.PI / 2; // Rotación hacia la izquierda
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

    // Suavizar la rotación de la cámara con inercia
    if (Math.abs(targetRotation - currentRotation) > 0.001) {
        rotationVelocity = (targetRotation - currentRotation) * dampingFactor; // Hacer que la cámara se mueva hacia el objetivo
        currentRotation += rotationVelocity;

        if (Math.abs(rotationVelocity) < 0.0005) {
            rotationVelocity = 0; // Detener la rotación cuando se haya alcanzado el objetivo
            currentRotation = targetRotation;
        }

        // Actualizar la posición de la cámara en función de la rotación
        camera.position.x = Math.sin(currentRotation) * 20;
        camera.position.z = Math.cos(currentRotation) * 20;
        camera.lookAt(0, 0, 0);
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
