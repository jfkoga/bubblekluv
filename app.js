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
    'textures/skybox/bblklv-clubentrance-01/px.png', // derecha
    'textures/skybox/bblklv-clubentrance-01/nx.png', // izquierda
    'textures/skybox/bblklv-clubentrance-01/py.png', // arriba
    'textures/skybox/bblklv-clubentrance-01/ny.png', // abajo
    'textures/skybox/bblklv-clubentrance-01/pz.png', // frente
    'textures/skybox/bblklv-clubentrance-01/nz.png'  // atrás
]);

// Establecer el fondo de la escena con el cubemap
scene.background = textureCube;

// Crear luces para dar realismo
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // Luz suave ambiental
scene.add(ambientLight);

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

// Posicionar la cámara
camera.position.z = 20;

// Variables para el control del movimiento del ratón
let isMouseDown = false;
let prevMouseX = 0;
let prevMouseY = 0;
let currentMouseX = 0;
let currentMouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
const mouseSensitivity = 0.002;

window.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    
    // Al hacer clic, establecer el objetivo de rotación a la posición actual
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
});

window.addEventListener('mouseup', () => {
    isMouseDown = false;

    // Actualizar las rotaciones objetivo a la posición actual de la cámara
    targetRotationX = camera.rotation.y;
    targetRotationY = camera.rotation.x;
});

window.addEventListener('mousemove', (event) => {
    if (!isMouseDown) return;

    // Obtener la posición actual del ratón
    currentMouseX = event.clientX;
    currentMouseY = event.clientY;

    // Calcular las diferencias entre la posición actual y la anterior
    const deltaX = currentMouseX - prevMouseX;
    const deltaY = currentMouseY - prevMouseY;

    // Ajustar la rotación de la cámara en función del movimiento del ratón mientras se mantiene presionado el botón
    const rotationSpeedX = deltaX * mouseSensitivity;
    const rotationSpeedY = deltaY * mouseSensitivity;

    camera.rotation.y -= rotationSpeedX;
    camera.rotation.x -= rotationSpeedY;

    // Restringir la rotación vertical para evitar que la cámara se dé la vuelta
    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

    // Actualizar las posiciones previas del ratón para el siguiente cuadro
    prevMouseX = currentMouseX;
    prevMouseY = currentMouseY;
});

function animate() {
    requestAnimationFrame(animate);

    // Interpolar suavemente hacia la nueva rotación objetivo al hacer clic
    if (!isMouseDown) {
        camera.rotation.x += (targetRotationY - camera.rotation.x) * 0.1;
        camera.rotation.y += (targetRotationX - camera.rotation.y) * 0.1;
    }

    // Actualizar el movimiento y rotación de las burbujas
    bubbles.forEach(bubble => {
        bubble.position.add(bubble.userData.movement);
        bubble.rotation.x += bubble.userData.rotationSpeed.x;
        bubble.rotation.y += bubble.userData.rotationSpeed.y;
        bubble.rotation.z += bubble.userData.rotationSpeed.z;

        // Rebotar burbujas en los límites
        if (bubble.position.x > 15 || bubble.position.x < -15) bubble.userData.movement.x *= -1;
        if (bubble.position.y > 15 || bubble.position.y < -15) bubble.userData.movement.y *= -1;
        if (bubble.position.z > 15 || bubble.position.z < -15) bubble.userData.movement.z *= -1;
    });

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


document.addEventListener('DOMContentLoaded', function() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const audio = document.getElementById('audio');
    
    playPauseBtn.addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            playPauseBtn.textContent = 'Pause';
        } else {
            audio.pause();
            playPauseBtn.textContent = 'Play';
        }
    });
});
