// Importar Three.js desde un CDN
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.module.js';

// Configuración básica de la escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear burbujas (esferas)
const spheres = [];
const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });

// Crear varias burbujas y agregarlas a la escena
for (let i = 0; i < 100; i++) {
    const sphere = new THREE.Mesh(geometry, material);

    // Posición inicial aleatoria
    sphere.position.set(
        (Math.random() - 0.5) * 10, 
        (Math.random() - 0.5) * 10, 
        (Math.random() - 0.5) * 10
    );

    scene.add(sphere);
    spheres.push(sphere);
}

// Añadir luz
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

// Animación para mover las burbujas
function animate() {
    requestAnimationFrame(animate);

    // Rotar y mover las burbujas ligeramente
    spheres.forEach(sphere => {
        sphere.position.y += 0.01;
        sphere.position.x += (Math.random() - 0.5) * 0.01;
        sphere.position.z += (Math.random() - 0.5) * 0.01;

        // Si una burbuja sube demasiado, vuelve a su posición original
        if (sphere.position.y > 5) {
            sphere.position.y = -5;
        }
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

