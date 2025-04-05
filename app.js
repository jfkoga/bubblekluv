// Crear la escena, cámara y renderer bubbles
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
let rotationVelocity = 0; // Velocidad de rotación acumulada
const rotationSpeed = 0.005; // Velocidad de rotación controlable
const dampingFactor = 0.95; // Factor de amortiguación para suavizar el movimiento

// Indicadores de teclas presionadas
let isRightPressed = false;
let isLeftPressed = false;

// Manejo del teclado para rotar la cámara
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        isRightPressed = true;
    } else if (event.key === 'ArrowLeft') {
        isLeftPressed = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowRight') {
        isRightPressed = false;
    } else if (event.key === 'ArrowLeft') {
        isLeftPressed = false;
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

    // Controlar la rotación cuando se mantiene presionada una tecla
    if (isRightPressed) {
        rotationVelocity -= rotationSpeed; // Desplazamiento hacia la derecha
    } 
    if (isLeftPressed) {
        rotationVelocity += rotationSpeed; // Desplazamiento hacia la izquierda
    }

    // Aplicar amortiguación para suavizar la rotación
    rotationVelocity *= dampingFactor;

    // Aplicar la rotación de la cámara
    currentRotation += rotationVelocity;

    // Actualizar la posición de la cámara en función de la rotación
    camera.position.x = Math.sin(currentRotation) * 20;
    camera.position.z = Math.cos(currentRotation) * 20;
    camera.lookAt(0, 0, 0);

    // Mover las burbujas
    bubbles.forEach(bubble => {
        bubble.position.add(bubble.userData.movement);
        bubble.rotation.x += bubble.userData.rotationSpeed.x;
        bubble.rotation.y += bubble.userData.rotationSpeed.y;
        bubble.rotation.z += bubble.userData.rotationSpeed.z;

        if (bubble.position.x > 15 || bubble.position.x < -15) bubble.userData.movement.x *= -1;
        if (bubble.position.y > 15 || bubble.position.y < -15) bubble.userData.movement.y *= -1;
        if (bubble.position.z > 15 || bubble.position.z < -15) bubble.userData.movement.z *= -1;
    });

    // Calcular dirección de la cámara
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);

    // Direcciones cardinales para los skyboxes
    const dirs = {
        px: new THREE.Vector3(1, 0, 0),  // derecha
        nx: new THREE.Vector3(-1, 0, 0), // izquierda
        pz: new THREE.Vector3(0, 0, 1),  // frente
        nz: new THREE.Vector3(0, 0, -1)  // atrás
    };

    let showArrow = false;
    const threshold = 0.98; // cuánto debe alinearse (1 = exacto)

    // Verificar si la cámara está mirando a una de las direcciones cardinales
    for (const key in dirs) {
        if (dir.dot(dirs[key]) > threshold) {
            showArrow = true;
            break;
        }
    }

    // Mostrar o esconder la flecha según la condición
    document.getElementById('nav-arrow').style.display = showArrow ? 'block' : 'none';

    renderer.render(scene, camera);
}

animate();
