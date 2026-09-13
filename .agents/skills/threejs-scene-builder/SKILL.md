---
name: threejs-scene-builder
description: Skill for building, managing, and optimizing Three.js 3D scenes, materials, particle effects, and camera systems in BubbleKluv.
---

# Three.js Scene Builder Skill

## Overview
This skill provides guidelines and patterns for creating and maintaining 3D elements in the BubbleKluv project.

## Key Capabilities

### 1. Glass Physical Material Construction
When creating physical glass bubbles or reflective objects:
```javascript
const glassMaterial = new THREE.MeshPhysicalMaterial({
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
```

### 2. Particle Explosions (Burst Effect)
When popping 3D objects, instantiate a temporary `THREE.Group` with individual particle meshes, velocity vectors, and fading opacity in `requestAnimationFrame`.

### 3. Cubemap Skybox Switching
Load cubemaps using `THREE.CubeTextureLoader`:
```javascript
const textureCube = loader.load([
  'textures/skybox/bblklv-clubentrance-01/px.png',
  'textures/skybox/bblklv-clubentrance-01/nx.png',
  'textures/skybox/bblklv-clubentrance-01/py.png',
  'textures/skybox/bblklv-clubentrance-01/ny.png',
  'textures/skybox/bblklv-clubentrance-01/pz.png',
  'textures/skybox/bblklv-clubentrance-01/nz.png'
]);
scene.background = textureCube;
```
