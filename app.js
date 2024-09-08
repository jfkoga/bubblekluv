import * as THREE from './libs/three.module.js';

// Crear la escena, cámara y renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('bubbles-container').appendChild(renderer.domElement);

// Crear el video de fondo
const video = document.createElement('video');
video.src = 'textures/background.mp4';
video.autoplay = true;
video.loop = true;
video.muted = true;
video.play();

const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBFormat;

const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });

// Skybox o fondo de video
const skyboxGeometry = new THREE.PlaneGeometry(200, 200);
const skybox = new THREE.Mesh(skyboxGeometry, videoMaterial);
skybox.position.set(0, 0, -50);
scene.add(skybox);

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

camera.position.z = 20;

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

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
