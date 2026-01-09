<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import DataScreen from './components/DataScreen.vue'

const handleResize = () => {
  const scale = Math.min(
    window.innerWidth / 1920,
    window.innerHeight / 1080
  )
  const screen = document.querySelector('.screen-container')
  if (screen) {
    screen.style.transform = `scale(${scale})`
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
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
  overflow: hidden;
  background: #0a0e27;
}

.app-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.screen-container {
  width: 1920px;
  height: 1080px;
  transform-origin: center center;
  transition: transform 0.3s ease;
}
</style>
