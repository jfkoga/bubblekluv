import * as THREE from 'three';

// ==========================================
// 1. ESCENA, CÁMARA 1ª PERSONA Y RENDERIZADOR
// ==========================================
const container = document.getElementById('bubbles-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Ubicar la cámara en el centro de la escena (Vista 1ª Persona)
camera.position.set(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// ==========================================
// 2. CUBEMAPS / SKYBOXES (HABITACIONES)
// ==========================================
const cubeLoader = new THREE.CubeTextureLoader();

const skyboxClub = cubeLoader.load([
  'textures/skybox/bblklv-clubentrance-01/px.png',
  'textures/skybox/bblklv-clubentrance-01/nx.png',
  'textures/skybox/bblklv-clubentrance-01/py.png',
  'textures/skybox/bblklv-clubentrance-01/ny.png',
  'textures/skybox/bblklv-clubentrance-01/pz.png',
  'textures/skybox/bblklv-clubentrance-01/nz.png'
]);

const skyboxCity = cubeLoader.load([
  'textures/skybox/bblklv-city-01/px.png',
  'textures/skybox/bblklv-city-01/nx.png',
  'textures/skybox/bblklv-city-01/py.png',
  'textures/skybox/bblklv-city-01/ny.png',
  'textures/skybox/bblklv-city-01/pz.png',
  'textures/skybox/bblklv-city-01/nz.png'
]);

scene.background = skyboxClub;
let currentSkyboxName = 'Club Entrance';

// ==========================================
// 3. ILUMINACIÓN NEON & AMBIENTAL
// ==========================================
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const cyanLight = new THREE.DirectionalLight(0x00f3ff, 3.5);
cyanLight.position.set(15, 20, 15);
scene.add(cyanLight);

const magentaLight = new THREE.DirectionalLight(0xff00aa, 3.5);
magentaLight.position.set(-15, -10, -15);
scene.add(magentaLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x220044, 1.5);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

// ==========================================
// 4. CREACIÓN DE BURBUJAS DE CRISTAL
// ==========================================
const numBubbles = 70;
const bubbles = [];
const bubbleGeometry = new THREE.SphereGeometry(1, 32, 32);

const bubbleMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  roughness: 0.05,
  transmission: 0.96,
  thickness: 0.6,
  reflectivity: 0.9,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  ior: 1.33,
  transparent: true,
  opacity: 0.85
});

for (let i = 0; i < numBubbles; i++) {
  const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial.clone());
  
  const distance = 4 + Math.random() * 20;
  const theta = Math.random() * Math.PI * 2;
  const phi = (Math.random() - 0.5) * Math.PI;

  bubble.position.set(
    distance * Math.cos(phi) * Math.sin(theta),
    distance * Math.sin(phi),
    distance * Math.cos(phi) * Math.cos(theta)
  );

  const initialScale = 0.4 + Math.random() * 1.1;
  bubble.scale.set(initialScale, initialScale, initialScale);

  bubble.userData = {
    baseScale: initialScale,
    targetScale: initialScale,
    movement: new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02
    ),
    rotationSpeed: new THREE.Vector3(
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01
    ),
    isHovered: false
  };

  bubbles.push(bubble);
  scene.add(bubble);
}

// ==========================================
// 5. PANTALLA DE VIDEO 3D (TV SCREEN)
// ==========================================
const video = document.createElement('video');
video.src = 'public/media/television.mp4';
video.crossOrigin = 'anonymous';
video.loop = true;
video.muted = true;
video.playsInline = true;

const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;

const screenWidth = 14;
const screenHeight = 8;
const screenGeometry = new THREE.PlaneGeometry(screenWidth, screenHeight);
const screenMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });
const tvScreen = new THREE.Mesh(screenGeometry, screenMaterial);

const frameGeometry = new THREE.BoxGeometry(screenWidth + 0.8, screenHeight + 0.8, 0.4);
const frameMaterial = new THREE.MeshStandardMaterial({
  color: 0x0a0f1d,
  metalness: 0.9,
  roughness: 0.2,
  emissive: 0x00f3ff,
  emissiveIntensity: 0.1
});
const tvFrame = new THREE.Mesh(frameGeometry, frameMaterial);
tvFrame.position.z = -0.25;

const tvGroup = new THREE.Group();
tvGroup.add(tvScreen);
tvGroup.add(tvFrame);
tvGroup.position.set(0, 0, -22);
scene.add(tvGroup);

let isTvPlaying = false;

