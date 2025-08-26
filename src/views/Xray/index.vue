<template>
  <div class="page-x-ray" @mousemove="handleMouseMove">
    <div class="bg-blur"></div>

    <div
      class="fg-sharp"
      :style="{
        '--x': `${clientX}px`,
        '--y': `${clientY}px`,
      }"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const clientX = ref(0);
  const clientY = ref(0);

  function handleMouseMove(e: MouseEvent) {
    clientX.value = e.clientX;
    clientY.value = e.clientY;
  }
</script>

<style scoped>
  .page-x-ray {
    width: 100%;
    height: 100%;
  }
  .bg-blur {
    width: 100%;
    height: 100%;
    background-image: url('@/assets/Xray/page.png');
    filter: blur(5px);
  }
  .fg-sharp {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/Xray/page.png');
    clip-path: circle(100px at var(--x) var(--y));
  }
</style>
