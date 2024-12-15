import * as THREE from './libs/three.module.js';

// Crear la escena, cámara y renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('bubbles-container').appendChild(renderer.domElement);

// Crear el cubemap para el skybox
const loader = new THREE.CubeTextureLoader();
loader.setPath('textures/skybox/');

// Cargar las texturas del primer cubemap
const initialTextureCube = loader.load([
    'textures/skybox/bblklv-clubentrance-01/px.png',
    'textures/skybox/bblklv-clubentrance-01/nx.png',
    'textures/skybox/bblklv-clubentrance-01/py.png',
    'textures/skybox/bblklv-clubentrance-01/ny.png',
    'textures/skybox/bblklv-clubentrance-01/pz.png',
    'textures/skybox/bblklv-clubentrance-01/nz.png'
]);

scene.background = initialTextureCube;

// Agregar un cubo de depuración para verificar orientación de texturas
const geometry = new THREE.BoxGeometry(1, 1, 1);
const materials = [
    new THREE.MeshBasicMaterial({ map: loader.load('textures/skybox/bblklv-clubentrance-01/px.png') }),
    new THREE.MeshBasicMaterial({ map: loader.load('textures/skybox/bblklv-clubentrance-01/nx.png') }),
    new THREE.MeshBasicMaterial({ map: loader.load('textures/skybox/bblklv-clubentrance-01/py.png') }),
    new THREE.MeshBasicMaterial({ map: loader.load('textures/skybox/bblklv-clubentrance-01/ny.png') }),
    new THREE.MeshBasicMaterial({ map: loader.load('textures/skybox/bblklv-clubentrance-01/pz.png') }),
    new THREE.MeshBasicMaterial({ map: loader.load('textures/skybox/bblklv-clubentrance-01/nz.png') })
];
const cube = new THREE.Mesh(geometry, materials);
cube.scale.set(10, 10, 10); // Escalar para ver cómo encajan las texturas.
scene.add(cube);

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
        transmission: 1,
        thickness: 0.5,
        reflectivity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0,
        transparent: true,
        opacity: 0.6
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
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
});

window.addEventListener('mouseup', () => {
    isMouseDown = false;
    targetRotationX = camera.rotation.y;
    targetRotationY = camera.rotation.x;
});

window.addEventListener('mousemove', (event) => {
    if (!isMouseDown) return;

    currentMouseX = event.clientX;
    currentMouseY = event.clientY;

    const deltaX = currentMouseX - prevMouseX;
    const deltaY = currentMouseY - prevMouseY;

    const rotationSpeedX = deltaX * mouseSensitivity;
    const rotationSpeedY = deltaY * mouseSensitivity;

    camera.rotation.y -= rotationSpeedX;
    camera.rotation.x -= rotationSpeedY;

    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

    prevMouseX = currentMouseX;
    prevMouseY = currentMouseY;
});

// Cambiar cubemap al hacer clic
document.addEventListener('click', () => {
    const newTextureCube = loader.load([
        'textures/skybox/bblklv-city-01/px.png',
        'textures/skybox/bblklv-city-01/nx.png',
        'textures/skybox/bblklv-city-01/py.png',
        'textures/skybox/bblklv-city-01/ny.png',
        'textures/skybox/bblklv-city-01/pz.png',
        'textures/skybox/bblklv-city-01/nz.png'
    ]);
    scene.background = newTextureCube;
});

function animate() {
    requestAnimationFrame(animate);

    if (!isMouseDown) {
        camera.rotation.x += (targetRotationY - camera.rotation.x) * 0.1;
        camera.rotation.y += (targetRotationX - camera.rotation.y) * 0.1;
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

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
