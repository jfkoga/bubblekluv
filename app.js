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

// Material para el video, sin iluminación
const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });
const planeGeometry = new THREE.PlaneGeometry(16, 9); // Mantener las proporciones 16:9 del video
const plane = new THREE.Mesh(planeGeometry, videoMaterial);
scene.add(plane);

// Ajustar el tamaño del plano del video para cubrir toda la pantalla sin distorsión
function resizeVideo() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const videoAspect = 16 / 9;
    
    if (aspectRatio > videoAspect) {
        // Pantalla es más ancha que el video
        plane.scale.set(aspectRatio / videoAspect * 16, 9, 1);
    } else {
        // Pantalla es más alta que el video
        plane.scale.set(16, videoAspect / aspectRatio * 9, 1);
    }
    plane.position.set(0, 0, -50); // Alejar el plano del video
}
resizeVideo();

// Crear luces, solo para las burbujas
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // Luz ambiental
scene.add(ambientLight);

// Crear burbujas
const numBubbles = 100;
const bubbles = [];
const bubbleSize = 1;

for (let i = 0; i < numBubbles; i++) {
    const geometry = new THREE.SphereGeometry(bubbleSize, 32, 32);
    
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.1,
        transmission: 1,
        thickness: 0.5,
        reflectivity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0,
        transparent: true,
        opacity: 0.6
    });

    const bubble = new THREE.Mesh(geometry, material);

    bubble.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
    );

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

    // Actualizar movimiento y rotación de las burbujas
    bubbles.forEach(bubble => {
        bubble.position.add(bubble.userData.movement);
        bubble.rotation.x += bubble.userData.rotationSpeed.x;
        bubble.rotation.y += bubble.userData.rotationSpeed.y;
        bubble.rotation.z += bubble.userData.rotationSpeed.z;

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

    // Ajustar el tamaño del plano del video al cambiar la ventana
    resizeVideo();
});
