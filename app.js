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
video.crossOrigin = 'anonymous';
video.play();

const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBFormat;

// Crear material para las burbujas con un shader
const bubbleShader = {
    uniforms: {
        texture: { value: videoTexture },
        time: { value: 0.0 },
        opacity: { value: 0.5 }
    },
    vertexShader: `
        varying vec3 vPosition;
        void main() {
            vPosition = position;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform sampler2D texture;
        uniform float time;
        uniform float opacity;
        varying vec3 vPosition;
        
        void main() {
            vec3 color = vec3(1.0, 1.0, 1.0);
            float distance = length(vPosition);
            float alpha = 1.0 - smoothstep(0.4, 0.5, distance);
            gl_FragColor = vec4(color, alpha * opacity);
        }
    `
};

// Crear burbujas
const numBubbles = 100; // Número de burbujas
const bubbles = [];
const bubbleSize = 1;

for (let i = 0; i < numBubbles; i++) {
    const geometry = new THREE.SphereGeometry(bubbleSize, 32, 32);
    const material = new THREE.ShaderMaterial({
        uniforms: bubbleShader.uniforms,
        vertexShader: bubbleShader.vertexShader,
        fragmentShader: bubbleShader.fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
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
        ).normalize().multiplyScalar(0.02)
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

        // Actualizar el tiempo del shader
        bubble.material.uniforms.time.value += 0.01;
    });

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
