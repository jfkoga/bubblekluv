---
name: multiverse-world-engine
description: Skill for registering new songs and Blockade Labs cubemaps, configuring theme lighting palettes, and handling warp portal transitions in BubbleKluv.
---

# Multiverse World Engine Skill

## Overview
This skill provides patterns for managing multi-world transitions, audio crossfading, Blockade Labs skybox registration, and 3D portal gateways in BubbleKluv.

## Key Procedures

### 1. Registering a New Track & World
Add new entries to `tracksConfig` in `app.js`:
```javascript
{
  id: 'cyberpunk-city',
  title: 'Neon Skyline',
  artist: 'BubbleKluv',
  audioSrc: 'audio/neon-skyline.mp3',
  skyboxFolder: 'textures/skybox/bblklv-city-01/',
  worldName: 'Cyber Skyline 360',
  primaryColor: '#a855f7',
  secondaryColor: '#3b82f6',
  lightPrimary: 0xa855f7,
  lightSecondary: 0x3b82f6,
  bubbleCount: 80
}
```

### 2. Camera Warp Portal Transition
When switching worlds, animate the camera FOV to create a hyperspace warp effect before swapping the skybox:
```javascript
function triggerWarpTransition(targetTrackIndex) {
  let warpProgress = 0;
  const startFov = camera.fov;
  
  function animateWarp() {
    warpProgress += 0.05;
    camera.fov = startFov + Math.sin(warpProgress * Math.PI) * 45;
    camera.updateProjectionMatrix();

    if (warpProgress >= 0.5 && !swapped) {
      loadWorld(targetTrackIndex);
      swapped = true;
    }

    if (warpProgress < 1.0) {
      requestAnimationFrame(animateWarp);
    } else {
      camera.fov = startFov;
      camera.updateProjectionMatrix();
    }
  }
  animateWarp();
}
```
