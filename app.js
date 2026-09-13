import * as THREE from 'three';

// ==========================================
// 1. CONFIGURACIÓN DEL ÁLBUM MULTIVERSO 3D
// ==========================================
const tracksConfig = [
  {
    id: 'club-entrance',
    title: 'Wait For Me',
    artist: 'BubbleKluv',
    audioSrc: 'audio/bubblekluv-waitforme.mp3',
    skyboxFolder: 'textures/skybox/bblklv-clubentrance-01/',
    worldName: 'Neon Club Entrance',
    primaryColor: '#00f3ff',
    secondaryColor: '#ff00aa',
    lightPrimaryHex: 0x00f3ff,
    lightSecondaryHex: 0xff00aa,
    bubbleCount: 70,
    hasTvScreen: true,
    tvConfig: {
      width: 26.95,
      height: 16.89,
      posX: 24.85,
      posY: -2.34,
      posZ: 8.11,
      rotY: -Math.PI / 2
    }
  },
  {
    id: 'cyber-skyline',
    title: 'Cyber Skyline (Night Drive)',
    artist: 'BubbleKluv',
    audioSrc: 'audio/bubblekluv-waitforme.mp3',
    skyboxFolder: 'textures/skybox/bblklv-city-01/',
    worldName: 'Cyber Skyline 360',
    primaryColor: '#a855f7',
    secondaryColor: '#3b82f6',
    lightPrimaryHex: 0xa855f7,
    lightSecondaryHex: 0x3b82f6,
    bubbleCount: 85,
    hasTvScreen: false
  },
  {
    id: 'retro-lounge',
    title: 'Lofi Studio Lounge',
    artist: 'BubbleKluv',
    audioSrc: 'audio/bubblekluv-waitforme.mp3',
    skyboxFolder: 'textures/skybox/',
    worldName: 'Retro Studio Lounge',
    primaryColor: '#ffb703',
    secondaryColor: '#fb8500',
    lightPrimaryHex: 0xffb703,
    lightSecondaryHex: 0xfb8500,
    bubbleCount: 55,
    hasTvScreen: false
  }
];

let currentTrackIndex = 0;

// ==========================================
// 2. ESCENA, CÁMARA 1ª PERSONA Y RENDERIZADOR
// ==========================================
const container = document.getElementById('bubbles-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// ==========================================
// 3. CARGADOR DE CUBEMAPS Y LUCES
// ==========================================
const cubeLoader = new THREE.CubeTextureLoader();
const loadedSkyboxes = {};

function getSkyboxTexture(folderPath) {
  if (!loadedSkyboxes[folderPath]) {
    loadedSkyboxes[folderPath] = cubeLoader.load([
      folderPath + 'px.png',
      folderPath + 'nx.png',
      folderPath + 'py.png',
      folderPath + 'ny.png',
      folderPath + 'pz.png',
      folderPath + 'nz.png'
    ]);
  }
  return loadedSkyboxes[folderPath];
}

scene.background = getSkyboxTexture(tracksConfig[0].skyboxFolder);

// Iluminación
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const primaryLight = new THREE.DirectionalLight(tracksConfig[0].lightPrimaryHex, 3.5);
primaryLight.position.set(15, 20, 15);
scene.add(primaryLight);

const secondaryLight = new THREE.DirectionalLight(tracksConfig[0].lightSecondaryHex, 3.5);
secondaryLight.position.set(-15, -10, -15);
scene.add(secondaryLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x220044, 1.5);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

// ==========================================
// 4. CREACIÓN DE BURBUJAS DE CRISTAL
// ==========================================
let bubbles = [];
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

function initBubbles(count) {
  bubbles.forEach(b => scene.remove(b));
  bubbles = [];

  for (let i = 0; i < count; i++) {
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
      movement: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ),
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
      )
    };

    bubbles.push(bubble);
    scene.add(bubble);
  }
}

initBubbles(tracksConfig[0].bubbleCount);

