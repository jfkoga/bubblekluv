// app.js
import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Create floating bubbles
const bubbles = [];

for (let i = 0; i < 100; i++) {
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
    const bubble = new THREE.Mesh(geometry, material);

    bubble.position.x = (Math.random() - 0.5) * 10;
    bubble.position.y = (Math.random() - 0.5) * 10;
    bubble.position.z = (Math.random() - 0.5) * 10;

    bubbles.push(bubble);
    scene.add(bubble);
}

// Camera position
camera.position.z = 5;

// Animation loop
const animate = () => {
    requestAnimationFrame(animate);

    bubbles.forEach((bubble) => {
        bubble.rotation.x += 0.005;
        bubble.rotation.y += 0.005;
    });

    renderer.render(scene, camera);
};

// Handle window resize
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
});

// Start the animation loop
animate();
