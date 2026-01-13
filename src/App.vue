<script setup>
import DataScreen from './components/DataScreen.vue'
</script>

<template>
  <div class="app-wrapper">
    <div class="screen-container">
      <DataScreen />
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #0a0e27;
  overflow-y: hidden;
}

.app-wrapper {
  width: 100vw;
  height: 100vh;
  min-width: 1200px;
  overflow-x: auto;
  overflow-y: hidden;
}

.screen-container {
  width: 100vw;
  height: 100vh;
  min-width: 1200px;
}
</style>
