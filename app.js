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

for (let i = 0; i < numBubbles; i++) {
    const geometry = new THREE.SphereGeometry(Math.random() * 0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        map: bubbleTexture,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending, // Opcional: Para dar un efecto más brillante
    });
    const bubble = new THREE.Mesh(geometry, material);

    // Posicionar burbujas aleatoriamente
    bubble.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    );

    bubbles.push(bubble);
    scene.add(bubble);
}

camera.position.z = 5;

// Animación
function animate() {
    requestAnimationFrame(animate);

    // Girar todas las burbujas
    bubbles.forEach(bubble => {
        bubble.rotation.x += 0.01;
        bubble.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
}

animate();

// Ajustar tamaño del renderer cuando se cambia el tamaño de la ventana
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
