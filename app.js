import * as THREE from './libs/three.module.js';

// Crear la escena, cámara y renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('bubbles-container').appendChild(renderer.domElement);

// Skybox
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
let currentRotation = 0;
let rotationVelocity = 0;
const rotationSpeed = 0.005;
const dampingFactor = 0.95;
let isRightPressed = false;
let isLeftPressed = false;

window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') isRightPressed = true;
    if (event.key === 'ArrowLeft') isLeftPressed = true;
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowRight') isRightPressed = false;
    if (event.key === 'ArrowLeft') isLeftPressed = false;
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

// Flecha de navegación (HTML)
const arrowElement = document.createElement('img');
arrowElement.src = 'arrow.png';
arrowElement.id = 'nav-arrow';
arrowElement.style.position = 'fixed';
arrowElement.style.top = '50%';
arrowElement.style.left = '50%';
arrowElement.style.transform = 'translate(-50%, -50%)';
arrowElement.style.width = '64px';
arrowElement.style.height = '64px';
arrowElement.style.zIndex = '1000';
arrowElement.style.display = 'none';
document.body.appendChild(arrowElement);

// Direcciones cardinales (unitarios)
const dirs = {
    px: new THREE.Vector3(1, 0, 0),   // derecha
    nx: new THREE.Vector3(-1, 0, 0),  // izquierda
    pz: new THREE.Vector3(0, 0, 1),   // frente
    nz: new THREE.Vector3(0, 0, -1)   // atrás
};

const threshold = 0.95;

function animate() {
    requestAnimationFrame(animate);

    // Rotación con inercia
    if (isRightPressed) rotationVelocity -= rotationSpeed;
    if (isLeftPressed) rotationVelocity += rotationSpeed;
    rotationVelocity *= dampingFactor;
    currentRotation += rotationVelocity;

    camera.position.x = Math.sin(currentRotation) * 20;
    camera.position.z = Math.cos(currentRotation) * 20;
    camera.lookAt(0, 0, 0);

    // Mover burbujas
    bubbles.forEach(bubble => {
        bubble.position.add(bubble.userData.movement);
        bubble.rotation.x += bubble.userData.rotationSpeed.x;
        bubble.rotation.y += bubble.userData.rotationSpeed.y;
        bubble.rotation.z += bubble.userData.rotationSpeed.z;

        if (bubble.position.x > 15 || bubble.position.x < -15) bubble.userData.movement.x *= -1;
        if (bubble.position.y > 15 || bubble.position.y < -15) bubble.userData.movement.y *= -1;
        if (bubble.position.z > 15 || bubble.position.z < -15) bubble.userData.movement.z *= -1;
    });

    // Obtener dirección actual de la cámara
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);

    // Mostrar la flecha si la cámara mira hacia una cara cardinal
    let showArrow = false;
    for (const key in dirs) {
        const alignment = dir.dot(dirs[key]);
        if (alignment > threshold) {
            showArrow = true;

            // Ajustar rotación para centrar mejor cuando está muy alineado
            if (alignment > 0.98) {
                const angleStep = Math.PI / 2; // 90 grados
                currentRotation = Math.round(currentRotation / angleStep) * angleStep;
                camera.position.x = Math.sin(currentRotation) * 20;
                camera.position.z = Math.cos(currentRotation) * 20;
                camera.lookAt(0, 0, 0);
            }

            break;
        }
    }
    arrowElement.style.display = showArrow ? 'block' : 'none';

    renderer.render(scene, camera);
}

animate();
