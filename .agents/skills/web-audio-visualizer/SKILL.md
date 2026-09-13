---
name: web-audio-visualizer
description: Skill for integrating Web Audio API, real-time frequency data visualization, beat detection, and synthesized sound effects in BubbleKluv.
---

# Web Audio Visualizer Skill

## Overview
Guidelines for handling Web Audio API nodes, audio spectrum visualization, and real-time audio-reactive 3D animations in BubbleKluv.

## Key Principles

### 1. Browser Autoplay Compliance
Always wrap `AudioContext` initialization inside an explicit user interaction event handler (e.g., clicking `#startBtn` on the splash screen):
```javascript
let audioCtx = null;
function initAudioContext() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
```

### 2. Frequency Analysis & Beat Pulse
Extract low-frequency (bass) data to trigger scale pulsation:
```javascript
analyser.getByteFrequencyData(dataArray);
let bassSum = 0;
for (let i = 0; i < 8; i++) {
  bassSum += dataArray[i];
}
const bassPulse = (bassSum / 8) / 255; // Normalized 0.0 to 1.0
```

### 3. Procedural Sound Synthesis
Synthesize popping sounds dynamically without external `.wav` assets:
```javascript
function playPopSound() {
  if (!audioCtx) return;
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
}
```
