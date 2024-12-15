import * as THREE from './libs/three.module.js';

// Crear la escena, cámara y renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('bubbles-container').appendChild(renderer.domElement);

// Variables para cubemaps
const cubemaps = {
    clubEntrance: [
        'textures/skybox/bblklv-clubentrance-01/px.png',
        'textures/skybox/bblklv-clubentrance-01/nx.png',
        'textures/skybox/bblklv-clubentrance-01/py.png',
        'textures/skybox/bblklv-clubentrance-01/ny.png',
        'textures/skybox/bblklv-clubentrance-01/pz.png',
        'textures/skybox/bblklv-clubentrance-01/nz.png'
    ],
    city: [
        'textures/skybox/bblklv-city-01/px.png',
        'textures/skybox/bblklv-city-01/nx.png',
        'textures/skybox/bblklv-city-01/py.png',
        'textures/skybox/bblklv-city-01/ny.png',
        'textures/skybox/bblklv-city-01/pz.png',
        'textures/skybox/bblklv-city-01/nz.png'
    ]
};

let currentCubemap = 'clubEntrance'; // Inicializar con el primer cubemap

// Función para cargar un cubemap
const loader = new THREE.CubeTextureLoader();
function loadCubeMap(name) {
    const textureCube = loader.load(cubemaps[name]);
    scene.background = textureCube;
    currentCubemap = name;
}

// Inicializar el cubemap inicial
loadCubeMap('clubEntrance');

// Crear luces
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Variables para el control del movimiento del ratón
let isMouseDown = false;
let prevMouseX = 0;
let prevMouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
const mouseSensitivity = 0.002;

// Eventos para el desplazamiento del cubemap
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

    const deltaX = event.clientX - prevMouseX;
    const deltaY = event.clientY - prevMouseY;

    const rotationSpeedX = deltaX * mouseSensitivity;
    const rotationSpeedY = deltaY * mouseSensitivity;

    camera.rotation.y -= rotationSpeedX;
    camera.rotation.x -= rotationSpeedY;

    // Limitar la rotación vertical para evitar giros indeseados
    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
});

// Raycaster para detectar clics en el cubemap
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    // Normalizar coordenadas del mouse
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Configurar el raycaster
    raycaster.setFromCamera(mouse, camera);

    // Verificar colisión con el fondo (cubemap)
    const intersects = raycaster.intersectObjects(scene.children, false);

    // Si hay intersección, cambiar al otro cubemap
    if (currentCubemap === 'clubEntrance') {
        loadCubeMap('city');
    } else {
        loadCubeMap('clubEntrance');
    }
});

// Animación y desplazamiento suave
function animate() {
    requestAnimationFrame(animate);

    // Interpolación para el desplazamiento suave cuando no se arrastra el ratón
    if (!isMouseDown) {
        camera.rotation.x += (targetRotationY - camera.rotation.x) * 0.1;
        camera.rotation.y += (targetRotationX - camera.rotation.y) * 0.1;
    }

    renderer.render(scene, camera);
}
animate();

// Ajustar la vista al redimensionar la ventana
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
