import * as THREE from './libs/three.module.js';

// Crear la escena, cámara y renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('bubbles-container').appendChild(renderer.domElement);

// Crear el skybox
const loader = new THREE.CubeTextureLoader();
const textureCube = loader.load([
    'textures/skybox/px.jpg', // Right
    'textures/skybox/nx.jpg', // Left
    'textures/skybox/py.jpg', // Top
    'textures/skybox/ny.jpg', // Bottom
    'textures/skybox/pz.jpg', // Front
    'textures/skybox/nz.jpg'  // Back
]);
scene.background = textureCube;

// Crear una textura para las burbujas
const textureLoader = new THREE.TextureLoader();
const bubbleTexture = textureLoader.load('textures/bubble_texture.png');

// Crear burbujas
const numBubbles = 100; // Número de burbujas
const bubbles = [];
const bubbleSize = 1;

for (let i = 0; i < numBubbles; i++) {
    const geometry = new THREE.SphereGeometry(bubbleSize, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        map: bubbleTexture,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        emissive: new THREE.Color(0x00ffff),
        emissiveIntensity: 0.2
    });
    const bubble = new THREE.Mesh(geometry, material);

    // Posicionar burbujas aleatoriamente
    bubble.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
    );

    // Añadir un movimiento suave a las burbujas
    bubble.userData = {
        movement: new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize().multiplyScalar(0.01)
    };

    bubbles.push(bubble);
    scene.add(bubble);
}

camera.position.z = 20;

function animate() {
    requestAnimationFrame(animate);

    // Actualizar el movimiento de las burbujas
    bubbles.forEach(bubble => {
        bubble.position.add(bubble.userData.movement);

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