// ==========================================
// 5. PORTAL GATEWAY 3D (TELETRANSPORTE)
// ==========================================
const portalGeometry = new THREE.TorusGeometry(2, 0.2, 16, 100);
const portalMaterial = new THREE.MeshStandardMaterial({
  color: 0x00f3ff,
  emissive: 0x00f3ff,
  emissiveIntensity: 0.8,
  metalness: 0.8,
  roughness: 0.2
});
const portalRing = new THREE.Mesh(portalGeometry, portalMaterial);
portalRing.position.set(0, 0, -18);
scene.add(portalRing);

// ==========================================
// 6. PANTALLA DE VIDEO 3D (ENCAJADA EN LA TELE CRT DEL CUBEMAP)
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
videoTexture.colorSpace = THREE.SRGBColorSpace;

// Plano de pantalla ajustado exactamente al bisel azul del televisor CRT
const firstTrack = tracksConfig[0];
const screenGeometry = new THREE.PlaneGeometry(firstTrack.tvConfig.width, firstTrack.tvConfig.height);
const screenMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });
const tvScreen = new THREE.Mesh(screenGeometry, screenMaterial);

tvScreen.position.set(firstTrack.tvConfig.posX, firstTrack.tvConfig.posY, firstTrack.tvConfig.posZ);
tvScreen.rotation.y = firstTrack.tvConfig.rotY;
scene.add(tvScreen);

let isTvPlaying = false;

function updateTvScreenPosition() {
  const track = tracksConfig[currentTrackIndex];
  if (track.hasTvScreen && track.tvConfig) {
    tvScreen.visible = true;
    tvScreen.position.set(track.tvConfig.posX, track.tvConfig.posY, track.tvConfig.posZ);
    tvScreen.rotation.y = track.tvConfig.rotY;
  } else {
    tvScreen.visible = false;
  }
}

// ==========================================
// 7. SISTEMA DE CONTROLES CÁMARA 1ª PERSONA (FPS)
// ==========================================
let yaw = 0;
let pitch = 0;

const turnSpeed = 0.03;
const mouseSensitivity = 0.003;

let isLeftPressed = false;
let isRightPressed = false;
let isUpPressed = false;
let isDownPressed = false;
let isAutoRotating = true;

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

let isMouseDown = false;
let mouseStartX = 0;
let mouseStartY = 0;
let startYaw = 0;
let startPitch = 0;

