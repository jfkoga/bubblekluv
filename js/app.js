// Importar Three.js y los módulos desde un CDN confiable
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.module.js';
import { StereoEffect } from 'https://cdn.jsdelivr.net/npm/three@0.150.0/examples/jsm/effects/StereoEffect.js';

// Configuración básica de la escena
const scene = new THREE.Scene();

// Crear una cámara
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Crear un renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear el efecto stereo
const effect = new StereoEffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Crear objetos en la escena (esferas flotantes)
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

for (let i = 0; i < 100; i++) {
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
    );
    scene.add(sphere);
}

// Añadir luz ambiental
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambient
// Importar Three.js y los módulos desde un CDN confiable
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.module.js';
import { StereoEffect } from 'https://cdn.jsdelivr.net/npm/three@0.150.0/examples/jsm/effects/StereoEffect.js';

// Configuración básica de la escena
const scene = new THREE.Scene();

// Crear una cámara
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Crear un renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear el efecto stereo
const effect = new StereoEffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

// Crear objetos en la escena (esferas flotantes)
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

for (let i = 0; i < 100; i++) {
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
    );
    scene.add(sphere);
}

// Añadir luz ambiental
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambient

