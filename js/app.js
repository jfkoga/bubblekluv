import * as THREE from '../build/three.module.js';
import { AnaglyphEffect } from 'https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/effects/AnaglyphEffect.js';

// Crear escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear geometría y material para un cubo
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Posicionar la cámara
camera.position.z = 5;

// Configurar el efecto anaglyph
const effect = new AnaglyphEffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Rotar el cubo para la animación
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Renderizar la escena con el efecto anaglyph
    effect.render(scene, camera);
}

animate();

// Manejo de la ventana de redimensionamiento
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    effect.setSize(width, height);
});
