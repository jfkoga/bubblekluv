let container;
let camera, scene, renderer;
let effect;

let sphere, light;

init();
animate();

function init() {
    container = document.getElementById('container');

    // Crear la escena
    scene = new THREE.Scene();

    // Crear la cámara
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 500;

    // Crear la luz
    light = new THREE.PointLight(0xffffff, 1.5);
    light.position.set(500, 500, 500);
    scene.add(light);

    // Crear el renderizador
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Crear el efecto Anaglyph
    effect = new THREE.AnaglyphEffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);

    // Crear geometría
    const geometry = new THREE.SphereGeometry(200, 32, 16);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00, flatShading: true });

    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Ajustar tamaño de la ventana
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    effect.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    sphere.rotation.y += 0.005;

    // Renderizar con efecto Anaglyph
    effect.render(scene, camera);
}
