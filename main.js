// Import Three.js library
import * as THREE from 'https://threejs.org/build/three.module.js';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create audio element
const audioElement = document.createElement('audio');
audioElement.controls = true;
document.body.appendChild(audioElement);

// Create audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Set up audio analyser
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audioElement);
source.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Create 3D visualizer
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Set up camera position
camera.position.z = 5;

// Handle file input change
document.getElementById('audioInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const objectURL = URL.createObjectURL(file);

    // Load audio file and play
    audioElement.src = objectURL;
    audioElement.play();

    // Connect audio element to the analyser
    source.connect(analyser);

    // Render loop
    const animate = function () {
        requestAnimationFrame(animate);

        // Update cube scale based on audio data
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
        cube.scale.y = (average / 100) + 1;

        // Render the scene
        renderer.render(scene, camera);
    };

    animate();
});
