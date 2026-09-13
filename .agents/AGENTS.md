# BUBBLEKLUV - AI Development Specifications & Guidelines

Welcome to **BubbleKluv**, an interactive WebGL / Three.js 3D experience with real-time audio visualizers, glass physical refraction materials, 1st-person camera navigation, and neon glassmorphism UI.

---

## 🎯 Architecture Overview

This project follows a lightweight, dependency-free ES module architecture built on native Web Standards:

- **Core Engine**: Three.js (`libs/three.module.js`) loaded natively via `<script type="importmap">`.
- **UI & HUD**: HTML5 Semantic Markup with CSS3 Glassmorphism (`styles.css`).
- **Audio & Beat Analysis**: Web Audio API (`AudioContext`, `AnalyserNode`) and synthesized sound effects using `OscillatorNode`.
- **Camera System**: First-Person Shooter / Exploration Camera (Yaw & Pitch look, keyboard + mouse drag look).

---

## 📐 Coding Standards & Guidelines

### 1. Three.js & WebGL Performance Rules
- **Resource Disposal**: Always dispose geometries (`geometry.dispose()`) and materials (`material.dispose()`) when destroying meshes or particle systems to prevent VRAM memory leaks.
- **Draw Call Optimization**: Keep draw calls under 100 per frame. Reuse geometries (`SphereGeometry`) and clone materials when necessary.
- **Pixel Ratio**: Limit WebGL pixel ratio to `Math.min(window.devicePixelRatio, 2)` to prevent GPU throttling on 4K/Retina displays.

### 2. File & Asset Conventions
- **Skyboxes**: Cubemaps stored in `textures/skybox/<name>/` with 6 faces named `px.png`, `nx.png`, `py.png`, `ny.png`, `pz.png`, `nz.png`.
- **Audio**: Audio files stored in `audio/` (`.mp3`). Must require user interaction before triggering `AudioContext.resume()`.
- **Video**: Video textures stored in `public/media/` (`.mp4`) with `muted = true` and `playsInline = true` for mobile compatibility.

### 3. ES Modules & Importmap
- Never import Three.js via external CDN URLs at runtime.
- Always use the local importmap defined in `index.html`:
  ```json
  {
    "imports": {
      "three": "./libs/three.module.js",
      "three/addons/": "./libs/"
    }
  }
  ```

---

## 🎮 First-Person Camera Specification

- **Camera Location**: Centered at origin `(0, 0, 0)`.
- **Yaw**: Horizontal rotation (look left/right via `ArrowLeft`/`ArrowRight` or `A`/`D` or mouse horizontal drag).
- **Pitch**: Vertical rotation (look up/down via `ArrowUp`/`ArrowDown` or `W`/`S` or mouse vertical drag).
- **Pitch Limit**: Clamped strictly between `-83°` (`-1.45 rad`) and `+83°` (`+1.45 rad`) to prevent camera flipping.
