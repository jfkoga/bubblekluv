# BUBBLEKLUV - AI Development Specifications & Guidelines

Welcome to **BubbleKluv**, an interactive 3D Multiverse Visual Album & WebGL experience built with Three.js, Web Audio API frequency analysis, Blockade Labs 360° AI cubemaps, 1st-person camera navigation, and neon glassmorphism UI.

---

## 🎯 Architectural Overview & Multiverse Specification

This project follows a lightweight, dependency-free ES module architecture built on native Web Standards:

- **Core Engine**: Three.js (`libs/three.module.js`) loaded natively via `<script type="importmap">`.
- **Multiverse Engine**: Extensible track array (`tracksConfig`) linking each user song to a Blockade Labs 360° skybox environment, lighting palette, and 3D portal gateways.
- **UI & HUD**: HTML5 Semantic Markup with CSS3 Glassmorphism (`styles.css`).
- **Audio & Beat Analysis**: Web Audio API (`AudioContext`, `AnalyserNode`, `GainNode` crossfading) and synthesized sound effects using `OscillatorNode`.
- **Camera System**: First-Person Shooter / Exploration Camera (Yaw & Pitch look, keyboard + mouse drag look).

---

## 📐 Multiverse Data Schema

Every track/world in BubbleKluv adheres to the following specification:

```javascript
{
  id: string,              // Unique identifier (e.g. 'club-entrance')
  title: string,           // Track title (e.g. 'Wait For Me')
  artist: string,          // Artist name (e.g. 'BubbleKluv')
  audioSrc: string,        // Path to audio asset (e.g. 'audio/bubblekluv-waitforme.mp3')
  skyboxFolder: string,    // Path to 6-face cubemap folder containing px, nx, py, ny, pz, nz
  worldName: string,       // Name of Blockade Labs environment (e.g. 'Neon Club Entrance')
  primaryColor: string,    // Primary CSS accent color (#00f3ff)
  secondaryColor: string,  // Secondary CSS accent color (#ff00aa)
  lightPrimary: number,    // Hex color for primary 3D directional light (0x00f3ff)
  lightSecondary: number,  // Hex color for secondary 3D directional light (0xff00aa)
  bubbleCount: number      // Number of interactive glass bubbles in this world
}
```

---

## 🔄 AI Development Methodology & Workflow

1. **Incremental Feature Commits**: Make atomic commits for UI, 3D Engine, and Audio changes.
2. **Zero CDN Dependency**: Never inject CDN script tags at runtime. All imports must resolve via the importmap defined in `index.html`.
3. **Syntax & Error Validation**: Run `node --check app.js` before committing any JavaScript changes.
4. **VRAM Memory Lifecycle**: Always dispose existing textures, geometries, and materials when destroying or swapping 3D objects/skyboxes:
   ```javascript
   if (scene.background && scene.background.dispose) {
     scene.background.dispose();
   }
   ```
5. **Performance Budgets**:
   - FPS Target: 60 FPS.
   - Max Pixel Ratio: `Math.min(window.devicePixelRatio, 2)`.
   - Max Active 3D Meshes per World: 100.
