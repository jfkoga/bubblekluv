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

// Crear burbujas
const numBubbles = 100; // Número de burbujas
const bubbles = [];
const bubbleSize = 1;

for (let i = 0; i < numBubbles; i++) {
    const geometry = new THREE.SphereGeometry(bubbleSize, 32, 32);
    
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.1,
        transmission: 1,  // Hacer el material transparente
        thickness: 0.5,   // Controla el grosor de la burbuja para efectos de refracción
        reflectivity: 1,
        clearcoat: 1,     // Efecto de brillo externo
        clearcoatRoughness: 0,
        transparent: true,
        opacity: 0.6
    });

    const bubble = new THREE.Mesh(geometry, material);

    // Posicionar burbujas aleatoriamente
    bubble.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
    );

    // Añadir movimiento de rotación y traslación
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

    // Si la cámara está en movimiento, interpolamos la rotación
    if (rotating) {
        currentRotation += (targetRotation - currentRotation) * rotationSpeed;

        // Si la diferencia es menor a un umbral, finalizamos la interpolación
        if (Math.abs(targetRotation - currentRotation) < 0.01) {
            currentRotation = targetRotation;
            rotating = false; // Finaliza el movimiento
        }

        // Aplicamos la rotación a la cámara
        camera.position.x = Math.sin(currentRotation) * 20;
        camera.position.z = Math.cos(currentRotation) * 20;
        camera.lookAt(0, 0, 0);
    }

    // Actualizar el movimiento y rotación de las burbujas
    bubbles.forEach(bubble => {
        bubble.position.add(bubble.userData.movement);
        bubble.rotation.x += bubble.userData.rotationSpeed.x;
        bubble.rotation.y += bubble.userData.rotationSpeed.y;
        bubble.rotation.z += bubble.userData.rotationSpeed.z;
    });

    renderer.render(scene, camera);
}

animate();
