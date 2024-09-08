import * as THREE from './libs/three.module.js';

// Configuración básica de la escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cargar un mapa de entorno (skybox o cualquier imagen de entorno)
const loader = new THREE.CubeTextureLoader();
const envMap = loader.load([
    'textures/px.jpg',  // Imagen para el lado positivo del eje X
    'textures/nx.jpg',  // Imagen para el lado negativo del eje X
    'textures/py.jpg',  // Imagen para el lado positivo del eje Y
    'textures/ny.jpg',  // Imagen para el lado negativo del eje Y
    'textures/pz.jpg',  // Imagen para el lado positivo del eje Z
    'textures/nz.jpg'   // Imagen para el lado negativo del eje Z
]);
scene.background = envMap; // Usar el mapa de entorno como fondo

// Crear burbujas (esferas) con material físico para reflejos y transparencia
const spheres = [];
const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const material = new THREE.MeshPhysicalMaterial({
    color: 0x44aa88,
    metalness: 0.6,           // Similar al reflejo de un metal
    roughness: 0.1,           // Superficie lisa (más realista para burbujas)
    transparent: true,        // Para hacer las burbujas parcialmente transparentes
    opacity: 0.6,             // Nivel de transparencia
    transmission: 1.0,        // Hace que sea como un vidrio
    reflectivity: 0.9,        // Refleja el entorno
    envMap: envMap,           // Refleja el mapa de entorno
    envMapIntensity: 1.5,     // Intensidad del reflejo del entorno
    clearcoat: 1.0,           // Capa brillante superior para más realismo
    clearcoatRoughness: 0.05, // Suavidad de la capa brillante
});

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

// Añadir luz direccional y luz ambiental
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Luz ambiental suave
scene.add(ambientLight);

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