// ==========================================
// 6. SISTEMA DE CONTROLES CÁMARA 1ª PERSONA (FPS)
// ==========================================
let yaw = 0;   // Ángulo horizontal (Izquierda / Derecha)
let pitch = 0; // Ángulo vertical (Arriba / Abajo)

const turnSpeed = 0.03;
const mouseSensitivity = 0.003;

let isLeftPressed = false;
let isRightPressed = false;
let isUpPressed = false;
let isDownPressed = false;
let isAutoRotating = true;

// Eventos de teclado (Flechas y WASD)
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.code === 'KeyA') isLeftPressed = true;
  if (e.key === 'ArrowRight' || e.code === 'KeyD') isRightPressed = true;
  if (e.key === 'ArrowUp' || e.code === 'KeyW') isUpPressed = true;
  if (e.key === 'ArrowDown' || e.code === 'KeyS') isDownPressed = true;
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.code === 'KeyA') isLeftPressed = false;
  if (e.key === 'ArrowRight' || e.code === 'KeyD') isRightPressed = false;
  if (e.key === 'ArrowUp' || e.code === 'KeyW') isUpPressed = false;
  if (e.key === 'ArrowDown' || e.code === 'KeyS') isDownPressed = false;
});

// Arrastre con ratón para mover la vista en 1ª Persona
let isMouseDown = false;
let mouseStartX = 0;
let mouseStartY = 0;
let startYaw = 0;
let startPitch = 0;

window.addEventListener('mousedown', (e) => {
  if (e.target.closest('.hud-wrapper') || e.target.closest('.top-bar') || e.target.closest('.splash-overlay') || e.target.closest('.info-panel')) {
    return;
  }
  isMouseDown = true;
  mouseStartX = e.clientX;
  mouseStartY = e.clientY;
  startYaw = yaw;
  startPitch = pitch;
});

window.addEventListener('mousemove', (e) => {
  if (isMouseDown) {
    const deltaX = e.clientX - mouseStartX;
    const deltaY = e.clientY - mouseStartY;
    yaw = startYaw - deltaX * mouseSensitivity;
    pitch = startPitch + deltaY * mouseSensitivity;
    pitch = Math.max(-1.45, Math.min(1.45, pitch));
  }
});

window.addEventListener('mouseup', () => { isMouseDown = false; });
window.addEventListener('mouseleave', () => { isMouseDown = false; });

// Touch Drag para pantallas táctiles en móviles
window.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    if (e.target.closest('.hud-wrapper') || e.target.closest('.top-bar') || e.target.closest('.splash-overlay')) return;
    isMouseDown = true;
    mouseStartX = e.touches[0].clientX;
    mouseStartY = e.touches[0].clientY;
    startYaw = yaw;
    startPitch = pitch;
  }
});

window.addEventListener('touchmove', (e) => {
  if (isMouseDown && e.touches.length === 1) {
    const deltaX = e.touches[0].clientX - mouseStartX;
    const deltaY = e.touches[0].clientY - mouseStartY;
    yaw = startYaw - deltaX * mouseSensitivity;
    pitch = startPitch + deltaY * mouseSensitivity;
    pitch = Math.max(-1.45, Math.min(1.45, pitch));
  }
});

window.addEventListener('touchend', () => { isMouseDown = false; });

// ==========================================
// 7. SISTEMA DE PARTÍCULAS (POP EXPLOSION)
// ==========================================
const particles = [];
const particleGeometry = new THREE.SphereGeometry(0.12, 8, 8);

function createPopExplosion(position, color = 0x00f3ff) {
  const particleCount = 24;
  const group = new THREE.Group();
  group.position.copy(position);

  const mat = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 1
  });

  const pData = [];
  for (let i = 0; i < particleCount; i++) {
    const pMesh = new THREE.Mesh(particleGeometry, mat);
    const dir = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    ).normalize().multiplyScalar(0.1 + Math.random() * 0.2);

    group.add(pMesh);
    pData.push({ mesh: pMesh, velocity: dir });
  }

  scene.add(group);
  particles.push({ group, pData, life: 1.0 });

  playPopSound();
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const item = particles[i];
    item.life -= 0.03;

    item.pData.forEach(p => {
      p.mesh.position.add(p.velocity);
      p.mesh.material.opacity = item.life;
    });

    if (item.life <= 0) {
      scene.remove(item.group);
      particles.splice(i, 1);
    }
  }
}

// ==========================================
// 8. WEB AUDIO API & AUDIO VISUALIZER
// ==========================================
const audioElement = document.getElementById('audio');
let audioCtx = null;
let analyser = null;
let audioSource = null;
let dataArray = null;

