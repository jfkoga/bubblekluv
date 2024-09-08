import * as THREE from './libs/three.module.js';

// Configuración básica de la escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear el video como textura
const video = document.getElementById('video-background');
const videoTexture = new THREE.VideoTexture(video);

// Crear material con la textura del video
const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const material = new THREE.MeshPhysicalMaterial({
    color: 0x44aa88,
    metalness: 0.6,
    roughness: 0.1,
    transparent: true,
    opacity: 0.6,
    transmission: 1.0,
    reflectivity: 0.9,
    envMap: videoTexture,
    envMapIntensity: 1.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
});

// Crear varias burbujas y agregarlas a la escena
const spheres = [];
for (let i = 0; i < 100; i++) {
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
    scene.add(sphere);
    spheres.push(sphere);
}

// Añadir luz direccional y luz ambiental
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Animación para mover las burbujas
function animate() {
    requestAnimationFrame(animate);

    spheres.forEach(sphere => {
        sphere.position.y += 0.01;
        if (sphere.position.y > 5) sphere.position.y = -5;
    });

    renderer.render(scene, camera);
}

animate();

// Ajustar el tamaño del canvas cuando se cambia el tamaño de la ventana
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

