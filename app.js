import * as THREE from './libs/three.module.js';

// Configuración básica de la escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('bubbles-container').appendChild(renderer.domElement);

// Cargar el video
const video = document.createElement('video');
video.src = 'videos/background.mp4';
video.crossOrigin = 'anonymous'; // Asegúrate de que el video pueda ser accedido
video.loop = true;
video.muted = true;
video.autoplay = true;
video.style.display = 'none'; // Oculta el video en la página

// Esperar a que el video esté cargado
video.addEventListener('canplay', () => {
    // Crear una textura a partir del video
    const videoTexture = new THREE.VideoTexture(video);

    // Crear una geometría de burbujas
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ map: videoTexture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
});