window.addEventListener('mousedown', (e) => {
  if (e.target.closest('.hud-wrapper') || e.target.closest('.top-bar') || e.target.closest('.splash-overlay') || e.target.closest('.drawer-panel') || e.target.closest('.info-panel')) {
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

window.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    if (e.target.closest('.hud-wrapper') || e.target.closest('.top-bar') || e.target.closest('.splash-overlay') || e.target.closest('.drawer-panel')) return;
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
// 8. TRANSICIÓN SALTO CUÁNTICO / MULTIVERSO WARP
// ==========================================
const warpOverlay = document.getElementById('warpOverlay');
let isWarping = false;

function travelToTrack(targetIndex) {
  if (isWarping) return;
  isWarping = true;
  currentTrackIndex = targetIndex;

  const track = tracksConfig[currentTrackIndex];

  warpOverlay.classList.add('active');

  let fovStep = 0;
  function animateWarpOut() {
    fovStep += 0.1;
    camera.fov = 75 + Math.sin(fovStep) * 35;
    camera.updateProjectionMatrix();

    if (fovStep < Math.PI / 2) {
      requestAnimationFrame(animateWarpOut);
    } else {
      scene.background = getSkyboxTexture(track.skyboxFolder);
      primaryLight.color.setHex(track.lightPrimaryHex);
      secondaryLight.color.setHex(track.lightSecondaryHex);
      portalMaterial.color.setHex(track.lightPrimaryHex);
      portalMaterial.emissive.setHex(track.lightPrimaryHex);

      initBubbles(track.bubbleCount);
      updateTvScreenPosition();
      updateHUDTrackInfo();

      audioElement.src = track.audioSrc;
      if (audioCtx && audioCtx.state === 'running') {
        audioElement.play().catch(() => {});
      }

      animateWarpIn();
    }
  }

  function animateWarpIn() {
    let returnStep = Math.PI / 2;
    function animateIn() {
      returnStep += 0.1;
      camera.fov = 75 + Math.sin(returnStep) * 35;
      camera.updateProjectionMatrix();

      if (returnStep < Math.PI) {
        requestAnimationFrame(animateIn);
      } else {
        camera.fov = 75;
        camera.updateProjectionMatrix();
        warpOverlay.classList.remove('active');
        isWarping = false;
      }
    }
    animateIn();
  }

  animateWarpOut();
}

// ==========================================
// 9. PARTÍCULAS DE EXPLOSIÓN
// ==========================================
const particles = [];
const particleGeometry = new THREE.SphereGeometry(0.12, 8, 8);

function createPopExplosion(position, color = 0x00f3ff) {
  const particleCount = 24;
  const group = new THREE.Group();
  group.position.copy(position);

  const mat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 1 });
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
// 10. WEB AUDIO API & AUDIO VISUALIZER
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
  const currentTrack = tracksConfig[currentTrackIndex];

  for (let i = 0; i < barCount; i++) {
    const val = dataArray[i * 2] || 0;
    const percent = val / 255;
    const barHeight = Math.max(3, percent * eqCanvas.height);

    const gradient = eqCtx.createLinearGradient(0, eqCanvas.height, 0, 0);
    gradient.addColorStop(0, currentTrack.primaryColor);
    gradient.addColorStop(1, currentTrack.secondaryColor);

    eqCtx.fillStyle = gradient;
    eqCtx.fillRect(i * (barWidth + 2), eqCanvas.height - barHeight, barWidth, barHeight);
  }
}

// ==========================================
// 11. RAYCASTER PARA CLICK EN PORTAL 3D Y BURBUJAS
// ==========================================
const raycaster = new THREE.Raycaster();
const rayMouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  if (event.target.closest('.hud-wrapper') || event.target.closest('.top-bar') || event.target.closest('.splash-overlay') || event.target.closest('.drawer-panel') || event.target.closest('.info-panel')) {
    return;
  }

  rayMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  rayMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(rayMouse, camera);

  const portalIntersects = raycaster.intersectObject(portalRing);
  if (portalIntersects.length > 0) {
    const nextIdx = (currentTrackIndex + 1) % tracksConfig.length;
    travelToTrack(nextIdx);
    return;
  }

  const bubbleIntersects = raycaster.intersectObjects(bubbles);
  if (bubbleIntersects.length > 0) {
    const clickedBubble = bubbleIntersects[0].object;
    const pos = clickedBubble.position.clone();
    
    const track = tracksConfig[currentTrackIndex];
    createPopExplosion(pos, track.lightPrimaryHex);

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
// 12. INTERFAZ DE USUARIO Y REPRODUCTOR HUD
// ==========================================
const splashOverlay = document.getElementById('splash-screen');
const startBtn = document.getElementById('startBtn');

const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');

const trackTitleEl = document.getElementById('trackTitle');
const worldBadgeEl = document.getElementById('worldBadge');

const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');

const prevTrackBtn = document.getElementById('prevTrackBtn');
const nextTrackBtn = document.getElementById('nextTrackBtn');

const volumeSlider = document.getElementById('volumeSlider');
const muteBtn = document.getElementById('muteBtn');

const autoRotateBtn = document.getElementById('autoRotateBtn');
const videoToggleBtn = document.getElementById('videoToggleBtn');
const tvStatusEl = document.getElementById('tvStatus');

const drawerToggleBtn = document.getElementById('drawerToggleBtn');
const multiverseDrawer = document.getElementById('multiverseDrawer');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const tracklistContainer = document.getElementById('tracklistContainer');

const infoToggleBtn = document.getElementById('infoToggleBtn');
const infoPanel = document.getElementById('infoPanel');
const closeInfoBtn = document.getElementById('closeInfoBtn');

function updateHUDTrackInfo() {
  const track = tracksConfig[currentTrackIndex];
  trackTitleEl.textContent = track.title;
  worldBadgeEl.textContent = '🌐 ' + track.worldName;

  renderTracklistDrawer();
}

function renderTracklistDrawer() {
  tracklistContainer.innerHTML = '';
  tracksConfig.forEach((t, idx) => {
    const card = document.createElement('div');
    card.className = `track-card ${idx === currentTrackIndex ? 'active' : ''}`;
    card.innerHTML = `
      <div class="track-card-info">
        <span class="track-card-title">${t.title}</span>
        <span class="track-card-world">🌐 ${t.worldName}</span>
      </div>
      <span class="teleport-badge">${idx === currentTrackIndex ? 'ACTUAL' : 'TELEPORT'}</span>
    `;
    card.addEventListener('click', () => {
      travelToTrack(idx);
    });
    tracklistContainer.appendChild(card);
  });
}

// BOTÓN "ENTRAR AL MULTIVERSO"
startBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();

  splashOverlay.style.display = 'none';
  splashOverlay.classList.add('hidden');

  initAudioContext();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  video.play().catch(() => {});
  isTvPlaying = true;

  audioElement.play().then(() => {
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
  }).catch(() => {});

  updateHUDTrackInfo();
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
  } else {
    audioElement.pause();
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
  }
});