function initAudioContext() {
  if (audioCtx) return;
  
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 128;
  
  audioSource = audioCtx.createMediaElementSource(audioElement);
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);

  dataArray = new Uint8Array(analyser.frequencyBinCount);
}

function playPopSound() {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {}
}

const eqCanvas = document.getElementById('equalizerCanvas');
const eqCtx = eqCanvas.getContext('2d');

function drawEqualizer() {
  if (!analyser || !dataArray) {
    eqCtx.clearRect(0, 0, eqCanvas.width, eqCanvas.height);
    eqCtx.fillStyle = 'rgba(0, 243, 255, 0.2)';
    const barWidth = (eqCanvas.width / 32) - 2;
    for (let i = 0; i < 32; i++) {
      const h = 4 + Math.sin(i * 0.5) * 2;
      eqCtx.fillRect(i * (barWidth + 2), eqCanvas.height - h, barWidth, h);
    }
    return;
  }

  analyser.getByteFrequencyData(dataArray);
  eqCtx.clearRect(0, 0, eqCanvas.width, eqCanvas.height);

  const barCount = 32;
  const barWidth = (eqCanvas.width / barCount) - 2;

  for (let i = 0; i < barCount; i++) {
    const val = dataArray[i * 2] || 0;
    const percent = val / 255;
    const barHeight = Math.max(3, percent * eqCanvas.height);

    const gradient = eqCtx.createLinearGradient(0, eqCanvas.height, 0, 0);
    gradient.addColorStop(0, '#00f3ff');
    gradient.addColorStop(1, '#ff00aa');

    eqCtx.fillStyle = gradient;
    eqCtx.fillRect(i * (barWidth + 2), eqCanvas.height - barHeight, barWidth, barHeight);
  }
}

// ==========================================
// 9. RAYCASTER PARA CLICK EN BURBUJAS
// ==========================================
const raycaster = new THREE.Raycaster();
const rayMouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  if (event.target.closest('.hud-wrapper') || event.target.closest('.top-bar') || event.target.closest('.splash-overlay') || event.target.closest('.info-panel')) {
    return;
  }

  rayMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  rayMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(rayMouse, camera);
  const intersects = raycaster.intersectObjects(bubbles);

  if (intersects.length > 0) {
    const clickedBubble = intersects[0].object;
    const pos = clickedBubble.position.clone();
    
    const popColor = Math.random() > 0.5 ? 0x00f3ff : 0xff00aa;
    createPopExplosion(pos, popColor);

    const distance = 4 + Math.random() * 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI;

    clickedBubble.position.set(
      distance * Math.cos(phi) * Math.sin(theta),
      distance * Math.sin(phi),
      distance * Math.cos(phi) * Math.cos(theta)
    );
    clickedBubble.scale.set(0.1, 0.1, 0.1);
  }
});

// ==========================================
// 10. INTERFAZ DE USUARIO Y EVENTOS DE BOTÓN
// ==========================================
const splashOverlay = document.getElementById('splash-screen');
const startBtn = document.getElementById('startBtn');

const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const trackStatus = document.getElementById('trackStatus');

const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');

const volumeSlider = document.getElementById('volumeSlider');
const muteBtn = document.getElementById('muteBtn');

const skyboxToggleBtn = document.getElementById('skyboxToggleBtn');
const skyboxNameEl = document.getElementById('skyboxName');

const autoRotateBtn = document.getElementById('autoRotateBtn');
const videoToggleBtn = document.getElementById('videoToggleBtn');
const tvStatusEl = document.getElementById('tvStatus');

const infoToggleBtn = document.getElementById('infoToggleBtn');
const infoPanel = document.getElementById('infoPanel');
const closeInfoBtn = document.getElementById('closeInfoBtn');

// BOTÓN "ENTRAR A LA EXPERIENCIA" (Garantizado)
startBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();

  // Ocultar pantalla splash por completo
  splashOverlay.style.display = 'none';
  splashOverlay.classList.add('hidden');

  // Inicializar audio
  initAudioContext();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  // Iniciar reproducciones
  video.play().catch(() => {});
  isTvPlaying = true;

  audioElement.play().then(() => {
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    trackStatus.textContent = 'Reproduciendo audio';
  }).catch(() => {
    trackStatus.textContent = 'Presiona Play para escuchar';
  });

  window.focus();
});

// Play / Pause Toggle
playPauseBtn.addEventListener('click', () => {
  initAudioContext();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (audioElement.paused) {
    audioElement.play();
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    trackStatus.textContent = 'Reproduciendo audio';
  } else {
    audioElement.pause();
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    trackStatus.textContent = 'Pausado';
  }
});

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

