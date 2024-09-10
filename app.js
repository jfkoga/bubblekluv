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
    'textures/px.png', // derecha
    'textures/nx.png', // izquierda
    'textures/py.png', // arriba
    'textures/ny.png', // abajo
    'textures/pz.png', // frente
    'textures/nz.png'  // atrás
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
const mouse = new THREE.Vector2();
const mouseSpeed = 1.0; // Ajusta la sensibilidad
let isMouseDown = false; // Para controlar el estado del botón del ratón

window.addEventListener('mousedown', () => {
    isMouseDown = true;
});

window.addEventListener('mouseup', () => {
    isMouseDown = false;
});

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);

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

    // Ajustar la rotación de la cámara solo si el botón del ratón está presionado
    if (isMouseDown) {
        camera.rotation.x += (mouse.y * mouseSpeed - camera.rotation.x) * 0.1;
        camera.rotation.y -= (mouse.x * mouseSpeed - camera.rotation.y) * 0.1; // Invertir el control en el eje X

        // Limitar la rotación en el eje X para evitar el giro completo de la cámara
        const maxRotation = Math.PI / 2; // 90 grados
        camera.rotation.x = Math.max(-maxRotation, Math.min(maxRotation, camera.rotation.x));
    }

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