prevTrackBtn.addEventListener('click', () => {
  const prevIdx = (currentTrackIndex - 1 + tracksConfig.length) % tracksConfig.length;
  travelToTrack(prevIdx);
});

nextTrackBtn.addEventListener('click', () => {
  const nextIdx = (currentTrackIndex + 1) % tracksConfig.length;
  travelToTrack(nextIdx);
});

audioElement.addEventListener('ended', () => {
  const nextIdx = (currentTrackIndex + 1) % tracksConfig.length;
  travelToTrack(nextIdx);
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

autoRotateBtn.addEventListener('click', () => {
  isAutoRotating = !isAutoRotating;
  autoRotateBtn.classList.toggle('active', isAutoRotating);
});

videoToggleBtn.addEventListener('click', () => {
  if (isTvPlaying) {
    video.pause();
    tvScreen.visible = false;
    isTvPlaying = false;
    tvStatusEl.textContent = 'OFF';
  } else {
    video.play();
    updateTvScreenPosition();
    isTvPlaying = true;
    tvStatusEl.textContent = 'ON';
  }
});

drawerToggleBtn.addEventListener('click', () => {
  multiverseDrawer.classList.toggle('hidden');
});
closeDrawerBtn.addEventListener('click', () => {
  multiverseDrawer.classList.add('hidden');
});

infoToggleBtn.addEventListener('click', () => {
  infoPanel.classList.toggle('hidden');
});
closeInfoBtn.addEventListener('click', () => {
  infoPanel.classList.add('hidden');
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

updateHUDTrackInfo();
updateTvScreenPosition();

// ==========================================
// 13. BUCLE DE ANIMACIÓN PRINCIPAL
// ==========================================
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  if (isAutoRotating && !isMouseDown) {
    yaw += 0.0015;
  }

  if (isLeftPressed) yaw += turnSpeed;
  if (isRightPressed) yaw -= turnSpeed;
  if (isUpPressed) pitch += turnSpeed;
  if (isDownPressed) pitch -= turnSpeed;

  pitch = Math.max(-1.45, Math.min(1.45, pitch));

  const targetDirection = new THREE.Vector3(
    Math.cos(pitch) * Math.sin(yaw),
    Math.sin(pitch),
    Math.cos(pitch) * Math.cos(yaw)
  );
  camera.lookAt(targetDirection);

  portalRing.rotation.z += 0.01;
  portalRing.rotation.x = Math.sin(elapsedTime) * 0.2;

  let bassPulse = 0;
  if (analyser && dataArray && !audioElement.paused) {
    analyser.getByteFrequencyData(dataArray);
    let bassSum = 0;
    for (let i = 0; i < 8; i++) {
      bassSum += dataArray[i];
    }
    bassPulse = (bassSum / 8) / 255;
  }

  primaryLight.intensity = 3.5 + bassPulse * 3.0;
  secondaryLight.intensity = 3.5 + bassPulse * 3.0;

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

  updateParticles();
  drawEqualizer();

  renderer.render(scene, camera);
}

animate();
