<template>
    <div ref="canvasContainer" class="model-container"></div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  // Hier könntest du Three.js importieren und einen einfachen 3D-Body laden
  // Beispiel-Code ist sehr vereinfacht
  
  const canvasContainer = ref(null)
  
  onMounted(() => {
    // Hier deinen Three.js Code einfügen, um ein 3D Modell zu rendern
    // Zum Beispiel einen weißen Dummy-Körper
    // Und dann Punkte (Markers) darauf positionieren.
  })
  </script>
  
  <style scoped>
  .model-container {
    width: 100%;
    height: 500px;
    background: #ccc;
  }
  </style>