audioElement.addEventListener('timeupdate', () => {
  const current = audioElement.currentTime;
  const total = audioElement.duration || 1;
  const progressPercent = (current / total) * 100;
  progressBar.style.width = `${progressPercent}%`;

  currentTimeEl.textContent = formatTime(current);
  durationEl.textContent = formatTime(total);
});

progressContainer.addEventListener('click', (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const seekTime = (clickX / width) * (audioElement.duration || 0);
  audioElement.currentTime = seekTime;
});

volumeSlider.addEventListener('input', (e) => {
  audioElement.volume = e.target.value;
  muteBtn.textContent = audioElement.volume === 0 ? '🔇' : '🔊';
});

muteBtn.addEventListener('click', () => {
  if (audioElement.volume > 0) {
    audioElement.volume = 0;
    volumeSlider.value = 0;
    muteBtn.textContent = '🔇';
  } else {
    audioElement.volume = 0.8;
    volumeSlider.value = 0.8;
    muteBtn.textContent = '🔊';
  }
});

skyboxToggleBtn.addEventListener('click', () => {
  if (currentSkyboxName === 'Club Entrance') {
    scene.background = skyboxCity;
    currentSkyboxName = 'City Skyline';
  } else {
    scene.background = skyboxClub;
    currentSkyboxName = 'Club Entrance';
  }
  skyboxNameEl.textContent = currentSkyboxName;
});

autoRotateBtn.addEventListener('click', () => {
  isAutoRotating = !isAutoRotating;
  autoRotateBtn.classList.toggle('active', isAutoRotating);
});

videoToggleBtn.addEventListener('click', () => {
  if (isTvPlaying) {
    video.pause();
    tvGroup.visible = false;
    isTvPlaying = false;
    tvStatusEl.textContent = 'OFF';
  } else {
    video.play();
    tvGroup.visible = true;
    isTvPlaying = true;
    tvStatusEl.textContent = 'ON';
  }
});

infoToggleBtn.addEventListener('click', () => {
  infoPanel.classList.toggle('hidden');
});
closeInfoBtn.addEventListener('click', () => {
  infoPanel.classList.add('hidden');
});

// Ajustar Tamaño de Ventana (Full Screen Resize)
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// 11. BUCLE DE ANIMACIÓN PRINCIPAL
// ==========================================
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  // Actualizar rotación de cámara por teclado / auto-giro
  if (isAutoRotating && !isMouseDown) {
    yaw += 0.0015;
  }

  if (isLeftPressed) yaw += turnSpeed;
  if (isRightPressed) yaw -= turnSpeed;
  if (isUpPressed) pitch += turnSpeed;
  if (isDownPressed) pitch -= turnSpeed;

  // Limitar pitch entre -83° y +83° para no dar la vuelta boca abajo
  pitch = Math.max(-1.45, Math.min(1.45, pitch));

  // Actualizar vector de mirada de la cámara 1ª persona
  const targetDirection = new THREE.Vector3(
    Math.cos(pitch) * Math.sin(yaw),
    Math.sin(pitch),
    Math.cos(pitch) * Math.cos(yaw)
  );
  camera.lookAt(targetDirection);

  // Audio Bass Frequency calculation
  let bassPulse = 0;
  if (analyser && dataArray && !audioElement.paused) {
    analyser.getByteFrequencyData(dataArray);
    let bassSum = 0;
    for (let i = 0; i < 8; i++) {
      bassSum += dataArray[i];
    }
    bassPulse = (bassSum / 8) / 255;
  }

  // Pulsación de Luces al Ritmo
  cyanLight.intensity = 3.5 + bassPulse * 3.0;
  magentaLight.intensity = 3.5 + bassPulse * 3.0;

  // Animación de Burbujas
  bubbles.forEach((bubble) => {
    bubble.position.add(bubble.userData.movement);
    bubble.rotation.x += bubble.userData.rotationSpeed.x;
    bubble.rotation.y += bubble.userData.rotationSpeed.y;

    const limit = 22;
    if (Math.abs(bubble.position.x) > limit) bubble.userData.movement.x *= -1;
    if (Math.abs(bubble.position.y) > limit) bubble.userData.movement.y *= -1;
    if (Math.abs(bubble.position.z) > limit) bubble.userData.movement.z *= -1;

    let targetS = bubble.userData.baseScale + bassPulse * 0.35;
    bubble.scale.lerp(new THREE.Vector3(targetS, targetS, targetS), 0.1);
  });

  // Flotación TV Screen
  tvGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.3;

  // Partículas y ecualizador
  updateParticles();
  drawEqualizer();

  renderer.render(scene, camera);
}

animate();
